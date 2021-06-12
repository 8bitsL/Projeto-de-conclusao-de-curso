import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import { useDispatch } from 'react-redux';

import { ThunkLogin } from '../../Thunk/index'

import FormContainer from './FormContainer';

import { login } from '../../services/auth';

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm();

  const { addToast } = useToasts();

  const [isHidden, setPasswordView] = useState(true);
  const onTooglePsw = () => { setPasswordView(!isHidden) };

  const validationEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onSubmit = (data, event) => {
    event.target.setAttribute('disabled', 'disabled');

    dispatch(ThunkLogin(data, (resp) => {
      if (resp.status === 'success') {
        login(resp.token);
        history.push('/app');

        addToast(resp.message, {
          appearance: 'success',
          autoDismiss: true
        });

      } else{
        event.target.removeAttribute('disabled');
        
        addToast(resp.message, {
          appearance: 'error',
          autoDismiss: true
        });
      }
    }
    ));
  }
  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="email-login"><i className="bi bi-envelope-fill"></i></label>

          <input type="text"
            className={errors.emailLogin ? 'error' : ''}
            id="email-login"
            name="emailLogin"
            placeholder="E-mail"
            ref={register({ required: true, pattern: validationEmail })}
          />

          {errors.emailLogin && <div className="error-validate">E-mail é obrigatório</div>}
        </div>

        <div className="form-field">
          <label htmlFor="psw-login"><i className="bi bi-lock-fill"></i></label>
          <i className={isHidden ? 'bi bi-eye' : 'bi bi-eye-slash'} onClick={onTooglePsw}></i>

          <input type={isHidden ? 'password' : 'text'} autoComplete="off"
            className={errors.pswLogin ? 'error' : ''}
            id="psw-login"
            name="pswLogin"
            placeholder="Senha"
            ref={register({ required: true, minLength: 6 })}
          />

          {errors.pswLogin && <div className="error-validate">Senha é obrigatório</div>}
        </div>

        <div className="form-field" style={{ flexDirection: 'row' }}>
          <label className="switch">
            <input type="checkbox" id="keep-connected" name="keepConnected" ref={register} />
            <span className="slider round"></span>
          </label>

          <label htmlFor="keep-connected">Manter conectado.</label>
        </div>

        <div className="form-submit">
          <button id="login-action" onClick={handleSubmit(onSubmit)}>ENTRAR</button>
        </div>
      </form>
    </FormContainer>
  );
}

export default Login;