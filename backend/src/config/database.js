require('dotenv').config();//carrega as var. de amb. do .env

module.exports = {
  development: { 
    use_env_variable: 'DATABASE_URL',//aponta para url
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, //logs do sql no desenvolvimento
    pool: { //pool de conexoes
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: { //define as tabelas
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  test: { 
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
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
  },
  production: { 
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
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
  }
};
