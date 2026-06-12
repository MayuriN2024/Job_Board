# JobBoard

JobBoard is a modern, production-level career platform designed for Job Seekers and Recruiters. It features AI-inspired job matching, application tracking, and comprehensive recruiter management.

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router

### Backend
- **Framework**: Java Spring Boot 3
- **Security**: JWT Authentication, Spring Security
- **Data**: Spring Data JPA, PostgreSQL
- **Build**: Maven

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Render (Backend)

## Folder Structure

```
CareerOrbit-AI/
├── frontend/          # React frontend
├── backend/           # Spring Boot backend
├── .github/           # GitHub Actions workflows
└── .env.example      # Environment variables
```

## Setup Instructions

### Backend
1. Ensure PostgreSQL is running.
2. Update `application.properties` or set environment variables.
3. Run `./mvnw spring-boot:run`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## AI Tools Used
This project was built with AI-assisted development using **Antigravity AI** by Google Deepmind.

## License
MIT
