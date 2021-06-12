import React from 'react';
import { Link } from 'react-router-dom'

import Logo from '../../images/logo.png'

import './style.css';

const FormContainer = ({ children }) => {
  return (
    <article>
      <div className="container">
        <div id="box-login-wrapper">
          <div id="presentation-box">
            <div><img src={Logo} alt="img-logo" /></div>

            <h1>CVR Business Intelligence Solutions.</h1>
          </div>

          <div id="form-wrapper">
            <div className="navigation-screen">
              <Link to="/login"
                className={`tittle-screen ${window.location.pathname === '/login' ? 'active' : ''}`}
              >Login</Link>

              <Link to="/register"
                className={`tittle-screen ${window.location.pathname === '/register' ? 'active' : ''}`}
              >Registrar</Link>
            </div>

            <div className="screen-form">
              {children}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FormContainer;