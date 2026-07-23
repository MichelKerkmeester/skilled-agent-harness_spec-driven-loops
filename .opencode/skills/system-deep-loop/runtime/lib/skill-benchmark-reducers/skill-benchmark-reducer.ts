// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
  isDeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  createDeepImprovementCommonProjectionState,
  projectDeepImprovementCommonLegacyView,
} from '../deep-improvement-common-reducers/index.js';
import {
  SkillBenchmarkEventStems,
  SkillBenchmarkSpecificEventStems,
  SkillBenchmarkSpecificWireEventTypes,
  SkillBenchmarkWireEventTypes,
  createSkillBenchmarkEventRegistry,
  isSkillBenchmarkEventStem,
  isSkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  SkillBenchmarkReducerError,
  assertSkillBenchmarkLegacyProjection,
  assertSkillBenchmarkProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './skill-benchmark-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
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
  SkillBenchmarkEventEnvelope,
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerEvent,
  SkillBenchmarkLedgerPayload,
  SkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkArtifactIndexProjection,
  SkillBenchmarkArtifactKind,
  SkillBenchmarkArtifactRecord,
  SkillBenchmarkFoldOptions,
  SkillBenchmarkFoldResult,
  SkillBenchmarkHardVeto,
  SkillBenchmarkLegacyProjection,
  SkillBenchmarkModeState,
  SkillBenchmarkPersistedField,
  SkillBenchmarkProjectedResult,
  SkillBenchmarkProjectionCheckpoint,
  SkillBenchmarkProjectionFieldOwnership,
  SkillBenchmarkProjectionState,
  SkillBenchmarkRebuildReasonCode,
  SkillBenchmarkScenarioCell,
  SkillBenchmarkSeenEvent,
  SkillBenchmarkSpecificFoldBranch,
  SkillBenchmarkStatusTransition,
  SkillBenchmarkStreamTail,
} from './skill-benchmark-projection-types.js';

export const SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION =
  'skill-benchmark-projection@1' as const;
export const SKILL_BENCHMARK_REDUCER_VERSION =
  'skill-benchmark-reducer@1' as const;
export const SKILL_BENCHMARK_PROJECTION_CODEC_VERSION =
  'canonical-json@1' as const;
export const SKILL_BENCHMARK_ORDERING_POLICY_VERSION =
  'per-stream-logical-order@1' as const;
export const SKILL_BENCHMARK_REDUCER_ID =
  'skill-benchmark:projection-fold' as const;

const ZERO_DIGEST = '0'.repeat(64);
const eventRegistry = createSkillBenchmarkEventRegistry();
type SkillBenchmarkModeContractState = SkillBenchmarkProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'common',
  'run',
  'iterationConvergence',
  'artifactIndex',
  'modeStatus',
  'cursors',
  'seenEvents',
] as const satisfies readonly SkillBenchmarkPersistedField[]);

type ProjectionPlane =
  | 'common'
  | 'iterationConvergence'
  | 'artifactIndex'
  | 'modeStatus';

const COMMON_PLANES = Object.freeze([
  'common',
  'iterationConvergence',
  'artifactIndex',
  'modeStatus',
] as const);

export const SKILL_BENCHMARK_EVENT_ROUTING = Object.freeze({
  ...Object.fromEntries(DeepImprovementCommonEventStems.map(
    (stem) => [stem, COMMON_PLANES],
  )),
  'skill_benchmark.run_planned': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.treatment_assigned': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.run_closed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.scenario_started': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.scenario_finished': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.scenario_aborted': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.skill_discovered': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.skill_loaded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.skill_invoked': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.resource_exposed': Object.freeze([
    'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.milestone_observed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.trajectory_recorded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.outcome_recorded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.score_observed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.gold_integrity_recorded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.compatibility_observed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.negative_transfer_observed': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.security_probe_recorded': Object.freeze([
    'iterationConvergence', 'artifactIndex', 'modeStatus',
  ]),
  'skill_benchmark.effect_certificate_issued': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'skill_benchmark.effect_certificate_withheld': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
  'skill_benchmark.effect_certificate_expired': Object.freeze([
    'iterationConvergence', 'modeStatus',
  ]),
} as Readonly<Record<SkillBenchmarkEventStem, readonly ProjectionPlane[]>>);

function stemsForPlane(plane: ProjectionPlane): readonly SkillBenchmarkEventStem[] {
  return Object.freeze(SkillBenchmarkEventStems.filter(
    (stem) => SKILL_BENCHMARK_EVENT_ROUTING[stem].includes(plane),
  ));
}

export const SKILL_BENCHMARK_PROJECTION_FIELD_OWNERSHIP = Object.freeze(
  PERSISTED_FIELDS.map((field): SkillBenchmarkProjectionFieldOwnership => ({
    field,
    ownerReducerId: SKILL_BENCHMARK_REDUCER_ID,
    inputStems: field === 'schemaVersion'
      || field === 'reducerVersion'
      || field === 'codecVersion'
      || field === 'orderingPolicyVersion'
      ? Object.freeze([])
      : field === 'common'
        ? DeepImprovementCommonEventStems
        : field === 'run'
          ? Object.freeze([
            'skill_benchmark.run_planned',
            'skill_benchmark.run_closed',
          ])
          : field === 'iterationConvergence'
            ? stemsForPlane('iterationConvergence')
            : field === 'artifactIndex'
              ? stemsForPlane('artifactIndex')
              : field === 'modeStatus'
                ? stemsForPlane('modeStatus')
                : SkillBenchmarkEventStems,
    foldAlgebra: field === 'schemaVersion'
      || field === 'reducerVersion'
      || field === 'codecVersion'
      || field === 'orderingPolicyVersion'
      ? 'constant'
      : field === 'common'
        ? 'delegate-common'
        : field === 'seenEvents'
          ? 'insert-sorted'
          : 'insert-sorted-and-derive',
    immutableOutput: true,
  })),
);

export const SKILL_BENCHMARK_REDUCER_SET:
ModeReducerSet<SkillBenchmarkModeContractState> = Object.freeze({
  persistedFields: PERSISTED_FIELDS,
  definitions: Object.freeze([Object.freeze({
    reducerId: SKILL_BENCHMARK_REDUCER_ID,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    stateVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    ownedFields: PERSISTED_FIELDS,
    inputEventTypes: Object.freeze(
      SkillBenchmarkEventStems.map((stem) => SkillBenchmarkWireEventTypes[stem]),
    ),
    replaySource: 'verified-ledger-events-only',
    outputRule: 'immutable',
  })]),
});

export const SKILL_BENCHMARK_SPECIFIC_FOLD_BRANCHES = Object.freeze([
  {
    projectionKey: 'iterationConvergence',
    eventStems: SkillBenchmarkSpecificEventStems,
  },
  {
    projectionKey: 'artifactIndex',
    eventStems: SkillBenchmarkSpecificEventStems,
  },
  {
    projectionKey: 'modeStatus',
    eventStems: SkillBenchmarkSpecificEventStems,
  },
] as const satisfies readonly SkillBenchmarkSpecificFoldBranch[]);

export const SKILL_BENCHMARK_FOLD_BRANCHES = Object.freeze([
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  ...SKILL_BENCHMARK_SPECIFIC_FOLD_BRANCHES,
]);

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

function payloadFor<TStem extends SkillBenchmarkEventStem>(
  event: SkillBenchmarkLedgerEvent,
  stem: TStem,
): SkillBenchmarkLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new SkillBenchmarkReducerError(
      'event-not-skill-benchmark',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as SkillBenchmarkLedgerPayload<TStem>;
}

function eventDigest(event: SkillBenchmarkLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function validateTypedEvent(
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isSkillBenchmarkEventStem(payload.stem)
      || effective.event_type !== SkillBenchmarkWireEventTypes[payload.stem]) {
      throw new SkillBenchmarkReducerError(
        'event-not-skill-benchmark',
        'Verified event does not carry a registered Skill Benchmark stem',
        'event_type',
      );
    }
    return effective as SkillBenchmarkLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof SkillBenchmarkReducerError) throw error;
    throw new SkillBenchmarkReducerError(
      'event-schema-invalid',
      'Skill Benchmark event failed the real typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(
  verified: VerifiedLedgerEvent,
): SkillBenchmarkLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isSkillBenchmarkEventStem(payload.stem)
    || envelope.event_type !== SkillBenchmarkWireEventTypes[payload.stem]) {
    throw new SkillBenchmarkReducerError(
      'event-not-skill-benchmark',
      'Mode reducer received a verified event outside the Skill Benchmark union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as SkillBenchmarkLedgerEvent);
}

function verifiedBoundaryFromTypedEvent(
  event: SkillBenchmarkLedgerEvent,
): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), eventRegistry);
  // The common reducer consumes only the registry-verified effective envelope.
  return { event: read } as unknown as VerifiedLedgerEvent;
}

function asModeContractState(
  state: SkillBenchmarkProjectionState,
): SkillBenchmarkModeContractState {
  assertSkillBenchmarkProjectionState(state);
  return state as SkillBenchmarkModeContractState;
}

