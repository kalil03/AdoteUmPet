const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');


router.get('/', petController.getPets); //lista pagina, filtros ...
router.get('/:id', petController.getPetById); //busca pet por ID

router.post('/', petController.createPet); //cria um novo pet
router.put('/:id', petController.updatePet); //atualiza um pet
router.delete('/:id', petController.deletePet); //deleta um pet

module.exports = router;
