const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

// POST /pets - Create a new pet
router.post('/', petController.createPet);

module.exports = router;
