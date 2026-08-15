// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Easy-Config Loader
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConfidenceStates } from '../contracts/common.js';
import { PrivacyClasses } from '../contracts/context.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { createLlamaCppModelRecord, createOllamaModelRecord } from '../providers/presets.js';
import { mergeCapabilitySnapshot } from '../providers/registry.js';
import { ProviderFamilies } from '../providers/types.js';
import { createDefaultProviderTransport } from '../transports/http.js';

import type { PrivacyClass, PrivacyDecision } from '../contracts/context.js';
import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ContextSelectionInput } from '../context/selector.js';
import type { JudgeMode } from '../fidelity/types.js';
import type { PrivacyRoutePolicy } from '../privacy/types.js';
import type { ProviderModelRecord, ProviderTransport } from '../providers/types.js';
import type { RenderCapabilities } from '../render/types.js';

/** Local provider kinds an operator may declare in the enablement file. */
export const LocalProviderKinds = {
  OLLAMA: 'ollama',
  LM_STUDIO: 'lmstudio',
  LLAMA_CPP: 'llama.cpp',
  OPENAI_COMPATIBLE: 'openai-compatible',
} as const;

/** Local provider kind. */
export type LocalProviderKind =
  typeof LocalProviderKinds[keyof typeof LocalProviderKinds];

/** One operator-declared local provider row from the enablement file. */
export interface LocalProviderConfig {
  readonly kind: LocalProviderKind;
  readonly model: string;
  readonly endpoint?: string;
}

/** Complete projection wiring the loader hands to an entry point. */
export interface LocalProjectionConfig {
  readonly candidateProviderIds: readonly string[];
  readonly policy: PrivacyRoutePolicy;
  readonly judgeMode: JudgeMode;
  readonly prompt: PromptProfileRecord;
  readonly records: readonly ProviderModelRecord[];
  readonly transport: ProviderTransport;
  readonly context: ContextSelectionInput;
  readonly capabilities: RenderCapabilities;
}

/** Injected construction inputs that keep the loader deterministic in tests. */
export interface LocalProjectionBuildOptions {
  readonly now?: string;
  readonly transport?: ProviderTransport;
}

/** Git-ignored opt-in file at the package root, shared with the enablement gate. */
const LOCAL_OVERRIDE_URL = new URL('../../enablement.local.json', import.meta.url);

/** Copy-editing instruction proven by the package test helper shape. */
const COPY_EDITING_INSTRUCTION =
  'Rewrite only the user message in plain English. Output only the rewrite.';

/** Bounded window the loader stamps onto locally observed model capabilities. */
const CAPABILITY_EXPIRY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const CONTEXT_MAXIMUM_AGE_MS = 600_000;
const CONTEXT_LIMIT_CODEPOINTS = 4_000;
const COPY_EDITING_TEMPERATURE = 0.2;

/**
 * Parse a parsed enablement-file object into the full projection wiring, or
 * null when projection is not opted in or the provider block is absent or
 * malformed. The core is pure so the whole fail-closed matrix is testable
 * without touching the filesystem or the network.
 */
export function parseLocalProjectionConfig(
  parsed: unknown,
  options: LocalProjectionBuildOptions = {},
): LocalProjectionConfig | null {
  if (!isRecord(parsed) || parsed.enabled !== true) {
    return null;
  }
  const provider = parseLocalProvider(parsed.localProvider);
  if (provider === null) {
    return null;
  }
  return buildLocalProjectionConfig(provider, options);
}

/**
 * Validate one operator-declared provider block. Every unknown or malformed
 * field yields null so the caller keeps the exact-original fallback rather than
 * projecting through a provider the operator never declared.
 */
function parseLocalProvider(value: unknown): LocalProviderConfig | null {
  if (!isRecord(value) || !isLocalProviderKind(value.kind)) {
    return null;
  }
  if (typeof value.model !== 'string' || value.model.length === 0) {
    return null;
  }
  if (
    value.endpoint !== undefined
    && (typeof value.endpoint !== 'string' || !isHttpUrl(value.endpoint))
  ) {
    return null;
  }
  return {
    kind: value.kind,
    model: value.model,
    ...(value.endpoint !== undefined ? { endpoint: value.endpoint } : {}),
  };
}

/**
 * Construct the full projection wiring for one validated provider block. The
 * record reuses the shipped local presets, the prompt-control capabilities are
 * confirmed through the shipped snapshot merge so controls compile, and the
 * policy, context, and judge are loader-chosen local-only defaults. Any failure
 * to construct a valid record fails closed to null.
 */
