// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor MCP Caller Context
// ───────────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from 'node:async_hooks';

export interface MCPCallerContext {
  readonly sessionId: string | null;
  readonly transport: 'stdio' | 'sse' | 'ws' | 'unknown';
  readonly connectedAt: string;
  readonly callerPid?: number;
  readonly trusted?: boolean;
  readonly metadata: Record<string, unknown>;
}

const storage = new AsyncLocalStorage<MCPCallerContext>();

export function runWithCallerContext<T>(ctx: MCPCallerContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getCallerContext(): MCPCallerContext | null {
  return storage.getStore() ?? null;
}

export function requireCallerContext(): MCPCallerContext {
  const ctx = storage.getStore();
  if (!ctx) {
    throw new Error('MCP caller context missing - handler called outside runWithCallerContext()');
  }
  return ctx;
}
