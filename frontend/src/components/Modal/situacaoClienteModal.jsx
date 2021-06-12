import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications'
import { useForm } from "react-hook-form";
import { modalSituacao } from '../../action';
import { ThunkAltSituacao} from '../../Thunk/index'
import './styleModal.css';

const SituacaoCliente = (props) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const { register, handleSubmit, setValue, errors } = useForm();

    const clientes = useSelector(state => state.user.clientes);
    const encomendas = useSelector(state => state.user.encomendas);

    
    const cliente = clientes.filter(cliente => cliente.id_usuario === props.cod)[0];
    const encomenda  = encomendas.filter(encomenda => encomenda.id_usuario === props.cod)[0];

    let situacaoDefault = 0;
    let Encomenda = null;
    let idTransacao = null;

    if(encomenda){
        Encomenda = encomenda.status_pedido === "aprovado" ? encomenda : Encomenda = null;
        idTransacao = encomenda.numero_transacao !== null ?  encomenda.numero_transacao : null
    }

    if(cliente.situacao_financeira !== null) situacaoDefault = cliente.situacao_financeira.situacao_financeira

    const Situacao = cliente.situacao_financeira !== null ? cliente.situacao_financeira : '...';

    const AlteraSituacao = (data) => {
    //    event.target.setAttribute('disabled', 'disabled');
        const idUser = cliente.id_usuario

        const newData = {...data, idTransacao, idUser}
        dispatch(ThunkAltSituacao(newData, (resp) => {
            if (resp.status === 'success') {
                addToast(resp.message, {
                    appearance: 'success',
                    autoDismiss: true
                });

            } else {
                //   event.target.removeAttribute('disabled');

                addToast(resp.message, {
                    appearance: 'error',
                    autoDismiss: true
                });
            }
        }));
    };

    const closeModal = () => {
        dispatch(modalSituacao(false));
    }
    useEffect(() => {
        setValue('situacaoRegister', situacaoDefault);
    }, [setValue, situacaoDefault]);

    return (
        <div id="closeModal" className="modal-wrapper">
            <div className="modal-container">
                <div className="modal-header">
                    <span className="titulo">Situação Cliente</span>

                    <button className="back-home" onClick={closeModal} >
                        <i className="bi  bi-backspace-fill"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <form>
                        <div style={{ flex: '1', paddingRight: '10px' }}>
                            <label htmlFor="nome-cliente" className="modal-label">Nome</label>

                            <div className="form-field">
                                <label htmlFor="nome-cliente"><i className="bi bi-person-fill"></i></label>

                                <input type="text"
                                    defaultValue={cliente.nome}
                                    readOnly={true}
                                />
                            </div>

                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="apelido-register" className="modal-label">Apelido</label>

                                <div className="form-field">
                                    <label htmlFor="apelido-register"><i className="bi bi-person"></i></label>

                                    <input type="text"
                                        defaultValue={cliente.apelido}
                                        readOnly={true}
                                      
                                    />

                                   
                                </div>
                            </div>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="situacao-register" className="modal-label">Situação do cliente</label>
                                <div className="form-field">
                                    <label htmlFor="situacao-register">
                                        <i className={situacaoDefault === 1 ? 'bi bi-hand-thumbs-down-fill' : 'bi bi-hand-thumbs-up-fill'}></i>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </label>

                                    <select name="situacaoRegister"
                                        className={errors.situacaoRegister ? 'error' : ''}
                                        id="situacao-register"
                                        ref={register({ required: true })}
                                    >

                                        <option value="">Situação</option>
                                        <option value="0">Sem dividas</option>
                                        <option value="1">Inadimplente</option>
                                    </select>

                                    {errors.situacaoRegister && <div className="error-validate">Situação é obrigatório</div>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="observacao-register" className="modal-label">Observação do revendedor</label>

                            <div className="form-field">
                                <label htmlFor="observacao-register"><i className="bi bi-tags"></i></label>

                                <input type="text"
                                    className={errors.observacaoRegister ? 'error' : ''}
                                    id="observacao-register"
                                    name="observacaoRegister"
                                    placeholder="Observações"
                                    defaultValue={ Situacao.obs_revendedor} 
                                    ref={register({ required: true })}
                                />
                                {errors.observacaoRegister && <div className="error-validate">Observações são obrigatórias</div>}
                            </div>
                        </div>




                        <div style={{ display: 'flex' }}>

                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="dataDivida-register" className="modal-label">Data da encomenda</label>

                                <div className="form-field">
                                    <label htmlFor="dataDivida-register"><i className="bi bi-calendar-day"></i></label>

                                    <input type="text"
                                        className={errors.dataDividaRegister ? 'error' : ''}
                                        id="dataDivida-register"
                                        name="dataDividaRegister"
                                        placeholder="Data da divida"
                                        defaultValue={ Encomenda !== null ? Encomenda.data_encomenda : null }
                                        ref={register({ required: false })}
                                        readOnly={true}
                                    />

                                    {errors.dataDividaRegister && <div className="error-validate">Data da divida é obrigatória</div>}
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="dataPag-register" className="modal-label">Data de pagamento</label>

                                <div className="form-field">
                                    <label htmlFor="dataPag-register"><i className="bi bi-calendar-day"></i></label>

                                    <input type="dateime"
                                        id="dataPag-register"
                                        name="dataPagRegister"
                                        placeholder="Data de pagamento"
                                        defaultValue={ Situacao.data_pagamento }
                                        ref={register({ required: false })}
                                    />
                                </div>
                            </div>

                        </div>
                        <div style={{ display: 'flex' }}>

                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="valorEncomenda-register" className="modal-label">Valor da encomenda</label>

                                <div className="form-field">
                                    <label htmlFor="valorEncomenda-register"><i className="bi bi-cash"></i></label>

                                    <input type="text"
                                        id="valorEncomenda-register"
                                        name="valorEncomendaRegister"
                                        placeholder="Valor da encomenda"
                                        defaultValue={Encomenda !== null ? Encomenda.valor_encomenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : null }
                                        readOnly={true}
                                        ref={register({ required: false })}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="qntProduto-register" className="modal-label">Quantidade de produtos</label>

                                <div className="form-field">
                                    <label htmlFor="qntProduto-register"><i className="bi bi-box-seam"></i></label>

                                    <input type="number"
                                        id="qntProduto-register"
                                        name="qntProdutoRegister"
                                        placeholder="Quantidade de produtos"
                                        readOnly={true}
                                        defaultValue={ Encomenda !== null ? Encomenda.total_unidade : null }
                                        ref={register({ required: false })}
                                    />
                                </div>
                            </div>

                        </div>
                        <div>
                            <label htmlFor="nomeProduto-register" className="modal-label">Nome do produto</label>

                            <div className="form-field">
                                <label htmlFor="nomeProduto-register"><i className="bi bi-handbag"></i></label>

                                <input type="text"
                                    id="nomeProduto-register"
                                    name="nomeProdutoRegister"
                                    placeholder="Nome do produto"
                                    readOnly={true}
                                    defaultValue={Encomenda !== null ? Encomenda.nome_produto : null}
                                    ref={register({ required: false })}
                                />
                            </div>
                        </div>

                        <div className="form-submit">
                            <button id="login-action" onClick={handleSubmit(AlteraSituacao)}>ALTUALIZAR SITUAÇÃO</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default SituacaoCliente;