#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: UserPromptSubmit Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code UserPromptSubmit. Emits a JSON additionalContext
// envelope for model-visible advisor guidance and fails open on all errors.

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import { existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isAdvisorRuntime, type AdvisorRuntime } from '../../runtime/lib/advisor-runtime-values.js';
import { findAdvisorWorkspaceRoot } from '../../runtime/lib/utils/workspace-root.js';
import { shouldFireAdvisor, stripLeadingPastedReply } from '../../runtime/lib/prompt-policy.js';
import {
  buildSkillAdvisorBrief,
  skippedAdvisorResultFor,
  skippedWeakFollowUpResult,
  type AdvisorHookResult,
  type AdvisorHookStatus,
  type AdvisorHookFreshness,
} from '../../runtime/lib/skill-advisor-brief.js';
import {
  decideDirectiveLifecycleDelivery,
  defaultDirectiveLifecycleStore,
  isDirectiveLifecycleDedupEnabled,
  type DirectiveLifecycleState,
} from '../lib/directive-lifecycle.js';
import {
  decideRouteReceiptGuard,
  defaultRouteReceiptStore,
  ROUTE_RECEIPT_VERSION,
  type RouteReceiptStore,
} from '../lib/route-receipt.js';
import {
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
  renderAdvisorTimeoutFallback,
  observeEmittedAdvisorPolicy,
} from '../../runtime/lib/render.js';
import type { ShadowDeliveryRenderOptions } from '../../runtime/lib/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  persistAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../runtime/lib/metrics.js';
import { buildSkillAdvisorBriefFromCli } from '../lib/skill-advisor-cli-fallback.js';

export { renderAdvisorFallbackDirective };

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION
// ───────────────────────────────────────────────────────────────

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

const requireFromAdvisor = createRequire(import.meta.url);

// Setup, install and configure words trigger the hint; check needs nearby tooling context.
// Bounded context keeps unrelated checks quiet without scanning long prompts.
export const SETUP_WORDING = new RegExp(
  String.raw`\b(?:set[\s-]?up|setups?`
    + String.raw`|(?:re)?install(?:s|ed|ing|ation|er|ers)?`
    + String.raw`|configur(?:e|es|ed|ing|ations?)`
    + String.raw`|check(?:s|ed|ing)?(?:\s+\S+){0,2}?\s+`
    + String.raw`(?:environment|env|config(?:s|urations?)?`
    + String.raw`|hooks?|tools|tooling|toolchain|skilled))\b`,
  'i',
);
// The source and the built module sit at different depths below .skilled, so the
// resolver is found by walking up rather than by counting parent hops. A missing
// resolver answers as if no switch were set, as every adapter does.
function hookFlagsResolverPath(): string | null {
  let folder = dirname(fileURLToPath(import.meta.url));
  while (true) {
    const resolverPath = join(folder, 'hooks', 'shared', 'hook-flags.cjs');
    if (existsSync(resolverPath)) return resolverPath;
    const parent = dirname(folder);
    if (parent === folder) return null;
    folder = parent;
  }
}

function hookConcernEnabled(concern: string): boolean {
  try {
    const resolverPath = hookFlagsResolverPath();
    if (resolverPath === null) return true;
    const { isHookEnabled } = requireFromAdvisor(resolverPath) as {
      isHookEnabled?: (concern: string) => boolean;
    };
    return typeof isHookEnabled !== 'function' || isHookEnabled(concern) !== false;
  } catch {
    return true;
  }
}

function skillAdvisorHookEnabled(): boolean {
  return hookConcernEnabled('skill-advisor');
}

// A route receipt expires on the directive-lifecycle clock, and the lifecycle
// hooks stop moving that clock while their switch is off. A receipt kept then
// would outlive a compaction, so receipts are neither read nor written.
function routeReceiptsEnabled(): boolean {
  return hookConcernEnabled('directive-lifecycle');
}

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────

