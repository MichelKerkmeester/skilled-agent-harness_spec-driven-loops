// ───────────────────────────────────────────────────────────────
// MODULE: SQLite Busy Retry
// ───────────────────────────────────────────────────────────────
// Shared SQLITE_BUSY retry policy for persisted job stores.
// Async + sync variants matching the file-watcher backoff pattern.

import { BetterSqliteContentionPolicy } from '../storage/ports/contention-policy.js';

// SQLITE_BUSY retry delays that match the file-watcher pattern.
export const RETRY_DELAYS_MS = [50, 200, 500];

export function isSqliteBusyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: unknown })?.code;
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

const busyRetryPolicy = new BetterSqliteContentionPolicy({ retryable: isSqliteBusyError });

export async function withBusyRetry<T>(operation: () => T): Promise<T> {
  return busyRetryPolicy.withRetry(operation, { retryDelaysMs: RETRY_DELAYS_MS }) as Promise<T>;
}

export function withBusyRetrySync<T>(operation: () => T): T {
  return busyRetryPolicy.withRetry(operation, {
    retryDelaysMs: RETRY_DELAYS_MS,
    sleepSync: busyWait,
    sync: true,
  }) as T;
}

export function busyWait(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* busy-wait */ }
}
