import { describe, expect, it } from 'vitest';

import {
  createCodeIndexHarness,
  expectBlockedRender,
  parseJsonOutput,
  registerCodeIndexCliTeardown,
  textFromMcpResult,
} from './code-index-cli-harness.js';

registerCodeIndexCliTeardown();

describe('code-index CLI dual-client daemon attachment', () => {
  it('serves MCP and CLI clients through one isolated daemon lease', async () => {
    const harness = createCodeIndexHarness('dual-client');
    const warmup = await harness.runCli(['code-graph-status', '--format', 'json']);
    expect(warmup.exitCode).toBe(0);
    const warmupLease = harness.assertSingleOwnerLease();

    const [mcpResult, cliResult] = await Promise.all([
      harness.callMcpTool('code_graph_status', {}),
      harness.runCli(['code-graph-status', '--format', 'json']),
    ]);

    expect(cliResult.exitCode).toBe(0);
    expect(JSON.stringify(parseJsonOutput(cliResult))).toContain('readiness');
    expect(textFromMcpResult(mcpResult)).toContain('readiness');
    expect(harness.assertSingleOwnerLease().ownerPid).toBe(warmupLease.ownerPid);
  });

  it('fails closed when a secondary client requests an unknown tool', async () => {
    const harness = createCodeIndexHarness('dual-client-unknown-tool');
    harness.env.SPECKIT_CODE_GRAPH_INDEX_SKILLS = 'true';

    const unknownTool = await harness.callMcpTool('code_graph_not_registered', {});
    expect((unknownTool as { isError?: unknown }).isError).toBe(true);
    expect(textFromMcpResult(unknownTool)).toContain('Unknown mk-code-index tool');

    const cliResult = await harness.runCli(['code-graph-query', '--operation', 'outline', '--subject', 'missing', '--format', 'json']);
    expectBlockedRender(parseJsonOutput(cliResult));
  });
});
