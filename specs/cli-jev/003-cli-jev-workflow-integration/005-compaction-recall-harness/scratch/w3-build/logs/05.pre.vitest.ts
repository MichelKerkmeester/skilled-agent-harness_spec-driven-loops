// ───────────────────────────────────────────────────────────────────
// MODULE: Compaction Recall Census Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures only; every census run has stub jev and cli-deem binaries first on PATH.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/compaction-recall/score-compaction-recall.mjs');
const FIXTURES = resolve(HERE, 'compaction-recall-fixtures');

function fixture(name: string): string {
  return join(FIXTURES, `${name}.jsonl`);
}

function makeStubs(): string {
  const stubDir = mkdtempSync(join(tmpdir(), 'compaction-recall-stub-'));
  for (const name of ['jev', 'cli-deem']) {
    writeFileSync(
      join(stubDir, name),
      `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`,
      { mode: 0o755 },
    );
  }
  return stubDir;
}

function runCensus(args: string[], stubDir: string = makeStubs()) {
  const out = join(mkdtempSync(join(tmpdir(), 'compaction-recall-out-')), 'report.json');
  const result = spawnSync(process.execPath, [SCRIPT, ...args, '--out', out], {
    encoding: 'utf8',
    timeout: 60_000,
    env: { ...process.env, PATH: `${stubDir}${delimiter}${process.env.PATH}` },
  });
  return {
    code: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    lines: result.stdout.trimEnd().split('\n'),
    report: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null,
    stubDir,
  };
}

function selectionDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'compaction-recall-selection-'));
  const clean = readFileSync(fixture('clean'), 'utf8');
  writeFileSync(join(dir, 'a-old.jsonl'), clean);
  writeFileSync(join(dir, 'b-new.jsonl'), clean);
  writeFileSync(join(dir, 'c-newest.jsonl'), `${clean.split('\n').slice(0, 4).join('\n')}\n`);
  mkdirSync(join(dir, 'sess', 'subagents'), { recursive: true });
  writeFileSync(join(dir, 'sess', 'subagents', 'd.jsonl'), clean);
  utimesSync(join(dir, 'a-old.jsonl'), 1000, 1000);
  utimesSync(join(dir, 'b-new.jsonl'), 2000, 2000);
  utimesSync(join(dir, 'c-newest.jsonl'), 3000, 3000);
  utimesSync(join(dir, 'sess', 'subagents', 'd.jsonl'), 4000, 4000);
  return dir;
}

