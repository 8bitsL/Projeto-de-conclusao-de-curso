import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { ThunkListEncomendas, ThunkVendas } from '../../Thunk/index'

import './style.css';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const pushEstoque = () => history.push('/estoque');
  const pushProdutos = () => history.push("/estoque");
  const pushClientes = () => history.push('/clientes');
  const pushRevendedores = () => history.push("/revendedores");
  const listaVendas = () => history.push('/listaVendas');
  const viewLucro = () => history.push('/viewLucro');

  const rawVendas = useSelector(state => state.user.vendas) || [];
  const userDados = useSelector(state => state.user.user_dados.user_data);

  const tipoUsu = useSelector(state => state.user.user_dados.user_data.tipo_usuario);
  
  const modificaView = userDados.valor_total - userDados.valor_compra;

  const link5w2h = 'https://docs.google.com/spreadsheets/d/1TjEFJ2YJkBbVEBxPWr4ErH62NdjonRhS/edit?usp=drive_web&ouid=101354128149329246615&rtpof=true';
  const linkPowerBi = "https://login.microsoftonline.com/common/oauth2/authorize?client_id=66a82e16-17a9-4415-97b1-328825bf5470&response_mode=form_post&response_type=code+id_token&scope=openid+profile&state=OpenIdConnect.AuthenticationProperties%3dsjyJLj6VUEMrgPdBGjjF012ReoK7V82j_8bCYaW4i9SM3IDNv30Px5Bp4N3DVW0J0o0OxfmfLwAcx0HhsHchqShhxgOavK9BmCKk3wVd10oAwaeQIcPbuU7FnEbobiQc9wJSNTdMITE90Cv39x1p_axlxj_GaCjlF2wBiPPDnos&nonce=637575685931490917.MThkMjZlNjYtN2M2Zi00ZTY4LWFiMDMtZDlhZmI5MTcxNGIyYTgzZGRkZGYtMzAzZi00Mzk3LWI2ZTAtNGJhOWQyY2Q3ZTZk&redirect_uri=https%3a%2f%2fpowerbi.microsoft.com%2f&post_logout_redirect_uri=https%3a%2f%2fpowerbi.microsoft.com";

  const data = new Date();
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];
  const mes = meses[data.getMonth()].toUpperCase();

  const renderRow = Object.values(rawVendas).map((itemVenda, i) =>{
    if(i < 4 ){
      return(
        <tr key={itemVenda.id_transacao_venda} >
          <td style={{ textAlign: 'center' }}>{i + 1}</td>
          <td style={{ textAlign: 'left' }}>{itemVenda.nome_produto}</td>
          <td style={{ textAlign: 'center' }}>{itemVenda.total_unidade}</td>
          <td style={{ textAlign: 'center' }}>{itemVenda.valor_unidade.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
          <td style={{ textAlign: 'center' }}>{(itemVenda.valor_unidade*itemVenda.total_unidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
        </tr>
      )
      
    } else return null;
  }
);

  useEffect(() => {
    dispatch(ThunkVendas());
    dispatch(ThunkListEncomendas());

    if(userDados.tipo_usuario === 'C' && !userDados.id_revendedor){
      addToast('Para dar início a suas encomendas, é necessário se afiliar a um revendedor para ter acesso.',
    {
        appearance: 'warning',
        autoDismiss: false
      });
    }
  }, [dispatch, userDados, addToast])

  return (
    <>
      <div id="dashboard-wrapper">
        {tipoUsu === 'R' ? 
        <div className="history-wrapper">
          <div className="history-box">
            <div className="tittle-dashboard" onClick={viewLucro}>LUCRO BRUTO</div>

            <div className="content-dashboard">
            <div style={{ display: !renderRow.length ? 'block' : 'none' }}>Nenhuma venda realizada</div>
            
              <div style={{ display: renderRow.length ? 'flex' : 'none', alignItems: 'center'}} >
                <div className="value">{userDados.lucro ? userDados.lucro.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 0}</div>
                <div className="status">
                  <span style={{ fontSize: "3rem" }}>
                    {modificaView > 1 ? <i className="bi bi-graph-up"></i> : <i className="bi bi-graph-down"></i>}
                  </span>

                  <div className="description">
                    {modificaView > 1 ? <span>POSITIVO</span> : <span>NEGATIVO</span>}
                    {modificaView > 1 ? <span><i className="bi bi-arrow-up-circle-fill"></i></span> : <span><i className="bi bi-arrow-down-circle-fill"></i></span>}
                  </div>
                </div>

              </div>
            </div>

            <div className="moth-reference">{renderRow.length ? mes : ''}</div>
          </div>

          <div className="history-box">
            <div className="tittle-dashboard" onClick={listaVendas}>ULTIMAS VENDAS</div>

            <div className="content-dashboard">
              <div style={{ display: !renderRow.length ? 'block' : 'none' }}>Nenhuma venda realizada</div>

              <table style={{ display: renderRow.length ? 'initial' : 'none' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th style={{ textAlign: 'left' }}>Produto</th>
                    <th style={{ textAlign: 'center' }}>Qtd</th>
                    <th style={{ textAlign: 'center' }}>Valor (uni.)</th>
                    <th style={{ textAlign: 'center' }}>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {renderRow}
                </tbody>
              </table>
            </div>

            <div className="moth-reference">{renderRow.length ? mes : ''}</div>
          </div>
        </div>
        :
        <div><h1>Seja bem-vindo ao sistema</h1></div>
}

        <div className="nav-dashboard">
          <button style={{display: tipoUsu === "R" ? 'block' : 'none'}} onClick={ pushEstoque }>Estoque</button>

          <button style={{display: tipoUsu === "C" && userDados.id_revendedor ? 'block' : 'none'}} onClick={ pushProdutos }>Produtos</button>

          <a href={linkPowerBi} 
            target="_blank" 
            rel="noreferrer" 
            style={{display: tipoUsu === "R" ? 'block' : 'none', textDecoration: 'none'}}
            >
              <button>Power BI</button>
          </a>

          <button style={{display: tipoUsu === "R" ? 'block' : 'none'}} onClick={ pushClientes }>Clientes</button>

          <button style={{display: tipoUsu === "C" && userDados.id_revendedor === null ? 'block' : 'none'}} onClick={ pushRevendedores }>Revendedores</button>
          
          <a href={link5w2h} 
            target="_blank" 
            rel="noreferrer" 
            style={{display: tipoUsu === "R" ? 'block' : 'none', textDecoration: 'none'}}
            >
              <button>5W2H</button>
          </a>

        </div>
      </div>
    </>
  )
}

export default Home;