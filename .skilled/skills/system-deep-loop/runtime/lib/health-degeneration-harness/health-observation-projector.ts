// ───────────────────────────────────────────────────────────────────
// MODULE: Health Observation Projector
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import { HealthPolicyRegistry } from './health-policy.js';
import { ModeHealthAdapterRegistry } from './health-adapters.js';
import {
  HealthAggregateStates,
  HealthHarnessError,
  HealthHarnessErrorCodes,
  HealthInputFields,
  HealthResponseActions,
  HealthSeverities,
  HealthSignalKinds,
} from './health-harness-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  BudgetPressureHealthObservation,
  HealthAggregate,
  HealthBoundaryInput,
  HealthDeduplicationRecord,
  HealthInputField,
  HealthObservation,
  HealthPolicy,
  HealthProjectionResult,
  HealthProjectionState,
  HealthResponseAction,
  HealthResponseRequest,
  HealthSeverity,
  HealthShadowResult,
  HealthSignal,
  HealthSignalKind,
  HealthSignalScope,
  HealthSourceProvenance,
  HealthValidationIssue,
  ModeHealthAdapterDefinition,
  ProgressHealthObservation,
  QualityHealthObservation,
  RegisteredModeHealthAdapter,
  SemanticConcentrationObservation,
} from './health-harness-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL CONTRACTS AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const HEALTH_OBSERVATION_PROJECTOR_VERSION = 'health-observation-projector-v2';

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const PRESSURE_KINDS = new Set([
  'retry',
  'cancellation',
  'lease',
  'denial',
  'reallocation',
]);
const SEVERITY_RANK: Readonly<Record<HealthSeverity, number>> = Object.freeze({
  info: 0,
  warning: 1,
  degraded: 2,
  critical: 3,
});

interface SignalCandidate {
  readonly kind: Exclude<HealthSignalKind, 'health_recovered'>;
  readonly severity: HealthSeverity;
  readonly evidence: JsonObject;
  readonly material: JsonObject;
  readonly decisionTrace: JsonObject[];
}

interface DetectionResult {
  readonly candidates: readonly SignalCandidate[];
  readonly hasQualifyingProgress: boolean;
  readonly hasRecoveryEvidence: boolean;
}

type ProvenancedInputField =
  | 'semanticConcentration'
  | 'progress'
  | 'frontier'
  | 'quality'
  | 'budgetPressure';

interface StateCore {
  readonly schemaVersion: 1;
  readonly projectorVersion: string;
  readonly policyVersion: string;
  readonly policyDigest: string;
  readonly observations: HealthObservation[];
  readonly signals: HealthSignal[];
  readonly requests: HealthResponseRequest[];
  readonly activeSignals: JsonObject;
  readonly deduplicationRecords: HealthDeduplicationRecord[];
  readonly lastLedgerCursor: HealthProjectionState['lastLedgerCursor'];
  readonly healthyWindowStreaks: JsonObject;
}

const RECOVERY_INPUT_FIELDS: Readonly<
  Partial<Record<HealthSignalKind, readonly HealthInputField[]>>
> = Object.freeze({
  [HealthSignalKinds.MODE_COLLAPSE]: [
    HealthInputFields.SEMANTIC_CONCENTRATION,
    HealthInputFields.PROGRESS,
  ],
  [HealthSignalKinds.REPETITION]: [HealthInputFields.CYCLE_EVENT],
  [HealthSignalKinds.NOVELTY_STARVATION]: [
    HealthInputFields.FRONTIER,
    HealthInputFields.PROGRESS,
  ],
  [HealthSignalKinds.QUALITY_DECAY]: [HealthInputFields.QUALITY],
  [HealthSignalKinds.BUDGET_THRASH]: [HealthInputFields.BUDGET_PRESSURE],
});

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL HELPERS
// ───────────────────────────────────────────────────────────────────

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function bounded<T>(values: readonly T[], maximum: number): T[] {
  return values.slice(Math.max(0, values.length - maximum));
}

function finalizeState(core: StateCore): HealthProjectionState {
  const projectionHash = digest(core);
  return Object.freeze(cloneJson({ ...core, projectionHash } as HealthProjectionState));
}

function signalScope(input: HealthBoundaryInput): HealthSignalScope {
  return Object.freeze({
    runId: input.runId,
    modeId: input.modeId,
    lineageId: input.lineageId,
    regionId: input.regionId,
  });
}

function healthScopeKey(scope: HealthSignalScope): string {
  return [scope.runId, scope.modeId, scope.lineageId, scope.regionId ?? ''].join('\u0000');
}

function activeSignalKey(kind: HealthSignalKind, scope: HealthSignalScope): string {
  return [kind, healthScopeKey(scope)].join('\u0000');
}

function sameHealthScope(
  left: HealthSignalScope,
  right: HealthSignalScope,
): boolean {
  return left.runId === right.runId
    && left.modeId === right.modeId
    && left.lineageId === right.lineageId
    && left.regionId === right.regionId;
}

function observationsForScope(
  observations: readonly HealthObservation[],
  scope: HealthSignalScope,
): HealthObservation[] {
  return observations.filter((observation) => sameHealthScope(observation, scope));
}

function activeSignalValuesForScope(
  activeSignals: JsonObject,
  scope: HealthSignalScope,
): HealthSignal[] {
  return (Object.values(activeSignals) as unknown as HealthSignal[])
    .filter((signal) => sameHealthScope(signal.scope, scope));
}

function healthyWindowStreakForScope(
  healthyWindowStreaks: JsonObject,
  scope: HealthSignalScope,
): number {
  const value = healthyWindowStreaks[healthScopeKey(scope)];
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value
    : 0;
}

function identity(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 4_096) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.INVALID_INPUT,
      `${field} must be a bounded non-empty identity`,
      { field },
    );
  }
  return value;
}

function issue(code: string, field: string, message: string): HealthValidationIssue {
  return Object.freeze({ code, field, message });
}

