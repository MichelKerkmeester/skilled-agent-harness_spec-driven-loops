import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const bridge = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as {
  resolveLeaseProbeAttempts: (env?: Record<string, string | undefined>) => number;
  resolveLeaseProbeRetryTimeoutMs: (env?: Record<string, string | undefined>) => number;
  resolveLeaseProbeRetryBackoffMs: (env?: Record<string, string | undefined>) => number;
  probeLeaseHolderWithRetries: (
    socketPath: string,
    options: {
      probe?: (socketPath: string, opts: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
      attempts?: number;
      firstTimeoutMs?: number;
      retryTimeoutMs?: number;
      retryBackoffMs?: number;
      connect?: unknown;
      sleepFn?: (ms: number) => Promise<void>;
      onRetry?: (attempt: number, total: number, result: { status: string; reason?: string }) => void;
    },
  ) => Promise<{ status: string; reason?: string }>;
};

const noSleep = () => Promise.resolve();

describe('lease probe retry config', () => {
  it('defaults to 2 attempts (one retry) and honors the retries env', () => {
    // One retry is the floor of "consecutive failures" — a single transient miss must not reap.
    expect(bridge.resolveLeaseProbeAttempts({})).toBe(2);
    expect(bridge.resolveLeaseProbeAttempts({ SPECKIT_LEASE_PROBE_RETRIES: '0' })).toBe(1);
    expect(bridge.resolveLeaseProbeAttempts({ SPECKIT_LEASE_PROBE_RETRIES: '3' })).toBe(4);
    expect(bridge.resolveLeaseProbeAttempts({ SPECKIT_LEASE_PROBE_RETRIES: 'bad' })).toBe(2);
  });

  it('defaults the retry timeout to 1500ms and clamps to the probe ceiling', () => {
    // Keeping the retry short bounds the worst-case total (first full probe + one short retry) under
    // the probe grace ceiling so a hung owner cannot blow the launcher's startup budget.
    expect(bridge.resolveLeaseProbeRetryTimeoutMs({})).toBe(1500);
    expect(bridge.resolveLeaseProbeRetryTimeoutMs({ SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '99999' })).toBe(6999);
    expect(bridge.resolveLeaseProbeRetryBackoffMs({})).toBe(250);
  });
});

describe('probeLeaseHolderWithRetries', () => {
  it('returns alive without retrying when the first probe succeeds', async () => {
    let calls = 0;
    const result = await bridge.probeLeaseHolderWithRetries('tcp://x', {
      attempts: 2,
      sleepFn: noSleep,
      probe: async () => { calls += 1; return { status: 'alive' }; },
    });
    expect(result.status).toBe('alive');
    expect(calls).toBe(1);
  });

  it('recovers when a transient miss is followed by a live probe (no respawn)', async () => {
    let calls = 0;
    const result = await bridge.probeLeaseHolderWithRetries('tcp://x', {
      attempts: 2,
      sleepFn: noSleep,
      probe: async () => { calls += 1; return calls === 1 ? { status: 'dead', reason: 'blip' } : { status: 'alive' }; },
    });
    expect(result.status).toBe('alive');
    expect(calls).toBe(2);
  });

  it('declares dead only after all attempts fail, probing exactly `attempts` times', async () => {
    let calls = 0;
    const result = await bridge.probeLeaseHolderWithRetries('tcp://x', {
      attempts: 3,
      sleepFn: noSleep,
      probe: async () => { calls += 1; return { status: 'dead', reason: 'gone' }; },
    });
    expect(result.status).toBe('dead');
    expect(result.reason).toBe('gone');
    expect(calls).toBe(3);
  });

  it('backs off between attempts and reports each retry', async () => {
    const backoffs: number[] = [];
    const retries: Array<[number, number]> = [];
    await bridge.probeLeaseHolderWithRetries('tcp://x', {
      attempts: 3,
      retryBackoffMs: 250,
      sleepFn: async (ms) => { backoffs.push(ms); },
      onRetry: (attempt, total) => { retries.push([attempt, total]); },
      probe: async () => ({ status: 'dead', reason: 'gone' }),
    });
    // Two gaps between three attempts: backoff fires twice, a retry is reported for attempts 1 and 2.
    expect(backoffs).toEqual([250, 250]);
    expect(retries).toEqual([[1, 3], [2, 3]]);
  });
});
