// ───────────────────────────────────────────────────────────────
// MODULE: Skill Execution-Outcome Store + Idempotent Fold Cadence
// ───────────────────────────────────────────────────────────────
// Durable append-only record of per-skill TASK execution success/failure — the
// signal the advisor does not capture today (it captures only recommendation
// acceptance). This store is read-only input to ranking: the emitter appends
// events, an out-of-process cadence folds them, and the shadow re-rank reads
// the fold. Nothing here writes back into the live scorer weights or the live
// fused sort.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { appendFile, mkdir, open, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import {
  createSkillExecutionOutcomeRecord,
  validateSkillExecutionOutcomeRecord,
  type SkillExecutionOutcomeRecord,
} from '../metrics.js';
import { tokenize } from './text.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface SkillOutcomeCounts {
  readonly skillId: string;
  readonly success: number;
  readonly failure: number;
  readonly total: number;
  readonly failureModes: Readonly<Record<string, number>>;
  readonly failureModeContexts: Readonly<Record<string, Readonly<Record<string, number>>>>;
}

export interface SkillOutcomeFold {
  readonly generatedAt: string;
  /** Distinct events folded (deduped by eventId). */
  readonly recordCount: number;
  readonly bySkill: Readonly<Record<string, SkillOutcomeCounts>>;
}

export interface FailureModeRecall {
  readonly failureMode: string;
  readonly count: number;
  /** Query overlap score in [0,1]; higher means the mode's recorded context
   * matches the query more closely. */
  readonly score: number;
}

export interface SkillOutcomeTickResult {
  /** false when the fold is byte-identical to the prior snapshot (a no-op
   * re-tick); true when a new snapshot was written. */
  readonly changed: boolean;
  /** true when another tick held the lock and this invocation did nothing. */
  readonly locked: boolean;
  readonly fold: SkillOutcomeFold | null;
  readonly snapshotPath: string;
}

// ───────────────────────────────────────────────────────────────
// 2. PATHS
// ───────────────────────────────────────────────────────────────

const STORE_DIR_ENV = 'SPECKIT_ADVISOR_OUTCOME_STORE_DIR';
const DEFAULT_STORE_ROOT = join(tmpdir(), 'speckit-skill-advisor-outcomes');
// A lock older than this is treated as abandoned (the holder crashed) and is
// reclaimed, so a dead tick never wedges the cadence forever.
const LOCK_STALE_MS = 60_000;

function storeRoot(): string {
  const override = process.env[STORE_DIR_ENV]?.trim();
  return override && override.length > 0 ? override : DEFAULT_STORE_ROOT;
}

function workspaceHash(workspaceRoot: string): string {
  return createHash('sha256').update(resolve(workspaceRoot)).digest('hex').slice(0, 16);
}

export function skillOutcomeStorePath(workspaceRoot: string): string {
  return join(storeRoot(), `${workspaceHash(workspaceRoot)}-execution-outcomes.jsonl`);
}

export function skillOutcomeFoldPath(workspaceRoot: string): string {
  return join(storeRoot(), `${workspaceHash(workspaceRoot)}-execution-fold.json`);
}

function skillOutcomeLockPath(workspaceRoot: string): string {
  return join(storeRoot(), `${workspaceHash(workspaceRoot)}-execution-fold.lock`);
}

// ───────────────────────────────────────────────────────────────
// 3. EMITTER (append-only write-path)
// ───────────────────────────────────────────────────────────────

