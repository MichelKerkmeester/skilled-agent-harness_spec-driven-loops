// ───────────────────────────────────────────────────────────────────
// MODULE: Evidence-Backed Provider Presets
// ───────────────────────────────────────────────────────────────────

import { PrivacyClasses } from '../contracts/context.js';
import { deepFreeze } from '../fidelity/freeze.js';
import {
  ProviderFamilies,
  ProviderPrivacyFactNames,
} from './types.js';

import type { PrivacyClass } from '../contracts/context.js';
import type { ProviderCapability, ProviderRecord } from '../contracts/provider.js';
import type {
  ProviderCostRecord,
  ProviderModelRecord,
  ProviderPrivacyFact,
} from './types.js';

const OPENCODE_GO_DOCS = 'https://opencode.ai/docs/go/';
const OLLAMA_DOCS = 'https://docs.ollama.com/api/chat';
const LLAMA_CPP_DOCS =
  'https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md';

/** Configuration that never accepts a hosted credential value. */
export interface OpenCodeGoPresetOptions {
  readonly credentialReference: `env:${string}` | `keychain:${string}` | `managed:${string}`;
  readonly timeoutMs?: number;
  readonly priority?: number;
}

/** Operator assertions needed for a model-specific local deployment. */
export interface LocalProviderPresetOptions {
  readonly modelId: string;
  readonly privacyClass: Extract<PrivacyClass, 'local-networked' | 'local-offline'>;
  readonly observedAt: string;
  readonly capabilitiesExpireAt: string;
  readonly endpoint?: string;
  readonly timeoutMs?: number;
  readonly priority?: number;
}

/** OpenCode Go DeepSeek V4 Flash with dated privacy facts and unknown model controls. */
export function createOpenCodeGoDeepSeekV4FlashRecord(
  options: OpenCodeGoPresetOptions,
): ProviderModelRecord {
  const observedAt = '2026-08-11T00:00:00.000Z';
  const expiresAt = '2026-08-31T23:59:59.000Z';
  return createRecord({
    recordVersion: 'provider-model/1.0.0',
    family: ProviderFamilies.OPENCODE_GO,
    controlProviderId: 'opencode-go',
    provider: {
      contractKind: 'provider',
      schemaVersion: '1.0.0',
      providerId: 'opencode-go-deepseek-v4-flash',
      deploymentMode: 'hosted',
      protocol: 'openai-chat-completions',
      endpoint: 'https://opencode.ai/zen/go/v1/chat/completions',
      modelId: 'deepseek-v4-flash',
      credentialReference: options.credentialReference,
      providerVersion: 'research-snapshot-2026-08-11',
      capabilities: baseCapabilities(true),
      privacyClass: PrivacyClasses.HOSTED_ZDR,
      termsCheckedAt: observedAt,
      termsExpiresAt: expiresAt,
      fallbackPolicy: noFallback(),
    },
    authorizationScheme: 'bearer',
    timeoutMs: options.timeoutMs ?? 30_000,
    priority: options.priority ?? 100,
    capabilityEvidence: {
      sourceUrl: OPENCODE_GO_DOCS,
      observedAt,
      expiresAt,
    },
    cost: unknownCost(OPENCODE_GO_DOCS, observedAt, expiresAt),
    privacyFacts: [
      knownFact(ProviderPrivacyFactNames.RETENTION, '0-days', OPENCODE_GO_DOCS, observedAt, expiresAt),
      knownFact(ProviderPrivacyFactNames.TRAINING_USE, 'not-used', OPENCODE_GO_DOCS, observedAt, expiresAt),
      unknownFact(ProviderPrivacyFactNames.RESIDENCY, OPENCODE_GO_DOCS, observedAt, expiresAt),
    ],
  });
}

/** Ollama native chat route whose model-specific controls require a fresh probe. */
export function createOllamaModelRecord(
  options: LocalProviderPresetOptions,
): ProviderModelRecord {
  return createRecord({
    recordVersion: 'provider-model/1.0.0',
    family: ProviderFamilies.OLLAMA,
    controlProviderId: 'ollama-local',
    provider: localProvider(
      'ollama-local',
      'ollama-native',
      options.endpoint ?? 'http://127.0.0.1:11434/api/chat',
      options,
      baseCapabilities(true),
    ),
    authorizationScheme: 'none',
    timeoutMs: options.timeoutMs ?? 60_000,
    priority: options.priority ?? 80,
    capabilityEvidence: {
      sourceUrl: OLLAMA_DOCS,
      observedAt: options.observedAt,
      expiresAt: options.capabilitiesExpireAt,
    },
    cost: unknownCost(OLLAMA_DOCS, options.observedAt, null),
    privacyFacts: unknownFacts(OLLAMA_DOCS, options.observedAt),
  });
}

