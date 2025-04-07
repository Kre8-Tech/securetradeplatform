const PDFDocument = require('pdfkit');

const generatePdf = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    data.forEach((report) => {
      doc.text(`Title: ${report.title}`);
      doc.text(`Date: ${report.date}`);
      doc.text(`Content: ${report.content}`);
      doc.moveDown();
    });

    doc.end();
  });
};

module.exports = generatePdf;