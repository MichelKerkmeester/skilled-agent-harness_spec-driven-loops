// MODULE: Agent Improvement Certificates and Receipts

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  AgentImprovementWireEventTypes,
} from '../agent-improvement-ledger-schema/index.js';
import {
  agentImprovementProjectionIntegrityDigest,
  foldAgentImprovementEvents,
} from '../agent-improvement-reducers/index.js';
import {
  AgentImprovementArtifactKinds,
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  readAgentImprovementArtifact,
} from '../agent-improvement-sealed-artifacts/index.js';
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
  AgentImprovementCertificateError,
  AgentImprovementCertificateFailureCodes,
  AgentImprovementTransitionKinds,
} from './agent-improvement-certificate-types.js';
import {
  parseAgentImprovementCertificateBundle,
  parseAgentImprovementRunCertificate,
  parseAgentImprovementTransitionReceipt,
} from './agent-improvement-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type {
  AgentImprovementLedgerEvent,
} from '../agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementProjectionState,
} from '../agent-improvement-reducers/index.js';
import type {
  AgentImprovementArtifactKind,
  AgentImprovementArtifactMaterial,
  AgentImprovementSealedArtifactBinding,
  AgentImprovementVerifiedSealedArtifact,
} from '../agent-improvement-sealed-artifacts/index.js';
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
  AgentImprovementCertificateArtifactClaim,
  AgentImprovementCertificateArtifactRole,
  AgentImprovementCertificateBundle,
  AgentImprovementCertificateIssuerInput,
  AgentImprovementOfflineVerificationFailure,
  AgentImprovementOfflineVerificationInput,
  AgentImprovementOfflineVerificationResult,
  AgentImprovementReceiptIdentity,
  AgentImprovementRunCertificate,
  AgentImprovementRunCertificateBody,
  AgentImprovementTransitionKind,
  AgentImprovementTransitionOutcome,
  AgentImprovementTransitionReceipt,
  AgentImprovementTransitionReceiptContext,
  AgentImprovementTransitionReceiptFacts,
  AgentImprovementTransitionReceiptInput,
  AgentImprovementTransitionReceiptSubstrate,
} from './agent-improvement-certificate-types.js';

export const AGENT_IMPROVEMENT_CERTIFICATE_VERSION = 1 as const;
export const AGENT_IMPROVEMENT_RECEIPT_VERSION = 1 as const;
export const AGENT_IMPROVEMENT_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([] as const);

export const AGENT_IMPROVEMENT_REQUIRED_TRANSITION_ORDER = Object.freeze([
  AgentImprovementTransitionKinds.PROPOSAL_CREATED,
  AgentImprovementTransitionKinds.SCORE_REDUCED,
  AgentImprovementTransitionKinds.BENCHMARK_EVIDENCE_RECORDED,
] as const);

export const AGENT_IMPROVEMENT_ARTIFACT_ROLE_EXPECTATIONS = Object.freeze({
  proposal: AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
  'scoring-evidence': AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE,
  'benchmark-evidence': AgentImprovementArtifactKinds.TRIAL_TRAJECTORY,
} as const satisfies Readonly<Record<
  AgentImprovementCertificateArtifactRole,
  AgentImprovementArtifactKind
>>);

const TRANSITION_EVENTS: Readonly<Record<
  AgentImprovementTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  'proposal-created': new Set([
    AgentImprovementWireEventTypes['agent_improvement.mutation_proposed'],
  ]),
  'score-reduced': new Set([
    AgentImprovementWireEventTypes['agent_improvement.behavior_coverage_recorded'],
  ]),
  'benchmark-evidence-recorded': new Set([
    AgentImprovementWireEventTypes['agent_improvement.transfer_trial_recorded'],
  ]),
});

const TRANSITION_OUTPUT_KINDS: Readonly<Record<
  AgentImprovementTransitionKind,
  AgentImprovementArtifactKind
>> = Object.freeze({
  'proposal-created': AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
  'score-reduced': AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE,
  'benchmark-evidence-recorded': AgentImprovementArtifactKinds.TRIAL_TRAJECTORY,
});

