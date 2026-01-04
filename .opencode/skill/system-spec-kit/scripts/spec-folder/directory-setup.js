/* ─────────────────────────────────────────────────────────────────
   SPEC-FOLDER: DIRECTORY SETUP
──────────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const fs = require('fs/promises');
const path = require('path');
const { structuredLog, sanitizePath } = require('../utils');
const { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs, getSpecsDirectories } = require('../core');

/* ─────────────────────────────────────────────────────────────────
   2. DIRECTORY SETUP
──────────────────────────────────────────────────────────────────── */

async function setupContextDirectory(specFolder) {
  let sanitizedPath;
  try {
    sanitizedPath = sanitizePath(specFolder, [
      CONFIG.PROJECT_ROOT,
      path.join(CONFIG.PROJECT_ROOT, 'specs')
    ]);
  } catch (sanitizeError) {
    structuredLog('error', 'Invalid spec folder path', {
      specFolder,
      error: sanitizeError.message
    });
    throw new Error(`Invalid spec folder path: ${sanitizeError.message}`);
  }
  
  try {
    const stats = await fs.stat(sanitizedPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${sanitizedPath}`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
      let availableFolders = [];
      try {
        const entries = await fs.readdir(specsDir, { withFileTypes: true });
        availableFolders = entries
          .filter(e => e.isDirectory())
          .map(e => e.name)
          .slice(0, 10);
      } catch {
        // specs/ doesn't exist or can't be read
      }
      
      const existingDirs = getAllExistingSpecsDirs();
      let errorMsg = `Spec folder does not exist: ${sanitizedPath}`;
      errorMsg += '\nPlease create the spec folder first or check the path.';
      errorMsg += `\nSearched in: ${getSpecsDirectories().join(', ')}`;
      if (availableFolders.length > 0) {
        const activeDirName = path.basename(specsDir);
        errorMsg += `\n\nAvailable spec folders (in ${activeDirName}/):`;
        availableFolders.forEach(f => errorMsg += `\n  - ${activeDirName}/${f}`);
      }
      structuredLog('error', 'Spec folder not found', {
        specFolder: sanitizedPath,
        availableFolders
      });
      throw new Error(errorMsg);
    }
    throw err;
  }

  const contextDir = path.join(sanitizedPath, 'memory');

  try {
    await fs.mkdir(contextDir, { recursive: true });
  } catch (mkdirError) {
    structuredLog('error', 'Failed to create memory directory', {
      contextDir,
      error: mkdirError.message,
      code: mkdirError.code
    });
    
    let errorMsg = `Failed to create memory directory: ${contextDir}`;
    if (mkdirError.code === 'EACCES') {
      errorMsg += ' (Permission denied. Check directory permissions.)';
    } else if (mkdirError.code === 'ENOSPC') {
      errorMsg += ' (No space left on device.)';
    }
    throw new Error(errorMsg);
  }

  return contextDir;
}

/* ─────────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  setupContextDirectory
};
