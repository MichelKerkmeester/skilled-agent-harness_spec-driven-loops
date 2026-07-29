// MODULE: Model Benchmark Certificates and Receipts

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  ModelBenchmarkWireEventTypes,
} from '../model-benchmark-ledger-schema/index.js';
import {
  modelBenchmarkProjectionIntegrityDigest,
  foldModelBenchmarkEvents,
} from '../model-benchmark-reducers/index.js';
import {
  ModelBenchmarkArtifactKinds,
  ModelBenchmarkArtifactReadError,
  ModelBenchmarkArtifactReadFailureCodes,
  readModelBenchmarkArtifact,
} from '../model-benchmark-sealed-artifacts/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  BoundaryReceiptIssuer,
  BoundaryRegistry,
  certifyBoundaryReceipt,
  verifyBoundaryReceiptCertification,
  verifyBoundaryReceiptEvent,
} from '../receipts-and-effect-recovery/index.js';
import { deriveReplayFingerprint } from '../replay-fingerprint/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../sealed-reference-artifacts/index.js';
import {
  ModelBenchmarkCertificateError,
  ModelBenchmarkCertificateFailureCodes,
  ModelBenchmarkTransitionKinds,
} from './model-benchmark-certificate-types.js';
import {
  parseModelBenchmarkCertificateBundle,
  parseModelBenchmarkRunCertificate,
  parseModelBenchmarkTransitionReceipt,
} from './model-benchmark-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type {
  ModelBenchmarkLedgerEvent,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkProjectionState,
} from '../model-benchmark-reducers/index.js';
import type {
  ModelBenchmarkArtifactKind,
  ModelBenchmarkArtifactMaterial,
  ModelBenchmarkSealedArtifactBinding,
  ModelBenchmarkVerifiedSealedArtifact,
} from '../model-benchmark-sealed-artifacts/index.js';
import type { SealedArtifactReference } from '../sealed-reference-artifacts/index.js';
import type {
  BoundaryDefinition,
  BoundaryKind,
  BoundaryReceiptPayload,
  BoundaryScope,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModelBenchmarkCertificateArtifactClaim,
  ModelBenchmarkCertificateArtifactRole,
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkCertificateIssuerInput,
  ModelBenchmarkOfflineVerificationFailure,
  ModelBenchmarkOfflineVerificationInput,
  ModelBenchmarkOfflineVerificationResult,
  ModelBenchmarkReceiptIdentity,
  ModelBenchmarkRunCertificate,
  ModelBenchmarkRunCertificateBody,
  ModelBenchmarkTransitionKind,
  ModelBenchmarkTransitionOutcome,
  ModelBenchmarkTransitionReceipt,
  ModelBenchmarkTransitionReceiptContext,
  ModelBenchmarkTransitionReceiptFacts,
  ModelBenchmarkTransitionReceiptInput,
  ModelBenchmarkTransitionReceiptSubstrate,
} from './model-benchmark-certificate-types.js';

export const MODEL_BENCHMARK_CERTIFICATE_VERSION = 1 as const;
export const MODEL_BENCHMARK_RECEIPT_VERSION = 1 as const;
export const MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([] as const);

export const MODEL_BENCHMARK_REQUIRED_TRANSITION_ORDER = Object.freeze([
  ModelBenchmarkTransitionKinds.BENCHMARK_STARTED,
  ModelBenchmarkTransitionKinds.MODEL_CELL_STARTED,
  ModelBenchmarkTransitionKinds.MODEL_CELL_COMPLETED,
  ModelBenchmarkTransitionKinds.SCORE_MATRIX_REDUCED,
  ModelBenchmarkTransitionKinds.JUDGE_CALIBRATED,
  ModelBenchmarkTransitionKinds.CONTAMINATION_CHECKED,
  ModelBenchmarkTransitionKinds.DIAGNOSTIC_TAIL_ALLOCATED,
  ModelBenchmarkTransitionKinds.SELECTION_PROPOSED,
] as const);

export const MODEL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS = Object.freeze({
  'benchmark-recipe': ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
  'run-manifest': ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  'model-cell-input': ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
  'raw-cell-output': ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
  'scoring-matrix': ModelBenchmarkArtifactKinds.SCORING_MATRIX,
  'common-anchor-selection': ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
  'adaptive-diagnostic-selection':
    ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  'validity-evidence': ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
  'contamination-lineage': ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
  'workload-evidence': ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  'selection-evidence': ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
} as const satisfies Readonly<Record<
  ModelBenchmarkCertificateArtifactRole,
  ModelBenchmarkArtifactKind
>>);

const TRANSITION_EVENTS: Readonly<Record<
  ModelBenchmarkTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  benchmark_started: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.run_started'],
  ]),
  model_cell_started: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.trial_dispatched'],
  ]),
  model_cell_completed: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.trial_observation_recorded'],
  ]),
  score_matrix_reduced: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.score_vector_observed'],
  ]),
  judge_calibrated: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.judge_calibration_sealed'],
  ]),
  contamination_checked: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.contamination_evidence_recorded'],
  ]),
  diagnostic_tail_allocated: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.benchmark_design_declared'],
  ]),
  selection_proposed: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.selection_evidence_sealed'],
  ]),
  selection_blocked: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.validity_unknown_recorded'],
  ]),
  aborted: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.run_closed'],
  ]),
  restored: new Set([
    ModelBenchmarkWireEventTypes['model_benchmark.run_resumed'],
  ]),
});

const TRANSITION_OUTPUT_KINDS: Readonly<Record<
  ModelBenchmarkTransitionKind,
  ModelBenchmarkArtifactKind
>> = Object.freeze({
  benchmark_started: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  model_cell_started: ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
  model_cell_completed: ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
  score_matrix_reduced: ModelBenchmarkArtifactKinds.SCORING_MATRIX,
  judge_calibrated: ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
  contamination_checked: ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
  diagnostic_tail_allocated: ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  selection_proposed: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
  selection_blocked: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
  aborted: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  restored: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
});

const TRANSITION_INPUT_KINDS: Readonly<Record<
  ModelBenchmarkTransitionKind,
  readonly ModelBenchmarkArtifactKind[]
>> = Object.freeze({
  benchmark_started: Object.freeze([
    ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  ]),
  model_cell_started: Object.freeze([ModelBenchmarkArtifactKinds.RUN_MANIFEST]),
  model_cell_completed: Object.freeze([ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT]),
  score_matrix_reduced: Object.freeze([ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT]),
  judge_calibrated: Object.freeze([ModelBenchmarkArtifactKinds.SCORING_MATRIX]),
  contamination_checked: Object.freeze([ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT]),
  diagnostic_tail_allocated: Object.freeze([ModelBenchmarkArtifactKinds.SCORING_MATRIX]),
  selection_proposed: Object.freeze([
    ModelBenchmarkArtifactKinds.SCORING_MATRIX,
    ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
    ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
    ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  ]),
  selection_blocked: Object.freeze([
    ModelBenchmarkArtifactKinds.SCORING_MATRIX,
    ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
  ]),
  aborted: Object.freeze([]),
  restored: Object.freeze([]),
});

const TRANSITION_EVIDENCE_KINDS: Readonly<Record<
  ModelBenchmarkTransitionKind,
  readonly ModelBenchmarkArtifactKind[]
>> = Object.freeze({
  benchmark_started: Object.freeze([]),
  model_cell_started: Object.freeze([
    ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  ]),
  model_cell_completed: Object.freeze([]),
  score_matrix_reduced: Object.freeze([
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  ]),
  judge_calibrated: Object.freeze([]),
  contamination_checked: Object.freeze([]),
  diagnostic_tail_allocated: Object.freeze([
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
  ]),
  selection_proposed: Object.freeze([
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  ]),
  selection_blocked: Object.freeze([]),
  aborted: Object.freeze([]),
  restored: Object.freeze([]),
});

const TRANSITION_BOUNDARIES: Readonly<Record<
  ModelBenchmarkTransitionKind,
  Readonly<{
    kind: BoundaryKind;
    scope: BoundaryScope;
    fromState: string;
    toState: string;
  }>
