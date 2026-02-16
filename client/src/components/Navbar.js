import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          <img
            src="/logo.png"
            alt="Real Estate Pro"
            className="logo-image"
            style={{ height: '50px', width: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span style={{ display: 'none' }}>🏠 RealEstatePro</span>
        </Link>

        <div className="navbar-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Dark Mode"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginRight: '1rem',
              fontSize: '1.2rem'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/compare" onClick={() => setIsOpen(false)}>Compare</Link>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="user-name">Welcome, {user?.name}</span>
              <Link to="/dashboard" className="btn btn-sm btn-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/favorites" className="btn btn-sm btn-secondary" onClick={() => setIsOpen(false)}>Favorites</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>Logout</button>
            </div>
          ) : (
            <div className="navbar-user">
              <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary" onClick={() => setIsOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
