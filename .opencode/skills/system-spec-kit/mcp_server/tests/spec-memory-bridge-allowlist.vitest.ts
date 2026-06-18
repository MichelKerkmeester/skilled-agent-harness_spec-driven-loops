// ───────────────────────────────────────────────────────────────
// MODULE: Spec Memory Bridge Allowlist Tests
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

const bridgePath = resolve(import.meta.dirname, '../plugin_bridges/mk-spec-memory-bridge.mjs');

interface BridgeModule {
  readonly promptSafeSpecMemoryBridgePolicy: (input: { request: string; toolName: string }) => { allowed: boolean; reason: string };
  readonly runCli: (input: Record<string, unknown>) => Promise<{ status: string; error?: string; metadata: Record<string, unknown> }>;
}

async function loadBridge(): Promise<BridgeModule> {
  return await import(pathToFileURL(bridgePath).href) as BridgeModule;
}

describe('spec-memory prompt bridge allowlist', () => {
  it('allows the prompt-time brief and status routes', async () => {
    const bridge = await loadBridge();

    expect(bridge.promptSafeSpecMemoryBridgePolicy({ request: 'brief', toolName: 'session_resume' })).toEqual({
      allowed: true,
      reason: 'prompt_safe',
    });
    expect(bridge.promptSafeSpecMemoryBridgePolicy({ request: 'status', toolName: 'memory_health' })).toEqual({
      allowed: true,
      reason: 'prompt_safe',
    });
  });

  it('rejects direct mutation tool names before warm probing', async () => {
    const bridge = await loadBridge();
    const result = await bridge.runCli({ request: 'brief', toolName: 'memory_delete', timeoutMs: 1 });

    expect(result).toMatchObject({
      status: 'skipped',
      error: 'PROMPT_TOOL_NOT_ALLOWED',
      metadata: {
        route: 'prompt_safe_policy',
        toolName: 'memory_delete',
        retryable: false,
      },
    });
  });
});
