const express = require('express');
const router = express.Router();
const Login = require('../middleware/login');

const pedidosController = require("../controllers/pedidos.controller")
// RETORNA TODOS OS PEDIDO
router.get('/', pedidosController.getOrders);

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedidos', pedidosController.getOneOrder);

// ADICIONA UM PEDIDO
router.post('/', Login.obrigatorio, pedidosController.postOrder);

// DELETA UM PEDIDO
router.delete('/:id_pedidos', Login.obrigatorio, pedidosController.deleteOrder);


module.exports = router;