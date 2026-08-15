// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Shadow Parity Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import * as agentImprovementReducers from '../../lib/agent-improvement-reducers/index.js';
import {
  createAgentImprovementEventRegistry,
  prepareAgentImprovementEvent,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS,
  AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES,
  AGENT_IMPROVEMENT_VOLATILITY_ALLOWLIST,
  agentImprovementParityInitialStateDigest,
  canonicalizeAgentImprovementEventStream,
  compareAgentImprovementEventStreams,
  compileAgentImprovementParityManifest,
  createAgentImprovementModeGateInput,
  createAgentImprovementParityCaseDefinition,
  createAgentImprovementParityExecutors,
  parseAgentImprovementModeGateInput,
  parseAgentImprovementParityReceipt,
  runAgentImprovementParityCase,
  verifyAgentImprovementLifecycleEventMap,
} from '../../lib/agent-improvement-shadow-parity/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  compileParityCaseManifest,
  runShadowParityCase,
} from '../../lib/shadow-parity/index.js';

import type {
  AgentImprovementEventEnvelope,
  AgentImprovementEventInput,
  AgentImprovementEventStem,
  AgentImprovementInputData,
  AgentImprovementLedgerEvent,
  AgentImprovementReplayMetadata,
  AgentImprovementScopeMap,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementParityCaseRun,
  AgentImprovementParityDiffClass,
  AgentImprovementParityFaultKind,
  AgentImprovementParityFixture,
  AgentImprovementParityFixtureScenario,
} from '../../lib/agent-improvement-shadow-parity/index.js';
import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ParityCaseCapsule,
  ParityCaseManifest,
} from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const OTHER_BASE_SHA = '1371371371371371371371371371371371371371';
const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'agent-parity-run-1';
const LINEAGE_ID = 'agent-parity-lineage-1';
const CANDIDATE_ID = 'agent-parity-candidate-1';
const STREAM_ID = 'agent-parity-stream-1';
const EVALUATION_EPOCH_ID = 'agent-parity-evaluation-1';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];
const registry = createAgentImprovementEventRegistry();

const FAULT_CASES = Object.freeze([
  { kind: 'drop-event', expectedClass: 'missing' },
  { kind: 'extra-event', expectedClass: 'extra' },
  { kind: 'duplicate-event', expectedClass: 'duplicated' },
  { kind: 'reorder-event', expectedClass: 'reordered' },
  { kind: 'causal-link', expectedClass: 'causal-link' },
  { kind: 'payload', expectedClass: 'payload' },
  { kind: 'receipt', expectedClass: 'receipt' },
  { kind: 'artifact', expectedClass: 'artifact' },
  { kind: 'projection', expectedClass: 'projection' },
  { kind: 'authorization', expectedClass: 'unauthorized' },
  { kind: 'changed-locus', expectedClass: 'changed-locus' },
  { kind: 'lineage', expectedClass: 'lineage' },
  { kind: 'coverage', expectedClass: 'coverage' },
  { kind: 'evaluator-epoch', expectedClass: 'evaluator-epoch' },
  { kind: 'transfer', expectedClass: 'transfer' },
  { kind: 'evaluator-integrity', expectedClass: 'evaluator-integrity' },
  { kind: 'canary', expectedClass: 'canary' },
  { kind: 'promotion', expectedClass: 'promotion' },
  { kind: 'reference-digest', expectedClass: 'reference-digest' },
  { kind: 'resume-continuity', expectedClass: 'resume-continuity' },
  { kind: 'stale', expectedClass: 'stale' },
  { kind: 'telemetry-gap', expectedClass: 'telemetry-gap' },
  { kind: 'malformed', expectedClass: 'malformed' },
  { kind: 'unsupported-version', expectedClass: 'unsupported-version' },
] as const satisfies readonly Readonly<{
  kind: AgentImprovementParityFaultKind;
  expectedClass: AgentImprovementParityDiffClass;
}>[]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `agent-improvement-parity-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function replayMetadata(): AgentImprovementReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('agent-parity-replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
      manifest: digest('manifest'),
    },
  };
}

function scopeFor<TStem extends AgentImprovementEventStem>(
  stem: TStem,
): AgentImprovementScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'agent-improvement' as const,
  };
  const candidate = { ...base, candidateId: CANDIDATE_ID };
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as AgentImprovementScopeMap[TStem];
  }
  switch (stem) {
    case 'agent_improvement.definition_snapshot_sealed':
      return { ...base, agentDefinitionId: 'agent-definition-1' } as unknown as AgentImprovementScopeMap<TStem>;
    case 'agent_improvement.agent_ir_compiled':
      return {
        ...base,
        agentDefinitionId: 'agent-definition-1',
        agentIrId: 'agent-ir-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.change_contract_compiled':
      return { ...candidate, agentChangeId: 'agent-change-1' } as unknown as AgentImprovementScopeMap<TStem>;
    case 'agent_improvement.mutation_proposed':
      return {
        ...candidate,
        agentChangeId: 'agent-change-1',
        mutationId: 'mutation-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.behavior_coverage_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        behaviorFamilyId: 'behavior-family-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.transfer_trial_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        trialId: 'trial-1',
      } as AgentImprovementScopeMap[TStem];
    default:
      return base as AgentImprovementScopeMap[TStem];
  }
}

function createEvent<TStem extends AgentImprovementEventStem>(
  stem: TStem,
  sequence: number,
  data: AgentImprovementInputData<TStem>,
  previous: AgentImprovementLedgerEvent | null,
): AgentImprovementEventEnvelope<TStem> {
  const input: AgentImprovementEventInput<TStem> = {
    stem,
    scope: scopeFor(stem),
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: replayMetadata(),
    data,
    eventId: `agent-parity-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'agent-improvement-parity-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `agent-parity-event-${sequence}`,
  };
  return prepareAgentImprovementEvent(input, registry).envelope as AgentImprovementEventEnvelope<TStem>;
}

