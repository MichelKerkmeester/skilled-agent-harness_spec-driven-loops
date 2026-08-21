// ───────────────────────────────────────────────────────────────────
// MODULE: Restart Facts Reader
// ───────────────────────────────────────────────────────────────────
//
// Observes real on-disk restart state and assembles the RestartFacts the
// classification derivation consumes. Today only a test fixture supplies
// RestartFacts; this is the production counterpart that reads ledgers and
// leases instead of inventing them.
//
// The central rule this module enforces is refusal over guesswork. Two of
// the five facts — pendingEffects and receipts — come from an effect
// ledger. No production code constructs one; only the append-mode event
// script builds ledgers, and it builds the mode and audit ledgers only.
// Reading an absent effect ledger as "empty" would make pendingEffects
// and receipts both [], and the derivation's `every()` over an empty list
// is true — yielding receiptCoverage, idempotencyCoverage, and a verified
// certificate for a run whose effects were never recorded at all. "No
// effects occurred" and "effects were never recorded" must not look the
// same, so the reader refuses before it reads rather than reporting a
// vacuous clean bill of health.
//
// Directory existence is a necessary but not sufficient signal: a directory
// can be created by anything, whereas recorded events can only come from a
// producer. An empty ledger (directory exists but contains no effect events)
// cannot support a verified claim that effects were recorded and confirmed,
// so the reader refuses with EFFECT_LEDGER_EMPTY when the ledger yields zero
// effect-intent and zero effect-confirmation events.
//
// A receipt is evidence that an effect COMPLETED. A confirmation whose
// effect id never appeared in an intent event means the ledger's own
// history is incomplete: it attests to the completion of an effect that
// was never recorded as intended. An incomplete history must not read as
// a clean one. Without this refusal, the unmatched receipt would leave
// pendingEffects empty, and the derivation's every() over an empty list
// would report receipt coverage and a verified certificate for a run
// whose effects were never recorded as intended — a vacuous clean bill
// of health built on a gap in the ledger. The reader therefore refuses
// with RECEIPT_WITHOUT_INTENT when any confirmation has no matching intent.
//
// The ledger ports are lazy factories rather than instances because
// constructing a ledger creates its directory. The refusal guard checks
// whether the directory exists; if the port were constructed before the
// check, the construction would create the directory and the check would
// always pass, defeating the guard. By requiring factories and performing
// both existence checks before calling them, the guard observes the
// pre-construction state and refuses when the producer is absent.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
} from '../receipts-and-effect-recovery/index.js';
import type { RestartFacts } from '../inflight-state-classification/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const RestartObservationErrorCodes = Object.freeze({
  EFFECT_LEDGER_ABSENT: 'EFFECT_LEDGER_ABSENT',
  MODE_LEDGER_ABSENT: 'MODE_LEDGER_ABSENT',
  EFFECT_LEDGER_EMPTY: 'EFFECT_LEDGER_EMPTY',
  RECEIPT_WITHOUT_INTENT: 'RECEIPT_WITHOUT_INTENT',
} as const);

export type RestartObservationErrorCode =
  typeof RestartObservationErrorCodes[keyof typeof RestartObservationErrorCodes];

/** Fail-closed observation error naming the missing instrumentation, not the run. */
export class RestartObservationError extends Error {
  public readonly reasonCode: RestartObservationErrorCode;
  public readonly detail: string;

