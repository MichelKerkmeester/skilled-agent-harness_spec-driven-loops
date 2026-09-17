// ───────────────────────────────────────────────────────────────────
// MODULE: Event Type Registry
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  immutableJsonClone,
  sha256Bytes,
} from './canonical-json.js';
import {
  EnvelopeValidationError,
  EventEnvelopeError,
  EventEnvelopeErrorCodes,
  RegistryValidationError,
} from './event-envelope-errors.js';
import { validateEventTypeNamespace } from './event-envelope.js';

import type { JsonObject, JsonValue } from './canonical-json.js';
import type { EventEnvelope } from './event-envelope.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Closed required/optional field contract for one event type and version. */
export interface PayloadContract {
  readonly requiredFields: readonly string[];
  readonly optionalFields?: readonly string[];
  readonly validate: (payload: Readonly<JsonObject>) => boolean | void;
}

/** Auditable provenance for a payload field introduced by an upcast. */
export interface IntroducedFieldProvenance {
  readonly kind: 'default' | 'derived';
  readonly provenance: string;
}

/** Lossless result and field provenance returned by one adjacent upcaster. */
export interface UpcastOutcome {
  readonly envelope: EventEnvelope;
  readonly sourceFieldMap: Readonly<Record<string, string>>;
  readonly introducedFields?: Readonly<Record<string, IntroducedFieldProvenance>>;
}

/** Registered transform from one event version to its successor. */
export interface EventUpcasterDefinition {
  readonly identity: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly upcast: (event: EventEnvelope) => UpcastOutcome;
}

/** Payload contract registered for one positive event version. */
export interface EventVersionDefinition {
  readonly version: number;
  readonly payload: PayloadContract;
}

/** Complete startup definition for one stable event type namespace. */
export interface EventTypeDefinition {
  readonly eventType: string;
  readonly aliases?: readonly string[];
  readonly currentVersion: number;
  readonly versions: readonly EventVersionDefinition[];
  readonly upcasters: readonly EventUpcasterDefinition[];
}

/** Validated upcaster retained only for the controlled read boundary. */
export interface RegisteredUpcaster extends EventUpcasterDefinition {
  readonly implementationDigest: string;
}

interface RegisteredPayloadContract extends PayloadContract {
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly validatorDigest: string;
  readonly schemaDigest: string;
}

interface RegisteredEventVersion {
  readonly version: number;
  readonly payload: RegisteredPayloadContract;
}

interface RegisteredEventType {
  readonly eventType: string;
  readonly currentVersion: number;
  readonly versions: Readonly<Record<number, RegisteredEventVersion>>;
  readonly upcasters: Readonly<Record<number, RegisteredUpcaster>>;
}

/** Serializable registry description for audit and sibling handoff. */
export interface RegistryInspectionEntry {
  readonly eventType: string;
  readonly currentVersion: number;
  readonly supportedVersions: readonly number[];
  readonly payloadContracts: readonly {
    readonly version: number;
    readonly requiredFields: readonly string[];
    readonly optionalFields: readonly string[];
    readonly validatorDigest: string;
    readonly schemaDigest: string;
  }[];
  readonly upcasters: readonly {
    readonly identity: string;
    readonly fromVersion: number;
    readonly toVersion: number;
    readonly implementationDigest: string;
  }[];
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PAYLOAD_FIELD_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;
const FORBIDDEN_PAYLOAD_FIELDS = new Set(['__proto__', 'constructor', 'prototype']);
const REGISTRY_STATE = new WeakMap<EventTypeRegistry, Readonly<Record<string, RegisteredEventType>>>();

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function incompleteDefinition(
  message: string,
  details: Readonly<Record<string, string | number | boolean | null>> = {},
): RegistryValidationError {
  return new RegistryValidationError(
    EventEnvelopeErrorCodes.REGISTRY_INCOMPLETE_DEFINITION,
    message,
    details,
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requireArray(value: unknown, field: string, eventType?: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw incompleteDefinition('Registry definition field must be an array', {
      field,
      ...(eventType ? { eventType } : {}),
    });
  }
  return value;
}

function requirePositiveVersion(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_INVALID_VERSION,
      'Registry versions must be positive safe integers',
      { field, valueType: typeof value },
    );
  }
  return value as number;
}

