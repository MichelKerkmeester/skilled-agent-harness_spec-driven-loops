// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Runtime Types
// ───────────────────────────────────────────────────────────────────

import type {
  ConfidenceState,
  JsonObject,
  JsonValue,
  RuntimeId,
} from '../contracts/common.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type {
  ProviderCapability,
  ProviderCapabilityName,
  ProviderRecord,
} from '../contracts/provider.js';
import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ProviderTerminalState, ProtectedDocument } from '../fidelity/types.js';

/** Adapter families with deliberately distinct wire behavior. */
export const ProviderFamilies = {
  GENERIC_HOSTED: 'generic-hosted',
  LLAMA_CPP: 'llama-cpp',
  OLLAMA: 'ollama',
  OPENCODE_GO: 'opencode-go',
} as const;

/** Adapter family. */
export type ProviderFamily = typeof ProviderFamilies[keyof typeof ProviderFamilies];

/** Privacy facts that must stay model and deployment specific. */
export const ProviderPrivacyFactNames = {
  RESIDENCY: 'residency',
  RETENTION: 'retention',
  TRAINING_USE: 'training-use',
} as const;

/** One privacy fact name. */
export type ProviderPrivacyFactName =
  typeof ProviderPrivacyFactNames[keyof typeof ProviderPrivacyFactNames];

/** Stable provider execution outcomes safe for logs and telemetry mapping. */
export const ProviderExecutionReasonCodes = {
  CANCELLED: 'cancelled',
  EMPTY_OUTPUT: 'empty-output',
  EXPIRED_CREDENTIAL: 'expired-credential',
  INVALID_PROVIDER: 'invalid-provider',
  INVALID_RESPONSE: 'invalid-response',
  MISSING_CREDENTIAL: 'missing-credential',
  NONE: 'none',
  PRIVACY_DENIED: 'privacy-denied',
  PROVIDER_ERROR: 'provider-error',
  TIMEOUT: 'timeout',
  TRUNCATED: 'truncated',
  UNSUPPORTED_CONTROL: 'unsupported-control',
} as const;

/** Content-free provider execution reason. */
export type ProviderExecutionReasonCode =
  typeof ProviderExecutionReasonCodes[keyof typeof ProviderExecutionReasonCodes];

/** Dated fact whose unknown state remains explicit instead of inferred. */
export interface ProviderPrivacyFact {
  readonly name: ProviderPrivacyFactName;
  readonly state: 'known' | 'unknown';
  readonly value: string | null;
  readonly confidence: ConfidenceState;
  readonly sourceUrl: string;
  readonly observedAt: string;
  readonly expiresAt: string | null;
}

/** Model-specific cost evidence; null amounts mean the cost is unknown. */
export interface ProviderCostRecord {
  readonly state: 'known' | 'unknown';
  readonly currency: 'USD';
  readonly inputPerMillionTokens: number | null;
  readonly outputPerMillionTokens: number | null;
  readonly sourceUrl: string;
  readonly observedAt: string;
  readonly expiresAt: string | null;
}

/** Source and freshness window for the model capabilities used at request time. */
export interface ProviderCapabilityEvidence {
  readonly sourceUrl: string;
  readonly observedAt: string;
  readonly expiresAt: string;
}

/** Runtime configuration layered around the serialized provider contract. */
export interface ProviderModelRecord {
  readonly recordVersion: 'provider-model/1.0.0';
  readonly family: ProviderFamily;
  readonly controlProviderId: string;
  readonly provider: ProviderRecord;
  readonly authorizationScheme: 'bearer' | 'none';
  readonly timeoutMs: number;
  readonly priority: number;
  readonly capabilityEvidence: ProviderCapabilityEvidence;
  readonly cost: ProviderCostRecord;
  readonly privacyFacts: readonly ProviderPrivacyFact[];
}

/** Fresh capability evidence returned by a provider-specific probe. */
export interface ProviderCapabilitySnapshot {
  readonly providerId: string;
  readonly modelId: string;
  readonly sourceUrl: string;
  readonly observedAt: string;
  readonly expiresAt: string;
  readonly capabilities: readonly ProviderCapability[];
}

/** Result of merging capability evidence without overstating stale facts. */
export interface ProviderCapabilityMerge {
  readonly status: 'applied' | 'rejected' | 'stale';
  readonly reasonCode: 'applied' | 'identity-mismatch' | 'invalid-snapshot' | 'stale-snapshot';
  readonly record: ProviderModelRecord;
}

