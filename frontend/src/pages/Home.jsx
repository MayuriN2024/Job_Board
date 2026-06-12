import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Monitor, Palette, BarChart3, Megaphone, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '../components/JobCard';
import { getFeaturedJobs, JOB_CATEGORIES } from '../data/jobs';
import { INDIAN_LOCATIONS } from '../data/locations';
import { useAuth } from '../context/AuthContext';

const categoryConfig = {
  Engineering: { icon: Monitor, label: 'Explore open roles' },
  Design:      { icon: Palette, label: 'Explore open roles' },
  Marketing:   { icon: Megaphone, label: 'Explore open roles' },
  Sales:       { icon: TrendingUp, label: 'Explore open roles' },
  Product:     { icon: BarChart3, label: 'Explore open roles' },
  Finance:     { icon: DollarSign, label: 'Explore open roles' },
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const featuredJobs = getFeaturedJobs();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.set('q', searchTitle.trim());
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}&from=home`);
  };

  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(147,51,234,0.06) 0%, transparent 100%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Find a job that fits{' '}
              <span className="text-primary-500">your skills</span>
            </h1>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              JobBoard connects ambitious talent with companies that move fast. Search openings, save what excites you, and apply in one click.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Search className="text-neutral-400 mr-3 shrink-0" size={22} />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Job title or keywords"
                  className="w-full outline-none font-medium bg-transparent"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div
                className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <MapPin className="text-neutral-400 mr-3 shrink-0" size={22} />
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full outline-none font-medium bg-transparent cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">All India locations</option>
                  {INDIAN_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto px-10">
                Browse Jobs
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="py-16 category-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Browse by category</h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Find roles in the areas you love.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {JOB_CATEGORIES.map((cat) => {
              const config = categoryConfig[cat];
              const IconComponent = config?.icon || Briefcase;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="card-shine p-5 text-left cursor-pointer flex items-center gap-4"
                >
                  <div className="category-icon-circle">
                    <IconComponent size={22} strokeWidth={1.8} />
                  </div>
                  <div>
                    <span className="font-bold block text-[15px]" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{config?.label || 'Explore open roles'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Opportunities ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Featured opportunities</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Currently hiring at top Indian companies</p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:flex items-center gap-1 text-primary-500 font-bold hover:gap-2 transition-all"
            >
              View all <ArrowRight size={18} />
            </Link>
          </div>
          <div className="space-y-6">
            {featuredJobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/jobs" className="btn-secondary inline-flex items-center gap-2">
              View all jobs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
      <section className="py-16 mx-4 sm:mx-8 lg:mx-16 mb-8 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #ddd6fe 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to find what&apos;s next?
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Join professionals who use JobBoard to land roles they actually love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-purple-50 transition-all active:scale-95 shadow-lg"
            >
              Create free account
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default Home;
