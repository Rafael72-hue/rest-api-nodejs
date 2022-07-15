const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('../mysql').pool;
const usuarioController = require("../controllers/login.controller");
const router = express.Router();
router.post('/cadastro', usuarioController.registerUser)

router.post('/login', usuarioController.loginUser)

module.exports = router;