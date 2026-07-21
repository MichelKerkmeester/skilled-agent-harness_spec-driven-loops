// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Scope levels form one closed parent chain from program to iteration. */
export type BudgetScopeKind = 'program' | 'mode' | 'lineage' | 'iteration';

/** Stable scope identity and its immutable parent relationship. */
export interface BudgetScopeIdentity {
  readonly kind: BudgetScopeKind;
  readonly scopeId: string;
  readonly parentScopeId: string | null;
}

/** Counted model tokens. */
export interface TokenBudgetValue {
  readonly kind: 'tokens';
  readonly unit: 'token';
  readonly count: number;
}

/** Fixed-precision monetary value pinned to one price catalogue. */
export interface CostBudgetValue {
  readonly kind: 'cost';
  readonly unit: 'minor-unit';
  readonly minorUnits: number;
  readonly scale: number;
  readonly currency: string;
  readonly pricingDigest: string;
}

/** Counted executor attempts, including retries and failed work. */
export interface IterationBudgetValue {
  readonly kind: 'iterations';
  readonly unit: 'attempt';
  readonly attempts: number;
}

/** Monotonic elapsed duration bounded by a derived deadline. */
export interface WallTimeBudgetValue {
  readonly kind: 'wall-time';
  readonly unit: 'millisecond';
  readonly durationMs: number;
  readonly deadlineMonotonicMs: number;
}

export type BudgetDimensionValue =
  | TokenBudgetValue
  | CostBudgetValue
  | IterationBudgetValue
  | WallTimeBudgetValue;

/** Complete non-interchangeable resource vector required by every operation. */
export interface BudgetVector {
  readonly tokens: TokenBudgetValue;
  readonly cost: CostBudgetValue;
  readonly iterations: IterationBudgetValue;
  readonly wallTime: WallTimeBudgetValue;
}

/** Versioned immutable budget definition for one scope. */
export interface BudgetEnvelope {
  readonly budgetVersion: number;
  readonly budgetId: string;
  readonly scope: BudgetScopeIdentity;
  readonly parentBudgetId: string | null;
  readonly policyVersion: string;
  readonly replayFingerprint: string;
  readonly createdAtMonotonicMs: number;
  readonly limits: BudgetVector;
}

export interface BudgetEnvelopeInput {
  readonly budgetId: string;
  readonly scope: BudgetScopeIdentity;
  readonly parentBudgetId: string | null;
  readonly policyVersion: string;
  readonly replayFingerprint: string;
  readonly createdAtMonotonicMs: number;
  readonly limits: BudgetVector;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const BUDGET_ENVELOPE_VERSION = 1;
export const BUDGET_SCOPE_ORDER = Object.freeze([
  'program',
  'mode',
  'lineage',
  'iteration',
] as const);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const MAX_IDENTITY_LENGTH = 512;
const MAX_FIXED_PRECISION_SCALE = 9;

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function requireIdentity(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || value.trim() === ''
    || value.length > MAX_IDENTITY_LENGTH
  ) {
    throw new TypeError(`${field} must be a bounded non-empty string`);
  }
  return value;
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function requireNonNegativeSafeInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new RangeError(`${field} must be a non-negative safe integer`);
  }
  return value as number;
}

function assertSameKind(
  left: BudgetDimensionValue,
  right: BudgetDimensionValue,
): void {
  if (left.kind !== right.kind || left.unit !== right.unit) {
    throw new TypeError('Budget arithmetic requires the same dimension and unit');
  }
  if (
    left.kind === 'cost'
    && right.kind === 'cost'
    && (
      left.currency !== right.currency
      || left.scale !== right.scale
      || left.pricingDigest !== right.pricingDigest
    )
  ) {
    throw new TypeError('Cost arithmetic requires the same currency, scale, and pricing digest');
  }
  if (
    left.kind === 'wall-time'
    && right.kind === 'wall-time'
    && left.deadlineMonotonicMs !== right.deadlineMonotonicMs
  ) {
    throw new TypeError('Wall-time arithmetic requires the same monotonic deadline');
  }
}

function valueAmount(value: BudgetDimensionValue): number {
  switch (value.kind) {
    case 'tokens':
      return value.count;
    case 'cost':
      return value.minorUnits;
    case 'iterations':
      return value.attempts;
    case 'wall-time':
      return value.durationMs;
  }
}

