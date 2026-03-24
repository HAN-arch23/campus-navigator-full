import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaTachometerAlt, FaBuilding, FaCalendarCheck, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/study-spaces', icon: <FaBuilding />, label: 'Study Spaces' },
    { path: '/bookings', icon: <FaCalendarCheck />, label: 'My Bookings' },
    { path: '/admin', icon: <FaUserShield />, label: 'Admin' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <FaGraduationCap />
        <span>Campus Navigator</span>
      </div>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <button
            key={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${link.path === '/admin' ? 'admin-link' : ''}`}
            onClick={() => { navigate(link.path); setMenuOpen(false); }}
          >
            {link.icon}
            <span>{link.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-name">{user?.name?.split(' ')[0]}</span>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
        </button>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
}
