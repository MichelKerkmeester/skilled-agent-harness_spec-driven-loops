// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Certificate Tests
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
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepResearchCertificateFailureCodes,
  DeepResearchTransitionKinds,
  issueDeepResearchRunCertificate,
  issueDeepResearchTransitionReceipt,
  parseDeepResearchTransitionReceipt,
  verifyDeepResearchCertificateOffline,
} from '../../lib/deep-research-certificates/index.js';
import {
  DeepResearchWireEventTypes,
  createDeepResearchEventRegistry,
  deepResearchEventDefinitions,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import {
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_ID,
  DEEP_RESEARCH_REDUCER_VERSION,
  createDeepResearchProjectionState,
  reduceDeepResearchVerifiedEvent,
} from '../../lib/deep-research-reducers/index.js';
import {
  DeepResearchArtifactKinds,
  createDeepResearchSealedArtifactStore,
  sealDeepResearchArtifact,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  AuthorizedEvidenceWriter,
  BOUNDARY_RECEIPT_EVENT_TYPE,
  CertificationProviderRegistry,
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
} from '../../lib/replay-fingerprint/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepResearchCertificateBundle,
  DeepResearchOfflineVerificationInput,
  DeepResearchTransitionReceipt,
  DeepResearchTransitionReceiptInput,
  DeepResearchTransitionReceiptSubstrate,
} from '../../lib/deep-research-certificates/index.js';
import type {
  DeepResearchCompatibilityStatus,
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  DeepResearchProjectionState,
} from '../../lib/deep-research-reducers/index.js';
import type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE CONTRACTS
// ───────────────────────────────────────────────────────────────────

type ReplayProjection = DeepResearchProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepResearchCertificateBundle;
  readonly verification: DeepResearchOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepResearchSealedArtifactStore>;
  readonly artifactBindings: readonly DeepResearchSealedArtifactBinding[];
}

interface ScenarioOptions {
  readonly additionalGather?: boolean;
  readonly instructionScanResult?: DeepResearchPayloadMap['deep_research.source_captured']['instructionScanResult'];
  readonly claimStatus?: DeepResearchPayloadMap['deep_research.claim_asserted']['claimStatus'];
  readonly unresolvedObligation?: boolean;
  readonly includeDecoyArtifacts?: boolean;
  readonly objectiveMaterialDigest?: string;
  readonly initExecutorFingerprint?: string;
  readonly forgeMemoryHandoffDigests?: boolean;
  readonly convergencePaddingDigest?: string;
  readonly synthesisPaddingDigest?: string;
  readonly transformProjectionEvents?: (
    events: readonly DeepResearchLedgerEvent[],
  ) => readonly DeepResearchLedgerEvent[];
  readonly transformTransitionInputs?: (
    inputs: readonly DeepResearchTransitionReceiptInput[],
    bindings: readonly DeepResearchSealedArtifactBinding[],
  ) => readonly DeepResearchTransitionReceiptInput[];
}

const TIMESTAMP = '2026-07-21T18:00:00.000Z';
const RUN_ID = 'certificate-run-1';
const LINEAGE_ID = 'certificate-lineage-1';
const STREAM_ID = 'deep-research-certificate-run-1';
const TEST_PRODUCER = Object.freeze({ name: 'deep-research-certificate-tests', version: '1' });
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-research-certificate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function replayMetadata(): DeepResearchReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('event-replay'),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function baseScope(): DeepResearchScopeMap<'deep_research.run_initialized'> {
  return { runId: RUN_ID, lineageId: LINEAGE_ID };
}

function iterationScope(): DeepResearchScopeMap<'deep_research.iteration_started'> {
  return { ...baseScope(), iteration: 1 };
}

function createEvent<TStem extends DeepResearchEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
): DeepResearchEventEnvelope<TStem> {
  return prepareDeepResearchEvent({
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: `certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: TEST_PRODUCER,
    authorityEpoch: 1,
    correlationId: 'certificate-correlation-1',
    causationId: sequence === 1
      ? null
      : `certificate-event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `certificate-event-idempotency-${sequence}`,
  }, createDeepResearchEventRegistry()).envelope as DeepResearchEventEnvelope<TStem>;
}

