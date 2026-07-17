import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Trash, AlertTriangle, CheckCircle, Info, HeartHandshake, Compass } from 'lucide-react';
import Loader from '../components/Loader';
import { useAuth, API_URL } from '../context/AuthContext';

const TempleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [temple, setTemple] = useState(null);
  const [activeTab, setActiveTab] = useState('slots'); // slots | about | donate
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingTemple, setLoadingTemple] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Devotee state
  const [devotees, setDevotees] = useState([
    { name: '', age: '', gender: 'Male', idProofType: 'Aadhaar Card', idProofNumber: '' }
  ]);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Quick Donation state
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDonor, setDonationDonor] = useState(user ? user.name : '');
  const [donationPurpose, setDonationPurpose] = useState('General Donation');
  const [donationPaymentMethod, setDonationPaymentMethod] = useState('UPI');
  const [donationSubmitting, setDonationSubmitting] = useState(false);

  useEffect(() => {
    fetchTempleDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate && activeTab === 'slots') {
      fetchSlots();
    }
  }, [selectedDate, activeTab, id]);

  const fetchTempleDetails = async () => {
    try {
      setLoadingTemple(true);
      const res = await axios.get(`${API_URL}/temples/${id}`);
      if (res.data.success) {
        setTemple(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load temple details.');
    } finally {
      setLoadingTemple(false);
    }
  };

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      const res = await axios.get(`${API_URL}/slots/temple/${id}?date=${selectedDate}`);
      if (res.data.success) {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const addDevotee = () => {
    setDevotees([...devotees, { name: '', age: '', gender: 'Male', idProofType: 'Aadhaar Card', idProofNumber: '' }]);
  };

  const removeDevotee = (index) => {
    if (devotees.length === 1) return;
    setDevotees(devotees.filter((_, i) => i !== index));
  };

  const handleDevoteeChange = (index, field, value) => {
    const newDevotees = [...devotees];
    newDevotees[index][field] = value;
    setDevotees(newDevotees);
  };

  const handleOpenBookingModal = (slot) => {
    if (!user) {
      toast.info('Please log in to reserve a darshan ticket');
      return navigate('/login');
    }
    if (slot.availableSlots <= 0) {
      return toast.warning('Selected slot is full.');
    }
    setSelectedSlot(slot);
    setDevotees([{ name: '', age: '', gender: 'Male', idProofType: 'Aadhaar Card', idProofNumber: '' }]);
    setShowModal(true);
  };

  const handleBookTickets = async (e) => {
    e.preventDefault();
    
    // Custom Validations matching backend validator
    for (let i = 0; i < devotees.length; i++) {
      const d = devotees[i];
      if (!d.name || !d.age || !d.idProofNumber) {
        return toast.error(`Please complete all fields for Devotee #${i + 1}`);
      }
      const ageNum = parseInt(d.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return toast.error(`Please enter a valid age (1-120) for Devotee #${i + 1}`);
      }
      if (d.idProofNumber.trim().length < 4) {
        return toast.error(`Please enter a valid ID Number for Devotee #${i + 1}`);
      }
    }

    try {
      setBookingLoading(true);
      const res = await axios.post(`${API_URL}/bookings`, {
        templeId: id,
        slotId: selectedSlot._id,
        devotees
      });

      if (res.data.success) {
        toast.success('Darshan reservations confirmed!');
        setShowModal(false);
        navigate('/bookings');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleQuickDonation = async (e) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) < 10) {
      return toast.error('Minimum contribution amount is ₹10');
    }
    if (!donationDonor) {
      return toast.error('Please enter devotee name');
    }

    try {
      setDonationSubmitting(true);
      const res = await axios.post(`${API_URL}/donations`, {
        templeId: id,
        amount: parseFloat(donationAmount),
        devoteeName: donationDonor,
        purpose: donationPurpose,
        paymentMethod: donationPaymentMethod
      });

      if (res.data.success) {
        toast.success(`Thank you! Generous offering of ₹${donationAmount} processed successfully.`);
        setDonationAmount('');
        setActiveTab('about');
      }
    } catch (err) {
      console.error(err);
      toast.error('Transaction failed.');
    } finally {
      setDonationSubmitting(false);
    }
  };

  if (loadingTemple) return <Loader />;
  if (!temple) return <div className="glass-card"><p>Temple entity not found.</p></div>;

  return (
    <div>
      {/* Premium Banner */}
      <div className="detail-banner">
        <img src={temple.image} alt={temple.name} className="detail-banner-img" />
        <div className="detail-banner-content">
          <span style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
            PREEMINENT SHRINE
          </span>
          <h1 style={{ fontSize: '3rem', margin: '0.2rem 0 0.5rem', lineHeight: '1.2' }}>{temple.name}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', color: '#e5e7eb' }}>
              <MapPin size={16} style={{ color: '#ef4444' }} /> {temple.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', color: '#e5e7eb' }}>
              <Clock size={16} style={{ color: '#f59e0b' }} /> Opening Hours: {temple.timings}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout Nav */}
      <div className="tab-nav" style={{ marginBottom: '2.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
        >
          <CalendarIcon size={16} /> Book Darshan Ticket
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
        >
          <Compass size={16} /> History & Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('donate')}
          className={`tab-btn ${activeTab === 'donate' ? 'active' : ''}`}
        >
          <HeartHandshake size={16} /> Direct Donation
        </button>
      </div>

      {/* Tab Contents: Slots Picker */}
      {activeTab === 'slots' && (
        <div>
          <div style={styles.dateHeader}>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Available Darshan Slots
            </h3>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.datePicker}
            />
          </div>

          {loadingSlots ? (
            <Loader />
          ) : slots.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem', marginTop: '1.5rem' }}>
              <AlertTriangle style={{ color: '#fbbf24', display: 'block', margin: '0 auto 1rem' }} size={36} />
              <p style={{ color: '#9ca3af' }}>No darshan timings listed for {selectedDate}. Choose another date.</p>
            </div>
          ) : (
            <div className="grid-cols-3" style={{ marginTop: '1.5rem' }}>
              {slots.map((slot) => {
                const isFull = slot.availableSlots === 0;
                const isFast = slot.availableSlots > 0 && slot.availableSlots <= 10;
                
                let textCol = '#10b981';
                let bgCol = 'rgba(16, 185, 129, 0.1)';
                if (isFull) {
                  textCol = '#ef4444';
                  bgCol = 'rgba(239, 68, 68, 0.1)';
                } else if (isFast) {
                  textCol = '#f59e0b';
                  bgCol = 'rgba(245, 158, 11, 0.1)';
                }

                return (
                  <div key={slot._id} className="glass-card" style={styles.slotCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={styles.typeTag(slot.type)}>{slot.type}</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24' }}>
                        {slot.price === 0 ? 'Free' : `₹${slot.price}`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'white', marginBottom: '0.6rem' }}>
                      <Clock size={16} style={{ color: '#f59e0b' }} /> {slot.timeSlot}
                    </h4>

                    <span style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: textCol, background: bgCol, marginBottom: '1.5rem' }}>
                      {isFull ? 'Sold Out' : isFast ? `Fast Filling: ${slot.availableSlots} left` : `${slot.availableSlots} slots left`}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenBookingModal(slot)}
                      className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                      disabled={isFull}
                    >
                      {isFull ? 'Unavailable' : 'Select & Book'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: About Info */}
      {activeTab === 'about' && (
        <div className="glass-card" style={{ padding: '2.5rem', lineHeight: '1.8' }}>
          <h3 className="serif-title" style={{ fontSize: '2rem', color: '#fbbf24', marginBottom: '1rem' }}>
            Historical Significance & Deities
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '1.5rem' }}>
            Presiding Lord: <strong style={{ color: 'white' }}>{temple.deity}</strong>
          </p>
          <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '1.5rem', color: '#e5e7eb', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
            {temple.description}
          </div>
          <p style={{ color: '#9ca3af' }}>
            Visiting pilgrims are requested to wear traditional attire. Cameras and cell phones are restricted inside the inner sanctum. Ensure you keep your printed ticket pass ready for entry scanning at the gate.
          </p>
        </div>
      )}

      {/* Tab Contents: Direct Donation */}
      {activeTab === 'donate' && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <HeartHandshake style={{ color: '#fbbf24' }} /> Contribute to {temple.name}
          </h3>
          <form onSubmit={handleQuickDonation}>
            <div className="form-group">
              <label className="form-label">Devotee Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Devotee name offering seva"
                value={donationDonor}
                onChange={(e) => setDonationDonor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purpose of Seva</label>
              <select
                className="form-control"
                value={donationPurpose}
                onChange={(e) => setDonationPurpose(e.target.value)}
              >
                <option value="General Donation">General Temple Contribution</option>
                <option value="Annadanam">Annadanam (Free Meals Fund)</option>
                <option value="Temple Development">Temple Renovation & Development</option>
                <option value="Pooja/Seva Fund">Special Pooja / Archana Fund</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={donationPaymentMethod}
                onChange={(e) => setDonationPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount (min ₹10)"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                min="10"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={donationSubmitting}>
              {donationSubmitting ? 'Processing Contribution...' : 'Submit Seva Donation'}
            </button>
          </form>
        </div>
      )}

      {/* Devotees Modal Panel */}
      {showModal && selectedSlot && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalBody}>
            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              Devotees Ticket Reservation Form
            </h3>
            
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.12)', padding: '0.85rem 1.1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#fbbf24' }}>
              <p>Slot Window: <strong>{selectedSlot.timeSlot}</strong> | Type: <strong>{selectedSlot.type}</strong></p>
              <p>Rate: <strong>{selectedSlot.price === 0 ? 'Free' : `₹${selectedSlot.price} per head`}</strong></p>
            </div>

            <form onSubmit={handleBookTickets}>
              <div style={{ maxHeight: '42vh', overflowY: 'auto', paddingRight: '0.4rem', marginBottom: '1.5rem' }}>
                {devotees.map((devotee, index) => (
                  <div key={index} className="glass-card" style={styles.devoteeFormItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>
                        Pilgrim #{index + 1}
                      </span>
                      {devotees.length > 1 && (
                        <button type="button" onClick={() => removeDevotee(index)} style={styles.removeBtn}>
                          <Trash size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pilgrim full name"
                        value={devotee.name}
                        onChange={(e) => handleDevoteeChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Age"
                          value={devotee.age}
                          onChange={(e) => handleDevoteeChange(index, 'age', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-control"
                          value={devotee.gender}
                          onChange={(e) => handleDevoteeChange(index, 'gender', e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">ID Type</label>
                        <select
                          className="form-control"
                          value={devotee.idProofType}
                          onChange={(e) => handleDevoteeChange(index, 'idProofType', e.target.value)}
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="PAN Card">PAN Card</option>
                          <option value="Passport">Passport</option>
                          <option value="Voter ID">Voter ID</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">ID Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ID Number"
                          value={devotee.idProofNumber}
                          onChange={(e) => handleDevoteeChange(index, 'idProofNumber', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <button type="button" onClick={addDevotee} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Plus size={15} /> Add Pilgrim
                </button>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase' }}>Total: </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fbbf24', textShadow: '0 0 10px rgba(245,158,11,0.2)' }}>
                    ₹{selectedSlot.price * devotees.length}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={bookingLoading}>
                {bookingLoading ? 'Reserving...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  dateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '0.75rem',
  },
  datePicker: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.9rem',
    maxWidth: '200px',
  },
  slotCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  typeTag: (type) => {
    const isVip = type === 'VIP';
    const isPooja = type === 'Special Pooja';
    return {
      background: isVip ? 'rgba(167, 139, 250, 0.12)' : isPooja ? 'rgba(251, 146, 60, 0.12)' : 'rgba(255,255,255,0.06)',
      color: isVip ? '#c084fc' : isPooja ? '#fb923c' : 'white',
      padding: '0.2rem 0.6rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
    };
  },
  modalBody: {
    maxWidth: '550px',
    padding: '1.75rem 2rem',
  },
  devoteeFormItem: {
    padding: '1rem 1.25rem',
    background: 'rgba(9, 7, 16, 0.3)',
    border: '1px solid rgba(255,255,255,0.04)',
    marginBottom: '1rem',
    borderRadius: '12px',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
  }
};

export default TempleDetails;