function append<TStem extends AgentImprovementEventStem>(
  events: AgentImprovementLedgerEvent[],
  stem: TStem,
  data: AgentImprovementInputData<TStem>,
): AgentImprovementEventEnvelope<TStem> {
  const event = createEvent(stem, events.length + 1, data, events.at(-1) ?? null);
  events.push(event);
  return event;
}

function fixtureEvents(): readonly AgentImprovementLedgerEvent[] {
  const events: AgentImprovementLedgerEvent[] = [];
  append(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:agent-improvement',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const commonProposal = append(events, 'deep_improvement_common.candidate_proposed', {
    proposalRef: 'proposal:candidate-1',
    proposalDigest: digest('common-proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null,
    targetRef: 'target:agent-1',
    targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  });
  append(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: commonProposal.event_id,
    proposalPayloadDigest: commonProposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const definition = append(events, 'agent_improvement.definition_snapshot_sealed', {
    definitionRef: 'artifact:agent-definition-1',
    definitionDigest: digest('definition'),
    definitionSchemaVersion: 'agent-definition@1',
    capabilityPolicyRef: 'policy:capability-1',
    capabilityPolicyDigest: digest('capability'),
    verifierPolicyRef: 'policy:verifier-1',
    verifierPolicyDigest: digest('verifier'),
    toolPolicyRef: 'policy:tool-1',
    toolPolicyDigest: digest('tool'),
    routingPolicyRef: 'policy:routing-1',
    routingPolicyDigest: digest('routing'),
    memoryPolicyRef: 'policy:memory-1',
    memoryPolicyDigest: digest('memory'),
    sealingReceiptRef: 'receipt:definition-1',
  });
  const agentIr = append(events, 'agent_improvement.agent_ir_compiled', {
    definitionSnapshotEventId: definition.event_id,
    definitionSnapshotPayloadDigest: definition.payload.payloadDigest,
    agentIrRef: 'artifact:agent-ir-1',
    agentIrDigest: digest('agent-ir'),
    agentIrSchemaVersion: 'agent-ir@1',
    components: [{
      componentId: 'component-instructions',
      componentKind: 'instruction',
      componentRef: 'agent-ir:component:instructions',
      componentDigest: digest('component-instructions'),
    }, {
      componentId: 'component-tools',
      componentKind: 'tool-policy',
      componentRef: 'agent-ir:component:tools',
      componentDigest: digest('component-tools'),
    }],
    inheritanceEdges: [{
      edgeId: 'edge-instructions-tools',
      parentComponentId: 'component-instructions',
      childComponentId: 'component-tools',
      inheritanceKind: 'preserves',
      edgeDigest: digest('inheritance-edge'),
    }],
    loci: [{
      locusId: 'locus-instruction-1',
      componentId: 'component-instructions',
      clauseId: 'clause-1',
      locusKind: 'instruction',
      mutability: 'mutable',
      locusRef: 'agent-ir:locus:instruction-1',
      locusDigest: digest('locus-instruction'),
    }, {
      locusId: 'locus-tool-policy-1',
      componentId: 'component-tools',
      clauseId: null,
      locusKind: 'tool-policy',
      mutability: 'immutable',
      locusRef: 'agent-ir:locus:tool-policy-1',
      locusDigest: digest('locus-tool-policy'),
    }],
    compilerFingerprint: digest('compiler'),
    compilationReceiptRef: 'receipt:agent-ir-1',
  });
  const change = append(events, 'agent_improvement.change_contract_compiled', {
    agentIrEventId: agentIr.event_id,
    agentIrPayloadDigest: agentIr.payload.payloadDigest,
    baseDefinitionRef: 'artifact:definition-base',
    baseDefinitionDigest: digest('base-definition'),
    candidateDefinitionRef: 'artifact:definition-candidate',
    candidateDefinitionDigest: digest('candidate-definition'),
    changeContractRef: 'artifact:change-contract-1',
    changeContractDigest: digest('change-contract'),
    patchRef: 'artifact:patch-1',
    patchDigest: digest('patch'),
    intendedObligationIds: ['obligation:clarity'],
    preservedObligationIds: ['obligation:authority'],
    affectedBehaviorFamilyIds: ['behavior-family-1'],
    behavioralSemverIntent: 'patch',
    contractPolicyVersion: 'change-contract@1',
    compilationReceiptRef: 'receipt:change-contract-1',
  });
  append(events, 'agent_improvement.mutation_proposed', {
    changeContractEventId: change.event_id,
    changeContractPayloadDigest: change.payload.payloadDigest,
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    mutationProposalRef: 'proposal:mutation-1',
    mutationProposalDigest: digest('mutation'),
    targetLocusIds: ['locus-instruction-1'],
    parentCandidateId: null,
    diagnosticEvidenceRefs: ['diagnostic:failure-1'],
    diagnosticEvidenceSetDigest: digest('diagnostic-set'),
    proposalPolicyVersion: 'mutation-proposal@1',
  });
  return Object.freeze(events);
}

function fixture(
  scenario: AgentImprovementParityFixtureScenario = 'clean-proposal',
  fixtureId = `fixture-${scenario}`,
): AgentImprovementParityFixture {
  const provisional: AgentImprovementParityFixture = {
    fixtureId,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      targetAgentDigest: digest('target-agent'),
      baselineAgentDigest: digest('baseline-agent'),
      agentIrDigest: digest('agent-ir'),
      inheritanceDigest: digest('inheritance'),
      evaluatorCapsuleDigest: digest('evaluator-capsule'),
      evaluatorEpochId: EVALUATION_EPOCH_ID,
      fixtureRingsDigest: digest('fixture-rings'),
      executorDescriptorDigest: digest('executor-descriptor'),
      environmentDigest: digest('environment'),
      toolReceiptsDigest: digest('tool-receipts'),
      commonServiceContractDigest: digest(AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES),
      initialStateDigest: digest('pending-initial-state'),
      configurationDigest: digest({ mode: 'agent-improvement', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1',
        runId: RUN_ID,
        lineageId: LINEAGE_ID,
        generation: 1,
        maxIterations: 4,
        remainingIterations: 3,
        deadlineAt: '2026-07-29T10:00:00.000Z',
      },
    },
    events: fixtureEvents(),
    expectedTerminalDecision: 'active',
    resumeEvidence: null,
    commonParityReceiptDigest: digest('common-parity-receipt'),
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: agentImprovementParityInitialStateDigest(provisional),
    }),
  });
}

