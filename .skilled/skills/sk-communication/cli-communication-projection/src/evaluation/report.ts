// ───────────────────────────────────────────────────────────────────
// MODULE: Stratified Evaluation Release Report
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { assertNoRedactionCanaryLeak } from '../observability/redaction.js';
import { assertFrozenPreRegistration } from './preregistration.js';
import { resolveEvidenceClass } from './types.js';

import type { EvaluationDimensionName } from '../contracts/evidence.js';
import type { RuntimeId } from '../contracts/common.js';
import type { ObservabilityAggregate } from '../observability/aggregation.js';
import type { EvaluationFidelityVetoDecision } from './fidelity-veto.js';
import type {
  ReleaseGateDecision,
  StratumReleaseGateDecision,
} from './gate.js';
import type { DimensionNonInferiorityResult } from './noninferiority.js';
import type {
  FrozenPreRegistration,
  PresentationTier,
} from './preregistration.js';
import type { EvidenceClass } from './types.js';

/** Numeric operational evidence associated with exactly one release stratum. */
export interface StratumOperationalMetricsInput {
  readonly stratumId: string;
  readonly latencyMs: readonly number[];
  readonly providerCostUsd: number;
  readonly aggregate: ObservabilityAggregate;
}

/** Complete content-free inputs for one release report. */
export interface CreateReleaseReportInput {
  readonly preRegistration: FrozenPreRegistration;
  readonly gateDecisions: readonly ReleaseGateDecision[];
  readonly fidelityDecisions: readonly EvaluationFidelityVetoDecision[];
  readonly operationalMetrics: readonly StratumOperationalMetricsInput[];
}

/** Tier-specific approval that cannot borrow evidence from another tier. */
export interface ReleaseReportClaim {
  readonly presentationTier: PresentationTier;
  readonly evidenceClass: EvidenceClass;
  readonly isProvisional: boolean;
  readonly status: 'fail' | 'inconclusive' | 'pass';
  readonly reasonCode:
    | ReleaseGateDecision['reasonCode']
    | 'missing-gate-decision';
  readonly releaseApproved: boolean;
  readonly stratumCount: number;
}

/** Closed copy of one dimension decision used in the report digest. */
export interface ReleaseReportDimension {
  readonly dimension: EvaluationDimensionName;
  readonly evidenceClass: EvidenceClass;
  readonly status: DimensionNonInferiorityResult['status'];
  readonly reasonCode: DimensionNonInferiorityResult['reasonCode'];
  readonly sampleCount: number;
  readonly meanDifference: number | null;
  readonly standardDeviation: number | null;
  readonly standardError: number | null;
  readonly confidenceInterval: DimensionNonInferiorityResult['confidenceInterval'];
  readonly margin: number;
  readonly requiredSampleSize: number;
  readonly sampleCap: number;
  readonly releaseGatePass: boolean;
}

/** Deterministic fidelity summary that retains no candidate or protected data. */
export interface ReleaseReportFidelity {
  readonly decisionCount: number;
  readonly passedCount: number;
  readonly vetoedCount: number;
  readonly passRate: number;
  readonly passed: boolean;
  readonly checkCount: number;
}

/** Required operational measures for one independent release stratum. */
export interface ReleaseReportOperationalMetrics {
  readonly latencySampleCount: number;
  readonly p50LatencyMs: number;
  readonly p95LatencyMs: number;
  readonly providerCostUsd: number;
  readonly observabilityEventCount: number;
  readonly rejectionRate: number;
  readonly fallbackRate: number;
  readonly timeoutRate: number;
  readonly degradedRenderRate: number;
}

/** One provider-model, prompt-profile, runtime, and tier result. */
export interface ReleaseReportStratum {
  readonly stratumId: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly promptProfileId: string;
  readonly runtimeId: RuntimeId;
  readonly presentationTier: PresentationTier;
  readonly gate: {
    readonly evidenceClass: EvidenceClass;
    readonly isProvisional: boolean;
    readonly status: StratumReleaseGateDecision['status'];
    readonly reasonCode:
      | StratumReleaseGateDecision['reasonCode']
      | 'missing-stratum-decision';
    readonly fidelityPassed: boolean;
    readonly dimensions: readonly ReleaseReportDimension[];
  };
  readonly fidelity: ReleaseReportFidelity;
  readonly operationalMetrics: ReleaseReportOperationalMetrics;
}

