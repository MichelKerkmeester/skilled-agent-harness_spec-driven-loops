// ───────────────────────────────────────────────────────────────
// LIB: ERRORS CORE
// Memory error class and utility functions
// Migrated from lib/errors.js for proper folder organization
// ───────────────────────────────────────────────────────────────
'use strict';

// Import recovery hints for enhanced error handling
const {
  ERROR_CODES,
  RECOVERY_HINTS,
  DEFAULT_HINT,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints
} = require('./recovery-hints.js');

/* ─────────────────────────────────────────────────────────────
   1. ERROR CODES

   Re-export from recovery-hints for backward compatibility.
   New code should use ERROR_CODES from recovery-hints.js.
────────────────────────────────────────────────────────────────*/

// Legacy ErrorCodes object for backward compatibility
const ErrorCodes = {
  EMBEDDING_FAILED: 'E001',
  EMBEDDING_DIMENSION_INVALID: 'E002',
  FILE_NOT_FOUND: 'E010',
  FILE_ACCESS_DENIED: 'E011',
  FILE_ENCODING_ERROR: 'E012',
  DB_CONNECTION_FAILED: 'E020',
  DB_QUERY_FAILED: 'E021',
  DB_TRANSACTION_FAILED: 'E022',
  INVALID_PARAMETER: 'E030',
  MISSING_REQUIRED_PARAM: 'E031',
  SEARCH_FAILED: 'E040',
  VECTOR_SEARCH_UNAVAILABLE: 'E041',
  // Query validation errors (unique codes)
  QUERY_TOO_LONG: 'E042',
  QUERY_EMPTY: 'E043',
  API_KEY_INVALID_STARTUP: 'E050',
  API_KEY_INVALID_RUNTIME: 'E051',
  LOCAL_MODEL_UNAVAILABLE: 'E052',
  RATE_LIMITED: 'E429',
};

/* ─────────────────────────────────────────────────────────────
   2. MEMORY ERROR CLASS
────────────────────────────────────────────────────────────────*/

class MemoryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'MemoryError';
  }

  toJSON() {
    return { code: this.code, message: this.message, details: this.details };
  }
}

/* ─────────────────────────────────────────────────────────────
   3. TIMEOUT WRAPPER
────────────────────────────────────────────────────────────────*/

// T121: Fixed timer leak - now properly clears timeout on success or rejection
function with_timeout(promise, ms, operation) {
  let timeout_id;

  const timeout_promise = new Promise((_, reject) => {
    timeout_id = setTimeout(() => reject(new MemoryError(
      ErrorCodes.SEARCH_FAILED,
      `${operation} timed out after ${ms}ms`,
      { timeout: ms, operation }
    )), ms);
  });

  return Promise.race([promise, timeout_promise])
    .then(result => {
      clearTimeout(timeout_id);
      return result;
    })
    .catch(error => {
      clearTimeout(timeout_id);
      throw error;
    });
}

/* ─────────────────────────────────────────────────────────────
   4. USER-FRIENDLY ERROR MESSAGES
────────────────────────────────────────────────────────────────*/

function user_friendly_error(error) {
  const internal_patterns = [
    { pattern: /SQLITE_BUSY/, message: 'Database is temporarily busy. Please retry.' },
    { pattern: /SQLITE_LOCKED/, message: 'Database is locked. Please wait and retry.' },
    { pattern: /ENOENT/, message: 'File not found.' },
    { pattern: /EACCES/, message: 'Permission denied.' },
    { pattern: /ECONNREFUSED/, message: 'Connection refused. Service may be unavailable.' },
    { pattern: /ETIMEDOUT/, message: 'Operation timed out. Please retry.' },
    { pattern: /embedding.*failed/i, message: 'Failed to generate embedding. Search may be unavailable.' },
  ];

  for (const { pattern, message } of internal_patterns) {
    if (pattern.test(error.message)) return message;
  }

  // BUG-029 FIX: Generic fallback instead of raw error
  // Log the actual error for debugging, return generic message to user
  console.error('[errors] Unmatched error:', error.message);
  return 'An unexpected error occurred. Please try again.';
}

/* ─────────────────────────────────────────────────────────────
   5. TRANSIENT ERROR DETECTION
   REQ-032: Enhanced error classification with retry module
────────────────────────────────────────────────────────────────*/

