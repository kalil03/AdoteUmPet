const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');


router.get('/', petController.getPets); //lista pagina, filtros ...

router.post('/', petController.createPet); //cria um novo pet

module.exports = router;
