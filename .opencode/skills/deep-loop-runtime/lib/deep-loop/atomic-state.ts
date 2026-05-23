// MODULE: Deep-Loop Atomic State

import { closeSync, existsSync, fsyncSync, openSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// ───── HELPERS ─────

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

// ───── EXPORTS ─────

/**
 * Atomically write JSON-serializable state to a file.
 *
 * Writes to a temp file first, fsyncs it, then renames onto the target
 * so readers always see either the previous complete file or the new one.
 *
 * @param path - Target file path.
 * @param data - Serializable data to write.
 * @throws If write, fsync, or rename fails.
 */
export function writeStateAtomic(path: string, data: unknown): void {
  const tempPath = makeTempPath(path);
  const content = `${JSON.stringify(data, null, 2)}\n`;

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
