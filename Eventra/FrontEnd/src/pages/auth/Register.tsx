
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Check } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ width: '100vw', margin: 0, padding: 0 }}>
        {/* Dashboard-style background image and overlay */}
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/Galena.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
        <div className="max-w-md w-full z-10">
          <div className="p-8 text-center animate-fade-in bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl">
            <div className="w-16 h-16 bg-gray-700 bg-opacity-70 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-white mb-4">Your account has been created successfully.</p>
            <p className="text-sm text-gray-200">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ width: '100vw', margin: 0, padding: 0 }}>
      {/* Dashboard-style background image and overlay */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/Galena.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div className="max-w-md w-full z-10">
        {/* Registration Form */}
        <div className="p-8 animate-fade-in bg-black bg-opacity-40 rounded-xl shadow-none w-full h-full flex flex-col">
          <div className="flex justify-center mb-4">
            <img src="/Logo UWU.png" alt="UWU Logo" className="h-16 w-auto" />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Get Started with Eventra</h2>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                University Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="your.email@university.edu"
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`rounded-xl bg-black bg-opacity-60 border border-gray-700 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none pr-12 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
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
                className="rounded-xl bg-black bg-opacity-70 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full px-4 py-3 text-base font-semibold shadow-none outline-none"
                style={{ colorScheme: 'dark' }}
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
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-blue-500 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-white">
                  I accept the{' '}
                  <Link to="/terms" className="text-white underline font-bold">
                    Terms & Conditions
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-sm text-red-400">{errors.acceptTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.acceptTerms}
              className={`w-full bg-gray-800 bg-opacity-70 hover:bg-gray-900 text-white font-extrabold rounded-xl py-3 mt-2 shadow-lg uppercase tracking-wide transition duration-200 ${isLoading || !formData.acceptTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-white font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold underline">
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
