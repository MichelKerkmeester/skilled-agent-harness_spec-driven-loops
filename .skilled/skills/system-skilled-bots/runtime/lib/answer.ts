// ───────────────────────────────────────────────────────────────────
// MODULE: Answer a Needs-You Item
// ───────────────────────────────────────────────────────────────────
//
// `bots answer` is how a parked run continues: it records the operator's
// answer on the item, then enqueues one `resume` request keyed by the item
// id, then advances the generation stamp. The answer is written before the
// enqueue, so by the time any drain claims the request the item no longer
// holds the bot and the resumed run is not refused. A crash between the two
// leaves an answered item with no request, and running the same answer again
// sends the request; because the key is the item id, sending it twice stores
// it once. The answer is checked for secret literals before it is stored,
// because it reaches the resumed run's prompt. An answer given with the
// no-resume option records the answer, writes the request id the resume would
// have had and queues nothing. A review item asks about a fact rather than the
// bot's work, so its answer settles it in place and queues no run.
//
// The answer carries the name of whoever gave it and a scope of once or deny,
// and the parked run's record is stamped with that same name so a reader of
// the run learns who answered it. The name is resolved here from the argument
// the caller passes, never from a terminal, so a channel daemon or a test
// answers with no tty in sight.
//
// The item and the queue are found under `resolveEnv` when it is given; the
// secret check reads `env`. A library caller passes the job's environment
// from the installer's `jobEnv` as `resolveEnv`, so the answer and its
// request land where the scheduled jobs read them.

import { resolveActor } from './actor.js';
import { collectKnownSecrets, findSecretLiteral } from './dispatch.js';
import { appendMemoryEntry, botMemoryFile, checkMemoryAppend, readMemoryFile } from './memory.js';
import { ANSWER_SCOPES, itemKind, needsYouState, normalizeAnswer, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { ANSWER_SOURCE, buildRequest, requestIdFor } from './request-record.js';
import { enqueueRequest, queueContext } from './request-queue.js';
import { readRunRecord, writeRunRecord } from './run-record.js';
import { writeGenerationStamp } from './runner.js';
import { isSafeSegment } from './state-root.js';

import type { KnownSecrets } from './dispatch.js';
import type { MemoryEntryInput } from './memory.js';
import type { AnswerScope, NeedsYouItem } from './needs-you.js';
import type { Result } from './repo-config.js';
import type { EnqueueResult } from './request-queue.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface AnswerInput {
  checkoutRoot: string;
  itemId: string;
  text: string;
  env?: NodeJS.ProcessEnv;
  /** The environment identity and the state root are resolved under; defaults to `env`. */
  resolveEnv?: NodeJS.ProcessEnv;
  now?: Date;
  /** The name to record as the answer's by, as --as or a channel gives it. Absent means the OS user. */
  actor?: string | null;
  /** once or deny. Absent records once, never an allow beyond this run. */
  scope?: AnswerScope;
  /** False records the answer and queues nothing. Absent or true queues the resume. */
  resume?: boolean;
  /** Replaces the queue write; only tests use it. */
  enqueue?: typeof enqueueRequest;
}

