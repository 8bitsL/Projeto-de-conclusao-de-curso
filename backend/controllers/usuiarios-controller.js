const bcrypt = require('bcrypt');
const { query } = require('express');
const jwt = require('jsonwebtoken');

exports.Register = async (req, res, next) => { 
  const {
    nameRegister: nome,
    apelidoRegister: apelido,
    cpfCnpjRegister: cpf_cnpj,
    emailRegister: email,
    pswdRegister: senha,
    typeRegister: tipo
  } = req.body;

  req.connection.query('SELECT * FROM cadastros WHERE email = ?', [email], (err, result) => {
    if (err) { return res.status(500).send({ status: 'error', error: error }) }
    if (result.length > 0) {
      res.status(409).send({ status: 'error', message: "E-mail já cadastrado" })
    }
    else {
      bcrypt.hash(senha, 10, (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({ status: 'error', error: errBcrypt });
        }
        req.connection.query('INSERT INTO cadastros (nome, apelido, cpf_cnpj, email, senha, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)',
          [nome, apelido, cpf_cnpj, email, hash, tipo],
          (err, result) => {
            if(err) return next(err);

            response = {
              status: 'success',
              message: 'Usuário cadastrado',
              dados: {
                id_usuario: result.insertId,
                email: email,
              }
            }

            return res.status(201).send(response);
          })
      });
    }
  });
};

exports.Login = (req, res, next) => {
  const {
    emailLogin: email,
    pswLogin: senha,
  } = req.body;

  req.connection.query('SELECT * FROM cadastros WHERE email = ?', [email], (err, result) => {
    if(err) return res.status(500).send({
      status: 'error',
      message: "Erro ao conectar com a base de dados"
    });

    if(result.length < 1) return res.status(200).send({
      status: 'error',
      message: "Usuário não encontrado"
    });

    bcrypt.compare(senha, result[0].senha, (err, results) => {
      if(err) return res.status(401).send({ err: err });

      if(results) {
        const token = jwt.sign({
          id_usuario: result[0].id_usuario,
          email: result[0].email
        },
            process.env.JWT_KEY,
          {
            expiresIn: "2h",
          });

        return res.status(200).send({
          status: "success",
          message: "Usuário autenticado",
          token: token
        });
      }

      return res.status(401).send({ message: "Senha incorreta" });
    });
  });
};

exports.Clientes = (req, res, next) => {
  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query('SELECT * FROM cadastros WHERE tipo_usuario = "C" AND id_revendedor = ? ORDER BY id_usuario',[req.user.id_usuario],
    (err, result) => {
      if(err) return res.status(500).send({
        err: err,
        status: 'error',
        message: "Erro ao conectar com a base de dados"
      });

      if(!result.length){
        return res.status(200).send([]);
      
      } else{
        let clientes = [];

        result.forEach((cliente, index) => {
          clientes[index] = cliente;
          cliente.situacao_financeira = null;
          delete cliente.senha;

          req.connection.query('SELECT * FROM situacao_cliente WHERE id_usuario = ?', [cliente.id_usuario], 
          (erro, resul) => {
            if(erro) return res.status(500).send({
              err: erro,
              status: 'error',
              message: "Erro ao conectar com a base de dados"
            });

             if(resul.length) cliente.situacao_financeira = resul[0];
            });            
        });
        
        setTimeout(() => {
          return res.status(200).send(clientes);
        }, 1000);
      }
    });

  } else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuário informado na base de dados"
  });
}

exports.DadosUsuario = (req, res, next) => {
  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query('SELECT * FROM cadastros WHERE id_usuario = ?', [req.user.id_usuario], (err, result) => {
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
        const queryRevendedor = `
            SELECT c.*,
                   lr.lucro,
                   lr.valor_compra,
                   lr.valor_total
            FROM cadastros c
                INNER JOIN lucro_revendedor lr 
                ON lr.id_revendedor  = c.id_usuario
            WHERE c.id_usuario = ` + usuario.id_usuario;

        req.connection.query(queryRevendedor, (err, result) => {
          if(err) return res.status(500).send({
            err: err,
            status: 'error',
            message: "Erro ao conectar com a base de dados"
          });

          if(result.length === 1){
            const revendedor = result[0];
            delete revendedor.senha;

            return res.status(200).send({
              status: "success",
              isAuth: true,
              user_data: revendedor
            });

          } else{
            return res.status(200).send({
              status: "success",
              isAuth: true,
              user_data: usuario
            });

          }

        });
        
      } else{
        return res.status(200).send({
          status: "success",
          isAuth: true,
          user_data: usuario
        });  
      }
    });

  } else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuario informado na base de dados"
  });
}

