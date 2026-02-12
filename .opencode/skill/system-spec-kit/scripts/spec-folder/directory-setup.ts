// ---------------------------------------------------------------
// MODULE: Directory Setup
// Creates and configures spec folder directory structure with memory subdirectories
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal modules
import { structuredLog, sanitizePath } from '../utils';
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';

/* -----------------------------------------------------------------
   1. DIRECTORY SETUP
------------------------------------------------------------------*/

async function setupContextDirectory(specFolder: string): Promise<string> {
  let sanitizedPath: string;
  try {
    sanitizedPath = sanitizePath(specFolder, [
      CONFIG.PROJECT_ROOT,
      path.join(CONFIG.PROJECT_ROOT, 'specs')
    ]);
  } catch (sanitizeError: unknown) {
    const errMsg = sanitizeError instanceof Error ? sanitizeError.message : String(sanitizeError);
    structuredLog('error', 'Invalid spec folder path', {
      specFolder,
      error: errMsg
    });
    throw new Error(`Invalid spec folder path: ${errMsg}`);
  }

  try {
    const stats = await fs.stat(sanitizedPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path exists but is not a directory: ${sanitizedPath}`);
    }
  } catch (err: unknown) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === 'ENOENT') {
      const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
      let availableFolders: string[] = [];
      try {
        const entries = await fs.readdir(specsDir, { withFileTypes: true });
        availableFolders = entries
          .filter((e) => e.isDirectory())
          .map((e) => e.name)
          .slice(0, 10);
      } catch {
        // specs/ doesn't exist or can't be read
      }

      let errorMsg = `Spec folder does not exist: ${sanitizedPath}`;
      errorMsg += '\nPlease create the spec folder first or check the path.';
      errorMsg += `\nSearched in: ${getSpecsDirectories().join(', ')}`;
      if (availableFolders.length > 0) {
        const activeDirName = path.basename(specsDir);
        errorMsg += `\n\nAvailable spec folders (in ${activeDirName}/):`;
        availableFolders.forEach((f) => errorMsg += `\n  - ${activeDirName}/${f}`);
      }
      structuredLog('error', 'Spec folder not found', {
        specFolder: sanitizedPath,
        availableFolders
      });
      throw new Error(errorMsg);
    }
    throw err;
  }

  const contextDir: string = path.join(sanitizedPath, 'memory');

  try {
    await fs.mkdir(contextDir, { recursive: true });
  } catch (mkdirError: unknown) {
    const nodeErr = mkdirError as NodeJS.ErrnoException;
    structuredLog('error', 'Failed to create memory directory', {
      contextDir,
      error: nodeErr.message,
      code: nodeErr.code
    });

    let errorMsg = `Failed to create memory directory: ${contextDir}`;
    if (nodeErr.code === 'EACCES') {
      errorMsg += ' (Permission denied. Check directory permissions.)';
    } else if (nodeErr.code === 'ENOSPC') {
      errorMsg += ' (No space left on device.)';
    }
    throw new Error(errorMsg);
  }

  return contextDir;
}

/* -----------------------------------------------------------------
   2. EXPORTS
------------------------------------------------------------------*/

export {
  setupContextDirectory,
};
