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
// have had and queues nothing. A review item asks about a fact or a proposed
// skill rather than the bot's work, so its answer settles it in place and
// queues no run.
//
// The answer carries the name of whoever gave it and a scope of once or deny,
// and the parked run's record is stamped with that same name so a reader of
// the run learns who answered it. The name is resolved here from the argument
// the caller passes, never from a terminal, so a channel daemon or a test
// answers with no tty in sight. The answer writes its scope, its actor and its
// instant on the item's grant in the same write, and the no-resume option
// drops a resume still queued for the item.
//
// The item and the queue are found under `resolveEnv` when it is given; the
// secret check reads `env`. A library caller passes the job's environment
// from the installer's `jobEnv` as `resolveEnv`, so the answer and its
// request land where the scheduled jobs read them.

import { randomBytes } from 'node:crypto';
import { chmodSync, closeSync, linkSync, openSync, readFileSync, renameSync, statSync, unlinkSync, writeSync } from 'node:fs';
import { join } from 'node:path';

import { classifyAction, clipAction } from './action-kind.js';
import { resolveActor } from './actor.js';
import { decideApproval, grantScopeFor } from './approval-ladder.js';
import { isApprover } from './channel-link.js';
import { collectAllKnownSecrets, findSecretLiteral } from './dispatch.js';
import { appendMemoryEntry, botMemoryFile, checkMemoryAppend, readMemoryFile } from './memory.js';
import { ANSWER_SCOPES, itemKind, needsYouState, normalizeAnswer, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { ANSWER_SOURCE, buildRequest, requestIdFor } from './request-record.js';
import { enqueueRequest, listInbox, queueContext, queueFolders } from './request-queue.js';
import { readRunRecord, writeRunRecord } from './run-record.js';
import { writeGenerationStamp } from './runner.js';
import { claimProposalAnswer, DEFAULT_SKILLED_TREE, settleProposalAnswer } from './skill-proposal.js';
import { identityStatePaths, isSafeSegment } from './state-root.js';

import type { KnownSecrets } from './dispatch.js';
import type { MemoryEntryInput } from './memory.js';
import type { AnswerScope, NeedsYouGrant, NeedsYouItem } from './needs-you.js';
import type { Result } from './repo-config.js';
import type { EnqueueResult } from './request-queue.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** Where an answer came from. A chat answer is checked against the roster, and the host's terminal is its own authority. */
export type AnswerSurface = 'terminal' | 'channel';

/** Every surface an answer may name. */
export const ANSWER_SURFACES: readonly AnswerSurface[] = ['terminal', 'channel'];

export interface AnswerInput {
  checkoutRoot: string;
  /** The Skilled tree whose `.skilled/skills` holds a skill proposal's target, the root the loader reads. Absent means the tree this runtime ships in. */
  skilledTree?: string;
  itemId: string;
  text: string;
  env?: NodeJS.ProcessEnv;
  /** The environment identity and the state root are resolved under; defaults to `env`. */
  resolveEnv?: NodeJS.ProcessEnv;
  now?: Date;
  /** The name to record as the answer's by, as --as or a channel gives it. Absent means the OS user. */
  actor?: string | null;
  /**
   * The surface the answer came from, required with no default. On channel an absent, unreadable or empty roster
   * refuses the answer, and on terminal it refuses nothing. A present roster must name the actor on both.
   */
  surface: AnswerSurface;
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
  skilledTree: string;
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

/**
 * A skill proposal: the answer records the decision beside the proposal and queues no run. The pin
 * is checked before the answer is written, so a target that changed since the proposal read it
 * refuses with the item still open. A proposal that does not read is no proposal, so the answer
 * still lands and settles nothing rather than refusing every answer on the item.
 */
const SKILL_PROPOSAL_REVIEW: ReviewKind = {
  kind: 'skill-proposal',
  claim(item, text) {
    const t = text.trim().toLowerCase();
    if (t === 'confirm') return { ok: true, value: { verdict: 'confirm', scope: 'once' } };
    if (REVIEW_NO.has(t)) return { ok: true, value: { verdict: 'reject', scope: 'deny' } };
    return { ok: false, reason: 'review-answer-invalid', detail: text };
  },
  precheck(context, item) {
    const claimed = claimProposalAnswer({ stateRoot: context.stateRoot, identity: context.identity, skilledTree: context.skilledTree, item });
    if (!claimed.ok) return claimed;
    return { ok: true, value: null };
  },
  settle(context, item, verdict) {
    const settled = settleProposalAnswer({ stateRoot: context.stateRoot, identity: context.identity, item, decision: verdict });
    if (!settled.ok) return settled;
    return { ok: true, value: null };
  },
};

const REVIEW_KINDS: readonly ReviewKind[] = [MEMORY_PROPOSAL_REVIEW, SKILL_PROPOSAL_REVIEW];

/** The review kind that claims an item by its kind, asked in order, or null for a plain decision. */
function reviewFor(item: NeedsYouItem): ReviewKind | null {
  const kind = itemKind(item);
  return REVIEW_KINDS.find((r) => r.kind === kind) ?? null;
}

// ───────────────────────────────────────────────────────────────────
// 3. ANSWER
// ───────────────────────────────────────────────────────────────────

/**
 * The item's grant with the answer's scope, actor and instant written on it, so the grant and the
 * answer land in one write and cannot disagree. An item written before items carried a grant gets one
 * built from its question, and a question the classifier refuses keeps no grant.
 */
function answeredGrant(item: NeedsYouItem, scope: AnswerScope, by: string, at: string): NeedsYouGrant | null {
  let born = item.grants ?? null;
  if (born === null) {
    const classified = classifyAction(item.question);
    if (!classified.ok) return null;
    born = { kind: classified.value, action: clipAction(item.question), rung: decideApproval({ kind: classified.value }).rung, scope: null, grantedBy: null, grantedAt: null };
  }
  return { ...born, scope, grantedBy: by, grantedAt: at };
}

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
 * The roster check comes before the lock: a present roster must name the actor on either surface, and on the channel surface a missing roster refuses too.
 *
 * @returns `enqueued`, or `duplicate` when the same answer was sent before,
 *   with the request id the item names. The no-resume option returns
 *   `reviewed` instead, with the request id the resume would have carried. A
 *   refusal is `answer-empty`, `scope-invalid`, `actor-invalid`,
 *   `surface-invalid`, `answer-not-approver`, `channel-roster-missing`,
 *   `item-unknown`, `item-busy`, `item-expired`,
 *   `item-answered-differently`, `answer-secret` (named by key, never by
 *   value), `review-answer-invalid`, `memory-full`, `memory-secret`,
 *   `proposal-stale` or a queue refusal.
 */
export function answerItem(input: AnswerInput): Result<AnswerResult> {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const enqueue = input.enqueue ?? enqueueRequest;
  const noResume = input.resume === false;
  if (input.text.trim() === '') return { ok: false, reason: 'answer-empty' };

  if (input.scope !== undefined && !ANSWER_SCOPES.includes(input.scope)) return { ok: false, reason: 'scope-invalid', detail: String(input.scope) };
  // A caller that names no surface is refused rather than read as terminal, so a chat transport cannot skip the roster by omission.
  if (!ANSWER_SURFACES.includes(input.surface)) return { ok: false, reason: 'surface-invalid', detail: String(input.surface) };
  const surface: AnswerSurface = input.surface;
  // A NO records deny even when once was given, so a refusal is never recorded as an approval.
  const scope = grantScopeFor(input.text, input.scope ?? null);
  const actor = resolveActor({ as: input.actor ?? null, env, scheduled: false });
  if (!actor.ok) return actor;

  const context = queueContext(input.checkoutRoot, input.resolveEnv ?? env);
  if (!context.ok) return context;
  const { identity, stateRoot } = context.value;

  // The roster is read before the lock and before any write, so a refused answerer never holds the lock a second answerer waits on.
  const approver = isApprover(stateRoot, identity, actor.value);
  if (approver === 'roster-missing' && surface === 'channel') return { ok: false, reason: 'channel-roster-missing', detail: 'a chat answer needs a roster that names an owner' };
  if (approver === 'not-approver') return { ok: false, reason: 'answer-not-approver', detail: actor.value ?? 'unknown' };

  if (!isSafeSegment(input.itemId)) return { ok: false, reason: 'item-unknown', detail: input.itemId };

  const lock = acquireItemLock(stateRoot, identity, input.itemId);
  if (!lock.ok) return lock;
  try {
    return answerLocked(input, { env, now, enqueue, noResume, scope, actor: actor.value, identity, stateRoot });
  } finally {
    releaseItemLock(lock.value);
  }
}

/** What answerItem resolved before it took the lock, so the locked half reads it from one place. */
interface LockedContext {
  env: NodeJS.ProcessEnv;
  now: Date;
  enqueue: typeof enqueueRequest;
  noResume: boolean;
  scope: AnswerScope;
  actor: string | null;
  identity: string;
  stateRoot: string;
}

/**
 * Everything after the lock, so the read, the judgement and the write all happen while the lock is
 * held and two answers that both found the item open cannot both land.
 */
function answerLocked(input: AnswerInput, ctx: LockedContext): Result<AnswerResult> {
  const { env, now, enqueue, noResume, scope, identity, stateRoot } = ctx;
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
    // The answer's identity is its text and its scope together, so the same words under another scope are another answer.
    if (stored.text !== input.text || stored.scope !== answerScope) {
      return { ok: false, reason: 'item-answered-differently', detail: `answered at ${stored.answeredAt}` };
    }
  }

  // The answer and the memory settle it feeds check every stored value, and a vault that cannot be read refuses the answer rather than checking the environment alone.
  const allKnown = collectAllKnownSecrets(env, input.checkoutRoot, stateRoot, identity);
  if (!allKnown.ok) return { ok: false, reason: 'secret-store-unreadable', detail: allKnown.detail ?? 'the vault could not be read' };
  const known = allKnown.value;
  const secret = findSecretLiteral(input.text, known);
  if (secret !== null) return { ok: false, reason: 'answer-secret', detail: `the answer holds a literal of ${secret.kind} ${secret.name}` };

  if (claimed !== null && !claimed.ok) return claimed;
  const reviewContext: ReviewContext = { stateRoot, identity, known, skilledTree: input.skilledTree ?? DEFAULT_SKILLED_TREE };
  if (review !== null && claimed !== null && claimed.ok && state === 'open') {
    const checked = review.precheck(reviewContext, item, claimed.value.verdict, ctx.actor, now);
    if (!checked.ok) return checked;
  }

  let changed = false;
  if (state === 'open') {
    const answeredAt = now.toISOString();
    item = {
      ...item,
      answer: { text: input.text, answeredAt, by: ctx.actor, scope: answerScope },
      grants: answeredGrant(item, answerScope, ctx.actor ?? 'unknown', answeredAt),
    };
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) return written;
    changed = true;
  }

  const answeredBy = item.answer === null ? null : normalizeAnswer(item.answer).by;
  if (stampAnsweredBy(stateRoot, identity, item.runId, answeredBy)) changed = true;

  if (review !== null && claimed !== null && claimed.ok) {
    const by = item.answer === null ? ctx.actor : normalizeAnswer(item.answer).by;
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
    // A resume an earlier answer queued would dispatch the run this option exists to stop, so it is dropped before the request id is recorded.
    const folders = queueFolders(stateRoot, identity);
    const queued = `${requestId}.json`;
    if (listInbox(folders).includes(queued)) {
      try {
        unlinkSync(join(folders.inbox, queued));
        changed = true;
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
      }
    }
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
// 4. ITEM LOCK
// ───────────────────────────────────────────────────────────────────

/** An answer holds the lock for milliseconds, so a lock older than this has no live owner. */
const LOCK_STALE_MS = 60_000;

/** How long an answer waits for a lock another answer holds before it is refused. */
const LOCK_WAIT_MS = 2_000;

/** How long a waiting answer pauses between attempts. */
const LOCK_POLL_MS = 50;

/** The lock one answer holds on one item. */
interface ItemLock {
  path: string;
  nonce: string;
}

/** What a lock file holds, so a reclaimer can tell a live owner from a killed one. */
interface LockFile {
  pid: number;
  nonce: string;
  createdAt: string;
}

/** The lock file beside one item. */
function lockPath(stateRoot: string, identity: string, itemId: string): string {
  return join(identityStatePaths(stateRoot, identity).needsYou, `${itemId}.lock`);
}

/**
 * Whether a process is still running. The probe sends no signal, so it never touches the process.
 *
 * @returns True when the pid exists, including one this user may not signal.
 */
function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    // A process this user may not signal still exists, so only a missing one reads as gone.
    return (error as NodeJS.ErrnoException | null)?.code === 'EPERM';
  }
}