function projectionEvents(
  compatibilityDecision?: DeepResearchCompatibilityStatus,
  additionalGather = false,
  instructionScanResult: DeepResearchPayloadMap['deep_research.source_captured']['instructionScanResult'] = 'clean',
  claimStatus: DeepResearchPayloadMap['deep_research.claim_asserted']['claimStatus'] = 'supported',
  unresolvedObligation = false,
  initExecutorFingerprint = digest('fixture'),
): readonly DeepResearchLedgerEvent[] {
  const hash = digest('fixture');
  const passage = { locatorDigest: hash, selector: 'paragraph:1', passageDigest: hash };
  const events: DeepResearchLedgerEvent[] = [];
  let sequence = 1;
  const append = <TStem extends DeepResearchEventStem>(
    stem: TStem,
    scope: DeepResearchScopeMap[TStem],
    data: DeepResearchPayloadMap[TStem],
  ): void => {
    events.push(createEvent(stem, sequence, scope, data));
    sequence += 1;
  };

  append('deep_research.run_initialized', baseScope(), {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      executorFingerprint: initExecutorFingerprint,
      replayFingerprint: hash,
      maxIterations: 4,
      convergencePolicyVersion: 'convergence@1',
    });
  append('deep_research.iteration_started', iterationScope(), {
      focusRef: 'focus-1',
      stateTailDigest: hash,
      strategyDigest: hash,
      status: 'started',
    });
  append('deep_research.source_captured', {
      ...iterationScope(), sourceVersionId: 'source-version-1',
    }, { ...sourceCaptureData('1'), instructionScanResult });
  if (additionalGather) {
    append('deep_research.source_captured', {
      ...iterationScope(), sourceVersionId: 'source-version-2',
    }, sourceCaptureData('2'));
  }
  append('deep_research.evidence_admission_decided', {
      ...iterationScope(), sourceVersionId: 'source-version-1', evidenceId: 'evidence-1',
    }, {
      disposition: 'admit',
      passageLocators: [passage],
      atomicClaimRefs: ['claim-1'],
      derivativeSourceGroup: 'independent-1',
      admissionPolicyVersion: 'admission@1',
      contaminationStatus: 'clean',
      reasonCode: 'independent-primary',
    });
  append('deep_research.claim_asserted', {
      ...iterationScope(), claimVersionId: 'claim-version-1',
    }, {
      claimId: 'claim-1',
      normalizedClaimDigest: digest('claim-1'),
      evidenceIds: ['evidence-1'],
      independenceGroup: 'independent-1',
      rawConfidence: 0.9,
      claimStatus,
    });
  if (unresolvedObligation) {
    append('deep_research.gap_detected', iterationScope(), {
      obligationId: 'coverage-obligation-1',
      gapKind: 'coverage',
      affectedClaimIds: ['claim-1'],
      affectedQuestionIds: ['question-1'],
      criticality: 0.9,
      proposedQueryRecipeIds: ['query-recipe-1'],
    });
  }
  append('deep_research.iteration_completed', iterationScope(), {
      status: 'complete',
      rawNewInfoRatio: 0.1,
      trustedEvidenceYield: 0.8,
      outputDigest: digest('iteration-output'),
      ruledOutApproachRefs: [],
      nextFocusCausationId: 'certificate-event-005',
    });
  if (compatibilityDecision) {
    append('deep_research.run_resumed', baseScope(), {
      priorTailDigest: digest('resume-prior-tail'),
      sourceLineageId: LINEAGE_ID,
      resumeReason: 'Resume compatibility was evaluated from persisted evidence.',
      generation: 1,
      compatibilityDecision,
      recoveryReceiptRef: 'recovery-receipt-1',
    });
  }
  const convergenceEventId = `certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.convergence_evaluated', iterationScope(), {
      decision: 'converged',
      rawSignals: {
        newInfoRatio: 0.1,
        contradictionRisk: 0.1,
        citationDrift: 0.1,
        observationDigest: digest('raw-observation'),
      },
      trustedSignals: {
        evidenceYield: 0.8,
        independentSourceRatio: 0.9,
        supportedClaimRatio: 0.9,
        assessmentDigest: digest('trusted-assessment'),
      },
      qualityGateResults: {
        sourceDiversity: 'pass',
        contradictionResolution: 'pass',
        citationIntegrity: 'pass',
        policyVersion: 'quality@1',
        resultDigest: digest('quality-gates'),
      },
      blockerIds: [],
      policyFingerprint: digest('policy'),
      evaluatorFingerprint: digest('evaluator'),
      evidenceTailHash: digest('evidence-tail'),
      incompleteReason: null,
      recoveryReason: null,
    });
  append('deep_research.synthesis_started', baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: [],
    });
  const synthesisEventId = `certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.synthesis_committed', baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: [],
      reportDigest: digest('research-report'),
      citationEventIds: ['certificate-event-004'],
      synthesisReceiptRef: 'synthesis-receipt-1',
    });
  append('deep_research.memory_save_requested', baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: {
        firstEventId: 'certificate-event-001',
        lastEventId: synthesisEventId,
      },
    });
  const memorySaveEventId = `certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.memory_save_completed', baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: {
        firstEventId: 'certificate-event-001',
        lastEventId: synthesisEventId,
      },
      persistenceReceiptRefs: ['persistence-receipt-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    });
  append('deep_research.run_completed', baseScope(), {
      terminalStatus: 'completed',
      convergenceEventId,
      synthesisEventId,
      memorySaveEventId,
      finalLedgerTailHash: digest('ledger-tail'),
      counts: {
        iterations: 1,
        sources: additionalGather ? 2 : 1,
        admittedEvidence: 1,
        claims: 1,
      },
      completionReason: 'All required convergence and persistence evidence is present.',
      incompleteReason: null,
    });
  return Object.freeze(events);
}

// ───────────────────────────────────────────────────────────────────
// 2. REAL SUBSTRATE HARNESS
// ───────────────────────────────────────────────────────────────────

async function authorizedLedger(events: readonly DeepResearchLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepResearchEventDefinitions());
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('ledger');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepResearchEvent({
      stem: event.payload.stem,
      scope: event.payload.scope,
      prevEventHash: event.payload.prevEventHash,
      replay: event.payload.replay,
      data: event.payload.data,
      eventId: event.event_id,
      streamId: event.stream_id,
      streamSequence: event.stream_sequence,
      occurredAt: event.occurred_at,
      recordedAt: event.recorded_at,
      producer: event.producer,
      authorityEpoch: event.authority_epoch,
      correlationId: event.correlation_id,
      causationId: event.causation_id,
      idempotencyKey: event.idempotency_key,
    }, registry);
    const request = await createFixtureRequest(
      ledger,
      prepared,
      policies,
      `certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('Expected fixture authorization');
    await ledger.appendAuthorized(prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
  });
  const ledgerLease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-research-certificate-writer',
    correlationId: 'deep-research-certificate-writer',
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => ledgerLease,
    },
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'research',
      priorStateVersion: 'deep-research-certificate-state@1',
      priorStateFingerprint: digest('deep-research-certificate-state'),
      actorId: 'deep-research-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepResearchTransitionReceiptSubstrate = Object.freeze({
    writer,
    registry,
    producer: TEST_PRODUCER,
  });
  return { ledger, registry, receiptSubstrate };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepResearchWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        // The replay service verifies the frame before passing its decoded event to reducers.
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepResearchVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_RESEARCH_REDUCER_ID,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function inputMaterial(label = '1'): DeepResearchInputArtifactMaterial {
  return {
    artifactId: `objective-${label}`,
    materialDigest: label === '1'
      ? digest('fixture')
      : label === 'recovery'
        ? digest('resume-prior-tail')
        : digest(`objective-material-${label}`),
    materialRef: `artifact:objective-${label}`,
    locator: {
      scheme: 'artifact',
      locatorDigest: digest(`objective-locator-${label}`),
      selector: `objective:${label}`,
      revision: 'revision-1',
    },
    producerVersion: 'producer@1',
  };
}

function sourceMaterial(label = '1'): DeepResearchSourceArtifactMaterial {
  return {
    sourceVersionId: `source-version-${label}`,
    sourceIdentityDigest: digest(`source-identity:${label}`),
    responseDigest: digest(`source-content:${label}`),
    responseRef: `artifact:source-response-${label}`,
    retrievalMetadataDigest: digest(`retrieval-metadata-${label}`),
    extractionProfileDigest: digest(`extraction-profile-${label}`),
    normalizedPassageDigests: [digest(`passage-${label}`)],
    locator: {
      scheme: 'url',
      locatorDigest: digest(`source-locator-${label}`),
      selector: `https://example.test/source-${label}`,
      revision: 'revision-1',
    },
    captureVersion: 'capture@1',
  };
}

function analysisMaterial(): DeepResearchAnalysisArtifactMaterial {
  return {
    observationId: 'claim-1',
    observationDigest: digest('claim-1'),
    observationRef: 'artifact:claim-observation-1',
    sourceArtifactDigest: digest('source-content:1'),
    evidenceDigests: [digest('evidence-1')],
    status: 'supported',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('claim-locator'),
      selector: 'claim:1',
      revision: 'revision-1',
    },
    analysisVersion: 'analysis@1',
  };
}

function convergenceMaterial(): DeepResearchConvergenceArtifactMaterial {
  return {
    witnessId: 'convergence-witness-1',
    snapshotDigest: digest('evidence-tail'),
    snapshotRef: 'artifact:convergence-snapshot-1',
    orderedInputDigests: [digest('claim-1')],
    evaluatorVersion: 'evaluator@1',
    decision: 'converged',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('convergence-locator'),
      selector: 'convergence:1',
      revision: 'revision-1',
    },
  };
}

function synthesisMaterial(): DeepResearchSynthesisArtifactMaterial {
  return {
    outputId: 'report-revision-1',
    outputDigest: digest('research-report'),
    outputRef: 'artifact:report-1',
    orderedInputDigests: [digest('evidence-tail')],
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    outputRole: 'report',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('report-locator'),
      selector: 'report:1',
      revision: 'revision-1',
    },
  };
}

function handoffMaterial(
  finalReferenceSetDigest = digest([]),
  offeredViewDigest = synthesisMaterial().outputDigest,
): DeepResearchMemoryHandoffArtifactMaterial {
  return {
    handoffId: 'handoff-1',
    finalReferenceSetDigest,
    continuityPayloadDigest: digest('continuity-payload'),
    offeredViewDigest,
    offeredViewRef: 'artifact:offered-view-1',
    targetPacket: 'packet-1',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('handoff-locator'),
      selector: 'handoff:1',
      revision: 'revision-1',
    },
    handoffVersion: 'handoff@1',
  };
}

