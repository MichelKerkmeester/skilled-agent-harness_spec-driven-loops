// MODULE: Skill Benchmark Certificates and Receipts

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  SkillBenchmarkWireEventTypes,
} from '../skill-benchmark-ledger-schema/index.js';
import {
  skillBenchmarkProjectionIntegrityDigest,
  foldSkillBenchmarkEvents,
} from '../skill-benchmark-reducers/index.js';
import {
  SkillBenchmarkArtifactKinds,
  readSkillBenchmarkArtifact,
} from '../skill-benchmark-sealed-artifacts/index.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
} from '../deep-improvement-common-sealed-artifacts/index.js';
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
  SkillBenchmarkCertificateError,
  SkillBenchmarkCertificateFailureCodes,
  SkillBenchmarkTransitionKinds,
} from './skill-benchmark-certificate-types.js';
import {
  parseSkillBenchmarkCertificateBundle,
  parseSkillBenchmarkRunCertificate,
  parseSkillBenchmarkTransitionReceipt,
} from './skill-benchmark-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type {
  SkillBenchmarkLedgerEvent,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkProjectionState,
} from '../skill-benchmark-reducers/index.js';
import type {
  SkillBenchmarkArtifactKind,
  SkillBenchmarkArtifactMaterial,
  SkillBenchmarkSealedArtifactBinding,
  SkillBenchmarkVerifiedSealedArtifact,
} from '../skill-benchmark-sealed-artifacts/index.js';
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
  SkillBenchmarkCertificateArtifactClaim,
  SkillBenchmarkCertificateArtifactRole,
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkCertificateIssuerInput,
  SkillBenchmarkNamedDigestClosureRule,
  SkillBenchmarkOfflineVerificationFailure,
  SkillBenchmarkOfflineVerificationInput,
  SkillBenchmarkOfflineVerificationResult,
  SkillBenchmarkReceiptIdentity,
  SkillBenchmarkRunCertificate,
  SkillBenchmarkRunCertificateBody,
  SkillBenchmarkTransitionKind,
  SkillBenchmarkTransitionOutcome,
  SkillBenchmarkTransitionReceipt,
  SkillBenchmarkTransitionReceiptContext,
  SkillBenchmarkTransitionReceiptFacts,
  SkillBenchmarkTransitionReceiptInput,
  SkillBenchmarkTransitionReceiptSubstrate,
} from './skill-benchmark-certificate-types.js';

export const SKILL_BENCHMARK_CERTIFICATE_VERSION = 1 as const;
export const SKILL_BENCHMARK_RECEIPT_VERSION = 1 as const;

function closureRule(
  containingArtifactKind: SkillBenchmarkArtifactKind,
  referenceField: SkillBenchmarkNamedDigestClosureRule['referenceField'],
  digestField: SkillBenchmarkNamedDigestClosureRule['digestField'],
  expectedArtifactKind: SkillBenchmarkArtifactKind,
): SkillBenchmarkNamedDigestClosureRule {
  return Object.freeze({
    containingArtifactKind,
    referenceField,
    digestField,
    expectedArtifactKind,
  });
}

export const SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([
  closureRule(
    SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
    'assignmentId',
    'assignmentDigest',
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
  ),
  closureRule(
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
    'assignmentId',
    'assignmentDigest',
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
  ),
  closureRule(
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
    'skillBundleRef',
    'skillBundleDigest',
    SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
  ),
] as const satisfies readonly SkillBenchmarkNamedDigestClosureRule[]);

export const SKILL_BENCHMARK_REQUIRED_TRANSITION_ORDER = Object.freeze([
  SkillBenchmarkTransitionKinds.DESIGN_PLANNED,
  SkillBenchmarkTransitionKinds.TREATMENT_ASSIGNED,
  SkillBenchmarkTransitionKinds.SCENARIO_STARTED,
  SkillBenchmarkTransitionKinds.SKILL_DISCOVERED,
  SkillBenchmarkTransitionKinds.SKILL_LOADED,
  SkillBenchmarkTransitionKinds.SKILL_INVOKED,
  SkillBenchmarkTransitionKinds.RESOURCE_EXPOSED,
  SkillBenchmarkTransitionKinds.MILESTONE_OBSERVED,
  SkillBenchmarkTransitionKinds.TRAJECTORY_RECORDED,
  SkillBenchmarkTransitionKinds.SCENARIO_FINISHED,
  SkillBenchmarkTransitionKinds.OUTCOME_RECORDED,
  SkillBenchmarkTransitionKinds.GOLD_INTEGRITY_RECORDED,
  SkillBenchmarkTransitionKinds.SCORE_OBSERVED,
  SkillBenchmarkTransitionKinds.COMPATIBILITY_OBSERVED,
  SkillBenchmarkTransitionKinds.NEGATIVE_TRANSFER_OBSERVED,
  SkillBenchmarkTransitionKinds.SECURITY_PROBE_RECORDED,
  SkillBenchmarkTransitionKinds.RUN_CLOSED,
  SkillBenchmarkTransitionKinds.CERTIFICATE_ISSUED,
] as const);

export const SKILL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS = Object.freeze({
  'benchmark-design': SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
  'skill-bundle-snapshot': SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
  'scenario-gold-manifest': SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
  'run-assignment': SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
  'exposure-observation': SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
  'causal-score-observation': SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
  'effect-certificate-input': SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT,
} as const satisfies Readonly<Record<
  SkillBenchmarkCertificateArtifactRole,
  SkillBenchmarkArtifactKind
>>);

const TRANSITION_EVENTS: Readonly<Record<
  SkillBenchmarkTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  design_planned: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.run_planned']]),
  treatment_assigned: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.treatment_assigned']]),
  scenario_started: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.scenario_started']]),
  scenario_finished: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.scenario_finished']]),
  scenario_aborted: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.scenario_aborted']]),
  skill_discovered: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.skill_discovered']]),
  skill_loaded: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.skill_loaded']]),
  skill_invoked: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.skill_invoked']]),
  resource_exposed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.resource_exposed']]),
  milestone_observed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.milestone_observed']]),
  trajectory_recorded: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.trajectory_recorded']]),
  outcome_recorded: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.outcome_recorded']]),
  gold_integrity_recorded: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.gold_integrity_recorded']]),
  score_observed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.score_observed']]),
  compatibility_observed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.compatibility_observed']]),
  negative_transfer_observed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.negative_transfer_observed']]),
  security_probe_recorded: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.security_probe_recorded']]),
  run_closed: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.run_closed']]),
  certificate_issued: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.effect_certificate_issued']]),
  certificate_withheld: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.effect_certificate_withheld']]),
  certificate_expired: new Set([SkillBenchmarkWireEventTypes['skill_benchmark.effect_certificate_expired']]),
  aborted: new Set([
    SkillBenchmarkWireEventTypes['skill_benchmark.scenario_aborted'],
    SkillBenchmarkWireEventTypes['skill_benchmark.run_closed'],
  ]),
  restored: new Set([SkillBenchmarkWireEventTypes['deep_improvement_common.run_resumed']]),
});

const TRANSITION_OUTPUT_KINDS: Readonly<Record<
  SkillBenchmarkTransitionKind,
  SkillBenchmarkArtifactKind | null
