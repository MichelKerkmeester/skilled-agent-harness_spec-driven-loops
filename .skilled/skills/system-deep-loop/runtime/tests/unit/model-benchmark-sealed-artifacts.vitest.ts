// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Sealed Artifact Tests
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
  ModelBenchmarkArtifactKinds,
  MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT,
  MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL,
  ModelBenchmarkArtifactReadError,
  ModelBenchmarkArtifactReadFailureCodes,
  createModelBenchmarkSealedArtifactStore,
  readModelBenchmarkArtifact,
  sealModelBenchmarkArtifact,
} from '../../lib/model-benchmark-sealed-artifacts/index.js';
import { DeepImprovementCommonArtifactKinds } from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  ArtifactStoreFaultInjection,
  ModelBenchmarkArtifactKind,
  ModelBenchmarkArtifactMaterial,
  ModelBenchmarkArtifactMaterialByKind,
  ModelBenchmarkArtifactReadPolicy,
  ModelBenchmarkArtifactDependency,
  ModelBenchmarkArtifactLocator,
  ModelBenchmarkModelCellInputArtifactMaterial,
  ModelBenchmarkRecipeArtifactMaterial,
} from '../../lib/model-benchmark-sealed-artifacts/index.js';

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const DIGEST_D = 'd'.repeat(64);
const temporaryRoots: string[] = [];

