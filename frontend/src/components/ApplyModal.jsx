import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ApplyModal = ({ job, onClose }) => {
  const { user, applyToJob } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
  });

  const [useProfileResume, setUseProfileResume] = useState(!!user?.resumeName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const modalRef = useRef(null);

  // Focus trap implementation
  useEffect(() => {
    // Save previous active element to restore focus when closing
    const previousActiveElement = document.activeElement;
    
    // Focus the modal content on mount
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUseProfileResume(false);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[errors.resume];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?([0-9]{2})?[-. ]?([0-9]{10})$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!useProfileResume && !selectedFile) {
      newErrors.resume = 'Please upload your resume';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 30) {
      newErrors.coverLetter = 'Please write a brief cover letter (at least 30 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Track the application in auth state (if logged in)
    const resumeName = useProfileResume ? user.resumeName : selectedFile.name;
    const details = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      resumeName,
      coverLetter: formData.coverLetter,
    };

    applyToJob(job.id, details);
    setIsSubmitted(true);
    showToast(`Successfully applied to ${job.title} at ${job.company}! 🚀`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex="0"
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all transform focus:outline-none"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors focus:ring-2 focus:ring-primary-500"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 id="modal-title" className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Apply to {job.company}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Hiring for <span className="font-semibold text-primary-500">{job.title}</span>
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Resume <span className="text-rose-500">*</span>
                </label>

                {user?.resumeName && (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="useProfileResume"
                      checked={useProfileResume}
                      onChange={(e) => {
                        setUseProfileResume(e.target.checked);
                        if (e.target.checked) setSelectedFile(null);
                      }}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <label htmlFor="useProfileResume" className="text-xs font-medium cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                      Use resume from profile: <span className="text-primary-500 font-semibold">{user.resumeName}</span>
                    </label>
                  </div>
                )}

                {(!useProfileResume) && (
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/20 ${
                      selectedFile ? 'border-primary-400' : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                    onClick={() => document.getElementById('resume-file-input').click()}
                  >
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-1">
                        <FileCheck size={28} className="text-primary-500" />
                        <span className="text-sm font-bold truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>
                          {selectedFile.name}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-neutral-400">
                        <Upload size={28} />
                        <span className="text-sm font-medium">Click to upload resume</span>
                        <span className="text-xs">PDF, DOC, DOCX up to 5MB</span>
                      </div>
                    )}
                  </div>
                )}
                {errors.resume && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.resume}</p>}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Cover Letter <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Tell the recruiter why you are a great fit for this role..."
                />
                {errors.coverLetter && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.coverLetter}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold rounded-xl border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-sm cursor-pointer shadow-lg"
              >
                Submit Application
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Application Submitted!
            </h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Your application for <span className="font-semibold text-primary-500">{job.title}</span> has been sent to <span className="font-semibold">{job.company}</span>.
            </p>
            <button
              onClick={onClose}
              className="btn-primary px-8 py-2.5 text-sm mt-4 cursor-pointer"
            >
              Back to Job Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
