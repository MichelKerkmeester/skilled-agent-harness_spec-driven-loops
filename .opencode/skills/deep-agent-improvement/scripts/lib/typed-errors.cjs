'use strict';

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

function makeTypedError(type, message, details = {}) {
  const error = new Error(message);
  error.code = type;
  error.errorType = type;
  error.details = details;
  return error;
}

function classifyExitCode(error) {
  const type = error?.errorType || error?.code;
  return EXIT_CODES[type] || EXIT_CODES[ERROR_TYPES.SCRIPT_CRASH];
}

function serializeTypedError(error) {
  const type = error?.errorType || error?.code || ERROR_TYPES.SCRIPT_CRASH;
  return {
    status: 'error',
    errorType: Object.values(ERROR_TYPES).includes(type) ? type : ERROR_TYPES.SCRIPT_CRASH,
    message: error?.message || 'Script crashed',
    details: error?.details || {},
  };
}

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

module.exports = {
  ERROR_TYPES,
  EXIT_CODES,
  classifyExitCode,
  makeTypedError,
  parseTypedError,
  serializeTypedError,
};
