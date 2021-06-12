require('dotenv').config();

const http   =  require('http');
const app    =  require('./app');
const port   =  3333;
const server =  http.createServer(app);

server.listen(port);
console.log('Servidor Executando na Porta ' + port + ' || Link: http://localhost:' + port);