function topLevelChangedFields(
  before: SkillBenchmarkProjectionState,
  after: SkillBenchmarkProjectionState,
): SkillBenchmarkPersistedField[] {
  return PERSISTED_FIELDS.filter(
    (field) => !sameCanonical(before[field], after[field]),
  );
}

function scopeString(
  event: SkillBenchmarkLedgerEvent,
  field: string,
): string | null {
  const scope = event.payload.scope as Readonly<Record<string, unknown>>;
  return typeof scope[field] === 'string' ? String(scope[field]) : null;
}

function tailForEvent(event: SkillBenchmarkLedgerEvent): SkillBenchmarkStreamTail {
  return {
    streamId: event.stream_id,
    sequence: event.stream_sequence,
    eventId: event.event_id,
    eventDigest: eventDigest(event),
  };
}

function replaceTail(
  tails: readonly SkillBenchmarkStreamTail[],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkStreamTail[] {
  const next = tails.filter((tail) => tail.streamId !== event.stream_id);
  next.push(tailForEvent(event));
  return next.sort((left, right) => compareString(left.streamId, right.streamId));
}

function tailsFromSeenEvents(
  seenEvents: readonly SkillBenchmarkSeenEvent[],
): SkillBenchmarkStreamTail[] {
  const tails = new Map<string, SkillBenchmarkStreamTail>();
  for (const event of seenEvents) {
    const current = tails.get(event.streamId);
    if (current === undefined || event.streamSequence > current.sequence) {
      tails.set(event.streamId, {
        streamId: event.streamId,
        sequence: event.streamSequence,
        eventId: event.eventId,
        eventDigest: event.eventDigest,
      });
    }
  }
  return [...tails.values()].sort(
    (left, right) => compareString(left.streamId, right.streamId),
  );
}

/** Create the immutable empty state accepted by the combined mode contract. */
export function createSkillBenchmarkProjectionState():
SkillBenchmarkProjectionState {
  const state: SkillBenchmarkProjectionState = {
    schemaVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    codecVersion: SKILL_BENCHMARK_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: SKILL_BENCHMARK_ORDERING_POLICY_VERSION,
    common: createDeepImprovementCommonProjectionState(),
    run: {
      runId: null,
      lineageId: null,
      benchmarkDesignId: null,
      designRef: null,
      designDigest: null,
      taskSetRef: null,
      taskSetDigest: null,
      skillBundleRef: null,
      skillBundleDigest: null,
      registryDigest: null,
      executorDescriptorRef: null,
      executorDescriptorDigest: null,
      environmentDigest: null,
      dependencyDigest: null,
      workloadDigest: null,
      replicateCount: 0,
      designPolicyVersion: null,
      state: 'planned',
      plannedEventId: null,
      closedEventId: null,
    },
    iterationConvergence: {
      scenarios: [],
      coverage: {
        assignedScenarioCount: 0,
        terminalScenarioCount: 0,
        discoveredScenarioCount: 0,
        invokedScenarioCount: 0,
        trajectoryScenarioCount: 0,
        outcomeScenarioCount: 0,
        rawScoreScenarioCount: 0,
        acceptedGoldScenarioCount: 0,
        normalizedCandidateCount: 0,
        requiredScenarioCount: 0,
        complete: false,
      },
      hardVetoes: [],
      collectionComplete: false,
      scoringComplete: false,
      certificateReady: false,
      blockerCodes: ['run-not-planned'],
      lastAppliedSequenceByStream: [],
    },
    artifactIndex: {
      artifacts: [],
      rawMeasurements: [],
      derivedRankings: [],
    },
    modeStatus: {
      state: 'planned',
      scoringState: 'not-started',
      certificateState: 'none',
      compatibilityState: 'unknown',
      blockingVetoCodes: [],
      terminal: false,
      provenance: [],
    },
    cursors: {
      common: [],
      iterationConvergence: [],
      artifactIndex: [],
      modeStatus: [],
    },
    seenEvents: [],
  };
  assertSkillBenchmarkProjectionState(state);
  return immutableProjectionClone(state) as SkillBenchmarkProjectionState;
}

function assertRunIdentity(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): void {
  const runId = event.payload.scope.runId;
  const lineageId = event.payload.scope.lineageId;
  if (state.common.run.runId !== null && (
    state.common.run.runId !== runId
    || state.common.run.lineageId !== lineageId
    || state.common.run.variant !== 'skill-benchmark'
  )) {
    throw new SkillBenchmarkReducerError(
      'run-identity-conflict',
      'The common projection and Skill Benchmark event must share one run identity',
      'common.run',
    );
  }
  if (state.run.runId !== null && (
    state.run.runId !== runId || state.run.lineageId !== lineageId
  )) {
    throw new SkillBenchmarkReducerError(
      'run-identity-conflict',
      'One Skill Benchmark projection cannot mix run or lineage identities',
      'run',
    );
  }
  if (isSkillBenchmarkSpecificEventStem(event.payload.stem)
    && state.common.run.runId === null) {
    throw new SkillBenchmarkReducerError(
      'run-not-initialized',
      'The common run-started event must precede Skill Benchmark events',
      'common.run',
    );
  }
  if (isSkillBenchmarkSpecificEventStem(event.payload.stem)
    && state.run.plannedEventId === null
    && event.payload.stem !== 'skill_benchmark.run_planned') {
    throw new SkillBenchmarkReducerError(
      'run-not-initialized',
      'The Skill Benchmark run-planned event must precede mode-specific events',
      'run',
    );
  }
}

function appendSeenEvent(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new SkillBenchmarkReducerError(
        'duplicate-event-conflict',
        'A persisted event identity cannot resolve to different canonical bytes',
        'seenEvents',
      );
    }
    return null;
  }
  const seenEvents = [...state.seenEvents, {
    eventId: event.event_id,
    eventDigest: digest,
    payloadDigest: event.payload.payloadDigest,
    stem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
    scenarioId: scopeString(event, 'scenarioId'),
    assignmentId: scopeString(event, 'assignmentId'),
    executionId: scopeString(event, 'executionId'),
    observationId: scopeString(event, 'observationId'),
    candidateId: scopeString(event, 'candidateId'),
    benchmarkDesignId: scopeString(event, 'benchmarkDesignId'),
    certificateId: scopeString(event, 'certificateId'),
  }];
  seenEvents.sort((left, right) => (
    compareNumber(left.streamSequence, right.streamSequence)
      || compareString(left.streamId, right.streamId)
      || compareString(left.eventId, right.eventId)
  ));
  return seenEvents;
}

type SeenEventOwnershipField =
  | 'scenarioId'
  | 'assignmentId'
  | 'executionId'
  | 'observationId'
  | 'candidateId'
  | 'benchmarkDesignId'
  | 'certificateId';

type SeenEventOwnership = Partial<Pick<
SkillBenchmarkSeenEvent,
SeenEventOwnershipField
>>;

function eventOwnership(
  event: SkillBenchmarkLedgerEvent,
  fields: readonly SeenEventOwnershipField[],
): SeenEventOwnership {
  return Object.fromEntries(fields.map(
    (field) => [field, scopeString(event, field)],
  )) as SeenEventOwnership;
}

function hasOwnership(
  source: SkillBenchmarkSeenEvent,
  expected: SeenEventOwnership,
): boolean {
  return Object.entries(expected).every(([field, value]) => (
    source[field as SeenEventOwnershipField] === value
  ));
}

function requireSeenEvent(
  state: SkillBenchmarkProjectionState,
  eventId: string,
  expectedStems: readonly SkillBenchmarkEventStem[],
  expectedPayloadDigest?: string,
  expectedOwnership: SeenEventOwnership = {},
): SkillBenchmarkSeenEvent {
  const source = state.seenEvents.find((event) => (
    event.eventId === eventId && hasOwnership(event, expectedOwnership)
  ));
  if (source === undefined
    || !expectedStems.includes(source.stem)
    || (expectedPayloadDigest !== undefined
      && source.payloadDigest !== expectedPayloadDigest)) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Referenced producer event is absent, has the wrong type, ownership, or bytes',
      'payload.data',
    );
  }
  return source;
}

function normalizedEventId(reference: string): string {
  const prefix = 'event:deep_improvement_common.evaluation_normalized:';
  if (!reference.startsWith(prefix)) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Normalized-score references must use the typed normalized event namespace',
      'payload.data.normalizedScoreEventRef',
    );
  }
  return reference.slice(prefix.length);
}

