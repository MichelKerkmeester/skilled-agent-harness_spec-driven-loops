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
  // The launcher records the spawned daemon (the real SQLite writer) as `childPid`.
  // A stale-LOOKING lease (dead launcher pid) whose childPid is still LIVE must NOT be treated
  // as reclaimable — the writer is still up. Mirrors the launcher's own liveness rule.
  readonly childPid?: unknown;
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

interface LeasePids {
  /** Primary launcher pid (or legacy ownerPid alias) — reported as status.pid on the common path. */
  readonly primaryPid: number | null;
  /** Spawned daemon pid (the real SQLite writer), when recorded by the launcher. */
  readonly childPid: number | null;
}

function readLeasePids(leasePath: string): LeasePids {
  try {
    const parsed = JSON.parse(fs.readFileSync(leasePath, 'utf8')) as LauncherLease;
    return {
      primaryPid: positiveInteger(parsed.pid) ?? positiveInteger(parsed.ownerPid),
      childPid: positiveInteger(parsed.childPid),
    };
  } catch {
    return { primaryPid: null, childPid: null };
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
// layout-fragile. The launcher writes the lease to <system-spec-kit>/mcp-server/database/ — mirror that.
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
  const threeUp = path.resolve(MODULE_DIR, '..', '..', '..', 'mcp-server', 'database');
  const dbDir = canonicalizePath(
    kitRoot
      ? path.join(kitRoot, 'mcp-server', 'database')
      // Defensive fallback if the marker is absent: prefer the dist/core (3-up) layout, else 2-up.
      : (fs.existsSync(threeUp) ? threeUp : path.resolve(MODULE_DIR, '..', '..', 'mcp-server', 'database')),
  );
  return path.join(dbDir, LAUNCHER_LEASE_FILE_NAME);
}

export function isSpecMemoryDaemonAlive(
  leasePath: string = resolveSpecMemoryDaemonLeasePath(),
): SpecMemoryDaemonStatus {
  const { primaryPid, childPid } = readLeasePids(leasePath);

  // The lease is reclaimable only when NEITHER the launcher pid NOR its recorded
  // childPid (the real writer) is live. Probe the primary first so status.pid stays the
  // launcher pid on the common path; if the launcher pid is dead/absent but the recorded
  // childPid is still LIVE, the daemon is up — report alive (pinned to childPid) so the
  // standalone-save Step-11.5 path does NOT open a second writer on context-index.sqlite.
  if (primaryPid !== null && isProcessAlive(primaryPid)) {
    return { alive: true, pid: primaryPid };
  }
  if (childPid !== null && isProcessAlive(childPid)) {
    return { alive: true, pid: childPid };
  }
  return { alive: false };
}
