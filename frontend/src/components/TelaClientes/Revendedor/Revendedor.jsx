import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { ThunkAssociaCliente, ThunkListRevendedores } from '../../../Thunk/index'

import './style.css'

//VC = Visão Cliente
const VCrevendedor = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    
    const arrayRevendedores = useSelector(state => state.user.revendedores);
  
    const backHome = () => history.push('/app');

    const associar = (e, revendedor) => {
      const assoc = window.confirm('Deseja se associar a '+ revendedor.nome + " ?")
      const data = { id_revendedor:revendedor.id_usuario, nome_revendedor:revendedor.nome }
      if (assoc) {

        dispatch(ThunkAssociaCliente(data, (resp) => {
          if (resp.status === 'success') {
            addToast(resp.message, {
              appearance: 'success',
              autoDismiss: true
            });
            setTimeout(() =>{
              history.push('/app');
            },4000)
          } else {
            addToast(resp.message, {
              appearance: 'error',
              autoDismiss: true
            });
          }
        }));
      } else {
        addToast('Você não se associou ao revendedor!',{
          appearance: 'info',
          autoDismiss: true
      })
      }
    }
    
  
    useEffect(() => {
      dispatch(ThunkListRevendedores())
    }, [dispatch]);
    
    return (
      <div id="clientes-wrapper">
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3>Revendedores</h3>
            <span>
                <button 
                  className="back-home" 
                  onClick={ backHome } 
                >
                  <i className="bi  bi-backspace-fill"></i> Home
                </button>
            </span>
          </div>
  
        <div className="scroll-table">
          <table id="cadastros-wrapper">
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>ID</th>
                <th style={{textAlign: 'left'}}>Nome</th>
                <th style={{textAlign: 'left'}}>E-mail</th>
                <th style={{textAlign: 'center'}}>Telefone</th>
                <th style={{textAlign: 'center'}}>Estado</th>
                <th style={{textAlign: 'center'}}>Associar</th>
              </tr>
            </thead>
            <tbody>  
            {arrayRevendedores.map((revendedor) => {
                return (
                  <tr className="cliente" data-cliente-id={revendedor.id_usuario}  key={revendedor.id_usuario}>
                      <td style={{textAlign: 'center'}}>{revendedor.id_usuario}</td>
                      <td style={{textAlign: 'left'}}>{revendedor.nome}</td>
                      <td style={{textAlign: 'left'}}>{revendedor.email}</td>
                      <td style={{textAlign: 'center'}}>{revendedor.telefone_usuario}</td>
                      <td style={{textAlign: 'center'}}>{revendedor.estado}</td>
                      <td style={{textAlign: 'center'}}><i className="bi bi-star" onClick={(e) => associar(e, revendedor)}></i></td>
                  </tr>
                )
            })
            }
            </tbody>
          </table>
        </div>
      </div>
    )
}

export default VCrevendedor