// ───────────────────────────────────────────────────────────────────
// MODULE: State Upcaster Registry
// ───────────────────────────────────────────────────────────────────

import {
  MAX_CANONICAL_BYTES,
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  asJsonObject,
  immutableJsonClone,
} from '../event-envelope/canonical-json.js';
import {
  CompatibilityError,
  CompatibilityErrorCodes,
} from './compatibility-errors.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  StateReadResult,
  StateRecordCodec,
  StateRecordTypeDefinition,
  StateRegistryInspectionEntry,
  StateUpcastHopTrace,
  StateUpcastOutcome,
  StateUpcasterDefinition,
  StateVersionDefinition,
  StoredStateBytes,
  VersionedStateRecord,
} from './compatibility-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL TYPES
// ───────────────────────────────────────────────────────────────────

interface RegisteredStateVersion extends StateVersionDefinition {
  readonly validatorDigest: string;
  readonly fixtureDigest: string;
  readonly fixture: VersionedStateRecord;
}

interface RegisteredStateUpcaster extends StateUpcasterDefinition {
  readonly implementationDigest: string;
}

interface RegisteredStateRecordType {
  readonly family: string;
  readonly recordType: string;
  readonly currentVersion: number;
  readonly versions: Readonly<Record<number, RegisteredStateVersion>>;
  readonly upcasters: Readonly<Record<number, RegisteredStateUpcaster>>;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const STABLE_NAME_PATTERN = /^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*$/;
const STABLE_IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const VERSIONED_STATE_FIELDS = Object.freeze([
  'family',
  'identity',
  'payload',
  'recordType',
  'stateVersion',
]);
const REGISTRY_STATE = new WeakMap<
  StateUpcasterRegistry,
  Readonly<Record<string, RegisteredStateRecordType>>
>();

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function definitionError(
  message: string,
  details: Readonly<Record<string, boolean | null | number | string>> = {},
): CompatibilityError {
  return new CompatibilityError(
    CompatibilityErrorCodes.REGISTRY_INVALID_DEFINITION,
    message,
    details,
  );
}

function recordKey(family: string, recordType: string): string {
  return `${family}\u0000${recordType}`;
}

function requireStableName(value: unknown, field: string): string {
  if (typeof value !== 'string' || !STABLE_NAME_PATTERN.test(value)) {
    throw definitionError('State registry name is invalid', { field });
  }
  return value;
}

function requireStableIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || !STABLE_IDENTITY_PATTERN.test(value)) {
    throw definitionError('State compatibility identity is invalid', { field });
  }
  return value;
}

function requirePositiveVersion(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.REGISTRY_INVALID_VERSION,
      'State versions must be positive safe integers',
      { field, valueType: typeof value },
    );
  }
  return value as number;
}

function functionDigest(implementation: Function): string {
  return sha256Bytes(canonicalBytes(Function.prototype.toString.call(implementation)));
}

function mutableJsonClone<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function normalizeStateRecord(input: unknown): VersionedStateRecord {
  const candidate = asJsonObject(input, 'stateRecord');
  const fields = Object.keys(candidate).sort(compareCodeUnits);
  if (canonicalJson(fields) !== canonicalJson(VERSIONED_STATE_FIELDS)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.SOURCE_INVALID_SHAPE,
      'Decoded state record must use the closed normalized shape',
      { fieldCount: fields.length },
    );
  }
  const family = requireStableName(candidate.family, 'family');
  const recordType = requireStableName(candidate.recordType, 'recordType');
  const stateVersion = requirePositiveVersion(candidate.stateVersion, 'stateVersion');
  const identity = asJsonObject(candidate.identity, 'identity');
  const payload = asJsonObject(candidate.payload, 'payload');
  return immutableJsonClone({
    family,
    recordType,
    stateVersion,
    identity,
    payload,
  });
}

