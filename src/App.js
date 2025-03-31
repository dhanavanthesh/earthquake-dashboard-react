import React, { useState } from 'react';
import DashboardContent from './DashboardContent';
import ErrorBoundary from './ErrorBoundary';
import './styles.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <div className="logo-container">
            
          </div>
          <h1 className="title">Real time Earthquake  Dashboard</h1>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </header>
        <ErrorBoundary>
          <DashboardContent menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
} 

export default App;