function compareCodePoints(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

// ───────────────────────────────────────────────────────────────────
// 3. INPUT COHERENCE
// ───────────────────────────────────────────────────────────────────

function provenanceOf(
  input: HealthBoundaryInput,
  field: ProvenancedInputField,
): HealthSourceProvenance | null {
  switch (field) {
    case 'semanticConcentration':
      return input.inputs.semanticConcentration?.provenance ?? null;
    case 'progress':
      return input.inputs.progress?.provenance ?? null;
    case 'frontier':
      return input.inputs.frontier?.provenance ?? null;
    case 'quality':
      return input.inputs.quality?.provenance ?? null;
    case 'budgetPressure':
      return input.inputs.budgetPressure?.provenance ?? null;
  }
}

function inputValue(
  input: HealthBoundaryInput,
  field: keyof HealthBoundaryInput['inputs'],
): JsonValue | null {
  return input.inputs[field] ?? null;
}

function validateProjectionBinding(
  input: HealthBoundaryInput,
  adapter: RegisteredModeHealthAdapter,
  issues: HealthValidationIssue[],
): void {
  const watermark = input.projectionWatermark;
  const expected = adapter.projection;
  const comparisons: readonly [string, unknown, unknown][] = [
    ['bundleId', watermark.bundleId, expected.bundleId],
    ['bundleVersion', watermark.bundleVersion, expected.bundleVersion],
    ['bundleDigest', watermark.bundleDigest, expected.bundleDigest],
    ['reducerDigest', watermark.reducerDigest, expected.reducerDigest],
    ['configurationDigest', watermark.configurationDigest, expected.configurationDigest],
    ['eventRegistryDigest', watermark.eventRegistryDigest, expected.eventRegistryDigest],
  ];
  for (const [field, actual, wanted] of comparisons) {
    if (actual !== wanted) {
      issues.push(issue(
        'UNSUPPORTED_PROJECTION_VERSION',
        `projectionWatermark.${field}`,
        'Projection identity is not registered by the active mode adapter',
      ));
    }
  }
  if (
    watermark.ledgerId !== input.ledgerCursor.ledgerId
    || watermark.sequence !== input.ledgerCursor.sequence
    || watermark.recordHash !== input.ledgerCursor.recordHash
  ) {
    issues.push(issue(
      'STALE_PROJECTION_WATERMARK',
      'projectionWatermark',
      'Projection watermark does not match the observed ledger boundary',
    ));
  }
}

function validateAdapterFields(
  input: HealthBoundaryInput,
  adapter: RegisteredModeHealthAdapter,
  issues: HealthValidationIssue[],
): void {
  for (const field of Object.values(HealthInputFields)) {
    const availability = adapter.fields[field];
    const value = inputValue(input, field);
    if (availability === 'required' && value === null) {
      issues.push(issue('MISSING_REQUIRED_GAUGE', `inputs.${field}`, 'Required input is absent'));
      continue;
    }
    if (availability === 'unavailable' && value !== null) {
      issues.push(issue(
        'UNDECLARED_ADAPTER_FIELD',
        `inputs.${field}`,
        'Adapter supplied a field declared unavailable',
      ));
      continue;
    }
    if (value === null) continue;
    const acceptedVersions = adapter.sourceVersions[field] ?? [];
    const acceptedReducerDigests = adapter.sourceReducerDigests[field] ?? [];
    const sourceVersion = field === HealthInputFields.CYCLE_EVENT
      ? input.inputs.cycleEvent?.detector_policy_version ?? ''
      : provenanceOf(
          input,
          field as ProvenancedInputField,
        )?.sourceVersion ?? '';
    if (!acceptedVersions.includes(sourceVersion)) {
      issues.push(issue(
        'UNSUPPORTED_SOURCE_VERSION',
        `inputs.${field}`,
        'Input source version is not registered by the active mode adapter',
      ));
    }
    const sourceReducerDigest = field === HealthInputFields.CYCLE_EVENT
      ? input.inputs.cycleEvent?.detector_policy_digest ?? ''
      : provenanceOf(input, field as ProvenancedInputField)?.reducerDigest ?? '';
    if (!acceptedReducerDigests.includes(sourceReducerDigest)) {
      issues.push(issue(
        'UNSUPPORTED_SOURCE_REDUCER',
        `inputs.${field}`,
        'Input reducer or detector-policy digest is not registered by the active mode adapter',
      ));
    }
    if (field !== HealthInputFields.CYCLE_EVENT) {
      const source = provenanceOf(
        input,
        field as ProvenancedInputField,
      );
      if (
        source !== null
        && (
          source.watermarkSequence !== input.projectionWatermark.sequence
          || source.watermarkRecordHash !== input.projectionWatermark.recordHash
        )
      ) {
        issues.push(issue(
          'MIXED_SOURCE_WATERMARK',
          `inputs.${field}.provenance`,
          'Input gauge was not read at the committed projection watermark',
        ));
      }
    }
  }
}

function validateBoundary(
  state: HealthProjectionState,
  input: HealthBoundaryInput,
  adapter: RegisteredModeHealthAdapter,
): HealthValidationIssue[] {
  identity(input.runId, 'runId');
  identity(input.modeId, 'modeId');
  identity(input.lineageId, 'lineageId');
  identity(input.completedAttemptId, 'completedAttemptId');
  if (input.regionId !== null) identity(input.regionId, 'regionId');
  if (
    !Number.isSafeInteger(input.ledgerCursor.sequence)
    || input.ledgerCursor.sequence < 1
    || !HASH_PATTERN.test(input.ledgerCursor.recordHash)
    || !HASH_PATTERN.test(input.ledgerCursor.eventHash)
  ) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.INVALID_INPUT,
      'Ledger cursor is malformed',
    );
  }
  if (state.lastLedgerCursor !== null) {
    if (
      input.ledgerCursor.ledgerId !== state.lastLedgerCursor.ledgerId
      || input.ledgerCursor.sequence <= state.lastLedgerCursor.sequence
    ) {
      throw new HealthHarnessError(
        HealthHarnessErrorCodes.NON_MONOTONIC_CURSOR,
        'Health observation cursors must advance monotonically on one ledger',
        {
          priorSequence: state.lastLedgerCursor.sequence,
          nextSequence: input.ledgerCursor.sequence,
        },
      );
    }
  }
  const issues: HealthValidationIssue[] = [];
  if (
    state.lastLedgerCursor !== null
    && input.ledgerCursor.sequence !== state.lastLedgerCursor.sequence + 1
  ) {
    issues.push(issue(
      'SEQUENCE_GAP',
      'ledgerCursor.sequence',
      'Health boundary sequence skipped one or more committed boundaries',
    ));
  }
  if (input.adapterDigest !== adapter.adapterDigest) {
    issues.push(issue(
      'ADAPTER_DIGEST_MISMATCH',
      'adapterDigest',
      'Adapter identity is bound to different canonical bytes',
    ));
  }
  if (!HASH_PATTERN.test(input.replayFingerprintDigest)) {
    issues.push(issue(
      'REPLAY_FINGERPRINT_INVALID',
      'replayFingerprintDigest',
      'Replay fingerprint digest is missing or malformed',
    ));
  }
  for (const [name, sourceDigest] of Object.entries(input.sourceDigests)) {
    if (name.trim() === '' || !HASH_PATTERN.test(sourceDigest)) {
      issues.push(issue(
        'SOURCE_DIGEST_INVALID',
        `sourceDigests.${name}`,
        'Source digest is missing or malformed',
      ));
    }
  }
  validateProjectionBinding(input, adapter, issues);
  validateAdapterFields(input, adapter, issues);
  const quality = input.inputs.quality;
  if (quality !== null && quality.validThroughSequence < input.ledgerCursor.sequence) {
    issues.push(issue(
      'STALE_QUALITY_EVIDENCE',
      'inputs.quality.validThroughSequence',
      'Quality evidence expired before this observation boundary',
    ));
  }
  const cycle = input.inputs.cycleEvent;
  if (
    cycle !== null
    && (
      cycle.start_cursor.sequence > cycle.end_cursor.sequence
      || !HASH_PATTERN.test(cycle.start_cursor.record_hash)
      || !HASH_PATTERN.test(cycle.end_cursor.record_hash)
      || !HASH_PATTERN.test(cycle.evidence_digest)
    )
  ) {
    issues.push(issue(
      'CYCLE_EVENT_INVALID',
      'inputs.cycleEvent',
      'Sibling cycle event failed its preserved cursor or digest contract',
    ));
  }
  return issues;
}

