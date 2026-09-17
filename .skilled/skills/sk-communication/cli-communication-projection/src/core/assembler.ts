// ───────────────────────────────────────────────────────────────────
// MODULE: Generation-Keyed Message Assembly
// ───────────────────────────────────────────────────────────────────

import { TerminalStatuses } from '../contracts/event.js';
import {
  validateExactOriginal,
} from '../contracts/validate-event.js';
import {
  completeAssembly,
  createAssemblySnapshot,
  createEmptyFallback,
  createFallbackAssembly,
  freezeExactOriginal,
} from './assembly-output.js';
import {
  parseIngestEventInput,
  parseMessageAssemblerOptions,
  parseStartGenerationInput,
} from './assembly-input.js';
import { AssemblyReasonCodes } from './assembly-types.js';
import {
  createNormalizedSequenceDigest,
  normalizeEvent,
} from './normalizer.js';

import type { ValidationIssue } from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type {
  AssemblyReasonCode,
  AssemblyRejection,
  AssemblyTerminalBase,
  AssemblyTerminalResult,
  BufferedAssemblyEvent,
  ExactOriginalAssembly,
  GenerationKey,
  IngestEventResult,
  StartGenerationResult,
} from './assembly-types.js';
import type { ResolvedAssemblerOptions } from './assembly-input.js';

interface ActiveGeneration {
  readonly key: GenerationKey;
  readonly keyId: string;
  readonly exactOriginal: ExactOriginalRecord;
  readonly startedAtMs: number;
  lastActivityAtMs: number;
  inputByteCount: number;
  readonly events: BufferedAssemblyEvent[];
  readonly eventDigests: Map<string, string>;
  readonly sourceSequences: Map<number, string>;
}

interface TerminalMarker {
  readonly reasonCode: AssemblyReasonCode;
}

/** Deterministic, bounded state machine for complete-message assembly. */
export class MessageAssembler {
  private readonly options: ResolvedAssemblerOptions;
  private readonly active = new Map<string, ActiveGeneration>();
  private readonly terminal = new Map<string, TerminalMarker>();
  private readonly terminalOrder: string[] = [];

  /** Create an assembler with explicit finite resource bounds. */
  public constructor(options: unknown = {}) {
    this.options = parseMessageAssemblerOptions(options);
  }

  /** Open a new generation without sharing buffers with prior attempts. */
  public startGeneration(input: unknown): StartGenerationResult {
    const inputResult = parseStartGenerationInput(input);
    if (!inputResult.success) {
      return rejection(input, inputResult.issues);
    }
    const request = inputResult.value;

    const key = freezeKey(request.key);
    const keyId = serializeGenerationKey(key);
    const terminalMarker = this.terminal.get(keyId);
    if (terminalMarker !== undefined) {
      return Object.freeze({
        status: 'ignored-terminal',
        reasonCode: terminalMarker.reasonCode,
      });
    }
    if (this.active.has(keyId)) {
      return rejection(input, [{
        path: '$.key',
        code: 'duplicate_generation',
        message: 'Generation is already active.',
      }]);
    }

    const exactOriginal = freezeExactOriginal(request.exactOriginal);
    if (key.attempt > this.options.maxAttempts) {
      const result = createEmptyFallback(
        key,
        exactOriginal,
        AssemblyReasonCodes.RETRY_LIMIT,
        request.startedAtMs,
      );
      this.rememberTerminal(keyId, result.reasonCode);
      return Object.freeze({ status: 'terminal', result });
    }

    this.active.set(keyId, {
      key,
      keyId,
      exactOriginal,
      startedAtMs: request.startedAtMs,
      lastActivityAtMs: request.startedAtMs,
      inputByteCount: 0,
      events: [],
      eventDigests: new Map(),
      sourceSequences: new Map(),
    });
    return Object.freeze({ status: 'started', key });
  }

  /** Add an event, applying idempotence, ordering, lifecycle, and bound rules. */
  public ingestEvent(input: unknown): IngestEventResult {
    const inputResult = parseIngestEventInput(input);
    if (!inputResult.success) {
      return rejection(input, inputResult.issues);
    }
    const request = inputResult.value;
    const keyId = serializeGenerationKey(request.key);
    const terminalMarker = this.terminal.get(keyId);
    if (terminalMarker !== undefined) {
      return Object.freeze({
        status: 'ignored-terminal',
        reasonCode: terminalMarker.reasonCode,
      });
    }

    const state = this.active.get(keyId);
    if (state === undefined) {
      return rejection(input, [{
        path: '$.key',
        code: 'unknown_generation',
        message: 'Generation is not active.',
      }]);
    }

    const issues: ValidationIssue[] = [];
    if (request.observedAtMs < state.lastActivityAtMs) {
      issues.push({
        path: '$.observedAtMs',
        code: 'non_monotonic_time',
        message: 'Observed time cannot move backwards within a generation.',
      });
    }
    const eventResult = normalizeEvent(request.event);
    if (!eventResult.success) {
      issues.push(...prefixIssues('$.event', eventResult.issues));
    }
    const originalResult = validateExactOriginal(request.original);
    if (!originalResult.success) {
      issues.push(...prefixIssues('$.original', originalResult.issues));
    }
    if (eventResult.success) {
      issues.push(...validateEventIdentity(state.key, eventResult.value));
    }
    if (
      eventResult.success
      && originalResult.success
      && eventResult.value.canonicalPayloadRef !== originalResult.value.originalId
    ) {
      issues.push({
        path: '$.original.originalId',
        code: 'canonical_reference',
        message: 'Canonical bytes must match the event payload reference.',
      });
    }
    if (issues.length > 0 || !eventResult.success || !originalResult.success) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(
          state,
          AssemblyReasonCodes.INVALID_INPUT,
          Math.max(request.observedAtMs, state.lastActivityAtMs),
        ),
      });
    }

    const event = eventResult.value;
    const digest = createNormalizedSequenceDigest([event]);
    const existingDigest = state.eventDigests.get(event.eventId);
    if (existingDigest !== undefined) {
      if (existingDigest === digest) {
        return Object.freeze({ status: 'duplicate', eventId: event.eventId });
      }
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(
          state,
          AssemblyReasonCodes.CONFLICTING_DUPLICATE,
          request.observedAtMs,
        ),
      });
    }

    const sourceSequence = event.order.sourceSequence;
    if (sourceSequence !== null && state.sourceSequences.has(sourceSequence)) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(
          state,
          AssemblyReasonCodes.CONFLICTING_DUPLICATE,
          request.observedAtMs,
        ),
      });
    }
    if (state.events.length + 1 > this.options.maxEvents) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(state, AssemblyReasonCodes.EVENT_LIMIT, request.observedAtMs),
      });
    }
    if (state.inputByteCount + originalResult.value.byteLength > this.options.maxBytes) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(state, AssemblyReasonCodes.BYTE_LIMIT, request.observedAtMs),
      });
    }

    state.events.push({
      event,
      original: freezeExactOriginal(originalResult.value),
    });
    state.eventDigests.set(event.eventId, digest);
    if (sourceSequence !== null) {
      state.sourceSequences.set(sourceSequence, event.eventId);
    }
    state.inputByteCount += originalResult.value.byteLength;
    state.lastActivityAtMs = request.observedAtMs;

    if (event.terminalStatus === TerminalStatuses.CANCELLED) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(state, AssemblyReasonCodes.CANCELLED, request.observedAtMs),
      });
    }
    if (event.terminalStatus === TerminalStatuses.FAILED) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(state, AssemblyReasonCodes.SOURCE_FAILED, request.observedAtMs),
      });
    }
    if (event.terminalStatus === TerminalStatuses.COMPLETED) {
      return Object.freeze({
        status: 'terminal',
        result: this.finalize(state, AssemblyReasonCodes.COMPLETED, request.observedAtMs),
      });
    }

    return Object.freeze({ status: 'accepted', eventId: event.eventId });
  }

  /** Expire every idle generation without allocating live timer handles. */
  public expireIdle(nowMs: number): readonly ExactOriginalAssembly[] {
    if (!Number.isFinite(nowMs) || nowMs < 0) {
      throw new RangeError('nowMs must be a non-negative finite number.');
    }
    const results: ExactOriginalAssembly[] = [];
    for (const state of [...this.active.values()]) {
      if (nowMs - state.lastActivityAtMs >= this.options.idleTimeoutMs) {
        const result = this.finalize(state, AssemblyReasonCodes.TIMEOUT, nowMs);
        if (result.status !== 'exact-original') {
          throw new Error('Idle expiry cannot produce a completed assembly.');
        }
        results.push(result);
      }
    }
    return Object.freeze(results);
  }

  /** Number of generations that still retain mutable buffers. */
  public get activeGenerationCount(): number {
    return this.active.size;
  }

  /** Number of bounded content-free tombstones retained for late-event suppression. */
  public get terminalGenerationCount(): number {
    return this.terminal.size;
  }

  private finalize(
    state: ActiveGeneration,
    reasonCode: AssemblyReasonCode,
    terminalAtMs: number,
  ): AssemblyTerminalResult {
    this.active.delete(state.keyId);
    const snapshot = createAssemblySnapshot(state.events);
    const base: AssemblyTerminalBase = {
      key: state.key,
      reasonCode,
      exactOriginal: state.exactOriginal,
      events: snapshot.events,
      order: snapshot.order,
      startedAtMs: state.startedAtMs,
      terminalAtMs,
      durationMs: Math.max(0, terminalAtMs - state.startedAtMs),
      inputByteCount: state.inputByteCount,
      outputByteCount: state.exactOriginal.byteLength,
    };

    const result = reasonCode === AssemblyReasonCodes.COMPLETED
      ? completeAssembly(base, snapshot.buffered)
      : createFallbackAssembly(base, reasonCode);
    this.rememberTerminal(state.keyId, result.reasonCode);
    return result;
  }

  private rememberTerminal(keyId: string, reasonCode: AssemblyReasonCode): void {
    this.terminal.set(keyId, Object.freeze({ reasonCode }));
    this.terminalOrder.push(keyId);
    while (this.terminalOrder.length > this.options.maxTerminalGenerations) {
      const oldest = this.terminalOrder.shift();
      if (oldest !== undefined) {
        this.terminal.delete(oldest);
      }
    }
  }
}

/** Serialize a generation identity without delimiter ambiguity. */
export function serializeGenerationKey(key: GenerationKey): string {
  return JSON.stringify([
    key.runtime,
    key.sessionId,
    key.turnId,
    key.messageId,
    key.generationId,
    key.attempt,
  ]);
}

function validateEventIdentity(
  key: GenerationKey,
  event: EventEnvelope,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const coordinates: readonly [string, string | null, string][] = [
    ['runtime', event.runtime, key.runtime],
    ['sessionId', event.sessionId, key.sessionId],
    ['turnId', event.turnId, key.turnId],
    ['messageId', event.messageId, key.messageId],
  ];
  for (const [field, observed, expected] of coordinates) {
    if (observed !== expected) {
      issues.push({
        path: `$.event.${field}`,
        code: 'generation_identity',
        message: 'Event identity does not match the active generation.',
      });
    }
  }
  return issues;
}

function freezeKey(key: GenerationKey): GenerationKey {
  return Object.freeze({ ...key });
}

function prefixIssues(
  prefix: string,
  issues: readonly ValidationIssue[],
): ValidationIssue[] {
  return issues.map((issue) => ({
    ...issue,
    path: issue.path === '$' ? prefix : `${prefix}${issue.path.slice(1)}`,
  }));
}

function rejection(
  originalInput: unknown,
  issues: readonly ValidationIssue[],
): AssemblyRejection {
  return Object.freeze({
    status: 'rejected',
    reasonCode: AssemblyReasonCodes.INVALID_INPUT,
    issues: Object.freeze([...issues]),
    originalInput,
  });
}
