const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); //protege configurando cabeçalhos http
app.use(cors({ //habilita o cors ate a origem no .env
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(morgan('combined')); //util para debug
app.use(express.json()); //habilita json no req.body
app.use(express.urlencoded({ extended: true })); //habilita parsing de dados

app.get('/health', (req, res) => { //verifica se api ta no ar
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => { 
  res.json({
    message: 'Bem-vindo à API AdoteUmPet',
    version: '1.0.0',
    endpoints: {
      health: '/health'
    }
  });
});
//tratamento erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

app.use('*', (req, res) => { // * captura requisicoes nao tratadas
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `Não foi possível processar ${req.method} em ${req.originalUrl}`
  });
});

//iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor da API AdoteUmPet rodando na porta ${PORT}`);
  console.log(`Verificação de saúde disponível em http://localhost:${PORT}/health`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