exports.UpdateUsuario = async (req, res, next) => {
  console.log(req.body);

  if(req.user.id_usuario && req.user.id_usuario >= 1){
    const {
      nameRegister: nome,
      apelidoRegister: apelido,
      emailRegister: email,
      pswdRegister: senha,
      cpfCnpjRegister: cpf_cnpj,
      cidadeRegister: cidade,
      estadoRegister: estado,
      bairroRegister: bairro,
      complementoRegister: logradouro,
      cepRegister: cep,
      numeroRegister: numero,
      telefoneRegister: telefone_usuario
      } = req.body
      
      const nome_arquivo = req.file.filename;
      console.log(nome_arquivo);
      const psw = await pswEncrypt(senha, 10);
      
      
      const query = () => {
        if(psw.length){
          return `
            UPDATE 
              cadastros 
            SET 
              senha = '${psw}',
              nome = '${nome}',
              apelido = '${apelido}',
              email = '${email}',
              cpf_cnpj = '${cpf_cnpj}', 
              cidade = '${cidade}', 
              estado = '${estado}', 
              bairro = '${bairro}', 
              logradouro = '${logradouro}', 
              cep = '${cep}', 
              numero = '${numero}',
              telefone_usuario = '${telefone_usuario}',
              nome_arquivo = '${nome_arquivo}'
            WHERE id_usuario = '${req.user.id_usuario}'`
          ;
        
        } else{
          return `
            UPDATE 
              cadastros 
            SET 
              nome = '${nome}',
              apelido = '${apelido}',
              email = '${email}',
              cpf_cnpj = '${cpf_cnpj}', 
              cidade = '${cidade}', 
              estado = '${estado}', 
              bairro = '${bairro}', 
              logradouro = '${logradouro}', 
              cep = '${cep}', 
              numero = '${numero}',
              telefone_usuario = '${telefone_usuario}',
              nome_arquivo = '${nome_arquivo}'  
            WHERE id_usuario = '${req.user.id_usuario}'`
          ;
        }
      }

      req.connection.query(query(), (err, result)  => {
          if(err) return res.status(500).send({
            err: err,
            status: 'error',
            message: query
          });
          
        return res.status(202).send({status: 'success', message: 'Cadatro atualizado com sucesso'});
      }
    );

  } else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuário informado na base de dados"
  });
}

exports.Revendedores = (req, res, next) => {
  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query('SELECT * FROM cadastros WHERE tipo_usuario = "R"',
    (err, result) => {
      if(err) return res.status(500).send({
        err: err,
        status: 'error',
        message: "Erro ao conectar com a base de dados"
      });

      if(!result.length) return res.status(200).send([]);

      result.forEach((revendedor) => {
        delete revendedor.senha;
      })

      return res.status(200).send(result);
    });

  } else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuário informado na base de dados"
  });
}

exports.AttCliente = (req, res, next) =>{

  const {
    idUser: id_usuario,
    clienteRegister: nome,
    apelidoRegister: apelido,
    emailRegister: email,
    cpfCnpj: cpf_cnpj,
    telefoneRegister: telefone_usuario,
    dataNasRegister: data_nascimento,
    estadoRegister: estado,
    bairroRegister: bairro,
    cidadeRegister: cidade,
    logradouroRegister: logradouro,
    cepRegister: cep,
    numeroRegister: numero
  } = req.body

  const query = () => {
      return `
        UPDATE 
          cadastros 
        SET 
          nome = '${nome}',
          apelido = '${apelido}',
          email = '${email}',
          cpf_cnpj = '${cpf_cnpj}', 
          cidade = '${cidade}', 
          estado = '${estado}', 
          bairro = '${bairro}', 
          logradouro = '${logradouro}', 
          cep = '${cep}', 
          numero = '${numero}',
          telefone_usuario = '${telefone_usuario}', 
          data_nascimento = '${data_nascimento}',
          numero = '${numero}'
        WHERE id_usuario = '${id_usuario}'
        `
  }
  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query(query(), (err, result)  => {
      if(err){
       return res.status(500).send({
         message: err,
         status: 'err'
       });
      }else{
        return res.status(200).send({
          message: 'Cliente atualizado com sucesso',
          status: 'success'});
      }
  }
);
  }else return res.status(500).send({
    status: 'error',
    message: "Erro ao encontrar o usuário informado na base de dados"
  });
}
exports.AssociaCliente = (req, res, next) => {

  const {
    id_revendedor: id_revendedor,
    nome_revendedor: nome_revendedor
  } = req.body
  if(req.user.id_usuario && req.user.id_usuario >= 1){

    req.connection.query('SELECT * from cadastros WHERE id_usuario = ?' , [req.user.id_usuario], (err, result) => {
      if(err)return res.status(500).send({message: err, status: 'err'})
      let usuario = result[0]
      if(usuario.id_revendedor === null){
        console.log('Cai aqui');
        const query = () =>{
          return `UPDATE cadastros SET id_revendedor = '${id_revendedor}', nome_revendedor = '${nome_revendedor}'
          WHERE id_usuario = ?`
        }
        req.connection.query(query(), [req.user.id_usuario], (err, result) => {
          if(err)return res.status(500).send({status:'err'})
          return res.status(200).send({
            message: 'Você se associou ao revendedor!',
            status: 'success'
          })
        })
      }else{
        return res.status(300).send({
          message:'Usuário já associado a um revendedor',
          status: 'err'
        })
      }
    })

  }else{
    return res.status(500).send({message:'Usuario não encontrado', status: 'err'})
  }

}

