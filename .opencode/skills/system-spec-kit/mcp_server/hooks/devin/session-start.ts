#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Devin SessionStart Hook — Code Graph Startup Context
// ───────────────────────────────────────────────────────────────
// Runs on Devin CLI SessionStart event. Emits JSON hookSpecificOutput
// with startup context from the code-graph readiness marker.
//
// Devin stdin contract:
//   { source?: "startup" | "compact" | "clear" | "resume", ... }
//
// Devin stdout contract:
//   { hookSpecificOutput: { hookEventName: "SessionStart",
//     additionalContext: brief } } if brief present; {} otherwise.
//
// Disable via: SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED=1

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatHookOutput,
  truncateToTokenBudget,
  SESSION_PRIME_TOKEN_BUDGET,
  type OutputSection,
} from '../claude/shared.js';
import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js';
import type { StartupBriefResult } from '../../lib/code-graph-boundary.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

interface DevinSessionStartInput {
  source?: 'startup' | 'compact' | 'clear' | 'resume' | string;
  session_id?: string;
  sessionId?: string;
  hook_event_name?: string;
  hookEventName?: string;
  cwd?: string;
  specFolder?: string;
  [key: string]: unknown;
}

interface DevinSessionStartOutput {
  hookSpecificOutput: {
    hookEventName: 'SessionStart';
    additionalContext: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHookDisabled(): boolean {
  const disabled = process.env.SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED;
  if (typeof disabled !== 'string' || disabled.trim().length === 0) return false;
  return disabled === '1' || disabled.toLowerCase() === 'true';
}

function emitDiagnostic(
  status: 'ok' | 'fail_open',
  source: string,
  durationMs: number,
  message?: string,
): void {
  try {
    const line = JSON.stringify({
      surface: 'devin-session-start',
      runtime: 'devin',
      status,
      source,
      durationMs,
      ...(message ? { message } : {}),
    });
    process.stderr.write(`${line}\n`);
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

function buildStartupSections(startupBrief: StartupBriefResult): OutputSection[] {
  const sections: OutputSection[] = [];

  const startupSurface = startupBrief?.startupSurface ?? [
    'Session context received. Current state:',
    '',
    '- Memory: startup summary only (resume on demand)',
    '- Code Graph: unavailable',
    '',
    'What would you like to work on?',
  ].join('\n');

  sections.push({
    title: 'Session Context',
    content: startupSurface,
  });

  sections.push({
    title: 'Recovery Tools',
    content: [
      '- `memory_context({ input, mode })` — unified context retrieval',
      '- `memory_match_triggers({ prompt })` — fast trigger matching',
      '- `memory_search({ query })` — semantic search',
      '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
    ].join('\n'),
  });

  if (startupBrief?.graphOutline) {
    sections.push({
      title: 'Structural Context',
      content: startupBrief.graphOutline,
    });
  } else if (startupBrief?.graphState === 'empty') {
    sections.push({
      title: 'Structural Context',
      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
    });
  }

  if (startupBrief?.sharedPayloadTransport) {
    sections.push({
      title: 'Startup Payload Contract',
      content: startupBrief.sharedPayloadTransport,
    });
  }

  if (startupBrief?.graphState === 'stale') {
    sections.push({
      title: 'Stale Code Graph Warning',
      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
    });
  }

  return sections;
}

function buildFallbackStartupSections(): OutputSection[] {
  return [
    {
      title: 'Session Context',
      content: [
        'Session context received. Current state:',
        '',
        '- Memory: startup summary only (resume on demand)',
        '- Code Graph: unavailable',
        '',
        'What would you like to work on?',
      ].join('\n'),
    },
    {
      title: 'Recovery Tools',
      content: [
        '- `memory_context({ input, mode })` — unified context retrieval',
        '- `memory_match_triggers({ prompt })` — fast trigger matching',
        '- `memory_search({ query })` — semantic search',
        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
      ].join('\n'),
    },
  ];
}

function handleStartup(): OutputSection[] {
  try {
    const startupBrief = getStartupBriefFromMarker();
    return buildStartupSections(startupBrief);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[devin:session-start] buildStartupBrief threw: ${message}\n`);
    return buildFallbackStartupSections();
  }
}

function handleResume(): OutputSection[] {
  return [{
    title: 'Session Resume',
    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
  }];
}

function handleClear(): OutputSection[] {
  return [{
    title: 'Fresh Context',
    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
  }];
}

function handleCompact(): OutputSection[] {
  return [{
    title: 'Context Recovery',
    content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
  }];
}

function parseDevinInput(raw: string): DevinSessionStartInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

export async function handleDevinSessionStart(
  input: DevinSessionStartInput | null,
): Promise<DevinSessionStartOutput | Record<string, never>> {
  const startedAt = performance.now();
  const elapsed = (): number => Number((performance.now() - startedAt).toFixed(3));

  if (!input) {
    emitDiagnostic('fail_open', 'unknown', elapsed(), 'no valid stdin input');
    return {};
  }

  if (isHookDisabled()) {
    emitDiagnostic('fail_open', 'disabled', elapsed(), 'hook disabled via env var');
    return {};
  }

  const source = input?.source ?? 'startup';

  try {
    let sections: OutputSection[];
    switch (source) {
      case 'resume':
        sections = handleResume();
        break;
      case 'clear':
        sections = handleClear();
        break;
      case 'compact':
        sections = handleCompact();
        break;
      default:
        sections = handleStartup();
    }

    const additionalContext = truncateToTokenBudget(
      formatHookOutput(sections),
      SESSION_PRIME_TOKEN_BUDGET,
    );

    if (additionalContext.trim().length === 0) {
      emitDiagnostic('fail_open', source, elapsed(), 'empty context');
      return {};
    }

    emitDiagnostic('ok', source, elapsed());
    return {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    emitDiagnostic('fail_open', source, elapsed(), message);
    return {};
  }
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  if (!rawInput) {
    emitDiagnostic('fail_open', 'unknown', 0, 'no stdin input');
    return;
  }

  const input = parseDevinInput(rawInput);
  const output = await handleDevinSessionStart(input);

  process.stdout.write(`${JSON.stringify(output)}\n`);
}

// Run — exit cleanly even on error
if (IS_CLI_ENTRY) {
  main().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[devin:session-start] unhandled error: ${message}\n`);
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
