import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const SESSION_KEY = 'jobboard_session';
const TOKEN_KEY = 'jobboard_token';

const normalizeUser = (apiUser) => {
  if (!apiUser) return null;
  return {
    ...apiUser,
    role: apiUser.role === 'ROLE_RECRUITER' ? 'recruiter' : 'seeker',
    skills: apiUser.skills && typeof apiUser.skills === 'string'
      ? apiUser.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : (Array.isArray(apiUser.skills) ? apiUser.skills : []),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize session from token / me endpoint
  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const res = await api.get('/api/users/profile');
          setUser(normalizeUser(res.data));
        } catch (err) {
          console.error('Failed to load user session', err);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(SESSION_KEY);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeSession();
  }, []);

  // Fetch applications whenever user changes
  useEffect(() => {
    const fetchApps = async () => {
      if (user) {
        try {
          if (user.role === 'recruiter') {
            const res = await api.get('/api/applications/recruiter');
            setApplications(res.data);
          } else {
            const res = await api.get('/api/applications');
            setApplications(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch applications', err);
        }
      } else {
        setApplications([]);
      }
    };
    fetchApps();
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user: apiUser } = res.data;
      
      localStorage.setItem(TOKEN_KEY, token);
      const normalized = normalizeUser(apiUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
      setUser(normalized);
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 4000);
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid email or password. Please try again.',
      };
    }
  };

  const register = async ({ name, email, password, role, location }) => {
    try {
      const apiRole = role === 'recruiter' ? 'ROLE_RECRUITER' : 'ROLE_USER';
      const res = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role: apiRole,
        location: location || '',
      });
      const { token, user: apiUser } = res.data;

      localStorage.setItem(TOKEN_KEY, token);
      const normalized = normalizeUser(apiUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
      setUser(normalized);
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 4000);
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'An account with this email already exists.',
      };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const apiUpdates = { ...updates };
      if (updates.skills && Array.isArray(updates.skills)) {
        apiUpdates.skills = updates.skills.join(',');
      }
      
      const res = await api.put('/api/users/profile', apiUpdates);
      const normalized = normalizeUser(res.data);
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
      setUser(normalized);
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update profile.',
      };
    }
  };

  const applyToJob = async (jobId) => {
    if (!user) return false;
    try {
      await api.post(`/api/applications/apply/${jobId}`);
      // Refresh applications list
      const res = user.role === 'recruiter'
        ? await api.get('/api/applications/recruiter')
        : await api.get('/api/applications');
      setApplications(res.data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const hasApplied = (jobId) => {
    if (!user) return false;
    return applications.some((a) => (a.job?.id === Number(jobId)));
  };

  const getApplicationCount = () => {
    if (!user) return 0;
    return applications.length;
  };

  const getApplications = () => {
    if (!user) return [];
    return applications.map((a) => ({
      id: a.id,
      jobId: a.job?.id,
      appliedAt: a.appliedAt,
      status: a.status,
      job: a.job,
      seekerName: a.user?.name,
      seekerEmail: a.user?.email,
      seekerSkills: a.user?.skills,
      seekerLocation: a.user?.location,
      seekerResumeName: a.user?.resumeName,
      seekerResumeData: a.user?.resumeData,
    }));
  };

  const updateApplicationStatus = async (appId, status) => {
    if (!user) return;
    try {
      await api.put(`/api/applications/${appId}/status`, { status });
      // Refresh application list
      const res = user.role === 'recruiter'
        ? await api.get('/api/applications/recruiter')
        : await api.get('/api/applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, updateProfile, logout,
      isAuthenticated: !!user, loginSuccess, loading,
      applyToJob, hasApplied, getApplicationCount,
      getApplications, updateApplicationStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
