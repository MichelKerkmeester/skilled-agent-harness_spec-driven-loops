// ───────────────────────────────────────────────────────────────────
// MODULE: Run Result Ledger
// ───────────────────────────────────────────────────────────────────
//
// Each bot run ends on exactly one result event, written through the
// deep-loop mode append gateway rather than appended by hand. The gateway
// validates the event against a registry, authorizes it under a policy,
// admits it by a durable authority record and stores it under its
// idempotency key, so a result event sent twice is stored once. That makes
// the retry for a failed write a replay of the same event, never a second
// dispatch of the run. This module is the bots skill's own registration with
// the gateway: the event type, the allow policy, the authority root under
// the user-level state root and the binding to the checkout's commit.

import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';

import {
  AppendOnlyLedger,
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../../system-deep-loop/runtime/lib/authorized-ledger/index.js';
import { admitCanonicalWrite } from '../../../system-deep-loop/runtime/lib/deep-research-authority/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  prepareEventWrite,
} from '../../../system-deep-loop/runtime/lib/event-envelope/index.js';
import {
  appendModeEvent,
  createDefaultEnvironment,
  resolveCutoverBinding,
} from '../../../system-deep-loop/runtime/lib/mode-append-gateway/index.js';
import { STATE_DIR_MODE } from './state-root.js';

import type { EventWritePreflight, JsonObject } from '../../../system-deep-loop/runtime/lib/event-envelope/index.js';
import type {
  AppendModeEventOutcome,
  ResolvedCutoverBinding,
} from '../../../system-deep-loop/runtime/lib/mode-append-gateway/index.js';
import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The gateway mode the bots skill appends under; a caller mode, outside the deep-loop cutover order. */
export const RESULT_MODE = 'system-skilled-bots';

/** The one event type a bot run writes. */
export const RESULT_EVENT_TYPE = 'skilled-bots.run.result-recorded';

/** How many times one result event is sent before the run gives up on recording it. */
export const RESULT_SEND_ATTEMPTS = 3;

const LEDGER_ID = `${RESULT_MODE}-ledger`;
const AUDIT_LEDGER_ID = `${RESULT_MODE}-audit-ledger`;
const POLICY_ID = `${RESULT_MODE}-result-policy`;
const POLICY_VERSION = 1;
const RULE_ID = 'bot-run-result-append';
const PRODUCER = { name: RESULT_MODE, version: '1' } as const;

/** What a result event says about a run. Nothing in it changes between two sends of the same event. */
export interface RunResultPayload {
  runId: string;
  botId: string;
  reason: string;
  class: string | null;
  needsYouItemId: string | null;
}

/** One run's handle on the gateway, bound before the child is dispatched. */
export interface ResultLedger {
  /** Build the run's result event once; a retry re-sends this same object. */
  prepare(payload: RunResultPayload): EventWritePreflight;
  /** Send one prepared event through the gateway, once. */
  send(event: EventWritePreflight): Promise<AppendModeEventOutcome>;
  /** How many events the ledger holds. */
  storedEventCount(): Promise<number>;
}

export interface OpenResultLedgerInput {
  /** The run's ledger folder, inside its run folder. */
  ledgerDir: string;
  /** The durable, mode-global authority root under the user-level state root. */
  authorityRoot: string;
  /** The checkout the run works in; its HEAD commit binds the event. */
  checkoutRoot: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRATION
// ───────────────────────────────────────────────────────────────────

function isNullableString(value: unknown): boolean {
  return value === null || typeof value === 'string';
}

function validateResultPayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.runId === 'string' && payload.runId !== ''
    && typeof payload.botId === 'string' && payload.botId !== ''
    && typeof payload.reason === 'string' && payload.reason !== ''
    && isNullableString(payload.class)
    && isNullableString(payload.needsYouItemId);
}

/** The event registry of the bots result ledger: one type, one version. */
export function createResultEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([{
    eventType: RESULT_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['runId', 'botId', 'reason', 'class', 'needsYouItemId'],
        validate: validateResultPayload,
      },
    }],
    upcasters: [],
  }]);
}

/** The idempotency key of a run's result event: one result per run. */
export function resultEventKey(runId: string): string {
  return `${runId}:result`;
}

/**
 * Bind one run's result ledger: admit the bots mode at its authority root,
 * bind the checkout's HEAD commit and build the ledger, policy and
 * authorization gateway the append gateway takes. Runs before dispatch, so a
 * run whose result could never be recorded never starts.
 *
 * @returns The ledger handle, or `checkout-has-no-commit`, `result-binding-failed`
 *   or `result-authority-denied`.
 */