async function sealedBindings(
  options: Pick<
    ScenarioOptions,
    | 'additionalGather'
    | 'includeDecoyArtifacts'
    | 'objectiveMaterialDigest'
    | 'forgeMemoryHandoffDigests'
    | 'convergencePaddingDigest'
    | 'synthesisPaddingDigest'
  > & { readonly includeRecovery?: boolean } = {},
) {
  const artifactStore = createDeepResearchSealedArtifactStore({
    rootDirectory: temporaryRoot('artifacts'),
  });
  const objectiveMaterial = inputMaterial();
  const objective = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.OBJECTIVE,
    options.objectiveMaterialDigest === undefined
      ? objectiveMaterial
      : { ...objectiveMaterial, materialDigest: options.objectiveMaterialDigest },
  );
  const source = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.SOURCE_CAPTURE,
    sourceMaterial(),
  );
  const bindings: DeepResearchSealedArtifactBinding[] = [objective, source];
  if (options.additionalGather) {
    bindings.push(await sealDeepResearchArtifact(
      artifactStore,
      DeepResearchArtifactKinds.SOURCE_CAPTURE,
      sourceMaterial('2'),
    ));
  }
  if (options.includeRecovery) {
    bindings.push(await sealDeepResearchArtifact(
      artifactStore,
      DeepResearchArtifactKinds.OBJECTIVE,
      inputMaterial('recovery'),
    ));
  }
  const convergence = convergenceMaterial();
  const synthesis = synthesisMaterial();
  const analysis = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.ATOMIC_CLAIM,
    analysisMaterial(),
  );
  const convergenceWitness = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.CONVERGENCE_WITNESS,
    options.convergencePaddingDigest === undefined
      ? convergence
      : {
          ...convergence,
          orderedInputDigests: [...convergence.orderedInputDigests, options.convergencePaddingDigest],
        },
  );
  const synthesisReport = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.SYNTHESIS_REPORT,
    options.synthesisPaddingDigest === undefined
      ? synthesis
      : {
          ...synthesis,
          orderedInputDigests: [...synthesis.orderedInputDigests, options.synthesisPaddingDigest],
        },
  );
  const handoff = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.MEMORY_HANDOFF,
    options.forgeMemoryHandoffDigests === true
      ? handoffMaterial(digest('fabricated-reference-set'), digest('fabricated-offered-view'))
      : handoffMaterial(
          digest([synthesisReport.reference.qualified_digest]),
          synthesis.outputDigest,
        ),
  );
  bindings.push(analysis, convergenceWitness, synthesisReport, handoff);
  if (options.includeDecoyArtifacts) {
    bindings.push(
      await sealDeepResearchArtifact(
        artifactStore,
        DeepResearchArtifactKinds.SOURCE_CAPTURE,
        sourceMaterial('decoy'),
      ),
      await sealDeepResearchArtifact(
        artifactStore,
        DeepResearchArtifactKinds.CONVERGENCE_WITNESS,
        {
          ...convergenceMaterial(),
          witnessId: 'convergence-witness-decoy',
          snapshotDigest: digest('convergence-decoy'),
          snapshotRef: 'artifact:convergence-snapshot-decoy',
        },
      ),
    );
  }
  return { artifactStore, bindings: Object.freeze(bindings) };
}

function certificationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-research-test-provider',
      key_id: 'deep-research-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

function transitionInputs(
  bindings: readonly DeepResearchSealedArtifactBinding[],
  events: readonly DeepResearchLedgerEvent[],
  includeRecovery = false,
): readonly DeepResearchTransitionReceiptInput[] {
  const artifactReferences = (
    artifactKind: DeepResearchSealedArtifactBinding['artifactKind'],
  ): readonly string[] => bindings
    .filter((binding) => binding.artifactKind === artifactKind)
    .map((binding) => binding.reference.qualified_digest);
  const requiredArtifactReference = (
    artifactKind: DeepResearchSealedArtifactBinding['artifactKind'],
  ): string => {
    const references = artifactReferences(artifactKind);
    if (references.length === 0) throw new Error(`Expected one ${artifactKind} artifact`);
    return references[0] as string;
  };
  const eventIds = (stem: DeepResearchEventStem): readonly string[] => events
    .filter((event) => event.payload.stem === stem)
    .map((event) => event.event_id);
  const requiredEventId = (stem: DeepResearchEventStem): string => {
    const matches = eventIds(stem);
    if (matches.length !== 1) throw new Error(`Expected one ${stem} event`);
    return matches[0] as string;
  };

  const objectives = artifactReferences(DeepResearchArtifactKinds.OBJECTIVE);
  const expectedObjectiveCount = includeRecovery ? 2 : 1;
  if (objectives.length !== expectedObjectiveCount) {
    throw new Error(`Expected ${expectedObjectiveCount} objective artifacts`);
  }
  const objective = objectives[0] as string;
  const sourceEvents = eventIds('deep_research.source_captured');
  const sources = artifactReferences(DeepResearchArtifactKinds.SOURCE_CAPTURE)
    .slice(0, sourceEvents.length);
  if (sources.length !== sourceEvents.length || sources.length === 0) {
    throw new Error('Expected one source artifact per source-capture event');
  }
  const analysis = requiredArtifactReference(DeepResearchArtifactKinds.ATOMIC_CLAIM);
  const convergence = requiredArtifactReference(DeepResearchArtifactKinds.CONVERGENCE_WITNESS);
  const synthesis = requiredArtifactReference(DeepResearchArtifactKinds.SYNTHESIS_REPORT);
  const memoryHandoff = requiredArtifactReference(DeepResearchArtifactKinds.MEMORY_HANDOFF);
  const inputs: DeepResearchTransitionReceiptInput[] = [{
    transitionKind: DeepResearchTransitionKinds.INIT,
    logicalOperationId: 'logical-operation-init',
    attemptIds: ['attempt-init-1'],
    resultEventId: requiredEventId('deep_research.run_initialized'),
    inputArtifactQualifiedDigests: [],
    outputArtifactQualifiedDigests: [objective],
  }];
  for (const [index, source] of sources.entries()) {
    inputs.push({
      transitionKind: DeepResearchTransitionKinds.GATHER,
      logicalOperationId: `logical-operation-gather-${index + 1}`,
      attemptIds: [`attempt-gather-${index + 1}-1`],
      resultEventId: sourceEvents[index] as string,
      inputArtifactQualifiedDigests: [objective],
      outputArtifactQualifiedDigests: [source],
    });
  }
  inputs.push(
    {
      transitionKind: DeepResearchTransitionKinds.ANALYZE,
      logicalOperationId: 'logical-operation-analyze',
      attemptIds: ['attempt-analyze-1'],
      resultEventId: requiredEventId('deep_research.claim_asserted'),
      inputArtifactQualifiedDigests: sources,
      outputArtifactQualifiedDigests: [analysis],
    },
    {
      transitionKind: DeepResearchTransitionKinds.CONVERGENCE,
      logicalOperationId: 'logical-operation-convergence',
      attemptIds: ['attempt-convergence-1'],
      resultEventId: requiredEventId('deep_research.convergence_evaluated'),
      inputArtifactQualifiedDigests: [analysis],
      outputArtifactQualifiedDigests: [convergence],
    },
    {
      transitionKind: DeepResearchTransitionKinds.SYNTHESIS,
      logicalOperationId: 'logical-operation-synthesis',
      attemptIds: ['attempt-synthesis-1'],
      resultEventId: requiredEventId('deep_research.synthesis_committed'),
      inputArtifactQualifiedDigests: [convergence],
      outputArtifactQualifiedDigests: [synthesis],
    },
    {
      transitionKind: DeepResearchTransitionKinds.MEMORY_SAVE,
      logicalOperationId: 'logical-operation-memory-save',
      attemptIds: ['attempt-memory-save-1'],
      resultEventId: requiredEventId('deep_research.memory_save_completed'),
      inputArtifactQualifiedDigests: [synthesis],
      outputArtifactQualifiedDigests: [memoryHandoff],
    },
  );
  if (includeRecovery) {
    inputs.push({
      transitionKind: DeepResearchTransitionKinds.RECOVERY,
      logicalOperationId: 'logical-operation-recovery',
      attemptIds: ['attempt-recovery-1'],
      resultEventId: requiredEventId('deep_research.run_resumed'),
      inputArtifactQualifiedDigests: [memoryHandoff],
      outputArtifactQualifiedDigests: [objectives[1] as string],
    });
  }
  return Object.freeze(inputs);
}

