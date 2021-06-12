import {
    user_login,
    fetch_login,
    load_user,
    alt_dados,
    produtos,
    list_vendas,
    list_clientes,
    list_revendedores,
    add_produto,
    alt_produto,
    list_encomendas,
    del_produtos,
    del_clientes
} from '../action/index';

import { getToken, checkAuth } from '../services/auth';

// export const URL_SERVER = 'http://192.99.172.182:3333';
export const URL_SERVER = 'http://localhost:3333';


export const ThunkLogin = (data, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => dispatch(fetch_login(res.json())))
            .then(resp => {
                dispatch(user_login(resp))
                callback(resp.payload)
            }
            );
    }
}

export const ThunkCheckAuth = () => {
    return dispatch => {
        dispatch(load_user(checkAuth()))
    }
}

export const ThunkAltDados = (payload, callback) => {
    let form = new FormData();

    for (let attr in payload) {
        form.append(attr, payload[attr]);
    }
    
    return async dispatch => {
        fetch(URL_SERVER + '/usuarios/updateusuario', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: form
        }).then(async res => {
            const resp = await res.json();
            dispatch(alt_dados(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then((res) => dispatch(ThunkCheckAuth(checkAuth()))); // usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
    
}


export const ThunkEstoque = () => {
    return dispatch => {
        fetch(URL_SERVER + '/produtos/', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(async res => {
            const resp = await res.json();
            dispatch(produtos(resp));
        });
    }
}

export const ThunkEncomendas = (payload) => {
    const dados = { idRevendedor: payload };

    return dispatch => {
        fetch(URL_SERVER + '/produtos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(dados)
        }).then(async res => {
            const resp = await res.json();
            dispatch(produtos(resp));
        });
    }
}

export const ThunkAddProd = (payload, callback) => {
    let form = new FormData();

    for (let attr in payload) {
        form.append(attr, payload[attr]);
    }

    return async dispatch => {
        fetch(URL_SERVER + '/produtos/cadastro', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: form
        }).then(async res => {
            const resp = await res.json();
            dispatch(add_produto(resp));
            callback(resp);
        }).catch(err => console.error(err));
    }
}

export const ThunkAltProd = (payload, callback) => {
    let form = new FormData();

    for (let attr in payload) {
        form.append(attr, payload[attr]);
    }

    return async dispatch => {
        fetch(URL_SERVER + '/produtos/', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: form
        }).then(async res => {
            const resp = await res.json();
            dispatch(alt_produto(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then((res) => dispatch(ThunkEstoque()));
    }
}

export const ThunkDelProd = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/produtos/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            dispatch(del_produtos(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then((res) => dispatch(ThunkEstoque())); // usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}



export const ThunkVendas = () => {
    return dispatch => {
        fetch(URL_SERVER + '/vendas/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(async res => {
            const resp = await res.json();
            dispatch(list_vendas(resp));
        });
    }
}

export const ThunkFinalizarVenda = (payload, callback) => {
    console.log(payload);
    return dispatch =>{
        fetch(URL_SERVER + '/vendas/finalizarVenda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            
            if(resp.status !== 'success'){
                callback(resp);
            }else{
                callback(resp);
            }
        }).catch(err => console.error(err))
        .then(() => dispatch(ThunkListEncomendas())) //usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
        dispatch(ThunkCheckAuth(checkAuth()));
    }
}



export const ThunkListClientes = () => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/clientes', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(async res => {
            const resp = await res.json();
            dispatch(list_clientes(resp));
        });
    }
}

export const ThunkAltCliente = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/updatecliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            dispatch(alt_dados(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then((res) => dispatch(ThunkListClientes())); // usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}

export const ThunkDelCliente = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            dispatch(del_clientes(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then((res) => dispatch(ThunkListClientes())); // usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}

export const ThunkAssociaCliente = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/associaCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            dispatch(alt_dados(resp));
            callback(resp);
        }).catch(err => console.error(err))
            .then(() => dispatch(ThunkCheckAuth(checkAuth()))); // usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}



export const ThunkListRevendedores = () => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/revendedores', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(async res => {
            const resp = await res.json();
            dispatch(list_revendedores(resp));
        });
    }
}

export const ThunkListEncomendas = () => {
    return dispatch => {
        fetch(URL_SERVER + '/encomendas/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        }).then(async res => {
            const resp = await res.json();

            dispatch(list_encomendas(resp));
        });
    }
}

export const ThunkAddEncomendas = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/encomendas/addEncomenda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            
            if(resp.status !== 'success'){
                callback(resp);    
            
            } else{
                callback(resp);    
                dispatch(list_encomendas(resp.encomendas) );
            }

        }).catch(err => console.error(err))
            .then(() => dispatch(ThunkListEncomendas()))// usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}

export const ThunkAltSituacao = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/alterarSituacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            callback(resp)
        }).then(() => dispatch(ThunkListClientes()))// usa o MIDDLEWARE Multi para chamar outra action ao finalizar a promisse
    }
}

export const ThunkAddNewCliente = (payload, callback) => {
    return dispatch => {
        fetch(URL_SERVER + '/usuarios/addNewCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const resp = await res.json();
            callback(resp)
        }).then(() => dispatch(ThunkListClientes()));
    }
}