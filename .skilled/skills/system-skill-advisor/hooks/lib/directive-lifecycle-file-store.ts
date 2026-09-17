// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Durable Store
// ───────────────────────────────────────────────────────────────
// Authoritative filesystem work is delegated to a directory-descriptor-
// anchored helper. If the helper or platform cannot prove the invariant,
// durable suppression is unavailable and the caller retains full delivery.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DIRECTIVE_LIFECYCLE_STATE_DIR_ENV,
  MAX_DIRECTIVE_LIFECYCLE_SESSIONS,
  type DirectiveLifecycleClock,
  type DirectiveLifecycleEvaluation,
  type DirectiveLifecycleRecord,
  type DirectiveLifecycleState,
} from './directive-lifecycle-contract.js';

const HELPER_TIMEOUT_MS = 750;
const MAX_HELPER_OUTPUT_BYTES = 128 * 1024;

interface HelperResponse<T> {
  readonly ok: boolean;
  readonly result?: T;
}

function helperPath(): string | null {
  const current = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(current, 'directive-lifecycle-store.py'),
    resolve(current, '../../../../hooks/lib/directive-lifecycle-store.py'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export class FileDirectiveLifecycleStore implements DirectiveLifecycleState {
  private readonly baseDir: string;
  private readonly maxSessions: number;
  private readonly helper: string | null;
  private readonly failsafeDir: string;

  constructor(options: { baseDir?: string; maxSessions?: number } = {}) {
    const envBase = process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV];
    this.baseDir = resolve(options.baseDir
      ?? (envBase?.trim() ? envBase.trim() : join(tmpdir(), 'speckit-advisor')));
    this.maxSessions = Math.max(1, options.maxSessions ?? MAX_DIRECTIVE_LIFECYCLE_SESSIONS);
    this.helper = helperPath();
    this.failsafeDir = resolve(join(tmpdir(), 'speckit-advisor-failsafe'));
  }

  get(sessionId: string): DirectiveLifecycleRecord | null {
    return this.invoke<DirectiveLifecycleRecord | null>({ op: 'get', sessionId }) ?? null;
  }

  set(sessionId: string, record: DirectiveLifecycleRecord): boolean {
    return this.invoke<boolean>({ op: 'set', sessionId, record }) === true;
  }

  clear(sessionId: string): void {
    this.invoke<boolean>({ op: 'clear', sessionId });
  }

  clearAll(): void {
    this.invoke<boolean>({ op: 'clear-all' });
    this.invokeAt<boolean>(this.failsafeDir, { op: 'clear-all' });
  }

  clock(sessionId: string): DirectiveLifecycleClock | null {
    return this.invoke<DirectiveLifecycleClock>({ op: 'clock', sessionId });
  }

  advanceGeneration(): boolean {
    return this.advance({ op: 'advance-generation' });
  }

  advanceSessionEpoch(sessionId: string): boolean {
    return this.advance({ op: 'advance-session', sessionId });
  }

  evaluate(
    sessionId: string,
    directives: string,
    transcriptPath: string,
    transcriptBytes: number,
    forceFull: boolean,
  ): DirectiveLifecycleEvaluation | null {
    return this.invoke<DirectiveLifecycleEvaluation>({
      op: 'evaluate',
      sessionId,
      directives,
      transcriptPath,
      transcriptBytes,
      forceFull,
    });
  }

  private advance(request: Record<string, unknown>): boolean {
    const committed = this.invoke<boolean>(request) === true;
    if (committed) {
      return this.invokeAt<boolean>(this.failsafeDir, { op: 'clear-poison' }) !== false;
    }
    this.invokeAt<boolean>(this.failsafeDir, { op: 'mark-poison' });
    return false;
  }

  private invoke<T>(request: Record<string, unknown>): T | null {
    return this.invokeAt<T>(this.baseDir, request, true);
  }

  private invokeAt<T>(
    baseDir: string,
    request: Record<string, unknown>,
    checkFailsafe = false,
  ): T | null {
    if (!this.helper) return null;
    try {
      const result = spawnSync(
        process.env.SPECKIT_PYTHON_BIN?.trim() || 'python3',
        [
          this.helper,
          baseDir,
          String(this.maxSessions),
          ...(checkFailsafe ? [this.failsafeDir] : []),
        ],
        {
          cwd: process.cwd(),
          input: JSON.stringify(request),
          encoding: 'utf8',
          env: process.env,
          timeout: HELPER_TIMEOUT_MS,
          maxBuffer: MAX_HELPER_OUTPUT_BYTES,
          killSignal: 'SIGKILL',
        },
      );
      if (result.error || result.status !== 0 || !result.stdout.trim()) return null;
      const parsed = JSON.parse(result.stdout) as HelperResponse<T>;
      return parsed.ok === true && Object.prototype.hasOwnProperty.call(parsed, 'result')
        ? parsed.result ?? null
        : null;
    } catch {
      return null;
    }
  }
}
