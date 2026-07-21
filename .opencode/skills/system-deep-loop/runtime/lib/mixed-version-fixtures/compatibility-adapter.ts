// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Compatibility Adapter
// ───────────────────────────────────────────────────────────────────

import {
  CompatibilityError,
  CompatibilityErrorCodes,
  StateUpcasterRegistry,
  readCompatibilityEvent,
  requireExplicitStateVersion,
} from '../compatibility-shadow/index.js';
import { EventTypeRegistry } from '../event-envelope/index.js';
import {
  MIXED_VERSION_EVENT_TYPE,
} from './fixture-corpus.js';
import {
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
} from './mixed-version-types.js';

import type {
  StateRecordCodec,
  StateRecordTypeDefinition,
  StateUpcastOutcome,
  VersionedStateRecord,
} from '../compatibility-shadow/index.js';
import type {
  EventEnvelope,
  EventTypeDefinition,
  JsonObject,
  UpcastOutcome,
} from '../event-envelope/index.js';
import type {
  MixedVersionCase,
  MixedVersionCompatibilityObservation,
  MixedVersionCompatibilityPort,
} from './mixed-version-types.js';

const STATE_FAMILY = 'deep-loop.fixture';
const STATE_RECORD_TYPE = 'run-state';
const SUPPORTED_VERSION_PAIRS = new Set(['1:1', '1:3', '3:1', '3:3']);

function stateRecord(
  stateVersion: number,
  identity: JsonObject,
  payload: JsonObject,
): VersionedStateRecord {
  return {
    family: STATE_FAMILY,
    recordType: STATE_RECORD_TYPE,
    stateVersion,
    identity,
    payload,
  };
}

function upcastEventOneToTwo(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 2,
      payload: { ...event.payload, status: 'accepted' },
    },
    sourceFieldMap: { step: 'step' },
    introducedFields: {
      status: { kind: 'default', provenance: 'Historical fixture transitions were accepted' },
    },
  };
}

function upcastEventTwoToThree(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 3,
      payload: { ...event.payload, category: 'workflow' },
    },
    sourceFieldMap: { step: 'step', status: 'status' },
    introducedFields: {
      category: { kind: 'derived', provenance: 'The fixture event namespace is workflow-scoped' },
    },
  };
}

/** Build the governed three-version event chain used by the sealed corpus. */
export function createMixedVersionEventDefinition(): EventTypeDefinition {
  return {
    eventType: MIXED_VERSION_EVENT_TYPE,
    currentVersion: 3,
    versions: [
      {
        version: 1,
        payload: {
          requiredFields: ['step'],
          validate: (payload) => typeof payload.step === 'string',
        },
      },
      {
        version: 2,
        payload: {
          requiredFields: ['step', 'status'],
          validate: (payload) =>
            typeof payload.step === 'string' && typeof payload.status === 'string',
        },
      },
      {
        version: 3,
        payload: {
          requiredFields: ['step', 'status', 'category'],
          validate: (payload) =>
            typeof payload.step === 'string'
            && typeof payload.status === 'string'
            && typeof payload.category === 'string',
        },
      },
    ],
    upcasters: [
      {
        identity: 'deep-loop.fixture.transition-recorded@1-to-2',
        fromVersion: 1,
        toVersion: 2,
        upcast: upcastEventOneToTwo,
      },
      {
        identity: 'deep-loop.fixture.transition-recorded@2-to-3',
        fromVersion: 2,
        toVersion: 3,
        upcast: upcastEventTwoToThree,
      },
    ],
  };
}

function upcastStateOneToTwo(record: Readonly<VersionedStateRecord>): StateUpcastOutcome {
  return {
    record: stateRecord(2, record.identity, {
      ...record.payload,
      status: 'accepted',
    }),
    sourceFieldMap: { step: 'step' },
    introducedFields: {
      status: { kind: 'default', provenance: 'Historical fixture state was accepted' },
    },
  };
}

function upcastStateTwoToThree(record: Readonly<VersionedStateRecord>): StateUpcastOutcome {
  return {
    record: stateRecord(3, record.identity, {
      ...record.payload,
      category: 'workflow',
    }),
    sourceFieldMap: { step: 'step', status: 'status' },
    introducedFields: {
      category: { kind: 'derived', provenance: 'The fixture state family is workflow-scoped' },
    },
  };
}

/** Build the governed three-version state chain used by the sealed corpus. */
export function createMixedVersionStateDefinition(): StateRecordTypeDefinition {
  const identity = { stateId: 'fixture-state' };
  return {
    family: STATE_FAMILY,
    recordType: STATE_RECORD_TYPE,
    currentVersion: 3,
    versions: [
      {
        version: 1,
        validate: (record) => typeof record.payload.step === 'string',
        fixture: stateRecord(1, identity, { step: 'seed' }),
      },
      {
        version: 2,
        validate: (record) =>
          typeof record.payload.step === 'string'
          && typeof record.payload.status === 'string',
        fixture: stateRecord(2, identity, { step: 'seed', status: 'accepted' }),
      },
      {
        version: 3,
        validate: (record) =>
          typeof record.payload.step === 'string'
          && typeof record.payload.status === 'string'
          && typeof record.payload.category === 'string',
        fixture: stateRecord(3, identity, {
          step: 'seed',
          status: 'accepted',
          category: 'workflow',
        }),
      },
    ],
    upcasters: [
      {
        identity: 'deep-loop.fixture.run-state@1-to-2',
        fromVersion: 1,
        toVersion: 2,
        upcast: upcastStateOneToTwo,
      },
      {
        identity: 'deep-loop.fixture.run-state@2-to-3',
        fromVersion: 2,
        toVersion: 3,
        upcast: upcastStateTwoToThree,
      },
    ],
  };
}

