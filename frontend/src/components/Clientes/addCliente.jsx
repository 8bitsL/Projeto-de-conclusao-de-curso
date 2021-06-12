import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'

import { ThunkAddNewCliente } from '../../Thunk/index';



const AddCliente = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.user.user_dados.user_data);
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm();

  const { addToast } = useToasts();
  const backClientes = () => history.push('/clientes');

  const [isHidden, setPasswordView] = useState(true);
  const onTooglePsw = () => { setPasswordView(!isHidden); };

  const validationEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validationPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
  

  const onSubmit = (data, event) => {
    event.target.setAttribute('disabled', 'disabled');

    const userDados = { idRevendedor:usuario.id_usuario, nomeRevendedor:usuario.nome }

    const dados = {...userDados, ...data }

    dispatch(ThunkAddNewCliente(dados, (resp)=>{
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
    }))
  };

    return (
    <div id="adicionar-cliente-wrapper">
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3>Novo Cliente</h3>

            <span>
                <button className="back-home" onClick={backClientes}>
                    <i className="bi  bi-backspace-fill"></i> Clientes
                </button>
            </span>
        </div>

        <form>
        <div className="form-field">
        <label htmlFor="name-register"><i className="bi bi-person-fill"></i></label>

        <input type="text"
           className={errors.nameRegister ? 'error' : ''}
           id="name-register"
           name="nameRegister"
           placeholder="Nome"
           ref={register({ required: true, minLength: 3, message: 'hahaha' })}
        />

        {errors.nameRegister && <div className="error-validate">Nome é obrigatório</div>}
        </div>

        <div className="form-field">
        <label htmlFor="apelido-register"><i className="bi bi-person"></i></label>

        <input type="text"
           className={errors.apelidoRegister ? 'error' : ''}
           id="apelido-register"
           name="apelidoRegister"
           placeholder="Apelido"
           ref={register({ required: true, minLength: 4 })}
        />

        {errors.apelidoRegister && <div className="error-validate">Apelido é obrigatório</div>}
        </div>

        <div className="form-field">
        <label htmlFor="cpf-cnpj-register"><i className="bi bi-person-bounding-box"></i></label>

        <input type="text"
           className={errors.cpfCnpjRegister ? 'error' : ''}
           id="cpf-cnpj-register"
           name="cpfCnpjRegister"
           placeholder="CPF / CNPJ"
           ref={register({ required: true, minLength: 11, maxLength: 14 })}
        />

        {errors.cpfCnpjRegister && <div className="error-validate">CPF ou CNPJ é obrigatório</div>}
        </div>

        <div className="form-field">
        <label htmlFor="email-register"><i className="bi bi-envelope-fill"></i></label>

        <input type="text"
           className={errors.emailRegister ? 'error' : ''}
           id="email-register"
           name="emailRegister"
           placeholder="E-mail"
           ref={register({ required: true, pattern: validationEmail })}
        />

        {errors.emailRegister && <div className="error-validate">Email é obrigatório</div>}
        </div>

        <div className="form-field">
        <label htmlFor="psw-register"><i className="bi bi-lock-fill"></i></label>
        <i className={isHidden ? 'bi bi-eye' : 'bi bi-eye-slash'} onClick={onTooglePsw}></i>

        <input type={isHidden ? 'password' : 'text'} autoComplete="off"
           className={errors.pswdRegister ? 'error' : ''}
           id="psw-register"
           name="pswdRegister"
           placeholder="Senha"
           ref={register({ required: true, minLength: 8, pattern: validationPassword })}
        />

        {errors.pswdRegister && <div className="error-validate">Senha é obrigatório conter: Mínimo de 8 e máximo de 10 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial:</div>}
        </div>

        <div className="form-field" style={{display:'none'}}>
        <label htmlFor="type-register">
        <i className="bi bi-building"></i>
        <i className="bi bi-caret-down-fill"></i>
        </label>

        <select name="typeRegister"
            className={errors.typeRegister ? 'error' : ''}
            id="type-register"
            defaultValue="C"
            ref={register({ required: true, validate: value => value !== '0' || 'error message' })}
        >
        <option value="C">Cliente</option>
        </select>

        {errors.typeRegister && <div className="error-validate">Tipo cadastro é obrigatório</div>}
        </div>

        <div className="form-submit">
        <button id="login-action" onClick={handleSubmit(onSubmit)}>CADASTRAR</button>
        </div>
        </form>
    </div>
    )
}
export default AddCliente