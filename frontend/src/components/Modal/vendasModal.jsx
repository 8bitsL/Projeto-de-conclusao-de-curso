import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useToasts } from 'react-toast-notifications'
// import { useForm } from "react-hook-form";
import { showModal } from '../../action';

import './styleModal.css';


const VendasModal = (props) => {
    const dispatch = useDispatch();
    //const { register, handleSubmit, errors } = useForm();

    const vendas = useSelector(state => state.user.vendas);
    const venda = vendas.filter(venda => venda.id_transacao_venda === props.cod)[0];

    let image_path = null;
    try {
        image_path = require('../../images/produtos/' + venda.nome_arquivo);
    } catch {
        image_path = require('../../images/produtos/img_padrao.png');
    }


    const closeModal = () => {
        dispatch(showModal(false));
    }

    return (
        <div id="closeModal" className="modal-wrapper">
            <div className="modal-container">
                <div className="modal-header">
                    <span className="titulo">Venda</span>

                    <button className="back-home" onClick={closeModal} >
                        <i className="bi  bi-backspace-fill"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="fotoModal">
                    <img id="imagemModal" src={image_path.default} alt="imgProduto" />
                </div>

                    <form>
                        <div>
                            <label className="modal-label">Nome Produto</label>

                            <div className="form-field">
                                <label><i className="bi bi-handbag"></i></label>
                                <input type="text"
                                    defaultValue={venda.nome_produto}
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
                                        defaultValue={venda.total_unidade}
                                        readOnly={true}
                                    />

                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Valor unitário</label>

                                <div className="form-field">
                                    <label><i className="bi bi-cash"></i></label>

                                    <input type="text"
                                        defaultValue={venda.valor_unidade.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Valor da venda</label>

                                <div className="form-field">
                                    <label><i className="bi bi-cash-stack"></i></label>

                                    <input type="text"
                                        defaultValue={(venda.valor_unidade * venda.total_unidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Data da venda</label>

                                <div className="form-field">
                                    <label><i className="bi bi-calendar-day"></i></label>
                                    <input type="text"
                                        defaultValue={venda.data_venda}
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
                                            defaultValue={venda.nome}
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
                                        defaultValue={venda.email}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Telefone cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-telephone"></i></label>
                                    <input type="text"
                                        defaultValue={venda.telefone !== '' ? venda.telefone : 'Usuario sem telefone cadastrado'}
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
                                        defaultValue={venda.estado}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Cidade cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-geo-alt"></i></label>
                                    <input type="text"
                                        defaultValue={venda.cidade}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label className="modal-label">Bairro cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-geo"></i></label>
                                    <input type="text"
                                        defaultValue={venda.bairro}
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
                                        defaultValue={venda.logradouro}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1', maxWidth: '250px' }}>
                                <label className="modal-label">CEP cliente</label>

                                <div className="form-field">
                                    <label><i className="bi bi-signpost-split-fill"></i></label>
                                    <input type="text"
                                        defaultValue={venda.cep}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default VendasModal;