/**
 * Read a lock file.
 *
 * @returns Null when the file is missing, `torn` when it exists but does not hold a lock, else its
 *   contents.
 */
function readLock(path: string): LockFile | null | 'torn' {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') return null;
    throw error;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return 'torn';
  }
  if (typeof parsed !== 'object' || parsed === null) return 'torn';
  const file = parsed as Partial<LockFile>;
  if (typeof file.pid !== 'number' || typeof file.nonce !== 'string' || typeof file.createdAt !== 'string') return 'torn';
  return { pid: file.pid, nonce: file.nonce, createdAt: file.createdAt };
}

/**
 * Wait without a busy loop. The wait blocks the thread and keeps answerItem synchronous, because
 * every caller depends on that.
 */
function pause(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Take the item's lock, waiting a bounded time for another answer to release it.
 *
 * The lock is created exclusively, so one answer creates it and every other answer sees it held.
 * A lock whose owner is gone or whose age is past the stale bound is reclaimed by renaming it
 * aside, so a lock a killed process left behind never blocks the next answer.
 *
 * @returns The held lock, `item-unknown` when the item's folder is gone, or `item-busy` when a live
 *   answer still holds it after the wait.
 */
function acquireItemLock(stateRoot: string, identity: string, itemId: string): Result<ItemLock> {
  const path = lockPath(stateRoot, identity, itemId);
  const nonce = randomBytes(16).toString('hex');
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    let fd: number | null = null;
    try {
      fd = openSync(path, 'wx', 0o600);
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException | null)?.code;
      // No needs-you folder means no item to answer.
      if (code === 'ENOENT') return { ok: false, reason: 'item-unknown', detail: itemId };
      if (code !== 'EEXIST') throw error;
    }
    if (fd !== null) {
      const body: LockFile = { pid: process.pid, nonce, createdAt: new Date().toISOString() };
      try {
        writeSync(fd, JSON.stringify(body));
      } finally {
        closeSync(fd);
      }
      chmodSync(path, 0o600);
      const mine = readLock(path);
      if (mine !== null && mine !== 'torn' && mine.nonce === nonce) return { ok: true, value: { path, nonce } };
      // Another process won the race, so the loop decides again from the top.
      continue;
    }

    const held = readLock(path);
    if (held === null) continue;
    let stale = false;
    let staleNonce: string | null = null;
    let busyPid = 'unknown';
    let busySince = 'unknown';
    if (held === 'torn') {
      let mtime: number;
      try {
        mtime = statSync(path).mtimeMs;
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') continue;
        throw error;
      }
      busySince = new Date(mtime).toISOString();
      stale = Date.now() - mtime > LOCK_STALE_MS;
    } else {
      busyPid = String(held.pid);
      busySince = held.createdAt;
      const born = Date.parse(held.createdAt);
      // An unparsable createdAt cannot prove a live owner, so it counts as stale.
      stale = !pidAlive(held.pid) || Number.isNaN(born) || Date.now() - born > LOCK_STALE_MS;
      staleNonce = held.nonce;
    }

    if (stale) {
      const aside = `${path}.${nonce}.stale`;
      try {
        renameSync(path, aside);
      } catch (error: unknown) {
        // Another reclaimer moved it first, so the loop reads the path again.
        if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') continue;
        throw error;
      }
      // Only the process whose rename succeeded retries the create, and the re-read after the create decides who holds it.
      const moved = readLock(aside);
      if (moved !== null && moved !== 'torn' && moved.nonce !== staleNonce) {
        // A fresh lock was created between the read and the rename, so it goes back where its owner expects it.
        try {
          linkSync(aside, path);
        } catch (error: unknown) {
          if ((error as NodeJS.ErrnoException | null)?.code !== 'EEXIST') throw error;
        }
      }
      try {
        unlinkSync(aside);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
      }
      continue;
    }

    if (Date.now() >= deadline) return { ok: false, reason: 'item-busy', detail: `held by pid ${busyPid} since ${busySince}` };
    pause(LOCK_POLL_MS);
  }
}

/**
 * Release the lock, but only while it is still this answer's.
 *
 * A process whose lock was reclaimed must never delete the lock the next answer now holds, so the
 * file is read first and removed only when it still carries this lock's nonce.
 */
function releaseItemLock(lock: ItemLock): void {
  const held = readLock(lock.path);
  if (held === null || held === 'torn' || held.nonce !== lock.nonce) return;
  try {
    unlinkSync(lock.path);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. RECORD STAMP
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
