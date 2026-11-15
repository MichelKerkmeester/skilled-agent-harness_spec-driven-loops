#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// Devin injects UserPromptSubmit context, so this adapter forwards the advisor's
// additional context on the operator's next turn.

import {
  emitDevinContext,
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
  type DevinHookInput,
} from './shared.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ADVISOR_ADAPTER = 'user-prompt-submit.js';
const ADVISOR_TIMEOUT_MS = 2_800;

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Test seams; production callers take the defaults. */
interface UserPromptSubmitDeps {
  readonly runAdvisor?: (input: DevinHookInput) => string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. ADVISOR CONTEXT
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The one field this adapter forwards from the advisor's hook response. */
function readAdvisorContext(rawOutput: string | null): string | null {
  if (!rawOutput) return null;
  try {
    const parsed: unknown = JSON.parse(rawOutput);
    if (!isRecord(parsed) || !isRecord(parsed.hookSpecificOutput)) return null;
    const context = parsed.hookSpecificOutput.additionalContext;
    return typeof context === 'string' && context.trim() ? context : null;
  } catch {
    // Invalid child output is a silent fail-open path.
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. OUTPUT COMPOSITION
// ───────────────────────────────────────────────────────────────────

/** The advisor context is the one section this adapter emits. */
export async function composeUserPromptContext(
  input: DevinHookInput,
  deps: UserPromptSubmitDeps = {},
): Promise<string | null> {
  const runAdvisor = deps.runAdvisor
    ?? ((value: DevinHookInput) => runClaudeHookAdapter(ADVISOR_ADAPTER, value, ADVISOR_TIMEOUT_MS));
  return readAdvisorContext(runAdvisor(input));
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const input = await readDevinHookInput('UserPromptSubmit', ['prompt']);
  if (!input) return;

  emitDevinContext('UserPromptSubmit', await composeUserPromptContext(input));
}

runDevinHook(import.meta.url, main);
