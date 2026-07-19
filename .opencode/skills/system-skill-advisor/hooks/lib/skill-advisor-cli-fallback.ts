// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback
// ───────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

import type {
  AdvisorHookFreshness,
  AdvisorHookResult,
  AdvisorHookStatus,
  AdvisorRuntime,
  SkillAdvisorBriefOptions,
} from '../../mcp-server/lib/skill-advisor-brief.js';
import type { AdvisorRecommendation } from '../../mcp-server/lib/subprocess.js';

interface CliFallbackPaths {
  readonly repoRoot: string;
  readonly cliPath: string;
  readonly bridgePath: string;
  readonly dbDir: string;
}

interface ProbeResult {
  readonly status: string;
  readonly reason?: string;
}

interface BridgeModule {
  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<ProbeResult>;
}

interface CliProcessResult {
  readonly stdout: string;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly timedOut: boolean;
  readonly spawnError: string | null;
}

interface CliRecommendData {
  readonly freshness?: unknown;
  readonly recommendations?: unknown;
  readonly effectiveThresholds?: unknown;
  readonly cache?: unknown;
  readonly warnings?: unknown;
}

export type WarmSkillAdvisorCliFallbackStatus = 'ok' | 'skipped' | 'fail_open';

export interface WarmSkillAdvisorCliFallbackEnvelope {
  readonly status: WarmSkillAdvisorCliFallbackStatus;
  readonly reason: string;
  readonly exitCode: number | null;
  readonly retryable: boolean;
}

interface WarmSkillAdvisorCliFallbackEnvelopeInput {
  readonly status: WarmSkillAdvisorCliFallbackStatus;
  readonly reason?: string | null;
  readonly exitCode?: number | null;
  readonly timedOut?: boolean;
}

export interface SkillAdvisorCliFallbackOptions {
  readonly workspaceRoot: string;
  readonly runtime: AdvisorRuntime;
  readonly timeoutMs?: number;
  readonly thresholdConfig?: SkillAdvisorBriefOptions['thresholdConfig'];
  readonly maxTokens?: number;
}

interface SkillAdvisorCliFallbackDependencies {
  readonly env?: NodeJS.ProcessEnv;
  readonly now?: () => number;
}

const DEFAULT_CLI_FALLBACK_TIMEOUT_MS = 250;
const DEFAULT_CLI_PROBE_TIMEOUT_MS = 50;
const EXIT_RETRYABLE = 75;
const EXIT_SETTLE_GRACE_MS = 25;
const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const DEFAULT_SOCKET_DIR = '/tmp/mk-skill-advisor';
const MAX_STDOUT_BYTES = 1024 * 1024;
const require = createRequire(import.meta.url);