function validatePayloadField(field: unknown, eventType: string, version: number): string {
  if (
    typeof field !== 'string'
    || !PAYLOAD_FIELD_PATTERN.test(field)
    || FORBIDDEN_PAYLOAD_FIELDS.has(field)
  ) {
    throw incompleteDefinition('Payload contract contains an invalid field name', {
      eventType,
      version,
      field: typeof field === 'string' ? field : typeof field,
    });
  }
  return field;
}

function functionDigest(implementation: Function): string {
  return sha256Bytes(canonicalBytes(Function.prototype.toString.call(implementation)));
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function validatePayloadContract(
  eventType: string,
  candidate: unknown,
): RegisteredEventVersion {
  if (!isPlainObject(candidate)) {
    throw incompleteDefinition('Every event version must be an object', { eventType });
  }
  const version = requirePositiveVersion(candidate.version, 'version');
  if (!isPlainObject(candidate.payload)) {
    throw incompleteDefinition('Every event version requires a payload contract', {
      eventType,
      version,
    });
  }
  const validator = candidate.payload.validate;
  if (typeof validator !== 'function') {
    throw incompleteDefinition('Every event version requires a payload validator', {
      eventType,
      version,
    });
  }

  const requiredFields = requireArray(
    candidate.payload.requiredFields,
    'requiredFields',
    eventType,
  ).map((field) => validatePayloadField(field, eventType, version));
  const optionalFields = (
    candidate.payload.optionalFields === undefined
      ? []
      : requireArray(candidate.payload.optionalFields, 'optionalFields', eventType)
  ).map((field) => validatePayloadField(field, eventType, version));
  const allFields = [...requiredFields, ...optionalFields];
  if (new Set(allFields).size !== allFields.length) {
    throw incompleteDefinition('Payload contract fields must be unique', { eventType, version });
  }

  requiredFields.sort();
  optionalFields.sort();
  const validatorDigest = functionDigest(validator);
  const schemaDigest = sha256Bytes(canonicalBytes({
    eventType,
    version,
    requiredFields,
    optionalFields,
    validatorDigest,
  }));
  return Object.freeze({
    version,
    payload: Object.freeze({
      requiredFields: Object.freeze(requiredFields),
      optionalFields: Object.freeze(optionalFields),
      validate: validator as PayloadContract['validate'],
      validatorDigest,
      schemaDigest,
    }),
  });
}

function assertNoUpcasterCycle(eventType: string, upcasters: readonly RegisteredUpcaster[]): void {
  const adjacency = new Map<number, number[]>();
  upcasters.forEach(({ fromVersion, toVersion }) => {
    const targets = adjacency.get(fromVersion) ?? [];
    targets.push(toVersion);
    adjacency.set(fromVersion, targets);
  });
  const visiting = new Set<number>();
  const visited = new Set<number>();
  const visit = (version: number): void => {
    if (visiting.has(version)) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_CYCLE,
        'Upcaster graph contains a cycle',
        { eventType, version },
      );
    }
    if (visited.has(version)) return;
    visiting.add(version);
    (adjacency.get(version) ?? []).forEach(visit);
    visiting.delete(version);
    visited.add(version);
  };
  Array.from(adjacency.keys()).forEach(visit);
}

function registrationProbe(eventType: string, version: number, payloadFields: readonly string[]): EventEnvelope {
  const payload = Object.fromEntries(
    payloadFields.map((field) => [field, `registry-probe:${field}`]),
  );
  return {
    envelope_version: 1,
    event_id: 'registry-probe-event',
    event_type: eventType,
    event_version: version,
    stream_id: 'registry-probe-stream',
    stream_sequence: 1,
    occurred_at: '2000-01-01T00:00:00.000Z',
    recorded_at: '2000-01-01T00:00:00.000Z',
    producer: { name: 'event-type-registry', version: '1' },
    authority_epoch: 1,
    correlation_id: 'registry-probe-correlation',
    causation_id: null,
    idempotency_key: 'registry-probe-idempotency',
    payload,
  };
}

function inputChanged(input: EventEnvelope, before: string): boolean {
  try {
    return canonicalJson(input) !== before;
  } catch {
    return true;
  }
}

