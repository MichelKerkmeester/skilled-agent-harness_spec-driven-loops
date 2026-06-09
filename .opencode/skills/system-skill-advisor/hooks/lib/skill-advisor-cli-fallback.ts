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
} from '../../mcp_server/lib/skill-advisor-brief.js';
import type { AdvisorRecommendation } from '../../mcp_server/lib/subprocess.js';

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
const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const require = createRequire(import.meta.url);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function positiveIntFromEnv(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
    const defaultDbDir = join(opencodeDir, 'skills', 'system-skill-advisor', 'mcp_server', 'database');
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

function resolveSocketPath(paths: CliFallbackPaths, env: NodeJS.ProcessEnv): string {
  const socketDir = env.SPECKIT_IPC_SOCKET_DIR;
  if (socketDir?.startsWith('tcp://')) {
    return socketDir;
  }
  return join(resolve(socketDir ?? paths.dbDir), SOCKET_FILE_NAME);
}

function socketPathTooLong(socketPath: string): boolean {
  if (socketPath.startsWith('tcp://')) return false;
  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
}

async function probeWarmDaemon(paths: CliFallbackPaths, env: NodeJS.ProcessEnv, timeoutMs: number): Promise<{ readonly ok: boolean; readonly socketPath?: string; readonly reason?: string }> {
  const socketPath = resolveSocketPath(paths, env);
  if (socketPathTooLong(socketPath)) {
    return { ok: false, socketPath, reason: 'CLI_SOCKET_PATH_TOO_LONG' };
  }
  if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) {
    return { ok: false, socketPath, reason: 'CLI_WARM_SOCKET_MISSING' };
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

function childEnvForCli(paths: CliFallbackPaths, env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...env,
    SPECKIT_IPC_SOCKET_DIR: env.SPECKIT_IPC_SOCKET_DIR ?? paths.dbDir,
  };
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
    ], {
      cwd: args.paths.repoRoot,
      env: childEnvForCli(args.paths, args.env),
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, args.timeoutMs);
    timer.unref?.();
    const finish = (result: CliProcessResult): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise(result);
    };
    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.once('error', (error: NodeJS.ErrnoException) => {
      finish({ stdout, exitCode: null, signal: null, timedOut, spawnError: error.code ?? error.message });
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

function resultStatus(freshness: AdvisorHookFreshness, recommendations: readonly AdvisorRecommendation[]): AdvisorHookStatus {
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
  readonly subprocessInvoked: boolean;
}): AdvisorHookResult {
  return {
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
  };
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
  return {
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
  };
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
      subprocessInvoked: true,
    });
  }
  return resultFromCliData({ data, options, startedAt, now });
}
