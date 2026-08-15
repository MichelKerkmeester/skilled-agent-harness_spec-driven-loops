// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Invalidation Identity Registry
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { SHADOW_PARITY_SCHEMA_VERSION } from './shadow-parity-types.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  ParityCaseManifest,
  ParityCertificate,
  ParityCertificateBindings,
  ParityInvalidationIdentityRegistry,
  ShadowParityCaseResult,
} from './shadow-parity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function sortedUnique(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((entry, index) => entry === expected[index]);
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
  return value;
}

/** Validate and freeze the complete certificate invalidation identity registry. */
export function parseParityInvalidationIdentityRegistry(
  input: unknown,
  field = 'parityCertificate.identity_registry',
): ParityInvalidationIdentityRegistry {
  if (!isRecord(input) || !hasExactKeys(input, [
    'schema_version', 'identities', 'registry_digest',
  ])) {
    throw new TypeError(`${field} must use the closed identity-registry shape`);
  }
  if (input.schema_version !== SHADOW_PARITY_SCHEMA_VERSION) {
    throw new TypeError(`${field}.schema_version is not registered`);
  }
  if (!isRecord(input.identities) || !hasExactKeys(input.identities, [
    'code', 'build', 'base', 'seal', 'replay', 'upcaster', 'reducer',
    'projection', 'adapter', 'comparator', 'harness',
  ])) {
    throw new TypeError(`${field}.identities must use the closed identity shape`);
  }
  const identities = Object.freeze(Object.fromEntries(
    Object.entries(input.identities).map(([identity, value]) => [
      identity,
      requireDigest(value, `${field}.identities.${identity}`),
    ]),
  )) as ParityInvalidationIdentityRegistry['identities'];
  return Object.freeze({
    schema_version: SHADOW_PARITY_SCHEMA_VERSION,
    identities,
    registry_digest: requireDigest(input.registry_digest, `${field}.registry_digest`),
  });
}

/** Freeze a certificate only after its nested invalidation registry is validated. */
export function parseParityCertificateIdentityRegistry(
  input: unknown,
  field = 'parityCertificate',
): ParityCertificate {
  if (!isRecord(input)) {
    throw new TypeError(`${field} must be an object`);
  }
  return Object.freeze({
    ...input,
    identity_registry: parseParityInvalidationIdentityRegistry(
      input.identity_registry,
      `${field}.identity_registry`,
    ),
  }) as unknown as ParityCertificate;
}

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRY
// ───────────────────────────────────────────────────────────────────

/** Commit every contract identity whose drift makes parity evidence stale. */
export function createParityInvalidationIdentityRegistry(input: Readonly<{
  manifest: ParityCaseManifest;
  caseResults: readonly ShadowParityCaseResult[];
  bindings: ParityCertificateBindings;
}>): ParityInvalidationIdentityRegistry {
  const extendedBindings = input.bindings as ParityCertificateBindings & Readonly<{
    candidate_code_digest?: string;
    seal_registry_digest?: string;
    upcaster_digest?: string;
  }>;
  const passes = input.caseResults.filter((result) => result.ok);
  const referenceSetDigests = sortedUnique(passes.map(
    (result) => result.referenceSetDigest,
  ));
  const upcasterMaterial = sortedUnique(passes.flatMap((result) => (
    result.runs.flatMap((run) => [
      run.legacy.descriptor.upcaster_registry_digest,
      ...run.legacy.descriptor.ordered_chain_identities,
      run.dark.descriptor.upcaster_registry_digest,
      ...run.dark.descriptor.ordered_chain_identities,
    ])
  )));
  const identities = Object.freeze({
    code: extendedBindings.candidate_code_digest
      ?? input.bindings.candidate_build_digest,
    build: input.bindings.candidate_build_digest,
    base: digest({ base_sha: input.manifest.baseSha }),
    seal: extendedBindings.seal_registry_digest
      ?? digest(referenceSetDigests),
    replay: input.bindings.replay_contract_digest,
    upcaster: extendedBindings.upcaster_digest
      ?? digest(upcasterMaterial),
    reducer: input.bindings.reducer_digest,
    projection: input.bindings.projection_digest,
    adapter: input.bindings.adapter_digest,
    comparator: input.bindings.comparator_digest,
    harness: input.bindings.harness_digest,
  });
  const core = Object.freeze({
    schema_version: SHADOW_PARITY_SCHEMA_VERSION,
    identities,
  });
  return Object.freeze({
    ...core,
    registry_digest: digest(core),
  });
}
