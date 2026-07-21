// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Authority
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
  GENESIS_RECORD_HASH,
} from '../authorized-ledger/index.js';
import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  BudgetEventTypes,
  prepareBudgetLifecycleEvent,
} from './budget-events.js';
import {
  allocatableBudgetVector,
  availableBudgetVector,
  budgetScopePath,
  isReservationFullyDisposed,
  materializeBudgetLifecyclePayload,
  rebuildBudgetProjection,
  remainingReservationVector,
} from './budget-reducer.js';
import {
  budgetVector,
  budgetVectorFits,
  createBudgetEnvelope,
  isZeroBudgetVector,
  subtractBudgetVectors,
  zeroBudgetVector,
} from './budget-types.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  LedgerHead,
  PolicyReference,
  RebuiltProjection,
  TransitionAuthorizationGateway,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type { BudgetEventType } from './budget-events.js';
import type {
  BudgetProjection,
  BudgetReservationProjection,
  BudgetScopeProjection,
} from './budget-reducer.js';
import type {
  BudgetEnvelope,
  BudgetEnvelopeInput,
  BudgetVector,
} from './budget-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const BudgetReasonCodes = Object.freeze({
  ALLOWED: 'allowed',
  BUDGET_EXHAUSTED: 'budget_exhausted',
  DEADLINE_EXHAUSTED: 'deadline_exhausted',
  MISSING_SCOPE: 'missing_scope',
  INVALID_SCOPE: 'invalid_scope',
  INVALID_UNIT: 'invalid_unit',
  INVALID_PARENT: 'invalid_parent',
  STALE_PRICING: 'stale_pricing',
  REPLAY_MISMATCH: 'replay_mismatch',
  SCOPE_BLOCKED: 'scope_blocked',
  RESERVATION_CONFLICT: 'reservation_conflict',
  RESERVATION_EXPIRED: 'reservation_expired',
  RECEIPT_REQUIRED: 'receipt_required',
  RECEIPT_MISMATCH: 'receipt_mismatch',
  UNKNOWN_USAGE: 'unknown_usage',
  ACTUAL_EXCEEDS_RESERVATION: 'actual_exceeds_reservation',
  REQUEST_CONFLICT: 'request_conflict',
  AUTHORIZATION_DENIED: 'authorization_denied',
  LEDGER_WRITE_FAILED: 'ledger_write_failed',
  REDUCER_DIVERGENCE: 'reducer_divergence',
  NOT_YET_EXPIRED: 'not_yet_expired',
  NO_DISPATCH_EVIDENCE_REQUIRED: 'no_dispatch_evidence_required',
} as const);

export type BudgetReasonCode = typeof BudgetReasonCodes[keyof typeof BudgetReasonCodes];

export type BudgetDecisionStatus =
  | 'created'
  | 'allocated'
  | 'granted'
  | 'denied'
  | 'renewed'
  | 'committed'
  | 'released'
  | 'settled'
  | 'cancelled'
  | 'expired'
  | 'reconciled'
  | 'anomaly';

/** Stable logical result retained in the event payload for idempotent replay. */
export interface BudgetDecision extends JsonObject {
  readonly operation: string;
  readonly requestId: string;
  readonly scopeId: string;
  readonly status: BudgetDecisionStatus;
  readonly reasonCode: BudgetReasonCode;
  readonly dispatchAllowed: boolean;
  readonly reservationId: string | null;
  readonly dispatchId: string | null;
  readonly incomplete: boolean;
  readonly converged: false;
  readonly authority: 'shadow';
}

export interface BudgetMutationResult {
  readonly decision: BudgetDecision;
  readonly receipt: DurableAppendReceipt | null;
  readonly isIdempotent: boolean;
}

export interface BudgetEvidenceInput {
  readonly requestId: string;
  readonly operationId?: string;
  readonly mode: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly evidenceDigest: string;
  readonly replayFingerprint: string;
  readonly correlationId: string;
  readonly causationId: string | null;
}

export interface BudgetAuthorityOptions {
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly eventRegistry: EventTypeRegistry;
  readonly policy: PolicyReference;
  readonly producer?: EventProducer;
  readonly streamId?: string;
  readonly now?: () => Date;
  readonly monotonicNow?: () => number;
}

export interface AllocateBudgetInput extends BudgetEvidenceInput {
  readonly envelope: BudgetEnvelopeInput;
}

export interface ReserveBudgetInput extends BudgetEvidenceInput {
  readonly scopeId: string;
  readonly reservationId: string;
  readonly dispatchId: string;
  readonly estimate: BudgetVector;
  readonly leaseDurationMs: number;
}

export interface ReservationOperationInput extends BudgetEvidenceInput {
  readonly reservationId: string;
}

export interface ReleaseBudgetInput extends ReservationOperationInput {
  readonly release: BudgetVector;
  readonly unusedEvidenceDigest: string;
}

export interface CancelBudgetInput extends ReservationOperationInput {
  readonly noDispatchEvidenceDigest: string | null;
}

