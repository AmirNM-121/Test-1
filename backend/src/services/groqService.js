const axios = require('axios');

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

function buildPrompt(input) {
  return `You are an expert full-stack engineer. Generate production-ready, editable code for a developer portfolio project.

Requirements:
- Output valid JSON only.
- Keep output concise to fit free-tier usage.
- Create separated folders: frontend and backend.
- frontend should be responsive and SEO-friendly.
- backend should be Node.js + Express, with basic API route and env handling.
- Include README with run instructions and optional Vercel/Render deployment note.
- Apply design style: ${input.designStyle}.
- Preferred frontend framework: ${input.framework}.

User profile data:
${JSON.stringify(input, null, 2)}

Output JSON schema:
{
  "files": [
    { "path": "frontend/index.html", "content": "..." },
    { "path": "frontend/styles.css", "content": "..." },
    { "path": "frontend/script.js", "content": "..." },
    { "path": "backend/package.json", "content": "..." },
    { "path": "backend/server.js", "content": "..." },
    { "path": "backend/.env.example", "content": "..." },
    { "path": "README.md", "content": "..." }
  ]
}

Rules:
- Escape newlines properly.
- No markdown fences.
- Ensure all file contents are complete.
- Keep CSS and JS in separate files.
- Include at least one API endpoint in backend/server.js.
`;
}

async function generateProjectWithGroq(input) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is missing.');
    error.statusCode = 500;
    throw error;
  }

  const response = await axios.post(
    GROQ_ENDPOINT,
    {
      model: DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 3800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return only valid JSON.' },
        { role: 'user', content: buildPrompt(input) }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;

  if (!content) {
    const error = new Error('Groq returned an empty response.');
    error.statusCode = 502;
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const error = new Error('Failed to parse Groq response JSON.');
    error.statusCode = 502;
    throw error;
  }

  if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
    const error = new Error('Groq response missing files array.');
    error.statusCode = 502;
    throw error;
  }

  return parsed;
}

module.exports = {
  generateProjectWithGroq
};
