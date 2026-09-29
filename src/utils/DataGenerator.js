const fs = require('fs');
const path = require('path');

function loadTestData(fileName = 'employees.json') {
  const filePath = path.join(__dirname, '../../test-data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function getUniqueEmployeeId() {
  return `EMP${Date.now().toString().slice(-6)}`;
}

module.exports = { loadTestData, getUniqueEmployeeId };
