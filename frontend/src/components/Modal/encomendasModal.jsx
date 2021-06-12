import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications'
import { useForm } from "react-hook-form";
import { showModal } from '../../action';

import './styleModal.css';
import { ThunkFinalizarVenda } from '../../Thunk';


const EncomendasModal = (props) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const { register, handleSubmit } = useForm();

    const clientes = useSelector(state => state.user.clientes);
    const encomendas = useSelector(state => state.user.encomendas);
    const encomenda = encomendas.filter(encomenda => encomenda.numero_transacao === props.cod)[0];
    const cliente = clientes.filter(cliente => cliente.id_usuario === encomenda.id_usuario)[0];

    let verificaSituacao = null
    let situacao = '';

    if(cliente)verificaSituacao = cliente.situacao_financeira


    if (verificaSituacao !== null) {
        if (verificaSituacao.situacao_financeira === 1) {
            situacao = 'negativa';
        } 
        if(verificaSituacao.situacao_financeira === 0) {
            situacao = 'positiva'
        }
    }else{
        situacao = null
    }

    const finalizarEncomenda = (data, event) => {
        const situacaoEncomenda = event.target.getAttribute('data-situacao-encomenda');

        const dados = {
            quantidadeEstoque: encomenda.quantidade_unidade,
            valorTotal: encomenda.valor_encomenda,
            idEncomenda: encomenda.numero_transacao,
            codProduto: encomenda.cod_prod,
            idRevendedor: encomenda.id_revendedor,
            statusPedido: situacaoEncomenda,
            idUsuario: encomenda.id_usuario
        }

        const newData = { ...dados, ...data }

        console.log(newData)
        dispatch(ThunkFinalizarVenda(newData, (resp) => {
            if (resp.status === 'success') {
                addToast(resp.message, {
                    appearance: 'success',
                    autoDismiss: true
                });

            } else {
                addToast(resp.message, {
                    appearance: 'error',
                    autoDismiss: true
                });
            }
        }));
    }

    const closeModal = () => {
        dispatch(showModal(false));
    }

    return (
        <div id="closeModal" className="modal-wrapper">
            <div className="modal-container">
                <div className="modal-header">
                    <span className="titulo">Encomenda</span>

                    <button className="back-home" onClick={closeModal} >
                        <i className="bi  bi-backspace-fill"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <form>
                        <div>
                            <label className="modal-label">Nome Produto</label>

                            <div className="form-field">
                                <label><i className="bi bi-handbag"></i></label>
                                <input type="text"
                                    defaultValue={encomenda.nome_produto}
                                    readOnly={true}
                                />
                            </div>

                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Quantidade</label>

                                <div className="form-field">
                                    <label><i className="bi bi-box-seam"></i></label>
                                    <input type="text"
                                        id="totalRegister"
                                        defaultValue={encomenda.total_unidade}
                                        name="totalUnidade"
                                        ref={register({ required: false })}
                                        readOnly={true}
                                    />

                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Valor unitário</label>

                                <div className="form-field">
                                    <label><i className="bi bi-cash"></i></label>

                                    <input type="text"
                                        defaultValue={encomenda.valor_venda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Valor da encomenda</label>

                                <div className="form-field">
                                    <label><i className="bi bi-cash-stack"></i></label>
                                    <input type="text"
                                        id="valor-total"
                                        defaultValue={(encomenda.valor_venda * encomenda.total_unidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Data da encomenda</label>

                                <div className="form-field">
                                    <label><i className="bi bi-calendar-day"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.data_encomenda}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ flex: '1' }}>

                                <label className="modal-label">Cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-person"></i></label>

                                    <input type="text"
                                        defaultValue={encomenda.nome}
                                        readOnly={true}
                                    />
                                </div>

                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Email cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-envelope"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.email}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Telefone cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-telephone"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.telefone !== '' ? encomenda.telefone : 'Usuario sem telefone cadastrado'}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', maxWidth: '150px' }}>
                                <label className="modal-label">Estado cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-map"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.estado}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Cidade cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-geo-alt"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.cidade}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Bairro cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-geo"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.bairro}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Endereço cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-house-door"></i></label>
                                    <input type="text"
                                        defaultValue={encomenda.logradouro}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1', maxWidth: '250px' }}>
                                <label className="modal-label">Situacao cliente</label>

                                <div className="form-field">
                                    <label>
                                        <i className={ situacao === 'negativa' ? 'bi bi-hand-thumbs-down-fill' : 'bi bi-hand-thumbs-up-fill' }></i>
                                    </label>
                                    <input type="text"
                                        defaultValue={situacao !== null ? situacao === 'positiva' ? 'Cliente não tem débitos' : 'Cliente tem débitos' : 'Cliente não tem débitos'}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{display: encomenda.status_pedido === 'pendente' ? 'flex' : 'none'}}>
                            <div style={{flex: '1', paddingRight: '5px'}}>
                                <div className="form-submit aceitaEncomenda">
                                   
                                    <button data-situacao-encomenda="aprovado"
                                        id="login-action" onClick={handleSubmit(finalizarEncomenda)}>ACEITAR ENCOMENDA</button>
                                </div>
                            </div>

                            <div style={{flex: '1'}}>
                                <div className="form-submit">
                                    <button data-situacao-encomenda="cancelado"
                                        id="login-action" onClick={handleSubmit(finalizarEncomenda)}>RECUSAR ENCOMENDA</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EncomendasModal;