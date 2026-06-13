import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const iconMap = {
  success: <CheckCircle className="text-emerald-400 shrink-0" size={20} />,
  error: <AlertCircle className="text-rose-400 shrink-0" size={20} />,
  info: <Info className="text-sky-400 shrink-0" size={20} />,
};

const bgMap = {
  success: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', // Emerald dark
  error: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', // Rose dark
  info: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)', // Sky dark
};

// Fallback colors if styling requires matching app theme
const borderMap = {
  success: 'rgba(16, 185, 129, 0.2)',
  error: 'rgba(239, 68, 68, 0.2)',
  info: 'rgba(14, 165, 233, 0.2)',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
          >
            <div className="mt-0.5 shrink-0">
              {iconMap[toast.type] || iconMap.info}
            </div>
            
            <div className="flex-grow text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
