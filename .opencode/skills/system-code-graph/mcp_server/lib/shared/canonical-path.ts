// ───────────────────────────────────────────────────────────────
// MODULE: Canonical Path Helpers
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

export function resolveCanonicalPath(absPath: string): string {
  try {
    return fs.realpathSync(absPath).replace(/\\/g, '/');
  } catch {
    return absPath.replace(/\\/g, '/');
  }
}

export function normalizePathKey(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

export function getCanonicalPathKey(filePath: string): string {
  try {
    return normalizePathKey(fs.realpathSync(filePath));
  } catch {
    return normalizePathKey(path.resolve(filePath));
  }
}