/** Byte-reproducible content-free release artifact. */
export interface EvaluationReleaseReport {
  readonly reportVersion: 'evaluation-release-report/1.0.0';
  readonly preRegistrationDigest: string;
  readonly evidenceClass: EvidenceClass;
  readonly isProvisional: boolean;
  readonly claims: readonly ReleaseReportClaim[];
  readonly strata: readonly ReleaseReportStratum[];
  readonly reproducibilityDigest: string;
}

const PRESENTATION_TIERS: readonly PresentationTier[] = [
  'full-projection',
  'safe-native',
];

/** Combine closed statistical, fidelity, and operational evidence by stratum. */
export function createReleaseReport(
  input: CreateReleaseReportInput,
): EvaluationReleaseReport {
  assertFrozenPreRegistration(input.preRegistration);
  const gateByTier = indexGates(input.gateDecisions, input.preRegistration);
  const fidelityByStratum = indexFidelity(
    input.fidelityDecisions,
    input.preRegistration,
  );
  const operationalByStratum = indexOperationalMetrics(
    input.operationalMetrics,
    input.preRegistration,
  );
  const strata = [...input.preRegistration.strata]
    .sort((left, right) => compareText(stratumKey(left), stratumKey(right)))
    .map((stratum): ReleaseReportStratum => {
      const gate = gateByTier.get(stratum.presentationTier);
      const gateStratum = gate?.strata.find(
        (decision) => decision.stratumId === stratum.stratumId,
      );
      const operational = operationalByStratum.get(stratum.stratumId);
      if (operational === undefined) {
        throw new TypeError('Every report stratum requires operational metrics.');
      }
      const fidelity = summarizeFidelity(
        fidelityByStratum.get(stratum.stratumId) ?? [],
      );
      if (
        gateStratum !== undefined
        && gateStratum.fidelityPassed !== fidelity.passed
      ) {
        throw new TypeError('Gate and report fidelity decisions must agree.');
      }
      return {
        stratumId: stratum.stratumId,
        providerId: stratum.providerId,
        modelId: stratum.modelId,
        promptProfileId: stratum.promptProfileId,
        runtimeId: stratum.runtimeId,
        presentationTier: stratum.presentationTier,
        gate: gateStratum === undefined
          ? {
              evidenceClass: 'human',
              isProvisional: false,
              status: 'fail',
              reasonCode: 'missing-stratum-decision',
              fidelityPassed: false,
              dimensions: [],
            }
          : copyGateStratum(gateStratum),
        fidelity,
        operationalMetrics: createOperationalMetrics(operational),
      };
    });
  const claims: ReleaseReportClaim[] = PRESENTATION_TIERS.flatMap((presentationTier) => {
    const tierStrata = input.preRegistration.strata.filter(
      (stratum) => stratum.presentationTier === presentationTier,
    );
    if (tierStrata.length === 0) {
      return [];
    }
    const gate = gateByTier.get(presentationTier);
    return [{
      presentationTier,
      evidenceClass: gate?.evidenceClass ?? 'human',
      isProvisional: gate?.isProvisional ?? false,
      status: gate?.status ?? 'fail',
      reasonCode: gate?.reasonCode ?? 'missing-gate-decision',
      releaseApproved: gate?.releaseApproved ?? false,
      stratumCount: tierStrata.length,
    } satisfies ReleaseReportClaim];
  });
  const evidenceClass = resolveEvidenceClass(
    [...gateByTier.values()].map((gate) => gate.evidenceClass),
  );
  const base = {
    reportVersion: 'evaluation-release-report/1.0.0' as const,
    preRegistrationDigest: input.preRegistration.preRegistrationDigest,
    evidenceClass,
    isProvisional: evidenceClass === 'llm-proxy',
    claims,
    strata,
  };
  const report = {
    ...base,
    reproducibilityDigest: digest(base),
  };
  assertNoRedactionCanaryLeak(report);
  return deepFreeze(report);
}

