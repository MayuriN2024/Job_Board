import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, User, LogOut, Bookmark, Sun, Moon, ClipboardList, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCompare } from '../context/CompareContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout, getApplicationCount } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { compareCount } = useCompare();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const appCount = getApplicationCount();

  const linkClass = `font-medium transition-colors ${isDark ? 'text-purple-200 hover:text-purple-300' : 'text-neutral-600 hover:text-primary-500'}`;

  const navLinks = (
    <>
      <Link to="/" className={linkClass} onClick={() => setIsOpen(false)}>Home</Link>
      <Link to="/about" className={linkClass} onClick={() => setIsOpen(false)}>About</Link>
      <Link to="/jobs" className={linkClass} onClick={() => setIsOpen(false)}>Browse Jobs</Link>
      <Link to="/saved-jobs" className={`${linkClass} flex items-center gap-1`} onClick={() => setIsOpen(false)}>
        <Bookmark size={16} /> Saved
      </Link>
      {isAuthenticated && (
        <Link to="/applications" className={`${linkClass} flex items-center gap-1`} onClick={() => setIsOpen(false)}>
          <ClipboardList size={16} /> Applications
          {appCount > 0 && (
            <span className="bg-primary-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {appCount}
            </span>
          )}
        </Link>
      )}
      {isAuthenticated && user?.role === 'recruiter' && (
        <Link to="/add-vacancy" className={`${linkClass} flex items-center gap-1`} onClick={() => setIsOpen(false)}>
          <PlusCircle size={16} /> Add Vacancy
        </Link>
      )}
    </>
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'py-5'}`}
      style={!isScrolled ? { backgroundColor: 'transparent' } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)' }}>
              <Briefcase size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              JobBoard
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Compare badge */}
            {compareCount > 0 && (
              <Link
                to="/compare"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Compare ({compareCount})
              </Link>
            )}

            {/* Notification Bell */}
            <NotificationBell />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: isDark ? '#c4b5fd' : '#a78bfa',
              }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="relative flex items-center gap-1.5 font-medium transition-colors"
                  style={{ color: isDark ? '#c084fc' : '#525252' }}
                  title="My Profile"
                >
                  <User size={18} />
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 font-medium transition-colors hover:text-red-500"
                  style={{ color: isDark ? '#9ca3af' : '#737373' }}
                >
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium px-4 py-2 text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {compareCount > 0 && (
              <Link
                to="/compare"
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary-600 text-white"
                onClick={() => setIsOpen(false)}
              >
                Compare ({compareCount})
              </Link>
            )}
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: isDark ? '#c4b5fd' : '#a78bfa',
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: isDark ? '#c084fc' : '#525252' }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden mt-2 mx-4 rounded-2xl p-4 shadow-xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div className="flex flex-col space-y-4">
            {navLinks}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="font-medium flex items-center gap-2"
                  style={{ color: isDark ? '#c084fc' : '#525252' }}
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium flex items-center gap-2"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary-500 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
