// ───────────────────────────────────────────────────────────────
// UTILS: RETRY WITH EXPONENTIAL BACKOFF
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const DEFAULT_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,  // 1 second base delay
  maxDelayMs: 4000,   // 4 second max delay
  exponentialBase: 2, // Multiplier for exponential backoff
};

/* ─────────────────────────────────────────────────────────────
   2. ERROR CLASSIFICATION
────────────────────────────────────────────────────────────────*/

const TRANSIENT_HTTP_STATUS_CODES = new Set([
  408, // Request Timeout
  429, // Too Many Requests (Rate Limited)
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  520, // Cloudflare: Unknown Error
  521, // Cloudflare: Web Server Is Down
  522, // Cloudflare: Connection Timed Out
  523, // Cloudflare: Origin Is Unreachable
  524, // Cloudflare: A Timeout Occurred
]);

const PERMANENT_HTTP_STATUS_CODES = new Set([
  400, // Bad Request
  401, // Unauthorized
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  410, // Gone
  422, // Unprocessable Entity
]);

const TRANSIENT_NETWORK_ERRORS = new Set([
  'ETIMEDOUT',     // Connection timed out
  'ECONNRESET',    // Connection reset by peer
  'ECONNREFUSED',  // Connection refused (service may be restarting)
  'ENOTFOUND',     // DNS lookup failed (may be transient)
  'ENETUNREACH',   // Network unreachable
  'EHOSTUNREACH',  // Host unreachable
  'EPIPE',         // Broken pipe
  'EAI_AGAIN',     // DNS lookup timeout
]);

const TRANSIENT_ERROR_PATTERNS = [
  /timeout/i,
  /timed out/i,
  /temporarily unavailable/i,
  /rate limit/i,
  /too many requests/i,
  /service unavailable/i,
  /server error/i,
  /network error/i,
  /connection reset/i,
  /SQLITE_BUSY/,   // SQLite database is locked/busy
  /SQLITE_LOCKED/, // SQLite table is locked
];

const PERMANENT_ERROR_PATTERNS = [
  /unauthorized/i,
  /authentication failed/i,
  /invalid api key/i,
  /invalid_api_key/i,
  /forbidden/i,
  /access denied/i,
  /not found/i,
  /does not exist/i,
  /invalid request/i,
  /malformed/i,
];

/* ─────────────────────────────────────────────────────────────
   3. ERROR TYPE DETECTION
────────────────────────────────────────────────────────────────*/

function extractStatusCode(error) {
  // Direct status property (common in fetch/axios)
  if (typeof error.status === 'number') {
    return error.status;
  }

  // Response object (fetch)
  if (error.response && typeof error.response.status === 'number') {
    return error.response.status;
  }

  // statusCode property (node http)
  if (typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  // Parse from error message (e.g., "HTTP 500 Internal Server Error")
  const messageMatch = error.message?.match(/\b([45]\d{2})\b/);
  if (messageMatch) {
    return parseInt(messageMatch[1], 10);
  }

  return null;
}

function extractErrorCode(error) {
  // Standard Node.js error code
  if (typeof error.code === 'string') {
    return error.code;
  }

  // Cause chain (Error.cause)
  if (error.cause && typeof error.cause.code === 'string') {
    return error.cause.code;
  }

  return null;
}

function classifyError(error) {
  if (!error) {
    return { type: 'unknown', reason: 'No error provided', shouldRetry: false };
  }

  const statusCode = extractStatusCode(error);
  const errorCode = extractErrorCode(error);
  const message = error.message || String(error);

  // 1. Check HTTP status codes first (most reliable)
  if (statusCode) {
    if (PERMANENT_HTTP_STATUS_CODES.has(statusCode)) {
      return {
        type: 'permanent',
        reason: `HTTP ${statusCode} (permanent error)`,
        shouldRetry: false,
      };
    }
    if (TRANSIENT_HTTP_STATUS_CODES.has(statusCode)) {
      return {
        type: 'transient',
        reason: `HTTP ${statusCode} (transient error)`,
        shouldRetry: true,
      };
    }
  }

  // 2. Check network error codes
  if (errorCode && TRANSIENT_NETWORK_ERRORS.has(errorCode)) {
    return {
      type: 'transient',
      reason: `Network error: ${errorCode}`,
      shouldRetry: true,
    };
  }

  // 3. Check permanent error patterns (check before transient to fail fast)
  for (const pattern of PERMANENT_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return {
        type: 'permanent',
        reason: `Message matches permanent pattern: ${pattern.source}`,
        shouldRetry: false,
      };
    }
  }

  // 4. Check transient error patterns
  for (const pattern of TRANSIENT_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return {
        type: 'transient',
        reason: `Message matches transient pattern: ${pattern.source}`,
        shouldRetry: true,
      };
    }
  }

  // 5. Default: Unknown - conservative approach (don't retry by default)
  return {
    type: 'unknown',
    reason: 'Could not classify error type',
    shouldRetry: false,
  };
}

