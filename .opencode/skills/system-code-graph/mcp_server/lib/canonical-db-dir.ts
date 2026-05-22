// ───────────────────────────────────────────────────────────────────
// MODULE: Canonical Code Graph DB Directory
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { isWithinWorkspace } from './utils/workspace-path.js';

export class CanonicalDbDirError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'CanonicalDbDirError';
    this.code = code;
  }
}

export function resolveCanonicalDbDir(dir: string, workspaceRoot?: string): string {
  const resolvedDir = resolve(dir);

  try {
    let canonicalWorkspace: string | null = null;
    if (workspaceRoot) {
      const resolvedWorkspace = resolve(workspaceRoot);
      if (!isWithinWorkspace(resolvedWorkspace, resolvedDir)) {
        throw new CanonicalDbDirError(
          `Code graph DB directory must stay within the workspace root: ${resolvedWorkspace}`,
          'OUTSIDE_WORKSPACE',
        );
      }
      canonicalWorkspace = realpathSync.native(resolvedWorkspace);
    }
    mkdirSync(resolvedDir, { recursive: true, mode: 0o700 });
    const canonicalDir = realpathSync.native(resolvedDir);
    if (canonicalWorkspace && !isWithinWorkspace(canonicalWorkspace, canonicalDir)) {
      throw new CanonicalDbDirError(
        `Code graph DB directory must stay within the workspace root: ${canonicalWorkspace}`,
        'OUTSIDE_WORKSPACE',
      );
    }
    return canonicalDir;
  } catch (error: unknown) {
    if (error instanceof CanonicalDbDirError) {
      throw error;
    }
    const code = error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : undefined;
    const message = error instanceof Error ? error.message : String(error);
    throw new CanonicalDbDirError(`Unable to resolve canonical code graph DB directory ${resolvedDir}: ${message}`, code);
  }
}
