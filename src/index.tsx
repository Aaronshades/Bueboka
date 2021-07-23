import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import FacebookLogin from './auth/FacebookLogin'

import './index.css';
import App from './app/App';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
});

ReactDOM.render(
  <React.StrictMode>
    <FacebookLogin>
      <App />
    </FacebookLogin>
  </React.StrictMode>,
  document.getElementById('root')
);
