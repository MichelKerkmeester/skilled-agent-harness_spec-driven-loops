// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Statistics Persistence
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { DEEPPI_MODEL_IDS } from './eligibility.js';
import { atomicWriteFile } from './hashlines.js';

import type { DeepPiModelId } from './eligibility.js';
import type { ModelTotals } from './telemetry.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Per-session totals and the UTC date on which they were last flushed. */
export interface SessionStats {
  utcDate: string;
  updatedAt: string;
  byModel: Record<DeepPiModelId, ModelTotals>;
}

/** Cumulative totals for all recorded sessions on one UTC date. */
export interface DailyStats {
  sessionCount: number;
  byModel: Record<DeepPiModelId, ModelTotals>;
}

/** Versioned on-disk document containing session and daily statistics. */
export interface DeepPiStatsDocument {
  schemaVersion: typeof DEEP_PI_STATS_SCHEMA_VERSION;
  sessions: Record<string, SessionStats>;
  daily: Record<string, DailyStats>;
}

/** Reasons a statistics document cannot be safely consumed. */
export type StatsUnreadableReason = 'corrupt' | 'unsupported-version' | 'io';

/** Result of reading a statistics path, preserving unreadable state explicitly. */
export type StatsReadResult =
  | { status: 'missing'; path: string; content: null; document: DeepPiStatsDocument }
  | { status: 'ok'; path: string; content: string; document: DeepPiStatsDocument }
  | {
    status: 'unreadable';
    path: string;
    content: string | null;
    reason: StatsUnreadableReason;
    error: Error;
  };

/** A read-modify-write result waiting for its compare-and-swap commit. */
export interface PreparedStatsUpdate {
  path: string;
  expectedContent: string;
  content: string;
  document: DeepPiStatsDocument;
}

/** Error raised when a statistics file cannot be safely interpreted. */
export class StatsUnreadableError extends Error {
  readonly result: Extract<StatsReadResult, { status: 'unreadable' }>;

