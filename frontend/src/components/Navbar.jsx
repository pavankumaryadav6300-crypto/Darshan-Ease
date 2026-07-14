import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Calendar, HeartHandshake, LayoutDashboard, LogOut, LogIn, UserPlus, Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar" style={styles.navContainer}>
      <Link to="/" className="navbar-brand">
        <Heart style={{ fill: '#f59e0b', color: '#ef4444' }} />
        <span style={{ fontSize: '1.4rem', letterSpacing: '-0.03em' }}>DarshanEase</span>
      </Link>

      {/* Hamburger Toggle */}
      <button 
        style={styles.hamburger} 
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <ul className={`navbar-links ${mobileOpen ? 'mobile-active' : ''}`} style={styles.navLinks(mobileOpen)}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} 
            onClick={() => setMobileOpen(false)}
            end
          >
            <span style={styles.iconLink}>
              <Compass size={16} /> Temples
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/donations" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span style={styles.iconLink}>
              <HeartHandshake size={16} /> Donations
            </span>
          </NavLink>
        </li>

        {user && (
          <li>
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span style={styles.iconLink}>
                <Calendar size={16} /> My Bookings
              </span>
            </NavLink>
          </li>
        )}

        {user && (user.role === 'ADMIN' || user.role === 'ORGANIZER') && (
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span style={styles.iconLink}>
                <LayoutDashboard size={16} /> Admin Console
              </span>
            </NavLink>
          </li>
        )}

        {user ? (
          <li style={styles.userSection(mobileOpen)}>
            <div style={styles.greetingBox}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Namaste,</span>
              <span style={{ fontSize: '0.92rem', color: '#fbbf24', fontWeight: '700' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
              <LogOut size={13} /> Logout
            </button>
          </li>
        ) : (
          <li style={styles.authButtons(mobileOpen)}>
            <Link to="/login" className="btn btn-secondary" style={styles.authBtn} onClick={() => setMobileOpen(false)}>
              <LogIn size={13} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={styles.authBtn} onClick={() => setMobileOpen(false)}>
              <UserPlus size={13} /> Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navContainer: {
    position: 'sticky',
    top: 0,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
  },
  hamburger: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    }
  },
  iconLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  navLinks: (mobileOpen) => ({
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
  }),
  userSection: (mobileOpen) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: mobileOpen ? '0' : '1.5rem',
    marginTop: mobileOpen ? '1rem' : '0',
    borderLeft: mobileOpen ? 'none' : '1px solid rgba(255,255,255,0.08)',
    paddingLeft: mobileOpen ? '0' : '1.5rem',
  }),
  greetingBox: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.2',
  },
  logoutBtn: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.82rem',
    borderRadius: '10px',
  },
  authButtons: (mobileOpen) => ({
    display: 'flex',
    gap: '0.75rem',
    marginLeft: mobileOpen ? '0' : '2rem',
    marginTop: mobileOpen ? '1.5rem' : '0',
  }),
  authBtn: {
    padding: '0.45rem 1rem',
    fontSize: '0.82rem',
    borderRadius: '10px',
  }
};

// CSS media query style inject for hamburger drawer responsiveness
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 820px) {
      .navbar {
        padding: 1rem 1.5rem !important;
      }
      .navbar button[aria-label="Toggle Menu"] {
        display: block !important;
      }
      .navbar-links {
        display: none !important;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #090710;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 2rem !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 1.5rem !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .navbar-links.mobile-active {
        display: flex !important;
      }
      .navbar-link::after {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default Navbar;
