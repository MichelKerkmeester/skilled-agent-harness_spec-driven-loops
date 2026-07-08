// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ typed-errors — typed error build, exit-code mapping, serialization      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ERROR_TYPES = Object.freeze({
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PARSE_ERROR: 'PARSE_ERROR',
  SCRIPT_CRASH: 'SCRIPT_CRASH',
});

const EXIT_CODES = Object.freeze({
  [ERROR_TYPES.FILE_NOT_FOUND]: 3,
  [ERROR_TYPES.PARSE_ERROR]: 4,
  [ERROR_TYPES.SCRIPT_CRASH]: 1,
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a typed Error carrying a stable error code and structured details.
 *
 * @param {string} type - One of ERROR_TYPES.
 * @param {string} message - Human-readable error message.
 * @param {Object} [details] - Arbitrary structured context for the error.
 * @returns {Error} Error annotated with code, errorType, and details.
 */
function makeTypedError(type, message, details = {}) {
  const error = new Error(message);
  error.code = type;
  error.errorType = type;
  error.details = details;
  return error;
}

/**
 * Map an error to its process exit code, defaulting to the crash code.
 *
 * @param {Error} error - Error to classify (may carry errorType or code).
 * @returns {number} Exit code for the error's type.
 */
function classifyExitCode(error) {
  const type = error?.errorType || error?.code;
  return EXIT_CODES[type] || EXIT_CODES[ERROR_TYPES.SCRIPT_CRASH];
}

/**
 * Serialize an error into a stable JSON-friendly status object.
 *
 * @param {Error} error - Error to serialize.
 * @returns {Object} Object with status, errorType, message, and details.
 */
function serializeTypedError(error) {
  const type = error?.errorType || error?.code || ERROR_TYPES.SCRIPT_CRASH;
  return {
    status: 'error',
    errorType: Object.values(ERROR_TYPES).includes(type) ? type : ERROR_TYPES.SCRIPT_CRASH,
    message: error?.message || 'Script crashed',
    details: error?.details || {},
  };
}

/**
 * Parse a typed error object from a child script's stderr text.
 *
 * @param {string} stderr - Raw stderr output to scan.
 * @returns {Object|null} Parsed typed error object, or null if none found.
 */
function parseTypedError(stderr) {
  const text = String(stderr || '').trim();
  if (!text) {
    return null;
  }

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  for (const line of lines.reverse()) {
    try {
      const parsed = JSON.parse(line);
      if (parsed && Object.values(ERROR_TYPES).includes(parsed.errorType)) {
        return parsed;
      }
    } catch (_err) {
      // Ignore non-JSON stderr lines from child scripts.
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ERROR_TYPES,
  EXIT_CODES,
  classifyExitCode,
  makeTypedError,
  parseTypedError,
  serializeTypedError,
};
