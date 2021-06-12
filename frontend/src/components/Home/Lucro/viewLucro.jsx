import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ThunkCheckAuth } from '../../../Thunk/index'

import './viewLucro.css';
const ViewLucro = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const userDados = useSelector(state => state.user.user_dados.user_data);
    const lucro = (userDados.valor_total - userDados.valor_compra) || 0;

    const backHome = () => history.push('/app');

    let Lucro = '';
             
    if (lucro <1) {
        Lucro = 'negativo';

      } else {
        Lucro = 'positivo'
      }

      useEffect(()=>{
        dispatch(ThunkCheckAuth())
      },[dispatch])
        
              
    return (
        <div id="dashboard-wrapper" style={{flexDirection: "column"}}>
            <div style={{width: '100%', textAlign: 'right'}}>
                <span>
                    <button className="back-home" onClick={backHome}>
                        <i className="bi  bi-backspace-fill"></i> Home
                    </button>
                </span>
            </div>

            <div className="contentLucro">
                <div className="viewTitle">
                    <h1>BALANÇO DE LUCRO</h1>
                </div>
                <div className="contentView">
                    <div className="view-valor hover1">
                        <p id="MostraValor1"> Valor referente ao quanto foi gasto comprando os produtos presentes no estoque</p>
                        <p>Valor em produtos</p>
                        <h1>{userDados.valor_compra ? userDados.valor_compra.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 0}</h1>
                    </div>
                    <div className="view-valor hover2">
                        <p id="MostraValor2">Valor referente ao total arrecado com as vendas</p>
                        <p>Valor em vendas</p>
                        <h1>{userDados.valor_total ? userDados.valor_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 0}</h1>
                    </div>
                </div>
                    <div className={"hover3 viewLucro " + Lucro}>
                        <p id="MostraValor3">Produto de "Valor em produtos" - "Valor em vendas"</p>
                        <p>Lucro bruto</p>
                        <h1>{lucro.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h1>
                    </div>
            </div>
        </div>
    )
}
export default ViewLucro;