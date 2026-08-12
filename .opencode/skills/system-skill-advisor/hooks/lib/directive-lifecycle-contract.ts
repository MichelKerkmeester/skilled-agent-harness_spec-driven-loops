// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Contract
// ───────────────────────────────────────────────────────────────

export const DIRECTIVE_LIFECYCLE_DEDUP_ENV = 'SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP';
export const DIRECTIVE_LIFECYCLE_STATE_DIR_ENV = 'SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR';
export const DIRECTIVE_SEPARATOR = '\nDirectives:';
export const MAX_DIRECTIVE_LIFECYCLE_SESSIONS = 64;
export const DIRECTIVE_LIFECYCLE_SCHEMA_VERSION = 2;

export interface DirectiveBriefParts {
  readonly head: string;
  readonly directives: string;
}

export interface DirectiveLifecycleClock {
  readonly storeGeneration: string;
  readonly lifecycleEpoch: string;
}

export interface DirectiveLifecycleRecord extends DirectiveLifecycleClock {
  readonly schemaVersion: typeof DIRECTIVE_LIFECYCLE_SCHEMA_VERSION;
  readonly directives: string;
  readonly transcriptPath: string;
  readonly transcriptHighWaterBytes: number;
}

export interface DirectiveLifecycleEvaluation {
  readonly suppressed: boolean;
  readonly record: DirectiveLifecycleRecord | null;
}

export interface DirectiveLifecycleState {
  get(sessionId: string): DirectiveLifecycleRecord | null;
  set(sessionId: string, record: DirectiveLifecycleRecord): boolean;
  clear(sessionId: string): void;
  clearAll(): void;
  clock(sessionId: string): DirectiveLifecycleClock | null;
  advanceGeneration(): boolean;
  advanceSessionEpoch(sessionId: string): boolean;
  evaluate?(
    sessionId: string,
    directives: string,
    transcriptPath: string,
    transcriptBytes: number,
    forceFull: boolean,
  ): DirectiveLifecycleEvaluation | null;
}