  constructor(result: Extract<StatsReadResult, { status: 'unreadable' }>) {
    super(`DeepPi statistics are unreadable at ${result.path}: ${result.error.message}`);
    this.name = 'StatsUnreadableError';
    this.result = result;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Current on-disk schema version for DeepPi statistics. */
export const DEEP_PI_STATS_SCHEMA_VERSION = 1 as const;
/** Filename for the project-scoped cumulative statistics document. */
export const DEEP_PI_STATS_FILENAME = 'deep-pi-stats.json';
/** Filename for the latest project-scoped report snapshot. */
export const DEEP_PI_REPORT_FILENAME = 'deep-pi-report.json';

const MAX_WRITE_RETRIES = 3;
const LOCK_RETRY_DELAY_MS = 20;
const LOCK_MAX_WAIT_MS = 5000;
const MODEL_IDS: readonly DeepPiModelId[] = [...DEEPPI_MODEL_IDS];

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function emptyTotals(): ModelTotals {
  return {
    responses: 0,
    hitTokens: 0,
    missTokens: 0,
    cacheWriteTokens: 0,
    actualInputCost: 0,
    noCacheCounterfactualSavings: 0,
  };
}

function buildByModel(
  factory: (modelId: DeepPiModelId) => ModelTotals,
): Record<DeepPiModelId, ModelTotals> {
  // The exported model-id tuple supplies every key before the record is returned.
  const byModel = {} as Record<DeepPiModelId, ModelTotals>;
  for (const modelId of MODEL_IDS) byModel[modelId] = factory(modelId);
  return byModel;
}

function emptyByModel(): Record<DeepPiModelId, ModelTotals> {
  return buildByModel(() => emptyTotals());
}

function emptyDocument(): DeepPiStatsDocument {
  return { schemaVersion: DEEP_PI_STATS_SCHEMA_VERSION, sessions: {}, daily: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isModelTotals(value: unknown): value is ModelTotals {
  if (
    !isRecord(value) || !isFiniteNonNegative(value.responses) || !Number.isInteger(value.responses)
  ) {
    return false;
  }
  return [
    value.hitTokens,
    value.missTokens,
    value.cacheWriteTokens,
    value.actualInputCost,
    value.noCacheCounterfactualSavings,
  ].every(isFiniteNonNegative);
}

function isByModel(value: unknown): value is Record<DeepPiModelId, ModelTotals> {
  if (!isRecord(value) || Object.keys(value).length !== MODEL_IDS.length) return false;
  return MODEL_IDS.every((modelId) => isModelTotals(value[modelId]));
}

function isSessionStats(value: unknown): value is SessionStats {
  return isRecord(value) &&
    typeof value.utcDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.utcDate) &&
    typeof value.updatedAt === 'string' &&
    isByModel(value.byModel);
}

function isDailyStats(value: unknown): value is DailyStats {
  return isRecord(value) &&
    isFiniteNonNegative(value.sessionCount) &&
    Number.isInteger(value.sessionCount) &&
    isByModel(value.byModel);
}

function isStatsDocument(value: unknown): value is DeepPiStatsDocument {
  if (!isRecord(value) || value.schemaVersion !== DEEP_PI_STATS_SCHEMA_VERSION) return false;
  if (!isRecord(value.sessions) || !isRecord(value.daily)) return false;
  return Object.values(value.sessions).every(isSessionStats) &&
    Object.values(value.daily).every(isDailyStats);
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function errorCode(error: unknown): string | undefined {
  if (!isRecord(error) || typeof error.code !== 'string') return undefined;
  return error.code;
}

function isWriteConflict(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('File changed since it was read') ||
    error.message.includes('File changed during replacement')
  );
}

function unreadable(
  path: string,
  content: string | null,
  reason: StatsUnreadableReason,
  error: Error,
): Extract<StatsReadResult, { status: 'unreadable' }> {
  return { status: 'unreadable', path, content, reason, error };
}

function parseDocument(path: string, content: string): StatsReadResult {
  let value: unknown;
  try {
    // JSON.parse returns any; widen it immediately so validators must narrow the document shape.
    value = JSON.parse(content) as unknown;
  } catch (error: unknown) {
    return unreadable(path, content, 'corrupt', asError(error));
  }
  if (isRecord(value) && value.schemaVersion !== DEEP_PI_STATS_SCHEMA_VERSION) {
    return unreadable(
      path,
      content,
      'unsupported-version',
      new Error(`unsupported schemaVersion ${String(value.schemaVersion)}`),
    );
  }
  if (!isStatsDocument(value)) {
    return unreadable(path, content, 'corrupt', new Error('invalid statistics document shape'));
  }
  return { status: 'ok', path, content, document: value };
}

function serialize(document: DeepPiStatsDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}

async function seedFile(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  try {
    const handle = await open(path, 'wx', 0o600);
    try {
      await handle.writeFile(content, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch (error: unknown) {
    if (errorCode(error) !== 'EEXIST') throw error;
  }
}

function cloneTotals(totals: ModelTotals): ModelTotals {
  return { ...totals };
}

function cloneByModel(
  byModel: Record<DeepPiModelId, ModelTotals>,
): Record<DeepPiModelId, ModelTotals> {
  return buildByModel((modelId) => cloneTotals(byModel[modelId]));
}

function cloneDocument(document: DeepPiStatsDocument): DeepPiStatsDocument {
  const sessions: Record<string, SessionStats> = {};
  for (const [sessionId, session] of Object.entries(document.sessions)) {
    sessions[sessionId] = {
      utcDate: session.utcDate,
      updatedAt: session.updatedAt,
      byModel: cloneByModel(session.byModel),
    };
  }
  const daily: Record<string, DailyStats> = {};
  for (const [utcDate, totals] of Object.entries(document.daily)) {
    daily[utcDate] = { sessionCount: totals.sessionCount, byModel: cloneByModel(totals.byModel) };
  }
  return { schemaVersion: DEEP_PI_STATS_SCHEMA_VERSION, sessions, daily };
}

function addTotals(target: ModelTotals, source: ModelTotals): void {
  target.responses += source.responses;
  target.hitTokens += source.hitTokens;
  target.missTokens += source.missTokens;
  target.cacheWriteTokens += source.cacheWriteTokens;
  target.actualInputCost += source.actualInputCost;
  target.noCacheCounterfactualSavings += source.noCacheCounterfactualSavings;
}

function rebuildDaily(sessions: Record<string, SessionStats>): Record<string, DailyStats> {
  const daily: Record<string, DailyStats> = {};
  for (const session of Object.values(sessions)) {
    const day = daily[session.utcDate] ?? { sessionCount: 0, byModel: emptyByModel() };
    day.sessionCount++;
    for (const modelId of MODEL_IDS) {
      addTotals(day.byModel[modelId], session.byModel[modelId]);
    }
    daily[session.utcDate] = day;
  }
  return daily;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Read the statistics file without converting unreadable data into an empty document. */
export async function readStatsFile(path: string): Promise<StatsReadResult> {
  try {
    const content = await readFile(path, 'utf8');
    return parseDocument(path, content);
  } catch (error: unknown) {
    if (errorCode(error) === 'ENOENT') {
      return { status: 'missing', path, content: null, document: emptyDocument() };
    }
    return unreadable(path, null, 'io', asError(error));
  }
}

/**
 * Serialize an entire read-modify-write cycle across processes, not just one
 * process's own calls. `atomicWriteFile`'s expectedContent check and its
 * write queue (hashlines.ts) only protect against interleaving within a
 * single Node process — two separate processes can each pass the
 * compare-and-swap check against the same starting content (neither has
 * renamed yet), then rename one after the other, and each independently
 * observe its own write as having landed. The later rename silently
 * overwrites the earlier one, and both callers see success. A real,
 * filesystem-level lock closes that window: `open(lockPath, "wx")` is an
 * atomic exclusive create at the OS level, so only one process can hold the
 * lock at any moment, regardless of process boundaries.
 */
export async function withCrossProcessLock<T>(path: string, work: () => Promise<T>): Promise<T> {
  const lockPath = `${path}.lock`;
  await mkdir(dirname(lockPath), { recursive: true });
  const deadline = Date.now() + LOCK_MAX_WAIT_MS;
  for (;;) {
    try {
      const handle = await open(lockPath, 'wx', 0o600);
      try {
        await handle.writeFile(String(process.pid), 'utf8');
      } finally {
        await handle.close();
      }
      break;
    } catch (error: unknown) {
      if (errorCode(error) !== 'EEXIST') throw error;
      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for the DeepPi statistics lock at ${lockPath}.`);
      }
      await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_DELAY_MS));
    }
  }
  try {
    return await work();
  } finally {
    await unlink(lockPath).catch(() => undefined);
  }
}

/** Prepare a compare-and-swap update from the current file contents. */
export async function prepareStatsUpdate(
  path: string,
  sessionId: string,
  byModel: Record<DeepPiModelId, ModelTotals>,
  now = new Date(),
): Promise<PreparedStatsUpdate> {
  if (sessionId.length === 0) throw new Error('DeepPi session id must not be empty.');
  if (!Number.isFinite(now.getTime())) throw new Error('DeepPi statistics timestamp is invalid.');
  await seedFile(path, serialize(emptyDocument()));
  const current = await readStatsFile(path);
  if (current.status === 'unreadable') throw new StatsUnreadableError(current);
  if (current.status === 'missing') {
    throw new Error(`DeepPi statistics disappeared while opening ${path}; retry the update.`);
  }
  const document = cloneDocument(current.document);
  const utcDate = now.toISOString().slice(0, 10);
  document.sessions[sessionId] = {
    utcDate,
    updatedAt: now.toISOString(),
    byModel: cloneByModel(byModel),
  };
  document.daily = rebuildDaily(document.sessions);
  return {
    path,
    expectedContent: current.content,
    content: serialize(document),
    document,
  };
}

/** Commit a prepared statistics update using the atomic helper's CAS guard. */
export async function commitStatsUpdate(prepared: PreparedStatsUpdate): Promise<void> {
  await atomicWriteFile(prepared.path, prepared.content, prepared.expectedContent);
}

/**
 * Persist the current session totals and return the resulting document.
 *
 * The whole read-modify-write cycle runs under `withCrossProcessLock`, not
 * just the final write: the retry loop here defends against a conflict the
 * lock already prevented from occurring, but the lock is what makes the
 * cycle actually safe across two separate Pi processes writing the same
 * project's stats file at once.
 */
export async function updateStatsForSession(
  path: string,
  sessionId: string,
  byModel: Record<DeepPiModelId, ModelTotals>,
  now = new Date(),
): Promise<DeepPiStatsDocument> {
  return withCrossProcessLock(path, async () => {
    for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt++) {
      try {
        const prepared = await prepareStatsUpdate(path, sessionId, byModel, now);
        await commitStatsUpdate(prepared);
        return prepared.document;
      } catch (error: unknown) {
        if (!isWriteConflict(error) || attempt === MAX_WRITE_RETRIES - 1) throw error;
      }
    }
    throw new Error('DeepPi statistics update exhausted its write retries.');
  });
}

/** Return the project-scoped path used for cumulative DeepPi statistics. */
export function statsPath(cwd: string): string {
  return join(cwd, '.pi', DEEP_PI_STATS_FILENAME);
}

/** Return the project-scoped path used for the latest plain report snapshot. */
export function reportSnapshotPath(cwd: string): string {
  return join(cwd, '.pi', DEEP_PI_REPORT_FILENAME);
}

/**
 * Atomically replace the latest JSON report snapshot with cross-process locking.
 */
export async function writeJsonSnapshot(path: string, value: unknown): Promise<void> {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  await withCrossProcessLock(path, async () => {
    await seedFile(path, '{}\n');
    for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt++) {
      try {
        const expectedContent = await readFile(path, 'utf8');
        await atomicWriteFile(path, content, expectedContent);
        return;
      } catch (error: unknown) {
        if (!isWriteConflict(error) || attempt === MAX_WRITE_RETRIES - 1) throw error;
      }
    }
    throw new Error('DeepPi report snapshot exhausted its write retries.');
  });
}
