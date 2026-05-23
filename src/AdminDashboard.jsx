import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import DashboardTopNav from './DashboardTopNav.jsx';
import UserTable from './UserTable.jsx';
import AdminBookings from './AdminBookings.jsx';
import AdminFeedbacks from './AdminFeedbacks.jsx';
import { BASE_URL } from './api/config.jsx';
import './Dashboard.css';

const AdminDashboard = () => {
  const { accessToken } = useAuth();
  const [view, setView] = useState('summary'); // summary, add, list, add-hotel, view-hotels, all-hotels, users, all-bookings, all-feedbacks
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    place_name: '',
    rating: '',
    one_person_price: '',
    number_of_days_stay: '',
    description: '',
    booking_date: '',
    booking_time: ''
  });
  const [image, setImage] = useState(null);
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelFormData, setHotelFormData] = useState({
    hotel_name: '',
    hotel_rating: '',
    hotel_price: '',
    hotel_description: ''
  });
  const [hotelImage, setHotelImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTermPlace, setSearchTermPlace] = useState('');
  const [searchTermHotel, setSearchTermHotel] = useState('');
  const [searchTermUser, setSearchTermUser] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [currentPagePlace, setCurrentPagePlace] = useState(1);
  const [currentPageHotel, setCurrentPageHotel] = useState(1);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const itemsPerPage = 15;

  const filteredPlaces = places.filter(place =>
    place.place_name.toLowerCase().includes(searchTermPlace.toLowerCase())
  );

  const allHotels = places.flatMap(place => 
    (place.hotels || []).map(hotel => ({ ...hotel, place_name: place.place_name, place_id: place.id }))
  );

  const filteredHotels = allHotels.filter(hotel =>
    hotel.hotel_name.toLowerCase().includes(searchTermHotel.toLowerCase()) ||
    hotel.place_name.toLowerCase().includes(searchTermHotel.toLowerCase())
  );

  const filteredUsers = usersList.filter(u => 
    u.role === 'user' && 
    (u.name.toLowerCase().includes(searchTermUser.toLowerCase()) || 
     u.user_id.toLowerCase().includes(searchTermUser.toLowerCase()) ||
     u.mobile_number.includes(searchTermUser))
  );

  // Pagination calculations for places
  const indexOfLastPlace = currentPagePlace * itemsPerPage;
  const indexOfFirstPlace = indexOfLastPlace - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);
  const totalPagesPlaces = Math.ceil(filteredPlaces.length / itemsPerPage);

  // Pagination calculations for hotels
  const indexOfLastHotel = currentPageHotel * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPagesHotels = Math.ceil(filteredHotels.length / itemsPerPage);

  // Pagination calculations for users
  const indexOfLastUser = currentPageUser * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

  const totalHotels = places.reduce((acc, place) => acc + (place.hotels?.length || 0), 0);

  useEffect(() => {
    fetchPlaces();
    fetchUserCount();
    fetchBookings();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (view === 'list') {
      setCurrentPagePlace(1);
    } else if (view === 'all-hotels') {
      setCurrentPageHotel(1);
    } else if (view === 'users') {
      setCurrentPageUser(1);
      setSearchTermUser(''); // Reset search term when navigating to users view
      fetchUsers();
    } else if (view === 'all-bookings') {
      fetchBookings();
    } else if (view === 'all-feedbacks') {
      fetchFeedbacks();
    }
  }, [view]);

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${BASE_URL}/places/`);
      const result = await response.json();
      if (result.status) {
        setPlaces(result.data);
      }
    } catch (err) {
      console.error("Error fetching places:", err);
    }
  };

  const fetchBookings = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/booking/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const result = await response.json();
      if (result.status) {
        setBookings(result.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    // No Authentication header used for getting feedback as per request
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/feedback/`);
      const result = await response.json();
      if (result.status) {
        setFeedbacks(result.data);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const result = await response.json();
      if (result.status) {
        setUsersList(result.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user-count/`);
      const data = await response.json();
      // API returns user_count
      const countValue = data.user_count !== undefined ? data.user_count : data.count;
      if (response.ok && countValue !== undefined) {
        setUserCount(countValue - 1); // Show total count - 1 as requested
      }
    } catch (err) {
      console.error("Error fetching user count:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleHotelChange = (e) => {
    setHotelFormData({ ...hotelFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleHotelImageChange = (e) => {
    setHotelImage(e.target.files[0]);
  };

  const startEditPlace = (place) => {
    setSelectedPlace(place);
    setFormData({
      place_name: place.place_name,
      rating: place.rating,
      one_person_price: place.one_person_price,
      number_of_days_stay: place.number_of_days_stay,
      description: place.description,
      booking_date: place.booking_date ? place.booking_date.split('T')[0] : '',
      booking_time: place.booking_time ? (place.booking_time.includes('T') ? place.booking_time.split('T')[1].slice(0, 5) : place.booking_time.slice(0, 5)) : ''
    });
    setImage(null);
    setView('edit-place');
  };

  const startEditHotel = (hotel) => {
    setSelectedHotel(hotel);
    setHotelFormData({
      hotel_name: hotel.hotel_name,
      hotel_rating: hotel.hotel_rating,
      hotel_price: hotel.hotel_price,
      hotel_description: hotel.hotel_description
    });
    setHotelImage(null);
    setView('edit-hotel');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Using FormData to handle file upload along with text fields
    const postData = new FormData();
    postData.append('place_name', formData.place_name);
    postData.append('rating', formData.rating);
    postData.append('one_person_price', formData.one_person_price);
    postData.append('number_of_days_stay', formData.number_of_days_stay);
    postData.append('description', formData.description);

    // Ensure booking_date and booking_time are valid ISO strings for the backend DateTimeField
    if (formData.booking_date) {
      postData.append('booking_date', `${formData.booking_date}T00:00:00Z`);
    }
    if (formData.booking_time) {
      // Placeholder date for the time field if the model uses DateTimeField for time
      postData.append('booking_time', `2000-01-01T${formData.booking_time}:00Z`);
    }

    if (image) postData.append('image', image);

    const isEdit = view === 'edit-place';
    const url = isEdit ? `http://127.0.0.1:8000/places/${selectedPlace.id}/` : 'http://127.0.0.1:8000/places/';

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: postData,
      });
      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: isEdit ? 'Destination updated successfully!' : 'Destination posted successfully!' });
        setFormData({ 
          place_name: '', 
          rating: '', 
          one_person_price: '', 
          number_of_days_stay: '', 
          description: '',
          booking_date: '',
          booking_time: ''
        });
        setImage(null);
        fetchPlaces(); // Refresh data
        setTimeout(() => {
          setView('summary'); // Return to summary after success
          setMessage({ type: '', text: '' });
        }, 1500);
        e.target.reset(); // Reset the file input field
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to post destination.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const isEdit = view === 'edit-hotel';

    const postData = new FormData();
    postData.append('place', selectedPlace.id);
    postData.append('hotel_name', hotelFormData.hotel_name);
    postData.append('hotel_rating', hotelFormData.hotel_rating);
    postData.append('hotel_price', hotelFormData.hotel_price);
    postData.append('hotel_description', hotelFormData.hotel_description);
    if (hotelImage) postData.append('hotel_image', hotelImage);

    const url = isEdit ? `http://127.0.0.1:8000/hotels/${selectedHotel.id}/` : 'http://127.0.0.1:8000/hotels/';

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: postData,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: isEdit ? 'Hotel updated successfully!' : 'Hotel registered successfully!' });
        setHotelFormData({ hotel_name: '', hotel_rating: '', hotel_price: '', hotel_description: '' });
        setHotelImage(null);
        fetchPlaces(); // Refresh list to get updated hotel count
        setTimeout(() => {
          setView('list');
          setMessage({ type: '', text: '' });
        }, 1500);
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.message || 'Action failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination? This will also remove all registered hotels.")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/places/${id}/`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Destination deleted successfully!' });
        fetchPlaces();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete destination.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error.' });
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await fetch(`${BASE_URL}/hotels/${hotelId}/`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Hotel deleted successfully!' });
        const res = await fetch(`${BASE_URL}/places/`);
        const result = await res.json();
        if (result.status) {
          setPlaces(result.data);
          const updatedPlace = result.data.find(p => p.id === selectedPlace.id);
          setSelectedPlace(updatedPlace);
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete hotel.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error.' });
    }
  };

  const renderPagination = (currentPage, totalPages, paginate) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            style={{ padding: '8px 15px', borderRadius: '5px', border: `1px solid ${currentPage === number ? '#2563eb' : '#ccc'}`, background: currentPage === number ? '#2563eb' : 'white', color: currentPage === number ? 'white' : '#333', cursor: 'pointer', fontWeight: currentPage === number ? 'bold' : 'normal' }}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <DashboardTopNav variant="admin" onViewChange={setView} />

      <div className="dashboard-body">
        <div className="role-dashboard">
          {view === 'summary' && (
            <div className="admin-summary-view animate-pop-in" style={{ padding: '14px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '10px' }}>Admin Overview</h1>
                <p style={{ color: '#64748b' }}>Manage your travel catalog and monitor registered services.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                {/* Stat Card 1 */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'left', 
                    borderLeft: '5px solid #2563eb',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setView('list')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Destinations</p>
                      <h3 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#1e293b' }}>{places.length}</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>🌍</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>Manage all places →</p>
                </div>

                {/* Stat Card 2 */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'left', 
                    borderLeft: '5px solid #10b981',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setView('all-hotels')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Hotels</p>
                      <h3 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#1e293b' }}>{totalHotels}</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>🏨</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>View all registered hotels →</p>
                </div>

                {/* User Stat Card */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'left', 
                    borderLeft: '5px solid #6366f1',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setView('users')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Users</p>
                      <h3 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#1e293b' }}>{userCount}</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>👥</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>Manage explorers →</p>
                </div>

                {/* Bookings Stat Card */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'left', 
                    borderLeft: '5px solid #f59e0b',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setView('all-bookings')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Bookings</p>
                      <h3 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#1e293b' }}>{bookings.length}</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>🎟️</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: '600' }}>Review all reservations →</p>
                </div>

                {/* Feedbacks Stat Card */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'left', 
                    borderLeft: '5px solid #6366f1',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setView('all-feedbacks')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Explorer Stories</p>
                      <h3 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#1e293b' }}>{feedbacks.length}</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>💬</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>Review all feedback →</p>
                </div>

                {/* Quick Action Card */}
                <div 
                  className="dash-card admin-card" 
                  style={{
                    padding: '30px', 
                    textAlign: 'center', 
                    background: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                    color: '#475569',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem', fontWeight: '700' }}>Need to expand?</h3>
                  <button 
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem'
                    }}
                    onClick={() => setView('add')}
                  >+ Add New Destination</button>
                </div>
              </div>
            </div>
          )}

          {(view === 'add' || view === 'edit-place') && (
            <div className="admin-form-centered" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1rem', display: 'flex' }}>
                <button onClick={() => setView(view === 'add' ? 'summary' : 'list')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}>← Back</button>
              </div>
              <div className="dash-card admin-card animate-pop-in" style={{ maxWidth: '600px', width: '100%', padding: '30px' }}>
                <div className="card-header" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '5px' }}>{view === 'add' ? '✨ Add New Place' : '📝 Edit Destination'}</h2>
                  <p style={{ color: '#7f8c8d' }}>{view === 'add' ? 'Create a new destination post.' : 'Update the details for this destination.'}</p>
                </div>

                {message.text && (
                  <div className={`alert alert-${message.type}`} style={{
                    padding: '12px', borderRadius: '8px', marginBottom: '20px', 
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                  }}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="add-place-form">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Place Name</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="text" name="place_name" value={formData.place_name} onChange={handleChange} required /></div>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Rating</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="number" name="rating" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} required /></div>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Price (₹)</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="number" name="one_person_price" value={formData.one_person_price} onChange={handleChange} required /></div>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Duration (Days)</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="number" name="number_of_days_stay" value={formData.number_of_days_stay} onChange={handleChange} required /></div>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Booking Date</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="date" name="booking_date" value={formData.booking_date} onChange={handleChange} required /></div>
                    <div className="form-group"><label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Booking Time</label><input style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} type="time" name="booking_time" value={formData.booking_time} onChange={handleChange} required /></div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Description</label>
                    <textarea style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} name="description" value={formData.description} onChange={handleChange} rows="3" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Place Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required={view === 'add'} />
                  </div>
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '12px', borderRadius: '8px', border: 'none', 
                    background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', 
                    fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
                  }}>
                    {loading ? 'Saving...' : (view === 'add' ? 'Post Destination' : 'Update Destination')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {(view === 'add-hotel' || view === 'edit-hotel') && (
            <div className="admin-form-centered" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1rem' }}>
                <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '700' }}>← Back to Places</button>
              </div>
              <div className="dash-card admin-card animate-pop-in" style={{ maxWidth: '600px', width: '100%', padding: '30px' }}>
                <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>{view === 'add-hotel' ? '🏨 Add Hotel' : '🛠️ Edit Hotel'} for {selectedPlace?.place_name}</h2>
                
                {message.text && <div className={`alert alert-${message.type}`} style={{ padding: '10px', borderRadius: '5px', marginBottom: '15px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da' }}>{message.text}</div>}

                <form onSubmit={handleHotelSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div className="form-group"><label>Hotel Name</label><input style={{ width: '100%', padding: '8px' }} type="text" name="hotel_name" value={hotelFormData.hotel_name} onChange={handleHotelChange} required /></div>
                    <div className="form-group"><label>Rating</label><input style={{ width: '100%', padding: '8px' }} type="number" name="hotel_rating" step="0.1" min="0" max="5" value={hotelFormData.hotel_rating} onChange={handleHotelChange} required /></div>
                    <div className="form-group"><label>Price (₹)</label><input style={{ width: '100%', padding: '8px' }} type="number" name="hotel_price" value={hotelFormData.hotel_price} onChange={handleHotelChange} required /></div>
                    <div className="form-group"><label>Hotel Image</label><input type="file" accept="image/*" onChange={handleHotelImageChange} required={view === 'add-hotel'} /></div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Hotel Description</label>
                    <textarea style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} name="hotel_description" value={hotelFormData.hotel_description} onChange={handleHotelChange} rows="3" required />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-100" style={{ padding: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {loading ? 'Saving...' : (view === 'add-hotel' ? 'Register Hotel' : 'Update Hotel')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {view === 'view-hotels' && (
            <div className="places-list-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ margin: 0 }}>Hotels in {selectedPlace?.place_name}</h2>
                  {message.text && (
                    <span style={{ fontSize: '0.9rem', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                      {message.text}
                    </span>
                  )}
                </div>
                <button onClick={() => setView('list')} style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>Back to Places</button>
              </div>
              <div className="dashboard-cards">
                {selectedPlace?.hotels?.map((hotel) => (
                  <div key={hotel.id} className="dash-card admin-card animate-pop-in" style={{ padding: '0', overflow: 'hidden' }}>
                    <img 
                      src={hotel.hotel_image?.startsWith('http') ? hotel.hotel_image : `${BASE_URL}${hotel.hotel_image}`} 
                      alt={hotel.hotel_name}  
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0 }}>{hotel.hotel_name}</h3>
                        <span>⭐ {hotel.hotel_rating}</span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>Price:</strong> ₹{hotel.hotel_price}</p>
                      <p style={{ color: '#666', fontSize: '0.8rem' }}>{hotel.hotel_description}</p>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                        <button 
                          onClick={() => startEditHotel(hotel)}
                          style={{ flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #2563eb', backgroundColor: '#fff', color: '#2563eb' }}
                        >Edit</button>
                        <button 
                          onClick={() => handleDeleteHotel(hotel.id)}
                          style={{ flex: 1, padding: '5px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none', backgroundColor: '#ef4444', color: '#fff' }}
                        >Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!selectedPlace?.hotels || selectedPlace.hotels.length === 0) && <p>No hotels registered for this place yet.</p>}
              </div>
            </div>
          )}

          {view === 'all-hotels' && (
            <div className="places-list-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ margin: 0 }}>All Registered Hotels</h2>
                  {message.text && (
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.9rem', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da' }}>
                      {message.text}
                    </span>
                  )}
                </div>
                <button onClick={() => setView('summary')} style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>Back to Stats</button>
              </div>
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search by hotel name or location..." 
                  className="admin-search-input"
                  value={searchTermHotel}
                  onChange={(e) => setSearchTermHotel(e.target.value)}
                />
                {searchTermHotel && (
                  <p style={{ 
                    fontSize: '0.85rem', color: '#64748b', marginTop: '10px', 
                    marginLeft: '8px', fontWeight: '500', animation: 'fadeIn 0.3s ease' 
                  }}>
                    Showing {filteredHotels.length} results
                  </p>
                )}
              </div>
              <div className="dashboard-cards">
                {currentHotels.map((hotel) => (
                  <div key={hotel.id} className="dash-card admin-card animate-pop-in" style={{ padding: '0', overflow: 'hidden' }}>
                    <img 
                      src={hotel.hotel_image?.startsWith('http') ? hotel.hotel_image : `http://127.0.0.1:8000${hotel.hotel_image}`} 
                      alt={hotel.hotel_name}  
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0 }}>{hotel.hotel_name}</h3>
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                          ⭐ {hotel.hotel_rating}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', marginBottom: '10px' }}>📍 {hotel.place_name}</p>
                      <p style={{ margin: '5px 0', fontSize: '0.85rem' }}><strong>Price:</strong> ₹{hotel.hotel_price}</p>
                      <p style={{ color: '#666', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {hotel.hotel_description}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                        <button 
                          onClick={() => {
                            const place = places.find(p => p.id === hotel.place_id);
                            setSelectedPlace(place);
                            startEditHotel(hotel);
                          }}
                          style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #2563eb', backgroundColor: '#fff', color: '#2563eb', fontWeight: '600' }}
                        >Edit</button>
                        <button 
                          onClick={() => handleDeleteHotel(hotel.id)}
                          style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '600' }}
                        >Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredHotels.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#64748b' }}>{totalHotels === 0 ? 'No hotels registered yet.' : 'No hotels match your search.'}</p>}
                {renderPagination(currentPageHotel, totalPagesHotels, setCurrentPageHotel)}
              </div>
            </div>
          )}

          {view === 'list' && (
            <div className="places-list-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <h2 style={{ margin: 0 }}>Registered Destinations</h2>
                  {message.text && (
                    <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.9rem', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da' }}>
                      {message.text}
                    </span>
                  )}
                </div>
                <button onClick={() => setView('summary')} style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>Back to Stats</button>
              </div>
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  className="admin-search-input"
                  value={searchTermPlace}
                  onChange={(e) => setSearchTermPlace(e.target.value)}
                />
                {searchTermPlace && (
                  <p style={{ 
                    fontSize: '0.85rem', color: '#64748b', marginTop: '10px', 
                    marginLeft: '8px', fontWeight: '500', animation: 'fadeIn 0.3s ease' 
                  }}>
                    Found {filteredPlaces.length} destinations
                  </p>
                )}
              </div>
              <div className="dashboard-cards">
                {currentPlaces.map((place) => (
                  <div key={place.id} className="dash-card admin-card animate-pop-in" style={{ padding: '0', overflow: 'hidden', borderLeft: 'none' }}>
                    <img 
                      src={place.image?.startsWith('http') ? place.image : `http://127.0.0.1:8000${place.image}`} 
                      alt={place.place_name} 
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>{place.place_name}</h3>
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                          ⭐ {place.rating}
                        </span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Price:</strong> ₹{place.one_person_price}</p>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Duration:</strong> {place.number_of_days_stay} Days</p>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#2563eb' }}>
                        <strong>Next Trek:</strong> {place.booking_date ? new Date(place.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} 
                        {' @ '} 
                        {place.booking_time ? (
                          place.booking_time.includes('T') ? new Date(place.booking_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : place.booking_time.slice(0, 5)
                        ) : 'TBD'}
                      </p>
                      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '10px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {place.description}
                      </p>
                      
                      <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>
                          🏨 Registered Hotels: {place.hotels?.length || 0}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => { setSelectedPlace(place); setView('add-hotel'); }}
                            style={{ width: '48%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #2563eb', color: '#2563eb' }}
                          >Add Hotel</button>
                          <button 
                            onClick={() => { setSelectedPlace(place); setView('view-hotels'); }}
                            disabled={!place.hotels || place.hotels.length === 0}
                            style={{ width: '48%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', cursor: place.hotels?.length > 0 ? 'pointer' : 'not-allowed', backgroundColor: place.hotels?.length > 0 ? '#2563eb' : '#94a3b8', border: 'none', color: '#fff' }}
                          >View Hotels</button>
                          <button 
                            onClick={() => startEditPlace(place)}
                            style={{ width: '48%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#1e293b' }}
                          >Edit Details</button>
                          <button 
                            onClick={() => handleDeletePlace(place.id)}
                            style={{ width: '48%', padding: '6px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b' }}
                          >Delete Place</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPlaces.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#64748b' }}>{places.length === 0 ? 'No destinations registered yet.' : 'No destinations match your search.'}</p>}
                {renderPagination(currentPagePlace, totalPagesPlaces, setCurrentPagePlace)}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className="users-list-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ margin: 0 }}>Registered Explorers</h2>
                </div>
                <button onClick={() => setView('summary')} style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>Back to Stats</button>
              </div>
              
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search explorers by name, ID or mobile..." 
                  className="admin-search-input"
                  value={searchTermUser}
                  onChange={(e) => setSearchTermUser(e.target.value)}
                />
                {searchTermUser && (
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px', marginLeft: '8px', fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>
                    Found {filteredUsers.length} explorers
                  </p>
                )}
              </div>

              <UserTable users={currentUsers} />
              
              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  {loading ? 'Loading users...' : 'No registered explorers match your search.'}
                </div>
              )}
              
              {renderPagination(currentPageUser, totalPagesUsers, setCurrentPageUser)}
            </div>
          )}

          {view === 'all-bookings' && (
            <AdminBookings 
              bookings={bookings} 
              places={places} 
              onBack={() => setView('summary')} 
              accessToken={accessToken}
              onRefresh={fetchBookings}
            />
          )}

          {view === 'all-feedbacks' && (
            <AdminFeedbacks 
              feedbacks={feedbacks} 
              onBack={() => setView('summary')} 
              accessToken={accessToken}
              onRefresh={fetchFeedbacks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
