// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  ModelBenchmarkEventStem,
  ScoreVectorObservation,
  TrialMatrixKey,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ARTIFACT KINDS
// ───────────────────────────────────────────────────────────────────

export const ModelBenchmarkArtifactKinds = Object.freeze({
  BENCHMARK_RECIPE: 'model-benchmark-recipe',
  RUN_MANIFEST: 'model-benchmark-run-manifest',
  MODEL_CELL_INPUT: 'model-benchmark-model-cell-input',
  RAW_CELL_OUTPUT: 'model-benchmark-raw-cell-output',
  SCORING_MATRIX: 'model-benchmark-scoring-matrix',
  COMMON_ANCHOR_SELECTION: 'model-benchmark-common-anchor-selection',
  ADAPTIVE_DIAGNOSTIC_SELECTION: 'model-benchmark-adaptive-diagnostic-selection',
  VALIDITY_EVIDENCE: 'model-benchmark-validity-evidence',
  CONTAMINATION_LINEAGE: 'model-benchmark-contamination-lineage',
  WORKLOAD_EVIDENCE: 'model-benchmark-workload-evidence',
  SELECTION_EVIDENCE: 'model-benchmark-selection-evidence',
} as const);

export type ModelBenchmarkArtifactKind =
  typeof ModelBenchmarkArtifactKinds[keyof typeof ModelBenchmarkArtifactKinds];

export type ModelBenchmarkArtifactLifecycle =
  | 'cell'
  | 'evidence'
  | 'recipe'
  | 'run'
  | 'scoring';

export type ModelBenchmarkArtifactMaterialFamily =
  | 'contamination'
  | 'diagnostic'
  | 'matrix'
  | 'recipe'
  | 'run'
  | 'scoring'
  | 'selection'
  | 'validity'
  | 'workload';

export interface ModelBenchmarkArtifactKindRegistration {
  readonly artifactKind: ModelBenchmarkArtifactKind;
  readonly lifecycle: ModelBenchmarkArtifactLifecycle;
  readonly materialFamily: ModelBenchmarkArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED SHARED VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface ModelBenchmarkArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'ledger' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

export interface ModelBenchmarkArtifactDependency {
  readonly purpose: string;
  readonly reference: SealedArtifactReference;
}

export interface ModelBenchmarkArtifactEventBinding {
  readonly eventStem: ModelBenchmarkEventStem;
  readonly eventId: string;
  readonly payloadDigest: string;
}

export interface ModelBenchmarkVisibilityPolicy {
  readonly candidateView: 'commitment-only' | 'verdict-band' | 'full';
  readonly hiddenCaseContent: 'withheld';
  readonly exactScores: 'withheld';
  readonly protectedJudgeEvidence: 'withheld';
  readonly evaluatorInternals: 'withheld';
  readonly terminalEvidence: 'withheld';
}

export interface ModelBenchmarkArtifactBaseMaterial {
  readonly schemaVersion: string;
  readonly artifactId: string;
  readonly evaluatorEpochId: string;
  readonly visibility: 'private' | 'public' | 'sealed';
  readonly dependencyReferences: readonly ModelBenchmarkArtifactDependency[];
  readonly originEvent: ModelBenchmarkArtifactEventBinding;
  readonly producerVersion: string;
  readonly locator: ModelBenchmarkArtifactLocator;
  readonly freshnessExpiresAt: string | null;
}

export interface ModelBenchmarkUsageEvidence {
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly reasoningTokens: number | null;
  readonly cacheReadTokens: number | null;
  readonly cacheWriteTokens: number | null;
  readonly realizedCostMicros: number | null;
  readonly errorCostMicros: number | null;
  readonly abstentionCostMicros: number | null;
}

export interface ModelBenchmarkLatencyEvidence {
  readonly ttftMs: number | null;
  readonly interTokenP50Ms: number | null;
  readonly endToEndMs: number | null;
  readonly tailP95Ms: number | null;
  readonly throughputTokensPerSecond: number | null;
  readonly sloViolationCount: number;
}

export interface ModelBenchmarkMatrixMembership {
  readonly matrixDigest: string;
  readonly modelId: string;
  readonly executorId: string;
  readonly taskFamilyId: string;
  readonly taskInstanceId: string;
  readonly anchorClass: 'common-anchor' | 'adaptive-diagnostic' | 'none';
  readonly pairedBlockId: string;
  readonly trialMatrixKey: TrialMatrixKey;
}

// ───────────────────────────────────────────────────────────────────
// 3. MODE MATERIAL SHAPES
// ───────────────────────────────────────────────────────────────────

export interface ModelBenchmarkRecipeArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly profileId: string;
  readonly profileVersion: string;
  readonly mode: 'model-benchmark';
  readonly modelDescriptorsDigest: string;
  readonly executorDescriptorsDigest: string;
  readonly frameworkDigest: string;
  readonly promptReferenceDigest: string;
  readonly fixtureManifestDigest: string;
  readonly taskFamilyManifestDigest: string;
  readonly samplePolicyDigest: string;
  readonly seedPolicyDigest: string;
  readonly matrixOrderingDigest: string;
  readonly scoringConfigurationDigest: string;
  readonly correctnessGateDigest: string;
  readonly reportingGroupCode: string;
  readonly workloadProfileDigest: string;
  readonly visibilityPolicy: ModelBenchmarkVisibilityPolicy;
  readonly modelExecutionCrossing: 'independent' | 'complete-stack';
}

export interface ModelBenchmarkRunManifestArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runId: string;
  readonly recipeReference: SealedArtifactReference;
  readonly recipeDigest: string;
  readonly modelSetDigest: string;
  readonly executorSetDigest: string;
  readonly frameworkDigest: string;
  readonly fixtureManifestDigest: string;
  readonly samplePolicyDigest: string;
  readonly seedPolicyDigest: string;
  readonly matrixOrderingDigest: string;
  readonly scoringPolicyDigest: string;
  readonly workloadProfileDigest: string;
  readonly matrixMembershipDigest: string;
  readonly cellReferences: readonly SealedArtifactReference[];
  readonly reportingGroupCode: string;
  readonly completeness: 'complete' | 'incomplete' | 'quarantined';
}

export interface ModelBenchmarkModelCellInputArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runId: string;
  readonly cellId: string;
  readonly matrixMembership: ModelBenchmarkMatrixMembership;
  readonly modelDescriptorDigest: string;
  readonly executorDescriptorDigest: string;
  readonly providerIdentityDigest: string;
  readonly buildVariantDigest: string;
  readonly resolvedCapabilityDigest: string;
  readonly permissionFingerprintDigest: string;
  readonly workflowPrefixDigest: string;
  readonly environmentSnapshotDigest: string;
  readonly frameworkTemplateDigest: string;
  readonly fixtureDigest: string;
  readonly sampleId: string;
  readonly seed: number;
  readonly promptVisibilityPolicy: 'public' | 'sealed' | 'withheld';
  readonly workloadProfileDigest: string;
  readonly prerequisiteReferences: readonly SealedArtifactReference[];
}

export interface ModelBenchmarkRawCellOutputArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runId: string;
  readonly cellId: string;
  readonly matrixDigest: string;
  readonly inputReference: SealedArtifactReference;
  readonly responseDigest: string;
  readonly responseReference: SealedArtifactReference;
  readonly trajectoryDigest: string;
  readonly trajectoryReference: SealedArtifactReference;
  readonly toolTraceDigest: string;
  readonly toolTraceReference: SealedArtifactReference;
  readonly itemObservationReferences: readonly SealedArtifactReference[];
  readonly scoreVectorDigest: string;
  readonly judgeObservationDigest: string;
  readonly usageStatus: 'complete' | 'missing' | 'partial';
  readonly usage: ModelBenchmarkUsageEvidence;
  readonly latency: ModelBenchmarkLatencyEvidence;
  readonly errorCode: string | null;
  readonly abstained: boolean;
  readonly retryCount: number;
  readonly integrityStatus: 'confirmed' | 'disputed' | 'inconclusive';
  readonly workloadProfileDigest: string;
}

export interface ModelBenchmarkScoringMatrixArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runReference: SealedArtifactReference;
  readonly matrixDigest: string;
  readonly rawObservationReferences: readonly SealedArtifactReference[];
  readonly itemRowsDigest: string;
  readonly familyRowsDigest: string;
  readonly modelExecutorCrossingsDigest: string;
  readonly anchorMembershipDigest: string;
  readonly adaptiveDiagnosticMembershipDigest: string;
  readonly rubricAxisObservationsDigest: string;
  readonly judgeCalibrationDigest: string;
  readonly pairedDeltasDigest: string;
  readonly uncertaintyDigest: string;
  readonly multiplicityTreatmentDigest: string;
  readonly selectionState: 'BLOCKED' | 'INCONCLUSIVE' | 'TIE' | 'WINNER';
  readonly winnerModelId: string | null;
}

export interface ModelBenchmarkCommonAnchorSelectionArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runReference: SealedArtifactReference;
  readonly matrixDigest: string;
  readonly commonAnchorReferences: readonly SealedArtifactReference[];
  readonly taskFamilyIds: readonly string[];
  readonly familyCoverageDigest: string;
  readonly selectionPolicyDigest: string;
  readonly confirmatoryStatus: 'confirmatory' | 'diagnostic-only' | 'inconclusive';
  readonly exclusionReasonCodes: readonly string[];
}

export interface ModelBenchmarkAdaptiveDiagnosticSelectionArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runReference: SealedArtifactReference;
  readonly matrixDigest: string;
  readonly selectedCaseReferences: readonly SealedArtifactReference[];
  readonly familyQuotaDigest: string;
  readonly informationInputsDigest: string;
  readonly selectionPolicyDigest: string;
  readonly propensityDigest: string;
  readonly confirmatoryStatus: 'blocked' | 'non-confirmatory' | 'confirmatory';
  readonly exclusionReasonCodes: readonly string[];
}

export interface ModelBenchmarkValidityEvidenceArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly matrixDigest: string;
  readonly candidateId: string;
  readonly taskFamilyId: string;
  readonly judgeCalibrationReference: SealedArtifactReference;
  readonly judgeCalibrationDigest: string;
  readonly rubricAxisValidationDigest: string;
  readonly oracleUncertainty: number;
  readonly protocolRobustnessDigest: string;
  readonly validityPolicyDigest: string;
  readonly validityState: 'blocked' | 'invalid' | 'unknown' | 'valid';
  readonly blockerCodes: readonly string[];
}

export interface ModelBenchmarkContaminationLineageArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly caseId: string;
  readonly sourceDate: string;
  readonly firstExposureAt: string | null;
  readonly disclosureAt: string | null;
  readonly retiredAt: string | null;
  readonly caseVisibility: 'private' | 'public' | 'sealed';
  readonly contaminationStatus: 'clean' | 'confirmed' | 'suspected' | 'unknown';
  readonly matchedEvidenceDigest: string;
  readonly semanticEvidenceDigest: string;
  readonly disclosureEvidenceDigest: string;
  readonly replacementCaseReference: SealedArtifactReference | null;
  readonly referenceModelDifficultyDigest: string;
  readonly evidenceReferences: readonly SealedArtifactReference[];
}

export interface ModelBenchmarkWorkloadEvidenceArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly runReference: SealedArtifactReference;
  readonly workloadProfileDigest: string;
  readonly contextLength: number;
  readonly concurrency: number;
  readonly trafficShapeDigest: string;
  readonly outputLength: number;
  readonly prefixReuseRatio: number;
  readonly multiTurnCount: number;
  readonly latency: ModelBenchmarkLatencyEvidence;
  readonly usageStatus: 'complete' | 'missing' | 'partial';
  readonly usage: ModelBenchmarkUsageEvidence;
  readonly switchingOverheadMicros: number | null;
}

export interface ModelBenchmarkSelectionEvidenceArtifactMaterial
  extends ModelBenchmarkArtifactBaseMaterial {
  readonly matrixReference: SealedArtifactReference;
  readonly matrixDigest: string;
  readonly validityEvidenceReferences: readonly SealedArtifactReference[];
  readonly workloadEvidenceReferences: readonly SealedArtifactReference[];
  readonly anchorEvidenceReference: SealedArtifactReference;
  readonly diagnosticEvidenceReference: SealedArtifactReference;
  readonly reductionPolicyDigest: string;
  readonly evidenceCompleteness: 'complete' | 'incomplete' | 'quarantined';
  readonly qualityGateStatus: 'blocked' | 'fail' | 'pass' | 'unknown';
  readonly operationalGateStatus: 'blocked' | 'fail' | 'pass' | 'unknown';
  readonly selectionState: 'BLOCKED' | 'INCONCLUSIVE' | 'TIE' | 'WINNER';
}