function validateStateRecord(
  record: VersionedStateRecord,
  definition: RegisteredStateRecordType,
  version: RegisteredStateVersion,
): void {
  if (
    record.family !== definition.family
    || record.recordType !== definition.recordType
    || record.stateVersion !== version.version
  ) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.STATE_VALIDATION_FAILED,
      'State record identity or version does not match its registered contract',
      {
        family: definition.family,
        recordType: definition.recordType,
        version: version.version,
      },
    );
  }
  try {
    const result = version.validate(record);
    if (result === false) throw new Error('validator returned false');
  } catch (error: unknown) {
    if (error instanceof CompatibilityError) throw error;
    throw new CompatibilityError(
      CompatibilityErrorCodes.STATE_VALIDATION_FAILED,
      'State record validator rejected the declared version',
      {
        family: definition.family,
        recordType: definition.recordType,
        version: version.version,
      },
    );
  }
}

function assertIdentityPreserved(
  input: VersionedStateRecord,
  output: VersionedStateRecord,
): void {
  if (
    input.family !== output.family
    || input.recordType !== output.recordType
    || canonicalJson(input.identity) !== canonicalJson(output.identity)
  ) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_IDENTITY_MUTATION,
      'State upcaster changed immutable record identity',
      {
        family: input.family,
        recordType: input.recordType,
        fromVersion: input.stateVersion,
      },
    );
  }
}

function assertLosslessOutcome(
  input: VersionedStateRecord,
  outcome: StateUpcastOutcome,
): void {
  const sourceFields = Object.keys(input.payload).sort(compareCodeUnits);
  const mappedFields = Object.keys(outcome.sourceFieldMap).sort(compareCodeUnits);
  if (canonicalJson(sourceFields) !== canonicalJson(mappedFields)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_LOSSY_CONVERSION,
      'State upcaster must map every source payload field exactly once',
      {
        family: input.family,
        recordType: input.recordType,
        fromVersion: input.stateVersion,
      },
    );
  }

  const targetFields = new Set<string>();
  for (const sourceField of sourceFields) {
    const targetField = outcome.sourceFieldMap[sourceField];
    if (
      typeof targetField !== 'string'
      || targetFields.has(targetField)
      || !Object.prototype.hasOwnProperty.call(outcome.record.payload, targetField)
      || canonicalJson(input.payload[sourceField])
        !== canonicalJson(outcome.record.payload[targetField])
    ) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UPCAST_LOSSY_CONVERSION,
        'State upcaster did not preserve a source payload value',
        {
          family: input.family,
          recordType: input.recordType,
          fromVersion: input.stateVersion,
          field: sourceField,
        },
      );
    }
    targetFields.add(targetField);
  }

  const introducedFields = outcome.introducedFields ?? {};
  for (const outputField of Object.keys(outcome.record.payload)) {
    if (targetFields.has(outputField)) continue;
    const provenance = introducedFields[outputField];
    if (
      !provenance
      || (provenance.kind !== 'default' && provenance.kind !== 'derived')
      || typeof provenance.provenance !== 'string'
      || provenance.provenance.trim() === ''
    ) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UPCAST_LOSSY_CONVERSION,
        'Introduced state fields require explicit durable provenance',
        {
          family: input.family,
          recordType: input.recordType,
          fromVersion: input.stateVersion,
          field: outputField,
        },
      );
    }
  }
  for (const field of Object.keys(introducedFields)) {
    if (
      targetFields.has(field)
      || !Object.prototype.hasOwnProperty.call(outcome.record.payload, field)
    ) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UPCAST_INVALID_OUTPUT,
        'Introduced-field provenance does not match the state output',
        {
          family: input.family,
          recordType: input.recordType,
          fromVersion: input.stateVersion,
          field,
        },
      );
    }
  }
}

