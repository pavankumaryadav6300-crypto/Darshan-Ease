import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HeartHandshake, Calendar, CreditCard, ChevronRight, Award } from 'lucide-react';
import Loader from '../components/Loader';
import { useAuth, API_URL } from '../context/AuthContext';

const Donations = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedTempleId = searchParams.get('temple');

  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState(preselectedTempleId || '');
  const [amount, setAmount] = useState('');
  const [devoteeName, setDevoteeName] = useState(user ? user.name : '');
  const [purpose, setPurpose] = useState('General Donation');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [donations, setDonations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTemples();
    if (user) {
      fetchDonationHistory();
    }
  }, [user]);

  useEffect(() => {
    if (preselectedTempleId && temples.length > 0) {
      setSelectedTemple(preselectedTempleId);
    }
  }, [preselectedTempleId, temples]);

  const fetchTemples = async () => {
    try {
      setLoadingTemples(true);
      const res = await axios.get(`${API_URL}/temples`);
      if (res.data.success) {
        setTemples(res.data.data);
        if (!preselectedTempleId && res.data.data.length > 0) {
          setSelectedTemple(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTemples(false);
    }
  };

  const fetchDonationHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await axios.get(`${API_URL}/donations/my`);
      if (res.data.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!selectedTemple) {
      return toast.error('Please select a temple');
    }
    if (!amount || parseFloat(amount) < 10) {
      return toast.error('Minimum donation amount is ₹10');
    }
    if (!devoteeName) {
      return toast.error('Please enter donor/devotee name');
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/donations`, {
        templeId: selectedTemple,
        amount: parseFloat(amount),
        devoteeName,
        purpose,
        paymentMethod,
      });

      if (res.data.success) {
        toast.success(`Thank you for your generous contribution of ₹${amount}! Receipt generated.`);
        setAmount('');
        // If user logged in, reload history
        if (user) {
          fetchDonationHistory();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Donation transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HeartHandshake style={{ color: '#f59e0b' }} /> Temple Donations (Annadanam & Sevas)
      </h2>

      <div className="grid-cols-2">
        {/* Left Side: Donation Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            <CreditCard size={18} style={{ color: '#f59e0b' }} /> Make a Donation Contribution
          </h3>

          {loadingTemples ? (
            <Loader />
          ) : (
            <form onSubmit={handleDonate}>
              <div className="form-group">
                <label className="form-label">Select Temple</label>
                <select
                  className="form-control"
                  value={selectedTemple}
                  onChange={(e) => setSelectedTemple(e.target.value)}
                  required
                >
                  <option value="">-- Choose Temple --</option>
                  {temples.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Donor Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Devotee name for offering pooja"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Donation Purpose</label>
                <select
                  className="form-control"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <option value="General Donation">General Donation</option>
                  <option value="Annadanam">Annadanam (Free Meals Fund)</option>
                  <option value="Temple Development">Temple Infrastructure & Development</option>
                  <option value="Pooja/Seva Fund">Pooja & Seva Fund</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Donation Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min ₹10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  required
                />
                <div style={styles.quickAmounts}>
                  {[101, 501, 1001, 5001].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAmount(val)}
                      style={styles.quickBtn}
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={submitting}
              >
                {submitting ? 'Processing Donation...' : 'Proceed to Contribute'}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Donation History */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            <Award size={18} style={{ color: '#f59e0b' }} /> My Contributions Log
          </h3>

          {!user ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <p>Please log in to view your dynamic lifetime contribution ledger.</p>
            </div>
          ) : loadingHistory ? (
            <Loader />
          ) : donations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <p>No previous donations found on this account. Thank you for your support.</p>
            </div>
          ) : (
            <div style={styles.historyList}>
              {donations.map((donation) => (
                <div key={donation._id} style={styles.historyItem}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'white' }}>{donation.temple?.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                      <Calendar size={12} /> {new Date(donation.donatedAt).toLocaleDateString()} | Purpose: {donation.purpose} | Via: {donation.paymentMethod}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'block', marginTop: '0.1rem' }}>
                      Offered in Name of: {donation.devoteeName}
                    </span>
                  </div>
                  <div style={styles.historyAmount}>
                    ₹{donation.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  quickAmounts: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  quickBtn: {
    flex: 1,
    padding: '0.4rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fbbf24',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  historyAmount: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#10b981',
  },
};

export default Donations;
