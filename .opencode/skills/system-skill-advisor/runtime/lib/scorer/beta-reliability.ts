// ───────────────────────────────────────────────────────────────
// MODULE: Beta-Posterior Reliability Primitive + Advisor Adapter
// ───────────────────────────────────────────────────────────────
// A shared, flood-immune reliability primitive for the shadow learning loop.
// Raw acceptance frequency lets a handful of all-accepted samples look identical
// to ten thousand, so a bounded Beta posterior `(a0+s)/(a0+b0+s+f)` is used
// instead: it can never be pushed to certainty by sheer count and a contributor
// with no evidence reads the uninformative 0.5 (promotes nothing on cold start).
//
// This module is pure math + pure policy. It performs NO I/O and is never on the
// prompt-time recommend path. The advisor consumes a posterior as a *weight
// delta* (not a multiplier); a sibling Deep-Loop consumer consumes the posterior
// directly. Keeping the f64 math here (separate from the integer Bayesian scorer
// that throws on fractional inputs) lets both consumers share one primitive
// through thin adapters without a divergent fork.

import { createHash } from 'node:crypto';

import type { ScorerLane } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. NUMERIC HELPERS (the shared symmetric clamp is intentionally NOT reused —
//    these locals keep the asymmetric path independent of the estimator's clamp)
// ───────────────────────────────────────────────────────────────

function round4(value: number): number {
  return Number(value.toFixed(4));
}

function round6(value: number): number {
  return Number(value.toFixed(6));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function clampNonNeg(value: number, maxAbs: number): number {
  return Math.max(0, Math.min(maxAbs, value));
}

function clampSym(value: number, maxAbs: number): number {
  return Math.max(-maxAbs, Math.min(maxAbs, value));
}

// ───────────────────────────────────────────────────────────────
// 2. BETA POSTERIOR PRIMITIVE (shared f64)
// ───────────────────────────────────────────────────────────────

export interface BetaPrior {
  readonly alpha: number;
  readonly beta: number;
}

export interface BetaEvidence {
  readonly successes: number;
  readonly failures: number;
}

/** Uninformative prior Beta(1,1): mean 0.5, so an unscored contributor sits on
 * the fence and moves the posterior toward neither pole. */
export const NEUTRAL_PRIOR: BetaPrior = { alpha: 1, beta: 1 };

function assertFiniteNonNeg(...values: number[]): void {
  for (const value of values) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError('beta-reliability: counts/priors must be finite and non-negative');
    }
  }
}

/**
 * Posterior mean of a Beta(alpha0 + s, beta0 + f) distribution. Strictly inside
 * (0,1) for any finite evidence when the prior has positive mass on both poles,
 * so no amount of one-sided evidence drives it to certainty.
 */
export function betaPosteriorMean(prior: BetaPrior, evidence: BetaEvidence): number {
  assertFiniteNonNeg(prior.alpha, prior.beta, evidence.successes, evidence.failures);
  const a = prior.alpha + evidence.successes;
  const b = prior.beta + evidence.failures;
  const denom = a + b;
  if (denom <= 0) return 0.5;
  return round6(a / denom);
}

/** Cold-start neutral posterior: the prior mean with no evidence. Beta(1,1)→0.5. */
export function coldStartPosterior(prior: BetaPrior = NEUTRAL_PRIOR): number {
  return betaPosteriorMean(prior, { successes: 0, failures: 0 });
}

export interface CountFloorOptions {
  /** Below this many total observations the posterior is held at the neutral
   * prior mean — a couple of samples cannot move the estimate. */
  readonly countFloor?: number;
  readonly prior?: BetaPrior;
}

/**
 * Posterior with an optional count floor. Until `countFloor` observations exist
 * the neutral prior mean is returned, so a cold/near-cold lane promotes nothing.
 */
export function laneReliabilityPosterior(
  evidence: BetaEvidence,
  options: CountFloorOptions = {},
): number {
  const prior = options.prior ?? NEUTRAL_PRIOR;
  const floor = options.countFloor ?? 0;
  const total = evidence.successes + evidence.failures;
  if (total < floor) return coldStartPosterior(prior);
  return betaPosteriorMean(prior, evidence);
}

