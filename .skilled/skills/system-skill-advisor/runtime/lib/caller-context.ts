// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor Caller Context
// ───────────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from 'node:async_hooks';

export interface CallerContext {
  readonly sessionId: string | null;
  // Only 'stdio' is ever produced. The retired transport's other kinds were
  // never assigned and cannot be now.
  readonly transport: 'stdio' | 'unknown';
  readonly connectedAt: string;
  readonly callerPid?: number;
  readonly trusted?: boolean;
  readonly metadata: Record<string, unknown>;
}

const storage = new AsyncLocalStorage<CallerContext>();

export function runWithCallerContext<T>(ctx: CallerContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getCallerContext(): CallerContext | null {
  return storage.getStore() ?? null;
}

export function requireCallerContext(): CallerContext {
  const ctx = storage.getStore();
  if (!ctx) {
    throw new Error('MCP caller context missing - handler called outside runWithCallerContext()');
  }
  return ctx;
}
