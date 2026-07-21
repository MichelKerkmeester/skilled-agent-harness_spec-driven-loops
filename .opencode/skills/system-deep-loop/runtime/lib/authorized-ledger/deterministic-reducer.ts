// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Ledger Reducer
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';

import type {
  LedgerHead,
  RebuiltProjection,
  TypedReducerDefinition,
  VerifiedLedgerEvent,
} from './authorized-ledger-types.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function freezeJson<T extends JsonValue>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((entry) => freezeJson(entry));
    Object.freeze(value);
  }
  return value;
}

function cloneState<TState extends JsonObject>(state: Readonly<TState>): TState {
  return freezeJson(JSON.parse(canonicalJson(state)) as TState);
}

function reducerKey(eventType: string, reducerVersion: string): string {
  return `${eventType}@${reducerVersion}`;
}

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Exact event-type and reducer-version registry for disposable projections. */
export class TypedReducerRegistry<TState extends JsonObject> {
  readonly #reducers: ReadonlyMap<string, TypedReducerDefinition<TState>>;

  public constructor(definitions: readonly TypedReducerDefinition<TState>[]) {
    const reducers = new Map<string, TypedReducerDefinition<TState>>();
    for (const definition of definitions) {
      const key = reducerKey(definition.eventType, definition.reducerVersion);
      if (
        typeof definition.eventType !== 'string'
        || definition.eventType.trim() === ''
        || typeof definition.reducerVersion !== 'string'
        || definition.reducerVersion.trim() === ''
        || typeof definition.reduce !== 'function'
        || reducers.has(key)
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.INPUT_INVALID,
          'reducer',
          'Reducer definitions require unique bounded event and version identities',
          { eventType: definition.eventType, reducerVersion: definition.reducerVersion },
        );
      }
      reducers.set(key, Object.freeze(definition));
    }
    this.#reducers = reducers;
    Object.freeze(this);
  }

  /** Resolve one exact reducer or reject the complete projection rebuild. */
  public resolve(eventType: string, reducerVersion: string): TypedReducerDefinition<TState> {
    const reducer = this.#reducers.get(reducerKey(eventType, reducerVersion));
    if (!reducer) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.REDUCER_MISSING,
        'reducer',
        'No reducer is registered for the verified event and reducer version',
        { eventType, reducerVersion },
      );
    }
    return reducer;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. REBUILD
// ───────────────────────────────────────────────────────────────────

function runReduction<TState extends JsonObject>(
  events: readonly VerifiedLedgerEvent[],
  initialState: Readonly<TState>,
  reducerVersion: string,
  registry: TypedReducerRegistry<TState>,
): Readonly<TState> {
  let state: TState = cloneState(initialState);
  for (const verified of events) {
    const reducer = registry.resolve(
      verified.event.effective.envelope.event_type,
      reducerVersion,
    );
    const next = reducer.reduce(cloneState<TState>(state), verified.event);
    state = cloneState<TState>(next);
  }
  return state;
}

/** Fold only verified domain events and prove byte-identical repeated reduction. */
export function rebuildProjection<TState extends JsonObject>(
  events: readonly VerifiedLedgerEvent[],
  initialState: Readonly<TState>,
  reducerVersion: string,
  ledgerHead: LedgerHead,
  registry: TypedReducerRegistry<TState>,
): RebuiltProjection<TState> {
  const first = runReduction(events, initialState, reducerVersion, registry);
  const second = runReduction(events, initialState, reducerVersion, registry);
  const firstBytes = canonicalBytes(first);
  if (canonicalJson(first) !== canonicalJson(second)) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.REDUCER_NON_DETERMINISTIC,
      'reducer',
      'Repeated reduction produced different canonical projection bytes',
      { reducerVersion },
    );
  }
  return Object.freeze({
    reducerVersion,
    state: first,
    canonicalBytes: firstBytes,
    digest: sha256Bytes(firstBytes),
    ledgerHead,
  });
}
