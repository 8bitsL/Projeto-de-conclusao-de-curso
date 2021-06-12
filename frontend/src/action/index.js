import {
    SHOW_MODAL, 
    SHOW_MODAL_SITUACAO, 
    USER_LOGIN, 
    FETCH_USER, 
    LOAD_USER, 
    ALT_DADOS,
    DEL_CLIENTES,
    LIST_PROD,
    DEL_PRODUTOS,
    LIST_VENDAS,
    LIST_CLIENTES,
    LIST_REVENDEDORES,
    ADD_PRODUTO,
    ENVIA_COD,
    ENVIA_COD_SITU,
    ALT_PRODUTO,
    LIST_ENCOMENDAS,
    ADD_ENCOMENDAS
} from './actionTypes'

export const showModal = (payload) => ({
    type: SHOW_MODAL,
    payload
});
export const modalSituacao = (payload) => ({
    type: SHOW_MODAL_SITUACAO,
    payload
});
export const user_login = (payload) => ({
    type: USER_LOGIN,
    payload
});
export const fetch_login = (payload) => ({
    type: FETCH_USER,
    payload
});
export const load_user = (payload) => ({
    type: LOAD_USER,
    payload
});
export const alt_dados = (payload) => ({
    type: ALT_DADOS,
    payload
});
export const produtos = (payload) => ({
    type: LIST_PROD,
    payload
})
export const add_produto = (payload) => ({
    type: ADD_PRODUTO,
    payload
})
export const alt_produto = (payload) => ({
    type: ALT_PRODUTO,
    payload
})
export const del_produtos = (payload) => ({
    type: DEL_PRODUTOS,
    payload
})
export const list_vendas = (payload) => ({
    type: LIST_VENDAS,
    payload
});
export const list_clientes = (payload) => ({
    type: LIST_CLIENTES,
    payload
})
export const del_clientes = (payload) => ({
    type: DEL_CLIENTES,
    payload
})
export const list_revendedores = (payload) => ({
    type: LIST_REVENDEDORES,
    payload
})
export const enviaCod = (payload) => ({
    type: ENVIA_COD,
    payload
})
export const enviaCodSitu = (payload) => ({
    type: ENVIA_COD_SITU,
    payload
})
export const list_encomendas = (payload) => ({
    type: LIST_ENCOMENDAS,
    payload
})
export const add_encomendas = (payload) => ({
    type: ADD_ENCOMENDAS,
    payload
})