/** llama.cpp OpenAI-style route whose build and template controls require a probe. */
export function createLlamaCppModelRecord(
  options: LocalProviderPresetOptions,
): ProviderModelRecord {
  return createRecord({
    recordVersion: 'provider-model/1.0.0',
    family: ProviderFamilies.LLAMA_CPP,
    controlProviderId: 'llama-cpp-local',
    provider: localProvider(
      'llama-cpp-local',
      'llama-cpp-openai',
      options.endpoint ?? 'http://127.0.0.1:8080/v1/chat/completions',
      options,
      baseCapabilities(true),
    ),
    authorizationScheme: 'none',
    timeoutMs: options.timeoutMs ?? 60_000,
    priority: options.priority ?? 70,
    capabilityEvidence: {
      sourceUrl: LLAMA_CPP_DOCS,
      observedAt: options.observedAt,
      expiresAt: options.capabilitiesExpireAt,
    },
    cost: unknownCost(LLAMA_CPP_DOCS, options.observedAt, null),
    privacyFacts: unknownFacts(LLAMA_CPP_DOCS, options.observedAt),
  });
}

function createRecord(record: ProviderModelRecord): ProviderModelRecord {
  return deepFreeze(structuredClone(record));
}

function localProvider(
  providerId: string,
  protocol: ProviderRecord['protocol'],
  endpoint: string,
  options: LocalProviderPresetOptions,
  capabilities: readonly ProviderCapability[],
): ProviderRecord {
  return {
    contractKind: 'provider',
    schemaVersion: '1.0.0',
    providerId,
    deploymentMode: 'local',
    protocol,
    endpoint,
    modelId: options.modelId,
    credentialReference: 'none:local',
    providerVersion: `operator-snapshot-${options.observedAt}`,
    capabilities,
    privacyClass: options.privacyClass,
    termsCheckedAt: null,
    termsExpiresAt: null,
    fallbackPolicy: noFallback(),
  };
}

function baseCapabilities(chatConfirmed: boolean): readonly ProviderCapability[] {
  return [
    { name: 'chat', state: chatConfirmed ? 'yes' : 'unknown', confidence: chatConfirmed ? 'confirmed' : 'unknown' },
    { name: 'streaming', state: 'yes', confidence: 'confirmed' },
    { name: 'temperature-control', state: 'unknown', confidence: 'unknown' },
    { name: 'thinking-control', state: 'unknown', confidence: 'unknown' },
    { name: 'cancellation', state: 'unknown', confidence: 'unknown' },
  ];
}

function noFallback(): ProviderRecord['fallbackPolicy'] {
  return { mode: 'none', providerIds: [], preservePrivacyClass: true };
}

function unknownCost(
  sourceUrl: string,
  observedAt: string,
  expiresAt: string | null,
): ProviderCostRecord {
  return {
    state: 'unknown',
    currency: 'USD',
    inputPerMillionTokens: null,
    outputPerMillionTokens: null,
    sourceUrl,
    observedAt,
    expiresAt,
  };
}

function knownFact(
  name: ProviderPrivacyFact['name'],
  value: string,
  sourceUrl: string,
  observedAt: string,
  expiresAt: string,
): ProviderPrivacyFact {
  return { name, state: 'known', value, confidence: 'confirmed', sourceUrl, observedAt, expiresAt };
}

function unknownFact(
  name: ProviderPrivacyFact['name'],
  sourceUrl: string,
  observedAt: string,
  expiresAt: string | null,
): ProviderPrivacyFact {
  return { name, state: 'unknown', value: null, confidence: 'unknown', sourceUrl, observedAt, expiresAt };
}

function unknownFacts(sourceUrl: string, observedAt: string): readonly ProviderPrivacyFact[] {
  return Object.values(ProviderPrivacyFactNames).map((name) =>
    unknownFact(name, sourceUrl, observedAt, null));
}