interface ArtifactHarness {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

function artifactPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

/** Pin actor, capability, and evidence to the prepared request so unverified identity cannot authorize. */
function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function createArtifactHarness(): ArtifactHarness {
  const root = temporaryRoot('sealed');
  const eventRegistry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: artifactPolicy,
  }]);
  const authority: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(root, 'ledger'),
    ledgerId: 'agent-parity-artifacts',
    auditLedgerId: 'agent-parity-artifact-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(root, 'ledger'),
    auditLedgerId: 'agent-parity-artifact-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
    identityResolver: pinRequestIdentity,
  }, ledger, policies);
  const store = new SealedArtifactStore({ rootDirectory: join(root, 'store') });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`,
      streamId: 'agent-parity-artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'agent-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${event.identity.eventId}`,
      mode: 'improvement',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'agent-parity-tests',
      capabilityId: 'artifact-write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: event.canonicalDigest,
    }),
  };
  return { ledger, store, recorder, registry: eventRegistry, nextMetadata };
}

async function seal(
  harness: ArtifactHarness,
  kind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(kind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    kind,
  );
}

async function sealedBoundary(): Promise<{
  readonly harness: ArtifactHarness;
  readonly referenceSet: ArtifactReferenceSet;
}> {
  const harness = createArtifactHarness();
  const frozenFixture = await seal(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'agent-improvement', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await seal(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'agent-improvement', authority: 'legacy' },
    'configuration',
  );
  return { harness, referenceSet: bindVerifiedArtifactReferences([frozenFixture, configuration]) };
}

