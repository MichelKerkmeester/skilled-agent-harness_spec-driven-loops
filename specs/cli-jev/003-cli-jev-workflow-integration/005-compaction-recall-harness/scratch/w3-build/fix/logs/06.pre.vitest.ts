// ───────────────────────────────────────────────────────────────────
// MODULE: Compaction Recall Census Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures only; every census run has stub jev and cli-deem binaries first on PATH.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

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

const TEMP_DIRS: string[] = [];

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  TEMP_DIRS.push(dir);
  return dir;
}

function transcriptDir(): string {
  const dir = tempDir('compaction-recall-named-');
  copyFileSync(fixture('clean'), join(dir, 'clean.jsonl'));
  return dir;
}

function runScript(script: string, args: string[]) {
  const stubDir = makeStubs();
  TEMP_DIRS.push(stubDir);
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    timeout: 60_000,
    env: { ...process.env, PATH: `${stubDir}${delimiter}${process.env.PATH}` },
  });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

// On a case-insensitive disk the upper-cased name of a directory opens the same directory.
const CASE_INSENSITIVE = (() => {
  const dir = mkdtempSync(join(tmpdir(), 'compaction-recall-case-'));
  const folded = existsSync(join(dirname(dir), basename(dir).toUpperCase()));
  rmSync(dir, { recursive: true, force: true });
  return folded;
})();

describe('score-compaction-recall', () => {
  afterEach(() => {
    for (const dir of TEMP_DIRS.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

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

  it('a recorded brief is read and not replayed', () => {
    const run = runCensus(['--transcripts', fixture('recorded-brief'), '--replay']);

    expect(run.code).toBe(0);
    expect(run.report.rows).toHaveLength(1);
    expect(run.report.rows[0].summaryPresent).toBe(true);
    expect(run.report.rows[0].briefStatus).toBe('recorded');
    expect(run.report.rows[0].briefWindowStatus).toBe('hook_success');
    expect(run.report.rows[0].briefMarker).toBe(true);
    expect(run.report.rows[0].briefChars).toBe(66);
    expect(run.report.rows[0].replayVersion ?? null).toBeNull();
    expect(run.report.totals.briefs_recorded).toBe(1);
    expect(run.report.totals.briefs_replayed ?? 0).toBe(0);
    const values = Object.values(run.report.rows[0]);
    expect(values.filter((value) => typeof value === 'string' && value.includes('CANARY-'))).toEqual([]);
  });

  it('a missing written file gives 1 violation', () => {
    const run = runCensus(['--transcripts', fixture('missing-written-file')]);

    expect(run.code).toBe(0);
    expect(run.report.rows).toHaveLength(1);
    const row = run.report.rows[0];
    expect(row.r2Found).toBe(1);
    expect(row.r2Summary).toBe(0);
    expect(row.r2Brief).toBe(0);
    expect(row.r1Found).toBe(1);
    expect(row.r1Summary).toBe(1);
    expect(row.r3Found).toBe(1);
    expect(row.r3Summary).toBe(1);
    expect(row.r4Found).toBe(1);
    expect(row.r4Summary).toBe(1);
    expect(row.uncheckable).toBe(0);
    expect(row.r5).toBe('ok');
    expect(row.violations).toBe(1);
    const rowLine = run.lines.find((line) => line.startsWith('row missing-written-file.jsonl '));
    expect(rowLine).toContain(' r2=1/0/0 ');
    expect(rowLine).toContain(' violations=1');
  });

  it('a clean session with a raw U+2028 in a text field gives 0 violations', () => {
    expect(readFileSync(fixture('clean'), 'utf8')).toContain('\u2028');
    const run = runCensus(['--transcripts', fixture('clean')]);

    expect(run.code).toBe(0);
    expect(run.report.totals.sessions_stopped).toBe(0);
    expect(run.report.rows).toHaveLength(1);
    const row = run.report.rows[0];
    expect([row.r1Found, row.r1Summary, row.r1Brief]).toEqual([1, 1, 1]);
    expect([row.r2Found, row.r2Summary, row.r2Brief]).toEqual([1, 1, 1]);
    expect([row.r3Found, row.r3Summary, row.r3Brief]).toEqual([1, 1, 1]);
    expect(row.r4Found).toBe(2);
    expect(row.r4Summary).toBe(2);
    expect(row.r4Brief).toBe(2);
    expect(row.uncheckable).toBe(0);
    expect(row.r5).toBe('ok');
    expect(row.summaryRecall).toBe(1);
    expect(row.briefRecall).toBe(1);
    expect(row.violations).toBe(0);
  });

  it('a boundary without a recorded brief takes the replay path with replay_version', () => {
    const run = runCensus(['--transcripts', fixture('no-brief')]);

    expect(run.code).toBe(0);
    expect(run.report.rows[0].briefStatus).toBe('absent');
    expect(run.report.rows[0].briefWindowStatus).toBe('hook_cancelled');
    expect(run.report.rows[0].briefRecall).toBeNull();
    expect(run.report.rows[0].replayVersion).toBeNull();

    const replayed = runCensus(['--transcripts', fixture('no-brief'), '--replay']);

    expect(replayed.code).toBe(0);
    expect(replayed.report.rows[0].briefStatus).toBe('replayed');
    expect(replayed.report.rows[0].briefWindowStatus).toBe('hook_cancelled');
    expect(Number.isInteger(replayed.report.rows[0].replayVersion)).toBe(true);
    expect(replayed.report.rows[0].replayVersion).toBeGreaterThan(0);
    expect(replayed.report.rows[0].briefChars).toBeGreaterThan(0);
    expect(replayed.report.rows[0].briefMarker).toBeNull();
    expect(replayed.report.totals.briefs_replayed).toBe(1);
    expect(replayed.report.totals.briefs_absent).toBe(0);
    const rowLine = replayed.lines.find((line) => line.startsWith('row no-brief.jsonl '));
    expect(rowLine).toContain(` replay_version=${replayed.report.rows[0].replayVersion}`);
  });

  it('the report holds no CANARY- string', async () => {
    const run = runCensus(['--transcripts', FIXTURES, '--replay']);

    expect(run.code).toBe(1);
    expect(run.report.totals.sessions_stopped).toBe(2);
    expect(run.report.rows).toHaveLength(4);
    expect(run.lines[run.lines.length - 1].startsWith('stop: arm')).toBe(true);
    expect(run.stdout).not.toContain('CANARY-');
    expect(run.stderr).not.toContain('CANARY-');
    expect(JSON.stringify(run.report)).not.toContain('CANARY-');

    const { hasFreeText } = await import(pathToFileURL(SCRIPT).href);
    expect(hasFreeText({ rows: [{ file: 'a.jsonl', trigger: 'auto', note: 'CANARY-leak' }] }, { basenames: new Set(['a.jsonl']), uuids: new Set() })).toBe(true);
    expect(hasFreeText({ rows: [{ file: 'a.jsonl', trigger: 'auto' }] }, { basenames: new Set(['a.jsonl']), uuids: new Set() })).toBe(false);
  });

  it('the stub jev and cli-deem logs stay empty', () => {
    const stub = makeStubs();
    runCensus(['--transcripts', FIXTURES], stub);
    runCensus(['--transcripts', FIXTURES, '--replay'], stub);

    expect(existsSync(join(stub, 'jev.log'))).toBe(false);
    expect(existsSync(join(stub, 'cli-deem.log'))).toBe(false);
    expect(readFileSync(SCRIPT, 'utf8')).not.toMatch(/child_process|spawnSync|spawn\(|execFile|execSync/);
  });

  it('runs main when node starts the script through a symlink', () => {
    const link = join(tempDir('compaction-recall-link-'), 'census.mjs');
    symlinkSync(SCRIPT, link);
    const run = runScript(link, []);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toBe('no transcripts named\n');
  });

  it('an --out under a ..cache name inside the transcript directory is refused', () => {
    const dir = transcriptDir();
    const out = join(dir, '..cache', 'r.json');
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', out]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(out)).toBe(false);
  });

  it('an exact-case --out inside the transcript directory is refused', () => {
    const dir = transcriptDir();
    const out = join(dir, 'r.json');
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', out]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(out)).toBe(false);
  });

  it.skipIf(!CASE_INSENSITIVE)('an upper-cased --out inside the transcript directory is refused', () => {
    const dir = transcriptDir();
    const upper = join(dirname(dir), basename(dir).toUpperCase());
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', join(upper, 'r-upper.json')]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(join(dir, 'r-upper.json'))).toBe(false);
  });

  it('an --out through a symlink to the transcript directory is refused', () => {
    const dir = transcriptDir();
    const link = join(tempDir('compaction-recall-link-'), 'named');
    symlinkSync(dir, link);
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', join(link, 'r.json')]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(join(dir, 'r.json'))).toBe(false);
  });

  it('an --out outside the transcript directory is accepted and written', () => {
    const dir = transcriptDir();
    const out = join(tempDir('compaction-recall-out-'), 'r.json');
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', out]);

    expect(run.code).toBe(0);
    expect(run.stderr).toBe('');
    expect(JSON.parse(readFileSync(out, 'utf8')).rows).toHaveLength(1);
  });
});