function boundaryId(input: HealthBoundaryInput, policy: HealthPolicy): string {
  return `health-boundary-${digest({
    runId: input.runId,
    modeId: input.modeId,
    lineageId: input.lineageId,
    completedAttemptId: input.completedAttemptId,
    ledgerId: input.ledgerCursor.ledgerId,
    ledgerSequence: input.ledgerCursor.sequence,
    policyVersion: policy.policyVersion,
    adapterDigest: input.adapterDigest,
  })}`;
}

function inputDigest(input: HealthBoundaryInput): string {
  return digest({
    ...input,
    sourceEventIds: [...input.sourceEventIds].sort(compareCodePoints),
    sourceDigests: Object.fromEntries(
      Object.entries(input.sourceDigests).sort(([left], [right]) => compareCodePoints(left, right)),
    ),
  });
}

function createObservation(
  input: HealthBoundaryInput,
  policy: HealthPolicy,
  issues: readonly HealthValidationIssue[],
): HealthObservation {
  const normalizedSourceEventIds = [...new Set(input.sourceEventIds.map((eventId) => (
    identity(eventId, 'sourceEventIds')
  )))].sort(compareCodePoints);
  const normalizedSourceDigests = Object.fromEntries(
    Object.entries(input.sourceDigests).sort(([left], [right]) => compareCodePoints(left, right)),
  ) as JsonObject;
  const digestOfInput = inputDigest(input);
  const core = {
    schemaVersion: 1 as const,
    projectorVersion: HEALTH_OBSERVATION_PROJECTOR_VERSION,
    boundaryId: boundaryId(input, policy),
    runId: input.runId,
    modeId: input.modeId,
    lineageId: input.lineageId,
    regionId: input.regionId,
    completedAttemptId: input.completedAttemptId,
    ledgerCursor: input.ledgerCursor,
    projectionWatermark: input.projectionWatermark,
    sourceEventIds: normalizedSourceEventIds,
    sourceDigests: normalizedSourceDigests,
    adapterId: input.adapterId,
    adapterVersion: input.adapterVersion,
    adapterDigest: input.adapterDigest,
    policyVersion: policy.policyVersion,
    policyDigest: policy.policyDigest,
    replayFingerprintDigest: input.replayFingerprintDigest,
    inputDigest: digestOfInput,
    inputs: input.inputs,
    coherent: issues.length === 0,
    validationIssues: [...issues],
  };
  const observationHash = digest(core);
  return Object.freeze(cloneJson({
    ...core,
    observationId: `health-observation-${observationHash}`,
    observationHash,
  }));
}

// ───────────────────────────────────────────────────────────────────
// 4. DETECTORS
// ───────────────────────────────────────────────────────────────────

function progressFloorViolated(
  progress: ProgressHealthObservation,
  policy: HealthPolicy,
): boolean {
  return progress.noveltyYieldBps < policy.collapseProgressFloorBps
    && progress.independentEvidenceYieldBps < policy.independentEvidenceFloorBps
    && progress.coverageGainBps < policy.coverageProgressFloorBps
    && progress.claimProgressCount === 0
    && progress.qualifyingEvidenceIds.length === 0;
}

function qualifyingProgress(
  progress: ProgressHealthObservation | null,
  policy: HealthPolicy,
): boolean {
  if (progress === null) return false;
  return !progressFloorViolated(progress, policy);
}

function telemetryCandidate(observation: HealthObservation): SignalCandidate {
  const material = {
    issueCodes: observation.validationIssues.map((entry) => entry.code).sort(compareCodePoints),
  };
  return {
    kind: HealthSignalKinds.TELEMETRY_GAP,
    severity: HealthSeverities.CRITICAL,
    material,
    evidence: {
      ledgerCursor: observation.ledgerCursor,
      projectionWatermark: observation.projectionWatermark,
      validationIssues: observation.validationIssues,
    },
    decisionTrace: [{
      detector: 'coherence_gate',
      passed: false,
      issueCount: observation.validationIssues.length,
    }],
  };
}

function notEvaluableCandidate(reason: string, evidence: JsonObject): SignalCandidate {
  return {
    kind: HealthSignalKinds.NOT_EVALUABLE,
    severity: HealthSeverities.WARNING,
    material: { reason, ...evidence },
    evidence: { reason, ...evidence },
    decisionTrace: [{ detector: 'evaluability_gate', passed: false, reason }],
  };
}

function collapseCandidate(
  window: readonly HealthObservation[],
  policy: HealthPolicy,
): SignalCandidate | null {
  const comparable: Array<{
    readonly observation: HealthObservation;
    readonly semantic: SemanticConcentrationObservation;
    readonly progress: ProgressHealthObservation;
  }> = [];
  for (const observation of window) {
    const semantic = observation.inputs.semanticConcentration;
    const progress = observation.inputs.progress;
    if (observation.coherent && semantic !== null && progress !== null) {
      comparable.push({ observation, semantic, progress });
    }
  }
  if (comparable.length < policy.minimumComparableSamples) return null;
  const grouped = new Map<string, typeof comparable>();
  for (const sample of comparable) {
    const { semantic } = sample;
    const key = `${semantic.identityKind}\u0000${semantic.identity}`;
    grouped.set(key, [...(grouped.get(key) ?? []), sample]);
  }
  const dominant = [...grouped.entries()].sort((left, right) => (
    right[1].length - left[1].length || compareCodePoints(left[0], right[0])
  ))[0];
  if (!dominant || dominant[1].length < policy.collapseConcentrationCount) return null;
  const lowProgress = dominant[1].filter((sample) => (
    progressFloorViolated(sample.progress, policy)
  ));
  if (lowProgress.length < policy.collapseConcentrationCount) return null;
  const [identityKey, concentrated] = dominant;
  const material = {
    identityKey,
    concentrationCount: concentrated.length,
    lowProgressCount: lowProgress.length,
    windowSize: window.length,
    concentrationThreshold: policy.collapseConcentrationCount,
    noveltyFloorBps: policy.collapseProgressFloorBps,
    independentEvidenceFloorBps: policy.independentEvidenceFloorBps,
    coverageFloorBps: policy.coverageProgressFloorBps,
  };
  return {
    kind: HealthSignalKinds.MODE_COLLAPSE,
    severity: HealthSeverities.DEGRADED,
    material,
    evidence: {
      ...material,
      observationIds: concentrated.map((sample) => sample.observation.observationId),
      textSimilarityIgnored: true,
    },
    decisionTrace: [
      {
        detector: 'typed_concentration',
        value: concentrated.length,
        threshold: policy.collapseConcentrationCount,
        passed: true,
      },
      {
        detector: 'multi_channel_progress_floor',
        value: lowProgress.length,
        threshold: policy.collapseConcentrationCount,
        passed: true,
      },
    ],
  };
}

