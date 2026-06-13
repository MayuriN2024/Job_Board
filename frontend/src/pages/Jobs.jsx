import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import LocationSelector from '../components/LocationSelector';
import { Search, SlidersHorizontal, X, Inbox, Clock } from 'lucide-react';
import api from '../utils/api';


const RECENT_SEARCHES_KEY = 'jobboard_recent_searches';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const fromHome = searchParams.get('from') === 'home';
  const categoryParam = searchParams.get('category');
  const locationParam = searchParams.get('location');
  const queryParam = searchParams.get('q');

  const [searchTitle, setSearchTitle] = useState(queryParam || '');
  const [searchLocation, setSearchLocation] = useState(locationParam || '');
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterLocation, setFilterLocation] = useState(locationParam || '');
  const [minSalary, setMinSalary] = useState(4);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  // Recently viewed list
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Recent searches history
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [allJobs, setAllJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Fetch all jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await api.get('/api/jobs');
        setAllJobs(res.data.map((job) => ({
          ...job,
          tags: job.tags ? job.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        })));
      } catch (err) {
        console.error('Failed to fetch jobs from backend', err);
        // Fallback to static data
        const { JOBS } = await import('../data/jobs');
        const { getAllJobs } = await import('../data/vacancies');
        setAllJobs(getAllJobs(JOBS));
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategories([categoryParam]);
    if (locationParam) {
      setSearchLocation(locationParam);
      setFilterLocation(locationParam);
    }
    if (queryParam) setSearchTitle(queryParam);
  }, [categoryParam, locationParam, queryParam]);

  // Load recently viewed jobs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jobboard_recently_viewed');
      if (stored) {
        const ids = JSON.parse(stored);
        const details = ids
          .map((id) => allJobs.find((j) => String(j.id) === String(id)))
          .filter(Boolean);
        setRecentlyViewed(details);
      }
    } catch (e) {
      console.error(e);
    }
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      if (searchTitle.trim()) {
        const query = searchTitle.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesTags = job.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }

      const locationQuery = (filterLocation || searchLocation).trim();
      if (locationQuery) {
        const query = locationQuery.toLowerCase();
        const matchesLocation = job.location.toLowerCase().includes(query);
        if (!matchesLocation) return false;
      }

      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(job.category)) return false;
      }

      if (selectedTypes.length > 0) {
        const isJobRemote = job.type === 'Remote' || job.location.toLowerCase().includes('remote');
        const matchesType = selectedTypes.some((type) => {
          if (type === 'Remote') return isJobRemote;
          return job.type === type;
        });
        if (!matchesType) return false;
      }

      if (job.salaryMax < minSalary) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return a.postedDays - b.postedDays;
      }
      return a.title.localeCompare(b.title);
    });
  }, [allJobs, searchTitle, searchLocation, filterLocation, selectedCategories, selectedTypes, minSalary, sortBy]);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setFilterLocation('');
    setSearchLocation('');
    setSearchTitle('');
    setMinSalary(4);
  };

  const activeCategory = selectedCategories.length === 1 ? selectedCategories[0] : null;

  // Active filter detection
  const hasActiveFilters = searchTitle.trim() !== '' || 
                          searchLocation.trim() !== '' || 
                          filterLocation.trim() !== '' || 
                          selectedCategories.length > 0 || 
                          selectedTypes.length > 0 || 
                          minSalary > 4;

  const handleChipRemove = (type, val) => {
    if (type === 'search') setSearchTitle('');
    if (type === 'location') {
      setSearchLocation('');
      setFilterLocation('');
    }
    if (type === 'category') setSelectedCategories(prev => prev.filter(c => c !== val));
    if (type === 'type') setSelectedTypes(prev => prev.filter(t => t !== val));
    if (type === 'salary') setMinSalary(4);
  };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-primary-500 font-bold mb-6 hover:gap-2 transition-all"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {activeCategory ? `${activeCategory} jobs` : 'Browse jobs'}
            </h1>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
              {`${filteredJobs.length} open roles from companies hiring in India`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer"
              style={{
                backgroundColor: showFilters ? 'rgba(147,51,234,0.1)' : 'var(--bg-card)',
                borderColor: showFilters ? '#7c3aed' : 'var(--border-color)',
                color: showFilters ? '#6d28d9' : 'var(--text-secondary)',
              }}
            >
              {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>

            <div className="flex p-1 rounded-xl shadow-sm border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-6 py-2 font-bold rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  sortBy === 'recent' ? 'bg-primary-600 text-white shadow-sm' : ''
                }`}
                style={sortBy !== 'recent' ? { color: 'var(--text-muted)' } : {}}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`px-6 py-2 font-bold rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  sortBy === 'title' ? 'bg-primary-600 text-white shadow-sm' : ''
                }`}
                style={sortBy !== 'title' ? { color: 'var(--text-muted)' } : {}}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar — always visible on lg+, toggled on mobile */}
          <aside className={`w-full lg:w-80 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedLocation={filterLocation}
              setSelectedLocation={(val) => {
                setFilterLocation(val);
                setSearchLocation(val);
              }}
              minSalary={minSalary}
              setMinSalary={setMinSalary}
              onClearAll={handleClearAll}
            />

            {/* Recently Viewed Sidebar Widget */}
            {recentlyViewed.length > 0 && (
              <div 
                className="mt-6 rounded-2xl border p-5 shadow-sm hidden lg:block"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Clock size={14} className="text-primary-500" /> Recently Viewed
                </h3>
                <div className="space-y-4">
                  {recentlyViewed.map((j) => (
                    <Link key={j.id} to={`/jobs/${j.id}`} className="flex items-start gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 font-extrabold text-sm uppercase">
                        {j.company[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate group-hover:text-primary-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {j.title}
                        </h4>
                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {j.company} · {j.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="flex-grow space-y-6">
            {/* Search Bar Block */}
            <div
              className="p-3 md:p-2.5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div
                className="flex-grow flex items-center px-4 py-3 border md:border-none rounded-xl md:rounded-none"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Search size={20} className="mr-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Filter by title, company, or skills..."
                  className="bg-transparent w-full outline-none text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div
                className="flex-grow flex items-center px-4 py-3 border md:border-l md:border-t-none md:border-b-none md:border-r-none rounded-xl md:rounded-none relative text-left"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <LocationSelector
                  value={searchLocation}
                  onChange={(val) => {
                    setSearchLocation(val);
                    setFilterLocation(val);
                  }}
                  placeholder="City or state..."
                />
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-xs font-bold mr-1" style={{ color: 'var(--text-muted)' }}>Active Filters:</span>
                {searchTitle.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    Search: "{searchTitle}"
                    <button onClick={() => handleChipRemove('search')} className="hover:text-red-500 transition-colors font-bold text-[10px] ml-0.5 cursor-pointer">✕</button>
                  </span>
                )}
                {(searchLocation.trim() || filterLocation.trim()) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    Location: "{searchLocation || filterLocation}"
                    <button onClick={() => handleChipRemove('location')} className="hover:text-red-500 transition-colors font-bold text-[10px] ml-0.5 cursor-pointer">✕</button>
                  </span>
                )}
                {selectedCategories.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    {cat}
                    <button onClick={() => handleChipRemove('category', cat)} className="hover:text-red-500 transition-colors font-bold text-[10px] ml-0.5 cursor-pointer">✕</button>
                  </span>
                ))}
                {selectedTypes.map((type) => (
                  <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    {type}
                    <button onClick={() => handleChipRemove('type', type)} className="hover:text-red-500 transition-colors font-bold text-[10px] ml-0.5 cursor-pointer">✕</button>
                  </span>
                ))}
                {minSalary > 4 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    {minSalary}+ LPA
                    <button onClick={() => handleChipRemove('salary')} className="hover:text-red-500 transition-colors font-bold text-[10px] ml-0.5 cursor-pointer">✕</button>
                  </span>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors underline ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Recent Searches (Optional Helper) */}
            {recentSearches.length > 0 && !hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs px-1">
                <span className="font-semibold text-neutral-400" style={{ color: 'var(--text-muted)' }}>Quick search history:</span>
                {recentSearches.slice(0, 3).map((search, idx) => {
                  const label = [search.title, search.location].filter(Boolean).join(' in ');
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTitle(search.title || '');
                        setSearchLocation(search.location || '');
                        setFilterLocation(search.location || '');
                      }}
                      className="px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-800 hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer bg-neutral-100/10 dark:bg-neutral-800/10 text-neutral-500 dark:text-neutral-400 font-medium"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* List Results */}
            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              /* Beautiful Empty State */
              <div
                className="rounded-3xl border p-12 md:p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-5"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="w-20 h-20 rounded-full bg-primary-500/5 text-primary-500 flex items-center justify-center border-2 border-dashed border-primary-500/10">
                  <Inbox size={36} />
                </div>
                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    No jobs found
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Try adjusting your search keywords, clearing locations, or resetting filters to find matching opportunities.
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="btn-primary py-2.5 px-6 text-sm font-bold shadow-md cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
