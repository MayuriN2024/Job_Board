import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import JobCard from '../components/JobCard';
import { useSavedJobs } from '../context/SavedJobsContext';
import { JOBS } from '../data/jobs';
import { getAllJobs } from '../data/vacancies';

const SavedJobs = () => {
  const { savedJobIds } = useSavedJobs();
  const savedJobs = getAllJobs(JOBS).filter((job) => savedJobIds.includes(job.id));

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Saved Jobs</h1>
        <p className="mb-10" style={{ color: 'var(--text-muted)' }}>Jobs you bookmarked for later.</p>

        {savedJobs.length > 0 ? (
          <div className="space-y-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border p-12 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Bookmark size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg font-medium mb-4" style={{ color: 'var(--text-muted)' }}>No saved jobs yet.</p>
            <Link to="/jobs" className="btn-primary inline-block">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
