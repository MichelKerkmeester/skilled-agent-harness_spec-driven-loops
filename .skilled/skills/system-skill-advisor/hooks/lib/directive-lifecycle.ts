// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Delivery
// ───────────────────────────────────────────────────────────────
// Constant policy may be omitted only while identity, lifecycle state,
// transcript continuity, and state integrity are all proven. Uncertainty keeps
// the complete advisor brief.

import {
  DIRECTIVE_LIFECYCLE_DEDUP_ENV,
  DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
  DIRECTIVE_SEPARATOR,
  MAX_DIRECTIVE_LIFECYCLE_SESSIONS,
  type DirectiveBriefParts,
  type DirectiveLifecycleClock,
  type DirectiveLifecycleEvaluation,
  type DirectiveLifecycleRecord,
  type DirectiveLifecycleState,
} from './directive-lifecycle-contract.js';
import { FileDirectiveLifecycleStore } from './directive-lifecycle-file-store.js';

export {
  DIRECTIVE_LIFECYCLE_DEDUP_ENV,
  DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
  DIRECTIVE_LIFECYCLE_STATE_DIR_ENV,
  DIRECTIVE_SEPARATOR,
  MAX_DIRECTIVE_LIFECYCLE_SESSIONS,
  type DirectiveBriefParts,
  type DirectiveLifecycleClock,
  type DirectiveLifecycleEvaluation,
  type DirectiveLifecycleRecord,
  type DirectiveLifecycleState,
} from './directive-lifecycle-contract.js';
export { FileDirectiveLifecycleStore } from './directive-lifecycle-file-store.js';

const INITIAL_CLOCK_TOKEN = 'initial';

/** Default on; false-like values restore complete delivery on every turn. */
export function isDirectiveLifecycleDedupEnabled(): boolean {
  const value = process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV]?.trim().toLowerCase();
  return value !== '0' && value !== 'false' && value !== 'off' && value !== 'no';
}

/** Split the dynamic route line from the constant directive block. */
export function splitDirectiveBrief(context: string): DirectiveBriefParts | null {
  const index = context.indexOf(DIRECTIVE_SEPARATOR);
  if (index <= 0) return null;
  return { head: context.slice(0, index), directives: context.slice(index) };
}

export interface DirectiveLifecycleDecisionInput {
  readonly state: DirectiveLifecycleState;
  readonly sessionId?: string;
  readonly sessionConfirmed?: boolean;
  readonly lifecycleEvent?: string | null;
  readonly transcriptPath?: string | null;
  readonly transcriptBytes?: number | null;
  readonly enabled?: boolean;
  readonly deferFullReceipt?: boolean;
}

export interface DirectiveLifecycleDecision {
  readonly reducedContext: string | null;
  readonly suppressed: boolean;
  readonly commitFullReceipt?: () => boolean;
}

export const FULL_DIRECTIVE_LIFECYCLE_DELIVERY: DirectiveLifecycleDecision = Object.freeze({
  reducedContext: null,
  suppressed: false,
});

function isLifecycleBoundary(event: string | null | undefined): boolean {
  return event === 'startup' || event === 'resume' || event === 'compact' || event === 'clear';
}

function validTranscript(
  transcriptPath: string | null | undefined,
  transcriptBytes: number | null | undefined,
): transcriptPath is string {
  return typeof transcriptPath === 'string'
    && transcriptPath.length > 0
    && typeof transcriptBytes === 'number'
    && Number.isFinite(transcriptBytes)
    && transcriptBytes >= 0;
}

function sameClock(left: DirectiveLifecycleClock, right: DirectiveLifecycleClock): boolean {
  return left.storeGeneration === right.storeGeneration
    && left.lifecycleEpoch === right.lifecycleEpoch;
}

function nextRecord(
  parts: DirectiveBriefParts,
  clock: DirectiveLifecycleClock,
  transcriptPath: string,
  transcriptBytes: number,
): DirectiveLifecycleRecord {
  return Object.freeze({
    schemaVersion: DIRECTIVE_LIFECYCLE_SCHEMA_VERSION,
    directives: parts.directives,
    transcriptPath,
    transcriptHighWaterBytes: transcriptBytes,
    ...clock,
  });
}

function fullWithReceipt(
  state: DirectiveLifecycleState,
  sessionId: string,
  record: DirectiveLifecycleRecord,
  defer: boolean,
): DirectiveLifecycleDecision {
  const commitFullReceipt = (): boolean => state.set(sessionId, record);
  if (!defer) commitFullReceipt();
  return defer
    ? Object.freeze({ reducedContext: null, suppressed: false, commitFullReceipt })
    : FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
}

