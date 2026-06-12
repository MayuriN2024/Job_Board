import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClipboardList, Calendar, Briefcase, ArrowRight, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJobById } from '../data/jobs';

const STATUS_OPTIONS = ['All', 'Applied', 'Under Review', 'Interview', 'Offered', 'Rejected'];

const statusColors = {
  Applied: { bg: 'rgba(147,51,234,0.1)', color: '#9333ea' },
  'Under Review': { bg: 'rgba(234,179,8,0.1)', color: '#ca8a04' },
  Interview: { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  Offered: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  Rejected: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
};

const Applications = () => {
  const { isAuthenticated, getApplications, getApplicationCount } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const applications = getApplications();
  const applicationCount = getApplicationCount();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekApps = applications.filter((a) => new Date(a.appliedAt) >= weekAgo).length;
  const thisMonthApps = applications.filter((a) => {
    const d = new Date(a.appliedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const filteredApps = statusFilter === 'All'
    ? applications
    : applications.filter((a) => a.status === statusFilter);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <ClipboardList size={28} className="text-primary-500" />
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Applications
          </h1>
        </div>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Track all your job applications in one place.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            className="rounded-2xl border p-6 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Briefcase size={24} className="text-primary-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-primary-500">{applicationCount}</p>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Total Applied</p>
          </div>
          <div
            className="rounded-2xl border p-6 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Calendar size={24} className="text-primary-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-primary-500">{thisWeekApps}</p>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>This Week</p>
          </div>
          <div
            className="rounded-2xl border p-6 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Calendar size={24} className="text-primary-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-primary-500">{thisMonthApps}</p>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>This Month</p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter size={16} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary-600 text-white shadow-sm'
                  : ''
              }`}
              style={statusFilter !== status ? {
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              } : {}}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApps.length > 0 ? (
          <div className="space-y-3">
            {filteredApps.map((app) => {
              const job = getJobById(app.jobId);
              if (!job) return null;
              const sc = statusColors[app.status] || statusColors.Applied;
              return (
                <Link
                  key={app.jobId}
                  to={`/jobs/${app.jobId}`}
                  className="block rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-grow">
                      <h3 className="font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>
                        {job.title}
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {job.company} · {job.location}
                      </p>
                      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Calendar size={12} /> Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {app.status}
                      </span>
                      <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-2xl border p-12 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <ClipboardList size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              {statusFilter !== 'All' ? `No ${statusFilter.toLowerCase()} applications.` : 'No applications yet.'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Start applying to jobs to track them here.
            </p>
            <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
              Browse Jobs <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
