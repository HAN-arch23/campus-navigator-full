import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaDoorOpen, FaUser, FaCalendar, FaClock, FaCalendarPlus } from 'react-icons/fa';
import './BookingList.css';

export default function BookingList() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const isUpcoming = (date) => {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  return (
    <div className='bookings-container'>
      <div className='bookings-header'>
        <h2>My Bookings</h2>
        <button className='icon-button' onClick={() => navigate(-1)} title='Go Back'>
          <FaArrowLeft />
        </button>
      </div>

      <div className='bookings-wrapper'>
        {loading ? (
          <div className='loading-bookings'>
            <div className='loading-spinner-large'></div>
            <p>Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>
              <FaCalendarPlus />
            </div>
            <h3>No Bookings Yet</h3>
            <p>You haven't made any room bookings. Start by booking a room!</p>
            <Link to='/book' className='btn btn-primary'>
              <FaCalendarPlus /> Book a Room
            </Link>
          </div>
        ) : (
          <div className='bookings-grid'>
            {bookings.map(booking => (
              <div key={booking._id} className='booking-card'>
                <div className='booking-info'>
                  <div className='booking-room'>
                    <FaDoorOpen />
                    {booking.room?.name || booking.room}
                  </div>
                  <div className='booking-details'>
                    <div className='booking-detail'>
                      <FaUser />
                      <span>{booking.user}</span>
                    </div>
                    <div className='booking-detail'>
                      <FaCalendar />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className='booking-detail'>
                      <FaClock />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>
                </div>
                <div className={`booking-status ${isUpcoming(booking.date) ? 'upcoming' : 'past'}`}>
                  {isUpcoming(booking.date) ? '● Upcoming' : '○ Past'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
