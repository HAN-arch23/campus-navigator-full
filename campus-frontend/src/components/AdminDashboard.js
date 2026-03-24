import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding, FaCalendarCheck, FaPlus, FaTrash, FaEdit, FaTimes, FaCheck, FaUsers, FaChartBar } from 'react-icons/fa';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AMENITY_OPTIONS = ['Whiteboard', 'Power outlets', 'Projector', 'Smart TV', 'Computers', 'WiFi', 'Lounge seating', 'Microphone', 'Air conditioning', 'Lab equipment'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', description: '', capacity: '', location: '', amenities: [] });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        axios.get(`${API}/api/rooms`),
        axios.get(`${API}/api/bookings`)
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({ name: '', description: '', capacity: '', location: '', amenities: [] });
    setFormError('');
    setShowRoomModal(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({ name: room.name, description: room.description, capacity: room.capacity, location: room.location, amenities: room.amenities || [] });
    setFormError('');
    setShowRoomModal(true);
  };

  const toggleAmenity = (a) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
    }));
  };

  const handleSaveRoom = async () => {
    if (!roomForm.name || !roomForm.capacity || !roomForm.location) {
      setFormError('Name, capacity and location are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingRoom) {
        await axios.put(`${API}/api/rooms/${editingRoom._id}`, roomForm);
      } else {
        await axios.post(`${API}/api/rooms`, roomForm);
      }
      setShowRoomModal(false);
      fetchAll();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Failed to save room.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room? All its bookings will also be affected.')) return;
    try {
      await axios.delete(`${API}/api/rooms/${id}`);
      fetchAll();
    } catch (e) {
      alert('Failed to delete room.');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.delete(`${API}/api/bookings/${id}`);
      fetchAll();
    } catch (e) {
      alert('Failed to cancel booking.');
    }
  };

  const stats = {
    totalRooms: rooms.length,
    totalBookings: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) return (
    <div className="admin-container">
      <div className="loading-state">
        <div className="spinner-large" />
        <p>Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-container animate-fadeIn">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage rooms and bookings</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <FaChartBar /> Overview
        </button>
        <button className={`admin-tab ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>
          <FaBuilding /> Rooms
        </button>
        <button className={`admin-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
          <FaCalendarCheck /> Bookings
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon"><FaBuilding /></div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalRooms}</span>
                <span className="stat-label">Total Rooms</span>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon"><FaCalendarCheck /></div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalBookings}</span>
                <span className="stat-label">Total Bookings</span>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><FaCheck /></div>
              <div className="stat-info">
                <span className="stat-number">{stats.confirmed}</span>
                <span className="stat-label">Confirmed</span>
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon"><FaTimes /></div>
              <div className="stat-info">
                <span className="stat-number">{stats.cancelled}</span>
                <span className="stat-label">Cancelled</span>
              </div>
            </div>
          </div>

          <h3 style={{ margin: '32px 0 16px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Bookings</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Room</th><th>User</th><th>Date</th><th>Time Slot</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b._id}>
                    <td>{b.room?.name || '—'}</td>
                    <td>{b.user}</td>
                    <td>{b.date}</td>
                    <td>{b.timeSlot}</td>
                    <td><span className={`status-pill ${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROOMS TAB */}
      {tab === 'rooms' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button className="add-btn" onClick={openAddRoom}><FaPlus /> Add Room</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Location</th><th>Capacity</th><th>Amenities</th><th>Actions</th></tr></thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room._id}>
                    <td><strong>{room.name}</strong></td>
                    <td>{room.location}</td>
                    <td><FaUsers style={{ marginRight: 4 }} />{room.capacity}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {room.amenities?.slice(0, 3).map((a, i) => <span key={i} className="mini-tag">{a}</span>)}
                        {room.amenities?.length > 3 && <span className="mini-tag">+{room.amenities.length - 3}</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="action-btn edit" onClick={() => openEditRoom(room)}><FaEdit /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteRoom(room._id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {tab === 'bookings' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Room</th><th>User</th><th>Date</th><th>Time Slot</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.room?.name || '—'}</td>
                  <td>{b.user}</td>
                  <td>{b.date}</td>
                  <td>{b.timeSlot}</td>
                  <td><span className={`status-pill ${b.status}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'confirmed' && (
                      <button className="action-btn delete" onClick={() => handleCancelBooking(b._id)}><FaTrash /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ROOM MODAL */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="modal-close" onClick={() => setShowRoomModal(false)}><FaTimes /></button>
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <div className="modal-form">
              <div className="mform-group">
                <label>Room Name *</label>
                <input value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} placeholder="e.g. Library Study Room A" />
              </div>
              <div className="mform-group">
                <label>Description</label>
                <input value={roomForm.description} onChange={e => setRoomForm({ ...roomForm, description: e.target.value })} placeholder="Brief description" />
              </div>
              <div className="mform-row">
                <div className="mform-group">
                  <label>Capacity *</label>
                  <input type="number" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} placeholder="e.g. 10" min="1" />
                </div>
                <div className="mform-group">
                  <label>Location *</label>
                  <input value={roomForm.location} onChange={e => setRoomForm({ ...roomForm, location: e.target.value })} placeholder="e.g. Library, Floor 2" />
                </div>
              </div>
              <div className="mform-group">
                <label>Amenities</label>
                <div className="amenity-select">
                  {AMENITY_OPTIONS.map(a => (
                    <button key={a} type="button"
                      className={`amenity-filter-btn ${roomForm.amenities.includes(a) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(a)}>
                      {roomForm.amenities.includes(a) && <FaCheck />} {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-modal-btn" onClick={() => setShowRoomModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveRoom} disabled={saving}>
                {saving ? 'Saving...' : (editingRoom ? 'Save Changes' : 'Add Room')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
