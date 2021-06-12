const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_KEY);
    next();

  } catch(err){
      console.log("erro", err);
      return res.status(401).send({status: 'error', mensagem: "Falha na Autorização"});
  }
}

exports.opcional = (req, res, next) => {
  try{
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : false;
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decode;
    next();
  } catch(err){
    next();
  }
}