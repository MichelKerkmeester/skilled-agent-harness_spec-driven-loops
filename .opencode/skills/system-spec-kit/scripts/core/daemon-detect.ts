// ───────────────────────────────────────────────────────────────────
// MODULE: Daemon Detect
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface SpecMemoryDaemonStatus {
  readonly alive: boolean;
  readonly pid?: number;
}

interface LauncherLease {
  readonly pid?: unknown;
  readonly ownerPid?: unknown;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const LAUNCHER_LEASE_FILE_NAME = '.mk-spec-memory-launcher.json';

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function canonicalizePath(filePath: string): string {
  const resolved = path.resolve(filePath);
  try {
    return fs.realpathSync.native(resolved);
  } catch {
    return resolved;
  }
}

function positiveInteger(value: unknown): number | null {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : null;
}

function readLeasePid(leasePath: string): number | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(leasePath, 'utf8')) as LauncherLease;
    return positiveInteger(parsed.pid) ?? positiveInteger(parsed.ownerPid);
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export function isProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    return code !== 'ESRCH';
  }
}

// Walk up to the `system-spec-kit` root rather than a fixed up-count: this module compiles to
// scripts/dist/core (3 ups) but could run from scripts/core under tsx (2 ups), so a hardcoded count is
// layout-fragile. The launcher writes the lease to <system-spec-kit>/mcp_server/database/ — mirror that.
function findSystemSpecKitRoot(startDir: string): string | null {
  let dir = startDir;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (path.basename(dir) === 'system-spec-kit') return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function resolveSpecMemoryDaemonLeasePath(): string {
  const kitRoot = findSystemSpecKitRoot(MODULE_DIR);
  const threeUp = path.resolve(MODULE_DIR, '..', '..', '..', 'mcp_server', 'database');
  const dbDir = canonicalizePath(
    kitRoot
      ? path.join(kitRoot, 'mcp_server', 'database')
      // Defensive fallback if the marker is absent: prefer the dist/core (3-up) layout, else 2-up.
      : (fs.existsSync(threeUp) ? threeUp : path.resolve(MODULE_DIR, '..', '..', 'mcp_server', 'database')),
  );
  return path.join(dbDir, LAUNCHER_LEASE_FILE_NAME);
}

export function isSpecMemoryDaemonAlive(
  leasePath: string = resolveSpecMemoryDaemonLeasePath(),
): SpecMemoryDaemonStatus {
  const pid = readLeasePid(leasePath);
  if (pid === null) {
    return { alive: false };
  }

  return isProcessAlive(pid) ? { alive: true, pid } : { alive: false };
}

