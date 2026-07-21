// ───────────────────────────────────────────────────────────────────
// MODULE: Health Degeneration Input Adapters
// ───────────────────────────────────────────────────────────────────

import {
  CycleProgressVerdicts,
} from '../cycle-detection/index.js';
import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  BudgetEventTypes,
  asBudgetLifecyclePayload,
  budgetVector,
} from '../hierarchical-budgets/index.js';
import {
  HealthHarnessError,
  HealthHarnessErrorCodes,
  HealthInputFields,
} from './health-harness-types.js';

import type { CycleHealthEventPayload } from '../cycle-detection/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  BudgetEventType,
  BudgetLifecyclePayload,
  NormalizedBudgetReceipt,
} from '../hierarchical-budgets/index.js';
import type {
  ProjectionGaugeMaterialization,
  ProjectionSnapshot,
  ProjectionWatermark,
} from '../transactional-projections/index.js';
import type {
  BudgetPressureHealthObservation,
  FrontierHealthObservation,
  HealthInputAvailability,
  HealthInputField,
  HealthSourceProvenance,
  ModeHealthAdapterDefinition,
  NormalizedHealthInputs,
  ProgressHealthObservation,
  QualityHealthObservation,
  RegisteredModeHealthAdapter,
  SemanticConcentrationObservation,
} from './health-harness-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const HEALTH_INPUT_FIELD_VALUES = Object.freeze(Object.values(HealthInputFields));
const AVAILABILITY_VALUES = new Set<HealthInputAvailability>([
  'required',
  'optional',
  'unavailable',
]);

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function requireIdentity(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 4_096) {
    throw new TypeError(`${field} must be a bounded non-empty identity`);
  }
  return value;
}

function requireDigest(value: string, field: string): string {
  if (!HASH_PATTERN.test(value)) throw new TypeError(`${field} must be a SHA-256 digest`);
  return value;
}

function requireBasisPoints(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0 || value > 10_000) {
    throw new TypeError(`${field} must be an integer from 0 through 10000`);
  }
  return value;
}

function requireNonNegativeInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative safe integer`);
  }
  return value;
}

function provenance(value: HealthSourceProvenance): HealthSourceProvenance {
  return Object.freeze(cloneJson({
    sourceId: requireIdentity(value.sourceId, 'provenance.sourceId'),
    sourceVersion: requireIdentity(value.sourceVersion, 'provenance.sourceVersion'),
    reducerDigest: requireDigest(value.reducerDigest, 'provenance.reducerDigest'),
    watermarkSequence: requireNonNegativeInteger(
      value.watermarkSequence,
      'provenance.watermarkSequence',
    ),
    watermarkRecordHash: requireDigest(
      value.watermarkRecordHash,
      'provenance.watermarkRecordHash',
    ),
  }));
}

// ───────────────────────────────────────────────────────────────────
// 2. MODE-NEUTRAL VALUE ADAPTERS
// ───────────────────────────────────────────────────────────────────

/** Normalize a typed community or canonical fingerprint without using display text. */
export function adaptSemanticConcentration(
  input: SemanticConcentrationObservation,
): SemanticConcentrationObservation {
  if (
    input.identityKind !== 'semantic_community'
    && input.identityKind !== 'canonical_fingerprint'
  ) {
    throw new TypeError('Semantic concentration requires a typed identity kind');
  }
  return Object.freeze(cloneJson({
    identityKind: input.identityKind,
    identity: requireIdentity(input.identity, 'semantic.identity'),
    textSimilarityBps: input.textSimilarityBps === null
      ? null
      : requireBasisPoints(input.textSimilarityBps, 'semantic.textSimilarityBps'),
    provenance: provenance(input.provenance),
  }));
}

/** Normalize externally measured novelty and progress without estimating either value. */
export function adaptProgress(input: ProgressHealthObservation): ProgressHealthObservation {
  return Object.freeze(cloneJson({
    noveltyYieldBps: requireBasisPoints(input.noveltyYieldBps, 'progress.noveltyYieldBps'),
    independentEvidenceYieldBps: requireBasisPoints(
      input.independentEvidenceYieldBps,
      'progress.independentEvidenceYieldBps',
    ),
    coverageGainBps: requireBasisPoints(input.coverageGainBps, 'progress.coverageGainBps'),
    claimProgressCount: requireNonNegativeInteger(
      input.claimProgressCount,
      'progress.claimProgressCount',
    ),
    qualifyingEvidenceIds: [...new Set(input.qualifyingEvidenceIds.map((identity) => (
      requireIdentity(identity, 'progress.qualifyingEvidenceIds')
    )))].sort(),
    provenance: provenance(input.provenance),
  }));
}

/** Preserve explicit frontier exhaustion and unknown states instead of inferring health. */
export function adaptFrontier(input: FrontierHealthObservation): FrontierHealthObservation {
  if (!['eligible', 'exhausted', 'empty', 'unknown'].includes(input.status)) {
    throw new TypeError('Frontier status is unsupported');
  }
  if (input.status === 'eligible') {
    if (input.eligibleWorkCount === null || input.eligibleWorkCount < 1) {
      throw new TypeError('Eligible frontier requires a positive eligible-work count');
    }
    requireIdentity(input.frontierRef ?? '', 'frontier.frontierRef');
  } else if (input.eligibleWorkCount !== null && input.eligibleWorkCount !== 0) {
    throw new TypeError('Non-eligible frontier cannot claim eligible work');
  }
  return Object.freeze(cloneJson({
    status: input.status,
    eligibleWorkCount: input.eligibleWorkCount === null
      ? null
      : requireNonNegativeInteger(input.eligibleWorkCount, 'frontier.eligibleWorkCount'),
    frontierRef: input.frontierRef === null
      ? null
      : requireIdentity(input.frontierRef, 'frontier.frontierRef'),
    provenance: provenance(input.provenance),
  }));
}

/** Normalize evaluator-provided quality evidence while preserving its sealed ruler. */
export function adaptQuality(input: QualityHealthObservation): QualityHealthObservation {
  const normalizedScoreBps = requireBasisPoints(
    input.normalizedScoreBps,
    'quality.normalizedScoreBps',
  );
  const lowerConfidenceBoundBps = requireBasisPoints(
    input.lowerConfidenceBoundBps,
    'quality.lowerConfidenceBoundBps',
  );
  if (lowerConfidenceBoundBps > normalizedScoreBps) {
    throw new TypeError('Quality lower-confidence bound cannot exceed its normalized score');
  }
  return Object.freeze(cloneJson({
    normalizedScoreBps,
    lowerConfidenceBoundBps,
    baselineId: requireIdentity(input.baselineId, 'quality.baselineId'),
    baselineLowerConfidenceBoundBps: requireBasisPoints(
      input.baselineLowerConfidenceBoundBps,
      'quality.baselineLowerConfidenceBoundBps',
    ),
    evaluatorDigest: requireDigest(input.evaluatorDigest, 'quality.evaluatorDigest'),
    rubricDigest: requireDigest(input.rubricDigest, 'quality.rubricDigest'),
    verifierDigest: requireDigest(input.verifierDigest, 'quality.verifierDigest'),
    calibrationDigest: requireDigest(input.calibrationDigest, 'quality.calibrationDigest'),
    candidateRef: input.candidateRef === null
      ? null
      : requireIdentity(input.candidateRef, 'quality.candidateRef'),
    validThroughSequence: requireNonNegativeInteger(
      input.validThroughSequence,
      'quality.validThroughSequence',
    ),
    provenance: provenance(input.provenance),
  }));
}

const BUDGET_PRESSURE_EVENTS: Readonly<Record<
  BudgetPressureHealthObservation['pressureKind'],
  readonly BudgetEventType[]
>> = Object.freeze({
  normal: [
    BudgetEventTypes.SCOPE_CREATED,
    BudgetEventTypes.CHILD_ALLOCATED,
    BudgetEventTypes.RESERVATION_GRANTED,
    BudgetEventTypes.RESERVATION_RELEASED,
    BudgetEventTypes.SPEND_COMMITTED,
    BudgetEventTypes.RECONCILIATION_RECORDED,
  ],
  retry: [BudgetEventTypes.RESERVATION_GRANTED, BudgetEventTypes.RESERVATION_RENEWED],
  cancellation: [BudgetEventTypes.RESERVATION_CANCELLED],
  lease: [BudgetEventTypes.RESERVATION_RENEWED, BudgetEventTypes.RESERVATION_EXPIRED],
  denial: [BudgetEventTypes.RESERVATION_DENIED],
  reallocation: [BudgetEventTypes.CHILD_ALLOCATED],
  settlement: [BudgetEventTypes.SPEND_COMMITTED, BudgetEventTypes.RECONCILIATION_RECORDED],
  exhaustion: [BudgetEventTypes.EXHAUSTION_RECORDED],
});

/** Typed budget lifecycle evidence used to derive one pressure observation. */
export interface BudgetLifecyclePressureInput {
  readonly eventType: BudgetEventType;
  readonly payload: BudgetLifecyclePayload;
  readonly settledReceipt: NormalizedBudgetReceipt | null;
  readonly pressureKind: BudgetPressureHealthObservation['pressureKind'];
  readonly dimension: BudgetPressureHealthObservation['dimension'];
  readonly evidenceYieldBps: number;
  readonly provenance: HealthSourceProvenance;
}

function normalizedBudgetReceipt(
  receipt: NormalizedBudgetReceipt | null,
): NormalizedBudgetReceipt | null {
  if (receipt === null) return null;
  const terminalStatuses: readonly NormalizedBudgetReceipt['terminalStatus'][] = [
    'succeeded',
    'failed',
    'cancelled',
    'timed-out',
  ];
  if (!terminalStatuses.includes(receipt.terminalStatus)) {
    throw new TypeError('Budget receipt terminal status is unsupported');
  }
  return Object.freeze({
    receiptId: requireIdentity(receipt.receiptId, 'budget.receipt.receiptId'),
    dispatchId: requireIdentity(receipt.dispatchId, 'budget.receipt.dispatchId'),
    replayFingerprint: requireDigest(
      receipt.replayFingerprint,
      'budget.receipt.replayFingerprint',
    ),
    pricingDigest: requireDigest(receipt.pricingDigest, 'budget.receipt.pricingDigest'),
    terminalStatus: receipt.terminalStatus,
    usage: budgetVector(receipt.usage),
  });
}

/** Normalize one typed budget lifecycle receipt without mixing resource dimensions. */
export function adaptBudgetPressure(
  input: BudgetPressureHealthObservation,
): BudgetPressureHealthObservation {
  if (!BUDGET_PRESSURE_EVENTS[input.pressureKind]?.includes(input.sourceEventType)) {
    throw new TypeError('Budget pressure kind is incompatible with its lifecycle event');
  }
  if (!['tokens', 'cost', 'iterations', 'wall-time'].includes(input.dimension)) {
    throw new TypeError('Budget pressure dimension is unsupported');
  }
  if (input.exhausted !== (input.pressureKind === 'exhaustion')) {
    throw new TypeError('Budget exhaustion must remain an explicit non-thrash disposition');
  }
  return Object.freeze(cloneJson({
    sourceEventType: input.sourceEventType,
    pressureKind: input.pressureKind,
    dimension: input.dimension,
    decisionId: requireIdentity(input.decisionId, 'budget.decisionId'),
    receiptDigest: requireDigest(input.receiptDigest, 'budget.receiptDigest'),
    evidenceYieldBps: requireBasisPoints(input.evidenceYieldBps, 'budget.evidenceYieldBps'),
    exhausted: input.exhausted,
    provenance: provenance(input.provenance),
  }));
}

/** Bind budget pressure to a validated lifecycle payload and normalized usage receipt. */
export function adaptBudgetLifecyclePressure(
  input: BudgetLifecyclePressureInput,
): BudgetPressureHealthObservation {
  const payload = asBudgetLifecyclePayload(input.payload);
  const receipt = normalizedBudgetReceipt(input.settledReceipt);
  return adaptBudgetPressure({
    sourceEventType: input.eventType,
    pressureKind: input.pressureKind,
    dimension: input.dimension,
    decisionId: payload.operation_id,
    receiptDigest: sha256Bytes(canonicalBytes({
      eventType: input.eventType,
      payload,
      settledReceipt: receipt,
    })),
    evidenceYieldBps: input.evidenceYieldBps,
    exhausted: input.pressureKind === 'exhaustion',
    provenance: input.provenance,
  });
}

/** Validate and clone sibling cycle evidence without deriving any repeated-state result. */
export function adaptCycleEvent(input: CycleHealthEventPayload): CycleHealthEventPayload {
  if (
    !['cycle_suspected', 'cycle_confirmed', 'cycle_cleared'].includes(input.health_state)
    || !['focus', 'claim_frontier', 'composite_state'].includes(input.signature_kind)
    || ![
      CycleProgressVerdicts.PROGRESS,
      CycleProgressVerdicts.NO_PROGRESS,
      CycleProgressVerdicts.NOT_EVALUABLE,
    ].includes(input.progress_assessment.verdict)
    || !HASH_PATTERN.test(input.detector_policy_digest)
    || !HASH_PATTERN.test(input.evidence_digest)
    || input.source_fingerprints.some((fingerprint) => !HASH_PATTERN.test(fingerprint))
    || input.start_cursor.sequence > input.end_cursor.sequence
  ) {
    throw new TypeError('Cycle event does not match the sibling health-event contract');
  }
  return Object.freeze(cloneJson(input));
}

/** Build the closed normalized input record used by the projector. */
export function createNormalizedHealthInputs(
  input: NormalizedHealthInputs,
): NormalizedHealthInputs {
  return Object.freeze(cloneJson({
    semanticConcentration: input.semanticConcentration === null
      ? null
      : adaptSemanticConcentration(input.semanticConcentration),
    progress: input.progress === null ? null : adaptProgress(input.progress),
    frontier: input.frontier === null ? null : adaptFrontier(input.frontier),
    quality: input.quality === null ? null : adaptQuality(input.quality),
    budgetPressure: input.budgetPressure === null
      ? null
      : adaptBudgetPressure(input.budgetPressure),
    cycleEvent: input.cycleEvent === null ? null : adaptCycleEvent(input.cycleEvent),
  }));
}

// ───────────────────────────────────────────────────────────────────
// 3. COMMITTED PROJECTION ADAPTER
// ───────────────────────────────────────────────────────────────────

export interface ProjectionGaugeRead {
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly outputHash: string;
  readonly output: JsonObject;
}

function projectionGauge(
  snapshot: ProjectionSnapshot,
  gaugeId: string,
): ProjectionGaugeMaterialization {
  const value = snapshot.gauges[gaugeId];
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.PROJECTION_CORRUPT,
      'Committed projection does not contain the requested gauge',
      { gaugeId },
    );
  }
  return value as unknown as ProjectionGaugeMaterialization;
}

/** Read one shipped gauge only after snapshot and watermark identities agree exactly. */
export function readCommittedProjectionGauge(
  snapshot: ProjectionSnapshot,
  watermark: ProjectionWatermark,
  gaugeId: string,
  expectedGaugeVersion: string,
): ProjectionGaugeRead {
  if (
    snapshot.generationId !== watermark.generationId
    || snapshot.ledgerId !== watermark.ledgerId
    || snapshot.bundleId !== watermark.bundleId
    || snapshot.bundleVersion !== watermark.bundleVersion
    || snapshot.bundleDigest !== watermark.bundleDigest
    || snapshot.reducerDigest !== watermark.reducerDigest
    || snapshot.configurationDigest !== watermark.configurationDigest
    || snapshot.eventRegistryDigest !== watermark.eventRegistryDigest
    || snapshot.cutoffSequence !== watermark.sequence
    || snapshot.cutoffRecordHash !== watermark.recordHash
  ) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.PROJECTION_CORRUPT,
      'Committed snapshot and projection watermark are incoherent',
    );
  }
  const gauge = projectionGauge(snapshot, gaugeId);
  if (
    gauge.gaugeVersion !== expectedGaugeVersion
    || gauge.cutoffSequence !== snapshot.cutoffSequence
    || gauge.cutoffRecordHash !== snapshot.cutoffRecordHash
    || !HASH_PATTERN.test(gauge.reducerDigest)
    || !HASH_PATTERN.test(gauge.configurationDigest)
    || !HASH_PATTERN.test(gauge.outputHash)
  ) {
    throw new HealthHarnessError(
      HealthHarnessErrorCodes.PROJECTION_CORRUPT,
      'Committed gauge version or cutoff is unsupported',
      { gaugeId, expectedGaugeVersion },
    );
  }
  return Object.freeze(cloneJson({
    gaugeId,
    gaugeVersion: gauge.gaugeVersion,
    reducerDigest: gauge.reducerDigest,
    configurationDigest: gauge.configurationDigest,
    outputHash: gauge.outputHash,
    output: gauge.output,
  }));
}

// ───────────────────────────────────────────────────────────────────
// 4. ADAPTER REGISTRY
// ───────────────────────────────────────────────────────────────────

function adapterKey(modeId: string, adapterId: string, adapterVersion: string): string {
  return `${modeId}\u0000${adapterId}\u0000${adapterVersion}`;
}

function normalizeAdapter(
  definition: ModeHealthAdapterDefinition,
): RegisteredModeHealthAdapter {
  requireIdentity(definition.modeId, 'adapter.modeId');
  requireIdentity(definition.adapterId, 'adapter.adapterId');
  requireIdentity(definition.adapterVersion, 'adapter.adapterVersion');
  for (const field of HEALTH_INPUT_FIELD_VALUES) {
    if (!AVAILABILITY_VALUES.has(definition.fields[field])) {
      throw new TypeError(`Adapter field availability is missing: ${field}`);
    }
    const versions = definition.sourceVersions[field] ?? [];
    const reducerDigests = definition.sourceReducerDigests[field] ?? [];
    if (definition.fields[field] !== 'unavailable' && versions.length === 0) {
      throw new TypeError(`Available adapter field requires source versions: ${field}`);
    }
    if (definition.fields[field] !== 'unavailable' && reducerDigests.length === 0) {
      throw new TypeError(`Available adapter field requires reducer digests: ${field}`);
    }
    for (const version of versions) requireIdentity(version, `adapter.sourceVersions.${field}`);
    for (const reducerDigest of reducerDigests) {
      requireDigest(reducerDigest, `adapter.sourceReducerDigests.${field}`);
    }
  }
  const manifest = cloneJson({
    modeId: definition.modeId,
    adapterId: definition.adapterId,
    adapterVersion: definition.adapterVersion,
    projection: {
      bundleId: requireIdentity(definition.projection.bundleId, 'adapter.projection.bundleId'),
      bundleVersion: requireIdentity(
        definition.projection.bundleVersion,
        'adapter.projection.bundleVersion',
      ),
      bundleDigest: requireDigest(
        definition.projection.bundleDigest,
        'adapter.projection.bundleDigest',
      ),
      reducerDigest: requireDigest(
        definition.projection.reducerDigest,
        'adapter.projection.reducerDigest',
      ),
      configurationDigest: requireDigest(
        definition.projection.configurationDigest,
        'adapter.projection.configurationDigest',
      ),
      eventRegistryDigest: requireDigest(
        definition.projection.eventRegistryDigest,
        'adapter.projection.eventRegistryDigest',
      ),
    },
    fields: definition.fields,
    sourceVersions: definition.sourceVersions,
    sourceReducerDigests: definition.sourceReducerDigests,
  } as unknown as JsonObject) as unknown as ModeHealthAdapterDefinition;
  return Object.freeze({
    ...manifest,
    adapterDigest: sha256Bytes(canonicalBytes(manifest)),
  });
}

/** Closed adapter registry keeps mode-specific fields outside the generic detector. */
export class ModeHealthAdapterRegistry {
  public readonly digest: string;
  readonly #adapters: ReadonlyMap<string, RegisteredModeHealthAdapter>;

  public constructor(definitions: readonly ModeHealthAdapterDefinition[]) {
    if (definitions.length === 0) throw new TypeError('Health adapter registry cannot be empty');
    const adapters = new Map<string, RegisteredModeHealthAdapter>();
    for (const definition of definitions) {
      const registered = normalizeAdapter(definition);
      const key = adapterKey(
        registered.modeId,
        registered.adapterId,
        registered.adapterVersion,
      );
      if (adapters.has(key)) {
        throw new HealthHarnessError(
          HealthHarnessErrorCodes.ADAPTER_CONFLICT,
          'Health adapter identity and version must be unique',
          { modeId: registered.modeId, adapterId: registered.adapterId },
        );
      }
      adapters.set(key, registered);
    }
    this.#adapters = adapters;
    this.digest = sha256Bytes(canonicalBytes([...adapters.values()].map((adapter) => ({
      modeId: adapter.modeId,
      adapterId: adapter.adapterId,
      adapterVersion: adapter.adapterVersion,
      adapterDigest: adapter.adapterDigest,
    }))));
    Object.freeze(this);
  }

  public resolve(
    modeId: string,
    adapterId: string,
    adapterVersion: string,
  ): RegisteredModeHealthAdapter {
    const adapter = this.#adapters.get(adapterKey(modeId, adapterId, adapterVersion));
    if (!adapter) {
      throw new HealthHarnessError(
        HealthHarnessErrorCodes.ADAPTER_UNREGISTERED,
        'Mode health adapter version is not registered',
        { modeId, adapterId, adapterVersion },
      );
    }
    return adapter;
  }
}

/** Return the field name used by registry validation and diagnostics. */
export function inputFieldName(field: HealthInputField): string {
  return field;
}
