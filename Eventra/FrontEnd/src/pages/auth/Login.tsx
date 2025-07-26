
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Info, Shield } from 'lucide-react';

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

  // Define role categories
  const publicRoles = ['student', 'faculty'];
  const authorityRoles = ['super-admin', 'service-provider', 'vice-chancellor', 'administration', 'student-union', 'warden'];

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

  const isAuthorityRole = authorityRoles.includes(formData.role);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ width: '100vw', margin: 0, padding: 0, backgroundColor: '#bd7880' }}>
      <div className="max-w-md w-full z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Sign in to your Eventra account</p>
        </div>

        {/* Authority Role Alert */}
        {isAuthorityRole && (
          <div className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white">
                <p className="font-semibold mb-1">Authority Account</p>
                <p>This role requires administrator-created credentials. Contact your system administrator if you need access.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-900/50 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-100">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
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
                className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your email address"
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
                  className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 pr-12 text-base font-semibold shadow-none outline-none ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Role Selection */}
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
                {/* Public Roles */}
                <optgroup label="Public Roles">
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </optgroup>
                
                {/* Authority Roles */}
                <optgroup label="Authority Roles">
                  <option value="super-admin">Super Admin</option>
                  <option value="service-provider">Service Provider</option>
                  <option value="vice-chancellor">Vice Chancellor</option>
                  <option value="administration">Administration of UWU</option>
                  <option value="student-union">Student Union</option>
                  <option value="warden">Warden</option>
                </optgroup>
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
            <div className="text-sm text-white font-bold">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold underline">
                Sign up here
              </Link>
            </div>
            
            <div className="text-sm text-gray-400">
              <Link to="/password-recovery" className="text-gray-400 hover:text-white transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Login;
