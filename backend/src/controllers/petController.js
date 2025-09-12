const { Pet } = require('../models');
const { Op } = require('sequelize');

const getPets = async (req, res) => {
  try {
    // extrai parametros de query
    const {
      name,
      species,
      breed,
      shelter_city,
      status,
      page = 1,
      perPage = 10,
      sortBy = 'created_at',
      order = 'desc'
    } = req.query;
    // validacao de paginacao
    const pageNum = parseInt(page);
    const perPageNum = parseInt(perPage);
    if (pageNum < 1) {
      return res.status(400).json({
        error: 'Página inválida',
        message: 'A página deve ser um número maior que 0'
      });
    }
    if (perPageNum < 1 || perPageNum > 100) {
      return res.status(400).json({
        error: 'PerPage inválido',
        message: 'PerPage deve ser um número entre 1 e 100'
      });
    }
    // validacao de ordenacao
    const allowedSortFields = ['name', 'species', 'breed', 'age_years', 'shelter_city', 'created_at', 'updated_at'];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: 'Campo de ordenação inválido',
        message: `sortBy deve ser um dos seguintes: ${allowedSortFields.join(', ')}`
      });
    }
    if (!['asc', 'desc'].includes(order.toLowerCase())) {
      return res.status(400).json({
        error: 'Ordem inválida',
        message: 'order deve ser "asc" ou "desc"'
      });
    }

    const whereClause = {}; // construi filtros where

    if (name) {
      whereClause.name = {
        [Op.iLike]: `%${name}%`
      };
    }
    if (species) {
      whereClause.species = species;
    }
    if (breed) {
      whereClause.breed = {
        [Op.iLike]: `%${breed}%`
      };
    }
    if (shelter_city) {
      whereClause.shelter_city = {
        [Op.iLike]: `%${shelter_city}%`
      };
    }
    if (status) {
      whereClause.status = status;
    }

    const offset = (pageNum - 1) * perPageNum; // calcula offset para paginacao

    const { count, rows } = await Pet.findAndCountAll({ // busca total de registros e dados paginados
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      limit: perPageNum,
      offset: offset
    });

    const totalPages = Math.ceil(count / perPageNum); // calcula total de paginas

    res.status(200).json({ // resposta com paginacao
      total: count,
      page: pageNum,
      perPage: perPageNum,
      totalPages: totalPages,
      data: rows
    });

  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os pets'
    });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, species, breed, age_years, shelter_city, shelter_lat, shelter_lng, status } = req.body;

    const errors = [];

    //validacao de campos obrigatorios
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
    //status opcional
    if (status && !['available', 'adopted'].includes(status)) {
      errors.push('Status deve ser "available" ou "adopted"');
    }
    //se tiver erros manda aviso
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os seguintes campos contêm erros:',
        details: errors
      });
    }
    //dados no animal
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
    //criar pet usand sequelize
    const newPet = await Pet.create(petData);

    res.status(201).json({
      message: 'Pet criado com sucesso',
      pet: newPet
    });

  } catch (error) {
    console.error('Erro ao criar pet:', error);
    //erros de validacao
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Erro de validação',
        message: 'Os dados fornecidos não atendem aos critérios de validação',
        details: validationErrors
      });
    }

    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o pet'
    });
  }
};

module.exports = {
  getPets,
  createPet
};