async function scenario(
  compatibilityDecision?: DeepResearchCompatibilityStatus,
  options: ScenarioOptions = {},
): Promise<Scenario> {
  const events = projectionEvents(
    compatibilityDecision,
    options.additionalGather,
    options.instructionScanResult,
    options.claimStatus,
    options.unresolvedObligation,
    options.initExecutorFingerprint,
  );
  const candidateProjectionEvents = options.transformProjectionEvents
    ? options.transformProjectionEvents(events)
    : events;
  const { ledger, receiptSubstrate, registry } = await authorizedLedger(events);
  const { artifactStore, bindings } = await sealedBindings({
    ...options,
    includeRecovery: compatibilityDecision !== undefined,
  });
  const providers = certificationProviders();
  const initialState = createDeepResearchProjectionState() as ReplayProjection;
  const replay: DeepResearchOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: DEEP_RESEARCH_REDUCER_ID,
      reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: {
        initial_state: digest(initialState),
      },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const baseTransitionInputs = transitionInputs(
    bindings,
    events,
    compatibilityDecision !== undefined,
  );
  const bundle = await issueDeepResearchRunCertificate({
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    projectionEvents: candidateProjectionEvents,
    artifactStore,
    artifactBindings: bindings,
    transitionReceipts: options.transformTransitionInputs
      ? options.transformTransitionInputs(baseTransitionInputs, bindings)
      : baseTransitionInputs,
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'deep-research-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    artifactStore,
    artifactBindings: bindings,
    verification: {
      bundle,
      projectionEvents: candidateProjectionEvents,
      artifactStore,
      replay,
      providers,
    },
  };
}

function mismatchedProjectionEvents(
  events: readonly DeepResearchLedgerEvent[],
): readonly DeepResearchLedgerEvent[] {
  const mismatched = structuredClone(events) as DeepResearchLedgerEvent[];
  const event = mismatched[1];
  if (!event) throw new Error('Expected a projection event to mutate');
  mismatched[1] = {
    ...event,
    recorded_at: '2026-07-21T18:00:00.001Z',
  };
  return Object.freeze(mismatched);
}

async function transitionFixture(events: readonly DeepResearchLedgerEvent[]) {
  const { ledger, receiptSubstrate } = await authorizedLedger(events);
  const artifactStore = createDeepResearchSealedArtifactStore({
    rootDirectory: temporaryRoot('transition-artifact'),
  });
  const objective = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.OBJECTIVE,
    inputMaterial(),
  );
  const eventBindings = new Map<string, DeepResearchSealedArtifactBinding>();
  const bindings: DeepResearchSealedArtifactBinding[] = [objective];
  let latestSynthesisBinding: DeepResearchSealedArtifactBinding | null = null;
  for (const event of events) {
    let binding: DeepResearchSealedArtifactBinding | null = null;
    const data = event.payload.data as Readonly<Record<string, unknown>>;
    const scope = event.payload.scope as Readonly<Record<string, unknown>>;
    switch (event.payload.stem) {
      case 'deep_research.source_captured':
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.SOURCE_CAPTURE,
          {
            ...sourceMaterial(String(scope.sourceVersionId).replace(/^source-version-/u, '')),
            sourceVersionId: scope.sourceVersionId as string,
            sourceIdentityDigest: data.sourceIdentityDigest as string,
            responseDigest: data.contentDigest as string,
          },
        );
        break;
      case 'deep_research.claim_asserted':
      case 'deep_research.claim_relation_recorded':
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.ATOMIC_CLAIM,
          {
            ...analysisMaterial(),
            observationId: data.claimId as string,
            observationDigest: event.payload.stem === 'deep_research.claim_asserted'
              ? data.normalizedClaimDigest as string
              : digest(data.relatedClaimVersionId),
            status: data.claimStatus as DeepResearchAnalysisArtifactMaterial['status'],
          },
        );
        break;
      case 'deep_research.evidence_admission_decided': {
        const passageDigests = (data.passageLocators as readonly { passageDigest: string }[])
          .map((locator) => locator.passageDigest);
        const status = data.disposition === 'admit'
          ? 'admitted'
          : data.disposition === 'degrade'
            ? 'degraded'
            : 'quarantined';
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.EVIDENCE_SPAN,
          {
            ...analysisMaterial(),
            observationId: scope.evidenceId as string,
            observationDigest: digest(scope.evidenceId),
            evidenceDigests: passageDigests,
            status,
          },
        );
        break;
      }
      case 'deep_research.synthesis_committed':
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.SYNTHESIS_REPORT,
          {
            ...synthesisMaterial(),
            outputId: data.reportRevision as string,
            outputDigest: data.reportDigest as string,
          },
        );
        latestSynthesisBinding = binding;
        break;
      case 'deep_research.memory_save_completed':
      case 'deep_research.memory_save_failed': {
        if (!latestSynthesisBinding) {
          throw new Error('Memory-save fixture requires a prior synthesis artifact');
        }
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.MEMORY_HANDOFF,
          {
            ...handoffMaterial(
              digest([latestSynthesisBinding.reference.qualified_digest]),
              synthesisMaterial().outputDigest,
            ),
            targetPacket: data.targetPacket as string,
            continuityPayloadDigest: data.continuityPayloadDigest as string,
          },
        );
        break;
      }
      case 'deep_research.run_resumed':
      case 'deep_research.run_restarted':
        binding = await sealDeepResearchArtifact(
          artifactStore,
          DeepResearchArtifactKinds.OBJECTIVE,
          {
            ...inputMaterial(`recovery-${event.event_id}`),
            materialDigest: data.priorTailDigest as string,
          },
        );
        break;
      default:
        break;
    }
    if (binding) {
      eventBindings.set(event.event_id, binding);
      if (!bindings.some((candidate) => (
        candidate.reference.qualified_digest === binding?.reference.qualified_digest
      ))) {
        bindings.push(binding);
      }
    }
  }
  const fallbackSource = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.SOURCE_CAPTURE,
    sourceMaterial(),
  );
  const fallbackSynthesis = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.SYNTHESIS_REPORT,
    synthesisMaterial(),
  );
  const fallbackHandoff = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.MEMORY_HANDOFF,
    handoffMaterial(),
  );
  const fallbackAnalysis = await sealDeepResearchArtifact(
    artifactStore,
    DeepResearchArtifactKinds.ATOMIC_CLAIM,
    analysisMaterial(),
  );
  for (const fallback of [
    fallbackSource,
    fallbackSynthesis,
    fallbackHandoff,
    fallbackAnalysis,
  ]) {
    if (!bindings.some((binding) => binding.reference.qualified_digest === fallback.reference.qualified_digest)) {
      bindings.push(fallback);
    }
  }
  const providers = certificationProviders();
  const firstByKind = (kind: DeepResearchSealedArtifactBinding['artifactKind']): string => (
    bindings.find((binding) => binding.artifactKind === kind)?.reference.qualified_digest
      ?? (() => { throw new Error(`Expected ${kind} binding`); })()
  );
  return {
    ledger,
    artifactQualifiedDigestForEvent: (eventId: string): string => {
      const binding = eventBindings.get(eventId);
      if (!binding) throw new Error(`Expected artifact binding for ${eventId}`);
      return binding.reference.qualified_digest;
    },
    artifactQualifiedDigests: Object.freeze({
      objective: objective.reference.qualified_digest,
      sourceCapture: firstByKind(DeepResearchArtifactKinds.SOURCE_CAPTURE),
      synthesisReport: firstByKind(DeepResearchArtifactKinds.SYNTHESIS_REPORT),
      memoryHandoff: firstByKind(DeepResearchArtifactKinds.MEMORY_HANDOFF),
      analysis: bindings.find((binding) => (
        binding.artifactKind === DeepResearchArtifactKinds.ATOMIC_CLAIM
        || binding.artifactKind === DeepResearchArtifactKinds.EVIDENCE_SPAN
      ))?.reference.qualified_digest as string,
    }),
    context: {
      runId: RUN_ID,
      replayFingerprint: digest('transition-replay-fingerprint'),
      priorReceiptDigest: null,
      ledgerEvents: Object.freeze([...(await ledger.readVerifiedEvents())]),
      artifactStore,
      artifactBindings: Object.freeze(bindings),
      certificationProfile: providers.inspect()[0]!,
      providers,
      receiptSubstrate,
      issuer: 'deep-research-transition-issuer',
      issuedAt: TIMESTAMP,
    },
  };
}

