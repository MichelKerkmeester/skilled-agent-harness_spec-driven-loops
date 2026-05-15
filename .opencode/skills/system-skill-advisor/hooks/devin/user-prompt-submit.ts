#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Runs on Devin UserPromptSubmit. Emits a JSON additionalContext
// envelope for model-visible advisor guidance and fails open on all errors.
// Mirrors the Claude variant; registered via .devin/hooks.v1.json.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSkillAdvisorBrief,
  type AdvisorHookResult,
  type AdvisorHookStatus,
  type AdvisorHookFreshness,
} from '../../mcp_server/lib/skill-advisor-brief.js';
import { renderAdvisorBrief } from '../../mcp_server/lib/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  persistAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../mcp_server/lib/metrics.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface DevinUserPromptSubmitInput {
  readonly session_id?: string;
  readonly hook_event_name?: string;
  readonly prompt?: string;
  readonly cwd?: string;
  readonly transcript_path?: string;
  readonly [key: string]: unknown;
}

export interface DevinHookSpecificOutput {
  readonly hookSpecificOutput: {
    readonly hookEventName: 'UserPromptSubmit';
    readonly additionalContext: string;
  };
}

export type DevinUserPromptSubmitOutput = DevinHookSpecificOutput | Record<string, never>;

export interface DevinUserPromptSubmitDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  return value;
}

function workspaceRootFor(input: DevinUserPromptSubmitInput): string {
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

function hookDisabled(): boolean {
  return process.env.MK_SKILL_ADVISOR_HOOK_DISABLED === '1'
    || process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1';
}

function emitDiagnostic(
  record: HookDiagnosticInput,
  writeDiagnostic: (line: string) => void = (line) => process.stderr.write(`${line}\n`),
): void {
  try {
    const diagnosticRecord = createAdvisorHookDiagnosticRecord({
      runtime: 'devin',
      ...record,
    });
    const line = serializeAdvisorHookDiagnosticRecord(diagnosticRecord);
    writeDiagnostic(line);
    persistAdvisorHookDiagnosticRecord(record.workspaceRoot, diagnosticRecord);
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

export function parseDevinUserPromptSubmitInput(raw: string): DevinUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function handleDevinUserPromptSubmit(
  input: DevinUserPromptSubmitInput | null,
  dependencies: DevinUserPromptSubmitDependencies = {},
): Promise<DevinUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const writeDiagnostic = dependencies.writeDiagnostic;

  try {
    if (hookDisabled()) {
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
        errorDetails: 'Invalid Devin UserPromptSubmit JSON payload',
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
        errorDetails: 'Missing Devin UserPromptSubmit prompt string',
      }, writeDiagnostic);
      return {};
    }

    const buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief;
    const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
    const result = await buildBrief(prompt, {
      runtime: 'devin',
      workspaceRoot,
    });
    const brief = renderBrief(result);
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

    if (!brief) {
      return {};
    }

    return {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: brief,
      },
    };
  } catch {
    emitDiagnostic({
      workspaceRoot: input ? workspaceRootFor(input) : process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Devin UserPromptSubmit hook exception',
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

function writeHookOutput(output: DevinUserPromptSubmitOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseDevinUserPromptSubmitInput(rawInput) : null;
  const output = await handleDevinUserPromptSubmit(input, {
    writeDiagnostic: (line) => process.stderr.write(`${line}\n`),
  });
  await writeHookOutput(output);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    emitDiagnostic({
      workspaceRoot: process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: 0,
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Devin UserPromptSubmit CLI exception',
    });
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