function assertNoCycle(
  family: string,
  recordType: string,
  upcasters: readonly RegisteredStateUpcaster[],
): void {
  const adjacency = new Map<number, number[]>();
  for (const upcaster of upcasters) {
    const targets = adjacency.get(upcaster.fromVersion) ?? [];
    targets.push(upcaster.toVersion);
    adjacency.set(upcaster.fromVersion, targets);
  }
  const visiting = new Set<number>();
  const visited = new Set<number>();
  const visit = (version: number): void => {
    if (visiting.has(version)) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_UPCASTER_CYCLE,
        'State upcaster graph contains a cycle',
        { family, recordType, version },
      );
    }
    if (visited.has(version)) return;
    visiting.add(version);
    for (const target of adjacency.get(version) ?? []) visit(target);
    visiting.delete(version);
    visited.add(version);
  };
  for (const version of adjacency.keys()) visit(version);
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY NORMALIZATION
// ───────────────────────────────────────────────────────────────────

function normalizeVersion(
  family: string,
  recordType: string,
  candidate: StateVersionDefinition,
): RegisteredStateVersion {
  if (candidate === null || typeof candidate !== 'object') {
    throw definitionError('Every state version must be an object', { family, recordType });
  }
  const version = requirePositiveVersion(candidate.version, 'version');
  if (typeof candidate.validate !== 'function') {
    throw definitionError('Every state version requires a validator', {
      family,
      recordType,
      version,
    });
  }
  const fixture = normalizeStateRecord(candidate.fixture);
  const registered = Object.freeze({
    version,
    validate: candidate.validate,
    fixture,
    validatorDigest: functionDigest(candidate.validate),
    fixtureDigest: sha256Bytes(canonicalBytes(fixture)),
  });
  validateStateRecord(fixture, {
    family,
    recordType,
    currentVersion: version,
    versions: Object.freeze({ [version]: registered }),
    upcasters: Object.freeze({}),
  }, registered);
  return registered;
}

function normalizeUpcaster(
  family: string,
  recordType: string,
  candidate: StateUpcasterDefinition,
): RegisteredStateUpcaster {
  if (candidate === null || typeof candidate !== 'object') {
    throw definitionError('Every state upcaster must be an object', { family, recordType });
  }
  const identity = requireStableIdentity(candidate.identity, 'upcaster.identity');
  const fromVersion = requirePositiveVersion(candidate.fromVersion, 'upcaster.fromVersion');
  const toVersion = requirePositiveVersion(candidate.toVersion, 'upcaster.toVersion');
  if (typeof candidate.upcast !== 'function') {
    throw definitionError('Every state upcaster requires a callable transform', {
      family,
      recordType,
      identity,
    });
  }
  return Object.freeze({
    identity,
    fromVersion,
    toVersion,
    upcast: candidate.upcast,
    implementationDigest: functionDigest(candidate.upcast),
  });
}

function executeUpcaster(
  input: VersionedStateRecord,
  upcaster: RegisteredStateUpcaster,
  definition: RegisteredStateRecordType,
): { readonly record: VersionedStateRecord; readonly trace: StateUpcastHopTrace } {
  const mutableInput = mutableJsonClone(input);
  const inputBefore = canonicalJson(mutableInput);
  try {
    upcaster.upcast(mutableInput);
  } catch {
    if (canonicalJson(mutableInput) !== inputBefore) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UPCAST_MUTATED_INPUT,
        'State upcaster mutated its input before failing',
        { family: input.family, recordType: input.recordType, fromVersion: input.stateVersion },
      );
    }
  }
  if (canonicalJson(mutableInput) !== inputBefore) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_MUTATED_INPUT,
      'State upcaster mutated its input',
      { family: input.family, recordType: input.recordType, fromVersion: input.stateVersion },
    );
  }

  let first: StateUpcastOutcome;
  let second: StateUpcastOutcome;
  try {
    first = upcaster.upcast(immutableJsonClone(input));
    second = upcaster.upcast(immutableJsonClone(input));
  } catch {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_EXECUTION_FAILED,
      'State upcaster threw for a validated declared input',
      { family: input.family, recordType: input.recordType, fromVersion: input.stateVersion },
    );
  }
  if (canonicalJson(first) !== canonicalJson(second)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_NON_DETERMINISTIC,
      'Repeated state upcaster execution produced different canonical output',
      { family: input.family, recordType: input.recordType, fromVersion: input.stateVersion },
    );
  }

  const output = normalizeStateRecord(first.record);
  if (output.stateVersion !== upcaster.toVersion) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.UPCAST_INVALID_OUTPUT,
      'State upcaster output does not match its registered adjacent edge',
      {
        family: input.family,
        recordType: input.recordType,
        fromVersion: upcaster.fromVersion,
        toVersion: upcaster.toVersion,
      },
    );
  }
  assertIdentityPreserved(input, output);
  assertLosslessOutcome(input, { ...first, record: output });
  const targetVersion = definition.versions[upcaster.toVersion];
  if (!targetVersion) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
      'State upcaster target version is not registered',
      { family: input.family, recordType: input.recordType, version: upcaster.toVersion },
    );
  }
  validateStateRecord(output, definition, targetVersion);

  return Object.freeze({
    record: output,
    trace: Object.freeze({
      identity: upcaster.identity,
      implementationDigest: upcaster.implementationDigest,
      fromVersion: upcaster.fromVersion,
      toVersion: upcaster.toVersion,
      inputDigest: sha256Bytes(canonicalBytes(input)),
      outputDigest: sha256Bytes(canonicalBytes(output)),
    }),
  });
}

