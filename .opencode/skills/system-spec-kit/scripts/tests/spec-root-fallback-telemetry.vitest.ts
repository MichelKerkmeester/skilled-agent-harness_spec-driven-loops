// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Fallback Telemetry Tests
// ───────────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it } from 'vitest';

import {
  getFallbackTelemetry,
  isCompatibilityWindowClean,
  recordLegacyFallbackHit,
  recordLegacyWriteAttempt,
  resetFallbackTelemetry,
} from '../core/spec-root-fallback-telemetry.js';

describe('spec root fallback telemetry', () => {
  beforeEach(() => {
    resetFallbackTelemetry();
  });

  it('starts with an empty clean compatibility window', () => {
    expect(getFallbackTelemetry()).toEqual({
      legacyFallbackHits: 0,
      legacyWriteAttempts: 0,
      contexts: [],
    });
    expect(isCompatibilityWindowClean()).toBe(true);
  });

  it('counts fallback hits and write attempts with their contexts', () => {
    recordLegacyFallbackHit('resume resolver');
    recordLegacyFallbackHit('indexing resolver');
    recordLegacyWriteAttempt('packet generator');

    expect(getFallbackTelemetry()).toEqual({
      legacyFallbackHits: 2,
      legacyWriteAttempts: 1,
      contexts: ['resume resolver', 'indexing resolver', 'packet generator'],
    });
    expect(isCompatibilityWindowClean()).toBe(false);
  });

  it('treats either telemetry category as a dirty compatibility window', () => {
    recordLegacyFallbackHit('reader');
    expect(isCompatibilityWindowClean()).toBe(false);

    resetFallbackTelemetry();
    recordLegacyWriteAttempt('writer');
    expect(isCompatibilityWindowClean()).toBe(false);
  });

  it('resets counters and contexts back to a clean window', () => {
    recordLegacyFallbackHit('reader');
    recordLegacyWriteAttempt('writer');

    resetFallbackTelemetry();

    expect(getFallbackTelemetry()).toEqual({
      legacyFallbackHits: 0,
      legacyWriteAttempts: 0,
      contexts: [],
    });
    expect(isCompatibilityWindowClean()).toBe(true);
  });

  it('returns contexts as a snapshot that cannot mutate internal state', () => {
    recordLegacyFallbackHit('reader');
    getFallbackTelemetry().contexts.push('external mutation');

    expect(getFallbackTelemetry().contexts).toEqual(['reader']);
  });
});
