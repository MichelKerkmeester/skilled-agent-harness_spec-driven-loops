// ---------------------------------------------------------------
// MODULE: Path Utils
// Secure path sanitization and resolution with traversal protection (CWE-22)
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------

// Node stdlib
import path from 'path';

// Internal modules
import { structuredLog } from './logger';

// ---------------------------------------------------------------
// 2. PATH SANITIZATION
// ---------------------------------------------------------------

function sanitizePath(inputPath: string, allowedBases: string[] | null = null): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path: path must be a non-empty string');
  }

  const normalized: string = path.normalize(inputPath);

  // CWE-22: Check for null bytes
  if (normalized.includes('\0')) {
    structuredLog('warn', 'Path contains null bytes', { inputPath });
    throw new Error(`Invalid path: contains null bytes: ${inputPath}`);
  }

  const resolved: string = path.resolve(inputPath);

  const bases: string[] = allowedBases || [
    process.cwd(),
    path.join(process.cwd(), 'specs'),
    path.join(process.cwd(), '.opencode')
  ];

  const isAllowed: boolean = bases.some((base: string) => {
    const normalizedBase: string = path.normalize(base);
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

// ---------------------------------------------------------------
// 3. UTILITIES
// ---------------------------------------------------------------

function getPathBasename(p: string): string {
  if (!p || typeof p !== 'string') return '';
  return p.replace(/\\/g, '/').split('/').pop() || '';
}

// ---------------------------------------------------------------
// 4. EXPORTS
// ---------------------------------------------------------------

export {
  sanitizePath,
  getPathBasename,
};
