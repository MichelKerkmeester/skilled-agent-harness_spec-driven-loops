// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Reducer
// ───────────────────────────────────────────────────────────────────

import {
  AgentImprovementEventStems,
  AgentImprovementExtensionEventStems,
  AgentImprovementWireEventTypes,
  createAgentImprovementEventRegistry,
  isAgentImprovementEventStem,
  isAgentImprovementExtensionEventStem,
} from '../agent-improvement-ledger-schema/index.js';
import {
  isDeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE,
  foldDeepImprovementCommonEvents,
  projectDeepImprovementCommonCandidateView,
  projectDeepImprovementCommonLegacyView,
} from '../deep-improvement-common-reducers/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AgentImprovementReducerError,
  assertAgentImprovementCandidateView,
  assertAgentImprovementLegacyProjection,
  assertAgentImprovementProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './agent-improvement-projection-schema.js';

import type {
  AgentImprovementEventEnvelope,
  AgentImprovementEventStem,
  AgentImprovementExtensionEventStem,
  AgentImprovementLedgerEvent,
  AgentImprovementLedgerPayload,
} from '../agent-improvement-ledger-schema/index.js';
import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  AgentImprovementArtifactIndexProjection,
  AgentImprovementArtifactKind,
  AgentImprovementArtifactRecord,
  AgentImprovementCandidateView,
  AgentImprovementCoverageState,
  AgentImprovementFoldBranch,
  AgentImprovementFoldOptions,
  AgentImprovementFoldResult,
  AgentImprovementInterventionRecord,
  AgentImprovementLegacyProjection,
  AgentImprovementModeStatusExtension,
  AgentImprovementPersistedField,
  AgentImprovementProjectedResult,
  AgentImprovementProjectionCheckpoint,
  AgentImprovementProjectionFieldOwnership,
  AgentImprovementProjectionHealth,
  AgentImprovementProjectionState,
  AgentImprovementRebuildReasonCode,
  AgentImprovementSeenEvent,
  AgentImprovementStreamFrontier,
  AgentImprovementVariantProjection,
} from './agent-improvement-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION =
  'agent-improvement-projection@1' as const;
export const AGENT_IMPROVEMENT_REDUCER_VERSION =
  'agent-improvement-reducer@1' as const;
export const AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION =
  'canonical-json@1' as const;
export const AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION =
  'per-stream-contiguous-causal-order@1' as const;
export const AGENT_IMPROVEMENT_REDUCER_ID =
  'agent-improvement:projection-fold' as const;

const eventRegistry = createAgentImprovementEventRegistry();
type AgentImprovementModeContractState =
  AgentImprovementProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'common',
  'agentImprovement',
  'streamFrontiers',
  'seenEvents',
] as const satisfies readonly AgentImprovementPersistedField[]);

type ProjectionPlane =
  | 'common'
  | 'agentImprovement'
  | 'replay';

const extensionRouting = Object.freeze({
  'agent_improvement.definition_snapshot_sealed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.agent_ir_compiled': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.change_contract_compiled': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.mutation_proposed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.mutation_rejected': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.trace_sliced': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.behavior_experiment_sealed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.known_defect_injected': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.counterfactual_replayed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.ablation_completed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.behavior_coverage_recorded': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.evaluation_manifest_sealed': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.fixture_exposure_recorded': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.transfer_trial_recorded': Object.freeze([
    'agentImprovement', 'replay',
  ]),
  'agent_improvement.behavioral_change_classified': Object.freeze([
    'agentImprovement', 'replay',
  ]),
} as const satisfies Readonly<
  Record<AgentImprovementExtensionEventStem, readonly ProjectionPlane[]>
>);

export const AGENT_IMPROVEMENT_EVENT_ROUTING = Object.freeze(
  Object.fromEntries(AgentImprovementEventStems.map((stem) => [
    stem,
    isDeepImprovementCommonEventStem(stem)
      ? Object.freeze(['common', 'replay'] as const)
      : extensionRouting[stem as AgentImprovementExtensionEventStem],
  ])) as Readonly<
    Record<AgentImprovementEventStem, readonly ProjectionPlane[]>
  >,
);

export const AGENT_IMPROVEMENT_PROJECTION_FIELD_OWNERSHIP = Object.freeze([
  ...(['schemaVersion', 'reducerVersion', 'codecVersion',
    'orderingPolicyVersion'] as const).map((field) => ({
    field,
    ownerReducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    inputStems: Object.freeze([]),
    foldAlgebra: 'constant' as const,
    immutableOutput: true as const,
  })),
  {
    field: 'common',
    ownerReducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    inputStems: DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.eventStems,
    foldAlgebra: 'delegate-common',
    immutableOutput: true,
  },
  {
    field: 'agentImprovement',
    ownerReducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    inputStems: AgentImprovementExtensionEventStems,
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'streamFrontiers',
    ownerReducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    inputStems: AgentImprovementEventStems,
    foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'seenEvents',
    ownerReducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    inputStems: AgentImprovementEventStems,
    foldAlgebra: 'insert-sorted',
    immutableOutput: true,
  },
] as const satisfies readonly AgentImprovementProjectionFieldOwnership[]);

export const AGENT_IMPROVEMENT_REDUCER_SET:
ModeReducerSet<AgentImprovementModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([Object.freeze({
    reducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    stateVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    ownedFields: PERSISTED_FIELDS,
    inputEventTypes: Object.freeze(
      AgentImprovementEventStems.map(
        (stem) => AgentImprovementWireEventTypes[stem],
      ),
    ),
    replaySource: 'verified-ledger-events-only',
    outputRule: 'immutable',
  })]),
});

export const AGENT_IMPROVEMENT_FOLD_BRANCH:
AgentImprovementFoldBranch = Object.freeze({
  projectionKey: 'agentImprovement',
  eventStems: AgentImprovementExtensionEventStems,
});

// ───────────────────────────────────────────────────────────────────
// 2. GENERAL HELPERS
// ───────────────────────────────────────────────────────────────────

