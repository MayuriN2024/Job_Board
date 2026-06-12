const VACANCIES_KEY = 'jobboard_vacancies';

export const loadVacancies = () => {
  try {
    const stored = localStorage.getItem(VACANCIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveVacancies = (vacancies) => {
  localStorage.setItem(VACANCIES_KEY, JSON.stringify(vacancies));
};

export const addVacancy = (vacancy, recruiterEmail) => {
  const vacancies = loadVacancies();
  const newJob = {
    ...vacancy,
    id: Date.now(),
    postedAt: 'Just now',
    postedDays: 0,
    featured: false,
    applyUrl: vacancy.applyUrl || '#',
    tags: vacancy.tags ? vacancy.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    responsibilities: vacancy.responsibilities
      ? vacancy.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
      : ['See job description for details.'],
    requirements: vacancy.requirements
      ? vacancy.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : ['See job description for details.'],
    postedBy: recruiterEmail,
  };
  saveVacancies([newJob, ...vacancies]);
  return newJob;
};

export const getAllJobs = (staticJobs) => {
  const vacancies = loadVacancies();
  return [...vacancies, ...staticJobs];
};
