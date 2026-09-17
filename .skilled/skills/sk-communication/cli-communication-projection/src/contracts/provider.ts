// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Contract
// ───────────────────────────────────────────────────────────────────

import type { ConfidenceState, ContractHeader } from './common.js';
import type { PrivacyClass } from './context.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** One provider capability with explicit support and confidence. */
export interface ProviderCapability {
  readonly name: ProviderCapabilityName;
  readonly state: 'no' | 'unknown' | 'yes';
  readonly confidence: ConfidenceState;
}

/** Explicit provider fallback policy; an empty list means no fallback. */
export interface ProviderFallbackPolicy {
  readonly mode: 'explicit-list' | 'none';
  readonly providerIds: readonly string[];
  readonly preservePrivacyClass: boolean;
}

/** Model-specific provider, protocol, credential, and privacy record. */
export interface ProviderRecord extends ContractHeader {
  readonly contractKind: 'provider';
  readonly providerId: string;
  readonly deploymentMode: 'hosted' | 'local';
  readonly protocol: ProviderProtocol;
  readonly endpoint: string;
  readonly modelId: string;
  readonly credentialReference: string;
  readonly providerVersion: string;
  readonly capabilities: readonly ProviderCapability[];
  readonly privacyClass: PrivacyClass;
  readonly termsCheckedAt: string | null;
  readonly termsExpiresAt: string | null;
  readonly fallbackPolicy: ProviderFallbackPolicy;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Model capabilities used by routing and prompt-control decisions. */
export const ProviderCapabilityNames = {
  CANCELLATION: 'cancellation',
  CHAT: 'chat',
  STREAMING: 'streaming',
  STRUCTURED_OUTPUT: 'structured-output',
  TEMPERATURE_CONTROL: 'temperature-control',
  THINKING_CONTROL: 'thinking-control',
  TIMINGS: 'timings',
} as const;

/** Provider capability name. */
export type ProviderCapabilityName =
  typeof ProviderCapabilityNames[keyof typeof ProviderCapabilityNames];

/** Supported provider wire protocols. */
export const ProviderProtocols = {
  ANTHROPIC_MESSAGES: 'anthropic-messages',
  LLAMA_CPP_OPENAI: 'llama-cpp-openai',
  OLLAMA_NATIVE: 'ollama-native',
  OPENAI_CHAT_COMPLETIONS: 'openai-chat-completions',
  OPENAI_RESPONSES: 'openai-responses',
} as const;

/** Provider wire protocol. */
export type ProviderProtocol =
  typeof ProviderProtocols[keyof typeof ProviderProtocols];