function compareString(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareNumber(left: number, right: number): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortStrings(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareString);
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function payloadFor<TStem extends AgentImprovementEventStem>(
  event: AgentImprovementLedgerEvent,
  stem: TStem,
): AgentImprovementLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new AgentImprovementReducerError(
      'event-not-agent-improvement',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as AgentImprovementLedgerPayload<TStem>;
}

function eventDigest(event: AgentImprovementLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function validateTypedEvent(
  event: AgentImprovementLedgerEvent,
): AgentImprovementLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isAgentImprovementEventStem(payload.stem)
      || effective.event_type
        !== AgentImprovementWireEventTypes[payload.stem]) {
      throw new AgentImprovementReducerError(
        'event-not-agent-improvement',
        'Event does not carry a registered Agent Improvement stem',
        'event_type',
      );
    }
    return effective as AgentImprovementLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof AgentImprovementReducerError) throw error;
    throw new AgentImprovementReducerError(
      'event-schema-invalid',
      'Event failed the landed Agent Improvement typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(
  verified: VerifiedLedgerEvent,
): AgentImprovementLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isAgentImprovementEventStem(payload.stem)
    || envelope.event_type !== AgentImprovementWireEventTypes[payload.stem]) {
    throw new AgentImprovementReducerError(
      'event-not-agent-improvement',
      'Mode reducer received a verified event outside the Agent Improvement union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as AgentImprovementLedgerEvent);
}

function verifiedBoundaryForFold(
  event: AgentImprovementLedgerEvent,
): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), eventRegistry);
  // The public fold accepts typed events, while the common branch accepts the
  // same bytes through its verified-event reducer. The frame is not consulted
  // by either reducer, so this guarded adapter preserves the fold's trust level.
  return { event: read } as unknown as VerifiedLedgerEvent;
}

function asModeContractState(
  state: AgentImprovementProjectionState,
): AgentImprovementModeContractState {
  assertAgentImprovementProjectionState(state);
  return state as AgentImprovementModeContractState;
}

function topLevelChangedFields(
  before: AgentImprovementProjectionState,
  after: AgentImprovementProjectionState,
): AgentImprovementPersistedField[] {
  return PERSISTED_FIELDS.filter(
    (field) => !sameCanonical(before[field], after[field]),
  );
}

function replaceByKey<T>(
  values: readonly T[],
  next: T,
  key: (entry: T) => string,
  field: string,
): T[] {
  const identity = key(next);
  const existing = values.find((entry) => key(entry) === identity);
  if (existing !== undefined && !sameCanonical(existing, next)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      `Projection identity ${identity} resolved to conflicting records`,
      field,
    );
  }
  const result = existing === undefined ? [...values, next] : [...values];
  result.sort((left, right) => compareString(key(left), key(right)));
  return result;
}

function replaceMutation(
  values: ReadonlyArray<AgentImprovementVariantProjection[
    'iterationConvergence'
  ]['mutations'][number]>,
  next: AgentImprovementVariantProjection[
    'iterationConvergence'
  ]['mutations'][number],
): AgentImprovementVariantProjection[
  'iterationConvergence'
]['mutations'] {
  const result = values.filter(
    (entry) => entry.mutationId !== next.mutationId,
  );
  result.push(next);
  result.sort((left, right) => compareString(
    left.mutationId,
    right.mutationId,
  ));
  return result;
}

function insertMutationProposal(
  values: ReadonlyArray<AgentImprovementVariantProjection[
    'iterationConvergence'
  ]['mutations'][number]>,
  next: AgentImprovementVariantProjection[
    'iterationConvergence'
  ]['mutations'][number],
): AgentImprovementVariantProjection[
  'iterationConvergence'
]['mutations'] {
  const existing = values.find(
    (entry) => entry.mutationId === next.mutationId,
  );
  if (existing !== undefined) {
    if (!sameCanonical(existing, next)) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'A mutation identity accepts exactly one immutable proposal',
        'agentImprovement.iterationConvergence.mutations',
      );
    }
    return [...values];
  }
  return replaceMutation(values, next);
}

function scopeCandidateId(
  event: AgentImprovementLedgerEvent,
): string | null {
  return 'candidateId' in event.payload.scope
    ? String(event.payload.scope.candidateId)
    : null;
}

function addVeto(
  variant: AgentImprovementVariantProjection,
  code: string,
): AgentImprovementVariantProjection {
  return {
    ...variant,
    iterationConvergence: {
      ...variant.iterationConvergence,
      blockingVetoCodes: sortStrings([
        ...variant.iterationConvergence.blockingVetoCodes,
        code,
      ]),
      disposition: 'blocked',
    },
  };
}

function addUnresolved(
  variant: AgentImprovementVariantProjection,
  reference: string,
): AgentImprovementVariantProjection {
  return {
    ...variant,
    iterationConvergence: {
      ...variant.iterationConvergence,
      unresolvedEvidenceRefs: sortStrings([
        ...variant.iterationConvergence.unresolvedEvidenceRefs,
        reference,
      ]),
      disposition: variant.iterationConvergence.disposition === 'blocked'
        ? 'blocked'
        : 'inconclusive',
    },
  };
}

function artifactIdentity(
  kind: AgentImprovementArtifactKind,
  logicalArtifactId: string,
  digest: string,
  producerEventId: string,
): string {
  return `artifact:${sha256Bytes(canonicalBytes({
    kind,
    logicalArtifactId,
    digest,
    producerEventId,
  }))}`;
}

function refreshArtifactLineage(
  artifacts: readonly AgentImprovementArtifactRecord[],
): AgentImprovementArtifactRecord[] {
  const refreshed = artifacts.map((entry) => {
    const siblings = artifacts
      .filter((candidate) => (
        candidate.logicalArtifactId === entry.logicalArtifactId
      ))
      .sort((left, right) => compareString(
        left.producerEventId,
        right.producerEventId,
      ));
    const index = siblings.findIndex(
      (candidate) => candidate.artifactId === entry.artifactId,
    );
    const earlier = siblings.slice(0, index).map(
      (candidate) => candidate.artifactId,
    );
    const later = siblings.slice(index + 1).map(
      (candidate) => candidate.artifactId,
    );
    return {
      ...entry,
      availability: later.length > 0
        ? 'superseded' as const
        : entry.availability,
      supersedesArtifactIds: sortStrings(earlier),
      supersededByArtifactIds: sortStrings(later),
    };
  });
  refreshed.sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return refreshed;
}

function insertArtifact(
  index: AgentImprovementArtifactIndexProjection,
  input: Omit<
    AgentImprovementArtifactRecord,
    'artifactId' | 'supersededByArtifactIds' | 'supersedesArtifactIds'
  >,
): AgentImprovementArtifactIndexProjection {
  const artifact: AgentImprovementArtifactRecord = {
    ...input,
    artifactId: artifactIdentity(
      input.artifactKind,
      input.logicalArtifactId,
      input.digest,
      input.producerEventId,
    ),
    supersedesArtifactIds: [],
    supersededByArtifactIds: [],
  };
  const existing = index.artifacts.find(
    (entry) => entry.artifactId === artifact.artifactId,
  );
  if (existing !== undefined && !sameCanonical(existing, artifact)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Artifact identity resolved to conflicting provenance',
      'agentImprovement.artifactIndex.artifacts',
    );
  }
  return {
    ...index,
    artifacts: refreshArtifactLineage(
      existing === undefined
        ? [...index.artifacts, artifact]
        : [...index.artifacts],
    ),
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

function initialCommonProjection(): DeepImprovementCommonProjectionState {
  const folded = foldDeepImprovementCommonEvents([]);
  if (folded.outcome !== 'projected') {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'The imported common fold refused its own empty projection',
      'common',
    );
  }
  return folded.projection;
}