function noveltyCandidate(
  window: readonly HealthObservation[],
  policy: HealthPolicy,
): SignalCandidate | null {
  const eligible: Array<{
    readonly observation: HealthObservation;
    readonly frontierRef: string;
    readonly progress: ProgressHealthObservation;
  }> = [];
  for (const observation of window) {
    const frontier = observation.inputs.frontier;
    const progress = observation.inputs.progress;
    if (
      observation.coherent
      && frontier?.status === 'eligible'
      && frontier.frontierRef !== null
      && progress !== null
    ) {
      eligible.push({ observation, frontierRef: frontier.frontierRef, progress });
    }
  }
  const lowYield = eligible.filter((sample) => (
    sample.progress.independentEvidenceYieldBps
      < policy.independentEvidenceFloorBps
  ));
  if (lowYield.length < policy.noveltyLowYieldCount) return null;
  const material = {
    eligibleAttemptCount: eligible.length,
    lowYieldCount: lowYield.length,
    lowYieldThreshold: policy.noveltyLowYieldCount,
    independentEvidenceFloorBps: policy.independentEvidenceFloorBps,
  };
  return {
    kind: HealthSignalKinds.NOVELTY_STARVATION,
    severity: HealthSeverities.DEGRADED,
    material,
    evidence: {
      ...material,
      observationIds: lowYield.map((sample) => sample.observation.observationId),
      frontierRefs: [...new Set(lowYield.map((sample) => sample.frontierRef))]
        .sort(compareCodePoints),
    },
    decisionTrace: [{
      detector: 'eligible_low_independent_evidence',
      value: lowYield.length,
      threshold: policy.noveltyLowYieldCount,
      passed: true,
    }],
  };
}

function qualityComparisonKey(quality: QualityHealthObservation): string {
  return [
    quality.baselineId,
    quality.baselineLowerConfidenceBoundBps,
    quality.evaluatorDigest,
    quality.rubricDigest,
    quality.verifierDigest,
    quality.calibrationDigest,
    quality.provenance.sourceVersion,
  ].join('\u0000');
}

function qualityCandidates(
  observations: readonly HealthObservation[],
  policy: HealthPolicy,
): readonly SignalCandidate[] {
  const withQuality: Array<{
    readonly observation: HealthObservation;
    readonly quality: QualityHealthObservation;
  }> = [];
  for (const observation of observations) {
    const quality = observation.inputs.quality;
    if (quality !== null) withQuality.push({ observation, quality });
  }
  if (withQuality.length < policy.qualityComparableSamples) return [];
  const recent = withQuality.slice(-policy.qualityComparableSamples);
  const qualities = recent.map((sample) => sample.quality);
  const keys = new Set(qualities.map(qualityComparisonKey));
  if (keys.size !== 1) {
    return [notEvaluableCandidate('quality_incomparable', {
      comparisonKeys: [...keys].sort(compareCodePoints).map((key) => digest(key)),
      sampleCount: qualities.length,
    })];
  }
  const isNonIncreasing = qualities.every((quality, index) => (
    index === 0
    || quality.lowerConfidenceBoundBps <= qualities[index - 1].lowerConfidenceBoundBps
  ));
  const declines = qualities.map((quality) => (
    quality.baselineLowerConfidenceBoundBps - quality.lowerConfidenceBoundBps
  ));
  if (!isNonIncreasing || !declines.every((decline) => decline >= policy.qualityDecayDeltaBps)) {
    return [];
  }
  const material = {
    comparisonKeyDigest: digest(qualityComparisonKey(qualities[0])),
    sampleCount: qualities.length,
    requiredSamples: policy.qualityComparableSamples,
    declinesBps: declines,
    decayThresholdBps: policy.qualityDecayDeltaBps,
  };
  return [{
    kind: HealthSignalKinds.QUALITY_DECAY,
    severity: HealthSeverities.DEGRADED,
    material,
    evidence: {
      ...material,
      observationIds: recent.map((sample) => sample.observation.observationId),
      candidateRefs: qualities.map((quality) => quality.candidateRef),
      provenance: {
        baselineId: qualities[0].baselineId,
        evaluatorDigest: qualities[0].evaluatorDigest,
        rubricDigest: qualities[0].rubricDigest,
        verifierDigest: qualities[0].verifierDigest,
        calibrationDigest: qualities[0].calibrationDigest,
      },
    },
    decisionTrace: [{
      detector: 'calibrated_quality_decline',
      value: Math.min(...declines),
      threshold: policy.qualityDecayDeltaBps,
      passed: true,
    }],
  }];
}

