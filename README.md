# AI Developer Portfolio Generator

A full-stack web app that collects developer details and uses the Groq API (free-tier friendly defaults) to generate a complete, editable portfolio project.

## Features

- Detailed user input form (profile, skills, projects, experience, education, contact, theme).
- Groq-powered dynamic code generation for:
  - `frontend/` (HTML/CSS/JS or React requested in prompt)
  - `backend/` (Node.js + Express)
- In-browser preview of generated portfolio.
- One-click ZIP download of a structured project with separated frontend/backend folders.
- Input validation and centralized error handling.
- README + env instructions included in generated output prompt requirements.
- Responsive UI and SEO-focused generated prompt constraints.

## Tech Stack

- Frontend: Vanilla HTML/CSS/JavaScript
- Backend: Node.js, Express
- Integrations: Groq Chat Completions API
- Packaging: Archiver (ZIP)

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure environment variables:

```bash
cp backend/.env.example backend/.env
```

Set `GROQ_API_KEY` in `backend/.env`.

3. Start the app:

```bash
npm start
```

4. Open:

- `http://localhost:4000`

## API Endpoints

- `GET /api/health` – health check
- `POST /api/generate` – generate portfolio project from form payload
- `GET /api/generate/:id/download` – download generated project ZIP

## Free-tier Optimization Notes

- Uses low temperature and constrained max token settings.
- Prompts Groq to return concise JSON-only output.
- Stores generated content in memory for immediate download flow.

## Deployment Tips

### Vercel

- Deploy as a Node.js server project.
- Set `GROQ_API_KEY` and optional `GROQ_MODEL` in Vercel environment variables.

### Render

- Create a Web Service.
- Build command: `npm run install:all`
- Start command: `npm start`
- Add environment variables from `.env.example`.

