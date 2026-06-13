# JobBoard - Application Feature & Architecture Documentation

Welcome to the comprehensive feature and architectural documentation for **JobBoard**. 
This document details every feature of the application, how it is implemented under the hood, and how the underlying state transitions occur using client-side React contexts and local storage persistence.

---

## 1. High-Level Architecture Overview

JobBoard is built as a fully client-side single-page application (SPA) powered by **React** (built with Vite) and styled using **Tailwind CSS v4** with a custom CSS variables design system in `index.css`. 

To ensure a seamless user experience without requiring a complex backend setup, the application leverages React's **Context API** for state management and utilizes the browser's `localStorage` for data persistence. This makes the application fully functional, state-preserving, and fast.

### Core Architecture Components:
1. **Providers/Contexts**: Wrap the React tree in `main.jsx` to share global state:
   - `AuthContext`: Manages users, logged-in sessions, recruiters vs. seekers, profile details, and job application states.
   - `ThemeContext`: Handles light/dark themes globally.
   - `NotificationContext`: Coordinates real-time alerts and keeps a history of events (e.g., job postings, status updates).
   - `CompareContext`: Controls the selection and limits of the job comparison panel.
   - `SavedJobsContext`: Controls bookmarking of roles.
2. **Global Styles & CSS Variables**: Theme colors are defined as CSS variables inside `index.css` and are applied dynamically to pages.
3. **Mock Database**: Pre-populated lists of vacancies, locations, and users reside in local JS files (`src/data/jobs.js`, `src/data/locations.js`) but get loaded into/managed via local storage when interactive additions are performed.

---

## 2. Comprehensive Feature Breakdown & Workflows

### Feature A: Global Dark and Light Mode Theme System
* **User Experience**: Toggling the theme changes colors instantly across the home page, about page, login/signup forms, job listings, application dashboards, and navigation bars. The theme choice is saved and persists across reloads and page transitions on both desktop and mobile layouts.
* **Under the Hood**:
  1. The `ThemeProvider` (defined in `src/context/ThemeContext.jsx`) initializes the state `isDark` by reading from `localStorage` (`jobboard_theme`).
  2. Inside a React `useEffect`, the provider listens to `isDark` changes and adds or removes the `dark` class from the `document.documentElement` (`<html>` element).
  3. All components read colors from custom CSS variables (e.g., `var(--bg-page)`, `var(--bg-card)`, `var(--text-primary)`, `var(--border-color)`) defined under `:root` and `html.dark` in `index.css`.
  4. Changes in navbar toggles instantly update the variable mappings, changing the styling dynamically across all sections.

---

### Feature B: User Authentication and Role-Based Portals
* **User Experience**: Users register as a **Job Seeker** or **Recruiter**. Depending on their role:
  - **Job Seekers** see buttons to *Apply*, *Save Jobs*, *Compare Jobs*, and track their job application history.
  - **Recruiters** gain access to an *Add Vacancy* dashboard, letting them post new jobs and manage job postings.
* **Under the Hood**:
  - **Data Key**: `jobboard_users` stores an array of all registered accounts. `jobboard_current_user` stores the active user session token/object.
  - **Registration (`Register.jsx`)**: Collects Name, Email, Password, Location, and Role, validates that the email is unique, saves the record to the user array, and auto-authenticates the user.
  - **Session Management (`AuthContext.jsx`)**: Exposes `login`, `register`, and `logout` functions. If "Remember My Email" is checked on the `Login.jsx` form, the email is persisted under `jobboard_remember_email` key for future convenience.

---

### Feature C: Profile Management (Profile Pic, Resume, and Skills)
* **User Experience**: Users customize their profile via the `/profile` section. Job seekers can upload an avatar image, attach a PDF/text resume file, and add/remove skills dynamically via an interactive tag selector.
* **Under the Hood**:
  - **Avatar & Resume Persistence**: Standard HTML file inputs trigger file reads. Since there is no backend server, the application uses the browser's `FileReader` API to convert images and resumes into **Base64 Data URLs**. This allows saving media assets directly in the user record in `localStorage`.
  - **Skills Interactive Tagging**: Users type or select skill tags. The interface maps them as active pills. Clicking a pill removes it. Clicking "Save Changes" updates the `jobboard_current_user` and pushes it to the `jobboard_users` list.

---

### Feature D: Advanced Job Searching & Custom Filters
* **User Experience**: The main jobs page (`/jobs`) has a rich filtering panel. Seekers filter jobs by title/keyword, location, department category (Engineering, Design, Marketing, Sales, Product, Finance), job type (Full-time, Part-time, Contract, Remote), and a range slider for salary. On mobile, filters are tucked in a slide-out overlay drawer.
* **Under the Hood**:
  - Filter state is managed in `Jobs.jsx`. Whenever filters change, a React filter function parses the active list of jobs:
    ```javascript
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    const matchesSalary = job.salaryMax >= salaryRange[0] && job.salaryMin <= salaryRange[1];
    ```
  - Resulting matches are passed to individual `JobCard.jsx` lists.