>> = Object.freeze({
  design_planned: SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
  treatment_assigned: SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
  scenario_started: null,
  scenario_finished: null,
  scenario_aborted: null,
  skill_discovered: SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
  skill_loaded: null,
  skill_invoked: null,
  resource_exposed: SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
  milestone_observed: null,
  trajectory_recorded: null,
  outcome_recorded: null,
  gold_integrity_recorded: SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
  score_observed: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
  compatibility_observed: null,
  negative_transfer_observed: null,
  security_probe_recorded: null,
  run_closed: null,
  certificate_issued: SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT,
  certificate_withheld: null,
  certificate_expired: null,
  aborted: null,
  restored: null,
});

const TRANSITION_INPUT_KINDS: Readonly<Record<
  SkillBenchmarkTransitionKind,
  readonly SkillBenchmarkArtifactKind[]
>> = Object.freeze({
  design_planned: Object.freeze([]),
  treatment_assigned: Object.freeze([
    SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
  ]),
  scenario_started: Object.freeze([SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT]),
  scenario_finished: Object.freeze([SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT]),
  scenario_aborted: Object.freeze([SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT]),
  skill_discovered: Object.freeze([SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN]),
  skill_loaded: Object.freeze([SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT]),
  skill_invoked: Object.freeze([SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT]),
  resource_exposed: Object.freeze([
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
    SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
  ]),
  milestone_observed: Object.freeze([SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION]),
  trajectory_recorded: Object.freeze([SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION]),
  outcome_recorded: Object.freeze([SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION]),
  gold_integrity_recorded: Object.freeze([SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT]),
  score_observed: Object.freeze([
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
    SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
    SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
  ]),
  compatibility_observed: Object.freeze([
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
    SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
  ]),
  negative_transfer_observed: Object.freeze([
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
  ]),
  security_probe_recorded: Object.freeze([
    SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
  ]),
  run_closed: Object.freeze([
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
  ]),
  certificate_issued: Object.freeze([
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
    SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
  ]),
  certificate_withheld: Object.freeze([SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION]),
  certificate_expired: Object.freeze([SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT]),
  aborted: Object.freeze([]),
  restored: Object.freeze([]),
});

const TRANSITION_EVIDENCE_KINDS: Readonly<Record<
  SkillBenchmarkTransitionKind,
  readonly SkillBenchmarkArtifactKind[]
>> = Object.freeze({
  design_planned: Object.freeze([]),
  treatment_assigned: Object.freeze([]),
  scenario_started: Object.freeze([]),
  scenario_finished: Object.freeze([]),
  scenario_aborted: Object.freeze([]),
  skill_discovered: Object.freeze([]),
  skill_loaded: Object.freeze([]),
  skill_invoked: Object.freeze([]),
  resource_exposed: Object.freeze([]),
  milestone_observed: Object.freeze([]),
  trajectory_recorded: Object.freeze([]),
  outcome_recorded: Object.freeze([]),
  gold_integrity_recorded: Object.freeze([]),
  score_observed: Object.freeze([]),
  compatibility_observed: Object.freeze([]),
  negative_transfer_observed: Object.freeze([]),
  security_probe_recorded: Object.freeze([]),
  run_closed: Object.freeze([]),
  certificate_issued: Object.freeze([
    SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
    SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
    SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
  ]),
  certificate_withheld: Object.freeze([]),
  certificate_expired: Object.freeze([]),
  aborted: Object.freeze([]),
  restored: Object.freeze([]),
});

const TRANSITION_BOUNDARIES: Readonly<Record<
  SkillBenchmarkTransitionKind,
  Readonly<{
    kind: BoundaryKind;
    scope: BoundaryScope;
    fromState: string;
    toState: string;
  }>
>> = Object.freeze({
  design_planned: Object.freeze({ kind: 'mode-enter', scope: 'mode', fromState: 'planned', toState: 'active' }),
  treatment_assigned: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'planned', toState: 'assigned' }),
  scenario_started: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'assigned', toState: 'running' }),
  scenario_finished: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'running', toState: 'finished' }),
  scenario_aborted: Object.freeze({ kind: 'phase-abort', scope: 'phase', fromState: 'running', toState: 'aborted' }),
  skill_discovered: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'running', toState: 'available' }),
  skill_loaded: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'available', toState: 'loaded' }),
  skill_invoked: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'loaded', toState: 'invoked' }),
  resource_exposed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'invoked', toState: 'exposed' }),
  milestone_observed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'exposed', toState: 'milestone-observed' }),
  trajectory_recorded: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'exposed', toState: 'trajectory-recorded' }),
  outcome_recorded: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'trajectory-recorded', toState: 'outcome-recorded' }),
  gold_integrity_recorded: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'outcome-recorded', toState: 'gold-accepted' }),
  score_observed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'gold-accepted', toState: 'scored' }),
  compatibility_observed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'scored', toState: 'compatibility-checked' }),
  negative_transfer_observed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'scored', toState: 'transfer-checked' }),
  security_probe_recorded: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'scored', toState: 'security-checked' }),
  run_closed: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'closed' }),
  certificate_issued: Object.freeze({ kind: 'mode-completion', scope: 'mode', fromState: 'ready', toState: 'issued' }),
  certificate_withheld: Object.freeze({ kind: 'mode-pause', scope: 'mode', fromState: 'ready', toState: 'withheld' }),
  certificate_expired: Object.freeze({ kind: 'mode-pause', scope: 'mode', fromState: 'issued', toState: 'expired' }),
  aborted: Object.freeze({
    kind: 'mode-abort',
    scope: 'mode',
    fromState: 'active',
    toState: 'aborted',
  }),
  restored: Object.freeze({
    kind: 'mode-resume',
    scope: 'mode',
    fromState: 'paused',
    toState: 'active',
  }),
});

interface ArtifactEvidence {
  readonly claim: SkillBenchmarkCertificateArtifactClaim;
  readonly material: SkillBenchmarkArtifactMaterial;
}

interface VerifiedArtifactSet {
  readonly claims: readonly SkillBenchmarkCertificateArtifactClaim[];
  readonly byQualifiedDigest: ReadonlyMap<string, ArtifactEvidence>;
}

interface PreparedReceiptContext extends Omit<
  SkillBenchmarkTransitionReceiptContext,
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
  verified: SkillBenchmarkVerifiedSealedArtifact,
): SkillBenchmarkArtifactMaterial {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes do not contain a canonical Skill Benchmark capsule',
    );
  }
  const capsule = record(decoded);
  const material = record(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || material === null) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes disagree with their sealed Skill Benchmark binding',
    );
  }
  return material as unknown as SkillBenchmarkArtifactMaterial;
}

function roleFor(kind: SkillBenchmarkArtifactKind): SkillBenchmarkCertificateArtifactRole {
  for (const [role, expected] of Object.entries(SKILL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS)) {
    if (expected === kind) return role as SkillBenchmarkCertificateArtifactRole;
  }
  throw new SkillBenchmarkCertificateError(
    SkillBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
    `artifact:${kind}`,
    'Certificate binding uses an unregistered Skill Benchmark artifact kind',
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
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Typed sealed-reference field is missing or malformed',
    );
  }
  return value as SealedArtifactReference;
}

function dependencyReferences(
  value: unknown,
  location: string,
): readonly SealedArtifactReference[] {
  if (!Array.isArray(value)) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      location,
      'Artifact dependency collection is missing or malformed',
    );
  }
  return Object.freeze(value.map((entry, index) => {
    const dependency = record(entry);
    if (dependency === null || typeof dependency.purpose !== 'string') {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
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
  store: SkillBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  artifacts: VerifiedArtifactSet,
  reference: SealedArtifactReference,
  expectedKind: SkillBenchmarkArtifactKind | null,
  location: string,
): Promise<void> {
  if (expectedKind !== null && reference.artifact_kind !== expectedKind) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
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
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        location,
        'Typed sealed reference is not owned by the verified certificate artifact set',
      );
    }
  }
  await store.readVerified(reference, expectedKind ?? reference.artifact_kind);
}

