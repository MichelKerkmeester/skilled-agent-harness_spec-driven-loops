// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Sealed Artifact Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonSealedArtifactStore,
  readDeepImprovementCandidateView,
  readDeepImprovementCommonArtifact,
  readDeepImprovementPromotionEvidence,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';

import type {
  DeepImprovementArtifactReadPolicy,
  DeepImprovementBaselineInputMaterial,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementRawTrialOutputMaterial,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import type {
  ArtifactStoreFaultInjection,
  SealedArtifactReference,
} from '../../lib/sealed-reference-artifacts/index.js';

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const DIGEST_D = 'd'.repeat(64);
const temporaryRoots: string[] = [];
const LOCATOR = Object.freeze({
  scheme: 'artifact' as const,
  locatorDigest: DIGEST_A,
  selector: 'artifact:deep-improvement-common',
  revision: 'revision-1',
});
const EVENT = Object.freeze({
  eventStem: 'deep_improvement_common.evaluation_epoch_sealed' as const,
  eventId: 'event-1',
  payloadDigest: DIGEST_A,
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-improvement-common-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function dependency(
  purpose: string,
  reference: SealedArtifactReference,
): { purpose: string; reference: SealedArtifactReference } {
  return { purpose, reference };
}

function evaluatorMaterial(
  dependencies: readonly { purpose: string; reference: SealedArtifactReference }[] = [],
): DeepImprovementEvaluatorCapsuleMaterial {
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
    dependencyReferences: dependencies,
    originEvent: EVENT,
    producerVersion: 'evaluator-producer@1',
    locator: LOCATOR,
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
    dependencyReferences: [dependency('evaluator-capsule', evaluator), dependency('candidate-source', source)],
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
    dependencyReferences: [dependency('evaluator-capsule', evaluator), dependency('incumbent', incumbent)],
    originEvent: {
      eventStem: 'deep_improvement_common.candidate_lineage_attached',
      eventId: 'baseline-event-1',
      payloadDigest: DIGEST_C,
    },
    producerVersion: 'baseline-producer@1',
    locator: LOCATOR,
  };
}

function rawTrialMaterial(
  candidate: SealedArtifactReference,
  baseline: SealedArtifactReference,
  evaluator: SealedArtifactReference,
  output: SealedArtifactReference,
  trace: SealedArtifactReference,
): DeepImprovementRawTrialOutputMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'raw-trial-output-1',
    trialId: 'trial-1',
    candidateInputReference: candidate,
    baselineInputReference: baseline,
    evaluatorCapsuleReference: evaluator,
    evaluationEpochId: 'evaluation-epoch-1',
    fixtureId: 'fixture-1',
    caseObservations: [{
      caseId: 'case-1',
      outputDigest: DIGEST_C,
      outputReference: output,
      scoreVectorDigest: DIGEST_D,
    }],
    rawScoreVector: {
      components: [{
        dimensionCode: 'target-repair',
        rawScore: 0.8,
        normalizedScore: 0.8,
        weight: 1,
      }],
      aggregateScore: 0.8,
      uncertainty: 0.1,
    },
    traceReferences: [trace],
    usage: {
      inputTokens: 10,
      outputTokens: 5,
      totalTokens: 15,
      costMicros: 30,
      latencyMs: 50,
    },
    executionEnvironmentDigest: DIGEST_A,
    integrityObservations: [{
      status: 'confirmed',
      detectorDigest: DIGEST_B,
      evidenceDigest: DIGEST_C,
    }],
    normalizationVersion: 'normalization@1',
    dependencyReferences: [
      dependency('candidate-input', candidate),
      dependency('baseline-input', baseline),
      dependency('evaluator-capsule', evaluator),
      dependency('raw-output', output),
      dependency('trace', trace),
    ],
    originEvent: {
      eventStem: 'deep_improvement_common.evaluation_observation_recorded',
      eventId: 'observation-event-1',
      payloadDigest: DIGEST_D,
    },
    producerVersion: 'trial-producer@1',
    locator: LOCATOR,
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
    freshnessWindowSeconds: 3600,
    sealedAt: '2026-07-23T08:00:00.000Z',
    expiresAt: '2026-07-23T10:00:00.000Z',
    supersedesReference: null,
    dependencyReferences: [dependency('evaluator-capsule', evaluator)],
    originEvent: {
      eventStem: 'deep_improvement_common.canary_suite_sealed',
      eventId: 'canary-event-1',
      payloadDigest: DIGEST_B,
    },
    producerVersion: 'canary-producer@1',
    locator: LOCATOR,
  };
}