/** Highest posterior reachable from `maxSuccesses` all-positive observations. */
export function maxAchievablePosterior(prior: BetaPrior, maxSuccesses: number): number {
  return betaPosteriorMean(prior, { successes: maxSuccesses, failures: 0 });
}

// ───────────────────────────────────────────────────────────────
// 3. ADVISOR ADAPTER — posterior → weight delta (NOT a multiplier)
// ───────────────────────────────────────────────────────────────

export interface PosteriorToDeltaOptions {
  readonly maxAbs: number;
  /** Posterior value that maps to a zero delta. Defaults to the neutral 0.5. */
  readonly neutral?: number;
}

/**
 * Map a reliability posterior to a bounded, signed weight delta. The neutral
 * posterior (0.5) maps to 0 — a cold-start lane proposes no change. A perfectly
 * reliable lane maps to +maxAbs; a perfectly unreliable one to -maxAbs.
 */
export function posteriorToWeightDelta(posterior: number, options: PosteriorToDeltaOptions): number {
  const neutral = options.neutral ?? 0.5;
  const span = Math.max(neutral, 1 - neutral) || 1;
  const delta = ((posterior - neutral) / span) * options.maxAbs;
  return round4(clampSym(delta, options.maxAbs));
}

// ───────────────────────────────────────────────────────────────
// 4. ASYMMETRIC, SIGN-LOCKED DELTA (corrections sink ≥ acceptances raise)
// ───────────────────────────────────────────────────────────────

export interface AsymmetricDeltaInput {
  /** Pressure pulling the value up (e.g. acceptance rate), in [0,1]. */
  readonly raisePressure: number;
  /** Pressure pulling the value down (e.g. correction rate), in [0,1]. */
  readonly sinkPressure: number;
  /** Trust applied to the raise side, in [0,1]. 0 ⇒ decay-only (never raises). */
  readonly gain?: number;
  readonly maxAbs: number;
}

/**
 * Signed delta where the sink side dominates: for equal raise/sink pressure the
 * result is ≤ 0 (because gain ≤ 1), so corrections sink weight at least as hard
 * as acceptances raise it. `gain: 0` yields a decay-only signal that can never
 * raise. The sink magnitude is freshly bounded by `maxAbs` each call — it is
 * never ratcheted/accumulated. Returns a positive number for a net sink so it
 * drops straight into the estimator's "raise the confidence threshold" seam,
 * where `gain: 0` reproduces today's symmetric output byte-for-byte.
 */
export function asymmetricSinkDelta(input: AsymmetricDeltaInput): number {
  const gain = clamp01(input.gain ?? 0);
  const up = clampNonNeg(clamp01(input.raisePressure) * gain, 1);
  const down = clampNonNeg(clamp01(input.sinkPressure), 1);
  const net = (down - up) * input.maxAbs;
  return round4(clampSym(net, input.maxAbs));
}

// ───────────────────────────────────────────────────────────────
// 5. TWO-GATE PROMOTION (k≥2 distinct AND posterior≥threshold, non-trading)
// ───────────────────────────────────────────────────────────────

export interface TwoGatePolicy {
  /** Minimum distinct attesters required (the k-floor). */
  readonly kMin: number;
  /** Posterior must reach this stop threshold. */
  readonly stopThreshold: number;
  /** Prior used for the reachability check. */
  readonly prior: BetaPrior;
  /** Ceiling on distinct attesters the substrate can ever collect. */
  readonly maxDistinctSources: number;
}

export interface TwoGateInput {
  readonly posterior: number;
  readonly distinctAttesters: number;
}

export type TwoGateReason =
  | 'two_gate_satisfied'
  | 'below_k_floor'
  | 'below_posterior_threshold'
  | 'policy_unreachable';

export interface TwoGateOutcome {
  readonly promote: boolean;
  readonly reason: TwoGateReason;
}

