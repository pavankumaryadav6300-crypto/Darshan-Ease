import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar, Users, Ban, Printer, Sparkles, QrCode, Ticket, Gift } from 'lucide-react';
import Loader from '../components/Loader';
import { API_URL } from '../context/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bookings/my`);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this darshan booking?')) {
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        toast.success('Booking cancelled successfully.');
        setBookings(
          bookings.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handlePrint = (bookingId) => {
    // We can print the page. The custom media print CSS rules in index.css will automatically
    // capture only the printed ticket, hide all controls/navbars, and format it cleanly.
    window.print();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Ticket style={{ color: '#f59e0b' }} /> My Darshan Passes
        </h2>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>View, print, or manage your active pilgrimage tickets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Calendar size={48} style={{ color: '#6b7280', display: 'block', margin: '0 auto 1rem' }} />
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>No reservation history found on this account.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Temples</a>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'Cancelled';
            return (
              <div
                key={booking._id}
                className={`premium-ticket ${isCancelled ? 'ticket-cancelled' : 'ticket-booked'}`}
              >
                {/* Left side: Ticket Body */}
                <div style={styles.ticketBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={styles.tag(booking.slot?.type)}>
                      {booking.slot?.type} ENTRY PERMIT
                    </span>
                    {isCancelled && (
                      <span style={styles.cancelledTag}>
                        CANCELLED
                      </span>
                    )}
                  </div>

                  <h3 className="serif-title" style={{ fontSize: '1.75rem', color: 'white', marginBottom: '0.4rem' }}>
                    {booking.temple?.name}
                  </h3>
                  <p style={{ color: '#d1d5db', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                    Presiding Lord: {booking.temple?.deity}
                  </p>

                  <div style={styles.metaRow}>
                    <div>
                      <span style={styles.metaLabel}>Date of Entry</span>
                      <span style={styles.metaVal}>{booking.slot?.date}</span>
                    </div>
                    <div>
                      <span style={styles.metaLabel}>Reporting Time</span>
                      <span style={styles.metaVal}>{booking.slot?.timeSlot}</span>
                    </div>
                    <div>
                      <span style={styles.metaLabel}>Service Charge</span>
                      <span style={styles.metaVal}>{booking.totalPrice === 0 ? 'Free' : `₹${booking.totalPrice}`}</span>
                    </div>
                    <div>
                      <span style={styles.metaLabel}>Payment</span>
                      <span style={styles.metaVal}>{booking.paymentMethod || 'UPI'}</span>
                    </div>
                  </div>

                  <div style={styles.devoteeBox}>
                    <span style={styles.devoteeHeader}>
                      <Users size={14} /> Devotees Registered
                    </span>
                    <div style={styles.devoteeList}>
                      {booking.devotees.map((devotee) => (
                        <div key={devotee._id} style={styles.devoteeItem}>
                          <span style={{ fontWeight: '600', color: 'white' }}>{devotee.name}</span>
                          <span style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                            {devotee.age} yrs | {devotee.gender} | ID: {devotee.idProofType} ({devotee.idProofNumber})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prasadams Box */}
                  {(booking.prasadams > 0) && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                        <Gift size={14} /> Pre-ordered Prasadams
                      </span>
                      <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                        <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem', display: 'block' }}>
                          {booking.prasadams} x Temple Prasadam
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>
                          Please collect at the prasadam counter by scanning this pass.
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right side: QR Gate Code */}
                <div className="qr-gate" style={styles.qrGate}>
                  {!isCancelled ? (
                    <div style={styles.qrInside}>
                      <QrCode size={110} style={{ color: 'white' }} />
                      <span style={styles.passNumber}>PASS REFERENCE</span>
                      <span style={styles.refCode}>#{booking._id.substring(18).toUpperCase()}</span>
                      <div style={styles.actionRow}>
                        <button
                          type="button"
                          onClick={() => handlePrint(booking._id)}
                          className="btn btn-secondary"
                          style={styles.actionBtn}
                          title="Print Ticket"
                        >
                          <Printer size={14} /> Print
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-danger"
                          style={styles.actionBtn}
                          title="Cancel Reservation"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.cancelledInside}>
                      <Ban size={40} style={{ color: '#ef4444' }} />
                      <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                        VOID TICKET
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '2.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  ticketBody: {
    padding: '2rem',
  },
  tag: (type) => {
    const isVip = type === 'VIP';
    return {
      fontSize: '0.78rem',
      fontWeight: '800',
      color: isVip ? '#a78bfa' : '#f59e0b',
      background: isVip ? 'rgba(167, 139, 250, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      padding: '0.2rem 0.6rem',
      borderRadius: '6px',
      letterSpacing: '0.05em',
    };
  },
  cancelledTag: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    background: 'rgba(9, 7, 16, 0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  metaLabel: {
    display: 'block',
    fontSize: '0.78rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  metaVal: {
    display: 'block',
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'white',
    marginTop: '0.15rem',
  },
  devoteeBox: {
    borderTop: '1px dashed rgba(255,255,255,0.08)',
    paddingTop: '1.25rem',
  },
  devoteeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: '0.75rem',
  },
  devoteeList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '0.85rem',
  },
  devoteeItem: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255,255,255,0.03)',
    padding: '0.6rem 0.85rem',
    borderRadius: '10px',
  },
  qrGate: {
    borderLeft: '1px dashed rgba(255, 255, 255, 0.12)',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(9, 7, 16, 0.15)',
  },
  qrInside: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  passNumber: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    fontWeight: '700',
    marginTop: '0.6rem',
    letterSpacing: '0.02em',
  },
  refCode: {
    fontSize: '0.95rem',
    color: '#fbbf24',
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  actionRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  actionBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
  },
  cancelledInside: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
};

export default Bookings;
