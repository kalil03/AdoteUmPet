const express = require('express');
const router = express.Router();
const breedController = require('../controllers/breedController');

//lista raças de cães ou gatos
router.get('/:species', breedController.getBreeds);

module.exports = router;


