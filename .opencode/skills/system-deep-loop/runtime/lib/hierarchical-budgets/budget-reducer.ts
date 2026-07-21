// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Reducer
// ───────────────────────────────────────────────────────────────────

import {
  TypedReducerRegistry,
  rebuildProjection,
} from '../authorized-ledger/index.js';
import { canonicalJson } from '../event-envelope/index.js';
import {
  BudgetEventTypes,
  asBudgetLifecyclePayload,
} from './budget-events.js';
import {
  addBudgetVectors,
  budgetVector,
  budgetVectorFits,
  createBudgetEnvelope,
  isZeroBudgetVector,
  subtractBudgetVectors,
  zeroBudgetVector,
} from './budget-types.js';

import type {
  LedgerHead,
  RebuiltProjection,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type { EventReadResult, JsonObject, JsonValue } from '../event-envelope/index.js';
import type { BudgetEventType, BudgetLifecyclePayload } from './budget-events.js';
import type {
  BudgetEnvelope,
  BudgetEnvelopeInput,
  BudgetVector,
} from './budget-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** One reducer-derived balance with no independent mutable counter. */
export interface BudgetDimensionBalance extends JsonObject {
  kind: string;
  unit: string;
  limit: number;
  allocated: number;
  reserved: number;
  committed: number;
  released: number;
  remaining: number;
  currency: string | null;
  scale: number | null;
  pricingDigest: string | null;
  deadlineMonotonicMs: number | null;
}

export interface BudgetBalanceVector extends JsonObject {
  tokens: BudgetDimensionBalance;
  cost: BudgetDimensionBalance;
  iterations: BudgetDimensionBalance;
  wallTime: BudgetDimensionBalance;
}

export interface BudgetScopeProjection extends JsonObject {
  envelope: JsonObject;
  childScopeIds: string[];
  balances: BudgetBalanceVector;
  blockedReason: string | null;
}

export type BudgetReservationStatus =
  | 'reserved'
  | 'partially-released'
  | 'settled'
  | 'cancelled'
  | 'expired'
  | 'unreconciled';

export interface BudgetReservationProjection extends JsonObject {
  reservationId: string;
  dispatchId: string;
  scopeId: string;
  scopePath: string[];
  estimate: JsonObject;
  committed: JsonObject;
  released: JsonObject;
  status: BudgetReservationStatus;
  createdAtMonotonicMs: number;
  leaseExpiresAtMonotonicMs: number;
  terminalReceiptId: string | null;
}

/** Disposable state rebuilt exclusively from verified lifecycle events. */
export interface BudgetProjection extends JsonObject {
  projectionVersion: string;
  scopes: JsonObject;
  reservations: JsonObject;
  outcomes: JsonObject;
  anomalies: JsonValue[];
}

export interface BudgetPayloadMaterializationInput {
  readonly operationId: string;
  readonly requestId: string;
  readonly scopeId: string;
  readonly scopePath: readonly string[];
  readonly replayFingerprint: string;
  readonly reasonCode: string;
  readonly data: JsonObject;
  readonly outcome: JsonObject;
}

export interface MaterializedBudgetTransition {
  readonly payload: BudgetLifecyclePayload;
  readonly nextState: Readonly<BudgetProjection>;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const BUDGET_REDUCER_VERSION = 'hierarchical-budget-reducer@1';
export const BUDGET_PROJECTION_SCHEMA_VERSION = 'hierarchical-budget-projection@1';

// ───────────────────────────────────────────────────────────────────
// 3. STATE HELPERS
// ───────────────────────────────────────────────────────────────────

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function requireObject(value: JsonValue | undefined, field: string): JsonObject {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new TypeError(`${field} must be a JSON object`);
  }
  return value;
}

function requireString(value: JsonValue | undefined, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

function requireNonNegativeInteger(value: JsonValue | undefined, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new RangeError(`${field} must be a non-negative safe integer`);
  }
  return value as number;
}

function scopes(state: BudgetProjection): Record<string, BudgetScopeProjection> {
  return state.scopes as unknown as Record<string, BudgetScopeProjection>;
}

function reservations(
  state: BudgetProjection,
): Record<string, BudgetReservationProjection> {
  return state.reservations as unknown as Record<string, BudgetReservationProjection>;
}

function outcomes(state: BudgetProjection): Record<string, JsonObject> {
  return state.outcomes as unknown as Record<string, JsonObject>;
}

function envelopeFromScope(scope: BudgetScopeProjection): BudgetEnvelope {
  return scope.envelope as unknown as BudgetEnvelope;
}

function vectorFromJson(value: JsonValue | undefined, field: string): BudgetVector {
  return budgetVector(requireObject(value, field) as unknown as BudgetVector);
}

function dimensionBalance(
  kind: string,
  unit: string,
  limit: number,
  metadata: Readonly<{
    currency?: string;
    scale?: number;
    pricingDigest?: string;
    deadlineMonotonicMs?: number;
  }> = {},
): BudgetDimensionBalance {
  return {
    kind,
    unit,
    limit,
    allocated: 0,
    reserved: 0,
    committed: 0,
    released: 0,
    remaining: limit,
    currency: metadata.currency ?? null,
    scale: metadata.scale ?? null,
    pricingDigest: metadata.pricingDigest ?? null,
    deadlineMonotonicMs: metadata.deadlineMonotonicMs ?? null,
  };
}

function balancesFromLimits(limits: BudgetVector): BudgetBalanceVector {
  return {
    tokens: dimensionBalance('tokens', 'token', limits.tokens.count),
    cost: dimensionBalance('cost', 'minor-unit', limits.cost.minorUnits, {
      currency: limits.cost.currency,
      scale: limits.cost.scale,
      pricingDigest: limits.cost.pricingDigest,
    }),
    iterations: dimensionBalance('iterations', 'attempt', limits.iterations.attempts),
    wallTime: dimensionBalance('wall-time', 'millisecond', limits.wallTime.durationMs, {
      deadlineMonotonicMs: limits.wallTime.deadlineMonotonicMs,
    }),
  };
}

function balanceVectorToAvailable(balance: BudgetBalanceVector): BudgetVector {
  return budgetVector({
    tokens: { kind: 'tokens', unit: 'token', count: balance.tokens.remaining },
    cost: {
      kind: 'cost',
      unit: 'minor-unit',
      minorUnits: balance.cost.remaining,
      currency: requireString(balance.cost.currency, 'balance.cost.currency'),
      scale: requireNonNegativeInteger(balance.cost.scale, 'balance.cost.scale'),
      pricingDigest: requireString(balance.cost.pricingDigest, 'balance.cost.pricingDigest'),
    },
    iterations: {
      kind: 'iterations',
      unit: 'attempt',
      attempts: balance.iterations.remaining,
    },
    wallTime: {
      kind: 'wall-time',
      unit: 'millisecond',
      durationMs: balance.wallTime.remaining,
      deadlineMonotonicMs: requireNonNegativeInteger(
        balance.wallTime.deadlineMonotonicMs,
        'balance.wallTime.deadlineMonotonicMs',
      ),
    },
  });
}

/** Return the typed remaining capacity for one reducer-owned scope. */
export function availableBudgetVector(
  scope: Readonly<BudgetScopeProjection>,
): BudgetVector {
  return balanceVectorToAvailable(scope.balances);
}

function balanceVectorToAllocatedRemainder(balance: BudgetBalanceVector): BudgetVector {
  const available = balanceVectorToAvailable(balance);
  return budgetVector({
    tokens: {
      ...available.tokens,
      count: Math.max(
        0,
        Math.min(balance.tokens.remaining, balance.tokens.limit - balance.tokens.allocated),
      ),
    },
    cost: {
      ...available.cost,
      minorUnits: Math.max(
        0,
        Math.min(balance.cost.remaining, balance.cost.limit - balance.cost.allocated),
      ),
    },
    iterations: {
      ...available.iterations,
      attempts: Math.max(
        0,
        Math.min(
          balance.iterations.remaining,
          balance.iterations.limit - balance.iterations.allocated,
        ),
      ),
    },
    wallTime: {
      ...available.wallTime,
      durationMs: Math.max(
        0,
        Math.min(
          balance.wallTime.remaining,
          balance.wallTime.limit - balance.wallTime.allocated,
        ),
      ),
    },
  });
}

/** Return the typed capacity that may still be granted to new child scopes. */
export function allocatableBudgetVector(
  scope: Readonly<BudgetScopeProjection>,
): BudgetVector {
  return balanceVectorToAllocatedRemainder(scope.balances);
}

function changeDimension(
  balance: BudgetDimensionBalance,
  reservedDelta: number,
  committedDelta: number,
  releasedDelta: number,
): void {
  const reserved = balance.reserved + reservedDelta;
  const committed = balance.committed + committedDelta;
  const released = balance.released + releasedDelta;
  const remaining = balance.limit - reserved - committed;
  if (
    !Number.isSafeInteger(reserved)
    || !Number.isSafeInteger(committed)
    || !Number.isSafeInteger(released)
    || reserved < 0
    || committed < 0
    || released < 0
    || remaining < 0
  ) {
    throw new RangeError('Budget transition would create an invalid or negative balance');
  }
  balance.reserved = reserved;
  balance.committed = committed;
  balance.released = released;
  balance.remaining = remaining;
}

function changeBalanceVector(
  balance: BudgetBalanceVector,
  reserved: BudgetVector,
  committed: BudgetVector,
  released: BudgetVector,
  direction: 1 | -1,
): void {
  changeDimension(
    balance.tokens,
    direction * reserved.tokens.count,
    direction * committed.tokens.count,
    direction * released.tokens.count,
  );
  changeDimension(
    balance.cost,
    direction * reserved.cost.minorUnits,
    direction * committed.cost.minorUnits,
    direction * released.cost.minorUnits,
  );
  changeDimension(
    balance.iterations,
    direction * reserved.iterations.attempts,
    direction * committed.iterations.attempts,
    direction * released.iterations.attempts,
  );
  changeDimension(
    balance.wallTime,
    direction * reserved.wallTime.durationMs,
    direction * committed.wallTime.durationMs,
    direction * released.wallTime.durationMs,
  );
}

function applyReservationDisposal(
  state: BudgetProjection,
  reservation: BudgetReservationProjection,
  committedDelta: BudgetVector,
  releasedDelta: BudgetVector,
): void {
  const disposedDelta = addBudgetVectors(committedDelta, releasedDelta);
  const existingCommitted = vectorFromJson(reservation.committed, 'reservation.committed');
  const existingReleased = vectorFromJson(reservation.released, 'reservation.released');
  const disposed = addBudgetVectors(
    addBudgetVectors(existingCommitted, existingReleased),
    disposedDelta,
  );
  const estimate = vectorFromJson(reservation.estimate, 'reservation.estimate');
  if (!budgetVectorFits(disposed, estimate)) {
    throw new RangeError('Reservation disposal exceeds the original estimate');
  }
  for (const scopeId of reservation.scopePath) {
    const scope = scopes(state)[scopeId];
    if (!scope) throw new TypeError('Reservation references a missing scope');
    changeDimension(
      scope.balances.tokens,
      -disposedDelta.tokens.count,
      committedDelta.tokens.count,
      releasedDelta.tokens.count,
    );
    changeDimension(
      scope.balances.cost,
      -disposedDelta.cost.minorUnits,
      committedDelta.cost.minorUnits,
      releasedDelta.cost.minorUnits,
    );
    changeDimension(
      scope.balances.iterations,
      -disposedDelta.iterations.attempts,
      committedDelta.iterations.attempts,
      releasedDelta.iterations.attempts,
    );
    changeDimension(
      scope.balances.wallTime,
      -disposedDelta.wallTime.durationMs,
      committedDelta.wallTime.durationMs,
      releasedDelta.wallTime.durationMs,
    );
  }
  reservation.committed = addBudgetVectors(existingCommitted, committedDelta) as unknown as JsonObject;
  reservation.released = addBudgetVectors(existingReleased, releasedDelta) as unknown as JsonObject;
}

function assertScopePath(state: BudgetProjection, scopePath: readonly string[]): void {
  if (scopePath.length === 0) throw new TypeError('Budget scope path must not be empty');
  for (const [index, scopeId] of scopePath.entries()) {
    const scope = scopes(state)[scopeId];
    if (!scope) throw new TypeError('Budget scope path contains a missing scope');
    const envelope = envelopeFromScope(scope);
    const expectedParent = index === 0 ? null : scopePath[index - 1];
    if (envelope.scope.parentScopeId !== expectedParent) {
      throw new TypeError('Budget scope path does not match immutable parentage');
    }
  }
}

/** Resolve the immutable program-to-target path for one scope. */
export function budgetScopePath(
  state: Readonly<BudgetProjection>,
  scopeId: string,
): readonly string[] {
  const path: string[] = [];
  const visited = new Set<string>();
  let current: string | null = scopeId;
  while (current !== null) {
    if (visited.has(current)) throw new TypeError('Budget scope tree contains a cycle');
    visited.add(current);
    const scope: BudgetScopeProjection | undefined = (
      state.scopes as unknown as Record<string, BudgetScopeProjection>
    )[current];
    if (!scope) throw new TypeError('Budget scope is missing from the projection');
    path.unshift(current);
    current = envelopeFromScope(scope).scope.parentScopeId;
  }
  assertScopePath(state as BudgetProjection, path);
  return Object.freeze(path);
}

/** Capture the reducer-owned balances for the scopes that currently exist. */
export function snapshotBudgetBalances(
  state: Readonly<BudgetProjection>,
  scopePath: readonly string[],
): JsonObject {
  const snapshot: JsonObject = {};
  const stateScopes = state.scopes as unknown as Record<string, BudgetScopeProjection>;
  for (const scopeId of scopePath) {
    const scope = stateScopes[scopeId];
    if (scope) snapshot[scopeId] = cloneJson(scope.balances);
  }
  return snapshot;
}

// ───────────────────────────────────────────────────────────────────
// 4. TRANSITION REDUCTION
// ───────────────────────────────────────────────────────────────────

function applyScopeCreation(
  state: BudgetProjection,
  payload: BudgetLifecyclePayload,
  isChild: boolean,
): void {
  const data = payload.data;
  const candidate = requireObject(data.envelope, 'data.envelope') as unknown as BudgetEnvelopeInput;
  if (scopes(state)[candidate.scope.scopeId]) {
    throw new TypeError('Budget scope identity is already allocated');
  }
  const parent = isChild
    ? envelopeFromScope(
      scopes(state)[requireString(candidate.scope.parentScopeId, 'scope.parentScopeId')],
    )
    : null;
  const envelope = createBudgetEnvelope(candidate, parent);
  if (payload.scope_id !== envelope.scope.scopeId) {
    throw new TypeError('Budget event scope does not match its envelope');
  }
  if (isChild && parent) {
    const parentProjection = scopes(state)[parent.scope.scopeId];
    const allocationRemainder = balanceVectorToAllocatedRemainder(parentProjection.balances);
    if (!budgetVectorFits(envelope.limits, allocationRemainder)) {
      throw new RangeError('Child allocation exceeds the parent allocatable remainder');
    }
    parentProjection.childScopeIds.push(envelope.scope.scopeId);
    parentProjection.childScopeIds.sort();
    parentProjection.balances.tokens.allocated += envelope.limits.tokens.count;
    parentProjection.balances.cost.allocated += envelope.limits.cost.minorUnits;
    parentProjection.balances.iterations.allocated += envelope.limits.iterations.attempts;
    parentProjection.balances.wallTime.allocated += envelope.limits.wallTime.durationMs;
  } else if (Object.keys(scopes(state)).length > 0) {
    throw new TypeError('Budget projection may contain only one program root');
  }
  scopes(state)[envelope.scope.scopeId] = {
    envelope: envelope as unknown as JsonObject,
    childScopeIds: [],
    balances: balancesFromLimits(envelope.limits),
    blockedReason: null,
  };
  assertScopePath(state, payload.scope_path);
}

function applyReservationGrant(
  state: BudgetProjection,
  payload: BudgetLifecyclePayload,
): void {
  assertScopePath(state, payload.scope_path);
  const reservationData = requireObject(payload.data.reservation, 'data.reservation');
  const reservationId = requireString(reservationData.reservationId, 'reservationId');
  if (reservations(state)[reservationId]) {
    throw new TypeError('Reservation identity is already bound');
  }
  const estimate = vectorFromJson(reservationData.estimate, 'reservation.estimate');
  for (const scopeId of payload.scope_path) {
    const scope = scopes(state)[scopeId];
    if (scope.blockedReason !== null || !budgetVectorFits(estimate, balanceVectorToAvailable(scope.balances))) {
      throw new RangeError('Reservation grant exceeds an ancestor balance or blocked scope');
    }
  }
  for (const scopeId of payload.scope_path) {
    const scope = scopes(state)[scopeId];
    changeBalanceVector(
      scope.balances,
      estimate,
      zeroBudgetVector(estimate),
      zeroBudgetVector(estimate),
      1,
    );
  }
  reservations(state)[reservationId] = {
    reservationId,
    dispatchId: requireString(reservationData.dispatchId, 'reservation.dispatchId'),
    scopeId: payload.scope_id,
    scopePath: [...payload.scope_path],
    estimate: estimate as unknown as JsonObject,
    committed: zeroBudgetVector(estimate) as unknown as JsonObject,
    released: zeroBudgetVector(estimate) as unknown as JsonObject,
    status: 'reserved',
    createdAtMonotonicMs: requireNonNegativeInteger(
      reservationData.createdAtMonotonicMs,
      'reservation.createdAtMonotonicMs',
    ),
    leaseExpiresAtMonotonicMs: requireNonNegativeInteger(
      reservationData.leaseExpiresAtMonotonicMs,
      'reservation.leaseExpiresAtMonotonicMs',
    ),
    terminalReceiptId: null,
  };
}

function reservationForPayload(
  state: BudgetProjection,
  payload: BudgetLifecyclePayload,
): BudgetReservationProjection {
  const reservationId = requireString(payload.data.reservationId, 'data.reservationId');
  const reservation = reservations(state)[reservationId];
  if (!reservation) throw new TypeError('Budget reservation does not exist');
  if (
    reservation.scopeId !== payload.scope_id
    || canonicalJson(reservation.scopePath) !== canonicalJson(payload.scope_path)
  ) {
    throw new TypeError('Budget operation does not match the reservation scope path');
  }
  return reservation;
}

function applyRenewal(state: BudgetProjection, payload: BudgetLifecyclePayload): void {
  const reservation = reservationForPayload(state, payload);
  if (reservation.status !== 'reserved' && reservation.status !== 'partially-released') {
    throw new TypeError('Only an open reservation can be renewed');
  }
  reservation.leaseExpiresAtMonotonicMs = requireNonNegativeInteger(
    payload.data.leaseExpiresAtMonotonicMs,
    'data.leaseExpiresAtMonotonicMs',
  );
}

function applyRelease(
  state: BudgetProjection,
  payload: BudgetLifecyclePayload,
  status: BudgetReservationStatus,
): void {
  const reservation = reservationForPayload(state, payload);
  if (reservation.status === 'settled' || reservation.status === 'cancelled') {
    throw new TypeError('Terminal reservation cannot release capacity again');
  }
  const release = vectorFromJson(payload.data.release, 'data.release');
  applyReservationDisposal(state, reservation, zeroBudgetVector(release), release);
  reservation.status = status;
}

function applySpend(
  state: BudgetProjection,
  payload: BudgetLifecyclePayload,
  isReconciliation: boolean,
): void {
  const reservation = reservationForPayload(state, payload);
  if (!isReconciliation && reservation.status === 'unreconciled') {
    throw new TypeError('Unreconciled spend requires an explicit reconciliation event');
  }
  const committedDelta = vectorFromJson(payload.data.committedDelta, 'data.committedDelta');
  const releasedDelta = vectorFromJson(payload.data.releasedDelta, 'data.releasedDelta');
  applyReservationDisposal(state, reservation, committedDelta, releasedDelta);
  reservation.status = requireString(payload.data.status, 'data.status') as BudgetReservationStatus;
  const receiptId = payload.data.receiptId;
  reservation.terminalReceiptId = receiptId === null
    ? null
    : requireString(receiptId, 'data.receiptId');

  if (isReconciliation) {
    for (const scopeId of reservation.scopePath) {
      const hasUnreconciled = Object.values(reservations(state)).some((candidate) => (
        candidate.status === 'unreconciled' && candidate.scopePath.includes(scopeId)
      ));
      if (!hasUnreconciled) scopes(state)[scopeId].blockedReason = null;
    }
  }
}

function applyAnomaly(state: BudgetProjection, payload: BudgetLifecyclePayload): void {
  const reservationId = payload.data.reservationId;
  if (typeof reservationId === 'string' && reservations(state)[reservationId]) {
    reservations(state)[reservationId].status = 'unreconciled';
  }
  for (const scopeId of payload.scope_path) {
    const scope = scopes(state)[scopeId];
    if (scope) scope.blockedReason = payload.reason_code;
  }
  state.anomalies.push(cloneJson({
    requestId: payload.request_id,
    scopeId: payload.scope_id,
    reasonCode: payload.reason_code,
    data: payload.data,
  }));
}

function applyTransitionCore(
  state: BudgetProjection,
  eventType: BudgetEventType,
  payload: BudgetLifecyclePayload,
): void {
  switch (eventType) {
    case BudgetEventTypes.SCOPE_CREATED:
      applyScopeCreation(state, payload, false);
      break;
    case BudgetEventTypes.CHILD_ALLOCATED:
      applyScopeCreation(state, payload, true);
      break;
    case BudgetEventTypes.RESERVATION_GRANTED:
      applyReservationGrant(state, payload);
      break;
    case BudgetEventTypes.RESERVATION_RENEWED:
      applyRenewal(state, payload);
      break;
    case BudgetEventTypes.RESERVATION_RELEASED:
      applyRelease(state, payload, 'partially-released');
      break;
    case BudgetEventTypes.RESERVATION_CANCELLED:
      applyRelease(state, payload, 'cancelled');
      break;
    case BudgetEventTypes.RESERVATION_EXPIRED:
      applyRelease(state, payload, 'expired');
      break;
    case BudgetEventTypes.SPEND_COMMITTED:
      applySpend(state, payload, false);
      break;
    case BudgetEventTypes.RECONCILIATION_RECORDED:
      applySpend(state, payload, true);
      break;
    case BudgetEventTypes.ANOMALY_RECORDED:
      applyAnomaly(state, payload);
      break;
    case BudgetEventTypes.RESERVATION_DENIED:
    case BudgetEventTypes.EXHAUSTION_RECORDED:
      assertScopePath(state, payload.scope_path);
      break;
  }
}

/** Compute the exact before/after evidence that the reducer will later verify. */
export function materializeBudgetLifecyclePayload(
  state: Readonly<BudgetProjection>,
  eventType: BudgetEventType,
  input: BudgetPayloadMaterializationInput,
): MaterializedBudgetTransition {
  const mutable = cloneJson(state) as BudgetProjection;
  const existing = outcomes(mutable)[input.requestId];
  if (existing) throw new TypeError('Budget request identity already has an outcome');
  const basePayload: BudgetLifecyclePayload = {
    operation_id: input.operationId,
    request_id: input.requestId,
    scope_id: input.scopeId,
    scope_path: [...input.scopePath],
    replay_fingerprint: input.replayFingerprint,
    reason_code: input.reasonCode,
    before_balances: {},
    after_balances: {},
    data: cloneJson(input.data),
    outcome: cloneJson(input.outcome),
  };
  const beforeBalances = snapshotBudgetBalances(mutable, input.scopePath);
  applyTransitionCore(mutable, eventType, basePayload);
  const afterBalances = snapshotBudgetBalances(mutable, input.scopePath);
  const payload: BudgetLifecyclePayload = {
    ...basePayload,
    before_balances: beforeBalances,
    after_balances: afterBalances,
  };
  outcomes(mutable)[input.requestId] = cloneJson(input.outcome);
  return Object.freeze({
    payload: Object.freeze(payload),
    nextState: Object.freeze(mutable),
  });
}

function reduceBudgetEvent(
  state: Readonly<BudgetProjection>,
  event: Readonly<EventReadResult>,
): BudgetProjection {
  const mutable = cloneJson(state) as BudgetProjection;
  const eventType = event.effective.envelope.event_type as BudgetEventType;
  const payload = asBudgetLifecyclePayload(event.effective.envelope.payload);
  const existing = outcomes(mutable)[payload.request_id];
  if (existing) {
    if (canonicalJson(existing) !== canonicalJson(payload.outcome)) {
      throw new TypeError('Budget request identity maps to conflicting outcomes');
    }
    return mutable;
  }
  const before = snapshotBudgetBalances(mutable, payload.scope_path);
  if (canonicalJson(before) !== canonicalJson(payload.before_balances)) {
    throw new TypeError('Budget event before-balances do not match reducer state');
  }
  applyTransitionCore(mutable, eventType, payload);
  const after = snapshotBudgetBalances(mutable, payload.scope_path);
  if (canonicalJson(after) !== canonicalJson(payload.after_balances)) {
    throw new TypeError('Budget event after-balances do not match reducer state');
  }
  outcomes(mutable)[payload.request_id] = cloneJson(payload.outcome);
  return mutable;
}

// ───────────────────────────────────────────────────────────────────
// 5. PUBLIC REDUCER API
// ───────────────────────────────────────────────────────────────────

/** Return an empty disposable projection with no implicit root budget. */
export function createInitialBudgetProjection(): BudgetProjection {
  return {
    projectionVersion: BUDGET_PROJECTION_SCHEMA_VERSION,
    scopes: {},
    reservations: {},
    outcomes: {},
    anomalies: [],
  };
}

/** Register one exact deterministic reducer for every lifecycle event. */
export function createBudgetReducerRegistry(): TypedReducerRegistry<BudgetProjection> {
  return new TypedReducerRegistry(Object.values(BudgetEventTypes).map((eventType) => ({
    eventType,
    reducerVersion: BUDGET_REDUCER_VERSION,
    reduce: reduceBudgetEvent,
  })));
}

/** Rebuild and byte-compare the projection from verified ledger events. */
export function rebuildBudgetProjection(
  events: readonly VerifiedLedgerEvent[],
  ledgerHead: LedgerHead,
): RebuiltProjection<BudgetProjection> {
  return rebuildProjection(
    events,
    createInitialBudgetProjection(),
    BUDGET_REDUCER_VERSION,
    ledgerHead,
    createBudgetReducerRegistry(),
  );
}

/** Return the open amount left inside one reservation. */
export function remainingReservationVector(
  reservation: Readonly<BudgetReservationProjection>,
): BudgetVector {
  const estimate = vectorFromJson(reservation.estimate, 'reservation.estimate');
  const committed = vectorFromJson(reservation.committed, 'reservation.committed');
  const released = vectorFromJson(reservation.released, 'reservation.released');
  return subtractBudgetVectors(estimate, addBudgetVectors(committed, released));
}

/** Return true when a reservation has no undisposed capacity. */
export function isReservationFullyDisposed(
  reservation: Readonly<BudgetReservationProjection>,
): boolean {
  return isZeroBudgetVector(remainingReservationVector(reservation));
}
