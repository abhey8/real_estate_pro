import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    alert('Feature in Development: Create Listing is coming soon!');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            🏠 RealEstate Pro
          </Link>

          <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Browse
            </Link>
            <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Dark Mode">
              🌓
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/listings/create" onClick={(e) => { setMenuOpen(false); handleCreateListing(e); }}>
                  Create Listing
                </Link>
                <Link to="/favorites" onClick={() => setMenuOpen(false)}>
                  Favorites
                </Link>
                <Link to="/recommendations" onClick={() => setMenuOpen(false)}>
                  Recommendations
                </Link>
                <div className="navbar-user">
                  <Link to="/profile" className="user-name-link">
                    <span className="user-name">{user?.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline-primary btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-primary btn-sm">Sign Up</button>
                </Link>
              </>
            )}
          </div>

          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

