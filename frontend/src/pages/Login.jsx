import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter both email and password');
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success('Successfully logged in! Namaste.');
        navigate('/');
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authWrapper}>
      <div className="glass-card" style={styles.authCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <LogIn size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginTop: '1rem' }}>Log In to DarshanEase</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.25rem' }}>Securely access temple bookings and donations</p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputField}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputField}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#f59e0b', fontWeight: '600' }}>
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
  },
  authCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '2.5rem',
  },
  header: {
    textAlign: 'center',
  },
  iconCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#6b7280',
  },
  inputField: {
    width: '100%',
    paddingLeft: '2.75rem',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
  },
};

export default Login;