function validateUpcasterBehavior(
  eventType: string,
  upcaster: RegisteredUpcaster,
  sourceVersion: RegisteredEventVersion,
): void {
  const probe = registrationProbe(
    eventType,
    upcaster.fromVersion,
    sourceVersion.payload.requiredFields,
  );
  const mutableProbe = JSON.parse(canonicalJson(probe)) as EventEnvelope;
  const before = canonicalJson(mutableProbe);

  try {
    upcaster.upcast(mutableProbe);
  } catch {
    if (inputChanged(mutableProbe, before)) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_MUTATES_INPUT,
        'Upcaster mutated its registration probe input',
        { eventType, upcaster: upcaster.identity },
      );
    }
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_PROBE_FAILED,
      'Upcaster could not execute against the registration probe',
      { eventType, upcaster: upcaster.identity },
    );
  }
  if (inputChanged(mutableProbe, before)) {
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_MUTATES_INPUT,
      'Upcaster mutated its registration probe input',
      { eventType, upcaster: upcaster.identity },
    );
  }

  try {
    const first = upcaster.upcast(
      immutableJsonClone(probe as unknown as JsonObject) as unknown as EventEnvelope,
    );
    const second = upcaster.upcast(
      immutableJsonClone(probe as unknown as JsonObject) as unknown as EventEnvelope,
    );
    if (canonicalJson(first) !== canonicalJson(second)) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_NON_DETERMINISTIC,
        'Repeated upcaster execution produced different canonical output',
        { eventType, upcaster: upcaster.identity },
      );
    }
  } catch (error: unknown) {
    if (error instanceof RegistryValidationError) throw error;
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_PROBE_FAILED,
      'Upcaster failed while executing against deep-frozen registration inputs',
      { eventType, upcaster: upcaster.identity },
    );
  }
}

function normalizeUpcaster(eventType: string, candidate: unknown): RegisteredUpcaster {
  if (!isPlainObject(candidate)) {
    throw incompleteDefinition('Every upcaster must be an object', { eventType });
  }
  const identity = candidate.identity;
  if (typeof identity !== 'string' || identity.trim() === '') {
    throw incompleteDefinition('Every upcaster requires a non-empty identity', { eventType });
  }
  const fromVersion = requirePositiveVersion(candidate.fromVersion, 'fromVersion');
  const toVersion = requirePositiveVersion(candidate.toVersion, 'toVersion');
  if (typeof candidate.upcast !== 'function') {
    throw incompleteDefinition('Every upcaster requires a callable transform', {
      eventType,
      upcaster: identity,
    });
  }
  return Object.freeze({
    identity,
    fromVersion,
    toVersion,
    upcast: candidate.upcast as EventUpcasterDefinition['upcast'],
    implementationDigest: functionDigest(candidate.upcast),
  });
}

function registerEventType(candidate: unknown): RegisteredEventType {
  if (!isPlainObject(candidate)) {
    throw incompleteDefinition('Every event type definition must be an object');
  }

  let eventType: string;
  try {
    eventType = validateEventTypeNamespace(candidate.eventType);
  } catch (error: unknown) {
    throw incompleteDefinition('Event type definition has an invalid namespace', {
      causeCode: error instanceof EventEnvelopeError ? error.code : 'UNEXPECTED_ERROR',
    });
  }
  const aliases = candidate.aliases === undefined
    ? []
    : requireArray(candidate.aliases, 'aliases', eventType);
  if (aliases.length > 0) {
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_ALIAS_FORBIDDEN,
      'Persisted event types cannot register aliases',
      { eventType },
    );
  }
  const currentVersion = requirePositiveVersion(candidate.currentVersion, 'currentVersion');

  const versionEntries = requireArray(candidate.versions, 'versions', eventType)
    .map((definition) => validatePayloadContract(eventType, definition));
  const mutableVersions: Record<number, RegisteredEventVersion> = Object.create(null);
  for (const entry of versionEntries) {
    if (mutableVersions[entry.version] !== undefined) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_DUPLICATE_VERSION,
        'Event type contains a duplicate version contract',
        { eventType, version: entry.version },
      );
    }
    mutableVersions[entry.version] = entry;
  }

  const expectedVersions = Array.from({ length: currentVersion }, (_, index) => index + 1);
  if (
    versionEntries.length !== expectedVersions.length
    || expectedVersions.some((version) => mutableVersions[version] === undefined)
  ) {
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
      'Supported event versions must form a complete range starting at one',
      { eventType, currentVersion },
    );
  }

  const upcasterEntries = requireArray(candidate.upcasters, 'upcasters', eventType)
    .map((upcaster) => normalizeUpcaster(eventType, upcaster));
  assertNoUpcasterCycle(eventType, upcasterEntries);
  const edgeKeys = new Set<string>();
  const identities = new Set<string>();
  const mutableUpcasters: Record<number, RegisteredUpcaster> = Object.create(null);
  for (const upcaster of upcasterEntries) {
    const edgeKey = `${upcaster.fromVersion}->${upcaster.toVersion}`;
    if (
      edgeKeys.has(edgeKey)
      || mutableUpcasters[upcaster.fromVersion] !== undefined
      || identities.has(upcaster.identity)
    ) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_DUPLICATE_UPCASTER,
        'Registry contains a duplicate or ambiguous upcaster edge',
        { eventType, edge: edgeKey },
      );
    }
    edgeKeys.add(edgeKey);
    identities.add(upcaster.identity);
    if (upcaster.toVersion !== upcaster.fromVersion + 1) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_NON_ADJACENT,
        'Upcaster edges must advance exactly one version',
        { eventType, fromVersion: upcaster.fromVersion, toVersion: upcaster.toVersion },
      );
    }
    if (
      mutableVersions[upcaster.fromVersion] === undefined
      || mutableVersions[upcaster.toVersion] === undefined
    ) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
        'Upcaster edge references an unsupported version',
        { eventType, fromVersion: upcaster.fromVersion, toVersion: upcaster.toVersion },
      );
    }
    mutableUpcasters[upcaster.fromVersion] = upcaster;
  }

  for (let version = 1; version < currentVersion; version += 1) {
    if (mutableUpcasters[version] === undefined) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
        'Every historical event version requires one adjacent upcaster',
        { eventType, version },
      );
    }
  }
  if (upcasterEntries.length !== Math.max(0, currentVersion - 1)) {
    throw incompleteDefinition('Current event version cannot own an outgoing upcaster', {
      eventType,
      currentVersion,
    });
  }

  for (const upcaster of upcasterEntries) {
    validateUpcasterBehavior(eventType, upcaster, mutableVersions[upcaster.fromVersion]);
  }

  return Object.freeze({
    eventType,
    currentVersion,
    versions: Object.freeze(mutableVersions),
    upcasters: Object.freeze(mutableUpcasters),
  });
}