>> = Object.freeze({
  benchmark_started: Object.freeze({
    kind: 'mode-enter',
    scope: 'mode',
    fromState: 'declared',
    toState: 'running',
  }),
  model_cell_started: Object.freeze({
    kind: 'phase-enter',
    scope: 'phase',
    fromState: 'admitted',
    toState: 'dispatched',
  }),
  model_cell_completed: Object.freeze({
    kind: 'phase-completion',
    scope: 'phase',
    fromState: 'dispatched',
    toState: 'observed',
  }),
  score_matrix_reduced: Object.freeze({
    kind: 'phase-handoff',
    scope: 'phase',
    fromState: 'observed',
    toState: 'reduced',
  }),
  judge_calibrated: Object.freeze({
    kind: 'phase-completion',
    scope: 'phase',
    fromState: 'reduced',
    toState: 'calibrated',
  }),
  contamination_checked: Object.freeze({
    kind: 'phase-completion',
    scope: 'phase',
    fromState: 'calibrated',
    toState: 'checked',
  }),
  diagnostic_tail_allocated: Object.freeze({
    kind: 'phase-handoff',
    scope: 'phase',
    fromState: 'checked',
    toState: 'allocated',
  }),
  selection_proposed: Object.freeze({
    kind: 'mode-handoff',
    scope: 'mode',
    fromState: 'allocated',
    toState: 'selected',
  }),
  selection_blocked: Object.freeze({
    kind: 'mode-pause',
    scope: 'mode',
    fromState: 'allocated',
    toState: 'blocked',
  }),
  aborted: Object.freeze({
    kind: 'mode-abort',
    scope: 'mode',
    fromState: 'running',
    toState: 'aborted',
  }),
  restored: Object.freeze({
    kind: 'mode-resume',
    scope: 'mode',
    fromState: 'paused',
    toState: 'running',
  }),
});

interface ArtifactEvidence {
  readonly claim: ModelBenchmarkCertificateArtifactClaim;
  readonly material: ModelBenchmarkArtifactMaterial;
}

interface VerifiedArtifactSet {
  readonly claims: readonly ModelBenchmarkCertificateArtifactClaim[];
  readonly byQualifiedDigest: ReadonlyMap<string, ArtifactEvidence>;
}

interface PreparedReceiptContext extends Omit<
  ModelBenchmarkTransitionReceiptContext,
  'artifactBindings' | 'artifactStore'
> {
  readonly artifacts: VerifiedArtifactSet;
}

function asJson(value: unknown): JsonObject {
  return value as JsonObject;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(asJson(value)));
}

function contentDigest(qualifiedDigest: string): string {
  const separator = qualifiedDigest.indexOf(':');
  return separator < 0 ? qualifiedDigest : qualifiedDigest.slice(separator + 1);
}

function record(value: unknown): Readonly<Record<string, unknown>> | null {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return null;
  return value as Readonly<Record<string, unknown>>;
}

function materialFrom(
  verified: ModelBenchmarkVerifiedSealedArtifact,
): ModelBenchmarkArtifactMaterial {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes do not contain a canonical Model Benchmark capsule',
    );
  }
  const capsule = record(decoded);
  const material = record(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || material === null) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes disagree with their sealed Model Benchmark binding',
    );
  }
  return material as unknown as ModelBenchmarkArtifactMaterial;
}

function roleFor(kind: ModelBenchmarkArtifactKind): ModelBenchmarkCertificateArtifactRole {
  for (const [role, expected] of Object.entries(MODEL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS)) {
    if (expected === kind) return role as ModelBenchmarkCertificateArtifactRole;
  }
  throw new ModelBenchmarkCertificateError(
    ModelBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
    `artifact:${kind}`,
    'Certificate binding uses an unregistered Model Benchmark artifact kind',
  );
}

function materialReference(
  value: unknown,
  location: string,
): SealedArtifactReference {
  const candidate = record(value);
  if (
    candidate === null
    || typeof candidate.artifact_kind !== 'string'
    || typeof candidate.qualified_digest !== 'string'
  ) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Typed sealed-reference field is missing or malformed',
    );
  }
  return value as SealedArtifactReference;
}

function materialReferences(
  value: unknown,
  location: string,
): readonly SealedArtifactReference[] {
  if (!Array.isArray(value)) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Typed sealed-reference collection is missing or malformed',
    );
  }
  return Object.freeze(value.map((entry, index) => (
    materialReference(entry, `${location}:${index}`)
  )));
}

function dependencyReferences(
  value: unknown,
  location: string,
): readonly SealedArtifactReference[] {
  if (!Array.isArray(value)) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Artifact dependency collection is missing or malformed',
    );
  }
  return Object.freeze(value.map((entry, index) => {
    const dependency = record(entry);
    if (dependency === null || typeof dependency.purpose !== 'string') {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        `${location}:${index}`,
        'Artifact dependency entry is missing its purpose or reference',
      );
    }
    return materialReference(
      dependency.reference,
      `${location}:${index}:reference`,
    );
  }));
}

async function requireTypedReference(
  store: ModelBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  artifacts: VerifiedArtifactSet,
  reference: SealedArtifactReference,
  expectedKind: ModelBenchmarkArtifactKind | null,
  location: string,
): Promise<void> {
  if (expectedKind !== null && reference.artifact_kind !== expectedKind) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
      location,
      'Typed sealed reference names the wrong artifact kind',
    );
  }
  if (expectedKind !== null) {
    const owned = artifacts.byQualifiedDigest.get(reference.qualified_digest);
    if (
      owned === undefined
      || owned.claim.expectedArtifactKind !== expectedKind
      || canonicalJson(asJson(owned.claim.binding.reference)) !== canonicalJson(asJson(reference))
    ) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        location,
        'Typed sealed reference is not owned by the verified certificate artifact set',
      );
    }
  }
  await store.readVerified(reference, expectedKind ?? reference.artifact_kind);
}