function budgetCandidate(
  observations: readonly HealthObservation[],
  policy: HealthPolicy,
): SignalCandidate | null {
  const current = observations.at(-1)?.inputs.budgetPressure ?? null;
  if (current === null || current.exhausted) return null;
  const matchingDecisions: BudgetPressureHealthObservation[] = [];
  for (const observation of observations) {
    const budgetPressure = observation.inputs.budgetPressure;
    if (budgetPressure?.dimension === current.dimension) {
      matchingDecisions.push(budgetPressure);
    }
  }
  const decisions = matchingDecisions.slice(-policy.budgetDecisionWindow);
  const pressure = decisions.filter((entry) => PRESSURE_KINDS.has(entry.pressureKind));
  if (decisions.length === 0 || pressure.length === 0) return null;
  const pressureRatioBps = Math.floor((pressure.length * 10_000) / decisions.length);
  const pressureQualified = pressure.length >= policy.budgetPressureCount
    || (
      decisions.length >= policy.minimumComparableSamples
      && pressureRatioBps >= policy.budgetPressureRatioBps
    );
  const meanEvidenceYieldBps = Math.floor(
    pressure.reduce((sum, entry) => sum + entry.evidenceYieldBps, 0) / pressure.length,
  );
  if (!pressureQualified || meanEvidenceYieldBps >= policy.budgetEvidenceYieldFloorBps) {
    return null;
  }
  const countsByKind = Object.fromEntries(
    [...PRESSURE_KINDS].sort(compareCodePoints).map((kind) => [
      kind,
      pressure.filter((entry) => entry.pressureKind === kind).length,
    ]),
  ) as JsonObject;
  const material = {
    dimension: current.dimension,
    decisionCount: decisions.length,
    pressureCount: pressure.length,
    pressureRatioBps,
    meanEvidenceYieldBps,
    pressureCountThreshold: policy.budgetPressureCount,
    pressureRatioThresholdBps: policy.budgetPressureRatioBps,
    evidenceYieldFloorBps: policy.budgetEvidenceYieldFloorBps,
    countsByKind,
  };
  return {
    kind: HealthSignalKinds.BUDGET_THRASH,
    severity: HealthSeverities.DEGRADED,
    material,
    evidence: {
      ...material,
      decisionIds: pressure.map((entry) => entry.decisionId),
      receiptDigests: pressure.map((entry) => entry.receiptDigest),
      sourceEventTypes: pressure.map((entry) => entry.sourceEventType),
    },
    decisionTrace: [
      {
        detector: 'typed_budget_pressure',
        count: pressure.length,
        ratioBps: pressureRatioBps,
        passed: pressureQualified,
      },
      {
        detector: 'settled_evidence_yield',
        value: meanEvidenceYieldBps,
        threshold: policy.budgetEvidenceYieldFloorBps,
        passed: true,
      },
    ],
  };
}

function repetitionCandidate(observation: HealthObservation): SignalCandidate | null {
  const cycle = observation.inputs.cycleEvent;
  if (cycle === null || cycle.health_state === 'cycle_cleared') return null;
  const material = {
    cycleHealthEventId: cycle.health_event_id,
    healthState: cycle.health_state,
    detectorPolicyVersion: cycle.detector_policy_version,
    signatureKind: cycle.signature_kind,
    period: cycle.period,
    occurrenceCount: cycle.occurrence_count,
    startCursor: cycle.start_cursor,
    endCursor: cycle.end_cursor,
    progressVerdict: cycle.progress_assessment.verdict,
    sourceFingerprints: cycle.source_fingerprints,
  };
  return {
    kind: HealthSignalKinds.REPETITION,
    severity: cycle.health_state === 'cycle_confirmed'
      ? HealthSeverities.DEGRADED
      : HealthSeverities.WARNING,
    material,
    evidence: {
      cycleEvent: cycle,
      consumedVerbatim: true,
      independentDetectionPerformed: false,
    },
    decisionTrace: [{
      detector: 'sibling_cycle_event_ingestion',
      state: cycle.health_state,
      passed: true,
    }],
  };
}

function absentOptionalRecoveryCandidate(
  observation: HealthObservation,
  adapter: RegisteredModeHealthAdapter,
  activeSignals: readonly HealthSignal[],
): SignalCandidate | null {
  const missingOptionalFields = new Set<HealthInputField>();
  const affectedSignalKinds = new Set<HealthSignalKind>();
  for (const signal of activeSignals) {
    for (const field of RECOVERY_INPUT_FIELDS[signal.kind] ?? []) {
      if (adapter.fields[field] === 'optional' && observation.inputs[field] === null) {
        missingOptionalFields.add(field);
        affectedSignalKinds.add(signal.kind);
      }
    }
  }
  if (missingOptionalFields.size === 0) return null;
  return notEvaluableCandidate('active_signal_optional_field_absent', {
    missingOptionalFields: [...missingOptionalFields].sort(compareCodePoints),
    affectedSignalKinds: [...affectedSignalKinds].sort(compareCodePoints),
  });
}

function hasSignalRecoveryEvidence(
  signal: HealthSignal,
  observation: HealthObservation,
  policy: HealthPolicy,
): boolean {
  switch (signal.kind) {
    case HealthSignalKinds.MODE_COLLAPSE:
      return observation.inputs.semanticConcentration !== null
        && qualifyingProgress(observation.inputs.progress, policy);
    case HealthSignalKinds.REPETITION:
      return observation.inputs.cycleEvent?.health_state === 'cycle_cleared'
        && observation.inputs.cycleEvent.progress_assessment.verdict === 'progress';
    case HealthSignalKinds.NOVELTY_STARVATION:
      return observation.inputs.frontier?.status === 'eligible'
        && observation.inputs.progress !== null
        && observation.inputs.progress.independentEvidenceYieldBps
          >= policy.independentEvidenceFloorBps;
    case HealthSignalKinds.QUALITY_DECAY: {
      const priorQuality = signal.inputGauges.quality;
      const currentQuality = observation.inputs.quality;
      return priorQuality !== null
        && currentQuality !== null
        && qualityComparisonKey(priorQuality) === qualityComparisonKey(currentQuality)
        && currentQuality.lowerConfidenceBoundBps > priorQuality.lowerConfidenceBoundBps;
    }
    case HealthSignalKinds.BUDGET_THRASH: {
      const priorBudget = signal.inputGauges.budgetPressure;
      const currentBudget = observation.inputs.budgetPressure;
      return priorBudget !== null
        && currentBudget !== null
        && currentBudget.dimension === priorBudget.dimension
        && !currentBudget.exhausted
        && !PRESSURE_KINDS.has(currentBudget.pressureKind)
        && currentBudget.evidenceYieldBps >= policy.budgetEvidenceYieldFloorBps;
    }
    case HealthSignalKinds.TELEMETRY_GAP:
      return observation.coherent;
    case HealthSignalKinds.NOT_EVALUABLE:
      return true;
    case HealthSignalKinds.HEALTH_RECOVERED:
      return false;
  }
}

