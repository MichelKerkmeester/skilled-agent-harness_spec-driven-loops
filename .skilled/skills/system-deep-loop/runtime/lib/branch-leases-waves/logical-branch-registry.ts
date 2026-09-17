// ───────────────────────────────────────────────────────────────────
// MODULE: Logical Branch Registry
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  BranchOrchestrationError,
  BranchOrchestrationErrorCodes,
} from './errors.js';
import { compileImmutableWavePlan } from './wave-plan.js';

import type {
  BranchManifestEntry,
  CompileBranchRunOptions,
  CompiledBranchRun,
  CompiledLogicalBranch,
  LogicalBranchCoordinates,
  RegisteredLogicalBranch,
  WavePolicy,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const LOGICAL_BRANCH_DERIVATION_VERSION = 1;
export const LOGICAL_BRANCH_ID_PATTERN = /^lb-v1-[a-f0-9]{32}$/u;

const COORDINATE_SEGMENT_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const MAX_REPLICA_ORDINAL = 65_535;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION AND DERIVATION
// ───────────────────────────────────────────────────────────────────

function requireCoordinateSegment(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || value !== value.trim()
    || value !== value.normalize('NFC')
    || !COORDINATE_SEGMENT_PATTERN.test(value)
    || value.includes('..')
  ) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_COORDINATES,
      'identity',
      'Logical branch coordinate is not canonical and directory-safe',
      { field, value },
    );
  }
  return value;
}

function requireDerivationVersion(value: unknown): number {
  if (value !== LOGICAL_BRANCH_DERIVATION_VERSION) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.UNKNOWN_DERIVATION_VERSION,
      'identity',
      'Logical branch derivation version is not supported',
      { derivationVersion: value },
    );
  }
  return value;
}

function requireReplicaOrdinal(value: unknown): number {
  if (
    !Number.isSafeInteger(value)
    || (value as number) <= 0
    || (value as number) > MAX_REPLICA_ORDINAL
  ) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_COORDINATES,
      'identity',
      'Replica ordinal must be a bounded positive integer',
      { replicaOrdinal: value },
    );
  }
  return value as number;
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_COORDINATES,
      'manifest',
      'Manifest fingerprint input must be a lowercase SHA-256 digest',
      { field },
    );
  }
  return value;
}

/** Normalize coordinates without accepting case, Unicode, or traversal aliases. */
export function normalizeLogicalBranchCoordinates(
  input: Readonly<{
    modelId: unknown;
    branchId: unknown;
    replicaOrdinal: unknown;
    derivationVersion: unknown;
  }>,
): LogicalBranchCoordinates {
  return Object.freeze({
    modelId: requireCoordinateSegment(input.modelId, 'modelId'),
    branchId: requireCoordinateSegment(input.branchId, 'branchId'),
    replicaOrdinal: requireReplicaOrdinal(input.replicaOrdinal),
    derivationVersion: requireDerivationVersion(input.derivationVersion),
  });
}

/** Canonical coordinate bytes are the only source of logical branch identity. */
export function logicalBranchCoordinateKey(
  coordinates: LogicalBranchCoordinates,
): string {
  return canonicalJson(coordinates);
}

/** Derive a stable directory-safe ID without using position, time, host, or process state. */
export function deriveLogicalBranchId(
  coordinatesInput: LogicalBranchCoordinates,
  digestCoordinates: (coordinates: LogicalBranchCoordinates) => string = (coordinates) =>
    sha256Bytes(canonicalBytes(coordinates)),
): string {
  const coordinates = normalizeLogicalBranchCoordinates(coordinatesInput);
  const digest = requireDigest(digestCoordinates(coordinates), 'coordinateDigest');
  return `lb-v1-${digest.slice(0, 32)}`;
}

/** Reject every spelling except the exact encoder output grammar. */
export function validateLogicalBranchId(value: unknown): string {
  if (typeof value !== 'string' || !LOGICAL_BRANCH_ID_PATTERN.test(value)) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_COORDINATES,
      'identity',
      'Logical branch ID is not in canonical encoded form',
      { logicalBranchId: value },
    );
  }
  return value;
}

// ───────────────────────────────────────────────────────────────────
// 3. MANIFEST COMPILATION
// ───────────────────────────────────────────────────────────────────

