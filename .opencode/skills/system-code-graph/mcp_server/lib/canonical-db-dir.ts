// ───────────────────────────────────────────────────────────────────
// MODULE: Canonical Code Graph DB Directory
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

export class CanonicalDbDirError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'CanonicalDbDirError';
    this.code = code;
  }
}

export function resolveCanonicalDbDir(dir: string): string {
  const resolvedDir = resolve(dir);

  try {
    mkdirSync(resolvedDir, { recursive: true, mode: 0o700 });
    return realpathSync.native(resolvedDir);
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : undefined;
    const message = error instanceof Error ? error.message : String(error);
    throw new CanonicalDbDirError(`Unable to resolve canonical code graph DB directory ${resolvedDir}: ${message}`, code);
  }
}
