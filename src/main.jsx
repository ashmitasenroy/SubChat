import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { NhostClient, NhostReactProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';

const nhost = new NhostClient({
  subdomain: 'cmdcyxavhibrtleotmlf', 
  region: 'ap-south-1'        // <-- PASTE YOUR REGION HERE
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NhostReactProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <App />
      </NhostApolloProvider>
    </NhostReactProvider>
  </React.StrictMode>
);