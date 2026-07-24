// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  AlignmentEvidenceLocator,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
} from '../deep-alignment-ledger-schema/index.js';
import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ARTIFACT KINDS
// ───────────────────────────────────────────────────────────────────

export const DeepAlignmentArtifactKinds = Object.freeze({
  AUTHORITY_CAPSULE: 'deep-alignment-authority-capsule',
  LANE_CONFIGURATION: 'deep-alignment-lane-configuration',
  RULE_MANIFEST: 'deep-alignment-rule-manifest',
  APPLICABILITY_DECISION: 'deep-alignment-applicability-decision',
  DISCOVERY_MANIFEST: 'deep-alignment-discovery-manifest',
  TARGET_SNAPSHOT: 'deep-alignment-target-snapshot',
  DETECTOR_INPUT: 'deep-alignment-detector-input',
  VERIFIER_INPUT: 'deep-alignment-verifier-input',
  WITNESS_MATRIX: 'deep-alignment-witness-matrix',
  FINDING_EVIDENCE: 'deep-alignment-finding-evidence',
  GOVERNED_EXCEPTION: 'deep-alignment-governed-exception',
  CONVERGENCE_SNAPSHOT: 'deep-alignment-convergence-snapshot',
  ALIGNMENT_REPORT: 'deep-alignment-alignment-report',
  RESUME_SAVE_HANDOFF: 'deep-alignment-resume-save-handoff',
} as const);

export type DeepAlignmentArtifactKind =
  typeof DeepAlignmentArtifactKinds[keyof typeof DeepAlignmentArtifactKinds];

export type DeepAlignmentArtifactLifecycle =
  | 'convergence/report'
  | 'init/scope'
  | 'iterate/check'
  | 'discover'
  | 'resume/save'
  | 'witness/exception';

export type DeepAlignmentArtifactMaterialFamily =
  | 'applicability'
  | 'authority'
  | 'convergence'
  | 'discovery'
  | 'exception'
  | 'finding'
  | 'handoff'
  | 'lane'
  | 'report'
  | 'rules'
  | 'target'
  | 'verification'
  | 'witness';

export interface DeepAlignmentArtifactKindRegistration {
  readonly artifactKind: DeepAlignmentArtifactKind;
  readonly lifecycle: DeepAlignmentArtifactLifecycle;
  readonly materialFamily: DeepAlignmentArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. SHARED MATERIAL SHAPES
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentArtifactLocator = AlignmentEvidenceLocator;
export type DeepAlignmentArtifactEventStem = DeepAlignmentEventStem;
export type DeepAlignmentLedgerEventType = DeepAlignmentLedgerEvent['event_type'];
export type DeepAlignmentArtifactReference = SealedArtifactReference;

export interface DeepAlignmentArtifactDependency {
  readonly artifactKind: DeepAlignmentArtifactKind;
  readonly reference: SealedArtifactReference;
}

export interface DeepAlignmentArtifactMaterialBase {
  readonly artifactId: string;
  readonly authorityEpochId: string;
  readonly materialDigest: string;
  readonly materialRef: string;
  readonly dependencies: readonly DeepAlignmentArtifactDependency[];
  readonly locator: DeepAlignmentArtifactLocator;
  readonly producerVersion: string;
}

export type DeepAlignmentVerdict =
  | 'blocked'
  | 'conformant'
  | 'inconclusive'
  | 'non-conformant'
  | 'not-applicable'
  | 'untested';

// ───────────────────────────────────────────────────────────────────
// 3. CLOSED MATERIAL SHAPES
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentAuthorityCapsuleMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly authorityId: string;
  readonly authoritySourceDigest: string;
  readonly publisherId: string;
  readonly compilerFingerprint: string;
  readonly ruleManifestDigest: string;
  readonly applicabilityPolicyDigest: string;
  readonly capabilityDigest: string;
  readonly coverageDigest: string;
  readonly signatureDigest: string;
  readonly expiresAt: string;
  readonly rollbackRef: string | null;
  readonly status: 'valid';
}

export interface DeepAlignmentLaneConfigurationMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly laneId: string;
  readonly artifactClass: string;
  readonly scopeDigest: string;
  readonly adapterContractDigest: string;
  readonly selectedCorpusDigest: string;
  readonly omittedScopeDigest: string;
  readonly unresolvedScopeDigest: string;
  readonly protectedFilesDigest: string;
}

export interface DeepAlignmentRuleManifestMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly manifestId: string;
  readonly orderedRuleIds: readonly string[];
  readonly compilerFingerprint: string;
  readonly ruleIrDigest: string;
  readonly applicabilityPolicyDigest: string;
  readonly ruleSchemaVersion: string;
}

export interface DeepAlignmentApplicabilityDecisionMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly decisionId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly subjectSnapshotDigest: string;
  readonly predicateDigest: string;
  readonly targetFactDigest: string;
  readonly authorityValidationDigest: string;
  readonly evaluatorFingerprint: string;
  readonly result: 'applicable' | 'blocked' | 'not-applicable' | 'unresolved';
  readonly reasonCode: string;
}

export interface DeepAlignmentDiscoveryManifestMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly manifestId: string;
  readonly laneId: string;
  readonly adapterContractDigest: string;
  readonly selectedScopeDigest: string;
  readonly artifactDigests: readonly string[];
  readonly omittedScopeDigest: string;
  readonly unresolvedScopeDigest: string;
  readonly corpusPartitionDigest: string;
  readonly watermarkDigest: string;
}

export interface DeepAlignmentTargetSnapshotMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly targetId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly subjectType: 'artifact' | 'directory' | 'file' | 'repository' | 'symbol';
  readonly sourceVersionDigest: string;
  readonly subjectDigest: string;
  readonly parentSnapshotDigest: string | null;
  readonly snapshotDigest: string;
  readonly capturedAt: string;
}

export type DeepAlignmentVerificationInputRole = 'detector' | 'verifier';

export interface DeepAlignmentVerificationInputMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly inputId: string;
  readonly laneId: string;
  readonly ruleId: string;
  readonly subjectSnapshotDigest: string;
  readonly applicabilityDecisionDigest: string;
  readonly inputDigest: string;
  readonly sourceDigest: string;
  readonly producerFingerprint: string;
  readonly evidenceDigests: readonly string[];
  readonly inputRole: DeepAlignmentVerificationInputRole;
}

export type DeepAlignmentWitnessKind =
  | 'boundary'
  | 'conforming'
  | 'relational'
  | 'stateful'
  | 'violating';

export interface DeepAlignmentWitnessMatrixMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly matrixId: string;
  readonly laneId: string;
  readonly ruleId: string;
  readonly subjectSnapshotDigest: string;
  readonly witnessKinds: readonly DeepAlignmentWitnessKind[];
  readonly witnessDigests: readonly string[];
  readonly replayRecipeDigests: readonly string[];
  readonly coverageGapDigests: readonly string[];
  readonly sourceAuthorityEpochId: string | null;
  readonly verifierFingerprint: string;
}

export interface DeepAlignmentFindingEvidenceMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly findingId: string;
  readonly laneId: string;
  readonly ruleId: string;
  readonly subjectSnapshotDigest: string;
  readonly authorityDigest: string;
  readonly applicabilityDecisionDigest: string;
  readonly observationDigest: string;
  readonly reProbeReceiptDigest: string;
  readonly evidenceDigests: readonly string[];
  readonly verifierFingerprint: string;
  readonly verifiedLevel: 'inconclusive' | 'verified';
  readonly evidenceClass: 'deterministic' | 'reasoning' | 'relational' | 'schema';
  readonly severity: 'P0' | 'P1' | 'P2' | 'none';
  readonly confidence: number;
}

export type DeepAlignmentExceptionStatus = 'active' | 'expired' | 'invalidated';
export type DeepAlignmentExceptionInvalidation =
  | 'authority-changed'
  | 'expired'
  | 'scope-changed'
  | 'subject-changed'
  | 'verifier-changed';

export interface DeepAlignmentGovernedExceptionMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly exceptionId: string;
  readonly findingDigest: string;
  readonly laneId: string;
  readonly ruleId: string;
  readonly subjectSnapshotDigest: string;
  readonly authorityDigest: string;
  readonly ownerId: string;
  readonly issuerId: string;
  readonly justificationReason: string;
  readonly scopeDigest: string;
  readonly verifierFingerprint: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly status: DeepAlignmentExceptionStatus;
  readonly invalidationTriggers: readonly DeepAlignmentExceptionInvalidation[];
  readonly invalidationReason: string | null;
}

