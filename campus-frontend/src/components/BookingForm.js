import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';
import './BookingForm.css';

export default function BookingForm() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ roomId: '', user: '', date: '', timeSlot: '' });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rooms`);
        setRooms(response.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setStatus({ message: 'Failed to load rooms. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoomSelect = roomId => {
    setFormData({ ...formData, roomId });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: '', type: '' });

    try {
      const bookingData = {
        room: formData.roomId,
        user: formData.user,
        date: formData.date,
        timeSlot: formData.timeSlot
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`, bookingData);
      const roomName = rooms.find(r => r._id === formData.roomId)?.name || 'Room';
      setStatus({
        message: `✓ Booking confirmed! ${roomName} on ${formData.date} at ${formData.timeSlot}`,
        type: 'success'
      });
      setFormData({ roomId: '', user: '', date: '', timeSlot: '' });

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setStatus({
        message: err.response?.data?.message || 'Booking failed. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='booking-form-container'>
      <div className='booking-header'>
        <h2>Book a Room</h2>
        <button className='icon-button' onClick={() => navigate(-1)} title='Go Back'>
          <FaArrowLeft />
        </button>
      </div>

      <div className='form-wrapper'>
        <form onSubmit={handleSubmit} className='booking-form'>
          <div className='form-group'>
            <label htmlFor='user'>Your Name</label>
            <input
              id='user'
              name='user'
              type='text'
              value={formData.user}
              onChange={handleChange}
              placeholder='Enter your name'
              required
              disabled={isSubmitting}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='date'>Date</label>
            <input
              id='date'
              name='date'
              type='date'
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='timeSlot'>Time Slot</label>
            <select
              id='timeSlot'
              name='timeSlot'
              value={formData.timeSlot}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value=''>Select a time slot</option>
              <option>8:00 AM - 10:00 AM</option>
              <option>10:00 AM - 12:00 PM</option>
              <option>1:00 PM - 3:00 PM</option>
              <option>3:00 PM - 5:00 PM</option>
              <option>5:00 PM - 7:00 PM</option>
            </select>
          </div>

          <div className='rooms-section'>
            <h3>Select a Room</h3>
            {loading ? (
              <div className='loading-rooms'>
                <div className='loading-spinner-large'></div>
                <p>Loading available rooms...</p>
              </div>
            ) : (
              <div className='rooms-grid'>
                {rooms.map(room => (
                  <div
                    key={room._id}
                    className={`room-card ${formData.roomId === room._id ? 'selected' : ''}`}
                    onClick={() => handleRoomSelect(room._id)}
                  >
                    <h4>{room.name}</h4>
                    <p>{room.description || 'Study room'}</p>
                    <span className='room-capacity'>Capacity: {room.capacity || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type='submit' className='submit-button' disabled={isSubmitting || !formData.roomId}>
            {isSubmitting ? (
              <>
                <span className='loading-spinner'></span>
                Processing...
              </>
            ) : (
              <>
                <FaCalendarCheck /> Book Room
              </>
            )}
          </button>
        </form>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
