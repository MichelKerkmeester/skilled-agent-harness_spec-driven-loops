// ───────────────────────────────────────────────────────────────
// UTILS: PATH UTILITIES
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const path = require('path');
const { structuredLog } = require('./logger');

/* ─────────────────────────────────────────────────────────────
   2. PATH SANITIZATION
──────────────────────────────────────────────────────────────── */

function sanitizePath(inputPath, allowedBases = null) {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path: path must be a non-empty string');
  }
  
  const normalized = path.normalize(inputPath);
  
  // CWE-22: Check for null bytes
  if (normalized.includes('\0')) {
    structuredLog('warn', 'Path contains null bytes', { inputPath });
    throw new Error(`Invalid path: contains null bytes: ${inputPath}`);
  }
  
  const resolved = path.resolve(inputPath);
  
  const bases = allowedBases || [
    process.cwd(),
    path.join(process.cwd(), 'specs'),
    path.join(process.cwd(), '.opencode')
  ];
  
  const isAllowed = bases.some(base => {
    const normalizedBase = path.normalize(base);
    return resolved.startsWith(normalizedBase + path.sep) || resolved === normalizedBase;
  });
  
  if (!isAllowed) {
    structuredLog('warn', 'Path outside allowed directories', { 
      inputPath, 
      resolved, 
      allowedBases: bases 
    });
    throw new Error(`Path outside allowed directories: ${inputPath}`);
  }
  
  return resolved;
}

/* ─────────────────────────────────────────────────────────────
   3. UTILITIES
──────────────────────────────────────────────────────────────── */

function getPathBasename(p) {
  if (!p || typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').split('/').pop() || '';
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  sanitizePath,
  getPathBasename,
};
