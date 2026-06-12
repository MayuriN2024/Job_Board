import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, MapPin, DollarSign, Tag, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { addVacancy } from '../data/vacancies';
import { JOB_CATEGORIES } from '../data/jobs';
import { INDIAN_LOCATIONS } from '../data/locations';

const AddVacancy = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    category: 'Engineering',
    description: '',
    tags: '',
    responsibilities: '',
    requirements: '',
    applyUrl: '',
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'recruiter') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.company.trim() || !form.location || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const newVacancy = addVacancy(
      {
        ...form,
        salaryMin: 0,
        salaryMax: 99,
      },
      user.email
    );

    addNotification({
      title: `New Job: ${form.title}`,
      message: `${form.company} is hiring for ${form.title} in ${form.location}`,
      jobId: newVacancy.id,
      type: 'job',
    });

    setSuccess(true);
    setTimeout(() => navigate('/jobs'), 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="px-8 py-8 text-white" style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center">
                <PlusCircle size={24} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Recruiter Portal</p>
                <h1 className="text-2xl font-extrabold">Add Vacancy</h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm font-medium bg-green-50 px-4 py-3 rounded-xl">
                Vacancy posted successfully! Redirecting to jobs…
              </p>
            )}

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Your company name"
                className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    required
                  >
                    <option value="">Select city</option>
                    {INDIAN_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Job Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹10–18 LPA"
                    className="w-full pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Skills / Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="React, Node.js, AWS (comma separated)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Job Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-neutral-400" size={18} />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the role and what you're looking for..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Apply URL
              </label>
              <input
                type="url"
                name="applyUrl"
                value={form.applyUrl}
                onChange={handleChange}
                placeholder="https://yourcompany.com/careers"
                className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <PlusCircle size={18} /> Post Vacancy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVacancy;