export interface AnswerResult {
  /** `reviewed` means the answer was recorded and no resume was queued. */
  status: EnqueueResult['status'] | 'reviewed';
  requestId: string;
  itemId: string;
  /** The review kind that settled the item, such as memory-proposal. Null when no review kind did. */
  kind: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. REVIEW KINDS
// ───────────────────────────────────────────────────────────────────

/** The answers a NO reads as. On a review item each one records the scope deny. */
const REVIEW_NO = new Set(['reject', 'deny', 'no', 'n']);

/** What one answer settles a review item to. */
type ReviewVerdict = 'confirm' | 'reject';

interface ReviewContext {
  stateRoot: string;
  identity: string;
  known: KnownSecrets;
}

/**
 * One kind of review item. The claim reads the answer before anything is written, so a text the
 * kind does not take leaves the item open. The precheck and the settle run around the answer's
 * write: the precheck refuses before the write so a refusal leaves the item open, and the settle
 * applies the effect after it, checking first whether the effect already landed.
 */
interface ReviewKind {
  kind: string;
  claim(item: NeedsYouItem, text: string): Result<{ verdict: ReviewVerdict; scope: AnswerScope }>;
  precheck(context: ReviewContext, item: NeedsYouItem, verdict: ReviewVerdict, by: string | null, now: Date): Result<null>;
  settle(context: ReviewContext, item: NeedsYouItem, verdict: ReviewVerdict, by: string | null, now: Date): Result<null>;
}

/**
 * The entry a confirmed proposal appends. The validator guarantees the three
 * proposal fields on this kind, so they are asserted rather than defaulted.
 */
function proposalEntry(item: NeedsYouItem, by: string | null, now: Date): MemoryEntryInput {
  return {
    type: item.proposalType as MemoryEntryInput['type'],
    date: now.toISOString().slice(0, 10),
    actor: by ?? 'unknown',
    source: `bot:${item.proposalBotId} (run ${item.runId})`,
    text: item.proposalFact as string,
  };
}

/**
 * Whether a confirm already landed. The source names the proposing run, so one
 * entry per run tells whether the append happened.
 */
function landed(path: string, source: string): boolean {
  return readMemoryFile(path).entries.some((entry) => entry.source === source);
}

/** A memory proposal: confirm appends the fact to the proposing bot's file, reject appends nothing. */
const MEMORY_PROPOSAL_REVIEW: ReviewKind = {
  kind: 'memory-proposal',
  claim(item, text) {
    const t = text.trim().toLowerCase();
    if (t === 'confirm') return { ok: true, value: { verdict: 'confirm', scope: 'once' } };
    if (REVIEW_NO.has(t)) return { ok: true, value: { verdict: 'reject', scope: 'deny' } };
    return { ok: false, reason: 'review-answer-invalid', detail: text };
  },
  precheck(context, item, verdict, by, now) {
    if (verdict === 'reject') return { ok: true, value: null };
    const path = botMemoryFile(context.stateRoot, context.identity, item.proposalBotId as string);
    if (!path.ok) return path;
    const entry = proposalEntry(item, by, now);
    if (landed(path.value, entry.source)) return { ok: true, value: null };
    const secret = findSecretLiteral(item.proposalFact as string, context.known);
    if (secret !== null) return { ok: false, reason: 'memory-secret', detail: secret.name };
    const checked = checkMemoryAppend(path.value, entry, { botId: item.proposalBotId });
    if (!checked.ok) return checked;
    return { ok: true, value: null };
  },
  settle(context, item, verdict, by, now) {
    if (verdict === 'reject') return { ok: true, value: null };
    const path = botMemoryFile(context.stateRoot, context.identity, item.proposalBotId as string);
    if (!path.ok) return path;
    const entry = proposalEntry(item, by, now);
    // The settle repeats the precheck because the file can fill between the two.
    if (landed(path.value, entry.source)) return { ok: true, value: null };
    const secret = findSecretLiteral(item.proposalFact as string, context.known);
    if (secret !== null) return { ok: false, reason: 'memory-secret', detail: secret.name };
    const appended = appendMemoryEntry(path.value, entry, { botId: item.proposalBotId });
    if (!appended.ok) return appended;
    return { ok: true, value: null };
  },
};

const REVIEW_KINDS: readonly ReviewKind[] = [MEMORY_PROPOSAL_REVIEW];

/** The review kind that claims an item by its kind, asked in order, or null for a plain decision. */
function reviewFor(item: NeedsYouItem): ReviewKind | null {
  const kind = itemKind(item);
  return REVIEW_KINDS.find((r) => r.kind === kind) ?? null;
}

// ───────────────────────────────────────────────────────────────────
// 3. ANSWER
// ───────────────────────────────────────────────────────────────────

/**
 * Answer one needs-you item and enqueue the run that continues it.
 *
 * The answer records the resolved actor as its by and the scope it was given,
 * and the parked run's record is stamped with that same name. A repeat answer
 * is judged on its text and its scope, so the same words under a different
 * scope are a different answer.
 *
 * A review item, such as a memory proposal, takes confirm or reject instead of
 * free text. Its answer settles the item through the item's review kind and
 * returns `reviewed` with that kind, and it queues no run.
 *
 * @returns `enqueued`, or `duplicate` when the same answer was sent before,
 *   with the request id the item names. The no-resume option returns
 *   `reviewed` instead, with the request id the resume would have carried. A
 *   refusal is `answer-empty`, `scope-invalid`, `actor-invalid`,
 *   `item-unknown`, `item-expired`, `item-answered-differently`,
 *   `answer-secret` (named by key, never by value), `review-answer-invalid`,
 *   `memory-full`, `memory-secret` or a queue refusal.
 */
export function answerItem(input: AnswerInput): Result<AnswerResult> {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const enqueue = input.enqueue ?? enqueueRequest;
  const noResume = input.resume === false;
  if (input.text.trim() === '') return { ok: false, reason: 'answer-empty' };

  const scope = input.scope ?? 'once';
  if (!ANSWER_SCOPES.includes(scope)) return { ok: false, reason: 'scope-invalid', detail: String(input.scope) };
  const actor = resolveActor({ as: input.actor ?? null, env, scheduled: false });
  if (!actor.ok) return actor;

  const context = queueContext(input.checkoutRoot, input.resolveEnv ?? env);
  if (!context.ok) return context;
  const { identity, stateRoot } = context.value;

  if (!isSafeSegment(input.itemId)) return { ok: false, reason: 'item-unknown', detail: input.itemId };
  const read = readNeedsYouItem(stateRoot, identity, input.itemId);
  if (!read.ok) {
    return read.reason === 'item-missing' ? { ok: false, reason: 'item-unknown', detail: input.itemId } : read;
  }
  let item: NeedsYouItem = read.value;
  const review = reviewFor(item);
  const claimed = review !== null ? review.claim(item, input.text) : null;
  // A review item's answer decides its own scope, so the duplicate check below compares the scope it will record.
  const answerScope: AnswerScope = claimed !== null && claimed.ok ? claimed.value.scope : scope;

  const state = needsYouState(item, now);
  if (state === 'expired') return { ok: false, reason: 'item-expired', detail: `expired at ${item.expiresAt}` };
  if (state === 'answered' && item.answer !== null && !noResume) {
    const stored = normalizeAnswer(item.answer);
    if (stored.text !== input.text || stored.scope !== answerScope) {
      return { ok: false, reason: 'item-answered-differently', detail: `answered at ${stored.answeredAt}` };
    }
  }

  const known = collectKnownSecrets(env, input.checkoutRoot);
  const secret = findSecretLiteral(input.text, known);
  if (secret !== null) return { ok: false, reason: 'answer-secret', detail: `the answer holds a literal of ${secret.kind} ${secret.name}` };

  if (claimed !== null && !claimed.ok) return claimed;
  const reviewContext: ReviewContext = { stateRoot, identity, known };
  if (review !== null && claimed !== null && claimed.ok && state === 'open') {
    const checked = review.precheck(reviewContext, item, claimed.value.verdict, actor.value, now);
    if (!checked.ok) return checked;
  }

  let changed = false;
  if (state === 'open') {
    item = { ...item, answer: { text: input.text, answeredAt: now.toISOString(), by: actor.value, scope: answerScope } };
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) return written;
    changed = true;
  }