function indexGates(
  decisions: readonly ReleaseGateDecision[],
  preRegistration: FrozenPreRegistration,
): ReadonlyMap<PresentationTier, ReleaseGateDecision> {
  const result = new Map<PresentationTier, ReleaseGateDecision>();
  for (const decision of decisions) {
    if (result.has(decision.claimTier)) {
      throw new TypeError('A report accepts at most one gate decision per presentation tier.');
    }
    const expectedIds = preRegistration.strata
      .filter((stratum) => stratum.presentationTier === decision.claimTier)
      .map((stratum) => stratum.stratumId)
      .sort(compareText);
    const actualIds = decision.strata
      .map((stratum) => {
        if (stratum.presentationTier !== decision.claimTier) {
          throw new TypeError('Gate strata cannot cross presentation tiers.');
        }
        const expectedProvisional = stratum.evidenceClass === 'llm-proxy';
        if (
          stratum.isProvisional !== expectedProvisional
          || stratum.dimensions.some(
            (dimension) => dimension.evidenceClass !== stratum.evidenceClass,
          )
        ) {
          throw new TypeError('Gate stratum provenance must be internally consistent.');
        }
        return stratum.stratumId;
      })
      .sort(compareText);
    const evidenceClass = resolveEvidenceClass(
      decision.strata.map((stratum) => stratum.evidenceClass),
    );
    if (
      expectedIds.length === 0
      || JSON.stringify(expectedIds) !== JSON.stringify(actualIds)
      || decision.releaseApproved !== (decision.status === 'pass')
      || decision.evidenceClass !== evidenceClass
      || decision.isProvisional !== (evidenceClass === 'llm-proxy')
    ) {
      throw new TypeError('Gate decision does not match its registered presentation tier.');
    }
    result.set(decision.claimTier, decision);
  }
  return result;
}

function indexFidelity(
  decisions: readonly EvaluationFidelityVetoDecision[],
  preRegistration: FrozenPreRegistration,
): ReadonlyMap<string, readonly EvaluationFidelityVetoDecision[]> {
  const assignments = new Map(
    preRegistration.reviewerAssignments.map((assignment) => [
      assignment.comparisonId,
      assignment.stratumId,
    ]),
  );
  const seenComparisons = new Set<string>();
  const result = new Map<string, EvaluationFidelityVetoDecision[]>();
  for (const decision of decisions) {
    const assignedStratumId = assignments.get(decision.comparisonId);
    const isConsistent = decision.status === 'passed'
      ? decision.absoluteVeto === false
      : decision.status === 'vetoed' && decision.absoluteVeto === true;
    if (
      decision.decisionVersion !== 'evaluation-fidelity-veto/1.0.0'
      || assignedStratumId !== decision.stratumId
      || seenComparisons.has(decision.comparisonId)
      || !isConsistent
      || !Number.isSafeInteger(decision.checkCount)
      || decision.checkCount < 0
    ) {
      throw new TypeError('Fidelity decisions must be unique and internally consistent.');
    }
    seenComparisons.add(decision.comparisonId);
    const stratumDecisions = result.get(decision.stratumId) ?? [];
    stratumDecisions.push(decision);
    result.set(decision.stratumId, stratumDecisions);
  }
  if (seenComparisons.size !== assignments.size) {
    throw new TypeError('Every frozen comparison requires one fidelity decision.');
  }
  return result;
}

function indexOperationalMetrics(
  inputs: readonly StratumOperationalMetricsInput[],
  preRegistration: FrozenPreRegistration,
): ReadonlyMap<string, StratumOperationalMetricsInput> {
  const registeredIds = new Set(
    preRegistration.strata.map((stratum) => stratum.stratumId),
  );
  const result = new Map<string, StratumOperationalMetricsInput>();
  for (const input of inputs) {
    if (!registeredIds.has(input.stratumId) || result.has(input.stratumId)) {
      throw new TypeError('Operational metrics must identify one registered stratum.');
    }
    validateOperationalMetrics(input);
    result.set(input.stratumId, input);
  }
  if (result.size !== registeredIds.size) {
    throw new TypeError('Every report stratum requires operational metrics.');
  }
  return result;
}