function assertEventReferences(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): void {
  if (!isSkillBenchmarkSpecificEventStem(event.payload.stem)) return;
  switch (event.payload.stem) {
    case 'skill_benchmark.run_planned':
      return;
    case 'skill_benchmark.treatment_assigned': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.designEventId,
        ['skill_benchmark.run_planned'],
        payload.data.designPayloadDigest,
        eventOwnership(event, ['benchmarkDesignId']),
      );
      return;
    }
    case 'skill_benchmark.run_closed': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.designEventId,
        ['skill_benchmark.run_planned'],
        undefined,
        eventOwnership(event, ['benchmarkDesignId']),
      );
      payload.data.scenarioTerminalEventIds.forEach((eventId) => requireSeenEvent(
        state,
        eventId,
        ['skill_benchmark.scenario_finished', 'skill_benchmark.scenario_aborted'],
      ));
      return;
    }
    case 'skill_benchmark.scenario_started': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.assignmentEventId,
        ['skill_benchmark.treatment_assigned'],
        payload.data.assignmentPayloadDigest,
        eventOwnership(event, ['scenarioId', 'assignmentId']),
      );
      return;
    }
    case 'skill_benchmark.scenario_finished':
    case 'skill_benchmark.scenario_aborted': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.startedEventId,
        ['skill_benchmark.scenario_started'],
        payload.data.startedPayloadDigest,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.skill_discovered': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.scenarioStartedEventId,
        ['skill_benchmark.scenario_started'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.skill_loaded': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.discoveredEventId,
        ['skill_benchmark.skill_discovered'],
        payload.data.discoveredPayloadDigest,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.skill_invoked': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.loadedEventId,
        ['skill_benchmark.skill_loaded'],
        payload.data.loadedPayloadDigest,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.resource_exposed': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.skillLoadedEventId,
        ['skill_benchmark.skill_loaded'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.milestone_observed': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.scenarioStartedEventId,
        ['skill_benchmark.scenario_started'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.trajectory_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.scenarioStartedEventId,
        ['skill_benchmark.scenario_started'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      payload.data.milestoneEventIds.forEach((eventId) => requireSeenEvent(
        state,
        eventId,
        ['skill_benchmark.milestone_observed'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      ));
      return;
    }
    case 'skill_benchmark.outcome_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.scenarioTerminalEventId,
        ['skill_benchmark.scenario_finished', 'skill_benchmark.scenario_aborted'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.score_observed': {
      const payload = payloadFor(event, event.payload.stem);
      const ownership = eventOwnership(event, [
        'scenarioId',
        'assignmentId',
        'executionId',
        'observationId',
      ]);
      requireSeenEvent(
        state,
        payload.data.outcomeEventId,
        ['skill_benchmark.outcome_recorded'],
        undefined,
        ownership,
      );
      requireSeenEvent(
        state,
        payload.data.goldIntegrityEventId,
        ['skill_benchmark.gold_integrity_recorded'],
        payload.data.goldIntegrityPayloadDigest,
        ownership,
      );
      return;
    }
    case 'skill_benchmark.gold_integrity_recorded':
      return;
    case 'skill_benchmark.compatibility_observed':
    case 'skill_benchmark.security_probe_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.scenarioStartedEventId,
        ['skill_benchmark.scenario_started'],
        undefined,
        eventOwnership(event, ['scenarioId', 'assignmentId', 'executionId']),
      );
      return;
    }
    case 'skill_benchmark.negative_transfer_observed': {
      const payload = payloadFor(event, event.payload.stem);
      const baselineAssignment = requireSeenEvent(
        state,
        payload.data.baselineAssignmentEventId,
        ['skill_benchmark.treatment_assigned'],
      );
      const treatedAssignment = requireSeenEvent(
        state,
        payload.data.treatedAssignmentEventId,
        ['skill_benchmark.treatment_assigned'],
      );
      requireSeenEvent(
        state,
        payload.data.baselineOutcomeEventId,
        ['skill_benchmark.outcome_recorded'],
        undefined,
        {
          scenarioId: baselineAssignment.scenarioId,
          assignmentId: baselineAssignment.assignmentId,
        },
      );
      requireSeenEvent(
        state,
        payload.data.treatedOutcomeEventId,
        ['skill_benchmark.outcome_recorded'],
        undefined,
        {
          scenarioId: treatedAssignment.scenarioId,
          assignmentId: treatedAssignment.assignmentId,
        },
      );
      return;
    }
    case 'skill_benchmark.effect_certificate_issued': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        normalizedEventId(payload.data.normalizedScoreEventRef),
        ['deep_improvement_common.evaluation_normalized'],
        payload.data.normalizedScorePayloadDigest,
      );
      requireSeenEvent(state, payload.data.goldIntegrityEventId, [
        'skill_benchmark.gold_integrity_recorded',
      ]);
      payload.data.evidenceEventIds.forEach((eventId) => requireSeenEvent(
        state,
        eventId,
        SkillBenchmarkEventStems,
      ));
      return;
    }
    case 'skill_benchmark.effect_certificate_withheld': {
      const payload = payloadFor(event, event.payload.stem);
      if (payload.data.normalizedScoreEventRef !== null) {
        requireSeenEvent(
          state,
          normalizedEventId(payload.data.normalizedScoreEventRef),
          ['deep_improvement_common.evaluation_normalized'],
        );
      }
      payload.data.evidenceEventIds.forEach((eventId) => requireSeenEvent(
        state,
        eventId,
        SkillBenchmarkEventStems,
      ));
      return;
    }
    case 'skill_benchmark.effect_certificate_expired': {
      const payload = payloadFor(event, event.payload.stem);
      requireSeenEvent(
        state,
        payload.data.issuedEventId,
        ['skill_benchmark.effect_certificate_issued'],
        payload.data.issuedPayloadDigest,
        eventOwnership(event, ['certificateId']),
      );
      return;
    }
  }
}

function scenarioForEvent(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkScenarioCell {
  const assignmentId = scopeString(event, 'assignmentId');
  const scenarioId = scopeString(event, 'scenarioId');
  if (assignmentId === null || scenarioId === null) {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'Scenario events require scenario and assignment identities',
      'payload.scope',
    );
  }
  const scenario = state.iterationConvergence.scenarios.find(
    (candidate) => candidate.assignmentId === assignmentId
      && candidate.scenarioId === scenarioId,
  );
  if (scenario === undefined) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Scenario event must reference a projected treatment assignment',
      'iterationConvergence.scenarios',
    );
  }
  return scenario;
}

function replaceScenario(
  scenarios: readonly SkillBenchmarkScenarioCell[],
  replacement: SkillBenchmarkScenarioCell,
): SkillBenchmarkScenarioCell[] {
  const next = scenarios.filter(
    (scenario) => scenario.assignmentId !== replacement.assignmentId,
  );
  next.push(replacement);
  return next.sort((left, right) => (
    compareString(left.scenarioId, right.scenarioId)
      || compareString(left.assignmentId, right.assignmentId)
  ));
}

