// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Stream Capture Types
// ───────────────────────────────────────────────────────────────────

import { createExactOriginalRecord } from '../contracts/exact-original.js';

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { RuntimeEnvelope } from '../runtimes/types.js';
import type {
  CaptureFailureReason,
  WrapperRuntimeId,
  WrapperRuntimePlan,
} from './types.js';

/** Input to one raw-stream capture: the CLI bytes and the capture instant. */
export interface RuntimeStreamParseInput {
  readonly capturedText: string;
  readonly capturedAt: string;
}

/** Successfully parsed stream holding the assistant text and its envelopes. */
export interface CapturedRuntimeStream {
  readonly status: 'captured';
  readonly original: ExactOriginalRecord;
  readonly envelopes: readonly RuntimeEnvelope<unknown>[];
}

/** Raw stream that could not be parsed into a projectable assistant message. */
export interface UnparsedRuntimeStream {
  readonly status: 'unparsed';
  readonly reasonCode: CaptureFailureReason;
}

/** Terminal of one raw-stream capture attempt. */
export type RuntimeStreamParseResult = CapturedRuntimeStream | UnparsedRuntimeStream;

/** Per-runtime converter from raw CLI output into projectable envelopes. */
export interface RuntimeStreamParser {
  readonly runtime: WrapperRuntimeId;
  parse(input: RuntimeStreamParseInput): RuntimeStreamParseResult;
}

/**
 * Wrap the extracted assistant text in an exact-original record carrying
 * deterministic capture provenance. The bytes stay byte-exact so the wrapper
 * can restore them on every non-accept terminal.
 */
export function buildStreamOriginal(
  originalId: string,
  text: string,
  capturedAt: string,
): ExactOriginalRecord {
  return createExactOriginalRecord(
    originalId,
    new TextEncoder().encode(text),
    'text/markdown; charset=utf-8',
    {
      sourceFamily: 'cli-output-capture',
      sourceVersion: '1.0.0',
      captureMethod: 'synthetic',
      sanitizationStatus: 'synthetic',
      capturedAt,
    },
  );
}

/**
 * Build one runtime envelope from the resolved plan plus a metadata-only
 * runtime event. Identity fields are deterministic per runtime so the shared
 * assembler treats every envelope of one capture as one generation.
 */
export function buildStreamEnvelope<TRuntimeEvent>(
  plan: WrapperRuntimePlan,
  event: TRuntimeEvent,
  capturedAt: string,
): RuntimeEnvelope<TRuntimeEvent> {
  return Object.freeze({
    envelopeVersion: 'runtime-envelope/1.0.0',
    runtime: plan.runtime,
    runtimeVersion: plan.runtimeVersion,
    protocol: plan.protocol,
    protocolVersion: plan.protocolVersion,
    pathId: plan.pathId,
    sessionId: `session-${plan.runtime}`,
    turnId: `turn-${plan.runtime}`,
    messageId: `message-${plan.runtime}`,
    generationId: `generation-${plan.runtime}`,
    attempt: 1,
    capturedAt,
    event,
  });
}
