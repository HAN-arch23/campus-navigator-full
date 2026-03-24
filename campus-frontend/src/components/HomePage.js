import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUserShield } from 'react-icons/fa';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='home-container'>
      {/* Navigation Bar - Minimal */}
      <nav className='navbar'>
        <div className='nav-content'>
          <div className='nav-brand'>
            <h2>Campus Navigator</h2>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='hero-section'>
        <div className='hero-content animate-fadeIn'>
          <h1 className='hero-title'>
            Welcome to <span className='text-gradient'>Campus Navigator</span>
          </h1>
          <p className='hero-subtitle'>
            Your central hub for finding and booking study spaces. <br />
            Please log in to continue.
          </p>

          <div className='login-options'>
            <button
              className='login-card-btn'
              onClick={() => navigate('/login')}
            >
              <div className='icon-wrapper student-icon'>
                <FaUserGraduate />
              </div>
              <div className='text-wrapper'>
                <h3>Student Login</h3>
                <p>Book rooms & view history</p>
              </div>
            </button>

            <button
              className='login-card-btn'
              onClick={() => navigate('/login')}
            >
              <div className='icon-wrapper admin-icon'>
                <FaUserShield />
              </div>
              <div className='text-wrapper'>
                <h3>Admin Login</h3>
                <p>Manage rooms & users</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
