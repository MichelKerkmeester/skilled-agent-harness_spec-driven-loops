import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  atomicWriteFile,
  createInterprocessLock,
  isReclaimableLock,
  memoryDriftMarkerEntryKey,
  reclaimInterprocessLock,
  releaseInterprocessLock,
  resolveDatabasePaths,
  resolveMemoryDriftMarkerPath,
  type MemoryDriftMarkerEntry,
  type MemoryDriftMarkerPayload,
} from '@spec-kit/mcp-server/api';
import { isMainModule } from '../lib/esm-entry.js';

export const DRIFT_MARKER_LOCK_STALE_MS = 45_000;
const LOCK_TIMEOUT_MS = 5_000;
const LOCK_WAIT_MS = 25;

export interface DriftMarkerWriteInput {
  diff: string;
  repoRoot: string;
  source: string;
}

export function isDriftMarkerMainModule(
  moduleUrl: string,
  entrypoint: string | undefined = process.argv[1],
): boolean {
  if (isMainModule(moduleUrl)) return true;
  if (!entrypoint) return false;
  try {
    return fs.realpathSync(fileURLToPath(moduleUrl)) === fs.realpathSync(entrypoint);
  } catch {
    return false;
  }
}

function isExistingDirectoryError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'EEXIST');
}

function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export function parseDriftMarkerEntries(diff: string, source: string): MemoryDriftMarkerEntry[] {
  const entries: MemoryDriftMarkerEntry[] = [];
  for (const line of diff.split(/\r?\n/)) {
    const parts = line.split('\t');
    const status = parts[0] || '';
    if (status.startsWith('R') && parts[1] && parts[2]) {
      entries.push({ kind: 'rename', oldPath: parts[1], newPath: parts[2], source });
    } else if (status === 'D' && parts[1]) {
      entries.push({ kind: 'delete', oldPath: parts[1], source });
    }
  }
  return entries;
}

function readMarker(markerPath: string): MemoryDriftMarkerPayload {
  try {
    const parsed = JSON.parse(fs.readFileSync(markerPath, 'utf8')) as MemoryDriftMarkerPayload;
    if (parsed?.version === 1 && Array.isArray(parsed.entries)) {
      return parsed;
    }
  } catch {
    // A malformed or missing marker is replaced with the new observed entries.
  }
  return { version: 1, entries: [] };
}

export function acquireDriftMarkerLock(repoRoot: string, lockDir: string) {
  fs.mkdirSync(path.dirname(lockDir), { recursive: true });
  const deadline = Date.now() + LOCK_TIMEOUT_MS;

  while (true) {
    try {
      return createInterprocessLock(repoRoot, lockDir);
    } catch (error: unknown) {
      if (!isExistingDirectoryError(error)) {
        throw error;
      }
      if (isReclaimableLock(lockDir, DRIFT_MARKER_LOCK_STALE_MS)
        && reclaimInterprocessLock(lockDir, DRIFT_MARKER_LOCK_STALE_MS)) {
        continue;
      }
      if (Date.now() >= deadline) {
        throw new Error(`Timed out acquiring drift-marker lock for ${repoRoot}`);
      }
      sleepSync(LOCK_WAIT_MS);
    }
  }
}

export function writeDriftMarker(input: DriftMarkerWriteInput): string | null {
  const entries = parseDriftMarkerEntries(input.diff, input.source);
  if (!input.repoRoot || entries.length === 0) {
    return null;
  }

  const markerPath = resolveMemoryDriftMarkerPath(resolveDatabasePaths().databasePath);
  const lock = acquireDriftMarkerLock(input.repoRoot, `${markerPath}.lock`);
  try {
    const current = readMarker(markerPath);
    const observedAt = new Date().toISOString();
    const entriesByKey = new Map<string, MemoryDriftMarkerEntry>();
    for (const entry of current.entries) {
      entriesByKey.set(memoryDriftMarkerEntryKey(entry), entry);
    }
    for (const entry of entries) {
      entriesByKey.set(memoryDriftMarkerEntryKey(entry), { ...entry, observedAt });
    }
    const payload: MemoryDriftMarkerPayload = {
      version: 1,
      updatedAt: observedAt,
      entries: Array.from(entriesByKey.values()),
    };
    if (!atomicWriteFile(markerPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')) {
      throw new Error(`Failed to write drift marker at ${markerPath}`);
    }
    return markerPath;
  } finally {
    releaseInterprocessLock(lock);
  }
}

export function runDriftMarkerWrite(): void {
  const diff = process.env.MEMORY_DRIFT_DIFF || '';
  const repoRoot = process.env.MEMORY_DRIFT_REPO_ROOT || '';
  if (!repoRoot || !diff.trim()) {
    return;
  }

  try {
    process.chdir(repoRoot);
    writeDriftMarker({
      diff,
      repoRoot,
      source: process.env.MEMORY_DRIFT_SOURCE || 'git-hook',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-drift-marker] ${message}`);
  }
}

if (isDriftMarkerMainModule(import.meta.url)) {
  runDriftMarkerWrite();
}
