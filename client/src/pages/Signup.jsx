import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DriveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M3 18l4-8 4 8H3z" opacity=".7"/>
    <path d="M10 14l4-8 4 8H10z" opacity=".85"/>
    <path d="M17 18l4-8-4-4-4 4 4 8z" opacity=".6"/>
  </svg>
);

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><DriveIcon /></div>
          <span className="auth-logo-text">FileDrive</span>
        </div>

        <h1 className="auth-heading">Create an account</h1>
        <p className="auth-sub">Start organizing your files in seconds.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Full name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 4, justifyContent: 'center', padding: '10px' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}