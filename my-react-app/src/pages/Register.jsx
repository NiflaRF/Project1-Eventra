import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import logo from '/university-logo.png';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Full name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!/.+@.+\..+/.test(form.email)) newErrors.email = 'Invalid email format.';
    if (!form.password) newErrors.password = 'Password is required.';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!form.role) newErrors.role = 'Select a role.';
    if (!form.terms) newErrors.terms = 'You must accept the terms.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSuccess('Registration successful!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow auth-card">
        <div className="text-center mb-4">
          <img src={logo} alt="Eventra Logo" className="auth-logo mb-2" />
          <h2 className="mb-0">Register for Eventra</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">University Email</label>
            <input
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{errors.password}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className={`form-select${errors.role ? ' is-invalid' : ''}`}
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option>Student</option>
              <option>Faculty</option>
              <option>Service Provider</option>
            </select>
            <div className="invalid-feedback">{errors.role}</div>
          </div>
          <div className="form-check mb-3">
            <input
              className={`form-check-input${errors.terms ? ' is-invalid' : ''}`}
              type="checkbox"
              id="terms"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="terms">
              I accept the <a href="#" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
            </label>
            <div className="invalid-feedback">{errors.terms}</div>
          </div>
          {success && <div className="alert alert-success py-2">{success}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2" disabled={!form.terms}>Register</button>
          <div className="text-center">
            <Link to="/login" className="small">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
