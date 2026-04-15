import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';
import React from 'react';
import { Inspector } from 'react-dev-inspector';
import { autoUpadte } from './app/utils/autoUpdate.ts';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Inspector />
    <App />
  </React.StrictMode>,
);

autoUpadte();
