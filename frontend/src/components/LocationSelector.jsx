import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/locations';

const LocationSelector = ({ value, onChange, placeholder = "Select location...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const activeOptionRef = useRef(null);

  // Sync with prop value
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const filteredLocations = INDIAN_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && activeOptionRef.current) {
      activeOptionRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isOpen]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
    setActiveIndex(0);
  };

  const handleSelect = (location) => {
    setInputValue(location);
    onChange(location);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => 
          filteredLocations.length > 0
            ? (prev < filteredLocations.length - 1 ? prev + 1 : 0)
            : -1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => 
          filteredLocations.length > 0
            ? (prev > 0 ? prev - 1 : filteredLocations.length - 1)
            : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredLocations.length) {
          handleSelect(filteredLocations[activeIndex]);
        } else if (filteredLocations.length > 0) {
          handleSelect(filteredLocations[0]);
        } else {
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div 
        className="flex items-center w-full focus-within:ring-2 focus-within:ring-primary-500 rounded-xl"
        style={{ contentVisibility: 'auto' }}
      >
        <MapPin className="text-neutral-400 mr-2 shrink-0" size={20} />
        
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="location-listbox"
          aria-activedescendant={activeIndex >= 0 ? `loc-opt-${activeIndex}` : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setActiveIndex(inputValue ? filteredLocations.findIndex(l => l.toLowerCase().includes(inputValue.toLowerCase())) : 0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none font-medium py-1 text-sm border-none focus:ring-0"
          style={{ color: 'var(--text-primary)' }}
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 ml-1"
            aria-label="Clear location"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id="location-listbox"
          role="listbox"
          ref={listRef}
          className="absolute left-0 right-0 mt-2 z-50 rounded-2xl shadow-xl border overflow-y-auto max-h-72 w-full text-left scroll-smooth overflow-x-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            maxHeight: '280px',
          }}
        >
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={loc}
                  id={`loc-opt-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  ref={isActive ? activeOptionRef : null}
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors border-b last:border-b-0 flex items-center gap-2 ${
                    isActive 
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                  }`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <MapPin size={14} className="shrink-0 opacity-60" />
                  <span className="truncate">{loc}</span>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-4 text-sm text-neutral-400 dark:text-neutral-500 text-center font-medium">
              No matching locations
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocationSelector;