// Try to load retry module for enhanced classification
let retry_module = null;
try {
  retry_module = require('../utils/retry.js');
} catch {
  // Retry module not available, use legacy detection
}

/**
 * Check if an error is transient (worth retrying).
 * REQ-032: Uses retry module for comprehensive classification
 * when available, falls back to legacy patterns.
 *
 * @param {Error} error - The error to check
 * @returns {boolean} True if error is transient
 */
function is_transient_error(error) {
  // Use retry module if available (REQ-032)
  if (retry_module && retry_module.isTransientError) {
    return retry_module.isTransientError(error);
  }

  // Legacy fallback patterns
  const transient_patterns = [
    /SQLITE_BUSY/,
    /SQLITE_LOCKED/,
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ECONNREFUSED/,
    /temporarily unavailable/i,
    /rate limit/i,
  ];

  return transient_patterns.some(pattern => pattern.test(error.message));
}

/**
 * Check if an error is permanent (should NOT retry).
 * REQ-032: Fail-fast for 401, 403, and other permanent errors.
 *
 * @param {Error} error - The error to check
 * @returns {boolean} True if error is permanent
 */
function is_permanent_error(error) {
  // Use retry module if available (REQ-032)
  if (retry_module && retry_module.isPermanentError) {
    return retry_module.isPermanentError(error);
  }

  // Legacy fallback patterns
  const permanent_patterns = [
    /unauthorized/i,
    /authentication failed/i,
    /invalid api key/i,
    /forbidden/i,
    /access denied/i,
  ];

  return permanent_patterns.some(pattern => pattern.test(error.message));
}

/* ─────────────────────────────────────────────────────────────
   6. ERROR RESPONSE BUILDER WITH HINTS

   REQ-004: Build standardized error responses with recovery hints.
   Zero runtime cost - hints are static lookups.
────────────────────────────────────────────────────────────────*/

/**
 * Build an error response object with recovery hints.
 * REQ-019: Uses standardized envelope (summary, data, hints, meta).
 * Use this in tool handlers for consistent error reporting.
 *
 * @param {string} toolName - Name of the tool (e.g., 'memory_search')
 * @param {Error|MemoryError} error - The error that occurred
 * @param {Object} [context={}] - Additional context for the error
 * @returns {Object} Standardized error response with envelope format
 *
 * @example
 * // In a handler:
 * try {
 *   // ... operation
 * } catch (error) {
 *   return build_error_response('memory_search', error, { query });
 * }
 */
function build_error_response(toolName, error, context = {}) {
  // Extract error code (from MemoryError or fallback)
  const errorCode = error.code || ErrorCodes.SEARCH_FAILED;

  // Get recovery hint (zero-cost static lookup)
  const recoveryHint = getRecoveryHint(toolName, errorCode);

  // REQ-019: Build hints array from recovery hint
  const hints = [];
  if (recoveryHint.hint) hints.push(recoveryHint.hint);
  if (recoveryHint.actions) hints.push(...recoveryHint.actions);
  if (recoveryHint.toolTip) hints.push(recoveryHint.toolTip);

  // REQ-019: Build standardized envelope format
  return {
    summary: `Error: ${error.message}`,
    data: {
      error: error.message,
      code: errorCode,
      details: error.details || context || null
    },
    hints,
    meta: {
      tool: toolName,
      isError: true,
      severity: recoveryHint.severity
    }
  };
}

/**
 * Create a MemoryError with recovery hint pre-attached.
 * Convenience function for throwing errors with hints.
 *
 * @param {string} code - Error code from ErrorCodes
 * @param {string} message - Error message
 * @param {Object} [details={}] - Additional details
 * @param {string} [toolName] - Tool name for hint context
 * @returns {MemoryError} Error with hint attached
 */
function create_error_with_hint(code, message, details = {}, toolName = null) {
  const error = new MemoryError(code, message, details);

  // Attach recovery hint if tool context provided
  if (toolName) {
    error.recoveryHint = getRecoveryHint(toolName, code);
  }

  return error;
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core exports
  ErrorCodes,
  MemoryError,
  with_timeout,
  user_friendly_error,
  is_transient_error,
  is_permanent_error,

  // Error response builders
  build_error_response,
  create_error_with_hint,

  // Re-export from recovery-hints for convenience
  ERROR_CODES,
  RECOVERY_HINTS,
  DEFAULT_HINT,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints,
};
