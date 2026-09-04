import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const bridge = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as {
  normalizeExistingServiceProbeResult: (result?: { status?: string; reason?: string; code?: string }) => {
    status: 'alive' | 'dead';
    kind: 'json-rpc-reply' | 'enoent' | 'econnrefused' | 'timeout' | 'unknown';
  };
  probeExistingService: (
    socketPath: string,
    opts?: Record<string, unknown>,
  ) => Promise<{ status: 'alive' | 'dead'; kind: string }>;
};

describe('probeExistingService', () => {
  it('normalizes a guaranteed-absent socket path to enoent', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'probe-existing-service-'));
    try {
      const socketPath = join(tempDir, 'missing.sock');
      await expect(bridge.probeExistingService(socketPath, { timeoutMs: 100 })).resolves.toEqual({
        status: 'dead',
        kind: 'enoent',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe('normalizeExistingServiceProbeResult', () => {
  it('maps a JSON-RPC reply to alive', () => {
    expect(bridge.normalizeExistingServiceProbeResult({ status: 'alive', reason: 'json-rpc-reply' })).toEqual({
      status: 'alive',
      kind: 'json-rpc-reply',
    });
  });

  it('maps known dead reasons and codes to stable kinds', () => {
    expect(bridge.normalizeExistingServiceProbeResult({ status: 'dead', reason: 'connect ECONNREFUSED /tmp/x.sock' })).toEqual({
      status: 'dead',
      kind: 'econnrefused',
    });
    expect(bridge.normalizeExistingServiceProbeResult({ status: 'dead', reason: 'timeout' })).toEqual({
      status: 'dead',
      kind: 'timeout',
    });
    expect(bridge.normalizeExistingServiceProbeResult({ status: 'dead', code: 'ENOENT' })).toEqual({
      status: 'dead',
      kind: 'enoent',
    });
  });

  it('maps unrecognized dead results to unknown', () => {
    expect(bridge.normalizeExistingServiceProbeResult({ status: 'dead', reason: 'closed-before-reply' })).toEqual({
      status: 'dead',
      kind: 'unknown',
    });
  });
});
