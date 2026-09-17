// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Schema
// ───────────────────────────────────────────────────────────────────

import { randomBytes } from 'node:crypto';

import {
  canonicalBytes,
  sha256Bytes,
} from '../../event-envelope/index.js';
import {
  CONTINUITY_IDENTITY_SCHEMA_VERSION,
  ContinuityIdentityError,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
  ContinuityModes,
} from './continuity-identity-types.js';

import type {
  ContinuityIdentityKind,
  ContinuityIdentityRef,
  ContinuityIdentityState,
  ContinuityMode,
} from './continuity-identity-types.js';
import type { JsonObject, JsonValue } from '../../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const CONTINUITY_IDENTITY_PREFIX = 'dli';
export const CONTINUITY_MINT_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
export const CONTINUITY_HASH_PATTERN = /^[a-f0-9]{64}$/;
export const CONTINUITY_ALIAS_NAMESPACE_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

const IDENTITY_PATTERN = /^dli\.v([0-9]+)\.(lineage|claim|candidate|mode_session)\.([a-f0-9]{64})$/;
const MODE_VALUES = new Set<string>(Object.values(ContinuityModes));
const KIND_VALUES = new Set<string>(Object.values(ContinuityIdentityKinds));
const MAX_ALIAS_NAMESPACE_LENGTH = 128;
const MAX_LEGACY_ID_LENGTH = 4_096;
const MAX_BOUNDED_ID_LENGTH = 512;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function hasExactFields(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean {
  const keys = Object.keys(value);
  const allowed = new Set([...required, ...optional]);
  return required.every((field) => Object.prototype.hasOwnProperty.call(value, field))
    && keys.every((field) => allowed.has(field));
}

export function isHash(value: unknown): value is string {
  return typeof value === 'string' && CONTINUITY_HASH_PATTERN.test(value);
}

export function requireBoundedId(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || value.trim() === ''
    || value.length > MAX_BOUNDED_ID_LENGTH
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Continuity identity metadata requires a bounded non-empty string',
      { field },
    );
  }
  return value;
}

export function validateContinuityMode(value: unknown): ContinuityMode {
  if (typeof value !== 'string' || !MODE_VALUES.has(value)) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.CROSS_MODE_CONFLICT,
      'Mode is not registered for continuity transfer',
    );
  }
  return value as ContinuityMode;
}

export function validateContinuityKind(value: unknown): ContinuityIdentityKind {
  if (typeof value !== 'string' || !KIND_VALUES.has(value)) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Identity kind is not registered',
    );
  }
  return value as ContinuityIdentityKind;
}

// ───────────────────────────────────────────────────────────────────
// 3. IDENTITY OPERATIONS
// ───────────────────────────────────────────────────────────────────

/** Create the required 256-bit random token retained by an idempotent caller. */
export function createMintRequestToken(): string {
  return randomBytes(32).toString('hex');
}

/** Hash the raw token before any durable event or diagnostic sees it. */
export function mintRequestTokenDigest(token: unknown): string {
  if (typeof token !== 'string' || !CONTINUITY_MINT_TOKEN_PATTERN.test(token)) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_MINT_TOKEN,
      'Mint request token must be a lowercase 256-bit hexadecimal value',
    );
  }
  return sha256Bytes(canonicalBytes({
    domain: 'deep-loop-continuity-mint-token-v1',
    token,
  }));
}

/** Derive an opaque kind-bearing ID only from the immutable random token digest. */
export function identityRefFromTokenDigest(
  kind: ContinuityIdentityKind,
  tokenDigest: string,
): ContinuityIdentityRef {
  const validatedKind = validateContinuityKind(kind);
  if (!isHash(tokenDigest)) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_MINT_TOKEN,
      'Mint request token digest must be a lowercase SHA-256 value',
    );
  }
  const opaque = sha256Bytes(canonicalBytes({
    domain: 'deep-loop-continuity-identity-v1',
    token_digest: tokenDigest,
  }));
  return Object.freeze({
    id: `${CONTINUITY_IDENTITY_PREFIX}.v${CONTINUITY_IDENTITY_SCHEMA_VERSION}.${validatedKind}.${opaque}`,
    kind: validatedKind,
    schema_version: CONTINUITY_IDENTITY_SCHEMA_VERSION,
  });
}

/** Mint one deterministic retry-safe reference from a cryptographically random token. */
export function mintIdentity(
  kind: ContinuityIdentityKind,
  mintRequestToken: string,
): ContinuityIdentityRef {
  return identityRefFromTokenDigest(kind, mintRequestTokenDigest(mintRequestToken));
}

/** Parse an opaque ID and reject unknown versions, kinds, or encodings. */
export function parseIdentity(value: unknown): ContinuityIdentityRef {
  if (typeof value !== 'string' || value.length > 256) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Continuity identity must be a bounded opaque string',
    );
  }
  const match = IDENTITY_PATTERN.exec(value);
  if (!match || Number(match[1]) !== CONTINUITY_IDENTITY_SCHEMA_VERSION) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Continuity identity has an unsupported shape or schema version',
    );
  }
  return Object.freeze({
    id: value,
    kind: validateContinuityKind(match[2]),
    schema_version: CONTINUITY_IDENTITY_SCHEMA_VERSION,
  });
}

