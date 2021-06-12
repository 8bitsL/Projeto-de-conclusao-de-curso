import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications'
import { useForm } from "react-hook-form";
import { showModal } from '../../action';
import { ThunkAltCliente } from '../../Thunk/index'
import './styleModal.css';

const ClientesModal = (props) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const { register, handleSubmit, setValue, errors } = useForm();

    const clientes = useSelector(state => state.user.clientes);
    const cliente = clientes.filter(cliente => cliente.id_usuario === props.cod)[0];


    const validationEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // let image_path = null;
    // try {
    //     image_path = require('../../images/produtos/' + prod.nome_arquivo);
    // } catch {
    //     image_path = require('../../images/produtos/img_padrao.png');
    // }

    const editCliente = (data, event) => {
        dispatch(ThunkAltCliente(data, (resp) => {
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
    };

    const closeModal = () => {
        dispatch(showModal(false));
    }
    useEffect(() => {
        setValue('estadoRegister', cliente.estado);
    }, [setValue, cliente.estado]);

    return (
        <div id="closeModal" className="modal-wrapper">
            <div className="modal-container">
                <div className="modal-header">
                    <span className="titulo">Cliente</span>

                    <button className="back-home" onClick={closeModal} >
                        <i className="bi  bi-backspace-fill"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {/* <div className="fotoModal">
                        <img id="imagemModal" src={image_path.default} alt="imgProduto" />
                    </div> */}

                    <form>
                        <div className="form-field" style={{ display: 'none' }}>
                            <input type="text"
                                name="idUser"
                                defaultValue={cliente.id_usuario}
                                ref={register({ required: false })}
                            />
                        </div>
                        <div style={{ flex: '1', paddingRight: '10px' }}>
                            <label htmlFor="nome-cliente" className="modal-label">Nome</label>

                            <div className="form-field">
                                <label htmlFor="nome-cliente"><i className="bi bi-person-fill"></i></label>

                                <input type="text"
                                    className={errors.clienteRegister ? 'error' : ''}
                                    id="name-cliente"
                                    name="clienteRegister"
                                    placeholder="Nome do cliente"
                                    defaultValue={cliente.nome}
                                    ref={register({ required: true, minLength: 3 })}
                                />

                                {errors.clienteRegister && <div className="error-validate">Nome é obrigatório</div>}
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="apelido-register" className="modal-label">Apelido</label>

                                <div className="form-field">
                                    <label htmlFor="apelido-register"><i className="bi bi-person"></i></label>

                                    <input type="text"
                                        className={errors.apelidoRegister ? 'error' : ''}
                                        id="apelido-register"
                                        name="apelidoRegister"
                                        placeholder="Apelido"
                                        defaultValue={cliente.apelido}
                                        ref={register({ required: true, minLength: 2 })}
                                    />

                                    {errors.apelidoRegister && <div className="error-validate">Apelido é obrigatório</div>}
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="email-register" className="modal-label">Email</label>

                                <div className="form-field">
                                    <label htmlFor="email-register"><i className="bi bi-envelope"></i></label>

                                    <input type="text"
                                        className={errors.emailRegister ? 'error' : ''}
                                        id="email-register"
                                        name="emailRegister"
                                        placeholder="Email"
                                        defaultValue={cliente.email}
                                        ref={register({ required: true, pattern: validationEmail })}
                                    />

                                    {errors.emailRegister && <div className="error-validate">O email é obrigatório</div>}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="cpf-cnpj-register" className="modal-label">CPF/CNPJ</label>

                                <div className="form-field">
                                    <label htmlFor="cpf-cnpj-register"><i className="bi bi-person-bounding-box"></i></label>

                                    <input type="text"
                                        className={errors.cpfCnpj ? 'error' : ''}
                                        id="cpf-cnpj-register"
                                        name="cpfCnpj"
                                        placeholder="CPF/CNPJ"
                                        defaultValue={cliente.cpf_cnpj}
                                        ref={register({ required: true, minLength: 11, maxLength: 14 })}
                                    />
                                    {errors.cpfCnpj && <div className="error-validate">CPF/CNPJ são obrigatórios</div>}
                                </div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="dataNasc-register" className="modal-label">Data de nascimento</label>

                                <div className="form-field">
                                    <label htmlFor="dataNas-register"><i className="bi bi-calendar-day"></i></label>

                                    <input type="date"
                                        className={errors.dataNasRegister ? 'error' : ''}
                                        id="dataNasc-register"
                                        name="dataNasRegister"
                                        placeholder="Data de nascimento"
                                        defaultValue={cliente.data_nascimento}
                                        ref={register({ required: true })}
                                    />

                                    {errors.dataNasRegister && <div className="error-validate">Data de nacimento é obrigatório</div>}
                                </div>
                            </div>

                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="telefone-register" className="modal-label">Telefone</label>

                                <div className="form-field">
                                    <label htmlFor="telefone-register"><i className="bi bi-telephone"></i></label>

                                    <input type="text"
                                        className={errors.telefoneRegister ? 'error' : ''}
                                        id="telefone-register"
                                        name="telefoneRegister"
                                        placeholder="Telefone"
                                        defaultValue={cliente.telefone_usuario}
                                        ref={register({ required: true })}
                                    />

                                    {errors.telefoneRegister && <div className="error-validate">Telefone é obrigatório</div>}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="estado-register" className="modal-label">Estado</label>
                                <div className="form-field">
                                    <label htmlFor="estado-register">
                                        <i className="bi bi-building"></i>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </label>

                                    <select name="estadoRegister"
                                        className={errors.estadoRegister ? 'error' : ''}
                                        id="estado-register"
                                        ref={register({ required: true, validate: value => value !== '0' || 'error message' })}
                                    >

                                        <option value="0">Estado</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                        <option value="EX">Estrangeiro</option>
                                    </select>

                                    {errors.estadoRegister && <div className="error-validate">Estado é obrigatório</div>}
                                </div>
                            </div>

                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="cidade-register" className="modal-label">Cidade</label>

                                <div className="form-field">
                                    <label htmlFor="cidade-register"><i className="bi bi-geo-alt"></i></label>

                                    <input type="text"
                                        className={errors.cidadeRegister ? 'error' : ''}
                                        id="cidade-register"
                                        name="cidadeRegister"
                                        placeholder="Cidade"
                                        defaultValue={cliente.cidade}
                                        ref={register({ required: true, minLength: 1 })}
                                    />

                                    {errors.cidadeRegister && <div className="error-validate">Cidade é obrigatório</div>}
                                </div>
                            </div>

                            <div style={{ flex: '1' }}>
                                <label htmlFor="bairro-register" className="modal-label">Bairro</label>

                                <div className="form-field">
                                    <label htmlFor="bairro-register"><i className="bi bi-geo"></i></label>

                                    <input type="text"
                                        className={errors.bairroRegister ? 'error' : ''}
                                        id="bairro-register"
                                        name="bairroRegister"
                                        placeholder="Bairro"
                                        defaultValue={cliente.bairro}
                                        ref={register({ required: true })}
                                    />

                                    {errors.bairroRegister && <div className="error-validate">Bairro é obrigatório</div>}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1', paddingRight: '10px' }}>
                                <label htmlFor="logradouro-register" className="modal-label">Endereço</label>

                                <div className="form-field">
                                    <label htmlFor="logradouro-register"><i className="bi bi-house-door"></i></label>

                                    <input type="text"
                                        className={errors.logradouroRegister ? 'error' : ''}
                                        id="logradouro-register"
                                        name="logradouroRegister"
                                        placeholder="Endereço"
                                        defaultValue={cliente.logradouro}
                                        ref={register({ required: true })}
                                    />

                                    {errors.logradouroRegister && <div className="error-validate">Endereço é obrigatório</div>}
                                </div>
                            </div>
                            <div style={{ flex: '1', maxWidth: '200px' }}>
                                <label htmlFor="cep-register" className="modal-label">CEP</label>

                                <div className="form-field">
                                    <label htmlFor="cep-register"><i className="bi bi-signpost-split-fill"></i></label>

                                    <input type="text"
                                        className={errors.cepRegister ? 'error' : ''}
                                        id="cep-register"
                                        name="cepRegister"
                                        placeholder="CEP"
                                        defaultValue={cliente.cep}
                                        ref={register({ required: true })}
                                    />

                                    {errors.cepRegister && <div className="error-validate">CEP é obrigatório</div>}
                                </div>
                            </div>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div style={{flex: '1', paddingRight:"10px", maxWidth:"200px"}}>
                            <label htmlFor="numero-register" className="modal-label">Número</label>

                            <div className="form-field">
                                <label htmlFor="numero-register"><i className="bi bi-geo-alt-fill"></i></label>

                                <input type="text"
                                    className={errors.numeroRegister ? 'error' : ''}
                                    id="numero-register"
                                    name="numeroRegister"
                                    placeholder="Número"
                                    defaultValue={cliente.numero}
                                    ref={register({ required: true })}
                                />
                                {errors.numeroRegister && <div className="error-validate">Número é obrigatório</div>}
                            </div>
                            </div>
                            <div style={{flex: '1'}}>
                            <label htmlFor="dataCad-register" className="modal-label">Data de cadastro</label>

                            <div className="form-field">
                                <label htmlFor="dataCad-register"><i className="bi bi-calendar-day"></i></label>

                                <input type="text"
                                    id="dataCad-register"
                                    name="dataCadRegister"
                                    placeholder="Data de cadastro"
                                    defaultValue={cliente.data_cadastro}
                                    readOnly={true}
                                />
                            </div>
                            </div>
                        </div>

                        {/* <div>
                                <label htmlFor="igm-register" className="modal-label">Imagem Produto</label>

                                <div className="form-field">
                                    <label htmlFor="igm-register"><i className="bi bi-file-image"></i></label>

                                    <input type="file"
                                        id="igm-register"
                                        name="imgRegister"
                                        placeholder="editCliente"
                                        accept="image/*"
                                        readOnly={usuario.tipo_usuario === 'C' ? true : false}
                                        ref={register()}
                                    />
                                </div>
                            </div> */}


                        <div className="form-submit">
                            <button id="login-action" onClick={handleSubmit(editCliente)}>ALTERAR DADOS</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default ClientesModal;