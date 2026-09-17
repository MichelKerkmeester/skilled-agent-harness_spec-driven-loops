// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Capability Matrix
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import { assessRuntimeCompatibility, mapRuntimeCapability } from './capability.js';
import { ClaudeCapabilityRecords } from './claude.js';
import { CodexCapabilityRecords } from './codex.js';
import { CursorCapabilityRecords } from './cursor.js';
import { DevinCapabilityRecords } from './devin.js';
import { OpenCodeCapabilityRecords } from './opencode.js';
import { PiCapabilityRecords } from './pi.js';

import type { RuntimeId } from '../contracts/common.js';
import type {
  DegradationMode,
  PresentationTier,
  RuntimeAdapterReasonCode,
  RuntimeCapabilityClaim,
  RuntimeCapabilityRecord,
} from './types.js';

const CAPABILITY_RECORDS: readonly RuntimeCapabilityRecord[] = Object.freeze([
  ...ClaudeCapabilityRecords,
  ...CodexCapabilityRecords,
  ...PiCapabilityRecords,
  ...OpenCodeCapabilityRecords,
  ...DevinCapabilityRecords,
  ...CursorCapabilityRecords,
]);

/** One path-level row derived from its adapter-owned capability record. */
export interface RuntimeCapabilityMatrixEntry extends RuntimeCapabilityRecord {
  readonly matrixVersion: 'runtime-capability-matrix/1.0.0';
  readonly degradationPolicy: DegradationMode;
}

/** Compatibility-aware matrix decision that fails closed across major changes. */
export interface RuntimeCapabilityMatrixResolution {
  readonly compatible: boolean;
  readonly runtime: RuntimeId;
  readonly pathId: string;
  readonly presentationTier: PresentationTier;
  readonly degradationPolicy: DegradationMode;
  readonly reasonCode: Extract<
    RuntimeAdapterReasonCode,
    'incompatible-protocol-major' | 'incompatible-runtime-major' | 'none'
  >;
}

/** Build an immutable matrix while recomputing every tier from adapter evidence. */
export function createRuntimeCapabilityMatrix(
  records: readonly RuntimeCapabilityRecord[] = CAPABILITY_RECORDS,
): readonly RuntimeCapabilityMatrixEntry[] {
  const seenPaths = new Set<string>();
  const entries = records.map((record) => {
    const pathKey = `${record.runtime}:${record.pathId}`;
    if (seenPaths.has(pathKey)) {
      throw new TypeError(`Runtime capability matrix contains duplicate path '${pathKey}'.`);
    }
    seenPaths.add(pathKey);

    const normalized = normalizeCapabilityEvidence(record);
    const degradationPolicy = normalized.allowedDegradationModes[0] ?? 'original-only';
    return deepFreeze({
      ...normalized,
      matrixVersion: 'runtime-capability-matrix/1.0.0',
      degradationPolicy,
    } satisfies RuntimeCapabilityMatrixEntry);
  });
  return deepFreeze(entries);
}

/** Resolve one pinned row and force incompatible majors to original-only. */
export function resolveRuntimeCapability(
  entry: RuntimeCapabilityMatrixEntry,
  runtimeVersion: string,
  protocolVersion: string,
): RuntimeCapabilityMatrixResolution {
  const compatibility = assessRuntimeCompatibility(entry, runtimeVersion, protocolVersion);
  if (!compatibility.compatible) {
    return deepFreeze({
      compatible: false,
      runtime: entry.runtime,
      pathId: entry.pathId,
      presentationTier: 'safe-native',
      degradationPolicy: 'original-only',
      reasonCode: compatibility.reasonCode,
    });
  }
  return deepFreeze({
    compatible: true,
    runtime: entry.runtime,
    pathId: entry.pathId,
    presentationTier: entry.presentationTier,
    degradationPolicy: entry.degradationPolicy,
    reasonCode: 'none',
  });
}

/** Consolidated matrix for every path declared by the six runtime adapters. */
export const RuntimeCapabilityMatrix = createRuntimeCapabilityMatrix();

function normalizeCapabilityEvidence(
  record: RuntimeCapabilityRecord,
): RuntimeCapabilityRecord {
  const evidence = record.evidence;
  if (!isConfirmedCapability(evidence.safePresentationBoundary)) {
    return mapRuntimeCapability({
      ...record,
      evidence: {
        ...evidence,
        safePresentationBoundary: { state: 'unknown', confidence: 'unknown' },
        append: { state: 'unknown', confidence: 'unknown' },
        sidecar: { state: 'unknown', confidence: 'unknown' },
      },
    });
  }
  if (
    !isConfirmedCapability(evidence.completeMessage)
    || !isConfirmedCapability(evidence.atomicRenderDecision)
  ) {
    return mapRuntimeCapability({
      ...record,
      evidence: {
        ...evidence,
        completeMessage: { state: 'unknown', confidence: 'unknown' },
        atomicRenderDecision: { state: 'unknown', confidence: 'unknown' },
      },
    });
  }
  return mapRuntimeCapability(record);
}

function isConfirmedCapability(claim: RuntimeCapabilityClaim): boolean {
  return claim.state === 'yes' && claim.confidence === 'confirmed';
}
