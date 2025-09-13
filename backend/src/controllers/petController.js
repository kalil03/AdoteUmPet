const { Pet } = require('../models');
const { Op } = require('sequelize');

const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    //valida se o ID foi fornecido
    if (!id) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'ID do pet é obrigatório'
      });
    }
    //usca pet por id
    const pet = await Pet.findByPk(id);
    //se não encontrou, retorna 404
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        message: 'Pet não encontrado com o ID fornecido'
      });
    }
    //retorna o pet encontrado
    res.status(200).json(pet);

  } catch (error) {
    console.error('Erro ao buscar pet por ID:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o pet'
    });
  }
};

const getPets = async (req, res) => {
  try {
    // extrai parametros de query
    const {
      name,
      species,
      breed,
      shelter_city,
      shelter_state,
      shelter_neighborhood,
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
    if (shelter_state) {
      whereClause.shelter_state = {
        [Op.iLike]: `%${shelter_state}%`
      };
    }
    if (shelter_neighborhood) {
      whereClause.shelter_neighborhood = {
        [Op.iLike]: `%${shelter_neighborhood}%`
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
    const { 
      name, 
      species, 
      breed, 
      age_years, 
      shelter_city, 
      shelter_cep, 
      shelter_street, 
      shelter_number, 
      shelter_neighborhood, 
      shelter_state, 
      status 
    } = req.body;

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

    if (!shelter_cep || typeof shelter_cep !== 'string' || shelter_cep.trim().length === 0) {
      errors.push('CEP do abrigo é obrigatório e deve ser uma string não vazia');
    }

    if (!shelter_street || typeof shelter_street !== 'string' || shelter_street.trim().length === 0) {
      errors.push('Rua do abrigo é obrigatória e deve ser uma string não vazia');
    }

    if (!shelter_number || typeof shelter_number !== 'string' || shelter_number.trim().length === 0) {
      errors.push('Número do abrigo é obrigatório e deve ser uma string não vazia');
    }

    if (!shelter_neighborhood || typeof shelter_neighborhood !== 'string' || shelter_neighborhood.trim().length === 0) {
      errors.push('Bairro do abrigo é obrigatório e deve ser uma string não vazia');
    }

    if (!shelter_state || typeof shelter_state !== 'string' || shelter_state.trim().length !== 2) {
      errors.push('Estado do abrigo é obrigatório e deve ter exatamente 2 caracteres');
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
      shelter_cep: shelter_cep.trim(),
      shelter_street: shelter_street.trim(),
      shelter_number: shelter_number.trim(),
      shelter_neighborhood: shelter_neighborhood.trim(),
      shelter_state: shelter_state.trim().toUpperCase(),
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

const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      species, 
      breed, 
      age_years, 
      shelter_city, 
      shelter_cep, 
      shelter_street, 
      shelter_number, 
      shelter_neighborhood, 
      shelter_state, 
      status 
    } = req.body;

    // valida se o ID foi fornecido
    if (!id) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'ID do pet é obrigatório'
      });
    }

    // busca o pet existente
    const existingPet = await Pet.findByPk(id);
    if (!existingPet) {
      return res.status(404).json({
        error: 'Pet not found',
        message: 'Pet não encontrado com o ID fornecido'
      });
    }

    const errors = [];

    // validacao de campos se fornecidos
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Nome deve ser uma string não vazia');
      }
    }

    if (species !== undefined) {
      if (!['dog', 'cat'].includes(species)) {
        errors.push('Espécie deve ser "dog" ou "cat"');
      }
    }

    if (breed !== undefined) {
      if (!breed || typeof breed !== 'string' || breed.trim().length === 0) {
        errors.push('Raça deve ser uma string não vazia');
      }
    }

    if (age_years !== undefined) {
      if (typeof age_years !== 'number' || age_years < 0) {
        errors.push('Idade deve ser um número maior ou igual a 0');
      }
    }

    if (shelter_city !== undefined) {
      if (!shelter_city || typeof shelter_city !== 'string' || shelter_city.trim().length === 0) {
        errors.push('Cidade do abrigo deve ser uma string não vazia');
      }
    }

    if (shelter_cep !== undefined) {
      if (!shelter_cep || typeof shelter_cep !== 'string' || shelter_cep.trim().length === 0) {
        errors.push('CEP do abrigo deve ser uma string não vazia');
      }
    }

    if (shelter_street !== undefined) {
      if (!shelter_street || typeof shelter_street !== 'string' || shelter_street.trim().length === 0) {
        errors.push('Rua do abrigo deve ser uma string não vazia');
      }
    }

    if (shelter_number !== undefined) {
      if (!shelter_number || typeof shelter_number !== 'string' || shelter_number.trim().length === 0) {
        errors.push('Número do abrigo deve ser uma string não vazia');
      }
    }

    if (shelter_neighborhood !== undefined) {
      if (!shelter_neighborhood || typeof shelter_neighborhood !== 'string' || shelter_neighborhood.trim().length === 0) {
        errors.push('Bairro do abrigo deve ser uma string não vazia');
      }
    }

    if (shelter_state !== undefined) {
      if (!shelter_state || typeof shelter_state !== 'string' || shelter_state.trim().length !== 2) {
        errors.push('Estado do abrigo deve ter exatamente 2 caracteres');
      }
    }

    if (status !== undefined) {
      if (!['available', 'adopted'].includes(status)) {
        errors.push('Status deve ser "available" ou "adopted"');
      }
    }

    // se tiver erros, retorna
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os seguintes campos contêm erros:',
        details: errors
      });
    }

    // prepara dados para atualização (apenas campos fornecidos)
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (species !== undefined) updateData.species = species;
    if (breed !== undefined) updateData.breed = breed.trim();
    if (age_years !== undefined) updateData.age_years = age_years;
    if (shelter_city !== undefined) updateData.shelter_city = shelter_city.trim();
    if (shelter_cep !== undefined) updateData.shelter_cep = shelter_cep.trim();
    if (shelter_street !== undefined) updateData.shelter_street = shelter_street.trim();
    if (shelter_number !== undefined) updateData.shelter_number = shelter_number.trim();
    if (shelter_neighborhood !== undefined) updateData.shelter_neighborhood = shelter_neighborhood.trim();
    if (shelter_state !== undefined) updateData.shelter_state = shelter_state.trim().toUpperCase();
    if (status !== undefined) updateData.status = status;

    // atualiza o pet
    await existingPet.update(updateData);

    res.status(200).json({
      message: 'Pet atualizado com sucesso',
      pet: existingPet
    });

  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    
    // erros de validacao do sequelize
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
      message: 'Não foi possível atualizar o pet'
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID was provided
    if (!id) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'ID do pet é obrigatório'
      });
    }
    
    //encontre o primeiro pet
    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({
        error: 'Pet not found',
        message: 'Pet não encontrado com o ID fornecido'
      });
    }
    
    //deletar pet
    await Pet.destroy({
      where: { id }
    });
    
    res.status(200).json({
      message: 'Pet deletado com sucesso',
      pet: {
        id: pet.id,
        name: pet.name
      }
    });
    
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o pet'
    });
  }
};

module.exports = {
  getPetById,
  getPets,
  createPet,
  updatePet,
  deletePet
};