function registerRecordType(candidate: StateRecordTypeDefinition): RegisteredStateRecordType {
  if (candidate === null || typeof candidate !== 'object') {
    throw definitionError('Every state record definition must be an object');
  }
  const family = requireStableName(candidate.family, 'family');
  const recordType = requireStableName(candidate.recordType, 'recordType');
  const currentVersion = requirePositiveVersion(candidate.currentVersion, 'currentVersion');
  if (!Array.isArray(candidate.versions) || !Array.isArray(candidate.upcasters)) {
    throw definitionError('State versions and upcasters must be arrays', { family, recordType });
  }

  const versions: Record<number, RegisteredStateVersion> = Object.create(null);
  for (const version of candidate.versions.map((entry) => normalizeVersion(family, recordType, entry))) {
    if (versions[version.version]) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_DUPLICATE_VERSION,
        'State record type contains a duplicate version',
        { family, recordType, version: version.version },
      );
    }
    versions[version.version] = version;
  }
  const expectedVersions = Array.from({ length: currentVersion }, (_, index) => index + 1);
  if (
    Object.keys(versions).length !== expectedVersions.length
    || expectedVersions.some((version) => !versions[version])
  ) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
      'Supported state versions must form a complete range starting at one',
      { family, recordType, currentVersion },
    );
  }

  const upcasterEntries = candidate.upcasters.map((entry) =>
    normalizeUpcaster(family, recordType, entry));
  assertNoCycle(family, recordType, upcasterEntries);
  const upcasters: Record<number, RegisteredStateUpcaster> = Object.create(null);
  const identities = new Set<string>();
  for (const upcaster of upcasterEntries) {
    if (
      upcasters[upcaster.fromVersion]
      || identities.has(upcaster.identity)
    ) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_DUPLICATE_UPCASTER,
        'State registry contains a duplicate or forked upcaster edge',
        { family, recordType, fromVersion: upcaster.fromVersion },
      );
    }
    identities.add(upcaster.identity);
    if (upcaster.toVersion !== upcaster.fromVersion + 1) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_NON_ADJACENT_UPCASTER,
        'State upcasters must advance exactly one version',
        {
          family,
          recordType,
          fromVersion: upcaster.fromVersion,
          toVersion: upcaster.toVersion,
        },
      );
    }
    if (!versions[upcaster.fromVersion] || !versions[upcaster.toVersion]) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
        'State upcaster references an unsupported version',
        { family, recordType, fromVersion: upcaster.fromVersion },
      );
    }
    upcasters[upcaster.fromVersion] = upcaster;
  }
  for (let version = 1; version < currentVersion; version += 1) {
    if (!upcasters[version]) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
        'Every historical state version requires one adjacent upcaster',
        { family, recordType, version },
      );
    }
  }
  if (upcasterEntries.length !== Math.max(0, currentVersion - 1)) {
    throw definitionError('Current state version cannot own an outgoing upcaster', {
      family,
      recordType,
      currentVersion,
    });
  }

  const definition = Object.freeze({
    family,
    recordType,
    currentVersion,
    versions: Object.freeze(versions),
    upcasters: Object.freeze(upcasters),
  });
  for (let version = 1; version < currentVersion; version += 1) {
    executeUpcaster(versions[version].fixture, upcasters[version], definition);
  }
  return definition;
}

