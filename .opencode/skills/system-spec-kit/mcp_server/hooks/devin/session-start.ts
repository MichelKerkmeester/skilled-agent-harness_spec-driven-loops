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
import {
  loadState,
  readCompactPrime,
  clearCompactPrime,
  validatePendingCompactPrimeSemantics,
} from '../claude/hook-state.js';
import {
  sanitizeRecoveredPayload,
  wrapRecoveredCompactPayload,
} from '../shared-provenance.js';
import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js';
import type { StartupBriefResult } from '../../lib/code-graph-boundary.js';

const CACHE_TTL_MS = 30 * 60 * 1000;

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

function handleResume(sessionId: string): OutputSection[] {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;

  if (state?.lastSpecFolder) {
    return [{
      title: 'Session Continuity',
      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
    }];
  }

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

function handleCompact(sessionId: string): OutputSection[] {
  const fallback: OutputSection[] = [{
    title: 'Context Recovery',
    content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
  }];

  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const pendingCompactPrime = readCompactPrime(sessionId);

  if (!pendingCompactPrime) {
    return fallback;
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    return fallback;
  }

  const semanticValidation = validatePendingCompactPrimeSemantics(pendingCompactPrime);
  if (!semanticValidation.ok) {
    clearCompactPrime(sessionId, {
      cachedAt: pendingCompactPrime.cachedAt,
      opaqueId: pendingCompactPrime.opaqueId ?? null,
    });
    return fallback;
  }

  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
    sanitizerVersion: pendingCompactPrime.payloadContract?.provenance.sanitizerVersion,
    runtimeFingerprint: pendingCompactPrime.payloadContract?.provenance.runtimeFingerprint,
  });

  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    {
      title: 'Recovery Instructions',
      content: `Context was compacted and auto-recovered from the cached compact brief (${sanitizedPayload.length} chars). For full session state, call \`memory_context({ mode: "resume", profile: "resume" })\`.`,
    },
  ];

  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Active Spec Folder',
      content: `Last active: ${state.lastSpecFolder}`,
    });
  }

  clearCompactPrime(sessionId, {
    cachedAt: pendingCompactPrime.cachedAt,
    opaqueId: pendingCompactPrime.opaqueId ?? null,
  });

  return sections;
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
  const sessionId = input?.session_id ?? input?.sessionId ?? '';

  try {
    let sections: OutputSection[];
    switch (source) {
      case 'resume':
        sections = handleResume(sessionId);
        break;
      case 'clear':
        sections = handleClear();
        break;
      case 'compact':
        sections = handleCompact(sessionId);
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