export interface ReachabilityVerdict {
  readonly reachable: boolean;
  readonly reason: 'reachable' | 'k_floor_exceeds_sources' | 'k_floor_below_one' | 'threshold_unreachable';
}

/**
 * A policy is unreachable when no admissible evidence could ever satisfy it:
 * the k-floor exceeds the sources that can exist, the k-floor is below one, or
 * even the maximum all-positive posterior from the available sources cannot
 * reach the stop threshold. Refusing such a policy is preferable to silently
 * never-promoting (which looks like "no signal yet" forever).
 */
export function validatePolicyReachability(policy: TwoGatePolicy): ReachabilityVerdict {
  if (policy.kMin < 1) {
    return { reachable: false, reason: 'k_floor_below_one' };
  }
  if (policy.kMin > policy.maxDistinctSources) {
    return { reachable: false, reason: 'k_floor_exceeds_sources' };
  }
  if (maxAchievablePosterior(policy.prior, policy.maxDistinctSources) < policy.stopThreshold) {
    return { reachable: false, reason: 'threshold_unreachable' };
  }
  return { reachable: true, reason: 'reachable' };
}

/**
 * Non-trading conjunction: BOTH the k-floor and the posterior threshold must be
 * met; neither compensates for the other. An unreachable policy is refused
 * (promote:false), leaving the lane at frozen defaults.
 */
export function evaluateTwoGate(input: TwoGateInput, policy: TwoGatePolicy): TwoGateOutcome {
  const reachability = validatePolicyReachability(policy);
  if (!reachability.reachable) {
    return { promote: false, reason: 'policy_unreachable' };
  }
  if (input.distinctAttesters < policy.kMin) {
    return { promote: false, reason: 'below_k_floor' };
  }
  if (input.posterior < policy.stopThreshold) {
    return { promote: false, reason: 'below_posterior_threshold' };
  }
  return { promote: true, reason: 'two_gate_satisfied' };
}

// ───────────────────────────────────────────────────────────────
// 6. HELD-OUT ATTESTATION (distinct-source corroboration)
// ───────────────────────────────────────────────────────────────

export interface Attestation {
  /** Distinct-source dimension (e.g. query-class / runtime / snapshot). */
  readonly sourceId: string;
  /** Who produced the signal — used by the distinct-author guard. */
  readonly producerId: string;
  readonly success: boolean;
}

export interface HeldOutInput {
  readonly attestations: readonly Attestation[];
  /** The producer whose reliability is under attestation. Its own votes are
   * dropped so it cannot vote up its own reliability. */
  readonly subjectProducerId: string;
  readonly kMin: number;
  readonly prior?: BetaPrior;
}

export interface HeldOutVerdict {
  readonly distinctSources: number;
  readonly successes: number;
  readonly failures: number;
  readonly posterior: number;
  readonly corroborated: boolean;
  readonly droppedSelfAttestations: number;
}

/**
 * Collapse attestations to one vote per distinct source (a source's vote is its
 * majority outcome; ties resolve to failure — the conservative direction), drop
 * any vote authored by the subject producer, then read a Beta posterior over the
 * surviving votes. Because the posterior is a bounded Beta mean, no count of
 * corroborating sources can push it to certainty. Order-independent: votes are
 * grouped by source id, not by arrival order.
 */
export function evaluateHeldOutAttestation(input: HeldOutInput): HeldOutVerdict {
  const prior = input.prior ?? NEUTRAL_PRIOR;
  let dropped = 0;
  const bySource = new Map<string, { success: number; failure: number }>();
  for (const attestation of input.attestations) {
    if (attestation.producerId === input.subjectProducerId) {
      dropped += 1;
      continue;
    }
    const tally = bySource.get(attestation.sourceId) ?? { success: 0, failure: 0 };
    if (attestation.success) tally.success += 1;
    else tally.failure += 1;
    bySource.set(attestation.sourceId, tally);
  }

  let successes = 0;
  let failures = 0;
  for (const tally of bySource.values()) {
    // One vote per source: the source's majority outcome, ties → failure.
    if (tally.success > tally.failure) successes += 1;
    else failures += 1;
  }

  const distinctSources = bySource.size;
  return {
    distinctSources,
    successes,
    failures,
    posterior: betaPosteriorMean(prior, { successes, failures }),
    corroborated: distinctSources >= input.kMin,
    droppedSelfAttestations: dropped,
  };
}

