// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Registry
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
  validateEventTypeNamespace,
} from '../event-envelope/index.js';
import {
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from './stream-fold-gauge-errors.js';
import {
  GAUGE_COMPARISON_EVENT_TYPE,
  GAUGE_RESULT_EVENT_TYPE,
} from './stream-fold-gauge-types.js';

import type { EventReadResult, JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AcceptedGaugeEvent,
  GaugeDefinition,
  GaugeRegistryEntry,
} from './stream-fold-gauge-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface RegisteredGaugeDefinition extends GaugeDefinition {
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly definitionDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SEMANTIC_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const PUBLICATION_EVENT_TYPES = new Set([
  GAUGE_RESULT_EVENT_TYPE,
  GAUGE_COMPARISON_EVENT_TYPE,
]);

const AMBIENT_PATTERNS: readonly [RegExp, string][] = Object.freeze([
  [/\bDate\s*[.(]/, 'clock'],
  [/\bMath\.random\b/, 'random'],
  [/\bcrypto\.(?:random|randomUUID)\b/, 'random'],
  [/\bprocess\b/, 'process'],
  [/\bglobalThis\b/, 'global'],
  [/\bperformance\.now\b/, 'clock'],
  [/\bIntl\b/, 'locale'],
  [/\.localeCompare\s*\(/, 'locale'],
  [/\brequire\s*\(/, 'filesystem-or-module'],
  [/\bfetch\s*\(/, 'network'],
  [/\b(?:readFile|readdir|stat|open|writeFile)Sync\s*\(/, 'filesystem'],
]);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function gaugeKey(gaugeId: string, gaugeVersion: string): string {
  return `${gaugeId}\u0000${gaugeVersion}`;
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function frozenJson<T extends JsonValue>(value: T): T {
  const cloned = cloneJson(value);
  const freeze = (entry: JsonValue): void => {
    if (entry !== null && typeof entry === 'object') {
      Object.values(entry).forEach(freeze);
      Object.freeze(entry);
    }
  };
  freeze(cloned);
  return cloned;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function functionDigest(functions: readonly Function[]): string {
  return sha256Bytes(canonicalBytes(functions.map((fn) => Function.prototype.toString.call(fn))));
}

function assertNoAmbientDependency(definition: GaugeDefinition): void {
  const source = [definition.reduce, definition.finalize]
    .map((fn) => Function.prototype.toString.call(fn))
    .join('\n');
  for (const [pattern, capability] of AMBIENT_PATTERNS) {
    if (pattern.test(source)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.AMBIENT_DEPENDENCY,
        'registry',
        'Gauge reducer requests a forbidden ambient capability',
        { gaugeId: definition.gaugeId, capability },
      );
    }
  }
}

function normalizeAcceptedEvents(
  gaugeId: string,
  acceptedEvents: readonly AcceptedGaugeEvent[],
): readonly AcceptedGaugeEvent[] {
  if (!Array.isArray(acceptedEvents) || acceptedEvents.length === 0) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Gauge definition requires at least one accepted event contract',
      { gaugeId },
    );
  }
  const seen = new Set<string>();
  const normalized = acceptedEvents.map((contract) => {
    const eventType = validateEventTypeNamespace(contract.eventType);
    if (PUBLICATION_EVENT_TYPES.has(eventType)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.SELF_INPUT_FORBIDDEN,
        'registry',
        'Gauge publication events cannot be reducer inputs',
        { gaugeId, eventType },
      );
    }
    if (seen.has(eventType)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Gauge event contracts must be unique by event type',
        { gaugeId, eventType },
      );
    }
    seen.add(eventType);
    const versions = [...contract.effectiveVersions];
    if (
      versions.length === 0
      || versions.some((version) => !Number.isSafeInteger(version) || version < 1)
      || new Set(versions).size !== versions.length
    ) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Gauge event contracts require unique positive effective versions',
        { gaugeId, eventType },
      );
    }
    versions.sort((left, right) => left - right);
    return Object.freeze({ eventType, effectiveVersions: Object.freeze(versions) });
  });
  normalized.sort((left, right) => left.eventType < right.eventType ? -1 : 1);
  return Object.freeze(normalized);
}

function normalizeDefinition(definition: GaugeDefinition): RegisteredGaugeDefinition {
  const gaugeId = validateEventTypeNamespace(definition.gaugeId);
  if (
    !SEMANTIC_VERSION_PATTERN.test(definition.gaugeVersion)
    || !nonEmptyString(definition.reducerIdentity)
    || !nonEmptyString(definition.outputSchemaVersion)
    || !nonEmptyString(definition.missingValueSemantics)
    || !nonEmptyString(definition.downstreamOwner)
    || (definition.unknownEventPolicy !== 'ignore' && definition.unknownEventPolicy !== 'reject')
    || typeof definition.reduce !== 'function'
    || typeof definition.finalize !== 'function'
    || typeof definition.validateAccumulator !== 'function'
    || typeof definition.validateOutput !== 'function'
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Gauge definition identity, policy, schema, and fold functions are required',
      { gaugeId },
    );
  }
  assertNoAmbientDependency(definition);
  const acceptedEvents = normalizeAcceptedEvents(gaugeId, definition.acceptedEvents);
  const dependencies = Object.freeze([...definition.dependencies].sort());
  if (dependencies.some((dependency) => !nonEmptyString(dependency))) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Gauge dependencies require stable non-empty identities',
      { gaugeId },
    );
  }
  const configuration = frozenJson(definition.configuration as JsonObject);
  const numericPolicy = frozenJson(definition.numericPolicy as JsonObject);
  const initialAccumulator = frozenJson(definition.initialAccumulator as JsonObject);
  if (!definition.validateAccumulator(initialAccumulator)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Gauge initial accumulator does not satisfy its declared schema',
      { gaugeId },
    );
  }
  const initialOutput = definition.finalize(cloneJson(initialAccumulator));
  if (!definition.validateOutput(initialOutput)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
      'registry',
      'Gauge finalizer does not produce its declared output schema',
      { gaugeId },
    );
  }
  const configurationDigest = sha256Bytes(canonicalBytes(configuration));
  const reducerDigest = sha256Bytes(canonicalBytes({
    reducerIdentity: definition.reducerIdentity,
    implementationDigest: functionDigest([
      definition.reduce,
      definition.finalize,
      definition.validateAccumulator,
      definition.validateOutput,
    ]),
  }));
  const descriptor = {
    gaugeId,
    gaugeVersion: definition.gaugeVersion,
    family: definition.family,
    acceptedEvents,
    reducerDigest,
    configurationDigest,
    outputSchemaVersion: definition.outputSchemaVersion,
    numericPolicy,
    missingValueSemantics: definition.missingValueSemantics,
    downstreamOwner: definition.downstreamOwner,
    unknownEventPolicy: definition.unknownEventPolicy,
    dependencies,
    initialAccumulator,
  };
  const definitionDigest = sha256Bytes(canonicalBytes(descriptor));
  return Object.freeze({
    ...definition,
    ...descriptor,
    configuration,
    numericPolicy,
    initialAccumulator,
    definitionDigest,
  });
}

