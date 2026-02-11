// ---------------------------------------------------------------
// MODULE: Path Security
// Canonical location (moved from mcp_server/lib/utils/path-security.js)
// ---------------------------------------------------------------

import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------
// 1. PATH VALIDATION
// ---------------------------------------------------------------

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * Uses path.relative() containment check instead of startsWith() to prevent path confusion attacks.
 */
export function validateFilePath(filePath: string, allowedBasePaths: string[]): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  if (!Array.isArray(allowedBasePaths) || allowedBasePaths.length === 0) {
    console.warn('[utils] validate_file_path called with empty allowed_base_paths');
    return null;
  }

  try {
    // Security: Reject null bytes BEFORE path.resolve() to prevent path truncation (CWE-78)
    if (filePath.includes('\0')) {
      console.warn(`[utils] Null byte in path blocked: ${filePath}`);
      return null;
    }

    const resolved = path.resolve(filePath);

    // P1-07 FIX: Resolve symlinks to prevent traversal bypass (CWE-59)
    let realResolved: string;
    try {
      realResolved = fs.realpathSync(resolved);
    } catch {
      // File may not exist yet — resolve parent directory instead
      try {
        const parentReal = fs.realpathSync(path.dirname(resolved));
        realResolved = path.join(parentReal, path.basename(resolved));
      } catch {
        // Parent doesn't exist either — use the path.resolve() result
        realResolved = resolved;
      }
    }

    // Security: path.relative() containment check (CWE-22)
    const isAllowed = allowedBasePaths.some((basePath: string) => {
      try {
        const normalizedBase = path.resolve(basePath);
        // Also resolve symlinks on the base path for consistent comparison
        let realBase: string;
        try {
          realBase = fs.realpathSync(normalizedBase);
        } catch {
          realBase = normalizedBase;
        }
        const relative = path.relative(realBase, realResolved);
        return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      console.warn(`[utils] Path traversal blocked: ${filePath} -> ${realResolved}`);
      return null;
    }

    return realResolved;
  } catch (err) {
    console.warn(`[utils] Path validation error: ${(err as Error).message}`);
    return null;
  }
}

// ---------------------------------------------------------------
// 2. REGEX UTILITIES
// ---------------------------------------------------------------

/** Escape special regex characters in a string */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
