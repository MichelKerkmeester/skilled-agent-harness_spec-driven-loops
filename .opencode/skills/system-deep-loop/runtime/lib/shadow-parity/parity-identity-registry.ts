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
