exports.ListarEncomendas = (req, res, next) => {
  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query('SELECT tipo_usuario FROM cadastros WHERE id_usuario = ?', [req.user.id_usuario], (err, result) => {
      if(err) return res.status(500).send({
        err: err,
        status: 'error',
        message: "Erro ao conectar com a base de dados"
      });

      if(result.length !== 1){
        return res.status(200).send({
          status: 'error',
          message: "Usuário não encontrado"
        });
      }

      let usuario = result[0];
      delete usuario.senha;

      if(usuario.tipo_usuario === 'R'){
        const queryRevendedor =`
          SELECT  
            e.*,
            p.nome_produto,
            p.valor_venda,
            p.nome_arquivo,
            p.quantidade_unidade,
            c.nome, c.email, c.telefone_usuario as telefone, c.estado, c.cidade, 
            c.bairro, c.logradouro,
            p.valor_venda 
          FROM 
            encomenda e
            INNER JOIN produtos p ON p.cod_prod = e.cod_prod
            INNER JOIN cadastros c ON c.id_usuario = e.id_usuario 
          WHERE e.id_revendedor =` + req.user.id_usuario;
      
        req.connection.query(queryRevendedor, (err, result) => {
          if(err) return res.status(500).send({
            err: err,
            status: 'error',
            message: "Erro ao conectar com a base de dados"
          });
       
          return res.status(200).send(result);
        });
        
      } else{
        const queryCliente =`
        SELECT 
          e.*,
          p.nome_produto,
          p.nome_arquivo,
          p.valor_venda,
          c.nome
        FROM 
          encomenda e
          INNER JOIN produtos p ON p.cod_prod = e.cod_prod 
          INNER JOIN cadastros c ON c.id_usuario = e.id_revendedor 
        WHERE e.id_usuario =` + req.user.id_usuario;
    
      req.connection.query(queryCliente, (err, result) => {
        if(err) return res.status(500).send({
          err: err,
          status: 'error',
          message: "Erro ao conectar com a base de dados"
        });
     

        return res.status(200).send(result);
        });
      }
    });

  } else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuario informado na base de dados"
  });
}

exports.AddEncomenda = (req, res, next) => {
  const {
    codProd: cod_prod,
    idRevendedor: id_revendedor,
    quantidadeEncomendaRegister: total_unidade,
    valorEncomenda: valor_encomenda
  } = req.body;

  const id_usuario = req.user.id_usuario;
  const data_encomenda = new Date().toISOString().slice(0, 10);
  const status_pedido = 'pendente';

  req.connection.query('INSERT INTO encomenda (cod_prod, id_revendedor, total_unidade, valor_encomenda, id_usuario, data_encomenda, status_pedido) VALUES (?, ?, ?, ?, ?, ?, ?)',
   [
    cod_prod,
    id_revendedor,
    total_unidade,
    valor_encomenda,
    id_usuario,
    data_encomenda,
    status_pedido
  ], (err, result) => {
    if(err) return res.status(500).send(err);

    const queryCliente =`
    SELECT 
      e.*,
      p.nome_produto,
      p.valor_venda,
      c.nome
    FROM 
      encomenda e
      INNER JOIN produtos p ON p.cod_prod = e.cod_prod 
      INNER JOIN cadastros c ON c.id_usuario = e.id_revendedor 
    WHERE e.id_usuario =` + req.user.id_usuario;

  req.connection.query(queryCliente, (err, result) => {
    if(err) return res.status(500).send({
      err: err,
      status: 'error',
      message: "Erro ao conectar com a base de dados"
    });
 
    const response = {
      message: 'Encomenda realizada com Sucesso',
      status: 'success',
      encomendas: result
    }
    
    return res.status(201).send(response);
    
  });
  });
}