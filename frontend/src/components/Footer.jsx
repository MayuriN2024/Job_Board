import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-12 pb-8" style={{ backgroundColor: '#0f0a1a', color: '#9ca3af' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3 text-white">
              <Briefcase size={22} className="text-primary-400" />
              <span className="text-xl font-bold">JobBoard</span>
            </div>
            <p className="text-neutral-400 text-sm max-w-sm">
              Find verified jobs from companies hiring across India.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary-400 transition-colors">About</Link>
            <Link to="/jobs" className="hover:text-primary-400 transition-colors">Browse Jobs</Link>
            <Link to="/saved-jobs" className="hover:text-primary-400 transition-colors">Saved Jobs</Link>
            <Link to="/applications" className="hover:text-primary-400 transition-colors">Applications</Link>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          <p>© 2026 JobBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
