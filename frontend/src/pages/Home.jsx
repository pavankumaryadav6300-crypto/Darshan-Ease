import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Compass, ShieldCheck, Ticket, Calendar } from 'lucide-react';
import Loader from '../components/Loader';
import { API_URL } from '../context/AuthContext';

const Home = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTemples = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/temples?search=${searchTerm}`);
      if (res.data.success) {
        setTemples(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching temples:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTemples(search);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div>
      {/* Premium Hero with Stat Tags */}
      <div className="hero">
        <span style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800' }}>
          DEALER OF SPIRITUAL COMFORT
        </span>
        <h1 style={{ marginTop: '0.5rem' }}>Reserve Your Sacred Entry</h1>
        <p>DarshanEase is India's leading platform for online temple entry slots, VIP poojas, and direct devotee contributions.</p>
        
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search shrines by name, city, state, or deity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.heroStats}>
          <span style={styles.statTag}><ShieldCheck size={14} style={{ color: '#10b981' }} /> Gov Checked Portal</span>
          <span style={styles.statTag}><Ticket size={14} style={{ color: '#f59e0b' }} /> 8+ Historical Shrines</span>
          <span style={styles.statTag}><Calendar size={14} style={{ color: '#ec4899' }} /> Live Slot Tracking</span>
        </div>
      </div>

      {/* Temple Listing List Blocks */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', fontSize: '1.75rem' }}>
          <Compass style={{ color: '#f59e0b' }} /> Pilgrimage Shrines
        </h2>

        {loading ? (
          <Loader />
        ) : temples.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: '#9ca3af' }}>No temple entities match your filter query.</p>
          </div>
        ) : (
          <div style={styles.listContainer}>
            {temples.map((temple) => (
              <div key={temple._id} className="glass-card" style={styles.templeRow}>
                {/* Left Side: Image */}
                <div style={styles.imageBlock}>
                  <img src={temple.image} alt={temple.name} className="temple-row-zoom" style={styles.templeImage} />
                  <div style={styles.deityBadge}>{temple.deity}</div>
                </div>

                {/* Center: Details */}
                <div style={styles.detailsBlock}>
                  <h3 style={{ fontSize: '1.45rem', color: 'white', marginBottom: '0.4rem' }}>{temple.name}</h3>
                  <div style={styles.metaRow}>
                    <span style={styles.metaBadge}>
                      <MapPin size={13} style={{ color: '#ef4444' }} /> {temple.location}
                    </span>
                    <span style={styles.metaBadge}>
                      <Clock size={13} style={{ color: '#f59e0b' }} /> {temple.timings}
                    </span>
                  </div>
                  <p style={styles.descriptionText}>{temple.description}</p>
                </div>

                {/* Right Side: Actions */}
                <div style={styles.actionsBlock}>
                  <Link to={`/temple/${temple._id}`} className="btn btn-primary" style={styles.actionBtn}>
                    Book Darshan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  searchContainer: {
    position: 'relative',
    maxWidth: '560px',
    margin: '0 auto',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    padding: '0.9rem 1rem 0.9rem 3.1rem',
    borderRadius: '50px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(9, 7, 16, 0.6)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.3s ease',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  },
  statTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '0.4rem 0.9rem',
    borderRadius: '50px',
    fontSize: '0.82rem',
    color: '#d1d5db',
    fontWeight: '600',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  templeRow: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr 200px',
    gap: '2rem',
    padding: '1.25rem',
    alignItems: 'center',
  },
  imageBlock: {
    position: 'relative',
    height: '170px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  templeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  deityBadge: {
    position: 'absolute',
    bottom: '0.5rem',
    left: '0.5rem',
    background: 'rgba(9, 7, 16, 0.85)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#fbbf24',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailsBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  metaRow: {
    display: 'flex',
    gap: '1.25rem',
    marginBottom: '0.75rem',
  },
  metaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: '#9ca3af',
    fontSize: '0.82rem',
  },
  descriptionText: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    lineHeight: '1.6',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    justifyContent: 'center',
    borderLeft: '1px dashed rgba(255,255,255,0.08)',
    paddingLeft: '1.75rem',
    height: '80%',
  },
  actionBtn: {
    width: '100%',
    padding: '0.7rem',
    fontSize: '0.9rem',
    borderRadius: '10px',
  }
};

// Add responsive checks for row layout
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 900px) {
      .glass-card {
        grid-template-columns: 1fr !important;
        gap: 1.25rem !important;
      }
      .navbar {
        height: auto !important;
      }
      .actionsBlock {
        border-left: none !important;
        padding-left: 0 !important;
        flex-direction: row !important;
        width: 100% !important;
      }
    }
    .glass-card:hover .temple-row-zoom {
      transform: scale(1.08);
    }
    .temple-row-zoom {
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    }
  `;
  document.head.appendChild(style);
}

export default Home;
