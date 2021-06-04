const express = require('express');
const router = express.Router();

const userController = require('../controllers/controller.user');

router.post('/register', userController.signup);

router.post('/login', userController.login);

module.exports = router;