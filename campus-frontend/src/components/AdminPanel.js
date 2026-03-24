import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft, FaChartLine, FaMapMarkerAlt, FaUsers, FaCalendarAlt,
  FaPlus, FaEdit, FaTrash, FaDownload, FaCheck, FaTimes, FaUserShield, FaSignOutAlt
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { CSVLink } from 'react-csv';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);

  // Form States
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    location: '',
    capacity: '',
    noiseLevel: 'moderate',
    isAvailable: true,
    imageUrl: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, bookingsRes, usersRes, trendsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/analytics/overview`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/rooms`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/bookings`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/analytics/bookings`)
      ]);

      setStats(statsRes.data);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setBookingTrends(trendsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  // Room Management
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/rooms/${editingRoom._id}`, roomForm);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/rooms`, roomForm);
      }
      setShowRoomForm(false);
      setEditingRoom(null);
      setRoomForm({
        name: '', description: '', location: '', capacity: '',
        noiseLevel: 'moderate', isAvailable: true, imageUrl: ''
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/rooms/${id}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const startEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm(room);
    setShowRoomForm(true);
  };

  // User Management
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/role`, { role: newRole });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Booking Management
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/bookings/${bookingId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className='loading-state'>
        <div className='loading-spinner-large'></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className='admin-container'>
      {/* Sidebar */}
      <div className='admin-sidebar'>
        <div className='sidebar-header'>
          <FaUserShield size={24} />
          <h2>AdminPortal</h2>
        </div>

        <nav className='sidebar-nav'>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine /> <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <FaMapMarkerAlt /> <span>Study Spots</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendarAlt /> <span>Bookings</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> <span>Users</span>
          </button>
        </nav>

        <div className='sidebar-footer'>
          <button className='exit-btn' onClick={() => navigate('/')}>
            <FaSignOutAlt /> <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='admin-main'>
        <div className='admin-topbar'>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className='admin-user-info'>
            <span className='admin-badge'>Admin</span>
            <span>Administrator</span>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && stats && (
          <div className='dashboard-view animate-fadeIn'>
            <div className='stats-grid'>
              <div className='stat-card'>
                <div className='stat-icon-wrapper' style={{ background: 'var(--primary-gradient)' }}>
                  <FaCalendarAlt />
                </div>
                <div className='stat-details'>
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon-wrapper' style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <FaUsers />
                </div>
                <div className='stat-details'>
                  <h3>{stats.totalUsers}</h3>
                  <p>Active Users</p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon-wrapper' style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <FaMapMarkerAlt />
                </div>
                <div className='stat-details'>
                  <h3>{stats.totalRooms}</h3>
                  <p>Study Spots</p>
                </div>
              </div>
              <div className='stat-card'>
                <div className='stat-icon-wrapper' style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  <FaCheck />
                </div>
                <div className='stat-details'>
                  <h3>{stats.activeBookings}</h3>
                  <p>Active Bookings</p>
                </div>
              </div>
            </div>

            <div className='charts-grid'>
              <div className='chart-card'>
                <h3>Booking Trends (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className='chart-card'>
                <h3>Room Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Quiet', value: rooms.filter(r => r.noiseLevel === 'quiet').length },
                        { name: 'Moderate', value: rooms.filter(r => r.noiseLevel === 'moderate').length },
                        { name: 'Lively', value: rooms.filter(r => r.noiseLevel === 'lively').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ROOMS TAB */}
        {activeTab === 'rooms' && (
          <div className='rooms-view animate-fadeIn'>
            <div className='table-header'>
              <h3>Manage Study Spots</h3>
              <button className='btn btn-primary' onClick={() => {
                setEditingRoom(null);
                setRoomForm({
                  name: '', description: '', location: '', capacity: '',
                  noiseLevel: 'moderate', isAvailable: true, imageUrl: ''
                });
                setShowRoomForm(!showRoomForm);
              }}>
                <FaPlus /> Add New Spot
              </button>
            </div>

            {showRoomForm && (
              <form onSubmit={handleRoomSubmit} className='admin-form animate-slideInDown'>
                <div className='form-full-width'>
                  <h3>{editingRoom ? 'Edit Study Spot' : 'Add New Study Spot'}</h3>
                </div>

                <div>
                  <label>Name</label>
                  <input
                    value={roomForm.name}
                    onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Location</label>
                  <input
                    value={roomForm.location}
                    onChange={e => setRoomForm({ ...roomForm, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={roomForm.capacity}
                    onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Noise Level</label>
                  <select
                    value={roomForm.noiseLevel}
                    onChange={e => setRoomForm({ ...roomForm, noiseLevel: e.target.value })}
                  >
                    <option value="quiet">Quiet</option>
                    <option value="moderate">Moderate</option>
                    <option value="lively">Lively</option>
                  </select>
                </div>

                <div className='form-full-width'>
                  <label>Description</label>
                  <textarea
                    value={roomForm.description}
                    onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className='form-full-width'>
                  <label>Image URL</label>
                  <input
                    value={roomForm.imageUrl}
                    onChange={e => setRoomForm({ ...roomForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className='form-full-width'>
                  <label>
                    <input
                      type="checkbox"
                      checked={roomForm.isAvailable}
                      onChange={e => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                      style={{ width: 'auto', marginRight: '10px' }}
                    />
                    Available for booking
                  </label>
                </div>

                <div className='form-full-width' style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className='btn btn-primary'>Save Spot</button>
                  <button type="button" className='btn btn-secondary' onClick={() => setShowRoomForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className='table-container'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Noise</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id}>
                      <td>{room.name}</td>
                      <td>{room.location}</td>
                      <td>{room.capacity}</td>
                      <td style={{ textTransform: 'capitalize' }}>{room.noiseLevel}</td>
                      <td>
                        <span className={`status-badge ${room.isAvailable ? 'available' : 'unavailable'}`}>
                          {room.isAvailable ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className='action-btn btn-edit' onClick={() => startEditRoom(room)}>
                          <FaEdit />
                        </button>
                        <button className='action-btn btn-delete' onClick={() => handleDeleteRoom(room._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className='bookings-view animate-fadeIn'>
            <div className='table-header'>
              <h3>All Bookings</h3>
              <CSVLink
                data={bookings}
                filename={"campus-bookings.csv"}
                className="btn btn-primary"
              >
                <FaDownload /> Export CSV
              </CSVLink>
            </div>

            <div className='table-container'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.user?.name || 'Unknown'}</td>
                      <td>{booking.room?.name || 'Unknown'}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.timeSlot}</td>
                      <td>
                        <span className={`status-badge ${booking.status === 'confirmed' ? 'available' : 'unavailable'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button className='action-btn btn-delete' onClick={() => handleCancelBooking(booking._id)}>
                          <FaTimes /> Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className='users-view animate-fadeIn'>
            <div className='table-header'>
              <h3>User Management</h3>
            </div>

            <div className='table-container'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className='action-btn btn-edit'
                          onClick={() => handleRoleUpdate(user._id, user.role === 'admin' ? 'student' : 'admin')}
                          title="Toggle Role"
                        >
                          <FaUsers />
                        </button>
                        <button className='action-btn btn-delete' onClick={() => handleDeleteUser(user._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
