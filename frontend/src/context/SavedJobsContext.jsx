import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const SavedJobsContext = createContext(null);

export const SavedJobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Derive savedJobIds from savedJobs
  const savedJobIds = savedJobs.map((job) => job.id);

  // Load saved jobs from backend whenever user changes
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get('/api/saved-jobs');
          setSavedJobs(res.data);
        } catch (err) {
          console.error('Failed to fetch saved jobs', err);
          setSavedJobs([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSavedJobs([]);
      }
    };
    fetchSavedJobs();
  }, [user]);

  const isSaved = (jobId) => {
    if (!user) return false;
    return savedJobIds.includes(Number(jobId));
  };

  const toggleSave = async (jobId) => {
    if (!user) return false;
    const id = Number(jobId);
    try {
      const res = await api.post(`/api/saved-jobs/toggle/${id}`);
      const nowSaved = res.data; // boolean returned by server
      if (nowSaved) {
        // Refetch to get the full job object
        const savedRes = await api.get('/api/saved-jobs');
        setSavedJobs(savedRes.data);
      } else {
        setSavedJobs((prev) => prev.filter((j) => j.id !== id));
      }
      return true;
    } catch (err) {
      console.error('Failed to toggle saved job', err);
      return false;
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, savedJobIds, isSaved, toggleSave, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error('useSavedJobs must be used within SavedJobsProvider');
  return context;
};
