import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { showModal, enviaCod, enviaCodSitu, modalSituacao } from '../../action/index'

import { ThunkDelCliente, ThunkListClientes } from '../../Thunk/index'

import ClientesModal from '../Modal/clientesModal';
import SituacaoCliente from '../Modal/situacaoClienteModal';

import './style.css';

const Clientes = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const arrayClientes = useSelector(state => state.user.clientes);
  const mostraModal = useSelector(state => state.user.modal);
  const mostraModalSituacao = useSelector(state => state.user.modalSituacao);
  const cod = useSelector(state=>state.user.codEnviado);
  const codSitu = useSelector(state=>state.user.codEnviadoSitu);

  const backHome = () => history.push('/app');
  const addCliente = () => history.push('/addCliente');

  const modal = (idCliente) => {
    dispatch(enviaCod(idCliente));
    dispatch(showModal(true));
  }
  const showModalSituacao = (id) => {
    dispatch(enviaCodSitu(id));
    dispatch(modalSituacao(true));
  }

  const delCliente = (e, cod, cliente) => {
    e.stopPropagation();
    const data = {
      codigo: cod
    }
    const confirm = window.confirm('Deseja mesmo excluir este cliente?\n\nCliente: ' + cliente)
    if (confirm) {
      dispatch(ThunkDelCliente(data, (resp) => {
        if (resp.status === 'success') {
          addToast('Cliente excluido com sucesso!', {
            appearance: 'success',
            autoDismiss: true
          });

        } else {
          addToast('Falha ao excluir cliente', {
            appearance: 'error',
            autoDismiss: true
          });
        }
      }));
    } else {
      addToast('O cliente não foi excluido', {
        appearance: 'info',
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    dispatch(ThunkListClientes())
  }, [dispatch]);

  return (
    <div id="clientes-wrapper">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3>Clientes</h3>

        <span>
          <button
            className="back-home"
            onClick={backHome}
          >
            <i className="bi  bi-backspace-fill"></i> Home
              </button>
        </span>
      </div>
      <div style={{ textAlign: 'right', marginTop: '1rem'}}>
                <button onClick={addCliente} className="btn-evento">Novo cliente <i className="bi bi-plus-square-dotted"></i></button>
            </div>
      <div className="scroll-table">
        <div style={{ display: !arrayClientes.length ? 'block' : 'none' }} className="msg">Nenhum cliente cadastrado</div>

        <table id="cadastros-wrapper" style={{ display: arrayClientes.length ? 'table' : 'none' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Nome</th>
              <th style={{ textAlign: 'left' }}>E-mail</th>
              <th style={{ textAlign: 'center' }}>Situação</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {arrayClientes.map((cliente) => {
              let situacaoFinanceira = '';

              if (cliente.situacao_financeira !== null) {
                if (cliente.situacao_financeira.situacao_financeira) {
                  situacaoFinanceira = 'negativa';

                } else {
                  situacaoFinanceira = 'positiva'
                }
              }

              return (
                <tr className="cliente" data-cliente-id={cliente.id_usuario} key={cliente.id_usuario}>
                  <td style={{ textAlign: 'center' }}>{cliente.id_usuario}</td>
                  <td style={{ textAlign: 'left' }}>{cliente.nome}</td>
                  <td style={{ textAlign: 'left' }}>{cliente.email}</td>

                  <td style={{ textAlign: 'center' }} onClick={() => showModalSituacao(cliente.id_usuario)} >
                    <div className={"situacao " + situacaoFinanceira} style={{ display: situacaoFinanceira ? 'inline-block' : 'none' }}>
                      <i  className={situacaoFinanceira === 'negativa' ? 'bi bi-hand-thumbs-down-fill' : 'bi bi-hand-thumbs-up-fill'}></i>
                    </div>

                    <div style={{ display: !situacaoFinanceira ? 'inline-block' : 'none' }}> - </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => modal(cliente.id_usuario)} 
                      className="event editar-cliente"><i className="bi bi-pencil-fill"></i></button>
                    <button onClick={(e) => delCliente(e, cliente.id_usuario, cliente.nome)}
                       className="event remover-cliente"><i className="bi-trash-fill"></i></button>
                  </td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
        {mostraModalSituacao && <SituacaoCliente cod={codSitu}/>}
        {mostraModal && <ClientesModal cod={cod}/>}
      </div>
    </div>
  )
}

export default Clientes;