import { describe, expect, it } from 'vitest';

import {
  createCodeIndexHarness,
  parseJsonOutput,
  registerCodeIndexCliTeardown,
} from './code-index-cli-harness.js';

registerCodeIndexCliTeardown();

describe('code-index CLI daemon teardown', () => {
  it('leaves no live process recorded by isolated daemon state', async () => {
    const harness = createCodeIndexHarness('zero-orphan');
    const result = await harness.runCli(['code-graph-status', '--format', 'json']);

    expect(result.exitCode).toBe(0);
    expect(JSON.stringify(parseJsonOutput(result))).toContain('readiness');

    await harness.cleanup();
    await harness.assertNoLiveRuntimePids();
  });

  it('does not leave worktree launchers after explicit cleanup', async () => {
    const harness = createCodeIndexHarness('zero-orphan-process-table');
    const result = await harness.runCli(['code-graph-status', '--format', 'json']);

    expect(result.exitCode).toBe(0);
    await harness.cleanup();

    const leftovers = await harness.listRuntimeProcesses();
    expect(leftovers).toEqual([]);
  });
});