// Reason codes here are post-normalization and shared with the spec-kit warm
// CLI fallback envelope; 'socket_absent' and 'timeout' are the canonical
// spellings for those conditions across the warm-fallback hook helpers.
const RETRYABLE_REASONS = new Set([
  'bad_json_response',
  'socket_absent',
  'timeout',
  'warm_daemon_unavailable',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSkillAdvisorCliFallbackReason(reason: string | null | undefined, exitCode: number | null, status: WarmSkillAdvisorCliFallbackStatus): string {
  const trimmed = typeof reason === 'string' ? reason.trim() : '';
  if (trimmed) {
    return trimmed
      .replace(/^CLI_RETRYABLE_UNAVAILABLE\s+exit\s+75:\s*/i, '')
      .replace(/^CLI_/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'unknown';
  }
  if (status === 'ok') {
    return 'ok';
  }
  return exitCode === null ? 'exit_unknown' : `exit_${exitCode}`;
}

export function skillAdvisorCliFallbackEnvelope(input: WarmSkillAdvisorCliFallbackEnvelopeInput): WarmSkillAdvisorCliFallbackEnvelope {
  const exitCode = input.exitCode ?? null;
  const reason = normalizeSkillAdvisorCliFallbackReason(input.reason, exitCode, input.status);
  return {
    status: input.status,
    reason,
    exitCode,
    retryable: input.status !== 'ok' && (input.timedOut === true || exitCode === EXIT_RETRYABLE || RETRYABLE_REASONS.has(reason)),
  };
}

function withCliFallbackEnvelope(
  result: AdvisorHookResult,
  envelope: WarmSkillAdvisorCliFallbackEnvelope,
): AdvisorHookResult & WarmSkillAdvisorCliFallbackEnvelope {
  return { ...result, ...envelope };
}

function positiveIntFromEnv(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clampUnitThreshold(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

export function resolveSkillAdvisorCliFallbackTimeoutMs(
  hookBudgetMs?: number,
  env: NodeJS.ProcessEnv = process.env,
): number {
  const configured = positiveIntFromEnv(
    env.SPECKIT_SKILL_ADVISOR_CLI_FALLBACK_TIMEOUT_MS,
    DEFAULT_CLI_FALLBACK_TIMEOUT_MS,
  );
  if (!Number.isFinite(hookBudgetMs) || hookBudgetMs === undefined || hookBudgetMs <= 0) {
    return configured;
  }
  return Math.max(1, Math.min(configured, Math.floor(hookBudgetMs)));
}

export function shouldTrySkillAdvisorCliFallback(result: AdvisorHookResult): boolean {
  if (result.brief !== null) {
    return false;
  }
  if (result.status === 'fail_open') {
    return true;
  }
  return result.status === 'degraded' && result.freshness === 'unavailable';
}

function findCliFallbackPaths(workspaceRoot: string, env: NodeJS.ProcessEnv): CliFallbackPaths | null {
  let current = resolve(workspaceRoot || process.cwd());
  for (let depth = 0; depth < 14; depth += 1) {
    const opencodeDir = join(current, '.opencode');
    const cliPath = join(opencodeDir, 'bin', 'skill-advisor.cjs');
    const bridgePath = join(opencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    const defaultDbDir = join(opencodeDir, 'skills', 'system-skill-advisor', 'mcp-server', 'database');
    if (existsSync(cliPath) && existsSync(bridgePath)) {
      return {
        repoRoot: current,
        cliPath,
        bridgePath,
        dbDir: resolve(env.MK_SKILL_ADVISOR_DB_DIR ?? env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir),
      };
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function loadBridgeModule(bridgePath: string): BridgeModule | null {
  try {
    const bridge = require(bridgePath) as Partial<BridgeModule>;
    return typeof bridge.probeDaemon === 'function' ? bridge as BridgeModule : null;
  } catch {
    return null;
  }
}

function resolveSocketPath(env: NodeJS.ProcessEnv): string {
  const socketDir = env.SPECKIT_IPC_SOCKET_DIR;
  if (socketDir?.startsWith('tcp://')) {
    return socketDir;
  }
  // Hooks do not inherit SPECKIT_IPC_SOCKET_DIR; default to the same short
  // /tmp directory the CLI shim uses so the probe targets the live socket.
  return join(resolve(socketDir ?? DEFAULT_SOCKET_DIR), SOCKET_FILE_NAME);
}

function socketPathTooLong(socketPath: string): boolean {
  if (socketPath.startsWith('tcp://')) return false;
  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
}

async function probeWarmDaemon(paths: CliFallbackPaths, env: NodeJS.ProcessEnv, timeoutMs: number): Promise<{ readonly ok: boolean; readonly socketPath?: string; readonly reason?: string }> {
  const socketPath = resolveSocketPath(env);
  if (socketPathTooLong(socketPath)) {
    return { ok: false, socketPath, reason: 'CLI_SOCKET_PATH_TOO_LONG' };
  }
  if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) {
    return { ok: false, socketPath, reason: 'socket_absent' };
  }
  const bridge = loadBridgeModule(paths.bridgePath);
  if (!bridge) {
    return { ok: false, socketPath, reason: 'CLI_BRIDGE_HELPER_UNAVAILABLE' };
  }
  const probeTimeoutMs = Math.max(1, Math.min(
    timeoutMs,
    positiveIntFromEnv(env.SPECKIT_SKILL_ADVISOR_CLI_PROBE_TIMEOUT_MS, DEFAULT_CLI_PROBE_TIMEOUT_MS),
  ));
  const probe = await bridge.probeDaemon(socketPath, { timeoutMs: probeTimeoutMs, deepProbe: true });
  if (probe.status === 'alive') {
    return { ok: true, socketPath };
  }
  return { ok: false, socketPath, reason: probe.reason ?? probe.status };
}

function childEnvForCli(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...env,
    SPECKIT_IPC_SOCKET_DIR: env.SPECKIT_IPC_SOCKET_DIR ?? DEFAULT_SOCKET_DIR,
    MK_SKILL_ADVISOR_CLI_PROMPT_TIME: '1',
  };
}

function capStdout(current: string, chunk: string): string {
  if (current.length >= MAX_STDOUT_BYTES) {
    return current;
  }
  return (current + chunk).slice(0, MAX_STDOUT_BYTES);
}

function runCliRecommend(args: {
  readonly paths: CliFallbackPaths;
  readonly prompt: string;
  readonly options: SkillAdvisorCliFallbackOptions;
  readonly env: NodeJS.ProcessEnv;
  readonly timeoutMs: number;
}): Promise<CliProcessResult> {
  const payload = {
    prompt: args.prompt,
    options: {
      topK: 3,
      includeAttribution: false,
      includeAbstainReasons: true,
      // Forward caller thresholds so the CLI scorer applies them; without this
      // the scorer uses its own defaults and thresholdsFrom trusts the echoed
      // defaults, silently discarding a caller's stricter thresholds.
      confidenceThreshold: clampUnitThreshold(args.options.thresholdConfig?.confidenceThreshold, 0.8),
      uncertaintyThreshold: clampUnitThreshold(args.options.thresholdConfig?.uncertaintyThreshold, 0.35),
    },
  };
  return new Promise((resolvePromise) => {
    let stdout = '';
    let settled = false;
    let timedOut = false;
    const child = spawn(process.execPath, [
      args.paths.cliPath,
      'advisor_recommend',
      '--json',
      JSON.stringify(payload),
      '--format',
      'json',
      '--timeout-ms',
      String(args.timeoutMs),
      '--warm-only',
    ], {
      cwd: args.paths.repoRoot,
      env: childEnvForCli(args.env),
      stdio: ['ignore', 'pipe', 'ignore'],
      detached: true,
    });
    const killProcessGroup = (): void => {
      const pid = child.pid;
      if (typeof pid !== 'number') return;
      try {
        // The shim runs the dist CLI as a grandchild via spawnSync; killing
        // only the shim leaves that grandchild holding the stdout pipe.
        process.kill(-pid, 'SIGKILL');
      } catch {
        // ESRCH: the group already exited.
      }
    };
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessGroup();
    }, args.timeoutMs);
    timer.unref?.();
    const finish = (result: CliProcessResult): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise(result);
    };
    const drainStdout = (): void => {
      try {
        const rest = child.stdout?.read() as string | null | undefined;
        if (rest) {
          stdout = capStdout(stdout, rest);
        }
      } catch {
        // Best-effort drain only.
      }
    };
    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string) => {
      stdout = capStdout(stdout, chunk);
    });
    child.once('error', (error: NodeJS.ErrnoException) => {
      finish({ stdout, exitCode: null, signal: null, timedOut, spawnError: error.code ?? error.message });
    });
    child.once('exit', (exitCode: number | null, signal: NodeJS.Signals | null) => {
      // 'close' never fires while a surviving grandchild holds the stdout
      // pipe; settle shortly after exit so a held pipe cannot block the
      // hook. 'close' below still wins the race in the normal case.
      setTimeout(() => {
        drainStdout();
        finish({ stdout, exitCode, signal, timedOut, spawnError: null });
      }, EXIT_SETTLE_GRACE_MS).unref?.();
    });
    child.once('close', (exitCode: number | null, signal: NodeJS.Signals | null) => {
      finish({ stdout, exitCode, signal, timedOut, spawnError: null });
    });
  });
}

function freshnessFrom(value: unknown): AdvisorHookFreshness {
  return value === 'live' || value === 'stale' || value === 'absent' || value === 'unavailable'
    ? value
    : 'unavailable';
}

function thresholdsFrom(data: CliRecommendData, options: SkillAdvisorCliFallbackOptions): { readonly confidenceThreshold: number; readonly uncertaintyThreshold: number } {
  const effective = isRecord(data.effectiveThresholds) ? data.effectiveThresholds : null;
  const confidenceThreshold = typeof effective?.confidenceThreshold === 'number'
    ? effective.confidenceThreshold
    : options.thresholdConfig?.confidenceThreshold ?? 0.8;
  const uncertaintyThreshold = typeof effective?.uncertaintyThreshold === 'number'
    ? effective.uncertaintyThreshold
    : options.thresholdConfig?.uncertaintyThreshold ?? 0.35;
  return { confidenceThreshold, uncertaintyThreshold };
}

function recommendationFromCli(value: unknown, thresholds: { readonly confidenceThreshold: number; readonly uncertaintyThreshold: number }): AdvisorRecommendation | null {
  if (!isRecord(value) || typeof value.skillId !== 'string') {
    return null;
  }
  const confidence = typeof value.confidence === 'number' ? value.confidence : 0;
  const uncertainty = typeof value.uncertainty === 'number' ? value.uncertainty : 1;
  return {
    skill: value.skillId,
    kind: 'skill',
    confidence,
    uncertainty,
    passes_threshold: confidence >= thresholds.confidenceThreshold && uncertainty <= thresholds.uncertaintyThreshold,
  };
}

function cacheHitFrom(data: CliRecommendData): boolean {
  return isRecord(data.cache) && data.cache.hit === true;
}

function resultStatus(freshness: AdvisorHookFreshness, recommendations: readonly AdvisorRecommendation[]): WarmSkillAdvisorCliFallbackStatus {
  if ((freshness === 'live' || freshness === 'stale') && recommendations.length > 0) {
    return 'ok';
  }
  if (freshness === 'unavailable') {
    return 'fail_open';
  }
  return 'skipped';
}

function failOpenResult(args: {
  readonly startedAt: number;
  readonly now: () => number;
  readonly runtime: AdvisorRuntime;
  readonly tokenCap: number;
  readonly errorMessage: string;
  readonly reason: string;
  readonly exitCode: number | null;
  readonly timedOut?: boolean;
  readonly subprocessInvoked: boolean;
}): AdvisorHookResult {
  return withCliFallbackEnvelope({
    status: 'fail_open',
    freshness: 'unavailable',
    brief: null,
    recommendations: [],
    diagnostics: {
      errorCode: 'NON_ZERO_EXIT',
      errorClass: 'unknown',
      errorMessage: args.errorMessage,
    },
    metrics: {
      durationMs: Number((args.now() - args.startedAt).toFixed(3)),
      cacheHit: false,
      subprocessInvoked: args.subprocessInvoked,
      retriesAttempted: 0,
      recommendationCount: 0,
      tokenCap: args.tokenCap,
    },
    generatedAt: new Date().toISOString(),
    sharedPayload: null,
  }, skillAdvisorCliFallbackEnvelope({
    status: 'fail_open',
    reason: args.reason,
    exitCode: args.exitCode,
    timedOut: args.timedOut,
  }));
}

function resultFromCliData(args: {
  readonly data: CliRecommendData;
  readonly options: SkillAdvisorCliFallbackOptions;
  readonly startedAt: number;
  readonly now: () => number;
}): AdvisorHookResult {
  const freshness = freshnessFrom(args.data.freshness);
  const thresholds = thresholdsFrom(args.data, args.options);
  const recommendations = Array.isArray(args.data.recommendations)
    ? args.data.recommendations
      .map((recommendation) => recommendationFromCli(recommendation, thresholds))
      .filter((recommendation): recommendation is AdvisorRecommendation => Boolean(recommendation?.passes_threshold))
    : [];
  const tokenCap = Math.min(Math.max(1, Math.floor(args.options.maxTokens ?? 80)), 120);
  const status = resultStatus(freshness, recommendations);
  const warnings = Array.isArray(args.data.warnings)
    ? args.data.warnings.filter((value): value is string => typeof value === 'string')
    : [];
  const reason = status === 'ok'
    ? 'ok'
    : (freshness === 'absent' ? 'advisor_absent' : 'advisor_unavailable');
  return withCliFallbackEnvelope({
    status,
    freshness,
    brief: null,
    recommendations,
    diagnostics: status === 'ok'
      ? (freshness === 'stale' && warnings[0] ? { staleReason: warnings[0] } : null)
      : {
        errorCode: 'NON_ZERO_EXIT',
        errorClass: 'unknown',
        errorMessage: freshness === 'absent' ? 'CLI_ADVISOR_ABSENT' : 'CLI_ADVISOR_UNAVAILABLE',
      },
    metrics: {
      durationMs: Number((args.now() - args.startedAt).toFixed(3)),
      cacheHit: cacheHitFrom(args.data),
      subprocessInvoked: true,
      retriesAttempted: 0,
      recommendationCount: recommendations.length,
      tokenCap,
    },
    generatedAt: new Date().toISOString(),
    sharedPayload: null,
  }, skillAdvisorCliFallbackEnvelope({ status, reason, exitCode: 0 }));
}

function parseCliPayload(stdout: string): CliRecommendData | null {
  try {
    const parsed = JSON.parse(stdout) as unknown;
    if (!isRecord(parsed) || !isRecord(parsed.data)) {
      return null;
    }
    return parsed.data as CliRecommendData;
  } catch {
    return null;
  }
}

export async function buildSkillAdvisorBriefFromCli(
  prompt: string,
  options: SkillAdvisorCliFallbackOptions,
  dependencies: SkillAdvisorCliFallbackDependencies = {},
): Promise<AdvisorHookResult> {
  const env = dependencies.env ?? process.env;
  const now = dependencies.now ?? performance.now.bind(performance);
  const startedAt = now();
  const timeoutMs = resolveSkillAdvisorCliFallbackTimeoutMs(options.timeoutMs, env);
  const tokenCap = Math.min(Math.max(1, Math.floor(options.maxTokens ?? 80)), 120);
  const paths = findCliFallbackPaths(options.workspaceRoot, env);
  if (!paths) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: 'CLI_RETRYABLE_UNAVAILABLE exit 75: CLI assets missing',
      reason: 'repo_paths_unavailable',
      exitCode: null,
      subprocessInvoked: false,
    });
  }

  const probe = await probeWarmDaemon(paths, env, timeoutMs);
  if (!probe.ok) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: `CLI_RETRYABLE_UNAVAILABLE exit 75: ${probe.reason ?? 'warm daemon unavailable'}`,
      reason: probe.reason ?? 'warm_daemon_unavailable',
      exitCode: EXIT_RETRYABLE,
      subprocessInvoked: false,
    });
  }

  const remainingMs = Math.max(1, Math.floor(timeoutMs - (now() - startedAt)));
  const cli = await runCliRecommend({ paths, prompt, options, env, timeoutMs: remainingMs });
  if (cli.timedOut) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: 'CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out',
      reason: 'timeout',
      exitCode: EXIT_RETRYABLE,
      timedOut: true,
      subprocessInvoked: true,
    });
  }
  if (cli.spawnError) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: `CLI_RETRYABLE_UNAVAILABLE exit 75: ${cli.spawnError}`,
      reason: cli.spawnError,
      exitCode: EXIT_RETRYABLE,
      subprocessInvoked: true,
    });
  }
  if (cli.exitCode !== 0 || cli.signal !== null) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: cli.exitCode === EXIT_RETRYABLE
        ? 'CLI_RETRYABLE_EXIT_75'
        : `CLI_EXIT_${cli.exitCode ?? 'SIGNAL'}`,
      reason: cli.exitCode === EXIT_RETRYABLE ? 'exit_75' : `exit_${cli.exitCode ?? 'signal'}`,
      exitCode: cli.exitCode,
      subprocessInvoked: true,
    });
  }
  const data = parseCliPayload(cli.stdout);
  if (!data) {
    return failOpenResult({
      startedAt,
      now,
      runtime: options.runtime,
      tokenCap,
      errorMessage: 'CLI_RETRYABLE_UNAVAILABLE exit 75: bad JSON response',
      reason: 'bad_json_response',
      exitCode: EXIT_RETRYABLE,
      subprocessInvoked: true,
    });
  }
  return resultFromCliData({ data, options, startedAt, now });
}
