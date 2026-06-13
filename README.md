# 💼 JobBoard

A modern, production-level career platform for **Job Seekers** and **Recruiters** — built with React, Vite, and Tailwind CSS. Features a deep violet design system, responsive layouts, real-time filtering, application tracking, and rich profile management.

---

## ✨ Features

### 🔍 Job Discovery
- **Browse Jobs** — Searchable, filterable job listing with real-time results (no lag, instant rendering)
- **Filter Panel** — Filter by category, job type, location, and minimum salary (LPA)
- **Active Filter Chips** — Visual chips showing applied filters with one-click removal
- **Quick Search History** — Saves recent searches to localStorage for fast re-search
- **Recently Viewed Jobs** — Sidebar widget tracking the last jobs you viewed

### 👤 User Profiles
- **Profile Page** — View and edit name, email, location, bio, and **cover letter**
- **Profile Picture Upload** — Upload a custom avatar (stored as base64)
- **Skills Management** — Add/remove skills with tag-style UI
- **Resume Upload/Download** — Upload PDF resume, download anytime
- **Application Tracker Summary** — See total, weekly, and monthly application counts right on your profile

### 📋 Applications
- **Apply Modal** — Apply to jobs with cover letter pre-filled from your profile
- **Application Tracker** — View all submitted applications with status badges (Applied, Under Review, Interview, Offered, Rejected)
- **Status Filtering** — Filter applications by current status

### 🏢 Recruiters
- **Add Vacancy** — Create and publish new job listings
- **Recruiter Dashboard** — Manage your postings

### 🔔 Notifications
- **Notification Bell** — In-navbar bell icon with unread indicator
- **Toast Notifications** — Global toast system for success/error feedback

### 🎨 Design & UX
- **Dark / Light Mode** — Full theme toggle persisted across sessions
- **Deep Violet Theme** — Custom Tailwind color scale (`#6d28d9` primary, `#5b21b6` dark)
- **Active Nav Highlighting** — Current page's nav link turns purple (smooth color transition, no underline)
- **Responsive** — Works on mobile, tablet, and desktop
- **Glassmorphism Navbar** — Frosted-glass effect on scroll
- **Scroll To Top** — Floating button appears after scrolling down
- **Compare Jobs** — Side-by-side comparison of up to 2 jobs
- **Share Modal** — Copy job link to clipboard
- **Save Jobs** — Bookmark jobs to a personal saved list

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Framer Motion** | Animations (scroll-to-top button) |
| **React Router v6** | Client-side routing |
| **Lucide React** | Icon library |

### Backend *(planned / partially implemented)*
| Tool | Purpose |
|------|---------|
| **Java Spring Boot 3** | REST API |
| **Spring Security + JWT** | Authentication |
| **Spring Data JPA** | ORM |
| **PostgreSQL** | Database |
| **Maven** | Build tool |

### DevOps
- **CI/CD & Deployment (GitHub Actions)** — Performs automated frontend build verification on every push and pull request to the `main` branch, and automatically deploys the frontend to Vercel upon pushes to `main`.
- **Deployment (Vercel)** — Hosted on Vercel, deployed automatically via the GitHub Actions CI/CD pipeline.
- **Deployment (Render)** — Backend hosting (planned).

---

## 📁 Folder Structure

```
JobBoard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplyModal.jsx        # Job application modal with cover letter
│   │   │   ├── FilterPanel.jsx       # Sidebar filter panel
│   │   │   ├── JobCard.jsx           # Individual job card
│   │   │   ├── LocationSelector.jsx  # Custom accessible location dropdown
│   │   │   ├── LoginToast.jsx        # Login success notification
│   │   │   ├── Navbar.jsx            # Responsive navbar with active route highlighting
│   │   │   ├── NotificationBell.jsx  # Notification bell with unread dot
│   │   │   ├── ScrollToTop.jsx       # Floating scroll-to-top button
│   │   │   ├── ShareModal.jsx        # Job share / copy-link modal
│   │   │   └── ToastContainer.jsx    # Global toast notification renderer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User auth, profile, applications state
│   │   │   ├── CompareContext.jsx    # Job comparison state
│   │   │   ├── ThemeContext.jsx      # Dark/light mode state
│   │   │   └── ToastContext.jsx      # Global toast notification context
│   │   ├── data/
│   │   │   ├── jobs.js               # Static job listings
│   │   │   ├── locations.js          # Indian city/state list
│   │   │   └── vacancies.js          # Recruiter-posted vacancies
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AddVacancy.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── CompareJobs.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Jobs.jsx              # Browse jobs with instant filtering
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx           # Profile with cover letter & skills
│   │   │   ├── Register.jsx
│   │   │   └── SavedJobs.jsx
│   │   ├── App.jsx                   # Routes definition
│   │   ├── index.css                 # Tailwind + custom design tokens
│   │   └── main.jsx                  # App entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                          # Spring Boot API (see backend README)
├── .github/                          # GitHub Actions workflows
└── README.md
```

---

## 🎨 Design System

Custom Tailwind CSS color tokens defined in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `primary-500` | `#7c3aed` | Main purple — links, icons |
| `primary-600` | `#6d28d9` | Active states, buttons |
| `primary-700` | `#5b21b6` | Button dark end, gradients |
| `primary-800` | `#4c1d95` | Hover darken |

Button gradient: `linear-gradient(135deg, #7c3aed → #5b21b6)`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

### Build for Production

```bash
cd frontend
npm run build
```

---

## 🔑 Authentication

Currently uses **localStorage-based mock auth** (no backend required for frontend dev):
- Register as **Job Seeker** or **Recruiter**
- Profile, skills, resume, cover letter, and applications are persisted in localStorage
- Role-based UI: Recruiters see "Add Vacancy"; Job Seekers see "Saved Jobs" and "Applications"

---

## 📝 Recent Changes (v2.0)

### Bug Fixes
- ✅ **Fixed black screen / lag on Browse Jobs** — Removed artificial 500ms loading delay; jobs now render instantly from local data
- ✅ **Fixed search bar responsive layout** — Mobile, tablet, and desktop layouts all work correctly

### New Features
- ✅ **Cover Letter field** in Profile (edit + view modes, pre-fills on job applications)
- ✅ **Active nav link highlighting** — Current page link turns purple with smooth color transition
- ✅ **Location dropdown** — Custom accessible dropdown with keyboard support
- ✅ **Apply Modal** — Full apply flow with cover letter support
- ✅ **Toast notifications** — Global feedback for apply, save, and error actions
- ✅ **Scroll To Top button** — Appears after scrolling, smooth scroll back to top
- ✅ **Recently Viewed jobs** — Sidebar widget in Browse Jobs
- ✅ **Recent Searches history** — Quick-access pills for past searches
- ✅ **Compare Jobs** — Side-by-side job comparison page
- ✅ **Share Modal** — Copy job URL to clipboard

### Theme Updates
- ✅ **Darker purple palette** — Shifted all UI purples from light lavender to deep violet for a more professional look
- ✅ **Dark mode** — Full dark mode support with distinct palette

---

## 🤖 AI Tools Used

Built with AI-assisted development using **Antigravity AI** by Google DeepMind.

---

## 📄 License

MIT
