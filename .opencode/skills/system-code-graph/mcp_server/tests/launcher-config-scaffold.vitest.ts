import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-code-index-launcher.cjs') as {
  resolveStartupGraceMs: (env?: Record<string, string | undefined>) => number;
  resolveMaxInitMs: (env?: Record<string, string | undefined>) => number;
  reclaimDeadSocketEnabled: (env?: Record<string, string | undefined>) => boolean;
  launcherDiagnostic: (reason: string, fields?: Record<string, unknown>) => void;
};

describe('mk-code-index launcher additive config scaffold', () => {
  it('resolves startup grace, max init, and dead-socket reclaim env defaults and overrides', () => {
    expect(launcher.resolveStartupGraceMs({})).toBe(30000);
    expect(launcher.resolveStartupGraceMs({ SPECKIT_LAUNCHER_STARTUP_GRACE_MS: '45000' })).toBe(45000);
    expect(launcher.resolveStartupGraceMs({ SPECKIT_LAUNCHER_STARTUP_GRACE_MS: 'bad' })).toBe(30000);

    expect(launcher.resolveMaxInitMs({})).toBe(120000);
    expect(launcher.resolveMaxInitMs({ SPECKIT_LAUNCHER_MAX_INIT_MS: '180000' })).toBe(180000);
    expect(launcher.resolveMaxInitMs({ SPECKIT_LAUNCHER_MAX_INIT_MS: '0' })).toBe(120000);

    expect(launcher.reclaimDeadSocketEnabled({})).toBe(true);
    expect(launcher.reclaimDeadSocketEnabled({ SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET: '0' })).toBe(false);
    expect(launcher.reclaimDeadSocketEnabled({ SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET: 'false' })).toBe(false);
    expect(launcher.reclaimDeadSocketEnabled({ SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET: '1' })).toBe(true);
  });

  it('writes one launcher diagnostic line with reason and k=v fields', () => {
    const writes: string[] = [];
    const originalWrite = process.stderr.write;
    process.stderr.write = ((chunk: string | Uint8Array, ...args: unknown[]) => {
      writes.push(String(chunk));
      const callback = args.find((arg): arg is () => void => typeof arg === 'function');
      if (callback) callback();
      return true;
    }) as typeof process.stderr.write;

    try {
      launcher.launcherDiagnostic('probe-result', { ownerPid: 123, socketPath: '/tmp/demo.sock' });
    } finally {
      process.stderr.write = originalWrite;
    }

    expect(writes).toEqual([
      'LAUNCHER_DIAGNOSTIC: reason=probe-result ownerPid=123 socketPath=/tmp/demo.sock\n',
    ]);
  });
});
