import React from 'react';
import { Filter } from 'lucide-react';
import { JOB_CATEGORIES } from '../data/jobs';
import { INDIAN_LOCATIONS } from '../data/locations';

const FilterPanel = ({
  selectedCategories = [],
  setSelectedCategories,
  selectedTypes = [],
  setSelectedTypes,
  selectedLocation = '',
  setSelectedLocation,
  minSalary = 4,
  setMinSalary,
  onClearAll,
}) => {
  const types = ['Full-time', 'Part-time', 'Contract', 'Remote'];

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div
      className="p-6 rounded-2xl border shadow-sm sticky top-24"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Filter size={18} className="text-primary-600" /> Filters
        </h3>
        <button onClick={onClearAll} className="text-xs text-primary-600 hover:underline">Clear All</button>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Location</h4>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-primary-500"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All India</option>
            {INDIAN_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Categories</h4>
          <div className="space-y-3">
            {JOB_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm transition-colors group-hover:text-primary-600" style={{ color: 'var(--text-secondary)' }}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Employment Type</h4>
          <div className="space-y-3">
            {types.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm transition-colors group-hover:text-primary-600" style={{ color: 'var(--text-secondary)' }}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Min Salary</h4>
            <span className="text-sm font-bold text-primary-600">₹{minSalary} LPA+</span>
          </div>
          <input
            type="range"
            min="4"
            max="50"
            step="2"
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary-600"
            style={{ backgroundColor: 'var(--bg-input)' }}
          />
          <div className="flex justify-between text-xs mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
            <span>₹4 LPA</span>
            <span>₹50 LPA+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
