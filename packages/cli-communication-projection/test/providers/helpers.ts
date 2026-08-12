// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
  protectMarkdown,
} from '../../src/index.js';
import {
  createLlamaCppModelRecord,
  createOllamaModelRecord,
  createOpenCodeGoDeepSeekV4FlashRecord,
  mergeCapabilitySnapshot,
} from '../../src/providers/index.js';
import { selectPrivacyRoute } from '../../src/privacy/index.js';

import type {
  FixtureProvenance,
  PrivacyClass,
  PromptProfileRecord,
  ProviderCapability,
  ProviderFallbackPolicy,
} from '../../src/index.js';
import type {
  ProviderFamily,
  ProviderModelRecord,
} from '../../src/providers/index.js';
import type {
  PrivacyRoute,
  PrivacyRoutePolicy,
} from '../../src/privacy/index.js';

export const NOW = '2026-08-12T00:00:00.000Z';
export const OBSERVED_AT = '2026-08-11T12:00:00.000Z';
export const EXPIRES_AT = '2026-08-20T00:00:00.000Z';

const provenance: FixtureProvenance = {
  sourceFamily: 'provider-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: OBSERVED_AT,
};

/** Protect one synthetic message and fail loudly if the fixture is invalid. */
export function createProviderDocument(
  source = 'Use `providerSecretCanary` at /srv/private and keep every fact.',
) {
  const exactOriginal = createExactOriginalRecord(
    'provider-original',
    new TextEncoder().encode(source),
    'text/markdown; charset=utf-8',
    provenance,
  );
  const result = protectMarkdown({
    sourceText: source,
    exactOriginal,
    configuredLiterals: ['providerSecretCanary'],
  });
  if (result.status !== 'protected') {
    throw new Error('Expected provider fixture protection to succeed.');
  }
  return result.document;
}

/** Create all adapter families with freshly confirmed prompt controls. */
export function createProviderMatrix(): readonly ProviderModelRecord[] {
  const records = [
    createOpenCodeGoDeepSeekV4FlashRecord({
      credentialReference: 'managed:opencode-go-test',
    }),
    createOllamaModelRecord({
      modelId: 'test-ollama-model',
      privacyClass: 'local-offline',
      observedAt: OBSERVED_AT,
      capabilitiesExpireAt: EXPIRES_AT,
    }),
    createLlamaCppModelRecord({
      modelId: 'test-llama-model',
      privacyClass: 'local-offline',
      observedAt: OBSERVED_AT,
      capabilitiesExpireAt: EXPIRES_AT,
    }),
    createGenericHostedRecord(),
  ];
  return Object.freeze(records.map(confirmPromptControls));
}

/** Add a fresh, model-specific control snapshot without mutating the preset. */
export function confirmPromptControls(record: ProviderModelRecord): ProviderModelRecord {
  const capabilities = mergeCapabilities(record.provider.capabilities, [
    { name: 'temperature-control', state: 'yes', confidence: 'confirmed' },
    { name: 'thinking-control', state: 'yes', confidence: 'confirmed' },
  ]);
  const result = mergeCapabilitySnapshot(record, {
    providerId: record.provider.providerId,
    modelId: record.provider.modelId,
    sourceUrl: 'https://provider.example.test/capabilities',
    observedAt: OBSERVED_AT,
    expiresAt: EXPIRES_AT,
    capabilities,
  }, NOW);
  if (result.status !== 'applied') {
    throw new Error('Expected the synthetic capability snapshot to apply.');
  }
  return result.record;
}

