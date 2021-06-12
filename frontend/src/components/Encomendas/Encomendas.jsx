import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { showModal, enviaCod } from '../../action/index'
import { ThunkListEncomendas } from '../../Thunk';
import EncomendasModal from '../Modal/encomendasModal';

import './style.css';

const Encomendas = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const usuario = useSelector(state => state.user.user_dados.user_data);
    const arrayEncomendas = useSelector(state => state.user.encomendas);
    const mostraModal = useSelector(state => state.user.modal);
    const cod = useSelector(state=>state.user.codEnviado);


    arrayEncomendas.sort(function (a, b) {
        if(a.status_pedido === b.status_pedido){
            return 0;
        } else if(a.status_pedido === 'pendente' && b.status_pedido !== 'pendente'){
            return -1;
        } else{
            return 1;
        }
    });

    const modal = (transacao) => {
        if(usuario.tipo_usuario === 'R'){
            dispatch(enviaCod(transacao));
            dispatch(showModal(true));
        }else{
            dispatch(showModal(false))
        }
    }

    const backHome = () => {
        history.push('/app');
    }

    useEffect(() => {
        dispatch(ThunkListEncomendas());
    }, [dispatch]);

    return (
        <div id="encomenda-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Encomendas</h3>

                <span>
                    <button className="back-home" onClick={backHome} ><i className="bi  bi-backspace-fill"></i> Home</button>
                </span>
            </div>

            <div className="scroll-table">
                <div style={{ display: !arrayEncomendas.length ? 'block' : 'none' }} className="msg">Nenhuma encomenda realizada</div>

                <table id="encomendas-wrapper" style={{ display: arrayEncomendas.length ? 'table' : 'none' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}></th>
                            <th style={{ textAlign: 'center' }}>Cód. Produto</th>
                            <th style={{ textAlign: 'left' }}>Produto</th>
                            <th style={{ textAlign: 'center' }}>Quantidade</th>
                            <th style={{ textAlign: 'left' }}>Preço uni.</th>
                            <th style={{ textAlign: 'center' }}>Valor da encomenda</th>
                            <th style={{ textAlign: 'center' }}>{usuario.tipo_usuario === "R" ? 'Cliente' : 'Revendedor'}</th>
                            <th style={{ textAlign: 'center' }}>Status do pedido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrayEncomendas.map((encomenda, index) => {
                                let image_path = null;
                                try{
                                    image_path = require('../../images/produtos/' + encomenda.nome_arquivo);
                                } catch{
                                    image_path = require('../../images/produtos/img_padrao.png'); 
                                }
                            return (
                                <tr className="encomenda" data-encomenda-id={encomenda.numero_transacao} key={index} onClick={()=>modal(encomenda.numero_transacao)}>
                                    <td style={{ textAlign: 'center' }}><img src={image_path.default} alt="img_produto"/></td>
                                    <td style={{ textAlign: 'center' }}>{encomenda.cod_prod}</td>
                                    <td style={{ textAlign: 'left' }}>{encomenda.nome_produto}</td>
                                    <td style={{ textAlign: 'center' }}>{encomenda.total_unidade}</td>
                                    <td style={{ textAlign: 'left' }}>{encomenda.valor_venda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'center' }}>{(encomenda.valor_venda*encomenda.total_unidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'left' }}>{encomenda.nome}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className={"situacao " + encomenda.status_pedido}>
                                            <i title="Aprovada" style={{display: encomenda.status_pedido === 'aprovado' ? 'block' : 'none'}} className="bi bi-bag-check-fill"></i>
                                            <i title="Pendente" style={{display: encomenda.status_pedido === 'pendente' ? 'block' : 'none'}} className="bi bi-bag-dash-fill"></i>
                                            <i title="Cancelada" style={{display: encomenda.status_pedido === 'cancelado' ? 'block' : 'none'}} className="bi bi-bag-x-fill"></i>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
                {mostraModal && <EncomendasModal cod={cod}/>}
        </div>
    )
}

export default Encomendas;