async function verifyTypedReferenceClosure(
  store: ModelBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  artifacts: VerifiedArtifactSet,
): Promise<void> {
  for (const evidence of artifacts.byQualifiedDigest.values()) {
    const material = record(evidence.material);
    if (material === null) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
        `artifact:${evidence.claim.role}`,
        'Verified artifact material is not a closed object',
      );
    }
    const dependencies = dependencyReferences(
      material.dependencyReferences,
      `artifact:${evidence.claim.role}:dependencyReferences`,
    );
    for (const dependency of dependencies) {
      await requireTypedReference(store, artifacts, dependency, null, `artifact:${evidence.claim.role}:dependencyReferences`);
    }
    switch (evidence.claim.expectedArtifactKind) {
      case ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE:
        break;
      case ModelBenchmarkArtifactKinds.RUN_MANIFEST:
        await requireTypedReference(
          store,
          artifacts,
          materialReference(material.recipeReference, 'artifact:run-manifest:recipeReference'),
          ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
          'artifact:run-manifest:recipeReference',
        );
        for (const reference of materialReferences(material.cellReferences, 'artifact:run-manifest:cellReferences')) {
          await requireTypedReference(store, artifacts, reference, ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, 'artifact:run-manifest:cellReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT:
        for (const reference of materialReferences(material.prerequisiteReferences, 'artifact:model-cell-input:prerequisiteReferences')) {
          await requireTypedReference(store, artifacts, reference, null, 'artifact:model-cell-input:prerequisiteReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT:
        await requireTypedReference(store, artifacts, materialReference(material.inputReference, 'artifact:raw-cell-output:inputReference'), ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, 'artifact:raw-cell-output:inputReference');
        for (const field of ['responseReference', 'trajectoryReference', 'toolTraceReference'] as const) {
          await requireTypedReference(store, artifacts, materialReference(material[field], `artifact:raw-cell-output:${field}`), null, `artifact:raw-cell-output:${field}`);
        }
        for (const reference of materialReferences(material.itemObservationReferences, 'artifact:raw-cell-output:itemObservationReferences')) {
          await requireTypedReference(store, artifacts, reference, null, 'artifact:raw-cell-output:itemObservationReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.SCORING_MATRIX:
        await requireTypedReference(store, artifacts, materialReference(material.runReference, 'artifact:scoring-matrix:runReference'), ModelBenchmarkArtifactKinds.RUN_MANIFEST, 'artifact:scoring-matrix:runReference');
        for (const reference of materialReferences(material.rawObservationReferences, 'artifact:scoring-matrix:rawObservationReferences')) {
          await requireTypedReference(store, artifacts, reference, ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, 'artifact:scoring-matrix:rawObservationReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION:
        await requireTypedReference(store, artifacts, materialReference(material.runReference, 'artifact:common-anchor-selection:runReference'), ModelBenchmarkArtifactKinds.RUN_MANIFEST, 'artifact:common-anchor-selection:runReference');
        for (const reference of materialReferences(material.commonAnchorReferences, 'artifact:common-anchor-selection:commonAnchorReferences')) {
          await requireTypedReference(store, artifacts, reference, null, 'artifact:common-anchor-selection:commonAnchorReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION:
        await requireTypedReference(store, artifacts, materialReference(material.runReference, 'artifact:adaptive-diagnostic-selection:runReference'), ModelBenchmarkArtifactKinds.RUN_MANIFEST, 'artifact:adaptive-diagnostic-selection:runReference');
        for (const reference of materialReferences(material.selectedCaseReferences, 'artifact:adaptive-diagnostic-selection:selectedCaseReferences')) {
          await requireTypedReference(store, artifacts, reference, null, 'artifact:adaptive-diagnostic-selection:selectedCaseReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE:
        await requireTypedReference(store, artifacts, materialReference(material.judgeCalibrationReference, 'artifact:validity-evidence:judgeCalibrationReference'), null, 'artifact:validity-evidence:judgeCalibrationReference');
        break;
      case ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE:
        if (material.replacementCaseReference !== null) {
          await requireTypedReference(store, artifacts, materialReference(material.replacementCaseReference, 'artifact:contamination-lineage:replacementCaseReference'), null, 'artifact:contamination-lineage:replacementCaseReference');
        }
        for (const reference of materialReferences(material.evidenceReferences, 'artifact:contamination-lineage:evidenceReferences')) {
          await requireTypedReference(store, artifacts, reference, null, 'artifact:contamination-lineage:evidenceReferences');
        }
        break;
      case ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE:
        await requireTypedReference(store, artifacts, materialReference(material.runReference, 'artifact:workload-evidence:runReference'), ModelBenchmarkArtifactKinds.RUN_MANIFEST, 'artifact:workload-evidence:runReference');
        break;
      case ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE:
        await requireTypedReference(store, artifacts, materialReference(material.matrixReference, 'artifact:selection-evidence:matrixReference'), ModelBenchmarkArtifactKinds.SCORING_MATRIX, 'artifact:selection-evidence:matrixReference');
        for (const reference of materialReferences(material.validityEvidenceReferences, 'artifact:selection-evidence:validityEvidenceReferences')) {
          await requireTypedReference(store, artifacts, reference, ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, 'artifact:selection-evidence:validityEvidenceReferences');
        }
        for (const reference of materialReferences(material.workloadEvidenceReferences, 'artifact:selection-evidence:workloadEvidenceReferences')) {
          await requireTypedReference(store, artifacts, reference, ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE, 'artifact:selection-evidence:workloadEvidenceReferences');
        }
        await requireTypedReference(store, artifacts, materialReference(material.anchorEvidenceReference, 'artifact:selection-evidence:anchorEvidenceReference'), ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION, 'artifact:selection-evidence:anchorEvidenceReference');
        await requireTypedReference(store, artifacts, materialReference(material.diagnosticEvidenceReference, 'artifact:selection-evidence:diagnosticEvidenceReference'), ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION, 'artifact:selection-evidence:diagnosticEvidenceReference');
        break;
      default: {
        const exhaustive: never = evidence.claim.expectedArtifactKind;
        throw new ModelBenchmarkCertificateError(
          ModelBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
          'artifact:closure',
          `Unsupported Model Benchmark artifact kind ${String(exhaustive)}`,
        );
      }
    }
  }
}

async function verifiedArtifactSet(
  store: ModelBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly ModelBenchmarkSealedArtifactBinding[],
  evaluatorEpochId: string,
  verificationTime: string,
): Promise<VerifiedArtifactSet> {
  const claims: ModelBenchmarkCertificateArtifactClaim[] = [];
  const byQualifiedDigest = new Map<string, ArtifactEvidence>();
  for (const binding of bindings) {
    const verified = await readModelBenchmarkArtifact(
      store,
      binding,
      {
        requiredEvaluatorEpochId: evaluatorEpochId,
        accessRole: 'evaluator',
        requireFresh: true,
        requireCleanContamination:
          binding.artifactKind === ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
        requireValidEvidence:
          binding.artifactKind === ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
        requireCompleteUsage:
          binding.artifactKind === ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT
          || binding.artifactKind === ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE
          || binding.artifactKind === ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
        now: new Date(verificationTime),
      },
    );
    const role = roleFor(verified.binding.artifactKind);
    const expectedArtifactKind = MODEL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS[role];
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (byQualifiedDigest.has(qualifiedDigest)) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        'artifact:set',
        'Certificate artifact identities must be unique',
      );
    }
    const claim: ModelBenchmarkCertificateArtifactClaim = Object.freeze({
      role,
      expectedArtifactKind,
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    const evidence = Object.freeze({ claim, material: materialFrom(verified) });
    claims.push(claim);
    byQualifiedDigest.set(qualifiedDigest, evidence);
  }
  const roles = claims.map((claim) => claim.role);
  const requiredRoles = Object.keys(
    MODEL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS,
  ) as ModelBenchmarkCertificateArtifactRole[];
  const singletonRoles = new Set<ModelBenchmarkCertificateArtifactRole>([
    'adaptive-diagnostic-selection',
    'benchmark-recipe',
    'common-anchor-selection',
    'run-manifest',
    'scoring-matrix',
    'selection-evidence',
  ]);
  if (requiredRoles.some((role) => !roles.includes(role))) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      'artifact:roles',
      'Certificate requires every registered Model Benchmark evidence role',
    );
  }
  for (const role of singletonRoles) {
    if (roles.filter((candidate) => candidate === role).length !== 1) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        `artifact:roles:${role}`,
        'Singleton certificate artifact role must resolve exactly once',
      );
    }
  }
  claims.sort((left, right) => (
    `${left.role}:${left.binding.reference.qualified_digest}`
      .localeCompare(`${right.role}:${right.binding.reference.qualified_digest}`)
  ));
  const artifacts = Object.freeze({ claims: Object.freeze(claims), byQualifiedDigest });
  await verifyTypedReferenceClosure(store, artifacts);
  return artifacts;
}

function findEvent(
  events: readonly VerifiedLedgerEvent[],
  eventId: string,
): VerifiedLedgerEvent {
  const matches = events.filter(
    (event) => event.event.effective.envelope.event_id === eventId,
  );
  if (matches.length !== 1) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `event:${eventId}`,
      'Transition result must resolve exactly once in the verified authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function eventPayload(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  return event.event.effective.envelope.payload as Readonly<Record<string, unknown>>;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const data = record(eventPayload(event).data);
  if (data === null) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Authorized Model Benchmark event lacks its closed data object',
    );
  }
  return data;
}

function outcomeFor(
  transitionKind: ModelBenchmarkTransitionKind,
  event: VerifiedLedgerEvent,
): ModelBenchmarkTransitionOutcome {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENTS[transitionKind].has(eventType)) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${transitionKind}`,
      'Transition kind does not match its authorized result event type',
    );
  }
  const data = eventData(event);
  switch (transitionKind) {
    case 'selection_blocked':
      return data.blocker === true ? 'vetoed' : 'uncertain';
    case 'aborted':
      return data.terminalOutcome === 'aborted' ? 'vetoed' : 'uncertain';
    case 'restored':
      return data.compatibilityDecision === 'exact'
        || data.compatibilityDecision === 'compatible'
        ? 'recovered'
        : data.compatibilityDecision === 'blocked'
          ? 'vetoed'
          : 'uncertain';
    default:
      return 'completed';
  }
}

export function deriveModelBenchmarkReceiptIdentity(
  runId: string,
  input: ModelBenchmarkTransitionReceiptInput,
): ModelBenchmarkReceiptIdentity {
  const core = Object.freeze({
    identityVersion: 1 as const,
    runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
    effectIdempotencyKey: input.effectIdempotencyKey,
  });
  return Object.freeze({ ...core, digest: digest(core) });
}

function assertArtifactVector(
  input: ModelBenchmarkTransitionReceiptInput,
  context: Pick<PreparedReceiptContext, 'artifacts' | 'ledgerEvents'>,
): void {
  const expectedOutputKind = TRANSITION_OUTPUT_KINDS[input.transitionKind];
  if (input.outputArtifactQualifiedDigests.length !== 1) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      `transition:${input.transitionKind}:outputs`,
      'Each mode-specific transition owns exactly one sealed output',
    );
  }
  const combined = [
    ...input.inputArtifactQualifiedDigests,
    ...input.outputArtifactQualifiedDigests,
    ...input.evidenceArtifactQualifiedDigests,
  ];
  if (new Set(combined).size !== combined.length) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Receipt artifact roles must not alias one another',
    );
  }
  for (const reference of combined) {
    if (!context.artifacts.byQualifiedDigest.has(reference)) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_MISSING,
        `transition:${input.transitionKind}:artifacts`,
        'Receipt references an artifact outside the verified certificate set',
      );
    }
  }
  const output = context.artifacts.byQualifiedDigest.get(
    input.outputArtifactQualifiedDigests[0] as string,
  );
  if (output?.claim.expectedArtifactKind !== expectedOutputKind) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
      `transition:${input.transitionKind}:outputs`,
      'Receipt output is not the expected mode-specific artifact kind',
    );
  }
  const expectedInputs = TRANSITION_INPUT_KINDS[input.transitionKind];
  const actualInputs = input.inputArtifactQualifiedDigests.map((reference) => (
    context.artifacts.byQualifiedDigest.get(reference)?.claim.expectedArtifactKind
  ));
  if (canonicalJson(asJson(expectedInputs)) !== canonicalJson(asJson(actualInputs))) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:inputs`,
      'Receipt inputs do not preserve the exact ordered dependency closure',
    );
  }
  const expectedEvidence = TRANSITION_EVIDENCE_KINDS[input.transitionKind];
  const actualEvidence = input.evidenceArtifactQualifiedDigests.map((reference) => (
    context.artifacts.byQualifiedDigest.get(reference)?.claim.expectedArtifactKind
  ));
  if (canonicalJson(asJson(expectedEvidence)) !== canonicalJson(asJson(actualEvidence))) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:evidence`,
      'Receipt evidence does not preserve the exact ordered evidence closure',
    );
  }
}

function assertArtifactOwnedByEvent(
  input: ModelBenchmarkTransitionReceiptInput,
  event: VerifiedLedgerEvent,
  artifacts: VerifiedArtifactSet,
): void {
  const output = artifacts.byQualifiedDigest.get(
    input.outputArtifactQualifiedDigests[0] as string,
  );
  const origin = output?.material.originEvent;
  const payload = eventPayload(event);
  if (
    origin === undefined
    || origin.eventId !== event.event.effective.envelope.event_id
    || origin.eventStem !== payload.stem
    || origin.payloadDigest !== payload.payloadDigest
  ) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${input.transitionKind}:owner`,
      'Receipt output has no matching authorized origin event',
    );
  }
}

