import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Linkedin, Facebook, MessageCircle } from 'lucide-react';

const ShareModal = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);
  const jobUrl = `${window.location.origin}/jobs/${job.id}`;
  const shareText = `Check out this job: ${job.title} at ${job.company} — ${jobUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = jobUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={20} />,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
    },
    {
      label: 'Twitter',
      icon: <Twitter size={20} />,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'Facebook',
      icon: <Facebook size={20} />,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`,
    },
  ];

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Share this job
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {job.title} · {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary-50 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {shareOptions.map((opt) => (
            <a
              key={opt.label}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ backgroundColor: opt.color }}
            >
              {opt.icon}
              {opt.label}
            </a>
          ))}
        </div>

        {/* Copy Link */}
        <div
          className="flex items-center gap-2 rounded-xl border p-3"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}
        >
          <p
            className="flex-grow text-xs font-medium truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {jobUrl}
          </p>
          <button
            onClick={copyLink}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: copied ? '#16a34a' : '#9333ea',
              color: '#fff',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
