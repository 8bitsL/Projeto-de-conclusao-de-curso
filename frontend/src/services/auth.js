import { URL_SERVER } from '../Thunk/index';

export const TOKEN_KEY = "@app-Token";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const checkAuth = () => fetch(URL_SERVER + '/usuarios/', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${ getToken() }` }
}).then(async res => {
  const resp = await res.json();

  if(resp.status === 'error'){
    window.location.href = '/';
    logout();

  } else return resp;
}).catch(err => console.log(err));

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};