function detect(
  observations: readonly HealthObservation[],
  policy: HealthPolicy,
  adapter: RegisteredModeHealthAdapter,
  activeSignals: readonly HealthSignal[],
): DetectionResult {
  const current = observations.at(-1);
  if (current === undefined) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.PROJECTION_CORRUPT,
      'Health detection requires at least one observation',
    );
  }
  if (!current.coherent) {
    return {
      candidates: [telemetryCandidate(current)],
      hasQualifyingProgress: false,
      hasRecoveryEvidence: false,
    };
  }
  const candidates: SignalCandidate[] = [];
  const absentOptional = absentOptionalRecoveryCandidate(current, adapter, activeSignals);
  if (absentOptional !== null) candidates.push(absentOptional);
  const currentFrontier = current.inputs.frontier;
  if (observations.length < policy.minimumComparableSamples) {
    candidates.push(notEvaluableCandidate('insufficient_samples', {
      sampleCount: observations.length,
      minimumSamples: policy.minimumComparableSamples,
    }));
  }
  if (currentFrontier !== null && currentFrontier.status !== 'eligible') {
    candidates.push(notEvaluableCandidate('frontier_not_eligible', {
      frontierStatus: currentFrontier.status,
      frontierRef: currentFrontier.frontierRef,
    }));
  }
  const observationWindow = observations.slice(-policy.observationWindow);
  const collapse = collapseCandidate(observationWindow, policy);
  if (collapse !== null) candidates.push(collapse);
  if (currentFrontier?.status === 'eligible') {
    const novelty = noveltyCandidate(observations.slice(-policy.noveltyWindow), policy);
    if (novelty !== null) candidates.push(novelty);
  }
  candidates.push(...qualityCandidates(observations, policy));
  const budget = budgetCandidate(observations, policy);
  if (budget !== null) candidates.push(budget);
  const repetition = repetitionCandidate(current);
  if (repetition !== null) candidates.push(repetition);
  return {
    candidates: candidates.sort((left, right) => compareCodePoints(left.kind, right.kind)),
    hasQualifyingProgress: qualifyingProgress(current.inputs.progress, policy),
    hasRecoveryEvidence: activeSignals.every((signal) => (
      hasSignalRecoveryEvidence(signal, current, policy)
    )),
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. SIGNALS, AGGREGATES, AND REQUESTS
// ───────────────────────────────────────────────────────────────────

function createSignal(
  candidate: SignalCandidate,
  observation: HealthObservation,
  scope: HealthSignalScope,
  prior: HealthSignal | null,
): HealthSignal {
  const materialEvidenceDigest = digest(candidate.material);
  const core = {
    schemaVersion: 1 as const,
    kind: candidate.kind,
    severity: candidate.severity,
    status: 'active' as const,
    scope,
    observationId: observation.observationId,
    observationHash: observation.observationHash,
    ledgerCursor: observation.ledgerCursor,
    projectionWatermark: observation.projectionWatermark,
    sourceEventIds: observation.sourceEventIds,
    inputDigest: observation.inputDigest,
    replayFingerprintDigest: observation.replayFingerprintDigest,
    inputGauges: observation.inputs,
    policyVersion: observation.policyVersion,
    policyDigest: observation.policyDigest,
    adapterDigest: observation.adapterDigest,
    priorActiveSignalId: prior?.signalId ?? null,
    materialEvidenceDigest,
    evidence: candidate.evidence,
    decisionTrace: candidate.decisionTrace,
  };
  return Object.freeze(cloneJson({
    ...core,
    signalId: `health-signal-${digest(core)}`,
  }));
}

function recoverySignal(
  observation: HealthObservation,
  scope: HealthSignalScope,
  clearedSignals: readonly HealthSignal[],
  healthyWindowsToRecover: number,
): HealthSignal {
  const clearedSignalIds = clearedSignals
    .map((signal) => signal.signalId)
    .sort(compareCodePoints);
  const materialEvidenceDigest = digest({ clearedSignalIds });
  const core = {
    schemaVersion: 1 as const,
    kind: HealthSignalKinds.HEALTH_RECOVERED,
    severity: HealthSeverities.INFO,
    status: 'informational' as const,
    scope,
    observationId: observation.observationId,
    observationHash: observation.observationHash,
    ledgerCursor: observation.ledgerCursor,
    projectionWatermark: observation.projectionWatermark,
    sourceEventIds: observation.sourceEventIds,
    inputDigest: observation.inputDigest,
    replayFingerprintDigest: observation.replayFingerprintDigest,
    inputGauges: observation.inputs,
    policyVersion: observation.policyVersion,
    policyDigest: observation.policyDigest,
    adapterDigest: observation.adapterDigest,
    priorActiveSignalId: clearedSignalIds.at(-1) ?? null,
    materialEvidenceDigest,
    evidence: {
      clearedSignalIds,
      recoveryObservationId: observation.observationId,
    },
    decisionTrace: [{
      detector: 'healthy_window_hysteresis',
      value: healthyWindowsToRecover,
      threshold: healthyWindowsToRecover,
      passed: true,
    }],
  };
  return Object.freeze(cloneJson({
    ...core,
    signalId: `health-signal-${digest(core)}`,
  }));
}

function highestSeverity(signals: readonly HealthSignal[]): HealthSeverity {
  return signals.reduce<HealthSeverity>((highest, signal) => (
    SEVERITY_RANK[signal.severity] > SEVERITY_RANK[highest] ? signal.severity : highest
  ), HealthSeverities.INFO);
}

function createAggregate(
  observation: HealthObservation,
  activeSignals: readonly HealthSignal[],
  didRecover: boolean,
  hasQualifyingProgress: boolean,
  minimumSamplesMet: boolean,
): HealthAggregate {
  const sorted = [...activeSignals].sort((left, right) => compareCodePoints(
    left.signalId,
    right.signalId,
  ));
  const severity = highestSeverity(sorted);
  let state: HealthAggregate['state'];
  if (sorted.some((signal) => signal.kind === HealthSignalKinds.TELEMETRY_GAP)) {
    state = HealthAggregateStates.CRITICAL;
  } else if (sorted.some((signal) => signal.kind === HealthSignalKinds.NOT_EVALUABLE)) {
    state = HealthAggregateStates.NOT_EVALUABLE;
  } else if (sorted.length > 0) {
    state = severity === HealthSeverities.CRITICAL
      ? HealthAggregateStates.CRITICAL
      : severity === HealthSeverities.DEGRADED
        ? HealthAggregateStates.DEGRADED
        : HealthAggregateStates.WARNING;
  } else if (didRecover) {
    state = HealthAggregateStates.RECOVERED;
  } else if (observation.coherent && minimumSamplesMet && hasQualifyingProgress) {
    state = HealthAggregateStates.HEALTHY;
  } else {
    state = HealthAggregateStates.OBSERVING;
  }
  const core = {
    schemaVersion: 1 as const,
    state,
    severity,
    observationId: observation.observationId,
    activeSignalIds: sorted.map((signal) => signal.signalId),
    policyVersion: observation.policyVersion,
    policyDigest: observation.policyDigest,
  };
  return Object.freeze(cloneJson({
    ...core,
    aggregateId: `health-aggregate-${digest(core)}`,
  }));
}

function actionFor(signal: HealthSignal, observation: HealthObservation): HealthResponseAction {
  switch (signal.kind) {
    case HealthSignalKinds.MODE_COLLAPSE:
    case HealthSignalKinds.REPETITION:
      return HealthResponseActions.PAUSE_REGION;
    case HealthSignalKinds.NOVELTY_STARVATION:
      return observation.inputs.frontier?.frontierRef
        ? HealthResponseActions.RESEED_FRONTIER
        : HealthResponseActions.PAUSE_MODE;
    case HealthSignalKinds.QUALITY_DECAY:
      return observation.inputs.quality?.candidateRef
        ? HealthResponseActions.QUARANTINE_CANDIDATE
        : HealthResponseActions.PAUSE_MODE;
    case HealthSignalKinds.BUDGET_THRASH:
      return HealthResponseActions.PAUSE_MODE;
    case HealthSignalKinds.TELEMETRY_GAP:
      return HealthResponseActions.REPAIR_TELEMETRY;
    case HealthSignalKinds.NOT_EVALUABLE:
    case HealthSignalKinds.HEALTH_RECOVERED:
      return HealthResponseActions.OBSERVE;
  }
}

function createRequest(
  action: HealthResponseAction,
  signals: readonly HealthSignal[],
  observation: HealthObservation,
  aggregate: HealthAggregate,
): HealthResponseRequest {
  const signalIds = signals.map((signal) => signal.signalId).sort(compareCodePoints);
  const safePointRequired = action !== HealthResponseActions.OBSERVE;
  const core = {
    schemaVersion: 1 as const,
    action,
    authority: 'request_only' as const,
    authorizationState: 'pending_gateway' as const,
    gatewayDecisionId: null,
    executionDecision: null,
    executionReceipt: null,
    safePointRequired,
    requestedScope: {
      runId: observation.runId,
      modeId: observation.modeId,
      lineageId: observation.lineageId,
      regionId: observation.regionId,
      frontierRef: action === HealthResponseActions.RESEED_FRONTIER
        ? observation.inputs.frontier?.frontierRef ?? null
        : null,
      candidateRef: action === HealthResponseActions.QUARANTINE_CANDIDATE
        ? observation.inputs.quality?.candidateRef ?? null
        : null,
    },
    signalIds,
    aggregateId: aggregate.aggregateId,
    aggregateState: aggregate.state,
    severity: aggregate.severity,
    evidenceDigest: digest({ signalIds, aggregateId: aggregate.aggregateId }),
    reason: `Health policy requested ${action} from typed evidence`,
    policyVersion: observation.policyVersion,
    policyDigest: observation.policyDigest,
    budgetHandling: action === HealthResponseActions.PAUSE_MODE
      || action === HealthResponseActions.REQUEST_STOP
      ? 'settle_before_transition' as const
      : 'preserve' as const,
    leaseHandling: safePointRequired
      ? 'await_safe_point' as const
      : 'preserve_inflight' as const,
  };
  return Object.freeze(cloneJson({
    ...core,
    requestId: `health-request-${digest(core)}`,
  }));
}

function responseRequests(
  emittedSignals: readonly HealthSignal[],
  observation: HealthObservation,
  aggregate: HealthAggregate,
): HealthResponseRequest[] {
  const requests = emittedSignals.map((signal) => createRequest(
    actionFor(signal, observation),
    [signal],
    observation,
    aggregate,
  ));
  const emittedKinds = new Set(emittedSignals.map((signal) => signal.kind));
  if (
    emittedKinds.has(HealthSignalKinds.QUALITY_DECAY)
    && emittedKinds.has(HealthSignalKinds.NOVELTY_STARVATION)
  ) {
    requests.push(createRequest(
      HealthResponseActions.REQUEST_STOP,
      emittedSignals.filter((signal) => (
        signal.kind === HealthSignalKinds.QUALITY_DECAY
        || signal.kind === HealthSignalKinds.NOVELTY_STARVATION
      )),
      observation,
      aggregate,
    ));
  }
  return [...new Map(requests.map((request) => [request.requestId, request])).values()]
    .sort((left, right) => compareCodePoints(left.requestId, right.requestId));
}

// ───────────────────────────────────────────────────────────────────
// 6. PROJECTION REDUCER
// ───────────────────────────────────────────────────────────────────

/** Create a bounded empty projection for one exact policy generation. */
export function createHealthProjectionState(policy: HealthPolicy): HealthProjectionState {
  return finalizeState({
    schemaVersion: 1,
    projectorVersion: HEALTH_OBSERVATION_PROJECTOR_VERSION,
    policyVersion: policy.policyVersion,
    policyDigest: policy.policyDigest,
    observations: [],
    signals: [],
    requests: [],
    activeSignals: {},
    deduplicationRecords: [],
    lastLedgerCursor: null,
    healthyWindowStreaks: {},
  });
}

/** Verify a resume snapshot before it can influence a new observation. */
export function restoreHealthProjectionState(
  value: HealthProjectionState,
  policy: HealthPolicy,
): HealthProjectionState {
  const { projectionHash, ...core } = value;
  if (
    value.schemaVersion !== 1
    || value.projectorVersion !== HEALTH_OBSERVATION_PROJECTOR_VERSION
    || value.policyVersion !== policy.policyVersion
    || value.policyDigest !== policy.policyDigest
    || digest(core) !== projectionHash
  ) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.PROJECTION_CORRUPT,
      'Health projection snapshot failed version or canonical-hash verification',
    );
  }
  return Object.freeze(cloneJson(value));
}

