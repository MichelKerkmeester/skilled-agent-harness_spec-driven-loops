// ───────────────────────────────────────────────────────────────────
// MODULE: Code Index Launcher Identity Guards Tests
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

type OwnerUidMatchesInput = {
  leasePath: string;
  recordedUid?: number | null;
  currentUid: number;
  statUid: (leasePath: string) => number;
};

type VerifyPidIdentityInput = {
  pid: number;
  recordedCmdlineBasename: string;
  recordedStartMs: number;
  toleranceMs: number;
  lookups: {
    readCmdline: (pid: number) => string | null;
    readStartMs: (pid: number) => number | null;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST SUBJECT (CJS REQUIRE)
// ─────────────────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const {
  ownerUidMatches,
  verifyPidIdentity,
} = require('./mk-code-index-launcher.cjs') as {
  ownerUidMatches: (input: OwnerUidMatchesInput) => boolean;
  verifyPidIdentity: (input: VerifyPidIdentityInput) => { ok: boolean; reason: string };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. TEST SUITE
// ─────────────────────────────────────────────────────────────────────────────

describe('ownerUidMatches', () => {
  it('returns true when recordedUid matches currentUid', () => {
    const statUid = vi.fn(() => 2000);

    expect(ownerUidMatches({
      leasePath: '/tmp/lease.json',
      recordedUid: 1000,
      currentUid: 1000,
      statUid,
    })).toBe(true);
    expect(statUid).not.toHaveBeenCalled();
  });

  it('returns false when recordedUid differs from currentUid', () => {
    expect(ownerUidMatches({
      leasePath: '/tmp/lease.json',
      recordedUid: 1001,
      currentUid: 1000,
      statUid: () => 1000,
    })).toBe(false);
  });

  it('falls back to statUid when recordedUid is absent', () => {
    const statUid = vi.fn((leasePath: string) => {
      expect(leasePath).toBe('/tmp/lease.json');
      return 1000;
    });

    expect(ownerUidMatches({
      leasePath: '/tmp/lease.json',
      recordedUid: null,
      currentUid: 1000,
      statUid,
    })).toBe(true);
    expect(statUid).toHaveBeenCalledTimes(1);
  });

  it('returns false when statUid fallback differs from currentUid', () => {
    expect(ownerUidMatches({
      leasePath: '/tmp/lease.json',
      currentUid: 1000,
      statUid: () => 1001,
    })).toBe(false);
  });
});

describe('verifyPidIdentity', () => {
  function identityInput(overrides: Partial<VerifyPidIdentityInput>): VerifyPidIdentityInput {
    return {
      pid: 1234,
      recordedCmdlineBasename: 'node',
      recordedStartMs: 10_000,
      toleranceMs: 50,
      lookups: {
        readCmdline: () => '/usr/local/bin/node\0server.js',
        readStartMs: () => 10_025,
      },
      ...overrides,
    };
  }

  it('returns match when cmdline basename and start time match', () => {
    expect(verifyPidIdentity(identityInput({}))).toEqual({ ok: true, reason: 'match' });
  });

  it('returns cmdline-mismatch when the live cmdline basename differs', () => {
    expect(verifyPidIdentity(identityInput({
      lookups: {
        readCmdline: () => '/usr/bin/python3\0server.py',
        readStartMs: () => 10_025,
      },
    }))).toEqual({ ok: false, reason: 'cmdline-mismatch' });
  });

  it('returns start-time-mismatch when the live start time exceeds tolerance', () => {
    expect(verifyPidIdentity(identityInput({
      lookups: {
        readCmdline: () => '/usr/local/bin/node\0server.js',
        readStartMs: () => 10_051,
      },
    }))).toEqual({ ok: false, reason: 'start-time-mismatch' });
  });

  it('returns no-process when cmdline lookup has no live process', () => {
    const readStartMs = vi.fn(() => 10_000);

    expect(verifyPidIdentity(identityInput({
      lookups: {
        readCmdline: () => null,
        readStartMs,
      },
    }))).toEqual({ ok: false, reason: 'no-process' });
    expect(readStartMs).not.toHaveBeenCalled();
  });
});
