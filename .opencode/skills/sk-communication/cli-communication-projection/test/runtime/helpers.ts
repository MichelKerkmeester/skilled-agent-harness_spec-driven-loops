// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Runtime Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
  createOllamaModelRecord,
  createOpenCodeGoDeepSeekV4FlashRecord,
} from '../../src/index.js';
import { RuntimeCapabilityMatrix } from '../../src/runtimes/index.js';
import { createSyntheticEvent } from '../core/helpers.js';
import { confirmPromptControls, createPromptProfile } from '../providers/helpers.js';

import type {
  ContextSelectionInput,
  EventEnvelope,
  ExactOriginalRecord,
  FixtureProvenance,
  GenerationKey,
  IngestEventInput,
  PrivacyDecision,
  PrivacyRoutePolicy,
  PromptProfileRecord,
  ProviderModelRecord,
  StartGenerationInput,
} from '../../src/index.js';
import type {
  DoctorInput,
  DoctorModelProposal,
  DoctorReachabilityProbe,
  DoctorRuntimeProposal,
} from '../../src/doctor/index.js';

export const RUNTIME_NOW = '2026-08-12T00:00:00.000Z';
export const RUNTIME_OBSERVED_AT = '2026-08-11T12:00:00.000Z';
export const RUNTIME_EXPIRES_AT = '2026-08-20T00:00:00.000Z';

const provenance: FixtureProvenance = {
  sourceFamily: 'runtime-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: RUNTIME_OBSERVED_AT,
};

/** Create a synthetic text original with deterministic provenance. */
export function createMessageOriginal(originalId: string, text: string): ExactOriginalRecord {
  return createExactOriginalRecord(
    originalId,
    new TextEncoder().encode(text),
    'text/markdown; charset=utf-8',
    provenance,
  );
}

/** Create one isolated runtime generation key. */
export function createRuntimeKey(generationId: string, attempt = 1): GenerationKey {
  return {
    runtime: 'opencode',
    sessionId: 'session-runtime',
    turnId: 'turn-runtime',
    messageId: 'message-runtime',
    generationId,
    attempt,
  };
}

/** Build the generation and a single completed assistant-message event. */
export function createCompletedGeneration(sourceText: string, originalId = 'runtime-original') {
  const key = createRuntimeKey('runtime-generation');
  const original = createMessageOriginal(originalId, sourceText);
  const event: EventEnvelope = createSyntheticEvent({
    key,
    eventId: 'runtime-terminal-event',
    kind: 'assistant-message',
    phase: 'final',
    terminalStatus: 'completed',
    sourceSequence: 0,
    arrivalIndex: 0,
    original,
  });
  const generation: StartGenerationInput = { key, exactOriginal: original, startedAtMs: 0 };
  const events: IngestEventInput[] = [{ key, event, original, observedAtMs: 1 }];
  return { key, original, generation, events };
}

/** Create a fresh present-context selection input. */
export function createContextInput(
  now: string = RUNTIME_NOW,
  overrides: Partial<ContextSelectionInput> = {},
): ContextSelectionInput {
  const privacy: PrivacyDecision = {
    contractKind: 'privacy-decision',
    schemaVersion: '1.0.0',
    privacyClass: 'local-offline',
    route: 'local',
    egressConsent: false,
    decision: 'allow',
    reasonCode: 'allowed-by-policy',
  };
  return {
    contextId: 'runtime-context',
    transcript: {
      observedAt: now,
      messages: [{
        messageId: 'runtime-user-message',
        role: 'user',
        isMeta: false,
        textOriginalId: 'runtime-user-original',
        text: 'please project this message',
      }],
    },
    privacy,
    now,
    maximumAgeMs: 600_000,
    limitCodepoints: 4000,
    noContextFallback: 'rewrite-without-context',
    ...overrides,
  };
}

/** Create a local offline provider with freshly confirmed prompt controls. */
export function createLocalProviderRecord(): ProviderModelRecord {
  return confirmPromptControls(createOllamaModelRecord({
    modelId: 'runtime-ollama-model',
    privacyClass: 'local-offline',
    observedAt: RUNTIME_OBSERVED_AT,
    capabilitiesExpireAt: RUNTIME_EXPIRES_AT,
  }));
}

/** Create a hosted provider with freshly confirmed prompt controls. */
export function createHostedProviderRecord(): ProviderModelRecord {
  return confirmPromptControls(createOpenCodeGoDeepSeekV4FlashRecord({
    credentialReference: 'managed:runtime-hosted-test',
  }));
}

/** Prompt profile for one confirmed provider record. */
export function createRuntimePrompt(record: ProviderModelRecord): PromptProfileRecord {
  return createPromptProfile(record);
}

/** Privacy policy that allows only local offline routes. */
export function createLocalPolicy(): PrivacyRoutePolicy {
  return {
    allowedPrivacyClasses: ['local-offline'],
    egressConsent: false,
    requiredKnownFacts: [],
  };
}

/** Privacy policy that allows only the hosted ZDR route with egress consent. */
export function createHostedPolicy(): PrivacyRoutePolicy {
  return {
    allowedPrivacyClasses: ['hosted-zdr'],
    egressConsent: true,
    requiredKnownFacts: [],
  };
}

/** Return a fresh, ready-compatible doctor input for one provider record. */
export function createReadyDoctorInput(
  record: ProviderModelRecord,
  now: string = RUNTIME_NOW,
  overrides: Partial<DoctorInput> = {},
): DoctorInput {
  const entry = RuntimeCapabilityMatrix[0];
  if (entry === undefined) {
    throw new Error('Expected a runtime capability matrix entry.');
  }
  const runtimeProposal: DoctorRuntimeProposal = {
    runtime: entry.runtime,
    pathId: entry.pathId,
    runtimeVersion: entry.testedVersions.runtime,
    protocol: entry.protocol,
    protocolVersion: entry.testedVersions.protocol,
    presentationTier: entry.presentationTier,
  };
  const modelProposal: DoctorModelProposal = {
    providerId: record.provider.providerId,
    modelId: record.provider.modelId,
    requiredCapabilities: [],
  };
  return {
    proposedRuntimes: [runtimeProposal],
    proposedProviders: [record],
    proposedModels: [modelProposal],
    credentialReferencePresence: [],
    reachabilityProbe: reachableDoctorProbe,
    perProbeDeadlineMs: 100,
    totalDeadlineMs: 1000,
    now,
    ...overrides,
  };
}

/** Deterministic reachability probe that always reports the endpoint reachable. */
export const reachableDoctorProbe: DoctorReachabilityProbe = () => ({
  status: 'reachable',
  durationMs: 1,
});
