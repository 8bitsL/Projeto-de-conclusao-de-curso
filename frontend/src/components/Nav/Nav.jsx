import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../services/auth';

import { ThunkCheckAuth } from '../../Thunk/index'

import Logo from '../../images/logo.png';

import './style.css';

const Nav = () => {
  const dispatch = useDispatch()
  const history = useHistory();

  const username = useSelector(state => state.user.user_dados);
  const encomendas = useSelector(state => state.user.encomendas);
  const userDados = useSelector(state => state.user.user_dados.user_data.nome_arquivo)

  const { addToast } = useToasts();

  const countEncomenda = () => {
    let contador = 0;
    encomendas.forEach(element => {
      if (element.status_pedido === "pendente") {
        contador++
      }
    });
    return contador;
  }

  const handleLogout = () => {
    history.push('/login');
    logout();

    addToast('Usuário desconectado', {
      appearance: 'success',
      autoDismiss: true
    });
  }
  const pushEncomendas = () => {
    history.push('/encomendas');
  }

  const EditarDados = () => {
    history.push('/minhaconta');
  }
  const redirect = () => {
    history.push('/app');
  }

  let image_path = null;
  try{
      image_path = require('../../images/usuarios/' + userDados);
  } catch{
      image_path = require('../../images/usuarios/padrao.png');
  }

  useEffect(() => {
    dispatch(ThunkCheckAuth())
  }, [dispatch])

  return (
    <nav>
      <div><img src={Logo} alt="Logo" style={{ cursor: 'pointer' }} onClick={redirect} /></div>

      <div style={{ marginLeft: '1rem', cursor: 'pointer' }} onClick={redirect}><h3>CVR Business Intelligence Solutions</h3></div>

      <div id="infos-user-wrapper">
        <div className="actions-nav">
          <button id="open-bag"><i className="bi bi-cart2" onClick={pushEncomendas}></i> <span>{countEncomenda()}</span></button>
          {/* <button id="open-favorites"><i className="bi bi-heart"></i> <span>0</span></button> */}
        </div>

        <div className="rotulo-user">
          <img  className="imgUsuario" src={image_path.default} alt="img_usuario"/>
          {/* <i className="bi bi-person-circle"></i> */}
        </div>

        <div className="infos">
          <div>Olá, {username.user_data.apelido}</div>
          <button id="account-setting" onClick={EditarDados}>Minha conta</button>
        </div>
      </div>

      <div id="log-out-rotulo">
        <button id="log-out" onClick={handleLogout}>
          <i className="bi bi-box-arrow-in-right"></i>
          <span>Sair</span>
        </button>
      </div>
    </nav>
  )
}

export default Nav;