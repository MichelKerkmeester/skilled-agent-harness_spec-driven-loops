// ───────────────────────────────────────────────────────────────────
// MODULE: Claude User Prompt Submit Hook tests
// ───────────────────────────────────────────────────────────────────

import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_CLAUDE_HOOK_TIMEOUT_MS,
  commitClaudeDirectiveDeliveryReceipt,
  emitDiagnostic,
  flushPendingDiagnostics,
  handleClaudeUserPromptSubmit,
  parseClaudeUserPromptSubmitInput,
  type ClaudeUserPromptSubmitInput,
} from '../../../hooks/claude/user-prompt-submit.js';
import { DIRECTIVE_LIFECYCLE_DEDUP_ENV, InMemoryDirectiveLifecycleStore } from '../../../hooks/lib/directive-lifecycle.js';
import { normalizeRuntimeOutput } from '../../lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../../lib/render.js';
import { validateAdvisorHookDiagnosticRecord } from '../../lib/metrics.js';
import type { AdvisorHookResult } from '../../lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, '..', 'legacy', 'advisor-fixtures');
const ORIGINAL_HOOK_DISABLED = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
const ORIGINAL_DIRECTIVE_DEDUP = process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
const ORIGINAL_ADVISOR_RUNTIME = process.env.SPECKIT_RUNTIME;
let lifecycleTranscriptDir = '';
const EXPECTED_ADVISOR_CONTEXT = 'Advisor: live; use sk-code 0.91/0.23 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
const EXPECTED_FALLBACK_DIRECTIVES = '\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
const EXPECTED_NO_MATCH_CONTEXT = `Advisor: no skill matched.${EXPECTED_FALLBACK_DIRECTIVES}`;
const EXPECTED_SKIPPED_CONTEXT = `Advisor: prompt skipped.${EXPECTED_FALLBACK_DIRECTIVES}`;

function expectedOutageContext(status: 'fail_open' | 'degraded' | 'absent'): string {
  return `Advisor: outage (${status}); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json${EXPECTED_FALLBACK_DIRECTIVES}`;
}

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

function parseDiagnostic(line: string): Record<string, unknown> {
  return JSON.parse(line) as Record<string, unknown>;
}

async function runHook(input: ClaudeUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleClaudeUserPromptSubmit(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
    // Fresh in-memory dedup state per invocation keeps the existing suite
    // hermetic; lifecycle-specific cases below share one store explicitly.
    directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
  });
  return { output, buildBrief, diagnostics };
}

async function runHookWithStore(
  input: ClaudeUserPromptSubmitInput,
  result: AdvisorHookResult,
  store: InMemoryDirectiveLifecycleStore,
  deferDirectiveReceipt = false,
) {
  const diagnostics = diagnosticsSink();
  const buildCliBrief = vi.fn(async () => result);
  let effectiveInput = input;
  if (input.transcript_path === undefined) {
    lifecycleTranscriptDir ||= mkdtempSync(join(tmpdir(), 'dl-shared-transcript-'));
    const transcriptPath = join(lifecycleTranscriptDir, 'session.jsonl');
    appendFileSync(transcriptPath, 'x');
    effectiveInput = { ...input, transcript_path: transcriptPath };
  }
  const output = await handleClaudeUserPromptSubmit(effectiveInput, {
    buildCliBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
    directiveLifecycleStore: store,
    deferDirectiveReceipt,
  });
  return { output, buildCliBrief, diagnostics };
}

afterEach(() => {
  if (lifecycleTranscriptDir) rmSync(lifecycleTranscriptDir, { recursive: true, force: true });
  lifecycleTranscriptDir = '';
  if (ORIGINAL_HOOK_DISABLED === undefined) delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
  else process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = ORIGINAL_HOOK_DISABLED;
  if (ORIGINAL_DIRECTIVE_DEDUP === undefined) delete process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV];
  else process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = ORIGINAL_DIRECTIVE_DEDUP;
  if (ORIGINAL_ADVISOR_RUNTIME === undefined) delete process.env.SPECKIT_RUNTIME;
  else process.env.SPECKIT_RUNTIME = ORIGINAL_ADVISOR_RUNTIME;
});

