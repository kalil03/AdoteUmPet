const app = require('./app');

const PORT = process.env.PORT || 3000;

//iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor da API AdoteUmPet rodando na porta ${PORT}`);
    console.log(`Verificação de saúde disponível em http://localhost:${PORT}/health`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
