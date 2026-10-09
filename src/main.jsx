import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui-enhancements.css';
import './simple-theme.css';
import './overflow-fix.css';
import './reveal-motion.css';
import './demo-room.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
