// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Shadow Sink
// ───────────────────────────────────────────────────────────────

import { appendFileSync, existsSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

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
  if (!isPathInside(workspaceRoot, resolvedPath)) {
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
    const rotated = rotateIfNeeded(logPath, options.maxBytes ?? DEFAULT_MAX_BYTES, options.now ?? new Date());
    mkdirSync(dirname(logPath), { recursive: true });
    appendFileSync(logPath, `${JSON.stringify({
      ...record,
      timestamp: record.timestamp ?? new Date().toISOString(),
    })}\n`, 'utf8');
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

function rotateIfNeeded(logPath: string, maxBytes: number, now: Date): boolean {
  if (!existsSync(logPath)) return false;
  const size = statSync(logPath).size;
  if (size <= maxBytes) return false;
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

export {
  recordShadowDelta,
  resolveShadowDeltaPath,
  shadowDeltaSinkEnabled,
};