export function buildLocalProjectionConfig(
  provider: LocalProviderConfig,
  options: LocalProjectionBuildOptions = {},
): LocalProjectionConfig | null {
  const now = options.now ?? new Date().toISOString();
  const configuredEndpoint = provider.endpoint ?? defaultEndpointFor(provider.kind);
  if (!isHttpUrl(configuredEndpoint)) {
    return null;
  }
  const endpoint = resolveProviderEndpoint(provider.kind, configuredEndpoint);
  const observedAt = now;
  const expiresAt = new Date(Date.parse(now) + CAPABILITY_EXPIRY_WINDOW_MS).toISOString();
  const privacyClass = isLoopbackHost(endpoint)
    ? PrivacyClasses.LOCAL_OFFLINE
    : PrivacyClasses.LOCAL_NETWORKED;
  const base = createLocalRecord(provider, endpoint, privacyClass, observedAt, expiresAt);
  const confirmed = mergeCapabilitySnapshot(base, {
    providerId: base.provider.providerId,
    modelId: base.provider.modelId,
    sourceUrl: base.capabilityEvidence.sourceUrl,
    observedAt,
    expiresAt,
    capabilities: [{
      name: 'temperature-control',
      state: 'yes',
      confidence: ConfidenceStates.CONFIRMED,
    }],
  }, now);
  if (confirmed.status !== 'applied') {
    return null;
  }
  const record = confirmed.record;
  return deepFreeze({
    candidateProviderIds: Object.freeze([record.provider.providerId]),
    policy: {
      allowedPrivacyClasses: privacyClass === PrivacyClasses.LOCAL_OFFLINE
        ? [PrivacyClasses.LOCAL_OFFLINE]
        : [PrivacyClasses.LOCAL_OFFLINE, PrivacyClasses.LOCAL_NETWORKED],
      egressConsent: false,
      requiredKnownFacts: [],
    },
    judgeMode: 'required',
    prompt: createCopyEditingPrompt(record),
    records: Object.freeze([record]),
    transport: options.transport ?? createDefaultProviderTransport(),
    context: createLocalContext(privacyClass, now),
    capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
  });
}

/**
 * Read the git-ignored enablement file and build the projection wiring from it.
 * File or JSON failures return null so the caller never sees a throw; the pure
 * parse core decides everything else.
 */
export function loadLocalProjectionConfig(
  options: LocalProjectionBuildOptions = {},
): LocalProjectionConfig | null {
  let text: string;
  try {
    text = readFileSync(fileURLToPath(LOCAL_OVERRIDE_URL), 'utf8');
  } catch {
    return null;
  }
  try {
    return parseLocalProjectionConfig(JSON.parse(text) as unknown, options);
  } catch {
    return null;
  }
}

function createLocalRecord(
  provider: LocalProviderConfig,
  endpoint: string,
  privacyClass: Extract<PrivacyClass, 'local-networked' | 'local-offline'>,
  observedAt: string,
  expiresAt: string,
): ProviderModelRecord {
  const options = {
    modelId: provider.model,
    privacyClass,
    observedAt,
    capabilitiesExpireAt: expiresAt,
    endpoint,
  };
  switch (provider.kind) {
    case LocalProviderKinds.OLLAMA:
      return createOllamaModelRecord(options);
    case LocalProviderKinds.LM_STUDIO:
    case LocalProviderKinds.LLAMA_CPP:
    case LocalProviderKinds.OPENAI_COMPATIBLE:
      return createLlamaCppModelRecord(options);
  }
}

function createCopyEditingPrompt(record: ProviderModelRecord): PromptProfileRecord {
  return {
    contractKind: 'prompt-profile',
    schemaVersion: '1.0.0',
    promptVersion: 'local-provider-v1',
    systemInstruction: COPY_EDITING_INSTRUCTION,
    copyEditingScope: 'assistant-message-only',
    protectedValuePolicyVersion: 'protected-spans/1.0.0',
    temperature: COPY_EDITING_TEMPERATURE,
    thinkingMode: 'provider-default',
    providerControlMappings: [{
      providerId: record.controlProviderId,
      modelPattern: record.provider.modelId,
      control: 'temperature',
      wireField: record.family === ProviderFamilies.OLLAMA
        ? 'options.temperature'
        : 'temperature',
      support: 'yes',
      confidence: ConfidenceStates.CONFIRMED,
    }],
    unsupportedControlBehavior: 'exact-original',
  };
}

function createLocalContext(privacyClass: PrivacyClass, now: string): ContextSelectionInput {
  const privacy: PrivacyDecision = {
    contractKind: 'privacy-decision',
    schemaVersion: '1.0.0',
    privacyClass,
    route: 'local',
    egressConsent: false,
    decision: 'allow',
    reasonCode: 'allowed-by-policy',
  };
  return {
    contextId: 'local-provider:context',
    transcript: null,
    privacy,
    now,
    maximumAgeMs: CONTEXT_MAXIMUM_AGE_MS,
    limitCodepoints: CONTEXT_LIMIT_CODEPOINTS,
    noContextFallback: 'rewrite-without-context',
  };
}

function defaultEndpointFor(kind: LocalProviderKind): string {
  switch (kind) {
    case LocalProviderKinds.OLLAMA:
      return 'http://127.0.0.1:11434/api/chat';
    case LocalProviderKinds.LM_STUDIO:
      return 'http://127.0.0.1:1234/v1/chat/completions';
    case LocalProviderKinds.LLAMA_CPP:
    case LocalProviderKinds.OPENAI_COMPATIBLE:
      return 'http://127.0.0.1:8080/v1/chat/completions';
  }
}

function resolveProviderEndpoint(kind: LocalProviderKind, endpoint: string): string {
  if (kind !== LocalProviderKinds.LM_STUDIO) {
    return endpoint;
  }
  const url = new URL(endpoint);
  if (url.pathname === '/v1' || url.pathname === '/v1/') {
    url.pathname = '/v1/chat/completions';
    return url.href;
  }
  return endpoint;
}

function isLocalProviderKind(value: unknown): value is LocalProviderKind {
  return value === LocalProviderKinds.OLLAMA
    || value === LocalProviderKinds.LM_STUDIO
    || value === LocalProviderKinds.LLAMA_CPP
    || value === LocalProviderKinds.OPENAI_COMPATIBLE;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isLoopbackHost(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return hostname === 'localhost'
      || hostname === '::1'
      || hostname === '127.0.0.1'
      || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
