const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { parsePortfolioInput } = require('../utils/validators');
const { generateProjectWithGroq } = require('../services/groqService');
const { normalizeGeneratedFiles, buildPreview } = require('../services/projectBuilder');
const { streamZip } = require('../utils/zipBuilder');

const router = express.Router();
const generationStore = new Map();

router.post('/', async (req, res, next) => {
  try {
    const input = parsePortfolioInput(req.body);
    const generated = await generateProjectWithGroq(input);
    const files = normalizeGeneratedFiles(generated.files);
    const id = uuidv4();

    generationStore.set(id, {
      name: `${input.name}-portfolio`,
      files,
      createdAt: Date.now()
    });

    res.status(200).json({
      generationId: id,
      previewHtml: buildPreview(files),
      files: files.map((file) => ({ path: file.path }))
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/download', (req, res, next) => {
  try {
    const record = generationStore.get(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Generation not found or expired.' });
    }

    streamZip(res, record.files, record.name);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
