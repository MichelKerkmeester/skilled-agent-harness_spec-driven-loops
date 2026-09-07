// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

import { findPackageRoot } from './workspace/package-root.js';

/** Get db dir. */
export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

// The skill root is the directory that holds both the shared and the runtime
// packages. The nearest package.json above this file is the shared package's
// own, so walking to it would plant the database directory under shared/;
// it stays only as the last resort when no package root exists above us.
const PACKAGE_ROOT = findPackageRoot(import.meta.dirname, { maxDepth: 8 })
  || findUp('package.json', import.meta.dirname)
  || path.resolve(import.meta.dirname, '..');
const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'runtime', 'database');

/**
 * The directory the engine writes its access-telemetry store into. It is the
 * directory the retired memory database lived in, kept under the same override
 * so an operator who relocated that database relocates the telemetry with it.
 */
export const TELEMETRY_STORE_DIR: string = (() => {
  const configuredDir = getDbDir();
  if (configuredDir) {
    return path.isAbsolute(configuredDir)
      ? configuredDir
      : path.resolve(PACKAGE_ROOT, configuredDir);
  }
  return DEFAULT_DB_DIR;
})();