describe('Claude UserPromptSubmit advisor hook', () => {
  it('AS1 emits hookSpecificOutput.additionalContext for a work-intent prompt', async () => {
    const { output, buildBrief, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: EXPECTED_ADVISOR_CONTEXT,
      },
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'claude',
      workspaceRoot: '/workspace/project',
      subprocessTimeoutMs: DEFAULT_CLAUDE_HOOK_TIMEOUT_MS,
    });
    expect(diagnostics.records).toHaveLength(1);
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('claude');
    expect(diagnostic.status).toBe('ok');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it.each(['/help', 'thanks'])('skips %s before calling the CLI producer', async (prompt) => {
    const diagnostics = diagnosticsSink();
    const buildCliBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    await handleClaudeUserPromptSubmit({
      session_id: 'prompt-policy-session',
      hook_event_name: 'UserPromptSubmit',
      prompt,
      cwd: '/workspace/project',
    }, {
      buildCliBrief,
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
    });

    expect(parseDiagnostic(diagnostics.records[0] ?? '{}').status).toBe('skipped');
    expect(buildCliBrief).not.toHaveBeenCalled();
  });

  it('calls the CLI producer for a routable prompt', async () => {
    const diagnostics = diagnosticsSink();
    const buildCliBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    await handleClaudeUserPromptSubmit({
      session_id: 'prompt-policy-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement the metrics trim in typescript',
      cwd: '/workspace/project',
    }, {
      buildCliBrief,
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
    });

    expect(parseDiagnostic(diagnostics.records[0] ?? '{}').status).toBe('ok');
    expect(buildCliBrief).toHaveBeenCalledOnce();
  });

  it.each([
    { name: 'defaults to Claude', expectedRuntime: 'claude' },
    { name: 'uses an in-process runtime', expectedRuntime: 'pi', runtime: 'pi' as const },
    { name: 'uses a recognized environment runtime', expectedRuntime: 'codex', environmentRuntime: 'codex' },
    { name: 'falls back for an unknown environment runtime', expectedRuntime: 'claude', environmentRuntime: 'not-a-runtime' },
  ])('records runtime and delivered bytes: $name', async ({ expectedRuntime, runtime, environmentRuntime }) => {
    if (environmentRuntime === undefined) delete process.env.SPECKIT_RUNTIME;
    else process.env.SPECKIT_RUNTIME = environmentRuntime;

    const diagnosticLines: string[] = [];
    const writeDiagnostic = vi.fn((line: string) => diagnosticLines.push(line));
    const result = fixture('livePassingSkill.json');
    const buildBrief = vi.fn(async () => result);
    const dependencies = {
      buildBrief,
      renderBrief: renderAdvisorBrief,
      writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
      ...(runtime === undefined ? {} : { runtime }),
    };
    const output = await handleClaudeUserPromptSubmit({
      session_id: 'runtime-diagnostic-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, dependencies);

    expect('hookSpecificOutput' in output).toBe(true);
    const additionalContext = 'hookSpecificOutput' in output
      ? output.hookSpecificOutput.additionalContext
      : '';
    const diagnostic = parseDiagnostic(diagnosticLines[0] ?? '{}');
    expect(buildBrief).toHaveBeenCalledOnce();
    expect(writeDiagnostic).toHaveBeenCalledOnce();
    expect(diagnostic.runtime).toBe(expectedRuntime);
    expect(diagnostic.emittedBytes).toBe(Buffer.byteLength(additionalContext, 'utf8'));
  });

  it('AS2 emits the skipped fallback head for an empty prompt skipped by the producer', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: '',
      cwd: '/workspace/project',
    }, fixture('skipPolicyEmptyPrompt.json'));

    expect(output).toEqual({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_SKIPPED_CONTEXT } });
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('AS3 emits the skipped fallback head for /help skipped by the producer', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skipPolicyCommandOnly.json'));

    expect(output).toEqual({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_SKIPPED_CONTEXT } });
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('renders no-match and skipped heads before the fallback directives', async () => {
    const noMatchResult: AdvisorHookResult = {
      ...fixture('livePassingSkill.json'),
      brief: null,
      recommendations: [],
    };
    const noMatch = await runHookWithStore({
      session_id: 'no-match-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, noMatchResult, new InMemoryDirectiveLifecycleStore());
    const skipped = await runHookWithStore({
      session_id: 'skipped-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('skipPolicyCommandOnly.json'), new InMemoryDirectiveLifecycleStore());

    expect(noMatch.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_NO_MATCH_CONTEXT },
    });
    expect(skipped.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_SKIPPED_CONTEXT },
    });
  });

  it.each([
    {
      name: 'a live skipped result with no recommendations',
      result: {
        ...fixture('livePassingSkill.json'),
        status: 'skipped' as const,
        freshness: 'live' as const,
        brief: null,
        recommendations: [],
      },
      expectedContext: EXPECTED_NO_MATCH_CONTEXT,
    },
    {
      name: 'an absent skill graph',
      result: {
        ...fixture('livePassingSkill.json'),
        status: 'skipped' as const,
        freshness: 'absent' as const,
        brief: null,
        recommendations: [],
      },
      expectedContext: expectedOutageContext('absent'),
    },
    {
      name: 'a stale degraded result with no recommendations',
      result: {
        ...fixture('livePassingSkill.json'),
        status: 'degraded' as const,
        freshness: 'stale' as const,
        brief: null,
        recommendations: [],
      },
      expectedContext: EXPECTED_NO_MATCH_CONTEXT,
    },
  ])('classifies $name by status and freshness', async ({ name, result, expectedContext }) => {
    const { output } = await runHook({
      session_id: `fallback-${name}`,
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result);

    expect(output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedContext },
    });
  });

  it.each([
    {
      name: 'no-match',
      result: { ...fixture('livePassingSkill.json'), brief: null, recommendations: [] },
      expectedHead: 'Advisor: no skill matched.',
      maxLength: 40,
    },
    {
      name: 'skipped',
      result: fixture('skipPolicyCommandOnly.json'),
      expectedHead: 'Advisor: prompt skipped.',
      maxLength: 40,
    },
    {
      name: 'fail_open outage',
      result: fixture('failOpenTimeout.json'),
      expectedHead: expectedOutageContext('fail_open').split('\n', 1)[0] ?? '',
      maxLength: 160,
    },
    {
      name: 'degraded outage',
      result: {
        ...fixture('failOpenTimeout.json'),
        status: 'degraded' as const,
        freshness: 'unavailable' as const,
      },
      expectedHead: expectedOutageContext('degraded').split('\n', 1)[0] ?? '',
      maxLength: 160,
    },
  ])('keeps the $name head within its length cap', async ({ name, result, expectedHead, maxLength }) => {
    const { output } = await runHookWithStore({
      session_id: `head-length-${name}`,
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result, new InMemoryDirectiveLifecycleStore());
    const context = 'hookSpecificOutput' in output
      ? output.hookSpecificOutput.additionalContext
      : '';
    const head = context.split('\n', 1)[0] ?? '';

    expect(head, name).toBe(expectedHead);
    expect(head.length, name).toBeLessThan(maxLength);
  });

  it('AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    const output = await handleClaudeUserPromptSubmit({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(output).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
    expect(validateAdvisorHookDiagnosticRecord(parseDiagnostic(diagnostics.records[0] ?? '{}'))).toBe(true);
  });

  it('AS5 emits {} for invalid JSON stdin without throwing', async () => {
    const diagnostics = diagnosticsSink();
    const input = parseClaudeUserPromptSubmitInput('{not-json');

    const output = await handleClaudeUserPromptSubmit(input, {
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(input).toBeNull();
    expect(output).toEqual({});
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('PARSE_FAIL');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
  });

  it('AS6 emits the outage fallback for producer timeout/fail-open without a block decision', async () => {
    const result = fixture('failOpenTimeout.json');
    result.diagnostics = {
      errorCode: 'TIMEOUT',
      errorClass: 'timeout',
      errorMessage: 'timed out after 1000ms\nsee logs',
    };
    const { output, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result);

    const additionalContext = 'hookSpecificOutput' in output
      ? output.hookSpecificOutput.additionalContext
      : '';
    expect(additionalContext).toBe(expectedOutageContext('fail_open'));
    expect(additionalContext.split('\n', 1)[0]).toMatch(/^Advisor: outage \(fail_open\)/);
    expect(additionalContext).toContain('skill-advisor.cjs advisor_recommend');
    expect(additionalContext.endsWith(EXPECTED_FALLBACK_DIRECTIVES)).toBe(true);
    expect(JSON.stringify(output)).not.toMatch(/"decision"\s*:\s*"(block|deny)"/);
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('TIMEOUT');
    expect(diagnostic.errorDetails).toBe('timed out after 1000ms see logs');
  });

  it('emits full fallback context when Python is unavailable', async () => {
    const result = fixture('failOpenTimeout.json');
    result.diagnostics = { errorCode: 'PYTHON_MISSING' };
    const { output, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result);

    expect(output).toEqual({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedOutageContext('fail_open') } });
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('PYTHON_MISSING');
  });

  it('keeps adapter cache-hit p95 under 60 ms with cached producer output', async () => {
    const result = fixture('livePassingSkill.json');
    result.metrics = {
      ...result.metrics,
      cacheHit: true,
      durationMs: 1,
    };
    const buildBrief = vi.fn(async () => result);
    const durations: number[] = [];

    for (let index = 0; index < 30; index += 1) {
      const diagnostics = diagnosticsSink();
      const startedAt = performance.now();
      const output = await handleClaudeUserPromptSubmit({
        session_id: `s-${index}`,
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }, {
        buildBrief,
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: diagnostics.writeDiagnostic,
        directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
      });
      durations.push(performance.now() - startedAt);
      expect(output).toHaveProperty('hookSpecificOutput');
    }

    const sorted = [...durations].sort((left, right) => left - right);
    const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
    expect(p95).toBeLessThanOrEqual(60);
  });

  it('T014 normalizes Claude JSON additionalContext via the 005 comparator', async () => {
    const { output } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(normalizeRuntimeOutput('claude', output)).toEqual({
      runtime: 'claude',
      transport: 'json_additional_context',
      additionalContext: EXPECTED_ADVISOR_CONTEXT,
      stderrVisible: false,
    });
  });

  it('swallows async diagnostic persistence failures', async () => {
    const unhandled: unknown[] = [];
    const listener = (reason: unknown) => unhandled.push(reason);
    process.on('unhandledRejection', listener);
    try {
      emitDiagnostic({
        workspaceRoot: '/workspace/project',
        status: 'ok',
        freshness: 'live',
        durationMs: 1,
        cacheHit: false,
      }, () => undefined, async () => {
        throw new Error('durable write failed');
      });
      await new Promise((resolve) => setImmediate(resolve));
      expect(unhandled).toEqual([]);
    } finally {
      process.off('unhandledRejection', listener);
    }
  });

  it('flushes pending diagnostic persistence before resolving', async () => {
    let writeComplete = false;
    const persistDiagnostic = vi.fn(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 20));
      writeComplete = true;
    });

    emitDiagnostic({
      workspaceRoot: '/workspace/project',
      status: 'ok',
      freshness: 'live',
      durationMs: 1,
      cacheHit: false,
    }, () => undefined, persistDiagnostic);

    await flushPendingDiagnostics();

    expect(persistDiagnostic).toHaveBeenCalledOnce();
    expect(writeComplete).toBe(true);
  });

  it('bounds the wait for pending diagnostic persistence', async () => {
    const persistDiagnostic = vi.fn(() => new Promise<void>(() => undefined));
    emitDiagnostic({
      workspaceRoot: '/workspace/project',
      status: 'ok',
      freshness: 'live',
      durationMs: 1,
      cacheHit: false,
    }, () => undefined, persistDiagnostic);

    const startedAt = performance.now();
    await flushPendingDiagnostics(50);

    expect(persistDiagnostic).toHaveBeenCalledOnce();
    expect(performance.now() - startedAt).toBeLessThan(200);
  });

  it('DL1 keeps the full brief on the first message and drops only the directive block on a same-content repeat', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    const first = await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);
    const second = await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook again',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);

    expect(first.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
    expect(second.output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'Advisor: live; use sk-code 0.91/0.23 pass.',
      },
    });
  });

  it('commits full-delivery receipts only after the output handoff', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    const first = await runHookWithStore({
      session_id: 'receipt-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true);
    const beforeCommit = await runHookWithStore({
      session_id: 'receipt-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'repeat before receipt commit',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true);
    expect(first.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
    expect(beforeCommit.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
    expect(commitClaudeDirectiveDeliveryReceipt(first.output)).toBe(true);
    const afterCommit = await runHookWithStore({
      session_id: 'receipt-session',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'repeat after receipt commit',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true);
    expect(afterCommit.output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'Advisor: live; use sk-code 0.91/0.23 pass.',
      },
    });
  });

  it('DL2 re-delivers the full brief after a lifecycle boundary (compact)', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);
    const afterCompact = await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      lifecycle_event: 'compact',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);

    expect(afterCompact.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
    // The boundary turn re-arms: the next identical turn is suppressible again.
    const repeat = await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);
    expect(repeat.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: 'Advisor: live; use sk-code 0.91/0.23 pass.' },
    });
  });

  it('DL3 never suppresses without a confirmed session id', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    const first = await runHookWithStore({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);
    const second = await runHookWithStore({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);

    expect(first.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
    expect(second.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
  });

  it('DL4 kill-switch reverts to always-full delivery', async () => {
    process.env[DIRECTIVE_LIFECYCLE_DEDUP_ENV] = '0';
    const store = new InMemoryDirectiveLifecycleStore();
    await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);
    const second = await runHookWithStore({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store);

    expect(second.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
    });
  });

  it('DL5 keeps the fallback head on repeats only for a known session', async () => {
    const result = fixture('failOpenTimeout.json');
    result.diagnostics = { errorCode: 'TIMEOUT' };
    const expectedFullContext = expectedOutageContext('fail_open');
    const expectedHead = expectedFullContext.split('\n', 1)[0] ?? '';
    const knownStore = new InMemoryDirectiveLifecycleStore();
    const knownSessionContexts: string[] = [];

    for (let turn = 0; turn < 5; turn += 1) {
      const { output } = await runHookWithStore({
        session_id: 's1',
        hook_event_name: 'UserPromptSubmit',
        prompt: `implement a TypeScript hook ${turn}`,
        cwd: '/workspace/project',
      }, result, knownStore);
      knownSessionContexts.push('hookSpecificOutput' in output
        ? output.hookSpecificOutput.additionalContext
        : '');
    }

    expect(knownSessionContexts[0]).toBe(expectedFullContext);
    expect(knownSessionContexts.slice(1)).toEqual(Array(4).fill(expectedHead));
    expect(knownSessionContexts.slice(1).every((context) => !context.includes('Directives:'))).toBe(true);

    const unknownStore = new InMemoryDirectiveLifecycleStore();
    const unknownSessionContexts: string[] = [];
    for (let turn = 0; turn < 5; turn += 1) {
      const { output } = await runHookWithStore({
        hook_event_name: 'UserPromptSubmit',
        prompt: `implement a TypeScript hook ${turn}`,
        cwd: '/workspace/project',
      }, result, unknownStore);
      unknownSessionContexts.push('hookSpecificOutput' in output
        ? output.hookSpecificOutput.additionalContext
        : '');
    }

    expect(unknownSessionContexts).toEqual(Array(5).fill(expectedFullContext));
  });

  it('DL6 re-delivers the full brief when the transcript shrank (compaction signature)', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'dl-transcript-'));
    const transcriptPath = join(dir, 'session.jsonl');
    writeFileSync(transcriptPath, 'x'.repeat(4096));
    try {
      const store = new InMemoryDirectiveLifecycleStore();
      await runHookWithStore({
        session_id: 's1',
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
        transcript_path: transcriptPath,
      }, fixture('livePassingSkill.json'), store);
      // Simulate compaction: the transcript is rewritten much smaller, with no
      // lifecycle_event field — the shrink itself must re-arm full delivery.
      writeFileSync(transcriptPath, 'x'.repeat(512));
      const afterShrink = await runHookWithStore({
        session_id: 's1',
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
        transcript_path: transcriptPath,
      }, fixture('livePassingSkill.json'), store);

      expect(afterShrink.output).toEqual({
        hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_ADVISOR_CONTEXT },
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
