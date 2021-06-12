import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications'
import { useForm } from "react-hook-form";
import { showModal } from '../../action';

import './styleModal.css';

import { ThunkAltProd, ThunkAddEncomendas } from '../../Thunk/index';

const ModalProdutos = (props) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const { register, handleSubmit, errors } = useForm();
    const [ valorTotalVenda, setValorTotalVenda ] = useState(0);
    
    const usuario = useSelector(state => state.user.user_dados.user_data);
    const produtos = useSelector(state => state.user.produtos);
    const prod = produtos.filter(produto => produto.cod_prod === props.cod)[0];
    

    // let image_path = null;
    // try {
    //     image_path = require('../../images/produtos/' + prod.nome_arquivo);
    // } catch {
    //     image_path = require('../../images/produtos/img_padrao.png');
    // }

    const salvarProduto = (data, event) => {
        event.target.setAttribute('disabled', 'disabled');

        data.imgRegister && data.imgRegister.length 
        ? data.imgRegister = data.imgRegister[0] 
        : data.imgRegister = null;

        data.codProd = prod.cod_prod;

        dispatch(ThunkAltProd(data, (resp) => {
            if (resp.status === 'success') {
                addToast(resp.message, {
                    appearance: 'success',
                    autoDismiss: true
                });

                event.target.removeAttribute('disabled');

            } else {
                addToast(resp.message, {
                    appearance: 'error',
                    autoDismiss: true
                });
            }
        }));
    };
    
    const encomendarProduto = (data, event) => {
        console.log(data);
        event.target.setAttribute('disabled', 'disabled');

        data.codProd = prod.cod_prod;
        data.idRevendedor = usuario.id_revendedor;
        data.valorEncomenda = (data.valorVendaRegister * data.quantidadeEncomendaRegister);

        dispatch(ThunkAddEncomendas(data, (resp) => {
            if (resp.status === 'success') {
                event.target.removeAttribute('disabled');
                addToast(resp.message, {
                    appearance: 'success',
                    autoDismiss: true
                });

            } else {
                event.target.removeAttribute('disabled');
                addToast(resp.message, {
                    appearance: 'error',
                    autoDismiss: true
                });
            }
        }));
    };

    const closeModal = () => {
        dispatch(showModal(false));
    }

    return (
        <div id="closeModal" className="modal-wrapper">
            <div className="modal-container">
                <div className="modal-header">
                    <span className="titulo">Produto</span>

                    <button className="back-home" onClick={closeModal} >
                        <i className="bi  bi-backspace-fill"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {/* <div className="fotoModal">
                        <img id="imagemModal" src={image_path.default} alt="imgProduto" />
                    </div> */}

                    <form>
                        <div>
                            <label htmlFor="name-register" className="modal-label">Nome Produto</label>

                            <div className="form-field">
                                <label htmlFor="produto-register"><i className="bi bi-handbag"></i></label>

                                <input type="text"
                                    className={errors.nameRegister ? 'error' : ''}
                                    id="name-register"
                                    name="produtoRegister"
                                    placeholder="Nome do produto"
                                    defaultValue={prod.nome_produto}
                                    readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                    ref={register({ required: true, minLength: 3 })}
                                />

                                {errors.produtoRegister && <div className="error-validate">Nome é obrigatório</div>}
                            </div>

                        </div>

                        <div>
                            <label htmlFor="descricao-register" className="modal-label">Descrição Produto</label>

                            <div className="form-field">
                                <label htmlFor="descricao-register"><i className="bi-journal-text"></i></label>

                                <input type="text"
                                    className={errors.descricaoRegister ? 'error' : ''}
                                    id="descricao-register"
                                    name={"descricaoRegister"}
                                    placeholder="Descrição do produto"
                                    defaultValue={prod.descricao_produto}
                                    readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                    ref={register({ required: true, minLength: 2 })}
                                />

                                {errors.descricaoRegister && <div className="error-validate">A descrição do produto é obrigatória</div>}
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="descEmbalagem-register" className="modal-label">Descrição Embalagem</label>

                                <div className="form-field">
                                    <label htmlFor="descEmbalagem-register"><i className="bi bi-box-seam"></i></label>

                                    <input type="text"
                                        className={errors.emailRegister ? 'error' : ''}
                                        id="descEmbalagem-register"
                                        name="descEmbalagem"
                                        placeholder="Descrição da embalagem"
                                        defaultValue={prod.descricao_embalagem}
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register({ required: true })}
                                    />

                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label htmlFor="valorVenda-register" className="modal-label">
                                    {usuario.tipo_usuario === 'R' ? 'Valor de Venda' : 'Valor do Produto'}
                                </label>

                                <div className="form-field">
                                    <label htmlFor="valorVenda-register"><i className="bi bi-cash"></i></label>

                                    <input type="number"
                                        className={errors.valorVendaRegister ? 'error' : ''}
                                        id="valorVenda-register"
                                        name="valorVendaRegister"
                                        placeholder="Valor de venda do produto"
                                        defaultValue={prod.valor_venda}
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register({ required: false, minLength: 1 })}
                                    />

                                    {errors.valorVendaRegister && <div className="error-validate">O valor de venda do produto é obrigatório</div>}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', display: usuario.tipo_usuario === 'R' ? 'block' : 'none'}}>
                                <label htmlFor="valorCompra-register" className="modal-label">Valor de Compra</label>

                                <div className="form-field">
                                    <label htmlFor="valorCompra-register">
                                        <i className="bi bi-cash-stack"></i>
                                    </label>

                                    <input type="number"
                                        className={errors.valorCompraRegister ? 'error' : ''}
                                        id="valorCompra-register"
                                        name="valorCompraRegister"
                                        placeholder="Valor de compra do produto"
                                        defaultValue={prod.valor_compra}
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register({ required: true })}
                                    />

                                    {errors.valorCompraRegister && <div className="error-validate">Valor de compra do produto é obrigatório</div>}
                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label htmlFor="tipoProdRegister" className="modal-label">Categoria</label>

                                <div className="form-field">
                                    <label htmlFor="tipoProdRegister">
                                        <i className="bi bi-bar-chart-steps"></i>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </label>

                                    {usuario.tipo_usuario === 'R' 
                                    ? (
                                    <select name="tipoProdRegister"
                                    className={errors.tipoProdRegister ? 'error' : ''}
                                    id="tipoProd-register"
                                    defaultValue={prod.tipo_produto}
                                    ref={register({ required: true, validate: value => value !== '0' || 'error message' })}
                                    >
                                    <option value="0">Categoria</option>
                                    <option value="Higiene e Beleza">Higiene e Beleza</option>
                                    <option value="Limpeza">Limpeza</option>
                                    <option value="Perfumaria">Perfumaria</option>
                                    <option value="Outros">Outros</option>
                                    </select>
                                    ) 
                                    : (
                                    <input type="text"
                                    id="tipoProd-register"
                                    name="tipoProdRegister"
                                    defaultValue={prod.tipo_produto}
                                    readOnly
                                    ref={register()}
                                    />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{display: usuario.tipo_usuario === 'C' ? 'flex' : 'block'}}>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="quantidade-register" className="modal-label">
                                    {usuario.tipo_usuario === 'R' ? 'Quantidade em estoque' : 'Qtd. em Estoque'}
                                </label>

                                <div className="form-field">
                                    <label htmlFor="quantidade-register"><i className="bi bi-plus-square"></i></label>

                                    <input type="number"
                                        className={errors.quantidadeRegister ? 'error' : ''}
                                        id="quantidade-register"
                                        name="quantidadeRegister"
                                        placeholder="Quantidade em estoque"
                                        defaultValue={prod.quantidade_unidade}
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register({ required: true, minLength: 1 })}
                                    />
                                    {errors.quantidadeRegister && <div className="error-validate">Quantidade é obrigatório</div>}
                                </div>
                            </div>

                            <div style={{ flex: '1', display: usuario.tipo_usuario === 'R' ? 'none' : 'block' }}>
                                <label htmlFor="quantidade-encomenda-register" className="modal-label">
                                    Quantidade Encomenda
                                </label>

                                <div className="form-field">
                                    <label htmlFor="quantidade-encomenda-register"><i className="bi bi-plus-square"></i></label>

                                    <input type="number"
                                        className={errors.quantidadeEncomendaRegister ? 'error' : ''}
                                        id="quantidade-encomenda-register"
                                        name="quantidadeEncomendaRegister"
                                        placeholder="Quantidade encomenda"
                                        onClick={(e) => {
                                            const val = document.getElementById("quantidade-encomenda-register").value;
                                            setValorTotalVenda((prod.valor_venda * val))
                                        }}
                                        max={prod.quantidade_unidade}
                                        min="1"
                                        readOnly={usuario.tipo_usuario === 'R' ? true : false}
                                        ref={register(usuario.tipo_usuario === 'C' ? { required: true, min: 1, max: prod.quantidade_unidade} : {})}
                                    />

                                    {errors.quantidadeEncomendaRegister && <div className="error-validate">Quantidade de produtos é obrigatório ser entre 1 e {prod.quantidade_unidade}</div>}
                                </div>
                            </div>

                            <div style={{display: usuario.tipo_usuario === 'R' ? 'block' : 'none'}}>
                                <label htmlFor="igm-register" className="modal-label">Imagem Produto</label>

                                <div className="form-field">
                                    <label htmlFor="igm-register"><i className="bi bi-file-image"></i></label>

                                    <input type="file"
                                        id="igm-register"
                                        name="imgRegister"
                                        placeholder="Teste"
                                        accept="image/*"
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-field" style={{display: usuario.tipo_usuario === 'C' ? 'block' : 'none', textAlign: 'right', fontSize: '1.5rem'}}>
                            <span>Valor Total: {valorTotalVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    
                        <div className="form-submit">
                            <button id="login-action"
                                    readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                    style={{display: usuario.tipo_usuario === 'R' ? 'block' : 'none'}}
                                    onClick={handleSubmit(salvarProduto)}
                            >
                                    SALVAR PRODUTO
                            </button>
                            
                            <button id="login-action"
                                    readOnly={usuario.tipo_usuario === 'R' ? true : false}
                                    style={{display: usuario.tipo_usuario === 'C' ? 'block' : 'none'}}
                                    onClick={handleSubmit(encomendarProduto)}
                            >
                                    ENCOMENDAR PRODUTO
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalProdutos;