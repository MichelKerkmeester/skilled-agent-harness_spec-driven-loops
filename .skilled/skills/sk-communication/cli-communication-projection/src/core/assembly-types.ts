// ───────────────────────────────────────────────────────────────────
// MODULE: Message Assembly Types
// ───────────────────────────────────────────────────────────────────

import type {
  RuntimeId,
  ValidationIssue,
} from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';

/** Stable terminal reasons returned by the assembly boundary. */
export const AssemblyReasonCodes = {
  BYTE_LIMIT: 'byte-limit',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  CONFLICTING_DUPLICATE: 'conflicting-duplicate',
  CORRUPT_ENCODING: 'corrupt-encoding',
  EMPTY_OUTPUT: 'empty-output',
  EVENT_LIMIT: 'event-limit',
  INVALID_INPUT: 'invalid-input',
  RETRY_LIMIT: 'retry-limit',
  SOURCE_FAILED: 'source-failed',
  TIMEOUT: 'timeout',
} as const;

/** Terminal reason emitted by the assembler. */
export type AssemblyReasonCode =
  typeof AssemblyReasonCodes[keyof typeof AssemblyReasonCodes];

/** Identity that isolates one attempt from concurrent turns and retries. */
export interface GenerationKey {
  readonly runtime: RuntimeId;
  readonly sessionId: string;
  readonly turnId: string;
  readonly messageId: string;
  readonly generationId: string;
  readonly attempt: number;
}

/** Memory, lifecycle, retry, and tombstone bounds for one assembler. */
export interface MessageAssemblerOptions {
  readonly maxBytes?: number;
  readonly maxEvents?: number;
  readonly idleTimeoutMs?: number;
  readonly maxAttempts?: number;
  readonly maxTerminalGenerations?: number;
}

/** Input used to open an isolated generation. */
export interface StartGenerationInput {
  readonly key: GenerationKey;
  readonly exactOriginal: ExactOriginalRecord;
  readonly startedAtMs: number;
}

/** Input used to add one immutable event and its canonical bytes. */
export interface IngestEventInput {
  readonly key: GenerationKey;
  readonly event: EventEnvelope;
  readonly original: ExactOriginalRecord;
  readonly observedAtMs: number;
}

/** One coordinate in a source, arrival, or assembly order snapshot. */
export interface AssemblyOrderCoordinate {
  readonly eventId: string;
  readonly index: number | null;
}

/** Three independent order domains retained at terminal assembly. */
export interface AssemblyOrderSnapshot {
  readonly source: readonly AssemblyOrderCoordinate[];
  readonly arrival: readonly AssemblyOrderCoordinate[];
  readonly assembly: readonly AssemblyOrderCoordinate[];
}

/** Fields shared by completed and exact-original terminal outcomes. */
export interface AssemblyTerminalBase {
  readonly key: GenerationKey;
  readonly reasonCode: AssemblyReasonCode;
  readonly exactOriginal: ExactOriginalRecord;
  readonly events: readonly EventEnvelope[];
  readonly order: AssemblyOrderSnapshot;
  readonly startedAtMs: number;
  readonly terminalAtMs: number;
  readonly durationMs: number;
  readonly inputByteCount: number;
  readonly outputByteCount: number;
}

/** Successful complete-message candidate awaiting later projection stages. */
export interface CompletedAssembly extends AssemblyTerminalBase {
  readonly status: 'completed';
  readonly reasonCode: 'completed';
  readonly text: string;
}

/** Terminal decision that keeps or restores the immutable original. */
export interface ExactOriginalAssembly extends AssemblyTerminalBase {
  readonly status: 'exact-original';
  readonly reasonCode: Exclude<AssemblyReasonCode, 'completed'>;
}

/** Terminal assembly result. */
export type AssemblyTerminalResult = CompletedAssembly | ExactOriginalAssembly;

/** Rejected API input that did not enter mutable generation state. */
export interface AssemblyRejection {
  readonly status: 'rejected';
  readonly reasonCode: 'invalid-input';
  readonly issues: readonly ValidationIssue[];
  readonly originalInput: unknown;
}

/** Result of opening a generation. */
export type StartGenerationResult =
  | AssemblyRejection
  | { readonly status: 'ignored-terminal'; readonly reasonCode: AssemblyReasonCode }
  | { readonly status: 'started'; readonly key: GenerationKey }
  | { readonly status: 'terminal'; readonly result: ExactOriginalAssembly };

/** Result of ingesting one event. */
export type IngestEventResult =
  | AssemblyRejection
  | { readonly status: 'accepted'; readonly eventId: string }
  | { readonly status: 'duplicate'; readonly eventId: string }
  | { readonly status: 'ignored-terminal'; readonly reasonCode: AssemblyReasonCode }
  | { readonly status: 'terminal'; readonly result: AssemblyTerminalResult };

/** Immutable event and canonical bytes retained only while a generation is active. */
export interface BufferedAssemblyEvent {
  readonly event: EventEnvelope;
  readonly original: ExactOriginalRecord;
}