  const answeredBy = item.answer === null ? null : normalizeAnswer(item.answer).by;
  if (stampAnsweredBy(stateRoot, identity, item.runId, answeredBy)) changed = true;

  if (review !== null && claimed !== null && claimed.ok) {
    const by = item.answer === null ? actor.value : normalizeAnswer(item.answer).by;
    const settled = review.settle(reviewContext, item, claimed.value.verdict, by, now);
    if (!settled.ok) return settled;
    // A review item queues no run, so the id names the request it would have carried and nothing waits on it.
    const requestId = item.resumeRequestId ?? requestIdFor(item.botId, item.id);
    if (item.resumeRequestId === null) {
      const written = writeNeedsYouItem(stateRoot, { ...item, resumeRequestId: requestId });
      if (!written.ok) return written;
      changed = true;
    }
    if (changed) writeGenerationStamp(stateRoot, identity, now);
    return { ok: true, value: { status: 'reviewed', requestId, itemId: item.id, kind: review.kind } };
  }

  if (noResume) {
    // The id the resume would have carried, so nothing waits on a request that was never queued.
    const requestId = item.resumeRequestId ?? requestIdFor(item.botId, item.id);
    if (item.resumeRequestId === null) {
      const written = writeNeedsYouItem(stateRoot, { ...item, resumeRequestId: requestId });
      if (!written.ok) return written;
      changed = true;
    }
    if (changed) writeGenerationStamp(stateRoot, identity, now);
    return { ok: true, value: { status: 'reviewed', requestId, itemId: item.id, kind: null } };
  }

  const request = buildRequest({
    kind: 'resume',
    workflowId: item.botId,
    source: ANSWER_SOURCE,
    eventId: item.id,
    origin: `needs-you item ${item.id}`,
    target: { identity, path: input.checkoutRoot },
    now,
  });
  if (!request.ok) return request;
  const sent = enqueue(stateRoot, request.value);
  if (!sent.ok) return sent;

  // The request id is derived from the item id, so a re-sent answer names the request already queued.
  if (item.resumeRequestId === null) {
    const written = writeNeedsYouItem(stateRoot, { ...item, resumeRequestId: sent.value.requestId });
    if (!written.ok) return written;
    changed = true;
  }
  if (changed) writeGenerationStamp(stateRoot, identity, now);
  return { ok: true, value: { status: sent.value.status, requestId: sent.value.requestId, itemId: item.id, kind: null } };
}

// ───────────────────────────────────────────────────────────────────
// 4. RECORD STAMP
// ───────────────────────────────────────────────────────────────────

/**
 * Stamp the parked run's record with the name on its item's answer.
 *
 * The name is read from the item's stored answer, so a repeat answer stamps
 * the first answerer rather than the repeater. A record that is missing or
 * unreadable is skipped in silence, because the answer can land before the
 * parked run writes its record and the answer must still succeed. A refused
 * write is ignored for the same reason.
 *
 * @returns True when a record was written, so the caller moves the generation stamp.
 */
function stampAnsweredBy(stateRoot: string, identity: string, runId: string, by: string | null): boolean {
  if (by === null) return false;
  const read = readRunRecord(stateRoot, identity, runId);
  if (!read.ok) return false;
  if (read.value.record.answeredBy === by) return false;
  const written = writeRunRecord(stateRoot, { ...read.value.record, answeredBy: by });
  return written.ok;
}