const TRANSITION_BOUNDARIES: Readonly<Record<
  AgentImprovementTransitionKind,
  Readonly<{
    kind: BoundaryKind;
    scope: BoundaryScope;
    fromState: string;
    toState: string;
  }>
>> = Object.freeze({
  'proposal-created': Object.freeze({
    kind: 'phase-enter',
    scope: 'phase',
    fromState: 'generated',
    toState: 'proposed',
  }),
  'score-reduced': Object.freeze({
    kind: 'phase-completion',
    scope: 'phase',
    fromState: 'evaluating',
    toState: 'scored',
  }),
  'benchmark-evidence-recorded': Object.freeze({
    kind: 'phase-handoff',
    scope: 'phase',
    fromState: 'scored',
    toState: 'verified',
  }),
});

interface ArtifactEvidence {
  readonly claim: AgentImprovementCertificateArtifactClaim;
  readonly material: AgentImprovementArtifactMaterial;
}

interface VerifiedArtifactSet {
  readonly claims: readonly AgentImprovementCertificateArtifactClaim[];
  readonly byQualifiedDigest: ReadonlyMap<string, ArtifactEvidence>;
}

interface PreparedReceiptContext extends Omit<
  AgentImprovementTransitionReceiptContext,
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
  verified: AgentImprovementVerifiedSealedArtifact,
): AgentImprovementArtifactMaterial {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes do not contain a canonical Agent Improvement capsule',
    );
  }
  const capsule = record(decoded);
  const material = record(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || material === null) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified bytes disagree with their sealed Agent Improvement binding',
    );
  }
  return material as unknown as AgentImprovementArtifactMaterial;
}

function roleFor(kind: AgentImprovementArtifactKind): AgentImprovementCertificateArtifactRole {
  for (const [role, expected] of Object.entries(AGENT_IMPROVEMENT_ARTIFACT_ROLE_EXPECTATIONS)) {
    if (expected === kind) return role as AgentImprovementCertificateArtifactRole;
  }
  throw new AgentImprovementCertificateError(
    AgentImprovementCertificateFailureCodes.ARTIFACT_WRONG_KIND,
    `artifact:${kind}`,
    'Certificate bindings are limited to the three mode-owned evidence roles',
  );
}

async function verifiedArtifactSet(
  store: AgentImprovementCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly AgentImprovementSealedArtifactBinding[],
  evaluationEpochId: string,
): Promise<VerifiedArtifactSet> {
  const claims: AgentImprovementCertificateArtifactClaim[] = [];
  const byQualifiedDigest = new Map<string, ArtifactEvidence>();
  for (const binding of bindings) {
    const verified = await readAgentImprovementArtifact(
      store,
      binding,
      { requiredEvaluationEpochId: evaluationEpochId },
    );
    const role = roleFor(verified.binding.artifactKind);
    const expectedArtifactKind = AGENT_IMPROVEMENT_ARTIFACT_ROLE_EXPECTATIONS[role];
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (byQualifiedDigest.has(qualifiedDigest)) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        'artifact:set',
        'Certificate artifact identities must be unique',
      );
    }
    const claim: AgentImprovementCertificateArtifactClaim = Object.freeze({
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
  if (
    claims.length !== 3
    || new Set(roles).size !== 3
    || Object.keys(AGENT_IMPROVEMENT_ARTIFACT_ROLE_EXPECTATIONS).some(
      (role) => !roles.includes(role as AgentImprovementCertificateArtifactRole),
    )
  ) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE,
      'artifact:roles',
      'Certificate requires exactly one proposal, scoring, and benchmark artifact',
    );
  }
  return Object.freeze({ claims: Object.freeze(claims), byQualifiedDigest });
}

function findEvent(
  events: readonly VerifiedLedgerEvent[],
  eventId: string,
): VerifiedLedgerEvent {
  const matches = events.filter(
    (event) => event.event.effective.envelope.event_id === eventId,
  );
  if (matches.length !== 1) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
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
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Authorized Agent Improvement event lacks its closed data object',
    );
  }
  return data;
}