export interface ClaudeUserPromptSubmitInput {
  readonly session_id?: string;
  readonly session_identity_confirmed?: boolean;
  readonly session_identity_ambiguous?: boolean;
  readonly hook_event_name?: string;
  readonly lifecycle_event?: string;
  readonly lifecycle_source?: string;
  readonly source?: string;
  readonly scope_changed?: boolean;
  readonly policy_set_changed?: boolean;
  readonly goal_changed?: boolean;
  readonly delivery_receipt_status?: 'configured' | 'observed' | 'unobserved' | 'unknown';
  readonly prompt?: string;
  readonly cwd?: string;
  readonly transcript_path?: string;
  readonly [key: string]: unknown;
}

export interface ClaudeHookSpecificOutput {
  readonly hookSpecificOutput: {
    readonly hookEventName: 'UserPromptSubmit';
    readonly additionalContext: string;
  };
}

export type ClaudeUserPromptSubmitOutput = ClaudeHookSpecificOutput | Record<string, never>;

export interface UserPromptSubmitDependencies {
  /** In-process callers such as Pi pass their runtime directly. */
  readonly runtime?: AdvisorRuntime;
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly buildCliBrief?: typeof buildSkillAdvisorBriefFromCli;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
  /** Per-session directive-lifecycle dedup state; defaults to the durable file-backed store. */
  readonly directiveLifecycleStore?: DirectiveLifecycleState;
  /** Per-session record of the last confident route; defaults to the durable file-backed store. */
  readonly routeReceiptStore?: RouteReceiptStore;
  /** Delay a full-delivery receipt until the process handoff acknowledges stdout. */
  readonly deferDirectiveReceipt?: boolean;
}

interface HookDiagnosticInput {
  readonly runtime?: AdvisorRuntime;
  readonly workspaceRoot: string;
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: unknown;
  readonly errorDetails?: string;
  readonly skillLabel?: string | null;
  readonly degraded?: boolean;
  readonly generation?: number;
  readonly emittedBytes?: number;
  readonly directivesSuppressed?: boolean;
}

// ───────────────────────────────────────────────────────────────
// 4. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500;
const MAX_PROMPT_BYTES = 64 * 1024;
const OBSERVED_ADVISOR_POLICY_CANDIDATE = '004';
const DIRECTIVE_RECEIPT_COMMIT = Symbol('directiveReceiptCommit');
const pendingDiagnosticWrites = new Set<Promise<unknown>>();

// ───────────────────────────────────────────────────────────────
// 5. HELPERS
// ───────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  // Drop a pasted earlier reply before the cut, so a long paste cannot push the
  // task line past it.
  const value = stripLeadingPastedReply(raw);
  if (Buffer.byteLength(value, 'utf8') <= MAX_PROMPT_BYTES) {
    return value;
  }

  let low = 0;
  let high = value.length;
  while (low < high) {
    const midpoint = Math.ceil((low + high) / 2);
    if (Buffer.byteLength(value.slice(0, midpoint), 'utf8') <= MAX_PROMPT_BYTES) {
      low = midpoint;
    } else {
      high = midpoint - 1;
    }
  }
  return value.slice(0, low);
}

export function workspaceRootFor(input: ClaudeUserPromptSubmitInput): string {
  const start =
    typeof input.cwd === 'string' && input.cwd.trim().length > 0
      ? input.cwd
      : process.cwd();
  // Anchor to the real repo root. A raw session cwd inside a specs/<packet>
  // directory would otherwise become the "workspace root", and the advisor's
  // state writers materialize a stray .state/advisor tree under it.
  return findAdvisorWorkspaceRoot(start);
}

function skillLabelFor(result: AdvisorHookResult): string | null {
  const metadataLabel = result.sharedPayload?.metadata?.skillLabel;
  if (typeof metadataLabel === 'string') {
    return metadataLabel;
  }
  return result.recommendations[0]?.skill ?? null;
}

function positiveIntFromEnv(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function claudeHookTimeoutMs(): number {
  return positiveIntFromEnv(process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS, DEFAULT_CLAUDE_HOOK_TIMEOUT_MS);
}

function lifecycleEventFor(input: ClaudeUserPromptSubmitInput): string | undefined {
  const explicit = input.lifecycle_event ?? input.lifecycle_source;
  if (explicit === 'startup' || explicit === 'resume' || explicit === 'compact') {
    return explicit;
  }
  if (input.hook_event_name === 'SessionStart'
    && (input.source === 'startup' || input.source === 'resume' || input.source === 'compact')) {
    return input.source;
  }
  return undefined;
}

/** Convert runtime-owned identity and lifecycle fields into shadow-only signals. */
export function deliveryStateOptionsFor(
  input: ClaudeUserPromptSubmitInput,
): ShadowDeliveryRenderOptions {
  const hasSessionId = typeof input.session_id === 'string' && input.session_id.trim().length > 0;
  return {
    sessionId: input.session_id,
    sessionIdentityConfirmed: input.session_identity_confirmed ?? hasSessionId,
    sessionIdentityAmbiguous: input.session_identity_ambiguous === true,
    lifecycleEvent: lifecycleEventFor(input),
    scopeChanged: input.scope_changed === true,
    policySetChanged: input.policy_set_changed === true,
    goalChanged: input.goal_changed === true,
    deliveryConfirmed: false,
  };
}

export function emitDiagnostic(
  record: HookDiagnosticInput,
  writeDiagnostic: (line: string) => void = (line) => process.stderr.write(`${line}\n`),
  persistDiagnostic: typeof persistAdvisorHookDiagnosticRecord = persistAdvisorHookDiagnosticRecord,
): void {
  try {
    const diagnosticRecord = createAdvisorHookDiagnosticRecord({
      runtime: 'claude',
      ...record,
    });
    const line = serializeAdvisorHookDiagnosticRecord(diagnosticRecord);
    writeDiagnostic(line);
    const pendingWrite = persistDiagnostic(record.workspaceRoot, diagnosticRecord).catch(() => undefined);
    pendingDiagnosticWrites.add(pendingWrite);
    void pendingWrite.then(() => pendingDiagnosticWrites.delete(pendingWrite));
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

export async function flushPendingDiagnostics(maxWaitMs = 100): Promise<void> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    if (pendingDiagnosticWrites.size === 0) return;
    const pendingWrites = Promise.all([...pendingDiagnosticWrites]).then(() => undefined);
    const timeoutElapsed = new Promise<void>((resolvePromise) => {
      timeout = setTimeout(resolvePromise, maxWaitMs);
      timeout.unref();
    });
    await Promise.race([pendingWrites, timeoutElapsed]);
  } catch {
    // Diagnostics must never affect hook behavior.
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function parseClaudeUserPromptSubmitInput(raw: string): ClaudeUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// 6. CORE LOGIC
// ───────────────────────────────────────────────────────────────

// A session's last confident route lets a weak follow-up that would route
// elsewhere only on the confidence floor be held back, because the earlier
// brief is still in context and the floored one would steer the model off the
// session's task. Receipts are advisory: any fault keeps the turn as it was.
//
// A receipt is keyed by session id, so only an identity the host has confirmed
// may hold or read one; otherwise a session reusing a provisional id could have
// its follow-up held back against another session's route. Absent flags count
// as confirmed, the same rule the directive lifecycle applies.
function receiptSessionId(input: ClaudeUserPromptSubmitInput): string | null {
  const sessionId = typeof input.session_id === 'string' && input.session_id.trim().length > 0
    ? input.session_id.trim()
    : null;
  const confirmed = input.session_identity_confirmed
    ?? (sessionId !== null && input.session_identity_ambiguous !== true);
  return sessionId !== null && confirmed === true ? sessionId : null;
}

function transcriptBytesFor(input: ClaudeUserPromptSubmitInput): number | null {
  if (typeof input.transcript_path !== 'string' || input.transcript_path.length === 0) return null;
  try {
    return statSync(input.transcript_path).size;
  } catch {
    return null;
  }
}

function topPassingRecommendation(result: AdvisorHookResult): AdvisorHookResult['recommendations'][number] | null {
  return result.status === 'ok'
    ? result.recommendations.find((recommendation) => recommendation.passes_threshold === true) ?? null
    : null;
}

function guardWeakFollowUp(
  result: AdvisorHookResult,
  prompt: string,
  input: ClaudeUserPromptSubmitInput,
  dependencies: UserPromptSubmitDependencies,
): AdvisorHookResult {
  try {
    const sessionId = receiptSessionId(input);
    const top = topPassingRecommendation(result);
    if (!sessionId || !top || top.confidenceFloored !== true || !routeReceiptsEnabled()) return result;
    // A startup, resume or compact turn starts the model on fresh context, so the
    // earlier route no longer frames this prompt.
    if (lifecycleEventFor(input)) return result;
    const receipt = (dependencies.routeReceiptStore ?? defaultRouteReceiptStore()).read(sessionId);
    if (!receipt) return result;
    const strippedPrompt = stripLeadingPastedReply(prompt);
    const lifecycle = dependencies.directiveLifecycleStore ?? defaultDirectiveLifecycleStore();
    const decision = decideRouteReceiptGuard({
      receipt,
      clock: () => lifecycle.clock(sessionId),
      transcriptBytes: transcriptBytesFor(input),
      strippedPrompt,
      // Read from stripped text, as every other gate does. The prompt is already
      // stripped when it gets here, and stripping again returns the same text.
      policyReason: shouldFireAdvisor(strippedPrompt).reason,
      topSkill: top.skill,
      topFloored: true,
    });
    return decision === 'suppress' ? skippedWeakFollowUpResult() : result;
  } catch {
    return result;
  }
}

// Works out the route receipt change this turn earns and returns it as an action,
// so the caller can hold it until the host has taken the output. A turn the model
// never saw then leaves the session on its earlier route.
function routeReceiptActionFor(
  result: AdvisorHookResult,
  brief: string | null,
  input: ClaudeUserPromptSubmitInput,
  dependencies: UserPromptSubmitDependencies,
): (() => void) | undefined {
  try {
    const sessionId = receiptSessionId(input);
    const top = topPassingRecommendation(result);
    if (!sessionId || !brief || !top || !routeReceiptsEnabled()) return undefined;
    const store = dependencies.routeReceiptStore ?? defaultRouteReceiptStore();
    // Only a route the model was shown on the advisor's own evidence is worth
    // holding to: not one lifted onto the confidence floor, and not one the
    // local scorer gave while the advisor was down. Showing either still moves
    // the session off an earlier route that differs, so that route expires.
    if (top.confidenceFloored === true || result.metrics.degraded === true) {
      return () => {
        const held = store.read(sessionId);
        if (held && held.skill !== top.skill) store.remove(sessionId);
      };
    }
    // The clock is read now, before this turn's directive delivery moves it.
    const clock = (dependencies.directiveLifecycleStore ?? defaultDirectiveLifecycleStore()).clock(sessionId);
    if (!clock) return undefined;
    const transcriptBytes = transcriptBytesFor(input);
    return () => store.write({
      version: ROUTE_RECEIPT_VERSION,
      sessionId,
      skill: top.skill,
      storeGeneration: clock.storeGeneration,
      lifecycleEpoch: clock.lifecycleEpoch,
      transcriptBytes,
    });
  } catch {
    return undefined;
  }
}

function runRouteReceiptAction(action: () => void): void {
  try {
    action();
  } catch {
    // A lost receipt only means the next follow-up is routed on its own evidence.
  }
}

// A host that confirms its write holds both receipts for one commit after the
// write lands, even on a repeat turn whose directive receipt needs no commit.
// Without that confirmation the route receipt is written at once.
function deliveryCommitFor(
  commitFullReceipt: (() => boolean) | undefined,
  routeReceiptAction: (() => void) | undefined,
  dependencies: UserPromptSubmitDependencies,
): (() => boolean) | undefined {
  if (!routeReceiptAction) return commitFullReceipt;
  if (dependencies.deferDirectiveReceipt !== true) {
    runRouteReceiptAction(routeReceiptAction);
    return commitFullReceipt;
  }
  return () => {
    const committed = commitFullReceipt ? commitFullReceipt() : true;
    runRouteReceiptAction(routeReceiptAction);
    return committed;
  };
}

// Directive-lifecycle dedup delivers the full brief on the first message
// and after lifecycle boundaries or transcript shrink. On proven repeats,
// it keeps the head and drops the constant directive block. A headed
// fallback reduces like a brief; unknown sessions and the kill switch get
// the full text. A fault inside dedup keeps the full text, and a crash
// elsewhere in the hook dedups its fallback like any headed fallback.
function applyDirectiveLifecycle(
  emitted: string,
  input: ClaudeUserPromptSubmitInput,
  dependencies: UserPromptSubmitDependencies,
): { effectiveEmitted: string; commitFullReceipt?: (() => boolean) | undefined } {
  try {
    const sessionId = typeof input.session_id === 'string' && input.session_id.trim().length > 0
      ? input.session_id
      : undefined;
    const sessionConfirmed = input.session_identity_confirmed
      ?? (Boolean(sessionId) && input.session_identity_ambiguous !== true);
    const transcriptPath = typeof input.transcript_path === 'string' && input.transcript_path.length > 0
      ? input.transcript_path
      : null;
    let transcriptBytes: number | null = null;
    if (transcriptPath) {
      try {
        transcriptBytes = statSync(transcriptPath).size;
      } catch {
        transcriptBytes = null;
      }
    }
    const decision = decideDirectiveLifecycleDelivery(emitted, {
      state: dependencies.directiveLifecycleStore ?? defaultDirectiveLifecycleStore(),
      sessionId,
      sessionConfirmed,
      lifecycleEvent: lifecycleEventFor(input),
      transcriptPath,
      transcriptBytes,
      enabled: isDirectiveLifecycleDedupEnabled(),
      deferFullReceipt: dependencies.deferDirectiveReceipt === true,
    });
    return {
      effectiveEmitted: decision.suppressed && decision.reducedContext ? decision.reducedContext : emitted,
      commitFullReceipt: decision.commitFullReceipt,
    };
  } catch {
    // Directive dedup is advisory; on any failure keep the full brief.
    return { effectiveEmitted: emitted };
  }
}

// Builds the hook output, attaches the deferred receipt when there is one and
// records the emitted policy once, so a normal turn and a crash deliver alike.
function finishAdvisorDelivery(
  additionalContext: string,
  commitFullReceipt: (() => boolean) | undefined,
  deliveryState: ShadowDeliveryRenderOptions,
  runtime: AdvisorRuntime,
): ClaudeUserPromptSubmitOutput {
  const output: ClaudeUserPromptSubmitOutput = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext,
    },
  };
  if (commitFullReceipt) {
    Object.defineProperty(output, DIRECTIVE_RECEIPT_COMMIT, {
      configurable: true,
      enumerable: false,
      value: commitFullReceipt,
    });
  }
  observeEmittedAdvisorPolicy(additionalContext, {
    ...deliveryState,
    // Claude keeps its display label and every other caller is recorded under
    // the runtime it named, so no other runtime's delivery is counted as Claude's.
    runtime: runtime === 'claude' ? 'Claude Code' : runtime,
    candidate: OBSERVED_ADVISOR_POLICY_CANDIDATE,
  });
  return output;
}

export async function handleClaudeUserPromptSubmit(
  input: ClaudeUserPromptSubmitInput | null,
  dependencies: UserPromptSubmitDependencies = {},
): Promise<ClaudeUserPromptSubmitOutput> {
  const environmentRuntime = process.env.SPECKIT_RUNTIME;
  const runtime = dependencies.runtime
    ?? (isAdvisorRuntime(environmentRuntime) ? environmentRuntime : 'claude');
  let startedAt: number | null = null;
  const elapsed = (): number => {
    try {
      const now = dependencies.now?.() ?? performance.now();
      return startedAt === null ? 0 : Number((now - startedAt).toFixed(3));
    } catch {
      return 0;
    }
  };
  let prompt: string | null = null;
  let workspaceRoot: string | undefined;
  let skippedResult: AdvisorHookResult | null = null;
  let deliveryState: ShadowDeliveryRenderOptions = {};
  const writeDiagnostic = dependencies.writeDiagnostic;
  // Read before the try, so a crash in a hook the operator switched off stays as
  // silent as the hook itself.
  let hookDisabled = false;

  try {
    hookDisabled = !skillAdvisorHookEnabled() || process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1';
    if (hookDisabled) {
      emitDiagnostic({
        runtime,
        workspaceRoot: process.cwd(),
        status: 'skipped',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
      }, writeDiagnostic);
      return {};
    }

    if (!input) {
      emitDiagnostic({
        runtime,
        workspaceRoot: process.cwd(),
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'Invalid UserPromptSubmit JSON payload',
      }, writeDiagnostic);
      return {};
    }

    startedAt = dependencies.now?.() ?? performance.now();
    prompt = normalizePrompt(input.prompt);
    workspaceRoot = workspaceRootFor(input);
    if (prompt === null) {
      emitDiagnostic({
        runtime,
        workspaceRoot,
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'Missing UserPromptSubmit prompt string',
      }, writeDiagnostic);
      return {};
    }
    // Set before the brief build, so a crash below records its fallback against
    // this session instead of an anonymous one.
    deliveryState = deliveryStateOptionsFor(input);

    const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
    // The CLI owns the warm-daemon probe and local-scorer fallback.
    // The prompt-policy gate skips prompts that need no advisor before the
    // CLI call; injected full producers stay ungated for producer-level tests.
    const injectedBrief = dependencies.buildBrief;
    const buildCliBrief = dependencies.buildCliBrief ?? buildSkillAdvisorBriefFromCli;
    skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt);
    let result = injectedBrief
      ? await injectedBrief(prompt, {
        runtime,
        workspaceRoot,
        subprocessTimeoutMs: claudeHookTimeoutMs(),
      })
      : skippedResult ?? await buildCliBrief(prompt, {
        runtime,
        workspaceRoot,
        timeoutMs: claudeHookTimeoutMs(),
      }, {
        now: dependencies.now,
      });
    result = guardWeakFollowUp(result, prompt, input, dependencies);

    result = {
      ...result,
      metrics: {
        ...result.metrics,
        durationMs: elapsed(),
      },
    };
    const brief = renderBrief(result, { deliveryState });
    const routeReceiptAction = routeReceiptActionFor(result, brief, input, dependencies);
    const renderOptions = { deliveryState, setupWording: !brief && SETUP_WORDING.test(prompt) };
    const emitted = brief ?? renderAdvisorFallbackDirective(renderOptions, result);
    const { effectiveEmitted, commitFullReceipt } = applyDirectiveLifecycle(emitted, input, dependencies);
    const commitReceipts = deliveryCommitFor(commitFullReceipt, routeReceiptAction, dependencies);
    emitDiagnostic({
      runtime,
      workspaceRoot,
      status: result.status,
      freshness: result.freshness,
      durationMs: result.metrics.durationMs,
      cacheHit: result.metrics.cacheHit,
      errorCode: result.diagnostics?.errorCode,
      errorDetails: result.diagnostics?.errorMessage ?? result.diagnostics?.policyReason ?? result.diagnostics?.staleReason,
      skillLabel: skillLabelFor(result),
      degraded: result.metrics.degraded === true,
      emittedBytes: Buffer.byteLength(effectiveEmitted, 'utf8'),
      directivesSuppressed: effectiveEmitted !== emitted,
    }, writeDiagnostic);

    return finishAdvisorDelivery(effectiveEmitted, commitReceipts, deliveryState, runtime);
  } catch {
    // process.cwd() throws when the working directory was removed, and a lost
    // diagnostic must not cost the model its fallback.
    try {
      emitDiagnostic({
        runtime,
        workspaceRoot: workspaceRoot ?? process.cwd(),
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'UNKNOWN',
        errorDetails: 'Unhandled UserPromptSubmit hook exception',
      }, writeDiagnostic);
    } catch {
      // Diagnostics are best effort; the fallback below still runs.
    }
    // A payload with no prompt string is silent on the normal path, so a crash
    // while rejecting it must not turn it into an outage line.
    if (hookDisabled || !input || typeof input.prompt !== 'string') return {};
    // A crash shows the model what a timeout would show for this turn, deduplicated the
    // same way. If any of that throws as well, there is nothing safe left to show.
    try {
      const renderOptions = { deliveryState, setupWording: prompt !== null && SETUP_WORDING.test(prompt) };
      const emitted = skippedResult
        ? renderAdvisorFallbackDirective(renderOptions, skippedResult)
        : renderAdvisorTimeoutFallback(renderOptions);
      const delivery = applyDirectiveLifecycle(emitted, input, dependencies);
      return finishAdvisorDelivery(delivery.effectiveEmitted, delivery.commitFullReceipt, deliveryState, runtime);
    } catch {
      return {};
    }
  }
}