async function ensureParentDir(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

export async function appendSkillExecutionOutcome(
  workspaceRoot: string,
  record: SkillExecutionOutcomeRecord,
): Promise<string> {
  if (!validateSkillExecutionOutcomeRecord(record)) {
    throw new Error('appendSkillExecutionOutcome: record failed closed-schema validation.');
  }
  const path = skillOutcomeStorePath(workspaceRoot);
  await ensureParentDir(path);
  await appendFile(path, `${JSON.stringify(record)}\n`, 'utf8');
  return path;
}

/** Convenience emitter: build a sanitized record and append it. The runtime
 * seam that calls this (which post-task signal fires it) is intentionally left
 * to the caller — it never runs on the prompt-time recommend path. */
export async function recordSkillExecutionOutcome(
  workspaceRoot: string,
  input: Parameters<typeof createSkillExecutionOutcomeRecord>[0],
): Promise<SkillExecutionOutcomeRecord> {
  const record = createSkillExecutionOutcomeRecord(input);
  await appendSkillExecutionOutcome(workspaceRoot, record);
  return record;
}

// ───────────────────────────────────────────────────────────────
// 4. READ + FOLD
// ───────────────────────────────────────────────────────────────

function tryParseJsonLine(line: string): unknown | null {
  try {
    return JSON.parse(line) as unknown;
  } catch {
    return null;
  }
}

export function readSkillExecutionOutcomeRecords(workspaceRoot: string): SkillExecutionOutcomeRecord[] {
  const path = skillOutcomeStorePath(workspaceRoot);
  if (!existsSync(path)) {
    return [];
  }
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => tryParseJsonLine(line))
    // Poison rows are skipped defensively, not thrown — one malformed line must
    // not break the whole fold.
    .filter(validateSkillExecutionOutcomeRecord);
}

interface MutableCounts {
  success: number;
  failure: number;
  failureModes: Map<string, number>;
  failureModeContexts: Map<string, Map<string, number>>;
}

function sortedRecord<V>(entries: Iterable<[string, V]>): Record<string, V> {
  return Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b)));
}

/** Pure, order-independent, replay-safe fold. Events are deduped by eventId, so
 * a replayed or double-delivered event folds to the same counts. */
export function foldSkillOutcomeRecords(
  records: readonly SkillExecutionOutcomeRecord[],
  opts: { readonly now?: string } = {},
): SkillOutcomeFold {
  const seenEvents = new Set<string>();
  const bySkill = new Map<string, MutableCounts>();

  for (const record of records) {
    if (seenEvents.has(record.eventId)) {
      continue;
    }
    seenEvents.add(record.eventId);

    let counts = bySkill.get(record.skillId);
    if (!counts) {
      counts = { success: 0, failure: 0, failureModes: new Map(), failureModeContexts: new Map() };
      bySkill.set(record.skillId, counts);
    }
    if (record.success) {
      counts.success += 1;
      continue;
    }
    counts.failure += 1;
    if (!record.failureMode) {
      continue;
    }
    counts.failureModes.set(record.failureMode, (counts.failureModes.get(record.failureMode) ?? 0) + 1);
    let context = counts.failureModeContexts.get(record.failureMode);
    if (!context) {
      context = new Map();
      counts.failureModeContexts.set(record.failureMode, context);
    }
    for (const tag of record.contextTags ?? []) {
      context.set(tag, (context.get(tag) ?? 0) + 1);
    }
  }

  const folded: Record<string, SkillOutcomeCounts> = {};
  for (const [skillId, counts] of [...bySkill.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const failureModeContexts: Record<string, Record<string, number>> = {};
    for (const [mode, context] of counts.failureModeContexts.entries()) {
      failureModeContexts[mode] = sortedRecord(context.entries());
    }
    folded[skillId] = {
      skillId,
      success: counts.success,
      failure: counts.failure,
      total: counts.success + counts.failure,
      failureModes: sortedRecord(counts.failureModes.entries()),
      failureModeContexts: sortedRecord(Object.entries(failureModeContexts)),
    };
  }

  return {
    generatedAt: opts.now ?? new Date().toISOString(),
    recordCount: seenEvents.size,
    bySkill: folded,
  };
}

export function foldSkillOutcomeStore(
  workspaceRoot: string,
  opts: { readonly now?: string } = {},
): SkillOutcomeFold {
  return foldSkillOutcomeRecords(readSkillExecutionOutcomeRecords(workspaceRoot), opts);
}

// ───────────────────────────────────────────────────────────────
// 5. QUERY-SCORED FAILURE-MODE RECALL (advisory only)
// ───────────────────────────────────────────────────────────────

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

/** "How this skill tends to fail on inputs like yours." Ranks a skill's
 * recorded failure modes by how well their recorded context overlaps the query.
 * Advisory context for a recommendation — never a hard demotion of live order. */
export function recallSkillFailureModes(
  fold: SkillOutcomeFold,
  skillId: string,
  query: string,
): FailureModeRecall[] {
  const counts = fold.bySkill[skillId];
  if (!counts) {
    return [];
  }
  const queryTokens = new Set(tokenize(query));
  return Object.entries(counts.failureModes)
    .map(([failureMode, count]) => {
      const contextTags = Object.keys(counts.failureModeContexts[failureMode] ?? {});
      const matched = contextTags.filter((tag) =>
        tokenize(tag).some((token) => queryTokens.has(token))).length;
      const score = contextTags.length === 0 ? 0 : round6(matched / contextTags.length);
      return { failureMode, count, score };
    })
    .sort((left, right) =>
      right.score - left.score
      || right.count - left.count
      || left.failureMode.localeCompare(right.failureMode));
}

// ───────────────────────────────────────────────────────────────
// 6. IDEMPOTENT OUT-OF-PROCESS CADENCE TICK
// ───────────────────────────────────────────────────────────────

function foldDataSignature(fold: SkillOutcomeFold): string {
  // generatedAt is excluded so two ticks over identical data are recognized as
  // a no-op even though their wall-clock stamps differ.
  return JSON.stringify({ recordCount: fold.recordCount, bySkill: fold.bySkill });
}

function readFoldSnapshotSignature(snapshotPath: string): string | null {
  if (!existsSync(snapshotPath)) {
    return null;
  }
  const parsed = tryParseJsonLine(readFileSync(snapshotPath, 'utf8'));
  if (parsed === null || typeof parsed !== 'object') {
    return null;
  }
  const fold = parsed as SkillOutcomeFold;
  if (typeof fold.recordCount !== 'number' || typeof fold.bySkill !== 'object' || fold.bySkill === null) {
    return null;
  }
  return foldDataSignature(fold);
}

async function acquireLock(lockPath: string): Promise<boolean> {
  await ensureParentDir(lockPath);
  try {
    const handle = await open(lockPath, 'wx');
    await handle.close();
    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code !== 'EEXIST') {
      throw error;
    }
    // Reclaim an abandoned lock from a crashed tick; otherwise honor it.
    try {
      const ageMs = Date.now() - statSync(lockPath).mtimeMs;
      if (ageMs <= LOCK_STALE_MS) {
        return false;
      }
    } catch {
      return false;
    }
    await rm(lockPath, { force: true });
    try {
      const handle = await open(lockPath, 'wx');
      await handle.close();
      return true;
    } catch {
      return false;
    }
  }
}

