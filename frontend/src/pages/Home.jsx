import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Monitor, Palette, BarChart3, Megaphone, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '../components/JobCard';
import { JOB_CATEGORIES } from '../data/jobs';
import { useAuth } from '../context/AuthContext';
import LocationSelector from '../components/LocationSelector';
import api from '../utils/api';

const categoryConfig = {
  Engineering: { icon: Monitor, label: 'Explore open roles' },
  Design:      { icon: Palette, label: 'Explore open roles' },
  Marketing:   { icon: Megaphone, label: 'Explore open roles' },
  Sales:       { icon: TrendingUp, label: 'Explore open roles' },
  Product:     { icon: BarChart3, label: 'Explore open roles' },
  Finance:     { icon: DollarSign, label: 'Explore open roles' },
};

const RECENT_SEARCHES_KEY = 'jobboard_recent_searches';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/jobs');
        const jobs = res.data.map((job) => ({
          ...job,
          tags: job.tags ? job.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }));
        setFeaturedJobs(jobs.filter((j) => j.featured).slice(0, 6));
      } catch (err) {
        // Fallback to static data
        const { getFeaturedJobs } = await import('../data/jobs');
        setFeaturedJobs(getFeaturedJobs());
      }
    };
    fetchFeatured();
  }, []);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (title, location) => {
    const trimmedTitle = title.trim();
    const trimmedLoc = location.trim();
    if (!trimmedTitle && !trimmedLoc) return;

    const newSearch = {
      title: trimmedTitle,
      location: trimmedLoc,
    };

    setRecentSearches((prev) => {
      // Filter out exact duplicate searches
      const filtered = prev.filter(
        (s) => !(s.title.toLowerCase() === newSearch.title.toLowerCase() && 
                 s.location.toLowerCase() === newSearch.location.toLowerCase())
      );
      const updated = [newSearch, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    saveRecentSearch(searchTitle, searchLocation);
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
              className="max-w-4xl mx-auto p-3 md:p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
            >
              {/* Job Title / Keywords */}
              <div
                className="flex-grow flex items-center px-4 py-3 border md:border-none rounded-xl md:rounded-none"
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

              {/* Location Select (Custom Dropdown) */}
              <div
                className="flex-grow flex items-center px-4 py-3 border md:border-l md:border-t-none md:border-b-none md:border-r-none rounded-xl md:rounded-none relative text-left"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <LocationSelector
                  value={searchLocation}
                  onChange={setSearchLocation}
                  placeholder="All India locations"
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit" 
                className="btn-primary w-full md:w-auto px-10 py-3 cursor-pointer shrink-0 rounded-xl md:ml-2"
              >
                Browse Jobs
              </button>
            </form>

            {/* Recent Searches History */}
            {recentSearches.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm px-4">
                <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Recent Searches:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {recentSearches.map((search, idx) => {
                    const label = [search.title, search.location].filter(Boolean).join(' in ');
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchTitle(search.title);
                          setSearchLocation(search.location);
                          // Redirect to job search page immediately with parameters
                          const params = new URLSearchParams();
                          if (search.title) params.set('q', search.title);
                          if (search.location) params.set('location', search.location);
                          navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer bg-neutral-100/10 dark:bg-neutral-800/10 hover:border-primary-500 hover:text-primary-500"
                        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                      >
                        {label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem(RECENT_SEARCHES_KEY);
                    }}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors ml-1 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #6d28d9 100%)',
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
