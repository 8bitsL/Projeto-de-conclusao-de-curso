const express = require ('express');
const router = express.Router();

// CRIANDO CAMINHO PARA A CONTROLLER - PEDIDOS
const Login = require('../middleware/login');
const PedidosController = require('../controllers/pedidos-controller');

 // ROTA GET(BUSCAR)
router.get('/', Login.obrigatorio, PedidosController.ListarEncomendas );

 //ROTA POST(INSERIR)
router.post('/addEncomenda', Login.obrigatorio, PedidosController.AddEncomenda);

module.exports = router;