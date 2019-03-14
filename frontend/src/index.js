import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
/* eslint-disable */ 
// from apollo-boost
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
/* eslint-enable */

import { WebSocketLink } from 'apollo-link-ws';
import * as serviceWorker from './serviceWorker';
import App from './components/App';
import './styles/index.css';
import { FRONTEND_URL, FRONTEND_WS_URL } from './constants';

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:4444' : FRONTEND_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink = new WebSocketLink({
  uri: process.env.NODE_END === 'development' ? FRONTEND_WS_URL : `ws://localhost:4444`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('auth-token'),
    },
  },
});
// hybrid link: https://blog.apollographql.com/apollo-link-the-modular-graphql-network-stack-3b6d5fcf9244
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// use .register() to enable serviceWorker
serviceWorker.unregister();
