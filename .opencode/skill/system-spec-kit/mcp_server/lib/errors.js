// ───────────────────────────────────────────────────────────────
// LIB: ERRORS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. ERROR CODES
──────────────────────────────────────────────────────────────── */

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
  RATE_LIMITED: 'E429',
};

/* ─────────────────────────────────────────────────────────────
   2. MEMORY ERROR CLASS
──────────────────────────────────────────────────────────────── */

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
──────────────────────────────────────────────────────────────── */

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
──────────────────────────────────────────────────────────────── */

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
  return error.message;
}

/* ─────────────────────────────────────────────────────────────
   5. TRANSIENT ERROR DETECTION
──────────────────────────────────────────────────────────────── */

function is_transient_error(error) {
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

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  ErrorCodes,
  MemoryError,
  with_timeout,
  user_friendly_error,
  is_transient_error,
};
