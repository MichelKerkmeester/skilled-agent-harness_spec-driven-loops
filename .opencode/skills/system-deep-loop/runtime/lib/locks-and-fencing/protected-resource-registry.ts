// ───────────────────────────────────────────────────────────────────
// MODULE: Protected Resource Registry
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
} from './locks-and-fencing-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AtomicityDomain,
  CanonicalProtectedResource,
  ProtectedResourceIdentity,
  ProtectedResourceKind,
} from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. RESOURCE SCHEMAS
// ───────────────────────────────────────────────────────────────────

const RESOURCE_COMPONENTS: Readonly<Record<ProtectedResourceKind, readonly string[]>> =
  Object.freeze({
    [ProtectedResourceKinds.COUNCIL_ROUND]: ['topicId', 'roundId'],
    [ProtectedResourceKinds.FANOUT_STATUS]: ['packetId', 'runId', 'statusStreamId'],
    [ProtectedResourceKinds.LEDGER]: ['ledgerId'],
    [ProtectedResourceKinds.LINEAGE_STATE]: ['packetId', 'runId', 'lineageId'],
    [ProtectedResourceKinds.MERGE_TARGET]: ['packetId', 'runId', 'mergeTargetId'],
    [ProtectedResourceKinds.PAUSE_RESUME]: ['packetId', 'runId', 'lineageId'],
    [ProtectedResourceKinds.PROJECTION]: ['ledgerId', 'projectionId'],
    [ProtectedResourceKinds.WAIT_CHECKPOINT]: [
      'packetId',
      'runId',
      'lineageId',
      'checkpointId',
    ],
    [ProtectedResourceKinds.WRITER]: ['writerId'],
  });

const RESOURCE_KIND_ORDER: Readonly<Record<ProtectedResourceKind, number>> = Object.freeze({
  [ProtectedResourceKinds.LEDGER]: 10,
  [ProtectedResourceKinds.PROJECTION]: 20,
  [ProtectedResourceKinds.LINEAGE_STATE]: 30,
  [ProtectedResourceKinds.PAUSE_RESUME]: 40,
  [ProtectedResourceKinds.FANOUT_STATUS]: 50,
  [ProtectedResourceKinds.WAIT_CHECKPOINT]: 60,
  [ProtectedResourceKinds.MERGE_TARGET]: 70,
  [ProtectedResourceKinds.COUNCIL_ROUND]: 80,
  [ProtectedResourceKinds.WRITER]: 90,
});

const IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/u;

function failResource(message: string, details: Readonly<Record<string, unknown>>): never {
  throw new LocksAndFencingError(
    LocksAndFencingErrorCodes.INVALID_RESOURCE,
    'resource',
    message,
    details,
  );
}

function validateAtomicityDomain(value: unknown): asserts value is AtomicityDomain {
  if (value !== AtomicityDomains.SINGLE_HOST_FILESYSTEM) {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.UNSUPPORTED_ATOMICITY_DOMAIN,
      'resource',
      'Only the declared single-host filesystem atomicity domain is supported',
      { atomicityDomain: value },
    );
  }
}

/** Reject aliases, traversal syntax, mixed normalization, and empty identities. */
export function validateOpaqueIdentity(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || value !== value.trim()
    || value !== value.normalize('NFC')
    || !IDENTITY_PATTERN.test(value)
    || value === '.'
    || value === '..'
  ) {
    return failResource('Resource identity component is not canonical', { field, value });
  }
  return value;
}