function isTransientError(error) {
  return classifyError(error).shouldRetry;
}

function isPermanentError(error) {
  return classifyError(error).type === 'permanent';
}

/* ─────────────────────────────────────────────────────────────
   4. BACKOFF CALCULATION
────────────────────────────────────────────────────────────────*/

function calculateBackoff(attempt, config = DEFAULT_CONFIG) {
  const { baseDelayMs, exponentialBase, maxDelayMs } = config;
  const delay = baseDelayMs * Math.pow(exponentialBase, attempt);
  return Math.min(delay, maxDelayMs);
}

function getBackoffSequence(config = DEFAULT_CONFIG) {
  const delays = [];
  for (let i = 0; i < config.maxRetries; i++) {
    delays.push(calculateBackoff(i, config));
  }
  return delays;
}

/* ─────────────────────────────────────────────────────────────
   5. RETRY UTILITY
────────────────────────────────────────────────────────────────*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, options = {}) {
  const {
    operationName = 'operation',
    maxRetries = DEFAULT_CONFIG.maxRetries,
    baseDelayMs = DEFAULT_CONFIG.baseDelayMs,
    maxDelayMs = DEFAULT_CONFIG.maxDelayMs,
    exponentialBase = DEFAULT_CONFIG.exponentialBase,
    onRetry = null,
    shouldRetry = null,
  } = options;

  const config = { maxRetries, baseDelayMs, maxDelayMs, exponentialBase };
  const attemptLog = [];
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const isRetry = attempt > 0;
    const attemptNum = attempt + 1;

    try {
      // Execute the operation
      const result = await fn();

      // Log successful attempt
      attemptLog.push({
        attempt: attemptNum,
        success: true,
        isRetry,
        timestamp: new Date().toISOString(),
      });

      if (isRetry) {
        console.error(
          `[retry] ${operationName} succeeded on attempt ${attemptNum}/${maxRetries + 1}`
        );
      }

      return result;

    } catch (error) {
      lastError = error;

      // Classify the error
      const classification = classifyError(error);
      const { type: errorType, reason, shouldRetry: defaultShouldRetry } = classification;

      // CHK-185: Log retry attempt with error type
      attemptLog.push({
        attempt: attemptNum,
        success: false,
        isRetry,
        errorType,
        errorMessage: error.message,
        classificationReason: reason,
        timestamp: new Date().toISOString(),
      });

      console.error(
        `[retry] ${operationName} attempt ${attemptNum}/${maxRetries + 1} failed: ` +
        `[${errorType}] ${error.message}`
      );

      // CHK-184: Permanent errors fail fast (no retry)
      if (errorType === 'permanent') {
        console.error(
          `[retry] ${operationName} failed permanently (${reason}), not retrying`
        );
        const permanentError = new Error(
          `${operationName} failed permanently: ${error.message}`
        );
        permanentError.cause = error;
        permanentError.attemptLog = attemptLog;
        permanentError.isPermanent = true;
        throw permanentError;
      }

      // Check if we should retry (custom function or default classification)
      const willRetry = shouldRetry
        ? shouldRetry(error, attempt, classification)
        : defaultShouldRetry;

      // CHK-183: Check if retries exhausted
      if (attempt >= maxRetries || !willRetry) {
        console.error(
          `[retry] ${operationName} exhausted retries (${attemptNum} attempts)`
        );
        const exhaustedError = new Error(
          `${operationName} failed after ${attemptNum} attempts: ${error.message}`
        );
        exhaustedError.cause = error;
        exhaustedError.attemptLog = attemptLog;
        exhaustedError.retriesExhausted = true;
        throw exhaustedError;
      }

      // CHK-182: Calculate backoff delay
      const delay = calculateBackoff(attempt, config);

      console.error(
        `[retry] ${operationName} will retry in ${delay}ms ` +
        `(attempt ${attemptNum + 1}/${maxRetries + 1})`
      );

      // Call optional retry callback
      if (onRetry) {
        try {
          await onRetry(attempt, error, delay);
        } catch (callbackError) {
          console.error(`[retry] onRetry callback error: ${callbackError.message}`);
        }
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  // Should not reach here, but handle edge case
  throw lastError;
}

function withRetry(fn, options = {}) {
  return async (...args) => {
    return retryWithBackoff(() => fn(...args), options);
  };
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Main retry function
  retryWithBackoff,
  withRetry,

  // Error classification
  classifyError,
  isTransientError,
  isPermanentError,

  // Backoff utilities
  calculateBackoff,
  getBackoffSequence,

  // Configuration
  DEFAULT_CONFIG,

  // Error code sets (for testing/extension)
  TRANSIENT_HTTP_STATUS_CODES,
  PERMANENT_HTTP_STATUS_CODES,
  TRANSIENT_NETWORK_ERRORS,
  TRANSIENT_ERROR_PATTERNS,
  PERMANENT_ERROR_PATTERNS,

  // Utilities
  sleep,
  extractStatusCode,
  extractErrorCode,
};
