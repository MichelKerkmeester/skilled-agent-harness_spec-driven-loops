// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Atomic State
// ───────────────────────────────────────────────────────────────

import { closeSync, existsSync, fsyncSync, openSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

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
      // Directory fsync is not available on every filesystem; the file rename
      // is still atomic for readers on the same volume.
    }
  } catch (error) {
    if (existsSync(tempPath)) {
      rmSync(tempPath, { force: true });
    }
    throw error;
  }
}