function promotionMaterial(
  refs: readonly SealedArtifactReference[],
): DeepImprovementPromotionEvidenceMaterial {
  const [candidate, baseline, evaluator, canary, target, preserve, critical, integrity, outcome, uncertainty, cost, rollback] = refs;
  if (!candidate || !baseline || !evaluator || !canary || !target || !preserve || !critical
    || !integrity || !outcome || !uncertainty || !cost || !rollback) {
    throw new Error('Promotion fixture requires twelve references');
  }
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'promotion-evidence-1',
    promotionId: 'promotion-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    candidateInputReference: candidate,
    baselineInputReference: baseline,
    evaluatorCapsuleReference: evaluator,
    canaryEpochReference: canary,
    targetRepairEvidenceReference: target,
    baselinePreservationEvidenceReference: preserve,
    criticalDimensionEvidenceReference: critical,
    evaluatorIntegrityEvidenceReference: integrity,
    canaryOutcomeEvidenceReference: outcome,
    uncertaintyEvidenceReference: uncertainty,
    costEvidenceReference: cost,
    rollbackTargetReference: rollback,
    targetRepair: 'pass',
    baselinePreservation: 'pass',
    criticalDimensions: 'pass',
    evaluatorIntegrity: 'pass',
    canaryOutcome: 'pass',
    uncertaintyLowerBound: 0.8,
    uncertaintyThreshold: 0.7,
    costMicros: 30,
    costLimitMicros: 100,
    unresolvedEvidenceDigests: [],
    vetoEvidenceDigests: [],
    admissibility: 'eligible',
    dependencyReferences: refs.map((reference, index) => dependency(`promotion-${index}`, reference)),
    originEvent: {
      eventStem: 'deep_improvement_common.promotion_proposed',
      eventId: 'promotion-event-1',
      payloadDigest: DIGEST_D,
    },
    producerVersion: 'promotion-producer@1',
    locator: LOCATOR,
  };
}

async function seedChain(store: ReturnType<typeof createDeepImprovementCommonSealedArtifactStore>) {
  const fixtureA = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'a' });
  const fixtureB = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'b' });
  const fixtureC = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'c' });
  const fixtureD = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'd' });
  const fixtureE = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'e' });
  const fixtureF = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'f' });
  const fixtureG = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'g' });
  const fixtureH = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'h' });
  const fixtureI = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'i' });
  const fixtureJ = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'j' });
  const fixtureK = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'k' });
  const fixtureL = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'l' });
  const evaluator = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    evaluatorMaterial([dependency('fixture', fixtureA.artifact.reference)]),
  );
  const candidate = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
    candidateMaterial(evaluator.reference, fixtureB.artifact.reference),
  );
  const baseline = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
    baselineMaterial(evaluator.reference, fixtureC.artifact.reference),
  );
  const raw = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
    rawTrialMaterial(
      candidate.reference,
      baseline.reference,
      evaluator.reference,
      fixtureD.artifact.reference,
      fixtureE.artifact.reference,
    ),
  );
  const canary = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    canaryMaterial(evaluator.reference),
  );
  const promotion = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    promotionMaterial([
      candidate.reference,
      baseline.reference,
      evaluator.reference,
      canary.reference,
      fixtureF.artifact.reference,
      fixtureG.artifact.reference,
      fixtureH.artifact.reference,
      fixtureI.artifact.reference,
      fixtureJ.artifact.reference,
      fixtureK.artifact.reference,
      fixtureL.artifact.reference,
      fixtureA.artifact.reference,
    ]),
  );
  return { evaluator, candidate, baseline, raw, canary, promotion };
}