function assertDependencyGraph(definitions: readonly RegisteredGaugeDefinition[]): void {
  const byId = new Map(definitions.map((definition) => [definition.gaugeId, definition]));
  for (const definition of definitions) {
    for (const dependency of definition.dependencies) {
      if (!byId.has(dependency)) {
        throw new StreamFoldGaugeError(
          StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
          'registry',
          'Gauge dependency is not registered',
          { gaugeId: definition.gaugeId, dependency },
        );
      }
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (gaugeId: string): void => {
    if (visiting.has(gaugeId)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.DEPENDENCY_CYCLE,
        'registry',
        'Gauge dependency graph must remain acyclic',
        { gaugeId },
      );
    }
    if (visited.has(gaugeId)) return;
    visiting.add(gaugeId);
    for (const dependency of byId.get(gaugeId)?.dependencies ?? []) visit(dependency);
    visiting.delete(gaugeId);
    visited.add(gaugeId);
  };
  for (const gaugeId of byId.keys()) visit(gaugeId);
}

function inspectionEntry(definition: RegisteredGaugeDefinition): GaugeRegistryEntry {
  return frozenJson({
    gaugeId: definition.gaugeId,
    gaugeVersion: definition.gaugeVersion,
    family: definition.family,
    acceptedEvents: definition.acceptedEvents.map((contract) => ({
      eventType: contract.eventType,
      effectiveVersions: [...contract.effectiveVersions],
    })),
    reducerDigest: definition.reducerDigest,
    configurationDigest: definition.configurationDigest,
    definitionDigest: definition.definitionDigest,
    outputSchemaVersion: definition.outputSchemaVersion,
    numericPolicy: definition.numericPolicy,
    missingValueSemantics: definition.missingValueSemantics,
    downstreamOwner: definition.downstreamOwner,
    unknownEventPolicy: definition.unknownEventPolicy,
    dependencies: [...definition.dependencies],
  }) as GaugeRegistryEntry;
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable registry for versioned deterministic gauge folds. */
export class GaugeRegistry {
  public readonly digest: string;
  readonly #definitions: ReadonlyMap<string, RegisteredGaugeDefinition>;
  readonly #inspection: readonly GaugeRegistryEntry[];

  public constructor(definitions: readonly GaugeDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE,
        'registry',
        'Gauge registry requires at least one definition',
      );
    }
    const registered = new Map<string, RegisteredGaugeDefinition>();
    for (const candidate of definitions) {
      const definition = normalizeDefinition(candidate);
      const key = gaugeKey(definition.gaugeId, definition.gaugeVersion);
      if (registered.has(key)) {
        throw new StreamFoldGaugeError(
          StreamFoldGaugeErrorCodes.REGISTRY_DUPLICATE,
          'registry',
          'Gauge identity and version must be unique',
          { gaugeId: definition.gaugeId, gaugeVersion: definition.gaugeVersion },
        );
      }
      registered.set(key, definition);
    }
    const ordered = [...registered.values()].sort((left, right) => {
      const leftKey = gaugeKey(left.gaugeId, left.gaugeVersion);
      const rightKey = gaugeKey(right.gaugeId, right.gaugeVersion);
      return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
    });
    assertDependencyGraph(ordered);
    this.#definitions = registered;
    this.#inspection = Object.freeze(ordered.map(inspectionEntry));
    this.digest = sha256Bytes(canonicalBytes(this.#inspection as unknown as JsonValue));
    Object.freeze(this);
  }

  /** Return function-free immutable registry metadata. */
  public inspect(): readonly GaugeRegistryEntry[] {
    return this.#inspection;
  }

  /** Resolve one exact function-free gauge contract. */
  public resolve(gaugeId: string, gaugeVersion: string): GaugeRegistryEntry {
    return inspectionEntry(this.#registered(gaugeId, gaugeVersion));
  }

  /** Return a frozen copy of the declared initial accumulator. */
  public initialAccumulator(gaugeId: string, gaugeVersion: string): Readonly<JsonObject> {
    return frozenJson(this.#registered(gaugeId, gaugeVersion).initialAccumulator as JsonObject);
  }

  /** Return a frozen copy of the content-addressed gauge configuration. */
  public configuration(gaugeId: string, gaugeVersion: string): Readonly<JsonObject> {
    return frozenJson(this.#registered(gaugeId, gaugeVersion).configuration as JsonObject);
  }

  /** Validate checkpoint state against the registered accumulator schema. */
  public validateAccumulator(
    gaugeId: string,
    gaugeVersion: string,
    state: Readonly<JsonObject>,
  ): boolean {
    try {
      canonicalJson(state);
      return this.#registered(gaugeId, gaugeVersion).validateAccumulator(state);
    } catch {
      return false;
    }
  }

  /** Apply one effective event twice and reject any byte drift. */
  public reduce(
    gaugeId: string,
    gaugeVersion: string,
    state: Readonly<JsonObject>,
    event: Readonly<EventReadResult>,
    ledgerSequence: number,
  ): Readonly<JsonObject> {
    const definition = this.#registered(gaugeId, gaugeVersion);
    const eventType = event.effective.envelope.event_type;
    if (PUBLICATION_EVENT_TYPES.has(eventType)) return frozenJson(state as JsonObject);
    const contract = definition.acceptedEvents.find((entry) => entry.eventType === eventType);
    if (!contract) {
      if (definition.unknownEventPolicy === 'ignore') return frozenJson(state as JsonObject);
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT,
        'reducer',
        'Gauge encountered an event outside its explicit input contract',
        { gaugeId, eventType, ledgerSequence },
      );
    }
    if (!contract.effectiveVersions.includes(event.effectiveVersion)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT_VERSION,
        'reducer',
        'Gauge encountered an unsupported effective event version',
        { gaugeId, eventType, eventVersion: event.effectiveVersion, ledgerSequence },
      );
    }

    let first: JsonObject;
    let second: JsonObject;
    try {
      first = definition.reduce(frozenJson(state as JsonObject), event, ledgerSequence);
      second = definition.reduce(frozenJson(state as JsonObject), event, ledgerSequence);
    } catch (error: unknown) {
      if (error instanceof StreamFoldGaugeError) throw error;
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REDUCER_FAILURE,
        'reducer',
        'Gauge reducer rejected the verified event payload',
        { gaugeId, eventType, ledgerSequence },
      );
    }
    if (canonicalJson(first) !== canonicalJson(second)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REDUCER_NON_DETERMINISTIC,
        'reducer',
        'Repeated gauge reduction produced different canonical bytes',
        { gaugeId, eventType, ledgerSequence },
      );
    }
    if (!definition.validateAccumulator(first)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REDUCER_FAILURE,
        'reducer',
        'Gauge reducer produced an invalid accumulator',
        { gaugeId, eventType, ledgerSequence },
      );
    }
    return frozenJson(first);
  }

  /** Finalize an accumulator twice and reject invalid or unstable output. */
  public finalize(
    gaugeId: string,
    gaugeVersion: string,
    state: Readonly<JsonObject>,
  ): Readonly<JsonObject> {
    const definition = this.#registered(gaugeId, gaugeVersion);
    const first = definition.finalize(frozenJson(state as JsonObject));
    const second = definition.finalize(frozenJson(state as JsonObject));
    if (
      canonicalJson(first) !== canonicalJson(second)
      || !definition.validateOutput(first)
    ) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.REDUCER_NON_DETERMINISTIC,
        'reducer',
        'Gauge finalizer produced invalid or unstable canonical output',
        { gaugeId },
      );
    }
    return frozenJson(first);
  }

  #registered(gaugeId: string, gaugeVersion: string): RegisteredGaugeDefinition {
    const definition = this.#definitions.get(gaugeKey(gaugeId, gaugeVersion));
    if (!definition) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.INVALID_INPUT,
        'registry',
        'Gauge identity and version are not registered',
        { gaugeId, gaugeVersion },
      );
    }
    return definition;
  }
}