/** Reduce only through a stable, atomically advanced lifecycle proof. */
export function decideDirectiveLifecycleDelivery(
  context: string,
  input: DirectiveLifecycleDecisionInput,
): DirectiveLifecycleDecision {
  if (input.enabled === false) return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  const parts = splitDirectiveBrief(context);
  if (!parts?.head.trim()) return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;

  const sessionId = typeof input.sessionId === 'string' && input.sessionId.trim().length > 0
    ? input.sessionId.trim()
    : null;
  if (!sessionId || input.sessionConfirmed !== true) return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  if (!validTranscript(input.transcriptPath, input.transcriptBytes)) {
    return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  }
  const transcriptPath = input.transcriptPath;
  const transcriptBytes = input.transcriptBytes as number;

  if (input.state.evaluate) {
    const evaluated: DirectiveLifecycleEvaluation | null = input.state.evaluate(
      sessionId,
      parts.directives,
      transcriptPath,
      transcriptBytes,
      isLifecycleBoundary(input.lifecycleEvent),
    );
    if (!evaluated) return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
    if (evaluated.suppressed) {
      return Object.freeze({ reducedContext: parts.head, suppressed: true });
    }
    return evaluated.record
      ? fullWithReceipt(input.state, sessionId, evaluated.record, input.deferFullReceipt === true)
      : FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  }

  const firstClock = input.state.clock(sessionId);
  if (!firstClock) return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  const record = input.state.get(sessionId);
  const secondClock = input.state.clock(sessionId);
  if (!secondClock || !sameClock(firstClock, secondClock)) {
    return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  }

  const replacement = nextRecord(parts, secondClock, transcriptPath, transcriptBytes);
  const mustDeliverFull = isLifecycleBoundary(input.lifecycleEvent)
    || !record
    || !sameClock(record, secondClock)
    || record.directives !== parts.directives
    || record.transcriptPath !== transcriptPath
    || transcriptBytes < record.transcriptHighWaterBytes;
  if (mustDeliverFull) {
    return fullWithReceipt(input.state, sessionId, replacement, input.deferFullReceipt === true);
  }

  if (transcriptBytes > record.transcriptHighWaterBytes
    && !input.state.set(sessionId, replacement)) {
    return FULL_DIRECTIVE_LIFECYCLE_DELIVERY;
  }
  return Object.freeze({ reducedContext: parts.head, suppressed: true });
}

/** Advance the identified session epoch or invalidate every older record. */
export function advanceDirectiveLifecycleBoundary(
  state: DirectiveLifecycleState,
  sessionId?: string | null,
): boolean {
  const normalized = typeof sessionId === 'string' ? sessionId.trim() : '';
  return normalized.length > 0
    ? state.advanceSessionEpoch(normalized)
    : state.advanceGeneration();
}

export class InMemoryDirectiveLifecycleStore implements DirectiveLifecycleState {
  private readonly records = new Map<string, DirectiveLifecycleRecord>();
  private readonly epochs = new Map<string, string>();
  private generation = INITIAL_CLOCK_TOKEN;
  private sequence = 0;

  get(sessionId: string): DirectiveLifecycleRecord | null {
    return this.records.get(sessionId) ?? null;
  }

  set(sessionId: string, record: DirectiveLifecycleRecord): boolean {
    while (this.records.size >= MAX_DIRECTIVE_LIFECYCLE_SESSIONS && !this.records.has(sessionId)) {
      const oldest = this.records.keys().next().value;
      if (typeof oldest !== 'string') break;
      this.records.delete(oldest);
      this.epochs.delete(oldest);
    }
    this.records.set(sessionId, record);
    return true;
  }

  clear(sessionId: string): void {
    this.records.delete(sessionId);
    this.epochs.delete(sessionId);
  }

  clearAll(): void {
    this.records.clear();
    this.epochs.clear();
    this.generation = this.nextToken();
  }

  clock(sessionId: string): DirectiveLifecycleClock {
    return {
      storeGeneration: this.generation,
      lifecycleEpoch: this.epochs.get(sessionId) ?? INITIAL_CLOCK_TOKEN,
    };
  }

  advanceGeneration(): boolean {
    this.generation = this.nextToken();
    return true;
  }

  advanceSessionEpoch(sessionId: string): boolean {
    this.epochs.set(sessionId, this.nextToken());
    return true;
  }

  private nextToken(): string {
    this.sequence += 1;
    return `memory-${this.sequence}`;
  }
}

let defaultFileStore: FileDirectiveLifecycleStore | null = null;

/** Return the process-local handle to the cross-process durable store. */
export function defaultDirectiveLifecycleStore(): FileDirectiveLifecycleStore {
  defaultFileStore ??= new FileDirectiveLifecycleStore();
  return defaultFileStore;
}

/** Reset the process-local handle without mutating durable state. */
export function resetDefaultDirectiveLifecycleStore(): void {
  defaultFileStore = null;
}
