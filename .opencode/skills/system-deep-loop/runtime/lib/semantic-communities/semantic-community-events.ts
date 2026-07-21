// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Community Ledger Events
// ───────────────────────────────────────────────────────────────────

import {
  TypedReducerRegistry,
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  createEmptySemanticCommunityProjection,
  projectSemanticClaimIncrementally,
} from './community-projection.js';
import {
  SEMANTIC_CLAIM_EVENT_TYPE,
  SEMANTIC_PROJECTION_SCHEMA_VERSION,
} from './semantic-community-types.js';

import type {
  LedgerHead,
  RebuiltProjection,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayComponentDefinition } from '../replay-fingerprint/index.js';
import type {
  SemanticClaimObservation,
  SemanticCommunityProjection,
  SemanticNamespaceRecord,
  SemanticProjectionConfig,
} from './semantic-community-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT TYPES
// ───────────────────────────────────────────────────────────────────

const OBSERVATION_FIELDS = [
  'projection_version',
  'config_digest',
  'claim',
  'candidate_assessments',
] as const;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

export interface SemanticObservationEnvelopeInput {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function validateObservationPayload(payload: Readonly<JsonObject>): boolean {
  if (
    typeof payload.projection_version !== 'string'
    || payload.projection_version.length === 0
    || typeof payload.config_digest !== 'string'
    || !HASH_PATTERN.test(payload.config_digest)
    || !isRecord(payload.claim)
    || !Array.isArray(payload.candidate_assessments)
  ) {
    return false;
  }
  try {
    canonicalBytes(payload);
    return true;
  } catch {
    return false;
  }
}

/** Return the typed definition callers add to their existing envelope registry. */
export function semanticClaimObservationEventDefinition(): EventTypeDefinition {
  return {
    eventType: SEMANTIC_CLAIM_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: OBSERVATION_FIELDS,
        validate: validateObservationPayload,
      },
    }],
    upcasters: [],
  };
}

/** Build a registry for isolated projection tests or append additional domain types. */
export function createSemanticCommunityEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
): EventTypeRegistry {
  return new EventTypeRegistry([
    ...additionalDefinitions,
    semanticClaimObservationEventDefinition(),
  ]);
}

function parseObservation(payload: Readonly<JsonObject>): SemanticClaimObservation {
  if (!validateObservationPayload(payload)) {
    throw new TypeError('Semantic claim observation payload is invalid');
  }
  return JSON.parse(canonicalJson(payload)) as SemanticClaimObservation;
}

/** Prepare one current event through the shipped schema-closed envelope boundary. */
export function prepareSemanticClaimObservationEvent(
  observation: SemanticClaimObservation,
  registry: EventTypeRegistry,
  envelope: SemanticObservationEnvelopeInput,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: envelope.eventId,
    event_type: SEMANTIC_CLAIM_EVENT_TYPE,
    event_version: 1,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: envelope.authorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: envelope.idempotencyKey,
    payload: observation,
  }, registry);
}

// ───────────────────────────────────────────────────────────────────
// 2. TYPED REDUCTION
// ───────────────────────────────────────────────────────────────────

/** Bind the community projector to one exact config-derived reducer version. */
export function createSemanticCommunityReducerRegistry(
  config: SemanticProjectionConfig,
): TypedReducerRegistry<SemanticCommunityProjection> {
  return new TypedReducerRegistry([{
    eventType: SEMANTIC_CLAIM_EVENT_TYPE,
    reducerVersion: config.projection_version,
    reduce: (state, event) => projectSemanticClaimIncrementally(
      state,
      parseObservation(event.effective.envelope.payload),
      config,
    ).projection,
  }]);
}

/** Fold only verified ledger events through the shipped deterministic reducer. */
export function rebuildSemanticCommunityProjectionFromLedger(
  events: readonly VerifiedLedgerEvent[],
  namespace: SemanticNamespaceRecord,
  config: SemanticProjectionConfig,
  ledgerHead: LedgerHead,
): RebuiltProjection<SemanticCommunityProjection> {
  const relevant = events.filter((verified) => (
    verified.event.effective.envelope.event_type === SEMANTIC_CLAIM_EVENT_TYPE
  ));
  return rebuildProjection(
    relevant,
    createEmptySemanticCommunityProjection(namespace, config),
    config.projection_version,
    ledgerHead,
    createSemanticCommunityReducerRegistry(config),
  );
}

/** Register config provenance so replay fingerprints bind every policy input. */
export function semanticCommunityReplayComponentDefinition(
  config: SemanticProjectionConfig,
): ReplayComponentDefinition<SemanticCommunityProjection> {
  return {
    reducerId: 'semantic-community-projector',
    reducerVersion: config.projection_version,
    projectionSchemaVersion: SEMANTIC_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state', 'semantic_projection_config'],
    reducerRegistry: createSemanticCommunityReducerRegistry(config),
    replayInputSources: {
      semantic_projection_config: {
        kind: 'content-addressed',
        value: config,
      },
    },
    bindReplayInputs: (inputs) => {
      const supplied = inputs.semantic_projection_config;
      if (canonicalJson(supplied) !== canonicalJson(config)) {
        throw new TypeError('Replay projection config does not match its registered digest');
      }
      return createSemanticCommunityReducerRegistry(config);
    },
  };
}
