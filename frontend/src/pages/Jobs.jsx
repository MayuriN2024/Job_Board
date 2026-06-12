import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { JOBS } from '../data/jobs';
import { getAllJobs } from '../data/vacancies';

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

  useEffect(() => {
    if (categoryParam) setSelectedCategories([categoryParam]);
    if (locationParam) {
      setSearchLocation(locationParam);
      setFilterLocation(locationParam);
    }
    if (queryParam) setSearchTitle(queryParam);
  }, [categoryParam, locationParam, queryParam]);

  const allJobs = useMemo(() => getAllJobs(JOBS), []);

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
    setMinSalary(4);
  };

  const activeCategory = selectedCategories.length === 1 ? selectedCategories[0] : null;

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
              {filteredJobs.length} open roles from companies hiring in India
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer"
              style={{
                backgroundColor: showFilters ? 'rgba(147,51,234,0.1)' : 'var(--bg-card)',
                borderColor: showFilters ? '#a78bfa' : 'var(--border-color)',
                color: showFilters ? '#9333ea' : 'var(--text-secondary)',
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
              setSelectedLocation={setFilterLocation}
              minSalary={minSalary}
              setMinSalary={setMinSalary}
              onClearAll={handleClearAll}
            />
          </aside>

          <main className="flex-grow space-y-6">
            <div
              className="p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div
                className="flex-grow flex items-center px-4 py-2 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
              >
                <Search size={20} className="mr-3" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Filter by title, company, or skills..."
                  className="bg-transparent w-full outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div
                className="flex-grow flex items-center px-4 py-2 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
              >
                <MapPin size={20} className="mr-3" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="City or state..."
                  className="bg-transparent w-full outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div
                className="rounded-2xl border p-12 text-center shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <p className="text-lg font-medium mb-4" style={{ color: 'var(--text-muted)' }}>No jobs found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchTitle('');
                    setSearchLocation('');
                    handleClearAll();
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Reset All Filters
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