async function expectFailure(
  operation: Promise<unknown>,
  code: string,
): Promise<Error> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
    if (error instanceof SealedArtifactError) expect(error.code).toBe(code);
    if (error instanceof DeepImprovementArtifactReadError) expect(error.code).toBe(code);
    expect(error).not.toHaveProperty('bytes');
    return error;
  }
  throw new Error(`Expected failure ${code}`);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('deep improvement common sealed artifacts', () => {
  it('seals and reads every common bundle kind through the real phase-007 store', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('all-kinds') });
    const chain = await seedChain(store);
    for (const binding of Object.values(chain)) {
      const verified = await readDeepImprovementCommonArtifact(store, binding);
      expect(verified.binding.reference.qualified_digest).toBe(binding.reference.qualified_digest);
      expect(verified.bytes.length).toBeGreaterThan(0);
    }
  });

  it('keeps equivalent material deterministic and changes identity when a dependency changes', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('deterministic') });
    const fixture = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'dependency' });
    const first = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial([dependency('fixture', fixture.artifact.reference)]),
    );
    const second = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      { ...evaluatorMaterial([dependency('fixture', fixture.artifact.reference)]),
        budgetPolicy: { maxQueries: 20, maxBytes: 4096, maxWallClockMs: 1000, maxCostMicros: 5000 } },
    );
    expect(second.reference).toEqual(first.reference);
    const other = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: 'other-dependency' });
    const changed = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial([dependency('fixture', other.artifact.reference)]),
    );
    expect(changed.reference.qualified_digest).not.toBe(first.reference.qualified_digest);
  });

  it('rejects mutable bodies and open selector prose before publication', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('closed') });
    const mutable = { ...evaluatorMaterial(), reportBody: 'mutable' } as unknown as DeepImprovementEvaluatorCapsuleMaterial;
    await expectFailure(
      sealDeepImprovementCommonArtifact(store, DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, mutable),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    const prose = {
      ...evaluatorMaterial(),
      locator: { ...LOCATOR, selector: 'this is mutable evaluator prose that is not a structured selector' },
    };
    await expectFailure(
      sealDeepImprovementCommonArtifact(store, DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, prose),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('fails closed for an unsealed reference, tampered digest, and wrong kind', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('bindings') });
    const derived = store.derive(
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(),
      {
        canonicalizationVersion: 'deep-improvement-common-binding@1',
        mediaType: 'application/vnd.openai.deep-improvement-common-binding+json',
      },
    );
    const unsealed = {
      bindingVersion: 1 as const,
      artifactKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      eventReference: `artifact:${derived.reference.qualified_digest}`,
      reference: derived.reference,
    };
    await expectFailure(
      readDeepImprovementCommonArtifact(store, unsealed),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    const tamperedReference = {
      ...unsealed,
      reference: {
        ...unsealed.reference,
        content_digest: DIGEST_D,
        qualified_digest: `sha256:${DIGEST_D}`,
      },
      eventReference: `artifact:sha256:${DIGEST_D}`,
    };
    await expectFailure(
      readDeepImprovementCommonArtifact(store, tamperedReference),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    await expectFailure(
      readDeepImprovementCommonArtifact(store, {
        ...unsealed,
        artifactKind: DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('blocks truncated and tampered bytes before releasing material', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('tamper') });
    const binding = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(),
    );
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{'));
    await expectFailure(
      readDeepImprovementCommonArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });

  it('rejects a missing dependency through the read closure', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('missing-dependency') });
    const missing = store.derive(InitialArtifactKinds.FIXTURE, { fixture: 'not-published' });
    const binding = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial([dependency('missing-fixture', missing.reference)]),
    );
    const failure = await expectFailure(
      readDeepImprovementCommonArtifact(store, binding),
      DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
    );
    expect(failure).not.toHaveProperty('bytes');
  });

  it('rejects stale evaluator epochs and stale canary lifecycles', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('epoch-canary'),
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const chain = await seedChain(store);
    await expectFailure(
      readDeepImprovementCommonArtifact(store, chain.candidate, {
        requiredEvaluationEpochId: 'evaluation-epoch-2',
      }),
      DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH,
    );
    const staleStore = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('burned-canary'),
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const fixture = await staleStore.seal(InitialArtifactKinds.FIXTURE, { fixture: 'evaluator' });
    const evaluator = await sealDeepImprovementCommonArtifact(
      staleStore,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial([dependency('fixture', fixture.artifact.reference)]),
    );
    const canary = await sealDeepImprovementCommonArtifact(
      staleStore,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
      canaryMaterial(evaluator.reference, 'burned'),
    );
    await expectFailure(
      readDeepImprovementCommonArtifact(staleStore, canary, { requireFreshCanary: true }),
      DeepImprovementArtifactReadFailureCodes.STALE_CANARY,
    );
    for (const accessRole of ['Promotion', ' canary ']) {
      await expectFailure(
        readDeepImprovementCommonArtifact(staleStore, canary, {
          accessRole: accessRole as DeepImprovementArtifactReadPolicy['accessRole'],
        }),
        DeepImprovementArtifactReadFailureCodes.STALE_CANARY,
      );
    }
  });

  it('withholds evaluator internals from candidates and exposes only the redacted view', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({ rootDirectory: temporaryRoot('visibility') });
    const binding = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(),
    );
    for (const accessRole of [
      'candidate',
      'Candidate',
      'CANDIDATE',
      'candidate ',
      ' candidate',
      'xyz',
    ]) {
      const failure = await expectFailure(
        readDeepImprovementCommonArtifact(store, binding, {
          accessRole: accessRole as DeepImprovementArtifactReadPolicy['accessRole'],
        }),
        DeepImprovementArtifactReadFailureCodes.LEAK_DETECTED,
      );
      expect(failure).not.toHaveProperty('material');
      expect(JSON.stringify(failure)).not.toContain(DIGEST_C);
    }
    const evaluatorRead = await readDeepImprovementCommonArtifact(store, binding, {
      accessRole: 'evaluator',
    });
    expect(evaluatorRead.bytes.length).toBeGreaterThan(0);
    expect(evaluatorRead.material).toMatchObject({
      rubricDigest: DIGEST_C,
      policyDigest: DIGEST_D,
      environmentDigest: DIGEST_A,
      capabilityDigest: DIGEST_B,
      budgetPolicy: {
        maxQueries: 20,
        maxBytes: 4096,
        maxWallClockMs: 1000,
        maxCostMicros: 5000,
      },
    });
    const missing = store.derive(InitialArtifactKinds.FIXTURE, {
      fixture: 'off-limits-missing-dependency',
    });
    const inaccessible = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial([dependency('missing-fixture', missing.reference)]),
    );
    await expectFailure(
      readDeepImprovementCommonArtifact(store, inaccessible, {
        accessRole: 'Candidate' as DeepImprovementArtifactReadPolicy['accessRole'],
      }),
      DeepImprovementArtifactReadFailureCodes.LEAK_DETECTED,
    );
    const view = await readDeepImprovementCandidateView(store, binding);
    expect(view).not.toHaveProperty('bytes');
    expect(view).not.toHaveProperty('rubricDigest');
    expect(view.hiddenAnchorCommitmentDigest).toBe(DIGEST_B);
    expect(view.visibilityPolicy.exactScores).toBe('withheld');
  });

  it('requires complete, fresh promotion evidence before promotion consumption', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('promotion'),
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const chain = await seedChain(store);
    const verified = await readDeepImprovementPromotionEvidence(store, chain.promotion, {
      requiredEvaluationEpochId: 'evaluation-epoch-1',
      requiredCanaryEpochId: 'canary-epoch-1',
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    expect(verified.material.admissibility).toBe('eligible');
    expect(verified.bytes.length).toBeGreaterThan(0);
  });

  it('rejects wrong-kind candidate, baseline, and evaluator references in promotion evidence', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('promotion-reference-kinds'),
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const chain = await seedChain(store);
    const control = await readDeepImprovementPromotionEvidence(store, chain.promotion, {
      requiredEvaluationEpochId: 'evaluation-epoch-1',
      requiredCanaryEpochId: 'canary-epoch-1',
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const material = control.material;
    const references = [
      material.candidateInputReference,
      material.baselineInputReference,
      material.evaluatorCapsuleReference,
      material.canaryEpochReference,
      material.targetRepairEvidenceReference,
      material.baselinePreservationEvidenceReference,
      material.criticalDimensionEvidenceReference,
      material.evaluatorIntegrityEvidenceReference,
      material.canaryOutcomeEvidenceReference,
      material.uncertaintyEvidenceReference,
      material.costEvidenceReference,
      material.rollbackTargetReference,
    ];
    const wrongKindCases = [
      {
        field: 'candidateInputReference',
        index: 0,
        expectedArtifactKind: DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
      },
      {
        field: 'baselineInputReference',
        index: 1,
        expectedArtifactKind: DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
      },
      {
        field: 'evaluatorCapsuleReference',
        index: 2,
        expectedArtifactKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      },
    ] as const;

    for (const testCase of wrongKindCases) {
      const wrongReferences = [...references];
      wrongReferences[testCase.index] = chain.raw.reference;
      const wrongPromotion = await sealDeepImprovementCommonArtifact(
        store,
        DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
        promotionMaterial(wrongReferences),
      );
      const failure = await expectFailure(
        readDeepImprovementPromotionEvidence(store, wrongPromotion, {
          requiredEvaluationEpochId: 'evaluation-epoch-1',
          requiredCanaryEpochId: 'canary-epoch-1',
          now: () => new Date('2026-07-23T09:00:00.000Z'),
        }),
        DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
      );
      expect(failure).toMatchObject({
        details: {
          field: testCase.field,
          expectedArtifactKind: testCase.expectedArtifactKind,
          actualArtifactKind: DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
        },
      });
    }
  });

  it('cross-checks the evaluator capsule epoch while preserving a matching control', async () => {
    const store = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('promotion-evaluator-epoch'),
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    const chain = await seedChain(store);
    const control = await readDeepImprovementPromotionEvidence(store, chain.promotion, {
      requiredEvaluationEpochId: 'evaluation-epoch-1',
      requiredCanaryEpochId: 'canary-epoch-1',
      now: () => new Date('2026-07-23T09:00:00.000Z'),
    });
    expect(control.material.admissibility).toBe('eligible');

    const epochTwoFixture = await store.seal(
      InitialArtifactKinds.FIXTURE,
      { fixture: 'epoch-two' },
    );
    const epochTwoEvaluator = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      {
        ...evaluatorMaterial([
          dependency('fixture', epochTwoFixture.artifact.reference),
        ]),
        artifactId: 'evaluator-capsule-2',
        evaluatorEpochId: 'evaluation-epoch-2',
      },
    );
    const material = control.material;
    const mixedEpochPromotion = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
      promotionMaterial([
        material.candidateInputReference,
        material.baselineInputReference,
        epochTwoEvaluator.reference,
        material.canaryEpochReference,
        material.targetRepairEvidenceReference,
        material.baselinePreservationEvidenceReference,
        material.criticalDimensionEvidenceReference,
        material.evaluatorIntegrityEvidenceReference,
        material.canaryOutcomeEvidenceReference,
        material.uncertaintyEvidenceReference,
        material.costEvidenceReference,
        material.rollbackTargetReference,
      ]),
    );
    const failure = await expectFailure(
      readDeepImprovementPromotionEvidence(store, mixedEpochPromotion, {
        requiredEvaluationEpochId: 'evaluation-epoch-1',
        requiredCanaryEpochId: 'canary-epoch-1',
        now: () => new Date('2026-07-23T09:00:00.000Z'),
      }),
      DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH,
    );
    expect(failure).toMatchObject({
      details: {
        field: 'evaluatorCapsuleReference',
        expectedEpoch: 'evaluation-epoch-1',
        actualEpoch: 'evaluation-epoch-2',
      },
    });
  });

  it('keeps interrupted publication unreachable', async () => {
    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const store = createDeepImprovementCommonSealedArtifactStore({
      rootDirectory: temporaryRoot('partial'),
      faultInjection,
    });
    const derived = store.derive(
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(),
      {
        canonicalizationVersion: 'deep-improvement-common-binding@1',
        mediaType: 'application/vnd.openai.deep-improvement-common-binding+json',
      },
    );
    await expect(
      sealDeepImprovementCommonArtifact(
        store,
        DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
        evaluatorMaterial(),
      ),
    ).rejects.toThrow('publication interrupted');
    await expectFailure(
      readDeepImprovementCommonArtifact(store, {
        bindingVersion: 1,
        artifactKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
        eventReference: `artifact:${derived.reference.qualified_digest}`,
        reference: derived.reference,
      }),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });
});
