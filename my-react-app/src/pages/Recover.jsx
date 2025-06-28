import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import logo from '/university-logo.png';

const mockEmails = [
  'student@university.edu',
  'faculty@university.edu',
  'provider@university.edu',
  'admin@university.edu',
];

const Recover = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    setMessage('');
    setError('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (!mockEmails.includes(email)) {
      setError('Email not found.');
      return;
    }
    setMessage('Reset link sent to your email.');
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow auth-card">
        <div className="text-center mb-4">
          <img src={logo} alt="Eventra Logo" className="auth-logo mb-2" />
          <h2 className="mb-0">Password Recovery</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control${touched && (!validateEmail(email) || !email) ? ' is-invalid' : ''}`}
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="invalid-feedback">Enter a valid email address.</div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && <div className="alert alert-success py-2">{message}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2">Send Reset Link</button>
          <div className="text-center">
            <Link to="/login" className="small">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recover;