/** Create the frozen composite with the common state nested unchanged. */
export function createAgentImprovementProjectionState():
AgentImprovementProjectionState {
  const state: AgentImprovementProjectionState = {
    schemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    codecVersion: AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION,
    common: initialCommonProjection(),
    agentImprovement: {
      iterationConvergence: {
        activeAgentIrId: null,
        activeMutationId: null,
        mutations: [],
        traceSlices: [],
        experiments: [],
        interventions: [],
        coverage: [],
        classifications: [],
        unresolvedEvidenceRefs: [],
        blockingVetoCodes: [],
        disposition: 'unassessed',
      },
      artifactIndex: {
        definitionSnapshots: [],
        agentIrVersions: [],
        changeContracts: [],
        manifests: [],
        exposures: [],
        transferTrials: [],
        artifacts: [],
      },
      modeStatus: {
        commonStatusWorkstream: 'agent-improvement',
        activeAgentIrId: null,
        activeMutationId: null,
        activeMutationOperatorRef: null,
        latestClassifiedCandidateId: null,
        profileChampions: [],
        coverageState: 'unassessed',
        evaluatorIntegrityState: 'unassessed',
        projectionHealth: 'unassessed',
        failureClasses: [],
        blockingVetoCodes: [],
      },
    },
    streamFrontiers: [],
    seenEvents: [],
  };
  assertAgentImprovementProjectionState(state);
  return immutableProjectionClone(state) as AgentImprovementProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. AGENT-IMPROVEMENT-NAMESPACED FOLDS
// ───────────────────────────────────────────────────────────────────

function foldDefinitionSnapshot(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.definition_snapshot_sealed'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const definitionSnapshots = replaceByKey(
    variant.artifactIndex.definitionSnapshots,
    {
      agentDefinitionId: scope.agentDefinitionId,
      ...data,
      producerEventId: event.event_id,
    },
    (entry) => `${entry.agentDefinitionId}:${entry.producerEventId}`,
    'agentImprovement.artifactIndex.definitionSnapshots',
  );
  const artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    definitionSnapshots,
  }, {
    logicalArtifactId: `agent-definition:${scope.agentDefinitionId}`,
    artifactKind: 'agent-definition',
    reference: data.definitionRef,
    digest: data.definitionDigest,
    producerEventId: event.event_id,
    candidateId: null,
    availability: 'available',
    receiptRefs: [data.sealingReceiptRef],
  });
  return { ...variant, artifactIndex };
}

function foldAgentIr(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.agent_ir_compiled'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const agentIrVersions = replaceByKey(
    variant.artifactIndex.agentIrVersions,
    {
      agentDefinitionId: scope.agentDefinitionId,
      agentIrId: scope.agentIrId,
      ...data,
      producerEventId: event.event_id,
    },
    (entry) => entry.agentIrId,
    'agentImprovement.artifactIndex.agentIrVersions',
  );
  const artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    agentIrVersions,
  }, {
    logicalArtifactId: `agent-ir:${scope.agentIrId}`,
    artifactKind: 'agent-ir',
    reference: data.agentIrRef,
    digest: data.agentIrDigest,
    producerEventId: event.event_id,
    candidateId: null,
    availability: 'available',
    receiptRefs: [data.compilationReceiptRef],
  });
  return {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      activeAgentIrId: scope.agentIrId,
    },
  };
}

function foldChangeContract(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.change_contract_compiled'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const changeContracts = replaceByKey(
    variant.artifactIndex.changeContracts,
    {
      candidateId: scope.candidateId,
      agentChangeId: scope.agentChangeId,
      ...data,
      producerEventId: event.event_id,
    },
    (entry) => entry.agentChangeId,
    'agentImprovement.artifactIndex.changeContracts',
  );
  let artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    changeContracts,
  }, {
    logicalArtifactId: `change-contract:${scope.agentChangeId}`,
    artifactKind: 'change-contract',
    reference: data.changeContractRef,
    digest: data.changeContractDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: 'available',
    receiptRefs: [data.compilationReceiptRef],
  });
  artifactIndex = insertArtifact(artifactIndex, {
    logicalArtifactId: `patch:${scope.agentChangeId}`,
    artifactKind: 'patch',
    reference: data.patchRef,
    digest: data.patchDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: 'available',
    receiptRefs: [data.compilationReceiptRef],
  });
  return { ...variant, artifactIndex };
}

function foldMutationProposed(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.mutation_proposed'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const mutation = {
    candidateId: scope.candidateId,
    agentChangeId: scope.agentChangeId,
    mutationId: scope.mutationId,
    lifecycle: 'proposed' as const,
    changeContractEventId: data.changeContractEventId,
    changeContractPayloadDigest: data.changeContractPayloadDigest,
    mutationOperatorRef: data.mutationOperatorRef,
    mutationOperatorVersion: data.mutationOperatorVersion,
    mutationProposalRef: data.mutationProposalRef,
    mutationProposalDigest: data.mutationProposalDigest,
    targetLocusIds: sortStrings(data.targetLocusIds),
    parentCandidateId: data.parentCandidateId,
    diagnosticEvidenceRefs: sortStrings(data.diagnosticEvidenceRefs),
    proposalPolicyVersion: data.proposalPolicyVersion,
    proposalEventId: event.event_id,
    rejectionReasonCode: null,
    proposalPayloadDigest: null,
    invalidLocusIds: [],
    rejectionEvidenceRefs: [],
    terminalEventId: null,
  };
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId: `mutation:${scope.mutationId}`,
    artifactKind: 'mutation-proposal',
    reference: data.mutationProposalRef,
    digest: data.mutationProposalDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: 'available',
    receiptRefs: [],
  });
  return {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      activeMutationId: scope.mutationId,
      mutations: insertMutationProposal(
        variant.iterationConvergence.mutations,
        mutation,
      ),
    },
  };
}

function foldMutationRejected(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.mutation_rejected'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const mutation = variant.iterationConvergence.mutations.find(
    (entry) => entry.mutationId === scope.mutationId,
  );
  if (mutation === undefined
    || mutation.proposalEventId !== data.proposalEventId
    || mutation.lifecycle !== 'proposed') {
    throw new AgentImprovementReducerError(
      'impossible-status-transition',
      'Mutation rejection requires its captured live proposal',
      'agentImprovement.iterationConvergence.mutations',
    );
  }
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId: `mutation:${scope.mutationId}`,
    artifactKind: 'mutation-proposal',
    reference: data.rejectionEvidenceRefs[0],
    digest: data.rejectionEvidenceSetDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: 'invalid',
    receiptRefs: [],
  });
  return {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      mutations: replaceMutation(
        variant.iterationConvergence.mutations,
        {
          ...mutation,
          lifecycle: 'rejected',
          rejectionReasonCode: data.rejectionReasonCode,
          proposalPayloadDigest: data.proposalPayloadDigest,
          invalidLocusIds: sortStrings(data.invalidLocusIds),
          rejectionEvidenceRefs: sortStrings(data.rejectionEvidenceRefs),
          terminalEventId: event.event_id,
        },
      ),
    },
  };
}

