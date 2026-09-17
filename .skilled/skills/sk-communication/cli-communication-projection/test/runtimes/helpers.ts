// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
  decideRender,
  protectMarkdown,
  validateProjectionCandidate,
} from '../../src/index.js';
import {
  ClaudeRuntimePaths,
  mapRuntimeCapability,
} from '../../src/runtimes/index.js';

import type {
  FixtureProvenance,
  RenderCapabilities,
  RenderDecision,
  RuntimeId,
} from '../../src/index.js';
import type {
  ClaudeRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeCapabilityInput,
  RuntimeCapabilityRecord,
} from '../../src/runtimes/index.js';

export const TESTED_CLAUDE_VERSION = '2.1.228';
export const TESTED_PROTOCOL_VERSION = '1.0.0';
export const OBSERVED_AT = '2026-08-12T00:00:00.000Z';

/** Required coordinates for one non-Claude runtime test input. */
export interface RuntimeInputCoordinates {
  readonly runtime: RuntimeId;
  readonly runtimeVersion: string;
  readonly protocol: string;
  readonly protocolVersion: string;
  readonly pathId: string;
  readonly canonical?: RuntimeCanonicalState;
}

const provenance: FixtureProvenance = {
  sourceFamily: 'runtime-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: OBSERVED_AT,
};

/** Create mutable outer canonical state around an immutable exact original. */
export function createCanonicalState(
  source = 'Runtime adapter exact original.',
): RuntimeCanonicalState {
  return {
    exactOriginal: createExactOriginalRecord(
      `runtime-original-${stableId(source)}`,
      new TextEncoder().encode(source),
      'text/markdown; charset=utf-8',
      provenance,
    ),
    transcriptRevision: 'transcript-r1',
    toolInputRevision: 'tool-input-r1',
    toolResultRevision: 'tool-result-r1',
    futureContextRevision: 'context-r1',
  };
}

/** Wrap one Claude event in the shared runtime input envelope. */
export function createClaudeInput(
  event: ClaudeRuntimeEvent,
  options: {
    readonly pathId?: string;
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<ClaudeRuntimeEvent> {
  const pathId = options.pathId ?? ClaudeRuntimePaths.HEADLESS;
  return {
    envelope: {
      envelopeVersion: 'runtime-envelope/1.0.0',
      runtime: 'claude',
      runtimeVersion: options.runtimeVersion ?? TESTED_CLAUDE_VERSION,
      protocol: pathId === ClaudeRuntimePaths.INTERACTIVE
        ? 'claude-message-display'
        : 'claude-headless-stream-json',
      protocolVersion: options.protocolVersion ?? TESTED_PROTOCOL_VERSION,
      pathId,
      sessionId: 'claude-session',
      turnId: 'claude-turn',
      messageId: 'claude-message',
      generationId: 'claude-generation',
      attempt: 1,
      capturedAt: OBSERVED_AT,
      event,
    },
    canonical: options.canonical ?? createCanonicalState(),
  };
}

/** Wrap one vendor event in the shared runtime input envelope. */
export function createRuntimeInput<TRuntimeEvent>(
  event: TRuntimeEvent,
  coordinates: RuntimeInputCoordinates,
): RuntimeAdapterInput<TRuntimeEvent> {
  return {
    envelope: {
      envelopeVersion: 'runtime-envelope/1.0.0',
      runtime: coordinates.runtime,
      runtimeVersion: coordinates.runtimeVersion,
      protocol: coordinates.protocol,
      protocolVersion: coordinates.protocolVersion,
      pathId: coordinates.pathId,
      sessionId: `${coordinates.runtime}-session`,
      turnId: `${coordinates.runtime}-turn`,
      messageId: `${coordinates.runtime}-message`,
      generationId: `${coordinates.runtime}-generation`,
      attempt: 1,
      capturedAt: OBSERVED_AT,
      event,
    },
    canonical: coordinates.canonical ?? createCanonicalState(),
  };
}

/** Create a complete final MessageDisplay event. */
export function finalMessage(eventId = 'claude-final'): ClaudeRuntimeEvent {
  return {
    type: 'message-display',
    eventId,
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  };
}

/** Create an accepted render decision backed by deterministic fidelity validation. */
export async function createAcceptedRenderDecision(
  source = 'A validated runtime projection.',
  capabilities: RenderCapabilities = {
    atomicReplace: true,
    appendAfterOriginal: true,
    sidecar: true,
  },
): Promise<RenderDecision> {
  const canonical = createCanonicalState(source);
  const protection = protectMarkdown({
    sourceText: source,
    exactOriginal: canonical.exactOriginal,
  });
  if (protection.status !== 'protected') {
    throw new Error('Expected runtime fixture protection to succeed.');
  }
  const validation = await validateProjectionCandidate({
    protection: protection.document,
    candidateText: protection.document.encodedText,
    providerTerminal: 'success',
    allPartsComplete: true,
    currentSourceSha256: protection.document.sourceSha256,
    judgeMode: 'disabled',
  });
  if (validation.status === 'rejected') {
    throw new Error('Expected a terminal fidelity outcome.');
  }
  return decideRender({
    validation,
    currentSourceSha256: validation.sourceSha256,
    sourceTerminal: 'completed',
    allPartsComplete: true,
    capabilities,
  });
}

/** Create an exact-original render decision from an incomplete source. */
export async function createRejectedRenderDecision(
  source = 'A rejected runtime projection.',
): Promise<RenderDecision> {
  const accepted = await createAcceptedRenderDecision(source);
  if (accepted.status !== 'projection') {
    throw new Error('Expected accepted render setup.');
  }
  const canonical = createCanonicalState(source);
  const protection = protectMarkdown({
    sourceText: source,
    exactOriginal: canonical.exactOriginal,
  });
  if (protection.status !== 'protected') {
    throw new Error('Expected runtime fixture protection to succeed.');
  }
  const validation = await validateProjectionCandidate({
    protection: protection.document,
    candidateText: protection.document.encodedText,
    providerTerminal: 'success',
    allPartsComplete: true,
    currentSourceSha256: protection.document.sourceSha256,
    judgeMode: 'disabled',
  });
  if (validation.status === 'rejected') {
    throw new Error('Expected a terminal fidelity outcome.');
  }
  return decideRender({
    validation,
    currentSourceSha256: validation.sourceSha256,
    sourceTerminal: 'completed',
    allPartsComplete: false,
    capabilities: {
      atomicReplace: true,
      appendAfterOriginal: true,
      sidecar: true,
    },
  });
}

/** Create one capability record from concise state overrides. */
export function createCapabilityRecord(
  overrides: Partial<RuntimeCapabilityInput['evidence']> = {},
): RuntimeCapabilityRecord {
  return mapRuntimeCapability({
    runtime: 'claude',
    pathId: 'test-runtime-path',
    protocol: 'test-runtime-protocol',
    testedVersions: {
      runtime: TESTED_CLAUDE_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: OBSERVED_AT,
      source: 'synthetic-runtime-capability',
      completeMessage: { state: 'yes', confidence: 'confirmed' },
      atomicRenderDecision: { state: 'yes', confidence: 'confirmed' },
      safePresentationBoundary: { state: 'yes', confidence: 'confirmed' },
      append: { state: 'no', confidence: 'confirmed' },
      sidecar: { state: 'no', confidence: 'confirmed' },
      ...overrides,
    },
  });
}

function stableId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