/** Validate a complete manifest before returning any registrable branch. */
export function compileLogicalBranches<TItem>(
  entries: readonly BranchManifestEntry<TItem>[],
  options: CompileBranchRunOptions = {},
): Readonly<{
  manifestFingerprint: string;
  branches: readonly CompiledLogicalBranch<TItem>[];
}> {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_COORDINATES,
      'manifest',
      'Branch manifest must contain at least one entry',
    );
  }

  const coordinateKeys = new Set<string>();
  const branchIds = new Map<string, string>();
  const branches: CompiledLogicalBranch<TItem>[] = [];
  for (const entry of entries) {
    const coordinates = normalizeLogicalBranchCoordinates({
      modelId: entry.modelId,
      branchId: entry.branchId,
      replicaOrdinal: entry.replicaOrdinal,
      derivationVersion: entry.derivationVersion ?? LOGICAL_BRANCH_DERIVATION_VERSION,
    });
    const coordinateKey = logicalBranchCoordinateKey(coordinates);
    if (coordinateKeys.has(coordinateKey)) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.DUPLICATE_COORDINATES,
        'manifest',
        'Manifest contains duplicate normalized branch coordinates',
        { coordinateKey },
      );
    }
    coordinateKeys.add(coordinateKey);

    const invocationFingerprint = requireDigest(
      entry.invocationFingerprint,
      'invocationFingerprint',
    );
    const logicalBranchId = deriveLogicalBranchId(
      coordinates,
      options.digestCoordinates,
    );
    const priorCoordinate = branchIds.get(logicalBranchId);
    if (priorCoordinate !== undefined && priorCoordinate !== coordinateKey) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.BRANCH_ID_COLLISION,
        'manifest',
        'Distinct normalized coordinates produced the same logical branch ID',
        { logicalBranchId },
      );
    }
    branchIds.set(logicalBranchId, coordinateKey);
    branches.push(Object.freeze({
      logicalBranchId,
      coordinateKey,
      coordinates,
      invocationFingerprint,
      poolItem: entry.poolItem,
    }));
  }

  branches.sort((left, right) => left.logicalBranchId.localeCompare(right.logicalBranchId));
  const manifestFingerprint = sha256Bytes(canonicalBytes({
    derivationVersion: LOGICAL_BRANCH_DERIVATION_VERSION,
    branches: branches.map((branch) => ({
      logicalBranchId: branch.logicalBranchId,
      coordinates: branch.coordinates,
      invocationFingerprint: branch.invocationFingerprint,
    })),
  }));
  if (
    options.expectedManifestFingerprint !== undefined
    && options.expectedManifestFingerprint !== manifestFingerprint
  ) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
      'manifest',
      'Re-expanded manifest does not match the expected fingerprint',
      {
        actualManifestFingerprint: manifestFingerprint,
        expectedManifestFingerprint: options.expectedManifestFingerprint,
      },
    );
  }
  return Object.freeze({
    manifestFingerprint,
    branches: Object.freeze(branches),
  });
}

/** Bind canonical branches to one deterministic immutable wave plan. */
export function compileBranchRun<TItem>(
  entries: readonly BranchManifestEntry<TItem>[],
  wavePolicy: WavePolicy,
  options: CompileBranchRunOptions = {},
): CompiledBranchRun<TItem> {
  const compiled = compileLogicalBranches(entries, options);
  const wavePlan = compileImmutableWavePlan(
    compiled.manifestFingerprint,
    compiled.branches,
    wavePolicy,
  );
  const assignments = new Map<string, { readonly waveId: string; readonly waveOrdinal: number }>();
  for (const wave of wavePlan.waves) {
    for (const logicalBranchId of wave.memberBranchIds) {
      assignments.set(logicalBranchId, { waveId: wave.waveId, waveOrdinal: wave.ordinal });
    }
  }
  const branches: RegisteredLogicalBranch<TItem>[] = compiled.branches.map((branch) => {
    const assignment = assignments.get(branch.logicalBranchId);
    if (!assignment) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
        'wave',
        'Wave plan omitted a registered branch',
        { logicalBranchId: branch.logicalBranchId },
      );
    }
    const registrationKey = sha256Bytes(canonicalBytes({
      logicalBranchId: branch.logicalBranchId,
      coordinateKey: branch.coordinateKey,
      invocationFingerprint: branch.invocationFingerprint,
      manifestFingerprint: compiled.manifestFingerprint,
      waveId: assignment.waveId,
      waveOrdinal: assignment.waveOrdinal,
      wavePlanFingerprint: wavePlan.planFingerprint,
    }));
    return Object.freeze({
      ...branch,
      manifestFingerprint: compiled.manifestFingerprint,
      registrationKey,
      waveId: assignment.waveId,
      waveOrdinal: assignment.waveOrdinal,
      wavePlanFingerprint: wavePlan.planFingerprint,
    });
  });
  return Object.freeze({
    manifestFingerprint: compiled.manifestFingerprint,
    branches: Object.freeze(branches),
    wavePlan,
  });
}
