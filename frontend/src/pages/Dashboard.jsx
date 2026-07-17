import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LayoutDashboard, PlusCircle, Calendar, IndianRupee, Compass, Layers, Users, BookOpen, Clock, Tag } from 'lucide-react';
import Loader from '../components/Loader';
import { useAuth, API_URL } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState('bookings'); // bookings | add-slots | add-temple | donations
  const [temples, setTemples] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ templesCount: 0, bookingsCount: 0, donationsTotal: 0 });
  const [loading, setLoading] = useState(true);

  // Forms state
  // 1. Add Temple
  const [templeForm, setTempleForm] = useState({
    name: '', deity: '', location: '', description: '', timings: '06:00 AM - 08:30 PM', image: ''
  });
  // 2. Generate Slots
  const [slotForm, setSlotForm] = useState({
    templeId: '',
    date: new Date().toISOString().split('T')[0],
    capacity: 50,
    price: 0,
    type: 'General',
  });
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const timeOptions = [
    '06:00 AM - 09:00 AM',
    '09:00 AM - 12:00 PM',
    '12:00 PM - 03:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 09:00 PM'
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Temples
      const resTemples = await axios.get(`${API_URL}/temples`);
      let allTemples = [];
      let filteredTemples = [];
      
      if (resTemples.data.success) {
        allTemples = resTemples.data.data;
        
        // Filter temples: Organizers only see temples they created
        if (user.role === 'ORGANIZER') {
          filteredTemples = allTemples.filter(t => t.createdBy === user._id || t.createdBy?._id === user._id);
        } else {
          filteredTemples = allTemples;
        }
        
        setTemples(filteredTemples);
        if (filteredTemples.length > 0) {
          setSlotForm(prev => ({ ...prev, templeId: filteredTemples[0]._id }));
        }
      }

      // Fetch Bookings
      const resBookings = await axios.get(`${API_URL}/bookings`);
      let fetchedBookings = [];
      if (resBookings.data.success) {
        fetchedBookings = resBookings.data.data;
        setBookings(fetchedBookings);
      }

      // Fetch Donations if Admin
      let fetchedDonations = [];
      let donationSum = 0;
      if (user.role === 'ADMIN') {
        const resDonations = await axios.get(`${API_URL}/donations`);
        if (resDonations.data.success) {
          fetchedDonations = resDonations.data.data;
          setDonations(fetchedDonations);
          donationSum = resDonations.data.totalAmount;
        }
      }

      setStats({
        templesCount: filteredTemples.length,
        bookingsCount: fetchedBookings.length,
        donationsTotal: donationSum
      });

    } catch (err) {
      console.error(err);
      toast.error('Error fetching dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  const handleTempleSubmit = async (e) => {
    e.preventDefault();
    if (!templeForm.name || !templeForm.deity || !templeForm.location || !templeForm.description) {
      return toast.error('Please enter all required temple details');
    }
    
    try {
      const res = await axios.post(`${API_URL}/temples`, templeForm);
      if (res.data.success) {
        toast.success(`Temple shrine "${templeForm.name}" created successfully!`);
        setTempleForm({ name: '', deity: '', location: '', description: '', timings: '06:00 AM - 08:30 PM', image: '' });
        fetchDashboardData();
        setActiveTab('bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create temple.');
    }
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    if (!slotForm.templeId || !slotForm.date || selectedTimeSlots.length === 0) {
      return toast.error('Please select temple, date, and at least one time window');
    }

    try {
      const res = await axios.post(`${API_URL}/slots`, {
        ...slotForm,
        timeSlots: selectedTimeSlots
      });
      if (res.data.success) {
        toast.success(`Generated ${res.data.count} slots successfully!`);
        setSelectedTimeSlots([]);
        fetchDashboardData();
        setActiveTab('bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate slots.');
    }
  };

  const toggleTimeSlotSelection = (slot) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slot]);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <LayoutDashboard style={{ color: '#f59e0b' }} /> Management Command Console
        </h2>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
          Role: <strong style={{ color: '#fbbf24' }}>{user.role}</strong> | Manage timings, logs, and contributions.
        </p>
      </div>

      {/* Grid Stats */}
      <div style={styles.statsGrid}>
        <div className="glass-card" style={styles.statsCard}>
          <Compass size={28} style={{ color: '#fbbf24' }} />
          <div>
            <span style={styles.statsLabel}>{user.role === 'ORGANIZER' ? 'My Temples' : 'Total Temples'}</span>
            <span style={styles.statsValue}>{stats.templesCount}</span>
          </div>
        </div>

        <div className="glass-card" style={styles.statsCard}>
          <Users size={28} style={{ color: '#fbbf24' }} />
          <div>
            <span style={styles.statsLabel}>Total Reservations</span>
            <span style={styles.statsValue}>{stats.bookingsCount}</span>
          </div>
        </div>

        {user.role === 'ADMIN' && (
          <div className="glass-card" style={styles.statsCard}>
            <IndianRupee size={28} style={{ color: '#10b981' }} />
            <div>
              <span style={styles.statsLabel}>Direct Donations</span>
              <span style={styles.statsValue}>₹{stats.donationsTotal}</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom Tabs Navigation */}
      <div className="tab-nav" style={{ marginBottom: '2.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
        >
          <BookOpen size={16} /> View Bookings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('add-slots')}
          className={`tab-btn ${activeTab === 'add-slots' ? 'active' : ''}`}
        >
          <Calendar size={16} /> Generate Slots
        </button>

        {user.role === 'ADMIN' && (
          <button
            type="button"
            onClick={() => setActiveTab('add-temple')}
            className={`tab-btn ${activeTab === 'add-temple' ? 'active' : ''}`}
          >
            <PlusCircle size={16} /> Register Temple
          </button>
        )}

        {user.role === 'ADMIN' && (
          <button
            type="button"
            onClick={() => setActiveTab('donations')}
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
          >
            <IndianRupee size={16} /> Platform Donations
          </button>
        )}
      </div>

      {/* Tabs Contents */}
      <div>
        
        {/* Tab Content 1: Bookings Table */}
        {activeTab === 'bookings' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fbbf24' }}>
              devotee Reservation Logs
            </h3>
            {bookings.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No reservation tickets booked yet.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Devotee Name</th>
                      <th style={styles.th}>Temple Shrine</th>
                      <th style={styles.th}>Reporting Time</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Pilgrims</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} style={styles.tr}>
                        <td style={styles.td}>
                          <strong>{b.user?.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{b.user?.email}</div>
                        </td>
                        <td style={styles.td}>{b.temple?.name}</td>
                        <td style={styles.td}>
                          <div>{b.slot?.date}</div>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{b.slot?.timeSlot}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.typeTag(b.slot?.type)}>{b.slot?.type}</span>
                        </td>
                        <td style={styles.td}>{b.devotees?.length} head(s)</td>
                        <td style={styles.td}>
                          <span style={styles.statusBadge(b.status)}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Generate Slots */}
        {activeTab === 'add-slots' && (
          <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', color: '#fbbf24' }}>
              Create Darshan Slot Schedule
            </h3>
            {temples.length === 0 ? (
              <p style={{ color: '#ef4444', textAlign: 'center', padding: '1rem' }}>
                You do not have any assigned temples. Contact Admin to configure organizer rights.
              </p>
            ) : (
              <form onSubmit={handleSlotSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Target Temple</label>
                  <select
                    className="form-control"
                    value={slotForm.templeId}
                    onChange={(e) => setSlotForm({ ...slotForm, templeId: e.target.value })}
                    required
                  >
                    {temples.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={slotForm.date}
                      onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price per Ticket (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={slotForm.price}
                      onChange={(e) => setSlotForm({ ...slotForm, price: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Total seat Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={slotForm.capacity}
                      onChange={(e) => setSlotForm({ ...slotForm, capacity: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slot Category</label>
                    <select
                      className="form-control"
                      value={slotForm.type}
                      onChange={(e) => setSlotForm({ ...slotForm, type: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="VIP">VIP Special</option>
                      <option value="Special Pooja">Special Pooja / Seva</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label className="form-label">Select Time Windows (Batch Creation)</label>
                  <div style={styles.checkboxGrid}>
                    {timeOptions.map((ts) => (
                      <label key={ts} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedTimeSlots.includes(ts)}
                          onChange={() => toggleTimeSlotSelection(ts)}
                          style={styles.checkbox}
                        />
                        <span>{ts}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                  Generate Slots Scheduled
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab Content 3: Add Temple (Admin only) */}
        {activeTab === 'add-temple' && user.role === 'ADMIN' && (
          <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', color: '#fbbf24' }}>
              Register a New Temple Shrine
            </h3>
            <form onSubmit={handleTempleSubmit}>
              <div className="form-group">
                <label className="form-label">Temple Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kedarnath Temple"
                  value={templeForm.name}
                  onChange={(e) => setTempleForm({ ...templeForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Presiding Deity</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lord Shiva"
                    value={templeForm.deity}
                    onChange={(e) => setTempleForm({ ...templeForm, deity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (City, State)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Kedarnath, Uttarakhand"
                    value={templeForm.location}
                    onChange={(e) => setTempleForm({ ...templeForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Opening & Closing Timings</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 4:00 AM - 9:00 PM"
                    value={templeForm.timings}
                    onChange={(e) => setTempleForm({ ...templeForm, timings: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={templeForm.image}
                    onChange={(e) => setTempleForm({ ...templeForm, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Historical description & Significance</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the temple background, history, dress codes, etc."
                  value={templeForm.description}
                  onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Register Temple Entity
              </button>
            </form>
          </div>
        )}

        {/* Tab Content 4: Platform Donations (Admin only) */}
        {activeTab === 'donations' && user.role === 'ADMIN' && (
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fbbf24' }}>
              System-wide Devotional Contribution Ledger
            </h3>
            {donations.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No donations received on the platform yet.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Donor Name</th>
                      <th style={styles.th}>Donor Email</th>
                      <th style={styles.th}>Temple Shrine</th>
                      <th style={styles.th}>Purpose Category</th>
                      <th style={styles.th}>Contribution Amount</th>
                      <th style={styles.th}>Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d._id} style={styles.tr}>
                        <td style={styles.td}><strong>{d.devoteeName}</strong></td>
                        <td style={styles.td}>{d.user?.email || 'Anonymous Donor'}</td>
                        <td style={styles.td}>{d.temple?.name}</td>
                        <td style={styles.td}>{d.purpose}</td>
                        <td style={{ ...styles.td, fontWeight: '700', color: '#10b981' }}>₹{d.amount}</td>
                        <td style={styles.td}>{new Date(d.donatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '2.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.75rem',
    marginBottom: '3rem',
  },
  statsCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem 2rem',
  },
  statsLabel: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statsValue: {
    display: 'block',
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'white',
    marginTop: '0.2rem',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#fbbf24',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '1.25rem 1rem',
    fontSize: '0.92rem',
    color: '#d1d5db',
  },
  typeTag: (type) => {
    const isVip = type === 'VIP';
    return {
      background: isVip ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      color: isVip ? '#c084fc' : '#f59e0b',
      padding: '0.2rem 0.5rem',
      borderRadius: '5px',
      fontSize: '0.75rem',
      fontWeight: '700',
    };
  },
  statusBadge: (status) => {
    const isBooked = status === 'Booked';
    return {
      background: isBooked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
      color: isBooked ? '#10b981' : '#ef4444',
      padding: '0.25rem 0.6rem',
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '700',
    };
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '0.85rem',
    background: 'rgba(9, 7, 16, 0.3)',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.9rem',
    color: '#d1d5db',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#f59e0b',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  }
};

export default Dashboard;
