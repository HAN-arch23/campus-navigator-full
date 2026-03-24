import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaHistory, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p>What would you like to do today?</p>
      </div>

      <div className='dashboard-grid'>
        {/* Book a Room Card */}
        <div className='dashboard-card' onClick={() => navigate('/study-spaces')}>
          <div className='card-icon-wrapper primary'>
            <FaCalendarPlus />
          </div>
          <div className='card-content'>
            <h3>Book a Room</h3>
            <p>Browse available study spots and make a reservation.</p>
          </div>
        </div>

        {/* My History Card */}
        <div className='dashboard-card' onClick={() => navigate('/bookings')}>
          <div className='card-icon-wrapper secondary'>
            <FaHistory />
          </div>
          <div className='card-content'>
            <h3>My History</h3>
            <p>View your past and upcoming bookings.</p>
          </div>
        </div>

        {/* View Map Card (Optional/Future) */}
        <div className='dashboard-card' onClick={() => navigate('/study-spaces')}>
          <div className='card-icon-wrapper accent'>
            <FaMapMarkedAlt />
          </div>
          <div className='card-content'>
            <h3>Explore Campus</h3>
            <p>Find quiet spots and amenities near you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