const STATE_CODEC: StateRecordCodec = {
  identity: 'deep-loop.fixture.run-state-codec@1',
  family: STATE_FAMILY,
  recordType: STATE_RECORD_TYPE,
  decode: (source) => {
    if (
      source.family !== STATE_FAMILY
      || source.record_type !== STATE_RECORD_TYPE
      || typeof source.state_id !== 'string'
    ) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.CODEC_REJECTED,
        'Stored fixture state discriminator is not admitted',
      );
    }
    const stateVersion = requireExplicitStateVersion(source, 'state_version');
    const identity = { stateId: source.state_id };
    if (stateVersion === 1) {
      return stateRecord(1, identity, { step: source.step });
    }
    if (stateVersion === 2) {
      return stateRecord(2, identity, { step: source.step, status: source.status });
    }
    return stateRecord(stateVersion, identity, {
      step: source.step,
      status: source.status,
      category: source.category,
    });
  },
};

/** Resolve stored event and state versions through the canonical compatibility registries. */
export class MixedVersionCompatibilityAdapter implements MixedVersionCompatibilityPort {
  readonly #eventRegistry: EventTypeRegistry;
  readonly #stateRegistry: StateUpcasterRegistry;

  public constructor(
    eventRegistry: EventTypeRegistry,
    stateRegistry: StateUpcasterRegistry,
  ) {
    this.#eventRegistry = eventRegistry;
    this.#stateRegistry = stateRegistry;
  }

  public observe(fixture: MixedVersionCase): MixedVersionCompatibilityObservation {
    const declaredEventVersions = fixture.events.map((event) => event.storedVersion);
    if (
      JSON.stringify(declaredEventVersions) !== JSON.stringify(fixture.eventVersions)
      || fixture.state.storedVersion !== fixture.stateVersion
    ) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.INVALID_FIXTURE,
        'version-declaration',
        'Event and state versions must be explicit and independently consistent',
      );
    }
    for (const eventVersion of declaredEventVersions) {
      if (!SUPPORTED_VERSION_PAIRS.has(`${eventVersion}:${fixture.stateVersion}`)) {
        throw new MixedVersionFixtureError(
          MixedVersionFixtureErrorCodes.UNSUPPORTED_VERSION_PAIR,
          'version-pair',
          'The explicit event and state version pair is unsupported',
        );
      }
    }

    const eventResults = fixture.events.map((event) => {
      const result = readCompatibilityEvent(event.serializedEnvelope, this.#eventRegistry);
      if (
        result.storedVersion !== event.storedVersion
        || result.stored.envelope.event_id !== event.eventId
      ) {
        throw new MixedVersionFixtureError(
          MixedVersionFixtureErrorCodes.INVALID_FIXTURE,
          'event-version',
          'Stored event bytes disagree with the independent fixture declaration',
        );
      }
      return result;
    });
    const stateResult = this.#stateRegistry.read(fixture.state.serializedState, STATE_CODEC);
    if (stateResult.storedVersion !== fixture.stateVersion) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.INVALID_FIXTURE,
        'state-version',
        'Stored state bytes disagree with the independent fixture declaration',
      );
    }
    return Object.freeze({
      eventStoredVersions: Object.freeze(eventResults.map((result) => result.storedVersion)),
      eventEffectiveVersions: Object.freeze(eventResults.map((result) => result.effectiveVersion)),
      eventHopTrace: Object.freeze(eventResults.map((result) => Object.freeze(
        result.hopTrace.map((hop) => `${hop.fromVersion}->${hop.toVersion}`),
      ))),
      eventSourceDigests: Object.freeze(eventResults.map((result) => result.stored.digest)),
      stateStoredVersion: stateResult.storedVersion,
      stateEffectiveVersion: stateResult.effectiveVersion,
      stateHopTrace: Object.freeze(
        stateResult.hopTrace.map((hop) => `${hop.fromVersion}->${hop.toVersion}`),
      ),
      stateSourceDigest: stateResult.stored.digest,
    });
  }
}

/** Create the fixture adapter with the authored adjacent-only registry definitions. */
export function createMixedVersionCompatibilityAdapter(): MixedVersionCompatibilityAdapter {
  return new MixedVersionCompatibilityAdapter(
    new EventTypeRegistry([createMixedVersionEventDefinition()]),
    new StateUpcasterRegistry([createMixedVersionStateDefinition()]),
  );
}
