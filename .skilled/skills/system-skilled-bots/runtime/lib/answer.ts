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
// because it reaches the resumed run's prompt.
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
import { ANSWER_SCOPES, needsYouState, normalizeAnswer, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { ANSWER_SOURCE, buildRequest } from './request-record.js';
import { enqueueRequest, queueContext } from './request-queue.js';
import { readRunRecord, writeRunRecord } from './run-record.js';
import { writeGenerationStamp } from './runner.js';
import { isSafeSegment } from './state-root.js';

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
  /** Replaces the queue write; only tests use it. */
  enqueue?: typeof enqueueRequest;
}

export interface AnswerResult {
  status: EnqueueResult['status'];
  requestId: string;
  itemId: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. ANSWER
// ───────────────────────────────────────────────────────────────────

/**
 * Answer one needs-you item and enqueue the run that continues it.
 *
 * The answer records the resolved actor as its by and the scope it was given,
 * and the parked run's record is stamped with that same name. A repeat answer
 * is judged on its text and its scope, so the same words under a different
 * scope are a different answer.
 *
 * @returns `enqueued`, or `duplicate` when the same answer was sent before,
 *   with the request id the item names. A refusal is `answer-empty`,
 *   `scope-invalid`, `actor-invalid`, `item-unknown`, `item-expired`,
 *   `item-answered-differently`, `answer-secret` (named by key, never by
 *   value) or a queue refusal.
 */
export function answerItem(input: AnswerInput): Result<AnswerResult> {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const enqueue = input.enqueue ?? enqueueRequest;
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

  const state = needsYouState(item, now);
  if (state === 'expired') return { ok: false, reason: 'item-expired', detail: `expired at ${item.expiresAt}` };
  if (state === 'answered' && item.answer !== null) {
    const stored = normalizeAnswer(item.answer);
    if (stored.text !== input.text || stored.scope !== scope) {
      return { ok: false, reason: 'item-answered-differently', detail: `answered at ${stored.answeredAt}` };
    }
  }

  const secret = findSecretLiteral(input.text, collectKnownSecrets(env, input.checkoutRoot));
  if (secret !== null) return { ok: false, reason: 'answer-secret', detail: `the answer holds a literal of ${secret.kind} ${secret.name}` };

  let changed = false;
  if (state === 'open') {
    item = { ...item, answer: { text: input.text, answeredAt: now.toISOString(), by: actor.value, scope } };
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) return written;
    changed = true;
  }

  const answeredBy = item.answer === null ? null : normalizeAnswer(item.answer).by;
  if (stampAnsweredBy(stateRoot, identity, item.runId, answeredBy)) changed = true;

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
  return { ok: true, value: { status: sent.value.status, requestId: sent.value.requestId, itemId: item.id } };
}

// ───────────────────────────────────────────────────────────────────
// 3. RECORD STAMP
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