/** Normalized terminal usage evidence supplied by an executor/effect receipt. */
export interface NormalizedBudgetReceipt {
  readonly receiptId: string;
  readonly dispatchId: string;
  readonly replayFingerprint: string;
  readonly pricingDigest: string;
  readonly terminalStatus: 'succeeded' | 'failed' | 'cancelled' | 'timed-out';
  readonly usage: BudgetVector;
}

export interface SettleBudgetInput extends ReservationOperationInput {
  readonly receipt: NormalizedBudgetReceipt | null;
}

export interface BudgetScopeReadModel {
  readonly scope: Readonly<BudgetScopeProjection>;
  readonly remaining: BudgetVector;
  readonly openReservations: number;
  readonly unreconciledReservations: number;
  readonly oldestReservationAgeMs: number | null;
}

interface ProjectionContext {
  readonly projection: RebuiltProjection<BudgetProjection>;
  readonly state: Readonly<BudgetProjection>;
  readonly head: LedgerHead;
}

class BudgetMutationFailure extends Error {
  public readonly reasonCode: BudgetReasonCode;

  public constructor(reasonCode: BudgetReasonCode, message: string) {
    super(message);
    this.name = 'BudgetMutationFailure';
    this.reasonCode = reasonCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_PRODUCER: EventProducer = Object.freeze({
  name: 'hierarchical-budget-authority',
  version: '1',
});
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function requireDigest(value: string, field: string): string {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new BudgetMutationFailure(
      BudgetReasonCodes.INVALID_UNIT,
      `${field} must be a lowercase SHA-256 digest`,
    );
  }
  return value;
}

function requireIdentity(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BudgetMutationFailure(
      BudgetReasonCodes.INVALID_UNIT,
      `${field} must be a non-empty string`,
    );
  }
  return value;
}

function requirePositiveInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new BudgetMutationFailure(
      BudgetReasonCodes.INVALID_UNIT,
      `${field} must be a positive safe integer`,
    );
  }
  return value;
}

