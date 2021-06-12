const { response, query } = require("express");

exports.listarProdutos = (req, res, next) => {
  const idRevendedor = req.body.idRevendedor ? req.body.idRevendedor : req.user.id_usuario;

  req.connection.query(
    'SELECT * FROM produtos WHERE id_usuario = ?', [idRevendedor],
    (err, result) => {
      if(!result.length)return res.status(500).send(err)
      if (err) {
        return next(err);
      }
      return res.status(200).send(result);
    });
}

exports.cadastrarProduto = (req, res, next) => {
  const
  {
    produtoRegister: nome_produto,
    quantidadeRegister: quantidade_unidade,
    tipoProdRegister: tipo_produto,
    valorVendaRegister: valor_venda,
    descEmbalagem: descricao_embalagem,
    descricaoRegister: descricao_produto,
    valorCompraRegister: valor_compra
  } = req.body
  
  const nome_arquivo = req.file.filename;
  const id_usuario = req.user.id_usuario;

  req.connection.query('INSERT INTO produtos (nome_produto, quantidade_unidade, tipo_produto, valor_venda, descricao_embalagem, descricao_produto, nome_arquivo, valor_compra, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
   [
    nome_produto,
    quantidade_unidade,
    tipo_produto,
    valor_venda,
    descricao_embalagem,
    descricao_produto,
    nome_arquivo,
    valor_compra,
    id_usuario
  ], (err, result) => {
      if (err) return res.status(500).send(err);

      const response = {
        message: 'Produto Inserido com Sucesso',
        status: 'success'
      }

      return res.status(201).send(response);
  });
}

exports.editarProduto = (req, res, next) => {
  console.log('entrou aqui');
  const
  {
    produtoRegister: nome_produto,
    quantidadeRegister: quantidade_unidade,
    tipoProdRegister: tipo_produto,
    valorVendaRegister: valor_venda,
    descEmbalagem: descricao_embalagem,
    descricaoRegister: descricao_produto,
    valorCompraRegister: valor_compra,
    codProd: cod_prod
  } = req.body

  let query = 'UPDATE produtos SET nome_produto = ?, quantidade_unidade = ?, tipo_produto = ?, valor_venda = ?, descricao_embalagem = ?, descricao_produto = ?, valor_compra = ? WHERE cod_prod = ' + cod_prod;

  let dados = [
    nome_produto,
    quantidade_unidade,
    tipo_produto,
    valor_venda,
    descricao_embalagem,
    descricao_produto,
    valor_compra
  ]

  if(req.file){
    query = 'UPDATE produtos SET nome_produto = ?, quantidade_unidade = ?, tipo_produto = ?, valor_venda = ?, descricao_embalagem = ?, descricao_produto = ?, valor_compra = ?, nome_arquivo = ? WHERE cod_prod = ' + cod_prod;
    dados.push(req.file.filename);
  }

  req.connection.query(query, dados,(err, resultado) => {
      if (err) return res.status(500).send(err);

      const response = {
        message: 'Produto Alterado com Sucesso',
        status: 'success'
      }

      return res.status(201).send(response);
    }
  )
}

exports.deletProdutos = (req, res, next) => {
 const {
   codigo: cod
 } = req.body

  req.connection.query('DELETE FROM produtos WHERE cod_prod = '+cod, (err, result) => {
    if(err) return res.status(500).send({
      err: err,
      status: 'error',
    });
    else return res.status(200).send({status: 'success'});
  })

}

exports.getIDProduto = (req, res, next) => {
  req.connection.query(
    'SELECT * FROM produtos WHERE id_produto = ?;',
    [
      req.params.id_produto
    ],
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.length == 0) {
        return res.status(404).send({
          mensagem: 'ID Não Encontrado | Inexistente'
        });
      }
      const response = {
        produto: {
          id_produto: result[0].id_produto,
          nome: result[0].nome,
          preco: result[0].preco,
          request: {
            tipo: 'GET',
            descricao: 'Retorna um Produto Especifíco',
            url: 'http://localhost:4343/produtos/'
          }
        }
      }
      return res.status(200).send(response);
    });
}