---

### Feature E: Multi-Job Comparison Tool (Compare Jobs)
* **User Experience**: Users can check checkboxes or click a "Compare" button on up to 3 separate job cards. A floating comparative drawer appears at the bottom. Clicking "Compare Now" navigates to `/compare` and presents a detailed side-by-side table highlighting salaries, locations, work types, categories, required skills, and descriptions.
* **Under the Hood**:
  - Managed by `CompareContext.jsx` with active items in the state array `compareList`.
  - Functions `addToCompare`, `removeFromCompare`, and `clearCompare` manage item limits (throwing alerts if a user tries to exceed 3 jobs).
  - The comparison page `CompareJobs.jsx` maps comparison criteria rows (e.g. Salary, Location, Skills) and maps the list of compared jobs as columns.

---

### Feature F: Application Tracker
* **User Experience**: When seekers click "Apply Now" on a job card, the status updates immediately. The `/applications` page features a recruiter/candidate progress tracker. It displays:
  - Metric cards showing applications total, active, under review, and offered.
  - A table of applied jobs showing title, company, date, and a styled status badge.
  - Detailed applicant status logs.
* **Under the Hood**:
  - `AuthContext.jsx` maintains an `applications` array within the user object (e.g. `{ jobId, appliedAt, status: 'applied' }`).
  - Status values can progress through `'applied'`, `'review'`, `'interview'`, `'offered'`, or `'rejected'`.
  - A helper function `getApplicationCount()` in the auth hook provides real-time counts for indicators in the Navbar header.

---

### Feature G: Real-time Interactive Notification System
* **User Experience**: Important events trigger visual toasts at the top of the screen.
  - When recruiters add a new job vacancy, seekers receive a notification about the new role.
  - When application status is changed, seekers receive a status update notice.
  - A notification bell in the Navbar lists all historical notifications, marking them read or unread.
* **Under the Hood**:
  - Controlled by `NotificationContext.jsx`. The context stores `notifications` history in `localStorage` (`jobboard_notifications`) and provides an `addNotification` method.
  - Interactive toast triggers render through a portal in `App.jsx` with entrance animations (`toast-enter` and `toast-exit` keyframes in `index.css`).

---

### Feature H: Saved Jobs (Bookmarks)
* **User Experience**: Seekers click a bookmark icon on a job card to toggle saving it. Saved jobs are displayed on the `/saved-jobs` page, allowing candidates to review and apply later.
* **Under the Hood**:
  - Managed by `SavedJobsContext.jsx`. It listens to the current user's session and links bookmarks specifically to their account ID.
  - Provides a toggle helper `toggleSavedJob(jobId)` that updates state and storage (`jobboard_saved_jobs`).

---

## 3. User Flows and Trigger Operations

### 1. Job Seeker Search and Apply Flow
- Users search/filter on **Browse Jobs**.
- Click **Apply Now** on a job card.
- User is verified (needs to be logged in).
- Application is saved to `localStorage` under `jobboard_current_user` and `jobboard_users`.
- Real-time toast alert is shown.
- Application status count in Navbar header updates.
- Seeker details applications in the **Applications Tracker** dashboard.

### 2. Recruiter Add Job Flow
- Recruiter logs in.
- Navigates to **Add Vacancy** from Navbar.
- Enters job details (Title, Location, Category, Type, Salary, Skills, Description).
- Submits form.
- Vacancy is added to list.
- System automatically fires a notifications event to notify active seekers.
- Recruiter is redirected to Jobs screen.

---

## 4. Troubleshooting and Customization

* **Theme Not Applying**: Make sure that the browser has Javascript enabled. CSS styling relies on the `dark` class residing on the `<html>` root, changing styling values dynamically.
* **Storage Reset**: To clear mock data or refresh authentication records, open the browser developer tools (F12) -> Application -> Local Storage -> Click "Clear All" and refresh the page.

---

## 5. CI/CD & Deployment Workflow

JobBoard uses a streamlined continuous integration and continuous deployment strategy:

### Continuous Integration (CI) - GitHub Actions
The workflow defined in `.github/workflows/deploy.yml` acts as the code-quality gatekeeper:
* **Trigger Conditions**: Triggers on every push or pull request to the `main` branch.
* **Process**: Spins up a clean Linux runner (`ubuntu-latest`), sets up Node.js 20, installs all dependencies (`npm install --legacy-peer-deps`), and verifies that the React app compiles cleanly (`npm run build`).
* **Goal**: Guarantees that no broken/uncompilable code gets merged into the repository.

### Continuous Deployment (CD) - Vercel Native Integration
Deployment is decoupled from GitHub Actions to leverage Vercel's optimized deployment engine:
* **Automatic Builds**: The project is directly linked to Vercel via the official Vercel-GitHub integration.
* **Execution**: Upon a push to the `main` branch, Vercel automatically detects the change, runs the production build, and deploys it to the live domain.
* **Status Updates**: Vercel reports the deployment status check directly back to GitHub commits, showing a green checkmark upon completion.

