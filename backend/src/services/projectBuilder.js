const path = require('path');

function sanitizePath(filePath) {
  const normalized = path.posix.normalize(filePath).replace(/^\/+/, '');
  if (normalized.includes('..')) {
    throw new Error(`Invalid path detected: ${filePath}`);
  }
  return normalized;
}

function normalizeGeneratedFiles(files) {
  return files.map((file) => ({
    path: sanitizePath(file.path),
    content: typeof file.content === 'string' ? file.content : ''
  }));
}

function buildPreview(files) {
  const byPath = new Map(files.map((file) => [file.path, file.content]));
  const htmlPath = byPath.has('frontend/index.html')
    ? 'frontend/index.html'
    : [...byPath.keys()].find((item) => item.endsWith('.html'));

  if (!htmlPath) {
    return '<h1>Preview unavailable</h1><p>No HTML file was generated.</p>';
  }

  return byPath.get(htmlPath);
}

module.exports = {
  normalizeGeneratedFiles,
  buildPreview
};
