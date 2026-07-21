// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Fixture Corpus
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { compileParityCaseManifest } from '../shadow-parity/index.js';
import {
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
} from './mixed-version-types.js';

import type { EventEnvelope, JsonObject } from '../event-envelope/index.js';
import type {
  AuthoredMixedVersionOutcome,
  MixedVersionCase,
  MixedVersionCorpus,
  MixedVersionEventInput,
  MixedVersionRestartMetadata,
  MixedVersionScenarioFamily,
} from './mixed-version-types.js';

export const PHASE_013_WORKSTREAMS = Object.freeze([
  '001-deep-research',
  '002-deep-review',
  '003-deep-ai-council',
  '004-deep-improvement-common',
  '005-agent-improvement',
  '006-model-benchmark',
  '007-skill-benchmark',
  '008-deep-alignment',
] as const);

export const MIXED_VERSION_SCENARIOS = Object.freeze([
  'pure-old',
  'pure-new',
  'mid-upgrade',
  'interrupted-migration',
] as const satisfies readonly MixedVersionScenarioFamily[]);

export const MIXED_VERSION_BASE_SHA = 'fe6ca3030917073f3b478bc044e10034dcc4394b';
export const MIXED_VERSION_INTERFACE_VERSION = '1.0.0';
export const MIXED_VERSION_EVENT_TYPE = 'deep-loop.fixture.transition-recorded';
export const MIXED_VERSION_CONTRACT_DIGEST = sha256Bytes(canonicalBytes({
  fixtureSchemaVersion: 1,
  interfaceVersion: MIXED_VERSION_INTERFACE_VERSION,
  eventType: MIXED_VERSION_EVENT_TYPE,
  stateFamily: 'deep-loop.fixture',
  stateRecordType: 'run-state',
  authority: 'legacy-authoritative',
}));

const SOURCE_CONTRACT_IDENTITIES = Object.freeze([
  'sealed-reference-artifacts@1',
  'compatibility-shadow@1',
  'shadow-parity@1',
  'inflight-state-classification@1',
  `shared-mode-interface@${MIXED_VERSION_INTERFACE_VERSION}`,
]);

const AUTHORED_OUTCOMES: Readonly<
  Record<MixedVersionScenarioFamily, AuthoredMixedVersionOutcome>
> = Object.freeze({
  'pure-old': Object.freeze({
    provenance: 'authored-contract-evidence',
    acceptedEventIds: ['pure-old-event-1'],
    rejectedEventIds: [],
    stateTransitions: [{ from: 'seed', eventId: 'pure-old-event-1', to: 'complete' }],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
    eventHopTrace: [['1->2', '2->3']],
    stateHopTrace: ['1->2', '2->3'],
  }),
  'pure-new': Object.freeze({
    provenance: 'authored-contract-evidence',
    acceptedEventIds: ['pure-new-event-1'],
    rejectedEventIds: [],
    stateTransitions: [{ from: 'seed', eventId: 'pure-new-event-1', to: 'complete' }],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
    eventHopTrace: [[]],
    stateHopTrace: [],
  }),
  'mid-upgrade': Object.freeze({
    provenance: 'authored-contract-evidence',
    acceptedEventIds: ['mid-upgrade-event-1', 'mid-upgrade-event-2'],
    rejectedEventIds: [],
    stateTransitions: [
      { from: 'seed', eventId: 'mid-upgrade-event-1', to: 'prepared' },
      { from: 'prepared', eventId: 'mid-upgrade-event-2', to: 'complete' },
    ],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
    eventHopTrace: [['1->2', '2->3'], []],
    stateHopTrace: [],
  }),
  'interrupted-migration': Object.freeze({
    provenance: 'authored-contract-evidence',
    acceptedEventIds: ['interrupted-migration-event-1'],
    rejectedEventIds: [],
    stateTransitions: [
      { from: 'seed', eventId: 'interrupted-migration-event-1', to: 'paused' },
    ],
    terminalResult: 'blocked-for-classification',
    pendingEffects: ['effect-pending'],
    receipts: ['effect-accepted-receipt'],
    effectExecutions: ['effect-accepted'],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: 'pin-legacy',
    eventHopTrace: [[]],
    stateHopTrace: ['1->2', '2->3'],
  }),
});