function inspectionFor(definition: RegisteredEventType): RegistryInspectionEntry {
  return Object.freeze({
    eventType: definition.eventType,
    currentVersion: definition.currentVersion,
    supportedVersions: Object.freeze(
      Object.values(definition.versions).map(({ version }) => version).sort((a, b) => a - b),
    ),
    payloadContracts: Object.freeze(
      Object.values(definition.versions)
        .sort((a, b) => a.version - b.version)
        .map((entry) => Object.freeze({
          version: entry.version,
          requiredFields: Object.freeze([...entry.payload.requiredFields]),
          optionalFields: Object.freeze([...entry.payload.optionalFields]),
          validatorDigest: entry.payload.validatorDigest,
          schemaDigest: entry.payload.schemaDigest,
        })),
    ),
    upcasters: Object.freeze(
      Object.values(definition.upcasters)
        .sort((a, b) => a.fromVersion - b.fromVersion)
        .map(({ identity, fromVersion, toVersion, implementationDigest }) => Object.freeze({
          identity,
          fromVersion,
          toVersion,
          implementationDigest,
        })),
    ),
  });
}

function stateFor(registry: EventTypeRegistry): Readonly<Record<string, RegisteredEventType>> {
  const state = REGISTRY_STATE.get(registry);
  if (!state) {
    throw incompleteDefinition('Registry state is unavailable');
  }
  return state;
}

function registeredDefinition(registry: EventTypeRegistry, eventType: string): RegisteredEventType {
  const definition = stateFor(registry)[eventType];
  if (!definition) {
    throw new RegistryValidationError(
      EventEnvelopeErrorCodes.REGISTRY_UNKNOWN_EVENT_TYPE,
      'Event type is not registered',
      { eventType },
    );
  }
  return definition;
}