async function verifyTypedReferenceClosure(
  store: SkillBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  artifacts: VerifiedArtifactSet,
): Promise<void> {
  for (const evidence of artifacts.byQualifiedDigest.values()) {
    const material = record(evidence.material);
    if (material === null) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
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
  }
}

function semanticDigest(evidence: ArtifactEvidence): string {
  const material = record(evidence.material);
  if (
    evidence.claim.expectedArtifactKind === SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT
    && typeof material?.bundleDigest === 'string'
  ) {
    return material.bundleDigest;
  }
  return evidence.claim.contentDigest;
}

function verifyNamedDigestClosure(artifacts: VerifiedArtifactSet): void {
  const ordered = artifacts.claims.map((claim) => {
    const evidence = artifacts.byQualifiedDigest.get(
      claim.binding.reference.qualified_digest,
    );
    if (evidence === undefined) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        'artifact:claims',
        'Verified claim has no matching sealed artifact evidence',
      );
    }
    return evidence;
  });
  for (const rule of SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES) {
    for (const container of ordered.filter(
      (entry) => entry.claim.expectedArtifactKind === rule.containingArtifactKind,
    )) {
      const material = record(container.material);
      const referenceValue = material?.[rule.referenceField];
      const digestValue = material?.[rule.digestField];
      if (typeof referenceValue !== 'string' || typeof digestValue !== 'string') {
        throw new SkillBenchmarkCertificateError(
          SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
          `artifact:${container.claim.role}:${rule.referenceField}`,
          'Named cross-artifact pair is missing or malformed',
        );
      }
      const matches = ordered.filter((candidate) => {
        const candidateMaterial = record(candidate.material);
        return candidate.claim.expectedArtifactKind === rule.expectedArtifactKind
          && candidateMaterial?.artifactId === referenceValue
          && semanticDigest(candidate) === digestValue;
      });
      if (matches.length !== 1) {
        const wrongKind = ordered.some((candidate) => (
          record(candidate.material)?.artifactId === referenceValue
          && semanticDigest(candidate) === digestValue
        ));
        throw new SkillBenchmarkCertificateError(
          wrongKind
            ? SkillBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND
            : SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
          `artifact:${container.claim.role}:${rule.referenceField}`,
          'Named cross-artifact pair does not resolve to one sealed artifact of the expected kind',
        );
      }
      const target = matches[0];
      if (target === undefined) {
        throw new SkillBenchmarkCertificateError(
          SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
          `artifact:${container.claim.role}:${rule.referenceField}`,
          'Named cross-artifact target disappeared during closure verification',
        );
      }
      const containerIndex = ordered.indexOf(container);
      const targetIndex = ordered.indexOf(target);
      if (targetIndex >= containerIndex) {
        throw new SkillBenchmarkCertificateError(
          SkillBenchmarkCertificateFailureCodes.ARTIFACT_STALE,
          `artifact:${container.claim.role}:${rule.referenceField}`,
          'Named cross-artifact dependency is stale or reordered after its consumer',
        );
      }
    }
  }
}

async function verifiedArtifactSet(
  store: SkillBenchmarkCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly SkillBenchmarkSealedArtifactBinding[],
  evaluatorEpochId: string,
  canaryEpochId: string,
  verificationTime: string,
): Promise<VerifiedArtifactSet> {
  const claims: SkillBenchmarkCertificateArtifactClaim[] = [];
  const byQualifiedDigest = new Map<string, ArtifactEvidence>();
  for (const binding of bindings) {
    const verified = await readSkillBenchmarkArtifact(
      store,
      binding,
      {
        consumer: 'skill-benchmark',
        requiredEvaluationEpochId: evaluatorEpochId,
        requiredCanaryEpochId: canaryEpochId,
        accessRole: 'evaluator',
        requireFreshCanary: true,
        now: new Date(verificationTime),
      },
    );
    const role = roleFor(verified.binding.artifactKind);
    const expectedArtifactKind = SKILL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS[role];
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (byQualifiedDigest.has(qualifiedDigest)) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        'artifact:set',
        'Certificate artifact identities must be unique',
      );
    }
    const claim: SkillBenchmarkCertificateArtifactClaim = Object.freeze({
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
    SKILL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS,
  ) as SkillBenchmarkCertificateArtifactRole[];
  const singletonRoles = new Set<SkillBenchmarkCertificateArtifactRole>([
    'benchmark-design',
    'skill-bundle-snapshot',
    'effect-certificate-input',
  ]);
  if (requiredRoles.some((role) => !roles.includes(role))) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      'artifact:roles',
      'Certificate requires every registered Skill Benchmark evidence role',
    );
  }
  for (const role of singletonRoles) {
    if (roles.filter((candidate) => candidate === role).length !== 1) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        `artifact:roles:${role}`,
        'Singleton certificate artifact role must resolve exactly once',
      );
    }
  }
  const roleRank: Readonly<Record<SkillBenchmarkCertificateArtifactRole, number>> = {
    'skill-bundle-snapshot': 0,
    'benchmark-design': 1,
    'run-assignment': 2,
    'exposure-observation': 3,
    'scenario-gold-manifest': 4,
    'causal-score-observation': 5,
    'effect-certificate-input': 6,
  };
  claims.sort((left, right) => (
    roleRank[left.role] - roleRank[right.role]
      || left.binding.reference.qualified_digest
        .localeCompare(right.binding.reference.qualified_digest)
  ));
  const artifacts = Object.freeze({ claims: Object.freeze(claims), byQualifiedDigest });
  await verifyTypedReferenceClosure(store, artifacts);
  verifyNamedDigestClosure(artifacts);
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
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `event:${eventId}`,
      'Transition result must resolve exactly once in the verified authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function assertArtifactEventsAuthorized(
  artifacts: VerifiedArtifactSet,
  events: readonly VerifiedLedgerEvent[],
): void {
  for (const evidence of artifacts.byQualifiedDigest.values()) {
    const origin = evidence.material.originEvent;
    const matches = events.filter((event) => {
      const payload = eventPayload(event);
      return event.event.effective.envelope.event_id === origin.eventId
        && payload.stem === origin.eventStem
        && payload.payloadDigest === origin.payloadDigest;
    });
    if (matches.length !== 1) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
        `artifact:${evidence.claim.binding.reference.qualified_digest}:origin`,
        'Sealed artifact origin must resolve exactly once in the authorized ledger',
      );
    }
  }
}

function eventPayload(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  return event.event.effective.envelope.payload as Readonly<Record<string, unknown>>;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const data = record(eventPayload(event).data);
  if (data === null) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Authorized Skill Benchmark event lacks its closed data object',
    );
  }
  return data;
}

