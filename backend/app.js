const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

/**
 * CORS:
 * 
 * DEFINIÇÃO DE PERMISSÕES DE ACESSO 
 */
app.use(cors());

/**
 * BANCO DE DADOS :
 *  CONEXÃO -> POOL
 *  GERENCIAMENTO ->  
 */
const pool = require('./mysql');
const MiddlewareDB = require('./middleware_bd');

/**
 * MIDDLEWARE'S
 * 
 * ROTA DE MIDDLEWARE - BANCO DE DADOS
 */
app.use(MiddlewareDB(pool));

//SETAR LOGS
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false })); // apenas arquivos simples
app.use(bodyParser.json());




// CRIAR ROTA
const rotaUsuarios = require('./routes/usuarios');
const rotaProdutos = require('./routes/produtos');
const rotaVendas = require('./routes/vendas');
const rotaPedidos = require('./routes/pedidos')


// SETAR ROTAS
app.use('/usuarios', rotaUsuarios);
app.use('/produtos', rotaProdutos);
app.use('/vendas', rotaVendas);
app.use('/encomendas',rotaPedidos)

// TRATAR ERROS | TRATAR ERROS DE ROTAS(QUANDO A ROTA NÃO FOR ENCONTRADA)
app.use((request, response, next) => {
    const erro = new Error('Operação não encontrada');
    erro.status = 402;
    next(erro);
});

app.use((error, request, response, next) => {
    response.status(error.status || 500);
    return response.send({
        status: "error",
        message: "Falha ao conectar com o servidor",
        error: request.json
    });
});

module.exports = app;