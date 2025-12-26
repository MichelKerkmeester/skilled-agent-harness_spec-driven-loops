const fs = require('fs');
const path = require('path');

const LEVEL_REQUIREMENTS = {
  1: ['spec.md', 'plan.md', 'tasks.md'],
  2: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'],
  3: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md']
};

function detectLevel(folderPath) {
  if (fs.existsSync(path.join(folderPath, 'decision-record.md'))) return 3;
  if (fs.existsSync(path.join(folderPath, 'checklist.md'))) return 2;
  return 1;
}

function validateSpecFolder(folderPath, options = {}) {
  const issues = [];
  const level = options.level || detectLevel(folderPath);
  const required = LEVEL_REQUIREMENTS[level] || LEVEL_REQUIREMENTS[1];
  
  for (const file of required) {
    if (!fs.existsSync(path.join(folderPath, file))) {
      issues.push({
        severity: 'error',
        file,
        message: `Missing required file: ${file}`
      });
    }
  }
  
  // Check for memory folder
  const memoryPath = path.join(folderPath, 'memory');
  if (!fs.existsSync(memoryPath)) {
    issues.push({
      severity: 'warn',
      file: 'memory/',
      message: 'Memory folder not found'
    });
  }
  
  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    level,
    issues
  };
}

module.exports = { validateSpecFolder, detectLevel, LEVEL_REQUIREMENTS };
