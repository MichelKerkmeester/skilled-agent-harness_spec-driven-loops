// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Wrapper Types
// ───────────────────────────────────────────────────────────────────

import type { RuntimeId } from '../contracts/common.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ContextSelectionInput } from '../context/selector.js';
import type { JudgeMode } from '../fidelity/types.js';
import type {
  ProviderModelRecord,
  ProviderTransport,
} from '../providers/types.js';
import type { PrivacyRoutePolicy } from '../privacy/types.js';
import type { RenderCapabilities, RenderMode } from '../render/types.js';
import type { RuntimeAdapter } from '../runtimes/adapter.js';
import type {
  RuntimeAdapterReasonCode,
  RuntimeEnvelope,
} from '../runtimes/types.js';
import type { ProjectMessageFallbackReason } from '../runtime/project-message.js';

/** Launch modes a wrapper-target runtime can be driven in. */
export const WrapperLaunchModes = {
  HEADLESS: 'headless',
  STREAM: 'stream',
  PRINT: 'print',
} as const;

/** One supported launch mode. */
export type WrapperLaunchMode =
  typeof WrapperLaunchModes[keyof typeof WrapperLaunchModes];

/** Runtime families the wrapper serves; opencode uses its native hook instead. */
export type WrapperRuntimeId = Exclude<RuntimeId, 'opencode'>;

/** Resolved wrapper plan for one runtime: mode, adapter, and pinned identity. */
export interface WrapperRuntimePlan {
  readonly runtime: WrapperRuntimeId;
  readonly launchMode: WrapperLaunchMode;
  readonly adapter: RuntimeAdapter<unknown>;
  readonly pathId: string;
  readonly protocol: string;
  readonly runtimeVersion: string;
  readonly protocolVersion: string;
}

/** Projection inputs the wrapper needs beyond the captured stream. */
export interface WrapperProjectionConfig {
  readonly context: ContextSelectionInput;
  readonly prompt: PromptProfileRecord;
  readonly records: readonly ProviderModelRecord[];
  readonly candidateProviderIds: readonly string[];
  readonly policy: PrivacyRoutePolicy;
  readonly judgeMode: JudgeMode;
  readonly capabilities: RenderCapabilities;
  readonly transport?: ProviderTransport;
  readonly now: string;
}

/** Complete input to one wrapper run. */
export interface WrapperRunInput {
  readonly original: ExactOriginalRecord;
  readonly envelopes: readonly RuntimeEnvelope<unknown>[];
  readonly config: WrapperProjectionConfig;
  readonly signal?: AbortSignal;
}

/** Wrapper-owned fallback reasons beyond the entrypoint's own. */
export type WrapperFallbackReason =
  | 'runtime-incapable'
  | 'normalization-failed'
  | 'wrapper-failure';

/** Stream-capture failure reasons emitted when raw CLI output cannot be parsed. */
export type CaptureFailureReason =
  | 'empty-stream'
  | 'malformed-stream'
  | 'no-assistant-message';

/** Every terminal the wrapper can return. */
export type WrapperRunReasonCode =
  | ProjectMessageFallbackReason
  | RuntimeAdapterReasonCode
  | WrapperFallbackReason
  | CaptureFailureReason;

/** Accepted projection re-rendered in place of the captured original. */
export interface WrapperProjectionResult {
  readonly status: 'projection';
  readonly text: string;
  readonly mode: Exclude<RenderMode, 'exact-original-only'>;
}

/** Byte-exact captured original preserved on every non-accept terminal. */
export interface WrapperExactOriginalResult {
  readonly status: 'exact-original';
  readonly text: string;
  readonly reasonCode: WrapperRunReasonCode;
}

/** Terminal wrapper outcome: a projection or the byte-exact original. */
export type WrapperRunResult = WrapperExactOriginalResult | WrapperProjectionResult;
