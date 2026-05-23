import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { BASE_URL } from './api/config.jsx';

const BookingForm = ({ place, onBack, onSuccess }) => {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    user_id: user?.user_id || '',
    place: place?.id || '',
    hotel: '',
    person_name: '',
    total_people: 1,
    members: [], // Start empty for 1 person
    identity_document: null,
    total_price: 0
  });

  // Explicitly fetch hotels from the API for this specific place
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${BASE_URL}/hotels/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const result = await response.json();
        if (result.status) {
          // Filter hotels associated with this place ID
          const filtered = result.data.filter(h => 
            Number(h.place) === Number(place?.id) || 
            Number(h.place_id) === Number(place?.id)
          );
          setHotels(filtered);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    };

    if (place?.id) {
      fetchHotels();
    }
  }, [place?.id]);

  // Ensure form is updated if user/place data arrives after initial render
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      user_id: user?.user_id || prev.user_id,
      place: place?.id || prev.place
    }));
  }, [user, place]);

  // Recalculate total price whenever people or hotel selection changes
  useEffect(() => {
    const totalPeople = parseInt(formData.total_people) || 0;
    const placePrice = parseFloat(place?.one_person_price) || 0;
    const placeTotal = placePrice * totalPeople;

    let hotelTotal = 0;
    if (formData.hotel) {
      const selectedHotel = hotels.find(h => String(h.id) === String(formData.hotel));
      if (selectedHotel) {
        const hotelPricePerRoom = parseFloat(selectedHotel.hotel_price) || 0;
        // Calculate rooms needed: 1 room for every 2 people
        const numRooms = Math.ceil(totalPeople / 2);
        hotelTotal = hotelPricePerRoom * numRooms;
      }
    }

    setFormData(prev => ({ ...prev, total_price: placeTotal + hotelTotal }));
  }, [formData.total_people, formData.hotel, place?.one_person_price, hotels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // If total_people changes, adjust members array length
      if (name === 'total_people') {
        const count = Math.max(1, parseInt(value) || 1);
        const extraCount = count - 1; // Array contains everyone EXCEPT the primary person
        const newMembers = [...prev.members];
        
        if (newMembers.length < extraCount) {
          for (let i = newMembers.length; i < extraCount; i++) {
            newMembers.push({ member_name: '', aadhaar_number: '' });
          }
        } else if (newMembers.length > extraCount) {
          newMembers.splice(extraCount);
        }
        updated.total_people = count;
        updated.members = newMembers;
      }
      return updated;
    });
  };

  const handleMemberChange = (index, field, value) => {
    setFormData(prev => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, identity_document: file }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {

    const data = new FormData();

    data.append('user_id', formData.user_id);
    data.append('place', formData.place);
    data.append('hotel', formData.hotel);
    data.append('person_name', formData.person_name);
    data.append('total_people', formData.total_people);
    data.append('total_price', formData.total_price);

    // IMPORTANT
    data.append(
      'members',
      JSON.stringify(formData.members)
    );

    if (formData.identity_document) {
      data.append(
        'identity_document',
        formData.identity_document
      );
    }

    console.log("=== FORM DATA ===");

    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(
      `${BASE_URL}/booking/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }
    );

    const result = await response.json();

    console.log(result);

    if (response.ok) {

      setMessage({
        type: 'success',
        text: 'Booking successful'
      });

      onSuccess();

    } else {

      setMessage({
        type: 'error',
        text: JSON.stringify(result)
      });

    }

  } catch (error) {

    console.log(error);

    setMessage({
      type: 'error',
      text: 'Something went wrong'
    });

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="admin-form-centered" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1rem' }}>
        <button onClick={onBack} className="btn-back">← Back to Available Tracks</button>
      </div>
      <div className="dash-card user-card animate-pop-in" style={{ maxWidth: '600px', width: '100%', padding: '30px' }}>
        <div className="card-header" style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>🎟️ Book Your Trek</h2>
          <p style={{ color: '#7f8c8d' }}>Secure your spot for the {place?.place_name} expedition.</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Explorer ID</label>
              <input type="text" value={formData.user_id} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input type="text" value={place?.place_name || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Select Lodge (Hotel)</label>
            <select 
              name="hotel" 
              value={formData.hotel} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="">-- Choose a Lodge --</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.hotel_name} (₹{h.hotel_price})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Primary Contact Name</label>
              <input type="text" name="person_name" value={formData.person_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Identity Document (ID Proof)</label>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className="form-group">
              <label>Total People</label>
              <input type="number" name="total_people" min="1" value={formData.total_people} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Total Price (₹)</label>
              <input type="text" value={formData.total_price} disabled style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#2e7d5f' }} />
            </div>
          </div>

          {formData.members.length > 0 && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Co-Explorers Details</h4>
              {formData.members.map((member, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="text" placeholder="Full Name" value={member.member_name} onChange={(e) => handleMemberChange(index, 'member_name', e.target.value)} required />
                  <input type="text" placeholder="Aadhaar Number" value={member.aadhaar_number} onChange={(e) => handleMemberChange(index, 'aadhaar_number', e.target.value)} required maxLength="12" />
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{
            width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '20px'
          }}>
            {loading ? 'Processing...' : 'Confirm Expedition Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;