const xlsx = require('xlsx');

// Export any array of objects to Excel and return buffer
const exportToExcel = (data, sheetName = 'Report') => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Return buffer
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

module.exports = { exportToExcel };
