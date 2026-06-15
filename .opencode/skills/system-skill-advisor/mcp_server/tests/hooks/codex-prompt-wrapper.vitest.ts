// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Prompt Wrapper tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  createCodexWrappedPrompt,
  handleCodexPromptWrapper,
} from '../../../hooks/codex/prompt-wrapper.js';
import { normalizeRuntimeOutput } from '../../lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../../lib/render.js';
import type { AdvisorHookResult } from '../../lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, '..', 'legacy', 'advisor-fixtures');
const EXPECTED_ADVISOR_CONTEXT = 'Advisor: live; use sk-code 0.91/0.23 pass.\nComment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.\nFable-5 governor: reason about the problem and the person, not yourself; lead with the result and act rather than narrate (batch tool calls, report at checkpoints); treat reversible decisions as cheap — decide, mark // DECISION:, move on; qualify only when it changes what the reader should do.';

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function unavailablePolicy() {
  return {
    hooks: 'unavailable' as const,
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: {
      probeDurationMs: 1,
      reason: 'fixture',
    },
  };
}

function livePolicy() {
  return {
    hooks: 'live' as const,
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: {
      probeDurationMs: 1,
    },
  };
}

describe('Codex prompt-wrapper fallback', () => {
  it('wraps outgoing prompt only when hook policy is unavailable', async () => {
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const output = await handleCodexPromptWrapper({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      renderBrief: renderAdvisorBrief,
      detectPolicy: unavailablePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({
      promptWrapper: EXPECTED_ADVISOR_CONTEXT,
      wrappedPrompt: `<!-- advisor brief: ${EXPECTED_ADVISOR_CONTEXT} -->\nimplement a TypeScript hook`,
    });
    expect(normalizeRuntimeOutput('codex', output)).toEqual({
      runtime: 'codex',
      transport: 'prompt_wrapper',
      additionalContext: EXPECTED_ADVISOR_CONTEXT,
      stderrVisible: false,
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'codex',
      workspaceRoot: '/workspace/project',
      subprocessTimeoutMs: 3000,
    });
  });

  it('does not wrap when native Codex hooks are live', async () => {
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const output = await handleCodexPromptWrapper({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      detectPolicy: livePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
  });

  it('does not modify prompt when no brief is rendered', async () => {
    const output = await handleCodexPromptWrapper({
      prompt: '/help',
      cwd: '/workspace/project',
    }, {
      buildBrief: vi.fn(async () => fixture('skippedShortCasual.json')),
      renderBrief: renderAdvisorBrief,
      detectPolicy: unavailablePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({});
  });

  it('uses the markdown-comment preamble format', () => {
    expect(createCodexWrappedPrompt('hello', 'Advisor: live; use sk-code 0.91/0.23 pass.'))
      .toBe('<!-- advisor brief: Advisor: live; use sk-code 0.91/0.23 pass. -->\nhello');
  });
});
