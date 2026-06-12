import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('tenkasi_admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Authenticating admin...');

    try {
      const res = await adminLogin(username, password);

      if (res.success && res.token) {
        localStorage.setItem('tenkasi_admin_token', res.token);
        localStorage.setItem('tenkasi_admin_user', JSON.stringify(res.admin));
        
        toast.success(`Welcome back, ${res.admin.username}!`, { id: toastId });
        
        // Timeout redirect to allow toast display
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      } else {
        toast.error(res.message || 'Authentication failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid credentials or server error.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 px-4 overflow-hidden">
      <Toaster position="top-right" />

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-96 h-96 bg-secondary-500/20 rounded-full filter blur-3xl opacity-70"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-white">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-4 shadow-lg shadow-primary-500/10">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Gate</h1>
          <p className="text-gray-400 text-xs mt-1">Authorized personnel login only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm text-white placeholder-gray-500"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm text-white placeholder-gray-500"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all flex items-center justify-center gap-2 text-sm ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ShieldCheck size={18} /> {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-white/5 pt-4">
          <p>© 2026 Tenkasi Jobs. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