function foldTraceSlice(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.trace_sliced'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const traceSlices = replaceByKey(
    variant.iterationConvergence.traceSlices,
    {
      candidateId: scope.candidateId,
      evaluationEpochId: scope.evaluationEpochId,
      behaviorFamilyId: scope.behaviorFamilyId,
      traceId: scope.traceId,
      evaluationObservationEventId: data.evaluationObservationEventId,
      evaluationObservationPayloadDigest:
        data.evaluationObservationPayloadDigest,
      traceRef: data.traceRef,
      traceDigest: data.traceDigest,
      traceSliceRef: data.traceSliceRef,
      traceSliceDigest: data.traceSliceDigest,
      failureRef: data.failureRef,
      failureDigest: data.failureDigest,
      clauseIds: sortStrings(data.clauseIds),
      componentIds: sortStrings(data.componentIds),
      attributionStatus: data.attributionStatus,
      attributionUncertainty: data.attributionUncertainty,
      producerEventId: event.event_id,
    },
    (entry) => entry.traceId,
    'agentImprovement.iterationConvergence.traceSlices',
  );
  let artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId: `trace-slice:${scope.traceId}`,
    artifactKind: 'trace-slice',
    reference: data.traceSliceRef,
    digest: data.traceSliceDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: data.attributionStatus === 'diagnostic'
      ? 'available'
      : 'invalid',
    receiptRefs: [data.slicingReceiptRef],
  });
  artifactIndex = insertArtifact(artifactIndex, {
    logicalArtifactId: `failure-gradient:${scope.traceId}`,
    artifactKind: 'failure-gradient',
    reference: data.failureRef,
    digest: data.failureDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: data.attributionStatus === 'diagnostic'
      ? 'available'
      : 'invalid',
    receiptRefs: [data.slicingReceiptRef],
  });
  let next: AgentImprovementVariantProjection = {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      traceSlices,
    },
  };
  if (data.attributionStatus === 'insufficient-evidence') {
    next = addUnresolved(next, data.failureRef);
  }
  return next;
}

function foldExperiment(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.behavior_experiment_sealed'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const experiments = replaceByKey(
    variant.iterationConvergence.experiments,
    {
      candidateId: scope.candidateId,
      experimentId: scope.experimentId,
      traceSliceEventId: data.traceSliceEventId,
      traceSlicePayloadDigest: data.traceSlicePayloadDigest,
      behaviorFamilyId: data.behaviorFamilyId,
      experimentPlanRef: data.experimentPlanRef,
      experimentPlanDigest: data.experimentPlanDigest,
      scenarioSetRef: data.scenarioSetRef,
      scenarioSetDigest: data.scenarioSetDigest,
      baselineExecutionRef: data.baselineExecutionRef,
      baselineExecutionDigest: data.baselineExecutionDigest,
      candidateExecutionRef: data.candidateExecutionRef,
      candidateExecutionDigest: data.candidateExecutionDigest,
      executorRef: data.executorRef,
      executorFingerprint: data.executorFingerprint,
      verifierRef: data.verifierRef,
      verifierFingerprint: data.verifierFingerprint,
      interventionIds: sortStrings(data.interventionIds),
      producerEventId: event.event_id,
    },
    (entry) => entry.experimentId,
    'agentImprovement.iterationConvergence.experiments',
  );
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId: `experiment:${scope.experimentId}`,
    artifactKind: 'experiment-plan',
    reference: data.experimentPlanRef,
    digest: data.experimentPlanDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: 'available',
    receiptRefs: [data.freshPairedExecutionReceiptRef],
  });
  return {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      experiments,
    },
  };
}

function foldIntervention(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    | 'agent_improvement.ablation_completed'
    | 'agent_improvement.counterfactual_replayed'
    | 'agent_improvement.known_defect_injected'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  let intervention: AgentImprovementInterventionRecord;
  if (event.payload.stem === 'agent_improvement.known_defect_injected') {
    // The stem guard is the runtime proof; the cast only restores the
    // discriminated generic that TypeScript loses across the union boundary.
    const payload = (
      event as unknown as AgentImprovementEventEnvelope<
        'agent_improvement.known_defect_injected'
      >
    ).payload;
    intervention = {
      candidateId: scope.candidateId,
      experimentId: scope.experimentId,
      interventionId: scope.interventionId,
      interventionKind: 'known-defect',
      sourceEventId: payload.data.experimentEventId,
      sourcePayloadDigest: payload.data.experimentPayloadDigest,
      rawObservationRef: payload.data.rawObservationRef,
      rawObservationDigest: payload.data.rawObservationDigest,
      outcome: payload.data.outcome,
      uncertainty: payload.data.uncertainty,
      receiptRef: payload.data.injectionReceiptRef,
      producerEventId: event.event_id,
    };
  } else if (
    event.payload.stem === 'agent_improvement.counterfactual_replayed'
  ) {
    const payload = (
      event as unknown as AgentImprovementEventEnvelope<
        'agent_improvement.counterfactual_replayed'
      >
    ).payload;
    intervention = {
      candidateId: scope.candidateId,
      experimentId: scope.experimentId,
      interventionId: scope.interventionId,
      interventionKind: 'counterfactual',
      sourceEventId: payload.data.experimentEventId,
      sourcePayloadDigest: payload.data.experimentPayloadDigest,
      rawObservationRef: payload.data.rawObservationRef,
      rawObservationDigest: payload.data.rawObservationDigest,
      outcome: payload.data.outcome,
      uncertainty: payload.data.uncertainty,
      receiptRef: payload.data.executionReceiptRef,
      producerEventId: event.event_id,
    };
  } else {
    const payload = (
      event as unknown as AgentImprovementEventEnvelope<
        'agent_improvement.ablation_completed'
      >
    ).payload;
    intervention = {
      candidateId: scope.candidateId,
      experimentId: scope.experimentId,
      interventionId: scope.interventionId,
      interventionKind: 'ablation',
      sourceEventId: payload.data.experimentEventId,
      sourcePayloadDigest: payload.data.experimentPayloadDigest,
      rawObservationRef: payload.data.rawObservationRef,
      rawObservationDigest: payload.data.rawObservationDigest,
      outcome: payload.data.outcome,
      uncertainty: payload.data.uncertainty,
      receiptRef: payload.data.executionReceiptRef,
      producerEventId: event.event_id,
    };
  }
  const interventions = replaceByKey(
    variant.iterationConvergence.interventions,
    intervention,
    (entry) => `${entry.interventionId}:${entry.interventionKind}`,
    'agentImprovement.iterationConvergence.interventions',
  );
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId:
      `raw-trial:${scope.experimentId}:${scope.interventionId}`,
    artifactKind: 'raw-trial',
    reference: intervention.rawObservationRef,
    digest: intervention.rawObservationDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: intervention.outcome === 'missed'
      || intervention.outcome === 'inconclusive'
      ? 'invalid'
      : 'available',
    receiptRefs: [intervention.receiptRef],
  });
  let next: AgentImprovementVariantProjection = {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      interventions,
    },
  };
  if (intervention.outcome === 'missed') {
    next = addVeto(next, 'agent-known-defect-missed');
  } else if (intervention.outcome === 'inconclusive') {
    next = addUnresolved(next, intervention.rawObservationRef);
  }
  return next;
}

