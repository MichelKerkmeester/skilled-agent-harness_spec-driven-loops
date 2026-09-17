// MODULE: Agent Improvement Sealed Artifact Tests

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
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  readAgentImprovementCandidateView,
  readAgentImprovementArtifact,
  sealAgentImprovementArtifact,
  createAgentImprovementSealedArtifactStore,
} from '../../lib/agent-improvement-sealed-artifacts/index.js';
import {
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  DeepImprovementBaselineInputMaterial,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementRawTrialOutputMaterial,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import type {
  AgentImprovementArtifactKind,
  AgentImprovementArtifactMaterial,
  AgentImprovementAgentIrBundleMaterial,
  AgentImprovementBehaviorCoverageMaterial,
  AgentImprovementCandidateProposalMaterial,
  AgentImprovementCausalAnalysisInputMaterial,
  AgentImprovementChangeContractBundleMaterial,
  AgentImprovementFourRingExposureMaterial,
  AgentImprovementExposureRing,
  AgentImprovementImproverLaneReferenceMaterial,
  AgentImprovementDependencyKind,
  AgentImprovementTrialTrajectoryMaterial,
} from '../../lib/agent-improvement-sealed-artifacts/index.js';
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
  selector: 'agent-improvement:sealed-artifact',
  revision: 'revision-1',
});
const EVENT = Object.freeze({
  eventStem: 'agent_improvement.agent_ir_compiled' as const,
  eventId: 'agent-event-1',
  payloadDigest: DIGEST_A,
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `agent-improvement-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function dependency(
  artifactKind: AgentImprovementDependencyKind,
  purpose: string,
  reference: SealedArtifactReference,
): { artifactKind: AgentImprovementDependencyKind; purpose: string; reference: SealedArtifactReference } {
  return { artifactKind, purpose, reference };
}

async function fixtureReferences(
  store: ReturnType<typeof createAgentImprovementSealedArtifactStore>,
): Promise<SealedArtifactReference[]> {
  const references: SealedArtifactReference[] = [];
  for (const label of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    const sealed = await store.seal(InitialArtifactKinds.FIXTURE, { fixture: label });
    references.push(sealed.artifact.reference);
  }
  return references;
}

function evaluatorMaterial(
  fixture: SealedArtifactReference,
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
    dependencyReferences: [{ purpose: 'fixture', reference: fixture }],
    originEvent: {
      eventStem: 'deep_improvement_common.evaluation_epoch_sealed',
      eventId: 'evaluator-event-1',
      payloadDigest: DIGEST_A,
    },
    producerVersion: 'evaluator-producer@1',
    locator: LOCATOR,
  };
}

function commonCandidateMaterial(
  evaluator: SealedArtifactReference,
  source: SealedArtifactReference,
): DeepImprovementCandidateInputMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'common-candidate-input-1',
    candidateId: 'common-candidate-1',
    lineageId: 'common-lineage-1',
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
    dependencyReferences: [{ purpose: 'evaluator', reference: evaluator }, { purpose: 'source', reference: source }],
    originEvent: {
      eventStem: 'deep_improvement_common.candidate_generated',
      eventId: 'common-candidate-event-1',
      payloadDigest: DIGEST_B,
    },
    producerVersion: 'common-candidate-producer@1',
    locator: LOCATOR,
  };
}

function commonBaselineMaterial(
  evaluator: SealedArtifactReference,
  incumbent: SealedArtifactReference,
): DeepImprovementBaselineInputMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'common-baseline-input-1',
    baselineId: 'common-baseline-1',
    lineageId: 'common-lineage-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    incumbentReference: incumbent,
    profileScopeDigest: DIGEST_A,
    modelConfigurationDigest: DIGEST_B,
    promptConfigurationDigest: DIGEST_C,
    toolConfigurationDigest: DIGEST_D,
    selectedFixtureManifestDigest: DIGEST_A,
    seed: 7,
    sourceArtifactReferences: [incumbent],
    dependencyReferences: [{ purpose: 'evaluator', reference: evaluator }, { purpose: 'incumbent', reference: incumbent }],
    originEvent: {
      eventStem: 'deep_improvement_common.candidate_lineage_attached',
      eventId: 'common-baseline-event-1',
      payloadDigest: DIGEST_C,
    },
    producerVersion: 'common-baseline-producer@1',
    locator: LOCATOR,
  };
}

function rawTrialMaterial(
  candidate: SealedArtifactReference,
  baseline: SealedArtifactReference,
  evaluator: SealedArtifactReference,
  observation: SealedArtifactReference,
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
      outputDigest: observation.content_digest,
      outputReference: observation,
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
    traceReferences: [observation],
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
      { purpose: 'candidate', reference: candidate },
      { purpose: 'baseline', reference: baseline },
      { purpose: 'evaluator', reference: evaluator },
      { purpose: 'observation', reference: observation },
    ],
    originEvent: {
      eventStem: 'deep_improvement_common.evaluation_observation_recorded',
      eventId: 'raw-trial-event-1',
      payloadDigest: DIGEST_D,
    },
    producerVersion: 'raw-trial-producer@1',
    locator: LOCATOR,
  };
}

function canaryMaterial(
  evaluator: SealedArtifactReference,
): DeepImprovementCanaryEpochMaterial {
  return {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'canary-epoch-1',
    canaryEpochId: 'canary-epoch-1',
    evaluatorEpochId: 'evaluation-epoch-1',
    suiteId: 'canary-suite-1',
    lifecycle: 'active',
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
    dependencyReferences: [{ purpose: 'evaluator', reference: evaluator }],
    originEvent: {
      eventStem: 'deep_improvement_common.canary_suite_sealed',
      eventId: 'canary-event-1',
      payloadDigest: DIGEST_B,
    },
    producerVersion: 'canary-producer@1',
    locator: LOCATOR,
  };
}

function baseMaterial(
  kind: AgentImprovementArtifactKind,
  fixture: SealedArtifactReference,
): AgentImprovementAgentIrBundleMaterial {
  return {
    schemaVersion: 'agent-improvement-artifact@1',
    artifactId: `${kind}-1`,
    dependencyReferences: [dependency('fixture', 'agent-ir-source', fixture)],
    originEvent: EVENT,
    producerVersion: 'agent-producer@1',
    locator: LOCATOR,
    agentDefinitionRef: 'agent-definition:1',
    agentDefinitionDigest: DIGEST_A,
    agentIrRef: 'agent-ir:1',
    agentIrDigest: DIGEST_B,
    agentIrSchemaVersion: 'agent-ir@1',
    components: [{
      componentId: 'component-instruction',
      componentKind: 'instruction',
      componentRef: 'component:instruction',
      componentDigest: DIGEST_C,
    }],
    inheritanceEdges: [],
    loci: [],
    capabilityPolicyDigest: DIGEST_D,
    authorityPolicyDigest: DIGEST_A,
    toolConfigurationDigest: DIGEST_B,
    routingConfigurationDigest: DIGEST_C,
    memoryConfigurationDigest: DIGEST_D,
    inferenceConfigurationDigest: DIGEST_A,
    executorConfigurationDigest: DIGEST_B,
    parentAgentReference: null,
  };
}

function materialFor(
  kind: AgentImprovementArtifactKind,
  refs: readonly SealedArtifactReference[],
  evaluator: SealedArtifactReference,
): AgentImprovementArtifactMaterial {
  const [a, b, c, d, e, f, g] = refs;
  if (!a || !b || !c || !d || !e || !f || !g) throw new Error('fixture references incomplete');
  const base = baseMaterial(kind, a);
  const modeDependencies = refs.map((reference, index) => dependency('fixture', `mode-source-${index}`, reference));
  const common = {
    schemaVersion: 'agent-improvement-artifact@1',
    artifactId: `${kind}-1`,
    dependencyReferences: modeDependencies,
    originEvent: EVENT,
    producerVersion: 'agent-producer@1',
    locator: LOCATOR,
  };
  switch (kind) {
    case 'agent-improvement-base-agent-bundle':
      return base;
    case 'agent-improvement-change-contract-bundle':
      return {
        ...common,
        agentIrReference: a,
        baseDefinitionRef: 'definition:base',
        baseDefinitionDigest: a.content_digest,
        candidateDefinitionRef: 'definition:candidate',
        candidateDefinitionDigest: b.content_digest,
        changeContractRef: 'change-contract:1',
        changeContractDigest: c.content_digest,
        patchRef: 'patch:1',
        patchDigest: d.content_digest,
        changedComponentIds: ['component-instruction'],
        changedClauseIds: ['clause-target'],
        inheritedClauseIds: [],
        intendedBehaviorDigest: e.content_digest,
        preservedBehaviorDigest: f.content_digest,
        staticAssertionsDigest: g.content_digest,
        tracePolicyDigest: a.content_digest,
        scenarioSetDigest: b.content_digest,
        behavioralSemverIntent: 'patch' as const,
        operatorReference: 'operator:mutation',
        parentLineageReference: null,
      } satisfies AgentImprovementChangeContractBundleMaterial;
    case 'agent-improvement-improver-lane-reference':
      return {
        ...common,
        experimentLineageId: 'lineage-1',
        improverModelRef: 'model:improver',
        improverModelDigest: a.content_digest,
        improverBuildRef: 'build:improver',
        improverBuildDigest: b.content_digest,
        promptPolicyDigest: c.content_digest,
        trainingCorpusDigest: d.content_digest,
        developmentCorpusDigest: e.content_digest,
        sealedFailureCorpusDigest: f.content_digest,
        optimizerVersion: 'optimizer@1',
        mutationOperatorReference: 'operator:mutation',
        mutationOperatorVersion: 'operator@1',
        visibilityPolicy: {
          candidateVisibleEvidence: 'bounded-diagnostic' as const,
          hiddenFixtures: 'withheld' as const,
          exactTerminalScores: 'withheld' as const,
          evaluatorInternals: 'withheld' as const,
          terminalEvidence: 'withheld' as const,
        },
        queryBudget: { maxQueries: 10, maxBytes: 1024, maxWallClockMs: 1000, maxCostMicros: 0 },
        parentCandidateReference: null,
      } satisfies AgentImprovementImproverLaneReferenceMaterial;
    case 'agent-improvement-causal-analysis-input':
      return {
        ...common,
        failureClusterReference: a,
        failureClusterDigest: a.content_digest,
        firstDivergentTraceReference: b,
        firstDivergentTraceDigest: b.content_digest,
        knownDefectLocusId: 'locus-instruction',
        knownDefectLocusDigest: c.content_digest,
        counterfactualInterventionReference: d,
        counterfactualInterventionDigest: d.content_digest,
        proposalVisibleEvidenceReference: e,
        proposalVisibleEvidenceDigest: e.content_digest,
        parentCandidateReference: null,
        evidenceExposurePolicy: 'bounded-diagnostic' as const,
      } satisfies AgentImprovementCausalAnalysisInputMaterial;
    case 'agent-improvement-candidate-proposal':
      return {
        ...common,
        candidateId: 'candidate-1',
        candidatePackageRef: 'package:candidate-1',
        candidatePackageDigest: a.content_digest,
        candidateAgentIrRef: 'agent-ir:candidate-1',
        candidateAgentIrDigest: b.content_digest,
        parentAgentReference: a,
        changeContractReference: b,
        improverLaneReference: c,
        causalAnalysisReference: d,
        atomicPatchLineageReference: e,
        atomicPatchLineageDigest: e.content_digest,
        proposalRationaleReference: f,
        proposalRationaleDigest: f.content_digest,
        mutationOperatorReference: 'operator:mutation',
        mutationOperatorVersion: 'operator@1',
        parentCandidateReference: null,
      } satisfies AgentImprovementCandidateProposalMaterial;
    case 'agent-improvement-trial-trajectory':
      return {
        ...common,
        trialId: 'trial-1',
        dependencyReferences: [
          ...modeDependencies,
          dependency(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, 'evaluator-capsule', evaluator),
        ],
        candidateProposalReference: a,
        baselineAgentReference: b,
        evaluatorCapsuleReference: evaluator,
        commonRawTrialReference: c,
        evaluationEpochId: 'evaluation-epoch-1',
        taskManifestReference: d,
        taskManifestDigest: d.content_digest,
        behaviorFamilyId: 'act',
        semanticVariantReference: e,
        semanticVariantDigest: e.content_digest,
        authorityConflictReference: f,
        authorityConflictDigest: f.content_digest,
        negativeCapabilityReference: g,
        negativeCapabilityDigest: g.content_digest,
        seed: 7,
        executorReference: a,
        executorFingerprint: b.content_digest,
        environmentReference: b,
        environmentDigest: b.content_digest,
        normalizedTraceReference: c,
        normalizedTraceDigest: c.content_digest,
        sideEffectObservationReference: d,
        sideEffectObservationDigest: d.content_digest,
        receiptPredicateReference: e,
        receiptPredicateDigest: e.content_digest,
        caseOutcomeVectorDigest: f.content_digest,
        integrityObservationReference: g,
        integrityObservationDigest: g.content_digest,
        normalizationVersion: 'normalization@1',
      } satisfies AgentImprovementTrialTrajectoryMaterial;
    case 'agent-improvement-behavior-coverage':
      return {
        ...common,
        coverageId: 'coverage-1',
        dependencyReferences: [
          ...modeDependencies,
          dependency(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, 'canary-evaluator', evaluator),
        ],
        evaluationEpochId: 'evaluation-epoch-1',
        exposureEpochId: 'exposure-epoch-1',
        clauseDigests: [a.content_digest],
        behaviorFamilyIds: ['act', 'refuse', 'clarify'],
        authorityConflictCaseDigests: [b.content_digest],
        transitionCaseDigests: [c.content_digest],
        sideEffectOracleDigests: [d.content_digest],
        negativeCapabilityCaseDigests: [e.content_digest],
        perturbationDigests: [f.content_digest],
        untouchedFamilySentinelDigests: [g.content_digest],
        semanticVariantDigests: [a.content_digest],
        executorDigests: [b.content_digest],
        rotatingCanaryReference: evaluator,
        coverageManifestDigest: c.content_digest,
        coverageOutcome: 'covered' as const,
        criticalInvariantOutcome: 'pass' as const,
      } satisfies AgentImprovementBehaviorCoverageMaterial;
    case 'agent-improvement-four-ring-exposure':
      return {
        ...common,
        manifestId: 'manifest-1',
        dependencyReferences: [
          ...modeDependencies,
          dependency(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, 'exposure-evaluator', evaluator),
        ],
        evaluationEpochId: 'evaluation-epoch-1',
        exposureEpochId: 'exposure-epoch-1',
        rings: ([
          ['visible-optimizer', a],
          ['sealed-semantic-variant', b],
          ['untouched-family-sentinel', c],
          ['rotating-canary', d],
        ] as readonly [AgentImprovementExposureRing, SealedArtifactReference][]).map(([ring, reference], index) => ({
          ring,
          fixtureSetReference: reference,
          fixtureSetDigest: reference.content_digest,
          fixtureCount: index + 1,
          exposureEpochId: 'exposure-epoch-1',
          lifecycle: 'activated' as const,
          retirementReason: null,
        })),
        evaluatorCapsuleReference: evaluator,
        canaryEpochReference: evaluator,
        hiddenAnchorCommitmentDigest: e.content_digest,
        leakVetoPolicyVersion: 'leak-veto@1',
      } satisfies AgentImprovementFourRingExposureMaterial;
    default:
      throw new Error(`Unhandled kind ${kind}`);
  }
}

function withDependencies<TMaterial extends AgentImprovementArtifactMaterial>(
  material: TMaterial,
  references: readonly SealedArtifactReference[],
): TMaterial {
  const dependencies = new Map(
    material.dependencyReferences.map((entry) => [entry.reference.qualified_digest, entry]),
  );
  for (const [index, reference] of references.entries()) {
    dependencies.set(
      reference.qualified_digest,
      dependency(
        reference.artifact_kind as AgentImprovementDependencyKind,
        `named-reference-${index}`,
        reference,
      ),
    );
  }
  return {
    ...material,
    dependencyReferences: [...dependencies.values()],
  };
}

async function seedReferenceGraph(
  store: ReturnType<typeof createAgentImprovementSealedArtifactStore>,
) {
  const fixtures = await fixtureReferences(store);
  const [fixtureA] = fixtures;
  if (!fixtureA) throw new Error('fixture references incomplete');
  const configuration = (await store.seal(
    InitialArtifactKinds.CONFIGURATION,
    { configuration: 'executor-and-intervention' },
  )).artifact.reference;
  const priorRunOutput = (await store.seal(
    InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    { output: 'causal-and-trace-observation' },
  )).artifact.reference;
  const evaluator = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    evaluatorMaterial(fixtureA),
  );
  const baseAgent = await sealAgentImprovementArtifact(
    store,
    'agent-improvement-base-agent-bundle',
    materialFor(
      'agent-improvement-base-agent-bundle',
      fixtures,
      evaluator.reference,
    ) as AgentImprovementAgentIrBundleMaterial,
  );
  const changeSeed = materialFor(
    'agent-improvement-change-contract-bundle',
    fixtures,
    evaluator.reference,
  ) as AgentImprovementChangeContractBundleMaterial;
  const changeContract = await sealAgentImprovementArtifact(
    store,
    'agent-improvement-change-contract-bundle',
    withDependencies({
      ...changeSeed,
      agentIrReference: baseAgent.reference,
      parentLineageReference: null,
    }, [baseAgent.reference]),
  );
  const improverLane = await sealAgentImprovementArtifact(
    store,
    'agent-improvement-improver-lane-reference',
    materialFor(
      'agent-improvement-improver-lane-reference',
      fixtures,
      evaluator.reference,
    ) as AgentImprovementImproverLaneReferenceMaterial,
  );
  const causalSeed = materialFor(
    'agent-improvement-causal-analysis-input',
    fixtures,
    evaluator.reference,
  ) as AgentImprovementCausalAnalysisInputMaterial;
  const causalAnalysis = await sealAgentImprovementArtifact(
    store,
    'agent-improvement-causal-analysis-input',
    withDependencies({
      ...causalSeed,
      failureClusterReference: priorRunOutput,
      failureClusterDigest: priorRunOutput.content_digest,
      firstDivergentTraceReference: priorRunOutput,
      firstDivergentTraceDigest: priorRunOutput.content_digest,
      counterfactualInterventionReference: configuration,
      counterfactualInterventionDigest: configuration.content_digest,
      proposalVisibleEvidenceReference: priorRunOutput,
      proposalVisibleEvidenceDigest: priorRunOutput.content_digest,
      parentCandidateReference: null,
    }, [priorRunOutput, configuration]),
  );
  const candidateSeed = materialFor(
    'agent-improvement-candidate-proposal',
    fixtures,
    evaluator.reference,
  ) as AgentImprovementCandidateProposalMaterial;
  const candidateProposal = await sealAgentImprovementArtifact(
    store,
    'agent-improvement-candidate-proposal',
    withDependencies({
      ...candidateSeed,
      parentAgentReference: baseAgent.reference,
      changeContractReference: changeContract.reference,
      improverLaneReference: improverLane.reference,
      causalAnalysisReference: causalAnalysis.reference,
      atomicPatchLineageReference: changeContract.reference,
      atomicPatchLineageDigest: changeContract.reference.content_digest,
      proposalRationaleReference: causalAnalysis.reference,
      proposalRationaleDigest: causalAnalysis.reference.content_digest,
      parentCandidateReference: null,
    }, [
      baseAgent.reference,
      changeContract.reference,
      improverLane.reference,
      causalAnalysis.reference,
    ]),
  );
  const commonCandidate = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
    commonCandidateMaterial(evaluator.reference, candidateProposal.reference),
  );
  const commonBaseline = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
    commonBaselineMaterial(evaluator.reference, baseAgent.reference),
  );
  const rawTrial = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
    rawTrialMaterial(
      commonCandidate.reference,
      commonBaseline.reference,
      evaluator.reference,
      priorRunOutput,
    ),
  );
  const canaryEpoch = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    canaryMaterial(evaluator.reference),
  );
  return {
    fixtures,
    configuration,
    priorRunOutput,
    evaluator,
    baseAgent,
    changeContract,
    improverLane,
    causalAnalysis,
    candidateProposal,
    commonCandidate,
    commonBaseline,
    rawTrial,
    canaryEpoch,
  };
}

function validMaterialFor(
  kind: AgentImprovementArtifactKind,
  graph: Awaited<ReturnType<typeof seedReferenceGraph>>,
): AgentImprovementArtifactMaterial {
  const material = materialFor(kind, graph.fixtures, graph.evaluator.reference);
  switch (kind) {
    case 'agent-improvement-base-agent-bundle':
      return material;
    case 'agent-improvement-change-contract-bundle':
      return withDependencies({
        ...(material as AgentImprovementChangeContractBundleMaterial),
        agentIrReference: graph.baseAgent.reference,
        parentLineageReference: null,
      }, [graph.baseAgent.reference]);
    case 'agent-improvement-improver-lane-reference':
      return material;
    case 'agent-improvement-causal-analysis-input':
      return withDependencies({
        ...(material as AgentImprovementCausalAnalysisInputMaterial),
        failureClusterReference: graph.priorRunOutput,
        failureClusterDigest: graph.priorRunOutput.content_digest,
        firstDivergentTraceReference: graph.priorRunOutput,
        firstDivergentTraceDigest: graph.priorRunOutput.content_digest,
        counterfactualInterventionReference: graph.configuration,
        counterfactualInterventionDigest: graph.configuration.content_digest,
        proposalVisibleEvidenceReference: graph.priorRunOutput,
        proposalVisibleEvidenceDigest: graph.priorRunOutput.content_digest,
        parentCandidateReference: null,
      }, [graph.priorRunOutput, graph.configuration]);
    case 'agent-improvement-candidate-proposal':
      return withDependencies({
        ...(material as AgentImprovementCandidateProposalMaterial),
        parentAgentReference: graph.baseAgent.reference,
        changeContractReference: graph.changeContract.reference,
        improverLaneReference: graph.improverLane.reference,
        causalAnalysisReference: graph.causalAnalysis.reference,
        atomicPatchLineageReference: graph.changeContract.reference,
        atomicPatchLineageDigest: graph.changeContract.reference.content_digest,
        proposalRationaleReference: graph.causalAnalysis.reference,
        proposalRationaleDigest: graph.causalAnalysis.reference.content_digest,
        parentCandidateReference: null,
      }, [
        graph.baseAgent.reference,
        graph.changeContract.reference,
        graph.improverLane.reference,
        graph.causalAnalysis.reference,
      ]);
    case 'agent-improvement-trial-trajectory':
      return withDependencies({
        ...(material as AgentImprovementTrialTrajectoryMaterial),
        candidateProposalReference: graph.candidateProposal.reference,
        baselineAgentReference: graph.baseAgent.reference,
        evaluatorCapsuleReference: graph.evaluator.reference,
        commonRawTrialReference: graph.rawTrial.reference,
        executorReference: graph.configuration,
        environmentReference: graph.configuration,
        environmentDigest: graph.configuration.content_digest,
        normalizedTraceReference: graph.priorRunOutput,
        normalizedTraceDigest: graph.priorRunOutput.content_digest,
        sideEffectObservationReference: graph.priorRunOutput,
        sideEffectObservationDigest: graph.priorRunOutput.content_digest,
        receiptPredicateReference: graph.configuration,
        receiptPredicateDigest: graph.configuration.content_digest,
        integrityObservationReference: graph.priorRunOutput,
        integrityObservationDigest: graph.priorRunOutput.content_digest,
      }, [
        graph.candidateProposal.reference,
        graph.baseAgent.reference,
        graph.evaluator.reference,
        graph.rawTrial.reference,
        graph.configuration,
        graph.priorRunOutput,
      ]);
    case 'agent-improvement-behavior-coverage':
      return withDependencies({
        ...(material as AgentImprovementBehaviorCoverageMaterial),
        rotatingCanaryReference: graph.canaryEpoch.reference,
      }, [graph.canaryEpoch.reference]);
    case 'agent-improvement-four-ring-exposure':
      return withDependencies({
        ...(material as AgentImprovementFourRingExposureMaterial),
        evaluatorCapsuleReference: graph.evaluator.reference,
        canaryEpochReference: graph.canaryEpoch.reference,
      }, [graph.evaluator.reference, graph.canaryEpoch.reference]);
    default:
      throw new Error(`Unhandled kind ${kind}`);
  }
}

async function expectFailure(
  operation: Promise<unknown>,
  code?: string,
): Promise<Error> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
    if (code && error instanceof SealedArtifactError) expect(error.code).toBe(code);
    if (code && error instanceof DeepImprovementArtifactReadError) expect(error.code).toBe(code);
    expect(error).not.toHaveProperty('bytes');
    return error as Error;
  }
  throw new Error(`Expected failure ${code ?? 'unknown'}`);
}

type ReferenceGraph = Awaited<ReturnType<typeof seedReferenceGraph>>;

interface NamedReferenceCase {
  readonly ownerKind: AgentImprovementArtifactKind;
  readonly field: string;
  readonly expectedKind: AgentImprovementDependencyKind;
  readonly correctReference: (graph: ReferenceGraph) => SealedArtifactReference;
  readonly digestField?: string;
}

const NAMED_REFERENCE_CASES: readonly NamedReferenceCase[] = [
  {
    ownerKind: 'agent-improvement-base-agent-bundle',
    field: 'parentAgentReference',
    expectedKind: 'agent-improvement-base-agent-bundle',
    correctReference: (graph) => graph.baseAgent.reference,
  },
  {
    ownerKind: 'agent-improvement-change-contract-bundle',
    field: 'agentIrReference',
    expectedKind: 'agent-improvement-base-agent-bundle',
    correctReference: (graph) => graph.baseAgent.reference,
  },
  {
    ownerKind: 'agent-improvement-change-contract-bundle',
    field: 'parentLineageReference',
    expectedKind: 'agent-improvement-change-contract-bundle',
    correctReference: (graph) => graph.changeContract.reference,
  },
  {
    ownerKind: 'agent-improvement-improver-lane-reference',
    field: 'parentCandidateReference',
    expectedKind: 'agent-improvement-candidate-proposal',
    correctReference: (graph) => graph.candidateProposal.reference,
  },
  {
    ownerKind: 'agent-improvement-causal-analysis-input',
    field: 'failureClusterReference',
    digestField: 'failureClusterDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-causal-analysis-input',
    field: 'firstDivergentTraceReference',
    digestField: 'firstDivergentTraceDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-causal-analysis-input',
    field: 'counterfactualInterventionReference',
    digestField: 'counterfactualInterventionDigest',
    expectedKind: InitialArtifactKinds.CONFIGURATION,
    correctReference: (graph) => graph.configuration,
  },
  {
    ownerKind: 'agent-improvement-causal-analysis-input',
    field: 'proposalVisibleEvidenceReference',
    digestField: 'proposalVisibleEvidenceDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-causal-analysis-input',
    field: 'parentCandidateReference',
    expectedKind: 'agent-improvement-candidate-proposal',
    correctReference: (graph) => graph.candidateProposal.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'parentAgentReference',
    expectedKind: 'agent-improvement-base-agent-bundle',
    correctReference: (graph) => graph.baseAgent.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'changeContractReference',
    expectedKind: 'agent-improvement-change-contract-bundle',
    correctReference: (graph) => graph.changeContract.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'improverLaneReference',
    expectedKind: 'agent-improvement-improver-lane-reference',
    correctReference: (graph) => graph.improverLane.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'causalAnalysisReference',
    expectedKind: 'agent-improvement-causal-analysis-input',
    correctReference: (graph) => graph.causalAnalysis.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'atomicPatchLineageReference',
    digestField: 'atomicPatchLineageDigest',
    expectedKind: 'agent-improvement-change-contract-bundle',
    correctReference: (graph) => graph.changeContract.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'proposalRationaleReference',
    digestField: 'proposalRationaleDigest',
    expectedKind: 'agent-improvement-causal-analysis-input',
    correctReference: (graph) => graph.causalAnalysis.reference,
  },
  {
    ownerKind: 'agent-improvement-candidate-proposal',
    field: 'parentCandidateReference',
    expectedKind: 'agent-improvement-candidate-proposal',
    correctReference: (graph) => graph.candidateProposal.reference,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'candidateProposalReference',
    expectedKind: 'agent-improvement-candidate-proposal',
    correctReference: (graph) => graph.candidateProposal.reference,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'baselineAgentReference',
    expectedKind: 'agent-improvement-base-agent-bundle',
    correctReference: (graph) => graph.baseAgent.reference,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'evaluatorCapsuleReference',
    expectedKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    correctReference: (graph) => graph.evaluator.reference,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'commonRawTrialReference',
    expectedKind: DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
    correctReference: (graph) => graph.rawTrial.reference,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'taskManifestReference',
    digestField: 'taskManifestDigest',
    expectedKind: InitialArtifactKinds.FIXTURE,
    correctReference: (graph) => graph.fixtures[0]!,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'semanticVariantReference',
    digestField: 'semanticVariantDigest',
    expectedKind: InitialArtifactKinds.FIXTURE,
    correctReference: (graph) => graph.fixtures[1]!,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'authorityConflictReference',
    digestField: 'authorityConflictDigest',
    expectedKind: InitialArtifactKinds.FIXTURE,
    correctReference: (graph) => graph.fixtures[2]!,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'negativeCapabilityReference',
    digestField: 'negativeCapabilityDigest',
    expectedKind: InitialArtifactKinds.FIXTURE,
    correctReference: (graph) => graph.fixtures[3]!,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'executorReference',
    expectedKind: InitialArtifactKinds.CONFIGURATION,
    correctReference: (graph) => graph.configuration,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'environmentReference',
    digestField: 'environmentDigest',
    expectedKind: InitialArtifactKinds.CONFIGURATION,
    correctReference: (graph) => graph.configuration,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'normalizedTraceReference',
    digestField: 'normalizedTraceDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'sideEffectObservationReference',
    digestField: 'sideEffectObservationDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'receiptPredicateReference',
    digestField: 'receiptPredicateDigest',
    expectedKind: InitialArtifactKinds.CONFIGURATION,
    correctReference: (graph) => graph.configuration,
  },
  {
    ownerKind: 'agent-improvement-trial-trajectory',
    field: 'integrityObservationReference',
    digestField: 'integrityObservationDigest',
    expectedKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    correctReference: (graph) => graph.priorRunOutput,
  },
  {
    ownerKind: 'agent-improvement-behavior-coverage',
    field: 'rotatingCanaryReference',
    expectedKind: DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    correctReference: (graph) => graph.canaryEpoch.reference,
  },
  ...([0, 1, 2, 3] as const).map((index): NamedReferenceCase => ({
    ownerKind: 'agent-improvement-four-ring-exposure',
    field: `rings[${index}].fixtureSetReference`,
    digestField: `rings[${index}].fixtureSetDigest`,
    expectedKind: InitialArtifactKinds.FIXTURE,
    correctReference: (graph) => graph.fixtures[index]!,
  })),
  {
    ownerKind: 'agent-improvement-four-ring-exposure',
    field: 'evaluatorCapsuleReference',
    expectedKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    correctReference: (graph) => graph.evaluator.reference,
  },
  {
    ownerKind: 'agent-improvement-four-ring-exposure',
    field: 'canaryEpochReference',
    expectedKind: DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    correctReference: (graph) => graph.canaryEpoch.reference,
  },
];

function replaceNamedReference(
  material: AgentImprovementArtifactMaterial,
  testCase: NamedReferenceCase,
  reference: SealedArtifactReference,
): AgentImprovementArtifactMaterial {
  const ringMatch = /^rings\[(\d+)\]\.fixtureSetReference$/u.exec(testCase.field);
  let changed: AgentImprovementArtifactMaterial;
  if (ringMatch) {
    const ringIndex = Number(ringMatch[1]);
    const exposure = material as AgentImprovementFourRingExposureMaterial;
    changed = {
      ...exposure,
      rings: exposure.rings.map((ring, index) => (
        index === ringIndex
          ? { ...ring, fixtureSetReference: reference, fixtureSetDigest: reference.content_digest }
          : ring
      )),
    };
  } else {
    const fields = { ...material } as unknown as Record<string, unknown>;
    fields[testCase.field] = reference;
    if (testCase.digestField) fields[testCase.digestField] = reference.content_digest;
    changed = fields as unknown as AgentImprovementArtifactMaterial;
  }
  return withDependencies(changed, [reference]);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('agent improvement sealed artifacts', () => {
  it('seals and reads every agent kind through the real phase-007 store', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('all-kinds') });
    const graph = await seedReferenceGraph(store);
    for (const kind of [
      'agent-improvement-base-agent-bundle',
      'agent-improvement-change-contract-bundle',
      'agent-improvement-improver-lane-reference',
      'agent-improvement-causal-analysis-input',
      'agent-improvement-candidate-proposal',
      'agent-improvement-trial-trajectory',
      'agent-improvement-behavior-coverage',
      'agent-improvement-four-ring-exposure',
    ] as const) {
      const binding = await sealAgentImprovementArtifact(store, kind, validMaterialFor(kind, graph));
      const verified = await readAgentImprovementArtifact(store, binding);
      expect(verified.binding.reference.qualified_digest).toBe(binding.reference.qualified_digest);
      expect(verified.bytes.length).toBeGreaterThan(0);
    }
  });

  it('keeps equivalent inputs deterministic and changes identity when covered material changes', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('deterministic') });
    const refs = await fixtureReferences(store);
    const first = await sealAgentImprovementArtifact(
      store,
      'agent-improvement-base-agent-bundle',
      materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial,
    );
    const second = await sealAgentImprovementArtifact(
      store,
      'agent-improvement-base-agent-bundle',
      materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial,
    );
    expect(second.reference).toEqual(first.reference);
    const changed = {
      ...(materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial),
    } as AgentImprovementAgentIrBundleMaterial & { agentIrDigest: string };
    changed.agentIrDigest = DIGEST_D;
    const third = await sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', changed);
    expect(third.reference.qualified_digest).not.toBe(first.reference.qualified_digest);
  });

  it('rejects open mutable fields and prose selectors before publication', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('closed') });
    const refs = await fixtureReferences(store);
    const mutable = {
      ...materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial,
      reportBody: 'mutable body',
    } as AgentImprovementAgentIrBundleMaterial & { reportBody: string };
    await expectFailure(
      sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', mutable),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    const prose = {
      ...materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial,
      locator: { ...LOCATOR, selector: 'this is mutable evidence prose' },
    } as AgentImprovementAgentIrBundleMaterial;
    await expectFailure(
      sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', prose),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('fails closed for unsealed, tampered, wrong-kind, and truncated references', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('binding-failures') });
    const refs = await fixtureReferences(store);
    const material = materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial;
    const derived = store.derive('agent-improvement-base-agent-bundle', material, {
      canonicalizationVersion: 'agent-improvement-binding@1',
      mediaType: 'application/vnd.openai.agent-improvement-binding+json',
    });
    const unsealed = {
      bindingVersion: 1 as const,
      artifactKind: 'agent-improvement-base-agent-bundle' as const,
      eventReference: `artifact:${derived.reference.qualified_digest}`,
      reference: derived.reference,
    };
    await expectFailure(readAgentImprovementArtifact(store, unsealed), SealedArtifactErrorCodes.ARTIFACT_MISSING);
    const tampered = {
      ...unsealed,
      reference: { ...unsealed.reference, content_digest: DIGEST_D, qualified_digest: `sha256:${DIGEST_D}` },
      eventReference: `artifact:sha256:${DIGEST_D}`,
    };
    await expectFailure(readAgentImprovementArtifact(store, tampered), SealedArtifactErrorCodes.ARTIFACT_MISSING);
    await expectFailure(readAgentImprovementArtifact(store, {
      ...unsealed,
      artifactKind: 'agent-improvement-change-contract-bundle',
    }), SealedArtifactErrorCodes.INVALID_INPUT);
    const binding = await sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', material);
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{'));
    await expectFailure(readAgentImprovementArtifact(store, binding), SealedArtifactErrorCodes.ARTIFACT_CORRUPT);
  });

  it('rejects a missing dependency through the verified read closure', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('missing-dependency') });
    const missing = store.derive(InitialArtifactKinds.FIXTURE, { fixture: 'not-published' });
    const material = materialFor('agent-improvement-base-agent-bundle', [missing.reference, missing.reference, missing.reference, missing.reference, missing.reference, missing.reference, missing.reference], missing.reference) as AgentImprovementAgentIrBundleMaterial;
    const binding = await sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', material);
    const failure = await expectFailure(
      readAgentImprovementArtifact(store, binding),
      DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
    );
    expect(failure).not.toHaveProperty('bytes');
  });

  it('rejects stale epochs and executor mismatches before use', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('policy') });
    const graph = await seedReferenceGraph(store);
    const binding = await sealAgentImprovementArtifact(
      store,
      'agent-improvement-trial-trajectory',
      validMaterialFor('agent-improvement-trial-trajectory', graph) as AgentImprovementTrialTrajectoryMaterial,
    );
    await expectFailure(readAgentImprovementArtifact(store, binding, {
      requiredEvaluationEpochId: 'evaluation-epoch-2',
    }), DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH);
    await expectFailure(readAgentImprovementArtifact(store, binding, {
      requiredExecutorFingerprint: DIGEST_D,
    }), DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH);
  });

  it.each(NAMED_REFERENCE_CASES)(
    'rejects wrong kind and verifies correct kind for $field on $ownerKind',
    async (testCase) => {
      const store = createAgentImprovementSealedArtifactStore({
        rootDirectory: temporaryRoot(`named-kind-${testCase.field.replace(/[^a-z0-9]/giu, '-')}`),
      });
      const graph = await seedReferenceGraph(store);
      const correctReference = testCase.correctReference(graph);
      expect(correctReference.artifact_kind).toBe(testCase.expectedKind);

      const correctMaterial = replaceNamedReference(
        validMaterialFor(testCase.ownerKind, graph),
        testCase,
        correctReference,
      );
      const correctBinding = await sealAgentImprovementArtifact(
        store,
        testCase.ownerKind,
        correctMaterial,
      );
      const verified = await readAgentImprovementArtifact(store, correctBinding);
      expect(verified.bytes.length).toBeGreaterThan(0);

      const wrongReference = testCase.expectedKind === 'agent-improvement-base-agent-bundle'
        ? graph.changeContract.reference
        : graph.baseAgent.reference;
      expect(wrongReference.artifact_kind).not.toBe(testCase.expectedKind);
      const wrongMaterial = replaceNamedReference(
        validMaterialFor(testCase.ownerKind, graph),
        testCase,
        wrongReference,
      );
      const failure = await expectFailure(
        sealAgentImprovementArtifact(store, testCase.ownerKind, wrongMaterial),
        SealedArtifactErrorCodes.INVALID_INPUT,
      );
      expect(failure).toBeInstanceOf(SealedArtifactError);
      expect((failure as SealedArtifactError).details.field).toBe(`${testCase.field}.artifact_kind`);
      expect(failure).not.toHaveProperty('bytes');
    },
  );

  it('delegates evaluator visibility to the shared common adapter', async () => {
    const store = createAgentImprovementSealedArtifactStore({ rootDirectory: temporaryRoot('common-boundary') });
    const refs = await fixtureReferences(store);
    const evaluator = await sealDeepImprovementCommonArtifact(
      store,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      evaluatorMaterial(refs[0]!),
    );
    const view = await readAgentImprovementCandidateView(store, evaluator);
    expect(view).not.toHaveProperty('bytes');
    expect(view).not.toHaveProperty('rubricDigest');
    expect(view.hiddenAnchorCommitmentDigest).toBe(DIGEST_B);
    await expectFailure(
      readAgentImprovementArtifact(store, {
        bindingVersion: 1,
        artifactKind: 'agent-improvement-base-agent-bundle',
        eventReference: evaluator.eventReference,
        reference: evaluator.reference,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('keeps publication unreachable when the real store is interrupted', async () => {
    const root = temporaryRoot('partial');
    const seedStore = createAgentImprovementSealedArtifactStore({ rootDirectory: root });
    const refs = await fixtureReferences(seedStore);
    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const store = createAgentImprovementSealedArtifactStore({
      rootDirectory: root,
      faultInjection,
    });
    const material = materialFor('agent-improvement-base-agent-bundle', refs, refs[0]!) as AgentImprovementAgentIrBundleMaterial;
    const derived = store.derive('agent-improvement-base-agent-bundle', material, {
      canonicalizationVersion: 'agent-improvement-binding@1',
      mediaType: 'application/vnd.openai.agent-improvement-binding+json',
    });
    await expect(sealAgentImprovementArtifact(store, 'agent-improvement-base-agent-bundle', material))
      .rejects.toThrow('publication interrupted');
    await expectFailure(readAgentImprovementArtifact(store, {
      bindingVersion: 1,
      artifactKind: 'agent-improvement-base-agent-bundle',
      eventReference: `artifact:${derived.reference.qualified_digest}`,
      reference: derived.reference,
    }), SealedArtifactErrorCodes.ARTIFACT_MISSING);
  });
});
