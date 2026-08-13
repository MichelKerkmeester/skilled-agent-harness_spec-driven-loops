#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: UserPromptSubmit Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code UserPromptSubmit. Emits a JSON additionalContext
// envelope for model-visible advisor guidance and fails open on all errors.

import { statSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSkillAdvisorBrief,
  type AdvisorHookResult,
  type AdvisorHookStatus,
  type AdvisorHookFreshness,
} from '../../mcp-server/lib/skill-advisor-brief.js';
import {
  decideDirectiveLifecycleDelivery,
  defaultDirectiveLifecycleStore,
  isDirectiveLifecycleDedupEnabled,
  type DirectiveLifecycleState,
} from '../lib/directive-lifecycle.js';
import {
  renderAdvisorBrief,
  renderAdvisorFallbackDirective,
  observeEmittedAdvisorPolicy,
} from '../../mcp-server/lib/render.js';
import type { ShadowDeliveryRenderOptions } from '../../mcp-server/lib/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  persistAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../mcp-server/lib/metrics.js';
import {
  buildSkillAdvisorBriefFromCli,
  shouldTrySkillAdvisorCliFallback,
} from '../lib/skill-advisor-cli-fallback.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

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
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly buildCliBrief?: typeof buildSkillAdvisorBriefFromCli;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
  /** Per-session directive-lifecycle dedup state; defaults to the durable file-backed store. */
  readonly directiveLifecycleStore?: DirectiveLifecycleState;
  /** Delay a full-delivery receipt until the process handoff acknowledges stdout. */
  readonly deferDirectiveReceipt?: boolean;
}

interface HookDiagnosticInput {
  readonly workspaceRoot: string;
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: unknown;
  readonly errorDetails?: string;
  readonly skillLabel?: string | null;
  readonly generation?: number;
}

export const DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500;
const MAX_PROMPT_BYTES = 64 * 1024;
const OBSERVED_ADVISOR_POLICY_CANDIDATE = '004';
const DIRECTIVE_RECEIPT_COMMIT = Symbol('directiveReceiptCommit');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
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

function workspaceRootFor(input: ClaudeUserPromptSubmitInput): string {
  return typeof input.cwd === 'string' && input.cwd.trim().length > 0
    ? input.cwd
    : process.cwd();
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
    persistDiagnostic(record.workspaceRoot, diagnosticRecord).catch(() => undefined);
  } catch {
    // Diagnostics must never affect hook behavior.
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

export async function handleClaudeUserPromptSubmit(
  input: ClaudeUserPromptSubmitInput | null,
  dependencies: UserPromptSubmitDependencies = {},
): Promise<ClaudeUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const writeDiagnostic = dependencies.writeDiagnostic;

  try {
    if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
      emitDiagnostic({
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

    const prompt = normalizePrompt(input.prompt);
    const workspaceRoot = workspaceRootFor(input);
    if (prompt === null) {
      emitDiagnostic({
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

    const buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief;
    const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
    let result = await buildBrief(prompt, {
      runtime: 'claude',
      workspaceRoot,
      subprocessTimeoutMs: claudeHookTimeoutMs(),
    });

    const buildCliBrief = dependencies.buildCliBrief ?? (dependencies.buildBrief ? null : buildSkillAdvisorBriefFromCli);
    if (buildCliBrief && shouldTrySkillAdvisorCliFallback(result)) {
      result = await buildCliBrief(prompt, {
        runtime: 'claude',
        workspaceRoot,
        timeoutMs: Math.max(1, claudeHookTimeoutMs() - elapsed()),
      }, {
        now: dependencies.now,
      });
    }

    result = {
      ...result,
      metrics: {
        ...result.metrics,
        durationMs: elapsed(),
      },
    };
    const deliveryState = deliveryStateOptionsFor(input);
    const renderOptions = { deliveryState };
    const brief = renderBrief(result, renderOptions);
    const emitted = brief ?? renderAdvisorFallbackDirective(renderOptions);
    // Directive-lifecycle dedup: deliver the full brief on the first message of
    // a session and after every lifecycle boundary (startup/resume/compact or a
    // transcript shrink), and on a proven same-content repeat keep the dynamic
    // Advisor: route line while dropping the constant directive block. Every
    // uncertain case (unknown session, fallback brief, kill-switch, any thrown
    // error) falls open to the full brief so a guardrail is never dropped.
    let effectiveEmitted = emitted;
    let commitFullReceipt: (() => boolean) | undefined;
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
      commitFullReceipt = decision.commitFullReceipt;
      if (decision.suppressed && decision.reducedContext) {
        effectiveEmitted = decision.reducedContext;
      }
    } catch {
      // Directive dedup is advisory; on any failure keep the full brief.
      effectiveEmitted = emitted;
    }
    emitDiagnostic({
      workspaceRoot,
      status: result.status,
      freshness: result.freshness,
      durationMs: result.metrics.durationMs,
      cacheHit: result.metrics.cacheHit,
      errorCode: result.diagnostics?.errorCode,
      errorDetails: result.diagnostics?.errorMessage ?? result.diagnostics?.policyReason ?? result.diagnostics?.staleReason,
      skillLabel: skillLabelFor(result),
    }, writeDiagnostic);

    const output: ClaudeUserPromptSubmitOutput = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: effectiveEmitted,
      },
    };
    if (commitFullReceipt) {
      Object.defineProperty(output, DIRECTIVE_RECEIPT_COMMIT, {
        configurable: true,
        enumerable: false,
        value: commitFullReceipt,
      });
    }
    observeEmittedAdvisorPolicy(effectiveEmitted, {
      ...deliveryState,
      runtime: 'Claude Code',
      candidate: OBSERVED_ADVISOR_POLICY_CANDIDATE,
    });
    return output;
  } catch {
    emitDiagnostic({
      workspaceRoot: input ? workspaceRootFor(input) : process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled UserPromptSubmit hook exception',
    }, writeDiagnostic);
    return {};
  }
}

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

function writeHookOutput(output: ClaudeUserPromptSubmitOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      commitClaudeDirectiveDeliveryReceipt(output);
      resolvePromise();
    });
  });
}

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
  }).finally(() => {
    process.exit(0);
  });
}
