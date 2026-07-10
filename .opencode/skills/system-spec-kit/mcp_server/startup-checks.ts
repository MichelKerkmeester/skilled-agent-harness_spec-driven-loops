// ───────────────────────────────────────────────────────────────
// MODULE: Startup Checks
// ───────────────────────────────────────────────────────────────
// Non-critical startup checks extracted from context-server.ts.
import path from 'path';
import fs from 'fs';
import {
  MEMORY_DRIFT_MARKER_FILENAME,
  type MemoryDriftMarkerEntry,
  memoryDriftMarkerEntryKey,
  parseMemoryDriftMarker,
  resolveMemoryDriftMarkerPath,
} from './lib/storage/memory-drift-healing.js';
import {
  type MemoryDriftProcessingSweepResult,
  sweepStaleMemoryDriftProcessingMarkers,
} from './lib/storage/memory-drift-processing-sweep.js';
import type {
  MemoryIndexRepairResult,
  MemoryIndexRepairStatus,
} from './handlers/memory-index.js';

export type { MemoryDriftProcessingSweepResult };
export type { MemoryIndexRepairResult, MemoryIndexRepairStatus };
export { sweepStaleMemoryDriftProcessingMarkers };

/* ───────────────────────────────────────────────────────────────
   1. NODE VERSION MISMATCH DETECTION
──────────────────────────────────────────────────────────────── */

export interface NodeVersionMarker {
  nodeVersion: string;
  moduleVersion: string;
  platform: string;
  arch: string;
  createdAt: string;
}

export interface RuntimeSnapshot {
  nodeVersion: string;
  moduleVersion: string;
  platform: string;
  arch: string;
}

export interface RuntimeMismatchResult {
  detected: boolean;
  reasons: string[];
}

export interface MemoryDriftMarkerConsumeResult {
  consumed: boolean;
  entries: number;
  scopedPaths: string[];
  movedFolders: string[];
  repairStatus: MemoryIndexRepairStatus | null;
  error: string | null;
}

export interface MemoryDriftMarkerConsumeOptions {
  databasePath: string;
  workspacePath: string;
  runScopedScan: (scopedPaths: string[]) => Promise<MemoryIndexRepairResult | void>;
  refreshMovedSpecFolder?: (folderPath: string) => void;
}

const MEMORY_INDEX_REPAIR_STATUSES = new Set<MemoryIndexRepairStatus>([
  'complete',
  'partial',
  'coalesced',
  'contended',
  'failed',
]);

