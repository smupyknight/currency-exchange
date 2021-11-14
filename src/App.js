import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import Routes from './routes';
import AppProviders from "./context/appProviders";

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes />
      </Router>
    </AppProviders>
  );
}

export default App;
