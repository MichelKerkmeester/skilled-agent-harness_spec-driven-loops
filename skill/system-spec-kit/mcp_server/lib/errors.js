/**
 * Centralized Error Definitions for Semantic Memory MCP Server
 * 
 * Provides standardized error codes and a custom MemoryError class
 * for consistent error handling across the codebase.
 * 
 * @module semantic-memory/lib/errors
 */

'use strict';

// ───────────────────────────────────────────────────────────────
// ERROR CODES
// ───────────────────────────────────────────────────────────────

const ErrorCodes = {
  // Embedding errors (E00x)
  EMBEDDING_FAILED: 'E001',
  EMBEDDING_DIMENSION_INVALID: 'E002',
  
  // File errors (E01x)
  FILE_NOT_FOUND: 'E010',
  FILE_ACCESS_DENIED: 'E011',
  FILE_ENCODING_ERROR: 'E012',
  
  // Database errors (E02x)
  DB_CONNECTION_FAILED: 'E020',
  DB_QUERY_FAILED: 'E021',
  DB_TRANSACTION_FAILED: 'E022',
  
  // Validation errors (E03x)
  INVALID_PARAMETER: 'E030',
  MISSING_REQUIRED_PARAM: 'E031',
  
  // Search errors (E04x)
  SEARCH_FAILED: 'E040',
  VECTOR_SEARCH_UNAVAILABLE: 'E041'
};

// ───────────────────────────────────────────────────────────────
// MEMORY ERROR CLASS
// ───────────────────────────────────────────────────────────────

/**
 * Custom error class for Memory operations
 * Provides structured error information with codes and details
 */
class MemoryError extends Error {
  /**
   * @param {string} code - Error code from ErrorCodes
   * @param {string} message - Human-readable error message
   * @param {Object} details - Additional error context
   */
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'MemoryError';
  }
  
  /**
   * Convert error to JSON-serializable object
   * @returns {Object} Serializable error representation
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

// ───────────────────────────────────────────────────────────────
// TIMEOUT WRAPPER
// ───────────────────────────────────────────────────────────────

/**
 * Wrap a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @param {string} operation - Name of the operation (for error message)
 * @returns {Promise} The wrapped promise that rejects on timeout
 */
function withTimeout(promise, ms, operation) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new MemoryError(
        ErrorCodes.SEARCH_FAILED,
        `${operation} timed out after ${ms}ms`,
        { timeout: ms, operation }
      )), ms)
    )
  ]);
}

// ───────────────────────────────────────────────────────────────
// USER-FRIENDLY ERROR MESSAGES
// ───────────────────────────────────────────────────────────────

/**
 * Convert internal error messages to user-friendly versions
 * @param {Error} error - The original error
 * @returns {string} User-friendly error message
 */
function userFriendlyError(error) {
  const internalPatterns = [
    { pattern: /SQLITE_BUSY/, message: 'Database is temporarily busy. Please retry.' },
    { pattern: /SQLITE_LOCKED/, message: 'Database is locked. Please wait and retry.' },
    { pattern: /ENOENT/, message: 'File not found.' },
    { pattern: /EACCES/, message: 'Permission denied.' },
    { pattern: /ECONNREFUSED/, message: 'Connection refused. Service may be unavailable.' },
    { pattern: /ETIMEDOUT/, message: 'Operation timed out. Please retry.' },
    { pattern: /embedding.*failed/i, message: 'Failed to generate embedding. Search may be unavailable.' }
  ];
  
  for (const { pattern, message } of internalPatterns) {
    if (pattern.test(error.message)) return message;
  }
  return error.message;
}

// ───────────────────────────────────────────────────────────────
// TRANSIENT ERROR DETECTION
// ───────────────────────────────────────────────────────────────

/**
 * Check if an error is transient and should be retried
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is transient
 */
function isTransientError(error) {
  const transientPatterns = [
    /SQLITE_BUSY/,
    /SQLITE_LOCKED/,
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ECONNREFUSED/,
    /temporarily unavailable/i,
    /rate limit/i
  ];
  
  return transientPatterns.some(pattern => pattern.test(error.message));
}

module.exports = {
  ErrorCodes,
  MemoryError,
  withTimeout,
  userFriendlyError,
  isTransientError
};