/** Fold the store on a clock and persist a snapshot, idempotently. Two
 * back-to-back ticks over unchanged data produce no second write (changed:
 * false). A tick that finds the lock held does nothing (locked: true). Runs
 * out-of-process only (cron/maintenance) — it is never on the recommend path. */
export async function tickSkillOutcomeFold(
  workspaceRoot: string,
  opts: { readonly now?: string } = {},
): Promise<SkillOutcomeTickResult> {
  const snapshotPath = skillOutcomeFoldPath(workspaceRoot);
  const lockPath = skillOutcomeLockPath(workspaceRoot);

  const acquired = await acquireLock(lockPath);
  if (!acquired) {
    return { changed: false, locked: true, fold: null, snapshotPath };
  }

  try {
    const fold = foldSkillOutcomeStore(workspaceRoot, opts);
    const nextSignature = foldDataSignature(fold);
    if (readFoldSnapshotSignature(snapshotPath) === nextSignature) {
      return { changed: false, locked: false, fold, snapshotPath };
    }
    const tmpPath = `${snapshotPath}.${process.pid}.tmp`;
    await writeFile(tmpPath, JSON.stringify(fold, null, 2), 'utf8');
    await rename(tmpPath, snapshotPath);
    return { changed: true, locked: false, fold, snapshotPath };
  } finally {
    await rm(lockPath, { force: true });
  }
}

export function readSkillOutcomeFoldSnapshot(workspaceRoot: string): SkillOutcomeFold | null {
  const snapshotPath = skillOutcomeFoldPath(workspaceRoot);
  if (!existsSync(snapshotPath)) {
    return null;
  }
  const parsed = tryParseJsonLine(readFileSync(snapshotPath, 'utf8'));
  if (parsed === null || typeof parsed !== 'object') {
    return null;
  }
  return parsed as SkillOutcomeFold;
}
