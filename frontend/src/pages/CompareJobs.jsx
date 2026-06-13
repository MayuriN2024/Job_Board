import React from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { getJobById } from '../data/jobs';

const CompareJobs = () => {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const jobs = compareIds.map((id) => getJobById(id)).filter(Boolean);

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Jobs
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Compare Jobs
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
              {jobs.length > 0
                ? `Comparing ${jobs.length} job${jobs.length > 1 ? 's' : ''} side by side`
                : 'Select jobs from the listings to compare them'}
            </p>
          </div>
          {jobs.length > 0 && (
            <button
              onClick={clearCompare}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <X size={16} /> Clear All
            </button>
          )}
        </div>

        {jobs.length > 0 ? (
          <div>
            {/* ── MOBILE CARD VIEW (shown only on small screens) ── */}
            <div className="flex flex-col gap-5 sm:hidden">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border shadow-sm overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {/* Card header */}
                  <div
                    className="px-5 py-4 flex items-start justify-between gap-3"
                    style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}
                  >
                    <div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-base hover:text-primary-500 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {job.title}
                      </Link>
                      <p className="text-sm mt-0.5 text-primary-500 font-medium">{job.company}</p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(job.id)}
                      className="p-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-500 shrink-0 cursor-pointer"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Attribute rows */}
                  {[
                    { icon: <MapPin size={14} />, label: 'Location', value: job.location },
                    { icon: <Briefcase size={14} />, label: 'Type', value: (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'rgba(109,40,217,0.08)', color: '#6d28d9' }}>
                        {job.type}
                      </span>
                    )},
                    { icon: <DollarSign size={14} />, label: 'Salary', value: <span className="font-bold">{job.salary}</span> },
                    { icon: <Clock size={14} />, label: 'Posted', value: job.postedAt },
                    { icon: <Briefcase size={14} />, label: 'Category', value: job.category },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 px-5 py-3"
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold shrink-0 pt-0.5 w-24" style={{ color: 'var(--text-muted)' }}>
                        {icon} {label}
                      </div>
                      <div className="text-sm font-medium text-right" style={{ color: 'var(--text-primary)' }}>
                        {value}
                      </div>
                    </div>
                  ))}

                  {/* Skills */}
                  <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2 py-1 rounded-md"
                          style={{ backgroundColor: 'rgba(109,40,217,0.08)', color: '#6d28d9' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="px-5 py-3" style={{ backgroundColor: 'var(--bg-input)' }}>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-primary-500 font-bold text-sm hover:gap-2.5 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCompare}
                className="btn-secondary text-sm flex items-center justify-center gap-2 w-full"
              >
                <X size={16} /> Clear All
              </button>
            </div>

            {/* ── DESKTOP TABLE VIEW (hidden on mobile) ── */}
            <div
              className="hidden sm:block rounded-3xl border shadow-sm overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header — Job titles */}
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th
                        className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider w-40"
                        style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}
                      >
                        Attribute
                      </th>
                      {jobs.map((job) => (
                        <th
                          key={job.id}
                          className="px-6 py-5 text-left"
                          style={{ backgroundColor: 'var(--bg-input)' }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                to={`/jobs/${job.id}`}
                                className="font-bold text-base hover:text-primary-500 transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {job.title}
                              </Link>
                              <p className="text-sm mt-0.5 text-primary-500 font-medium">{job.company}</p>
                            </div>
                            <button
                              onClick={() => removeFromCompare(job.id)}
                              className="p-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-500 shrink-0 cursor-pointer"
                              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                              title="Remove from comparison"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Location */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          <MapPin size={14} /> Location
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {job.location}
                        </td>
                      ))}
                    </tr>

                    {/* Type */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          <Briefcase size={14} /> Type
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4">
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(109,40,217,0.08)', color: '#6d28d9' }}
                          >
                            {job.type}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Salary */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          <DollarSign size={14} /> Salary
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {job.salary}
                        </td>
                      ))}
                    </tr>

                    {/* Posted */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={14} /> Posted
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {job.postedAt}
                        </td>
                      ))}
                    </tr>

                    {/* Category */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          <Briefcase size={14} /> Category
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {job.category}
                        </td>
                      ))}
                    </tr>

                    {/* Skills / Tags */}
                    <tr>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          Skills
                        </div>
                      </td>
                      {jobs.map((job) => (
                        <td key={job.id} className="px-6 py-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {job.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs font-medium px-2 py-1 rounded-md"
                                style={{ backgroundColor: 'rgba(109,40,217,0.08)', color: '#6d28d9' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* View Details links */}
              <div
                className="px-6 py-4 flex gap-4"
                style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}
              >
                <div className="w-40 shrink-0" />
                {jobs.map((job) => (
                  <div key={job.id} className="flex-1">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-primary-500 font-bold text-sm hover:gap-2.5 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border p-12 text-center shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Briefcase size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              No jobs selected for comparison.
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Add up to 3 jobs from the job listings to compare them side by side.
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

export default CompareJobs;
