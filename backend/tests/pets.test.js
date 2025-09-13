const request = require('supertest');
const app = require('../src/app');
const { Pet } = require('../src/models');

describe('POST /pets', () => {
  describe('Dados Válidos', () => {
    test('deve criar um novo pet com dados válidos', async () => {
      const validPetData = {
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age_years: 3,
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP',
        status: 'available'
      };

      const response = await request(app)
        .post('/pets')
        .send(validPetData)
        .expect(201);

      expect(response.body.pet).toHaveProperty('id');
      expect(response.body.pet.name).toBe(validPetData.name);
      expect(response.body.pet.species).toBe(validPetData.species);
      expect(response.body.pet.breed).toBe(validPetData.breed);
      expect(response.body.pet.age_years).toBe(validPetData.age_years);
      expect(response.body.pet.shelter_city).toBe(validPetData.shelter_city);
      expect(response.body.pet.shelter_cep).toBe(validPetData.shelter_cep);
      expect(response.body.pet.shelter_street).toBe(validPetData.shelter_street);
      expect(response.body.pet.shelter_number).toBe(validPetData.shelter_number);
      expect(response.body.pet.shelter_neighborhood).toBe(validPetData.shelter_neighborhood);
      expect(response.body.pet.shelter_state).toBe(validPetData.shelter_state);
      expect(response.body.pet.status).toBe(validPetData.status);
      expect(response.body.pet).toHaveProperty('created_at');
      expect(response.body.pet).toHaveProperty('updated_at');

     //Verificar se o pet foi salvo no banco de dados
      const savedPet = await Pet.findByPk(response.body.pet.id);
      expect(savedPet).toBeTruthy();
      expect(savedPet.name).toBe(validPetData.name);
    });

    test('deve criar um pet com status padrão quando não for fornecido', async () => {
      const petDataWithoutStatus = {
        name: 'Luna',
        species: 'cat',
        breed: 'Persian',
        age_years: 2,
        shelter_city: 'Rio de Janeiro',
        shelter_cep: '20040-020',
        shelter_street: 'Avenida Atlântica',
        shelter_number: '456',
        shelter_neighborhood: 'Copacabana',
        shelter_state: 'RJ'
      };

      const response = await request(app)
        .post('/pets')
        .send(petDataWithoutStatus)
        .expect(201);

      expect(response.body.pet.status).toBe('available');
    });

    test('deve criar um pet com espécie de gato', async () => {
      const catData = {
        name: 'Whiskers',
        species: 'cat',
        breed: 'Siamese',
        age_years: 1,
        shelter_city: 'Belo Horizonte',
        shelter_cep: '30112-000',
        shelter_street: 'Rua da Bahia',
        shelter_number: '789',
        shelter_neighborhood: 'Centro',
        shelter_state: 'MG'
      };

      const response = await request(app)
        .post('/pets')
        .send(catData)
        .expect(201);

      expect(response.body.pet.species).toBe('cat');
      expect(response.body.pet.breed).toBe('Siamese');
    });
  });

  describe('Dados Inválidos', () => {
    test('deve retornar 400 para campos obrigatórios ausentes', async () => {
      const incompleteData = {
        name: 'Incomplete Pet',
        species: 'dog'
      };

      const response = await request(app)
        .post('/pets')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('deve retornar 400 para espécie inválida', async () => {
      const invalidSpeciesData = {
        name: 'Invalid Pet',
        species: 'bird', //especie invalida
        breed: 'Canary',
        age_years: 1,
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP'
      };

      const response = await request(app)
        .post('/pets')
        .send(invalidSpeciesData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('deve retornar 400 para CEP inválido', async () => {
      const invalidCepData = {
        name: 'Invalid CEP Pet',
        species: 'dog',
        breed: 'Labrador',
        age_years: 2,
        shelter_city: 'São Paulo',
        shelter_cep: '123456', //formato invalido
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP'
      };

      const response = await request(app)
        .post('/pets')
        .send(invalidCepData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('deve retornar 400 para estado inválido', async () => {
      const invalidStateData = {
        name: 'Invalid State Pet',
        species: 'cat',
        breed: 'Persian',
        age_years: 3,
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SAO' //formato invalido
      };

      const response = await request(app)
        .post('/pets')
        .send(invalidStateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('deve retornar 400 para idade negativa', async () => {
      const negativeAgeData = {
        name: 'Negative Age Pet',
        species: 'dog',
        breed: 'Poodle',
        age_years: -1, 
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP'
      };

      const response = await request(app)
        .post('/pets')
        .send(negativeAgeData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('deve retornar 400 para status invalido', async () => {
      const invalidStatusData = {
        name: 'Invalid Status Pet',
        species: 'cat',
        breed: 'Maine Coon',
        age_years: 4,
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP',
        status: 'invalid_status' 
      };

      const response = await request(app)
        .post('/pets')
        .send(invalidStatusData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('GET /pets', () => {
  beforeEach(async () => {
   //criar dados de teste
    await Pet.bulkCreate([
      {
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age_years: 3,
        shelter_city: 'São Paulo',
        shelter_cep: '01234-567',
        shelter_street: 'Rua das Flores',
        shelter_number: '123',
        shelter_neighborhood: 'Centro',
        shelter_state: 'SP',
        status: 'available'
      },
      {
        name: 'Luna',
        species: 'cat',
        breed: 'Persian',
        age_years: 2,
        shelter_city: 'Rio de Janeiro',
        shelter_cep: '20040-020',
        shelter_street: 'Avenida Atlântica',
        shelter_number: '456',
        shelter_neighborhood: 'Copacabana',
        shelter_state: 'RJ',
        status: 'adopted'
      },
      {
        name: 'Max',
        species: 'dog',
        breed: 'Labrador',
        age_years: 5,
        shelter_city: 'São Paulo',
        shelter_cep: '04567-890',
        shelter_street: 'Rua Augusta',
        shelter_number: '789',
        shelter_neighborhood: 'Vila Madalena',
        shelter_state: 'SP',
        status: 'available'
      },
      {
        name: 'Whiskers',
        species: 'cat',
        breed: 'Siamese',
        age_years: 1,
        shelter_city: 'Belo Horizonte',
        shelter_cep: '30112-000',
        shelter_street: 'Rua da Bahia',
        shelter_number: '101',
        shelter_neighborhood: 'Centro',
        shelter_state: 'MG',
        status: 'available'
      }
    ]);
  });

  describe('Listagem Básica', () => {
    test('deve retornar todos os pets com paginação padrão', async () => {
      const response = await request(app)
        .get('/pets')
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('perPage');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(10);
      expect(response.body.data.length).toBe(4);
    });
  });

  describe('Filtros', () => {
    test('deve filtrar pets por espécie', async () => {
      const response = await request(app)
        .get('/pets?species=dog')
        .expect(200);

      expect(response.body.total).toBe(2);
      response.body.data.forEach(pet => {
        expect(pet.species).toBe('dog');
      });
    });

    test('deve filtrar pets por nome', async () => {
      const response = await request(app)
        .get('/pets?name=Lu')
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].name).toBe('Luna');
    });

    test('deve filtrar pets por raça', async () => {
      const response = await request(app)
        .get('/pets?breed=Persian')
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].breed).toBe('Persian');
    });

    test('deve filtrar pets por cidade', async () => {
      const response = await request(app)
        .get('/pets?shelter_city=São Paulo')
        .expect(200);

      expect(response.body.total).toBe(2);
      response.body.data.forEach(pet => {
        expect(pet.shelter_city).toBe('São Paulo');
      });
    });

    test('deve filtrar pets por estado', async () => {
      const response = await request(app)
        .get('/pets?shelter_state=SP')
        .expect(200);

      expect(response.body.total).toBe(2);
      response.body.data.forEach(pet => {
        expect(pet.shelter_state).toBe('SP');
      });
    });

    test('deve filtrar pets por bairro', async () => {
      const response = await request(app)
        .get('/pets?shelter_neighborhood=Centro')
        .expect(200);

      expect(response.body.total).toBe(2);
      response.body.data.forEach(pet => {
        expect(pet.shelter_neighborhood).toBe('Centro');
      });
    });

    test('deve filtrar pets por status', async () => {
      const response = await request(app)
        .get('/pets?status=adopted')
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].status).toBe('adopted');
      expect(response.body.data[0].name).toBe('Luna');
    });

    test('deve combinar filtros', async () => {
      const response = await request(app)
        .get('/pets?species=dog&shelter_state=SP')
        .expect(200);

      expect(response.body.total).toBe(2);
      response.body.data.forEach(pet => {
        expect(pet.species).toBe('dog');
        expect(pet.shelter_state).toBe('SP');
      });
    });

    test('deve retornar resultado vazio para filtros não correspondentes', async () => {
      const response = await request(app)
        .get('/pets?name=NonExistentPet')
        .expect(200);

      expect(response.body.total).toBe(0);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('Paginação', () => {
    test('deve paginar resultados corretamente', async () => {
      const response = await request(app)
        .get('/pets?perPage=2&page=1')
        .expect(200);

      expect(response.body.total).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(2);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.data.length).toBe(2);
    });

    test('deve retornar segunda página corretamente', async () => {
      const response = await request(app)
        .get('/pets?perPage=2&page=2')
        .expect(200);

      expect(response.body.total).toBe(4);
      expect(response.body.page).toBe(2);
      expect(response.body.perPage).toBe(2);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.data.length).toBe(2);
    });

    test('deve lidar com página além de dados disponíveis', async () => {
      const response = await request(app)
        .get('/pets?perPage=10&page=5')
        .expect(200);

      expect(response.body.total).toBe(4);
      expect(response.body.page).toBe(5);
      expect(response.body.data.length).toBe(0);
    });

    test('deve respeitar limite de perPage', async () => {
      const response = await request(app)
        .get('/pets?perPage=1')
        .expect(200);

      expect(response.body.perPage).toBe(1);
      expect(response.body.data.length).toBe(1);
      expect(response.body.totalPages).toBe(4);
    });

    test('deve restringir limite máximo de perPage', async () => {
      const response = await request(app)
        .get('/pets?perPage=200')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Ordenação', () => {
    test('deve ordenar por nome em ordem crescente', async () => {
      const response = await request(app)
        .get('/pets?sortBy=name&order=asc')
        .expect(200);

      const names = response.body.data.map(pet => pet.name);
      expect(names).toEqual(['Buddy', 'Luna', 'Max', 'Whiskers']);
    });

    test('deve ordenar por nome em ordem decrescente', async () => {
      const response = await request(app)
        .get('/pets?sortBy=name&order=desc')
        .expect(200);

      const names = response.body.data.map(pet => pet.name);
      expect(names).toEqual(['Whiskers', 'Max', 'Luna', 'Buddy']);
    });

    test('deve ordenar por idade em ordem crescente', async () => {
      const response = await request(app)
        .get('/pets?sortBy=age_years&order=asc')
        .expect(200);

      const ages = response.body.data.map(pet => pet.age_years);
      expect(ages).toEqual([1, 2, 3, 5]);
    });

    test('deve ordenar por espécie em ordem crescente', async () => {
      const response = await request(app)
        .get('/pets?sortBy=species&order=asc')
        .expect(200);

      const species = response.body.data.map(pet => pet.species);
      expect(species).toEqual(['dog', 'dog', 'cat', 'cat']);
    });
  });

  describe('Combinar filtros, paginação e ordenação', () => {
    test('deve combinar filtros, paginação e ordenação', async () => {
      const response = await request(app)
        .get('/pets?species=dog&sortBy=name&order=asc&page=1&perPage=1')
        .expect(200);

      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(1);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Buddy'); //primeiro dog alfabeticamente
      expect(response.body.data[0].species).toBe('dog');
    });
  });
});
