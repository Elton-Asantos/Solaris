module.exports = async (req, res) => {
  const { data, format, filename } = req.body;

  if (!data || !format || !filename) {
    return res.status(400).json({ error: 'Missing data, format, or filename' });
  }

  let fileContent;
  let contentType;

  if (format === 'csv') {
    // Conversão básica para CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    fileContent = `${headers}\n${rows}`;
    contentType = 'text/csv';
  } else if (format === 'json') {
    fileContent = JSON.stringify(data, null, 2);
    contentType = 'application/json';
  } else {
    return res.status(400).json({ error: 'Unsupported format' });
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(fileContent);
};