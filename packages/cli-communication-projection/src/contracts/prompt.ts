// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Profile Contract
// ───────────────────────────────────────────────────────────────────

import type { ConfidenceState, ContractHeader } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Provider-specific mapping for one inference control. */
export interface ProviderControlMapping {
  readonly providerId: string;
  readonly modelPattern: string;
  readonly control: 'temperature' | 'thinking';
  readonly wireField: string | null;
  readonly support: 'no' | 'unknown' | 'yes';
  readonly confidence: ConfidenceState;
}

/** Versioned copy-editing prompt and deterministic inference controls. */
export interface PromptProfileRecord extends ContractHeader {
  readonly contractKind: 'prompt-profile';
  readonly promptVersion: string;
  readonly systemInstruction: string;
  readonly copyEditingScope: 'assistant-message-only';
  readonly protectedValuePolicyVersion: string;
  readonly temperature: number;
  readonly thinkingMode: 'disabled' | 'enabled' | 'provider-default';
  readonly providerControlMappings: readonly ProviderControlMapping[];
  readonly unsupportedControlBehavior: UnsupportedControlBehavior;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Fail-closed behavior when a provider cannot honor a prompt control. */
export const UnsupportedControlBehaviors = {
  EXACT_ORIGINAL: 'exact-original',
  REJECT_PROVIDER: 'reject-provider',
} as const;

/** Behavior selected for unsupported inference controls. */
export type UnsupportedControlBehavior =
  typeof UnsupportedControlBehaviors[keyof typeof UnsupportedControlBehaviors];