function inspectionFor(definition: RegisteredStateRecordType): StateRegistryInspectionEntry {
  return Object.freeze({
    family: definition.family,
    recordType: definition.recordType,
    currentVersion: definition.currentVersion,
    supportedVersions: Object.freeze(
      Object.values(definition.versions).map(({ version }) => version).sort((a, b) => a - b),
    ),
    versions: Object.freeze(
      Object.values(definition.versions)
        .sort((left, right) => left.version - right.version)
        .map(({ version, validatorDigest, fixtureDigest }) => Object.freeze({
          version,
          validatorDigest,
          fixtureDigest,
        })),
    ),
    upcasters: Object.freeze(
      Object.values(definition.upcasters)
        .sort((left, right) => left.fromVersion - right.fromVersion)
        .map(({ identity, fromVersion, toVersion, implementationDigest }) => Object.freeze({
          identity,
          fromVersion,
          toVersion,
          implementationDigest,
        })),
    ),
  });
}

function stateFor(
  registry: StateUpcasterRegistry,
): Readonly<Record<string, RegisteredStateRecordType>> {
  const state = REGISTRY_STATE.get(registry);
  if (!state) throw definitionError('State upcaster registry is unavailable');
  return state;
}

// ───────────────────────────────────────────────────────────────────
// 5. SOURCE DECODING
// ───────────────────────────────────────────────────────────────────

function sourceBytes(input: StoredStateBytes): readonly number[] {
  const bytes = typeof input === 'string' ? Buffer.from(input, 'utf8') : Uint8Array.from(input);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_CANONICAL_BYTES) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.SOURCE_LIMIT_EXCEEDED,
      'Stored state bytes are empty or exceed the compatibility read limit',
      { byteLength: bytes.byteLength, limit: MAX_CANONICAL_BYTES },
    );
  }
  return Object.freeze(Array.from(bytes));
}

function parseSource(bytes: readonly number[]): JsonObject {
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    throw new CompatibilityError(
      CompatibilityErrorCodes.SOURCE_INVALID_UTF8,
      'Stored state is not valid UTF-8',
      { byteLength: bytes.length },
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new CompatibilityError(
      CompatibilityErrorCodes.SOURCE_INVALID_JSON,
      'Stored state is not valid JSON',
      { byteLength: bytes.length },
    );
  }
  try {
    return immutableJsonClone(asJsonObject(parsed, 'storedState'));
  } catch {
    throw new CompatibilityError(
      CompatibilityErrorCodes.SOURCE_INVALID_SHAPE,
      'Stored state must be a bounded plain JSON object',
      { byteLength: bytes.length },
    );
  }
}

