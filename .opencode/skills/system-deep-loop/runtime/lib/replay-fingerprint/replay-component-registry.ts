// ───────────────────────────────────────────────────────────────────
// MODULE: Replay Component Registry
// ───────────────────────────────────────────────────────────────────

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

import type { JsonObject } from '../event-envelope/index.js';
import type { ReplayComponentDefinition } from './replay-fingerprint-types.js';

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
