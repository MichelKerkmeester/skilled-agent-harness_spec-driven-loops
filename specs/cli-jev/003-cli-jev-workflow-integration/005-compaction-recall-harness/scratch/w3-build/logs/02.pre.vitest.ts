// ───────────────────────────────────────────────────────────────────
// MODULE: Compaction Recall Census Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures only; every census run has stub jev and cli-deem binaries first on PATH.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
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
});