export interface ModelBenchmarkArtifactMaterialByKind {
  readonly 'model-benchmark-recipe': ModelBenchmarkRecipeArtifactMaterial;
  readonly 'model-benchmark-run-manifest': ModelBenchmarkRunManifestArtifactMaterial;
  readonly 'model-benchmark-model-cell-input': ModelBenchmarkModelCellInputArtifactMaterial;
  readonly 'model-benchmark-raw-cell-output': ModelBenchmarkRawCellOutputArtifactMaterial;
  readonly 'model-benchmark-scoring-matrix': ModelBenchmarkScoringMatrixArtifactMaterial;
  readonly 'model-benchmark-common-anchor-selection': ModelBenchmarkCommonAnchorSelectionArtifactMaterial;
  readonly 'model-benchmark-adaptive-diagnostic-selection': ModelBenchmarkAdaptiveDiagnosticSelectionArtifactMaterial;
  readonly 'model-benchmark-validity-evidence': ModelBenchmarkValidityEvidenceArtifactMaterial;
  readonly 'model-benchmark-contamination-lineage': ModelBenchmarkContaminationLineageArtifactMaterial;
  readonly 'model-benchmark-workload-evidence': ModelBenchmarkWorkloadEvidenceArtifactMaterial;
  readonly 'model-benchmark-selection-evidence': ModelBenchmarkSelectionEvidenceArtifactMaterial;
}

export type ModelBenchmarkArtifactMaterial =
  ModelBenchmarkArtifactMaterialByKind[ModelBenchmarkArtifactKind];

// ───────────────────────────────────────────────────────────────────
// 4. SEALED BINDINGS AND READ POLICY
// ───────────────────────────────────────────────────────────────────

export type ModelBenchmarkArtifactEventReference = string;

export interface ModelBenchmarkSealedArtifactBinding<
  TKind extends ModelBenchmarkArtifactKind = ModelBenchmarkArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: ModelBenchmarkArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface ModelBenchmarkVerifiedSealedArtifact<
  TKind extends ModelBenchmarkArtifactKind = ModelBenchmarkArtifactKind,
> {
  readonly binding: ModelBenchmarkSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
  readonly material: ModelBenchmarkArtifactMaterialByKind[TKind];
}

export interface ModelBenchmarkArtifactReadPolicy {
  readonly requiredEvaluatorEpochId?: string;
  readonly requiredMatrixDigest?: string;
  readonly requiredWorkloadProfileDigest?: string;
  readonly requiredVisibility?: 'private' | 'public' | 'sealed';
  readonly accessRole?: 'candidate' | 'downstream' | 'evaluator' | 'scorer';
  readonly requireFresh?: boolean;
  readonly requireCleanContamination?: boolean;
  readonly requireValidEvidence?: boolean;
  readonly requireCompleteUsage?: boolean;
  readonly now?: Date | (() => Date);
}

export const ModelBenchmarkArtifactReadFailureCodes = Object.freeze({
  CALIBRATION_INVALID: 'CALIBRATION_INVALID',
  CONTAMINATED: 'CONTAMINATED',
  DEPENDENCY_MISMATCH: 'DEPENDENCY_MISMATCH',
  EPOCH_MISMATCH: 'EPOCH_MISMATCH',
  INCOMPLETE: 'INCOMPLETE',
  MATRIX_MISMATCH: 'MATRIX_MISMATCH',
  STALE: 'STALE',
  VISIBILITY_MISMATCH: 'VISIBILITY_MISMATCH',
  WORKLOAD_MISMATCH: 'WORKLOAD_MISMATCH',
} as const);

export type ModelBenchmarkArtifactReadFailureCode =
  typeof ModelBenchmarkArtifactReadFailureCodes[
    keyof typeof ModelBenchmarkArtifactReadFailureCodes
  ];

export class ModelBenchmarkArtifactReadError extends Error {
  public readonly code: ModelBenchmarkArtifactReadFailureCode;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: ModelBenchmarkArtifactReadFailureCode,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'ModelBenchmarkArtifactReadError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type ModelBenchmarkLedgerScoreVector = ScoreVectorObservation;