function foldRun(
  run: SkillBenchmarkProjectionState['run'],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkProjectionState['run'] {
  if (event.payload.stem === 'skill_benchmark.run_planned') {
    if (run.plannedEventId !== null) {
      throw new SkillBenchmarkReducerError(
        'impossible-status-transition',
        'A Skill Benchmark run can be planned only once',
        'run.state',
      );
    }
    const payload = payloadFor(event, event.payload.stem);
    return {
      runId: payload.scope.runId,
      lineageId: payload.scope.lineageId,
      benchmarkDesignId: payload.scope.benchmarkDesignId,
      designRef: payload.data.designRef,
      designDigest: payload.data.designDigest,
      taskSetRef: payload.data.taskSetRef,
      taskSetDigest: payload.data.taskSetDigest,
      skillBundleRef: payload.data.skillBundleRef,
      skillBundleDigest: payload.data.skillBundleDigest,
      registryDigest: payload.data.registryDigest,
      executorDescriptorRef: payload.data.executorDescriptorRef,
      executorDescriptorDigest: payload.data.executorDescriptorDigest,
      environmentDigest: payload.data.environmentDigest,
      dependencyDigest: payload.data.dependencyDigest,
      workloadDigest: payload.data.workloadDigest,
      replicateCount: payload.data.replicateCount,
      designPolicyVersion: payload.data.designPolicyVersion,
      state: 'active',
      plannedEventId: event.event_id,
      closedEventId: null,
    };
  }
  if (event.payload.stem === 'skill_benchmark.run_closed') {
    if (run.state !== 'active') {
      throw new SkillBenchmarkReducerError(
        'impossible-status-transition',
        'Only an active Skill Benchmark run can close',
        'run.state',
      );
    }
    const payload = payloadFor(event, event.payload.stem);
    return {
      ...run,
      state: payload.data.terminalStatus === 'closed'
        ? 'closed'
        : payload.data.terminalStatus,
      closedEventId: event.event_id,
    };
  }
  return run;
}

function foldScenarios(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkScenarioCell[] {
  if (event.payload.stem === 'skill_benchmark.treatment_assigned') {
    const payload = payloadFor(event, event.payload.stem);
    if (state.iterationConvergence.scenarios.some(
      (scenario) => scenario.assignmentId === payload.scope.assignmentId,
    )) {
      throw new SkillBenchmarkReducerError(
        'impossible-status-transition',
        'Treatment assignment identities are unique within a run',
        'iterationConvergence.scenarios.assignmentId',
      );
    }
    return replaceScenario(state.iterationConvergence.scenarios, {
      scenarioId: payload.scope.scenarioId,
      assignmentId: payload.scope.assignmentId,
      executionId: null,
      designCellId: payload.data.designCellId,
      pairedReplicateId: payload.data.pairedReplicateId,
      replicateIndex: payload.data.replicateIndex,
      treatmentArm: payload.data.treatmentArm,
      taskRef: payload.data.taskRef,
      taskDigest: payload.data.taskDigest,
      skillBundleRef: payload.data.skillBundleRef,
      skillBundleDigest: payload.data.skillBundleDigest,
      executorDescriptorRef: payload.data.executorDescriptorRef,
      executorDescriptorDigest: payload.data.executorDescriptorDigest,
      environmentDigest: payload.data.environmentDigest,
      toolDigest: null,
      permissionDigest: null,
      dependencyDigest: null,
      workloadDigest: null,
      state: 'assigned',
      collectionStage: 'assigned',
      assignmentEventId: event.event_id,
      startedEventId: null,
      terminalEventId: null,
      discoveryEventId: null,
      loadEventId: null,
      invocationEventId: null,
      trajectoryEventId: null,
      outcomeEventId: null,
      rawScoreEventIds: [],
      goldIntegrityEventIds: [],
      compatibilityEventIds: [],
      requiredEvidenceComplete: false,
    });
  }
  if (!isSkillBenchmarkSpecificEventStem(event.payload.stem)
    || event.payload.stem === 'skill_benchmark.run_planned'
    || event.payload.stem === 'skill_benchmark.run_closed'
    || event.payload.stem.startsWith('skill_benchmark.effect_certificate_')) {
    return [...state.iterationConvergence.scenarios];
  }
  const scenario = scenarioForEvent(state, event);
  let replacement: SkillBenchmarkScenarioCell = scenario;
  switch (event.payload.stem) {
    case 'skill_benchmark.scenario_started': {
      if (scenario.state !== 'assigned') {
        throw new SkillBenchmarkReducerError(
          'impossible-status-transition',
          'A scenario can start only from the assigned state',
          'iterationConvergence.scenarios.state',
        );
      }
      const payload = payloadFor(event, event.payload.stem);
      replacement = {
        ...scenario,
        executionId: payload.scope.executionId,
        environmentDigest: payload.data.environmentDigest,
        executorDescriptorRef: payload.data.executorDescriptorRef,
        executorDescriptorDigest: payload.data.executorDescriptorDigest,
        toolDigest: payload.data.toolDigest,
        permissionDigest: payload.data.permissionDigest,
        dependencyDigest: payload.data.dependencyDigest,
        workloadDigest: payload.data.workloadDigest,
        state: 'running',
        startedEventId: event.event_id,
      };
      break;
    }
    case 'skill_benchmark.scenario_finished':
    case 'skill_benchmark.scenario_aborted': {
      if (scenario.state !== 'running') {
        throw new SkillBenchmarkReducerError(
          'impossible-status-transition',
          'Only a running scenario can reach a terminal state',
          'iterationConvergence.scenarios.state',
        );
      }
      replacement = {
        ...scenario,
        state: event.payload.stem === 'skill_benchmark.scenario_finished'
          ? 'finished'
          : 'aborted',
        terminalEventId: event.event_id,
      };
      break;
    }
    case 'skill_benchmark.skill_discovered':
      replacement = {
        ...scenario,
        discoveryEventId: event.event_id,
        collectionStage: payloadFor(event, event.payload.stem).data.availabilityStatus
          === 'available'
          ? 'available'
          : 'blocked',
      };
      break;
    case 'skill_benchmark.skill_loaded':
      replacement = {
        ...scenario,
        loadEventId: event.event_id,
        collectionStage: payloadFor(event, event.payload.stem).data.loadStatus
          === 'loaded'
          ? 'loaded'
          : 'blocked',
      };
      break;
    case 'skill_benchmark.skill_invoked':
      replacement = {
        ...scenario,
        invocationEventId: event.event_id,
        collectionStage: payloadFor(event, event.payload.stem).data.invocationStatus
          === 'invoked'
          ? 'invoked'
          : 'blocked',
      };
      break;
    case 'skill_benchmark.trajectory_recorded':
      replacement = {
        ...scenario,
        trajectoryEventId: event.event_id,
        collectionStage: 'trajectory-recorded',
      };
      break;
    case 'skill_benchmark.outcome_recorded':
      replacement = {
        ...scenario,
        outcomeEventId: event.event_id,
        collectionStage: 'outcome-recorded',
      };
      break;
    case 'skill_benchmark.score_observed':
      replacement = {
        ...scenario,
        rawScoreEventIds: sortStrings([...scenario.rawScoreEventIds, event.event_id]),
        collectionStage: 'raw-score-recorded',
      };
      break;
    case 'skill_benchmark.gold_integrity_recorded':
      replacement = {
        ...scenario,
        goldIntegrityEventIds: sortStrings([
          ...scenario.goldIntegrityEventIds,
          event.event_id,
        ]),
      };
      break;
    case 'skill_benchmark.compatibility_observed':
      replacement = {
        ...scenario,
        compatibilityEventIds: sortStrings([
          ...scenario.compatibilityEventIds,
          event.event_id,
        ]),
      };
      break;
    case 'skill_benchmark.resource_exposed':
    case 'skill_benchmark.milestone_observed':
    case 'skill_benchmark.negative_transfer_observed':
    case 'skill_benchmark.security_probe_recorded':
      break;
    case 'skill_benchmark.effect_certificate_issued':
    case 'skill_benchmark.effect_certificate_withheld':
    case 'skill_benchmark.effect_certificate_expired':
      break;
  }
  return replaceScenario(state.iterationConvergence.scenarios, replacement);
}

interface ArtifactInput {
  readonly artifactKind: SkillBenchmarkArtifactKind;
  readonly logicalArtifactId: string;
  readonly reference: string;
  readonly digest: string;
  readonly producerEventId: string;
  readonly scenarioId?: string | null;
  readonly candidateId?: string | null;
  readonly availability?: SkillBenchmarkArtifactRecord['availability'];
}

function insertArtifact(
  artifacts: readonly SkillBenchmarkArtifactRecord[],
  input: ArtifactInput,
): SkillBenchmarkArtifactRecord[] {
  const artifactId = sha256Bytes(canonicalBytes({
    artifactKind: input.artifactKind,
    logicalArtifactId: input.logicalArtifactId,
    digest: input.digest,
  }));
  const nextArtifact: SkillBenchmarkArtifactRecord = {
    artifactId,
    logicalArtifactId: input.logicalArtifactId,
    artifactKind: input.artifactKind,
    reference: input.reference,
    digest: input.digest,
    producerEventId: input.producerEventId,
    scenarioId: input.scenarioId ?? null,
    candidateId: input.candidateId ?? null,
    availability: input.availability ?? 'available',
    supersedesArtifactIds: [],
    supersededByArtifactIds: [],
  };
  const existing = artifacts.find((artifact) => artifact.artifactId === artifactId);
  if (existing !== undefined) {
    if (!sameCanonical(existing, nextArtifact)) {
      throw new SkillBenchmarkReducerError(
        'duplicate-event-conflict',
        'A content-addressed artifact identity cannot resolve to different data',
        'artifactIndex.artifacts',
      );
    }
    return [...artifacts];
  }
  return [...artifacts, nextArtifact].sort((left, right) => (
    compareString(left.artifactKind, right.artifactKind)
      || compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareString(left.artifactId, right.artifactId)
  ));
}

function digestReference(kind: string, digest: string): string {
  return `digest:${kind}:${digest.slice(0, 32)}`;
}

function artifactsFromEvent(
  artifacts: readonly SkillBenchmarkArtifactRecord[],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkArtifactRecord[] {
  if (!isSkillBenchmarkSpecificEventStem(event.payload.stem)) return [...artifacts];
  const scenarioId = scopeString(event, 'scenarioId');
  const candidateId = scopeString(event, 'candidateId');
  const add = (
    current: readonly SkillBenchmarkArtifactRecord[],
    artifactKind: SkillBenchmarkArtifactKind,
    logicalArtifactId: string,
    reference: string,
    digest: string,
    availability?: SkillBenchmarkArtifactRecord['availability'],
  ): SkillBenchmarkArtifactRecord[] => insertArtifact(current, {
    artifactKind,
    logicalArtifactId,
    reference,
    digest,
    producerEventId: event.event_id,
    scenarioId,
    candidateId,
    availability,
  });
  let next = [...artifacts];
  switch (event.payload.stem) {
    case 'skill_benchmark.run_planned': {
      const payload = payloadFor(event, event.payload.stem);
      next = add(next, 'design', `design:${payload.scope.benchmarkDesignId}`,
        payload.data.designRef, payload.data.designDigest);
      next = add(next, 'task', `task-set:${payload.scope.benchmarkDesignId}`,
        payload.data.taskSetRef, payload.data.taskSetDigest);
      next = add(next, 'skill-bundle', `skill-bundle:${payload.scope.benchmarkDesignId}`,
        payload.data.skillBundleRef, payload.data.skillBundleDigest);
      next = add(next, 'registry', `registry:${payload.scope.benchmarkDesignId}`,
        digestReference('registry', payload.data.registryDigest),
        payload.data.registryDigest);
      next = add(next, 'executor', `executor:${payload.scope.benchmarkDesignId}`,
        payload.data.executorDescriptorRef, payload.data.executorDescriptorDigest);
      next = add(next, 'environment', `environment:${payload.scope.benchmarkDesignId}`,
        digestReference('environment', payload.data.environmentDigest),
        payload.data.environmentDigest);
      next = add(next, 'dependency', `dependency:${payload.scope.benchmarkDesignId}`,
        digestReference('dependency', payload.data.dependencyDigest),
        payload.data.dependencyDigest);
      next = add(next, 'workload', `workload:${payload.scope.benchmarkDesignId}`,
        digestReference('workload', payload.data.workloadDigest),
        payload.data.workloadDigest);
      return next;
    }
    case 'skill_benchmark.treatment_assigned': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'assignment', `assignment:${payload.scope.assignmentId}`,
        payload.data.assignmentReceiptRef, event.payload.payloadDigest);
    }
    case 'skill_benchmark.scenario_started': {
      const payload = payloadFor(event, event.payload.stem);
      next = add(next, 'task', `task:${payload.scope.assignmentId}`,
        payload.data.taskRef, payload.data.taskDigest);
      next = add(next, 'environment', `environment:${payload.scope.executionId}`,
        payload.data.environmentRef, payload.data.environmentDigest);
      next = add(next, 'executor', `executor:${payload.scope.executionId}`,
        payload.data.executorDescriptorRef, payload.data.executorDescriptorDigest);
      next = add(next, 'tool', `tool:${payload.scope.executionId}`,
        digestReference('tool', payload.data.toolDigest), payload.data.toolDigest);
      next = add(next, 'permission', `permission:${payload.scope.executionId}`,
        digestReference('permission', payload.data.permissionDigest),
        payload.data.permissionDigest);
      next = add(next, 'dependency', `dependency:${payload.scope.executionId}`,
        digestReference('dependency', payload.data.dependencyDigest),
        payload.data.dependencyDigest);
      return add(next, 'workload', `workload:${payload.scope.executionId}`,
        digestReference('workload', payload.data.workloadDigest),
        payload.data.workloadDigest);
    }
    case 'skill_benchmark.skill_discovered': {
      const payload = payloadFor(event, event.payload.stem);
      next = add(next, 'skill-bundle', `skill-bundle:${payload.scope.skillBundleId}`,
        payload.data.skillBundleRef, payload.data.skillBundleDigest,
        payload.data.availabilityStatus === 'available' ? 'available' : 'unavailable');
      return add(next, 'registry', `registry:${payload.scope.executionId}`,
        digestReference('registry', payload.data.registryDigest),
        payload.data.registryDigest);
    }
    case 'skill_benchmark.resource_exposed': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'resource-exposure', `resource:${payload.scope.resourceId}`,
        payload.data.resourceRef, payload.data.resourceDigest,
        payload.data.canaryStatus === 'triggered' ? 'invalid' : 'available');
    }
    case 'skill_benchmark.milestone_observed': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'milestone', `milestone:${payload.scope.milestoneId}`,
        payload.data.observationRef, payload.data.observationDigest,
        payload.data.milestoneState === 'failed' ? 'invalid' : 'available');
    }
    case 'skill_benchmark.trajectory_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'trajectory', `trajectory:${payload.scope.executionId}`,
        payload.data.traceRef, payload.data.traceDigest);
    }
    case 'skill_benchmark.outcome_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'outcome', `outcome:${payload.scope.observationId}`,
        payload.data.finalStateRef, payload.data.finalStateDigest,
        payload.data.outcomeStatus === 'pass' ? 'available' : 'invalid');
    }
    case 'skill_benchmark.score_observed': {
      const payload = payloadFor(event, event.payload.stem);
      for (const axis of payload.data.rawScoreAxes) {
        next = add(next, 'raw-observation',
          `raw-score:${payload.scope.observationId}:${axis.dimensionCode}`,
          axis.measurementRef, axis.measurementDigest);
      }
      return next;
    }
    case 'skill_benchmark.gold_integrity_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'gold', `gold:${payload.scope.observationId}`,
        payload.data.goldRef, payload.data.goldDigest,
        payload.data.integrityStatus === 'accepted'
          ? 'available'
          : payload.data.integrityStatus === 'pending'
            ? 'pending'
            : 'invalid');
    }
    case 'skill_benchmark.compatibility_observed': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'compatibility',
        `compatibility:${payload.scope.observationId}`,
        payload.data.evidenceRef, payload.data.evidenceDigest,
        payload.data.compatibilityStatus === 'incompatible' ? 'invalid' : 'available');
    }
    case 'skill_benchmark.negative_transfer_observed': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'negative-transfer',
        `negative-transfer:${payload.scope.observationId}:${payload.data.axisCode}`,
        payload.data.evidenceRef, payload.data.evidenceDigest,
        payload.data.transferStatus === 'negative-transfer' ? 'invalid' : 'available');
    }
    case 'skill_benchmark.security_probe_recorded': {
      const payload = payloadFor(event, event.payload.stem);
      return add(next, 'security-probe',
        `security-probe:${payload.scope.observationId}`,
        payload.data.evidenceRef, payload.data.evidenceDigest,
        payload.data.probeOutcome === 'fail' ? 'invalid' : 'available');
    }
    case 'skill_benchmark.run_closed':
    case 'skill_benchmark.scenario_finished':
    case 'skill_benchmark.scenario_aborted':
    case 'skill_benchmark.skill_loaded':
    case 'skill_benchmark.skill_invoked':
    case 'skill_benchmark.effect_certificate_issued':
    case 'skill_benchmark.effect_certificate_withheld':
    case 'skill_benchmark.effect_certificate_expired':
      return next;
  }
}