exports.AssociaClienteAoCadastrar = (req, res, next) => {
  console.log(req.body);
  const {
    nameRegister: nome,
    apelidoRegister: apelido,
    cpfCnpjRegister: cpf_cnpj,
    emailRegister: email,
    pswdRegister: senha,
    typeRegister: tipo,
    idRevendedor: id_revendedor, 
    nomeRevendedor: nome_revendedor
  } = req.body
  req.connection.query('SELECT * FROM cadastros WHERE email = ?', [email], (err, result) => {
    if (err) { return res.status(500).send({ status: 'error', error: error }) }
    if (result.length > 0) {
      res.status(409).send({ status: 'error', message: "E-mail já cadastrado" })
    }
    else {
      bcrypt.hash(senha, 10, (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({ status: 'error', error: errBcrypt });
        }
        req.connection.query('INSERT INTO cadastros (nome, apelido, cpf_cnpj, email, senha, tipo_usuario, id_revendedor, nome_revendedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [nome, apelido, cpf_cnpj, email, hash, tipo, id_revendedor, nome_revendedor],
          (err, result) => {
            if(err) {
              return res.status(500).send({message:'Falha ao cadastrar cliente', status: 'err'});
            }else{
              return res.status(200).send({
                status: 'success',
                message: 'Cliente cadastrado com sucesso'
              })
            }
          })
      });
    }
  });
}
exports.DelClientes = (req, res, next) => {
  const {
    codigo: cod
  } = req.body

  if(req.user.id_usuario && req.user.id_usuario >= 1){
    req.connection.query('DELETE FROM cadastros WHERE id_usuario ='+cod, (err,result) => {
      if(err){ 
        return res.status(500).send({
        status:"erro"
      })
    }
      else{
        return res.status(200).send({
          status: "success"
        })
      }
    });
  }
}
exports.AlteraSituacaoCliente = (req, res, next) => {
  const {
    dataDividaRegister: data_divida,
    dataPagRegister: data_pagamento,
    idUser: id_usuario,
    situacaoRegister: situacao_financeira,
    observacaoRegister: obs_revendedor,
    idTransacao: id_transacao_venda
  } = req.body;

  if (req.user.id_usuario && req.user.id_usuario >= 1) {

    const querySelect = () => {
      return `
      SELECT * FROM situacao_cliente WHERE id_usuario = '${id_usuario}' `
    }
    req.connection.query(querySelect(), (err, result) => {
      if (err) return res.status(500).send({ message: 'Deu um erro', status: 'err' })

      if (result.length < 1) {
        console.log('Bati aqui');
        req.connection.query('INSERT INTO situacao_cliente (id_usuario, situacao_financeira, obs_revendedor, data_divida, data_pagamento, id_revendedor, id_transacao_venda) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id_usuario, situacao_financeira, obs_revendedor, data_divida, data_pagamento, req.user.id_usuario, id_transacao_venda], (err, result) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send({ message: "Situação alterada com sucesso", status: "success" })
          })

      } else {
        const queryUpdate = () => {
          return `
            UPDATE
              situacao_cliente
            SET
              data_divida = '${data_divida}',
              data_pagamento = '${data_pagamento}',
              situacao_financeira = '${situacao_financeira}',
              obs_revendedor = '${obs_revendedor}',
              id_transacao_venda = '${id_transacao_venda}'
            WHERE
              id_usuario = '${id_usuario}'
            `
        }

        req.connection.query(queryUpdate(), (err, result) => {

          if (err) {
            console.log('caiu 1');
            return res.status(500).send({ message: err, status: 'err' })
          }
          else {
            console.log('caiu 2 ');
            return res.status(200).send({
              message: 'Situação alterada com sucesso',
              status: 'success'
            })
          }
        })

      }
    })

  } else {
    return res.status(500).send({ message: 'falha ao se conectar', status: 'err' })
  }
}

const pswEncrypt = async (password, salt) => {
  if(password && password.length){
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

  } else return false;
}