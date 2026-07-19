// ───────────────────────────────────────────────────────────────────
// MODULE: Code Graph DB Close Assertion
// ───────────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

export class DbClosedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DbClosedError';
  }
}

export function assertDbHandleClosed(handle: Database.Database | null): void {
  if (!handle) return;

  try {
    handle.prepare('SELECT 1').get();
  } catch {
    return;
  }

  throw new DbClosedError('Code graph DB handle remained queryable after closeDb()');
}
