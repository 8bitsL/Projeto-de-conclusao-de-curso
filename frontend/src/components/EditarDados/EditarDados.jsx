import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import { useSelector, useDispatch } from 'react-redux';

import './style.css';

import { logout } from '../../services/auth';
import { ThunkAltDados } from '../../Thunk/index';

const EditarDados = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm();


  const dados = useSelector(state => state.user.user_dados.user_data);
  const success = useSelector(state => state.user.isLoggedIn)

  const [isHidden, setPasswordView] = useState(true);
  const onTooglePsw = () => { setPasswordView(!isHidden); };

  const validationEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validationPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;

  const backHome = () => history.push('/app');

  const warningPassword = () => {
    addToast('Alterando sua senha, será necessário reconectar ao sistema.', {
      appearance: 'warning',
      autoDismiss: true
    });
  }

  const onSubmit = (data, event) => {
    event.target.setAttribute('disabled', 'disabled');

    data.imgPerfilRegister = data.imgPerfilRegister[0];
    

    dispatch(ThunkAltDados(data, (resp) => {
      if (resp.status === 'success') {
        addToast(resp.message, {
          appearance: 'success',
          autoDismiss: true
        });

        if (data.pswdRegister.length) {
          addToast('Você perdeu sua autenticação, conecte-se novamente!', {
            appearance: 'warning',
            autoDismiss: true
          });
          setTimeout(() => {
            logout();
            history.push('/login');

          },4000)

        } else {
          event.target.removeAttribute('disabled');
        }

      } else {
        event.target.removeAttribute('disabled');

        addToast(resp.message, {
          appearance: 'error',
          autoDismiss: true
        });
      }
    }));
  };

  useEffect(() => {
    setValue('estadoRegister', dados.estado);
  }, [setValue, dados.estado, success]);


  return (
    <div id="editar-dados-wrapper">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3>Editar Dados</h3>

        <span>
          <button id="cancelar-edicao-dados" onClick={backHome}>
            <i className="bi bi-x-circle-fill"></i>
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
            defaultValue={dados.nome}
            ref={register({ required: true, minLength: 3, message: 'hahaha' })}
          />

          {errors.nameRegister && <div className="error-validate">Nome é obrigatório</div>}
        </div>

        <div style={{ display: 'flex' }}>
          <div className="form-field">
            <label htmlFor="apelido-register"><i className="bi bi-person"></i></label>

            <input type="text"
              className={errors.apelidoRegister ? 'error' : ''}
              id="apelido-register"
              name={"apelidoRegister"}
              placeholder="Apelido"
              defaultValue={dados.apelido}
              ref={register({ required: true, minLength: 2 })}
            />

            {errors.apelidoRegister && <div className="error-validate">Apelido é obrigatório</div>}
          </div>
          <div className="form-field">
            <label htmlFor="telefone-register"><i className="bi bi-telephone"></i></label>

            <input type="text"
              className={errors.telefoneRegister ? 'error' : ''}
              id="telefone-register"
              name={"telefoneRegister"}
              placeholder="Telefone"
              defaultValue={dados.telefone_usuario}
              ref={register({ required: true, minLength: 9, maxLength: 12 })}
            />

            {errors.telefoneRegister && <div className="error-validate">Telefone é obrigatório</div>}
          </div>

          <div className="form-field">
            <label htmlFor="cpf-cnpj-register"><i className="bi bi-person-bounding-box"></i></label>

            <input type="text"
              className={errors.cpfCnpjRegister ? 'error' : ''}
              id="cpf-cnpj-register"
              name="cpfCnpjRegister"
              placeholder="CPF / CNPJ"
              defaultValue={dados.cpf_cnpj}
              ref={register({ required: true, minLength: 11, maxLength: 14 })}
            />

            {errors.cpfCnpjRegister && <div className="error-validate">CPF ou CNPJ é obrigatório</div>}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div className="form-field">
            <label htmlFor="email-register"><i className="bi bi-envelope-fill"></i></label>

            <input type="text"
              className={errors.emailRegister ? 'error' : ''}
              id="email-register"
              name="emailRegister"
              placeholder="E-mail"
              defaultValue={dados.email}
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
              onClick={warningPassword}
              ref={register({ required: false, minLength: 8, pattern: validationPassword })}
            />

            {errors.pswdRegister && <div className="error-validate">Senha é obrigatório conter: Mínimo de 8 e máximo de 10 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial:</div>}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div className="form-field">
            <label htmlFor="cidade-register">
              <i className="bi bi-building"></i>
            </label>

            <input type="text"
              className={errors.emailRegister ? 'error' : ''}
              id="cidade-register"
              name="cidadeRegister"
              placeholder="Cidade"
              defaultValue={dados.cidade}
              ref={register({ required: true })}
            />

            {errors.cidadeRegister && <div className="error-validate">Cidade é obrigatório</div>}
          </div>

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

        <div style={{ display: 'flex' }}>
          <div className="form-field">
            <label htmlFor="bairro-register"><i className="bi bi-geo-fill"></i></label>

            <input type="text"
              className={errors.bairroRegister ? 'error' : ''}
              id="bairro-register"
              name="bairroRegister"
              placeholder="Bairro"
              defaultValue={dados.bairro}
              ref={register({ required: true, minLength: 4 })}
            />

            {errors.bairroRegister && <div className="error-validate">Bairro é obrigatório</div>}
          </div>

          <div className="form-field">
            <label htmlFor="numero-register"><i className="bi bi-geo-alt-fill"></i></label>

            <input type="text"
              className={errors.numeroRegister ? 'error' : ''}
              id="numero-register"
              name="numeroRegister"
              placeholder="Número"
              defaultValue={dados.numero}
              ref={register({ required: true })}
            />

            {errors.numeroRegister && <div className="error-validate">Número é obrigatório</div>}
          </div>


          <div className="form-field">
            <label htmlFor="cep-register"><i className="bi bi-signpost-split-fill"></i></label>

            <input type="text"
              className={errors.cepRegister ? 'error' : ''}
              id="cep-register"
              name="cepRegister"
              placeholder="CEP"
              defaultValue={dados.cep}
              ref={register({ required: true, minLength: 8 })}
            />

            {errors.cepRegister && <div className="error-validate">CEP é obrigatório</div>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="complemento-register"><i className="bi bi-map-fill"></i></label>

          <input type="text"
            className={errors.complementoRegister ? 'error' : ''}
            id="complemento-register"
            name="complementoRegister"
            placeholder="Complemento"
            defaultValue={dados.logradouro}
            ref={register({ required: true, minLength: 4 })}
          />

          {errors.complementoRegister && <div className="error-validate">Complemento é obrigatório</div>}
        </div>

        <div className="form-field">
          <label htmlFor="img-perfil-register"><i className="bi bi-person-badge-fill"></i></label>

          <input type="file"
          className={errors.imgPerfilRegister ? 'error' : ''}
            id="img-perfil-register"
            name="imgPerfilRegister"
            placeholder="Foto"
            accept="image/*"
            ref={register({required: true})}
          />

          {errors.imgPerfilRegister && <div className="error-validate">Imagem é obrigatório</div>}
        </div>
        
        <div className="form-submit">
          <button id="login-action" onClick={handleSubmit(onSubmit)}>ATUALIZAR DADOS</button>
        </div>
      </form>
    </div>
  )
}

export default EditarDados;