function modeFor(workstream: string): string {
  return workstream.replace(/^\d{3}-/, '');
}

function payloadFor(version: number, step: string): JsonObject {
  if (version === 1) return { step };
  return { step, status: 'accepted', category: 'workflow' };
}

function eventInput(
  workstream: string,
  scenario: MixedVersionScenarioFamily,
  version: number,
  position: number,
): MixedVersionEventInput {
  const eventId = `${scenario}-event-${position + 1}`;
  const timestamp = '2026-07-21T00:00:00.000Z';
  const envelope: EventEnvelope = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: MIXED_VERSION_EVENT_TYPE,
    event_version: version,
    stream_id: `${workstream}-stream`,
    stream_sequence: position + 1,
    occurred_at: timestamp,
    recorded_at: timestamp,
    producer: { name: 'mixed-version-fixtures', version: '1.0.0' },
    authority_epoch: 1,
    correlation_id: `${workstream}-${scenario}`,
    causation_id: position === 0 ? null : `${scenario}-event-${position}`,
    idempotency_key: `${workstream}-${scenario}-${position + 1}`,
    payload: payloadFor(version, position === 0 ? 'prepare' : 'complete'),
  };
  return {
    eventId,
    storedVersion: version,
    causalPosition: position,
    serializedEnvelope: canonicalJson(envelope),
  };
}

function versionsFor(scenario: MixedVersionScenarioFamily): Readonly<{
  eventVersions: number[];
  stateVersion: number;
}> {
  switch (scenario) {
    case 'pure-old':
      return { eventVersions: [1], stateVersion: 1 };
    case 'pure-new':
      return { eventVersions: [3], stateVersion: 3 };
    case 'mid-upgrade':
      return { eventVersions: [1, 3], stateVersion: 3 };
    case 'interrupted-migration':
      return { eventVersions: [3], stateVersion: 1 };
  }
}

function stateBytes(workstream: string, version: number): string {
  const base = {
    family: 'deep-loop.fixture',
    record_type: 'run-state',
    state_id: `${workstream}-state`,
    state_version: version,
    step: 'seed',
  };
  return canonicalJson(version === 1
    ? base
    : { ...base, status: 'accepted', category: 'workflow' });
}

function buildCase(
  workstream: string,
  scenarioFamily: MixedVersionScenarioFamily,
): MixedVersionCase {
  const { eventVersions, stateVersion } = versionsFor(scenarioFamily);
  const events = eventVersions.map((version, position) =>
    eventInput(workstream, scenarioFamily, version, position));
  const boundarySequence = scenarioFamily === 'mid-upgrade' ? 2 : 1;
  const caseId = `${workstream}.${scenarioFamily}`;
  const state = {
    stateId: `${workstream}-state`,
    storedVersion: stateVersion,
    serializedState: stateBytes(workstream, stateVersion),
  };
  const restartMetadata: MixedVersionRestartMetadata =
    scenarioFamily === 'interrupted-migration'
    ? {
        stopSequence: 1,
        pendingEffects: ['effect-pending'],
        receipts: [{
          effectId: 'effect-pending',
          receiptId: 'effect-accepted-receipt',
        }],
        leases: [{ leaseId: 'lease-1', fencingToken: 7, state: 'quiescent' }],
        continuityId: `${workstream}-${scenarioFamily}-continuity`,
      }
    : {
        stopSequence: null,
        pendingEffects: [],
        receipts: [],
        leases: [],
        continuityId: null,
      };
  return Object.freeze({
    fixtureSchemaVersion: 1,
    caseId,
    workstream,
    mode: modeFor(workstream),
    scenarioFamily,
    interfaceVersion: MIXED_VERSION_INTERFACE_VERSION,
    eventVersions,
    stateVersion,
    causalBoundary: {
      runId: `${workstream}-run`,
      streamId: `${workstream}-stream`,
      authorityEpoch: 1,
      correlationId: `${workstream}-${scenarioFamily}`,
      boundarySequence,
      continuityId: `${workstream}-${scenarioFamily}-continuity`,
    },
    events,
    state,
    comparableVersionPair: `${eventVersions[0]}:${stateVersion}`,
    sourceContractIdentities: [...SOURCE_CONTRACT_IDENTITIES],
    replayInputs: {
      prompts: { prompts: [`Run ${workstream} under ${scenarioFamily}`] },
      initialState: state,
      configuration: { mode: modeFor(workstream), liveEffects: false },
      evaluatorMaterial: { rubric: 'mixed-version-contract', version: 1 },
      priorOutputs: { artifacts: [], terminalResult: null },
      versionPolicy: {
        eventCurrentVersion: 3,
        stateCurrentVersion: 3,
        adjacentOnly: true,
        eventVersionIndependentFromStateVersion: true,
      },
      environment: {
        timezone: 'UTC',
        locale: 'en-US',
        featureFlags: [],
      },
      eventStream: events,
      restartMetadata,
    },
    expected: AUTHORED_OUTCOMES[scenarioFamily],
  });
}

