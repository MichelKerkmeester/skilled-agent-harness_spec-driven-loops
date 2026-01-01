// ───────────────────────────────────────────────────────────────
// SHARED: UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ───────────────────────────────────────────────────────────────
   1. PATH VALIDATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * Uses path.relative() containment check instead of startsWith() to prevent path confusion attacks.
 */
function validate_file_path(file_path, allowed_base_paths) {
  if (!file_path || typeof file_path !== 'string') {
    return null;
  }

  if (!Array.isArray(allowed_base_paths) || allowed_base_paths.length === 0) {
    console.warn('[utils] validate_file_path called with empty allowed_base_paths');
    return null;
  }

  try {
    const resolved = path.resolve(file_path);

    // Security: path.relative() containment check (CWE-22)
    const is_allowed = allowed_base_paths.some(base_path => {
      try {
        const normalized_base = path.resolve(base_path);
        const relative = path.relative(normalized_base, resolved);
        return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
      } catch {
        return false;
      }
    });

    if (!is_allowed) {
      console.warn(`[utils] Path traversal blocked: ${file_path} -> ${resolved}`);
      return null;
    }

    // Reject null bytes in path
    if (file_path.includes('\0')) {
      console.warn(`[utils] Null byte in path blocked: ${file_path}`);
      return null;
    }

    return resolved;
  } catch (err) {
    console.warn(`[utils] Path validation error: ${err.message}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   2. REGEX UTILITIES
   ─────────────────────────────────────────────────────────────── */

/** Escape special regex characters in a string */
function escape_regex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  validate_file_path,
  escape_regex,
};