function outcomeFor(
  transitionKind: SkillBenchmarkTransitionKind,
  event: VerifiedLedgerEvent,
): SkillBenchmarkTransitionOutcome {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENTS[transitionKind].has(eventType)) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${transitionKind}`,
      'Transition kind does not match its authorized result event type',
    );
  }
  const data = eventData(event);
  switch (transitionKind) {
    case 'skill_discovered':
      return data.availabilityStatus === 'missing' ? 'vetoed' : 'completed';
    case 'skill_loaded':
      return data.loadStatus === 'failed'
        ? 'vetoed'
        : data.loadStatus === 'partial'
          ? 'uncertain'
          : 'completed';
    case 'skill_invoked':
      return data.invocationStatus === 'failed' ? 'vetoed' : 'completed';
    case 'resource_exposed':
      return data.canaryStatus === 'triggered' ? 'vetoed' : 'completed';
    case 'gold_integrity_recorded':
      return data.integrityStatus === 'blocked'
        ? 'vetoed'
        : data.integrityStatus === 'pending'
          ? 'uncertain'
          : 'completed';
    case 'score_observed':
      return data.numeratorEligible === true ? 'completed' : 'vetoed';
    case 'certificate_withheld':
    case 'certificate_expired':
      return 'vetoed';
    case 'aborted':
      return data.retryable === true ? 'uncertain' : 'vetoed';
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

export function deriveSkillBenchmarkReceiptIdentity(
  runId: string,
  input: SkillBenchmarkTransitionReceiptInput,
): SkillBenchmarkReceiptIdentity {
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
  input: SkillBenchmarkTransitionReceiptInput,
  context: Pick<PreparedReceiptContext, 'artifacts' | 'ledgerEvents'>,
): void {
  const expectedOutputKind = TRANSITION_OUTPUT_KINDS[input.transitionKind];
  const outputCountValid = input.transitionKind === SkillBenchmarkTransitionKinds.SKILL_DISCOVERED
    ? input.outputArtifactQualifiedDigests.length <= 1
    : input.outputArtifactQualifiedDigests.length === (expectedOutputKind === null ? 0 : 1);
  if (!outputCountValid) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      `transition:${input.transitionKind}:outputs`,
      'Transition output cardinality differs from its sealed-artifact profile',
    );
  }
  const combined = [
    ...input.inputArtifactQualifiedDigests,
    ...input.outputArtifactQualifiedDigests,
    ...input.evidenceArtifactQualifiedDigests,
  ];
  if (new Set(combined).size !== combined.length) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Receipt artifact roles must not alias one another',
    );
  }
  for (const reference of combined) {
    if (!context.artifacts.byQualifiedDigest.has(reference)) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_MISSING,
        `transition:${input.transitionKind}:artifacts`,
        'Receipt references an artifact outside the verified certificate set',
      );
    }
  }
  if (expectedOutputKind !== null && input.outputArtifactQualifiedDigests.length > 0) {
    const outputReference = input.outputArtifactQualifiedDigests[0];
    const output = outputReference === undefined
      ? undefined
      : context.artifacts.byQualifiedDigest.get(outputReference);
    if (output?.claim.expectedArtifactKind !== expectedOutputKind) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND,
        `transition:${input.transitionKind}:outputs`,
        'Receipt output is not the expected mode-specific artifact kind',
      );
    }
  }
  const expectedInputs = TRANSITION_INPUT_KINDS[input.transitionKind];
  const actualInputs = input.inputArtifactQualifiedDigests.map((reference) => (
    context.artifacts.byQualifiedDigest.get(reference)?.claim.expectedArtifactKind
  ));
  if (canonicalJson(asJson(expectedInputs)) !== canonicalJson(asJson(actualInputs))) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:inputs`,
      'Receipt inputs do not preserve the exact ordered dependency closure',
    );
  }
  const expectedEvidence = TRANSITION_EVIDENCE_KINDS[input.transitionKind];
  const actualEvidence = input.evidenceArtifactQualifiedDigests.map((reference) => (
    context.artifacts.byQualifiedDigest.get(reference)?.claim.expectedArtifactKind
  ));
  if (canonicalJson(asJson(expectedEvidence)) !== canonicalJson(asJson(actualEvidence))) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:evidence`,
      'Receipt evidence does not preserve the exact ordered evidence closure',
    );
  }
}

function assertArtifactOwnedByEvent(
  input: SkillBenchmarkTransitionReceiptInput,
  event: VerifiedLedgerEvent,
  artifacts: VerifiedArtifactSet,
): void {
  const outputReference = input.outputArtifactQualifiedDigests[0];
  if (outputReference === undefined) return;
  const output = artifacts.byQualifiedDigest.get(outputReference);
  const origin = output?.material.originEvent;
  const payload = eventPayload(event);
  if (
    origin === undefined
    || origin.eventId !== event.event.effective.envelope.event_id
    || origin.eventStem !== payload.stem
    || origin.payloadDigest !== payload.payloadDigest
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${input.transitionKind}:owner`,
      'Receipt output has no matching authorized origin event',
    );
  }
}

function buildReceiptFacts(
  input: SkillBenchmarkTransitionReceiptInput,
  context: Omit<PreparedReceiptContext, 'receiptSubstrate' | 'certificationProfile' | 'providers' | 'issuer' | 'issuedAt'>,
): SkillBenchmarkTransitionReceiptFacts {
  assertArtifactVector(input, context);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  assertArtifactOwnedByEvent(input, event, context.artifacts);
  const identity = deriveSkillBenchmarkReceiptIdentity(context.runId, input);
  const priorReceipt = context.priorReceipts.at(-1);
  const predecessorReceiptDigests = priorReceipt === undefined
    ? []
    : [priorReceipt.receiptDigest];
  const factsCore = Object.freeze({
    receiptVersion: SKILL_BENCHMARK_RECEIPT_VERSION,
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
  facts: SkillBenchmarkTransitionReceiptFacts,
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
  facts: SkillBenchmarkTransitionReceiptFacts,
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
  substrate: SkillBenchmarkTransitionReceiptSubstrate,
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
  facts: SkillBenchmarkTransitionReceiptFacts,
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
  input: SkillBenchmarkTransitionReceiptInput,
  context: PreparedReceiptContext,
): Promise<SkillBenchmarkTransitionReceipt> {
  const facts = buildReceiptFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  const sharedReceipt = await issueSharedReceipt(facts, receiptDigest, event, context);
  return parseSkillBenchmarkTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

export async function issueSkillBenchmarkTransitionReceipt(
  input: SkillBenchmarkTransitionReceiptInput,
  context: SkillBenchmarkTransitionReceiptContext,
): Promise<SkillBenchmarkTransitionReceipt> {
  const artifacts = await verifiedArtifactSet(
    context.artifactStore,
    context.artifactBindings,
    context.evaluatorEpochId,
    context.canaryEpochId,
    context.verificationTime,
  );
  assertArtifactEventsAuthorized(artifacts, context.ledgerEvents);
  return issueReceiptPrepared(input, { ...context, artifacts });
}

function assertProjectionMatchesLedger(
  projectionEvents: readonly SkillBenchmarkLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verified = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verified))) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:ledger-events',
      'Projection events differ from the ordered authorized-ledger replay range',
      digest(verified),
      digest(projectionEvents),
    );
  }
}

