import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all standard fields');
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error('Password must be at least 8 characters with at least 1 number and 1 special character (!@#$%^&*)');
    }

    try {
      setLoading(true);
      const res = await register(name, email, password, 'USER');
      if (res.success) {
        toast.success('Account created! Welcome to DarshanEase.');
        navigate('/');
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authWrapper}>
      <div className="glass-card" style={styles.authCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserPlus size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginTop: '1rem' }}>Create Account</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.25rem' }}>Join the spiritual ticket booking network</p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Devotee Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.inputField}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="devotee@example.com"
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
                placeholder="Min 8 chars, 1 number, 1 special char"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputField}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f59e0b', fontWeight: '600' }}>
              Log In
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
    marginTop: '2.5rem',
    textAlign: 'center',
  },
};

export default Register;
