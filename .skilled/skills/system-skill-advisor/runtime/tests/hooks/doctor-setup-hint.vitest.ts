// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor setup hint hook tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleClaudeUserPromptSubmit,
  type ClaudeUserPromptSubmitInput,
  type ClaudeUserPromptSubmitOutput,
} from '../../../hooks/claude/user-prompt-submit.js';
import {
  DIRECTIVE_LIFECYCLE_DEDUP_ENV,
  InMemoryDirectiveLifecycleStore,
} from '../../../hooks/lib/directive-lifecycle.js';
import { renderAdvisorBrief, renderAdvisorFallbackDirective } from '../../lib/render.js';
import type { AdvisorHookResult } from '../../lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, '..', 'legacy', 'advisor-fixtures');
const ORIGINAL_HOOK_DISABLED = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
const ORIGINAL_DIRECTIVE_DEDUP = process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
const ORIGINAL_ADVISOR_RUNTIME = process.env.SPECKIT_RUNTIME;

const EXPECTED_FALLBACK_DIRECTIVES = '\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
const EXPECTED_SETUP_HEAD = 'Advisor: no skill matched. For setup or health checks, run /doctor:setup.';
const EXPECTED_SETUP_CONTEXT = `${EXPECTED_SETUP_HEAD}${EXPECTED_FALLBACK_DIRECTIVES}`;
const EXPECTED_NO_MATCH_CONTEXT = `Advisor: no skill matched.${EXPECTED_FALLBACK_DIRECTIVES}`;

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function diagnosticsSink(): { records: string[]; writeDiagnostic: (line: string) => void } {
  const records: string[] = [];
  return {
    records,
    writeDiagnostic: (line: string) => records.push(line),
  };
}

async function runHook(input: ClaudeUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleClaudeUserPromptSubmit(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
    // Fresh in-memory dedup state per invocation keeps each case hermetic.
    directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
  });
  return { output, buildBrief, diagnostics };
}

function additionalContext(output: ClaudeUserPromptSubmitOutput): string {
  return 'hookSpecificOutput' in output ? output.hookSpecificOutput.additionalContext : '';
}

function promptInput(prompt: string, sessionId: string): ClaudeUserPromptSubmitInput {
  return {
    session_id: sessionId,
    hook_event_name: 'UserPromptSubmit',
    prompt,
    cwd: '/workspace/project',
  };
}

const NO_MATCH_RESULT: AdvisorHookResult = {
  ...fixture('livePassingSkill.json'),
  brief: null,
  recommendations: [],
};

afterEach(() => {
  if (ORIGINAL_HOOK_DISABLED === undefined) delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
  else process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = ORIGINAL_HOOK_DISABLED;
  if (ORIGINAL_DIRECTIVE_DEDUP === undefined) delete process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
  else process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = ORIGINAL_DIRECTIVE_DEDUP;
  if (ORIGINAL_ADVISOR_RUNTIME === undefined) delete process.env.SPECKIT_RUNTIME;
  else process.env.SPECKIT_RUNTIME = ORIGINAL_ADVISOR_RUNTIME;
});

describe('doctor setup hint on a no-match', () => {
  it('renders the setup hint when setup wording was seen', () => {
    const rendered = renderAdvisorFallbackDirective({ setupWording: true }, { status: 'ok', freshness: 'live' });

    expect(rendered).toBe(EXPECTED_SETUP_CONTEXT);
  });

  it('keeps the plain no-match head without setup wording and the outage text unchanged', () => {
    const plain = renderAdvisorFallbackDirective({}, { status: 'ok', freshness: 'live' });
    const outage = renderAdvisorFallbackDirective({ setupWording: true }, { status: 'fail_open', freshness: 'unavailable' });

    expect(plain).toBe(EXPECTED_NO_MATCH_CONTEXT);
    expect(outage).not.toContain('/doctor:setup');
  });

  it('adds the setup hint for a setup-shaped prompt with no match', async () => {
    const { output } = await runHook(promptInput('Help me set up skilled', 'setup-hint-set-up'), NO_MATCH_RESULT);

    expect(additionalContext(output)).toBe(EXPECTED_SETUP_CONTEXT);
  });

  it.each([
    { prompt: 'install the hooks', sessionId: 'setup-hint-install' },
    { prompt: 'check my environment variables', sessionId: 'setup-hint-check' },
    { prompt: 'configure the advisor', sessionId: 'setup-hint-configure' },
  ])('adds the setup hint for "$prompt"', async ({ prompt, sessionId }) => {
    const { output } = await runHook(promptInput(prompt, sessionId), NO_MATCH_RESULT);

    expect(additionalContext(output)).toContain('run /doctor:setup.');
  });

  it('keeps the plain no-match head for an unrelated prompt with no match', async () => {
    const { output } = await runHook(promptInput('what is the capital of France', 'setup-hint-unrelated'), NO_MATCH_RESULT);

    expect(additionalContext(output)).toBe(EXPECTED_NO_MATCH_CONTEXT);
  });

  it('appends the unchanged directive block after the setup hint head', async () => {
    const { output } = await runHook(promptInput('Help me set up skilled', 'setup-hint-directive-block'), NO_MATCH_RESULT);

    expect(additionalContext(output).slice(EXPECTED_SETUP_HEAD.length)).toBe(EXPECTED_FALLBACK_DIRECTIVES);
  });
});
