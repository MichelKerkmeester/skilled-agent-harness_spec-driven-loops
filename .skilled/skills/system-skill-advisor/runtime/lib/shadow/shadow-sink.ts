// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Shadow Sink
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import {
  appendFileSync,
  chmodSync,
  closeSync,
  constants,
  existsSync,
  fchmodSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  realpathSync,
  renameSync,
} from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isOwnedPrivateDir } from '../owned-private-dir.js';
// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;
const APPEND_NO_FOLLOW = constants.O_WRONLY | constants.O_APPEND | constants.O_CREAT | (constants.O_NOFOLLOW ?? 0);

// ───────────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface ShadowDeltaRecord {
  prompt: string;
  recommendation: string;
  liveScore: number;
  shadowScore: number;
  delta: number;
  dominantLane: string | null;
  timestamp?: string;
}

export interface RecordShadowDeltaOptions {
  logPath?: string;
  maxBytes?: number;
  now?: Date;
}

export interface RecordShadowDeltaResult {
  written: boolean;
  logPath: string;
  rotated: boolean;
  error?: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function defaultShadowDeltaPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, '..', '..', 'data', 'shadow-deltas.jsonl');
}

function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (true) {
    if (existsSync(resolve(current, '.opencode'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      return resolve(start);
    }
    current = parent;
  }
}

// A containment check has to compare like with like. process.cwd() hands back a
// path with its symlinks already resolved, so a workspace under a symlinked
// parent (/tmp on macOS, which is really /private/tmp) canonicalizes on one
// side only: the root becomes /private/tmp/... while an operator-supplied path
// stays /tmp/... . The two then look unrelated and a path genuinely inside the
// workspace is refused. The target file need not exist yet, so canonicalize the
// deepest ancestor that does and re-append the rest.
function canonicalize(pathValue: string): string {
  let head = resolve(pathValue);
  const tail: string[] = [];
  while (!existsSync(head)) {
    const parent = dirname(head);
    if (parent === head) return resolve(pathValue);
    tail.unshift(head.slice(parent.length + 1));
    head = parent;
  }
  try {
    return resolve(realpathSync.native(head), ...tail);
  } catch {
    return resolve(pathValue);
  }
}

function isPathInside(rootPath: string, targetPath: string): boolean {
  const rel = relative(rootPath, targetPath);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function resolveShadowDeltaPath(options: RecordShadowDeltaOptions): { ok: true; path: string } | { ok: false; path: string; error: string } {
  if (options.logPath) {
    return { ok: true, path: resolve(options.logPath) };
  }

  const envPath = process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH;
  if (!envPath) {
    return { ok: true, path: defaultShadowDeltaPath() };
  }

  const resolvedPath = resolve(envPath);
  const workspaceRoot = findWorkspaceRoot();
  if (!isPathInside(canonicalize(workspaceRoot), canonicalize(resolvedPath))) {
    return {
      ok: false,
      path: resolvedPath,
      error: `SPECKIT_ADVISOR_SHADOW_DELTA_PATH must stay under workspace root: ${workspaceRoot}`,
    };
  }
  return { ok: true, path: resolvedPath };
}

function recordShadowDelta(
  record: ShadowDeltaRecord,
  options: RecordShadowDeltaOptions = {},
): RecordShadowDeltaResult {
  const resolved = resolveShadowDeltaPath(options);
  const logPath = resolved.path;
  if (!resolved.ok) {
    return {
      written: false,
      logPath,
      rotated: false,
      error: resolved.error,
    };
  }
  try {
    const dir = dirname(logPath);
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    if (!isOwnedPrivateDir(dir)) {
      if (!isOwnedPrivateDir(dir, 0o002)) {
        return refused(logPath, "log folder is a symlink, not this user's, not a directory, or writable by others");
      }
      try {
        chmodSync(dir, 0o700);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return refused(logPath, `log folder could not be made private: ${message}`);
      }
      if (!isOwnedPrivateDir(dir)) {
        return refused(logPath, "log folder could not be made private");
      }
    }
    const rotated = rotateIfNeeded(logPath, options.maxBytes ?? DEFAULT_MAX_BYTES, options.now ?? new Date());
    if (!appendPrivateLine(logPath, `${JSON.stringify({
      ...record,
      timestamp: record.timestamp ?? new Date().toISOString(),
    })}\n`)) {
      return refused(logPath, "log path is a symlink, multiply linked, or not this user's file");
    }
    return { written: true, logPath, rotated };
  } catch (error: unknown) {
    return {
      written: false,
      logPath,
      rotated: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function refused(logPath: string, reason: string): RecordShadowDeltaResult {
  return { written: false, logPath, rotated: false, error: `refused: ${reason}` };
}

function appendPrivateLine(logPath: string, text: string): boolean {
  let descriptor: number;
  try {
    descriptor = openSync(logPath, APPEND_NO_FOLLOW, 0o600);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error
      && (error.code === 'ELOOP' || error.code === 'EMLINK')) {
      return false;
    }
    throw error;
  }

  try {
    const stat = fstatSync(descriptor);
    if (!stat.isFile() || stat.nlink !== 1
      || (typeof process.getuid === 'function' && stat.uid !== process.getuid())) {
      return false;
    }
    if ((stat.mode & 0o077) !== 0) fchmodSync(descriptor, 0o600);
    appendFileSync(descriptor, text, 'utf8');
    return true;
  } finally {
    closeSync(descriptor);
  }
}

function rotateIfNeeded(logPath: string, maxBytes: number, now: Date): boolean {
  const stat = lstatSync(logPath, { throwIfNoEntry: false });
  if (!stat?.isFile() || stat.nlink !== 1 || stat.size <= maxBytes) return false;
  const suffix = now.toISOString().replace(/[:.]/g, '-');
  renameSync(logPath, `${logPath}.${suffix}.rotated`);
  return true;
}

/**
 * Shadow-delta recording is opt-in: advisor_recommend is a read-style call
 * and must not write durable telemetry unless the operator expressed intent —
 * either by pointing the sink somewhere (SPECKIT_ADVISOR_SHADOW_DELTA_PATH)
 * or by enabling collection at the default path
 * (SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1/true).
 */
function shadowDeltaSinkEnabled(): boolean {
  if (process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH) return true;
  const flag = (process.env.SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED ?? '').trim().toLowerCase();
  return flag === '1' || flag === 'true';
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  recordShadowDelta,
  resolveShadowDeltaPath,
  shadowDeltaSinkEnabled,
};