function sourceCaptureData(label: string): DeepResearchPayloadMap['deep_research.source_captured'] {
  return {
    sourceIdentityDigest: digest(`source-identity:${label}`),
    locator: {
      scheme: 'url',
      locatorDigest: digest(`source-locator:${label}`),
      selector: `https://example.test/${label}`,
      revision: 'revision-1',
    },
    capturedAt: TIMESTAMP,
    contentDigest: digest(`source-content:${label}`),
    mediaType: 'text/html',
    retrievalReceiptRef: `retrieval-receipt-${label}`,
    parentSourceVersionId: null,
    instructionScanResult: 'clean',
  };
}

function claimAssertionData(
  claimStatus: DeepResearchPayloadMap['deep_research.claim_asserted']['claimStatus'],
): DeepResearchPayloadMap['deep_research.claim_asserted'] {
  return {
    claimId: `claim-${claimStatus}`,
    normalizedClaimDigest: digest(`claim:${claimStatus}`),
    evidenceIds: [`evidence-${claimStatus}`],
    independenceGroup: `independent-${claimStatus}`,
    rawConfidence: 0.7,
    claimStatus,
  };
}

function evidenceAdmissionData(
  disposition: DeepResearchPayloadMap['deep_research.evidence_admission_decided']['disposition'],
  contaminationStatus: DeepResearchPayloadMap['deep_research.evidence_admission_decided']['contaminationStatus'],
): DeepResearchPayloadMap['deep_research.evidence_admission_decided'] {
  return {
    disposition,
    passageLocators: [{
      locatorDigest: digest(`admission-locator:${disposition}:${contaminationStatus}`),
      selector: `paragraph:${disposition}:${contaminationStatus}`,
      passageDigest: digest(`admission-passage:${disposition}:${contaminationStatus}`),
    }],
    atomicClaimRefs: [`claim-${disposition}-${contaminationStatus}`],
    derivativeSourceGroup: `independent-${disposition}-${contaminationStatus}`,
    admissionPolicyVersion: 'admission@1',
    contaminationStatus,
    reasonCode: `admission-${disposition}-${contaminationStatus}`,
  };
}

function recoveryData(
  compatibilityDecision: DeepResearchCompatibilityStatus,
): DeepResearchPayloadMap['deep_research.run_resumed'] {
  return {
    priorTailDigest: digest(`prior-tail:${compatibilityDecision}`),
    sourceLineageId: LINEAGE_ID,
    resumeReason: `Resume compatibility decision: ${compatibilityDecision}.`,
    generation: 1,
    compatibilityDecision,
    recoveryReceiptRef: `recovery-receipt-${compatibilityDecision}`,
  };
}

function memorySaveFailureData(
  retryable: boolean,
): DeepResearchPayloadMap['deep_research.memory_save_failed'] {
  return {
    targetPacket: 'packet-1',
    continuityPayloadDigest: digest('continuity-payload'),
    route: 'continuity',
    mergeMode: 'upsert',
    sourceEventRange: {
      firstEventId: 'certificate-event-001',
      lastEventId: 'certificate-event-009',
    },
    retryable,
    failureReason: retryable
      ? 'Persistence outcome is unknown and can be reconciled.'
      : 'Persistence rejected the handoff conclusively.',
  };
}

