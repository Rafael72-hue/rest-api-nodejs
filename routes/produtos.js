const express = require('express');
const multer = require('multer');
const router = express.Router();
const Login = require('../middleware/login');
const produtosController = require("../controllers/produtos.controller");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})
const upload = multer({ storage: storage })

// RETORNA TODOS OS PRODUTOS
router.get('/', produtosController.getAllProducts);

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', produtosController.getOneProduct);

// ADICIONA UM PRODUTO
router.post('/', upload.single('produto_imagem'), Login.obrigatorio, produtosController.postProduct);

// ATUALIZA UM PRODUTO
router.patch('/', Login.obrigatorio, produtosController.updateOneProduct);

// DELETA UM PRODUTO
router.delete('/:id_produto', Login.obrigatorio, produtosController.deleteOneProduct);


module.exports = router;