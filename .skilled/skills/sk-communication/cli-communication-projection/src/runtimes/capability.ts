// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Capability Mapping
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';

import type {
  DegradationMode,
  RuntimeAdapterReasonCode,
  RuntimeCapabilityEvidence,
  RuntimeCapabilityInput,
  RuntimeCapabilityRecord,
} from './types.js';

const SEMANTIC_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const FAIL_CLOSED_DEFAULTS = Object.freeze({
  unknownCapability: 'original-only',
  incompatibleRuntimeMajor: 'original-only',
  incompatibleProtocolMajor: 'original-only',
} as const);

/** Compatibility result for an observed runtime and protocol pair. */
export type RuntimeCompatibility =
  | { readonly compatible: true; readonly reasonCode: 'none' }
  | {
    readonly compatible: false;
    readonly reasonCode: Extract<
      RuntimeAdapterReasonCode,
      'incompatible-protocol-major' | 'incompatible-runtime-major'
    >;
  };

/** Map dated capability evidence into one immutable presentation record. */
export function mapRuntimeCapability(
  input: RuntimeCapabilityInput,
): RuntimeCapabilityRecord {
  const isEvidenceDated = Number.isFinite(Date.parse(input.evidence.observedAt));
  const hasVersionPins = majorOf(input.testedVersions.runtime) !== null
    && majorOf(input.testedVersions.protocol) !== null;
  const hasKnownSafeBoundary = input.evidence.safePresentationBoundary.state === 'yes'
    && isEvidenceDated
    && hasVersionPins;
  const ownsFullProjection = hasKnownSafeBoundary
    && input.evidence.completeMessage.state === 'yes'
    && input.evidence.atomicRenderDecision.state === 'yes';
  const modes = ownsFullProjection || hasKnownSafeBoundary
    ? supportedDegradations(input.evidence)
    : ['original-only'] as const;

  return deepFreeze({
    recordVersion: 'runtime-capability/1.0.0',
    runtime: input.runtime,
    pathId: input.pathId,
    protocol: input.protocol,
    testedVersions: { ...input.testedVersions },
    evidence: structuredClone(input.evidence),
    presentationTier: ownsFullProjection ? 'full-projection' : 'safe-native',
    allowedDegradationModes: modes,
    failClosedDefaults: FAIL_CLOSED_DEFAULTS,
  });
}

/** Fail closed when either observed major differs from its tested version. */
export function assessRuntimeCompatibility(
  record: RuntimeCapabilityRecord,
  runtimeVersion: string,
  protocolVersion: string,
): RuntimeCompatibility {
  const observedRuntimeMajor = majorOf(runtimeVersion);
  const testedRuntimeMajor = majorOf(record.testedVersions.runtime);
  if (observedRuntimeMajor === null || observedRuntimeMajor !== testedRuntimeMajor) {
    return Object.freeze({
      compatible: false,
      reasonCode: 'incompatible-runtime-major',
    });
  }

  const observedProtocolMajor = majorOf(protocolVersion);
  const testedProtocolMajor = majorOf(record.testedVersions.protocol);
  if (observedProtocolMajor === null || observedProtocolMajor !== testedProtocolMajor) {
    return Object.freeze({
      compatible: false,
      reasonCode: 'incompatible-protocol-major',
    });
  }
  return Object.freeze({ compatible: true, reasonCode: 'none' });
}

function supportedDegradations(
  evidence: RuntimeCapabilityEvidence,
): readonly DegradationMode[] {
  const modes: DegradationMode[] = [];
  if (evidence.append.state === 'yes') {
    modes.push('append');
  }
  if (evidence.sidecar.state === 'yes') {
    modes.push('sidecar');
  }
  modes.push('original-only');
  return Object.freeze(modes);
}

function majorOf(version: string): number | null {
  const match = SEMANTIC_VERSION_PATTERN.exec(version);
  if (match === null) {
    return null;
  }
  const major = Number(match[1]);
  return Number.isSafeInteger(major) ? major : null;
}