function buildReceiptFacts(
  input: ModelBenchmarkTransitionReceiptInput,
  context: Omit<PreparedReceiptContext, 'receiptSubstrate' | 'certificationProfile' | 'providers' | 'issuer' | 'issuedAt'>,
): ModelBenchmarkTransitionReceiptFacts {
  assertArtifactVector(input, context);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  assertArtifactOwnedByEvent(input, event, context.artifacts);
  const identity = deriveModelBenchmarkReceiptIdentity(context.runId, input);
  const predecessorReceiptDigests = context.priorReceipts.length === 0
    ? []
    : [context.priorReceipts.at(-1)!.receiptDigest];
  const factsCore = Object.freeze({
    receiptVersion: MODEL_BENCHMARK_RECEIPT_VERSION,
    identity,
    predecessorReceiptDigests: Object.freeze(predecessorReceiptDigests),
    commonReceiptIdentities: Object.freeze([...context.commonReceiptIdentities]),
    runId: context.runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
    effectIdempotencyKey: input.effectIdempotencyKey,
    attemptNumber: input.attemptNumber,
    resultEventId: input.resultEventId,
    resultEventType: event.event.effective.envelope.event_type,
    resultEventDigest: event.event.stored.digest,
    authorizationDecisionDigest: event.frame.authorization_ref.decision_digest,
    fromHeadHash: event.frame.prev_record_hash,
    resultHeadHash: event.frame.record_hash,
    inputArtifactQualifiedDigests: Object.freeze([...input.inputArtifactQualifiedDigests]),
    outputArtifactQualifiedDigests: Object.freeze([...input.outputArtifactQualifiedDigests]),
    evidenceArtifactQualifiedDigests: Object.freeze([...input.evidenceArtifactQualifiedDigests]),
    outcome: outcomeFor(input.transitionKind, event),
    substrateReplayFingerprint: context.substrateReplayFingerprint,
    authorityEpoch: event.event.effective.envelope.authority_epoch,
  });
  return Object.freeze({
    ...factsCore,
    transitionFingerprint: digest(factsCore),
  });
}

function boundaryDefinition(
  facts: ModelBenchmarkTransitionReceiptFacts,
): BoundaryDefinition {
  const profile = TRANSITION_BOUNDARIES[facts.transitionKind];
  return Object.freeze({
    boundaryKind: profile.kind,
    scope: profile.scope,
    action: profile.kind.slice(profile.kind.indexOf('-') + 1) as BoundaryDefinition['action'],
    resultEventType: facts.resultEventType,
    allowedFromStates: Object.freeze([profile.fromState]),
    toState: profile.toState,
    resultCode: facts.outcome,
  });
}

function projectBoundaryResult(
  event: VerifiedLedgerEvent,
  facts: ModelBenchmarkTransitionReceiptFacts,
  receiptDigest: string,
): VerifiedLedgerEvent {
  const profile = TRANSITION_BOUNDARIES[facts.transitionKind];
  return Object.freeze({
    ...event,
    event: Object.freeze({
      ...event.event,
      effective: Object.freeze({
        ...event.event.effective,
        envelope: Object.freeze({
          ...event.event.effective.envelope,
          payload: Object.freeze({
            boundary_id: facts.identity.digest,
            scope_id: facts.runId,
            from_state: profile.fromState,
            to_state: profile.toState,
            result_code: facts.outcome,
            evidence_digest: receiptDigest,
            artifact_digests: [
              ...facts.inputArtifactQualifiedDigests,
              ...facts.outputArtifactQualifiedDigests,
            ].map(contentDigest),
            replay_fingerprint: facts.substrateReplayFingerprint,
          }),
        }),
      }),
    }),
  });
}

function boundaryWriter(
  substrate: ModelBenchmarkTransitionReceiptSubstrate,
  projected: VerifiedLedgerEvent,
) {
  const eventId = projected.event.effective.envelope.event_id;
  return Object.freeze({
    append: substrate.writer.append.bind(substrate.writer),
    findEvent: substrate.writer.findEvent.bind(substrate.writer),
    async readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]> {
      const events = await substrate.writer.readVerifiedEvents();
      return Object.freeze(events.map((event) => (
        event.event.effective.envelope.event_id === eventId ? projected : event
      )));
    },
  });
}

async function issueSharedReceipt(
  facts: ModelBenchmarkTransitionReceiptFacts,
  receiptDigest: string,
  event: VerifiedLedgerEvent,
  context: PreparedReceiptContext,
): Promise<BoundaryReceiptPayload> {
  const definition = boundaryDefinition(facts);
  const issuer = new BoundaryReceiptIssuer({
    writer: boundaryWriter(
      context.receiptSubstrate,
      projectBoundaryResult(event, facts, receiptDigest),
    ),
    registry: context.receiptSubstrate.registry,
    boundaries: new BoundaryRegistry([definition]),
    providers: context.providers,
    producer: context.receiptSubstrate.producer,
    now: () => new Date(context.issuedAt),
  });
  const issued = await issuer.issue({
    boundaryId: facts.identity.digest,
    boundaryKind: definition.boundaryKind,
    scopeId: facts.runId,
    resultEventId: facts.resultEventId,
    issuer: context.issuer,
    certificationProfile: context.certificationProfile,
    issuedAt: context.issuedAt,
  });
  return issued.payload;
}

async function issueReceiptPrepared(
  input: ModelBenchmarkTransitionReceiptInput,
  context: PreparedReceiptContext,
): Promise<ModelBenchmarkTransitionReceipt> {
  const facts = buildReceiptFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  const sharedReceipt = await issueSharedReceipt(facts, receiptDigest, event, context);
  return parseModelBenchmarkTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

export async function issueModelBenchmarkTransitionReceipt(
  input: ModelBenchmarkTransitionReceiptInput,
  context: ModelBenchmarkTransitionReceiptContext,
): Promise<ModelBenchmarkTransitionReceipt> {
  const artifacts = await verifiedArtifactSet(
    context.artifactStore,
    context.artifactBindings,
    context.evaluatorEpochId,
    context.verificationTime,
  );
  return issueReceiptPrepared(input, { ...context, artifacts });
}

function assertProjectionMatchesLedger(
  projectionEvents: readonly ModelBenchmarkLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verified = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verified))) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:ledger-events',
      'Projection events differ from the ordered authorized-ledger replay range',
      digest(verified),
      digest(projectionEvents),
    );
  }
}

