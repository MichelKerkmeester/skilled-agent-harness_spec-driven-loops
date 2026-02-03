// ───────────────────────────────────────────────────────────────
// TEST: RETRY WITH EXPONENTIAL BACKOFF
// ───────────────────────────────────────────────────────────────
// Tests for REQ-032: Retry Logic with exponential backoff
// Tasks: T101-T104 (Phase 4 - SpecKit Reimagined)

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'utils');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function log(msg) {
    console.log(msg);
  }

  function pass(test_id, test_name, evidence) {
    results.passed++;
    results.tests.push({ id: test_id, name: test_name, status: 'PASS', evidence });
    log(`   [PASS] ${test_id}: ${test_name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(test_id, test_name, reason) {
    results.failed++;
    results.tests.push({ id: test_id, name: test_name, status: 'FAIL', reason });
    log(`   [FAIL] ${test_id}: ${test_name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(test_id, test_name, reason) {
    results.skipped++;
    results.tests.push({ id: test_id, name: test_name, status: 'SKIP', reason });
    log(`   [SKIP] ${test_id}: ${test_name} (skipped: ${reason})`);
  }

  /**
   * Create a mock error with HTTP status
   */
  function createHttpError(status, message = 'Test error') {
    const error = new Error(message);
    error.status = status;
    return error;
  }

  /**
   * Create a mock error with network code
   */
  function createNetworkError(code, message = 'Network error') {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let retryModule;

  function test_module_loads() {
    log('\n-- Module Loading');

    try {
      retryModule = require(path.join(LIB_PATH, 'retry.js'));
      pass('T101', 'Module loads without error', 'require() succeeded');
    } catch (error) {
      fail('T101', 'Module loads without error', error.message);
      return false;
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 ERROR CLASSIFICATION - TRANSIENT ERRORS (CHK-181)

  function test_transient_error_classification() {
    log('\n-- CHK-181: Transient Error Classification');

    // T102a: 5xx errors are transient
    const error500 = createHttpError(500, 'Internal Server Error');
    const class500 = retryModule.classifyError(error500);
    if (class500.type === 'transient' && class500.shouldRetry === true) {
      pass('T102a', 'HTTP 500 classified as transient', `type: ${class500.type}`);
    } else {
      fail('T102a', 'HTTP 500 classified as transient', `type: ${class500.type}`);
    }

    // T102b: 502 is transient
    const error502 = createHttpError(502, 'Bad Gateway');
    const class502 = retryModule.classifyError(error502);
    if (class502.type === 'transient') {
      pass('T102b', 'HTTP 502 classified as transient', `type: ${class502.type}`);
    } else {
      fail('T102b', 'HTTP 502 classified as transient', `type: ${class502.type}`);
    }

    // T102c: 503 is transient
    const error503 = createHttpError(503, 'Service Unavailable');
    const class503 = retryModule.classifyError(error503);
    if (class503.type === 'transient') {
      pass('T102c', 'HTTP 503 classified as transient', `type: ${class503.type}`);
    } else {
      fail('T102c', 'HTTP 503 classified as transient', `type: ${class503.type}`);
    }

    // T102d: 504 is transient
    const error504 = createHttpError(504, 'Gateway Timeout');
    const class504 = retryModule.classifyError(error504);
    if (class504.type === 'transient') {
      pass('T102d', 'HTTP 504 classified as transient', `type: ${class504.type}`);
    } else {
      fail('T102d', 'HTTP 504 classified as transient', `type: ${class504.type}`);
    }

    // T102e: 429 (rate limit) is transient
    const error429 = createHttpError(429, 'Too Many Requests');
    const class429 = retryModule.classifyError(error429);
    if (class429.type === 'transient') {
      pass('T102e', 'HTTP 429 classified as transient', `type: ${class429.type}`);
    } else {
      fail('T102e', 'HTTP 429 classified as transient', `type: ${class429.type}`);
    }

    // T102f: ETIMEDOUT is transient
    const timeoutError = createNetworkError('ETIMEDOUT', 'Connection timed out');
    const classTimeout = retryModule.classifyError(timeoutError);
    if (classTimeout.type === 'transient') {
      pass('T102f', 'ETIMEDOUT classified as transient', `type: ${classTimeout.type}`);
    } else {
      fail('T102f', 'ETIMEDOUT classified as transient', `type: ${classTimeout.type}`);
    }

    // T102g: ECONNRESET is transient
    const resetError = createNetworkError('ECONNRESET', 'Connection reset');
    const classReset = retryModule.classifyError(resetError);
    if (classReset.type === 'transient') {
      pass('T102g', 'ECONNRESET classified as transient', `type: ${classReset.type}`);
    } else {
      fail('T102g', 'ECONNRESET classified as transient', `type: ${classReset.type}`);
    }

    // T102h: ECONNREFUSED is transient
    const refusedError = createNetworkError('ECONNREFUSED', 'Connection refused');
    const classRefused = retryModule.classifyError(refusedError);
    if (classRefused.type === 'transient') {
      pass('T102h', 'ECONNREFUSED classified as transient', `type: ${classRefused.type}`);
    } else {
      fail('T102h', 'ECONNREFUSED classified as transient', `type: ${classRefused.type}`);
    }
  }

  // 4.2 ERROR CLASSIFICATION - PERMANENT ERRORS (CHK-184)

  function test_permanent_error_classification() {
    log('\n-- CHK-184: Permanent Error Classification (Fail Fast)');

    // T103a: 401 is permanent
    const error401 = createHttpError(401, 'Unauthorized');
    const class401 = retryModule.classifyError(error401);
    if (class401.type === 'permanent' && class401.shouldRetry === false) {
      pass('T103a', 'HTTP 401 classified as permanent', `type: ${class401.type}`);
    } else {
      fail('T103a', 'HTTP 401 classified as permanent', `type: ${class401.type}`);
    }

    // T103b: 403 is permanent
    const error403 = createHttpError(403, 'Forbidden');
    const class403 = retryModule.classifyError(error403);
    if (class403.type === 'permanent') {
      pass('T103b', 'HTTP 403 classified as permanent', `type: ${class403.type}`);
    } else {
      fail('T103b', 'HTTP 403 classified as permanent', `type: ${class403.type}`);
    }

    // T103c: 404 is permanent
    const error404 = createHttpError(404, 'Not Found');
    const class404 = retryModule.classifyError(error404);
    if (class404.type === 'permanent') {
      pass('T103c', 'HTTP 404 classified as permanent', `type: ${class404.type}`);
    } else {
      fail('T103c', 'HTTP 404 classified as permanent', `type: ${class404.type}`);
    }

    // T103d: 400 is permanent
    const error400 = createHttpError(400, 'Bad Request');
    const class400 = retryModule.classifyError(error400);
    if (class400.type === 'permanent') {
      pass('T103d', 'HTTP 400 classified as permanent', `type: ${class400.type}`);
    } else {
      fail('T103d', 'HTTP 400 classified as permanent', `type: ${class400.type}`);
    }

    // T103e: "invalid api key" message is permanent
    const apiKeyError = new Error('Invalid API key provided');
    const classApiKey = retryModule.classifyError(apiKeyError);
    if (classApiKey.type === 'permanent') {
      pass('T103e', '"invalid api key" message classified as permanent', `type: ${classApiKey.type}`);
    } else {
      fail('T103e', '"invalid api key" message classified as permanent', `type: ${classApiKey.type}`);
    }

    // T103f: "authentication failed" is permanent
    const authError = new Error('Authentication failed');
    const classAuth = retryModule.classifyError(authError);
    if (classAuth.type === 'permanent') {
      pass('T103f', '"authentication failed" classified as permanent', `type: ${classAuth.type}`);
    } else {
      fail('T103f', '"authentication failed" classified as permanent', `type: ${classAuth.type}`);
    }
  }

  // 4.3 EXPONENTIAL BACKOFF (CHK-182)

  function test_exponential_backoff() {
    log('\n-- CHK-182: Exponential Backoff (1s, 2s, 4s)');

    // Backoff sequence test
    const delays = retryModule.getBackoffSequence();

    // T182a: First delay is 1000ms
    if (delays[0] === 1000) {
      pass('T182a', 'First backoff delay is 1s', `${delays[0]}ms`);
    } else {
      fail('T182a', 'First backoff delay is 1s', `Expected 1000, got ${delays[0]}`);
    }

    // T182b: Second delay is 2000ms
    if (delays[1] === 2000) {
      pass('T182b', 'Second backoff delay is 2s', `${delays[1]}ms`);
    } else {
      fail('T182b', 'Second backoff delay is 2s', `Expected 2000, got ${delays[1]}`);
    }

    // T182c: Third delay is 4000ms
    if (delays[2] === 4000) {
      pass('T182c', 'Third backoff delay is 4s', `${delays[2]}ms`);
    } else {
      fail('T182c', 'Third backoff delay is 4s', `Expected 4000, got ${delays[2]}`);
    }

    // T182d: calculateBackoff(0) = 1000
    const delay0 = retryModule.calculateBackoff(0);
    if (delay0 === 1000) {
      pass('T182d', 'calculateBackoff(0) = 1000ms', `${delay0}ms`);
    } else {
      fail('T182d', 'calculateBackoff(0) = 1000ms', `Expected 1000, got ${delay0}`);
    }

    // T182e: calculateBackoff(1) = 2000
    const delay1 = retryModule.calculateBackoff(1);
    if (delay1 === 2000) {
      pass('T182e', 'calculateBackoff(1) = 2000ms', `${delay1}ms`);
    } else {
      fail('T182e', 'calculateBackoff(1) = 2000ms', `Expected 2000, got ${delay1}`);
    }

    // T182f: calculateBackoff(2) = 4000
    const delay2 = retryModule.calculateBackoff(2);
    if (delay2 === 4000) {
      pass('T182f', 'calculateBackoff(2) = 4000ms', `${delay2}ms`);
    } else {
      fail('T182f', 'calculateBackoff(2) = 4000ms', `Expected 4000, got ${delay2}`);
    }
  }

  // 4.4 MAX RETRIES (CHK-183)

  function test_max_retries() {
    log('\n-- CHK-183: Max 3 Retries Before Fallback');

    // T183a: DEFAULT_CONFIG.maxRetries = 3
    if (retryModule.DEFAULT_CONFIG.maxRetries === 3) {
      pass('T183a', 'Default max retries is 3', `${retryModule.DEFAULT_CONFIG.maxRetries}`);
    } else {
      fail('T183a', 'Default max retries is 3', `Expected 3, got ${retryModule.DEFAULT_CONFIG.maxRetries}`);
    }

    // T183b: Backoff sequence has 3 entries
    const delays = retryModule.getBackoffSequence();
    if (delays.length === 3) {
      pass('T183b', 'Backoff sequence has 3 entries', `Length: ${delays.length}`);
    } else {
      fail('T183b', 'Backoff sequence has 3 entries', `Expected 3, got ${delays.length}`);
    }
  }

  // 4.5 RETRY WITH BACKOFF FUNCTION

  async function test_retry_with_backoff() {
    log('\n-- retryWithBackoff Function Tests');

    // T104a: Success on first attempt (no retries needed)
    let callCount = 0;
    const successFn = async () => {
      callCount++;
      return 'success';
    };

    const result1 = await retryModule.retryWithBackoff(successFn, {
      operationName: 'test-success',
    });

    if (result1 === 'success' && callCount === 1) {
      pass('T104a', 'Success on first attempt', `calls: ${callCount}`);
    } else {
      fail('T104a', 'Success on first attempt', `result: ${result1}, calls: ${callCount}`);
    }

    // T104b: Success after retry (transient error then success)
    let attempt2 = 0;
    const retryThenSuccessFn = async () => {
      attempt2++;
      if (attempt2 < 2) {
        const error = new Error('timeout');
        error.code = 'ETIMEDOUT';
        throw error;
      }
      return 'recovered';
    };

    const result2 = await retryModule.retryWithBackoff(retryThenSuccessFn, {
      operationName: 'test-retry',
      baseDelayMs: 10, // Use short delay for testing
    });

    if (result2 === 'recovered' && attempt2 === 2) {
      pass('T104b', 'Success after transient error retry', `attempts: ${attempt2}`);
    } else {
      fail('T104b', 'Success after transient error retry', `result: ${result2}, attempts: ${attempt2}`);
    }

    // T104c: Permanent error fails fast (no retries)
    let attempt3 = 0;
    const permanentErrorFn = async () => {
      attempt3++;
      throw createHttpError(401, 'Unauthorized');
    };

    try {
      await retryModule.retryWithBackoff(permanentErrorFn, {
        operationName: 'test-permanent',
      });
      fail('T104c', 'Permanent error fails fast', 'Should have thrown');
    } catch (error) {
      if (attempt3 === 1 && error.isPermanent === true) {
        pass('T104c', 'Permanent error fails fast (no retries)', `attempts: ${attempt3}`);
      } else {
        fail('T104c', 'Permanent error fails fast', `attempts: ${attempt3}, isPermanent: ${error.isPermanent}`);
      }
    }

    // T104d: Exhausts retries for persistent transient error
    let attempt4 = 0;
    const alwaysFailFn = async () => {
      attempt4++;
      const error = new Error('Service unavailable');
      error.status = 503;
      throw error;
    };

    try {
      await retryModule.retryWithBackoff(alwaysFailFn, {
        operationName: 'test-exhaust',
        maxRetries: 3,
        baseDelayMs: 10, // Short delay for testing
      });
      fail('T104d', 'Exhausts retries correctly', 'Should have thrown');
    } catch (error) {
      // 1 initial + 3 retries = 4 attempts
      if (attempt4 === 4 && error.retriesExhausted === true) {
        pass('T104d', 'Exhausts retries after 4 attempts', `attempts: ${attempt4}`);
      } else {
        fail('T104d', 'Exhausts retries after 4 attempts', `attempts: ${attempt4}, retriesExhausted: ${error.retriesExhausted}`);
      }
    }

    // T104e: onRetry callback is called
    let retryCallbackCount = 0;
    let attempt5 = 0;
    const failTwiceFn = async () => {
      attempt5++;
      if (attempt5 < 3) {
        throw createHttpError(500, 'Server error');
      }
      return 'done';
    };

    await retryModule.retryWithBackoff(failTwiceFn, {
      operationName: 'test-callback',
      baseDelayMs: 10,
      onRetry: (attempt, error, delay) => {
        retryCallbackCount++;
      },
    });

    if (retryCallbackCount === 2) {
      pass('T104e', 'onRetry callback called for each retry', `callbacks: ${retryCallbackCount}`);
    } else {
      fail('T104e', 'onRetry callback called for each retry', `Expected 2, got ${retryCallbackCount}`);
    }
  }

  // 4.6 RETRY LOGGING (CHK-185)

  function test_retry_logging() {
    log('\n-- CHK-185: Retry Attempt Logging');

    // T185a: attemptLog includes error type
    // This is tested indirectly through the retry function
    // The error object returned includes attemptLog

    // T185b: Error classification includes reason
    const error = createHttpError(500, 'Internal Server Error');
    const classification = retryModule.classifyError(error);
    if (classification.reason && classification.reason.includes('HTTP 500')) {
      pass('T185a', 'Classification includes reason', `reason: ${classification.reason}`);
    } else {
      fail('T185a', 'Classification includes reason', `reason: ${classification.reason}`);
    }

    // T185c: isTransientError helper works
    const transientError = createHttpError(503, 'Service Unavailable');
    if (retryModule.isTransientError(transientError) === true) {
      pass('T185b', 'isTransientError helper works', 'returns true for 503');
    } else {
      fail('T185b', 'isTransientError helper works', 'Expected true');
    }

    // T185d: isPermanentError helper works
    const permanentError = createHttpError(401, 'Unauthorized');
    if (retryModule.isPermanentError(permanentError) === true) {
      pass('T185c', 'isPermanentError helper works', 'returns true for 401');
    } else {
      fail('T185c', 'isPermanentError helper works', 'Expected true');
    }
  }

  // 4.7 HELPER FUNCTION TESTS

  function test_helper_functions() {
    log('\n-- Helper Function Tests');

    // Extract status code from response object
    const errorWithResponse = new Error('API error');
    errorWithResponse.response = { status: 429 };
    const status1 = retryModule.extractStatusCode(errorWithResponse);
    if (status1 === 429) {
      pass('T_H1', 'extractStatusCode from response object', `status: ${status1}`);
    } else {
      fail('T_H1', 'extractStatusCode from response object', `Expected 429, got ${status1}`);
    }

    // Extract status code from message
    const errorWithMessage = new Error('HTTP 502 Bad Gateway');
    const status2 = retryModule.extractStatusCode(errorWithMessage);
    if (status2 === 502) {
      pass('T_H2', 'extractStatusCode from message', `status: ${status2}`);
    } else {
      fail('T_H2', 'extractStatusCode from message', `Expected 502, got ${status2}`);
    }

    // Extract error code from cause
    const errorWithCause = new Error('Network failure');
    errorWithCause.cause = { code: 'ECONNRESET' };
    const code = retryModule.extractErrorCode(errorWithCause);
    if (code === 'ECONNRESET') {
      pass('T_H3', 'extractErrorCode from cause', `code: ${code}`);
    } else {
      fail('T_H3', 'extractErrorCode from cause', `Expected ECONNRESET, got ${code}`);
    }

    // withRetry wrapper function
    const wrappedFn = retryModule.withRetry(
      async (x) => x * 2,
      { operationName: 'test-wrap' }
    );
    if (typeof wrappedFn === 'function') {
      pass('T_H4', 'withRetry returns a function', 'function type');
    } else {
      fail('T_H4', 'withRetry returns a function', `Expected function, got ${typeof wrappedFn}`);
    }

    // Unknown error classification
    const unknownError = new Error('Some random error');
    const unknownClass = retryModule.classifyError(unknownError);
    if (unknownClass.type === 'unknown' && unknownClass.shouldRetry === false) {
      pass('T_H5', 'Unknown error classified as unknown (no retry)', `type: ${unknownClass.type}`);
    } else {
      fail('T_H5', 'Unknown error classified as unknown', `type: ${unknownClass.type}`);
    }
  }

  // 4.8 PATTERN MATCHING TESTS

  function test_pattern_matching() {
    log('\n-- Error Message Pattern Matching');

    // "rate limit" pattern
    const rateLimitError = new Error('Rate limit exceeded, please wait');
    const rateLimitClass = retryModule.classifyError(rateLimitError);
    if (rateLimitClass.type === 'transient') {
      pass('T_P1', '"rate limit" pattern is transient', `type: ${rateLimitClass.type}`);
    } else {
      fail('T_P1', '"rate limit" pattern is transient', `type: ${rateLimitClass.type}`);
    }

    // "timeout" pattern
    const timeoutMsgError = new Error('Request timeout after 30s');
    const timeoutClass = retryModule.classifyError(timeoutMsgError);
    if (timeoutClass.type === 'transient') {
      pass('T_P2', '"timeout" pattern is transient', `type: ${timeoutClass.type}`);
    } else {
      fail('T_P2', '"timeout" pattern is transient', `type: ${timeoutClass.type}`);
    }

    // "forbidden" pattern
    const forbiddenError = new Error('Forbidden: Access denied');
    const forbiddenClass = retryModule.classifyError(forbiddenError);
    if (forbiddenClass.type === 'permanent') {
      pass('T_P3', '"forbidden" pattern is permanent', `type: ${forbiddenClass.type}`);
    } else {
      fail('T_P3', '"forbidden" pattern is permanent', `type: ${forbiddenClass.type}`);
    }

    // SQLite BUSY (transient)
    const sqliteBusyError = new Error('SQLITE_BUSY: database is locked');
    const sqliteClass = retryModule.classifyError(sqliteBusyError);
    if (sqliteClass.type === 'transient') {
      pass('T_P4', 'SQLITE_BUSY is transient', `type: ${sqliteClass.type}`);
    } else {
      fail('T_P4', 'SQLITE_BUSY is transient', `type: ${sqliteClass.type}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4.9 T185-T191: RETRY LOGIC TESTS (SPEC REQUIREMENTS)
  ──────────────────────────────────────────────────────────────── */

  // T185: Test retryWithBackoff() basic functionality
  async function test_T185_basic_functionality() {
    log('\n-- T185: retryWithBackoff() Basic Functionality');

    // T185a: Success on first attempt returns result
    let callCount = 0;
    const successFn = async () => {
      callCount++;
      return { data: 'test-result', success: true };
    };

    const result = await retryModule.retryWithBackoff(successFn, {
      operationName: 'T185-basic',
      baseDelayMs: 10,
    });

    if (result && result.data === 'test-result' && result.success === true && callCount === 1) {
      pass('T185a', 'retryWithBackoff returns result on success', `result.data: ${result.data}, calls: ${callCount}`);
    } else {
      fail('T185a', 'retryWithBackoff returns result on success', `result: ${JSON.stringify(result)}, calls: ${callCount}`);
    }

    // T185b: Function throws on all failures after exhausting retries
    let failCallCount = 0;
    const alwaysFailFn = async () => {
      failCallCount++;
      throw createHttpError(500, 'Server Error');
    };

    try {
      await retryModule.retryWithBackoff(alwaysFailFn, {
        operationName: 'T185-fail',
        maxRetries: 2,
        baseDelayMs: 10,
      });
      fail('T185b', 'retryWithBackoff throws after exhausting retries', 'Should have thrown');
    } catch (error) {
      // 1 initial + 2 retries = 3 attempts
      if (failCallCount === 3 && error.retriesExhausted === true) {
        pass('T185b', 'retryWithBackoff throws after exhausting retries', `attempts: ${failCallCount}, retriesExhausted: ${error.retriesExhausted}`);
      } else {
        fail('T185b', 'retryWithBackoff throws after exhausting retries', `attempts: ${failCallCount}, retriesExhausted: ${error.retriesExhausted}`);
      }
    }

    // T185c: Recovers on retry (fails once, succeeds second time)
    let recoveryAttempt = 0;
    const recoverFn = async () => {
      recoveryAttempt++;
      if (recoveryAttempt === 1) {
        throw createHttpError(503, 'Service Unavailable');
      }
      return 'recovered';
    };

    const recoveredResult = await retryModule.retryWithBackoff(recoverFn, {
      operationName: 'T185-recover',
      baseDelayMs: 10,
    });

    if (recoveredResult === 'recovered' && recoveryAttempt === 2) {
      pass('T185c', 'retryWithBackoff recovers after transient failure', `result: ${recoveredResult}, attempts: ${recoveryAttempt}`);
    } else {
      fail('T185c', 'retryWithBackoff recovers after transient failure', `result: ${recoveredResult}, attempts: ${recoveryAttempt}`);
    }
  }

  // T186: Test exponential backoff: 1s, 2s, 4s intervals
  function test_T186_exponential_backoff() {
    log('\n-- T186: Exponential Backoff (1s, 2s, 4s intervals)');

    // T186a: calculateBackoff(0) returns 1000ms (1s)
    const delay0 = retryModule.calculateBackoff(0);
    if (delay0 === 1000) {
      pass('T186a', 'calculateBackoff(0) = 1000ms (1s)', `delay: ${delay0}ms`);
    } else {
      fail('T186a', 'calculateBackoff(0) = 1000ms (1s)', `Expected 1000, got ${delay0}`);
    }

    // T186b: calculateBackoff(1) returns 2000ms (2s)
    const delay1 = retryModule.calculateBackoff(1);
    if (delay1 === 2000) {
      pass('T186b', 'calculateBackoff(1) = 2000ms (2s)', `delay: ${delay1}ms`);
    } else {
      fail('T186b', 'calculateBackoff(1) = 2000ms (2s)', `Expected 2000, got ${delay1}`);
    }

    // T186c: calculateBackoff(2) returns 4000ms (4s)
    const delay2 = retryModule.calculateBackoff(2);
    if (delay2 === 4000) {
      pass('T186c', 'calculateBackoff(2) = 4000ms (4s)', `delay: ${delay2}ms`);
    } else {
      fail('T186c', 'calculateBackoff(2) = 4000ms (4s)', `Expected 4000, got ${delay2}`);
    }

    // T186d: getBackoffSequence returns [1000, 2000, 4000]
    const sequence = retryModule.getBackoffSequence();
    const expectedSequence = [1000, 2000, 4000];
    const sequenceMatches = sequence.length === 3 &&
      sequence[0] === expectedSequence[0] &&
      sequence[1] === expectedSequence[1] &&
      sequence[2] === expectedSequence[2];

    if (sequenceMatches) {
      pass('T186d', 'getBackoffSequence returns [1000, 2000, 4000]', `sequence: [${sequence.join(', ')}]`);
    } else {
      fail('T186d', 'getBackoffSequence returns [1000, 2000, 4000]', `Expected [1000, 2000, 4000], got [${sequence.join(', ')}]`);
    }

    // T186e: Custom config respects baseDelayMs and exponentialBase
    const customConfig = { maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5000, exponentialBase: 3 };
    const customDelay0 = retryModule.calculateBackoff(0, customConfig);
    const customDelay1 = retryModule.calculateBackoff(1, customConfig);
    const customDelay2 = retryModule.calculateBackoff(2, customConfig);
    // 500 * 3^0 = 500, 500 * 3^1 = 1500, 500 * 3^2 = 4500

    if (customDelay0 === 500 && customDelay1 === 1500 && customDelay2 === 4500) {
      pass('T186e', 'Custom config: base=500, exp=3 → [500, 1500, 4500]', `delays: [${customDelay0}, ${customDelay1}, ${customDelay2}]`);
    } else {
      fail('T186e', 'Custom config: base=500, exp=3 → [500, 1500, 4500]', `Expected [500, 1500, 4500], got [${customDelay0}, ${customDelay1}, ${customDelay2}]`);
    }

    // T186f: maxDelayMs caps the backoff delay
    const cappedConfig = { maxRetries: 5, baseDelayMs: 1000, maxDelayMs: 3000, exponentialBase: 2 };
    const cappedDelay3 = retryModule.calculateBackoff(3, cappedConfig); // Would be 8000, but capped at 3000
    if (cappedDelay3 === 3000) {
      pass('T186f', 'maxDelayMs caps backoff (8000 → 3000)', `delay: ${cappedDelay3}ms`);
    } else {
      fail('T186f', 'maxDelayMs caps backoff (8000 → 3000)', `Expected 3000, got ${cappedDelay3}`);
    }
  }

  // T187: Test transient error retry: 5xx status codes
  function test_T187_transient_5xx_errors() {
    log('\n-- T187: Transient Error Retry (5xx status codes)');

    const statusCodes5xx = [500, 502, 503, 504, 520, 521, 522, 523, 524];
    let allPassed = true;

    statusCodes5xx.forEach((code, idx) => {
      const error = createHttpError(code, `Error ${code}`);
      const classification = retryModule.classifyError(error);

      if (classification.type === 'transient' && classification.shouldRetry === true) {
        pass(`T187${String.fromCharCode(97 + idx)}`, `HTTP ${code} is classified as transient`, `shouldRetry: ${classification.shouldRetry}`);
      } else {
        fail(`T187${String.fromCharCode(97 + idx)}`, `HTTP ${code} is classified as transient`, `type: ${classification.type}, shouldRetry: ${classification.shouldRetry}`);
        allPassed = false;
      }
    });

    // T187j: 429 (Rate Limited) is also transient
    const error429 = createHttpError(429, 'Too Many Requests');
    const class429 = retryModule.classifyError(error429);
    if (class429.type === 'transient' && class429.shouldRetry === true) {
      pass('T187j', 'HTTP 429 (Rate Limited) is transient', `shouldRetry: ${class429.shouldRetry}`);
    } else {
      fail('T187j', 'HTTP 429 (Rate Limited) is transient', `type: ${class429.type}`);
      allPassed = false;
    }

    // T187k: 408 (Request Timeout) is transient
    const error408 = createHttpError(408, 'Request Timeout');
    const class408 = retryModule.classifyError(error408);
    if (class408.type === 'transient' && class408.shouldRetry === true) {
      pass('T187k', 'HTTP 408 (Request Timeout) is transient', `shouldRetry: ${class408.shouldRetry}`);
    } else {
      fail('T187k', 'HTTP 408 (Request Timeout) is transient', `type: ${class408.type}`);
      allPassed = false;
    }

    return allPassed;
  }

  // T188: Test transient error retry: ETIMEDOUT, ECONNRESET, ECONNREFUSED
  function test_T188_transient_network_errors() {
    log('\n-- T188: Transient Error Retry (Network error codes)');

    // T188a: ETIMEDOUT is transient
    const etimedoutError = createNetworkError('ETIMEDOUT', 'Connection timed out');
    const classTimeout = retryModule.classifyError(etimedoutError);
    if (classTimeout.type === 'transient' && classTimeout.shouldRetry === true) {
      pass('T188a', 'ETIMEDOUT is classified as transient', `reason: ${classTimeout.reason}`);
    } else {
      fail('T188a', 'ETIMEDOUT is classified as transient', `type: ${classTimeout.type}`);
    }

    // T188b: ECONNRESET is transient
    const econnresetError = createNetworkError('ECONNRESET', 'Connection reset by peer');
    const classReset = retryModule.classifyError(econnresetError);
    if (classReset.type === 'transient' && classReset.shouldRetry === true) {
      pass('T188b', 'ECONNRESET is classified as transient', `reason: ${classReset.reason}`);
    } else {
      fail('T188b', 'ECONNRESET is classified as transient', `type: ${classReset.type}`);
    }

    // T188c: ECONNREFUSED is transient
    const econnrefusedError = createNetworkError('ECONNREFUSED', 'Connection refused');
    const classRefused = retryModule.classifyError(econnrefusedError);
    if (classRefused.type === 'transient' && classRefused.shouldRetry === true) {
      pass('T188c', 'ECONNREFUSED is classified as transient', `reason: ${classRefused.reason}`);
    } else {
      fail('T188c', 'ECONNREFUSED is classified as transient', `type: ${classRefused.type}`);
    }

    // T188d: ENOTFOUND is transient
    const enotfoundError = createNetworkError('ENOTFOUND', 'DNS lookup failed');
    const classNotFound = retryModule.classifyError(enotfoundError);
    if (classNotFound.type === 'transient' && classNotFound.shouldRetry === true) {
      pass('T188d', 'ENOTFOUND is classified as transient', `reason: ${classNotFound.reason}`);
    } else {
      fail('T188d', 'ENOTFOUND is classified as transient', `type: ${classNotFound.type}`);
    }

    // T188e: ENETUNREACH is transient
    const enetunreachError = createNetworkError('ENETUNREACH', 'Network unreachable');
    const classNetUnreach = retryModule.classifyError(enetunreachError);
    if (classNetUnreach.type === 'transient' && classNetUnreach.shouldRetry === true) {
      pass('T188e', 'ENETUNREACH is classified as transient', `reason: ${classNetUnreach.reason}`);
    } else {
      fail('T188e', 'ENETUNREACH is classified as transient', `type: ${classNetUnreach.type}`);
    }

    // T188f: EHOSTUNREACH is transient
    const ehostunreachError = createNetworkError('EHOSTUNREACH', 'Host unreachable');
    const classHostUnreach = retryModule.classifyError(ehostunreachError);
    if (classHostUnreach.type === 'transient' && classHostUnreach.shouldRetry === true) {
      pass('T188f', 'EHOSTUNREACH is classified as transient', `reason: ${classHostUnreach.reason}`);
    } else {
      fail('T188f', 'EHOSTUNREACH is classified as transient', `type: ${classHostUnreach.type}`);
    }

    // T188g: isTransientError() helper returns true for network errors
    if (retryModule.isTransientError(etimedoutError) === true &&
        retryModule.isTransientError(econnresetError) === true &&
        retryModule.isTransientError(econnrefusedError) === true) {
      pass('T188g', 'isTransientError() returns true for network errors', 'All 3 network errors verified');
    } else {
      fail('T188g', 'isTransientError() returns true for network errors', 'One or more failed');
    }
  }

  // T189: Test permanent error fail-fast: 401, 403 status codes
  function test_T189_permanent_error_failfast() {
    log('\n-- T189: Permanent Error Fail-Fast (401, 403)');

    // T189a: HTTP 401 is permanent
    const error401 = createHttpError(401, 'Unauthorized');
    const class401 = retryModule.classifyError(error401);
    if (class401.type === 'permanent' && class401.shouldRetry === false) {
      pass('T189a', 'HTTP 401 is classified as permanent', `shouldRetry: ${class401.shouldRetry}`);
    } else {
      fail('T189a', 'HTTP 401 is classified as permanent', `type: ${class401.type}, shouldRetry: ${class401.shouldRetry}`);
    }

    // T189b: HTTP 403 is permanent
    const error403 = createHttpError(403, 'Forbidden');
    const class403 = retryModule.classifyError(error403);
    if (class403.type === 'permanent' && class403.shouldRetry === false) {
      pass('T189b', 'HTTP 403 is classified as permanent', `shouldRetry: ${class403.shouldRetry}`);
    } else {
      fail('T189b', 'HTTP 403 is classified as permanent', `type: ${class403.type}, shouldRetry: ${class403.shouldRetry}`);
    }

    // T189c: HTTP 404 is permanent
    const error404 = createHttpError(404, 'Not Found');
    const class404 = retryModule.classifyError(error404);
    if (class404.type === 'permanent' && class404.shouldRetry === false) {
      pass('T189c', 'HTTP 404 is classified as permanent', `shouldRetry: ${class404.shouldRetry}`);
    } else {
      fail('T189c', 'HTTP 404 is classified as permanent', `type: ${class404.type}, shouldRetry: ${class404.shouldRetry}`);
    }

    // T189d: HTTP 400 is permanent
    const error400 = createHttpError(400, 'Bad Request');
    const class400 = retryModule.classifyError(error400);
    if (class400.type === 'permanent' && class400.shouldRetry === false) {
      pass('T189d', 'HTTP 400 is classified as permanent', `shouldRetry: ${class400.shouldRetry}`);
    } else {
      fail('T189d', 'HTTP 400 is classified as permanent', `type: ${class400.type}, shouldRetry: ${class400.shouldRetry}`);
    }

    // T189e: isPermanentError() helper returns true for permanent errors
    if (retryModule.isPermanentError(error401) === true &&
        retryModule.isPermanentError(error403) === true &&
        retryModule.isPermanentError(error404) === true) {
      pass('T189e', 'isPermanentError() returns true for permanent errors', 'All 3 verified');
    } else {
      fail('T189e', 'isPermanentError() returns true for permanent errors', 'One or more failed');
    }
  }

  // T190: Test isPermanent flag on permanent errors
  async function test_T190_isPermanent_flag() {
    log('\n-- T190: isPermanent Flag on Permanent Errors');

    // T190a: Thrown error has isPermanent = true for 401
    let attempt1 = 0;
    const permanentFn1 = async () => {
      attempt1++;
      throw createHttpError(401, 'Unauthorized');
    };

    try {
      await retryModule.retryWithBackoff(permanentFn1, {
        operationName: 'T190-perm',
        baseDelayMs: 10,
      });
      fail('T190a', 'isPermanent flag set on 401 error', 'Should have thrown');
    } catch (error) {
      if (error.isPermanent === true && attempt1 === 1) {
        pass('T190a', 'isPermanent flag set on 401 error', `isPermanent: ${error.isPermanent}, attempts: ${attempt1}`);
      } else {
        fail('T190a', 'isPermanent flag set on 401 error', `isPermanent: ${error.isPermanent}, attempts: ${attempt1}`);
      }
    }

    // T190b: Thrown error has isPermanent = true for 403
    let attempt2 = 0;
    const permanentFn2 = async () => {
      attempt2++;
      throw createHttpError(403, 'Forbidden');
    };

    try {
      await retryModule.retryWithBackoff(permanentFn2, {
        operationName: 'T190-perm2',
        baseDelayMs: 10,
      });
      fail('T190b', 'isPermanent flag set on 403 error', 'Should have thrown');
    } catch (error) {
      if (error.isPermanent === true && attempt2 === 1) {
        pass('T190b', 'isPermanent flag set on 403 error', `isPermanent: ${error.isPermanent}, attempts: ${attempt2}`);
      } else {
        fail('T190b', 'isPermanent flag set on 403 error', `isPermanent: ${error.isPermanent}, attempts: ${attempt2}`);
      }
    }

    // T190c: No retries made for permanent errors (fail-fast behavior)
    let attempt3 = 0;
    const permanentFn3 = async () => {
      attempt3++;
      throw createHttpError(404, 'Not Found');
    };

    try {
      await retryModule.retryWithBackoff(permanentFn3, {
        operationName: 'T190-noretry',
        maxRetries: 3,
        baseDelayMs: 10,
      });
      fail('T190c', 'No retries for permanent errors (fail-fast)', 'Should have thrown');
    } catch (error) {
      // Only 1 attempt should be made (no retries)
      if (attempt3 === 1 && error.isPermanent === true) {
        pass('T190c', 'No retries for permanent errors (fail-fast)', `attempts: ${attempt3} (expected 1)`);
      } else {
        fail('T190c', 'No retries for permanent errors (fail-fast)', `attempts: ${attempt3}, expected 1`);
      }
    }

    // T190d: Error cause is preserved
    let attempt4 = 0;
    const originalError = createHttpError(401, 'Original auth error');
    const permanentFn4 = async () => {
      attempt4++;
      throw originalError;
    };

    try {
      await retryModule.retryWithBackoff(permanentFn4, {
        operationName: 'T190-cause',
        baseDelayMs: 10,
      });
      fail('T190d', 'Error cause preserved on permanent error', 'Should have thrown');
    } catch (error) {
      if (error.cause === originalError) {
        pass('T190d', 'Error cause preserved on permanent error', 'cause === originalError');
      } else {
        fail('T190d', 'Error cause preserved on permanent error', `cause: ${error.cause?.message}`);
      }
    }
  }

  // T191: Test retry attempt logging with error classification
  async function test_T191_retry_logging() {
    log('\n-- T191: Retry Attempt Logging with Error Classification');

    // T191a: attemptLog is attached to thrown error
    let attempt1 = 0;
    const failFn1 = async () => {
      attempt1++;
      throw createHttpError(503, 'Service Unavailable');
    };

    try {
      await retryModule.retryWithBackoff(failFn1, {
        operationName: 'T191-log',
        maxRetries: 2,
        baseDelayMs: 10,
      });
      fail('T191a', 'attemptLog attached to thrown error', 'Should have thrown');
    } catch (error) {
      if (error.attemptLog && Array.isArray(error.attemptLog) && error.attemptLog.length === 3) {
        pass('T191a', 'attemptLog attached to thrown error', `attemptLog.length: ${error.attemptLog.length}`);
      } else {
        fail('T191a', 'attemptLog attached to thrown error', `attemptLog: ${error.attemptLog}`);
      }
    }

    // T191b: Each attempt log entry has errorType classification
    let attempt2 = 0;
    const failFn2 = async () => {
      attempt2++;
      throw createHttpError(500, 'Internal Server Error');
    };

    try {
      await retryModule.retryWithBackoff(failFn2, {
        operationName: 'T191-errortype',
        maxRetries: 1,
        baseDelayMs: 10,
      });
      fail('T191b', 'attemptLog entries have errorType', 'Should have thrown');
    } catch (error) {
      const allHaveErrorType = error.attemptLog.every(entry => entry.errorType !== undefined);
      const allTransient = error.attemptLog.every(entry => entry.errorType === 'transient');
      if (allHaveErrorType && allTransient) {
        pass('T191b', 'attemptLog entries have errorType', `All entries have errorType=transient`);
      } else {
        fail('T191b', 'attemptLog entries have errorType', `errorTypes: ${error.attemptLog.map(e => e.errorType).join(', ')}`);
      }
    }

    // T191c: Permanent error attemptLog has only 1 entry
    let attempt3 = 0;
    const permanentFn = async () => {
      attempt3++;
      throw createHttpError(401, 'Unauthorized');
    };

    try {
      await retryModule.retryWithBackoff(permanentFn, {
        operationName: 'T191-perm',
        maxRetries: 3,
        baseDelayMs: 10,
      });
      fail('T191c', 'Permanent error attemptLog has 1 entry', 'Should have thrown');
    } catch (error) {
      if (error.attemptLog && error.attemptLog.length === 1 && error.attemptLog[0].errorType === 'permanent') {
        pass('T191c', 'Permanent error attemptLog has 1 entry', `errorType: ${error.attemptLog[0].errorType}`);
      } else {
        fail('T191c', 'Permanent error attemptLog has 1 entry', `attemptLog.length: ${error.attemptLog?.length}`);
      }
    }

    // T191d: onRetry callback receives correct parameters
    const retryCallbackParams = [];
    let attempt4 = 0;
    const failFn4 = async () => {
      attempt4++;
      if (attempt4 < 3) {
        throw createHttpError(502, 'Bad Gateway');
      }
      return 'success';
    };

    await retryModule.retryWithBackoff(failFn4, {
      operationName: 'T191-callback',
      maxRetries: 3,
      baseDelayMs: 10,
      onRetry: (attemptNum, error, delay) => {
        retryCallbackParams.push({ attemptNum, errorMessage: error.message, delay });
      },
    });

    // Should have 2 retry callbacks (fail, fail, success)
    if (retryCallbackParams.length === 2 &&
        retryCallbackParams[0].attemptNum === 0 &&
        retryCallbackParams[1].attemptNum === 1 &&
        typeof retryCallbackParams[0].delay === 'number') {
      pass('T191d', 'onRetry callback receives (attempt, error, delay)', `callbacks: ${retryCallbackParams.length}, first attempt: ${retryCallbackParams[0].attemptNum}`);
    } else {
      fail('T191d', 'onRetry callback receives (attempt, error, delay)', `callbacks: ${retryCallbackParams.length}`);
    }

    // T191e: classificationReason is included in attemptLog
    let attempt5 = 0;
    const failFn5 = async () => {
      attempt5++;
      throw createHttpError(503, 'Service Unavailable');
    };

    try {
      await retryModule.retryWithBackoff(failFn5, {
        operationName: 'T191-reason',
        maxRetries: 1,
        baseDelayMs: 10,
      });
    } catch (error) {
      const hasReason = error.attemptLog.every(entry => entry.classificationReason && entry.classificationReason.includes('HTTP 503'));
      if (hasReason) {
        pass('T191e', 'attemptLog includes classificationReason', `reason: ${error.attemptLog[0].classificationReason}`);
      } else {
        fail('T191e', 'attemptLog includes classificationReason', `reason: ${error.attemptLog[0]?.classificationReason}`);
      }
    }

    // T191f: Successful attempt is also logged
    let attempt6 = 0;
    const recoverFn = async () => {
      attempt6++;
      if (attempt6 === 1) {
        throw createHttpError(500, 'Server Error');
      }
      return 'recovered';
    };

    // We need to capture the log somehow - since retryWithBackoff doesn't return attemptLog on success,
    // we verify by checking that the function completed successfully after retry
    const result = await retryModule.retryWithBackoff(recoverFn, {
      operationName: 'T191-success',
      baseDelayMs: 10,
    });

    if (result === 'recovered' && attempt6 === 2) {
      pass('T191f', 'Successful recovery after retry works correctly', `result: ${result}, attempts: ${attempt6}`);
    } else {
      fail('T191f', 'Successful recovery after retry works correctly', `result: ${result}, attempts: ${attempt6}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('====================================================');
    log('TEST: Retry with Exponential Backoff (T101-T104, T185-T191)');
    log('====================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load module first
    if (!test_module_loads()) {
      log('\n[WARNING] Module failed to load. Aborting tests.');
      return results;
    }

    // Run synchronous tests (original T101-T104 suite)
    test_transient_error_classification();   // CHK-181
    test_permanent_error_classification();   // CHK-184
    test_exponential_backoff();              // CHK-182
    test_max_retries();                      // CHK-183
    test_retry_logging();                    // CHK-185
    test_helper_functions();
    test_pattern_matching();

    // Run async tests (original suite)
    await test_retry_with_backoff();         // T104

    // Run T185-T191 tests (new suite)
    log('\n====================================================');
    log('T185-T191: RETRY LOGIC SPEC TESTS');
    log('====================================================');

    await test_T185_basic_functionality();   // T185
    test_T186_exponential_backoff();         // T186
    test_T187_transient_5xx_errors();        // T187
    test_T188_transient_network_errors();    // T188
    test_T189_permanent_error_failfast();    // T189
    await test_T190_isPermanent_flag();      // T190
    await test_T191_retry_logging();         // T191

    // Summary
    log('\n====================================================');
    log('TEST SUMMARY');
    log('====================================================');
    log(`Passed:  ${results.passed}`);
    log(`Failed:  ${results.failed}`);
    log(`Skipped: ${results.skipped}`);
    log(`Total:   ${results.passed + results.failed + results.skipped}`);
    log('');

    if (results.failed === 0) {
      log('ALL TESTS PASSED!');
    } else {
      log('Some tests failed. Review output above.');
    }

    return results;
  }

  // Run if executed directly
  if (require.main === module) {
    runTests().then((r) => {
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { runTests };

})();