function decodeSource(source: JsonObject, codec: StateRecordCodec): VersionedStateRecord {
  requireStableIdentity(codec.identity, 'codec.identity');
  const family = requireStableName(codec.family, 'codec.family');
  const recordType = requireStableName(codec.recordType, 'codec.recordType');
  if (typeof codec.decode !== 'function') {
    throw definitionError('State codec requires a callable decoder', { family, recordType });
  }

  const mutableInput = mutableJsonClone(source);
  const before = canonicalJson(mutableInput);
  let first: VersionedStateRecord;
  try {
    first = codec.decode(mutableInput);
  } catch (error: unknown) {
    if (canonicalJson(mutableInput) !== before) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.CODEC_MUTATED_INPUT,
        'State codec mutated its source before rejecting it',
        { family, recordType },
      );
    }
    if (error instanceof CompatibilityError) throw error;
    throw new CompatibilityError(
      CompatibilityErrorCodes.CODEC_REJECTED,
      'State codec rejected the stored source',
      { family, recordType },
    );
  }
  if (canonicalJson(mutableInput) !== before) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.CODEC_MUTATED_INPUT,
      'State codec mutated its source',
      { family, recordType },
    );
  }

  let second: VersionedStateRecord;
  try {
    second = codec.decode(immutableJsonClone(source));
  } catch (error: unknown) {
    if (error instanceof CompatibilityError) throw error;
    throw new CompatibilityError(
      CompatibilityErrorCodes.CODEC_REJECTED,
      'State codec failed against immutable source input',
      { family, recordType },
    );
  }
  if (canonicalJson(first) !== canonicalJson(second)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.CODEC_NON_DETERMINISTIC,
      'Repeated state decoding produced different canonical records',
      { family, recordType },
    );
  }

  const record = normalizeStateRecord(first);
  if (record.family !== family || record.recordType !== recordType) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.CODEC_REJECTED,
      'State codec output does not match its registered discriminator',
      { family, recordType },
    );
  }
  return record;
}

// ───────────────────────────────────────────────────────────────────
// 6. PUBLIC REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Immutable startup registry for fixture-backed state schemas and adjacent upcasters. */
export class StateUpcasterRegistry {
  public readonly digest: string;

  public constructor(definitions: readonly StateRecordTypeDefinition[]) {
    if (!Array.isArray(definitions) || definitions.length === 0) {
      throw definitionError('State registry requires at least one record type definition');
    }
    const registered: Record<string, RegisteredStateRecordType> = Object.create(null);
    for (const candidate of definitions) {
      const definition = registerRecordType(candidate);
      const key = recordKey(definition.family, definition.recordType);
      if (registered[key]) {
        throw new CompatibilityError(
          CompatibilityErrorCodes.REGISTRY_DUPLICATE_RECORD_TYPE,
          'State registry contains a duplicate family and record type',
          { family: definition.family, recordType: definition.recordType },
        );
      }
      registered[key] = definition;
    }
    const state = Object.freeze(registered);
    REGISTRY_STATE.set(this, state);
    this.digest = sha256Bytes(canonicalBytes(
      Object.values(state)
        .sort((left, right) => compareCodeUnits(
          recordKey(left.family, left.recordType),
          recordKey(right.family, right.recordType),
        ))
        .map(inspectionFor),
    ));
    Object.freeze(this);
  }

  /** Return a deterministic function-free manifest of every admitted state chain. */
  public inspect(): readonly StateRegistryInspectionEntry[] {
    return Object.freeze(
      Object.values(stateFor(this))
        .sort((left, right) => compareCodeUnits(
          recordKey(left.family, left.recordType),
          recordKey(right.family, right.recordType),
        ))
        .map(inspectionFor),
    );
  }

