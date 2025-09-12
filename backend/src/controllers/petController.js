const { Pet } = require('../models');

const createPet = async (req, res) => {
  try {
    const { name, species, breed, age_years, shelter_city, shelter_lat, shelter_lng, status } = req.body;

    // Validation
    const errors = [];

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Nome é obrigatório e deve ser uma string não vazia');
    }

    if (!species || !['dog', 'cat'].includes(species)) {
      errors.push('Espécie é obrigatória e deve ser "dog" ou "cat"');
    }

    if (!breed || typeof breed !== 'string' || breed.trim().length === 0) {
      errors.push('Raça é obrigatória e deve ser uma string não vazia');
    }

    if (age_years === undefined || age_years === null || typeof age_years !== 'number' || age_years < 0) {
      errors.push('Idade é obrigatória e deve ser um número maior ou igual a 0');
    }

    if (!shelter_city || typeof shelter_city !== 'string' || shelter_city.trim().length === 0) {
      errors.push('Cidade do abrigo é obrigatória e deve ser uma string não vazia');
    }

    if (shelter_lat === undefined || shelter_lat === null || typeof shelter_lat !== 'number' || shelter_lat < -90 || shelter_lat > 90) {
      errors.push('Latitude é obrigatória e deve ser um número entre -90 e 90');
    }

    if (shelter_lng === undefined || shelter_lng === null || typeof shelter_lng !== 'number' || shelter_lng < -180 || shelter_lng > 180) {
      errors.push('Longitude é obrigatória e deve ser um número entre -180 e 180');
    }

    // Validate optional status field
    if (status && !['available', 'adopted'].includes(status)) {
      errors.push('Status deve ser "available" ou "adopted"');
    }

    // If there are validation errors, return 400
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os seguintes campos contêm erros:',
        details: errors
      });
    }

    // Create pet data object
    const petData = {
      name: name.trim(),
      species,
      breed: breed.trim(),
      age_years,
      shelter_city: shelter_city.trim(),
      shelter_lat,
      shelter_lng,
      status: status || 'available'
    };

    // Create pet using Sequelize
    const newPet = await Pet.create(petData);

    // Return 201 with created pet
    res.status(201).json({
      message: 'Pet criado com sucesso',
      pet: newPet
    });

  } catch (error) {
    console.error('Erro ao criar pet:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Erro de validação',
        message: 'Os dados fornecidos não atendem aos critérios de validação',
        details: validationErrors
      });
    }

    // Handle other errors
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o pet'
    });
  }
};

module.exports = {
  createPet
};
