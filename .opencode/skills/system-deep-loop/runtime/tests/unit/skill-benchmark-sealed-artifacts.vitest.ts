// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Sealed Artifact Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
  SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  SkillBenchmarkArtifactKinds,
  createSkillBenchmarkSealedArtifactStore,
  readSkillBenchmarkArtifact,
  sealSkillBenchmarkArtifact,
} from '../../lib/skill-benchmark-sealed-artifacts/index.js';

import type {
  ArtifactStoreFaultInjection,
  SealedArtifactReference,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  DeepImprovementBaselineInputMaterial,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementPromotionEvidenceMaterial,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import type {
  SkillBenchmarkArtifactMaterial,
  SkillBenchmarkBenchmarkDesignMaterial,
  SkillBenchmarkCausalScoreObservationMaterial,
  SkillBenchmarkEffectCertificateInputMaterial,
  SkillBenchmarkExposureObservationMaterial,
  SkillBenchmarkRunAssignmentMaterial,
  SkillBenchmarkScenarioGoldManifestMaterial,
  SkillBenchmarkSkillBundleSnapshotMaterial,
} from '../../lib/skill-benchmark-sealed-artifacts/index.js';

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const DIGEST_D = 'd'.repeat(64);
const temporaryRoots: string[] = [];

const LOCATOR = Object.freeze({
  scheme: 'artifact' as const,
  locatorDigest: DIGEST_A,
  selector: 'skill-benchmark:artifact',
  revision: 'revision-1',
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `skill-benchmark-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function dependency(
  purpose: string,
  artifactKind: string,
  reference: SealedArtifactReference,
): { purpose: string; artifactKind: string; reference: SealedArtifactReference } {
  return { purpose, artifactKind, reference };
}

function commonDependency(
  purpose: string,
  reference: SealedArtifactReference,
): { purpose: string; reference: SealedArtifactReference } {
  return { purpose, reference };
}

function evaluatorMaterial(): DeepImprovementEvaluatorCapsuleMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'evaluator-capsule-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    evaluatorImplementationDigest: DIGEST_A,
    evaluatorSchemaDigest: DIGEST_B,
    rubricDigest: DIGEST_C,
    policyDigest: DIGEST_D,
    fixtureManifestDigest: DIGEST_A,
    hiddenAnchorCommitmentDigest: DIGEST_B,
    calibrationDigest: DIGEST_C,
    normalizationDigest: DIGEST_D,
    environmentDigest: DIGEST_A,
    capabilityDigest: DIGEST_B,
    visibilityPolicy: {
      candidateView: 'verdict-band',
      hiddenFixtures: 'withheld',
      exactScores: 'withheld',
      evaluatorInternals: 'withheld',
      terminalEvidence: 'withheld',
    },
    budgetPolicy: {
      maxQueries: 20,
      maxBytes: 4096,
      maxWallClockMs: 1000,
      maxCostMicros: 5000,
    },
    dependencyReferences: [],
    originEvent: {
      eventStem: 'deep_improvement_common.evaluation_epoch_sealed',
      eventId: 'evaluator-event-1',
      payloadDigest: DIGEST_A,
    },
    producerVersion: 'evaluator-producer@1',
    locator: {
      scheme: 'artifact',
      locatorDigest: DIGEST_A,
      selector: 'common:evaluator',
      revision: 'revision-1',
    },
  };
}

function canaryMaterial(
  evaluator: SealedArtifactReference,
  lifecycle: DeepImprovementCanaryEpochMaterial['lifecycle'] = 'active',
): DeepImprovementCanaryEpochMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'canary-epoch-1',
    canaryEpochId: 'canary-epoch-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    suiteId: 'canary-suite-1',
    lifecycle,
    suiteManifestDigest: DIGEST_A,
    hiddenAnchorCommitmentDigest: DIGEST_B,
    adversarialSuiteDigest: DIGEST_C,
    metamorphicSuiteDigest: DIGEST_D,
    crossDomainSuiteDigest: DIGEST_A,
    leakagePolicy: {
      literalLeakDetection: 'required',
      semanticLeakDetection: 'required',
      candidateVisibleContent: 'withheld',
    },
    freshnessWindowSeconds: 2_000_000_000,
    sealedAt: '2026-07-23T08:00:00.000Z',
    expiresAt: '2090-01-01T00:00:00.000Z',
    supersedesReference: null,
    dependencyReferences: [commonDependency(
      'evaluator-capsule',
      evaluator,
    )],
    originEvent: {
      eventStem: 'deep_improvement_common.canary_suite_sealed',
      eventId: 'canary-event-1',
      payloadDigest: DIGEST_B,
    },
    producerVersion: 'canary-producer@1',
    locator: {
      scheme: 'artifact',
      locatorDigest: DIGEST_A,
      selector: 'common:canary',
      revision: 'revision-1',
    },
  };
}

function candidateMaterial(
  evaluator: SealedArtifactReference,
  source: SealedArtifactReference,
): DeepImprovementCandidateInputMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'candidate-input-1',
    candidateId: 'candidate-1',
    lineageId: 'lineage-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    parentCandidateReference: null,
    mutationOperatorReference: 'operator:mutation-1',
    mutationOperatorVersion: 'mutation@1',
    profileScopeDigest: DIGEST_A,
    modelConfigurationDigest: DIGEST_B,
    promptConfigurationDigest: DIGEST_C,
    toolConfigurationDigest: DIGEST_D,
    selectedFixtureManifestDigest: DIGEST_A,
    seed: 7,
    sourceArtifactReferences: [source],
    dependencyReferences: [
      commonDependency('evaluator-capsule', evaluator),
      commonDependency('candidate-source', source),
    ],
    originEvent: {
      eventStem: 'deep_improvement_common.candidate_generated',
      eventId: 'candidate-event-1',
      payloadDigest: DIGEST_B,
    },
    producerVersion: 'candidate-producer@1',
    locator: LOCATOR,
  };
}

function baselineMaterial(
  evaluator: SealedArtifactReference,
  incumbent: SealedArtifactReference,
): DeepImprovementBaselineInputMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'baseline-input-1',
    baselineId: 'baseline-1',
    lineageId: 'lineage-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    incumbentReference: incumbent,
    profileScopeDigest: DIGEST_A,
    modelConfigurationDigest: DIGEST_B,
    promptConfigurationDigest: DIGEST_C,
    toolConfigurationDigest: DIGEST_D,
    selectedFixtureManifestDigest: DIGEST_A,
    seed: 7,
    sourceArtifactReferences: [incumbent],
    dependencyReferences: [
      commonDependency('evaluator-capsule', evaluator),
      commonDependency('incumbent', incumbent),
    ],
    originEvent: {
      eventStem: 'deep_improvement_common.candidate_lineage_attached',
      eventId: 'baseline-event-1',
      payloadDigest: DIGEST_C,
    },
    producerVersion: 'baseline-producer@1',
    locator: LOCATOR,
  };
}

function promotionMaterial(
  candidate: SealedArtifactReference,
  baseline: SealedArtifactReference,
  evaluator: SealedArtifactReference,
  canary: SealedArtifactReference,
): DeepImprovementPromotionEvidenceMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'promotion-evidence-1',
    promotionId: 'promotion-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    candidateInputReference: candidate,
    baselineInputReference: baseline,
    evaluatorCapsuleReference: evaluator,
    canaryEpochReference: canary,
    targetRepairEvidenceReference: evaluator,
    baselinePreservationEvidenceReference: evaluator,
    criticalDimensionEvidenceReference: evaluator,
    evaluatorIntegrityEvidenceReference: evaluator,
    canaryOutcomeEvidenceReference: evaluator,
    uncertaintyEvidenceReference: evaluator,
    costEvidenceReference: evaluator,
    rollbackTargetReference: evaluator,
    targetRepair: 'pass',
    baselinePreservation: 'pass',
    criticalDimensions: 'pass',
    evaluatorIntegrity: 'pass',
    canaryOutcome: 'pass',
    uncertaintyLowerBound: 0.9,
    uncertaintyThreshold: 0.5,
    costMicros: 10,
    costLimitMicros: 100,
    unresolvedEvidenceDigests: [],
    vetoEvidenceDigests: [],
    admissibility: 'eligible',
    dependencyReferences: [
      commonDependency('candidate-input', candidate),
      commonDependency('baseline-input', baseline),
      commonDependency('evaluator-capsule', evaluator),
      commonDependency('canary-epoch', canary),
    ],
    originEvent: {
      eventStem: 'deep_improvement_common.promotion_proposed',
      eventId: 'promotion-event-1',
      payloadDigest: DIGEST_C,
    },
    producerVersion: 'promotion-producer@1',
    locator: {
      scheme: 'artifact',
      locatorDigest: DIGEST_A,
      selector: 'common:promotion',
      revision: 'revision-1',
    },
  };
}

interface CommonReferences {
  readonly evaluator: SealedArtifactReference;
  readonly canary: SealedArtifactReference;
  readonly promotion: SealedArtifactReference;
}

async function commonReferences(store: ReturnType<typeof createSkillBenchmarkSealedArtifactStore>): Promise<CommonReferences> {
  const source = await sealSkillBenchmarkArtifact(
    store,
    SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    designMaterial(),
  );
  const evaluator = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    evaluatorMaterial(),
  );
  const candidate = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
    candidateMaterial(evaluator.reference, source.reference),
  );
  const baseline = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
    baselineMaterial(evaluator.reference, source.reference),
  );
  const canary = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    canaryMaterial(evaluator.reference),
  );
  const promotion = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    promotionMaterial(
      candidate.reference,
      baseline.reference,
      evaluator.reference,
      canary.reference,
    ),
  );
  return {
    evaluator: evaluator.reference,
    canary: canary.reference,
    promotion: promotion.reference,
  };
}

function base(
  artifactId: string,
  eventStem: string,
  eventId: string,
): Pick<SkillBenchmarkArtifactMaterial, 'schemaVersion' | 'artifactId' | 'dependencyReferences' | 'originEvent' | 'producerVersion' | 'locator'> {
  return {
    schemaVersion: 'skill-benchmark-artifact@1',
    artifactId,
    dependencyReferences: [],
    originEvent: {
      eventStem: eventStem as never,
      eventId,
      payloadDigest: DIGEST_A,
    },
    producerVersion: 'skill-benchmark-producer@1',
    locator: LOCATOR,
  };
}

function designMaterial(): SkillBenchmarkBenchmarkDesignMaterial {
  return {
    ...base('design-1', 'skill_benchmark.run_planned', 'design-event-1'),
    randomizationSeed: 7,
    replicateCount: 2,
    blockingFactorCodes: ['task-family', 'executor'],
    treatmentArms: ['no-skill', 'auto-route', 'forced-activation', 'placebo'],
    assignmentPolicyVersion: 'assignment-policy@1',
    registryDigest: DIGEST_B,
    workloadDigest: DIGEST_C,
    designCellDigests: [DIGEST_A, DIGEST_D],
  };
}

function bundleMaterial(): SkillBenchmarkSkillBundleSnapshotMaterial {
  return {
    ...base('bundle-1', 'skill_benchmark.skill_discovered', 'bundle-event-1'),
    bundleDigest: DIGEST_A,
    skillTreeDigest: DIGEST_B,
    packageManifestDigest: DIGEST_C,
    resourceManifestDigest: DIGEST_D,
    resourceDigests: [DIGEST_A, DIGEST_B],
    resourceClasses: ['instruction', 'reference'],
    permissionDigest: DIGEST_C,
    dependencyCompatibilityDigest: DIGEST_D,
    registryDigest: DIGEST_A,
    visibilityCommitmentDigest: DIGEST_B,
  };
}

function goldMaterial(
  policy: SkillBenchmarkScenarioGoldManifestMaterial['goldPolicy'] = 'scored',
): SkillBenchmarkScenarioGoldManifestMaterial {
  return {
    ...base('gold-1', 'skill_benchmark.gold_integrity_recorded', 'gold-event-1'),
    scenarioId: 'scenario-1',
    taskRecipeDigest: DIGEST_A,
    constraintSetDigest: DIGEST_B,
    deterministicCheckSetDigest: DIGEST_C,
    dynamicReferenceSetDigest: DIGEST_D,
    negativeControlSetDigest: DIGEST_A,
    goldPolicy: policy,
    goldProvenanceRef: 'artifact:gold-provenance-1',
    goldProvenanceDigest: DIGEST_B,
    expectedCoverageRatio: policy === 'pending' ? 0 : 1,
    mutationSensitivityRef: 'artifact:gold-mutation-1',
    mutationSensitivityDigest: DIGEST_C,
    hiddenOracleCommitmentDigest: DIGEST_D,
    integrityStatus: policy === 'scored' ? 'accepted' : 'pending',
  };
}

function assignmentMaterial(
  refs: CommonReferences,
): SkillBenchmarkRunAssignmentMaterial {
  return {
    ...base('assignment-1', 'skill_benchmark.treatment_assigned', 'assignment-event-1'),
    designCellId: 'cell-1',
    treatmentArm: 'auto-route',
    randomizationSeed: 7,
    propensity: 0.5,
    replicateIndex: 0,
    pairedReplicateId: 'pair-1',
    taskRef: 'artifact:task-1',
    taskDigest: DIGEST_A,
    skillBundleRef: 'artifact:bundle-1',
    skillBundleDigest: DIGEST_B,
    executorDescriptorRef: 'artifact:executor-1',
    executorDescriptorDigest: DIGEST_C,
    environmentRef: 'artifact:environment-1',
    environmentDigest: DIGEST_D,
    toolDigest: DIGEST_A,
    permissionDigest: DIGEST_B,
    dependencyDigest: DIGEST_C,
    registryDigest: DIGEST_D,
    workloadDigest: DIGEST_A,
    evaluatorEpochId: 'evaluation-epoch-1',
    evaluatorCapsuleReference: refs.evaluator,
  };
}

function exposureMaterial(
  refs: CommonReferences,
): SkillBenchmarkExposureObservationMaterial {
  return {
    ...base('exposure-1', 'skill_benchmark.resource_exposed', 'exposure-event-1'),
    assignmentId: 'assignment-1',
    assignmentDigest: DIGEST_A,
    bundleDigest: DIGEST_B,
    evaluatorEpochId: 'evaluation-epoch-1',
    discoveryEvidenceRef: 'artifact:discovery-1',
    discoveryEvidenceDigest: DIGEST_C,
    loadingEvidenceRef: 'artifact:loading-1',
    loadingEvidenceDigest: DIGEST_D,
    invocationEvidenceRef: 'artifact:invocation-1',
    invocationEvidenceDigest: DIGEST_A,
    resourceCanaryRef: 'artifact:resource-canary-1',
    resourceCanaryDigest: DIGEST_B,
    canaryStatus: 'clean',
    keyPointCoverageDigest: DIGEST_C,
    keyPointOrderDigest: DIGEST_D,
    milestoneEvidenceDigest: DIGEST_A,
    finalArtifactRef: 'artifact:final-1',
    finalArtifactDigest: DIGEST_B,
    costMicrounits: 10,
    latencyMs: 20,
    tokenCount: 30,
    securityProbeDigest: DIGEST_C,
    visibilityStatus: 'downstream',
    canaryEpochReference: refs.canary,
  };
}

function scoreMaterial(
  refs: CommonReferences,
  goldReference: SealedArtifactReference,
): SkillBenchmarkCausalScoreObservationMaterial {
  return {
    ...base('score-1', 'skill_benchmark.score_observed', 'score-event-1'),
    assignmentId: 'assignment-1',
    assignmentDigest: DIGEST_A,
    outcomeRef: 'artifact:outcome-1',
    outcomeDigest: DIGEST_B,
    scenarioGoldManifestReference: goldReference,
    evaluatorCapsuleReference: refs.evaluator,
    canaryEpochReference: refs.canary,
    rawOutputRef: 'artifact:raw-output-1',
    rawOutputDigest: DIGEST_C,
    deterministicResultsRef: 'artifact:deterministic-results-1',
    deterministicResultsDigest: DIGEST_D,
    dynamicReferenceResultsRef: 'artifact:dynamic-results-1',
    dynamicReferenceResultsDigest: DIGEST_A,
    constraintCoverageRef: 'artifact:coverage-1',
    constraintCoverageDigest: DIGEST_B,
    rawScoreAxes: [{
      dimensionCode: 'final-state',
      rawScore: 0.8,
      measurementRef: 'artifact:measurement-1',
      measurementDigest: DIGEST_C,
    }],
    inputTokenCount: 10,
    outputTokenCount: 20,
    totalTokenCount: 30,
    latencyMs: 40,
    costMicrounits: 50,
    compatibilityStatus: 'compatible',
    negativeTransferEvidenceDigest: null,
    securityProbeEvidenceDigest: DIGEST_D,
    goldPolicy: 'scored',
    goldIntegrityStatus: 'accepted',
    numeratorEligible: true,
    evaluatorEpochId: 'evaluation-epoch-1',
  };
}

function certificateInputMaterial(
  refs: CommonReferences,
): SkillBenchmarkEffectCertificateInputMaterial {
  return {
    ...base('certificate-input-1', 'skill_benchmark.effect_certificate_issued', 'certificate-input-event-1'),
    evidenceSetDigest: DIGEST_A,
    pairedDeltaDigests: [DIGEST_B],
    confidenceIntervalRef: 'artifact:confidence-interval-1',
    confidenceIntervalDigest: DIGEST_C,
    componentAblationDigests: [DIGEST_D],
    compatibilitySliceDigests: [DIGEST_A],
    negativeTransferDigests: [DIGEST_B],
    costSecurityDeltaDigest: DIGEST_C,
    validityDomain: {
      taskSetDigest: DIGEST_A,
      skillBundleDigest: DIGEST_B,
      registryDigest: DIGEST_C,
      executorDigest: DIGEST_D,
      environmentDigest: DIGEST_A,
      dependencyDigest: DIGEST_B,
      workloadDigest: DIGEST_C,
      validityPolicyVersion: 'validity-policy@1',
    },
    expiryTriggers: ['bundle-drift', 'evaluator-drift'],
    withheldEvidenceDigests: [DIGEST_D],
    evaluatorEpochId: 'evaluation-epoch-1',
    evaluatorCapsuleReference: refs.evaluator,
    canaryEpochReference: refs.canary,
    promotionEvidenceReference: refs.promotion,
  };
}

function materialFor(
  kind: SkillBenchmarkArtifactKinds[keyof typeof SkillBenchmarkArtifactKinds],
  refs: CommonReferences,
  goldReference: SealedArtifactReference,
): SkillBenchmarkArtifactMaterial {
  switch (kind) {
    case SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN:
      return designMaterial();
    case SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT:
      return bundleMaterial();
    case SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST:
      return goldMaterial();
    case SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT:
      return assignmentMaterial(refs);
    case SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION:
      return exposureMaterial(refs);
    case SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION:
      return scoreMaterial(refs, goldReference);
    case SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT:
      return certificateInputMaterial(refs);
    default: {
      const exhaustiveKind: never = kind;
      throw new Error(`No fixture for ${String(exhaustiveKind)}`);
    }
  }
}

function bindingFor(
  kind: SkillBenchmarkArtifactKinds[keyof typeof SkillBenchmarkArtifactKinds],
  reference: SealedArtifactReference,
): { bindingVersion: 1; artifactKind: typeof kind; eventReference: string; reference: SealedArtifactReference } {
  return {
    bindingVersion: 1,
    artifactKind: kind,
    eventReference: `artifact:${reference.qualified_digest}`,
    reference,
  };
}

async function sealScoreMaterialDirectly(
  store: ReturnType<typeof createSkillBenchmarkSealedArtifactStore>,
  material: SkillBenchmarkCausalScoreObservationMaterial,
) {
  const sealed = await store.seal(
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
    material,
    {
      canonicalizationVersion: SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
    },
  );
  return bindingFor(
    SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
    sealed.artifact.reference,
  );
}

async function expectArtifactFailure(
  operation: Promise<unknown>,
  code: string,
): Promise<SealedArtifactError> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(SealedArtifactError);
    const typed = error as SealedArtifactError;
    expect(typed.code).toBe(code);
    expect(typed).not.toHaveProperty('bytes');
    return typed;
  }
  throw new Error(`Expected artifact failure ${code}`);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('skill benchmark sealed artifacts', () => {
  it('registers and seals every mode-specific artifact kind through the shared store', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('all-kinds'),
    });
    const substrateImportsReal = store instanceof SealedArtifactStore;
    expect(substrateImportsReal).toBe(true);
    const refs = await commonReferences(store);
    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    expect(SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind)).toEqual(
      Object.values(SkillBenchmarkArtifactKinds),
    );

    for (const kind of Object.values(SkillBenchmarkArtifactKinds)) {
      const binding = await sealSkillBenchmarkArtifact(store, kind, materialFor(kind, refs, gold.reference));
      const verified = await readSkillBenchmarkArtifact(store, binding);
      expect(binding.reference.artifact_kind).toBe(kind);
      expect(verified.descriptor.artifact_kind).toBe(kind);
      expect(Buffer.from(verified.bytes).toString('utf8')).toContain(kind);
    }
  });

  it('reproduces the same digest for repeated equivalent seals', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('deterministic'),
    });
    const first = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
    );
    const reordered = {
      ...designMaterial(),
      locator: LOCATOR,
      designCellDigests: [DIGEST_A, DIGEST_D],
      treatmentArms: ['no-skill', 'auto-route', 'forced-activation', 'placebo'] as const,
    };
    const second = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      reordered,
    );
    expect(second.reference).toEqual(first.reference);
  });

  it('rejects mutable bodies, prose selectors, and invalid gold or score states', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('closed-fields'),
    });
    const refs = await commonReferences(store);
    const withMutableBody = {
      ...designMaterial(),
      reportBody: 'mutable benchmark body',
    } as unknown as SkillBenchmarkBenchmarkDesignMaterial;
    await expectArtifactFailure(
      sealSkillBenchmarkArtifact(store, SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, withMutableBody),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const proseSelector = {
      ...designMaterial(),
      locator: { ...LOCATOR, selector: Array.from({ length: 18 }, () => 'prose').join(' ') },
    };
    await expectArtifactFailure(
      sealSkillBenchmarkArtifact(store, SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, proseSelector),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const badScore = {
      ...scoreMaterial(refs, gold.reference),
      goldPolicy: 'pending' as const,
    };
    await expectArtifactFailure(
      sealSkillBenchmarkArtifact(store, SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION, badScore),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('derives positive-score eligibility from the referenced gold manifest real state', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('real-gold-state'),
    });
    const refs = await commonReferences(store);
    const acceptedGold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const acceptedScore = await sealScoreMaterialDirectly(
      store,
      scoreMaterial(refs, acceptedGold.reference),
    );
    await expect(readSkillBenchmarkArtifact(store, acceptedScore)).resolves.toMatchObject({
      descriptor: {
        artifact_kind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      },
    });

    const pendingGold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial('pending'),
    );
    const falselyEligibleScore = await sealScoreMaterialDirectly(
      store,
      scoreMaterial(refs, pendingGold.reference),
    );
    await expect(
      readSkillBenchmarkArtifact(store, falselyEligibleScore),
    ).rejects.toMatchObject({
      name: 'DeepImprovementArtifactReadError',
      code: 'DEPENDENCY_MISMATCH',
    });
  });

  it('checks referenced gold state when the score declines numerator eligibility', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('ineligible-real-gold-state'),
    });
    const refs = await commonReferences(store);
    const blockedGold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      {
        ...goldMaterial('pending'),
        integrityStatus: 'blocked',
      },
    );
    const bypassAttempt = await sealScoreMaterialDirectly(
      store,
      {
        ...scoreMaterial(refs, blockedGold.reference),
        numeratorEligible: false,
      },
    );
    await expect(
      readSkillBenchmarkArtifact(store, bypassAttempt),
    ).rejects.toMatchObject({
      name: 'DeepImprovementArtifactReadError',
      code: 'DEPENDENCY_MISMATCH',
    });

    const acceptedGold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const consistentIneligibleScore = await sealScoreMaterialDirectly(
      store,
      {
        ...scoreMaterial(refs, acceptedGold.reference),
        artifactId: 'score-ineligible-consistent',
        numeratorEligible: false,
      },
    );
    await expect(
      readSkillBenchmarkArtifact(store, consistentIneligibleScore),
    ).resolves.toMatchObject({
      descriptor: {
        artifact_kind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      },
    });
  });

  it('rejects a wrong-kind scenario gold reference while the correct kind succeeds', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('gold-reference-kind'),
    });
    const refs = await commonReferences(store);
    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const correct = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      scoreMaterial(refs, gold.reference),
    );
    await expect(readSkillBenchmarkArtifact(store, correct)).resolves.toMatchObject({
      descriptor: {
        artifact_kind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      },
    });

    const design = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
    );
    await expectArtifactFailure(
      (async () => {
        const wrongKind = await sealSkillBenchmarkArtifact(
          store,
          SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
          scoreMaterial(refs, design.reference),
        );
        await readSkillBenchmarkArtifact(store, wrongKind);
      })(),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('cross-checks the bound evaluator epoch on default reads', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('bound-evaluator-epoch'),
    });
    const refs = await commonReferences(store);
    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const matchingScore = await sealScoreMaterialDirectly(
      store,
      scoreMaterial(refs, gold.reference),
    );
    await expect(readSkillBenchmarkArtifact(store, matchingScore)).resolves.toMatchObject({
      descriptor: {
        artifact_kind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      },
    });

    const divergedScore = await sealScoreMaterialDirectly(
      store,
      {
        ...scoreMaterial(refs, gold.reference),
        artifactId: 'score-diverged-epoch',
        evaluatorEpochId: 'evaluation-epoch-DIVERGED',
      },
    );
    await expect(
      readSkillBenchmarkArtifact(store, divergedScore),
    ).rejects.toMatchObject({
      name: 'DeepImprovementArtifactReadError',
      code: 'EPOCH_MISMATCH',
    });
  });

  it('rejects a score bound to a retired canary on the default read path', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('retired-bound-canary'),
    });
    const refs = await commonReferences(store);
    const retiredCanary = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
      canaryMaterial(refs.evaluator, 'retired'),
    );
    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const retiredCanaryScore = await sealScoreMaterialDirectly(
      store,
      scoreMaterial(
        { ...refs, canary: retiredCanary.reference },
        gold.reference,
      ),
    );

    try {
      await readSkillBenchmarkArtifact(store, retiredCanaryScore);
    } catch (error: unknown) {
      expect(error).toMatchObject({
        name: 'DeepImprovementArtifactReadError',
        code: DeepImprovementArtifactReadFailureCodes.STALE_CANARY,
      });
      expect(error).not.toHaveProperty('bytes');
      return;
    }
    throw new Error('Expected retired canary refusal');
  });

  it('reads a score bound to an active fresh canary without a policy override', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('active-bound-canary'),
    });
    const refs = await commonReferences(store);
    const gold = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial(),
    );
    const activeCanaryScore = await sealScoreMaterialDirectly(
      store,
      scoreMaterial(refs, gold.reference),
    );

    await expect(
      readSkillBenchmarkArtifact(store, activeCanaryScore),
    ).resolves.toMatchObject({
      descriptor: {
        artifact_kind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      },
    });
  });

  it('blocks unsealed references and missing common dependencies before bytes are published', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('missing-dependency'),
    });
    const derived = store.derive(
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
      {
        canonicalizationVersion: 'skill-benchmark-binding@1',
        mediaType: 'application/vnd.openai.skill-benchmark-binding+json',
      },
    );
    await expectArtifactFailure(
      readSkillBenchmarkArtifact(store, bindingFor(SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, derived.reference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );

    const missingEvaluator = store.derive(
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(),
      {
        canonicalizationVersion: 'deep-improvement-common-binding@1',
        mediaType: 'application/vnd.openai.deep-improvement-common-binding+json',
      },
    );
    await expectArtifactFailure(
      sealSkillBenchmarkArtifact(
        store,
        SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
        assignmentMaterial({
          evaluator: missingEvaluator.reference,
          canary: missingEvaluator.reference,
          promotion: missingEvaluator.reference,
        }),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed for tampered references and tampered or truncated capsules', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('tampering'),
    });
    const binding = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
    );
    const tamperedReference = {
      ...binding.reference,
      content_digest: DIGEST_D,
      qualified_digest: `sha256:${DIGEST_D}`,
    };
    await expectArtifactFailure(
      readSkillBenchmarkArtifact(
        store,
        bindingFor(SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, tamperedReference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );

    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{"truncated":true}'));
    await expectArtifactFailure(
      readSkillBenchmarkArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });

  it('keeps a partially published capsule unreachable and rejects wrong-kind reads', async () => {
    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('partial-publication'),
      faultInjection,
    });
    const derived = store.derive(
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
      {
        canonicalizationVersion: 'skill-benchmark-binding@1',
        mediaType: 'application/vnd.openai.skill-benchmark-binding+json',
      },
    );
    await expect(
      sealSkillBenchmarkArtifact(
        store,
        SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
        designMaterial(),
      ),
    ).rejects.toThrow('publication interrupted');
    expect(existsSync(store.inspectPaths(derived.reference).referencePath)).toBe(false);
    await expectArtifactFailure(
      readSkillBenchmarkArtifact(
        store,
        bindingFor(SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, derived.reference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );

    const cleanStore = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('wrong-kind'),
    });
    const binding = await sealSkillBenchmarkArtifact(
      cleanStore,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      designMaterial(),
    );
    await expectArtifactFailure(
      readSkillBenchmarkArtifact(cleanStore, {
        ...binding,
        artifactKind: SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('delegates stale epoch refusal to the shared common read contract', async () => {
    const store = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('stale-epoch'),
    });
    const refs = await commonReferences(store);
    const binding = await sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
      assignmentMaterial(refs),
    );
    await expect(
      readSkillBenchmarkArtifact(store, binding, {
        requiredEvaluationEpochId: 'evaluation-epoch-2',
      }),
    ).rejects.toMatchObject({
      name: 'DeepImprovementArtifactReadError',
      code: 'EPOCH_MISMATCH',
    });
  });
});
