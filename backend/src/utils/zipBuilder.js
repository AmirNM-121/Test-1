const archiver = require('archiver');

function streamZip(res, files, projectName) {
  const safeName = (projectName || 'portfolio-project').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${safeName}.zip`);

  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(res);

  files.forEach((file) => {
    archive.append(file.content, { name: `${safeName}/${file.path}` });
  });

  archive.finalize();
}

module.exports = {
  streamZip
};