function synthesisCommittedData(): DeepResearchPayloadMap['deep_research.synthesis_committed'] {
  return {
    admittedLedgerRevision: 'ledger-revision-1',
    selectedClaimVersionSetDigest: digest('claim-set'),
    synthesisPolicyDigest: digest('synthesis-policy'),
    reportRevision: 'report-revision-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
    reportDigest: synthesisMaterial().outputDigest,
    citationEventIds: ['certificate-event-001'],
    synthesisReceiptRef: 'synthesis-receipt-1',
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. FULL-PIPELINE PROOFS
// ───────────────────────────────────────────────────────────────────

describe('deep research certificates and receipts', () => {
  it('round-trips a legitimate certificate through every real substrate', async () => {
    const current = await scenario();
    const result = await verifyDeepResearchCertificateOffline(current.verification);

    expect(result.verdict).toBe('valid');
    if (result.verdict !== 'valid') throw new Error(result.failureReason);
    expect(result.certificateDigest).toBe(current.bundle.certificate.certificateDigest);
    expect(current.bundle.certificate.body.authority).toBe('dark-evidence-only');
    expect(current.bundle.receipts).toHaveLength(6);
  });

  it('accepts distinct gather receipts for multiple authorized sources', async () => {
    const current = await scenario(undefined, { additionalGather: true });
    const gatherReceipts = current.bundle.receipts.filter((receipt) => (
      receipt.facts.transitionKind === DeepResearchTransitionKinds.GATHER
    ));

    expect(gatherReceipts).toHaveLength(2);
    expect(new Set(gatherReceipts.map((receipt) => receipt.facts.logicalOperationId)).size).toBe(2);
    expect(new Set(gatherReceipts.flatMap((receipt) => (
      receipt.facts.outputArtifactQualifiedDigests
    ))).size).toBe(2);

    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
    if (result.verdict !== 'valid') throw new Error(result.failureReason);
  });

  it('rejects distinct gather receipts that claim the same sealed output artifact', async () => {
    await expect(scenario(undefined, {
      additionalGather: true,
      transformTransitionInputs: (inputs) => {
        const gatherInputs = inputs.filter((input) => (
          input.transitionKind === DeepResearchTransitionKinds.GATHER
        ));
        const firstOutput = gatherInputs[0]?.outputArtifactQualifiedDigests[0];
        if (!firstOutput || gatherInputs.length !== 2) {
          throw new Error('Expected two gather transitions');
        }
        let gatherCount = 0;
        return inputs.map((input) => {
          if (input.transitionKind !== DeepResearchTransitionKinds.GATHER) return input;
          gatherCount += 1;
          return gatherCount === 2
            ? { ...input, outputArtifactQualifiedDigests: [firstOutput] }
            : input;
        });
      },
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:gather:outputs',
    });
  });

  it('keeps trusted completion closed while a gap obligation remains open', async () => {
    const current = await scenario(undefined, { unresolvedObligation: true });

    expect(current.bundle.certificate.body.openObligationIds).toEqual([
      'coverage-obligation-1',
    ]);
    expect(current.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('incomplete');
  });

  it('allows trusted completion when the final obligation set is empty', async () => {
    const current = await scenario();

    expect(current.bundle.certificate.body.openObligationIds).toEqual([]);
    expect(current.bundle.certificate.body.lifecycleResult).toBe('trusted-completion');
    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
  });

  it('binds memory handoff digests to the real final references and synthesis output', async () => {
    await expect(scenario(undefined, {
      forgeMemoryHandoffDigests: true,
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:memory-save:outputs',
    });

    const current = await scenario();
    const valid = await verifyDeepResearchCertificateOffline(current.verification);
    expect(valid.verdict).toBe('valid');

    const forgedBinding = await sealDeepResearchArtifact(
      current.artifactStore,
      DeepResearchArtifactKinds.MEMORY_HANDOFF,
      handoffMaterial(digest('offline-fabricated-reference-set'), digest('offline-fabricated-view')),
    );
    const forged = structuredClone(current.bundle) as unknown as {
      certificate: {
        body: {
          artifactClaims: Array<{
            binding: DeepResearchSealedArtifactBinding;
            descriptorDigest: string;
          }>;
        };
      };
      receipts: Array<{
        facts: {
          transitionKind: string;
          outputArtifactQualifiedDigests: string[];
        };
      }>;
    };
    const handoffClaim = forged.certificate.body.artifactClaims.find((claim) => (
      claim.binding.artifactKind === DeepResearchArtifactKinds.MEMORY_HANDOFF
    ));
    const handoffReceipt = forged.receipts.find((receipt) => (
      receipt.facts.transitionKind === DeepResearchTransitionKinds.MEMORY_SAVE
    ));
    if (!handoffClaim || !handoffReceipt) throw new Error('Expected memory handoff evidence');
    handoffClaim.binding = forgedBinding;
    handoffClaim.descriptorDigest = forgedBinding.reference.descriptor_digest;
    handoffReceipt.facts.outputArtifactQualifiedDigests = [
      forgedBinding.reference.qualified_digest,
    ];

    const rejected = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: forged,
    });
    expect(rejected.verdict).not.toBe('valid');
  });

  it('binds objective artifacts only to the initialization charter digest', async () => {
    const executorFingerprint = digest('distinct-executor-fingerprint');
    await expect(scenario(undefined, {
      initExecutorFingerprint: executorFingerprint,
      objectiveMaterialDigest: executorFingerprint,
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:init:outputs',
    });

    const current = await scenario(undefined, { initExecutorFingerprint: executorFingerprint });
    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
  });

  it('rejects convergence and synthesis provenance padding but accepts exact sets', async () => {
    const paddingDigest = digest('unrelated-provenance-padding');
    const paddedCases = [
      {
        options: { convergencePaddingDigest: paddingDigest },
        evidenceLocation: 'transition:convergence:inputs',
      },
      {
        options: { synthesisPaddingDigest: paddingDigest },
        evidenceLocation: 'transition:synthesis:inputs',
      },
    ] as const;
    for (const padded of paddedCases) {
      await expect(scenario(undefined, padded.options)).rejects.toMatchObject({
        code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
        evidenceLocation: padded.evidenceLocation,
      });
    }

    const current = await scenario();
    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
  });

  it('requires projection evidence to equal the authorized ledger event range', async () => {
    await expect(scenario(undefined, {
      transformProjectionEvents: mismatchedProjectionEvents,
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
      evidenceLocation: 'projection:ledger-events',
    });

    const current = await scenario();
    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      projectionEvents: mismatchedProjectionEvents(current.verification.projectionEvents),
    });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') throw new Error('Expected projection-ledger rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.PROJECTION_INVALID);
    expect(result.evidenceLocation).toBe('projection:ledger-events');
  });

  it('quarantines flagged gather evidence and prevents trusted completion', async () => {
    const scanResults = ['clean', 'flagged', 'unknown'] as const;
    const events = scanResults.map((instructionScanResult, index) => createEvent(
      'deep_research.source_captured',
      index + 1,
      { ...iterationScope(), sourceVersionId: `source-version-${instructionScanResult}` },
      { ...sourceCaptureData(instructionScanResult), instructionScanResult },
    ));
    const fixture = await transitionFixture(events);
    const dispositions = [];
    for (const [index, instructionScanResult] of scanResults.entries()) {
      const receipt = await issueDeepResearchTransitionReceipt({
        transitionKind: DeepResearchTransitionKinds.GATHER,
        logicalOperationId: `gather-${instructionScanResult}`,
        attemptIds: [`gather-${instructionScanResult}-attempt-1`],
        resultEventId: `certificate-event-${String(index + 1).padStart(3, '0')}`,
        inputArtifactQualifiedDigests: [],
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
          `certificate-event-${String(index + 1).padStart(3, '0')}`,
        )],
      }, fixture.context);
      dispositions.push(receipt.facts.resultDisposition);
    }
    expect(dispositions).toEqual(['succeeded', 'quarantined', 'in_doubt']);

    const clean = await scenario(undefined, { instructionScanResult: 'clean' });
    expect(clean.bundle.certificate.body.lifecycleResult).toBe('trusted-completion');
    await expect(scenario(undefined, { instructionScanResult: 'flagged' })).rejects.toThrow(
      /Completed runs require converged, committed-synthesis, and completed-memory evidence/u,
    );
  });

  it('preserves supported, contested, and unresolved claim trust across analysis events', async () => {
    const expected = {
      supported: 'succeeded',
      contested: 'in_doubt',
      unresolved: 'incomplete',
    } as const;
    const claimStatuses = ['supported', 'contested', 'unresolved'] as const;
    const events: DeepResearchLedgerEvent[] = claimStatuses.map((claimStatus, index) => createEvent(
      'deep_research.claim_asserted',
      index + 1,
      { ...iterationScope(), claimVersionId: `claim-version-${claimStatus}` },
      claimAssertionData(claimStatus),
    ));
    events.push(createEvent('deep_research.claim_relation_recorded', 4, {
      ...iterationScope(),
      claimVersionId: 'claim-version-relation-contested',
    }, {
      claimId: 'claim-relation-contested',
      relatedClaimVersionId: 'claim-version-supported',
      evidenceIds: ['evidence-relation-contested'],
      relation: 'contradicts',
      independenceGroup: 'independent-relation-contested',
      rawConfidence: 0.6,
      claimStatus: 'contested',
    }));
    const fixture = await transitionFixture(events);

    for (const [index, claimStatus] of claimStatuses.entries()) {
      const receipt = await issueDeepResearchTransitionReceipt({
        transitionKind: DeepResearchTransitionKinds.ANALYZE,
        logicalOperationId: `analyze-${claimStatus}`,
        attemptIds: [`analyze-${claimStatus}-attempt-1`],
        resultEventId: `certificate-event-${String(index + 1).padStart(3, '0')}`,
        inputArtifactQualifiedDigests: [],
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
          `certificate-event-${String(index + 1).padStart(3, '0')}`,
        )],
      }, fixture.context);
      expect(receipt.facts.resultDisposition).toBe(expected[claimStatus]);
    }

    const contestedRelation = await issueDeepResearchTransitionReceipt({
      transitionKind: DeepResearchTransitionKinds.ANALYZE,
      logicalOperationId: 'analyze-relation-contested',
      attemptIds: ['analyze-relation-contested-attempt-1'],
      resultEventId: 'certificate-event-004',
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
        'certificate-event-004',
      )],
    }, fixture.context);
    expect(contestedRelation.facts.resultDisposition).toBe('in_doubt');
  });

  it('maps every admission disposition and contamination status fail closed', async () => {
    const cases = [
      { disposition: 'admit', contaminationStatus: 'clean', expected: 'succeeded' },
      { disposition: 'degrade', contaminationStatus: 'clean', expected: 'in_doubt' },
      { disposition: 'quarantine', contaminationStatus: 'clean', expected: 'quarantined' },
      { disposition: 'admit', contaminationStatus: 'contaminated', expected: 'quarantined' },
      { disposition: 'admit', contaminationStatus: 'suspected', expected: 'in_doubt' },
      { disposition: 'admit', contaminationStatus: 'unknown', expected: 'in_doubt' },
      { disposition: 'quarantine', contaminationStatus: 'unknown', expected: 'quarantined' },
    ] as const;
    const events = cases.map(({ disposition, contaminationStatus }, index) => createEvent(
      'deep_research.evidence_admission_decided',
      index + 1,
      {
        ...iterationScope(),
        sourceVersionId: `source-version-${index + 1}`,
        evidenceId: `evidence-${index + 1}`,
      },
      evidenceAdmissionData(disposition, contaminationStatus),
    ));
    const fixture = await transitionFixture(events);

    for (const [index, current] of cases.entries()) {
      const receipt = await issueDeepResearchTransitionReceipt({
        transitionKind: DeepResearchTransitionKinds.ANALYZE,
        logicalOperationId: `analyze-admission-${index + 1}`,
        attemptIds: [`analyze-admission-${index + 1}-attempt-1`],
        resultEventId: `certificate-event-${String(index + 1).padStart(3, '0')}`,
        inputArtifactQualifiedDigests: [],
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
          `certificate-event-${String(index + 1).padStart(3, '0')}`,
        )],
      }, fixture.context);
      expect(receipt.facts.resultDisposition).toBe(current.expected);
    }
  });

  it('still requires every once-per-run transition receipt', async () => {
    await expect(scenario(undefined, {
      transformTransitionInputs: (inputs) => inputs.filter((input) => (
        input.transitionKind !== DeepResearchTransitionKinds.SYNTHESIS
      )),
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.RECEIPT_MISSING,
      evidenceLocation: 'receipt:synthesis',
    });
  });

  it('rejects distinct gather facts that reuse one logical operation identity', async () => {
    await expect(scenario(undefined, {
      additionalGather: true,
      transformTransitionInputs: (inputs) => {
        const firstGather = inputs.find((input) => (
          input.transitionKind === DeepResearchTransitionKinds.GATHER
        ));
        if (!firstGather) throw new Error('Expected a gather transition');
        let gatherCount = 0;
        return inputs.map((input) => {
          if (input.transitionKind !== DeepResearchTransitionKinds.GATHER) return input;
          gatherCount += 1;
          return gatherCount === 2
            ? { ...input, logicalOperationId: firstGather.logicalOperationId }
            : input;
        });
      },
    })).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.RECEIPT_CONFLICT,
    });
  });

  it('maps every authorized recovery compatibility decision without trusting blocked reuse', async () => {
    const decisions = [
      'blocked',
      'migrate',
      'pin-old-runtime',
      'compatible',
      'exact',
    ] as const satisfies readonly DeepResearchCompatibilityStatus[];
    const expected = {
      blocked: 'blocked',
      migrate: 'in_doubt',
      'pin-old-runtime': 'in_doubt',
      compatible: 'applied',
      exact: 'applied',
    } as const;
    const events = decisions.map((decision, index) => createEvent(
      'deep_research.run_resumed',
      index + 1,
      baseScope(),
      recoveryData(decision),
    ));
    const fixture = await transitionFixture(events);

    for (const [index, decision] of decisions.entries()) {
      const receipt = await issueDeepResearchTransitionReceipt({
        transitionKind: DeepResearchTransitionKinds.RECOVERY,
        logicalOperationId: `recovery-operation-${decision}`,
        attemptIds: [`recovery-attempt-${decision}`],
        resultEventId: `certificate-event-${String(index + 1).padStart(3, '0')}`,
        inputArtifactQualifiedDigests: [],
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
          `certificate-event-${String(index + 1).padStart(3, '0')}`,
        )],
      }, fixture.context);
      expect(receipt.facts.resultDisposition).toBe(expected[decision]);
    }

    const blocked = await scenario('blocked');
    expect(blocked.bundle.receipts.at(-1)?.facts.resultDisposition).toBe('blocked');
    expect(blocked.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    const verification = await verifyDeepResearchCertificateOffline(blocked.verification);
    expect(verification.verdict).toBe('incomplete');
  });

  it('idempotently reuses identical logical facts and conflicts on changed result facts', async () => {
    const events = [
      createEvent('deep_research.source_captured', 1, {
        ...iterationScope(), sourceVersionId: 'source-version-idempotent-1',
      }, sourceCaptureData('idempotent-1')),
      createEvent('deep_research.source_captured', 2, {
        ...iterationScope(), sourceVersionId: 'source-version-idempotent-2',
      }, sourceCaptureData('idempotent-2')),
    ];
    const fixture = await transitionFixture(events);
    const original: DeepResearchTransitionReceiptInput = {
      transitionKind: DeepResearchTransitionKinds.GATHER,
      logicalOperationId: 'logical-gather-idempotency',
      attemptIds: ['attempt-gather-1'],
      resultEventId: 'certificate-event-001',
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.sourceCapture],
    };

    const first = await issueDeepResearchTransitionReceipt(original, fixture.context);
    const repeated = await issueDeepResearchTransitionReceipt(original, fixture.context);
    expect(repeated).toEqual(first);

    let conflict: unknown;
    try {
      await issueDeepResearchTransitionReceipt({
        ...original,
        resultEventId: 'certificate-event-002',
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigestForEvent(
          'certificate-event-002',
        )],
      }, fixture.context);
    } catch (error: unknown) {
      conflict = error;
    }
    expect(conflict).toBeInstanceOf(ReceiptEffectError);
    expect((conflict as ReceiptEffectError).code).toBe(ReceiptEffectErrorCodes.RECEIPT_CONFLICT);
    const durableReceipts = (await fixture.ledger.readVerifiedEvents()).filter((event) => (
      event.event.effective.envelope.event_type === BOUNDARY_RECEIPT_EVENT_TYPE
    ));
    expect(durableReceipts).toHaveLength(1);
  });

  it('binds the prior receipt digest through the durable shared evidence digest', async () => {
    const events = [
      createEvent('deep_research.source_captured', 1, {
        ...iterationScope(), sourceVersionId: 'source-version-prior-digest',
      }, sourceCaptureData('prior-digest')),
    ];
    const fixture = await transitionFixture(events);
    const input: DeepResearchTransitionReceiptInput = {
      transitionKind: DeepResearchTransitionKinds.GATHER,
      logicalOperationId: 'logical-gather-prior-digest',
      attemptIds: ['attempt-gather-prior-digest-1'],
      resultEventId: 'certificate-event-001',
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.sourceCapture],
    };
    const first = await issueDeepResearchTransitionReceipt(input, fixture.context);
    expect(first.sharedReceipt.evidence_digest).toBe(first.receiptDigest);

    const durable = (await fixture.ledger.readVerifiedEvents()).find((event) => (
      event.event.effective.envelope.event_id === first.sharedReceipt.receipt_id
    ));
    expect(durable?.event.effective.envelope.payload.evidence_digest).toBe(first.receiptDigest);

    await expect(issueDeepResearchTransitionReceipt(input, {
      ...fixture.context,
      priorReceiptDigest: 'a'.repeat(64),
    })).rejects.toMatchObject({
      code: ReceiptEffectErrorCodes.RECEIPT_CONFLICT,
    });
  });

  it('preserves retryable memory-save uncertainty as in_doubt', async () => {
    const events = [
      createEvent('deep_research.synthesis_committed', 1, baseScope(), synthesisCommittedData()),
      createEvent('deep_research.memory_save_failed', 2, baseScope(), memorySaveFailureData(true)),
      createEvent('deep_research.memory_save_failed', 3, baseScope(), memorySaveFailureData(false)),
    ];
    const fixture = await transitionFixture(events);
    const dispositions = [];
    for (const [index, retryable] of [true, false].entries()) {
      const receipt = await issueDeepResearchTransitionReceipt({
        transitionKind: DeepResearchTransitionKinds.MEMORY_SAVE,
        logicalOperationId: `memory-save-${retryable ? 'retryable' : 'terminal'}`,
        attemptIds: [`memory-save-attempt-${index + 1}`],
        resultEventId: `certificate-event-${String(index + 2).padStart(3, '0')}`,
        inputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.synthesisReport],
        outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.memoryHandoff],
      }, fixture.context);
      dispositions.push(receipt.facts.resultDisposition);
    }
    expect(dispositions).toEqual(['in_doubt', 'failed']);
  });

  it('rejects a verified wrong-kind transition artifact and accepts the expected kind', async () => {
    const events = [
      createEvent('deep_research.source_captured', 1, {
        ...iterationScope(), sourceVersionId: 'source-version-kind-check',
      }, sourceCaptureData('kind-check')),
    ];
    const fixture = await transitionFixture(events);
    const input: DeepResearchTransitionReceiptInput = {
      transitionKind: DeepResearchTransitionKinds.GATHER,
      logicalOperationId: 'logical-gather-kind-check',
      attemptIds: ['attempt-gather-kind-check-1'],
      resultEventId: 'certificate-event-001',
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.objective],
    };

    await expect(issueDeepResearchTransitionReceipt(input, fixture.context)).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:gather:outputs',
    });

    const receipt = await issueDeepResearchTransitionReceipt({
      ...input,
      outputArtifactQualifiedDigests: [fixture.artifactQualifiedDigests.sourceCapture],
    }, fixture.context);
    expect(receipt.facts.outputArtifactQualifiedDigests).toEqual([
      fixture.artifactQualifiedDigests.sourceCapture,
    ]);
  });

  it('binds a gather output to its own source-capture event as a positive control', async () => {
    const current = await scenario();
    const gather = current.bundle.receipts.find((receipt) => (
      receipt.facts.transitionKind === DeepResearchTransitionKinds.GATHER
    ));
    expect(gather?.facts.outputArtifactQualifiedDigests).toHaveLength(1);
    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
  });

  it('rejects a same-kind gather output sealed for a different source event', async () => {
    await expect(scenario(undefined, {
      includeDecoyArtifacts: true,
      transformTransitionInputs: (inputs, bindings) => {
        const decoy = bindings.filter((binding) => (
          binding.artifactKind === DeepResearchArtifactKinds.SOURCE_CAPTURE
        )).at(-1);
        if (!decoy) throw new Error('Expected source decoy');
        return inputs.map((input) => input.transitionKind === DeepResearchTransitionKinds.GATHER
          ? {
              ...input,
              outputArtifactQualifiedDigests: [decoy.reference.qualified_digest],
            }
          : input);
      },
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:gather:outputs',
    });
  });

  it('independently rejects an offline bundle whose gather receipt claims a decoy output', async () => {
    const current = await scenario(undefined, { includeDecoyArtifacts: true });
    const decoy = current.artifactBindings.filter((binding) => (
      binding.artifactKind === DeepResearchArtifactKinds.SOURCE_CAPTURE
    )).at(-1);
    if (!decoy) throw new Error('Expected source decoy');
    const forged = structuredClone(current.bundle) as unknown as {
      receipts: Array<{ facts: { transitionKind: string; outputArtifactQualifiedDigests: string[] } }>;
    };
    const gather = forged.receipts.find((receipt) => (
      receipt.facts.transitionKind === DeepResearchTransitionKinds.GATHER
    ));
    if (!gather) throw new Error('Expected gather receipt');
    gather.facts.outputArtifactQualifiedDigests = [decoy.reference.qualified_digest];

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: forged,
    });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') throw new Error('Expected offline decoy rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.ARTIFACT_INVALID);
    expect(result.evidenceLocation).toBe('transition:gather:outputs');
  });

  it('rejects same-kind decoy substitution outside gather', async () => {
    await expect(scenario(undefined, {
      includeDecoyArtifacts: true,
      transformTransitionInputs: (inputs, bindings) => {
        const decoy = bindings.filter((binding) => (
          binding.artifactKind === DeepResearchArtifactKinds.CONVERGENCE_WITNESS
        )).at(-1);
        if (!decoy) throw new Error('Expected convergence decoy');
        return inputs.map((input) => input.transitionKind === DeepResearchTransitionKinds.CONVERGENCE
          ? {
              ...input,
              outputArtifactQualifiedDigests: [decoy.reference.qualified_digest],
            }
          : input);
      },
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:convergence:outputs',
    });
  });

  it('rejects an input artifact with no authorized provenance event', async () => {
    await expect(scenario(undefined, {
      includeDecoyArtifacts: true,
      transformTransitionInputs: (inputs, bindings) => {
        const decoy = bindings.filter((binding) => (
          binding.artifactKind === DeepResearchArtifactKinds.SOURCE_CAPTURE
        )).at(-1);
        if (!decoy) throw new Error('Expected source decoy');
        return inputs.map((input) => input.transitionKind === DeepResearchTransitionKinds.ANALYZE
          ? {
              ...input,
              inputArtifactQualifiedDigests: [decoy.reference.qualified_digest],
            }
          : input);
      },
    })).rejects.toMatchObject({
      code: DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:analyze:inputs',
    });
  });

  it('rejects a sealed reference whose persisted bytes no longer verify', async () => {
    const current = await scenario();
    const reference = current.bundle.certificate.body.artifactClaims[0]!.binding.reference;
    const paths = current.artifactStore.inspectPaths(reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, 'tampered-artifact-bytes', 'utf8');

    const result = await verifyDeepResearchCertificateOffline(current.verification);
    expect(result.verdict).not.toBe('valid');
    if (result.verdict === 'valid') throw new Error('Expected artifact rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.ARTIFACT_INVALID);
  });

  it('rejects a wrong projection-integrity claim by recomputing the reducer output', async () => {
    const current = await scenario();
    const tampered = structuredClone(current.bundle) as unknown as {
      certificate: { body: { projectionIntegrityDigest: string } };
    };
    tampered.certificate.body.projectionIntegrityDigest = 'f'.repeat(64);

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: tampered,
    });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') throw new Error('Expected projection rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.PROJECTION_INVALID);
  });

  it('rejects a missing transition receipt as incomplete evidence', async () => {
    const current = await scenario();
    const missing = structuredClone(current.bundle) as unknown as {
      receipts: DeepResearchTransitionReceipt[];
    };
    missing.receipts.splice(2, 1);

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: missing,
    });
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') throw new Error('Expected missing-receipt rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.RECEIPT_MISSING);
  });

  it('rejects a same-length receipt bundle with a missing transition kind', async () => {
    const current = await scenario();
    const wrongDistribution = structuredClone(current.bundle) as unknown as {
      receipts: DeepResearchTransitionReceipt[];
    };
    wrongDistribution.receipts[2] = wrongDistribution.receipts[1]!;

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: wrongDistribution,
    });
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') throw new Error('Expected receipt-distribution rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.RECEIPT_MISSING);
    expect(result.evidenceLocation).toBe('receipt:analyze');
  });

  it('rejects forged convergence evidence instead of trusting the certificate field', async () => {
    const current = await scenario();
    const forged = structuredClone(current.bundle) as unknown as {
      certificate: { body: { convergenceEvidence: { policyFingerprint: string } } };
    };
    forged.certificate.body.convergenceEvidence.policyFingerprint = 'e'.repeat(64);

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: forged,
    });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') throw new Error('Expected convergence rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.CONVERGENCE_INVALID);
  });

  it('rejects an out-of-order receipt chain before treating it as lifecycle evidence', async () => {
    const current = await scenario();
    const reordered = structuredClone(current.bundle) as unknown as {
      receipts: DeepResearchTransitionReceipt[];
    };
    [reordered.receipts[1], reordered.receipts[2]] = [
      reordered.receipts[2]!,
      reordered.receipts[1]!,
    ];

    const result = await verifyDeepResearchCertificateOffline({
      ...current.verification,
      bundle: reordered,
    });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') throw new Error('Expected receipt-chain rejection');
    expect(result.code).toBe(DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID);
  });

  it('rejects unregistered receipt fields without a free-string validation path', async () => {
    const current = await scenario();
    const receipt = structuredClone(current.bundle.receipts[0]) as unknown as {
      facts: Record<string, unknown>;
    };
    receipt.facts.unregisteredNarrative = 'A process says this succeeded.';

    expect(() => parseDeepResearchTransitionReceipt(receipt)).toThrow(
      /missing or unregistered fields/u,
    );
  });
});
