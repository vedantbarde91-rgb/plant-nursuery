// Simple PDF generation using basic HTML string
// This is returned as HTML and printed to PDF on the frontend using window.print()
// OR use pdfkit on the server side

const generatePDFHTML = (title, headers, rows) => {
  const tableRows = rows.map(row =>
    `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`
  ).join('');

  return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #2d6a4f; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #2d6a4f; color: white; padding: 8px; text-align: left; }
        td { padding: 6px 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background: #f2f2f2; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <h2>${title}</h2>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">Forest Nursery Management System - Official Report</div>
    </body>
    </html>
  `;
};

module.exports = { generatePDFHTML };
