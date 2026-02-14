require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const generateRouter = require('./routes/generate');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_PATH = path.resolve(__dirname, '../../frontend');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(FRONTEND_PATH));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/generate', generateRouter);

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Unexpected server error.';
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
