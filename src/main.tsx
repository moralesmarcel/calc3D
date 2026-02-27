import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Este é o ponto de entrada da aplicação.
// Aqui o React "monta" o componente App dentro da div #root do index.html.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode ajuda a identificar problemas comuns durante o desenvolvimento.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
