import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ background: '#1a1a2e', padding: '15px 30px', display: 'flex', gap: '20px' }}>
          <span style={{ color: '#0f8b8d', fontWeight: 'bold', fontSize: '18px' }}>
            Gestión Contable
          </span>
          <Link to="/clientes" style={{ color: 'white', textDecoration: 'none' }}>
            Clientes
          </Link>
        </nav>
        <div style={{ padding: '30px' }}>
          <Routes>
            <Route path="/clientes" element={<Clientes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;