// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Component Registry
// ───────────────────────────────────────────────────────────────────

import {
  validateEventTypeNamespace,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  assertDeterministicReplayInputKey,
  assertReplayFingerprintIdentity,
} from './canonical-descriptor.js';
import {
  ReplayFingerprintError,
  ReplayFingerprintErrorCodes,
} from './replay-fingerprint-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ReplayComponentDefinition,
  ReplayInputSource,
} from './replay-fingerprint-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function componentKey(
  reducerId: string,
  reducerVersion: string,
  projectionSchemaVersion: string,
): string {
  return [reducerId, reducerVersion, projectionSchemaVersion].join('\u0000');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function normalizeReplayInputSource(
  key: string,
  source: unknown,
): ReplayInputSource {
  if (!isRecord(source)) {
    throw new ReplayFingerprintError(
      ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
      'replay_input',
      'Replay input sources must be registered content or ledger addresses',
      { stage: 'replay-input-source' },
    );
  }
  if (source.kind === 'content-addressed') {
    try {
      return Object.freeze({
        kind: 'content-addressed',
        value: immutableJsonClone(source.value as JsonValue),
      });
    } catch {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
        'replay_input',
        'Content-addressed replay input is not canonical JSON content',
        { stage: 'replay-input-source-' + key },
      );
    }
  }
  if (
    source.kind === 'ledger-event'
    && Number.isSafeInteger(source.sequence)
    && (source.sequence as number) > 0
    && typeof source.eventType === 'string'
    && typeof source.payloadField === 'string'
  ) {
    assertDeterministicReplayInputKey(source.payloadField);
    return Object.freeze({
      kind: 'ledger-event',
      sequence: source.sequence as number,
      eventType: validateEventTypeNamespace(source.eventType),
      payloadField: source.payloadField,
    });
  }
  throw new ReplayFingerprintError(
    ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
    'replay_input',
    'Replay input source is incomplete or is not ledger/content-addressed',
    { stage: 'replay-input-source-' + key },
  );
}

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Exact registry for reducers, schemas, and ledger-addressed replay inputs. */
export class ReplayComponentRegistry<TState extends JsonObject> {
  readonly #definitions: ReadonlyMap<string, ReplayComponentDefinition<TState>>;

  public constructor(definitions: readonly ReplayComponentDefinition<TState>[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.REPLAY_COMPONENT_UNREGISTERED,
        'reducer',
        'Replay component registry requires at least one exact reducer contract',
        { stage: 'replay-component-registry' },
      );
    }
    const registered = new Map<string, ReplayComponentDefinition<TState>>();
    for (const definition of definitions) {
      const reducerId = assertReplayFingerprintIdentity(
        definition.reducerId,
        'reducer_id',
      );
      const reducerVersion = assertReplayFingerprintIdentity(
        definition.reducerVersion,
        'reducer_version',
      );
      const projectionSchemaVersion = assertReplayFingerprintIdentity(
        definition.projectionSchemaVersion,
        'projection_schema_version',
      );
      if (
        !(definition.reducerRegistry instanceof TypedReducerRegistry)
        || !Array.isArray(definition.requiredReplayInputKeys)
      ) {
        throw new ReplayFingerprintError(
          ReplayFingerprintErrorCodes.REPLAY_COMPONENT_UNREGISTERED,
          'reducer',
          'Replay component definition is incomplete',
          { stage: 'replay-component-definition' },
        );
      }
      const requiredReplayInputKeys = [...definition.requiredReplayInputKeys];
      requiredReplayInputKeys.forEach(assertDeterministicReplayInputKey);
      if (
        new Set(requiredReplayInputKeys).size !== requiredReplayInputKeys.length
        || !requiredReplayInputKeys.includes(INITIAL_STATE_REPLAY_INPUT)
      ) {
        throw new ReplayFingerprintError(
          ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
          'replay_input',
          'Replay component inputs must be unique and content-address the initial state',
          { stage: 'required-replay-inputs' },
        );
      }
      const externalReplayInputKeys = requiredReplayInputKeys.filter(
        (key) => key !== INITIAL_STATE_REPLAY_INPUT,
      );
      const candidateSources = definition.replayInputSources ?? {};
      const sourceKeys = Object.keys(candidateSources);
      if (
        sourceKeys.length !== externalReplayInputKeys.length
        || sourceKeys.some((key) => !externalReplayInputKeys.includes(key))
        || externalReplayInputKeys.some((key) => !sourceKeys.includes(key))
        || (externalReplayInputKeys.length > 0 && typeof definition.bindReplayInputs !== 'function')
      ) {
        throw new ReplayFingerprintError(
          ReplayFingerprintErrorCodes.NONDETERMINISTIC_INPUT,
          'replay_input',
          'Every non-initial replay input requires one registered source and reducer binding',
          { stage: 'replay-input-provenance' },
        );
      }
      const replayInputSources: Record<string, ReplayInputSource> = Object.create(null);
      for (const key of externalReplayInputKeys) {
        replayInputSources[key] = normalizeReplayInputSource(key, candidateSources[key]);
      }
      const key = componentKey(reducerId, reducerVersion, projectionSchemaVersion);
      if (registered.has(key)) {
        throw new ReplayFingerprintError(
          ReplayFingerprintErrorCodes.REPLAY_COMPONENT_UNREGISTERED,
          'reducer',
          'Replay component registry contains an ambiguous duplicate identity',
          { stage: 'replay-component-duplicate' },
        );
      }
      registered.set(key, Object.freeze({
        reducerId,
        reducerVersion,
        projectionSchemaVersion,
        requiredReplayInputKeys: Object.freeze(requiredReplayInputKeys),
        reducerRegistry: definition.reducerRegistry,
        replayInputSources: Object.freeze(replayInputSources),
        ...(definition.bindReplayInputs
          ? { bindReplayInputs: definition.bindReplayInputs }
          : {}),
      }));
    }
    this.#definitions = registered;
    Object.freeze(this);
  }

  /** Resolve one complete reducer/schema contract or reject replay. */
  public resolve(
    reducerId: string,
    reducerVersion: string,
    projectionSchemaVersion: string,
  ): ReplayComponentDefinition<TState> {
    const definition = this.#definitions.get(
      componentKey(reducerId, reducerVersion, projectionSchemaVersion),
    );
    if (!definition) {
      throw new ReplayFingerprintError(
        ReplayFingerprintErrorCodes.REPLAY_COMPONENT_UNREGISTERED,
        'reducer',
        'Replay reducer or projection schema is not registered',
        { stage: 'replay-component-resolution' },
      );
    }
    return definition;
  }
}
