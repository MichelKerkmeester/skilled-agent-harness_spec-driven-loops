// ───────────────────────────────────────────────────────────────────
// MODULE: Locks and Fencing Durable File Utilities
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';

import { canonicalBytes } from '../event-envelope/index.js';

import type { JsonValue } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. DURABLE OPERATIONS
// ───────────────────────────────────────────────────────────────────

/** Read a UTF-8 file while preserving the distinction between absent and empty. */
export function readUtf8IfExists(path: string): string | null {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

/** Persist canonical JSON through fsync plus atomic same-directory replacement. */
export function writeCanonicalJsonAtomic(path: string, value: JsonValue): void {
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp.${process.pid}.${randomUUID()}`;
  let descriptor: number | undefined;
  try {
    descriptor = openSync(temporaryPath, 'wx', 0o600);
    writeFileSync(descriptor, Buffer.concat([
      Buffer.from(canonicalBytes(value)),
      Buffer.from('\n'),
    ]));
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    renameSync(temporaryPath, path);
    fsyncDirectory(dirname(path));
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
    rmSync(temporaryPath, { force: true });
  }
}

/** Append one fully framed line and durably publish its containing directory. */
export function appendUtf8Durable(path: string, line: string): void {
  mkdirSync(dirname(path), { recursive: true });
  let descriptor: number | undefined;
  try {
    descriptor = openSync(path, 'a', 0o600);
    writeFileSync(descriptor, line, 'utf8');
    fsyncSync(descriptor);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  fsyncDirectory(dirname(path));
}

function fsyncDirectory(path: string): void {
  let descriptor: number | undefined;
  try {
    descriptor = openSync(path, 'r');
    fsyncSync(descriptor);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