describe('score-compaction-recall', () => {
  it('an unknown type exits 1 with a named error', () => {
    const run = runCensus(['--transcripts', fixture('unknown-type')]);

    expect(run.code).toBe(1);
    expect(run.stderr).toContain('parse error: unknown-type.jsonl:3: unknown type brand-new-type');
    expect(run.report.totals.sessions_stopped).toBe(1);
    expect(run.report.stoppedSessions).toEqual([{ file: 'unknown-type.jsonl', line: 3, code: 'unknown_type' }]);
    expect(run.lines[run.lines.length - 1]).toBe('stop: census void (unknown shape in 1 of 1 sessions)');
  });

  it('a malformed line exits 1 with a named error', () => {
    const run = runCensus(['--transcripts', fixture('malformed-line')]);

    expect(run.code).toBe(1);
    expect(run.stderr).toContain('parse error: malformed-line.jsonl:2: not JSON');
    expect(run.report.totals.sessions_stopped).toBe(1);
    expect(run.report.stoppedSessions).toEqual([{ file: 'malformed-line.jsonl', line: 2, code: 'not_json' }]);
    expect(run.lines[run.lines.length - 1]).toBe('stop: census void (unknown shape in 1 of 1 sessions)');
  });

  it('an empty directory exits 0 with compactions=0', () => {
    const empty = mkdtempSync(join(tmpdir(), 'compaction-recall-empty-'));
    const run = runCensus(['--transcripts', empty]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('method: parsed JSON records with type=system, subtype=compact_boundary and compactMetadata present');
    expect(run.lines[1]).toBe('scope: 0 main-session files, 0 subagent files, 0 boundaries (0 main, 0 subagent)');
    expect(run.lines.some((line) => line.startsWith('totals: compactions=0 '))).toBe(true);
    expect(run.lines[run.lines.length - 1]).toBe('stop: no boundaries');
    expect(run.report.rows).toHaveLength(0);
  });

  it('--newest-compacted 1 picks the newer compacted file and skips an uncompacted newer file and a subagent file', () => {
    const dir = selectionDir();
    const run = runCensus(['--transcripts', dir, '--newest-compacted', '1']);

    expect(run.code).toBe(0);
    expect(run.lines[1]).toBe('scope: 1 main-session files, 0 subagent files, 1 boundaries (1 main, 0 subagent)');
    expect(run.lines[2]).toBe('selection: newest 1 compacted main-session files by modification time, 2 read');
    expect(run.report.rows).toHaveLength(1);
    expect(run.report.rows[0].file).toBe('b-new.jsonl');
    expect(run.report.selection).toEqual({ newest: 1, read: 2 });
  });

  it('--newest-compacted 5 over two compacted files takes both', () => {
    const dir = selectionDir();
    const run = runCensus(['--transcripts', dir, '--newest-compacted', '5']);

    expect(run.code).toBe(0);
    expect(run.lines[2]).toBe('selection: newest 2 compacted main-session files by modification time, 3 read');
    expect(run.report.rows.map((r) => r.file)).toEqual(['b-new.jsonl', 'a-old.jsonl']);
  });

  it('an oversized state records fit_throw and continues', () => {
    const dir = mkdtempSync(join(tmpdir(), 'compaction-recall-big-'));
    const uuid = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
    const toolUses = Array.from({ length: 1500 }, (_, i) => ({
      type: 'tool_use',
      id: `toolu_${i}`,
      name: 'Read',
      input: { file_path: `/tmp/CANARY-big/file_${i}.md` },
    }));
    const big = join(dir, 'big.jsonl');
    writeFileSync(
      big,
      [
        JSON.stringify({
          type: 'assistant',
          uuid: uuid(1),
          isSidechain: false,
          message: { role: 'assistant', content: toolUses },
        }),
        JSON.stringify({
          type: 'user',
          uuid: uuid(2),
          isSidechain: false,
          message: {
            role: 'user',
            content: toolUses.map((use) => ({
              type: 'tool_result',
              tool_use_id: use.id,
              content: 'CANARY-big result',
            })),
          },
        }),
        JSON.stringify({
          type: 'system',
          subtype: 'compact_boundary',
          uuid: uuid(3),
          isSidechain: false,
          entrypoint: 'cli',
          compactMetadata: { trigger: 'auto', preTokens: 900000, postTokens: 5000, durationMs: 1000 },
        }),
      ].join('\n') + '\n',
    );
    const run = runCensus(['--transcripts', big, '--transcripts', fixture('clean')]);

    expect(run.code).toBe(0);
    expect(run.report.rows).toHaveLength(2);
    expect(run.report.rows[0].file).toBe('big.jsonl');
    expect(run.report.rows[0].fitStage).toBe('fit_throw');
    expect(run.report.rows[0].fitTokens).toBeNull();
    expect(run.report.rows[1].file).toBe('clean.jsonl');
    expect(run.report.rows[1].fitStage).toBe('full');
    expect(run.report.rows[1].fitTokens).toBeGreaterThan(0);
    expect(run.report.totals.fit_throws).toBe(1);
    expect(run.lines.some((line) => line.startsWith('row big.jsonl ') && line.includes(' fit=fit_throw '))).toBe(true);
    expect(run.report.rows[1].untruncatedTokens).toBeGreaterThanOrEqual(run.report.rows[1].keptTokens);
    expect(run.report.rows[1].keptTokens).toBeGreaterThan(0);
    expect(run.report.rows[1].offlineReduction).toBeGreaterThanOrEqual(0);
    expect(run.report.rows[1].offlineReduction).toBeLessThan(1);
    expect(run.report.rows[1].keptTokensRatio).toBeCloseTo(run.report.rows[1].keptTokens / 300, 6);
    expect(run.report.rows[0].keptTokens).toBeGreaterThan(0);
    expect(run.lines[run.lines.length - 1].startsWith('stop: arm not built (fit_throws=0.50, offline_reduction_upper_bound=')).toBe(true);
  });
});