const LOCATOR: ModelBenchmarkArtifactLocator = Object.freeze({
  scheme: 'artifact',
  locatorDigest: DIGEST_A,
  selector: 'model-benchmark:artifact',
  revision: 'revision-1',
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `model-benchmark-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function dependency(
  purpose: string,
  reference: ModelBenchmarkModelCellInputArtifactMaterial['prerequisiteReferences'][number],
): ModelBenchmarkArtifactDependency {
  return { purpose, reference };
}

function base(
  artifactId: string,
  dependencies: readonly ModelBenchmarkArtifactDependency[] = [],
) {
  return {
    schemaVersion: 'model-benchmark-artifact@1',
    artifactId,
    evaluatorEpochId: 'evaluation-epoch-1',
    visibility: 'sealed' as const,
    dependencyReferences: dependencies,
    originEvent: {
      eventStem: 'model_benchmark.run_declared' as const,
      eventId: 'event-1',
      payloadDigest: DIGEST_A,
    },
    producerVersion: 'model-benchmark-producer@1',
    locator: LOCATOR,
    freshnessExpiresAt: '2099-01-01T00:00:00.000Z',
  };
}

function refFor(store: ReturnType<typeof createModelBenchmarkSealedArtifactStore>, label: string) {
  return store.derive(InitialArtifactKinds.FIXTURE, { fixture: label }).reference;
}

function trialMatrixKey() {
  return {
    candidateId: 'candidate-1',
    modelFingerprint: DIGEST_A,
    executionPath: 'executor-1',
    taskInstanceId: 'task-1',
    taskFamilyId: 'family-1',
    pairedBlockId: 'paired-1',
    protocolVariant: 'default',
    seed: 7,
    perturbationId: 'none',
    workloadProfileId: 'workload-1',
    promptRecipeFingerprint: DIGEST_B,
    routeFingerprint: DIGEST_C,
    frameworkFingerprint: DIGEST_D,
    toolRecipeFingerprint: DIGEST_A,
    attempt: 0,
  };
}

function membership() {
  return {
    matrixDigest: DIGEST_A,
    modelId: 'model-1',
    executorId: 'executor-1',
    taskFamilyId: 'family-1',
    taskInstanceId: 'task-1',
    anchorClass: 'common-anchor' as const,
    pairedBlockId: 'paired-1',
    trialMatrixKey: trialMatrixKey(),
  };
}

function visibilityPolicy() {
  return {
    candidateView: 'verdict-band' as const,
    hiddenCaseContent: 'withheld' as const,
    exactScores: 'withheld' as const,
    protectedJudgeEvidence: 'withheld' as const,
    evaluatorInternals: 'withheld' as const,
    terminalEvidence: 'withheld' as const,
  };
}

function usage() {
  return {
    inputTokens: 10,
    outputTokens: 20,
    reasoningTokens: 5,
    cacheReadTokens: 1,
    cacheWriteTokens: 1,
    realizedCostMicros: 100,
    errorCostMicros: 0,
    abstentionCostMicros: 0,
  };
}

function latency() {
  return {
    ttftMs: 10,
    interTokenP50Ms: 2,
    endToEndMs: 100,
    tailP95Ms: 150,
    throughputTokensPerSecond: 20,
    sloViolationCount: 0,
  };
}

function materialFor(
  kind: ModelBenchmarkArtifactKind,
  store: ReturnType<typeof createModelBenchmarkSealedArtifactStore>,
  dependencies: readonly ModelBenchmarkArtifactDependency[] = [],
): ModelBenchmarkArtifactMaterial {
  const ref = refFor(store, `${kind}-reference`);
  const common = base(`${kind}-id`, dependencies);
  switch (kind) {
    case ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE:
      return {
        ...common,
        profileId: 'profile-1',
        profileVersion: 'profile@1',
        mode: 'model-benchmark',
        modelDescriptorsDigest: DIGEST_A,
        executorDescriptorsDigest: DIGEST_B,
        frameworkDigest: DIGEST_C,
        promptReferenceDigest: DIGEST_D,
        fixtureManifestDigest: DIGEST_A,
        taskFamilyManifestDigest: DIGEST_B,
        samplePolicyDigest: DIGEST_C,
        seedPolicyDigest: DIGEST_D,
        matrixOrderingDigest: DIGEST_A,
        scoringConfigurationDigest: DIGEST_B,
        correctnessGateDigest: DIGEST_C,
        reportingGroupCode: 'reporting-default',
        workloadProfileDigest: DIGEST_D,
        visibilityPolicy: visibilityPolicy(),
        modelExecutionCrossing: 'independent',
      } satisfies ModelBenchmarkRecipeArtifactMaterial;
    case ModelBenchmarkArtifactKinds.RUN_MANIFEST:
      return {
        ...common,
        runId: 'run-1',
        recipeReference: ref,
        recipeDigest: DIGEST_A,
        modelSetDigest: DIGEST_B,
        executorSetDigest: DIGEST_C,
        frameworkDigest: DIGEST_D,
        fixtureManifestDigest: DIGEST_A,
        samplePolicyDigest: DIGEST_B,
        seedPolicyDigest: DIGEST_C,
        matrixOrderingDigest: DIGEST_D,
        scoringPolicyDigest: DIGEST_A,
        workloadProfileDigest: DIGEST_B,
        matrixMembershipDigest: DIGEST_C,
        cellReferences: [ref],
        reportingGroupCode: 'reporting-default',
        completeness: 'complete',
      };
    case ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT:
      return {
        ...common,
        runId: 'run-1',
        cellId: 'cell-1',
        matrixMembership: membership(),
        modelDescriptorDigest: DIGEST_A,
        executorDescriptorDigest: DIGEST_B,
        providerIdentityDigest: DIGEST_C,
        buildVariantDigest: DIGEST_D,
        resolvedCapabilityDigest: DIGEST_A,
        permissionFingerprintDigest: DIGEST_B,
        workflowPrefixDigest: DIGEST_C,
        environmentSnapshotDigest: DIGEST_D,
        frameworkTemplateDigest: DIGEST_A,
        fixtureDigest: DIGEST_B,
        sampleId: 'sample-1',
        seed: 7,
        promptVisibilityPolicy: 'sealed',
        workloadProfileDigest: DIGEST_C,
        prerequisiteReferences: [ref],
      };
    case ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT:
      return {
        ...common,
        runId: 'run-1',
        cellId: 'cell-1',
        matrixDigest: DIGEST_A,
        inputReference: ref,
        responseDigest: DIGEST_B,
        responseReference: ref,
        trajectoryDigest: DIGEST_C,
        trajectoryReference: ref,
        toolTraceDigest: DIGEST_D,
        toolTraceReference: ref,
        itemObservationReferences: [ref],
        scoreVectorDigest: DIGEST_A,
        judgeObservationDigest: DIGEST_B,
        usageStatus: 'complete',
        usage: usage(),
        latency: latency(),
        errorCode: null,
        abstained: false,
        retryCount: 0,
        integrityStatus: 'confirmed',
        workloadProfileDigest: DIGEST_C,
      };
    case ModelBenchmarkArtifactKinds.SCORING_MATRIX:
      return {
        ...common,
        runReference: ref,
        matrixDigest: DIGEST_A,
        rawObservationReferences: [ref],
        itemRowsDigest: DIGEST_B,
        familyRowsDigest: DIGEST_C,
        modelExecutorCrossingsDigest: DIGEST_D,
        anchorMembershipDigest: DIGEST_A,
        adaptiveDiagnosticMembershipDigest: DIGEST_B,
        rubricAxisObservationsDigest: DIGEST_C,
        judgeCalibrationDigest: DIGEST_D,
        pairedDeltasDigest: DIGEST_A,
        uncertaintyDigest: DIGEST_B,
        multiplicityTreatmentDigest: DIGEST_C,
        selectionState: 'INCONCLUSIVE',
        winnerModelId: null,
      };
    case ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION:
      return {
        ...common,
        runReference: ref,
        matrixDigest: DIGEST_A,
        commonAnchorReferences: [ref],
        taskFamilyIds: ['family-1'],
        familyCoverageDigest: DIGEST_B,
        selectionPolicyDigest: DIGEST_C,
        confirmatoryStatus: 'confirmatory',
        exclusionReasonCodes: [],
      };
    case ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION:
      return {
        ...common,
        runReference: ref,
        matrixDigest: DIGEST_A,
        selectedCaseReferences: [ref],
        familyQuotaDigest: DIGEST_B,
        informationInputsDigest: DIGEST_C,
        selectionPolicyDigest: DIGEST_D,
        propensityDigest: DIGEST_A,
        confirmatoryStatus: 'non-confirmatory',
        exclusionReasonCodes: [],
      };
    case ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE:
      return {
        ...common,
        matrixDigest: DIGEST_A,
        candidateId: 'candidate-1',
        taskFamilyId: 'family-1',
        judgeCalibrationReference: ref,
        judgeCalibrationDigest: DIGEST_B,
        rubricAxisValidationDigest: DIGEST_C,
        oracleUncertainty: 0.1,
        protocolRobustnessDigest: DIGEST_D,
        validityPolicyDigest: DIGEST_A,
        validityState: 'valid',
        blockerCodes: [],
      };
    case ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE:
      return {
        ...common,
        caseId: 'case-1',
        sourceDate: '2025-01-01T00:00:00.000Z',
        firstExposureAt: null,
        disclosureAt: null,
        retiredAt: null,
        caseVisibility: 'sealed',
        contaminationStatus: 'clean',
        matchedEvidenceDigest: DIGEST_A,
        semanticEvidenceDigest: DIGEST_B,
        disclosureEvidenceDigest: DIGEST_C,
        replacementCaseReference: null,
        referenceModelDifficultyDigest: DIGEST_D,
        evidenceReferences: [ref],
      };
    case ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE:
      return {
        ...common,
        runReference: ref,
        workloadProfileDigest: DIGEST_A,
        contextLength: 100,
        concurrency: 2,
        trafficShapeDigest: DIGEST_B,
        outputLength: 20,
        prefixReuseRatio: 0.25,
        multiTurnCount: 1,
        latency: latency(),
        usageStatus: 'complete',
        usage: usage(),
        switchingOverheadMicros: 4,
      };
    case ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE:
      return {
        ...common,
        matrixReference: ref,
        matrixDigest: DIGEST_A,
        validityEvidenceReferences: [ref],
        workloadEvidenceReferences: [ref],
        anchorEvidenceReference: ref,
        diagnosticEvidenceReference: ref,
        reductionPolicyDigest: DIGEST_B,
        evidenceCompleteness: 'complete',
        qualityGateStatus: 'pass',
        operationalGateStatus: 'pass',
        selectionState: 'INCONCLUSIVE',
      };
    default: {
      const exhaustiveKind: never = kind;
      throw new Error(`No fixture for ${String(exhaustiveKind)}`);
    }
  }
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
    if (error instanceof ModelBenchmarkArtifactReadError) expect(error.code).toBe(code);
    expect(error).not.toHaveProperty('bytes');
    return error;
  }
  throw new Error(`Expected failure ${code}`);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('model benchmark sealed artifacts', () => {
  it('registers and seals every model-benchmark kind through the real shared store', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('all-kinds') });
    expect(MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind)).toEqual(
      Object.values(ModelBenchmarkArtifactKinds),
    );
    for (const artifactKind of Object.values(ModelBenchmarkArtifactKinds)) {
      const binding = await sealModelBenchmarkArtifact(
        store,
        artifactKind,
        materialFor(artifactKind, store),
      );
      const verified = await readModelBenchmarkArtifact(store, binding);
      expect(binding.reference.artifact_kind).toBe(artifactKind);
      expect(verified.binding.eventReference).toBe(`artifact:${binding.reference.qualified_digest}`);
      expect(verified.material.artifactId).toBe(`${artifactKind}-id`);
    }
  });

  it('reproduces deterministic digests and changes identity for semantic recipe changes', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('deterministic') });
    const firstMaterial = materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store) as ModelBenchmarkRecipeArtifactMaterial;
    const first = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, firstMaterial);
    const reordered = {
      freshnessExpiresAt: firstMaterial.freshnessExpiresAt,
      locator: firstMaterial.locator,
      producerVersion: firstMaterial.producerVersion,
      originEvent: firstMaterial.originEvent,
      dependencyReferences: firstMaterial.dependencyReferences,
      visibility: firstMaterial.visibility,
      evaluatorEpochId: firstMaterial.evaluatorEpochId,
      artifactId: firstMaterial.artifactId,
      schemaVersion: firstMaterial.schemaVersion,
      profileId: firstMaterial.profileId,
      profileVersion: firstMaterial.profileVersion,
      mode: firstMaterial.mode,
      modelDescriptorsDigest: firstMaterial.modelDescriptorsDigest,
      executorDescriptorsDigest: firstMaterial.executorDescriptorsDigest,
      frameworkDigest: firstMaterial.frameworkDigest,
      promptReferenceDigest: firstMaterial.promptReferenceDigest,
      fixtureManifestDigest: firstMaterial.fixtureManifestDigest,
      taskFamilyManifestDigest: firstMaterial.taskFamilyManifestDigest,
      samplePolicyDigest: firstMaterial.samplePolicyDigest,
      seedPolicyDigest: firstMaterial.seedPolicyDigest,
      matrixOrderingDigest: firstMaterial.matrixOrderingDigest,
      scoringConfigurationDigest: firstMaterial.scoringConfigurationDigest,
      correctnessGateDigest: firstMaterial.correctnessGateDigest,
      reportingGroupCode: firstMaterial.reportingGroupCode,
      workloadProfileDigest: firstMaterial.workloadProfileDigest,
      visibilityPolicy: firstMaterial.visibilityPolicy,
      modelExecutionCrossing: firstMaterial.modelExecutionCrossing,
    } satisfies ModelBenchmarkRecipeArtifactMaterial;
    const second = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, reordered);
    expect(second.reference).toEqual(first.reference);
    const changed = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, {
      ...firstMaterial,
      workloadProfileDigest: DIGEST_A,
    });
    expect(changed.reference.qualified_digest).not.toBe(first.reference.qualified_digest);
  });

  it('rejects mutable bodies, open selectors, and wrong per-kind fields', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('closed-fields') });
    const recipe = materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store) as ModelBenchmarkRecipeArtifactMaterial;
    await expectFailure(
      sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, {
        ...recipe,
        reportBody: 'mutable report body',
      } as ModelBenchmarkRecipeArtifactMaterial),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    await expectFailure(
      sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, {
        ...recipe,
        locator: { ...LOCATOR, selector: 'this is mutable report prose' },
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    await expectFailure(
      sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.SCORING_MATRIX, {
        ...materialFor(ModelBenchmarkArtifactKinds.SCORING_MATRIX, store),
        selectionState: 'winner',
      } as ModelBenchmarkArtifactMaterialByKind[typeof ModelBenchmarkArtifactKinds.SCORING_MATRIX]),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('blocks unsealed and tampered references before releasing bytes', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('unsealed') });
    const kind = ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE;
    const material = materialFor(kind, store);
    const derived = store.derive(kind, material, {
      canonicalizationVersion: 'model-benchmark-binding@1',
      mediaType: 'application/vnd.openai.model-benchmark-binding+json',
    });
    await expectFailure(
      readModelBenchmarkArtifact(store, {
        bindingVersion: 1,
        artifactKind: kind,
        eventReference: `artifact:${derived.reference.qualified_digest}`,
        reference: derived.reference,
      }),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    const binding = await sealModelBenchmarkArtifact(store, kind, material);
    await expectFailure(
      readModelBenchmarkArtifact(store, {
        ...binding,
        reference: {
          ...binding.reference,
          content_digest: DIGEST_D,
          qualified_digest: `sha256:${DIGEST_D}`,
        },
        eventReference: `artifact:sha256:${DIGEST_D}`,
      }),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    await expectFailure(
      readModelBenchmarkArtifact(store, {
        ...binding,
        artifactKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('rejects truncated published capsules and missing dependencies on read', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('truncated') });
    const kind = ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT;
    const binding = await sealModelBenchmarkArtifact(store, kind, materialFor(kind, store));
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{'));
    await expectFailure(
      readModelBenchmarkArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );

    const missingStore = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('missing-dependency') });
    const missingReference = missingStore.derive(InitialArtifactKinds.FIXTURE, { fixture: 'not-published' }).reference;
    const recipe = materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, missingStore, [
      dependency('fixture', missingReference),
    ]);
    const recipeBinding = await sealModelBenchmarkArtifact(missingStore, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, recipe);
    await expectFailure(
      readModelBenchmarkArtifact(missingStore, recipeBinding),
      ModelBenchmarkArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
    );

    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const partialStore = createModelBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('partial-publication'),
      faultInjection,
    });
    const partialMaterial = materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, partialStore);
    const partialDerived = partialStore.derive(
      ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
      partialMaterial,
      {
        canonicalizationVersion: 'model-benchmark-binding@1',
        mediaType: 'application/vnd.openai.model-benchmark-binding+json',
      },
    );
    await expect(
      sealModelBenchmarkArtifact(partialStore, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, partialMaterial),
    ).rejects.toThrow('publication interrupted');
    expect(existsSync(partialStore.inspectPaths(partialDerived.reference).referencePath)).toBe(false);
    await expectFailure(
      readModelBenchmarkArtifact(partialStore, {
        bindingVersion: 1,
        artifactKind: ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
        eventReference: `artifact:${partialDerived.reference.qualified_digest}`,
        reference: partialDerived.reference,
      }),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('rejects stale epochs, stale freshness, incomplete usage, contamination, and invalid validity', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('policy') });
    const recipeBinding = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
      materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store),
    );
    const staleEpochPolicy: ModelBenchmarkArtifactReadPolicy = {
      requiredEvaluatorEpochId: 'evaluation-epoch-2',
    };
    await expectFailure(
      readModelBenchmarkArtifact(store, recipeBinding, staleEpochPolicy),
      ModelBenchmarkArtifactReadFailureCodes.EPOCH_MISMATCH,
    );

    const stale = {
      ...materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store),
      freshnessExpiresAt: '2020-01-01T00:00:00.000Z',
    } as ModelBenchmarkArtifactMaterialByKind[typeof ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE];
    const staleBinding = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, stale);
    await expectFailure(
      readModelBenchmarkArtifact(store, staleBinding, { requireFresh: true, now: new Date('2026-07-23T00:00:00.000Z') }),
      ModelBenchmarkArtifactReadFailureCodes.STALE,
    );

    const raw = materialFor(ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, store);
    const incomplete = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, {
      ...raw,
      usageStatus: 'missing',
      usage: {
        inputTokens: null,
        outputTokens: null,
        reasoningTokens: null,
        cacheReadTokens: null,
        cacheWriteTokens: null,
        realizedCostMicros: null,
        errorCostMicros: null,
        abstentionCostMicros: null,
      },
    });
    await expectFailure(
      readModelBenchmarkArtifact(store, incomplete, { requireCompleteUsage: true }),
      ModelBenchmarkArtifactReadFailureCodes.INCOMPLETE,
    );

    const contaminated = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, {
      ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
      contaminationStatus: 'suspected',
    });
    await expectFailure(
      readModelBenchmarkArtifact(store, contaminated, { requireCleanContamination: true }),
      ModelBenchmarkArtifactReadFailureCodes.CONTAMINATED,
    );

    const invalid = await sealModelBenchmarkArtifact(store, ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, {
      ...materialFor(ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, store),
      validityState: 'unknown',
    });
    await expectFailure(
      readModelBenchmarkArtifact(store, invalid, { requireValidEvidence: true }),
      ModelBenchmarkArtifactReadFailureCodes.CALIBRATION_INVALID,
    );
  });

  it('blocks candidate and scorer reads of sealed scoring, judge, and oracle evidence', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('visibility') });
    const scoring = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.SCORING_MATRIX,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.SCORING_MATRIX, store),
        selectionState: 'WINNER',
        winnerModelId: 'model-secret',
      },
    );
    const raw = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
      materialFor(ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, store),
    );
    const validity = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
      materialFor(ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, store),
    );
    const sealedCases = [
      {
        binding: scoring,
        hiddenFields: ['winnerModelId', 'uncertaintyDigest', 'judgeCalibrationDigest'],
      },
      {
        binding: raw,
        hiddenFields: ['judgeObservationDigest', 'scoreVectorDigest'],
      },
      {
        binding: validity,
        hiddenFields: ['judgeCalibrationDigest', 'rubricAxisValidationDigest', 'oracleUncertainty'],
      },
    ] as const;

    for (const accessRole of ['candidate', 'scorer'] as const) {
      for (const sealedCase of sealedCases) {
        const error = await expectFailure(
          readModelBenchmarkArtifact(store, sealedCase.binding, {
            accessRole: accessRole as ModelBenchmarkArtifactReadPolicy['accessRole'],
          }),
          ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH,
        );
        expect(error).not.toHaveProperty('bytes');
        expect(error).not.toHaveProperty('material');
        for (const hiddenField of sealedCase.hiddenFields) {
          expect(error).not.toHaveProperty(hiddenField);
        }
      }
    }

    const authorizedScoring = await readModelBenchmarkArtifact(store, scoring, {
      accessRole: 'evaluator',
    });
    const authorizedRaw = await readModelBenchmarkArtifact(store, raw, {
      accessRole: 'evaluator',
    });
    const authorizedValidity = await readModelBenchmarkArtifact(store, validity, {
      accessRole: 'evaluator',
    });
    expect(authorizedScoring.material).toMatchObject({
      winnerModelId: 'model-secret',
      uncertaintyDigest: DIGEST_B,
      judgeCalibrationDigest: DIGEST_D,
    });
    expect(authorizedRaw.material).toMatchObject({
      judgeObservationDigest: DIGEST_B,
      scoreVectorDigest: DIGEST_A,
    });
    expect(authorizedValidity.material).toMatchObject({
      judgeCalibrationDigest: DIGEST_B,
      rubricAxisValidationDigest: DIGEST_C,
      oracleUncertainty: 0.1,
    });
  });

  it('normalizes access roles and defaults malformed roles to candidate visibility', async () => {
    const store = createModelBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('normalized-visibility'),
    });
    const scoring = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.SCORING_MATRIX,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.SCORING_MATRIX, store),
        selectionState: 'WINNER',
        winnerModelId: 'model-secret-winner',
      },
    );

    for (const accessRole of [
      'Candidate',
      'CANDIDATE',
      'SCORER',
      ' candidate',
      'auditor',
      'candidate',
    ]) {
      const error = await expectFailure(
        readModelBenchmarkArtifact(store, scoring, {
          accessRole: accessRole as ModelBenchmarkArtifactReadPolicy['accessRole'],
        }),
        ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH,
      );
      expect(error).not.toHaveProperty('bytes');
      expect(error).not.toHaveProperty('material');
      expect(error).not.toHaveProperty('winnerModelId');
      expect(JSON.stringify(error)).not.toContain('model-secret-winner');
    }

    for (const accessRole of ['evaluator', 'downstream'] as const) {
      const authorized = await readModelBenchmarkArtifact(store, scoring, { accessRole });
      expect(authorized.material).toMatchObject({
        winnerModelId: 'model-secret-winner',
        judgeCalibrationDigest: DIGEST_D,
        uncertaintyDigest: DIGEST_B,
      });
    }
  });

  it('uses the most restrictive base and contamination-case visibility', async () => {
    const store = createModelBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('contamination-visibility'),
    });
    const hiddenMaterials = [
      {
        ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
        visibility: 'public',
        caseVisibility: 'private',
        contaminationStatus: 'suspected',
        firstExposureAt: '2026-07-23T00:00:00.000Z',
      },
      {
        ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
        visibility: 'public',
        caseVisibility: 'private',
        contaminationStatus: 'clean',
        firstExposureAt: null,
      },
      {
        ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
        visibility: 'public',
        caseVisibility: 'public',
        contaminationStatus: 'suspected',
        firstExposureAt: null,
      },
      {
        ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
        visibility: 'public',
        caseVisibility: 'public',
        contaminationStatus: 'clean',
        firstExposureAt: '2026-07-23T00:00:00.000Z',
        disclosureAt: null,
      },
    ] as const;
    const hiddenBindings = await Promise.all(hiddenMaterials.map((material) =>
      sealModelBenchmarkArtifact(
        store,
        ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
        material,
      )));

    for (const accessRole of ['candidate', 'scorer'] as const) {
      for (const hiddenBinding of hiddenBindings) {
        const error = await expectFailure(
          readModelBenchmarkArtifact(store, hiddenBinding, { accessRole }),
          ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH,
        );
        expect(error).not.toHaveProperty('bytes');
        expect(error).not.toHaveProperty('material');
      }
    }

    const evaluator = await readModelBenchmarkArtifact(store, hiddenBindings[0], {
      accessRole: 'evaluator',
    });
    expect(evaluator.material).toMatchObject({
      visibility: 'public',
      caseVisibility: 'private',
      contaminationStatus: 'suspected',
      firstExposureAt: '2026-07-23T00:00:00.000Z',
    });

    const publicBinding = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, store),
        visibility: 'public',
        caseVisibility: 'public',
        contaminationStatus: 'clean',
        firstExposureAt: null,
      },
    );
    const publicCandidate = await readModelBenchmarkArtifact(store, publicBinding, {
      accessRole: 'candidate',
    });
    expect(publicCandidate.material).toMatchObject({
      visibility: 'public',
      caseVisibility: 'public',
      contaminationStatus: 'clean',
      firstExposureAt: null,
    });
  });

  it('folds prompt and candidate-view policies into effective visibility', async () => {
    const store = createModelBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('kind-visibility'),
    });
    const hiddenCell = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, store),
        visibility: 'public',
        promptVisibilityPolicy: 'withheld',
      },
    );
    const hiddenRecipe = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store),
        visibility: 'public',
        visibilityPolicy: {
          ...visibilityPolicy(),
          candidateView: 'verdict-band',
        },
      },
    );

    for (const accessRole of ['candidate', 'scorer'] as const) {
      for (const binding of [hiddenCell, hiddenRecipe]) {
        await expectFailure(
          readModelBenchmarkArtifact(store, binding, { accessRole }),
          ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH,
        );
      }
    }

    const evaluatorCell = await readModelBenchmarkArtifact(store, hiddenCell, {
      accessRole: 'evaluator',
    });
    const evaluatorRecipe = await readModelBenchmarkArtifact(store, hiddenRecipe, {
      accessRole: 'evaluator',
    });
    expect(evaluatorCell.material.promptVisibilityPolicy).toBe('withheld');
    expect(evaluatorRecipe.material.visibilityPolicy.candidateView).toBe('verdict-band');

    const publicCell = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, store),
        visibility: 'public',
        promptVisibilityPolicy: 'public',
      },
    );
    const publicRecipe = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
      {
        ...materialFor(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, store),
        visibility: 'public',
        visibilityPolicy: {
          ...visibilityPolicy(),
          candidateView: 'full',
        },
      },
    );
    await expect(readModelBenchmarkArtifact(store, publicCell, {
      accessRole: 'candidate',
    })).resolves.toMatchObject({
      material: { visibility: 'public', promptVisibilityPolicy: 'public' },
    });
    await expect(readModelBenchmarkArtifact(store, publicRecipe, {
      accessRole: 'candidate',
    })).resolves.toMatchObject({
      material: {
        visibility: 'public',
        visibilityPolicy: { candidateView: 'full' },
      },
    });
  });

  it('accepts the true nested cell matrix digest and rejects a different digest', async () => {
    const store = createModelBenchmarkSealedArtifactStore({ rootDirectory: temporaryRoot('matrix-policy') });
    const cell = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
      materialFor(ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, store),
    );
    const verifiedCell = await readModelBenchmarkArtifact(store, cell, {
      requiredMatrixDigest: DIGEST_A,
    });
    expect(verifiedCell.material.matrixMembership.matrixDigest).toBe(DIGEST_A);

    const run = await sealModelBenchmarkArtifact(
      store,
      ModelBenchmarkArtifactKinds.RUN_MANIFEST,
      materialFor(ModelBenchmarkArtifactKinds.RUN_MANIFEST, store),
    );
    const verifiedRun = await readModelBenchmarkArtifact(store, run, {
      requiredMatrixDigest: DIGEST_C,
    });
    expect(verifiedRun.material.matrixMembershipDigest).toBe(DIGEST_C);

    const mismatch = await expectFailure(
      readModelBenchmarkArtifact(store, cell, { requiredMatrixDigest: DIGEST_D }),
      ModelBenchmarkArtifactReadFailureCodes.MATRIX_MISMATCH,
    );
    expect(mismatch).toBeInstanceOf(ModelBenchmarkArtifactReadError);
    if (mismatch instanceof ModelBenchmarkArtifactReadError) {
      expect(mismatch.details).toEqual({
        expectedMatrix: DIGEST_D,
        actualMatrix: DIGEST_A,
      });
    }
  });

  it('keeps the common adapter boundary available without changing its contract', () => {
    expect(MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL).toBe(true);
    expect(MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT.owner).toBe('deep-improvement-common');
    expect(MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT.consumers).toContain('model-benchmark');
    expect(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE).toBe(
      'deep-improvement-common-evaluator-capsule',
    );
  });
});
