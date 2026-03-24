import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaCalendarPlus, FaCheck, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './StudySpaces.css';

const ALL_AMENITIES = ['Whiteboard', 'Power outlets', 'Projector', 'Smart TV', 'Computers', 'WiFi', 'Lounge seating', 'Microphone', 'Air conditioning', 'Lab equipment'];

export default function StudySpaces() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rooms`);
        setRooms(res.data);
      } catch (err) {
        setError('Failed to load study spaces. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setMinCapacity('');
    setMaxCapacity('');
    setSelectedAmenities([]);
  };

  const activeFilterCount = [
    search, minCapacity, maxCapacity, ...selectedAmenities
  ].filter(Boolean).length;

  const filtered = rooms.filter(room => {
    if (search && !room.name.toLowerCase().includes(search.toLowerCase()) &&
        !room.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (minCapacity && room.capacity < parseInt(minCapacity)) return false;
    if (maxCapacity && room.capacity > parseInt(maxCapacity)) return false;
    if (selectedAmenities.length > 0 &&
        !selectedAmenities.every(a => room.amenities?.includes(a))) return false;
    return true;
  });

  if (loading) return (
    <div className="spaces-container">
      <div className="loading-state">
        <div className="spinner-large" />
        <p>Loading study spaces...</p>
      </div>
    </div>
  );

  return (
    <div className="spaces-container animate-fadeIn">
      <div className="spaces-header">
        <h1>Study Spaces</h1>
        <p>Browse and book available rooms on campus</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch('')}><FaTimes /></button>}
        </div>
        <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
        {activeFilterCount > 0 && (
          <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <h4>Capacity</h4>
            <div className="capacity-inputs">
              <input type="number" placeholder="Min" value={minCapacity} onChange={e => setMinCapacity(e.target.value)} min="1" />
              <span>to</span>
              <input type="number" placeholder="Max" value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} min="1" />
              <span>people</span>
            </div>
          </div>
          <div className="filter-section">
            <h4>Amenities</h4>
            <div className="amenity-filters">
              {ALL_AMENITIES.map(a => (
                <button
                  key={a}
                  className={`amenity-filter-btn ${selectedAmenities.includes(a) ? 'selected' : ''}`}
                  onClick={() => toggleAmenity(a)}
                >
                  {selectedAmenities.includes(a) && <FaCheck />} {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="results-count">{filtered.length} room{filtered.length !== 1 ? 's' : ''} found</p>

      {error && <div className="spaces-error">{error}</div>}

      <div className="spaces-grid">
        {filtered.map(room => (
          <div key={room._id} className="space-card">
            <div className="space-card-header">
              <h3>{room.name}</h3>
              <span className="available-badge"><FaCheck /> Available</span>
            </div>
            <p className="space-description">{room.description}</p>
            <div className="space-meta">
              <span><FaMapMarkerAlt /> {room.location}</span>
              <span><FaUsers /> {room.capacity} people</span>
            </div>
            {room.amenities?.length > 0 && (
              <div className="amenities">
                {room.amenities.map((a, i) => <span key={i} className="amenity-tag">{a}</span>)}
              </div>
            )}
            <button className="book-btn" onClick={() => navigate('/book')}>
              <FaCalendarPlus /> Book Room
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !error && (
        <div className="no-rooms">
          <p>No rooms match your filters.</p>
          <button className="clear-all-btn" style={{marginTop: '12px'}} onClick={clearFilters}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
