import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (mode === 'register') {
      if (!form.username.trim()) errs.username = 'Username is required';
      else if (form.username.trim().length < 3) errs.username = 'Minimum 3 characters';
    }
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        navigate('/');
      } else {
        await register(form.username, form.email, form.password);
        setMode('login');
        setForm({ username: '', email: '', password: '' });
        setServerError('');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 90 20" width="90" height="20">
            <path d="M27.9727 3.12324C27.6435 1.89288 26.6768 0.926297 25.4464 0.597051C23.2056 2.40453e-07 14.3407 0 14.3407 0C14.3407 0 5.47581 2.40453e-07 3.23494 0.597051C2.00481 0.926297 1.03812 1.89288 0.708947 3.12324C0.111938 5.36412 0.111938 10.0392 0.111938 10.0392C0.111938 10.0392 0.111938 14.7142 0.708947 16.9551C1.03812 18.1855 2.00481 19.0739 3.23494 19.4031C5.47581 20 14.3407 20 14.3407 20C14.3407 20 23.2056 20 25.4464 19.4031C26.6768 19.0739 27.6435 18.1855 27.9727 16.9551C28.5697 14.7142 28.5697 10.0392 28.5697 10.0392C28.5697 10.0392 28.5697 5.36412 27.9727 3.12324Z" fill="#FF0000" />
            <path d="M11.4128 14.2984L18.8887 10.0391L11.4128 5.77991V14.2984Z" fill="white" />
          </svg>
          <span>YouTube</span>
        </Link>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrors({}); setServerError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrors({}); setServerError(''); }}
          >
            Register
          </button>
        </div>

        <h1 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>

        {mode === 'register' && (
          <p className="auth-success-note">
            After registration you will be redirected to sign in.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.username ? 'input-error' : ''}
                autoComplete="username"
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>
              New to YouTube?{' '}
              <button onClick={() => { setMode('register'); setErrors({}); setServerError(''); }} className="auth-switch-btn">
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrors({}); setServerError(''); }} className="auth-switch-btn">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
