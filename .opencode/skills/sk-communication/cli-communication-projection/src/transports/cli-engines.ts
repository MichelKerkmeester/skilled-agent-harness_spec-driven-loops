// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Engine Command Table
// ───────────────────────────────────────────────────────────────────

import type { CliCommandResolver } from './cli.js';

/**
 * The six external CLI skills selectable as external-cli engines. Each value is
 * the engine segment of the `external-cli-<engine>` provider id.
 */
export const CliEngineIds = {
  CLAUDE_CODE: 'claude-code',
  CODEX: 'codex',
  CURSOR: 'cursor',
  DEVIN: 'devin',
  OPENCODE: 'opencode',
  PI: 'pi',
} as const;

/** One selectable external-cli engine. */
export type CliEngineId = typeof CliEngineIds[keyof typeof CliEngineIds];

/** Child-dispatch marker every cli-* skill honors for non-interactive runs. */
const CHILD_DISPATCH_ENV: Readonly<Record<string, string>> = { AI_SESSION_CHILD: '1' };

/** Child-dispatch marker plus the spec-gate release the gated skills require. */
const GATE_FREE_CHILD_ENV: Readonly<Record<string, string>> = {
  MK_SPEC_GATE_ENFORCE: '0',
  AI_SESSION_CHILD: '1',
};

/**
 * Map a selectable engine to the non-interactive one-shot dispatch command its
 * cli-external-orchestration skill documents. Each command requests a single
 * plain-text rewrite with no write access, receives the prompt as the trailing
 * argument, and relies on a closed stdin — the only invocation shape opencode
 * tolerates without hanging. The argv is sourced from each skill's SKILL.md and
 * is verified against that documentation rather than a live binary, so an engine
 * whose output does not match fails closed to the exact original through the
 * shared fidelity validation rather than displaying a malformed rewrite.
 */
export const resolveCliEngineCommand: CliCommandResolver = (engine, model) => {
  if (!isCliEngineId(engine)) {
    return null;
  }
  switch (engine) {
    case CliEngineIds.CLAUDE_CODE:
      return {
        command: 'claude',
        args: ['-p', '--model', model, '--output-format', 'text'],
        input: 'prompt-arg',
        env: GATE_FREE_CHILD_ENV,
      };
    case CliEngineIds.CODEX:
      return {
        command: 'codex',
        args: ['exec', '--model', model, '-c', 'approval_policy=never', '--sandbox', 'read-only'],
        input: 'prompt-arg',
        env: CHILD_DISPATCH_ENV,
      };
    case CliEngineIds.CURSOR:
      return {
        command: 'cursor-agent',
        args: ['-p', '--output-format', 'text', '--model', model],
        input: 'prompt-arg',
        env: CHILD_DISPATCH_ENV,
      };
    case CliEngineIds.DEVIN:
      return {
        command: 'devin',
        args: ['-p', '--model', model, '--permission-mode', 'auto', '--'],
        input: 'prompt-arg',
        env: CHILD_DISPATCH_ENV,
      };
    case CliEngineIds.OPENCODE:
      return {
        command: 'opencode',
        args: ['run', '--model', model],
        input: 'prompt-arg',
        env: GATE_FREE_CHILD_ENV,
      };
    case CliEngineIds.PI:
      return {
        command: 'pi',
        args: ['-p', '--offline', '--provider', providerOf(model), '--model', model],
        input: 'prompt-arg',
        env: CHILD_DISPATCH_ENV,
      };
  }
};

function isCliEngineId(value: string): value is CliEngineId {
  return value === CliEngineIds.CLAUDE_CODE
    || value === CliEngineIds.CODEX
    || value === CliEngineIds.CURSOR
    || value === CliEngineIds.DEVIN
    || value === CliEngineIds.OPENCODE
    || value === CliEngineIds.PI;
}

/** Derive pi's provider from a `provider/model` id, defaulting to google. */
function providerOf(model: string): string {
  const slash = model.indexOf('/');
  return slash > 0 ? model.slice(0, slash) : 'google';
}
