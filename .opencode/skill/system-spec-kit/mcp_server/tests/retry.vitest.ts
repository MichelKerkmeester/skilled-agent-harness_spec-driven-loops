// ───────────────────────────────────────────────────────────────
// TEST: RETRY WITH EXPONENTIAL BACKOFF (Vitest)
// ───────────────────────────────────────────────────────────────
// Converted from retry.test.js
// Tests for REQ-032: Retry Logic with exponential backoff
// Tasks: T101-T104, T185-T191
//
// STATUS: ACTIVE - Module lib/utils/retry.ts implemented.
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';

import {
  classifyError,
  retryWithBackoff,
  calculateBackoff,
  getBackoffSequence,
  isTransientError,
  isPermanentError,
  extractStatusCode,
  extractErrorCode,
  withRetry,
  DEFAULT_CONFIG,
} from '../lib/utils/retry';

type RetryTestError = Error & {
  code?: string;
  response?: { status?: number };
  cause?: unknown;
  attemptLog?: Array<{ errorType?: string; classificationReason?: string }>;
};

function asRetryTestError(error: unknown): RetryTestError {
  return error instanceof Error ? (error as RetryTestError) : new Error(String(error));
}

/**
 * Create a mock error with HTTP status
 */
function createHttpError(status: number, message = 'Test error'): Error & { status?: number } {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

/**
 * Create a mock error with network code
 */
function createNetworkError(code: string, message = 'Network error'): Error & { code?: string } {
  const error = new Error(message) as Error & { code?: string };
  error.code = code;
  return error;
}

// ─────────────────────────────────────────────────────────────
// ALL TESTS ACTIVE
// ─────────────────────────────────────────────────────────────

describe('Retry Module - Module Loading', () => {
  it('T101: Module loads without error', () => {
    // retryModule should be importable
    expect(true).toBe(true);
  });
});

describe('CHK-181: Transient Error Classification', () => {
  it('T102a: HTTP 500 classified as transient', () => {
    const error = createHttpError(500, 'Internal Server Error');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T102b: HTTP 502 classified as transient', () => {
    const error = createHttpError(502, 'Bad Gateway');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102c: HTTP 503 classified as transient', () => {
    const error = createHttpError(503, 'Service Unavailable');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102d: HTTP 504 classified as transient', () => {
    const error = createHttpError(504, 'Gateway Timeout');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102e: HTTP 429 (rate limit) classified as transient', () => {
    const error = createHttpError(429, 'Too Many Requests');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102f: ETIMEDOUT classified as transient', () => {
    const error = createNetworkError('ETIMEDOUT', 'Connection timed out');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102g: ECONNRESET classified as transient', () => {
    const error = createNetworkError('ECONNRESET', 'Connection reset');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });

  it('T102h: ECONNREFUSED classified as transient', () => {
    const error = createNetworkError('ECONNREFUSED', 'Connection refused');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
  });
});

describe('CHK-184: Permanent Error Classification (Fail Fast)', () => {
  it('T103a: HTTP 401 classified as permanent', () => {
    const error = createHttpError(401, 'Unauthorized');
    const classification = classifyError(error);
    expect(classification.type).toBe('permanent');
    expect(classification.shouldRetry).toBe(false);
  });

  it('T103b: HTTP 403 classified as permanent', () => {
    const classification = classifyError(createHttpError(403, 'Forbidden'));
    expect(classification.type).toBe('permanent');
  });

  it('T103c: HTTP 404 classified as permanent', () => {
    const classification = classifyError(createHttpError(404, 'Not Found'));
    expect(classification.type).toBe('permanent');
  });

  it('T103d: HTTP 400 classified as permanent', () => {
    const classification = classifyError(createHttpError(400, 'Bad Request'));
    expect(classification.type).toBe('permanent');
  });

  it('T103e: "invalid api key" message classified as permanent', () => {
    const error = new Error('Invalid API key provided');
    const classification = classifyError(error);
    expect(classification.type).toBe('permanent');
  });

  it('T103f: "authentication failed" classified as permanent', () => {
    const error = new Error('Authentication failed');
    const classification = classifyError(error);
    expect(classification.type).toBe('permanent');
  });
});

describe('CHK-182: Exponential Backoff (1s, 2s, 4s)', () => {
  it('T182a: First backoff delay is 1s', () => {
    const delays = getBackoffSequence();
    expect(delays[0]).toBe(1000);
  });

  it('T182b: Second backoff delay is 2s', () => {
    const delays = getBackoffSequence();
    expect(delays[1]).toBe(2000);
  });

  it('T182c: Third backoff delay is 4s', () => {
    const delays = getBackoffSequence();
    expect(delays[2]).toBe(4000);
  });

  it('T182d: calculateBackoff(0) = 1000ms', () => {
    expect(calculateBackoff(0)).toBe(1000);
  });

  it('T182e: calculateBackoff(1) = 2000ms', () => {
    expect(calculateBackoff(1)).toBe(2000);
  });

  it('T182f: calculateBackoff(2) = 4000ms', () => {
    expect(calculateBackoff(2)).toBe(4000);
  });
});

describe('CHK-183: Max 3 Retries Before Fallback', () => {
  it('T183a: Default max retries is 3', () => {
    expect(DEFAULT_CONFIG.maxRetries).toBe(3);
  });

  it('T183b: Backoff sequence has 3 entries', () => {
    const delays = getBackoffSequence();
    expect(delays.length).toBe(3);
  });
});

describe('retryWithBackoff Function Tests', () => {
  it('T104a: Success on first attempt (no retries needed)', async () => {
    let callCount = 0;
    const successFn = async () => { callCount++; return 'success'; };
    const result = await retryWithBackoff(successFn, { operationName: 'test-success' });
    expect(result).toBe('success');
    expect(callCount).toBe(1);
  });

  it('T104b: Success after transient error retry', async () => {
    let attempt = 0;
    const retryThenSuccessFn = async () => {
      attempt++;
      if (attempt < 2) {
        const error: RetryTestError = new Error('timeout');
        error.code = 'ETIMEDOUT';
        throw error;
      }
      return 'recovered';
    };
    const result = await retryWithBackoff(retryThenSuccessFn, {
      operationName: 'test-retry',
      baseDelayMs: 10,
    });
    expect(result).toBe('recovered');
    expect(attempt).toBe(2);
  });

  it('T104c: Permanent error fails fast (no retries)', async () => {
    let attempt = 0;
    const permanentErrorFn = async () => {
      attempt++;
      throw createHttpError(401, 'Unauthorized');
    };
    await expect(retryWithBackoff(permanentErrorFn, { operationName: 'test-permanent' }))
      .rejects.toMatchObject({ isPermanent: true });
    expect(attempt).toBe(1);
  });

  it('T104d: Exhausts retries for persistent transient error', async () => {
    let attempt = 0;
    const alwaysFailFn = async () => {
      attempt++;
      throw createHttpError(503, 'Service Unavailable');
    };
    await expect(retryWithBackoff(alwaysFailFn, {
      operationName: 'test-exhaust',
      maxRetries: 3,
      baseDelayMs: 10,
    })).rejects.toMatchObject({ retriesExhausted: true });
    expect(attempt).toBe(4); // 1 initial + 3 retries
  });

  it('T104e: onRetry callback is called for each retry', async () => {
    let retryCallbackCount = 0;
    let attempt = 0;
    const failTwiceFn = async () => {
      attempt++;
      if (attempt < 3) throw createHttpError(500, 'Server error');
      return 'done';
    };
    await retryWithBackoff(failTwiceFn, {
      operationName: 'test-callback',
      baseDelayMs: 10,
      onRetry: () => { retryCallbackCount++; },
    });
    expect(retryCallbackCount).toBe(2);
  });
});

describe('CHK-185: Retry Attempt Logging', () => {
  it('T185a: Classification includes reason', () => {
    const error = createHttpError(500, 'Internal Server Error');
    const classification = classifyError(error);
    expect(classification.reason).toContain('HTTP 500');
  });

  it('T185b: isTransientError helper works', () => {
    const transientError = createHttpError(503, 'Service Unavailable');
    expect(isTransientError(transientError)).toBe(true);
  });

  it('T185c: isPermanentError helper works', () => {
    const permanentError = createHttpError(401, 'Unauthorized');
    expect(isPermanentError(permanentError)).toBe(true);
  });
});

describe('Helper Function Tests', () => {
  it('T_H1: extractStatusCode from response object', () => {
    const error: RetryTestError = new Error('API error');
    error.response = { status: 429 };
    expect(extractStatusCode(error)).toBe(429);
  });

  it('T_H2: extractStatusCode from message', () => {
    const error = new Error('HTTP 502 Bad Gateway');
    expect(extractStatusCode(error)).toBe(502);
  });

  it('T_H3: extractErrorCode from cause', () => {
    const error: RetryTestError = new Error('Network failure');
    error.cause = { code: 'ECONNRESET' };
    expect(extractErrorCode(error)).toBe('ECONNRESET');
  });

  it('T_H4: withRetry returns a function', () => {
    const wrappedFn = withRetry(async (x: number) => x * 2, { operationName: 'test-wrap' });
    expect(typeof wrappedFn).toBe('function');
  });

  it('T_H5: Unknown error classified as unknown (no retry)', () => {
    const unknownError = new Error('Some random error');
    const classification = classifyError(unknownError);
    expect(classification.type).toBe('unknown');
    expect(classification.shouldRetry).toBe(false);
  });
});

describe('Error Message Pattern Matching', () => {
  it('T_P1: "rate limit" pattern is transient', () => {
    const error = new Error('Rate limit exceeded, please wait');
    expect(classifyError(error).type).toBe('transient');
  });

  it('T_P2: "timeout" pattern is transient', () => {
    const error = new Error('Request timeout after 30s');
    expect(classifyError(error).type).toBe('transient');
  });

  it('T_P3: "forbidden" pattern is permanent', () => {
    const error = new Error('Forbidden: Access denied');
    expect(classifyError(error).type).toBe('permanent');
  });

  it('T_P4: SQLITE_BUSY is transient', () => {
    const error = new Error('SQLITE_BUSY: database is locked');
    expect(classifyError(error).type).toBe('transient');
  });
});

describe('T185: retryWithBackoff() Basic Functionality', () => {
  it('T185a: Returns result on success', async () => {
    let callCount = 0;
    const successFn = async () => { callCount++; return { data: 'test-result', success: true }; };
    const result = await retryWithBackoff(successFn, { operationName: 'T185-basic', baseDelayMs: 10 });
    expect(result).toEqual({ data: 'test-result', success: true });
    expect(callCount).toBe(1);
  });

  it('T185b: Throws after exhausting retries', async () => {
    let failCallCount = 0;
    const alwaysFailFn = async () => { failCallCount++; throw createHttpError(500, 'Server Error'); };
    await expect(retryWithBackoff(alwaysFailFn, {
      operationName: 'T185-fail', maxRetries: 2, baseDelayMs: 10,
    })).rejects.toMatchObject({ retriesExhausted: true });
    expect(failCallCount).toBe(3);
  });

  it('T185c: Recovers after transient failure', async () => {
    let attempt = 0;
    const recoverFn = async () => {
      attempt++;
      if (attempt === 1) throw createHttpError(503, 'Service Unavailable');
      return 'recovered';
    };
    const result = await retryWithBackoff(recoverFn, { operationName: 'T185-recover', baseDelayMs: 10 });
    expect(result).toBe('recovered');
    expect(attempt).toBe(2);
  });
});

describe('T186: Exponential Backoff (1s, 2s, 4s intervals)', () => {
  it('T186a: calculateBackoff(0) = 1000ms (1s)', () => {
    expect(calculateBackoff(0)).toBe(1000);
  });

  it('T186b: calculateBackoff(1) = 2000ms (2s)', () => {
    expect(calculateBackoff(1)).toBe(2000);
  });

  it('T186c: calculateBackoff(2) = 4000ms (4s)', () => {
    expect(calculateBackoff(2)).toBe(4000);
  });

  it('T186d: getBackoffSequence returns [1000, 2000, 4000]', () => {
    const sequence = getBackoffSequence();
    expect(sequence).toEqual([1000, 2000, 4000]);
  });

  it('T186e: Custom config: base=500, exp=3 produces [500, 1500, 4500]', () => {
    const config = { maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5000, exponentialBase: 3 };
    expect(calculateBackoff(0, config)).toBe(500);
    expect(calculateBackoff(1, config)).toBe(1500);
    expect(calculateBackoff(2, config)).toBe(4500);
  });

  it('T186f: maxDelayMs caps backoff (8000 capped to 3000)', () => {
    const config = { maxRetries: 5, baseDelayMs: 1000, maxDelayMs: 3000, exponentialBase: 2 };
    expect(calculateBackoff(3, config)).toBe(3000);
  });
});

describe('T187: Transient Error Retry (5xx status codes)', () => {
  const statusCodes5xx = [500, 502, 503, 504, 520, 521, 522, 523, 524];

  statusCodes5xx.forEach((code, idx) => {
    it(`T187${String.fromCharCode(97 + idx)}: HTTP ${code} is classified as transient`, () => {
      const error = createHttpError(code, `Error ${code}`);
      const classification = classifyError(error);
      expect(classification.type).toBe('transient');
      expect(classification.shouldRetry).toBe(true);
    });
  });

  it('T187j: HTTP 429 (Rate Limited) is transient', () => {
    const error = createHttpError(429, 'Too Many Requests');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T187k: HTTP 408 (Request Timeout) is transient', () => {
    const error = createHttpError(408, 'Request Timeout');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });
});

describe('T188: Transient Error Retry (Network error codes)', () => {
  it('T188a: ETIMEDOUT is classified as transient', () => {
    const error = createNetworkError('ETIMEDOUT', 'Connection timed out');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188b: ECONNRESET is classified as transient', () => {
    const error = createNetworkError('ECONNRESET', 'Connection reset by peer');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188c: ECONNREFUSED is classified as transient', () => {
    const error = createNetworkError('ECONNREFUSED', 'Connection refused');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188d: ENOTFOUND is classified as transient', () => {
    const error = createNetworkError('ENOTFOUND', 'DNS lookup failed');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188e: ENETUNREACH is classified as transient', () => {
    const error = createNetworkError('ENETUNREACH', 'Network unreachable');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188f: EHOSTUNREACH is classified as transient', () => {
    const error = createNetworkError('EHOSTUNREACH', 'Host unreachable');
    const classification = classifyError(error);
    expect(classification.type).toBe('transient');
    expect(classification.shouldRetry).toBe(true);
  });

  it('T188g: isTransientError() returns true for network errors', () => {
    expect(isTransientError(createNetworkError('ETIMEDOUT'))).toBe(true);
    expect(isTransientError(createNetworkError('ECONNRESET'))).toBe(true);
    expect(isTransientError(createNetworkError('ECONNREFUSED'))).toBe(true);
  });
});

describe('T189: Permanent Error Fail-Fast (401, 403)', () => {
  it('T189a: HTTP 401 is classified as permanent', () => {
    const classification = classifyError(createHttpError(401, 'Unauthorized'));
    expect(classification.type).toBe('permanent');
    expect(classification.shouldRetry).toBe(false);
  });

  it('T189b: HTTP 403 is classified as permanent', () => {
    const classification = classifyError(createHttpError(403, 'Forbidden'));
    expect(classification.type).toBe('permanent');
    expect(classification.shouldRetry).toBe(false);
  });

  it('T189c: HTTP 404 is classified as permanent', () => {
    const classification = classifyError(createHttpError(404, 'Not Found'));
    expect(classification.type).toBe('permanent');
    expect(classification.shouldRetry).toBe(false);
  });

  it('T189d: HTTP 400 is classified as permanent', () => {
    const classification = classifyError(createHttpError(400, 'Bad Request'));
    expect(classification.type).toBe('permanent');
    expect(classification.shouldRetry).toBe(false);
  });

  it('T189e: isPermanentError() returns true for permanent errors', () => {
    expect(isPermanentError(createHttpError(401))).toBe(true);
    expect(isPermanentError(createHttpError(403))).toBe(true);
    expect(isPermanentError(createHttpError(404))).toBe(true);
  });
});

describe('T190: isPermanent Flag on Permanent Errors', () => {
  it('T190a: isPermanent flag set on 401 error', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(401, 'Unauthorized'); };
    await expect(retryWithBackoff(fn, { operationName: 'T190-perm', baseDelayMs: 10 }))
      .rejects.toMatchObject({ isPermanent: true });
    expect(attempt).toBe(1);
  });

  it('T190b: isPermanent flag set on 403 error', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(403, 'Forbidden'); };
    await expect(retryWithBackoff(fn, { operationName: 'T190-perm2', baseDelayMs: 10 }))
      .rejects.toMatchObject({ isPermanent: true });
    expect(attempt).toBe(1);
  });

  it('T190c: No retries for permanent errors (fail-fast)', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(404, 'Not Found'); };
    await expect(retryWithBackoff(fn, { operationName: 'T190-noretry', maxRetries: 3, baseDelayMs: 10 }))
      .rejects.toMatchObject({ isPermanent: true });
    expect(attempt).toBe(1);
  });

  it('T190d: Error cause preserved on permanent error', async () => {
    const originalError = createHttpError(401, 'Original auth error');
    const fn = async () => { throw originalError; };
    try {
      await retryWithBackoff(fn, { operationName: 'T190-cause', baseDelayMs: 10 });
    } catch (error: unknown) {
      expect(asRetryTestError(error).cause).toBe(originalError);
    }
  });
});

