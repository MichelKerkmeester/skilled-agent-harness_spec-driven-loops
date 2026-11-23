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
// The item and the queue are found under `resolveEnv` when it is given; the
// secret check reads `env`. A library caller passes the job's environment
// from the installer's `jobEnv` as `resolveEnv`, so the answer and its
// request land where the scheduled jobs read them.

import { collectKnownSecrets, findSecretLiteral } from './dispatch.js';
import { needsYouState, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { ANSWER_SOURCE, buildRequest } from './request-record.js';
import { enqueueRequest, queueContext } from './request-queue.js';
import { writeGenerationStamp } from './runner.js';
import { isSafeSegment } from './state-root.js';

import type { NeedsYouItem } from './needs-you.js';
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
 * @returns `enqueued`, or `duplicate` when the same answer was sent before,
 *   with the request id the item names; or a refusal: `answer-empty`,
 *   `item-unknown`, `item-expired`, `item-answered-differently`,
 *   `answer-secret` (named by key, never by value), or a queue refusal.
 */
export function answerItem(input: AnswerInput): Result<AnswerResult> {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const enqueue = input.enqueue ?? enqueueRequest;
  if (input.text.trim() === '') return { ok: false, reason: 'answer-empty' };

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
  if (state === 'answered' && item.answer?.text !== input.text) {
    return { ok: false, reason: 'item-answered-differently', detail: `answered at ${item.answer?.answeredAt ?? 'unknown'}` };
  }

  const secret = findSecretLiteral(input.text, collectKnownSecrets(env, input.checkoutRoot));
  if (secret !== null) return { ok: false, reason: 'answer-secret', detail: `the answer holds a literal of ${secret.kind} ${secret.name}` };

  let changed = false;
  if (state === 'open') {
    item = { ...item, answer: { text: input.text, answeredAt: now.toISOString() } };
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) return written;
    changed = true;
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
  return { ok: true, value: { status: sent.value.status, requestId: sent.value.requestId, itemId: item.id } };
}