  public constructor(reasonCode: RestartObservationErrorCode, detail: string) {
    super(`${reasonCode}: ${detail}`);
    this.name = 'RestartObservationError';
    this.reasonCode = reasonCode;
    this.detail = detail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. PORTS
// ───────────────────────────────────────────────────────────────────

/**
 * Structural read view of an append-only ledger. Declared structurally so
 * the shipped AppendOnlyLedger satisfies it without this module importing
 * the ledger package and forming a cycle through its construction path.
 */
export interface LedgerReadPort {
  getVerifiedHead(): Promise<{ readonly sequence: number }>;
  readVerifiedEvents(): Promise<readonly unknown[]>;
}

/**
 * Structural lease observation port. peekCurrentLease already returns null
 * for an expired lease, so the reader does not re-check expiry and never
 * acquires — observing must not change what is observed.
 */
export interface LeasePeekPort {
  peekCurrentLease(resource: unknown): {
    readonly fenceToken: number;
    readonly expiresAt: string;
  } | null;
}

export interface ObserveRestartFactsOptions {
  readonly runDirectory: string;
  readonly modeLedgerId: string;
  readonly effectLedgerId: string;
  readonly modeLedger: () => LedgerReadPort;
  readonly effectLedger: () => LedgerReadPort;
  readonly leases: readonly {
    readonly resource: unknown;
    readonly peek: LeasePeekPort;
  }[];
  readonly continuityId: string | null;
  readonly now?: () => Date;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT NARROWING
// ───────────────────────────────────────────────────────────────────

interface EffectEventFact {
  readonly eventType: string;
  readonly effectId: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Pull the event type and effect id out of a verified ledger event without
 * importing the ledger's concrete types. The verified-event shape is
 * { event: { effective: { envelope: { event_type, payload } } } }; the
 * effect identifier lives at payload.effect_id for both intent and
 * confirmation events. Anything that does not match that shape is ignored
 * rather than thrown — a non-effect event on the same ledger is not an
 * observation error, just not relevant to restart facts.
 */
function extractEffectEventFact(verified: unknown): EffectEventFact | null {
  if (!isRecord(verified)) return null;
  const event = verified.event;
  if (!isRecord(event)) return null;
  const effective = event.effective;
  if (!isRecord(effective)) return null;
  const envelope = effective.envelope;
  if (!isRecord(envelope)) return null;
  const eventType = envelope.event_type;
  if (typeof eventType !== 'string') return null;
  const payload = envelope.payload;
  if (!isRecord(payload)) return null;
  const effectId = payload.effect_id;
  if (typeof effectId !== 'string') return null;
  return { eventType, effectId };
}

// ───────────────────────────────────────────────────────────────────
// 4. OBSERVATION
// ───────────────────────────────────────────────────────────────────

/**
 * Assemble RestartFacts from real on-disk state. Refuses before reading
 * when a required ledger directory is absent; see the module header for
 * why an absent producer must never be read as an empty one.
 */
export async function observeRestartFacts(
  options: ObserveRestartFactsOptions,
): Promise<RestartFacts> {
  const effectLedgerPath = join(options.runDirectory, options.effectLedgerId);
  if (!existsSync(effectLedgerPath)) {
    throw new RestartObservationError(
      RestartObservationErrorCodes.EFFECT_LEDGER_ABSENT,
      `effect ledger directory not found at ${effectLedgerPath}`,
    );
  }

  const modeLedgerPath = join(options.runDirectory, options.modeLedgerId);
  if (!existsSync(modeLedgerPath)) {
    throw new RestartObservationError(
      RestartObservationErrorCodes.MODE_LEDGER_ABSENT,
      `mode ledger directory not found at ${modeLedgerPath}`,
    );
  }

  const modeLedger = options.modeLedger();
  const effectLedger = options.effectLedger();

  const head = await modeLedger.getVerifiedHead();
  const stopSequence = head.sequence;

  const verifiedEvents = await effectLedger.readVerifiedEvents();

  // Collect effect ids from intent events and receipt ids from
  // confirmation events in encounter order. pendingEffects is the set of
  // intent ids with no matching confirmation; receipts is the confirmation
  // list shaped as { effectId } for the derivation.
  const intentEffectIds: string[] = [];
  const receipts: { readonly effectId: string }[] = [];
  for (const verified of verifiedEvents) {
    const fact = extractEffectEventFact(verified);
    if (fact === null) continue;
    if (fact.eventType === EFFECT_INTENT_EVENT_TYPE) {
      intentEffectIds.push(fact.effectId);
    } else if (fact.eventType === EFFECT_CONFIRMATION_EVENT_TYPE) {
      receipts.push({ effectId: fact.effectId });
    }
  }

  // An empty ledger cannot support a verified claim that effects were
  // recorded and confirmed. Refuse when the ledger yields zero effect-intent
  // and zero effect-confirmation events.
  if (intentEffectIds.length === 0 && receipts.length === 0) {
    throw new RestartObservationError(
      RestartObservationErrorCodes.EFFECT_LEDGER_EMPTY,
      `effect ledger at ${effectLedgerPath} contains no effect events`,
    );
  }

  // A confirmation whose effect id never appeared in an intent event means
  // the ledger's history is incomplete: it attests to the completion of an
  // effect that was never recorded as intended. Refuse before constructing
  // pendingEffects, otherwise the unmatched receipt would leave that list
  // empty and the derivation's every() over an empty list would report
  // coverage and a verified certificate for a run whose effects were never
  // recorded as intended. See the module header for the full rationale.
  const intentEffectIdSet = new Set(intentEffectIds);
  const receiptsWithoutIntent = receipts
    .filter((receipt) => !intentEffectIdSet.has(receipt.effectId))
    .map((receipt) => receipt.effectId);
  if (receiptsWithoutIntent.length > 0) {
    throw new RestartObservationError(
      RestartObservationErrorCodes.RECEIPT_WITHOUT_INTENT,
      `effect ledger at ${effectLedgerPath} contains confirmation(s) for effect id(s) with no intent event: ${receiptsWithoutIntent.join(', ')}`,
    );
  }

  const confirmedEffectIds = new Set(receipts.map((receipt) => receipt.effectId));
  const pendingEffects = intentEffectIds.filter(
    (effectId) => !confirmedEffectIds.has(effectId),
  );

  // A null peek means no lease is held; peekCurrentLease already returns
  // null for an expired lease, so expiry is not re-checked here. The
  // reader never acquires — observing must not change what is observed.
  const leases = options.leases.flatMap((entry) => {
    const lease = entry.peek.peekCurrentLease(entry.resource);
    if (lease === null) return [];
    return [{ state: 'active' as const, fencingToken: lease.fenceToken }];
  });

  return {
    stopSequence,
    pendingEffects,
    receipts,
    leases,
    continuityId: options.continuityId,
  };
}
