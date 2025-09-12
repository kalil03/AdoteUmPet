require('dotenv').config(); //carrega as var. de amb. do .env

module.exports = {
  development: { 
    use_env_variable: 'DATABASE_URL',//aponsta para url
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  test: { 
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  production: { 
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
