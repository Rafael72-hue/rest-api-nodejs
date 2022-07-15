const express = require('express');

const usuarioController = require("../controllers/login.controller");
const router = express.Router();
router.post('/cadastro', usuarioController.registerUser)

router.post('/login', usuarioController.loginUser)

module.exports = router;