/** Converts an MCP scan envelope into the startup repair contract. */
export function resolveMemoryIndexRepairResult(response: unknown): MemoryIndexRepairResult {
  const mcpResponse = response && typeof response === 'object'
    ? response as { isError?: unknown; content?: Array<{ text?: unknown }> }
    : null;
  if (!mcpResponse || mcpResponse.isError === true) {
    return { status: 'failed', scanStatus: null, reason: null };
  }

  try {
    const text = mcpResponse.content?.[0]?.text;
    if (typeof text !== 'string') {
      return { status: 'failed', scanStatus: null, reason: 'missing scan envelope' };
    }
    const envelope = JSON.parse(text) as { data?: Record<string, unknown> };
    const data = envelope.data;
    const scanStatus = typeof data?.status === 'string' ? data.status : null;
    const reason = typeof data?.reason === 'string' ? data.reason : null;
    const repairStatus = data?.repairStatus;
    if (typeof repairStatus === 'string' && MEMORY_INDEX_REPAIR_STATUSES.has(repairStatus as MemoryIndexRepairStatus)) {
      return { status: repairStatus as MemoryIndexRepairStatus, scanStatus, reason };
    }
    return { status: 'failed', scanStatus, reason: reason ?? 'missing repair status' };
  } catch (error: unknown) {
    return {
      status: 'failed',
      scanStatus: null,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

function getCurrentRuntimeSnapshot(): RuntimeSnapshot {
  return {
    nodeVersion: process.version,
    moduleVersion: process.versions.modules,
    platform: process.platform,
    arch: process.arch,
  };
}

export function detectRuntimeMismatch(
  marker: NodeVersionMarker,
  runtime: RuntimeSnapshot = getCurrentRuntimeSnapshot()
): RuntimeMismatchResult {
  const reasons: string[] = [];

  if (marker.moduleVersion !== runtime.moduleVersion) {
    reasons.push('module ABI');
  }
  if (marker.platform !== runtime.platform) {
    reasons.push('platform');
  }
  if (marker.arch !== runtime.arch) {
    reasons.push('architecture');
  }

  return {
    detected: reasons.length > 0,
    reasons,
  };
}

function parseSqliteVersion(version: string): { major: number; minor: number } | null {
  const [majorRaw, minorRaw] = version.split('.');

  if (!majorRaw || !minorRaw) {
    return null;
  }

  const major = Number(majorRaw);
  const minor = Number(minorRaw);

  if (!Number.isFinite(major) || !Number.isFinite(minor)) {
    return null;
  }

  return { major, minor };
}

/** Logs a warning when the active Node.js version differs from the project marker. */
export function detectNodeVersionMismatch(): void {
  try {
    const markerPath = path.resolve(import.meta.dirname, '../.node-version-marker');

    if (fs.existsSync(markerPath)) {
      const raw = fs.readFileSync(markerPath, 'utf8');
      const marker: NodeVersionMarker = JSON.parse(raw);
      const runtime = getCurrentRuntimeSnapshot();
      const mismatch = detectRuntimeMismatch(marker, runtime);

      if (mismatch.detected) {
        const reasonText = mismatch.reasons.join(', ');
        console.warn('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
        console.warn('[context-server] \u2551  WARNING: Native runtime changed since last install  \u2551');
        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
        console.warn(
          `[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion}, ${marker.platform}/${marker.arch})`.padEnd(88) + '\u2551'
        );
        console.warn(
          `[context-server] \u2551  Running:   Node ${runtime.nodeVersion} (MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`.padEnd(88) + '\u2551'
        );
        console.warn(`[context-server] \u2551  Mismatch:  ${reasonText}`.padEnd(88) + '\u2551');
        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
        console.warn('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
        console.warn('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
        console.warn('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
      } else {
        console.warn(
          `[context-server] Node runtime check: OK (${runtime.nodeVersion}, MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`
        );
      }
    } else {
      // Auto-create marker for future version checks
      const marker: NodeVersionMarker = {
        nodeVersion: process.version,
        moduleVersion: process.versions.modules,
        platform: process.platform,
        arch: process.arch,
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2), 'utf8');
      console.warn('[context-server] Created .node-version-marker for future runtime checks');
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[context-server] Node version check skipped: ${message}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   2. SQLITE VERSION CHECK
──────────────────────────────────────────────────────────────── */

/**
 * Check that SQLite version meets minimum requirement (3.35.0+)
 * Required for: RETURNING clause, CTEs, window functions used in scoring pipeline
 */
export function checkSqliteVersion(db: { prepare: (sql: string) => { get: () => unknown } }): void {
  try {
    const result = db.prepare('SELECT sqlite_version() as version').get() as { version: string };
    const version = result.version;
    const parsedVersion = parseSqliteVersion(version);

    if (!parsedVersion) {
      console.warn(`[spec-kit] Could not determine SQLite version: unexpected version format "${version}"`);
      return;
    }

    if (parsedVersion.major < 3 || (parsedVersion.major === 3 && parsedVersion.minor < 35)) {
      console.warn(
        `[spec-kit] WARNING: SQLite version ${version} detected. ` +
        `Minimum required: 3.35.0. Some features may not work correctly.`
      );
    } else {
      console.warn(`[spec-kit] SQLite version: ${version} (meets 3.35.0+ requirement)`);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`[spec-kit] Could not determine SQLite version: ${message}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   3. JOURNAL MODE CHECK
──────────────────────────────────────────────────────────────── */

/**
 * Verify the active journal_mode is one of the two known-valid states and log,
 * never mutate, on anything else.
 *
 * Rollback journal (DELETE) is memory-mapped WAL's deliberate replacement here: a
 * memory-mapped WAL index header read can fault under concurrent access on this
 * platform, so DELETE is the expected, healthy mode and must never be
 * force-switched back to WAL by a startup check — doing so would silently reopen
 * that exposure on every boot. WAL itself is tolerated as a legacy/back-compat
 * state. Any other mode is unexpected and only logged, never mutated.
 */
export function checkJournalMode(db: { prepare: (sql: string) => { get: () => unknown } }): void {
  const walRow = db.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
  const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
  if (journalMode !== 'delete' && journalMode !== 'wal') {
    console.warn(`[context-server] unexpected journal_mode '${journalMode}'; leaving as-is`);
  }
}

function resolveWorkspaceSpecPath(workspacePath: string, markerPath: string): string | null {
  const resolvedWorkspace = path.resolve(workspacePath);
  const resolved = path.resolve(resolvedWorkspace, markerPath);
  const specsRoot = path.join(resolvedWorkspace, '.opencode', 'specs');
  return resolved === specsRoot || resolved.startsWith(specsRoot + path.sep) ? resolved : null;
}

function resolveMovedFolder(workspacePath: string, entry: MemoryDriftMarkerEntry): string | null {
  if (entry.kind !== 'rename') {
    return null;
  }

  const resolved = resolveWorkspaceSpecPath(workspacePath, entry.newPath);
  if (!resolved) {
    return null;
  }

  let cursor = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()
    ? resolved
    : path.dirname(resolved);
  const specsRoot = path.join(path.resolve(workspacePath), '.opencode', 'specs');
  while (cursor === specsRoot || cursor.startsWith(specsRoot + path.sep)) {
    if (fs.existsSync(path.join(cursor, 'spec.md'))) {
      return cursor;
    }
    const parent = path.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  return null;
}

// sweepStaleMemoryDriftProcessingMarkers + MemoryDriftProcessingSweepResult live in
// ./lib/storage/memory-drift-processing-sweep.ts (extracted for module line-count
// budget) and are re-exported above for existing consumers of this module.

/** Consumes the git-hook dirty marker once, then delegates repair to existing scan machinery. */
export async function consumeMemoryDriftDirtyMarker(
  options: MemoryDriftMarkerConsumeOptions,
): Promise<MemoryDriftMarkerConsumeResult> {
  const markerPath = resolveMemoryDriftMarkerPath(options.databasePath);
  if (!fs.existsSync(markerPath)) {
    return {
      consumed: false,
      entries: 0,
      scopedPaths: [],
      movedFolders: [],
      repairStatus: null,
      error: null,
    };
  }

  const processingPath = `${markerPath}.processing-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(markerPath, processingPath);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[context-server] ${MEMORY_DRIFT_MARKER_FILENAME} consume skipped: ${message}`);
    return {
      consumed: false,
      entries: 0,
      scopedPaths: [],
      movedFolders: [],
      repairStatus: null,
      error: message,
    };
  }

  let raw = '';
  try {
    raw = fs.readFileSync(processingPath, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      if (!fs.existsSync(markerPath)) {
        fs.renameSync(processingPath, markerPath);
      }
    } catch (_restoreError: unknown) {
      // Keep the processing copy for the startup sweep when direct restore fails.
    }
    console.warn(`[context-server] ${MEMORY_DRIFT_MARKER_FILENAME} unreadable; retained for retry: ${message}`);
    return {
      consumed: false,
      entries: 0,
      scopedPaths: [],
      movedFolders: [],
      repairStatus: null,
      error: message,
    };
  }

  const parsed = parseMemoryDriftMarker(raw);
  if (!parsed || parsed.entries.length === 0) {
    console.warn(`[context-server] ${MEMORY_DRIFT_MARKER_FILENAME} malformed or empty; ignoring`);
    try { fs.unlinkSync(processingPath); } catch (_unlinkError: unknown) { /* marker cleanup is best-effort */ }
    return {
      consumed: true,
      entries: 0,
      scopedPaths: [],
      movedFolders: [],
      repairStatus: null,
      error: null,
    };
  }

  const entriesByKey = new Map(parsed.entries.map((entry) => [memoryDriftMarkerEntryKey(entry), entry]));
  const entries = Array.from(entriesByKey.values());
  const scopedPaths = Array.from(new Set(entries.flatMap((entry) => {
    const oldPath = resolveWorkspaceSpecPath(options.workspacePath, entry.oldPath);
    const newPath = entry.kind === 'rename'
      ? resolveWorkspaceSpecPath(options.workspacePath, entry.newPath)
      : null;
    return [oldPath, newPath].filter((item): item is string => item !== null);
  })));
  const movedFolders = Array.from(new Set(entries.flatMap((entry) => {
    const folder = resolveMovedFolder(options.workspacePath, entry);
    return folder ? [folder] : [];
  })));

  let repairStatus: MemoryIndexRepairStatus | null = null;
  try {
    if (scopedPaths.length > 0) {
      const repairResult = await options.runScopedScan(scopedPaths);
      repairStatus = repairResult?.status ?? 'complete';
      if (repairStatus !== 'complete') {
        throw new Error(`Scoped memory-index repair did not complete (${repairStatus})`);
      }
    }
    for (const folder of movedFolders) {
      options.refreshMovedSpecFolder?.(folder);
    }
    fs.unlinkSync(processingPath);
    console.error(`[context-server] Consumed ${MEMORY_DRIFT_MARKER_FILENAME}: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}, ${scopedPaths.length} scoped path(s)`);
    return {
      consumed: true,
      entries: entries.length,
      scopedPaths,
      movedFolders,
      repairStatus,
      error: null,
    };
  } catch (error: unknown) {
    repairStatus ??= 'failed';
    const message = error instanceof Error ? error.message : String(error);
    try {
      if (!fs.existsSync(markerPath)) {
        fs.renameSync(processingPath, markerPath);
      }
    } catch (_restoreError: unknown) {
      // The marker is advisory; a failed restore must not block startup.
    }
    console.warn(`[context-server] ${MEMORY_DRIFT_MARKER_FILENAME} consume failed: ${message}`);
    return {
      consumed: false,
      entries: entries.length,
      scopedPaths,
      movedFolders,
      repairStatus,
      error: message,
    };
  }
}
