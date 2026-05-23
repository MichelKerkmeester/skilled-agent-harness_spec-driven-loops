// ───────────────────────────────────────────────────────────────
// TEST: Cross-Encoder Circuit Breaker (G3)
// ───────────────────────────────────────────────────────────────
// Verifies the circuit breaker in cross-encoder.ts behaves correctly:
// opens after threshold failures, auto-resets after cooldown, and
// maintains independent state per provider.
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { __testables } from '../lib/search/cross-encoder';

const {
  getCircuit,
  isCircuitOpen,
  recordSuccess,
  recordFailure,
  circuitBreakers,
  CIRCUIT_FAILURE_THRESHOLD,
  CIRCUIT_COOLDOWN_MS,
} = __testables;

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('cross-encoder circuit breaker', () => {
  beforeEach(() => {
    circuitBreakers.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with circuit closed (0 failures)', () => {
    const state = getCircuit('local');
    expect(state.failures).toBe(0);
    expect(state.openedAt).toBeNull();
    expect(isCircuitOpen('local')).toBe(false);
  });

  it('recordFailure increments failure count', () => {
    recordFailure('local');
    expect(getCircuit('local').failures).toBe(1);
    recordFailure('local');
    expect(getCircuit('local').failures).toBe(2);
  });

  it(`opens circuit at CIRCUIT_FAILURE_THRESHOLD (${CIRCUIT_FAILURE_THRESHOLD}) failures`, () => {
    // Record failures up to threshold
    for (let i = 0; i < CIRCUIT_FAILURE_THRESHOLD; i++) {
      recordFailure('local');
    }
    expect(getCircuit('local').openedAt).not.toBeNull();
    expect(isCircuitOpen('local')).toBe(true);
  });

  it('isCircuitOpen returns true when opened', () => {
    // Open the circuit
    for (let i = 0; i < CIRCUIT_FAILURE_THRESHOLD; i++) {
      recordFailure('local');
    }
    expect(isCircuitOpen('local')).toBe(true);
  });

  it('isCircuitOpen returns false after CIRCUIT_COOLDOWN_MS elapses', () => {
    // Open the circuit
    for (let i = 0; i < CIRCUIT_FAILURE_THRESHOLD; i++) {
      recordFailure('local');
    }
    expect(isCircuitOpen('local')).toBe(true);

    // Advance time past cooldown
    vi.advanceTimersByTime(CIRCUIT_COOLDOWN_MS);

    // Half-open: first check after cooldown resets and returns false
    expect(isCircuitOpen('local')).toBe(false);
  });

  it('recordSuccess resets failures to 0', () => {
    recordFailure('local');
    recordFailure('local');
    expect(getCircuit('local').failures).toBe(2);

    recordSuccess('local');
    expect(getCircuit('local').failures).toBe(0);
    expect(getCircuit('local').openedAt).toBeNull();
  });

  // 022/013: 'different providers have independent circuit states' test removed —
  // the only supported reranker provider is 'local'. The circuit-breaker Map
  // still keys by string, but the multi-provider isolation contract is no
  // longer a behavior worth asserting.

  it('half-open: first check after cooldown resets openedAt and failures', () => {
    // Open the circuit
    for (let i = 0; i < CIRCUIT_FAILURE_THRESHOLD; i++) {
      recordFailure('local');
    }
    expect(isCircuitOpen('local')).toBe(true);
    const state = getCircuit('local');
    expect(state.openedAt).not.toBeNull();

    // Advance past cooldown
    vi.advanceTimersByTime(CIRCUIT_COOLDOWN_MS);

    // isCircuitOpen triggers half-open reset
    expect(isCircuitOpen('local')).toBe(false);
    expect(state.failures).toBe(0);
    expect(state.openedAt).toBeNull();
  });

  it('circuit stays open within cooldown window', () => {
    for (let i = 0; i < CIRCUIT_FAILURE_THRESHOLD; i++) {
      recordFailure('local');
    }
    // Advance to just before cooldown expires
    vi.advanceTimersByTime(CIRCUIT_COOLDOWN_MS - 1);
    expect(isCircuitOpen('local')).toBe(true);
  });
});