function foldCoverage(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.behavior_coverage_recorded'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const coverage = replaceByKey(
    variant.iterationConvergence.coverage,
    {
      candidateId: scope.candidateId,
      evaluationEpochId: scope.evaluationEpochId,
      behaviorFamilyId: scope.behaviorFamilyId,
      experimentEventIds: sortStrings(data.experimentEventIds),
      clauseIds: sortStrings(data.clauseIds),
      authorityConflictCaseIds:
        sortStrings(data.authorityConflictCaseIds),
      negativeCapabilityCaseIds:
        sortStrings(data.negativeCapabilityCaseIds),
      sideEffectOracleIds: sortStrings(data.sideEffectOracleIds),
      semanticVariantIds: sortStrings(data.semanticVariantIds),
      rawCoverageRef: data.rawCoverageRef,
      rawCoverageDigest: data.rawCoverageDigest,
      evidenceSetDigest: data.evidenceSetDigest,
      coverageOutcome: data.coverageOutcome,
      criticalInvariantOutcome: data.criticalInvariantOutcome,
      coveragePolicyVersion: data.coveragePolicyVersion,
      producerEventId: event.event_id,
    },
    (entry) => (
      `${entry.candidateId}:${entry.evaluationEpochId}:`
      + entry.behaviorFamilyId
    ),
    'agentImprovement.iterationConvergence.coverage',
  );
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId:
      `behavior-coverage:${scope.candidateId}:${scope.behaviorFamilyId}`,
    artifactKind: 'behavior-coverage',
    reference: data.rawCoverageRef,
    digest: data.rawCoverageDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: data.criticalInvariantOutcome === 'fail'
      ? 'invalid'
      : 'available',
    receiptRefs: [],
  });
  let next: AgentImprovementVariantProjection = {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      coverage,
      disposition: data.coverageOutcome === 'covered'
        && data.criticalInvariantOutcome === 'pass'
        ? 'healthy'
        : variant.iterationConvergence.disposition,
    },
  };
  if (data.criticalInvariantOutcome === 'fail') {
    next = addVeto(next, 'agent-critical-invariant-failed');
  } else if (data.coverageOutcome !== 'covered') {
    next = addUnresolved(next, data.rawCoverageRef);
  }
  return next;
}

function foldManifest(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.evaluation_manifest_sealed'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const manifests = replaceByKey(
    variant.artifactIndex.manifests,
    {
      evaluationEpochId: scope.evaluationEpochId,
      manifestId: scope.manifestId,
      exposureEpochId: scope.exposureEpochId,
      ...data,
      producerEventId: event.event_id,
    },
    (entry) => entry.manifestId,
    'agentImprovement.artifactIndex.manifests',
  );
  const artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    manifests,
  }, {
    logicalArtifactId: `evaluation-manifest:${scope.manifestId}`,
    artifactKind: 'evaluation-manifest',
    reference: data.manifestRef,
    digest: data.manifestDigest,
    producerEventId: event.event_id,
    candidateId: null,
    availability: 'available',
    receiptRefs: [data.sealingReceiptRef],
  });
  return { ...variant, artifactIndex };
}

function foldExposure(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.fixture_exposure_recorded'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const exposures = replaceByKey(
    variant.artifactIndex.exposures,
    {
      evaluationEpochId: scope.evaluationEpochId,
      manifestId: scope.manifestId,
      exposureEpochId: scope.exposureEpochId,
      ...data,
      exposedRingCodes: sortStrings(data.exposedRingCodes),
      producerEventId: event.event_id,
    },
    (entry) => `${entry.exposureEpochId}:${entry.producerEventId}`,
    'agentImprovement.artifactIndex.exposures',
  );
  const exposesProtectedRing = data.exposureKind === 'activated'
    && data.exposedRingCodes.some(
      (ring) => ring === 'canary' || ring === 'heldout',
    );
  const artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    exposures,
  }, {
    logicalArtifactId: `fixture-exposure:${scope.exposureEpochId}`,
    artifactKind: 'fixture-exposure',
    reference: data.authorizedExposureRef,
    digest: data.authorizedExposureDigest,
    producerEventId: event.event_id,
    candidateId: null,
    availability: exposesProtectedRing ? 'invalid' : 'available',
    receiptRefs: [data.exposureReceiptRef],
  });
  const next = { ...variant, artifactIndex };
  return exposesProtectedRing
    ? addVeto(next, 'agent-protected-fixture-exposed')
    : next;
}

function foldTransferTrial(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.transfer_trial_recorded'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const transferTrials = replaceByKey(
    variant.artifactIndex.transferTrials,
    {
      candidateId: scope.candidateId,
      evaluationEpochId: scope.evaluationEpochId,
      trialId: scope.trialId,
      ...data,
      behaviorFamilyIds: sortStrings(data.behaviorFamilyIds),
      producerEventId: event.event_id,
    },
    (entry) => entry.trialId,
    'agentImprovement.artifactIndex.transferTrials',
  );
  const artifactIndex = insertArtifact({
    ...variant.artifactIndex,
    transferTrials,
  }, {
    logicalArtifactId: `transfer-trial:${scope.trialId}`,
    artifactKind: 'raw-trial',
    reference: data.rawObservationRef,
    digest: data.rawObservationDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: data.transferOutcome === 'pass'
      ? 'available'
      : 'invalid',
    receiptRefs: [data.executionReceiptRef],
  });
  let next = { ...variant, artifactIndex };
  if (data.transferOutcome === 'fail') {
    next = addVeto(next, 'agent-transfer-regression');
  } else if (data.transferOutcome === 'inconclusive') {
    next = addUnresolved(next, data.rawObservationRef);
  }
  return next;
}

