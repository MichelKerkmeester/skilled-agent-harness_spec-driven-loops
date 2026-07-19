import { describe, expect, it } from 'vitest';

import {
  createCodeIndexHarness,
  parseJsonOutput,
  registerCodeIndexCliTeardown,
} from './code-index-cli-harness.js';

registerCodeIndexCliTeardown();

describe('code-index CLI owner lease and respawn locking', () => {
  it('serializes concurrent launcher starts to one owner lease', async () => {
    const harness = createCodeIndexHarness('dual-spawn');

    const [first, second] = await Promise.all([
      harness.runCli(['code-graph-status', '--format', 'json']),
      harness.runCli(['code-graph-status', '--format', 'json']),
    ]);

    expect(first.exitCode).toBe(0);
    expect(second.exitCode).toBe(0);
    expect(JSON.stringify(parseJsonOutput(first))).toContain('readiness');
    expect(JSON.stringify(parseJsonOutput(second))).toContain('readiness');
    const lease = harness.assertSingleOwnerLease();
    expect(lease.ownerPid).toBeGreaterThan(1);
    harness.assertNoRespawnLock();
  });

  it('uses a fresh launcher after terminating the recorded daemon', async () => {
    const harness = createCodeIndexHarness('dead-socket-respawn');

    const initial = await harness.runCli(['code-graph-status', '--format', 'json']);
    expect(initial.exitCode).toBe(0);

    const terminated = await harness.killOwnerDaemon();

    const takeover = await harness.runCli(['code-graph-status', '--format', 'json']);
    expect(takeover.exitCode).toBe(0);
    expect(JSON.stringify(parseJsonOutput(takeover))).toContain('readiness');
    const lease = harness.assertSingleOwnerLease();
    expect(lease.ownerPid).not.toBe(terminated.ownerPid);
    harness.assertNoRespawnLock();
  });
});