function registeredChain(
  registry: EventTypeRegistry,
  eventType: string,
  storedVersion: number,
): readonly RegisteredUpcaster[] {
  const definition = registeredDefinition(registry, eventType);
  if (storedVersion > definition.currentVersion) return Object.freeze([]);
  const chain: RegisteredUpcaster[] = [];
  for (let version = storedVersion; version < definition.currentVersion; version += 1) {
    const upcaster = definition.upcasters[version];
    if (!upcaster) {
      throw new RegistryValidationError(
        EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
        'Registry cannot resolve a complete adjacent upcaster chain',
        { eventType, version },
      );
    }
    chain.push(upcaster);
  }
  return Object.freeze(chain);
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Deterministic startup registry for event schemas and adjacent upcasters. */
export class EventTypeRegistry {
  public readonly digest: string;

  public constructor(definitions: readonly EventTypeDefinition[]) {
    if (!Array.isArray(definitions)) {
      throw incompleteDefinition('Registry definitions must be an array');
    }
    const registered: Record<string, RegisteredEventType> = Object.create(null);
    try {
      for (const definition of definitions as readonly unknown[]) {
        const entry = registerEventType(definition);
        if (registered[entry.eventType] !== undefined) {
          throw new RegistryValidationError(
            EventEnvelopeErrorCodes.REGISTRY_DUPLICATE_EVENT_TYPE,
            'Registry contains a duplicate event type',
            { eventType: entry.eventType },
          );
        }
        registered[entry.eventType] = entry;
      }
    } catch (error: unknown) {
      if (error instanceof RegistryValidationError) throw error;
      throw incompleteDefinition('Registry definition could not be normalized', {
        causeCode: error instanceof EventEnvelopeError ? error.code : 'UNEXPECTED_ERROR',
      });
    }

    const state = Object.freeze(registered);
    REGISTRY_STATE.set(this, state);
    this.digest = sha256Bytes(canonicalBytes(
      Object.values(state)
        .sort((a, b) => compareCodeUnits(a.eventType, b.eventType))
        .map(inspectionFor),
    ));
    Object.freeze(this);
  }

  /** Return a stable, function-free registry description. */
  public inspect(): readonly RegistryInspectionEntry[] {
    return Object.freeze(
      Object.values(stateFor(this))
        .sort((a, b) => compareCodeUnits(a.eventType, b.eventType))
        .map(inspectionFor),
    );
  }

  /** Resolve an event type to an immutable, function-free description. */
  public resolve(eventType: string): RegistryInspectionEntry {
    return inspectionFor(registeredDefinition(this, eventType));
  }

  /** Validate a payload against its exact registered type and version. */
  public validatePayload(eventType: string, version: number, payload: Readonly<JsonObject>): void {
    const definition = registeredDefinition(this, eventType);
    const versionDefinition = definition.versions[version];
    if (!versionDefinition) {
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.PAYLOAD_VALIDATION_FAILED,
        'Payload version is not registered for the event type',
        { eventType, version },
      );
    }
    const required = new Set(versionDefinition.payload.requiredFields);
    const allowed = new Set([
      ...versionDefinition.payload.requiredFields,
      ...versionDefinition.payload.optionalFields,
    ]);
    for (const field of required) {
      if (!Object.prototype.hasOwnProperty.call(payload, field)) {
        throw new EnvelopeValidationError(
          EventEnvelopeErrorCodes.PAYLOAD_MISSING_FIELD,
          'Required payload field is missing',
          { eventType, version, field },
        );
      }
    }
    for (const field of Object.keys(payload)) {
      if (!allowed.has(field)) {
        throw new EnvelopeValidationError(
          EventEnvelopeErrorCodes.PAYLOAD_UNKNOWN_FIELD,
          'Unknown payload field is forbidden',
          { eventType, version, field },
        );
      }
    }
    try {
      const result = versionDefinition.payload.validate(payload);
      if (result === false) throw new Error('validator returned false');
    } catch (error: unknown) {
      if (error instanceof EventEnvelopeError) throw error;
      throw new EnvelopeValidationError(
        EventEnvelopeErrorCodes.PAYLOAD_VALIDATION_FAILED,
        'Payload validator rejected the event',
        { eventType, version },
      );
    }
  }

  /** Digest the internal read chain without exposing callable transforms. */
  public chainIdentity(eventType: string, storedVersion: number): string {
    const identities: JsonValue = registeredChain(this, eventType, storedVersion).map((upcaster) => ({
      identity: upcaster.identity,
      implementationDigest: upcaster.implementationDigest,
      fromVersion: upcaster.fromVersion,
      toVersion: upcaster.toVersion,
    }));
    return sha256Bytes(canonicalBytes({ eventType, storedVersion, identities }));
  }
}

/** Internal bridge reserved for the read boundary; it is not part of the package barrel. */
export function readBoundaryUpcasterChain(
  registry: EventTypeRegistry,
  eventType: string,
  storedVersion: number,
): readonly RegisteredUpcaster[] {
  return registeredChain(registry, eventType, storedVersion);
}