function validateOperationalMetrics(input: StratumOperationalMetricsInput): void {
  const rates = input.aggregate.rates;
  const operationalRates = [
    rates.rejected,
    rates.fallback,
    rates.timeout,
    rates.degraded,
  ];
  if (
    input.latencyMs.length === 0
    || input.latencyMs.some((value) => !Number.isFinite(value) || value < 0)
    || !Number.isFinite(input.providerCostUsd)
    || input.providerCostUsd < 0
    || !Number.isSafeInteger(input.aggregate.eventCount)
    || input.aggregate.eventCount < 0
    || operationalRates.some((value) => !Number.isFinite(value) || value < 0 || value > 1)
  ) {
    throw new RangeError('Operational metrics require finite non-negative values and rates.');
  }
}

function copyGateStratum(
  decision: StratumReleaseGateDecision,
): ReleaseReportStratum['gate'] {
  return {
    evidenceClass: decision.evidenceClass,
    isProvisional: decision.isProvisional,
    status: decision.status,
    reasonCode: decision.reasonCode,
    fidelityPassed: decision.fidelityPassed,
    dimensions: [...decision.dimensions]
      .sort((left, right) => compareText(left.dimension, right.dimension))
      .map(copyDimension),
  };
}

function copyDimension(
  decision: DimensionNonInferiorityResult,
): ReleaseReportDimension {
  return {
    dimension: decision.dimension,
    evidenceClass: decision.evidenceClass,
    status: decision.status,
    reasonCode: decision.reasonCode,
    sampleCount: decision.sampleCount,
    meanDifference: decision.meanDifference,
    standardDeviation: decision.standardDeviation,
    standardError: decision.standardError,
    confidenceInterval: decision.confidenceInterval === null
      ? null
      : {
          confidenceLevel: decision.confidenceInterval.confidenceLevel,
          lowerBound: decision.confidenceInterval.lowerBound,
          upperBound: decision.confidenceInterval.upperBound,
        },
    margin: decision.margin,
    requiredSampleSize: decision.requiredSampleSize,
    sampleCap: decision.sampleCap,
    releaseGatePass: decision.releaseGatePass,
  };
}

function summarizeFidelity(
  decisions: readonly EvaluationFidelityVetoDecision[],
): ReleaseReportFidelity {
  const passedCount = decisions.filter((decision) => decision.status === 'passed').length;
  const vetoedCount = decisions.length - passedCount;
  return {
    decisionCount: decisions.length,
    passedCount,
    vetoedCount,
    passRate: decisions.length === 0 ? 0 : round(passedCount / decisions.length),
    passed: decisions.length > 0 && vetoedCount === 0,
    checkCount: decisions.reduce((sum, decision) => sum + decision.checkCount, 0),
  };
}

function createOperationalMetrics(
  input: StratumOperationalMetricsInput,
): ReleaseReportOperationalMetrics {
  const sortedLatency = [...input.latencyMs].sort((left, right) => left - right);
  return {
    latencySampleCount: sortedLatency.length,
    p50LatencyMs: round(percentile(sortedLatency, 0.5)),
    p95LatencyMs: round(percentile(sortedLatency, 0.95)),
    providerCostUsd: round(input.providerCostUsd),
    observabilityEventCount: input.aggregate.eventCount,
    rejectionRate: round(input.aggregate.rates.rejected),
    fallbackRate: round(input.aggregate.rates.fallback),
    timeoutRate: round(input.aggregate.rates.timeout),
    degradedRenderRate: round(input.aggregate.rates.degraded),
  };
}

function percentile(sorted: readonly number[], quantile: number): number {
  const index = Math.max(0, Math.ceil(sorted.length * quantile) - 1);
  const value = sorted[index];
  if (value === undefined) {
    throw new RangeError('Latency samples cannot be empty.');
  }
  return value;
}

function digest(value: unknown): string {
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(value)));
}

function round(value: number): number {
  const rounded = Number(value.toFixed(6));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stratumKey(stratum: {
  readonly providerId: string;
  readonly modelId: string;
  readonly promptProfileId: string;
  readonly runtimeId: RuntimeId;
  readonly presentationTier: PresentationTier;
  readonly stratumId: string;
}): string {
  return JSON.stringify([
    stratum.providerId,
    stratum.modelId,
    stratum.promptProfileId,
    stratum.runtimeId,
    stratum.presentationTier,
    stratum.stratumId,
  ]);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