/** Resolve one exact resource identity to its stable key, digest, and lock order. */
export function canonicalizeProtectedResource(input: unknown): CanonicalProtectedResource {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return failResource('Protected resource identity must be an object', {});
  }
  const raw = input as Record<string, unknown>;
  const actualTopLevelFields = Object.keys(raw).sort();
  const identityFields = ['atomicityDomain', 'components', 'kind'].sort();
  const canonicalFields = [
    ...identityFields,
    'orderKey',
    'resourceDigest',
    'resourceKey',
  ].sort();
  const isIdentityShape = actualTopLevelFields.length === identityFields.length
    && actualTopLevelFields.every((field, index) => field === identityFields[index]);
  const isCanonicalShape = actualTopLevelFields.length === canonicalFields.length
    && actualTopLevelFields.every((field, index) => field === canonicalFields[index]);
  if (!isIdentityShape && !isCanonicalShape) {
    return failResource('Protected resource identity has unknown or aliased fields', {
      actualTopLevelFields,
    });
  }
  const candidate = input as Partial<ProtectedResourceIdentity>;
  const expectedComponents = RESOURCE_COMPONENTS[candidate.kind as ProtectedResourceKind];
  if (!expectedComponents) {
    return failResource('Protected resource kind is not registered', { kind: candidate.kind });
  }
  validateAtomicityDomain(candidate.atomicityDomain);
  if (
    candidate.components === null
    || typeof candidate.components !== 'object'
    || Array.isArray(candidate.components)
  ) {
    return failResource('Protected resource components must be an object', {});
  }
  const actualFields = Object.keys(candidate.components).sort();
  const expectedFields = [...expectedComponents].sort();
  if (
    actualFields.length !== expectedFields.length
    || actualFields.some((field, index) => field !== expectedFields[index])
  ) {
    return failResource('Protected resource components do not match the registered schema', {
      actualFields,
      expectedFields,
      kind: candidate.kind,
    });
  }

  const components: Record<string, string> = {};
  for (const field of expectedComponents) {
    components[field] = validateOpaqueIdentity(candidate.components[field], field);
  }
  const descriptor: JsonObject = {
    atomicityDomain: candidate.atomicityDomain,
    components,
    kind: candidate.kind as ProtectedResourceKind,
    resourceVersion: 1,
  };
  const resourceKey = [
    'locks-v1',
    candidate.atomicityDomain,
    candidate.kind,
    ...expectedComponents.map((field) => `${field}=${components[field]}`),
  ].join('|');
  const resourceDigest = sha256Bytes(canonicalBytes(descriptor));
  const order = RESOURCE_KIND_ORDER[candidate.kind as ProtectedResourceKind];
  const orderKey = `${String(order).padStart(3, '0')}|${resourceKey}`;
  if (
    isCanonicalShape
    && (
      raw.resourceKey !== resourceKey
      || raw.resourceDigest !== resourceDigest
      || raw.orderKey !== orderKey
    )
  ) {
    return failResource('Derived resource identity fields do not match canonical values', {
      resourceDigest,
    });
  }
  return Object.freeze({
    kind: candidate.kind as ProtectedResourceKind,
    components: Object.freeze(components),
    atomicityDomain: candidate.atomicityDomain,
    resourceKey,
    resourceDigest,
    orderKey,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. SHIPPED WRITE-SURFACE MANIFEST
// ───────────────────────────────────────────────────────────────────

export interface ProtectedWriteSurfaceManifestEntry {
  readonly surfaceId: string;
  readonly sourcePath: string;
  readonly operation: string;
  readonly resourceKind: ProtectedResourceKind;
  readonly atomicityDomain: AtomicityDomain;
  readonly directReplacement: string;
}

/** Frozen inventory used to prove that every shipped writer has one dark replacement seam. */
export const PROTECTED_WRITE_SURFACE_MANIFEST: readonly ProtectedWriteSurfaceManifestEntry[] =
  Object.freeze([
    {
      surfaceId: 'authorized-ledger-append',
      sourcePath: 'runtime/lib/authorized-ledger/append-only-ledger.ts',
      operation: 'append authorized immutable frame',
      resourceKind: ProtectedResourceKinds.LEDGER,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedLedgerWriter.append',
    },
    {
      surfaceId: 'authorized-ledger-projection',
      sourcePath: 'runtime/lib/authorized-ledger/deterministic-reducer.ts',
      operation: 'replace or compare-and-swap named projection',
      resourceKind: ProtectedResourceKinds.PROJECTION,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'loop-lock-owner',
      sourcePath: 'runtime/lib/deep-loop/loop-lock.ts',
      operation: 'serialize loop ownership and heartbeat mutation',
      resourceKind: ProtectedResourceKinds.WRITER,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedLeaseCoordinator.acquire',
    },
    {
      surfaceId: 'cli-graph-writer',
      sourcePath: 'runtime/scripts/lib/cli-guards.cjs',
      operation: 'serialize graph and repair writer mutation',
      resourceKind: ProtectedResourceKinds.WRITER,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedLeaseCoordinator.withFence',
    },
    {
      surfaceId: 'council-round-state',
      sourcePath: 'runtime/lib/council/round-state-jsonl.cjs',
      operation: 'repair and append council round state',
      resourceKind: ProtectedResourceKinds.COUNCIL_ROUND,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'jsonl-repair-merge',
      sourcePath: 'runtime/lib/deep-loop/jsonl-repair.ts',
      operation: 'merge repaired JSONL records',
      resourceKind: ProtectedResourceKinds.MERGE_TARGET,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'fanout-status-stream',
      sourcePath: 'runtime/scripts/fanout-pool.cjs',
      operation: 'append fan-out orchestration status',
      resourceKind: ProtectedResourceKinds.FANOUT_STATUS,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'fanout-wait-checkpoint',
      sourcePath: 'runtime/scripts/fanout-run.cjs',
      operation: 'persist or clear wait checkpoint',
      resourceKind: ProtectedResourceKinds.WAIT_CHECKPOINT,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'fanout-salvage-merge',
      sourcePath: 'runtime/scripts/fanout-run.cjs',
      operation: 'merge lineage salvage into synthesis target',
      resourceKind: ProtectedResourceKinds.MERGE_TARGET,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'lineage-atomic-state',
      sourcePath: 'runtime/lib/deep-loop/atomic-state.ts',
      operation: 'replace per-lineage state snapshot',
      resourceKind: ProtectedResourceKinds.LINEAGE_STATE,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'pause-resume-transition',
      sourcePath: 'runtime/lib/deep-loop/lifecycle-taxonomy.cjs',
      operation: 'dispatch pause or resume transition',
      resourceKind: ProtectedResourceKinds.PAUSE_RESUME,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'FencedStateStore.replace',
    },
    {
      surfaceId: 'runtime-observability-stream',
      sourcePath: 'runtime/lib/deep-loop/observability-events.cjs',
      operation: 'append runtime observability event',
      resourceKind: ProtectedResourceKinds.FANOUT_STATUS,
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      directReplacement: 'recordLockLifecycleEvidence',
    },
  ]);

/** Validate uniqueness and return the canonical manifest digest. */
export function protectedWriteSurfaceManifestDigest(
  entries: readonly ProtectedWriteSurfaceManifestEntry[] = PROTECTED_WRITE_SURFACE_MANIFEST,
): string {
  const surfaceIds = new Set<string>();
  const operations = new Set<string>();
  for (const entry of entries) {
    validateOpaqueIdentity(entry.surfaceId, 'surfaceId');
    validateAtomicityDomain(entry.atomicityDomain);
    if (surfaceIds.has(entry.surfaceId)) {
      return failResource('Protected write surface ID is duplicated', {
        surfaceId: entry.surfaceId,
      });
    }
    const operationIdentity = `${entry.sourcePath}\u0000${entry.operation}`;
    if (operations.has(operationIdentity)) {
      return failResource('Protected write surface operation is duplicated', {
        operation: entry.operation,
        sourcePath: entry.sourcePath,
      });
    }
    surfaceIds.add(entry.surfaceId);
    operations.add(operationIdentity);
  }
  return sha256Bytes(canonicalBytes(entries as unknown as JsonObject[]));
}
