// ───────────────────────────────────────────────────────────────
// MODULE: Access and Freshness Telemetry Store
// ───────────────────────────────────────────────────────────────
// Index-layer record for the access and freshness signals that used to live inside
// graph-metadata.json: last_accessed_at plus the phase-parent last_active_child_id and
// last_active_at pointers. Keeping them here means a read event or a resume updates the
// signal without rewriting the generated file, so the generated JSON changes only on a
// source or structural change. Every write is best-effort and fails closed: an unwritable
// store leaves the generated file byte-identical rather than dirtying it.

import fs from 'node:fs';
import path from 'node:path';

import { DB_UPDATED_FILE } from '@spec-kit/shared/config.js';

/** The access and freshness signals recorded for one spec folder. */
export interface AccessTelemetryRecord {
  last_accessed_at?: string;
  last_active_child_id?: string;
  last_active_at?: string;
}

interface StoreOptions {
  /** Override the store file path; tests point this at a temp file. */
  storePath?: string;
}

const STORE_FILENAME = 'access-telemetry.json';

/**
 * Resolve the telemetry store file path.
 *
 * Defaults to a single JSON file next to the runtime database, so the access and freshness
 * signal lives in the index layer rather than in any spec folder. Tests override it.
 *
 * @param opts - Optional store path override
 * @returns The absolute store file path
 */
export function resolveTelemetryStorePath(opts: StoreOptions = {}): string {
  if (opts.storePath) {
    return opts.storePath;
  }
  return path.join(path.dirname(DB_UPDATED_FILE), STORE_FILENAME);
}

function readStore(storePath: string): Record<string, AccessTelemetryRecord> {
  try {
    const raw = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, AccessTelemetryRecord>;
    }
  } catch {
    // Missing or unreadable store reads as empty; a read never throws into the caller.
  }
  return {};
}

function writeStore(storePath: string, data: Record<string, AccessTelemetryRecord>): boolean {
  try {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    const tempPath = `${storePath}.tmp-${process.pid}`;
    fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
    fs.renameSync(tempPath, storePath);
    return true;
  } catch {
    // Fail closed: a telemetry write failure must never propagate or dirty generated JSON.
    return false;
  }
}

function upsert(specFolder: string, patch: AccessTelemetryRecord, opts: StoreOptions): boolean {
  const storePath = resolveTelemetryStorePath(opts);
  const data = readStore(storePath);
  data[specFolder] = { ...data[specFolder], ...patch };
  return writeStore(storePath, data);
}

/**
 * Record a read/access event for a spec folder in the index-layer store.
 *
 * @param specFolder - The specs-root-relative folder identity
 * @param opts - The access timestamp and an optional store path override
 * @returns Whether the write succeeded; false on a fail-closed store error
 */
export function recordAccessEvent(
  specFolder: string,
  opts: StoreOptions & { now: string },
): boolean {
  return upsert(specFolder, { last_accessed_at: opts.now }, opts);
}

/**
 * Record the phase-parent freshness pointer for a spec folder in the index-layer store.
 *
 * @param specFolder - The specs-root-relative parent folder identity
 * @param opts - The active child id, the timestamp, and an optional store path override
 * @returns Whether the write succeeded; false on a fail-closed store error
 */
export function recordFreshnessPointer(
  specFolder: string,
  opts: StoreOptions & { childId: string; at: string },
): boolean {
  return upsert(specFolder, { last_active_child_id: opts.childId, last_active_at: opts.at }, opts);
}

/**
 * Read the access and freshness record for a spec folder from the index-layer store.
 *
 * @param specFolder - The specs-root-relative folder identity
 * @param opts - Optional store path override
 * @returns The stored record, or null when none is present
 */
export function readAccessRecord(
  specFolder: string,
  opts: StoreOptions = {},
): AccessTelemetryRecord | null {
  const data = readStore(resolveTelemetryStorePath(opts));
  return data[specFolder] ?? null;
}

/**
 * Resolve the last-active-child pointer for a phase parent from the index-layer store.
 *
 * The resume ladder consults this before the generated JSON pointer so a resume still finds
 * the live child after the telemetry split. Returns null when the store has no pointer, so
 * the caller falls back to the generated JSON during the transition window.
 *
 * @param specFolder - The specs-root-relative parent folder identity
 * @param opts - Optional store path override
 * @returns The stored child id, or null when absent
 */
export function resolveLastActiveChildFromStore(
  specFolder: string,
  opts: StoreOptions = {},
): string | null {
  const record = readAccessRecord(specFolder, opts);
  const childId = record?.last_active_child_id;
  return typeof childId === 'string' && childId.trim().length > 0 ? childId.trim() : null;
}
