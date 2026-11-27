// ───────────────────────────────────────────────────────────────────
// MODULE: Run Record
// ───────────────────────────────────────────────────────────────────
//
// One record per run is the join every later surface reads: the queue
// links a request to its run through it, delivery appends to it, and the
// status index is built from it. The record lives under the user-level
// state root, never inside the run folder, so losing a run folder to a
// re-pin or a reinstall never loses the record. Its strings reuse the
// existing stop, failure and delivery vocabularies; the one value it adds
// is `awaiting-decision`, a terminal exit for a run that parked a question.

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { IDENTITY_PATTERN } from './repo-config.js';
import { ensureIdentityState, isSafeSegment, recordFile } from './state-root.js';

import type { Budget } from './definition.js';
import type { Isolation, Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. VOCABULARIES
// ───────────────────────────────────────────────────────────────────

const requireCjs = createRequire(import.meta.url);

const lifecycleTaxonomy = requireCjs('../../../system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs') as {
  STOP_REASONS: Record<string, string>;
};

/** The exit of a run that parked a question for the operator. Terminal. */
export const AWAITING_DECISION = 'awaiting-decision';

/**
 * The exit of a run whose one result event could not be recorded. A run that
 * parked before that failure leaves its item open, and the item still holds
 * the bot, so this failed exit may keep naming the item.
 */
export const RESULT_EVENT_UNRECORDED = 'result-event-unrecorded';

/**
 * Readers that speak the loop stop-reason vocabulary see a parked run as
 * blocked, taken from the deep-loop taxonomy rather than spelled here.
 */
export const AWAITING_DECISION_STOP_REASON = lifecycleTaxonomy.STOP_REASONS.blockedStop as string;

/** Who can fix a failed run. Reaching the budget is its own class, apart from a timeout. */
export const FAILURE_CLASSES = ['author', 'operator', 'environment', 'hub', 'budget'] as const;

export type FailureClass = (typeof FAILURE_CLASSES)[number];

/** At-most-once delivery states, plus the two a sender with no acknowledgement can claim. */
export const DELIVERY_STATES = ['queued', 'claimed', 'delivered', 'failed', 'unknown', 'not-attempted', 'attempted'] as const;

export type DeliveryState = (typeof DELIVERY_STATES)[number];

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

export interface RecordIdentity {
  repository: string;
  /** Last known checkout path. */
  repositoryPath: string;
  botId: string;
  runId: string;
  definitionDigest: string;
}

/** Links a queued request to the run it produced. */
export interface RequestJoin {
  requestId: string | null;
  leaseNonce: string | null;
  resultEventId: string | null;
  firedSlot: string | null;
  /** The needs-you item a resumed run continues; absent or null for every other run. */
  resumedItemId?: string | null;
}

export interface DispatchSnapshot {
  source: string;
  scheduledAt: string | null;
  dispatchedAt: string;
  latenessSeconds: number | null;
  latenessClass: string | null;
  skippedSlots: SkippedSlotSummary | null;
  /** A fired slot the runner held instead of dispatching; absent or null for every other run. */
  heldSlot?: HeldSlot | null;
}

/**
 * The slots one fire stood for besides its own. A sleeping host can miss
 * thousands, so the record keeps the count and the first and last instant,
 * and `slots` lists at most the configured number of the most recent ones.
 */
export interface SkippedSlotSummary {
  count: number;
  slots: string[];
  /** Absent on a record written before the summary carried its bounds. */
  first?: string | null;
  last?: string | null;
}

/** A fired slot counted as skipped, with why it was not dispatched. */
export interface HeldSlot {
  at: string;
  reason: string;
}

export interface BudgetRecord {
  declared: Budget;
  /** Measured values; an unknown cost is null, never zero, so it never reads as a free run. */
  measured: {
    iterations: number | null;
    elapsedMinutes: number | null;
    costUsd: number | null;
    costSource: string | null;
  };
}

export interface HonoredPosture {
  isolation: Isolation;
  sandbox: string | null;
  executorKind: string;
  model: string | null;
}

export interface RunExit {
  /** The raw stop or failure reason, kept verbatim so old rows keep their meaning. */
  reason: string;
  /** Derived at write time; null for a run that did not fail. */
  class: FailureClass | null;
  /** Set when the reason is awaiting-decision, and kept when a parked run then failed to record its result. */
  needsYouItemId: string | null;
  /** Present when the run was refused before dispatch, so a refusal never reads as a failure. */
  refusal?: RefusalDetail | null;
}

/** Why a run was refused before dispatch, apart from the stop reason the exit carries. */
export interface RefusalDetail {
  cause: string;
  /** The open item that holds the bot, for a hold refusal. */
  itemId: string | null;
  detail: string | null;
}

export interface EvidenceLocations {
  /** Absolute path of the run folder in the Skilled tree. */
  runFolder: string;
  ledgerDir: string | null;
  receiptDir: string | null;
  observabilityStream: string | null;
  worktreePath: string | null;
  branch: string | null;
  /** What became of the bot worktree; present only for a run that made one. */
  worktree?: WorktreeEvidence | null;
}

/** Where a bot worktree stands: still in use by its run, removed, or kept for the operator. */
export const WORKTREE_DISPOSITIONS = ['active', 'removed', 'kept'] as const;

export type WorktreeDisposition = (typeof WORKTREE_DISPOSITIONS)[number];

/**
 * The bot worktree a run used. The path and branch stay in the evidence
 * locations; this adds what a later reader needs to trust a removal or to
 * find a kept tree's reason.
 */
export interface WorktreeEvidence {
  /** Where the isolation answer came from, so a repository default never turns a bot into a worktree bot unseen. */
  postureSource: 'definition' | 'repository-default';
  /** The commit the tree was branched from; "unchanged" means its tip still equals it. */
  baseCommit: string | null;
  /** Absolute paths of every link made in the tree, unlinked before any removal. */
  links: string[];
  /** Absolute paths of folders made in the tree to hold links, in creation order. */
  createdDirs: string[];
  setupMs: number | null;
  disposition: WorktreeDisposition;
  /** Why a tree was kept: dirty, unmerged, stashed, half-provisioned, killed, or a refused removal step. */
  keptReason: string | null;
  detail: string | null;
}

export interface DeliveryEntry {
  channel: string;
  target: string;
  state: DeliveryState;
  evidence: string | null;
  /** The needs-you item a notice announces; absent for a run's own delivery. */
  itemId?: string;
}

/** What one completed run measured with its routine's until check. The durable outcome lives in the routine state file, so this holds nothing else. */
export interface UntilObservation {
  met: boolean;
}

export interface RunRecord {
  schemaVersion: 1;
  identity: RecordIdentity;
  request: RequestJoin;
  dispatch: DispatchSnapshot;
  budget: BudgetRecord;
  posture: HonoredPosture;
  exit: RunExit;
  evidence: EvidenceLocations;
  delivery: DeliveryEntry[];
  /** Who the run was recorded as: the operator at a terminal, or the operator pinned at install for a scheduled run. Absent on a record written before records named anyone. */
  actor?: string | null;
  /** Who answered the needs-you item this run continues, or the parked run's own item once answered. Absent or null when no answer is involved. */
  answeredBy?: string | null;
  /** The until check of a completed run whose routine carries one. Absent or null for every other run. */
  until?: UntilObservation | null;
}

/** A record read back, with whether its run folder still exists. */
export interface RecordRead {
  record: RunRecord;
  runFolder: { path: string; present: boolean };
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

const FIELD_GROUPS = ['identity', 'request', 'dispatch', 'budget', 'posture', 'exit', 'evidence', 'delivery'] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): boolean {
  return value === null || typeof value === 'string';
}

function isNullableNumber(value: unknown): boolean {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

/**
 * Check a record's shape and its exit rules.
 *
 * @returns The record, or a refusal naming the first broken rule.
 */
export function validateRunRecord(raw: unknown): Result<RunRecord> {
  if (!isPlainObject(raw)) return { ok: false, reason: 'record-invalid', detail: 'expected an object' };
  if (raw.schemaVersion !== 1) return { ok: false, reason: 'record-schema-unsupported' };
  for (const group of FIELD_GROUPS) {
    const value = raw[group];
    const valid = group === 'delivery' ? Array.isArray(value) : isPlainObject(value);
    if (!valid) return { ok: false, reason: 'record-field-missing', detail: group };
  }
  const record = raw as unknown as RunRecord;

  if (typeof record.identity.runId !== 'string' || record.identity.runId === '') {
    return { ok: false, reason: 'record-field-missing', detail: 'identity.runId' };
  }
  if (!isSafeSegment(record.identity.runId)) return { ok: false, reason: 'run-id-invalid' };
  if (typeof record.identity.repository !== 'string' || !IDENTITY_PATTERN.test(record.identity.repository)) {
    return { ok: false, reason: 'identity-invalid' };
  }
  if (typeof record.evidence.runFolder !== 'string' || record.evidence.runFolder === '') {
    return { ok: false, reason: 'record-field-missing', detail: 'evidence.runFolder' };
  }

  const measured = record.budget.measured;
  if (!isPlainObject(measured) || !('costUsd' in measured)) {
    return { ok: false, reason: 'record-field-missing', detail: 'budget.measured.costUsd' };
  }
  for (const key of ['iterations', 'elapsedMinutes', 'costUsd'] as const) {
    if (!isNullableNumber(measured[key])) return { ok: false, reason: 'record-field-invalid', detail: `budget.measured.${key}` };
  }

  const exit = record.exit;
  if (typeof exit.reason !== 'string' || exit.reason === '') {
    return { ok: false, reason: 'record-field-missing', detail: 'exit.reason' };
  }
  if (exit.class !== null && !FAILURE_CLASSES.includes(exit.class)) {
    return { ok: false, reason: 'record-field-invalid', detail: 'exit.class' };
  }
  if (exit.reason === AWAITING_DECISION) {
    if (typeof exit.needsYouItemId !== 'string' || exit.needsYouItemId === '') {
      return { ok: false, reason: 'awaiting-decision-without-item' };
    }
    if (exit.class !== 'operator') return { ok: false, reason: 'awaiting-decision-class-invalid' };
  } else if (exit.needsYouItemId !== null) {
    if (exit.reason !== RESULT_EVENT_UNRECORDED) return { ok: false, reason: 'needs-you-item-without-awaiting-decision' };
    if (typeof exit.needsYouItemId !== 'string' || exit.needsYouItemId === '') {
      return { ok: false, reason: 'record-field-invalid', detail: 'exit.needsYouItemId' };
    }
  }
  if (exit.refusal !== undefined && exit.refusal !== null) {
    const refusal = exit.refusal as unknown;
    if (
      !isPlainObject(refusal)
      || typeof refusal.cause !== 'string'
      || refusal.cause === ''
      || !isNullableString(refusal.itemId)
      || !isNullableString(refusal.detail)
    ) {
      return { ok: false, reason: 'record-field-invalid', detail: 'exit.refusal' };
    }
  }
  const skipped = record.dispatch.skippedSlots as unknown;
  if (skipped !== null && skipped !== undefined) {
    if (
      !isPlainObject(skipped)
      || typeof skipped.count !== 'number'
      || !Number.isSafeInteger(skipped.count)
      || skipped.count < 0
      || !Array.isArray(skipped.slots)
      || !skipped.slots.every((slot) => typeof slot === 'string')
      || !isNullableString(skipped.first ?? null)
      || !isNullableString(skipped.last ?? null)
    ) {
      return { ok: false, reason: 'record-field-invalid', detail: 'dispatch.skippedSlots' };
    }
  }
  const held = record.dispatch.heldSlot as unknown;
  if (held !== null && held !== undefined) {
    if (!isPlainObject(held) || typeof held.at !== 'string' || held.at === '' || typeof held.reason !== 'string' || held.reason === '') {
      return { ok: false, reason: 'record-field-invalid', detail: 'dispatch.heldSlot' };
    }
  }
  if (!isNullableString(record.request.resumedItemId ?? null)) {
    return { ok: false, reason: 'record-field-invalid', detail: 'request.resumedItemId' };
  }
  for (const key of ['actor', 'answeredBy'] as const) {
    if (!isNullableString(raw[key] ?? null)) return { ok: false, reason: 'record-field-invalid', detail: key };
  }
  const until = raw.until as unknown;
  if (until !== undefined && until !== null) {
    if (!isPlainObject(until) || Object.keys(until).length !== 1 || typeof until.met !== 'boolean') {
      return { ok: false, reason: 'record-field-invalid', detail: 'until' };
    }
  }

  const worktree = record.evidence.worktree as unknown;
  if (worktree !== undefined && worktree !== null) {
    if (
      !isPlainObject(worktree)
      || !WORKTREE_DISPOSITIONS.includes(worktree.disposition as WorktreeDisposition)
      || !Array.isArray(worktree.links)
      || !Array.isArray(worktree.createdDirs)
      || !isNullableString(worktree.keptReason)
    ) {
      return { ok: false, reason: 'record-field-invalid', detail: 'evidence.worktree' };
    }
    if (worktree.disposition === 'kept' && (typeof worktree.keptReason !== 'string' || worktree.keptReason === '')) {
      return { ok: false, reason: 'worktree-kept-without-reason' };
    }
    if (typeof record.evidence.worktreePath !== 'string' || typeof record.evidence.branch !== 'string') {
      return { ok: false, reason: 'record-field-missing', detail: 'evidence.worktreePath' };
    }
  }

  for (const [index, entry] of record.delivery.entries()) {
    if (!isPlainObject(entry) || !DELIVERY_STATES.includes(entry.state as DeliveryState)) {
      return { ok: false, reason: 'record-field-invalid', detail: `delivery[${index}].state` };
    }
    if (entry.itemId !== undefined && (typeof entry.itemId !== 'string' || !isSafeSegment(entry.itemId))) {
      return { ok: false, reason: 'record-field-invalid', detail: `delivery[${index}].itemId` };
    }
  }

  return { ok: true, value: record };
}

// ───────────────────────────────────────────────────────────────────
// 4. WRITE & READ
// ───────────────────────────────────────────────────────────────────

/**
 * Validate and write a record by temp file and rename to
 * `<state root>/<identity key>/records/<run id>.json`.
 *
 * @returns The record file path, or the validation refusal; nothing is written on a refusal.
 */
export function writeRunRecord(stateRoot: string, record: RunRecord): Result<string> {
  const valid = validateRunRecord(record);
  if (!valid.ok) return valid;
  ensureIdentityState(stateRoot, record.identity.repository);
  const path = recordFile(stateRoot, record.identity.repository, record.identity.runId);
  writeStateAtomic(path, record);
  return { ok: true, value: path };
}

/**
 * Read a record back and report whether its run folder still exists.
 * A vanished run folder is reported, never thrown.
 *
 * @returns The record and its run folder state, or a refusal (`record-missing`, `record-unreadable`, a validation reason).
 */
export function readRunRecord(stateRoot: string, identity: string, runId: string): Result<RecordRead> {
  const path = recordFile(stateRoot, identity, runId);
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT') return { ok: false, reason: 'record-missing' };
    return { ok: false, reason: 'record-unreadable', detail: code ?? 'unknown error' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'record-invalid', detail: 'not valid JSON' };
  }
  const valid = validateRunRecord(parsed);
  if (!valid.ok) return valid;

  // A record written before these fields reads them as null.
  const record = { ...valid.value, actor: valid.value.actor ?? null, answeredBy: valid.value.answeredBy ?? null, until: valid.value.until ?? null };
  const folder = record.evidence.runFolder;
  return { ok: true, value: { record, runFolder: { path: folder, present: existsSync(folder) } } };
}