/** Request passed to a transport that resolves credential references itself. */
export interface ProviderWireRequest {
  readonly endpoint: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly protocol: ProviderRecord['protocol'];
  readonly credentialReference: string;
  readonly body: JsonObject;
  readonly signal: AbortSignal;
}

/** Opaque transport response; adapters retain only allowlisted output fields. */
export interface ProviderWireResponse {
  readonly status: number;
  readonly body: unknown;
}

/** Injected transport boundary used by HTTP clients and deterministic tests. */
export type ProviderTransport = (
  request: ProviderWireRequest,
) => Promise<ProviderWireResponse>;

/** Credential availability check that never returns credential material. */
export type ProviderCredentialStatus = (
  credentialReference: string,
  signal: AbortSignal,
) => Promise<'available' | 'expired' | 'missing'>;

/** Inputs used to compile one provider request before transport is possible. */
export interface ProviderPreparationInput {
  readonly record: ProviderModelRecord;
  readonly prompt: PromptProfileRecord;
  readonly document: ProtectedDocument;
  readonly now: string;
  readonly signal: AbortSignal;
}

/** Fully compiled request whose controls have already been proven. */
export interface PreparedProviderRequest {
  readonly status: 'prepared';
  readonly request: ProviderWireRequest;
}

/** Fail-closed preparation result created before any request bytes leave. */
export interface UnsupportedProviderRequest {
  readonly status: 'unsupported';
  readonly reasonCode: 'invalid-provider' | 'unsupported-control';
  readonly control: 'chat' | 'response-shape' | 'temperature' | 'thinking' | null;
}

/** Provider request compilation result. */
export type ProviderRequestPreparation =
  | PreparedProviderRequest
  | UnsupportedProviderRequest;

/** Parsed candidate retained only after a complete successful response. */
export interface ParsedProviderCandidate {
  readonly status: 'candidate';
  readonly text: string;
  readonly outputByteCount: number;
}

/** Content-free response rejection. */
export interface ParsedProviderFailure {
  readonly status: 'failure';
  readonly reasonCode: 'empty-output' | 'invalid-response' | 'provider-error' | 'truncated';
  readonly terminal: Exclude<ProviderTerminalState, 'cancelled' | 'success' | 'timeout'>;
}

/** Parsed provider response. */
export type ParsedProviderResponse = ParsedProviderCandidate | ParsedProviderFailure;

/** Adapter that owns only wire compilation and response parsing. */
export interface ProviderAdapter {
  readonly family: ProviderFamily;
  prepare(input: ProviderPreparationInput): ProviderRequestPreparation;
  parse(response: ProviderWireResponse): ParsedProviderResponse;
}

interface ProviderExecutionBase {
  readonly providerId: string | null;
  readonly modelId: string | null;
  readonly privacyClass: ProviderRecord['privacyClass'];
  readonly exactOriginal: ExactOriginalRecord;
  readonly attemptCount: number;
  readonly inputByteCount: number;
  readonly outputByteCount: number;
  readonly durationMs: number;
}

/** Provider candidate awaiting deterministic fidelity validation. */
export interface ProviderCandidateResult extends ProviderExecutionBase {
  readonly status: 'candidate';
  readonly reasonCode: 'none';
  readonly providerTerminal: 'success';
  readonly candidateText: string;
}

/** Exact-original outcome for every denied, unsupported, or failed attempt. */
export interface ProviderExactOriginalResult extends ProviderExecutionBase {
  readonly status: 'exact-original';
  readonly reasonCode: Exclude<ProviderExecutionReasonCode, 'none'>;
  readonly providerTerminal: Exclude<ProviderTerminalState, 'success'>;
  readonly candidateText: null;
}

/** Terminal provider execution result. */
export type ProviderExecutionResult = ProviderCandidateResult | ProviderExactOriginalResult;

/** Provider evidence inputs that cannot accept raw request or response content. */
export interface ProviderTelemetryOptions {
  readonly runtime: RuntimeId;
  readonly totalDurationMs?: number;
}

/** Mutable JSON object used only while constructing an isolated wire body. */
export type MutableJsonObject = { [key: string]: JsonValue };
