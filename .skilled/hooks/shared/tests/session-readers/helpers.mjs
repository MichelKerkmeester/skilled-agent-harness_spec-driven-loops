// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Test Helpers
// ───────────────────────────────────────────────────────────────────
// Small filesystem helpers shared by the reader suites. The open tracker patches
// the built-in fs exports and re-syncs them, so a module that imported a named
// function at load time still reports every path it touches.

import fs from 'node:fs';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export function withTemp(prefix, run) {
  const root = mkdtempSync(join(tmpdir(), `${prefix}-`));
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export async function withTempAsync(prefix, run) {
  const root = mkdtempSync(join(tmpdir(), `${prefix}-`));
  try {
    return await run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export function writeText(filePath, text) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, text);
  return filePath;
}

export function writeJsonl(filePath, rows) {
  return writeText(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}

export function writeJson(filePath, value) {
  return writeText(filePath, JSON.stringify(value, null, 2));
}

export function trackFileOpens() {
  const opened = [];
  const originalOpen = fs.openSync;
  const originalRead = fs.readFileSync;

  fs.openSync = function trackedOpen(path, ...args) {
    opened.push(String(path));
    return originalOpen.call(fs, path, ...args);
  };
  fs.readFileSync = function trackedRead(path, ...args) {
    opened.push(String(path));
    return originalRead.call(fs, path, ...args);
  };
  syncBuiltinESMExports();

  return {
    opened,
    restore() {
      fs.openSync = originalOpen;
      fs.readFileSync = originalRead;
      syncBuiltinESMExports();
    },
  };
}
