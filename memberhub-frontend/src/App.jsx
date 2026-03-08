import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import MemberList from './components/MemberList';
import RegistrationForm from './components/RegistrationForm';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Users size={28} color="var(--primary)" />
        <span className="title-gradient">MemberHub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Directory
        </Link>
        <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} />
            Register
          </span>
        </Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<MemberList />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/edit/:id" element={<RegistrationForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
