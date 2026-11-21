// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop FS Durability
// ───────────────────────────────────────────────────────────────────

// Internal helpers shared by the atomic writers in this folder. Not part of
// any barrel, so the deep-loop public surface stays unchanged.

import { closeSync, fsyncSync, openSync } from 'node:fs';

// ───────────────────────────────────────────────────────────────────
// 1. DURABILITY HELPERS
// ───────────────────────────────────────────────────────────────────

/** Flush a file or directory to stable storage, always closing the descriptor. */
export function fsyncPath(path: string): void {
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

/** Build a unique sibling temp path for a write-then-rename of targetPath. */
export function makeTempPath(targetPath: string): string {
  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}
