import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import About from './pages/About';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import Login from './pages/Login';
import Register from './pages/Register';
import AddVacancy from './pages/AddVacancy';
import Applications from './pages/Applications';
import CompareJobs from './pages/CompareJobs';
import LoginToast from './components/LoginToast';
import ToastContainer from './components/ToastContainer';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';
import { useCompare } from './context/CompareContext';
import { useToast } from './context/ToastContext';
import { Link } from 'react-router-dom';
import { X, GitCompareArrows } from 'lucide-react';
import { getJobById } from './data/jobs';

function App() {
  const { loginSuccess, user } = useAuth();
  const { compareIds, removeFromCompare, clearCompare, compareCount } = useCompare();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      
      {loginSuccess && user && <LoginToast name={user.name} />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-vacancy" element={<AddVacancy />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/compare" element={<CompareJobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating Compare Bar */}
      {compareCount > 0 && (
        <div className="compare-bar">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto min-w-0 flex-1">
              <GitCompareArrows size={18} className="text-primary-500 shrink-0" />
              <span className="text-sm font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>
                {compareCount} job{compareCount > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                {compareIds.map((id) => {
                  const job = getJobById(id);
                  if (!job) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium shrink-0"
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                    >
                      {job.title.length > 20 ? job.title.slice(0, 20) + '…' : job.title}
                      <button onClick={() => removeFromCompare(id)} className="hover:text-red-400 cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={clearCompare} className="text-xs font-medium hover:underline cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                Clear
              </button>
              <Link
                to="/compare"
                onClick={(e) => {
                  if (compareCount < 2) {
                    e.preventDefault();
                    showToast('Please select at least 2 jobs to compare! 🔄', 'info');
                  }
                }}
                className={`btn-primary py-2 px-4 text-sm cursor-pointer ${compareCount < 2 ? 'opacity-60' : ''}`}
              >
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Global Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
