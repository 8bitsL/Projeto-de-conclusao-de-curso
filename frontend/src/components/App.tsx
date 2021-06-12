import React from 'react';
import Routes from '../routes';

import { ToastProvider } from 'react-toast-notifications';

const App = () => {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  )
};

export default App;