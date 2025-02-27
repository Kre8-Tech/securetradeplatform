const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

function generateCsv(reports) {
    const parser = new Parser({ fields: ['id', 'title', 'content', 'date'] });
    return parser.parse(reports);
}

async function generatePdf(reports) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        reports.forEach(report => {
            doc.fontSize(16).text(`Title: ${report.title}`);
            doc.fontSize(12).text(`Content: ${report.content}`);
            doc.fontSize(10).text(`Date: ${report.date}`);
            doc.moveDown();
        });

        doc.end();
    });
}

module.exports = { generateCsv, generatePdf };
