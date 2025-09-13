const { sequelize } = require('../src/models');
require('dotenv').config({ path: '.env.test' });

//configuração do banco de dados de teste
beforeAll(async () => {
  try {
    //testar conexão com o bd
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados de teste estabelecida com sucesso.');
    
    //sincronizar o banco de dados
    await sequelize.sync({ force: true });
    console.log('Banco de dados de teste sincronizado.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados de teste:', error);
    throw error;
  }
});

//limpar apos todos os testes
afterAll(async () => {
  try {
    //fechar a conexão 
    await sequelize.close();
    console.log('Conexão com o banco de dados de teste fechada.');
  } catch (error) {
    console.error('Erro ao fechar a conexão com o banco de dados de teste:', error);
  }
});

//limpar apos cada teste
afterEach(async () => {
  try {
    //limpar todos tabelas
    const models = Object.keys(sequelize.models);
    for (const modelName of models) {
      await sequelize.models[modelName].destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true
      });
    }
  } catch (error) {
    console.error('Erro ao limpar os dados do banco de dados de teste:', error);
  }
});
