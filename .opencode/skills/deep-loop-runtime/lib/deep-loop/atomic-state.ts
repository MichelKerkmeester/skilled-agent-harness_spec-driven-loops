// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Atomic State
// ───────────────────────────────────────────────────────────────────

import { closeSync, existsSync, fsyncSync, openSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const serializedStateCache = new Map<string, string>();

function fsyncPath(path: string): void {
  let fd: number | undefined;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }
}

function makeTempPath(targetPath: string): string {
  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}

function serializeState(data: unknown): string {
  const serialized = JSON.stringify(data);
  if (typeof serialized !== 'string') {
    throw new TypeError('State data must serialize to JSON.');
  }
  return serialized;
}

// ───────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ───────────────────────────────────────────────────────────────────

/**
 * Atomically write JSON-serializable state to a file.
 *
 * Writes to a temp file first, fsyncs it, then renames onto the target
 * so readers always see either the previous complete file or the new one.
 * Prefer writeStateIfChangedAtomic for production snapshot writes so
 * unchanged state does not pay the fsync + rename cost.
 *
 * @param path - Target file path.
 * @param data - Serializable data to write.
 * @throws If write, fsync, or rename fails.
 */
export function writeStateAtomic(path: string, data: unknown): void {
  writeTextAtomic(path, `${JSON.stringify(data, null, 2)}\n`);
}

/**
 * Atomically write JSON-serializable state only when its serialized form changed.
 *
 * The cache is keyed by the resolved target path so equivalent relative paths
 * share the same skip decision.
 *
 * @param path - Target file path.
 * @param data - Serializable data to write.
 * @param cache - Optional cache override for isolated callers or tests.
 * @returns True when a write occurred; false when unchanged state was skipped.
 * @throws If serialization, write, fsync, or rename fails.
 */
export function writeStateIfChangedAtomic(
  path: string,
  data: unknown,
  cache: Map<string, string> = serializedStateCache,
): boolean {
  const targetPath = resolve(path);
  const serialized = serializeState(data);

  if (cache.get(targetPath) === serialized) {
    return false;
  }

  writeStateAtomic(targetPath, data);
  cache.set(targetPath, serialized);
  return true;
}

/**
 * Atomically write a text payload to a file.
 *
 * Same temp + fsync + rename guarantee as writeStateAtomic, but for
 * already-serialized content (e.g. markdown) that must not be re-encoded
 * as JSON. Readers always see either the previous complete file or the
 * new one, never a torn mid-write tail.
 *
 * @param path - Target file path.
 * @param content - Exact bytes to write.
 * @throws If write, fsync, or rename fails.
 */
export function writeTextAtomic(path: string, content: string): void {
  const tempPath = makeTempPath(path);

  try {
    writeFileSync(tempPath, content, 'utf8');
    fsyncPath(tempPath);
    renameSync(tempPath, path);
    try {
      fsyncPath(dirname(path));
    } catch {
    }
  } catch (error: unknown) {
    if (existsSync(tempPath)) {
      rmSync(tempPath, { force: true });
    }
    throw error;
  }
}
