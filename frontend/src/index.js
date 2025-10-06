import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { EventListsContextProvider } from './context/EventListsContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EventListsContextProvider>
        <App />
      </EventListsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.