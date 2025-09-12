const { Sequelize } = require('sequelize'); 
const config = require('../config/database');
require('dotenv').config();
//cria uma instancia do sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false, //logs do sql no desenvolvimento
  pool: { 
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: { 
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

const Pet = require('./pet'); //importa o modelo pet

const PetModel = Pet(sequelize); //cria uma instancia do modelo pet

const db = { //exporta o db
  sequelize,
  Sequelize,
  Pet: PetModel,
};

module.exports = db;
