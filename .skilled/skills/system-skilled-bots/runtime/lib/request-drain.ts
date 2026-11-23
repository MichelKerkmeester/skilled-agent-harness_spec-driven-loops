// ───────────────────────────────────────────────────────────────────
// MODULE: Request Drain
// ───────────────────────────────────────────────────────────────────
//
// One pass over the watched folder: claim each request by rename, hand it
// to the bot runner and route the outcome, so every request leaves the
// watched folder. A run (completed or parked on a question) is done. A
// refusal is quarantined with its cause and never retried, because running
// it again would be refused the same way; a request for a paused bot or a
// bot held by an open question is quarantined too and is not replayed when
// the pause lifts or the question is answered. A failure goes back to the
// watched folder until the retry bound, then to quarantine, except a run that
// already ran (its result event went unrecorded) or an author error, which are
// quarantined at once: a run is never dispatched twice. A pass handles only
// what was in the folder when it started, so a request retried in this pass
// waits for the next one. Only a setup fault (no identity, no usable run
// folder, no executor on PATH) stops the pass, with the claimed request put
// back, so a broken setup never burns the queue.
//
// The queue's identity and state root are resolved under `resolveEnv` when it
// is given, and passed on to every run, while the runs execute under `env`. A
// library caller that is not the launchd-started drain job passes the job's
// environment from the installer's `jobEnv` as `resolveEnv`, so it drains the
// inbox the job watches.

import {
  atRetryBound,
  claimRequest,
  finishRequest,
  listClaimed,
  listInbox,
  MALFORMED_REQUEST_REASON,
  queueFolders,
  quarantineRequest,
  readClaimed,
  releaseClaim,
  retryRequest,
  RETRY_BOUND_REASON,
} from './request-queue.js';
import { identityKey } from './identity.js';
import { RESULT_EVENT_UNRECORDED } from './run-record.js';
import { resolveBotContext, runBot as defaultRunBot } from './runner.js';

import type { Result } from './repo-config.js';
import type { RunBotInput, RunOutcome } from './runner.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

export type DrainOutcome = 'ran' | 'retry' | 'quarantined' | 'lost-claim';

export interface DrainLine {
  /** The request id, or the entry's file name when it is not a request. */
  requestId: string;
  outcome: DrainOutcome;
  /** The quarantine reason; null for every other outcome. */
  reason: string | null;
  runId: string | null;
}

export interface DrainReport {
  lines: DrainLine[];
  /** Entries already in the claimed folder when the pass began: in flight elsewhere, or left by a crash. Never redispatched here. */
  claimedAtStart: string[];
  /** Entries in the watched folder when the pass ended. */
  remaining: number;
}

export interface DrainInput {
  checkoutRoot: string;
  skilledTree: string;
  env?: NodeJS.ProcessEnv;
  /** The environment identity and the state root are resolved under; defaults to `env`. */
  resolveEnv?: NodeJS.ProcessEnv;
  /** Options passed through to every run; tests pin the recursion guard's host reads here. */
  runOptions?: Pick<RunBotInput, 'guard' | 'buildCommand' | 'minuteMs'>;
  /** Replaces the bot runner; only tests use it. */
  runBot?: (input: RunBotInput) => Promise<RunOutcome>;
}

/** The quarantine reason of a request the runner refused because an open question holds its bot. */
export const HELD_REASON = 'held-needs-you';

/** The quarantine reason of a request whose target is another repository. */
export const TARGET_MISMATCH_REASON = 'target-mismatch';

/** Refusals that would hit every request alike, so the pass stops instead of quarantining. */
const ENVIRONMENT_CAUSES = new Set(['identity-unknown', 'run-folder-refused']);

/**
 * Refusals that say "not now" rather than "never": the request counts an attempt and goes back.
 * A bot whose answered question still waits for its resume lifts that hold itself once the
 * queued resume runs, so a request behind it waits rather than being quarantined.
 */
const TRANSIENT_CAUSES = new Set(['lease-held', 'awaiting-resume-hold']);

/**
 * Failures a second dispatch cannot mend. A run whose result event went unrecorded already
 * ran, and its work is on disk, so dispatching it again would do that work twice. An empty
 * decision marker is the definition's own error and repeats on every attempt. Both are
 * quarantined at once under their own reason, so they stay visible.
 */
const NO_RETRY_FAILURES = new Set([RESULT_EVENT_UNRECORDED, 'decision-marker-empty']);

/**
 * A setup fault, not the request's: the executor is not on the PATH the runs get, which is
 * launchd's bare one for the drain job. Retrying would spend the request's attempts on a
 * fault no attempt can mend, a resume included, so the pass stops with the request put back
 * and no attempt counted. Where bots use different executor kinds, one missing CLI stops each
 * pass at its request, and the requests after it wait until the PATH is fixed.
 */
const ENVIRONMENT_FAILURES = new Set(['executor-unavailable']);

type Route =
  | { kind: 'done' }
  | { kind: 'retry' }
  | { kind: 'quarantine'; reason: string; detail: string | null }
  | { kind: 'stop'; detail: string };

// ───────────────────────────────────────────────────────────────────
// 2. ROUTING
// ───────────────────────────────────────────────────────────────────

/**
 * Decide where a request goes after its run. A cause the drain does not
 * know is treated as a failure, so the retry bound still stops it.
 */
