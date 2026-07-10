// ───────────────────────────────────────────────────────────────
// MODULE: Memory Drift Healing
// ───────────────────────────────────────────────────────────────
import path from 'node:path';

import type Database from 'better-sqlite3';

export const MEMORY_DRIFT_MARKER_FILENAME = '.memory-drift-dirty-paths.json' as const;
export const MEMORY_DRIFT_SUSPECT_QUEUE_KEY = 'memory_index.drift_suspect_rows' as const;
export const MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE = 1_000;

export interface MemoryDriftSuspect {
  id: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface MemoryDriftSuspectAppendResult {
  suspects: MemoryDriftSuspect[];
  accepted: number;
  rejected: number;
  queueSize: number;
}

export type MemoryDriftMarkerEntry =
  | { kind: 'rename'; oldPath: string; newPath: string; observedAt?: string; source?: string }
  | { kind: 'delete'; oldPath: string; observedAt?: string; source?: string };

export interface MemoryDriftMarkerPayload {
  version: 1;
  updatedAt?: string;
  entries: MemoryDriftMarkerEntry[];
}

function ensureConfigTable(database: Database.Database): void {
  database.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
}

function normalizeIso(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  return value.trim();
}

function normalizeSuspect(value: unknown, fallbackNow: string): MemoryDriftSuspect | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'number'
    ? record.id
    : typeof record.id === 'string'
      ? Number.parseInt(record.id, 10)
      : NaN;

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return {
    id,
    firstSeenAt: normalizeIso(record.firstSeenAt, fallbackNow),
    lastSeenAt: normalizeIso(record.lastSeenAt, fallbackNow),
  };
}

function writeSuspects(database: Database.Database, suspects: MemoryDriftSuspect[]): void {
  ensureConfigTable(database);
  if (suspects.length === 0) {
    database.prepare('DELETE FROM config WHERE key = ?').run(MEMORY_DRIFT_SUSPECT_QUEUE_KEY);
    return;
  }

  database.prepare(`
    INSERT INTO config (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(MEMORY_DRIFT_SUSPECT_QUEUE_KEY, JSON.stringify(suspects));
}

/** Reads the current drift-suspect queue from the `config` table, sorted by id. Returns `[]` on any read or parse failure. */
export function readMemoryDriftSuspects(database: Database.Database): MemoryDriftSuspect[] {
  try {
    ensureConfigTable(database);
    const row = database.prepare('SELECT value FROM config WHERE key = ?').get(MEMORY_DRIFT_SUSPECT_QUEUE_KEY) as { value?: unknown } | undefined;
    if (typeof row?.value !== 'string' || row.value.trim().length === 0) {
      return [];
    }

    const parsed = JSON.parse(row.value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const fallbackNow = new Date().toISOString();
    const byId = new Map<number, MemoryDriftSuspect>();
    for (const item of parsed) {
      const suspect = normalizeSuspect(item, fallbackNow);
      if (suspect) {
        byId.set(suspect.id, suspect);
      }
    }
    return Array.from(byId.values()).sort((a, b) => a.id - b.id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-drift-healing] Could not read drift suspect queue, falling back to empty: ${message}`);
    return [];
  }
}

/** Merges `ids` into the drift-suspect queue, keeping existing confirmation work when the bounded queue is full. */
export function appendMemoryDriftSuspects(
  database: Database.Database,
  ids: readonly number[],
  observedAt: string = new Date().toISOString(),
): MemoryDriftSuspectAppendResult {
  const transaction = database.transaction((): MemoryDriftSuspectAppendResult => {
    const next = new Map<number, MemoryDriftSuspect>();
    for (const suspect of readMemoryDriftSuspects(database)) {
      next.set(suspect.id, suspect);
    }

    let accepted = 0;
    let rejected = 0;
    for (const id of ids) {
      if (!Number.isInteger(id) || id <= 0) {
        continue;
      }
      const existing = next.get(id);
      if (!existing && next.size >= MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE) {
        rejected++;
        continue;
      }
      next.set(id, {
        id,
        firstSeenAt: existing?.firstSeenAt ?? observedAt,
        lastSeenAt: observedAt,
      });
      if (!existing) {
        accepted++;
      }
    }

    const suspects = Array.from(next.values()).sort((a, b) => a.id - b.id);
    if (rejected > 0) {
      console.warn(`[memory-drift-healing] Drift suspect queue is full; deferred ${rejected} candidate(s) for a later scan`);
    }
    writeSuspects(database, suspects);
    return { suspects, accepted, rejected, queueSize: suspects.length };
  });
  return transaction.immediate();
}

/** Removes `ids` from the drift-suspect queue (confirmed tombstoned or cleared) and persists the remaining queue. */
export function removeMemoryDriftSuspects(database: Database.Database, ids: readonly number[]): MemoryDriftSuspect[] {
  const removeIds = new Set(ids.filter((id) => Number.isInteger(id) && id > 0));
  if (removeIds.size === 0) {
    return readMemoryDriftSuspects(database);
  }

  const transaction = database.transaction(() => {
    const suspects = readMemoryDriftSuspects(database).filter((suspect) => !removeIds.has(suspect.id));
    writeSuspects(database, suspects);
    return suspects;
  });
  return transaction.immediate();
}

function normalizeMarkerPath(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeMarkerEntry(value: unknown): MemoryDriftMarkerEntry | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const kind = record.kind;
  const oldPath = normalizeMarkerPath(record.oldPath);
  if ((kind !== 'rename' && kind !== 'delete') || !oldPath) {
    return null;
  }

  const observedAt = normalizeMarkerPath(record.observedAt) ?? undefined;
  const source = normalizeMarkerPath(record.source) ?? undefined;
  if (kind === 'delete') {
    return { kind, oldPath, ...(observedAt ? { observedAt } : {}), ...(source ? { source } : {}) };
  }

  const newPath = normalizeMarkerPath(record.newPath);
  return newPath
    ? { kind, oldPath, newPath, ...(observedAt ? { observedAt } : {}), ...(source ? { source } : {}) }
    : null;
}

/** Parses and validates the git-hook drift marker JSON, dropping any entry that fails shape validation. Returns `null` for malformed input or an unsupported version. */
export function parseMemoryDriftMarker(raw: string): MemoryDriftMarkerPayload | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if (record.version !== 1 || !Array.isArray(record.entries)) {
      return null;
    }

    const entries = record.entries
      .map(normalizeMarkerEntry)
      .filter((entry): entry is MemoryDriftMarkerEntry => entry !== null);

    return {
      version: 1,
      updatedAt: normalizeMarkerPath(record.updatedAt) ?? undefined,
      entries,
    };
  } catch {
    return null;
  }
}

/** Resolves the drift marker file path as a sibling of the given database file. */
export function resolveMemoryDriftMarkerPath(databasePath: string): string {
  return path.join(path.dirname(path.resolve(databasePath)), MEMORY_DRIFT_MARKER_FILENAME);
}

/** Builds a stable dedup key for a marker entry, so repeated writes of the same rename/delete collapse into one. */
export function memoryDriftMarkerEntryKey(entry: MemoryDriftMarkerEntry): string {
  return entry.kind === 'rename'
    ? `rename:${entry.oldPath}->${entry.newPath}`
    : `delete:${entry.oldPath}`;
}