function outcomeFor(
  transitionKind: AgentImprovementTransitionKind,
  event: VerifiedLedgerEvent,
): AgentImprovementTransitionOutcome {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENTS[transitionKind].has(eventType)) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${transitionKind}`,
      'Transition kind does not match its authorized result event type',
    );
  }
  const data = eventData(event);
  if (transitionKind === 'score-reduced') {
    return data.coverageOutcome === 'covered' && data.criticalInvariantOutcome === 'pass'
      ? 'completed'
      : 'inconclusive';
  }
  if (transitionKind === 'benchmark-evidence-recorded') {
    return data.transferOutcome === 'pass' ? 'completed' : 'inconclusive';
  }
  return 'completed';
}

export function deriveAgentImprovementReceiptIdentity(
  runId: string,
  input: AgentImprovementTransitionReceiptInput,
): AgentImprovementReceiptIdentity {
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
  input: AgentImprovementTransitionReceiptInput,
  context: Pick<PreparedReceiptContext, 'artifacts' | 'ledgerEvents'>,
): void {
  const expectedOutputKind = TRANSITION_OUTPUT_KINDS[input.transitionKind];
  if (input.outputArtifactQualifiedDigests.length !== 1) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE,
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
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Receipt artifact roles must not alias one another',
    );
  }
  for (const reference of combined) {
    if (!context.artifacts.byQualifiedDigest.has(reference)) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING,
        `transition:${input.transitionKind}:artifacts`,
        'Receipt references an artifact outside the verified certificate set',
      );
    }
  }
  const output = context.artifacts.byQualifiedDigest.get(
    input.outputArtifactQualifiedDigests[0] as string,
  );
  if (output?.claim.expectedArtifactKind !== expectedOutputKind) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_WRONG_KIND,
      `transition:${input.transitionKind}:outputs`,
      'Receipt output is not the expected mode-specific artifact kind',
    );
  }
  const expectedInputs = input.transitionKind === 'proposal-created'
    ? []
    : input.transitionKind === 'score-reduced'
      ? [AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL]
      : [
          AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
          AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE,
        ];
  const actualInputs = input.inputArtifactQualifiedDigests.map((reference) => (
    context.artifacts.byQualifiedDigest.get(reference)?.claim.expectedArtifactKind
  ));
  if (canonicalJson(asJson(expectedInputs)) !== canonicalJson(asJson(actualInputs))) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:inputs`,
      'Receipt inputs do not preserve the exact ordered dependency closure',
    );
  }
  if (input.evidenceArtifactQualifiedDigests.length !== 0) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:evidence`,
      'Mode evidence is carried by typed outputs and shared receipt identities',
    );
  }
}

function assertArtifactOwnedByEvent(
  input: AgentImprovementTransitionReceiptInput,
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
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
      `transition:${input.transitionKind}:owner`,
      'Receipt output has no matching authorized origin event',
    );
  }
}

function buildReceiptFacts(
  input: AgentImprovementTransitionReceiptInput,
  context: Omit<PreparedReceiptContext, 'receiptSubstrate' | 'certificationProfile' | 'providers' | 'issuer' | 'issuedAt'>,
): AgentImprovementTransitionReceiptFacts {
  assertArtifactVector(input, context);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  assertArtifactOwnedByEvent(input, event, context.artifacts);
  const identity = deriveAgentImprovementReceiptIdentity(context.runId, input);
  const predecessorReceiptDigests = context.priorReceipts.length === 0
    ? []
    : [context.priorReceipts.at(-1)!.receiptDigest];
  const factsCore = Object.freeze({
    receiptVersion: AGENT_IMPROVEMENT_RECEIPT_VERSION,
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
  facts: AgentImprovementTransitionReceiptFacts,
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
  facts: AgentImprovementTransitionReceiptFacts,
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
  substrate: AgentImprovementTransitionReceiptSubstrate,
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
  facts: AgentImprovementTransitionReceiptFacts,
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
  input: AgentImprovementTransitionReceiptInput,
  context: PreparedReceiptContext,
): Promise<AgentImprovementTransitionReceipt> {
  const facts = buildReceiptFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findEvent(context.ledgerEvents, input.resultEventId);
  const sharedReceipt = await issueSharedReceipt(facts, receiptDigest, event, context);
  return parseAgentImprovementTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

export async function issueAgentImprovementTransitionReceipt(
  input: AgentImprovementTransitionReceiptInput,
  context: AgentImprovementTransitionReceiptContext,
): Promise<AgentImprovementTransitionReceipt> {
  const artifacts = await verifiedArtifactSet(
    context.artifactStore,
    context.artifactBindings,
    context.evaluationEpochId,
  );
  return issueReceiptPrepared(input, { ...context, artifacts });
}

function assertProjectionMatchesLedger(
  projectionEvents: readonly AgentImprovementLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verified = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verified))) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
      'projection:ledger-events',
      'Projection events differ from the ordered authorized-ledger replay range',
      digest(verified),
      digest(projectionEvents),
    );
  }
}

function projectionFacts(projection: AgentImprovementProjectionState) {
  const run = projection.common.run;
  const variant = projection.agentImprovement;
  const mutation = variant.iterationConvergence.mutations.at(-1);
  const agentIr = variant.artifactIndex.agentIrVersions.at(-1);
  const change = variant.artifactIndex.changeContracts.at(-1);
  const classification = variant.iterationConvergence.classifications.at(-1);
  if (
    run.runId === null
    || run.lineageId === null
    || mutation === undefined
    || agentIr === undefined
    || change === undefined
    || classification === undefined
  ) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.INCOMPLETE_RUN,
      'projection:terminal-evidence',
      'Run lacks reducer-derived lineage, proposal, score, or classification evidence',
    );
  }
  return Object.freeze({
    runId: run.runId,
    lineageId: run.lineageId,
    generation: run.generation,
    candidateId: classification.candidateId,
    parentCandidateId: mutation.parentCandidateId,
    agentIrDigest: agentIr.agentIrDigest,
    changeContractDigest: change.changeContractDigest,
    mutationProposalDigest: mutation.mutationProposalDigest,
  });
}

function assertTransitionOrder(receipts: readonly AgentImprovementTransitionReceipt[]): void {
  if (receipts.length !== AGENT_IMPROVEMENT_REQUIRED_TRANSITION_ORDER.length) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE,
      'receipt:count',
      'Complete Agent Improvement evidence requires three mode-specific receipts',
    );
  }
  receipts.forEach((receipt, index) => {
    if (receipt.facts.transitionKind !== AGENT_IMPROVEMENT_REQUIRED_TRANSITION_ORDER[index]) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:order`,
        'Mode-specific receipts are out of lifecycle order',
      );
    }
    const expectedPredecessors = index === 0 ? [] : [receipts[index - 1]!.receiptDigest];
    if (canonicalJson(asJson(receipt.facts.predecessorReceiptDigests))
      !== canonicalJson(asJson(expectedPredecessors))) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:predecessor`,
        'Receipt predecessor chain is broken',
      );
    }
  });
}

function orderedDependencyClosure(
  receipts: readonly AgentImprovementTransitionReceipt[],
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
  code: AgentImprovementCertificateError['code'],
  location: string,
  reason: string,
): void {
  if (canonicalJson(asJson(expected)) !== canonicalJson(asJson(actual))) {
    throw new AgentImprovementCertificateError(
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
  input: AgentImprovementCertificateIssuerInput<JsonObject>['commonVerification'],
): Promise<void> {
  const supplied = parseDeepImprovementCommonCertificateBundle(input.bundle);
  equalCanonical(
    expectedBundle,
    supplied,
    AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
    'common:bundle',
    'Common verification input differs from the embedded common bundle',
  );
  const result = await verifyDeepImprovementCommonCertificateOffline(input);
  if (result.verdict !== 'valid') {
    throw new AgentImprovementCertificateError(
      result.verdict === 'unverifiable'
        ? AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING
        : AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
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
  receipts: readonly AgentImprovementTransitionReceipt[],
): string {
  return digest({
    certificateVersion: AGENT_IMPROVEMENT_CERTIFICATE_VERSION,
    substrateReplayFingerprint,
    projectionIntegrityDigest,
    commonCertificateDigest: commonBundle.certificate.certificateDigest,
    commonReceiptIdentities: commonIdentities(commonBundle),
    namedDigestClosureRules: AGENT_IMPROVEMENT_NAMED_DIGEST_CLOSURE_RULES,
    artifactClaims: artifacts.claims,
    orderedDependencyClosure: orderedDependencyClosure(receipts),
    receiptIdentities: receipts.map((receipt) => receipt.facts.identity),
    receiptDigests: receipts.map((receipt) => receipt.receiptDigest),
  });
}

function unsignedCertificateReceipt(
  body: AgentImprovementRunCertificateBody,
  certificateDigest: string,
  issuer: string,
  issuedAt: string,
  authorityEpoch: number,
): Omit<BoundaryReceiptPayload, 'certification'> {
  return Object.freeze({
    receipt_id: `agent-improvement-certificate:${certificateDigest}`,
    boundary_id: `agent-improvement-certificate-boundary:${certificateDigest}`,
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
    result_event_id: `agent-improvement-certificate-event:${certificateDigest}`,
    result_event_type: 'agent-improvement.run-certificate',
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
    idempotency_key: `agent-improvement-certificate:v1:${certificateDigest}`,
  });
}

export async function issueAgentImprovementRunCertificate<TState extends JsonObject>(
  input: AgentImprovementCertificateIssuerInput<TState>,
): Promise<AgentImprovementCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
      'replay:runId',
      'Replay run identity differs from certificate identity',
    );
  }
  const commonBundle = parseDeepImprovementCommonCertificateBundle(
    input.commonVerification.bundle,
  );
  await verifyCommonBoundary(
    commonBundle,
    input.commonVerification as AgentImprovementCertificateIssuerInput<JsonObject>['commonVerification'],
  );
  const allEvents = await input.replay.ledger.readVerifiedEvents();
  const coveredEvents = allEvents.slice(
    input.replay.rangeStartSequence - 1,
    input.replay.rangeEndSequence,
  );
  if (coveredEvents.length === 0) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
  const folded = foldAgentImprovementEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      `Agent Improvement reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
    );
  }
  const facts = projectionFacts(folded.projection);
  if (
    facts.runId !== input.runId
    || facts.lineageId !== input.lineageId
    || facts.generation !== input.generation
  ) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
      'projection:identity',
      'Reducer-derived run identity differs from certificate input',
    );
  }
  if (
    commonBundle.certificate.body.runId !== input.runId
    || commonBundle.certificate.body.lineageId !== input.lineageId
    || commonBundle.certificate.body.generation !== input.generation
    || commonBundle.certificate.body.candidateId !== facts.candidateId
  ) {
    throw new AgentImprovementCertificateError(
      AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:identity',
      'Common certificate identity differs from the Agent Improvement projection',
    );
  }
  const replay = await deriveReplayFingerprint(input.replay);
  const artifacts = await verifiedArtifactSet(
    input.artifactStore,
    input.artifactBindings,
    commonBundle.certificate.body.evaluatorEpochId,
  );
  const receipts: AgentImprovementTransitionReceipt[] = [];
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
      evaluationEpochId: commonBundle.certificate.body.evaluatorEpochId,
    });
    receipts.push(receipt);
  }
  assertTransitionOrder(receipts);
  const projectionIntegrityDigest = agentImprovementProjectionIntegrityDigest(
    folded.projection,
  );
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: AgentImprovementRunCertificateBody = Object.freeze({
    certificateVersion: AGENT_IMPROVEMENT_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    mode: 'agent-improvement',
    ...facts,
    evaluationEpochId: commonBundle.certificate.body.evaluatorEpochId,
    canaryEpochId: commonBundle.certificate.body.canaryEpochId,
    disposition: commonBundle.certificate.body.verdict,
    artifactClaims: artifacts.claims,
    artifactSetDigest: digest(artifacts.claims),
    namedDigestClosureRules: AGENT_IMPROVEMENT_NAMED_DIGEST_CLOSURE_RULES,
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
  const certificate = parseAgentImprovementRunCertificate({
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
  bundle: AgentImprovementCertificateBundle,
  coveredEvents: readonly VerifiedLedgerEvent[],
  allEvents: readonly VerifiedLedgerEvent[],
  artifacts: VerifiedArtifactSet,
  providers: CertificationProviderRegistry,
): Promise<void> {
  assertTransitionOrder(bundle.receipts);
  const expectedCommon = commonIdentities(bundle.commonBundle);
  const receiptInputs = bundle.receipts.map((receipt): AgentImprovementTransitionReceiptInput => ({
    transitionKind: receipt.facts.transitionKind,
    logicalOperationId: receipt.facts.logicalOperationId,
    effectIdempotencyKey: receipt.facts.effectIdempotencyKey,
    attemptNumber: receipt.facts.attemptNumber,
    resultEventId: receipt.facts.resultEventId,
    inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
    outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
    evidenceArtifactQualifiedDigests: receipt.facts.evidenceArtifactQualifiedDigests,
  }));
  const verified: AgentImprovementTransitionReceipt[] = [];
  for (const [index, receipt] of bundle.receipts.entries()) {
    equalCanonical(
      expectedCommon,
      receipt.facts.commonReceiptIdentities,
      AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      evaluationEpochId: bundle.certificate.body.evaluationEpochId,
    });
    equalCanonical(
      expectedFacts,
      receipt.facts,
      AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Receipt facts do not re-derive from authorized evidence',
    );
    const expectedDigest = digest(expectedFacts);
    if (
      expectedDigest !== receipt.receiptDigest
      || expectedDigest !== bundle.certificate.body.receiptDigests[index]
    ) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE,
        `receipt:${index}:durable-event`,
        'Transition receipt does not resolve exactly once in the authorized ledger',
      );
    }
    equalCanonical(
      durable[0]!.event.effective.envelope.payload,
      receipt.sharedReceipt,
      AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
  certificate: AgentImprovementRunCertificate,
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
    AgentImprovementCertificateFailureCodes.CERTIFICATION_INVALID,
    'certificate:certification',
    'Certificate receipt does not bind the recomputed certificate',
  );
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

function failureResult(error: unknown): AgentImprovementOfflineVerificationFailure {
  let verdict: AgentImprovementOfflineVerificationFailure['verdict'] = 'invalid';
  let code: AgentImprovementOfflineVerificationFailure['code'] =
    AgentImprovementCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';
  if (error instanceof AgentImprovementCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE
      || error.code === AgentImprovementCertificateFailureCodes.INCOMPLETE_RUN) {
      verdict = 'incomplete';
    }
    if (error.code === AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING
      && error.evidenceLocation.startsWith('common:')) {
      verdict = 'unverifiable';
    }
  } else if (error instanceof SealedArtifactError) {
    code = error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING
      ? AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING
      : AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof DeepImprovementArtifactReadError) {
    code = error.code === DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH
      ? AgentImprovementCertificateFailureCodes.EPOCH_MISMATCH
      : AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID;
    evidenceLocation = 'artifact:verified-read';
    failureReason = error.message;
  } else if (error instanceof Error) {
    code = AgentImprovementCertificateFailureCodes.CERTIFICATION_INVALID;
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

export async function verifyAgentImprovementCertificateOffline<TState extends JsonObject>(
  input: AgentImprovementOfflineVerificationInput<TState>,
): Promise<AgentImprovementOfflineVerificationResult> {
  try {
    const bundle = parseAgentImprovementCertificateBundle(input.bundle);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== bundle.certificate.body.runId) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:runId',
        'Replay run identity differs from certificate identity',
      );
    }
    await verifyCommonBoundary(
      bundle.commonBundle,
      input.commonVerification as AgentImprovementCertificateIssuerInput<JsonObject>['commonVerification'],
    );
    if (
      bundle.certificate.body.commonCertificateDigest
        !== bundle.commonBundle.certificate.certificateDigest
    ) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
        'common:certificate-digest',
        'Agent certificate changed the shared certificate identity',
      );
    }
    equalCanonical(
      commonIdentities(bundle.commonBundle),
      bundle.certificate.body.commonReceiptIdentities,
      AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
      'common:receipt-identities',
      'Agent certificate changed shared evaluator, canary, or promotion receipt identities',
    );
    const allEvents = await input.replay.ledger.readVerifiedEvents();
    const coveredEvents = allEvents.slice(
      input.replay.rangeStartSequence - 1,
      input.replay.rangeEndSequence,
    );
    if (coveredEvents.length === 0) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Offline replay range contains no authorized events',
      );
    }
    assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
    const folded = foldAgentImprovementEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        `Agent Improvement reducer requires a rebuild: ${folded.reasonCodes.join(',')}`,
      );
    }
    const facts = projectionFacts(folded.projection);
    equalCanonical(
      facts,
      {
        runId: bundle.certificate.body.runId,
        lineageId: bundle.certificate.body.lineageId,
        generation: bundle.certificate.body.generation,
        candidateId: bundle.certificate.body.candidateId,
        parentCandidateId: bundle.certificate.body.parentCandidateId,
        agentIrDigest: bundle.certificate.body.agentIrDigest,
        changeContractDigest: bundle.certificate.body.changeContractDigest,
        mutationProposalDigest: bundle.certificate.body.mutationProposalDigest,
      },
      AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
      'projection:certificate-facts',
      'Certificate mode fields do not re-derive from the reducer',
    );
    const projectionIntegrityDigest = agentImprovementProjectionIntegrityDigest(
      folded.projection,
    );
    if (projectionIntegrityDigest !== bundle.certificate.body.projectionIntegrityDigest) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute',
        projectionIntegrityDigest,
        bundle.certificate.body.projectionIntegrityDigest,
      );
    }
    const replay = await deriveReplayFingerprint(input.replay).catch((error: unknown) => {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
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
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:substrate',
        'Substrate replay fingerprint does not recompute',
        replay.descriptor.final_digest,
        bundle.certificate.body.substrateReplayFingerprint,
      );
    }
    const artifacts = await verifiedArtifactSet(
      input.artifactStore,
      bundle.certificate.body.artifactClaims.map((claim) => claim.binding),
      bundle.certificate.body.evaluationEpochId,
    );
    equalCanonical(
      artifacts.claims,
      bundle.certificate.body.artifactClaims,
      AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED,
      'artifact:claims',
      'Certificate artifact claims differ from real verified reads',
    );
    const artifactSetDigest = digest(artifacts.claims);
    if (artifactSetDigest !== bundle.certificate.body.artifactSetDigest) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED,
        'artifact:set',
        'Artifact set digest does not recompute',
        artifactSetDigest,
        bundle.certificate.body.artifactSetDigest,
      );
    }
    await verifyReceipts(bundle, coveredEvents, allEvents, artifacts, input.providers);
    equalCanonical(
      orderedDependencyClosure(bundle.receipts),
      bundle.certificate.body.orderedDependencyClosure,
      AgentImprovementCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:ordered-closure',
      'Ordered artifact dependency closure does not recompute',
    );
    const receiptDigests = bundle.receipts.map((receipt) => receipt.receiptDigest);
    if (digest(receiptDigests) !== bundle.certificate.body.receiptChainDigest) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
        'replay:composite',
        'Composite replay fingerprint does not recompute from the ordered closure',
        recomputedReplay,
        bundle.certificate.body.replayFingerprint,
      );
    }
    if (coveredEvents[0]!.frame.prev_record_hash !== bundle.certificate.body.startHeadHash
      || coveredEvents.at(-1)!.frame.record_hash !== bundle.certificate.body.finalHeadHash) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.LEDGER_INVALID,
        'ledger:heads',
        'Certificate ledger heads differ from the verified replay range',
      );
    }
    const certificateDigest = digest(bundle.certificate.body);
    if (certificateDigest !== bundle.certificate.certificateDigest) {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate digest does not recompute',
        certificateDigest,
        bundle.certificate.certificateDigest,
      );
    }
    await verifyCertificateCertification(bundle.certificate, input.providers);
    if (bundle.certificate.body.disposition !== 'PASS') {
      throw new AgentImprovementCertificateError(
        AgentImprovementCertificateFailureCodes.INCOMPLETE_RUN,
        'certificate:disposition',
        'Coherent evidence does not establish a passing terminal disposition',
      );
    }
    const verifierCore = Object.freeze({
      receiptVersion: 1 as const,
      certificateDigest,
      verifierVersion: 'agent-improvement-offline-verifier@1',
      rulesetDigest: digest({
        transitions: AGENT_IMPROVEMENT_REQUIRED_TRANSITION_ORDER,
        artifactRoles: AGENT_IMPROVEMENT_ARTIFACT_ROLE_EXPECTATIONS,
        namedDigestClosureRules: AGENT_IMPROVEMENT_NAMED_DIGEST_CLOSURE_RULES,
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