export function routeOutcome(outcome: RunOutcome): Route {
  switch (outcome.kind) {
    case 'completed':
    case 'awaiting-decision':
      return { kind: 'done' };
    case 'failed':
      if (ENVIRONMENT_FAILURES.has(outcome.reason)) return { kind: 'stop', detail: outcome.reason };
      if (NO_RETRY_FAILURES.has(outcome.reason)) return { kind: 'quarantine', reason: outcome.reason, detail: null };
      return { kind: 'retry' };
    case 'refused': {
      const cause: string = outcome.cause;
      if (cause === 'awaiting-decision-hold') return { kind: 'quarantine', reason: HELD_REASON, detail: outcome.detail };
      if (ENVIRONMENT_CAUSES.has(cause) && outcome.runId === null) {
        return { kind: 'stop', detail: `${cause}${outcome.detail !== null ? `: ${outcome.detail}` : ''}` };
      }
      if (TRANSIENT_CAUSES.has(cause)) return { kind: 'retry' };
      return { kind: 'quarantine', reason: cause, detail: outcome.detail };
    }
    default:
      return { kind: 'retry' };
  }
}

/** What stopped one attempt, in the words the run's outcome uses. */
function lastCause(outcome: RunOutcome | null): string {
  if (outcome === null) return 'runner-threw';
  switch (outcome.kind) {
    case 'refused':
      return outcome.cause;
    case 'failed':
      return outcome.reason;
    default:
      return outcome.kind;
  }
}

/** One printed line per request: its id and its outcome. */
export function formatDrainLine(line: DrainLine): string {
  return line.outcome === 'quarantined' ? `${line.requestId} quarantined: ${line.reason ?? 'unknown'}` : `${line.requestId} ${line.outcome}`;
}

// ───────────────────────────────────────────────────────────────────
// 3. DRAIN
// ───────────────────────────────────────────────────────────────────

/**
 * Drain the watched folder of one checkout once.
 *
 * @returns The per-request lines, or a refusal when the checkout has no
 *   queue context or the pass stopped on an environment refusal.
 */
export async function drainQueue(input: DrainInput): Promise<Result<DrainReport>> {
  const env = input.env ?? process.env;
  const run = input.runBot ?? defaultRunBot;
  const context = resolveBotContext({ checkoutRoot: input.checkoutRoot, skilledTree: input.skilledTree, env: input.resolveEnv ?? env });
  if (!context.ok) return context;
  const { stateRoot, identity } = context.value;
  const folders = queueFolders(stateRoot, identity);

  const claimedAtStart = listClaimed(folders);
  const lines: DrainLine[] = [];
  for (const name of listInbox(folders)) {
    const claimed = claimRequest(folders, name);
    if (!claimed.ok) {
      if (claimed.reason === 'claim-lost') {
        lines.push({ requestId: name.replace(/\.json$/, ''), outcome: 'lost-claim', reason: null, runId: null });
        continue;
      }
      return claimed;
    }

    const parsed = readClaimed(folders, name);
    if (!parsed.ok) {
      const moved = quarantineRequest(folders, name, null, MALFORMED_REQUEST_REASON, parsed.reason);
      if (!moved.ok) return moved;
      lines.push({ requestId: name, outcome: 'quarantined', reason: MALFORMED_REQUEST_REASON, runId: null });
      continue;
    }
    const request = parsed.value;
    if (identityKey(request.target.identity) !== identityKey(identity)) {
      const moved = quarantineRequest(folders, name, request.id, TARGET_MISMATCH_REASON, request.target.identity);
      if (!moved.ok) return moved;
      lines.push({ requestId: request.id, outcome: 'quarantined', reason: TARGET_MISMATCH_REASON, runId: null });
      continue;
    }

    let outcome: RunOutcome | null;
    try {
      outcome = await run({
        checkoutRoot: input.checkoutRoot,
        skilledTree: input.skilledTree,
        botId: request.workflowId,
        env,
        ...(input.resolveEnv !== undefined ? { resolveEnv: input.resolveEnv } : {}),
        // The runner writes the request join in the run's one record, so the drain never rewrites it.
        request: request.kind === 'resume'
          ? { kind: 'resume', requestId: request.id, itemId: request.idempotencyKey }
          : { kind: 'queued', requestId: request.id, source: request.source, firedSlot: request.firedSlot, prompt: request.prompt },
        ...input.runOptions,
      });
    } catch {
      // The runner closes its own throws with a record; one that escapes it is still a failure, not a crash of the pass.
      outcome = null;
    }
    const runId = outcome?.runId ?? null;

    let route: Route = outcome === null ? { kind: 'retry' } : routeOutcome(outcome);
    if (route.kind === 'retry' && atRetryBound(request)) {
      // The detail names the last attempt's own cause: a bot that was only busy must not read as a failure.
      route = { kind: 'quarantine', reason: RETRY_BOUND_REASON, detail: `${lastCause(outcome)} on attempt ${request.attempts + 1}` };
    }
    switch (route.kind) {
      case 'stop': {
        const released = releaseClaim(folders, name);
        if (!released.ok) return released;
        return { ok: false, reason: 'drain-stopped', detail: route.detail };
      }
      case 'done': {
        const moved = finishRequest(folders, name);
        if (!moved.ok) return moved;
        lines.push({ requestId: request.id, outcome: 'ran', reason: null, runId });
        break;
      }
      case 'retry': {
        const moved = retryRequest(folders, name, request);
        if (!moved.ok) return moved;
        lines.push({ requestId: request.id, outcome: 'retry', reason: null, runId });
        break;
      }
      case 'quarantine': {
        const moved = quarantineRequest(folders, name, request.id, route.reason, route.detail);
        if (!moved.ok) return moved;
        lines.push({ requestId: request.id, outcome: 'quarantined', reason: route.reason, runId });
        break;
      }
    }
  }
  return { ok: true, value: { lines, claimedAtStart, remaining: listInbox(folders).length } };
}
