import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import Header from './components/Header';
import Navbar from './components/Navbar';



function App() {
  return (
    <Router>
      <Header/>
      <Navbar/>
      <main className="container">
        <Routes/>
      </main>
    </Router>
  );
}

export default App;
