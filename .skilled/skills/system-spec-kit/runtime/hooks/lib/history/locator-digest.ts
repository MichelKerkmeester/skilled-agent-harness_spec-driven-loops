// ───────────────────────────────────────────────────────────────────
// MODULE: History Locator Identity
// ───────────────────────────────────────────────────────────────────
// Every producer mints the same `hl1_` handle and the lookup CLI re-derives it.
// Keeping the digest in one module is what stops the producers and the verifier
// from drifting apart one runtime at a time.

import { createHash } from 'node:crypto';

export const HISTORY_HANDLE_PREFIX = 'hl1_';

export interface HistoryHandleIdentity {
  readonly runtime: string;
  readonly sessionId: string;
  readonly workspace: string;
  readonly locatorKind: string;
  readonly sessionDirectory?: string;
}

/**
 * Hash one session identity into the opaque handle the CLI re-derives.
 *
 * Claude and Codex mint over the resolved transcript path; the reader-backed
 * runtimes mint over the session identity alone, so `storePath` is omitted for
 * them rather than passed as an empty string. A session folder below the root
 * is bound too, tagged so it can never read as a store path, and a locator
 * without one hashes exactly as before.
 */
export function historyHandle(
  identity: HistoryHandleIdentity,
  storePath?: string | null,
): string {
  const fields = [identity.runtime, identity.sessionId, identity.workspace, identity.locatorKind];
  if (identity.sessionDirectory !== undefined) fields.push(`dir:${identity.sessionDirectory}`);
  if (storePath !== undefined && storePath !== null) fields.push(storePath);
  return `${HISTORY_HANDLE_PREFIX}${createHash('sha256')
    .update(fields.join('\0'))
    .digest('hex')
    .slice(0, 32)}`;
}

export interface HistoryLocatorTarget {
  readonly workspace: string;
  readonly handle: string;
}

type HistoryStateWriteResult = {
  persisted?: boolean;
  merged?: { historyLocator?: { handle?: string } | null } | null;
} | null | undefined;

/**
 * Persist one minted locator through the hook-state writer.
 *
 * The writer keys its file by `process.cwd()`, while an adapter receives its
 * workspace from a host event. The write is synchronous, so scoping the process
 * cwd to that workspace for the call is safe and lands the file exactly where
 * the CLI, run from the same workspace, looks for it. Any failure returns false
 * so the caller can keep the compaction path fail-open.
 *
 * The state schema drops a locator it rejects instead of failing the write, so
 * a successful write alone does not prove the locator was kept. The write only
 * counts when the stored locator carries the handle the caller minted.
 */
export function persistHistoryLocator(
  locator: HistoryLocatorTarget,
  write: () => HistoryStateWriteResult,
): boolean {
  const run = (): boolean => {
    try {
      const result = write();
      return result?.persisted === true
        && result.merged?.historyLocator?.handle === locator.handle;
    } catch {
      return false;
    }
  };

  const previous = process.cwd();
  if (previous === locator.workspace) return run();

  try {
    process.chdir(locator.workspace);
  } catch {
    return false;
  }
  try {
    return run();
  } finally {
    try {
      process.chdir(previous);
    } catch {
      // The former cwd disappeared; the hook still completes fail-open.
    }
  }
}