function projectionFacts(projection: ModelBenchmarkProjectionState) {
  const run = projection.modelBenchmark.run;
  const variant = projection.modelBenchmark;
  if (
    run.runId === null
    || run.lineageId === null
    || run.generation === null
    || variant.modeStatus.activeMatrixProfile === null
  ) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.INCOMPLETE_RUN,
      'projection:terminal-evidence',
      'Run lacks reducer-derived lineage or matrix profile evidence',
    );
  }
  return Object.freeze({
    runId: run.runId,
    lineageId: run.lineageId,
    generation: run.generation,
    matrixProfileId: variant.modeStatus.activeMatrixProfile,
    matrixCoverage: variant.modeStatus.matrixCoverage,
    rankingState: variant.modeStatus.rankingState,
    blockingCellKeys: Object.freeze([...variant.modeStatus.blockingCellKeys]),
    blockingVetoCodes: Object.freeze([...variant.modeStatus.blockingVetoCodes]),
    unresolvedEvidenceRefs: Object.freeze([
      ...variant.iterationConvergence.unresolvedEvidenceRefs,
    ]),
  });
}

function evidenceForRole(
  artifacts: VerifiedArtifactSet,
  role: ModelBenchmarkCertificateArtifactRole,
): readonly ArtifactEvidence[] {
  return Object.freeze([...artifacts.byQualifiedDigest.values()]
    .filter((evidence) => evidence.claim.role === role)
    .sort((left, right) => left.claim.binding.reference.qualified_digest.localeCompare(
      right.claim.binding.reference.qualified_digest,
    )));
}

function requiredMaterialString(
  material: ModelBenchmarkArtifactMaterial,
  field: string,
  location: string,
): string {
  const value = record(material)?.[field];
  if (typeof value !== 'string') {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Required sealed material identity is missing',
    );
  }
  return value;
}

function singletonEvidence(
  artifacts: VerifiedArtifactSet,
  role: ModelBenchmarkCertificateArtifactRole,
): ArtifactEvidence {
  const evidence = evidenceForRole(artifacts, role);
  if (evidence.length !== 1) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      `artifact:${role}`,
      'Certificate requires one artifact for this singleton role',
    );
  }
  return evidence[0] as ArtifactEvidence;
}

function artifactFacts(artifacts: VerifiedArtifactSet) {
  const recipe = singletonEvidence(artifacts, 'benchmark-recipe');
  const runManifest = singletonEvidence(artifacts, 'run-manifest');
  const scoringMatrix = singletonEvidence(artifacts, 'scoring-matrix');
  const commonAnchor = singletonEvidence(artifacts, 'common-anchor-selection');
  const diagnostic = singletonEvidence(artifacts, 'adaptive-diagnostic-selection');
  const selection = singletonEvidence(artifacts, 'selection-evidence');
  const workload = evidenceForRole(artifacts, 'workload-evidence');
  const modelCells = evidenceForRole(artifacts, 'model-cell-input');
  const rawObservations = evidenceForRole(artifacts, 'raw-cell-output');
  const validity = evidenceForRole(artifacts, 'validity-evidence');
  const contamination = evidenceForRole(artifacts, 'contamination-lineage');
  const matrixDigest = requiredMaterialString(
    scoringMatrix.material,
    'matrixDigest',
    'artifact:scoring-matrix:matrixDigest',
  );
  const workloadDigests = new Set(workload.map((evidence) => (
    requiredMaterialString(
      evidence.material,
      'workloadProfileDigest',
      'artifact:workload-evidence:workloadProfileDigest',
    )
  )));
  if (workloadDigests.size !== 1) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:workload-profile',
      'Workload evidence does not share one workload profile identity',
    );
  }
  const selectionState = requiredMaterialString(
    selection.material,
    'selectionState',
    'artifact:selection-evidence:selectionState',
  ) as ModelBenchmarkRunCertificateBody['selectionState'];
  const scoringSelectionState = requiredMaterialString(
    scoringMatrix.material,
    'selectionState',
    'artifact:scoring-matrix:selectionState',
  );
  if (selectionState !== scoringSelectionState) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:selection-state',
      'Scoring matrix and selection evidence disagree on selection state',
    );
  }
  const winnerModelId = record(scoringMatrix.material)?.winnerModelId;
  if (winnerModelId !== null && typeof winnerModelId !== 'string') {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:scoring-matrix:winnerModelId',
      'Scoring matrix winner identity is malformed',
    );
  }
  const qualified = (evidence: ArtifactEvidence) =>
    evidence.claim.binding.reference.qualified_digest;
  return Object.freeze({
    matrixDigest,
    workloadProfileDigest: [...workloadDigests][0] as string,
    selectionState,
    winnerModelId: winnerModelId as string | null,
    recipeQualifiedDigest: qualified(recipe),
    runManifestQualifiedDigest: qualified(runManifest),
    modelCellInputQualifiedDigests: Object.freeze(modelCells.map(qualified)),
    rawObservationQualifiedDigests: Object.freeze(rawObservations.map(qualified)),
    scoringMatrixQualifiedDigest: qualified(scoringMatrix),
    commonAnchorQualifiedDigest: qualified(commonAnchor),
    diagnosticSelectionQualifiedDigest: qualified(diagnostic),
    validityEvidenceQualifiedDigests: Object.freeze(validity.map(qualified)),
    contaminationEvidenceQualifiedDigests: Object.freeze(contamination.map(qualified)),
    workloadEvidenceQualifiedDigests: Object.freeze(workload.map(qualified)),
    selectionEvidenceQualifiedDigest: qualified(selection),
  });
}

function assertTrustedTerminal(
  projection: ModelBenchmarkProjectionState,
  artifacts: VerifiedArtifactSet,
  commonBundle: DeepImprovementCommonCertificateBundle,
  receipts: readonly ModelBenchmarkTransitionReceipt[],
): void {
  const variant = projection.modelBenchmark;
  const selection = singletonEvidence(artifacts, 'selection-evidence');
  const selectionMaterial = record(selection.material);
  const invalidLifecycle =
    variant.run.state !== 'closed'
    || variant.run.terminalOutcome !== 'completed'
    || variant.modeStatus.matrixCoverage !== 1
    || variant.modeStatus.rankingState !== 'ranked'
    || variant.modeStatus.blockingCellKeys.length !== 0
    || variant.modeStatus.blockingVetoCodes.length !== 0
    || variant.iterationConvergence.unresolvedEvidenceRefs.length !== 0
    || variant.iterationConvergence.paused
    || variant.iterationConvergence.cells.length === 0
    || variant.iterationConvergence.cells.some((cell) => cell.disposition !== 'scored')
    || variant.scoringMatrix.validity.length === 0
    || variant.scoringMatrix.validity.some((entry) => entry.state !== 'valid')
    || variant.scoringMatrix.validityUnknowns.length !== 0
    || variant.scoringMatrix.contaminationEvidence.length === 0
    || variant.scoringMatrix.contaminationEvidence.some(
      (entry) => entry.contaminationStatus !== 'clean',
    )
    || variant.scoringMatrix.judgeObservations.some((entry) => (
      entry.abstained
      || entry.orderProbeOutcome !== 'pass'
      || entry.styleProbeOutcome !== 'pass'
      || entry.disagreementState === 'unknown'
      || entry.disagreementState === 'not-observed'
    ))
    || commonBundle.certificate.body.verdict !== 'PASS'
    || receipts.some((receipt) => receipt.facts.outcome !== 'completed')
    || selectionMaterial?.evidenceCompleteness !== 'complete'
    || selectionMaterial?.qualityGateStatus !== 'pass'
    || selectionMaterial?.operationalGateStatus !== 'pass'
    || !['TIE', 'WINNER'].includes(String(selectionMaterial?.selectionState));
  if (invalidLifecycle) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.LIFECYCLE_INVALID,
      'certificate:lifecycle',
      'Model Benchmark evidence does not establish a complete unblocked terminal run',
    );
  }
}