function foldClassification(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementEventEnvelope<
    'agent_improvement.behavioral_change_classified'
  >,
): AgentImprovementVariantProjection {
  const { data, scope } = event.payload;
  const classifications = replaceByKey(
    variant.iterationConvergence.classifications,
    {
      candidateId: scope.candidateId,
      agentChangeId: scope.agentChangeId,
      ...data,
      affectedBehaviorFamilyIds:
        sortStrings(data.affectedBehaviorFamilyIds),
      regressedBehaviorFamilyIds:
        sortStrings(data.regressedBehaviorFamilyIds),
      preservedObligationIds: sortStrings(data.preservedObligationIds),
      producerEventId: event.event_id,
    },
    (entry) => `${entry.agentChangeId}:${entry.producerEventId}`,
    'agentImprovement.iterationConvergence.classifications',
  );
  const artifactIndex = insertArtifact(variant.artifactIndex, {
    logicalArtifactId: `behavior-classification:${scope.agentChangeId}`,
    artifactKind: 'behavior-classification',
    reference: data.classificationEvidenceRef,
    digest: data.classificationEvidenceDigest,
    producerEventId: event.event_id,
    candidateId: scope.candidateId,
    availability: data.regressedBehaviorFamilyIds.length === 0
      ? 'available'
      : 'invalid',
    receiptRefs: [data.classificationReceiptRef],
  });
  let next: AgentImprovementVariantProjection = {
    ...variant,
    artifactIndex,
    iterationConvergence: {
      ...variant.iterationConvergence,
      classifications,
    },
  };
  for (const familyId of data.regressedBehaviorFamilyIds) {
    next = addVeto(next, `behavior-regression:${familyId}`);
  }
  return next;
}

function foldExtension(
  variant: AgentImprovementVariantProjection,
  event: AgentImprovementLedgerEvent,
): AgentImprovementVariantProjection {
  switch (event.payload.stem) {
    case 'agent_improvement.definition_snapshot_sealed':
      return foldDefinitionSnapshot(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.definition_snapshot_sealed'
        >,
      );
    case 'agent_improvement.agent_ir_compiled':
      return foldAgentIr(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.agent_ir_compiled'
        >,
      );
    case 'agent_improvement.change_contract_compiled':
      return foldChangeContract(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.change_contract_compiled'
        >,
      );
    case 'agent_improvement.mutation_proposed':
      return foldMutationProposed(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.mutation_proposed'
        >,
      );
    case 'agent_improvement.mutation_rejected':
      return foldMutationRejected(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.mutation_rejected'
        >,
      );
    case 'agent_improvement.trace_sliced':
      return foldTraceSlice(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.trace_sliced'
        >,
      );
    case 'agent_improvement.behavior_experiment_sealed':
      return foldExperiment(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.behavior_experiment_sealed'
        >,
      );
    case 'agent_improvement.known_defect_injected':
    case 'agent_improvement.counterfactual_replayed':
    case 'agent_improvement.ablation_completed':
      return foldIntervention(
        variant,
        event as AgentImprovementEventEnvelope<
          | 'agent_improvement.ablation_completed'
          | 'agent_improvement.counterfactual_replayed'
          | 'agent_improvement.known_defect_injected'
        >,
      );
    case 'agent_improvement.behavior_coverage_recorded':
      return foldCoverage(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.behavior_coverage_recorded'
        >,
      );
    case 'agent_improvement.evaluation_manifest_sealed':
      return foldManifest(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.evaluation_manifest_sealed'
        >,
      );
    case 'agent_improvement.fixture_exposure_recorded':
      return foldExposure(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.fixture_exposure_recorded'
        >,
      );
    case 'agent_improvement.transfer_trial_recorded':
      return foldTransferTrial(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.transfer_trial_recorded'
        >,
      );
    case 'agent_improvement.behavioral_change_classified':
      return foldClassification(
        variant,
        event as AgentImprovementEventEnvelope<
          'agent_improvement.behavioral_change_classified'
        >,
      );
    default:
      if (isDeepImprovementCommonEventStem(event.payload.stem)) return variant;
      throw new AgentImprovementReducerError(
        'event-not-agent-improvement',
        `Unhandled extension stem: ${String(event.payload.stem)}`,
        'payload.stem',
      );
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. STATUS, REPLAY, AND COMMON DELEGATION
// ───────────────────────────────────────────────────────────────────

function coverageState(
  variant: AgentImprovementVariantProjection,
): AgentImprovementCoverageState {
  const coverage = variant.iterationConvergence.coverage;
  if (coverage.some((entry) => entry.criticalInvariantOutcome === 'fail')) {
    return 'blocked';
  }
  if (coverage.length === 0) return 'unassessed';
  return coverage.every((entry) => (
    entry.coverageOutcome === 'covered'
    && entry.criticalInvariantOutcome === 'pass'
  )) ? 'covered' : 'partial';
}

function refreshModeStatus(
  common: DeepImprovementCommonProjectionState,
  variant: AgentImprovementVariantProjection,
): AgentImprovementModeStatusExtension {
  const commonStatus = common.modeStatus.statuses.find(
    (entry) => entry.workstream === 'agent-improvement',
  );
  const commonVetoes = commonStatus?.blockingVetoCodes ?? [];
  const localVetoes = variant.iterationConvergence.blockingVetoCodes;
  const blockingVetoCodes = sortStrings([...commonVetoes, ...localVetoes]);
  const evaluatorCompromised = localVetoes.some((code) => (
    code === 'agent-known-defect-missed'
    || code === 'agent-protected-fixture-exposed'
  )) || common.iterationConvergence.hardVetoes.some((veto) => (
    veto.source === 'canary' || veto.source === 'evaluator-integrity'
  ));
  const hasIntegrityEvidence = variant.artifactIndex.manifests.length > 0
    || common.iterationConvergence.evaluatorEpochs.length > 0;
  const activeMutation = variant.iterationConvergence.mutations.find(
    (mutation) => (
      mutation.mutationId === variant.iterationConvergence.activeMutationId
    ),
  );
  const latestClassification =
    variant.iterationConvergence.classifications.at(-1);
  const profileChampions = (commonStatus?.profileIncumbents ?? []).map(
    (entry) => ({
      profileRef: entry.profileRef,
      candidateId: entry.candidateId,
    }),
  ).sort((left, right) => (
    compareString(left.profileRef, right.profileRef)
      || compareString(left.candidateId, right.candidateId)
  ));
  const projectionHealth: AgentImprovementProjectionHealth =
    blockingVetoCodes.length > 0
      ? 'blocked'
      : variant.iterationConvergence.unresolvedEvidenceRefs.length > 0
        ? 'inconclusive'
        : variant.iterationConvergence.classifications.length > 0
          || variant.iterationConvergence.coverage.length > 0
          ? 'healthy'
          : 'unassessed';
  return {
    commonStatusWorkstream: 'agent-improvement',
    activeAgentIrId: variant.iterationConvergence.activeAgentIrId,
    activeMutationId: variant.iterationConvergence.activeMutationId,
    activeMutationOperatorRef: activeMutation?.mutationOperatorRef ?? null,
    latestClassifiedCandidateId:
      latestClassification?.candidateId ?? null,
    profileChampions,
    coverageState: coverageState(variant),
    evaluatorIntegrityState: evaluatorCompromised
      ? 'compromised'
      : hasIntegrityEvidence ? 'clean' : 'unassessed',
    projectionHealth,
    failureClasses: blockingVetoCodes,
    blockingVetoCodes,
  };
}

function appendSeenEvent(
  state: AgentImprovementProjectionState,
  event: AgentImprovementLedgerEvent,
): AgentImprovementSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find(
    (entry) => entry.eventId === event.event_id,
  );
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new AgentImprovementReducerError(
        'duplicate-event-conflict',
        'A persisted event identity cannot resolve to different bytes',
        'seenEvents',
      );
    }
    return null;
  }
  const next = [...state.seenEvents, {
    eventId: event.event_id,
    eventDigest: digest,
    payloadDigest: event.payload.payloadDigest,
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
  }];
  next.sort((left, right) => (
    compareString(left.streamId, right.streamId)
      || compareNumber(left.streamSequence, right.streamSequence)
      || compareString(left.eventId, right.eventId)
  ));
  return next;
}