function buildAuthoredCases(): readonly MixedVersionCase[] {
  return Object.freeze(PHASE_013_WORKSTREAMS.flatMap((workstream) =>
    MIXED_VERSION_SCENARIOS.map((scenario) => buildCase(workstream, scenario))));
}

const AUTHORED_CASES = buildAuthoredCases();
const AUTHORED_CASE_DIGESTS = new Map(AUTHORED_CASES.map((fixture) => [
  fixture.caseId,
  sha256Bytes(canonicalBytes(fixture)),
]));

/** Reject corpus construction when the ordered mode manifest has drifted. */
export function assertManifestWorkstreamCoverage(
  manifestWorkstreams: readonly string[],
): void {
  if (canonicalJson(manifestWorkstreams) !== canonicalJson(PHASE_013_WORKSTREAMS)) {
    throw new MixedVersionFixtureError(
      MixedVersionFixtureErrorCodes.MANIFEST_DRIFT,
      'manifest-coverage',
      'Fixture workstreams must exactly match the ordered phase manifest rows',
    );
  }
}

/** Prove a case still has the exact authored bytes pinned by this corpus. */
export function assertAuthoredMixedVersionCase(fixture: MixedVersionCase): void {
  const expectedDigest = AUTHORED_CASE_DIGESTS.get(fixture.caseId);
  const actualDigest = sha256Bytes(canonicalBytes(fixture));
  if (
    fixture.expected.provenance !== 'authored-contract-evidence'
    || expectedDigest === undefined
    || expectedDigest !== actualDigest
  ) {
    throw new MixedVersionFixtureError(
      MixedVersionFixtureErrorCodes.FIXTURE_REBASELINE,
      'fixture-authorship',
      'Fixture bytes differ from the authored contract-evidence corpus',
    );
  }
}

/** Expand the four authored scenarios over the exact ordered mode manifest. */
export function createMixedVersionCorpus(
  manifestWorkstreams: readonly string[],
): MixedVersionCorpus {
  assertManifestWorkstreamCoverage(manifestWorkstreams);
  const cases = AUTHORED_CASES.map((fixture) => {
    assertAuthoredMixedVersionCase(fixture);
    return fixture;
  });
  const parityManifest = compileParityCaseManifest({
    baseSha: MIXED_VERSION_BASE_SHA,
    baselineRows: cases.map((fixture) => ({
      scenarioId: fixture.caseId,
      mode: fixture.mode,
      contractDigest: MIXED_VERSION_CONTRACT_DIGEST,
      disposition: 'protected' as const,
    })),
    cases: cases.map((fixture) => ({
      caseId: fixture.caseId,
      scenarioId: fixture.caseId,
      mode: fixture.mode,
      contractDigest: MIXED_VERSION_CONTRACT_DIGEST,
      requiredObservations: [
        'terminal-status' as const,
        'ordered-transitions' as const,
        'effect-receipts' as const,
        'emitted-artifacts' as const,
      ],
      projectionIds: ['legacy-mode-output'],
      timeoutMs: 5_000,
      terminationPolicy: 'fixture-terminal',
    })),
  });
  return Object.freeze({
    workstreams: Object.freeze([...manifestWorkstreams]),
    cases: Object.freeze(cases),
    parityManifest,
  });
}