function withAmount(value: BudgetDimensionValue, amount: number): BudgetDimensionValue {
  const validated = requireNonNegativeSafeInteger(amount, `${value.kind}.amount`);
  switch (value.kind) {
    case 'tokens':
      return Object.freeze({ ...value, count: validated });
    case 'cost':
      return Object.freeze({ ...value, minorUnits: validated });
    case 'iterations':
      return Object.freeze({ ...value, attempts: validated });
    case 'wall-time':
      return Object.freeze({ ...value, durationMs: validated });
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. VALUE CONSTRUCTORS
// ───────────────────────────────────────────────────────────────────

/** Construct a validated token count. */
export function tokenBudget(count: number): TokenBudgetValue {
  return Object.freeze({
    kind: 'tokens',
    unit: 'token',
    count: requireNonNegativeSafeInteger(count, 'tokens.count'),
  });
}

/** Construct a validated fixed-precision cost value. */
export function costBudget(
  minorUnits: number,
  currency: string,
  scale: number,
  pricingDigest: string,
): CostBudgetValue {
  if (!CURRENCY_PATTERN.test(currency)) {
    throw new TypeError('cost.currency must be a three-letter uppercase currency code');
  }
  if (!Number.isSafeInteger(scale) || scale < 0 || scale > MAX_FIXED_PRECISION_SCALE) {
    throw new RangeError(`cost.scale must be between 0 and ${MAX_FIXED_PRECISION_SCALE}`);
  }
  return Object.freeze({
    kind: 'cost',
    unit: 'minor-unit',
    minorUnits: requireNonNegativeSafeInteger(minorUnits, 'cost.minorUnits'),
    scale,
    currency,
    pricingDigest: requireDigest(pricingDigest, 'cost.pricingDigest'),
  });
}

/** Construct a validated attempt count. */
export function iterationBudget(attempts: number): IterationBudgetValue {
  return Object.freeze({
    kind: 'iterations',
    unit: 'attempt',
    attempts: requireNonNegativeSafeInteger(attempts, 'iterations.attempts'),
  });
}

/** Construct a validated monotonic duration and deadline pair. */
export function wallTimeBudget(
  durationMs: number,
  deadlineMonotonicMs: number,
): WallTimeBudgetValue {
  const duration = requireNonNegativeSafeInteger(durationMs, 'wallTime.durationMs');
  const deadline = requireNonNegativeSafeInteger(
    deadlineMonotonicMs,
    'wallTime.deadlineMonotonicMs',
  );
  return Object.freeze({
    kind: 'wall-time',
    unit: 'millisecond',
    durationMs: duration,
    deadlineMonotonicMs: deadline,
  });
}

/** Construct and validate one complete four-dimensional vector. */
export function budgetVector(input: BudgetVector): BudgetVector {
  return Object.freeze({
    tokens: tokenBudget(input.tokens.count),
    cost: costBudget(
      input.cost.minorUnits,
      input.cost.currency,
      input.cost.scale,
      input.cost.pricingDigest,
    ),
    iterations: iterationBudget(input.iterations.attempts),
    wallTime: wallTimeBudget(
      input.wallTime.durationMs,
      input.wallTime.deadlineMonotonicMs,
    ),
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. TYPED ARITHMETIC
// ───────────────────────────────────────────────────────────────────

/** Add same-dimension values without permitting unit or pricing coercion. */
export function addBudgetValues(
  left: BudgetDimensionValue,
  right: BudgetDimensionValue,
): BudgetDimensionValue {
  assertSameKind(left, right);
  const sum = valueAmount(left) + valueAmount(right);
  if (!Number.isSafeInteger(sum)) throw new RangeError('Budget addition exceeds safe integer range');
  return withAmount(left, sum);
}

/** Subtract same-dimension values without allowing a negative balance. */
export function subtractBudgetValues(
  left: BudgetDimensionValue,
  right: BudgetDimensionValue,
): BudgetDimensionValue {
  assertSameKind(left, right);
  const difference = valueAmount(left) - valueAmount(right);
  if (difference < 0) throw new RangeError('Budget subtraction would create a negative balance');
  return withAmount(left, difference);
}

/** Compare same-dimension values after exact compatibility validation. */
export function compareBudgetValues(
  left: BudgetDimensionValue,
  right: BudgetDimensionValue,
): number {
  assertSameKind(left, right);
  return Math.sign(valueAmount(left) - valueAmount(right));
}

/** Return a zero vector that retains cost and monotonic identity. */
export function zeroBudgetVector(template: BudgetVector): BudgetVector {
  return Object.freeze({
    tokens: tokenBudget(0),
    cost: costBudget(
      0,
      template.cost.currency,
      template.cost.scale,
      template.cost.pricingDigest,
    ),
    iterations: iterationBudget(0),
    wallTime: wallTimeBudget(0, template.wallTime.deadlineMonotonicMs),
  });
}

/** Add every typed dimension as one all-or-nothing vector operation. */
export function addBudgetVectors(left: BudgetVector, right: BudgetVector): BudgetVector {
  return Object.freeze({
    tokens: addBudgetValues(left.tokens, right.tokens) as TokenBudgetValue,
    cost: addBudgetValues(left.cost, right.cost) as CostBudgetValue,
    iterations: addBudgetValues(left.iterations, right.iterations) as IterationBudgetValue,
    wallTime: addBudgetValues(left.wallTime, right.wallTime) as WallTimeBudgetValue,
  });
}

/** Subtract every typed dimension as one all-or-nothing vector operation. */
export function subtractBudgetVectors(left: BudgetVector, right: BudgetVector): BudgetVector {
  return Object.freeze({
    tokens: subtractBudgetValues(left.tokens, right.tokens) as TokenBudgetValue,
    cost: subtractBudgetValues(left.cost, right.cost) as CostBudgetValue,
    iterations: subtractBudgetValues(
      left.iterations,
      right.iterations,
    ) as IterationBudgetValue,
    wallTime: subtractBudgetValues(left.wallTime, right.wallTime) as WallTimeBudgetValue,
  });
}

/** Return true only when every compatible dimension fits within its limit. */
export function budgetVectorFits(requested: BudgetVector, available: BudgetVector): boolean {
  return compareBudgetValues(requested.tokens, available.tokens) <= 0
    && compareBudgetValues(requested.cost, available.cost) <= 0
    && compareBudgetValues(requested.iterations, available.iterations) <= 0
    && compareBudgetValues(requested.wallTime, available.wallTime) <= 0;
}

/** Return true only when every amount in the vector is zero. */
export function isZeroBudgetVector(value: BudgetVector): boolean {
  return value.tokens.count === 0
    && value.cost.minorUnits === 0
    && value.iterations.attempts === 0
    && value.wallTime.durationMs === 0;
}

// ───────────────────────────────────────────────────────────────────
// 6. ENVELOPE VALIDATION
// ───────────────────────────────────────────────────────────────────

function scopeIndex(kind: BudgetScopeKind): number {
  return BUDGET_SCOPE_ORDER.indexOf(kind);
}

/** Construct a frozen envelope and enforce the canonical parent chain. */
export function createBudgetEnvelope(
  input: BudgetEnvelopeInput,
  parent: BudgetEnvelope | null = null,
): BudgetEnvelope {
  const budgetId = requireIdentity(input.budgetId, 'budgetId');
  const scopeId = requireIdentity(input.scope.scopeId, 'scope.scopeId');
  const policyVersion = requireIdentity(input.policyVersion, 'policyVersion');
  const replayFingerprint = requireDigest(input.replayFingerprint, 'replayFingerprint');
  const createdAtMonotonicMs = requireNonNegativeSafeInteger(
    input.createdAtMonotonicMs,
    'createdAtMonotonicMs',
  );
  const limits = budgetVector(input.limits);
  if (limits.wallTime.deadlineMonotonicMs < createdAtMonotonicMs) {
    throw new RangeError('Wall-time deadline cannot precede budget creation');
  }
  if (
    limits.wallTime.deadlineMonotonicMs - createdAtMonotonicMs
    > limits.wallTime.durationMs
  ) {
    throw new RangeError('Wall-time deadline must be derived within the declared duration');
  }

  if (input.scope.kind === 'program') {
    if (parent !== null || input.parentBudgetId !== null || input.scope.parentScopeId !== null) {
      throw new TypeError('Program budget must be the only parentless root');
    }
  } else {
    if (!parent) throw new TypeError('Non-root budget requires its exact parent envelope');
    if (
      input.parentBudgetId !== parent.budgetId
      || input.scope.parentScopeId !== parent.scope.scopeId
      || scopeIndex(input.scope.kind) !== scopeIndex(parent.scope.kind) + 1
    ) {
      throw new TypeError('Budget scope does not follow program > mode > lineage > iteration');
    }
    if (
      policyVersion !== parent.policyVersion
      || replayFingerprint !== parent.replayFingerprint
    ) {
      throw new TypeError('Child budget must inherit policy and replay identity');
    }
    if (!budgetVectorFits(limits, parent.limits)) {
      throw new RangeError('Child limits may narrow but never widen their parent');
    }
    if (limits.wallTime.deadlineMonotonicMs > parent.limits.wallTime.deadlineMonotonicMs) {
      throw new RangeError('Child monotonic deadline may not outlive its parent');
    }
  }

  return Object.freeze({
    budgetVersion: BUDGET_ENVELOPE_VERSION,
    budgetId,
    scope: Object.freeze({
      kind: input.scope.kind,
      scopeId,
      parentScopeId: input.scope.parentScopeId,
    }),
    parentBudgetId: input.parentBudgetId,
    policyVersion,
    replayFingerprint,
    createdAtMonotonicMs,
    limits,
  });
}