function capsule(
  parityFixture: AgentImprovementParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: parityFixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: parityFixture.frozenInput.baseSha }),
    initialStateDigest: parityFixture.frozenInput.initialStateDigest,
    configurationDigest: parityFixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'agent-improvement-event@1',
      comparator: 'agent-improvement-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'agent-improvement-bounded-shadow',
  };
}

function targetedManifest(parityFixture: AgentImprovementParityFixture): ParityCaseManifest {
  const definition = createAgentImprovementParityCaseDefinition(parityFixture);
  return compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

async function genericRun(
  parityFixture: AgentImprovementParityFixture,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: AgentImprovementParityFaultKind;
    eventIndex: number;
  }>,
): Promise<Readonly<{
  run: AgentImprovementParityCaseRun;
  result: Awaited<ReturnType<typeof runShadowParityCase>>;
}>> {
  const sealed = await sealedBoundary();
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(parityFixture, sealed.referenceSet),
  };
  const run = {
    caseDefinition: createAgentImprovementParityCaseDefinition(parityFixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: parityFixture,
    executors: createAgentImprovementParityExecutors(parityFixture, fault),
    modeCertificateVerification: { input: {} as never },
    shadowRootDirectory: join(temporaryRoot('execution'), 'shadow'),
    protectedRoots: [join(temporaryRoot('authority'), 'legacy-live')],
    deterministicRuns: 2,
  } satisfies AgentImprovementParityCaseRun;
  const result = await runShadowParityCase({
    caseDefinition: run.caseDefinition,
    shadowRootDirectory: run.shadowRootDirectory,
    protectedRoots: run.protectedRoots,
    legacy: run.legacyBoundary,
    dark: run.ledgerBoundary,
    executeLegacy: run.executors.legacy,
    executeDark: run.executors.ledger,
    deterministicRuns: run.deterministicRuns,
  });
  return Object.freeze({ run, result });
}

function independentTransportEvents(
  events: readonly AgentImprovementLedgerEvent[],
  path: 'ledger' | 'legacy',
): readonly AgentImprovementLedgerEvent[] {
  const ids = new Map(events.map((event) => [event.event_id, `${path}-${event.event_id}`]));
  return Object.freeze(events.map((event, index) => Object.freeze({
    ...event,
    event_id: ids.get(event.event_id) as string,
    causation_id: event.causation_id === null
      ? null : ids.get(event.causation_id) as string,
    occurred_at: path === 'legacy'
      ? '2026-07-28T10:01:00.000Z' : '2026-07-28T10:02:00.000Z',
    recorded_at: path === 'legacy'
      ? '2026-07-28T10:03:00.000Z' : '2026-07-28T10:04:00.000Z',
    correlation_id: `transport-${digest({ path, index }).slice(0, 16)}`,
  } as AgentImprovementLedgerEvent)));
}

