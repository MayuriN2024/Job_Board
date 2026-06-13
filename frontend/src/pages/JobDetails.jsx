import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Bookmark, Share2, CheckCircle, ExternalLink } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import ShareModal from '../components/ShareModal';
import ApplyModal from '../components/ApplyModal';
import CompanyLogo from '../components/CompanyLogo';
import api from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const { isSaved, toggleSave } = useSavedJobs();
  const { isAuthenticated, hasApplied } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showShare, setShowShare] = useState(false);
  const [showApply, setShowApply] = useState(false);

  // Fetch job from backend
  useEffect(() => {
    const fetchJob = async () => {
      setJobLoading(true);
      try {
        const res = await api.get(`/api/jobs/${id}`);
        const j = res.data;
        setJob({
          ...j,
          tags: j.tags ? j.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          responsibilities: j.responsibilities ? j.responsibilities.split('\n').filter(Boolean) : [],
          requirements: j.requirements ? j.requirements.split('\n').filter(Boolean) : [],
        });
      } catch (err) {
        // Fallback to static data
        const { getJobById } = await import('../data/jobs');
        const staticJob = getJobById(id);
        setJob(staticJob || null);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Track recently viewed jobs in localStorage
  useEffect(() => {
    if (job) {
      try {
        const stored = localStorage.getItem('jobboard_recently_viewed');
        let list = stored ? JSON.parse(stored) : [];
        list = list.filter((savedId) => String(savedId) !== String(job.id));
        list.unshift(job.id);
        list = list.slice(0, 3);
        localStorage.setItem('jobboard_recently_viewed', JSON.stringify(list));
      } catch (e) {
        console.error('Failed to update recently viewed jobs', e);
      }
    }
  }, [job]);

  if (jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  const saved = isSaved(job.id);
  const applied = hasApplied(job.id);

  const handleBookmarkToggle = () => {
    if (!isAuthenticated) {
      showToast('Please log in to save jobs! 🔐', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    toggleSave(job.id);
    if (!saved) {
      showToast('Job added to bookmarks! 📌', 'success');
    } else {
      showToast('Job removed from bookmarks.', 'info');
    }
  };

  return (
    <>
      <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/jobs"
            className="inline-flex items-center text-primary-600 font-bold mb-8 hover:gap-2 transition-all"
          >
            <span className="mr-2">←</span> Back to Jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div
                className="rounded-3xl p-6 sm:p-8 border shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex gap-6">
                    <CompanyLogo company={job.company} size="lg" applyUrl={job.applyUrl} />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>{job.title}</h1>
                      <div className="flex items-center gap-2 text-primary-500 font-bold text-lg">
                        <CompanyLogo company={job.company} size="sm" applyUrl={job.applyUrl} className="!w-7 !h-7 !text-sm !rounded-lg" />
                        {job.company}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowShare(true)}
                      className="p-3 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                      title="Share job"
                    >
                      <Share2 size={20} />
                    </button>
                    
                    {/* Bookmark icon top */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBookmarkToggle}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/40 ${
                        saved ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-950/20' : ''
                      }`}
                      style={!saved ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
                      title={saved ? 'Remove from saved' : 'Save job'}
                    >
                      <motion.div
                        animate={saved ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* Meta Grid */}
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y mb-8"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div>
                    <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Salary</div>
                    <div className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{job.salary}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Type</div>
                    <div className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{job.type}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Location</div>
                    <div className="font-bold text-sm sm:text-base flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <MapPin size={14} /> {job.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Posted</div>
                    <div className="font-bold text-sm sm:text-base flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <Clock size={14} /> {job.postedAt}
                    </div>
                  </div>
                </div>

                {/* Pill Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm font-semibold rounded-full"
                      style={{ backgroundColor: 'rgba(109,40,217,0.08)', color: '#6d28d9' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description / Responsibilities / Requirements */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Description</h3>
                    <p className="leading-relaxed text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{job.description}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Responsibilities</h3>
                    <ul className="space-y-3">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Requirements</h3>
                    <ul className="space-y-3">
                      {job.requirements.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div
                className="rounded-3xl p-6 sm:p-8 border shadow-sm sticky top-28"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-muted)' }}>
                  <Briefcase size={20} />
                  <span className="font-medium text-sm">Currently hiring</span>
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Apply directly through our internal portal. We will process your application immediately.
                </p>

                {/* Applied status */}
                {applied && (
                  <div
                    className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.2)',
                    }}
                  >
                    <CheckCircle size={16} className="shrink-0" style={{ color: '#16a34a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>You&apos;ve applied to this job</span>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => setShowApply(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 cursor-pointer font-bold"
                >
                  {applied ? 'Apply Again' : 'Apply Now'} <ExternalLink size={18} />
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmarkToggle}
                  className={`w-full mt-3 py-3 rounded-xl font-bold text-sm border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    saved
                      ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-950/20'
                      : ''
                  }`}
                  style={!saved ? { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : {}}
                >
                  <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save Job'}
                </button>

                <button
                  onClick={() => setShowShare(true)}
                  className="w-full mt-3 py-3 rounded-xl font-bold text-sm border transition-colors flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <Share2 size={16} />
                  Share Job
                </button>
              </div>

              <div
                className="rounded-3xl p-6 sm:p-8 border shadow-sm"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About {job.company}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {job.company} is actively recruiting for this role in {job.location.split(',')[0]}.
                  Visit their careers portal for the latest openings and application status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShare && <ShareModal job={job} onClose={() => setShowShare(false)} />}
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}
    </>
  );
};

export default JobDetails;
