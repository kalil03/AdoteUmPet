const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => { //verifica se api esta no ar
  res.status(200).json({ status: 'ok' });
});

router.get('/', (req, res) => { //retorna informacoes da api
  res.json({
    message: 'AdoteUmPet API',
    version: '1.0.0',
    endpoints: { //outras rotas
      health: '/health'
    }
  });
});

module.exports = router;
