import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareIds, setCompareIds] = useState([]);
  const [compareJobs, setCompareJobs] = useState([]); // Store full job objects

  const toggleCompare = (jobId, jobObj) => {
    setCompareIds((prev) => {
      if (prev.includes(jobId)) {
        setCompareJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 3) return prev;
      if (jobObj) {
        setCompareJobs((prevJobs) => [...prevJobs, jobObj]);
      }
      return [...prev, jobId];
    });
  };

  const isComparing = (jobId) => compareIds.includes(jobId);

  const clearCompare = () => {
    setCompareIds([]);
    setCompareJobs([]);
  };

  const removeFromCompare = (jobId) => {
    setCompareIds((prev) => prev.filter((id) => id !== jobId));
    setCompareJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <CompareContext.Provider value={{
      compareIds, compareJobs, toggleCompare, isComparing, clearCompare, removeFromCompare, compareCount: compareIds.length
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