function projectionFacts(projection: SkillBenchmarkProjectionState) {
  const run = projection.run;
  if (
    run.runId === null
    || run.lineageId === null
    || run.benchmarkDesignId === null
    || run.designDigest === null
    || run.taskSetDigest === null
    || run.skillBundleDigest === null
    || run.registryDigest === null
    || run.executorDescriptorDigest === null
    || run.environmentDigest === null
    || run.dependencyDigest === null
    || run.workloadDigest === null
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.INCOMPLETE_RUN,
      'projection:terminal-evidence',
      'Run lacks reducer-derived identity or validity-domain evidence',
    );
  }
  const coverage = projection.iterationConvergence.coverage;
  return Object.freeze({
    runId: run.runId,
    lineageId: run.lineageId,
    benchmarkDesignId: run.benchmarkDesignId,
    designDigest: run.designDigest,
    taskSetDigest: run.taskSetDigest,
    skillBundleDigest: run.skillBundleDigest,
    registryDigest: run.registryDigest,
    executorDigest: run.executorDescriptorDigest,
    environmentDigest: run.environmentDigest,
    dependencyDigest: run.dependencyDigest,
    workloadDigest: run.workloadDigest,
    modeState: projection.modeStatus.state,
    certificateState: projection.modeStatus.certificateState,
    requiredScenarioCount: coverage.requiredScenarioCount,
    assignedScenarioCount: coverage.assignedScenarioCount,
    acceptedGoldScenarioCount: coverage.acceptedGoldScenarioCount,
    collectionComplete: projection.iterationConvergence.collectionComplete,
    scoringComplete: projection.iterationConvergence.scoringComplete,
    certificateReady: projection.iterationConvergence.certificateReady,
    treatmentArms: Object.freeze([
      ...new Set(projection.iterationConvergence.scenarios.map(
        (scenario) => scenario.treatmentArm,
      )),
    ].sort()),
    blockingVetoCodes: Object.freeze([...projection.modeStatus.blockingVetoCodes]),
    blockerCodes: Object.freeze([...projection.iterationConvergence.blockerCodes]),
  });
}

function evidenceForRole(
  artifacts: VerifiedArtifactSet,
  role: SkillBenchmarkCertificateArtifactRole,
): readonly ArtifactEvidence[] {
  return Object.freeze([...artifacts.byQualifiedDigest.values()]
    .filter((evidence) => evidence.claim.role === role)
    .sort((left, right) => left.claim.binding.reference.qualified_digest.localeCompare(
      right.claim.binding.reference.qualified_digest,
    )));
}

function singletonEvidence(
  artifacts: VerifiedArtifactSet,
  role: SkillBenchmarkCertificateArtifactRole,
): ArtifactEvidence {
  const evidence = evidenceForRole(artifacts, role);
  if (evidence.length !== 1) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      `artifact:${role}`,
      'Certificate requires one artifact for this singleton role',
    );
  }
  return evidence[0] as ArtifactEvidence;
}

function artifactFacts(artifacts: VerifiedArtifactSet) {
  const design = singletonEvidence(artifacts, 'benchmark-design');
  const bundle = singletonEvidence(artifacts, 'skill-bundle-snapshot');
  const certificateInput = singletonEvidence(artifacts, 'effect-certificate-input');
  const gold = evidenceForRole(artifacts, 'scenario-gold-manifest');
  const assignments = evidenceForRole(artifacts, 'run-assignment');
  const exposures = evidenceForRole(artifacts, 'exposure-observation');
  const scores = evidenceForRole(artifacts, 'causal-score-observation');
  const certificateMaterial = record(certificateInput.material);
  if (
    certificateMaterial === null
    || typeof certificateMaterial.evidenceSetDigest !== 'string'
    || record(certificateMaterial.validityDomain) === null
    || !Array.isArray(certificateMaterial.expiryTriggers)
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:effect-certificate-input',
      'Effect certificate input lacks its evidence, validity, or expiry facts',
    );
  }
  const qualified = (evidence: ArtifactEvidence) =>
    evidence.claim.binding.reference.qualified_digest;
  return Object.freeze({
    evidenceSetDigest: certificateMaterial.evidenceSetDigest,
    validityDomainDigest: digest(certificateMaterial.validityDomain),
    expiryTriggers: Object.freeze([...certificateMaterial.expiryTriggers] as string[]),
    benchmarkDesignQualifiedDigest: qualified(design),
    skillBundleQualifiedDigest: qualified(bundle),
    goldManifestQualifiedDigests: Object.freeze(gold.map(qualified)),
    runAssignmentQualifiedDigests: Object.freeze(assignments.map(qualified)),
    exposureObservationQualifiedDigests: Object.freeze(exposures.map(qualified)),
    causalScoreObservationQualifiedDigests: Object.freeze(scores.map(qualified)),
    certificateInputQualifiedDigest: qualified(certificateInput),
  });
}

function assertTrustedTerminal(
  projection: SkillBenchmarkProjectionState,
  artifacts: VerifiedArtifactSet,
  commonBundle: DeepImprovementCommonCertificateBundle,
  receipts: readonly SkillBenchmarkTransitionReceipt[],
): void {
  const gold = evidenceForRole(artifacts, 'scenario-gold-manifest');
  const scores = evidenceForRole(artifacts, 'causal-score-observation');
  const certificateInput = singletonEvidence(artifacts, 'effect-certificate-input');
  const certificateMaterial = record(certificateInput.material);
  const validityDomain = record(certificateMaterial?.validityDomain);
  const run = projection.run;
  const arms = new Set(projection.iterationConvergence.scenarios.map(
    (scenario) => scenario.treatmentArm,
  ));
  const requiredArmCoverage = (
    (arms.has('no-skill') || arms.has('control'))
    && arms.has('auto-route')
    && arms.has('forced-activation')
    && (arms.has('placebo') || arms.has('distractor'))
    && arms.has('component-ablation')
    && arms.has('compatibility-boundary')
  );
  const invalidLifecycle =
    projection.run.state !== 'closed'
    || projection.modeStatus.state !== 'issued'
    || projection.modeStatus.certificateState !== 'issued'
    || projection.modeStatus.blockingVetoCodes.length !== 0
    || projection.iterationConvergence.hardVetoes.length !== 0
    || !projection.iterationConvergence.collectionComplete
    || !projection.iterationConvergence.scoringComplete
    || !projection.iterationConvergence.certificateReady
    || projection.iterationConvergence.blockerCodes.length !== 0
    || projection.iterationConvergence.scenarios.length === 0
    || projection.iterationConvergence.scenarios.some(
      (scenario) => scenario.state !== 'finished' || !scenario.requiredEvidenceComplete,
    )
    || projection.iterationConvergence.coverage.assignedScenarioCount
      !== projection.iterationConvergence.coverage.requiredScenarioCount
    || projection.iterationConvergence.coverage.acceptedGoldScenarioCount
      !== projection.iterationConvergence.coverage.requiredScenarioCount
    || projection.artifactIndex.artifacts.some(
      (artifact) => artifact.availability !== 'available',
    )
    || projection.artifactIndex.rawMeasurements.length === 0
    || projection.artifactIndex.rawMeasurements.some(
      (measurement) => !measurement.numeratorEligible || measurement.goldPolicy !== 'scored',
    )
    || projection.artifactIndex.derivedRankings.length === 0
    || !projection.artifactIndex.derivedRankings.some((ranking) => ranking.eligible)
    || projection.modeStatus.compatibilityState !== 'compatible'
    || commonBundle.certificate.body.verdict !== 'PASS'
    || receipts.some((receipt) => receipt.facts.outcome !== 'completed')
    || !requiredArmCoverage
    || gold.length === 0
    || gold.some((entry) => {
      const material = record(entry.material);
      return material?.goldPolicy !== 'scored'
        || material.integrityStatus !== 'accepted'
        || typeof material.expectedCoverageRatio !== 'number'
        || material.expectedCoverageRatio <= 0;
    })
    || scores.length === 0
    || scores.some((entry) => {
      const material = record(entry.material);
      return material?.numeratorEligible !== true
        || material.goldPolicy !== 'scored'
        || material.goldIntegrityStatus !== 'accepted'
        || material.compatibilityStatus !== 'compatible';
    })
    || !Array.isArray(certificateMaterial?.withheldEvidenceDigests)
    || certificateMaterial.withheldEvidenceDigests.length !== 0
    || !Array.isArray(certificateMaterial.expiryTriggers)
    || certificateMaterial.expiryTriggers.length === 0
    || validityDomain === null
    || validityDomain.taskSetDigest !== run.taskSetDigest
    || validityDomain.skillBundleDigest !== run.skillBundleDigest
    || validityDomain.registryDigest !== run.registryDigest
    || validityDomain.executorDigest !== run.executorDescriptorDigest
    || validityDomain.environmentDigest !== run.environmentDigest
    || validityDomain.dependencyDigest !== run.dependencyDigest
    || validityDomain.workloadDigest !== run.workloadDigest
    || typeof validityDomain.validityPolicyVersion !== 'string';
  if (invalidLifecycle) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.LIFECYCLE_INVALID,
      'certificate:lifecycle',
      'Skill Benchmark evidence does not establish a complete unblocked terminal run',
    );
  }
}

