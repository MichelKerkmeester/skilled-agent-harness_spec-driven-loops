// ───────────────────────────────────────────────────────────────────
// MODULE: Claude stream-json lineage logs
// ───────────────────────────────────────────────────────────────────
// A cli-claude-code lineage logs one JSON event per line. Its cost, its final
// answer and any question it ends on are read from the last result event, so
// file text quoted inside a tool result never decides any of them.

import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const requireCjs = createRequire(import.meta.url);
const { sumProviderCostFromLog, extractTextFromOpencodeJson } = requireCjs(
  join(scriptsDir, 'fanout-salvage.cjs'),
) as {
  sumProviderCostFromLog: (text: string) => number | null;
  extractTextFromOpencodeJson: (text: string) => string | null;
};
const { detectPendingQuestion, detectQuotaExhaustion } = requireCjs(
  join(scriptsDir, 'lib', 'cli-guards.cjs'),
) as {
  detectPendingQuestion: (text: string) => { question: string } | null;
  detectQuotaExhaustion: (stderr: string, stdout?: string) => { cause: string } | null;
};
const { buildLineageCommand } = requireCjs(join(scriptsDir, 'fanout-run.cjs')) as {
  buildLineageCommand: (...args: unknown[]) => { command: string; args: string[] };
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

const SESSION = 'session-fixture';

function assistantToolUse(name: string, input: Record<string, unknown>, timestamp: string): string {
  return JSON.stringify({
    type: 'assistant',
    session_id: SESSION,
    timestamp,
    message: { role: 'assistant', content: [{ type: 'tool_use', id: `toolu_${name}`, name, input }] },
  });
}

function toolResult(text: string, timestamp: string): string {
  return JSON.stringify({
    type: 'user',
    session_id: SESSION,
    timestamp,
    message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_Read', content: text }] },
  });
}

function resultEvent(result: string, totalCostUsd: number, isError = false): string {
  return JSON.stringify({
    type: 'result',
    subtype: isError ? 'error_during_execution' : 'success',
    is_error: isError,
    session_id: SESSION,
    total_cost_usd: totalCostUsd,
    result,
  });
}

function streamLog(lines: string[]): string {
  return [
    JSON.stringify({ type: 'system', subtype: 'init', session_id: SESSION, model: 'claude-opus' }),
    ...lines,
  ].join('\n');
}

describe('claude stream-json argv', () => {
  it('runs a claude lineage with stream-json output and verbose events', () => {
    const binDir = mkdtempSync(join(tmpdir(), 'fanout-claude-stream-bin-'));
    tempDirs.push(binDir);
    const stub = join(binDir, 'claude');
    writeFileSync(stub, '#!/bin/sh\nexit 0\n');
    chmodSync(stub, 0o755);

    const command = buildLineageCommand(
      { kind: 'cli-claude-code', label: 'claude', model: 'claude-fable-5' },
      'bounded prompt',
      'workspace-write',
      'acceptEdits',
      { env: { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` }, executableVersion: 'fixture 1.0.0' },
    );

    const formatIndex = command.args.indexOf('--output-format');
    expect(command.args[formatIndex + 1]).toBe('stream-json');
    expect(command.args).toContain('--verbose');
    expect(command.args).not.toContain('text');
  });
});

describe('claude stream-json provider cost', () => {
  it('reads the last result event, since total_cost_usd is cumulative per session', () => {
    const log = streamLog([
      assistantToolUse('Read', { file_path: 'a.ts' }, '2026-11-20T10:00:01.000Z'),
      resultEvent('first answer', 0.4),
      resultEvent('final answer', 1.25),
    ]);
    expect(sumProviderCostFromLog(log)).toBe(1.25);
  });

  it('reads a stream with no result event as unknown cost', () => {
    const log = streamLog([assistantToolUse('Read', { file_path: 'a.ts' }, '2026-11-20T10:00:01.000Z')]);
    expect(sumProviderCostFromLog(log)).toBeNull();
  });
});

describe('claude stream-json final text', () => {
  it('salvages the result text instead of the raw event stream', () => {
    const answer = '# Iteration 3\n\nThe gateway clock decides the stamp, as the ledger frames show.';
    const log = streamLog([
      assistantToolUse('Read', { file_path: 'a.ts' }, '2026-11-20T10:00:01.000Z'),
      resultEvent(answer, 0.3),
    ]);
    expect(extractTextFromOpencodeJson(log)).toBe(answer);
  });

  it('salvages the top-level assistant text when the stream ended without a result event', () => {
    const narrative = 'Iteration 2 found the stamp skew in the review lineage and wrote the delta file.';
    const log = streamLog([
      JSON.stringify({
        type: 'assistant',
        session_id: SESSION,
        parent_tool_use_id: null,
        timestamp: '2026-11-20T10:00:02.000Z',
        message: { role: 'assistant', content: [{ type: 'text', text: narrative }] },
      }),
    ]);
    expect(extractTextFromOpencodeJson(log)).toBe(narrative);
  });

  it('keeps plain text output unchanged', () => {
    const text = 'A plain-text lineage answer that is long enough to be worth salvaging here.';
    expect(extractTextFromOpencodeJson(text)).toBe(text);
  });
});

describe('claude stream-json pending question', () => {
  it('finds the question the final answer ends on even when a tool result quotes the completion marker', () => {
    const log = streamLog([
      assistantToolUse('Read', { file_path: 'fanout-run.cjs' }, '2026-11-20T10:00:01.000Z'),
      toolResult('`When complete, output a single line: FANOUT_LINEAGE_COMPLETE:${lineage.label}`', '2026-11-20T10:00:02.000Z'),
      resultEvent('The plan and the ledger disagree.\nLOGIC-SYNC REQUIRED: plan.md contradicts tasks.md\nWhich truth prevails?', 0.2),
    ]);
    expect(detectPendingQuestion(log)).toEqual({ question: 'Which truth prevails?' });
  });

  it('reads a final answer that carries the completion marker as finished', () => {
    const log = streamLog([
      toolResult('Shall I proceed with the rewrite?', '2026-11-20T10:00:02.000Z'),
      resultEvent('All iterations recorded.\nFANOUT_LINEAGE_COMPLETE:claude', 0.2),
    ]);
    expect(detectPendingQuestion(log)).toBeNull();
  });
});

describe('claude stream-json quota detection', () => {
  it('ignores a quota phrase quoted inside a tool result when the run succeeded', () => {
    const log = streamLog([
      toolResult('docs say: the usage limit reached message means wait an hour', '2026-11-20T10:00:02.000Z'),
      resultEvent('Done.\nFANOUT_LINEAGE_COMPLETE:claude', 0.2),
    ]);
    expect(detectQuotaExhaustion('', log)).toBeNull();
  });

  it('detects a quota refusal the result event reports', () => {
    const log = streamLog([resultEvent('Claude AI usage limit reached, resets at 5pm', 0, true)]);
    expect(detectQuotaExhaustion('', log)).toEqual({ cause: 'Claude AI usage limit reached, resets at 5pm' });
  });
});
