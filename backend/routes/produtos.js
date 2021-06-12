const express = require ('express');
const router = express.Router();
const login = require('../middleware/login');

// CRIANDO CAMINHO PARA A CONTROLLER - PRODUTOS
const ProdutosController = require('../controllers/produtos-controller');

// CRIANDO CAMINHO PARA A UPLOADS - PRODUTOS
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, process.env.PATH_UPLOAD_IMG_PRODUTO);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage : storage});

 // ROTA GET(BUSCAR)
router.post('/',  login.obrigatorio, ProdutosController.listarProdutos);
     
 //ROTA POST(INSERIR)
router.post('/cadastro', login.obrigatorio, upload.single('imgRegister'), ProdutosController.cadastrarProduto);

 //ROTA PATCH(ALTERAR)
router.patch('/', login.obrigatorio, upload.single('imgRegister'), ProdutosController.editarProduto);

 //ROTA DELETE(DELETAR)
router.delete('/', login.obrigatorio, ProdutosController.deletProdutos);

module.exports = router;