export interface DeepAlignmentConvergenceSnapshotMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly snapshotId: string;
  readonly laneId: string;
  readonly orderedInputDigests: readonly string[];
  readonly coverageDigest: string;
  readonly stabilityDigest: string;
  readonly findingsViewDigest: string;
  readonly exceptionViewDigest: string;
  readonly unresolvedFindingDigests: readonly string[];
  readonly laneVerdict: DeepAlignmentVerdict;
  readonly evaluatorVersion: string;
  readonly watermarkDigest: string;
}

export interface DeepAlignmentReportMaterial extends DeepAlignmentArtifactMaterialBase {
  readonly reportId: string;
  readonly laneId: string;
  readonly orderedInputDigests: readonly string[];
  readonly convergenceSnapshotDigest: string;
  readonly findingsViewDigest: string;
  readonly exceptionViewDigest: string;
  readonly unresolvedFindingDigests: readonly string[];
  readonly laneVerdict: DeepAlignmentVerdict;
  readonly overallVerdict: DeepAlignmentVerdict;
  readonly reportDigest: string;
  readonly reportRef: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export type DeepAlignmentHandoffRole = 'resume' | 'save';
export type DeepAlignmentDriftStatus =
  | 'changed'
  | 'expired'
  | 'missing'
  | 'unchanged'
  | 'unverifiable';

export interface DeepAlignmentResumeSaveHandoffMaterial
  extends DeepAlignmentArtifactMaterialBase {
  readonly handoffId: string;
  readonly handoffRole: DeepAlignmentHandoffRole;
  readonly referenceSetDigest: string;
  readonly priorLineageDigest: string;
  readonly driftDigest: string;
  readonly affectedLaneDigests: readonly string[];
  readonly affectedFindingDigests: readonly string[];
  readonly continuityPayloadDigest: string;
  readonly offeredViewDigest: string;
  readonly offeredViewRef: string;
  readonly targetPacket: string;
  readonly driftStatus: DeepAlignmentDriftStatus;
  readonly handoffVersion: string;
}

export interface DeepAlignmentArtifactMaterialByKind {
  readonly 'deep-alignment-authority-capsule': DeepAlignmentAuthorityCapsuleMaterial;
  readonly 'deep-alignment-lane-configuration': DeepAlignmentLaneConfigurationMaterial;
  readonly 'deep-alignment-rule-manifest': DeepAlignmentRuleManifestMaterial;
  readonly 'deep-alignment-applicability-decision': DeepAlignmentApplicabilityDecisionMaterial;
  readonly 'deep-alignment-discovery-manifest': DeepAlignmentDiscoveryManifestMaterial;
  readonly 'deep-alignment-target-snapshot': DeepAlignmentTargetSnapshotMaterial;
  readonly 'deep-alignment-detector-input': DeepAlignmentVerificationInputMaterial;
  readonly 'deep-alignment-verifier-input': DeepAlignmentVerificationInputMaterial;
  readonly 'deep-alignment-witness-matrix': DeepAlignmentWitnessMatrixMaterial;
  readonly 'deep-alignment-finding-evidence': DeepAlignmentFindingEvidenceMaterial;
  readonly 'deep-alignment-governed-exception': DeepAlignmentGovernedExceptionMaterial;
  readonly 'deep-alignment-convergence-snapshot': DeepAlignmentConvergenceSnapshotMaterial;
  readonly 'deep-alignment-alignment-report': DeepAlignmentReportMaterial;
  readonly 'deep-alignment-resume-save-handoff': DeepAlignmentResumeSaveHandoffMaterial;
}

export type DeepAlignmentArtifactMaterial =
  DeepAlignmentArtifactMaterialByKind[DeepAlignmentArtifactKind];

// ───────────────────────────────────────────────────────────────────
// 4. SEALED BINDINGS
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentArtifactEventReference = string;

export interface DeepAlignmentSealedArtifactBinding<
  TKind extends DeepAlignmentArtifactKind = DeepAlignmentArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: DeepAlignmentArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface DeepAlignmentVerifiedSealedArtifact<
  TKind extends DeepAlignmentArtifactKind = DeepAlignmentArtifactKind,
> {
  readonly binding: DeepAlignmentSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

export interface DeepAlignmentReadOptions {
  readonly expectedAuthorityEpochId?: string;
  readonly now?: Date;
}
