import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { ThunkDelProd, ThunkEstoque, ThunkEncomendas } from '../../Thunk/index'
import { showModal, enviaCod } from '../../action/index'

import ModalProdutos from '../Modal/produtosModal'

import './style.css';

const Estoque = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { addToast } = useToasts();
    
    const mostraModal = useSelector(state => state.user.modal);
    const usuario = useSelector(state => state.user.user_dados.user_data);
    const arrayProdutos = useSelector(state => state.user.produtos);
    const cod = useSelector(state=>state.user.codEnviado);

    function AvisoEstoque() {
        if (usuario.tipo_usuario === 'R') {
            arrayProdutos.forEach(element => {
                if (element.quantidade_unidade <= 5) {
                    const menssagem = element.nome_produto + ' está com apenas ' + element.quantidade_unidade + " unidades em estoque";
                    addToast(menssagem, {
                        appearance: 'warning',
                        autoDismiss: true
                    });
                }
            });
        }

    }
  
    const backHome = () => {
        history.push('/app');
    }

    const modal = (idProduto) => {
        dispatch(enviaCod(idProduto));
        dispatch(showModal(true));
    }

    const addProduto = () =>{
        history.push('/addProduto');
    }

    const deletProd = (e, cod, nome) => {
        const confirm = window.confirm('Deseja excluir este produto?\n\nProduto: '+ nome);
        e.stopPropagation();
        const data = {
            codigo : cod
        }
        if(confirm){
        dispatch(ThunkDelProd(data, (resp) =>{
            if (resp.status === 'success'){
                addToast('Produto excluido com sucesso!', {
                    appearance: 'success',
                    autoDismiss: true
                });

            } else {
              addToast('Falha ao excluir produto', {
                appearance: 'error',
                autoDismiss: true
              });
            }
        }));
        }else{
            addToast('O produto não foi excluido',{
                appearance: 'info',
                autoDismiss: true
            })
        }
    }

    useEffect(() => {
        AvisoEstoque()
        dispatch( usuario.tipo_usuario === 'R' ? ThunkEstoque() : ThunkEncomendas( usuario.id_revendedor ) );
    }, [ dispatch, usuario.tipo_usuario, usuario.id_revendedor]);

    return (
        <div id="estoque-wrapper">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Estoque</h3>

                <span>
                    <button className="back-home" onClick={backHome} ><i className="bi  bi-backspace-fill"></i> Home</button>
                </span>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem', marginBottom: '1rem', display: usuario.tipo_usuario === 'R' ? 'block' : 'none' }}>
                <button onClick={addProduto} className="btn-evento">Novo Produto <i className="bi bi-plus-square-dotted"></i></button>
            </div>

            <div className="scroll-table">
                <div style={{ display: !arrayProdutos.length ? 'block' : 'none' }} className="msg">Nenhum produto cadastrado</div>

                <table id="produtos-wrapper" style={{ display: arrayProdutos.length ? 'table' : 'none' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}></th>
                            <th style={{ textAlign: 'center' }}>Cód. Produto</th>
                            <th style={{ textAlign: 'left' }}>Nome</th>
                            <th style={{ textAlign: 'left', display: usuario.tipo_usuario === "C" ? 'table-cell' : 'none' }}>Revendedor</th>
                            <th style={{ textAlign: 'center' }}>{usuario.tipo_usuario === "R" ? 'Qnt. Unidade' : 'Qnt. Estoque'}</th>
                            <th style={{ textAlign: 'center', display: usuario.tipo_usuario === "R" ? 'table-cell' : 'none' }}>Valor Compra</th>
                            <th style={{ textAlign: 'center' }}>{usuario.tipo_usuario === "R" ? 'Valor Venda' : 'Preço'}</th>
                            <th style={{ textAlign: 'center', display: usuario.tipo_usuario === "R"? 'table-cell' : 'none' }}>Exluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrayProdutos.map((produto) => {
                            let image_path = null;
                            try{
                                image_path = require('../../images/produtos/' + produto.nome_arquivo);
                            } catch{
                                image_path = require('../../images/produtos/img_padrao.png');
                            }
                            
                            return (
                                <tr className="produto" data-produto-id={produto.cod_prod} key={produto.cod_prod} onClick={() => modal(produto.cod_prod)}>
                                    <td style={{ textAlign: 'center' }}><img src={image_path.default} alt="img_produto"/></td>
                                    <td style={{ textAlign: 'center' }}>{produto.cod_prod}</td>
                                    <td style={{ textAlign: 'left' }}>{produto.nome_produto}</td>
                                    <td style={{ textAlign: 'left', display: usuario.tipo_usuario === "C" ? 'table-cell' : 'none' }}>{usuario.nome_revendedor}</td>
                                    <td style={{ textAlign: 'center' }}>{produto.quantidade_unidade}</td>
                                    <td style={{ textAlign: 'center', display: usuario.tipo_usuario === "R" ? 'table-cell' : 'none' }}>{produto.valor_compra.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'center' }}>{produto.valor_venda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ textAlign: 'center', display: usuario.tipo_usuario === "R"? 'table-cell' : 'none' }} onClick={(e) => deletProd(e, produto.cod_prod, produto.nome_produto)}>
                                        <div className="trash">
                                            <i className="trashColor bi bi-trash-fill" ></i>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                {mostraModal && <ModalProdutos cod={cod}/>}
            </div>
        </div>
    )
}

export default Estoque;