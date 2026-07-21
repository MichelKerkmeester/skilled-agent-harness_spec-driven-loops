// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Classification Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  FROZEN_CENSUS_CONTRACT,
  FROZEN_CENSUS_ROW_IDS,
  FROZEN_CENSUS_ROW_POLICIES,
  frozenPolicyFor,
} from './frozen-census-policy.js';
export {
  classificationFreshnessDigest,
  createClassificationManifest,
  isClassificationEvidence,
  serializeClassificationManifest,
  validateFrozenCensusDocument,
  verifyClassificationManifest,
} from './inflight-state-classifier.js';
export {
  createPhase014HandlingPlan,
  currentEvidenceForRow,
  evaluateModeCutoverReadiness,
  verifyPhase014HandlingPlan,
} from './phase-014-classification-gate.js';
export {
  ClassificationErrorCodes,
  ClassificationReasonCodes,
  InflightClassificationError,
  InflightDisposition,
} from './inflight-state-types.js';

export type { FrozenCensusRowId } from './frozen-census-policy.js';
export type {
  BlockProof,
  BuiltClassificationManifest,
  ClassificationClosure,
  ClassificationEvidence,
  ClassificationErrorCode,
  ClassificationReasonCode,
  ClassifiedEvidenceSnapshot,
  ClassifiedInflightStateRow,
  CreateClassificationManifestInput,
  DispositionProof,
  ForkProof,
  FrozenCensusContract,
  FrozenCensusRowPolicy,
  InflightClassificationManifest,
  InflightClassificationManifestCore,
  InflightDisposition as InflightDispositionType,
  LeaseState,
  LegacyAuthorityState,
  MigrateProof,
  ModeClassificationSummary,
  ModeCutoverReadiness,
  PendingEffectsState,
  Phase014EvidenceReceipts,
  Phase014HandlingInstruction,
  Phase014HandlingPlan,
  Phase014HandlingPlanCore,
  PinProof,
  RollbackAnchorEvidence,
  ShapeStatus,
  StateBackendCensus,
  StateBackendCensusRow,
  UpcastProof,
  VerifierEvidence,
  WorkflowMode,
} from './inflight-state-types.js';