function idempotentResult(
  record: HealthDeduplicationRecord,
  state: HealthProjectionState,
): HealthProjectionResult {
  return Object.freeze({
    status: 'idempotent',
    observation: record.observation,
    emittedSignals: record.emittedSignals,
    aggregate: record.aggregate,
    responseRequests: record.responseRequests,
    state,
  });
}

function applyBoundary(
  state: HealthProjectionState,
  input: HealthBoundaryInput,
  adapter: RegisteredModeHealthAdapter,
  policy: HealthPolicy,
): HealthProjectionResult {
  const nextBoundaryId = boundaryId(input, policy);
  const nextInputDigest = inputDigest(input);
  const priorDelivery = state.deduplicationRecords.find((record) => (
    record.boundaryId === nextBoundaryId
  ));
  if (priorDelivery) {
    if (priorDelivery.inputDigest !== nextInputDigest) {
      throw new HealthHarnessError(
        HealthHarnessErrorCodes.EVENT_CONFLICT,
        'Boundary identity is already bound to different canonical input',
        { boundaryId: nextBoundaryId },
      );
    }
    return idempotentResult(priorDelivery, state);
  }
  const issues = validateBoundary(state, input, adapter);
  const observation = createObservation(input, policy, issues);
  const observations = bounded(
    [...state.observations, observation],
    policy.observationRetention,
  );
  const scope = signalScope(input);
  const scopedObservations = observationsForScope(observations, scope);
  const detection = detect(
    scopedObservations,
    policy,
    adapter,
    activeSignalValuesForScope(state.activeSignals, scope),
  );
  const activeSignals = cloneJson(state.activeSignals);
  const emittedSignals: HealthSignal[] = [];
  for (const candidate of detection.candidates) {
    const key = activeSignalKey(candidate.kind, scope);
    const prior = (activeSignals[key] as unknown as HealthSignal | undefined) ?? null;
    const proposed = createSignal(candidate, observation, scope, prior);
    const priorObservation = prior === null
      ? null
      : state.observations.find((entry) => entry.observationId === prior.observationId) ?? null;
    const withinCooldown = prior !== null
      && priorObservation !== null
      && prior.materialEvidenceDigest === proposed.materialEvidenceDigest
      && observation.ledgerCursor.sequence - priorObservation.ledgerCursor.sequence
        < policy.cooldownObservations;
    if (!withinCooldown) {
      activeSignals[key] = proposed;
      emittedSignals.push(proposed);
    }
  }
  const hasCandidates = detection.candidates.length > 0;
  const healthyWindowStreaks = cloneJson(state.healthyWindowStreaks);
  const scopeKey = healthScopeKey(scope);
  let scopedActiveSignals = activeSignalValuesForScope(activeSignals, scope);
  const isVerifiedRecoveryWindow = !hasCandidates
    && detection.hasQualifyingProgress
    && detection.hasRecoveryEvidence;
  let scopedHealthyWindowStreak = 0;
  if (scopedActiveSignals.length > 0 && isVerifiedRecoveryWindow) {
    scopedHealthyWindowStreak = healthyWindowStreakForScope(healthyWindowStreaks, scope) + 1;
    healthyWindowStreaks[scopeKey] = scopedHealthyWindowStreak;
  } else {
    delete healthyWindowStreaks[scopeKey];
  }
  let didRecover = false;
  if (
    isVerifiedRecoveryWindow
    && scopedActiveSignals.length > 0
    && scopedHealthyWindowStreak >= policy.healthyWindowsToRecover
  ) {
    const cleared = scopedActiveSignals;
    emittedSignals.push(recoverySignal(
      observation,
      scope,
      cleared,
      policy.healthyWindowsToRecover,
    ));
    for (const signal of cleared) {
      delete activeSignals[activeSignalKey(signal.kind, scope)];
    }
    delete healthyWindowStreaks[scopeKey];
    scopedActiveSignals = [];
    didRecover = true;
  }
  const aggregate = createAggregate(
    observation,
    scopedActiveSignals,
    didRecover,
    detection.hasQualifyingProgress,
    scopedObservations.length >= policy.minimumComparableSamples,
  );
  const requests = responseRequests(emittedSignals, observation, aggregate);
  const record: HealthDeduplicationRecord = {
    boundaryId: nextBoundaryId,
    inputDigest: nextInputDigest,
    observationHash: observation.observationHash,
    observation,
    emittedSignals,
    responseRequests: requests,
    aggregate,
  };
  const nextState = finalizeState({
    schemaVersion: 1,
    projectorVersion: HEALTH_OBSERVATION_PROJECTOR_VERSION,
    policyVersion: policy.policyVersion,
    policyDigest: policy.policyDigest,
    observations,
    signals: bounded([...state.signals, ...emittedSignals], policy.signalRetention),
    requests: bounded([...state.requests, ...requests], policy.requestRetention),
    activeSignals,
    deduplicationRecords: bounded(
      [...state.deduplicationRecords, record],
      policy.deduplicationRetention,
    ),
    lastLedgerCursor: input.ledgerCursor,
    healthyWindowStreaks,
  });
  return Object.freeze({
    status: 'applied',
    observation,
    emittedSignals: Object.freeze(emittedSignals),
    aggregate,
    responseRequests: Object.freeze(requests),
    state: nextState,
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. PUBLIC PROJECTOR AND DARK WRAPPER
// ───────────────────────────────────────────────────────────────────

/** Stateful facade over the pure bounded reducer, suitable for replay or resume. */
export class HealthObservationProjector {
  readonly #adapters: ModeHealthAdapterRegistry;
  readonly #policy: HealthPolicy;
  #state: HealthProjectionState;

  public constructor(
    adapters: ModeHealthAdapterRegistry,
    policies: HealthPolicyRegistry,
    policyVersion: string,
    initialState?: HealthProjectionState,
  ) {
    this.#adapters = adapters;
    this.#policy = policies.resolve(policyVersion);
    this.#state = initialState
      ? restoreHealthProjectionState(initialState, this.#policy)
      : createHealthProjectionState(this.#policy);
  }

  public apply(input: HealthBoundaryInput): HealthProjectionResult {
    const adapter = this.#adapters.resolve(
      input.modeId,
      input.adapterId,
      input.adapterVersion,
    );
    const result = applyBoundary(this.#state, input, adapter, this.#policy);
    this.#state = result.state;
    return result;
  }

  public snapshot(): HealthProjectionState {
    return Object.freeze(cloneJson(this.#state));
  }
}

/** Rebuild a projection from the same ordered boundaries used by incremental execution. */
export function replayHealthObservations(
  inputs: readonly HealthBoundaryInput[],
  adapters: ModeHealthAdapterRegistry,
  policies: HealthPolicyRegistry,
  policyVersion: string,
): HealthProjectionState {
  const projector = new HealthObservationProjector(adapters, policies, policyVersion);
  for (const input of inputs) projector.apply(input);
  return projector.snapshot();
}

/** Observe beside an authoritative result while returning that result by reference. */
export function observeHealthInShadow<TLegacy>(
  legacyResult: TLegacy,
  projector: HealthObservationProjector,
  input: HealthBoundaryInput,
): HealthShadowResult<TLegacy> {
  return Object.freeze({
    legacyResult,
    healthResult: projector.apply(input),
    authority: 'legacy_unchanged',
  });
}

/** Adapter definitions remain data so callers can audit every mode's field posture. */
export function adapterManifest(
  definitions: readonly ModeHealthAdapterDefinition[],
): readonly ModeHealthAdapterDefinition[] {
  return Object.freeze(cloneJson(definitions as unknown as JsonValue) as unknown as ModeHealthAdapterDefinition[]);
}

/** Expose typed budget pressure values for detector-specific fixture builders. */
export function isBudgetPressure(
  value: BudgetPressureHealthObservation,
): boolean {
  return PRESSURE_KINDS.has(value.pressureKind) && !value.exhausted;
}
