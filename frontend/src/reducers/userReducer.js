import {
  SHOW_MODAL,
  SHOW_MODAL_SITUACAO,
  USER_LOGIN,
  FETCH_USER,
  LOAD_USER,
  ALT_DADOS,
  LIST_PROD,
  LIST_VENDAS,
  LIST_CLIENTES,
  DEL_CLIENTES,
  LIST_REVENDEDORES,
  ENVIA_COD,
  ENVIA_COD_SITU,
  LIST_ENCOMENDAS,
  DEL_PRODUTOS
} from '../action/actionTypes';

const initialState = {
  isLoggedIn: false,
  modal: false,
  modalSituacao: false,
  user_dados: {
    user_data: {
      apelido: '',
      totalVendas: '',
      valorLucro: ''
    }
  },
  produtos: [],
  encomendas: [],
  vendas: [],
  clientes: [],
  revendedores: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case ENVIA_COD_SITU: {
      return { ...state, codEnviadoSitu: action.payload}
    }
    case ENVIA_COD: {
      return{ ...state, codEnviado:action.payload }
    }
    case SHOW_MODAL : {
      return { ...state, modal: action.payload}
    }
    case SHOW_MODAL_SITUACAO: {
      return { ...state, modalSituacao: action.payload}
    }

    case FETCH_USER: {
      return { ...state, ...action.payload, isLoggedIn: true }
    }
    case USER_LOGIN: {
      return { ...state }
    }
    case LOAD_USER: {
      const newState = {
        user_dados: action.payload,
        isLoggedIn: action.payload.isAuth
      }
      return { ...state, ...newState }
    }
    case ALT_DADOS: {
      return { ...state }
    }
    case LIST_PROD: {
      const newState = {
        produtos: action.payload
      }
      return { ...state, ...newState }
    }
    case LIST_VENDAS: {
      const newState = {
        vendas: action.payload
      }
      return { ...state, ...newState }
    }
    case LIST_CLIENTES: {
      const newState = {
        clientes: action.payload
      }
      return { ...state, ...newState }
    }
    case LIST_REVENDEDORES: {
      const newState ={
        revendedores: action.payload
      }
      return { ...state, ...newState }
    }
    case LIST_ENCOMENDAS: {
      const newState = {
        encomendas: action.payload
      }
      return {...state, ...newState }
    }
    case DEL_PRODUTOS:
    case DEL_CLIENTES:
      return { ...state }

    default:
      return { ...state };
  }
}