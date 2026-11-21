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
import { InMemoryRouteReceiptStore, type RouteReceiptStore } from '../../../hooks/lib/route-receipt.js';
import { normalizeRuntimeOutput } from '../../lib/normalize-adapter-output.js';
import { clearPolicyObservationSink, getPolicyObservationRecords } from '../../lib/policy-plan.js';
import { renderAdvisorBrief } from '../../lib/render.js';
import { validateAdvisorHookDiagnosticRecord } from '../../lib/metrics.js';
import type { AdvisorHookResult } from '../../lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, '..', 'legacy', 'advisor-fixtures');
const ORIGINAL_HOOK_DISABLED = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
const ORIGINAL_SYSTEM_HOOK_DISABLED = process.env.SYSTEM_SKILL_ADVISOR_DISABLED;
const ORIGINAL_HOOK_FLAGS_CONFIG = process.env.HOOK_FLAGS_CONFIG;
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

const throwingRender: typeof renderAdvisorBrief = () => {
  throw new Error('render failed');
};

const throwingClock = (): number => {
  throw new Error('clock');
};

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
  renderBrief: typeof renderAdvisorBrief = renderAdvisorBrief,
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
    renderBrief,
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
  if (ORIGINAL_SYSTEM_HOOK_DISABLED === undefined) delete process.env.SYSTEM_SKILL_ADVISOR_DISABLED;
  else process.env.SYSTEM_SKILL_ADVISOR_DISABLED = ORIGINAL_SYSTEM_HOOK_DISABLED;
  if (ORIGINAL_HOOK_FLAGS_CONFIG === undefined) delete process.env.HOOK_FLAGS_CONFIG;
  else process.env.HOOK_FLAGS_CONFIG = ORIGINAL_HOOK_FLAGS_CONFIG;
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

  it.each([
    { runtime: 'claude' as const, label: 'Claude Code' },
    { runtime: 'pi' as const, label: 'pi' },
    { runtime: 'dsh' as const, label: 'dsh' },
    { runtime: 'vibe' as const, label: 'vibe' },
    { environmentRuntime: 'codex', label: 'codex' },
  ])('labels a recorded policy observation for $label', async ({ label, runtime, environmentRuntime }) => {
    if (environmentRuntime === undefined) delete process.env.SPECKIT_RUNTIME;
    else process.env.SPECKIT_RUNTIME = environmentRuntime;

    clearPolicyObservationSink();
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const dependencies = {
      buildBrief,
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
      ...(runtime === undefined ? {} : { runtime }),
    };
    // A startup event gives the shadow session its epoch, without which the
    // sink holds no record to read a label from.
    await handleClaudeUserPromptSubmit({
      session_id: `policy-label-${label}`,
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
      lifecycle_event: 'startup',
    }, dependencies);

    const records = getPolicyObservationRecords();
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) => record.binding.runtime === label)).toBe(true);
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

  it('AS4b honors SYSTEM_SKILL_ADVISOR_DISABLED=1 through the repo hook resolver without calling the producer', async () => {
    process.env.SYSTEM_SKILL_ADVISOR_DISABLED = '1';
    process.env.HOOK_FLAGS_CONFIG = '/dev/null';
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

  it('emits the outage fallback when the hook itself throws while rendering', async () => {
    const diagnostics = diagnosticsSink();
    const buildCliBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const renderBrief = vi.fn(() => {
      throw new Error('render failed');
    });
    const output = await handleClaudeUserPromptSubmit({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildCliBrief,
      renderBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
    });

    expect(renderBrief).toHaveBeenCalledOnce();
    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: expectedOutageContext('fail_open'),
      },
    });
    const diagnostic = parseDiagnostic(diagnostics.records.at(-1) ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('UNKNOWN');
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

  it('keeps the setup hint when the hook throws on a setup prompt', async () => {
    const setupPrompt = 'set up the hooks and install the toolchain';
    const timeoutPath = await runHookWithStore({
      session_id: 'setup-timeout',
      hook_event_name: 'UserPromptSubmit',
      prompt: setupPrompt,
      cwd: '/workspace/project',
    }, fixture('failOpenTimeout.json'), new InMemoryDirectiveLifecycleStore());
    const crashPath = await runHookWithStore({
      session_id: 'setup-crash',
      hook_event_name: 'UserPromptSubmit',
      prompt: setupPrompt,
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), new InMemoryDirectiveLifecycleStore(), false, throwingRender);

    expect(JSON.stringify(timeoutPath.output)).toContain('/doctor:setup');
    expect(crashPath.output).toEqual(timeoutPath.output);
  });

  it('keeps the skipped fallback when the hook throws on a skipped prompt', async () => {
    const { output } = await runHookWithStore({
      session_id: 'skip-crash',
      hook_event_name: 'UserPromptSubmit',
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), new InMemoryDirectiveLifecycleStore(), false, throwingRender);

    expect(output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: EXPECTED_SKIPPED_CONTEXT },
    });
  });

  it('drops the repeated directive block on a second crashing turn', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    const expectedFullContext = expectedOutageContext('fail_open');
    const expectedHead = expectedFullContext.split('\n', 1)[0] ?? '';
    const first = await runHookWithStore({
      session_id: 'crash-dl',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, false, throwingRender);
    const second = await runHookWithStore({
      session_id: 'crash-dl',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook again',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, false, throwingRender);

    expect(first.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedFullContext },
    });
    expect(second.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedHead },
    });
  });

  it('commits the crash fallback receipt only after the output handoff', async () => {
    const store = new InMemoryDirectiveLifecycleStore();
    const expectedFullContext = expectedOutageContext('fail_open');
    const expectedHead = expectedFullContext.split('\n', 1)[0] ?? '';
    const first = await runHookWithStore({
      session_id: 'crash-receipt',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true, throwingRender);
    const beforeCommit = await runHookWithStore({
      session_id: 'crash-receipt',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'repeat before receipt commit',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true, throwingRender);
    expect(first.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedFullContext },
    });
    expect(beforeCommit.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedFullContext },
    });
    expect(commitClaudeDirectiveDeliveryReceipt(first.output)).toBe(true);
    const afterCommit = await runHookWithStore({
      session_id: 'crash-receipt',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'repeat after receipt commit',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), store, true, throwingRender);
    expect(afterCommit.output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedHead },
    });
  });

  it('keeps the full crash fallback when the dedup store throws', async () => {
    const throwingStore = {
      clock: () => {
        throw new Error('store failed');
      },
    } as unknown as InMemoryDirectiveLifecycleStore;
    const { output } = await runHookWithStore({
      session_id: 'crash-store',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'), throwingStore, false, throwingRender);

    expect(output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedOutageContext('fail_open') },
    });
  });

  it('records the crash fallback policy once under the runtime', async () => {
    // A startup event gives each shadow session its epoch, without which the
    // sink holds no record to count.
    const turn = (sessionId: string) => ({
      session_id: sessionId,
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
      lifecycle_event: 'startup',
    });

    clearPolicyObservationSink();
    await handleClaudeUserPromptSubmit(turn('crash-policy'), {
      runtime: 'pi',
      buildCliBrief: vi.fn(async () => fixture('livePassingSkill.json')),
      renderBrief: throwingRender,
      writeDiagnostic: diagnosticsSink().writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
    });
    const crashRecords = getPolicyObservationRecords();

    clearPolicyObservationSink();
    await handleClaudeUserPromptSubmit(turn('timeout-policy'), {
      runtime: 'pi',
      buildCliBrief: vi.fn(async () => fixture('failOpenTimeout.json')),
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnosticsSink().writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
    });
    const timeoutRecords = getPolicyObservationRecords();

    expect(crashRecords.length).toBeGreaterThan(0);
    expect(crashRecords.length).toBe(timeoutRecords.length);
    expect(crashRecords.every((record) => record.binding.runtime === 'pi')).toBe(true);
  });

  it('returns the outage fallback when the clock throws', async () => {
    const output = await handleClaudeUserPromptSubmit({
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildCliBrief: vi.fn(async () => fixture('livePassingSkill.json')),
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnosticsSink().writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
      now: throwingClock,
    });

    expect(output).toEqual({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedOutageContext('fail_open') },
    });
  });

  it('keeps a disabled hook and an invalid payload silent when the clock throws', async () => {
    const dependencies = {
      buildCliBrief: vi.fn(async () => fixture('livePassingSkill.json')),
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnosticsSink().writeDiagnostic,
      directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
      now: throwingClock,
    };

    expect(await handleClaudeUserPromptSubmit(null, dependencies)).toEqual({});
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    expect(await handleClaudeUserPromptSubmit({
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, dependencies)).toEqual({});
    expect(dependencies.buildCliBrief).not.toHaveBeenCalled();
  });

  it('returns the outage fallback when the clock and the working directory both throw', async () => {
    const cwd = vi.spyOn(process, 'cwd').mockImplementation(() => {
      throw new Error('cwd');
    });
    try {
      const output = await handleClaudeUserPromptSubmit({
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }, {
        buildCliBrief: vi.fn(async () => fixture('livePassingSkill.json')),
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: diagnosticsSink().writeDiagnostic,
        directiveLifecycleStore: new InMemoryDirectiveLifecycleStore(),
        now: throwingClock,
      });

      expect(output).toEqual({
        hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: expectedOutageContext('fail_open') },
      });
    } finally {
      cwd.mockRestore();
    }
  });

  describe('route receipts', () => {
    const README_TASK = 'Update the advisor README to document the new corpus file layout';
    const REFACTOR_TASK = 'Refactor the session store module to remove duplicated locking code';
    const PASTED_FIX_THAT_TOO = 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: fix that too';
    // What the floored follow-up shows with no receipt, the same text the hook showed before receipts existed.
    const UNGUARDED_FOLLOW_UP_CONTEXT = EXPECTED_ADVISOR_CONTEXT.replace('0.91/0.23', '0.82/0.20');

    // A live result whose top route is the given skill, floored or confident,
    // in the shape the CLI fallback hands the hook.
    function routedResult(skill: string, confidence: number, floored: boolean): AdvisorHookResult {
      return {
        ...fixture('livePassingSkill.json'),
        recommendations: [{
          skill,
          confidence,
          uncertainty: 0.2,
          passes_threshold: true,
          ...(floored ? { confidenceFloored: true as const } : {}),
        }],
      };
    }

    function freshStores(): { lifecycle: InMemoryDirectiveLifecycleStore; receipts: RouteReceiptStore } {
      return { lifecycle: new InMemoryDirectiveLifecycleStore(), receipts: new InMemoryRouteReceiptStore() };
    }

    async function receiptTurn(
      prompt: string,
      result: AdvisorHookResult,
      stores: { lifecycle: InMemoryDirectiveLifecycleStore; receipts: RouteReceiptStore },
      input: Partial<ClaudeUserPromptSubmitInput> = { session_id: 'receipt-session' },
    ): Promise<string | undefined> {
      const output = await handleClaudeUserPromptSubmit({
        hook_event_name: 'UserPromptSubmit',
        cwd: '/workspace/project',
        prompt,
        ...input,
      }, {
        buildCliBrief: vi.fn(async () => result),
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: () => {},
        directiveLifecycleStore: stores.lifecycle,
        routeReceiptStore: stores.receipts,
      });
      return 'hookSpecificOutput' in output ? output.hookSpecificOutput.additionalContext : undefined;
    }

    const docsRoute = () => routedResult('sk-doc', 0.9373, false);
    const flooredCodeRoute = () => routedResult('sk-code', 0.82, true);

    it('holds back a floored weak follow-up that routes away from the session route', async () => {
      const stores = freshStores();
      expect(await receiptTurn(README_TASK, docsRoute(), stores)).toContain('use sk-doc');
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores)).toBe(EXPECTED_SKIPPED_CONTEXT);
    });

    it('decides a pasted earlier reply the same as the bare follow-up', async () => {
      const stores = freshStores();
      await receiptTurn(README_TASK, docsRoute(), stores);
      expect(await receiptTurn(PASTED_FIX_THAT_TOO, flooredCodeRoute(), stores)).toBe(EXPECTED_SKIPPED_CONTEXT);
    });

    it('keeps a floored topic change that names its own work', async () => {
      const stores = freshStores();
      await receiptTurn(README_TASK, docsRoute(), stores);
      expect(await receiptTurn(REFACTOR_TASK, flooredCodeRoute(), stores)).toContain('use sk-code');
    });

    it('delivers after a lifecycle boundary advanced the session epoch', async () => {
      const stores = freshStores();
      await receiptTurn(README_TASK, docsRoute(), stores);
      stores.lifecycle.advanceSessionEpoch('receipt-session');
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores)).toContain('use sk-code');
    });

    it('delivers after the transcript shrank and holds back while it grew', async () => {
      const dir = mkdtempSync(join(tmpdir(), 'route-receipt-transcript-'));
      try {
        const transcriptPath = join(dir, 'session.jsonl');
        const input = { session_id: 'receipt-session', transcript_path: transcriptPath };
        const grown = freshStores();
        writeFileSync(transcriptPath, 'x'.repeat(200));
        await receiptTurn(README_TASK, docsRoute(), grown, input);
        writeFileSync(transcriptPath, 'x'.repeat(300));
        const afterGrowth = await receiptTurn('fix that too', flooredCodeRoute(), grown, input);
        expect(afterGrowth).toContain('Advisor: prompt skipped.');
        expect(afterGrowth).not.toContain('use sk-code');

        const shrunk = freshStores();
        writeFileSync(transcriptPath, 'x'.repeat(200));
        await receiptTurn(README_TASK, docsRoute(), shrunk, input);
        writeFileSync(transcriptPath, 'x'.repeat(10));
        expect(await receiptTurn('fix that too', flooredCodeRoute(), shrunk, input)).toContain('use sk-code');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });

    it('routes a follow-up with no session id as it would with no receipt', async () => {
      const stores = freshStores();
      await receiptTurn(README_TASK, docsRoute(), stores, {});
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores, {})).toBe(UNGUARDED_FOLLOW_UP_CONTEXT);
    });

    it.each([
      ['unconfirmed', { session_id: 'receipt-session', session_identity_confirmed: false }],
      ['ambiguous', { session_id: 'receipt-session', session_identity_ambiguous: true }],
    ] as const)('keeps no receipt for an %s session identity', async (_label, input) => {
      const stores = freshStores();
      expect(await receiptTurn(README_TASK, docsRoute(), stores, input)).toContain('use sk-doc');
      expect(stores.receipts.read('receipt-session')).toBeNull();
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores, input)).toBe(UNGUARDED_FOLLOW_UP_CONTEXT);
    });

    it('reads no receipt for an unconfirmed identity that reuses a recorded id', async () => {
      const stores = freshStores();
      await receiptTurn(README_TASK, docsRoute(), stores);
      expect(stores.receipts.read('receipt-session')?.skill).toBe('sk-doc');
      const unconfirmed = { session_id: 'receipt-session', session_identity_confirmed: false };
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores, unconfirmed)).toBe(UNGUARDED_FOLLOW_UP_CONTEXT);
    });

    it('routes a follow-up with an empty receipt store as it would with no receipt', async () => {
      expect(await receiptTurn('fix that too', flooredCodeRoute(), freshStores())).toBe(UNGUARDED_FOLLOW_UP_CONTEXT);
    });

    it('keeps the turn when the receipt store throws', async () => {
      const throwingStore: RouteReceiptStore = {
        read: () => {
          throw new Error('read failed');
        },
        write: () => {
          throw new Error('write failed');
        },
      };
      const stores = { lifecycle: new InMemoryDirectiveLifecycleStore(), receipts: throwingStore };
      expect(await receiptTurn(README_TASK, docsRoute(), stores)).toContain('use sk-doc');
      expect(await receiptTurn('fix that too', flooredCodeRoute(), stores)).toBe(UNGUARDED_FOLLOW_UP_CONTEXT);
    });
  });
});
