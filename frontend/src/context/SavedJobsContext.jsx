import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedJobsContext = createContext(null);

const STORAGE_KEY = 'jobboard_saved_jobs';

export const SavedJobsProvider = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const isSaved = (jobId) => savedJobIds.includes(Number(jobId));

  const toggleSave = (jobId) => {
    const id = Number(jobId);
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
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
