import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Login from './components/Login/Login'
import Register from './components/Login/Register';
import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import EditarDados from './components/EditarDados/EditarDados';
import Estoque from './components/Estoque/Estoque';
import Clientes from './components/Clientes/Clientes';
import AddProduto from './components/Estoque/AddProduto'
import VCrevendedor from './components/TelaClientes/Revendedor/Revendedor';
import Encomendas from './components/Encomendas/Encomendas';
import AddCliente from './components/Clientes/addCliente';
import ListaVendas from './components/Home/listaVendas';
import ViewLucro from './components/Home/Lucro/viewLucro';


import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <main>
                    <Nav />
                    <article>
                        <div id="contatos-wrapper">
                            <div className="mostrar-contatos">
                                <i className="bi bi-info-circle-fill"></i>

                                <div className="contatos">

                                <div style={{marginRight: '1rem'}}>
                                    Leonardo: 
                                    <div>
                                        <i className="bi bi-envelope-fill"></i> leofernnadesld@hotmail.com
                                    </div>

                                    <div>
                                        <i className="bi bi-telephone-fill"></i> (21) 9 9984-0924
                                    </div>
                                </div>

                                <div>
                                    Robson: 
                                    <div>
                                        <i className="bi bi-envelope-fill"></i> robsoncesar2302@gmail.com
                                    </div>

                                     <div>
                                        <i className="bi bi-telephone-fill"></i> (21) 9 9284-4275
                                     </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="container">
                            <Component {...props} />
                        </div>
                    </article>
                </main>
                ) : (
                <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            )
        }
    />
);

const Routes = () => {
  return (
    <BrowserRouter >
        <Switch>
            <Route exact path="/login" component={ Login } />
            <Route path="/register" component={ Register } />
            <PrivateRoute path="/app" component={ Home } />
            <PrivateRoute path="/minhaconta" component={ EditarDados } />
            <PrivateRoute path="/estoque" component={ Estoque } />
            <PrivateRoute path="/clientes" component={ Clientes } />
            <PrivateRoute path="/addProduto" component={ AddProduto }/>
            <PrivateRoute path="/revendedores" component={ VCrevendedor }/>
            <PrivateRoute path="/encomendas" component={ Encomendas }/>
            <PrivateRoute path="/addCliente" component={ AddCliente }/>
            <PrivateRoute path="/listaVendas" component={ ListaVendas }/>
            <PrivateRoute path="/viewLucro" component={ ViewLucro }/>

            <Redirect to={ isAuthenticated() ? '/app' : '/login' } />
        </Switch>
    </BrowserRouter>
  )
};

export default Routes;