function assertTransitionOrder(receipts: readonly SkillBenchmarkTransitionReceipt[]): void {
  const rank = new Map<SkillBenchmarkTransitionKind, number>(
    SKILL_BENCHMARK_REQUIRED_TRANSITION_ORDER.map((kind, index) => [kind, index]),
  );
  if (SKILL_BENCHMARK_REQUIRED_TRANSITION_ORDER.some(
    (kind) => !receipts.some((receipt) => receipt.facts.transitionKind === kind),
  )) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      'receipt:count',
      'Complete Skill Benchmark evidence requires every mode-specific transition kind',
    );
  }
  receipts.forEach((receipt, index) => {
    const currentRank = rank.get(receipt.facts.transitionKind);
    const priorReceipt = index === 0 ? undefined : receipts[index - 1];
    const priorRank = priorReceipt === undefined
      ? currentRank
      : rank.get(priorReceipt.facts.transitionKind);
    if (
      currentRank === undefined
      || priorRank === undefined
      || currentRank < priorRank
    ) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:order`,
        'Mode-specific receipts are out of lifecycle order',
      );
    }
    const expectedPredecessors = priorReceipt === undefined ? [] : [priorReceipt.receiptDigest];
    if (canonicalJson(asJson(receipt.facts.predecessorReceiptDigests))
      !== canonicalJson(asJson(expectedPredecessors))) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:predecessor`,
        'Receipt predecessor chain is broken',
      );
    }
  });
}

function assertReceiptOwnership(
  artifacts: VerifiedArtifactSet,
  receipts: readonly SkillBenchmarkTransitionReceipt[],
): void {
  const identityDigests = receipts.map((receipt) => receipt.facts.identity.digest);
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  if (
    new Set(identityDigests).size !== identityDigests.length
    || new Set(receiptDigests).size !== receiptDigests.length
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:identity',
      'Receipt identities and receipt digests must be unique',
    );
  }
  const outputOwners = new Map<string, number>();
  for (const receipt of receipts) {
    for (const reference of receipt.facts.outputArtifactQualifiedDigests) {
      outputOwners.set(reference, (outputOwners.get(reference) ?? 0) + 1);
    }
  }
  for (const claim of artifacts.claims) {
    const reference = claim.binding.reference.qualified_digest;
    if (outputOwners.get(reference) !== 1) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        `artifact:${reference}:receipt-owner`,
        'Every certificate artifact must be owned by exactly one authorized transition receipt',
      );
    }
  }
}