// ───────────────────────────────────────────────────────────────
// 7. CONTENT-ADDRESSED, ORDER-INDEPENDENT FOLD
// ───────────────────────────────────────────────────────────────

export interface ContentAddressedEvent {
  /** Stable content hash of the outcome-determining fields (NO timestamps). */
  readonly contentId: string;
  readonly successes: number;
  readonly failures: number;
}

export interface FoldResult {
  readonly evidence: BetaEvidence;
  /** Distinct events folded (deduped by contentId). */
  readonly distinctEvents: number;
}

/**
 * Deterministic content id for an event: a SHA-256 over its canonical, key-sorted
 * JSON. Two byte-identical payloads (a replay or a double-delivery) hash to the
 * same id and therefore fold exactly once.
 */
export function contentAddressEvent(canonical: unknown): string {
  return createHash('sha256').update(stableStringify(canonical)).digest('hex');
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
  return `{${entries.join(',')}}`;
}

/**
 * Fold content-addressed events into Beta evidence. Deduped by contentId and
 * summed, so the result is independent of arrival order and idempotent under
 * replay/double-delivery — addition commutes, the Set drops duplicates.
 */
export function foldContentAddressed(events: readonly ContentAddressedEvent[]): FoldResult {
  const seen = new Set<string>();
  let successes = 0;
  let failures = 0;
  for (const event of events) {
    if (seen.has(event.contentId)) continue;
    seen.add(event.contentId);
    successes += event.successes;
    failures += event.failures;
  }
  return { evidence: { successes, failures }, distinctEvents: seen.size };
}

// ───────────────────────────────────────────────────────────────
// 8. DECAY-DRIVEN UN-PROMOTION (reversible, audit-tagged, shadow-only)
// ───────────────────────────────────────────────────────────────

export type ShadowAuditTag =
  | 'promoted'
  | 'support_decayed'
  | 'support_lost'
  | 'frozen_default';

export interface DecayInput {
  readonly lane: ScorerLane;
  /** The lane's frozen default shadow weight (the revert target). */
  readonly defaultShadowWeight: number;
  /** The shadow weight a full promotion would apply. */
  readonly promotedShadowWeight: number;
  /** Current reliability posterior. */
  readonly posterior: number;
  /** Whether any evidence backs the current posterior (distinguishes a decayed
   * signal from a vanished one). */
  readonly hasEvidence: boolean;
  readonly promoteThreshold: number;
  readonly decayThreshold: number;
}

export interface ShadowLaneState {
  readonly lane: ScorerLane;
  readonly shadowWeight: number;
  readonly auditTag: ShadowAuditTag;
}

/**
 * Reversible promotion: support at/above the promote threshold (re-)promotes the
 * lane; support that decays below the decay threshold reverts it to the frozen
 * default. The audit tag keeps "support went bad" (`support_decayed` — evidence
 * present but posterior fell) distinct from "lost support" (`support_lost` — no
 * evidence at all). This never enables a live write: the revert target is the
 * default *shadow* weight, and the live channel is untouched.
 */
export function applyDecayUnpromotion(input: DecayInput): ShadowLaneState {
  if (input.posterior >= input.promoteThreshold) {
    return { lane: input.lane, shadowWeight: input.promotedShadowWeight, auditTag: 'promoted' };
  }
  if (input.posterior < input.decayThreshold) {
    return {
      lane: input.lane,
      shadowWeight: input.defaultShadowWeight,
      auditTag: input.hasEvidence ? 'support_decayed' : 'support_lost',
    };
  }
  // Between thresholds: hold the frozen default (no promotion earned yet).
  return { lane: input.lane, shadowWeight: input.defaultShadowWeight, auditTag: 'frozen_default' };
}