function malformedIdentityRegistryCertificate(mode: string): Record<string, unknown> {
  const placeholderDigest = digest({ mode, certificate: 'malformed-identity-registry' });
  return {
    schema_version: 1,
    mode,
    base_sha: BASE_SHA,
    manifest_digest: placeholderDigest,
    case_ids: [],
    case_evidence_digests: [],
    reference_set_digests: [],
    attestation_final_digests: [],
    bindings: {},
    identity_registry: { schema_version: 1, identities: {} },
    evidence_digest: placeholderDigest,
    open_divergence_count: 0,
    authority_state: 'legacy_authoritative',
    authority_mutation: false,
    rollback_minimum_days: 14,
    rollback_minimum_successful_runs: 20,
    certificate_digest: placeholderDigest,
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('agent improvement shadow parity', () => {
  it('pairs independent event ids while honoring the closed volatility allowlist', () => {
    const events = fixtureEvents();
    const fingerprints = events.map((_, index) => digest({ projection: index }));
    const legacy = canonicalizeAgentImprovementEventStream(
      independentTransportEvents(events, 'legacy'),
      fingerprints,
    );
    const ledger = canonicalizeAgentImprovementEventStream(
      independentTransportEvents(events, 'ledger'),
      fingerprints,
    );

    expect(AGENT_IMPROVEMENT_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(legacy.map((entry) => entry.eventId)).not.toEqual(
      ledger.map((entry) => entry.eventId),
    );
    expect(compareAgentImprovementEventStreams('fixture-independent', legacy, ledger)).toEqual([]);

    const changed = ledger.map((entry, index) => index === 6
      ? Object.freeze({ ...entry, stablePayloadDigest: digest('semantic-change') })
      : entry);
    expect(compareAgentImprovementEventStreams(
      'fixture-independent',
      legacy,
      changed,
    ).map((entry) => entry.class)).toContain('payload');
  });

  it('rejects malformed values in every allowlisted volatility slot', () => {
    const event = fixtureEvents()[0];
    const fingerprint = digest('projection');
    expect(() => canonicalizeAgentImprovementEventStream([{
      ...event,
      correlation_id: 'semantic-agent-id',
    }], [fingerprint])).toThrow(/transport-only token grammar/);
    expect(() => canonicalizeAgentImprovementEventStream([{
      ...event,
      recorded_at: 'not-a-timestamp',
    }], [fingerprint])).toThrow(/volatile timestamps/);
  });

  it('uses distinct implementations and preserves the common parity contract identity', () => {
    const executors = createAgentImprovementParityExecutors(fixture());
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleImplementation).toBe('modeled-legacy-oracle');
    expect(executors.ledgerImplementation).toBe('typed-ledger-pipeline');
    expect(executors.commonParityContractId).toBe('deep-improvement-common-shadow-parity');
    expect(executors.substrateImportsReal).toBe(true);
  });

  it('runs a real zero-diff dual path through authorization, ledger, reducer, and replay', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture);
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    const evidence = outcome.run.executors.evidence();
    expect(evidence).toHaveLength(4);
    expect(new Set(evidence.map((entry) => entry.implementationKind))).toEqual(new Set([
      'modeled-legacy-oracle', 'typed-ledger-pipeline',
    ]));
    expect(compareAgentImprovementEventStreams(
      parityFixture.fixtureId,
      evidence.find((entry) => entry.path === 'legacy')?.observations ?? [],
      evidence.find((entry) => entry.path === 'ledger')?.observations ?? [],
    )).toEqual([]);
  }, 30_000);

  it('fails on a reducer-internal divergence a shared-derivation harness could not see', async () => {
    // Corrupt only the real reducer's own typed fold output (never the raw
    // event stream both paths read). A harness whose ledger side re-derives
    // from the same raw events as the legacy oracle -- instead of from this
    // fold result -- cannot observe this at all, so it reports parity PASS
    // despite the reducer having computed a wrong agent-IR field. The
    // rebuilt harness must FAIL here.
    const realFold = agentImprovementReducers.foldAgentImprovementEvents;
    const foldSpy = vi.spyOn(agentImprovementReducers, 'foldAgentImprovementEvents')
      .mockImplementation((events, options) => {
        const real = realFold(events, options);
        const versions = real.outcome === 'projected'
          ? real.projection.agentImprovement.artifactIndex.agentIrVersions
          : [];
        if (real.outcome !== 'projected' || versions.length === 0) return real;
        const [first, ...rest] = versions;
        return {
          ...real,
          projection: {
            ...real.projection,
            agentImprovement: {
              ...real.projection.agentImprovement,
              artifactIndex: {
                ...real.projection.agentImprovement.artifactIndex,
                agentIrVersions: [
                  { ...first, compilerFingerprint: digest('corrupted-compiler-fingerprint') },
                  ...rest,
                ],
              },
            },
          },
        };
      });
    try {
      const parityFixture = fixture();
      const outcome = await genericRun(parityFixture);
      expect(foldSpy).toHaveBeenCalled();
      expect(outcome.result.ok, JSON.stringify(outcome.result)).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
    } finally {
      foldSpy.mockRestore();
    }
  }, 30_000);

  it('still reports parity PASS for identical inputs once the reducer fold is genuine again', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture);
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
  }, 30_000);

  it('drives injected payload drift through the complete real substrate', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture, {
      path: 'ledger',
      kind: 'payload',
      eventIndex: 6,
    });
    expect(outcome.result.ok).toBe(false);
    const legacy = outcome.run.executors.evidence()
      .find((entry) => entry.path === 'legacy')?.observations ?? [];
    const ledger = outcome.run.executors.evidence()
      .find((entry) => entry.path === 'ledger')?.observations ?? [];
    expect(compareAgentImprovementEventStreams(
      parityFixture.fixtureId,
      legacy,
      ledger,
    ).map((entry) => entry.class)).toContain('payload');
  }, 30_000);

  it.each(FAULT_CASES)(
    'classifies $kind as exact typed $expectedClass through the real comparator',
    ({ expectedClass }) => {
      const events = fixtureEvents();
      const fingerprints = events.map((_, index) => digest({ projection: index }));
      const legacy = canonicalizeAgentImprovementEventStream(events, fingerprints);
      let ledger = [...legacy];
      const index = 5;
      if (expectedClass === 'missing') ledger.splice(index, 1);
      else if (expectedClass === 'extra') {
        ledger.push(Object.freeze({
          ...ledger[index],
          eventId: 'agent-parity-event-extra',
          logicalIdentity: Object.freeze({
            ...ledger[index].logicalIdentity,
            producerSequence: ledger.length + 1,
          }),
          producerSequence: ledger.length + 1,
        }));
      } else if (expectedClass === 'duplicated') {
        ledger.push(Object.freeze({
          ...ledger[index],
          eventId: 'agent-parity-event-duplicate',
        }));
      } else if (expectedClass === 'reordered') {
        [ledger[index], ledger[index + 1]] = [ledger[index + 1], ledger[index]];
      } else {
        ledger[index] = Object.freeze({
          ...ledger[index],
          stepKey: `${ledger[index].stepKey}#${expectedClass}`,
        });
      }
      const diffs = compareAgentImprovementEventStreams(
        'fixture-fault-classification',
        legacy,
        ledger,
      );
      expect(diffs.map((entry) => entry.class), JSON.stringify(diffs)).toContain(expectedClass);
      expect(diffs.every((entry) => entry.disposition === 'unexplained')).toBe(true);
    },
  );

  it('compiles only the exact mode-specific fixture closure', () => {
    const fixtures = AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS.map(
      (scenario) => fixture(scenario, `fixture-${scenario}`),
    );
    const manifest = compileAgentImprovementParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS.length);
    expect(() => compileAgentImprovementParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/exact fixture scenario closure/);
  });

  it('blocks missing receipts and rejects authority-bearing gate input', () => {
    const parityFixture = fixture();
    const manifest = targetedManifest(parityFixture);
    const gate = createAgentImprovementModeGateInput({
      manifest,
      expectedFixtureIds: [parityFixture.fixtureId],
      receipts: [],
    });
    expect(gate).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'MISSING_RECEIPT',
      cutoverAuthorized: false,
      rollbackReadinessAuthorized: false,
    });
    expect(() => parseAgentImprovementModeGateInput({
      ...gate,
      cutoverAuthorized: true,
    })).toThrow(/cannot carry authority|digest/);
  });

  it('fails a gate handoff against a different manifest and BASE', () => {
    const parityFixture = fixture();
    const definition = createAgentImprovementParityCaseDefinition(parityFixture);
    const otherManifest = compileParityCaseManifest({
      baseSha: OTHER_BASE_SHA,
      baselineRows: [{
        scenarioId: definition.scenarioId,
        mode: definition.mode,
        contractDigest: definition.contractDigest,
        disposition: 'protected',
      }],
      cases: [definition],
    });
    const gate = createAgentImprovementModeGateInput({
      manifest: otherManifest,
      expectedFixtureIds: [parityFixture.fixtureId],
      receipts: [],
    });
    expect(gate.baseSha).toBe(OTHER_BASE_SHA);
    expect(gate.exitStatus).toBe('blocked');
  });

  it('rejects a malformed certificate identity registry', async () => {
    const parityFixture = fixture();
    const manifest = targetedManifest(parityFixture);
    const { run } = await genericRun(parityFixture);
    const outcome = await runAgentImprovementParityCase({ manifest, caseRun: run });
    expect(() => parseAgentImprovementParityReceipt({
      ...outcome.receipt,
      parityCertificate: malformedIdentityRegistryCertificate('agent-improvement'),
    }, manifest)).toThrow(/closed identity-registry shape/);
  }, 30_000);

  it('proves the lifecycle map closes every shared and mode-specific event', () => {
    expect(() => verifyAgentImprovementLifecycleEventMap()).not.toThrow();
  });
});