function advanceStreamFrontier(
  state: AgentImprovementProjectionState,
  event: AgentImprovementLedgerEvent,
): AgentImprovementStreamFrontier[] {
  const current = state.streamFrontiers.find(
    (entry) => entry.streamId === event.stream_id,
  );
  const next = state.streamFrontiers.filter(
    (entry) => entry.streamId !== event.stream_id,
  );
  next.push({
    streamId: event.stream_id,
    lastSequence: Math.max(
      current?.lastSequence ?? 0,
      event.stream_sequence,
    ),
  });
  next.sort((left, right) => compareString(left.streamId, right.streamId));
  return next;
}

function assertNextStreamSequence(
  state: AgentImprovementProjectionState,
  event: AgentImprovementLedgerEvent,
): void {
  const existing = state.seenEvents.find(
    (entry) => entry.eventId === event.event_id,
  );
  if (existing !== undefined) return;
  const prior = state.streamFrontiers.find(
    (entry) => entry.streamId === event.stream_id,
  )?.lastSequence ?? 0;
  if (event.stream_sequence <= prior) {
    throw new AgentImprovementReducerError(
      'event-order-invalid',
      'A stream sequence cannot move backward or reuse a distinct position',
      'stream_sequence',
    );
  }
  if (event.stream_sequence !== prior + 1) {
    throw new AgentImprovementReducerError(
      'cursor-gap',
      'Each stream must advance from its own last-seen sequence',
      'stream_sequence',
    );
  }
}

