import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import { useSelector, useDispatch } from 'react-redux';

import './style.css';

import { ThunkAddProd } from '../../Thunk/index';

const AddProduto = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { register, handleSubmit, setValue, errors } = useForm();

  const success = useSelector(state => state.user.isLoggedIn)

  const history = useHistory();

  const backProdutos = () => history.push('/estoque');

  const onSubmit = (data, event) => {
    event.target.setAttribute('disabled', 'disabled');
  
    data.imgRegister = data.imgRegister[0];

    dispatch(ThunkAddProd(data, (resp) => {
      if (resp.status === 'success'){
          addToast(resp.message, {
              appearance: 'success',
              autoDismiss: true
          });

          history.push('/estoque');

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
    setValue('tipoProdRegister', 0);
  }, [ setValue, success ]);

  return (
    <div id="editar-dados-wrapper">
      <div style={ {display: 'flex', alignItems: 'center'} }>
        <h3>Adicionar novo Produto</h3>

        <span>
          <button id="cancelar-edicao-dados" onClick={ backProdutos }>
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </span>
      </div>

      <form>
        <div className="form-field">
          <label htmlFor="produto-register"><i className="bi bi-handbag"></i></label>

          <input type="text"
            className={errors.nameRegister ? 'error' : ''}
            id="name-register"
            name="produtoRegister"
            placeholder="Nome do produto"
            ref={register({ required: true, minLength: 3, message: 'hahaha' })}
          />

          {errors.produtoRegister && <div className="error-validate">Nome é obrigatório</div>}
        </div>

        <div>
          <div className="form-field">
            <label htmlFor="descricao-register"><i className="bi-journal-text"></i></label>

            <input type="text"
              className={errors.descricaoRegister ? 'error' : ''}
              id="descricao-register"
              name={"descricaoRegister"}
              placeholder="Descrição do produto"
              ref={register({ required: true, minLength: 2 })}
            />

            {errors.descricaoRegister && <div className="error-validate">A descrição do produto é obrigatória</div>}
          </div>
        </div>

        <div style={{display: 'flex'}}>
          <div className="form-field">
            <label htmlFor="descEmbalagem-register"><i className="bi bi-box-seam"></i></label>

            <input type="text"
              className={errors.emailRegister ? 'error' : ''}
              id="descEmbalagem-register"
              name="descEmbalagem"
              placeholder="Descrição da embalagem"
              ref={register({ required: true })}
            />

          </div>

          <div className="form-field">
            <label htmlFor="valorVenda-register"><i className="bi bi-cash"></i></label>

            <input type="number"
              className={errors.valorVendaRegister ? 'error' : ''}
              id="valorVenda-register"
              name="valorVendaRegister"
              placeholder="Valor de venda do produto"
            //   onClick={ warningPassword }
              ref={register({ required: false, minLength: 1 })}
            />

            {errors.valorVendaRegister && <div className="error-validate">O valor de venda do produto é obrigatório</div>}
          </div>
        </div>

        <div style={{display: 'flex'}}>
          <div className="form-field">
            <label htmlFor="valorCompra-register">
              <i className="bi bi-cash-stack"></i>
            </label>

            <input type="number"
              className={errors.valorCompraRegister ? 'error' : ''}
              id="valorCompra-register"
              name="valorCompraRegister"
              placeholder="Valor de compra do produto"
              ref={register({ required: true })}
            />

            {errors.valorCompraRegister && <div className="error-validate">Valor de compra do produto é obrigatório</div>}
          </div>

          <div className="form-field">
            <label htmlFor="tipoProdRegister">
              <i className="bi bi-bar-chart-steps"></i>
              <i className="bi bi-caret-down-fill"></i>
            </label>

            <select name="tipoProdRegister"
              className={errors.tipoProdRegister ? 'error' : ''}
              id="tipoProd-register"
              ref={register({ required: true, validate: value => value !== '0' || 'error message' })}
            >

              <option value="0">Categoria</option>
              <option value="Higiene e Beleza">Higiene e Beleza</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Perfumaria">Perfumaria</option>
              <option value="Outros">Outros</option>
            </select>

            {errors.tipoProdRegister && <div className="error-validate">Categoria é obrigatório</div>}
          </div>
        </div>

        <div >
          <div className="form-field">
            <label htmlFor="quantidade-register"><i className="bi bi-plus-square"></i></label>

            <input type="number"
              className={errors.quantidadeRegister ? 'error' : ''}
              id="quantidade-register"
              name="quantidadeRegister"
              placeholder="Quantidade em estoque"
              ref={register({ required: true, minLength: 1 })}
            />

            {errors.quantidadeRegister && <div className="error-validate">Quantidade é obrigatório</div>}
          </div>

          <div className="form-field">
            <label htmlFor="igm-register"><i className="bi bi-file-image"></i></label>

            <input type="file"
              id="igm-register"
              name="imgRegister"
              placeholder="Teste"
              accept="image/*"
              ref={register({ required: true, minLength: 1 })}
            />

            {errors.imgRegister && <div className="error-validate">Imagem do produto é obrigatório</div>}
          </div>
        </div>

        <div className="form-submit">
          <button id="login-action" onClick={ handleSubmit(onSubmit) }>ADICIONAR PRODUTO</button>
        </div>

      </form>
    </div>
  )
}

export default AddProduto;