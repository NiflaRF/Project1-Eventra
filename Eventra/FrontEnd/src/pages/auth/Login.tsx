
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt started with:', { 
      email: formData.email, 
      role: formData.role, 
      passwordLength: formData.password.length 
    });
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Calling login function...');
      const success = await login(formData.email, formData.password, formData.role);
      console.log('Login result:', success);
      if (success) {
        // Redirect based on role
        if (formData.role === 'admin' || formData.role === 'super-admin') {
          navigate('/admin/dashboard');
        } else if (formData.role === 'service-provider') {
          navigate('/dashboards/service-provider');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.log('Login failed - invalid credentials');
        setErrors({ general: 'Invalid credentials. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ width: '100vw', margin: 0, padding: 0 }}>
      {/* Dashboard-style background image and overlay */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/LogIn.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div className="max-w-md w-full z-10">
        {/* Login Form */}
        <div className="p-8 animate-fade-in bg-black bg-opacity-40 rounded-xl shadow-none w-full h-full flex flex-col">
          <div className="flex justify-center mb-4">
            <img src="/Logo UWU.png" alt="UWU Logo" className="h-16 w-auto" />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-2xl font-bold text-white mt-2">Log into Eventra</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your university email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-white mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none ${errors.role ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="service-provider">Service Provider</option>
                <option value="super-admin">Super Admin</option>
                <option value="vice-chancellor">Vice Chancellor</option>
                <option value="administration">Administration of UWU</option>
                <option value="student-union">Student Union</option>
                <option value="warden">Warden</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gray-800 bg-opacity-70 hover:bg-gray-900 text-white font-extrabold rounded-xl py-3 mt-2 shadow-lg uppercase tracking-wide transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4 text-center">
            <Link
              to="/password-recovery"
              className="text-white font-bold underline text-sm"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-white font-bold">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold underline">
                Sign Up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
