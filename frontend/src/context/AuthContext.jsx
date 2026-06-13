import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'jobboard_session';
const ACCOUNTS_KEY = 'jobboard_accounts';
const APPLICATIONS_KEY = 'jobboard_applications';

const loadSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadAccounts = () => {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const loadApplications = () => {
  try {
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadSession);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [applications, setApplications] = useState(loadApplications);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }, [applications]);

  const login = (email, password) => {
    const accounts = loadAccounts();
    const account = accounts.find((a) => a.email === email && a.password === password);
    if (account) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(account));
      setUser(account);
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 4000);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Please sign up first.' };
  };

  const register = ({ name, email, password, role, location }) => {
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      name,
      email,
      password,
      role: role || 'seeker',
      location: location || '',
      title: role === 'recruiter' ? 'Recruiter' : 'Job Seeker',
      bio: '',
      profilePic: '',
      resumeName: '',
      resumeData: '',
      skills: [],
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setLoginSuccess(true);
    setTimeout(() => setLoginSuccess(false), 4000);
    return { success: true };
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const accounts = loadAccounts().map((a) => (a.email === prev.email ? updated : a));
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return updated;
    });
  };

  const applyToJob = (jobId) => {
    if (!user) return false;
    setApplications((prev) => {
      const userApps = prev[user.email] || [];
      if (userApps.some((a) => a.jobId === jobId)) return prev;
      const newApp = {
        jobId,
        appliedAt: new Date().toISOString(),
        status: 'Applied',
      };
      return { ...prev, [user.email]: [...userApps, newApp] };
    });
    return true;
  };

  const hasApplied = (jobId) => {
    if (!user) return false;
    const userApps = applications[user.email] || [];
    // Support both old format (array of ids) and new format (array of objects)
    return userApps.some((a) => (typeof a === 'object' ? a.jobId === jobId : a === jobId));
  };

  const getApplicationCount = () => {
    if (!user) return 0;
    return (applications[user.email] || []).length;
  };

  const getApplications = () => {
    if (!user) return [];
    const userApps = applications[user.email] || [];
    // Normalize to new format
    return userApps.map((a) => {
      if (typeof a === 'object') return a;
      return { jobId: a, appliedAt: new Date().toISOString(), status: 'Applied' };
    });
  };

  const updateApplicationStatus = (jobId, status) => {
    if (!user) return;
    setApplications((prev) => {
      const userApps = (prev[user.email] || []).map((a) => {
        const id = typeof a === 'object' ? a.jobId : a;
        if (id === jobId) {
          return typeof a === 'object' ? { ...a, status } : { jobId: a, appliedAt: new Date().toISOString(), status };
        }
        return a;
      });
      return { ...prev, [user.email]: userApps };
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user, login, register, updateProfile, logout,
      isAuthenticated: !!user, loginSuccess,
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
