import React, { useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, MapPin, Mail, Briefcase, Save, FileText, Camera, Download, Upload, Plus, X, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJobById } from '../data/jobs';
import { INDIAN_LOCATIONS } from '../data/locations';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, getApplications, getApplicationCount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const profilePicRef = useRef(null);
  const resumeRef = useRef(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const skills = user?.skills || [];
  const applications = getApplications();
  const applicationCount = getApplicationCount();

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...form,
      title: user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker',
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ resumeData: reader.result, resumeName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleResumeDownload = () => {
    if (!user.resumeData) return;
    const link = document.createElement('a');
    link.href = user.resumeData;
    link.download = user.resumeName || 'resume.pdf';
    link.click();
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || skills.includes(skill)) return;
    updateProfile({ skills: [...skills, skill] });
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    updateProfile({ skills: skills.filter((s) => s !== skillToRemove) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Application stats
  const thisWeekApps = applications.filter((a) => {
    const d = new Date(a.appliedAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const thisMonthApps = applications.filter((a) => {
    const d = new Date(a.appliedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary-500 font-bold mb-8 hover:gap-2 transition-all">
          <span className="mr-2">←</span> Back to Home
        </Link>

        <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          {/* Header with profile pic */}
          <div className="px-8 py-10 text-white" style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)' }}>
            <div className="flex items-center gap-4">
              <div className="relative group">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center">
                    <User size={32} />
                  </div>
                )}
                <button
                  onClick={() => profilePicRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={18} />
                </button>
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{user.title}</p>
                <h1 className="text-2xl font-extrabold">{user.name}</h1>
                <p className="text-white/80 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Profile Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h2>
              {!isEditing && (
                <button
                  onClick={() => {
                    setForm({
                      name: user.name,
                      email: user.email,
                      location: user.location || '',
                      bio: user.bio || '',
                    });
                    setIsEditing(true);
                  }}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    required
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Use this email to sign in — no separate ID needed.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Place / Location</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select your city</option>
                    {INDIAN_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself, your skills, and what you're looking for..."
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={16} /> Save Profile
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)' }}>
                  <Briefcase size={18} className="text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Role</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)' }}>
                  <MapPin size={18} className="text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Place</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.location || 'Not set — click Edit Profile to add'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)' }}>
                  <Mail size={18} className="text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Email (your login)</p>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)' }}>
                  <FileText size={18} className="text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Bio</p>
                    <p className="font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {user.bio || 'No bio yet — click Edit Profile to add one.'}
                    </p>
                  </div>
                </div>
                {saved && <p className="text-green-600 text-sm font-medium">Profile updated successfully.</p>}
              </div>
            )}

            {/* Skills Section */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: 'rgba(147,51,234,0.08)', color: '#9333ea' }}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-primary-200 rounded-full p-0.5 transition-colors cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No skills added yet.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add a skill (press Enter)"
                  className="flex-grow px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary-200 text-sm"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={addSkill}
                  className="btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Resume</h2>
              {user.resumeData ? (
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-input)' }}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-primary-500" />
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.resumeName || 'resume.pdf'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PDF uploaded</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResumeDownload}
                      className="p-2 rounded-lg border transition-colors hover:bg-primary-50 cursor-pointer"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                      title="Download resume"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => resumeRef.current?.click()}
                      className="p-2 rounded-lg border transition-colors hover:bg-primary-50 cursor-pointer"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                      title="Replace resume"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => resumeRef.current?.click()}
                  className="w-full p-6 rounded-xl border-2 border-dashed text-center transition-colors hover:border-primary-400 cursor-pointer"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                >
                  <Upload size={24} className="mx-auto mb-2" />
                  <p className="font-bold text-sm">Upload Resume (PDF)</p>
                  <p className="text-xs mt-1">Click to browse files</p>
                </button>
              )}
              <input
                ref={resumeRef}
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </div>

            {/* Application Tracker Summary */}
            {user.role !== 'recruiter' && (
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <ClipboardList size={20} className="text-primary-500" /> Applications
                  </h2>
                  <Link to="/applications" className="text-primary-500 font-bold text-sm hover:underline">
                    View all →
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                    <p className="text-2xl font-extrabold text-primary-500">{applicationCount}</p>
                    <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Total</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                    <p className="text-2xl font-extrabold text-primary-500">{thisWeekApps}</p>
                    <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>This Week</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-input)' }}>
                    <p className="text-2xl font-extrabold text-primary-500">{thisMonthApps}</p>
                    <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>This Month</p>
                  </div>
                </div>

                {applications.length > 0 ? (
                  <div className="space-y-2">
                    {applications.slice(0, 3).map((app) => {
                      const job = getJobById(app.jobId);
                      if (!job) return null;
                      return (
                        <Link
                          key={app.jobId}
                          to={`/jobs/${app.jobId}`}
                          className="flex items-center justify-between p-3 rounded-xl transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--bg-input)' }}
                        >
                          <div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{job.company}</p>
                          </div>
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(147,51,234,0.08)', color: '#9333ea' }}
                          >
                            {app.status}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    No applications yet. Start applying to jobs!
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 flex flex-col sm:flex-row gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              {user.role === 'recruiter' ? (
                <Link to="/add-vacancy" className="text-primary-500 font-bold hover:underline">
                  Add a new vacancy →
                </Link>
              ) : (
                <Link to="/saved-jobs" className="text-primary-500 font-bold hover:underline">
                  View your saved jobs →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
