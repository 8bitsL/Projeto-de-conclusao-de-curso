exports.ListarVendas = (req, res, next) => {
  const query =`
    SELECT p.nome_produto,p.nome_arquivo, p.valor_venda as valor_unidade, 
    v.*, c.nome, c.email, c.telefone_usuario as telefone, c.estado,
    c.bairro,c.cidade, c.logradouro, c.cep 
    FROM venda v
    INNER JOIN produtos p ON p.cod_prod = v.cod_prod 
    INNER JOIN cadastros c ON c.id_usuario = v.id_usuario
    WHERE v.id_revendedor = ` + req.user.id_usuario;
  
    req.connection.query(query,
        (err, result) => {
            if (err) return res.status(500).send(err);

            return res.status(200).send(result);
        });
}


exports.FinalizarVenda = (req, res, next) => {
    console.log(req.body)
    if (req.user.id_usuario && parseInt(req.user.id_usuario) >= 1) {
        const {
            idEncomenda: numero_transacao,
            valorTotal: valor_total,
            codProduto: cod_prod,
            idRevendedor: id_revendedor,
            totalUnidade: total_unidade,
            quantidadeEstoque: quantidade_estoque,
            statusPedido: status_pedido,
            idUsuario: id_usuario
        } = req.body;

        const data_venda = new Date().toISOString().slice(0, 10);

        if(status_pedido === 'cancelado'){
            req.connection.query('UPDATE encomenda SET status_pedido = ? WHERE numero_transacao = ?',
                [status_pedido, numero_transacao],
                (erro, resultado) =>{
                    if(erro) return res.status(500).send(erro);

                    const resposta = {
                        message: 'Encomenda cancelada com Sucesso',
                        status: 'success'
                    }

                    return res.status(200).send(resposta);
                }
            );

        } else if(status_pedido === 'aprovado'){
            req.connection.query('UPDATE encomenda SET status_pedido = ? WHERE numero_transacao = ?',
                [status_pedido, numero_transacao],
                (erro, resultado) =>{
                    console.log("erro 1", erro);
                    if(erro) return res.status(500).send(erro);

                    if(resultado){
                        req.connection.query('INSERT INTO venda (numero_transacao, valor_total, data_venda, id_usuario, cod_prod, id_revendedor, total_unidade) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [numero_transacao, valor_total, data_venda, id_usuario, cod_prod, id_revendedor, total_unidade],
                            (erro, resultado) =>{
                                console.log("erro 2", erro);
                                if(erro) return res.status(500).send(erro);

                                if(resultado){
                                    req.connection.query('UPDATE produtos SET quantidade_unidade = ? WHERE cod_prod = ?',
                                        [(quantidade_estoque - total_unidade), cod_prod],
                                        (erro, resultado) =>{
                                            console.log("quantidade_estoque: ", quantidade_estoque, "total_unidade: ", total_unidade, (quantidade_estoque - total_unidade));
                                            console.log("erro 3", erro);
                                            if(erro) return res.status(500).send(erro);

                                            const resposta = {
                                                message: 'Venda finalizada com Sucesso',
                                                status: 'success'
                                            }

                                            return res.status(200).send(resposta);
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );

        } else{
            res.status(500).send({
                message: 'Encomenda não alterada por falta de informações.',
                status: 'error'
            });
        }
    }
}