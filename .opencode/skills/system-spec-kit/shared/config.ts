// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

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

function resolvePackageRoot(): string {
  // The skill root is the directory that holds both the shared and the runtime
  // packages. The nearest package.json above this file is the shared package's
  // own, so walking to it would plant the database directory under shared/.
  let current = path.resolve(import.meta.dirname);
  for (let depth = 0; depth < 8; depth += 1) {
    if (fs.existsSync(path.join(current, 'runtime')) && fs.existsSync(path.join(current, 'shared'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return findUp('package.json', import.meta.dirname) || path.resolve(import.meta.dirname, '..');
}

const PACKAGE_ROOT = resolvePackageRoot();
const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'runtime', 'database');

/** Defines database updated file. */
export const DB_UPDATED_FILE: string = (() => {
  const configuredDir = getDbDir();
  if (configuredDir) {
    const resolvedDir = path.isAbsolute(configuredDir)
      ? configuredDir
      : path.resolve(PACKAGE_ROOT, configuredDir);
    return path.join(resolvedDir, '.db-updated');
  }
  return path.join(DEFAULT_DB_DIR, '.db-updated');
})();
