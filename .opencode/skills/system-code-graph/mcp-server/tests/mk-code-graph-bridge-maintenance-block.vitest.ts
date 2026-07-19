// -----------------------------------------------------------------------------
// MODULE: mk-code-graph Bridge Maintenance-Block Tests
// -----------------------------------------------------------------------------
// The prompt-time bridge must block maintenance/mutating tools regardless of the
// alias casing used. The downstream CLI resolves snake, kebab, and camel aliases
// to the same canonical tool, so the bridge blocklist must normalize before the
// policy check or a --tool codeGraphScan invocation slips past it onto a warm daemon.

import { describe, expect, it } from 'vitest';

import { runCli } from '../plugin-bridges/mk-code-graph-bridge.mjs';

interface BridgeResponse {
  readonly status: string;
  readonly error?: string;
  readonly metadata?: { readonly route?: string; readonly toolName?: string };
}

const MAINTENANCE_ALIASES = [
  'code_graph_scan',
  'code-graph-scan',
  'codeGraphScan',
  'code_graph_apply',
  'code-graph-apply',
  'codeGraphApply',
  'code_graph_verify',
  'code-graph-verify',
  'codeGraphVerify',
];

describe('mk-code-graph bridge maintenance block', () => {
  for (const alias of MAINTENANCE_ALIASES) {
    it(`blocks maintenance tool via alias "${alias}" before any daemon contact`, async () => {
      const result = (await runCli({ toolName: alias, timeoutMs: 1000, probeTimeoutMs: 50 })) as BridgeResponse;

      expect(result.status).toBe('skipped');
      expect(result.error).toBe('MAINTENANCE_TOOL_BLOCKED');
      expect(result.metadata?.route).toBe('prompt_safe_policy');
    });
  }

  it('does not block a read tool with the maintenance policy', async () => {
    const result = (await runCli({ toolName: 'code-graph-status', timeoutMs: 500, probeTimeoutMs: 50 })) as BridgeResponse;

    // Read tools may still be skipped (e.g. no warm daemon in CI), but never via the
    // maintenance policy route — that is the bypass this regression guards against.
    expect(result.metadata?.route).not.toBe('prompt_safe_policy');
    expect(result.error).not.toBe('MAINTENANCE_TOOL_BLOCKED');
  });
});