function assertTransitionOrder(receipts: readonly ModelBenchmarkTransitionReceipt[]): void {
  if (receipts.length !== MODEL_BENCHMARK_REQUIRED_TRANSITION_ORDER.length) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      'receipt:count',
      'Complete Model Benchmark evidence requires the full mode-specific receipt chain',
    );
  }
  receipts.forEach((receipt, index) => {
    if (receipt.facts.transitionKind !== MODEL_BENCHMARK_REQUIRED_TRANSITION_ORDER[index]) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:order`,
        'Mode-specific receipts are out of lifecycle order',
      );
    }
    const expectedPredecessors = index === 0 ? [] : [receipts[index - 1]!.receiptDigest];
    if (canonicalJson(asJson(receipt.facts.predecessorReceiptDigests))
      !== canonicalJson(asJson(expectedPredecessors))) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:predecessor`,
        'Receipt predecessor chain is broken',
      );
    }
  });
}

function orderedDependencyClosure(
  receipts: readonly ModelBenchmarkTransitionReceipt[],
): readonly string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const receipt of receipts) {
    for (const reference of [
      ...receipt.facts.inputArtifactQualifiedDigests,
      ...receipt.facts.outputArtifactQualifiedDigests,
      ...receipt.facts.evidenceArtifactQualifiedDigests,
    ]) {
      if (!seen.has(reference)) {
        ordered.push(reference);
        seen.add(reference);
      }
    }
  }
  return Object.freeze(ordered);
}

function equalCanonical(
  expected: unknown,
  actual: unknown,
  code: ModelBenchmarkCertificateError['code'],
  location: string,
  reason: string,
): void {
  if (canonicalJson(asJson(expected)) !== canonicalJson(asJson(actual))) {
    throw new ModelBenchmarkCertificateError(
      code,
      location,
      reason,
      digest(expected),
      digest(actual),
    );
  }
}

function commonIdentities(
  bundle: DeepImprovementCommonCertificateBundle,
): readonly DeepImprovementCommonReceiptIdentity[] {
  return Object.freeze([...bundle.certificate.body.receiptIdentities]);
}

async function verifyCommonBoundary(
  expectedBundle: DeepImprovementCommonCertificateBundle,
  input: ModelBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
): Promise<void> {
  const supplied = parseDeepImprovementCommonCertificateBundle(input.bundle);
  equalCanonical(
    expectedBundle,
    supplied,
    ModelBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
    'common:bundle',
    'Common verification input differs from the embedded common bundle',
  );
  const result = await verifyDeepImprovementCommonCertificateOffline(input);
  if (result.verdict !== 'valid') {
    throw new ModelBenchmarkCertificateError(
      result.verdict === 'unverifiable'
        ? ModelBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
        : ModelBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      `common:${result.evidenceLocation}`,
      `Shared certificate verification failed: ${result.code}`,
      result.expectedDigest,
      result.actualDigest,
    );
  }
}

function compositeReplayFingerprint(
  substrateReplayFingerprint: string,
  projectionIntegrityDigest: string,
  commonBundle: DeepImprovementCommonCertificateBundle,
  artifacts: VerifiedArtifactSet,
  receipts: readonly ModelBenchmarkTransitionReceipt[],
): string {
  return digest({
    certificateVersion: MODEL_BENCHMARK_CERTIFICATE_VERSION,
    substrateReplayFingerprint,
    projectionIntegrityDigest,
    commonCertificateDigest: commonBundle.certificate.certificateDigest,
    commonReceiptIdentities: commonIdentities(commonBundle),
    namedDigestClosureRules: MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
    artifactClaims: artifacts.claims,
    orderedDependencyClosure: orderedDependencyClosure(receipts),
    receiptIdentities: receipts.map((receipt) => receipt.facts.identity),
    receiptDigests: receipts.map((receipt) => receipt.receiptDigest),
  });
}

function unsignedCertificateReceipt(
  body: ModelBenchmarkRunCertificateBody,
  certificateDigest: string,
  issuer: string,
  issuedAt: string,
  authorityEpoch: number,
): Omit<BoundaryReceiptPayload, 'certification'> {
  return Object.freeze({
    receipt_id: `model-benchmark-certificate:${certificateDigest}`,
    boundary_id: `model-benchmark-certificate-boundary:${certificateDigest}`,
    boundary_kind: 'mode-completion',
    scope: 'mode',
    scope_id: body.runId,
    from_state: 'active',
    to_state: body.disposition.toLowerCase().replaceAll('_', '-'),
    from_head: {
      ledger_id: 'authorized-ledger',
      sequence: 0,
      record_hash: body.startHeadHash,
    },
    result_head: {
      ledger_id: 'authorized-ledger',
      sequence: body.receiptDigests.length,
      record_hash: body.finalHeadHash,
    },
    result_event_id: `model-benchmark-certificate-event:${certificateDigest}`,
    result_event_type: 'model-benchmark.run-certificate',
    result_event_digest: certificateDigest,
    result_code: body.disposition.toLowerCase().replaceAll('_', '-'),
    evidence_digest: certificateDigest,
    artifact_digests: body.artifactClaims.map((claim) => claim.contentDigest),
    replay_fingerprint: body.replayFingerprint,
    authority_epoch: authorityEpoch,
    correlation_id: body.runId,
    causation_id: body.receiptIdentities.at(-1)?.digest ?? body.runId,
    issuer,
    issued_at: issuedAt,
    idempotency_key: `model-benchmark-certificate:v1:${certificateDigest}`,
  });
}

