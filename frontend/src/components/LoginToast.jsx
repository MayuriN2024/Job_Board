import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const LoginToast = ({ name }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] toast-enter"
      style={{ minWidth: '300px', maxWidth: '420px' }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border"
        style={{
          background: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #a855f7 100%)',
          borderColor: 'rgba(255,255,255,0.15)',
          color: '#fff',
        }}
      >
        <div className="shrink-0 bg-white/20 rounded-full p-1">
          <CheckCircle size={20} className="text-white" />
        </div>
        <div className="flex-grow">
          <p className="font-bold text-sm">You're logged in! 🎉</p>
          <p className="text-purple-200 text-xs mt-0.5">
            Welcome back, {name?.split(' ')[0]}! Ready to find your next job?
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default LoginToast;
