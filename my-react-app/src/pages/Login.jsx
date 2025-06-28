import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import logo from '/university-logo.png';

const mockUsers = [
  { email: 'student@university.edu', password: 'student123', role: 'Student' },
  { email: 'faculty@university.edu', password: 'faculty123', role: 'Faculty' },
  { email: 'provider@university.edu', password: 'provider123', role: 'Service Provider' },
  { email: 'admin@university.edu', password: 'admin123', role: 'Admin' },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Invalid email format.');
      return;
    }
    const user = mockUsers.find(
      (u) => u.email === form.email && u.password === form.password && u.role === form.role
    );
    if (!user) {
      setError('Incorrect credentials or role.');
      return;
    }
    setError('');
    // Simulate login
    navigate('/');
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow auth-card">
        <div className="text-center mb-4">
          <img src={logo} alt="Eventra Logo" className="auth-logo mb-2" />
          <h2 className="mb-0">Eventra Login</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control${touched.email && !validateEmail(form.email) ? ' is-invalid' : ''}`}
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Enter a valid email address.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className={`form-select${touched.role && !form.role ? ' is-invalid' : ''}`}
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
              <option>Admin</option>
            </select>
            <div className="invalid-feedback">Select a role.</div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
          <div className="d-flex justify-content-between">
            <Link to="/recover" className="small">Forgot Password?</Link>
            <Link to="/register" className="small">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