/** Validate a closed typed reference and optionally require one exact kind. */
export function validateIdentityRef(
  value: unknown,
  expectedKind?: ContinuityIdentityKind,
): ContinuityIdentityRef {
  if (
    !isPlainRecord(value)
    || !hasExactFields(value, ['id', 'kind', 'schema_version'])
    || value.schema_version !== CONTINUITY_IDENTITY_SCHEMA_VERSION
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.INVALID_IDENTITY,
      'Typed identity reference does not match the closed schema',
    );
  }
  const parsed = parseIdentity(value.id);
  if (value.kind !== parsed.kind) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.WRONG_KIND,
      'Typed identity reference kind does not match its opaque ID',
    );
  }
  if (expectedKind !== undefined && parsed.kind !== expectedKind) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.WRONG_KIND,
      'Typed identity reference has the wrong kind for this boundary',
      { expectedKind, actualKind: parsed.kind },
    );
  }
  return parsed;
}

/** Require the ID to encode the requested kind. */
export function assertIdentityKind(
  value: unknown,
  expectedKind: ContinuityIdentityKind,
): ContinuityIdentityRef {
  const parsed = typeof value === 'string' ? parseIdentity(value) : validateIdentityRef(value);
  if (parsed.kind !== expectedKind) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.WRONG_KIND,
      'Continuity identity kind substitution is forbidden',
      { expectedKind, actualKind: parsed.kind },
    );
  }
  return parsed;
}

// ───────────────────────────────────────────────────────────────────
// 4. ALIASES AND STATE
// ───────────────────────────────────────────────────────────────────

/** Validate a namespace without permitting path or hierarchy syntax. */
export function validateAliasNamespace(value: unknown): string {
  if (
    typeof value !== 'string'
    || value.length > MAX_ALIAS_NAMESPACE_LENGTH
    || !CONTINUITY_ALIAS_NAMESPACE_PATTERN.test(value)
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.ALIAS_CONFLICT,
      'Alias namespace must be bounded lowercase kebab-case',
    );
  }
  return value;
}

/** Hash a bounded legacy coordinate so raw values never enter the new ledger. */
export function legacyAliasDigest(namespace: unknown, legacyId: unknown): string {
  const validatedNamespace = validateAliasNamespace(namespace);
  if (
    typeof legacyId !== 'string'
    || legacyId.trim() === ''
    || legacyId.length > MAX_LEGACY_ID_LENGTH
  ) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.ALIAS_CONFLICT,
      'Legacy alias value must be a bounded non-empty string',
    );
  }
  return sha256Bytes(canonicalBytes({
    namespace: validatedNamespace,
    legacy_id: legacyId,
  }));
}

export function aliasKey(namespace: string, aliasDigest: string): string {
  return `${validateAliasNamespace(namespace)}:${aliasDigest}`;
}

export function provenanceDigest(provenance: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(provenance));
}

/** Return a fresh deterministic projection seed. */
export function createEmptyContinuityIdentityState(): ContinuityIdentityState {
  return {
    schema_version: CONTINUITY_IDENTITY_SCHEMA_VERSION,
    identities: {},
    mint_requests: {},
    aliases: {},
    relationships: [],
    attempts: {},
    cross_mode_references: [],
  };
}

/** Resolve one registered identity and fail before downstream execution. */
export function requireRegisteredIdentity(
  state: Readonly<ContinuityIdentityState>,
  value: unknown,
  expectedKind?: ContinuityIdentityKind,
): ContinuityIdentityRef {
  const ref = validateIdentityRef(value, expectedKind);
  const registered = state.identities[ref.id];
  if (!registered) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.UNKNOWN_IDENTITY,
      'Typed identity reference is absent from the verified ledger projection',
      { identityId: ref.id },
    );
  }
  if (registered.ref.kind !== ref.kind) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.IDENTITY_COLLISION,
      'Verified registry contains a cross-kind identity collision',
      { identityId: ref.id },
    );
  }
  return ref;
}

/** Resolve one namespaced legacy coordinate without consulting a legacy writer. */
export function resolveAlias(
  state: Readonly<ContinuityIdentityState>,
  namespace: string,
  legacyId: string,
  expectedKind?: ContinuityIdentityKind,
): ContinuityIdentityRef {
  const digest = legacyAliasDigest(namespace, legacyId);
  const identityId = state.aliases[aliasKey(namespace, digest)];
  if (!identityId) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.UNKNOWN_IDENTITY,
      'Legacy alias is absent from the verified identity projection',
    );
  }
  return requireRegisteredIdentity(state, parseIdentity(identityId), expectedKind);
}

/** Commit a JSON value without depending on object insertion order. */
export function continuityDigest(value: JsonValue): string {
  return sha256Bytes(canonicalBytes(value));
}
