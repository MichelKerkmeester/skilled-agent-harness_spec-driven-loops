import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateBackoff, classifyError, getBackoffSequence, isPermanentError, isTransientError, retryWithBackoff } from './retry.js';

const FAST = { maxRetries: 3, baseDelayMs: 100, maxDelayMs: 10_000, exponentialBase: 2 };

test('classifies HTTP statuses and network codes', () => {
  assert.equal(isTransientError(Object.assign(new Error('rate limited'), { status: 429 })), true);
  assert.equal(isPermanentError(Object.assign(new Error('unauthorized'), { status: 401 })), true);
  assert.equal(isTransientError(Object.assign(new Error('reset'), { code: 'ECONNRESET' })), true);
  assert.equal(classifyError(null).shouldRetry, false);
});

test('backoff grows with the attempt, is capped, and the sequence has one entry per retry', () => {
  assert.ok(calculateBackoff(1, FAST) > calculateBackoff(0, FAST), 'later attempts wait longer');
  assert.equal(calculateBackoff(10, FAST), FAST.maxDelayMs, 'the cap holds');
  assert.equal(getBackoffSequence(FAST).length, FAST.maxRetries);
});

test('retryWithBackoff retries a transient failure and gives up on a permanent one', async () => {
  let calls = 0;
  const value = await retryWithBackoff(async () => {
    calls += 1;
    if (calls === 1) throw Object.assign(new Error('busy'), { status: 503 });
    return 'ok';
  }, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2, exponentialBase: 1 });
  assert.equal(value, 'ok');
  assert.equal(calls, 2);
  await assert.rejects(
    retryWithBackoff(async () => { throw Object.assign(new Error('forbidden'), { status: 403 }); }, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2, exponentialBase: 1 }),
    /forbidden/u,
  );
});