function orderedDependencyClosure(
  receipts: readonly SkillBenchmarkTransitionReceipt[],
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
  code: SkillBenchmarkCertificateError['code'],
  location: string,
  reason: string,
): void {
  if (canonicalJson(asJson(expected)) !== canonicalJson(asJson(actual))) {
    throw new SkillBenchmarkCertificateError(
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
  input: SkillBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
): Promise<void> {
  const supplied = parseDeepImprovementCommonCertificateBundle(input.bundle);
  equalCanonical(
    expectedBundle,
    supplied,
    SkillBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
    'common:bundle',
    'Common verification input differs from the embedded common bundle',
  );
  const result = await verifyDeepImprovementCommonCertificateOffline(input);
  if (result.verdict !== 'valid') {
    throw new SkillBenchmarkCertificateError(
      result.verdict === 'unverifiable'
        ? SkillBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
        : SkillBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
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
  receipts: readonly SkillBenchmarkTransitionReceipt[],
): string {
  return digest({
    certificateVersion: SKILL_BENCHMARK_CERTIFICATE_VERSION,
    substrateReplayFingerprint,
    projectionIntegrityDigest,
    commonCertificateDigest: commonBundle.certificate.certificateDigest,
    commonReceiptIdentities: commonIdentities(commonBundle),
    namedDigestClosureRules: SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
    artifactClaims: artifacts.claims,
    orderedDependencyClosure: orderedDependencyClosure(receipts),
    receiptIdentities: receipts.map((receipt) => receipt.facts.identity),
    receiptDigests: receipts.map((receipt) => receipt.receiptDigest),
  });
}

function unsignedCertificateReceipt(
  body: SkillBenchmarkRunCertificateBody,
  certificateDigest: string,
  issuer: string,
  issuedAt: string,
  authorityEpoch: number,
): Omit<BoundaryReceiptPayload, 'certification'> {
  return Object.freeze({
    receipt_id: `skill-benchmark-certificate:${certificateDigest}`,
    boundary_id: `skill-benchmark-certificate-boundary:${certificateDigest}`,
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
    result_event_id: `skill-benchmark-certificate-event:${certificateDigest}`,
    result_event_type: 'skill-benchmark.run-certificate',
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
    idempotency_key: `skill-benchmark-certificate:v1:${certificateDigest}`,
  });
}

export async function issueSkillBenchmarkRunCertificate<TState extends JsonObject>(
  input: SkillBenchmarkCertificateIssuerInput<TState>,
): Promise<SkillBenchmarkCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
      'replay:runId',
      'Replay run identity differs from certificate identity',
    );
  }
  const commonBundle = parseDeepImprovementCommonCertificateBundle(
    input.commonVerification.bundle,
  );
  await verifyCommonBoundary(
    commonBundle,
    input.commonVerification as SkillBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
  );
  const allEvents = await input.replay.ledger.readVerifiedEvents();
  const coveredEvents = allEvents.slice(
    input.replay.rangeStartSequence - 1,
    input.replay.rangeEndSequence,
  );
  if (coveredEvents.length === 0) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
  const folded = foldSkillBenchmarkEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      `Skill Benchmark reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
    );
  }
  const facts = projectionFacts(folded.projection);
  if (
    facts.runId !== input.runId
    || facts.lineageId !== input.lineageId
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:identity',
      'Reducer-derived run identity differs from certificate input',
    );
  }
  if (
    commonBundle.certificate.body.runId !== input.runId
    || commonBundle.certificate.body.lineageId !== input.lineageId
    || commonBundle.certificate.body.generation !== input.generation
  ) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:identity',
      'Common certificate identity differs from the Skill Benchmark projection',
    );
  }
  const replay = await deriveReplayFingerprint(input.replay);
  const artifacts = await verifiedArtifactSet(
    input.artifactStore,
    input.artifactBindings,
    commonBundle.certificate.body.evaluatorEpochId,
    commonBundle.certificate.body.canaryEpochId,
    input.verificationTime,
  );
  assertArtifactEventsAuthorized(artifacts, coveredEvents);
  const receipts: SkillBenchmarkTransitionReceipt[] = [];
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
      canaryEpochId: commonBundle.certificate.body.canaryEpochId,
      verificationTime: input.verificationTime,
    });
    receipts.push(receipt);
  }
  assertTransitionOrder(receipts);
  assertReceiptOwnership(artifacts, receipts);
  assertTrustedTerminal(folded.projection, artifacts, commonBundle, receipts);
  const firstEvent = coveredEvents[0];
  const finalEvent = coveredEvents.at(-1);
  const finalReceipt = receipts.at(-1);
  if (firstEvent === undefined || finalEvent === undefined || finalReceipt === undefined) {
    throw new SkillBenchmarkCertificateError(
      SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
      'certificate:terminal-evidence',
      'Certificate requires non-empty ledger and receipt evidence',
    );
  }
  const sealedFacts = artifactFacts(artifacts);
  const projectionIntegrityDigest = skillBenchmarkProjectionIntegrityDigest(
    folded.projection,
  );
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: SkillBenchmarkRunCertificateBody = Object.freeze({
    certificateVersion: SKILL_BENCHMARK_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    mode: 'skill-benchmark',
    certificateSchema: 'skill-effect-certificate.v1',
    ...facts,
    modeState: 'issued',
    certificateState: 'issued',
    collectionComplete: true,
    scoringComplete: true,
    certificateReady: true,
    generation: input.generation,
    evaluatorEpochId: commonBundle.certificate.body.evaluatorEpochId,
    canaryEpochId: commonBundle.certificate.body.canaryEpochId,
    disposition: commonBundle.certificate.body.verdict,
    ...sealedFacts,
    artifactClaims: artifacts.claims,
    artifactSetDigest: digest(artifacts.claims),
    namedDigestClosureRules: SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
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
    startHeadHash: firstEvent.frame.prev_record_hash,
    finalHeadHash: finalEvent.frame.record_hash,
  });
  const certificateDigest = digest(body);
  const unsigned = unsignedCertificateReceipt(
    body,
    certificateDigest,
    input.issuer,
    input.issuedAt,
    finalReceipt.facts.authorityEpoch,
  );
  const certification = await certifyBoundaryReceipt(
    unsigned,
    input.certificationProfile,
    input.providers,
  );
  const certificate = parseSkillBenchmarkRunCertificate({
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
  bundle: SkillBenchmarkCertificateBundle,
  coveredEvents: readonly VerifiedLedgerEvent[],
  allEvents: readonly VerifiedLedgerEvent[],
  artifacts: VerifiedArtifactSet,
  providers: CertificationProviderRegistry,
): Promise<void> {
  assertTransitionOrder(bundle.receipts);
  assertReceiptOwnership(artifacts, bundle.receipts);
  const expectedCommon = commonIdentities(bundle.commonBundle);
  const receiptInputs = bundle.receipts.map((receipt): SkillBenchmarkTransitionReceiptInput => ({
    transitionKind: receipt.facts.transitionKind,
    logicalOperationId: receipt.facts.logicalOperationId,
    effectIdempotencyKey: receipt.facts.effectIdempotencyKey,
    attemptNumber: receipt.facts.attemptNumber,
    resultEventId: receipt.facts.resultEventId,
    inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
    outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
    evidenceArtifactQualifiedDigests: receipt.facts.evidenceArtifactQualifiedDigests,
  }));
  const verified: SkillBenchmarkTransitionReceipt[] = [];
  for (const [index, receipt] of bundle.receipts.entries()) {
    equalCanonical(
      expectedCommon,
      receipt.facts.commonReceiptIdentities,
      SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      canaryEpochId: bundle.certificate.body.canaryEpochId,
      verificationTime: bundle.certificate.sharedCertificationReceipt.issued_at,
    });
    equalCanonical(
      expectedFacts,
      receipt.facts,
      SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Receipt facts do not re-derive from authorized evidence',
    );
    const expectedDigest = digest(expectedFacts);
    if (
      expectedDigest !== receipt.receiptDigest
      || expectedDigest !== bundle.certificate.body.receiptDigests[index]
    ) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
        `receipt:${index}:durable-event`,
        'Transition receipt does not resolve exactly once in the authorized ledger',
      );
    }
    const durableEvent = durable[0];
    if (durableEvent === undefined) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE,
        `receipt:${index}:durable-event`,
        'Transition receipt durable event disappeared during verification',
      );
    }
    equalCanonical(
      durableEvent.event.effective.envelope.payload,
      receipt.sharedReceipt,
      SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      durableEvent,
      verificationEvents,
      new BoundaryRegistry([boundaryDefinition(receipt.facts)]),
      providers,
    );
    verified.push(receipt);
  }
}

async function verifyCertificateCertification(
  certificate: SkillBenchmarkRunCertificate,
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
    SkillBenchmarkCertificateFailureCodes.CERTIFICATION_INVALID,
    'certificate:certification',
    'Certificate receipt does not bind the recomputed certificate',
  );
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

function failureResult(error: unknown): SkillBenchmarkOfflineVerificationFailure {
  let verdict: SkillBenchmarkOfflineVerificationFailure['verdict'] = 'invalid';
  let code: SkillBenchmarkOfflineVerificationFailure['code'] =
    SkillBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';
  if (error instanceof SkillBenchmarkCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === SkillBenchmarkCertificateFailureCodes.MISSING_EVIDENCE
      || error.code === SkillBenchmarkCertificateFailureCodes.INCOMPLETE_RUN
      || error.code === SkillBenchmarkCertificateFailureCodes.LIFECYCLE_INVALID) {
      verdict = 'incomplete';
    }
    if (error.code === SkillBenchmarkCertificateFailureCodes.UNSUPPORTED_VERSION) {
      verdict = 'unsupported';
    }
    if (error.code === SkillBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
      && error.evidenceLocation.startsWith('common:')) {
      verdict = 'unverifiable';
    }
  } else if (error instanceof SealedArtifactError) {
    code = error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING
      ? SkillBenchmarkCertificateFailureCodes.ARTIFACT_MISSING
      : SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof DeepImprovementArtifactReadError) {
    code = error.code === DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH
      ? SkillBenchmarkCertificateFailureCodes.EPOCH_MISMATCH
      : error.code === DeepImprovementArtifactReadFailureCodes.STALE_CANARY
        ? SkillBenchmarkCertificateFailureCodes.ARTIFACT_STALE
        : error.code === DeepImprovementArtifactReadFailureCodes.ACCESS_DENIED
          || error.code === DeepImprovementArtifactReadFailureCodes.LEAK_DETECTED
          ? SkillBenchmarkCertificateFailureCodes.VISIBILITY_INVALID
          : SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID;
    evidenceLocation = 'artifact:verified-read';
    failureReason = error.message;
  } else if (error instanceof Error) {
    code = SkillBenchmarkCertificateFailureCodes.CERTIFICATION_INVALID;
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

export async function verifySkillBenchmarkCertificateOffline<TState extends JsonObject>(
  input: SkillBenchmarkOfflineVerificationInput<TState>,
): Promise<SkillBenchmarkOfflineVerificationResult> {
  try {
    const bundle = parseSkillBenchmarkCertificateBundle(input.bundle);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== bundle.certificate.body.runId) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:runId',
        'Replay run identity differs from certificate identity',
      );
    }
    await verifyCommonBoundary(
      bundle.commonBundle,
      input.commonVerification as SkillBenchmarkCertificateIssuerInput<JsonObject>['commonVerification'],
    );
    if (
      bundle.certificate.body.commonCertificateDigest
        !== bundle.commonBundle.certificate.certificateDigest
    ) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
        'common:certificate-digest',
        'Skill Benchmark certificate changed the shared certificate identity',
      );
    }
    equalCanonical(
      commonIdentities(bundle.commonBundle),
      bundle.certificate.body.commonReceiptIdentities,
      SkillBenchmarkCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:receipt-identities',
      'Skill Benchmark certificate changed shared evaluator, canary, or promotion receipt identities',
    );
    equalCanonical(
      SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
      bundle.certificate.body.namedDigestClosureRules,
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:named-digest-rules',
      'Certificate changed the frozen named-digest closure map',
    );
    const allEvents = await input.replay.ledger.readVerifiedEvents();
    const coveredEvents = allEvents.slice(
      input.replay.rangeStartSequence - 1,
      input.replay.rangeEndSequence,
    );
    if (coveredEvents.length === 0) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Offline replay range contains no authorized events',
      );
    }
    assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
    const folded = foldSkillBenchmarkEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        `Skill Benchmark reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
      );
    }
    const facts = projectionFacts(folded.projection);
    equalCanonical(
      facts,
      {
        runId: bundle.certificate.body.runId,
        lineageId: bundle.certificate.body.lineageId,
        benchmarkDesignId: bundle.certificate.body.benchmarkDesignId,
        designDigest: bundle.certificate.body.designDigest,
        taskSetDigest: bundle.certificate.body.taskSetDigest,
        skillBundleDigest: bundle.certificate.body.skillBundleDigest,
        registryDigest: bundle.certificate.body.registryDigest,
        executorDigest: bundle.certificate.body.executorDigest,
        environmentDigest: bundle.certificate.body.environmentDigest,
        dependencyDigest: bundle.certificate.body.dependencyDigest,
        workloadDigest: bundle.certificate.body.workloadDigest,
        modeState: bundle.certificate.body.modeState,
        certificateState: bundle.certificate.body.certificateState,
        requiredScenarioCount: bundle.certificate.body.requiredScenarioCount,
        assignedScenarioCount: bundle.certificate.body.assignedScenarioCount,
        acceptedGoldScenarioCount: bundle.certificate.body.acceptedGoldScenarioCount,
        collectionComplete: bundle.certificate.body.collectionComplete,
        scoringComplete: bundle.certificate.body.scoringComplete,
        certificateReady: bundle.certificate.body.certificateReady,
        treatmentArms: bundle.certificate.body.treatmentArms,
        blockingVetoCodes: bundle.certificate.body.blockingVetoCodes,
        blockerCodes: bundle.certificate.body.blockerCodes,
      },
      SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
      'projection:certificate-facts',
      'Certificate mode fields do not re-derive from the reducer',
    );
    const projectionIntegrityDigest = skillBenchmarkProjectionIntegrityDigest(
      folded.projection,
    );
    if (projectionIntegrityDigest !== bundle.certificate.body.projectionIntegrityDigest) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute',
        projectionIntegrityDigest,
        bundle.certificate.body.projectionIntegrityDigest,
      );
    }
    const replay = await deriveReplayFingerprint(input.replay).catch((error: unknown) => {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
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
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
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
      bundle.certificate.body.canaryEpochId,
      input.verificationTime,
    );
    assertArtifactEventsAuthorized(artifacts, coveredEvents);
    equalCanonical(
      artifacts.claims,
      bundle.certificate.body.artifactClaims,
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
      'artifact:claims',
      'Certificate artifact claims differ from real verified reads',
    );
    const artifactSetDigest = digest(artifacts.claims);
    if (artifactSetDigest !== bundle.certificate.body.artifactSetDigest) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
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
        evidenceSetDigest: bundle.certificate.body.evidenceSetDigest,
        validityDomainDigest: bundle.certificate.body.validityDomainDigest,
        expiryTriggers: bundle.certificate.body.expiryTriggers,
        benchmarkDesignQualifiedDigest:
          bundle.certificate.body.benchmarkDesignQualifiedDigest,
        skillBundleQualifiedDigest:
          bundle.certificate.body.skillBundleQualifiedDigest,
        goldManifestQualifiedDigests:
          bundle.certificate.body.goldManifestQualifiedDigests,
        runAssignmentQualifiedDigests:
          bundle.certificate.body.runAssignmentQualifiedDigests,
        exposureObservationQualifiedDigests:
          bundle.certificate.body.exposureObservationQualifiedDigests,
        causalScoreObservationQualifiedDigests:
          bundle.certificate.body.causalScoreObservationQualifiedDigests,
        certificateInputQualifiedDigest:
          bundle.certificate.body.certificateInputQualifiedDigest,
      },
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:certificate-facts',
      'Certificate artifact facts do not re-derive from real sealed reads',
    );
    await verifyReceipts(bundle, coveredEvents, allEvents, artifacts, input.providers);
    assertTrustedTerminal(folded.projection, artifacts, bundle.commonBundle, bundle.receipts);
    equalCanonical(
      orderedDependencyClosure(bundle.receipts),
      bundle.certificate.body.orderedDependencyClosure,
      SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:ordered-closure',
      'Ordered artifact dependency closure does not recompute',
    );
    const receiptDigests = bundle.receipts.map((receipt) => receipt.receiptDigest);
    if (digest(receiptDigests) !== bundle.certificate.body.receiptChainDigest) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:composite',
        'Composite replay fingerprint does not recompute from the ordered closure',
        recomputedReplay,
        bundle.certificate.body.replayFingerprint,
      );
    }
    const firstEvent = coveredEvents[0];
    const finalEvent = coveredEvents.at(-1);
    if (
      firstEvent === undefined
      || finalEvent === undefined
      || firstEvent.frame.prev_record_hash !== bundle.certificate.body.startHeadHash
      || finalEvent.frame.record_hash !== bundle.certificate.body.finalHeadHash
    ) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.LEDGER_INVALID,
        'ledger:heads',
        'Certificate ledger heads differ from the verified replay range',
      );
    }
    const certificateDigest = digest(bundle.certificate.body);
    if (certificateDigest !== bundle.certificate.certificateDigest) {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate digest does not recompute',
        certificateDigest,
        bundle.certificate.certificateDigest,
      );
    }
    await verifyCertificateCertification(bundle.certificate, input.providers);
    if (bundle.certificate.body.disposition !== 'PASS') {
      throw new SkillBenchmarkCertificateError(
        SkillBenchmarkCertificateFailureCodes.INCOMPLETE_RUN,
        'certificate:disposition',
        'Coherent evidence does not establish a passing terminal disposition',
      );
    }
    const verifierCore = Object.freeze({
      receiptVersion: 1 as const,
      certificateDigest,
      verifierVersion: 'skill-benchmark-offline-verifier@1',
      rulesetDigest: digest({
        transitions: SKILL_BENCHMARK_REQUIRED_TRANSITION_ORDER,
        transitionInputs: TRANSITION_INPUT_KINDS,
        transitionEvidence: TRANSITION_EVIDENCE_KINDS,
        artifactRoles: SKILL_BENCHMARK_ARTIFACT_ROLE_EXPECTATIONS,
        namedDigestClosureRules: SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
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
