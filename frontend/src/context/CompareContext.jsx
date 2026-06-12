import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareIds, setCompareIds] = useState([]);

  const toggleCompare = (jobId) => {
    setCompareIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, jobId];
    });
  };

  const isComparing = (jobId) => compareIds.includes(jobId);

  const clearCompare = () => setCompareIds([]);

  const removeFromCompare = (jobId) => {
    setCompareIds((prev) => prev.filter((id) => id !== jobId));
  };

  return (
    <CompareContext.Provider value={{
      compareIds, toggleCompare, isComparing, clearCompare, removeFromCompare, compareCount: compareIds.length
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
