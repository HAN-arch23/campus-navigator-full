import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaTrash, FaBuilding, FaClock, FaCalendarAlt } from 'react-icons/fa';
import './Bookings.css';

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/api/bookings`);
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.delete(`${API}/api/bookings/${id}`);
      fetchBookings();
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'cancelled') return 'status-cancelled';
    return 'status-completed';
  };

  if (loading) return (
    <div className="bookings-container">
      <div className="loading-state">
        <div className="spinner-large" />
        <p>Loading bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="bookings-container animate-fadeIn">
      <div className="bookings-header">
        <div>
          <h1>My Bookings</h1>
          <p>Your upcoming and past reservations</p>
        </div>
        <button className="new-booking-btn" onClick={() => navigate('/book')}>
          <FaCalendarPlus /> New Booking
        </button>
      </div>

      {error && <div className="bookings-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
          <h3>No bookings yet</h3>
          <p>Start by booking a study space</p>
          <button className="new-booking-btn" style={{ marginTop: '16px' }} onClick={() => navigate('/book')}>
            <FaCalendarPlus /> Book a Room
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className={`booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}`}>
              <div className="booking-info">
                <div className="booking-room">
                  <FaBuilding />
                  <span>{booking.room?.name || 'Room'}</span>
                </div>
                <div className="booking-details">
                  <span><FaCalendarAlt /> {booking.date}</span>
                  <span><FaClock /> {booking.timeSlot}</span>
                  <span className="booking-user">👤 {booking.user}</span>
                </div>
              </div>
              <div className="booking-actions">
                <span className={`booking-status ${getStatusClass(booking.status)}`}>{booking.status}</span>
                {booking.status === 'confirmed' && (
                  <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
