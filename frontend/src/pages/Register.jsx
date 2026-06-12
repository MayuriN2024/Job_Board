import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { INDIAN_LOCATIONS } from '../data/locations';

const Register = () => {
  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register({ name, email, password, role, location });
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-10 px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full rounded-3xl shadow-xl border p-8 md:p-12"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl text-white mb-6" style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)' }}>
            <Rocket size={32} />
          </div>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Your email is your login — no separate ID needed</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className="p-4 border-2 rounded-2xl text-left transition-all group cursor-pointer"
            style={{
              backgroundColor: role === 'seeker' 
                ? (isDark ? 'rgba(167, 139, 250, 0.15)' : '#f5f3ff') 
                : 'var(--bg-card)',
              borderColor: role === 'seeker' 
                ? '#a78bfa' 
                : 'var(--border-color)',
            }}
          >
            <div 
              className="p-2 rounded-lg inline-block mb-3 transition-all"
              style={{
                backgroundColor: role === 'seeker' ? '#a78bfa' : (isDark ? '#2d1f42' : '#e5e5e5'),
                color: role === 'seeker' ? '#ffffff' : (isDark ? '#c4b5fd' : '#525252'),
              }}
            >
              <User size={20} />
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Job Seeker</div>
            <div className="text-[11px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>I want to find a job</div>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className="p-4 border-2 rounded-2xl text-left transition-all group cursor-pointer"
            style={{
              backgroundColor: role === 'recruiter' 
                ? (isDark ? 'rgba(167, 139, 250, 0.15)' : '#f5f3ff') 
                : 'var(--bg-card)',
              borderColor: role === 'recruiter' 
                ? '#a78bfa' 
                : 'var(--border-color)',
            }}
          >
            <div 
              className="p-2 rounded-lg inline-block mb-3 transition-all"
              style={{
                backgroundColor: role === 'recruiter' ? '#a78bfa' : (isDark ? '#2d1f42' : '#e5e5e5'),
                color: role === 'recruiter' ? '#ffffff' : (isDark ? '#c4b5fd' : '#525252'),
              }}
            >
              <Briefcase size={20} />
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Recruiter</div>
            <div className="text-[11px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>I want to hire talent</div>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p 
              className="text-red-600 text-sm font-medium rounded-xl px-4 py-3" 
              style={{ 
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', 
                border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : 'none' 
              }}
            >
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all font-medium"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all font-medium"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Place / Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="">Select your city</option>
              {INDIAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all font-medium"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group mt-2">
            Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