function rawMeasurementsFromEvent(
  measurements: SkillBenchmarkArtifactIndexProjection['rawMeasurements'],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkArtifactIndexProjection['rawMeasurements'] {
  if (event.payload.stem !== 'skill_benchmark.score_observed') {
    return [...measurements];
  }
  const payload = payloadFor(event, event.payload.stem);
  if (measurements.some((measurement) => measurement.producerEventId === event.event_id)) {
    return [...measurements];
  }
  const measurement = {
    scenarioId: payload.scope.scenarioId,
    assignmentId: payload.scope.assignmentId,
    executionId: payload.scope.executionId,
    observationId: payload.scope.observationId,
    outcomeEventId: payload.data.outcomeEventId,
    evaluatorRef: payload.data.evaluatorRef,
    evaluatorVersion: payload.data.evaluatorVersion,
    evaluatorFingerprint: payload.data.evaluatorFingerprint,
    rawScoreAxes: payload.data.rawScoreAxes.map((axis) => ({ ...axis })),
    deterministicResultsRef: payload.data.deterministicResultsRef,
    deterministicResultsDigest: payload.data.deterministicResultsDigest,
    dynamicReferenceResultsRef: payload.data.dynamicReferenceResultsRef,
    dynamicReferenceResultsDigest: payload.data.dynamicReferenceResultsDigest,
    constraintCoverageRef: payload.data.constraintCoverageRef,
    constraintCoverageDigest: payload.data.constraintCoverageDigest,
    tokenCount: payload.data.tokenCount,
    latencyMs: payload.data.latencyMs,
    costMicrounits: payload.data.costMicrounits,
    goldIntegrityEventId: payload.data.goldIntegrityEventId,
    goldPolicy: payload.data.goldPolicy,
    numeratorEligible: payload.data.numeratorEligible,
    scoreWriteBackendRef: payload.data.scoreWriteBackendRef,
    producerEventId: event.event_id,
  };
  return [...measurements, measurement].sort((left, right) => (
    compareString(left.scenarioId, right.scenarioId)
      || compareString(left.assignmentId, right.assignmentId)
      || compareString(left.producerEventId, right.producerEventId)
  ));
}

function insertVeto(
  vetoes: readonly SkillBenchmarkHardVeto[],
  veto: SkillBenchmarkHardVeto,
): SkillBenchmarkHardVeto[] {
  const existing = vetoes.find(
    (candidate) => candidate.producerEventId === veto.producerEventId
      && candidate.vetoCode === veto.vetoCode,
  );
  if (existing !== undefined) return [...vetoes];
  return [...vetoes, veto].sort((left, right) => (
    compareString(left.vetoCode, right.vetoCode)
      || compareString(left.producerEventId, right.producerEventId)
  ));
}

function specificVetoesFromEvent(
  vetoes: readonly SkillBenchmarkHardVeto[],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkHardVeto[] {
  if (!isSkillBenchmarkSpecificEventStem(event.payload.stem)) return [...vetoes];
  const scenarioId = scopeString(event, 'scenarioId');
  if (event.payload.stem === 'skill_benchmark.gold_integrity_recorded') {
    const payload = payloadFor(event, event.payload.stem);
    if (payload.data.integrityStatus === 'accepted') return [...vetoes];
    return insertVeto(vetoes, {
      vetoCode: `gold-integrity-${payload.data.integrityStatus}`,
      source: 'gold-integrity',
      scenarioId,
      evidenceRef: payload.data.provenanceRef,
      evidenceDigest: payload.data.provenanceDigest,
      producerEventId: event.event_id,
    });
  }
  if (event.payload.stem === 'skill_benchmark.compatibility_observed') {
    const payload = payloadFor(event, event.payload.stem);
    if (payload.data.compatibilityStatus !== 'incompatible') return [...vetoes];
    return insertVeto(vetoes, {
      vetoCode: 'compatibility-incompatible',
      source: 'compatibility',
      scenarioId,
      evidenceRef: payload.data.evidenceRef,
      evidenceDigest: payload.data.evidenceDigest,
      producerEventId: event.event_id,
    });
  }
  if (event.payload.stem === 'skill_benchmark.negative_transfer_observed') {
    const payload = payloadFor(event, event.payload.stem);
    if (payload.data.transferStatus !== 'negative-transfer') return [...vetoes];
    return insertVeto(vetoes, {
      vetoCode: `negative-transfer:${payload.data.axisCode}`,
      source: 'negative-transfer',
      scenarioId,
      evidenceRef: payload.data.evidenceRef,
      evidenceDigest: payload.data.evidenceDigest,
      producerEventId: event.event_id,
    });
  }
  if (event.payload.stem === 'skill_benchmark.security_probe_recorded') {
    const payload = payloadFor(event, event.payload.stem);
    if (payload.data.probeOutcome !== 'fail') return [...vetoes];
    return insertVeto(vetoes, {
      vetoCode: 'security-probe-failed',
      source: 'security-probe',
      scenarioId,
      evidenceRef: payload.data.evidenceRef,
      evidenceDigest: payload.data.evidenceDigest,
      producerEventId: event.event_id,
    });
  }
  if (event.payload.stem === 'skill_benchmark.resource_exposed') {
    const payload = payloadFor(event, event.payload.stem);
    if (payload.data.canaryStatus !== 'triggered') return [...vetoes];
    return insertVeto(vetoes, {
      vetoCode: 'resource-canary-triggered',
      source: 'canary',
      scenarioId,
      evidenceRef: payload.data.canaryRef,
      evidenceDigest: payload.data.canaryDigest,
      producerEventId: event.event_id,
    });
  }
  return [...vetoes];
}

function commonVetoes(
  common: DeepImprovementCommonProjectionState,
): SkillBenchmarkHardVeto[] {
  return common.iterationConvergence.hardVetoes.map((veto) => ({
    vetoCode: veto.vetoCode,
    source: 'shared-common' as const,
    scenarioId: null,
    evidenceRef: veto.evidenceRef,
    evidenceDigest: veto.evidenceDigest,
    producerEventId: veto.producerEventId,
  }));
}

function derivedRankings(
  common: DeepImprovementCommonProjectionState,
  vetoes: readonly SkillBenchmarkHardVeto[],
): SkillBenchmarkArtifactIndexProjection['derivedRankings'] {
  const latestScores = new Map<
    string,
    DeepImprovementCommonProjectionState['artifactIndex']['derivedScores'][number]
  >();
  for (const score of common.artifactIndex.derivedScores) {
    latestScores.set(score.candidateId, score);
  }
  const shippedCandidates = new Set(
    common.iterationConvergence.promotions
      .filter((promotion) => promotion.stage === 'shipped')
      .map((promotion) => promotion.candidateId),
  );
  const vetoCodes = sortStrings(vetoes.map((veto) => veto.vetoCode));
  const provisional = [...latestScores.values()].map((score) => ({
    candidateId: score.candidateId,
    evaluationEpochId: score.evaluationEpochId,
    normalizedScoreEventId: score.producerEventId,
    scorePolicyVersion: score.scorePolicyVersion,
    aggregateScore: score.scoreVector.aggregateScore,
    uncertainty: score.scoreVector.uncertainty,
    rank: null,
    eligible: vetoCodes.length === 0,
    promoted: shippedCandidates.has(score.candidateId) && vetoCodes.length === 0,
    blockingVetoCodes: vetoCodes,
  }));
  provisional.sort((left, right) => (
    compareNumber(right.aggregateScore, left.aggregateScore)
      || compareString(left.candidateId, right.candidateId)
      || compareString(left.normalizedScoreEventId, right.normalizedScoreEventId)
  ));
  let rank = 0;
  return provisional.map((entry) => {
    if (!entry.eligible) return entry;
    rank += 1;
    return { ...entry, rank };
  });
}

function normalizedArtifacts(
  artifacts: readonly SkillBenchmarkArtifactRecord[],
  common: DeepImprovementCommonProjectionState,
): SkillBenchmarkArtifactRecord[] {
  let next = [...artifacts];
  for (const score of common.artifactIndex.derivedScores) {
    next = insertArtifact(next, {
      artifactKind: 'normalized-score',
      logicalArtifactId: `normalized-score:${score.candidateId}`,
      reference: `event:${score.producerEventId}`,
      digest: score.observationSetDigest,
      producerEventId: score.producerEventId,
      candidateId: score.candidateId,
    });
  }
  return next;
}

function scenarioHasRequiredEvidence(
  scenario: SkillBenchmarkScenarioCell,
  rawMeasurements: SkillBenchmarkArtifactIndexProjection['rawMeasurements'],
  vetoes: readonly SkillBenchmarkHardVeto[],
): boolean {
  const requiresInvocation = ![
    'control', 'no-skill', 'placebo',
  ].includes(scenario.treatmentArm);
  const hasInvocation = !requiresInvocation
    || (scenario.discoveryEventId !== null
      && scenario.loadEventId !== null
      && scenario.invocationEventId !== null);
  const measurement = rawMeasurements.some(
    (candidate) => candidate.assignmentId === scenario.assignmentId
      && candidate.numeratorEligible,
  );
  const hasScenarioVeto = vetoes.some(
    (veto) => veto.scenarioId === scenario.scenarioId,
  );
  return scenario.state === 'finished'
    && hasInvocation
    && scenario.trajectoryEventId !== null
    && scenario.outcomeEventId !== null
    && scenario.rawScoreEventIds.length > 0
    && scenario.goldIntegrityEventIds.length > 0
    && scenario.compatibilityEventIds.length > 0
    && measurement
    && !hasScenarioVeto;
}

function certificateStateForEvent(
  previous: SkillBenchmarkProjectionState['modeStatus']['certificateState'],
  event: SkillBenchmarkLedgerEvent,
  certificateReady: boolean,
): SkillBenchmarkProjectionState['modeStatus']['certificateState'] {
  if (event.payload.stem === 'skill_benchmark.effect_certificate_issued') {
    return 'issued';
  }
  if (event.payload.stem === 'skill_benchmark.effect_certificate_withheld') {
    return 'withheld';
  }
  if (event.payload.stem === 'skill_benchmark.effect_certificate_expired') {
    return 'expired';
  }
  if (previous === 'issued' || previous === 'withheld' || previous === 'expired') {
    return previous;
  }
  return certificateReady ? 'eligible' : previous === 'none' ? 'pending' : previous;
}

function modeState(
  state: SkillBenchmarkProjectionState,
  certificateState: SkillBenchmarkProjectionState['modeStatus']['certificateState'],
  certificateReady: boolean,
  hardVetoCodes: readonly string[],
): SkillBenchmarkModeState {
  if (certificateState === 'expired') return 'expired';
  if (certificateState === 'withheld') return 'withheld';
  if (certificateState === 'issued') return 'issued';
  if (state.run.state === 'aborted') return 'aborted';
  if (state.run.state === 'incomplete') return 'incomplete';
  if (hardVetoCodes.length > 0) return 'blocked';
  if (certificateReady) return 'ready';
  if (state.run.state === 'closed') return 'closed';
  if (state.artifactIndex.derivedRankings.length > 0) return 'scoring';
  if (state.iterationConvergence.scenarios.length > 0) return 'collecting';
  if (state.run.state === 'active' || state.common.run.state === 'active') return 'active';
  return 'planned';
}

function refreshDerivedState(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkProjectionState {
  const specificVetoes = state.iterationConvergence.hardVetoes.filter(
    (veto) => veto.source !== 'shared-common',
  );
  const vetoes = [
    ...specificVetoes,
    ...commonVetoes(state.common),
  ].sort((left, right) => (
    compareString(left.vetoCode, right.vetoCode)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  const rankings = derivedRankings(state.common, vetoes);
  const scenarios = state.iterationConvergence.scenarios.map((scenario) => {
    const complete = scenarioHasRequiredEvidence(
      scenario,
      state.artifactIndex.rawMeasurements,
      vetoes,
    );
    const blocked = vetoes.some((veto) => veto.scenarioId === scenario.scenarioId);
    return {
      ...scenario,
      collectionStage: blocked
        ? 'blocked' as const
        : complete && rankings.length > 0
          ? 'normalized' as const
          : scenario.collectionStage,
      requiredEvidenceComplete: complete,
    };
  });
  const assignedScenarioCount = scenarios.length;
  const requiredScenarioCount = state.run.replicateCount;
  const terminalScenarioCount = scenarios.filter(
    (scenario) => scenario.state === 'finished' || scenario.state === 'aborted',
  ).length;
  const coverage = {
    assignedScenarioCount,
    terminalScenarioCount,
    discoveredScenarioCount: scenarios.filter(
      (scenario) => scenario.discoveryEventId !== null,
    ).length,
    invokedScenarioCount: scenarios.filter(
      (scenario) => scenario.invocationEventId !== null,
    ).length,
    trajectoryScenarioCount: scenarios.filter(
      (scenario) => scenario.trajectoryEventId !== null,
    ).length,
    outcomeScenarioCount: scenarios.filter(
      (scenario) => scenario.outcomeEventId !== null,
    ).length,
    rawScoreScenarioCount: scenarios.filter(
      (scenario) => scenario.rawScoreEventIds.length > 0,
    ).length,
    acceptedGoldScenarioCount: scenarios.filter((scenario) => (
      state.artifactIndex.rawMeasurements.some(
        (measurement) => measurement.assignmentId === scenario.assignmentId
          && measurement.numeratorEligible,
      )
    )).length,
    normalizedCandidateCount: rankings.length,
    requiredScenarioCount,
    complete: requiredScenarioCount > 0
      && assignedScenarioCount >= requiredScenarioCount
      && scenarios.every((scenario) => scenario.requiredEvidenceComplete),
  };
  const hardVetoCodes = sortStrings(vetoes.map((veto) => veto.vetoCode));
  const collectionComplete = coverage.complete;
  const scoringComplete = rankings.length > 0;
  const certificateReady = collectionComplete
    && scoringComplete
    && rankings.some((ranking) => ranking.eligible)
    && hardVetoCodes.length === 0;
  const blockerCodes = sortStrings([
    ...(state.run.plannedEventId === null ? ['run-not-planned'] : []),
    ...(requiredScenarioCount === 0 ? ['required-scenarios-empty'] : []),
    ...(!collectionComplete ? ['collection-incomplete'] : []),
    ...(!scoringComplete ? ['normalized-score-missing'] : []),
    ...hardVetoCodes,
  ]);
  const certificateState = certificateStateForEvent(
    state.modeStatus.certificateState,
    event,
    certificateReady,
  );
  const compatibilityEvents = state.seenEvents.filter(
    (seen) => seen.stem === 'skill_benchmark.compatibility_observed',
  );
  const compatibilityState = hardVetoCodes.includes('compatibility-incompatible')
    ? 'incompatible' as const
    : compatibilityEvents.length > 0
      ? 'compatible' as const
      : 'unknown' as const;
  const scoringState = hardVetoCodes.length > 0
    ? 'blocked' as const
    : rankings.some((ranking) => ranking.rank !== null)
      ? 'ranked' as const
      : rankings.length > 0
        ? 'normalized' as const
        : state.artifactIndex.rawMeasurements.length > 0
          ? 'raw-observed' as const
          : 'not-started' as const;
  const derivedBase: SkillBenchmarkProjectionState = {
    ...state,
    iterationConvergence: {
      scenarios,
      coverage,
      hardVetoes: vetoes,
      collectionComplete,
      scoringComplete,
      certificateReady,
      blockerCodes,
      lastAppliedSequenceByStream: tailsFromSeenEvents(state.seenEvents),
    },
    artifactIndex: {
      ...state.artifactIndex,
      artifacts: normalizedArtifacts(state.artifactIndex.artifacts, state.common),
      derivedRankings: rankings,
    },
  };
  const nextModeState = modeState(
    derivedBase,
    certificateState,
    certificateReady,
    hardVetoCodes,
  );
  const transition: SkillBenchmarkStatusTransition = {
    state: nextModeState,
    producerEventId: event.event_id,
    producerStem: event.payload.stem,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
    reasonCode: hardVetoCodes[0] ?? null,
  };
  const provenance = [...state.modeStatus.provenance, transition];
  return {
    ...derivedBase,
    modeStatus: {
      state: nextModeState,
      scoringState,
      certificateState,
      compatibilityState,
      blockingVetoCodes: hardVetoCodes,
      terminal: nextModeState === 'expired'
        || nextModeState === 'withheld'
        || nextModeState === 'aborted'
        || nextModeState === 'incomplete',
      provenance,
    },
  };
}

function advanceCursors(
  cursors: SkillBenchmarkProjectionState['cursors'],
  event: SkillBenchmarkLedgerEvent,
): SkillBenchmarkProjectionState['cursors'] {
  const planes = SKILL_BENCHMARK_EVENT_ROUTING[event.payload.stem];
  return {
    common: planes.includes('common')
      ? replaceTail(cursors.common, event)
      : [...cursors.common],
    iterationConvergence: planes.includes('iterationConvergence')
      ? replaceTail(cursors.iterationConvergence, event)
      : [...cursors.iterationConvergence],
    artifactIndex: planes.includes('artifactIndex')
      ? replaceTail(cursors.artifactIndex, event)
      : [...cursors.artifactIndex],
    modeStatus: planes.includes('modeStatus')
      ? replaceTail(cursors.modeStatus, event)
      : [...cursors.modeStatus],
  };
}

function assertLegalTerminalTransition(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
): void {
  if (state.modeStatus.certificateState === 'expired') {
    throw new SkillBenchmarkReducerError(
      'impossible-status-transition',
      'Expired Skill Benchmark projections accept no later events',
      'modeStatus.certificateState',
    );
  }
  if (state.modeStatus.certificateState === 'withheld') {
    throw new SkillBenchmarkReducerError(
      'impossible-status-transition',
      'Withheld certificate decisions are terminal in this reducer version',
      'modeStatus.certificateState',
    );
  }
  if (state.modeStatus.certificateState === 'issued'
    && event.payload.stem !== 'skill_benchmark.effect_certificate_expired') {
    throw new SkillBenchmarkReducerError(
      'impossible-status-transition',
      'Issued certificates accept only a typed expiry transition',
      'modeStatus.certificateState',
    );
  }
  if ((state.run.state === 'closed'
    || state.run.state === 'incomplete'
    || state.run.state === 'aborted')
    && isSkillBenchmarkSpecificEventStem(event.payload.stem)
    && !event.payload.stem.startsWith('skill_benchmark.effect_certificate_')) {
    throw new SkillBenchmarkReducerError(
      'impossible-status-transition',
      'Closed runs accept only typed certificate disposition events',
      'run.state',
    );
  }
}

function applyEvent(
  state: SkillBenchmarkProjectionState,
  event: SkillBenchmarkLedgerEvent,
  verified?: VerifiedLedgerEvent,
): SkillBenchmarkProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertLegalTerminalTransition(state, event);
  assertRunIdentity(state, event);
  const withSeen: SkillBenchmarkProjectionState = { ...state, seenEvents };
  assertEventReferences(withSeen, event);

  let common = state.common;
  if (isDeepImprovementCommonEventStem(event.payload.stem)) {
    const verifiedCommon = verified ?? verifiedBoundaryFromTypedEvent(event);
    // The common schema guard and reducer surface own this transport boundary.
    const commonResult = DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.reducerSurface.reduce(
      verifiedCommon,
      common as unknown as Parameters<
        typeof DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.reducerSurface.reduce
      >[1],
    );
    common = commonResult.state as DeepImprovementCommonProjectionState;
  }

  const run = foldRun(state.run, event);
  const scenarios = foldScenarios({ ...withSeen, common }, event);
  const artifacts = artifactsFromEvent(state.artifactIndex.artifacts, event);
  const rawMeasurements = rawMeasurementsFromEvent(
    state.artifactIndex.rawMeasurements,
    event,
  );
  const hardVetoes = specificVetoesFromEvent(
    state.iterationConvergence.hardVetoes,
    event,
  );
  const interim: SkillBenchmarkProjectionState = {
    ...state,
    common,
    run,
    iterationConvergence: {
      ...state.iterationConvergence,
      scenarios,
      hardVetoes,
    },
    artifactIndex: {
      ...state.artifactIndex,
      artifacts,
      rawMeasurements,
    },
    cursors: advanceCursors(state.cursors, event),
    seenEvents,
  };
  const next = refreshDerivedState(interim, event);
  assertSkillBenchmarkProjectionState(next);
  return immutableProjectionClone(next) as SkillBenchmarkProjectionState;
}

export type SkillBenchmarkReducerSurface = Pick<
  ModeContract<SkillBenchmarkModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified union event through the shared mode signature. */
export function reduceSkillBenchmarkVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<SkillBenchmarkModeContractState>,
): ModeReductionResult<SkillBenchmarkModeContractState> {
  assertSkillBenchmarkProjectionState(state);
  const event = typedEventFromVerified(verified);
  const orderingReason = orderingFailure([event], {
    projection: state,
    integrityDigest: checkpointIntegrityDigest(
      state,
      tailsFromSeenEvents(state.seenEvents),
    ),
    sourceTails: tailsFromSeenEvents(state.seenEvents),
  });
  if (orderingReason !== null) {
    throw new SkillBenchmarkReducerError(
      'event-order-invalid',
      `Verified event violates ${orderingReason}`,
      'stream_sequence',
    );
  }
  const next = applyEvent(state, event, verified);
  return Object.freeze({
    reducerId: SKILL_BENCHMARK_REDUCER_ID,
    stateVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const SKILL_BENCHMARK_REDUCER_SURFACE:
SkillBenchmarkReducerSurface = Object.freeze({
  reducers: SKILL_BENCHMARK_REDUCER_SET,
  reduce: reduceSkillBenchmarkVerifiedEvent,
});

function assertReducerOwnership(
  reducers: ModeReducerSet<SkillBenchmarkModeContractState>,
): void {
  const declared = [...reducers.persistedFields].sort(compareString);
  const expected = [...PERSISTED_FIELDS].sort(compareString);
  if (!sameCanonical(declared, expected)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed Skill Benchmark projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      const existing = owners.get(field);
      if (existing !== undefined) {
        throw new SkillBenchmarkReducerError(
          'duplicate-owner',
          `Projection field ${field} is owned by both ${existing} and ${definition.reducerId}`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  for (const field of PERSISTED_FIELDS) {
    if (!owners.has(field)) {
      throw new SkillBenchmarkReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

/** Probe the real reducer signature for determinism, immutability, and ownership. */
export function verifySkillBenchmarkReducerSurface(
  surface: SkillBenchmarkReducerSurface,
  event: VerifiedLedgerEvent,
  state: SkillBenchmarkProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  assertSkillBenchmarkProjectionState(state);
  const firstInput = immutableProjectionClone(state) as SkillBenchmarkProjectionState;
  const secondInput = immutableProjectionClone(state) as SkillBenchmarkProjectionState;
  const initialDigest = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertSkillBenchmarkProjectionState(first.state);
  assertSkillBenchmarkProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state) || !isDeepFrozenProjection(second.state)) {
    throw new SkillBenchmarkReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initialDigest
    || canonicalJson(secondInput) !== initialDigest) {
    throw new SkillBenchmarkReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input state',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new SkillBenchmarkReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new SkillBenchmarkReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const unowned = topLevelChangedFields(state, first.state).find(
    (field) => !definition.ownedFields.includes(field),
  );
  if (unowned !== undefined) {
    throw new SkillBenchmarkReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

/** Derive a deterministic integrity digest without feeding output into the fold. */
export function skillBenchmarkProjectionIntegrityDigest(
  projection: SkillBenchmarkProjectionState,
): string {
  assertSkillBenchmarkProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    codecVersion: SKILL_BENCHMARK_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: SKILL_BENCHMARK_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function checkpointIntegrityDigest(
  projection: SkillBenchmarkProjectionState,
  sourceTails: readonly SkillBenchmarkStreamTail[],
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: skillBenchmarkProjectionIntegrityDigest(projection),
    sourceTails,
  }));
}

function rebuildReasons(
  options: SkillBenchmarkFoldOptions,
): SkillBenchmarkRebuildReasonCode[] {
  const reasons: SkillBenchmarkRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion !== SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== SKILL_BENCHMARK_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion !== SKILL_BENCHMARK_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion !== SKILL_BENCHMARK_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertSkillBenchmarkProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return sortStrings(reasons) as SkillBenchmarkRebuildReasonCode[];
    }
    if (checkpoint.projection.schemaVersion !== SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion !== SKILL_BENCHMARK_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion !== SKILL_BENCHMARK_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion
      !== SKILL_BENCHMARK_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    const projectedTails = tailsFromSeenEvents(checkpoint.projection.seenEvents);
    if (!sameCanonical(projectedTails, checkpoint.sourceTails)
      || checkpoint.integrityDigest !== checkpointIntegrityDigest(
        checkpoint.projection,
        checkpoint.sourceTails,
      )) {
      reasons.push('checkpoint-digest-mismatch');
    }
  }
  return [...new Set(reasons)].sort(compareString);
}

function compareEvents(
  left: SkillBenchmarkLedgerEvent,
  right: SkillBenchmarkLedgerEvent,
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

function orderingFailure(
  events: readonly SkillBenchmarkLedgerEvent[],
  checkpoint: SkillBenchmarkProjectionCheckpoint | undefined,
): SkillBenchmarkRebuildReasonCode | null {
  const tails = new Map(
    (checkpoint?.sourceTails ?? []).map((tail) => [tail.streamId, tail]),
  );
  const known = new Map(
    checkpoint?.projection.seenEvents.map((event) => [
      event.eventId,
      event.eventDigest,
    ]) ?? [],
  );
  const sequenceOwners = new Map<string, string>();
  for (const event of checkpoint?.projection.seenEvents ?? []) {
    sequenceOwners.set(`${event.streamId}:${event.streamSequence}`, event.eventId);
  }
  for (const event of events) {
    const digest = eventDigest(event);
    const existing = known.get(event.event_id);
    if (existing !== undefined) {
      if (existing !== digest) {
        throw new SkillBenchmarkReducerError(
          'duplicate-event-conflict',
          'A persisted event identity cannot resolve to different canonical bytes',
          'seenEvents',
        );
      }
      continue;
    }
    const sequenceKey = `${event.stream_id}:${event.stream_sequence}`;
    const sequenceOwner = sequenceOwners.get(sequenceKey);
    if (sequenceOwner !== undefined && sequenceOwner !== event.event_id) {
      return 'event-order-invalid';
    }
    const tail = tails.get(event.stream_id);
    const expectedSequence = (tail?.sequence ?? 0) + 1;
    if (event.stream_sequence < expectedSequence) return 'event-order-invalid';
    if (event.stream_sequence > expectedSequence) return 'cursor-gap';
    const expectedPreviousHash = tail?.eventDigest ?? ZERO_DIGEST;
    if (event.payload.prevEventHash !== expectedPreviousHash) {
      return 'event-order-invalid';
    }
    const nextTail = tailForEvent(event);
    tails.set(event.stream_id, nextTail);
    known.set(event.event_id, digest);
    sequenceOwners.set(sequenceKey, event.event_id);
  }
  return null;
}

function projectedResult(
  projection: SkillBenchmarkProjectionState,
): SkillBenchmarkProjectedResult {
  const integrityDigest = skillBenchmarkProjectionIntegrityDigest(projection);
  const sourceTails = tailsFromSeenEvents(projection.seenEvents);
  const checkpoint: SkillBenchmarkProjectionCheckpoint = {
    projection,
    integrityDigest: checkpointIntegrityDigest(projection, sourceTails),
    sourceTails,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest,
    checkpoint,
  }) as SkillBenchmarkProjectedResult;
}

/** Fold the typed union after canonical sorting and per-stream gap validation. */
export function foldSkillBenchmarkEvents(
  events: readonly SkillBenchmarkLedgerEvent[],
  options: SkillBenchmarkFoldOptions = {},
): SkillBenchmarkFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze(reasons),
    });
  }
  const validated = events.map(validateTypedEvent).sort(compareEvents);
  const orderingReason = orderingFailure(validated, options.checkpoint);
  if (orderingReason !== null) {
    return Object.freeze({
      outcome: 'rebuild_required',
      reasonCodes: Object.freeze([orderingReason]),
    });
  }
  let projection = options.checkpoint?.projection
    ?? createSkillBenchmarkProjectionState();
  for (const event of validated) projection = applyEvent(projection, event);
  return projectedResult(projection);
}

/** Project the full comparison contract without granting authority. */
export function projectSkillBenchmarkLegacyView(
  projection: SkillBenchmarkProjectionState,
): SkillBenchmarkLegacyProjection {
  assertSkillBenchmarkProjectionState(projection);
  const legacy: SkillBenchmarkLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    common: projectDeepImprovementCommonLegacyView(projection.common),
    runState: projection.run.state,
    modeState: projection.modeStatus.state,
    scoringState: projection.modeStatus.scoringState,
    certificateState: projection.modeStatus.certificateState,
    collectionComplete: projection.iterationConvergence.collectionComplete,
    scoringComplete: projection.iterationConvergence.scoringComplete,
    certificateReady: projection.iterationConvergence.certificateReady,
    scenarioCount: projection.iterationConvergence.scenarios.length,
    rawMeasurementCount: projection.artifactIndex.rawMeasurements.length,
    rankings: projection.artifactIndex.derivedRankings.map(
      (ranking) => ({ ...ranking, blockingVetoCodes: [...ranking.blockingVetoCodes] }),
    ),
    blockerCodes: [...projection.iterationConvergence.blockerCodes],
  };
  assertSkillBenchmarkLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as SkillBenchmarkLegacyProjection;
}