  /** Resolve one exact family and record type or fail closed. */
  public resolve(family: string, recordType: string): StateRegistryInspectionEntry {
    const definition = stateFor(this)[recordKey(family, recordType)];
    if (!definition) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UNKNOWN_RECORD_TYPE,
        'State family and record type are not registered',
        { family, recordType },
      );
    }
    return inspectionFor(definition);
  }

  /** Parse, decode, validate, and completely upcast one stored state record. */
  public read(input: StoredStateBytes, codec: StateRecordCodec): StateReadResult {
    const bytes = sourceBytes(input);
    const parsed = parseSource(bytes);
    const storedRecord = decodeSource(parsed, codec);
    const definition = stateFor(this)[recordKey(storedRecord.family, storedRecord.recordType)];
    if (!definition) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UNKNOWN_RECORD_TYPE,
        'Decoded state family and record type are not registered',
        { family: storedRecord.family, recordType: storedRecord.recordType },
      );
    }
    if (storedRecord.stateVersion > definition.currentVersion) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.FUTURE_STATE_VERSION,
        'Stored state version is newer than the current reader',
        {
          family: storedRecord.family,
          recordType: storedRecord.recordType,
          storedVersion: storedRecord.stateVersion,
          currentVersion: definition.currentVersion,
        },
      );
    }
    const storedVersion = definition.versions[storedRecord.stateVersion];
    if (!storedVersion) {
      throw new CompatibilityError(
        CompatibilityErrorCodes.UNSUPPORTED_STATE_VERSION,
        'Stored state version is not supported by the registry',
        {
          family: storedRecord.family,
          recordType: storedRecord.recordType,
          storedVersion: storedRecord.stateVersion,
        },
      );
    }
    validateStateRecord(storedRecord, definition, storedVersion);

    let effectiveRecord = storedRecord;
    const hopTrace: StateUpcastHopTrace[] = [];
    const chain = [];
    for (
      let version = storedRecord.stateVersion;
      version < definition.currentVersion;
      version += 1
    ) {
      const upcaster = definition.upcasters[version];
      if (!upcaster) {
        throw new CompatibilityError(
          CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
          'State registry cannot resolve a complete adjacent chain',
          { family: storedRecord.family, recordType: storedRecord.recordType, version },
        );
      }
      const result = executeUpcaster(effectiveRecord, upcaster, definition);
      effectiveRecord = result.record;
      hopTrace.push(result.trace);
      chain.push({
        identity: upcaster.identity,
        implementationDigest: upcaster.implementationDigest,
        fromVersion: upcaster.fromVersion,
        toVersion: upcaster.toVersion,
      });
    }

    const effectiveBytes = canonicalBytes(effectiveRecord);
    const codecDigest = functionDigest(codec.decode);
    return Object.freeze({
      stored: Object.freeze({
        bytes,
        byteLength: bytes.length,
        digest: sha256Bytes(Uint8Array.from(bytes)),
        record: storedRecord,
      }),
      effective: Object.freeze({
        record: effectiveRecord,
        canonicalBytes: effectiveBytes,
        canonicalDigest: sha256Bytes(effectiveBytes),
      }),
      storedVersion: storedRecord.stateVersion,
      effectiveVersion: effectiveRecord.stateVersion,
      codecIdentity: codec.identity,
      codecDigest,
      registryDigest: this.digest,
      chainIdentity: sha256Bytes(canonicalBytes({
        family: storedRecord.family,
        recordType: storedRecord.recordType,
        storedVersion: storedRecord.stateVersion,
        codecIdentity: codec.identity,
        codecDigest,
        chain,
      })),
      hopTrace: Object.freeze(hopTrace),
    });
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. CODEC AND GATE HELPERS
// ───────────────────────────────────────────────────────────────────

/** Require an explicit numeric version or an exact fixture-backed string mapping. */
export function requireExplicitStateVersion(
  source: Readonly<JsonObject>,
  field: string,
  stringVersions: Readonly<Record<string, number>> = {},
): number {
  if (!Object.prototype.hasOwnProperty.call(source, field)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.AMBIGUOUS_UNVERSIONED_STATE,
      'Legacy state has no governed version discriminator',
      { field },
    );
  }
  const value = source[field];
  if (Number.isSafeInteger(value) && (value as number) > 0) return value as number;
  if (
    typeof value === 'string'
    && Object.prototype.hasOwnProperty.call(stringVersions, value)
  ) {
    return requirePositiveVersion(stringVersions[value], field);
  }
  throw new CompatibilityError(
    CompatibilityErrorCodes.AMBIGUOUS_UNVERSIONED_STATE,
    'Legacy state version discriminator is unsupported or ambiguous',
    { field, valueType: typeof value },
  );
}

/** Choose the unchanged direct reader when compatibility upcasting is disabled. */
export function readWithUpcastingGate<T>(
  isEnabled: boolean,
  readDirectLegacy: () => T,
  readCompatible: () => T,
): T {
  return isEnabled ? readCompatible() : readDirectLegacy();
}