export async function issueModelBenchmarkRunCertificate<TState extends JsonObject>(
  input: ModelBenchmarkCertificateIssuerInput<TState>,
): Promise<ModelBenchmarkCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
      'replay:runId',
      'Replay run identity differs from certificate identity',
    );
  }
  const commonBundle = parseDeepImprovementCommonCertificateBundle(
    input.commonVerification.bundle,
  );
  await verifyCommonBoundary(
    commonBundle,
    input.commonVerification as ModelBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
  );
  const allEvents = await input.replay.ledger.readVerifiedEvents();
  const coveredEvents = allEvents.slice(
    input.replay.rangeStartSequence - 1,
    input.replay.rangeEndSequence,
  );
  if (coveredEvents.length === 0) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
  const folded = foldModelBenchmarkEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      `Model Benchmark reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
    );
  }
  const facts = projectionFacts(folded.projection);
  if (
    facts.runId !== input.runId
    || facts.lineageId !== input.lineageId
    || facts.generation !== input.generation
  ) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:identity',
      'Reducer-derived run identity differs from certificate input',
    );
  }
  if (
    commonBundle.certificate.body.runId !== input.runId
    || commonBundle.certificate.body.lineageId !== input.lineageId
    || commonBundle.certificate.body.generation !== input.generation
  ) {
    throw new ModelBenchmarkCertificateError(
      ModelBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:identity',
      'Common certificate identity differs from the Model Benchmark projection',
    );
  }
  const replay = await deriveReplayFingerprint(input.replay);
  const artifacts = await verifiedArtifactSet(
    input.artifactStore,
    input.artifactBindings,
    commonBundle.certificate.body.evaluatorEpochId,
    input.verificationTime,
  );
  const receipts: ModelBenchmarkTransitionReceipt[] = [];
  for (const transition of input.transitionReceipts) {
    const receipt = await issueReceiptPrepared(transition, {
      runId: input.runId,
      substrateReplayFingerprint: replay.descriptor.final_digest,
      priorReceipts: Object.freeze([...receipts]),
      commonReceiptIdentities: commonIdentities(commonBundle),
      ledgerEvents: coveredEvents,
      artifacts,
      certificationProfile: input.certificationProfile,
      providers: input.providers,
      receiptSubstrate: input.receiptSubstrate,
      issuer: input.issuer,
      issuedAt: input.issuedAt,
      evaluatorEpochId: commonBundle.certificate.body.evaluatorEpochId,
      verificationTime: input.verificationTime,
    });
    receipts.push(receipt);
  }
  assertTransitionOrder(receipts);
  assertTrustedTerminal(folded.projection, artifacts, commonBundle, receipts);
  const sealedFacts = artifactFacts(artifacts);
  const projectionIntegrityDigest = modelBenchmarkProjectionIntegrityDigest(
    folded.projection,
  );
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: ModelBenchmarkRunCertificateBody = Object.freeze({
    certificateVersion: MODEL_BENCHMARK_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    mode: 'model-benchmark',
    ...facts,
    evaluatorEpochId: commonBundle.certificate.body.evaluatorEpochId,
    canaryEpochId: commonBundle.certificate.body.canaryEpochId,
    disposition: commonBundle.certificate.body.verdict,
    ...sealedFacts,
    artifactClaims: artifacts.claims,
    artifactSetDigest: digest(artifacts.claims),
    namedDigestClosureRules: MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
    orderedDependencyClosure: orderedDependencyClosure(receipts),
    commonCertificateDigest: commonBundle.certificate.certificateDigest,
    commonReceiptIdentities: commonIdentities(commonBundle),
    receiptIdentities: Object.freeze(receipts.map((receipt) => receipt.facts.identity)),
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    substrateReplayFingerprint: replay.descriptor.final_digest,
    replayFingerprint: compositeReplayFingerprint(
      replay.descriptor.final_digest,
      projectionIntegrityDigest,
      commonBundle,
      artifacts,
      receipts,
    ),
    replayFingerprintVersion: replay.descriptor.fingerprint_version,
    projectionIntegrityDigest,
    startHeadHash: coveredEvents[0]!.frame.prev_record_hash,
    finalHeadHash: coveredEvents.at(-1)!.frame.record_hash,
  });
  const certificateDigest = digest(body);
  const unsigned = unsignedCertificateReceipt(
    body,
    certificateDigest,
    input.issuer,
    input.issuedAt,
    receipts.at(-1)!.facts.authorityEpoch,
  );
  const certification = await certifyBoundaryReceipt(
    unsigned,
    input.certificationProfile,
    input.providers,
  );
  const certificate = parseModelBenchmarkRunCertificate({
    body,
    certificateDigest,
    sharedCertificationReceipt: Object.freeze({ ...unsigned, certification }),
  });
  return Object.freeze({
    bundleVersion: 1,
    certificate,
    receipts: Object.freeze(receipts),
    commonBundle,
  });
}

async function verifyReceipts(
  bundle: ModelBenchmarkCertificateBundle,
  coveredEvents: readonly VerifiedLedgerEvent[],
  allEvents: readonly VerifiedLedgerEvent[],
  artifacts: VerifiedArtifactSet,
  providers: CertificationProviderRegistry,
): Promise<void> {
  assertTransitionOrder(bundle.receipts);
  const expectedCommon = commonIdentities(bundle.commonBundle);
  const receiptInputs = bundle.receipts.map((receipt): ModelBenchmarkTransitionReceiptInput => ({
    transitionKind: receipt.facts.transitionKind,
    logicalOperationId: receipt.facts.logicalOperationId,
    effectIdempotencyKey: receipt.facts.effectIdempotencyKey,
    attemptNumber: receipt.facts.attemptNumber,
    resultEventId: receipt.facts.resultEventId,
    inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
    outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
    evidenceArtifactQualifiedDigests: receipt.facts.evidenceArtifactQualifiedDigests,
  }));
  const verified: ModelBenchmarkTransitionReceipt[] = [];
  for (const [index, receipt] of bundle.receipts.entries()) {
    equalCanonical(
      expectedCommon,
      receipt.facts.commonReceiptIdentities,
      ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:common-identities`,
      'Mode receipt changed a shared receipt identity',
    );
    const expectedFacts = buildReceiptFacts(receiptInputs[index]!, {
      runId: bundle.certificate.body.runId,
      substrateReplayFingerprint: bundle.certificate.body.substrateReplayFingerprint,
      priorReceipts: verified,
      commonReceiptIdentities: expectedCommon,
      ledgerEvents: coveredEvents,
      artifacts,
      evaluatorEpochId: bundle.certificate.body.evaluatorEpochId,
      verificationTime: bundle.certificate.sharedCertificationReceipt.issued_at,
    });
    equalCanonical(
      expectedFacts,
      receipt.facts,
      ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Receipt facts do not re-derive from authorized evidence',
    );
    const expectedDigest = digest(expectedFacts);
    if (
      expectedDigest !== receipt.receiptDigest
      || expectedDigest !== bundle.certificate.body.receiptDigests[index]
    ) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:digest`,
        'Receipt digest or certificate index does not recompute',
        expectedDigest,
        receipt.receiptDigest,
      );
    }
    const durable = allEvents.filter((event) => (
      event.event.effective.envelope.event_id === receipt.sharedReceipt.receipt_id
    ));
    if (durable.length !== 1) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
        `receipt:${index}:durable-event`,
        'Transition receipt does not resolve exactly once in the authorized ledger',
      );
    }
    equalCanonical(
      durable[0]!.event.effective.envelope.payload,
      receipt.sharedReceipt,
      ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:durable-event`,
      'Bundled receipt differs from its durable authorized-ledger event',
    );
    const result = findEvent(coveredEvents, receipt.facts.resultEventId);
    const projected = projectBoundaryResult(result, receipt.facts, expectedDigest);
    const verificationEvents = allEvents.map((event) => (
      event.event.effective.envelope.event_id === receipt.facts.resultEventId
        ? projected
        : event
    ));
    await verifyBoundaryReceiptEvent(
      durable[0]!,
      verificationEvents,
      new BoundaryRegistry([boundaryDefinition(receipt.facts)]),
      providers,
    );
    verified.push(receipt);
  }
}

async function verifyCertificateCertification(
  certificate: ModelBenchmarkRunCertificate,
  providers: CertificationProviderRegistry,
): Promise<void> {
  const actual = certificate.sharedCertificationReceipt;
  const expected = unsignedCertificateReceipt(
    certificate.body,
    certificate.certificateDigest,
    actual.issuer,
    actual.issued_at,
    actual.authority_epoch,
  );
  const { certification: _certification, ...unsigned } = actual;
  equalCanonical(
    expected,
    unsigned,
    ModelBenchmarkCertificateFailureCodes.CERTIFICATION_INVALID,
    'certificate:certification',
    'Certificate receipt does not bind the recomputed certificate',
  );
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

function failureResult(error: unknown): ModelBenchmarkOfflineVerificationFailure {
  let verdict: ModelBenchmarkOfflineVerificationFailure['verdict'] = 'invalid';
  let code: ModelBenchmarkOfflineVerificationFailure['code'] =
    ModelBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';
  if (error instanceof ModelBenchmarkCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === ModelBenchmarkCertificateFailureCodes.MISSING_EVIDENCE
      || error.code === ModelBenchmarkCertificateFailureCodes.INCOMPLETE_RUN
      || error.code === ModelBenchmarkCertificateFailureCodes.LIFECYCLE_INVALID) {
      verdict = 'incomplete';
    }
    if (error.code === ModelBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
      && error.evidenceLocation.startsWith('common:')) {
      verdict = 'unverifiable';
    }
  } else if (error instanceof SealedArtifactError) {
    code = error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING
      ? ModelBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
      : ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof ModelBenchmarkArtifactReadError) {
    code = error.code === ModelBenchmarkArtifactReadFailureCodes.EPOCH_MISMATCH
      ? ModelBenchmarkCertificateFailureCodes.EPOCH_MISMATCH
      : error.code === ModelBenchmarkArtifactReadFailureCodes.STALE
        ? ModelBenchmarkCertificateFailureCodes.ARTIFACT_STALE
        : error.code === ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH
          ? ModelBenchmarkCertificateFailureCodes.VISIBILITY_INVALID
          : ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID;
    evidenceLocation = 'artifact:verified-read';
    failureReason = error.message;
  } else if (error instanceof Error) {
    code = ModelBenchmarkCertificateFailureCodes.CERTIFICATION_INVALID;
    evidenceLocation = 'substrate:verification';
    failureReason = error.message.slice(0, 512);
  }
  const evidenceDigest = digest({
    verdict,
    code,
    evidenceLocation,
    expectedDigest,
    actualDigest,
    failureReason,
  });
  return Object.freeze({
    verdict,
    code,
    evidenceLocation,
    expectedDigest,
    actualDigest,
    failureReason,
    evidenceDigest,
  });
}