// ───────────────────────────────────────────────────────────────
// 7. OUTPUT DELIVERY
// ───────────────────────────────────────────────────────────────

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

export function commitClaudeDirectiveDeliveryReceipt(
  output: ClaudeUserPromptSubmitOutput,
): boolean {
  const record = output as ClaudeUserPromptSubmitOutput & {
    [DIRECTIVE_RECEIPT_COMMIT]?: () => boolean;
  };
  const commit = record[DIRECTIVE_RECEIPT_COMMIT];
  if (!commit) return true;
  delete record[DIRECTIVE_RECEIPT_COMMIT];
  return commit();
}

export interface HookOutputStream {
  write(chunk: string, callback: (error?: Error | null) => void): boolean;
}

/**
 * Write the hook output and commit its deferred receipt once the write lands.
 * A failed write leaves the receipt uncommitted, so the next turn delivers the
 * full brief again instead of a head the model never saw the rest of.
 */
export function writeHookOutput(
  output: ClaudeUserPromptSubmitOutput,
  stream: HookOutputStream = process.stdout,
): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    stream.write(`${JSON.stringify(output)}\n`, (error) => {
      if (!error) commitClaudeDirectiveDeliveryReceipt(output);
      resolvePromise();
    });
  });
}

// ───────────────────────────────────────────────────────────────
// 8. CLI ENTRY POINT
// ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseClaudeUserPromptSubmitInput(rawInput) : null;
  const output = await handleClaudeUserPromptSubmit(input, {
    writeDiagnostic: (line) => process.stderr.write(`${line}\n`),
    deferDirectiveReceipt: true,
  });
  await writeHookOutput(output);
}

if (IS_CLI_ENTRY) {
  main().catch(async () => {
    emitDiagnostic({
      workspaceRoot: process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: 0,
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled UserPromptSubmit CLI exception',
    });
    await writeHookOutput({});
  }).finally(async () => {
    // The exit would otherwise drop diagnostic appends; the cap preserves the shim's kill margin.
    await flushPendingDiagnostics();
    process.exit(0);
  });
}