/** Create a profile whose controls are confirmed for exactly one model. */
export function createPromptProfile(
  record: ProviderModelRecord,
  behavior: PromptProfileRecord['unsupportedControlBehavior'] = 'exact-original',
): PromptProfileRecord {
  return {
    contractKind: 'prompt-profile',
    schemaVersion: '1.0.0',
    promptVersion: 'provider-test-v1',
    systemInstruction: 'Rewrite only the user message in plain English. Output only the rewrite.',
    copyEditingScope: 'assistant-message-only',
    protectedValuePolicyVersion: 'protected-spans/1.0.0',
    temperature: 0.3,
    thinkingMode: 'disabled',
    providerControlMappings: [
      {
        providerId: record.controlProviderId,
        modelPattern: record.provider.modelId,
        control: 'temperature',
        wireField: temperatureField(record.family),
        support: 'yes',
        confidence: 'confirmed',
      },
      {
        providerId: record.controlProviderId,
        modelPattern: record.provider.modelId,
        control: 'thinking',
        wireField: thinkingField(record.family),
        support: 'yes',
        confidence: 'confirmed',
      },
    ],
    unsupportedControlBehavior: behavior,
  };
}

/** Route one explicit primary under a broad test policy. */
export function approveRoute(
  records: readonly ProviderModelRecord[],
  primaryId: string,
  policyOverrides: Partial<PrivacyRoutePolicy> = {},
): PrivacyRoute {
  return selectPrivacyRoute({
    records,
    candidateProviderIds: [primaryId],
    policy: {
      allowedPrivacyClasses: [
        'hosted-retained',
        'hosted-zdr',
        'local-networked',
        'local-offline',
      ],
      egressConsent: true,
      requiredKnownFacts: [],
      ...policyOverrides,
    },
    now: NOW,
  });
}

/** Clone a record with one explicit fallback policy. */
export function withFallback(
  record: ProviderModelRecord,
  fallbackPolicy: ProviderFallbackPolicy,
): ProviderModelRecord {
  return structuredClone({
    ...record,
    provider: { ...record.provider, fallbackPolicy },
  });
}

/** Clone a record with a bounded timeout suitable for timer tests. */
export function withTimeout(record: ProviderModelRecord, timeoutMs: number): ProviderModelRecord {
  return structuredClone({ ...record, timeoutMs });
}

/** Return an OpenAI-style successful response. */
export function openAiResponse(content: string) {
  return {
    status: 200,
    body: {
      choices: [{ finish_reason: 'stop', message: { content } }],
    },
  } as const;
}

/** Return an Ollama native successful response. */
export function ollamaResponse(content: string) {
  return {
    status: 200,
    body: { done: true, message: { content } },
  } as const;
}

function createGenericHostedRecord(): ProviderModelRecord {
  const base = createOpenCodeGoDeepSeekV4FlashRecord({
    credentialReference: 'env:GENERIC_TEST_API_KEY',
  });
  return structuredClone({
    ...base,
    family: 'generic-hosted' as const,
    controlProviderId: 'generic-hosted-test',
    provider: {
      ...base.provider,
      providerId: 'generic-hosted-test',
      endpoint: 'https://provider.example.test/v1/chat/completions',
      modelId: 'generic-test-model',
      credentialReference: 'env:GENERIC_TEST_API_KEY',
      providerVersion: 'operator-snapshot-2026-08-11',
      privacyClass: 'hosted-retained' as PrivacyClass,
      fallbackPolicy: { mode: 'none' as const, providerIds: [], preservePrivacyClass: true },
    },
    privacyFacts: base.privacyFacts.map((fact) =>
      fact.name === 'retention'
        ? { ...fact, value: '30-days' }
        : fact.name === 'training-use'
          ? { ...fact, value: 'used' }
          : fact),
  });
}

function mergeCapabilities(
  existing: readonly ProviderCapability[],
  replacements: readonly ProviderCapability[],
): readonly ProviderCapability[] {
  const byName = new Map(replacements.map((capability) => [capability.name, capability]));
  return existing.map((capability) => byName.get(capability.name) ?? capability);
}

function temperatureField(family: ProviderFamily): string {
  return family === 'ollama' ? 'options.temperature' : 'temperature';
}

function thinkingField(family: ProviderFamily): string {
  switch (family) {
    case 'ollama':
      return 'think';
    case 'llama-cpp':
      return 'chat_template_kwargs.enable_thinking';
    case 'generic-hosted':
    case 'opencode-go':
      return 'reasoning_effort';
  }
}
