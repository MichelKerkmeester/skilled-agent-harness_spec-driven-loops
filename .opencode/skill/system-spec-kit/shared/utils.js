/**
 * Shared Utility Functions
 *
 * Common utilities shared across the system-spec-kit codebase.
 * Centralizes functions to avoid duplication and ensure consistency.
 *
 * @module shared/utils
 * @version 1.0.0
 */

'use strict';

const path = require('path');

// ───────────────────────────────────────────────────────────────
// PATH VALIDATION (CWE-22: Path Traversal mitigation)
// ───────────────────────────────────────────────────────────────

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 *
 * Prevents directory traversal attacks by ensuring resolved paths
 * stay within allowed base directories. Uses path.relative() containment
 * check instead of startsWith() to prevent path confusion attacks.
 *
 * @param {string} filePath - Path to validate
 * @param {string[]} allowedBasePaths - Array of allowed base directories
 * @returns {string|null} Validated absolute path or null if invalid
 */
function validateFilePath(filePath, allowedBasePaths) {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  if (!Array.isArray(allowedBasePaths) || allowedBasePaths.length === 0) {
    console.warn('[utils] validateFilePath called with empty allowedBasePaths');
    return null;
  }

  try {
    // Resolve to absolute path (handles .., symlinks, etc.)
    const resolved = path.resolve(filePath);

    // Security: Use path.relative() containment check instead of startsWith()
    // This prevents path confusion attacks (CWE-22)
    const isAllowed = allowedBasePaths.some(basePath => {
      try {
        const normalizedBase = path.resolve(basePath);
        const relative = path.relative(normalizedBase, resolved);
        // Secure: relative path must not start with '..' and must not be absolute
        return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      console.warn(`[utils] Path traversal blocked: ${filePath} -> ${resolved}`);
      return null;
    }

    // Additional check: reject paths with suspicious patterns
    if (filePath.includes('\0')) {
      console.warn(`[utils] Null byte in path blocked: ${filePath}`);
      return null;
    }

    return resolved;
  } catch (err) {
    console.warn(`[utils] Path validation error: ${err.message}`);
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// REGEX UTILITIES
// ───────────────────────────────────────────────────────────────

/**
 * Escape special regex characters in a string
 *
 * Makes a string safe for use in RegExp by escaping all special
 * characters that have meaning in regular expressions.
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for use in RegExp
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  validateFilePath,
  escapeRegex
};
