const express = require('express');
const router = express.Router();

const Login = require('../middleware/login');
const ControllerVendas = require('../controllers/vendas-controller');


//ROTA PARA LISTAR OS ITENS DA TABELA DE VENDAS
router.get('/', Login.obrigatorio, ControllerVendas.ListarVendas );


router.post('/finalizarVenda', Login.obrigatorio, ControllerVendas.FinalizarVenda );

module.exports = router;