describe('T191: Retry Attempt Logging with Error Classification', () => {
  it('T191a: attemptLog attached to thrown error', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(503, 'Service Unavailable'); };
    try {
      await retryWithBackoff(fn, { operationName: 'T191-log', maxRetries: 2, baseDelayMs: 10 });
    } catch (error: unknown) {
      const retryError = asRetryTestError(error);
      expect(retryError.attemptLog).toBeInstanceOf(Array);
      expect(retryError.attemptLog?.length).toBe(3);
    }
  });

  it('T191b: attemptLog entries have errorType', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(500, 'Internal Server Error'); };
    try {
      await retryWithBackoff(fn, { operationName: 'T191-errortype', maxRetries: 1, baseDelayMs: 10 });
    } catch (error: unknown) {
      const retryError = asRetryTestError(error);
      const attemptLog = retryError.attemptLog ?? [];
      expect(attemptLog.every((entry) => entry.errorType === 'transient')).toBe(true);
    }
  });

  it('T191c: Permanent error attemptLog has 1 entry', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(401, 'Unauthorized'); };
    try {
      await retryWithBackoff(fn, { operationName: 'T191-perm', maxRetries: 3, baseDelayMs: 10 });
    } catch (error: unknown) {
      const retryError = asRetryTestError(error);
      const attemptLog = retryError.attemptLog ?? [];
      expect(attemptLog.length).toBe(1);
      expect(attemptLog[0]?.errorType).toBe('permanent');
    }
  });

  it('T191d: onRetry callback receives (attempt, error, delay)', async () => {
    const params: Array<{ attemptNum: number; errorMessage: string; delay: number }> = [];
    let attempt = 0;
    const fn = async () => {
      attempt++;
      if (attempt < 3) throw createHttpError(502, 'Bad Gateway');
      return 'success';
    };
    await retryWithBackoff(fn, {
      operationName: 'T191-callback', maxRetries: 3, baseDelayMs: 10,
      onRetry: (attemptNum: number, error: Error, delay: number) => {
        params.push({ attemptNum, errorMessage: error.message, delay });
      },
    });
    expect(params.length).toBe(2);
    expect(params[0].attemptNum).toBe(0);
    expect(typeof params[0].delay).toBe('number');
  });

  it('T191e: attemptLog includes classificationReason', async () => {
    let attempt = 0;
    const fn = async () => { attempt++; throw createHttpError(503, 'Service Unavailable'); };
    try {
      await retryWithBackoff(fn, { operationName: 'T191-reason', maxRetries: 1, baseDelayMs: 10 });
    } catch (error: unknown) {
      const retryError = asRetryTestError(error);
      const attemptLog = retryError.attemptLog ?? [];
      expect(attemptLog.every((entry) => entry.classificationReason?.includes('HTTP 503'))).toBe(true);
    }
  });

  it('T191f: Successful recovery after retry works correctly', async () => {
    let attempt = 0;
    const fn = async () => {
      attempt++;
      if (attempt === 1) throw createHttpError(500, 'Server Error');
      return 'recovered';
    };
    const result = await retryWithBackoff(fn, { operationName: 'T191-success', baseDelayMs: 10 });
    expect(result).toBe('recovered');
    expect(attempt).toBe(2);
  });
});