function applyEvent(
  state: AgentImprovementProjectionState,
  event: AgentImprovementLedgerEvent,
  verified: VerifiedLedgerEvent,
): AgentImprovementProjectionState {
  assertNextStreamSequence(state, event);
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  const runId = state.common.run.runId;
  if (runId !== null && (
    event.payload.scope.runId !== runId
    || event.payload.scope.lineageId !== state.common.run.lineageId
  )) {
    throw new AgentImprovementReducerError(
      'run-identity-conflict',
      'Composite projection cannot mix run or lineage identities',
      'common.run',
    );
  }

  let common = state.common;
  let variant = state.agentImprovement;
  if (isDeepImprovementCommonEventStem(event.payload.stem)) {
    const result = DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE.reduce(
      verified,
      common as DeepImprovementCommonProjectionState & JsonObject,
    );
    common = result.state as DeepImprovementCommonProjectionState;
  } else if (isAgentImprovementExtensionEventStem(event.payload.stem)) {
    variant = foldExtension(variant, event);
  } else {
    throw new AgentImprovementReducerError(
      'event-not-agent-improvement',
      'Event is outside both the common and Agent Improvement branches',
      'payload.stem',
    );
  }

  variant = {
    ...variant,
    modeStatus: refreshModeStatus(common, variant),
  };
  const next: AgentImprovementProjectionState = {
    ...state,
    common,
    agentImprovement: variant,
    streamFrontiers: advanceStreamFrontier(state, event),
    seenEvents,
  };
  assertAgentImprovementProjectionState(next);
  return immutableProjectionClone(next) as AgentImprovementProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 6. MODE-CONTRACT REDUCER SURFACE
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementReducerSurface = Pick<
  ModeContract<AgentImprovementModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified event through the shared mode contract. */
export function reduceAgentImprovementVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<AgentImprovementModeContractState>,
): ModeReductionResult<AgentImprovementModeContractState> {
  assertAgentImprovementProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event, verified);
  return Object.freeze({
    reducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    stateVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const AGENT_IMPROVEMENT_REDUCER_SURFACE:
AgentImprovementReducerSurface = Object.freeze({
  reducers: AGENT_IMPROVEMENT_REDUCER_SET,
  reduce: reduceAgentImprovementVerifiedEvent,
});

function assertReducerOwnership(
  reducers: ModeReducerSet<AgentImprovementModeContractState>,
): void {
  if (!sameCanonical(
    [...reducers.persistedFields].sort(compareString),
    [...PERSISTED_FIELDS].sort(compareString),
  )) {
    throw new AgentImprovementReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed composite field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      if (owners.has(field)) {
        throw new AgentImprovementReducerError(
          'duplicate-owner',
          `Projection field ${field} has more than one owner`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  for (const field of PERSISTED_FIELDS) {
    if (!owners.has(field)) {
      throw new AgentImprovementReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

/** Probe determinism, immutability, ownership, and real reducer delegation. */
export function verifyAgentImprovementReducerSurface(
  surface: AgentImprovementReducerSurface,
  event: VerifiedLedgerEvent,
  state: AgentImprovementProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  assertAgentImprovementProjectionState(state);
  const firstInput = immutableProjectionClone(
    state,
  ) as AgentImprovementProjectionState;
  const secondInput = immutableProjectionClone(
    state,
  ) as AgentImprovementProjectionState;
  const initialDigest = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertAgentImprovementProjectionState(first.state);
  assertAgentImprovementProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state)
    || !isDeepFrozenProjection(second.state)) {
    throw new AgentImprovementReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initialDigest
    || canonicalJson(secondInput) !== initialDigest) {
    throw new AgentImprovementReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new AgentImprovementReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (entry) => entry.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new AgentImprovementReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const unowned = topLevelChangedFields(state, first.state).find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new AgentImprovementReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. FULL AND CHECKPOINTED REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive a deterministic digest over the complete composite projection. */
export function agentImprovementProjectionIntegrityDigest(
  projection: AgentImprovementProjectionState,
): string {
  assertAgentImprovementProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    codecVersion: AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointIntegrityDigest(
  projection: AgentImprovementProjectionState,
  sourceStreamTails: readonly AgentImprovementStreamFrontier[],
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: agentImprovementProjectionIntegrityDigest(projection),
    sourceStreamTails,
  }));
}

function rebuildReasons(
  options: AgentImprovementFoldOptions,
): AgentImprovementRebuildReasonCode[] {
  const reasons: AgentImprovementRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion
      !== AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== AGENT_IMPROVEMENT_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion
      !== AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion
      !== AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertAgentImprovementProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return sortStrings(reasons) as AgentImprovementRebuildReasonCode[];
    }
    if (checkpoint.projection.schemaVersion
      !== AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion
      !== AGENT_IMPROVEMENT_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion
      !== AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion
      !== AGENT_IMPROVEMENT_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (!sameCanonical(
      checkpoint.sourceStreamTails,
      checkpoint.projection.streamFrontiers,
    ) || checkpoint.integrityDigest !== checkpointIntegrityDigest(
      checkpoint.projection,
      checkpoint.sourceStreamTails,
    )) {
      reasons.push('checkpoint-digest-mismatch');
    }
  }
  return sortStrings(reasons) as AgentImprovementRebuildReasonCode[];
}

function orderingFailure(
  events: readonly AgentImprovementLedgerEvent[],
  checkpoint: AgentImprovementProjectionCheckpoint | undefined,
): AgentImprovementRebuildReasonCode | null {
  const frontiers = new Map(
    checkpoint?.sourceStreamTails.map(
      (entry) => [entry.streamId, entry.lastSequence],
    ) ?? [],
  );
  const known = new Map(
    checkpoint?.projection.seenEvents.map(
      (entry) => [entry.eventId, entry.eventDigest],
    ) ?? [],
  );
  for (const event of events) {
    const digest = eventDigest(event);
    const existing = known.get(event.event_id);
    if (existing !== undefined) {
      if (existing !== digest) return 'event-order-invalid';
      continue;
    }
    const tail = frontiers.get(event.stream_id) ?? 0;
    if (event.stream_sequence <= tail) return 'event-order-invalid';
    if (event.stream_sequence !== tail + 1) return 'cursor-gap';
    frontiers.set(event.stream_id, event.stream_sequence);
    known.set(event.event_id, digest);
  }
  return null;
}

function compareEvents(
  left: AgentImprovementLedgerEvent,
  right: AgentImprovementLedgerEvent,
): number {
  const leftStartsRun =
    left.payload.stem === 'deep_improvement_common.run_started' ? 0 : 1;
  const rightStartsRun =
    right.payload.stem === 'deep_improvement_common.run_started' ? 0 : 1;
  return compareNumber(leftStartsRun, rightStartsRun)
    || compareString(left.stream_id, right.stream_id)
    || compareNumber(left.stream_sequence, right.stream_sequence)
    || compareString(left.event_id, right.event_id);
}

function canonicalEventOrder(
  events: readonly AgentImprovementLedgerEvent[],
  checkpoint: AgentImprovementProjectionCheckpoint | undefined,
): AgentImprovementLedgerEvent[] | null {
  const knownIds = new Set(
    checkpoint?.projection.seenEvents.map((entry) => entry.eventId) ?? [],
  );
  const unique = new Map<string, AgentImprovementLedgerEvent>();
  for (const event of events) {
    const existing = unique.get(event.event_id);
    if (existing !== undefined
      && eventDigest(existing) !== eventDigest(event)) return null;
    unique.set(event.event_id, event);
  }
  const pending = [...unique.values()];
  const result: AgentImprovementLedgerEvent[] = [];
  while (pending.length > 0) {
    const ready = pending.filter((event) => (
      event.causation_id === null
      || knownIds.has(event.causation_id)
      || !unique.has(event.causation_id)
    )).sort(compareEvents);
    if (ready.length === 0) return null;
    const next = ready[0];
    result.push(next);
    knownIds.add(next.event_id);
    pending.splice(pending.indexOf(next), 1);
  }
  return result;
}

function projectedResult(
  projection: AgentImprovementProjectionState,
): AgentImprovementProjectedResult {
  const integrityDigest =
    agentImprovementProjectionIntegrityDigest(projection);
  const sourceStreamTails = projection.streamFrontiers.map(
    (entry) => ({ ...entry }),
  );
  const checkpoint: AgentImprovementProjectionCheckpoint = {
    projection,
    integrityDigest: checkpointIntegrityDigest(
      projection,
      sourceStreamTails,
    ),
    sourceStreamTails,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest,
    checkpoint,
  }) as unknown as AgentImprovementProjectedResult;
}

/** Fold common plus namespaced events with one baseline per stream. */
export function foldAgentImprovementEvents(
  events: readonly AgentImprovementLedgerEvent[],
  options: AgentImprovementFoldOptions = {},
): AgentImprovementFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(reasons),
    });
  }
  const validated = events.map(validateTypedEvent);
  const ordered = canonicalEventOrder(validated, options.checkpoint);
  if (ordered === null) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(['event-order-invalid'] as const),
    });
  }
  const orderingReason = orderingFailure(ordered, options.checkpoint);
  if (orderingReason !== null) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze([orderingReason]),
    });
  }
  let projection = options.checkpoint?.projection
    ?? createAgentImprovementProjectionState();
  for (const event of ordered) {
    projection = applyEvent(
      projection,
      event,
      verifiedBoundaryForFold(event),
    );
  }
  return projectedResult(projection);
}

// ───────────────────────────────────────────────────────────────────
// 8. COMPLETE LEGACY AND REDACTED VIEWS
// ───────────────────────────────────────────────────────────────────

/** Project the complete composite into a non-authoritative legacy view. */
export function projectAgentImprovementLegacyView(
  projection: AgentImprovementProjectionState,
): AgentImprovementLegacyProjection {
  assertAgentImprovementProjectionState(projection);
  const status = projection.agentImprovement.modeStatus;
  const legacy: AgentImprovementLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    common: projectDeepImprovementCommonLegacyView(projection.common),
    activeAgentIrId: status.activeAgentIrId,
    activeMutationId: status.activeMutationId,
    latestClassifiedCandidateId: status.latestClassifiedCandidateId,
    coverageState: status.coverageState,
    evaluatorIntegrityState: status.evaluatorIntegrityState,
    projectionHealth: status.projectionHealth,
    blockingVetoCodes: [...status.blockingVetoCodes],
  };
  assertAgentImprovementLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as AgentImprovementLegacyProjection;
}

/** Expose only decision bands and coverage state to candidate generators. */
export function projectAgentImprovementCandidateView(
  projection: AgentImprovementProjectionState,
): AgentImprovementCandidateView {
  assertAgentImprovementProjectionState(projection);
  const commonView = projectDeepImprovementCommonCandidateView(
    projection.common,
  );
  const status = projection.agentImprovement.modeStatus;
  const view: AgentImprovementCandidateView = {
    authority: 'derived-redacted',
    workstream: 'agent-improvement',
    candidateStage: commonView.candidateStage,
    coverageState: status.coverageState,
    decisionBand: status.blockingVetoCodes.length > 0
      ? 'blocked'
      : commonView.decisionBand,
  };
  assertAgentImprovementCandidateView(view);
  return immutableProjectionClone(view) as AgentImprovementCandidateView;
}
