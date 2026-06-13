import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Load from localStorage whenever user changes
  useEffect(() => {
    if (user) {
      const STORAGE_KEY = `jobboard_saved_jobs_${user.email}`;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setSavedJobIds(stored ? JSON.parse(stored) : []);
      } catch {
        setSavedJobIds([]);
      }
    } else {
      setSavedJobIds([]);
    }
  }, [user]);

  // Save to localStorage when savedJobIds changes
  useEffect(() => {
    if (user) {
      const STORAGE_KEY = `jobboard_saved_jobs_${user.email}`;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobIds));
    }
  }, [savedJobIds, user]);

  const isSaved = (jobId) => {
    if (!user) return false;
    return savedJobIds.includes(Number(jobId));
  };

  const toggleSave = (jobId) => {
    if (!user) return false;
    const id = Number(jobId);
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
    return true;
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobIds, isSaved, toggleSave }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error('useSavedJobs must be used within SavedJobsProvider');
  return context;
};
