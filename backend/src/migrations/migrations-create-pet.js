'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { //up executa a migracao
    await queryInterface.createTable('pets', { //cria a tabela pets
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'), //gera um id uuid
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      species: { 
        type: Sequelize.ENUM('dog', 'cat'),
        allowNull: false
      },
      breed: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age_years: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      shelter_city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shelter_cep: {
        type: Sequelize.STRING(9),
        allowNull: false
      },
      shelter_street: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      shelter_number: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      shelter_neighborhood: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      shelter_state: {
        type: Sequelize.STRING(2),
        allowNull: false
      },
      status: { 
        type: Sequelize.ENUM('available', 'adopted'),
        defaultValue: 'available',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) { //down desfaz a migracao
    await queryInterface.dropTable('pets'); //deleta a tabela pets
  }
};
