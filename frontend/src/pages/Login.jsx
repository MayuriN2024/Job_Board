import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const REMEMBER_EMAIL_KEY = 'jobboard_remember_email';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/profile';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-md w-full mb-4">
        <Link to="/" className="inline-flex items-center text-primary-500 font-bold hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl shadow-xl p-8 md:p-12"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl text-white mb-6" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
            <Rocket size={32} />
          </div>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Sign in with your email — no account ID needed</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200 transition-all font-medium"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200 transition-all font-medium"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-primary-500"
            />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Remember my email</span>
          </label>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group">
            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 text-center" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-500 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
