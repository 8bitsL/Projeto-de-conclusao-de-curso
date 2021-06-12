const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

// CRIANDO CAMINHO PARA A CONTROLLER - USUÁRIOS
const UsuariosController = require('../controllers/usuiarios-controller');


// CRIANDO CAMINHO PARA A UPLOADS - PRODUTOS
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, process.env.PATH_UPLOAD_IMG_USUARIO);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const upload = multer({ storage : storage});

// ROTA DE CADASTRO
router.post('/cadastro', UsuariosController.Register);
router.post('/addNewCliente',login.obrigatorio,UsuariosController.AssociaClienteAoCadastrar);


// ROTA DE LOGIN
router.post('/login', UsuariosController.Login);


//ROTA PARA ALTERAR DADOS
router.post('/updateusuario', login.obrigatorio, upload.single('imgPerfilRegister'), UsuariosController.UpdateUsuario);
router.post('/updatecliente', login.obrigatorio,UsuariosController.AttCliente);
router.post('/associaCliente/', login.obrigatorio,UsuariosController.AssociaCliente);
router.post('/alterarSituacao', login.obrigatorio,UsuariosController.AlteraSituacaoCliente);


//ROTA PARA LISTAR CLIENTES
router.get('/clientes', login.obrigatorio, UsuariosController.Clientes);


//ROTA PARA LISTAR REVENDEDORES
router.get('/revendedores', login.obrigatorio, UsuariosController.Revendedores);


// ROTA PARA CARREGAR DADOS USUARIO
router.get('/', login.obrigatorio, UsuariosController.DadosUsuario);


//ROTA PARA DELETAR USUARIOS
router.delete('/', login.obrigatorio, UsuariosController.DelClientes);

module.exports = router;