export function openResultLedger(input: OpenResultLedgerInput): Result<ResultLedger> {
  mkdirSync(input.ledgerDir, { recursive: true, mode: STATE_DIR_MODE });
  mkdirSync(input.authorityRoot, { recursive: true, mode: STATE_DIR_MODE });

  let admission: ReturnType<typeof admitCanonicalWrite>;
  try {
    admission = admitCanonicalWrite(RESULT_MODE, { authorityRoot: input.authorityRoot });
  } catch (error: unknown) {
    return { ok: false, reason: 'result-authority-denied', detail: error instanceof Error ? error.message : String(error) };
  }
  if (admission.outcome === 'denied') return { ok: false, reason: 'result-authority-denied', detail: admission.reasonCode };
  if (!admission.admissionOpen) return { ok: false, reason: 'result-authority-denied', detail: 'admission closed' };
  const authority = { state: admission.state, epoch: admission.epoch };

  // A bot result has no comparison baseline, so the binding pins the commit
  // the run worked on as both candidate and base.
  const environment = createDefaultEnvironment(input.checkoutRoot);
  const head = environment.gitHeadSha();
  if (head === null) return { ok: false, reason: 'checkout-has-no-commit', detail: input.checkoutRoot };
  let binding: ResolvedCutoverBinding;
  try {
    binding = resolveCutoverBinding({ mode: RESULT_MODE, repositoryRoot: input.checkoutRoot, baseSha: head, environment });
  } catch (error: unknown) {
    return { ok: false, reason: 'result-binding-failed', detail: error instanceof Error ? error.message : String(error) };
  }

  const registry = createResultEventRegistry();
  const policyRegistry = new TransitionPolicyRegistry([{
    policyId: POLICY_ID,
    policyVersion: POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: [RULE_ID],
    capturedAuthorizationState: { state: authority.state, epoch: authority.epoch },
    evaluate: () => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: AuthorizationReasonCodes.ALLOWED,
      matchedRuleIds: [RULE_ID],
    }),
  }]);
  const policy = policyRegistry.resolve(POLICY_ID, POLICY_VERSION);
  const ledger = new AppendOnlyLedger({
    rootDirectory: input.ledgerDir,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider: () => authority,
  }, registry);
  const authorizationGateway = new TransitionAuthorizationGateway({
    rootDirectory: input.ledgerDir,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider: () => authority,
    identityResolver: (context) => ({
      actorId: context.evaluationInput.actorId,
      capabilityId: context.evaluationInput.capabilityId,
      evidenceDigest: context.evaluationInput.evidenceDigest,
    }),
  }, ledger, policyRegistry);

  return {
    ok: true,
    value: {
      prepare(payload) {
        const now = new Date().toISOString();
        return prepareEventWrite({
          envelope_version: CURRENT_ENVELOPE_VERSION,
          event_id: `event-${randomUUID()}`,
          event_type: RESULT_EVENT_TYPE,
          event_version: 1,
          stream_id: LEDGER_ID,
          // Each run has its own ledger, so its one result event opens the stream.
          stream_sequence: 1,
          occurred_at: now,
          recorded_at: now,
          producer: PRODUCER,
          authority_epoch: authority.epoch,
          correlation_id: payload.runId,
          causation_id: null,
          idempotency_key: resultEventKey(payload.runId),
          payload: { ...payload },
        }, registry);
      },
      send(event) {
        return appendModeEvent({
          mode: RESULT_MODE,
          runDirectory: input.ledgerDir,
          eventRecord: event,
          authorityRoot: input.authorityRoot,
          policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, policyDigest: policy.digest },
          policyRegistry,
          authorizationGateway,
          ledger,
          eventRegistry: registry,
          binding,
        });
      },
      async storedEventCount() {
        return (await ledger.readVerifiedEvents()).length;
      },
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. REPLAYING SEND
// ───────────────────────────────────────────────────────────────────

/** How a result event send ended: stored (first time or by replay), or not recorded. */
export type ResultSend =
  | { ok: true; eventId: string; replayed: boolean; attempts: number }
  | { ok: false; reason: string; attempts: number };

/**
 * Send one prepared result event, re-sending the same event on a failed
 * write. The gateway stores a re-sent event once, so a retry can never leave
 * a second copy. A refusal that a re-send cannot change (an idempotency
 * conflict, a denied authority) stops at once.
 */
export async function sendResultEvent(ledger: Pick<ResultLedger, 'send'>, event: EventWritePreflight, attempts = RESULT_SEND_ATTEMPTS): Promise<ResultSend> {
  let last = 'not sent';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let outcome: AppendModeEventOutcome;
    try {
      outcome = await ledger.send(event);
    } catch (error: unknown) {
      last = error instanceof Error ? error.message : String(error);
      continue;
    }
    if (outcome.ok) return { ok: true, eventId: outcome.receipt.eventId, replayed: outcome.idempotentReplay === true, attempts: attempt };
    last = `${outcome.phase}: ${outcome.code}`;
    if (outcome.code === 'IDEMPOTENCY_CONFLICT' || outcome.phase === 'authority' || outcome.phase === 'binding') {
      return { ok: false, reason: last, attempts: attempt };
    }
  }
  return { ok: false, reason: last, attempts };
}
