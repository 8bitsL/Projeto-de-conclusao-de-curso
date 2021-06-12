import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ThunkVendas } from '../../Thunk/index'
import {  showModal, enviaCod } from '../../action/index'

import VendasModal from '../Modal/vendasModal'

import './style.css';

const ListaVendas = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const mostraModal = useSelector(state => state.user.modal);
    const arrayVendas = useSelector(state => state.user.vendas);
    const cod = useSelector(state=>state.user.codEnviado);
  
    const backHome = () => {
        history.push('/app');
    }

    const modal = (idVenda) => {
        dispatch(enviaCod(idVenda));
        dispatch(showModal(true));
    }


    useEffect(() => {
        dispatch(ThunkVendas());
    }, [dispatch]);

    return (
        <div id="estoque-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Vendas</h3>

                <span>
                    <button className="back-home" onClick={backHome} ><i className="bi  bi-backspace-fill"></i> Home</button>
                </span>
            </div>

            <div className="scroll-table">
                <div style={{ display: !arrayVendas.length ? 'block' : 'none' }} className="msg">Nenhuma venda realizada</div>

                <table id="produtos-wrapper" style={{ display: arrayVendas.length ? 'table' : 'none' }}>
                    <thead>
                        <tr>
                            
                            <th style={{ textAlign: 'center' }}>Cód. Produto</th>
                            <th style={{ textAlign: 'left' }}>Produto</th>
                            <th style={{ textAlign: 'left' }}>Cliente</th>
                            <th style={{ textAlign: 'center'}}>Quantidade</th>
                            <th style={{ textAlign: 'center'}}>Preço uni.</th>
                            <th style={{ textAlign: 'center'}}>Valor venda</th>
                            <th style={{ textAlign: 'center'}}>Data</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {arrayVendas.map((venda) => {
                            // let image_path = null;
                            // try{
                            //     image_path = require('../../images/produtos/' + produto.nome_arquivo);
                            // } catch{
                            //     image_path = require('../../images/produtos/img_padrao.png');
                            // }
                            
                            return (
                                <tr className="produto" data-venda-id={venda.id_transacao_venda} key={venda.id_transacao_venda} onClick={() => modal(venda.id_transacao_venda)}>
                                    {/* <td style={{ textAlign: 'center' }}><img src={image_path.default} alt="img_venda"/></td> */}
                                    <td style={{ textAlign: 'center' }}>{venda.cod_prod}</td>
                                    <td style={{ textAlign: 'left' }}>{venda.nome_produto}</td>
                                    <td style={{ textAlign: 'left'}}>{venda.nome}</td>
                                    <td style={{ textAlign: 'center' }}>{venda.total_unidade}</td>
                                    <td style={{ textAlign: 'center' }}>{venda.valor_unidade.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'center' }}>{(venda.total_unidade*venda.valor_unidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'center'}}>{venda.data_venda}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                {mostraModal && <VendasModal cod={cod}/>}
            </div>
        </div>
    )
}

export default ListaVendas;