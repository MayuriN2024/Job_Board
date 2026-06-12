import React, { useState } from 'react';
import { MapPin, Briefcase, Clock, Bookmark, ExternalLink, Share2, GitCompareArrows } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useCompare } from '../context/CompareContext';
import ShareModal from './ShareModal';
import CompanyLogo from './CompanyLogo';

const JobCard = ({ job }) => {
  const { isSaved, toggleSave } = useSavedJobs();
  const { isComparing, toggleCompare, compareCount } = useCompare();
  const saved = isSaved(job.id);
  const comparing = isComparing(job.id);
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <div
        className="card-premium p-4 sm:p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <CompanyLogo company={job.company} size="md" applyUrl={job.applyUrl} />
            <div>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
              <div className="text-primary-500 font-medium mb-2 sm:mb-3">{job.company}</div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={16} /> {job.type}
                </div>
                <div className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {job.salary}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} /> {job.postedAt}
                </div>
              </div>
            </div>
          </div>

          {/* Tags - hidden on small, shown on medium+ */}
          <div className="hidden sm:flex gap-2 flex-wrap shrink-0">
            {job.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="tag-badge px-2 py-1 text-xs font-medium rounded-md"
                style={{
                  backgroundColor: 'rgba(147,51,234,0.08)',
                  color: '#9333ea',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tags - shown on small, hidden on medium+ */}
        <div className="flex sm:hidden gap-2 flex-wrap">
          {job.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="tag-badge px-2 py-1 text-xs font-medium rounded-md"
              style={{
                backgroundColor: 'rgba(147,51,234,0.08)',
                color: '#9333ea',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Compare */}
          <button
            onClick={() => toggleCompare(job.id)}
            className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              comparing ? 'bg-primary-50 border-primary-200 text-primary-600' : ''
            }`}
            style={!comparing ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
            title={comparing ? 'Remove from compare' : (compareCount >= 3 ? 'Max 3 jobs' : 'Compare')}
            disabled={!comparing && compareCount >= 3}
          >
            <GitCompareArrows size={18} />
          </button>

          {/* Save */}
          <button
            onClick={() => toggleSave(job.id)}
            className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              saved
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : ''
            }`}
            style={!saved ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
            title={saved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
            title="Share job"
          >
            <Share2 size={18} />
          </button>

          <div className="flex-grow" />

          <Link to={`/jobs/${job.id}`} className="btn-secondary py-2 px-4 sm:px-5 text-sm text-center">
            View Details
          </Link>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 px-4 sm:px-5 text-sm flex items-center gap-1"
          >
            Apply <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {showShare && <ShareModal job={job} onClose={() => setShowShare(false)} />}
    </>
  );
};

export default JobCard;