function projectionScopes(
  state: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetScopeProjection>> {
  return state.scopes as unknown as Readonly<Record<string, BudgetScopeProjection>>;
}

function projectionReservations(
  state: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetReservationProjection>> {
  return state.reservations as unknown as Readonly<Record<string, BudgetReservationProjection>>;
}

function projectionOutcomes(
  state: Readonly<BudgetProjection>,
): Readonly<Record<string, BudgetDecision>> {
  return state.outcomes as unknown as Readonly<Record<string, BudgetDecision>>;
}

function envelopeFromScope(scope: Readonly<BudgetScopeProjection>): BudgetEnvelope {
  return scope.envelope as unknown as BudgetEnvelope;
}

function decision(
  operation: string,
  evidence: BudgetEvidenceInput,
  scopeId: string,
  status: BudgetDecisionStatus,
  reasonCode: BudgetReasonCode,
  reservationId: string | null = null,
  dispatchId: string | null = null,
): BudgetDecision {
  return Object.freeze({
    operation,
    requestId: evidence.requestId,
    scopeId,
    status,
    reasonCode,
    dispatchAllowed: status === 'granted',
    reservationId,
    dispatchId,
    incomplete: status === 'denied' || status === 'anomaly',
    converged: false,
    authority: 'shadow',
  });
}

function fallbackDenial(
  operation: string,
  evidence: BudgetEvidenceInput,
  scopeId: string,
  reasonCode: BudgetReasonCode,
  reservationId: string | null = null,
): BudgetMutationResult {
  return Object.freeze({
    decision: decision(
      operation,
      evidence,
      scopeId,
      'denied',
      reasonCode,
      reservationId,
    ),
    receipt: null,
    isIdempotent: false,
  });
}

function headFromEvents(
  ledgerId: string,
  events: readonly VerifiedLedgerEvent[],
): LedgerHead {
  const last = events.at(-1);
  return Object.freeze(last
    ? {
      ledgerId,
      sequence: last.frame.sequence,
      recordHash: last.frame.record_hash,
    }
    : {
      ledgerId,
      sequence: 0,
      recordHash: GENESIS_RECORD_HASH,
    });
}

function vectorFromReservationField(
  reservation: Readonly<BudgetReservationProjection>,
  field: 'estimate' | 'committed' | 'released',
): BudgetVector {
  return budgetVector(reservation[field] as unknown as BudgetVector);
}

// ───────────────────────────────────────────────────────────────────
// 4. AUTHORITY
// ───────────────────────────────────────────────────────────────────

/** Ledger-backed dark authority for typed hierarchical budget evidence. */
export class HierarchicalBudgetAuthority {
  readonly #options: Required<Pick<
    BudgetAuthorityOptions,
    'producer' | 'streamId' | 'now' | 'monotonicNow'
  >> & BudgetAuthorityOptions;
  #mutationTail: Promise<void> = Promise.resolve();

  public constructor(options: BudgetAuthorityOptions) {
    if (options.ledger.registryDigest !== options.eventRegistry.digest) {
      throw new TypeError('Budget ledger and event registry digests must match exactly');
    }
    this.#options = {
      ...options,
      producer: options.producer ?? DEFAULT_PRODUCER,
      streamId: options.streamId ?? `budget-stream:${options.ledger.ledgerId}`,
      now: options.now ?? (() => new Date()),
      monotonicNow: options.monotonicNow ?? (() => Math.floor(performance.now())),
    };
  }

  /** Rebuild the complete disposable projection from verified ledger events. */
  public async readProjection(): Promise<RebuiltProjection<BudgetProjection>> {
    return (await this.#readContext()).projection;
  }

  /** Return read-only capacity and settlement-lag fields for gauge consumers. */
  public async readScope(scopeId: string): Promise<BudgetScopeReadModel> {
    const { state } = await this.#readContext();
    const scope = projectionScopes(state)[scopeId];
    if (!scope) throw new TypeError('Budget scope does not exist');
    const open = Object.values(projectionReservations(state)).filter((reservation) => (
      reservation.scopePath.includes(scopeId)
      && (reservation.status === 'reserved' || reservation.status === 'partially-released')
    ));
    const unreconciled = Object.values(projectionReservations(state)).filter((reservation) => (
      reservation.scopePath.includes(scopeId) && reservation.status === 'unreconciled'
    ));
    const now = this.#options.monotonicNow();
    return Object.freeze({
      scope: Object.freeze(scope),
      remaining: availableBudgetVector(scope),
      openReservations: open.length,
      unreconciledReservations: unreconciled.length,
      oldestReservationAgeMs: open.length === 0
        ? null
        : Math.max(...open.map((reservation) => now - reservation.createdAtMonotonicMs)),
    });
  }

  /** Create the only program root after authorization and durable append. */
  public createRoot(input: AllocateBudgetInput): Promise<BudgetMutationResult> {
    return this.#serialize(async () => {
      const operation = 'create-root';
      try {
        this.#validateEvidence(input);
        const context = await this.#readContext();
        const idempotent = this.#idempotentResult(context.state, input, operation);
        if (idempotent) return idempotent;
        const envelope = createBudgetEnvelope(input.envelope);
        const result = decision(
          operation,
          input,
          envelope.scope.scopeId,
          'created',
          BudgetReasonCodes.ALLOWED,
        );
        return await this.#appendTransition(
          context,
          BudgetEventTypes.SCOPE_CREATED,
          input,
          envelope.scope.scopeId,
          [envelope.scope.scopeId],
          BudgetReasonCodes.ALLOWED,
          { envelope: envelope as unknown as JsonObject },
          result,
        );
      } catch (error: unknown) {
        return fallbackDenial(
          operation,
          input,
          input.envelope.scope.scopeId,
          this.#reasonFromError(error, BudgetReasonCodes.INVALID_SCOPE),
        );
      }
    });
  }

  /** Allocate one child without widening or orphaning its parent. */
  public allocateChild(input: AllocateBudgetInput): Promise<BudgetMutationResult> {
    return this.#serialize(async () => {
      const operation = 'allocate-child';
      const scopeId = input.envelope.scope.scopeId;
      try {
        this.#validateEvidence(input);
        const context = await this.#readContext();
        const idempotent = this.#idempotentResult(context.state, input, operation);
        if (idempotent) return idempotent;
        const parentScopeId = requireIdentity(
          input.envelope.scope.parentScopeId as string,
          'scope.parentScopeId',
        );
        const parentScope = projectionScopes(context.state)[parentScopeId];
        if (!parentScope) {
          return await this.#recordDenial(
            context,
            BudgetEventTypes.RESERVATION_DENIED,
            input,
            operation,
            scopeId,
            [],
            BudgetReasonCodes.MISSING_SCOPE,
          );
        }
        const envelope = createBudgetEnvelope(input.envelope, envelopeFromScope(parentScope));
        const parentPath = budgetScopePath(context.state, parentScopeId);
        if (!budgetVectorFits(envelope.limits, allocatableBudgetVector(parentScope))) {
          return await this.#recordDenial(
            context,
            BudgetEventTypes.EXHAUSTION_RECORDED,
            input,
            operation,
            scopeId,
            parentPath,
            BudgetReasonCodes.BUDGET_EXHAUSTED,
          );
        }
        const scopePath = [...parentPath, scopeId];
        const result = decision(
          operation,
          input,
          scopeId,
          'allocated',
          BudgetReasonCodes.ALLOWED,
        );
        return await this.#appendTransition(
          context,
          BudgetEventTypes.CHILD_ALLOCATED,
          input,
          scopeId,
          scopePath,
          BudgetReasonCodes.ALLOWED,
          { envelope: envelope as unknown as JsonObject },
          result,
        );
      } catch (error: unknown) {
        return fallbackDenial(
          operation,
          input,
          scopeId,
          this.#reasonFromError(error, BudgetReasonCodes.INVALID_PARENT),
        );
      }
    });
  }

  /** Reserve all dimensions across every ancestor or record one complete denial. */
  public admit(input: ReserveBudgetInput): Promise<BudgetMutationResult> {
    return this.#serialize(async () => {
      const operation = 'admit';
      try {
        this.#validateEvidence(input);
        requireIdentity(input.reservationId, 'reservationId');
        requireIdentity(input.dispatchId, 'dispatchId');
        const leaseDurationMs = requirePositiveInteger(input.leaseDurationMs, 'leaseDurationMs');
        const estimate = budgetVector(input.estimate);
        const context = await this.#readContext();
        const idempotent = this.#idempotentResult(context.state, input, operation);
        if (idempotent) return idempotent;
        const scope = projectionScopes(context.state)[input.scopeId];
        if (!scope) {
          return fallbackDenial(operation, input, input.scopeId, BudgetReasonCodes.MISSING_SCOPE);
        }
        const scopePath = budgetScopePath(context.state, input.scopeId);
        const denial = this.#admissionDenial(
          context.state,
          scopePath,
          estimate,
          input.replayFingerprint,
        );
        if (denial) {
          return await this.#recordDenial(
            context,
            denial === BudgetReasonCodes.BUDGET_EXHAUSTED
              || denial === BudgetReasonCodes.DEADLINE_EXHAUSTED
              ? BudgetEventTypes.EXHAUSTION_RECORDED
              : BudgetEventTypes.RESERVATION_DENIED,
            input,
            operation,
            input.scopeId,
            scopePath,
            denial,
            input.reservationId,
            input.dispatchId,
          );
        }
        const monotonicNow = this.#options.monotonicNow();
        const leaseExpiresAtMonotonicMs = monotonicNow + leaseDurationMs;
        if (
          !Number.isSafeInteger(leaseExpiresAtMonotonicMs)
          || leaseExpiresAtMonotonicMs > envelopeFromScope(scope).limits.wallTime.deadlineMonotonicMs
        ) {
          return await this.#recordDenial(
            context,
            BudgetEventTypes.EXHAUSTION_RECORDED,
            input,
            operation,
            input.scopeId,
            scopePath,
            BudgetReasonCodes.DEADLINE_EXHAUSTED,
            input.reservationId,
            input.dispatchId,
          );
        }
        const result = decision(
          operation,
          input,
          input.scopeId,
          'granted',
          BudgetReasonCodes.ALLOWED,
          input.reservationId,
          input.dispatchId,
        );
        return await this.#appendTransition(
          context,
          BudgetEventTypes.RESERVATION_GRANTED,
          input,
          input.scopeId,
          scopePath,
          BudgetReasonCodes.ALLOWED,
          {
            reservation: {
              reservationId: input.reservationId,
              dispatchId: input.dispatchId,
              estimate: estimate as unknown as JsonObject,
              createdAtMonotonicMs: monotonicNow,
              leaseExpiresAtMonotonicMs,
            },
          },
          result,
        );
      } catch (error: unknown) {
        return fallbackDenial(
          operation,
          input,
          input.scopeId,
          this.#reasonFromError(error, BudgetReasonCodes.INVALID_UNIT),
          input.reservationId,
        );
      }
    });
  }

  /** Extend an open lease without outliving the target scope deadline. */
  public renew(
    input: ReservationOperationInput & { readonly leaseDurationMs: number },
  ): Promise<BudgetMutationResult> {
    return this.#reservationMutation('renew', input, async (context, reservation) => {
      const duration = requirePositiveInteger(input.leaseDurationMs, 'leaseDurationMs');
      const leaseExpiresAtMonotonicMs = this.#options.monotonicNow() + duration;
      const scope = projectionScopes(context.state)[reservation.scopeId];
      if (leaseExpiresAtMonotonicMs > envelopeFromScope(scope).limits.wallTime.deadlineMonotonicMs) {
          return await this.#recordDenial(
          context,
          BudgetEventTypes.RESERVATION_DENIED,
          input,
          'renew',
          reservation.scopeId,
          reservation.scopePath,
          BudgetReasonCodes.DEADLINE_EXHAUSTED,
          reservation.reservationId,
          reservation.dispatchId,
        );
      }
      const result = decision(
        'renew',
        input,
        reservation.scopeId,
        'renewed',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
        return await this.#appendTransition(
        context,
        BudgetEventTypes.RESERVATION_RENEWED,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        { reservationId: reservation.reservationId, leaseExpiresAtMonotonicMs },
        result,
      );
    });
  }

  /** Charge one attempt before executor work starts, including retries. */
  public startAttempt(input: ReservationOperationInput): Promise<BudgetMutationResult> {
    return this.#reservationMutation('start-attempt', input, async (context, reservation) => {
      if (this.#options.monotonicNow() > reservation.leaseExpiresAtMonotonicMs) {
        return this.#recordDenial(
          context,
          BudgetEventTypes.RESERVATION_DENIED,
          input,
          'start-attempt',
          reservation.scopeId,
          reservation.scopePath,
          BudgetReasonCodes.RESERVATION_EXPIRED,
          reservation.reservationId,
          reservation.dispatchId,
        );
      }
      const remaining = remainingReservationVector(reservation);
      if (remaining.iterations.attempts < 1) {
        return this.#recordDenial(
          context,
          BudgetEventTypes.EXHAUSTION_RECORDED,
          input,
          'start-attempt',
          reservation.scopeId,
          reservation.scopePath,
          BudgetReasonCodes.BUDGET_EXHAUSTED,
          reservation.reservationId,
          reservation.dispatchId,
        );
      }
      const committedDelta = zeroBudgetVector(remaining);
      const attemptDelta = budgetVector({
        ...committedDelta,
        iterations: { ...committedDelta.iterations, attempts: 1 },
      });
      const result = decision(
        'start-attempt',
        input,
        reservation.scopeId,
        'committed',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
      return this.#appendTransition(
        context,
        BudgetEventTypes.SPEND_COMMITTED,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        {
          reservationId: reservation.reservationId,
          committedDelta: attemptDelta as unknown as JsonObject,
          releasedDelta: zeroBudgetVector(remaining) as unknown as JsonObject,
          status: 'reserved',
          receiptId: null,
        },
        result,
      );
    });
  }

  /** Release only capacity backed by an immutable unused-capacity proof. */
  public release(input: ReleaseBudgetInput): Promise<BudgetMutationResult> {
    return this.#reservationMutation('release', input, async (context, reservation) => {
      requireDigest(input.unusedEvidenceDigest, 'unusedEvidenceDigest');
      const release = budgetVector(input.release);
      if (isZeroBudgetVector(release) || !budgetVectorFits(release, remainingReservationVector(reservation))) {
        return this.#recordAnomaly(
          context,
          input,
          'release',
          reservation,
          BudgetReasonCodes.INVALID_UNIT,
          { requestedRelease: release as unknown as JsonObject },
        );
      }
      const result = decision(
        'release',
        input,
        reservation.scopeId,
        'released',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
      return this.#appendTransition(
        context,
        BudgetEventTypes.RESERVATION_RELEASED,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        {
          reservationId: reservation.reservationId,
          release: release as unknown as JsonObject,
          unusedEvidenceDigest: input.unusedEvidenceDigest,
        },
        result,
      );
    });
  }

  /** Cancel an unstarted reservation only when no-dispatch evidence is supplied. */
  public cancel(input: CancelBudgetInput): Promise<BudgetMutationResult> {
    return this.#reservationMutation('cancel', input, async (context, reservation) => {
      const committed = vectorFromReservationField(reservation, 'committed');
      if (!isZeroBudgetVector(committed) || input.noDispatchEvidenceDigest === null) {
        return this.#recordAnomaly(
          context,
          input,
          'cancel',
          reservation,
          !isZeroBudgetVector(committed)
            ? BudgetReasonCodes.RECEIPT_REQUIRED
            : BudgetReasonCodes.NO_DISPATCH_EVIDENCE_REQUIRED,
          {},
        );
      }
      requireDigest(input.noDispatchEvidenceDigest, 'noDispatchEvidenceDigest');
      const release = remainingReservationVector(reservation);
      const result = decision(
        'cancel',
        input,
        reservation.scopeId,
        'cancelled',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
      return this.#appendTransition(
        context,
        BudgetEventTypes.RESERVATION_CANCELLED,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        {
          reservationId: reservation.reservationId,
          release: release as unknown as JsonObject,
          noDispatchEvidenceDigest: input.noDispatchEvidenceDigest,
        },
        result,
      );
    });
  }

  /** Expire unused capacity, or quarantine started work until usage is known. */
  public expire(input: ReservationOperationInput): Promise<BudgetMutationResult> {
    return this.#reservationMutation('expire', input, async (context, reservation) => {
      if (this.#options.monotonicNow() < reservation.leaseExpiresAtMonotonicMs) {
        return this.#recordDenial(
          context,
          BudgetEventTypes.RESERVATION_DENIED,
          input,
          'expire',
          reservation.scopeId,
          reservation.scopePath,
          BudgetReasonCodes.NOT_YET_EXPIRED,
          reservation.reservationId,
          reservation.dispatchId,
        );
      }
      if (!isZeroBudgetVector(vectorFromReservationField(reservation, 'committed'))) {
        return this.#recordAnomaly(
          context,
          input,
          'expire',
          reservation,
          BudgetReasonCodes.UNKNOWN_USAGE,
          {},
        );
      }
      const release = remainingReservationVector(reservation);
      const result = decision(
        'expire',
        input,
        reservation.scopeId,
        'expired',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
      return this.#appendTransition(
        context,
        BudgetEventTypes.RESERVATION_EXPIRED,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        { reservationId: reservation.reservationId, release: release as unknown as JsonObject },
        result,
      );
    });
  }

  /** Commit terminal receipt usage and release only the proven unused remainder. */
  public settle(input: SettleBudgetInput): Promise<BudgetMutationResult> {
    return this.#settle('settle', BudgetEventTypes.SPEND_COMMITTED, input, false);
  }

  /** Reconcile a quarantined reservation from later normalized receipt evidence. */
  public reconcile(input: SettleBudgetInput): Promise<BudgetMutationResult> {
    return this.#settle('reconcile', BudgetEventTypes.RECONCILIATION_RECORDED, input, true);
  }

  #settle(
    operation: 'settle' | 'reconcile',
    eventType: BudgetEventType,
    input: SettleBudgetInput,
    requiresUnreconciled: boolean,
  ): Promise<BudgetMutationResult> {
    return this.#reservationMutation(operation, input, async (context, reservation) => {
      if (requiresUnreconciled && reservation.status !== 'unreconciled') {
        return this.#recordDenial(
          context,
          BudgetEventTypes.RESERVATION_DENIED,
          input,
          operation,
          reservation.scopeId,
          reservation.scopePath,
          BudgetReasonCodes.RESERVATION_CONFLICT,
          reservation.reservationId,
          reservation.dispatchId,
        );
      }
      const receiptReason = this.#validateReceipt(context.state, reservation, input.receipt);
      if (receiptReason) {
        return this.#recordAnomaly(
          context,
          input,
          operation,
          reservation,
          receiptReason,
          input.receipt === null
            ? {}
            : { receipt: input.receipt as unknown as JsonObject },
        );
      }
      const receipt = input.receipt as NormalizedBudgetReceipt;
      const estimate = vectorFromReservationField(reservation, 'estimate');
      const committed = vectorFromReservationField(reservation, 'committed');
      const released = vectorFromReservationField(reservation, 'released');
      let committedDelta: BudgetVector;
      let releasedDelta: BudgetVector;
      try {
        committedDelta = subtractBudgetVectors(receipt.usage, committed);
        releasedDelta = subtractBudgetVectors(
          subtractBudgetVectors(estimate, receipt.usage),
          released,
        );
      } catch {
        return this.#recordAnomaly(
          context,
          input,
          operation,
          reservation,
          BudgetReasonCodes.RECEIPT_MISMATCH,
          { receipt: receipt as unknown as JsonObject },
        );
      }
      const result = decision(
        operation,
        input,
        reservation.scopeId,
        requiresUnreconciled ? 'reconciled' : 'settled',
        BudgetReasonCodes.ALLOWED,
        reservation.reservationId,
        reservation.dispatchId,
      );
      return this.#appendTransition(
        context,
        eventType,
        input,
        reservation.scopeId,
        reservation.scopePath,
        BudgetReasonCodes.ALLOWED,
        {
          reservationId: reservation.reservationId,
          committedDelta: committedDelta as unknown as JsonObject,
          releasedDelta: releasedDelta as unknown as JsonObject,
          status: 'settled',
          receiptId: receipt.receiptId,
          receipt: receipt as unknown as JsonObject,
        },
        result,
      );
    });
  }

  async #readContext(): Promise<ProjectionContext> {
    const events = await this.#options.ledger.readVerifiedEvents();
    const head = headFromEvents(this.#options.ledger.ledgerId, [...events]);
    const projection = rebuildBudgetProjection(events, head);
    return Object.freeze({ projection, state: projection.state, head });
  }

  #validateEvidence(input: BudgetEvidenceInput): void {
    requireIdentity(input.requestId, 'requestId');
    requireIdentity(input.mode, 'mode');
    requireIdentity(input.actorId, 'actorId');
    requireIdentity(input.capabilityId, 'capabilityId');
    requirePositiveInteger(input.authorityEpoch, 'authorityEpoch');
    requireDigest(input.evidenceDigest, 'evidenceDigest');
    requireDigest(input.replayFingerprint, 'replayFingerprint');
    requireIdentity(input.correlationId, 'correlationId');
  }

  #idempotentResult(
    state: Readonly<BudgetProjection>,
    input: BudgetEvidenceInput,
    operation: string,
  ): BudgetMutationResult | null {
    const existing = projectionOutcomes(state)[input.requestId];
    if (!existing) return null;
    if (existing.operation !== operation) {
      return fallbackDenial(
        operation,
        input,
        existing.scopeId,
        BudgetReasonCodes.REQUEST_CONFLICT,
        existing.reservationId,
      );
    }
    return Object.freeze({ decision: existing, receipt: null, isIdempotent: true });
  }

  #admissionDenial(
    state: Readonly<BudgetProjection>,
    scopePath: readonly string[],
    estimate: BudgetVector,
    replayFingerprint: string,
  ): BudgetReasonCode | null {
    const monotonicNow = this.#options.monotonicNow();
    for (const scopeId of scopePath) {
      const scope = projectionScopes(state)[scopeId];
      const envelope = envelopeFromScope(scope);
      if (scope.blockedReason !== null) return BudgetReasonCodes.SCOPE_BLOCKED;
      if (envelope.replayFingerprint !== replayFingerprint) return BudgetReasonCodes.REPLAY_MISMATCH;
      if (
        envelope.limits.cost.currency !== estimate.cost.currency
        || envelope.limits.cost.scale !== estimate.cost.scale
        || envelope.limits.cost.pricingDigest !== estimate.cost.pricingDigest
      ) {
        return BudgetReasonCodes.STALE_PRICING;
      }
      if (
        estimate.wallTime.deadlineMonotonicMs !== envelope.limits.wallTime.deadlineMonotonicMs
      ) {
        return BudgetReasonCodes.INVALID_UNIT;
      }
      if (monotonicNow >= envelope.limits.wallTime.deadlineMonotonicMs) {
        return BudgetReasonCodes.DEADLINE_EXHAUSTED;
      }
      if (!budgetVectorFits(estimate, availableBudgetVector(scope))) {
        return BudgetReasonCodes.BUDGET_EXHAUSTED;
      }
    }
    return null;
  }

  #validateReceipt(
    state: Readonly<BudgetProjection>,
    reservation: Readonly<BudgetReservationProjection>,
    receipt: NormalizedBudgetReceipt | null,
  ): BudgetReasonCode | null {
    if (!receipt) return BudgetReasonCodes.UNKNOWN_USAGE;
    let usage: BudgetVector;
    try {
      usage = budgetVector(receipt.usage);
      requireIdentity(receipt.receiptId, 'receipt.receiptId');
      requireDigest(receipt.replayFingerprint, 'receipt.replayFingerprint');
      requireDigest(receipt.pricingDigest, 'receipt.pricingDigest');
    } catch {
      return BudgetReasonCodes.RECEIPT_MISMATCH;
    }
    const estimate = vectorFromReservationField(reservation, 'estimate');
    const scope = projectionScopes(state)[reservation.scopeId];
    const envelope = envelopeFromScope(scope);
    if (
      !['succeeded', 'failed', 'cancelled', 'timed-out'].includes(receipt.terminalStatus)
      ||
      receipt.dispatchId !== reservation.dispatchId
      || receipt.replayFingerprint !== envelope.replayFingerprint
      || receipt.pricingDigest !== estimate.cost.pricingDigest
      || usage.cost.currency !== estimate.cost.currency
      || usage.cost.scale !== estimate.cost.scale
      || usage.cost.pricingDigest !== estimate.cost.pricingDigest
      || usage.wallTime.deadlineMonotonicMs !== estimate.wallTime.deadlineMonotonicMs
    ) {
      return BudgetReasonCodes.RECEIPT_MISMATCH;
    }
    if (!budgetVectorFits(usage, estimate)) {
      return BudgetReasonCodes.ACTUAL_EXCEEDS_RESERVATION;
    }
    return null;
  }

  #reservationMutation(
    operation: string,
    input: ReservationOperationInput,
    mutate: (
      context: ProjectionContext,
      reservation: Readonly<BudgetReservationProjection>,
    ) => Promise<BudgetMutationResult>,
  ): Promise<BudgetMutationResult> {
    return this.#serialize(async () => {
      try {
        this.#validateEvidence(input);
        const context = await this.#readContext();
        const idempotent = this.#idempotentResult(context.state, input, operation);
        if (idempotent) return idempotent;
        const reservation = projectionReservations(context.state)[input.reservationId];
        if (!reservation) {
          return fallbackDenial(
            operation,
            input,
            'unknown',
            BudgetReasonCodes.RESERVATION_CONFLICT,
            input.reservationId,
          );
        }
        if (
          isReservationFullyDisposed(reservation)
          && operation !== 'reconcile'
          && operation !== 'settle'
        ) {
          return fallbackDenial(
            operation,
            input,
            reservation.scopeId,
            BudgetReasonCodes.RESERVATION_CONFLICT,
            reservation.reservationId,
          );
        }
        const scope = projectionScopes(context.state)[reservation.scopeId];
        if (envelopeFromScope(scope).replayFingerprint !== input.replayFingerprint) {
          return await this.#recordDenial(
            context,
            BudgetEventTypes.RESERVATION_DENIED,
            input,
            operation,
            reservation.scopeId,
            reservation.scopePath,
            BudgetReasonCodes.REPLAY_MISMATCH,
            reservation.reservationId,
            reservation.dispatchId,
          );
        }
        return await mutate(context, reservation);
      } catch (error: unknown) {
        return fallbackDenial(
          operation,
          input,
          'unknown',
          this.#reasonFromError(error, BudgetReasonCodes.RESERVATION_CONFLICT),
          input.reservationId,
        );
      }
    });
  }

  async #recordDenial(
    context: ProjectionContext,
    eventType: BudgetEventType,
    evidence: BudgetEvidenceInput,
    operation: string,
    scopeId: string,
    scopePath: readonly string[],
    reasonCode: BudgetReasonCode,
    reservationId: string | null = null,
    dispatchId: string | null = null,
  ): Promise<BudgetMutationResult> {
    if (scopePath.length === 0) {
      return fallbackDenial(operation, evidence, scopeId, reasonCode, reservationId);
    }
    const denied = decision(
      operation,
      evidence,
      scopeId,
      'denied',
      reasonCode,
      reservationId,
      dispatchId,
    );
    return this.#appendTransition(
      context,
      eventType,
      evidence,
      scopeId,
      scopePath,
      reasonCode,
      {
        denial: {
          reservationId,
          dispatchId,
          monotonicObservedAt: this.#options.monotonicNow(),
        },
      },
      denied,
    );
  }

  #recordAnomaly(
    context: ProjectionContext,
    evidence: BudgetEvidenceInput,
    operation: string,
    reservation: Readonly<BudgetReservationProjection>,
    reasonCode: BudgetReasonCode,
    details: JsonObject,
  ): Promise<BudgetMutationResult> {
    const anomaly = decision(
      operation,
      evidence,
      reservation.scopeId,
      'anomaly',
      reasonCode,
      reservation.reservationId,
      reservation.dispatchId,
    );
    return this.#appendTransition(
      context,
      BudgetEventTypes.ANOMALY_RECORDED,
      evidence,
      reservation.scopeId,
      reservation.scopePath,
      reasonCode,
      {
        reservationId: reservation.reservationId,
        details,
      },
      anomaly,
    );
  }

  async #appendTransition(
    context: ProjectionContext,
    eventType: BudgetEventType,
    evidence: BudgetEvidenceInput,
    scopeId: string,
    scopePath: readonly string[],
    reasonCode: BudgetReasonCode,
    data: JsonObject,
    result: BudgetDecision,
  ): Promise<BudgetMutationResult> {
    let transition;
    try {
      transition = materializeBudgetLifecyclePayload(context.state, eventType, {
        operationId: evidence.operationId ?? evidence.requestId,
        requestId: evidence.requestId,
        scopeId,
        scopePath,
        replayFingerprint: evidence.replayFingerprint,
        reasonCode,
        data,
        outcome: result,
      });
    } catch (error: unknown) {
      throw new BudgetMutationFailure(
        BudgetReasonCodes.REDUCER_DIVERGENCE,
        error instanceof Error ? error.message : 'Budget reducer rejected the transition',
      );
    }
    const timestamp = this.#options.now().toISOString();
    const event = prepareBudgetLifecycleEvent({
      eventType,
      streamId: this.#options.streamId,
      streamSequence: context.head.sequence + 1,
      occurredAt: timestamp,
      recordedAt: timestamp,
      producer: this.#options.producer,
      authorityEpoch: evidence.authorityEpoch,
      correlationId: evidence.correlationId,
      causationId: evidence.causationId,
      payload: transition.payload,
    }, this.#options.eventRegistry);
    const request: TransitionAuthorizationRequest = {
      requestId: `budget-authorization:${evidence.requestId}`,
      mode: evidence.mode,
      event,
      priorHead: context.head,
      priorStateVersion: context.state.projectionVersion,
      priorStateFingerprint: context.projection.digest,
      actorId: evidence.actorId,
      capabilityId: evidence.capabilityId,
      authorityEpoch: evidence.authorityEpoch,
      policy: this.#options.policy,
      evidenceDigest: evidence.evidenceDigest,
    };
    const authorization = await this.#options.gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new BudgetMutationFailure(
        BudgetReasonCodes.AUTHORIZATION_DENIED,
        `Budget append denied by gateway: ${authorization.reasonCode}`,
      );
    }
    try {
      const receipt = await this.#options.ledger.appendAuthorized(event, authorization.proof);
      return Object.freeze({ decision: result, receipt, isIdempotent: false });
    } catch (error: unknown) {
      const reason = error instanceof AuthorizedLedgerError
        && (
          error.code === AuthorizedLedgerErrorCodes.AUTHORIZATION_STALE
          || error.code === AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID
          || error.code === AuthorizedLedgerErrorCodes.EXPECTED_HEAD_MISMATCH
        )
        ? BudgetReasonCodes.RESERVATION_CONFLICT
        : BudgetReasonCodes.LEDGER_WRITE_FAILED;
      throw new BudgetMutationFailure(reason, 'Budget ledger append failed closed');
    }
  }

  #reasonFromError(error: unknown, fallback: BudgetReasonCode): BudgetReasonCode {
    if (error instanceof BudgetMutationFailure) return error.reasonCode;
    if (error instanceof TypeError || error instanceof RangeError) return fallback;
    return BudgetReasonCodes.LEDGER_WRITE_FAILED;
  }

  #serialize<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.#mutationTail.then(operation, operation);
    this.#mutationTail = next.then(() => undefined, () => undefined);
    return next;
  }
}

/** Create a stable digest for normalized evidence supplied to budget operations. */
export function budgetEvidenceDigest(value: JsonObject): string {
  return sha256Bytes(canonicalBytes(value));
}
