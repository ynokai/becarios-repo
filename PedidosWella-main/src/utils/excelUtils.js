const ExcelJS = require('exceljs');

exports.loadWorkbook = async path => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  return workbook;
};

exports.saveWorkbook = async (workbook, path) => {
  await workbook.xlsx.writeFile(path);
};