export async function verifyModelBenchmarkCertificateOffline<TState extends JsonObject>(
  input: ModelBenchmarkOfflineVerificationInput<TState>,
): Promise<ModelBenchmarkOfflineVerificationResult> {
  try {
    const bundle = parseModelBenchmarkCertificateBundle(input.bundle);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== bundle.certificate.body.runId) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:runId',
        'Replay run identity differs from certificate identity',
      );
    }
    await verifyCommonBoundary(
      bundle.commonBundle,
      input.commonVerification as ModelBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
    );
    if (
      bundle.certificate.body.commonCertificateDigest
        !== bundle.commonBundle.certificate.certificateDigest
    ) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
        'common:certificate-digest',
        'Model Benchmark certificate changed the shared certificate identity',
      );
    }
    equalCanonical(
      commonIdentities(bundle.commonBundle),
      bundle.certificate.body.commonReceiptIdentities,
      ModelBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:receipt-identities',
      'Model Benchmark certificate changed shared evaluator, canary, or promotion receipt identities',
    );
    const allEvents = await input.replay.ledger.readVerifiedEvents();
    const coveredEvents = allEvents.slice(
      input.replay.rangeStartSequence - 1,
      input.replay.rangeEndSequence,
    );
    if (coveredEvents.length === 0) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Offline replay range contains no authorized events',
      );
    }
    assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
    const folded = foldModelBenchmarkEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        `Model Benchmark reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
      );
    }
    const facts = projectionFacts(folded.projection);
    equalCanonical(
      facts,
      {
        runId: bundle.certificate.body.runId,
        lineageId: bundle.certificate.body.lineageId,
        generation: bundle.certificate.body.generation,
        matrixProfileId: bundle.certificate.body.matrixProfileId,
        matrixCoverage: bundle.certificate.body.matrixCoverage,
        rankingState: bundle.certificate.body.rankingState,
        blockingCellKeys: bundle.certificate.body.blockingCellKeys,
        blockingVetoCodes: bundle.certificate.body.blockingVetoCodes,
        unresolvedEvidenceRefs: bundle.certificate.body.unresolvedEvidenceRefs,
      },
      ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:certificate-facts',
      'Certificate mode fields do not re-derive from the reducer',
    );
    const projectionIntegrityDigest = modelBenchmarkProjectionIntegrityDigest(
      folded.projection,
    );
    if (projectionIntegrityDigest !== bundle.certificate.body.projectionIntegrityDigest) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute',
        projectionIntegrityDigest,
        bundle.certificate.body.projectionIntegrityDigest,
      );
    }
    const replay = await deriveReplayFingerprint(input.replay).catch((error: unknown) => {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:substrate',
        error instanceof Error
          ? `Substrate replay fingerprint could not be recomputed: ${error.message}`
          : 'Substrate replay fingerprint could not be recomputed',
      );
    });
    if (
      replay.descriptor.final_digest !== bundle.certificate.body.substrateReplayFingerprint
      || replay.descriptor.fingerprint_version
        !== bundle.certificate.body.replayFingerprintVersion
    ) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:substrate',
        'Substrate replay fingerprint does not recompute',
        replay.descriptor.final_digest,
        bundle.certificate.body.substrateReplayFingerprint,
      );
    }
    const artifacts = await verifiedArtifactSet(
      input.artifactStore,
      bundle.certificate.body.artifactClaims.map((claim) => claim.binding),
      bundle.certificate.body.evaluatorEpochId,
      input.verificationTime,
    );
    equalCanonical(
      artifacts.claims,
      bundle.certificate.body.artifactClaims,
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      'artifact:claims',
      'Certificate artifact claims differ from real verified reads',
    );
    const artifactSetDigest = digest(artifacts.claims);
    if (artifactSetDigest !== bundle.certificate.body.artifactSetDigest) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
        'artifact:set',
        'Artifact set digest does not recompute',
        artifactSetDigest,
        bundle.certificate.body.artifactSetDigest,
      );
    }
    const sealedFacts = artifactFacts(artifacts);
    equalCanonical(
      sealedFacts,
      {
        matrixDigest: bundle.certificate.body.matrixDigest,
        workloadProfileDigest: bundle.certificate.body.workloadProfileDigest,
        selectionState: bundle.certificate.body.selectionState,
        winnerModelId: bundle.certificate.body.winnerModelId,
        recipeQualifiedDigest: bundle.certificate.body.recipeQualifiedDigest,
        runManifestQualifiedDigest: bundle.certificate.body.runManifestQualifiedDigest,
        modelCellInputQualifiedDigests:
          bundle.certificate.body.modelCellInputQualifiedDigests,
        rawObservationQualifiedDigests:
          bundle.certificate.body.rawObservationQualifiedDigests,
        scoringMatrixQualifiedDigest:
          bundle.certificate.body.scoringMatrixQualifiedDigest,
        commonAnchorQualifiedDigest:
          bundle.certificate.body.commonAnchorQualifiedDigest,
        diagnosticSelectionQualifiedDigest:
          bundle.certificate.body.diagnosticSelectionQualifiedDigest,
        validityEvidenceQualifiedDigests:
          bundle.certificate.body.validityEvidenceQualifiedDigests,
        contaminationEvidenceQualifiedDigests:
          bundle.certificate.body.contaminationEvidenceQualifiedDigests,
        workloadEvidenceQualifiedDigests:
          bundle.certificate.body.workloadEvidenceQualifiedDigests,
        selectionEvidenceQualifiedDigest:
          bundle.certificate.body.selectionEvidenceQualifiedDigest,
      },
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:certificate-facts',
      'Certificate artifact facts do not re-derive from real sealed reads',
    );
    await verifyReceipts(bundle, coveredEvents, allEvents, artifacts, input.providers);
    assertTrustedTerminal(folded.projection, artifacts, bundle.commonBundle, bundle.receipts);
    equalCanonical(
      orderedDependencyClosure(bundle.receipts),
      bundle.certificate.body.orderedDependencyClosure,
      ModelBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:ordered-closure',
      'Ordered artifact dependency closure does not recompute',
    );
    const receiptDigests = bundle.receipts.map((receipt) => receipt.receiptDigest);
    if (digest(receiptDigests) !== bundle.certificate.body.receiptChainDigest) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        'receipt:chain',
        'Receipt chain digest does not recompute',
      );
    }
    const recomputedReplay = compositeReplayFingerprint(
      replay.descriptor.final_digest,
      projectionIntegrityDigest,
      bundle.commonBundle,
      artifacts,
      bundle.receipts,
    );
    if (recomputedReplay !== bundle.certificate.body.replayFingerprint) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:composite',
        'Composite replay fingerprint does not recompute from the ordered closure',
        recomputedReplay,
        bundle.certificate.body.replayFingerprint,
      );
    }
    if (coveredEvents[0]!.frame.prev_record_hash !== bundle.certificate.body.startHeadHash
      || coveredEvents.at(-1)!.frame.record_hash !== bundle.certificate.body.finalHeadHash) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'ledger:heads',
        'Certificate ledger heads differ from the verified replay range',
      );
    }
    const certificateDigest = digest(bundle.certificate.body);
    if (certificateDigest !== bundle.certificate.certificateDigest) {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate digest does not recompute',
        certificateDigest,
        bundle.certificate.certificateDigest,
      );
    }
    await verifyCertificateCertification(bundle.certificate, input.providers);
    if (bundle.certificate.body.disposition !== 'PASS') {
      throw new ModelBenchmarkCertificateError(
        ModelBenchmarkCertificateFailureCodes.INCOMPLETE_RUN,
        'certificate:disposition',
        'Coherent evidence does not establish a passing terminal disposition',
      );
    }
    const verifierCore = Object.freeze({
      receiptVersion: 1 as const,
      certificateDigest,
      verifierVersion: 'model-benchmark-offline-verifier@1',
      rulesetDigest: digest({
        transitions: MODEL_BENCHMARK_REQUIRED_TRANSITION_ORDER,
        transitionInputs: TRANSITION_INPUT_KINDS,
        transitionEvidence: TRANSITION_EVIDENCE_KINDS,
        artifactRoles: MODEL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS,
        namedDigestClosureRules: MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
      }),
      replayFingerprint: recomputedReplay,
      evidenceDigests: Object.freeze([
        bundle.certificate.body.commonCertificateDigest,
        artifactSetDigest,
        bundle.certificate.body.receiptChainDigest,
        projectionIntegrityDigest,
      ]),
    });
    return Object.freeze({
      verdict: 'valid',
      certificateDigest,
      replayFingerprint: recomputedReplay,
      projectionIntegrityDigest,
      receiptChainDigest: bundle.certificate.body.receiptChainDigest,
      artifactSetDigest,
      verificationReceipt: Object.freeze({
        ...verifierCore,
        verificationDigest: digest(verifierCore),
      }),
    });
  } catch (error: unknown) {
    return failureResult(error);
  }
}
