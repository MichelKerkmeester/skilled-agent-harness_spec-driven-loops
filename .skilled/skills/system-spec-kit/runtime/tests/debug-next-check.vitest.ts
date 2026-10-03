// ───────────────────────────────────────────────────────────────────
// MODULE: Debug Next Check Scorer Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures and temporary repositories only. A stub jev binary
// comes first on PATH, so no script run here can reach a live backend.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/debug-next-check/score-debug-next-check.mjs');
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..');

const TEMP_DIRS: string[] = [];

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  TEMP_DIRS.push(dir);
  return dir;
}

/** Writes a stub jev binary whose only side effect is a log line. */
function makeStubs(): string {
  const stubDir = tempDir('debug-next-check-stub-');
  for (const name of ['jev']) {
    writeFileSync(
      join(stubDir, name),
      `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`,
      { mode: 0o755 },
    );
  }
  return stubDir;
}

// Test double for the arm cases: it logs one line per invocation and answers
// from a small table of STUB_* variables, so no run reaches a live backend.
function armStubMain(): void {
  const fs = require('node:fs');
  const path = require('node:path');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
  fs.appendFileSync(logPath, `${args.join(' ')}\n`);
  if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (name === 'jev' && args[0] === 'choice') {
    const choice = env.STUB_CHOICE || 'read_code';
    process.stdout.write(`${JSON.stringify({ answers: { answer: { choice, probabilities: { [choice]: 0.9 } } } })}\n`);
  } else {
    process.exit(2);
  }
}

const ARM_STUB_SOURCE = `#!/usr/bin/env node\n(${armStubMain.toString()})();\n`;

/** Writes the response-table jev stub used by the arm cases. */
function makeArmStubs(): string {
  const stubDir = tempDir('debug-next-check-arm-stub-');
  for (const name of ['jev']) {
    writeFileSync(join(stubDir, name), ARM_STUB_SOURCE, { mode: 0o755 });
  }
  return stubDir;
}

// Test double for the verdict cases: it logs one line per invocation and answers
// from a pick schedule keyed by call index, so a run can produce a designed
// column. STUB_ORDER0_EXIT leaves every first option order unanswered, and
// STUB_UNSTABLE_ROW makes one row name three different keys.
function pickStubMain(): void {
  const fs = require('node:fs');
  const path = require('node:path');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
  const prior = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
  fs.appendFileSync(logPath, `${args.join(' ')}\n`);
  const choiceCalls = prior.filter((line) => line.startsWith('choice ')).length;
  if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(0);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (args[0] === 'choice') {
    const order = choiceCalls % 3;
    if (env.STUB_ORDER0_EXIT === '1' && order === 0) process.exit(1);
    const rowIndex = Math.floor(choiceCalls / 3);
    const schedule = (env.STUB_PICKS || 'read_code').split(',');
    let pick = schedule[rowIndex % schedule.length];
    if (env.STUB_UNSTABLE_ROW === String(rowIndex)) {
      pick = ['read_code', 'run_test', 'reproduce'][order];
    }
    process.stdout.write(`${JSON.stringify({ answers: { answer: { choice: pick, probabilities: { [pick]: 0.9 } } } })}\n`);
  } else {
    process.exit(2);
  }
}

const PICK_STUB_SOURCE = `#!/usr/bin/env node\n(${pickStubMain.toString()})();\n`;

/** Writes the pick-schedule jev stub used by the verdict cases. */
function makePickStubs(): string {
  const stubDir = tempDir('debug-next-check-pick-stub-');
  for (const name of ['jev']) {
    writeFileSync(join(stubDir, name), PICK_STUB_SOURCE, { mode: 0o755 });
  }
  return stubDir;
}

/** The label order the verdict cases score: read_code is the best constant at 12/30. */
function verdictLabels(): string[] {
  return [
    ...Array.from({ length: 12 }, () => 'read_code'),
    ...Array.from({ length: 8 }, () => 'run_test'),
    ...Array.from({ length: 5 }, () => 'reproduce'),
    ...Array.from({ length: 5 }, () => 'instrument'),
  ];
}

/** Thirty labeled rows carrying the verdict label order. */
function verdictRows(): Array<Record<string, unknown>> {
  return verdictLabels().map((label, index) => fixtureRow({ id: `verdict-${index}`, label }));
}

/** Picks right on every read_code and run_test row and wrong on the other rows. */
function keepSchedule(): string {
  return verdictLabels().map((label) => (label === 'run_test' ? 'run_test' : 'read_code')).join(',');
}

/** Picks a wrong key on every row while the baseline is right on twelve. */
function killSchedule(): string {
  return verdictLabels().map((label) => (label === 'read_code' ? 'run_test' : 'read_code')).join(',');
}

/** Lines one stub appended, one per invocation. */
function stubLines(stubDir: string, name: string): string[] {
  const logPath = join(stubDir, `${name}.log`);
  if (!existsSync(logPath)) return [];
  return readFileSync(logPath, 'utf8').split('\n').filter((line) => line !== '');
}

/** Runs the scorer with the stubs first on PATH and captures its streams. */
function runScript(
  args: string[],
  stubDir: string = makeStubs(),
  extraEnv: Record<string, string> = {},
) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    timeout: 60_000,
    env: {
      ...process.env,
      PATH: `${stubDir}${delimiter}${process.env.PATH}`,
      ...extraEnv,
    },
  });
  return {
    code: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    lines: result.stdout.trimEnd().split('\n'),
    stubDir,
  };
}

/** Creates a throwaway git repository with nothing committed. */
function gitRepo(): string {
  const dir = tempDir('debug-next-check-repo-');
  execFileSync('git', ['init', '--quiet'], { cwd: dir, stdio: 'ignore' });
  return dir;
}

/** One fixture row with every schema field; each case overrides what it breaks. */
function fixtureRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'row-1',
    symptom: 'the upload stalls at one hundred files',
    claim: 'the pool exhausts before the retry starts',
    evidence: 'two socket resets in the run log',
    label: 'run_test',
    jev_ok: true,
    ...overrides,
  };
}

/** Writes JSON Lines rows to a fixture outside the repository. */
function writeFixture(rows: Array<Record<string, unknown>>): string {
  const file = join(tempDir('debug-next-check-fixture-'), 'rows.jsonl');
  writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
  return file;
}

/** Parses the JSON Lines call log a run wrote under its report directory. */
function readCallsLog(file: string): Array<Record<string, unknown>> {
  return readFileSync(file, 'utf8')
    .trimEnd()
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => JSON.parse(line));
}

describe('score-debug-next-check', () => {
  afterEach(() => {
    for (const dir of TEMP_DIRS.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('default run', () => {
    const run = runScript([]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('seam: none');
    expect(run.lines).toContain('mined: debug_delegation=1 hypothesis_files=0');
    expect(run.lines).toContain('mined rows: 0');
    expect(run.stderr).toBe('');
    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
  });

  it('seam planted', async () => {
    const repo = gitRepo();
    writeFileSync(join(repo, 'planted.md'), 'next_check\n');
    execFileSync('git', ['-C', repo, 'add', 'planted.md'], { stdio: 'ignore' });
    const { seamSearch } = await import(pathToFileURL(SCRIPT).href);

    expect(seamSearch(repo)).toEqual(['planted.md']);
  });

  it('seam clean', async () => {
    const repo = gitRepo();
    writeFileSync(join(repo, 'notes.md'), 'unrelated tracked notes\n');
    execFileSync('git', ['-C', repo, 'add', 'notes.md'], { stdio: 'ignore' });
    const { seamSearch } = await import(pathToFileURL(SCRIPT).href);

    expect(seamSearch(repo)).toEqual([]);
  });

  it('seam skips its own files', async () => {
    const repo = gitRepo();
    mkdirSync(join(repo, 'tools', 'debug-next-check'), { recursive: true });
    mkdirSync(join(repo, 'docs'), { recursive: true });
    writeFileSync(join(repo, 'tools', 'debug-next-check', 'score-debug-next-check.mjs'), 'next_check\n');
    writeFileSync(join(repo, 'tools', 'debug-next-check', 'README.md'), 'next_check\n');
    writeFileSync(join(repo, 'docs', 'debug-next-check.md'), 'next_check\n');
    writeFileSync(join(repo, 'caller.md'), 'next_check\n');
    execFileSync('git', ['-C', repo, 'add', '-A'], { stdio: 'ignore' });
    const { seamSearch } = await import(pathToFileURL(SCRIPT).href);

    expect(seamSearch(repo)).toEqual(['caller.md']);
  });

  it('mined corpus', async () => {
    const { minedCorpus } = await import(pathToFileURL(SCRIPT).href);

    expect(minedCorpus(REPO_ROOT)).toEqual({ debugDelegation: 1, hypothesisFiles: 0, rows: 0 });
  });

  it('--jev without --out', () => {
    const fixture = writeFixture([fixtureRow()]);
    const run = runScript(['--jev', '--fixture', fixture]);

    expect(run.code).toBe(2);
    expect(run.stderr).toContain('--out');
    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
  });

  it('fixture valid', async () => {
    const fixture = writeFixture([fixtureRow()]);
    const { readFixture } = await import(pathToFileURL(SCRIPT).href);
    const result = readFixture(fixture, REPO_ROOT);

    expect(result.ok).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].id).toBe('row-1');
    expect(result.counts).toEqual({ read_code: 0, run_test: 1, reproduce: 0, instrument: 0 });
  });

  it('unknown label', () => {
    const fixture = writeFixture([fixtureRow({ id: 'row-look', label: 'look' })]);
    const run = runScript(['--fixture', fixture]);

    expect(run.code).toBe(2);
    expect(run.stderr).toContain('row-look');
    expect(run.stderr).toContain('label');
  });

  it('fixture inside repo', () => {
    const inside = join(REPO_ROOT, 'specs', 'debug-next-check-fixture.jsonl');
    const run = runScript(['--fixture', inside]);

    expect(run.code).toBe(2);
    expect(run.stderr).toContain('refused: fixture path inside the repository');
  });

  it('gate at 29', () => {
    const rows = Array.from({ length: 29 }, (_, index) => fixtureRow({ id: `row-${index + 1}` }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('stop: fewer than 30 labeled rows');
    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
    expect(existsSync(join(out, 'calls.jsonl'))).toBe(false);
  });

  it('gate at 30', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({ id: `row-${index + 1}` }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => /^fixture: rows=30 sha256=[0-9a-f]{64}$/.test(line))).toBe(true);
    expect(run.lines).toContain('labels: read_code=0 run_test=30 reproduce=0 instrument=0');
    expect(run.lines.some((line) => line.startsWith('stop:'))).toBe(false);
  });

  it('baseline best', () => {
    const rows = [
      ...Array.from({ length: 20 }, (_, index) =>
        fixtureRow({ id: `best-run-${index}` }),
      ),
      ...Array.from({ length: 4 }, (_, index) =>
        fixtureRow({ id: `best-code-${index}`, label: 'read_code' }),
      ),
      ...Array.from({ length: 3 }, (_, index) =>
        fixtureRow({ id: `best-reproduce-${index}`, label: 'reproduce' }),
      ),
      ...Array.from({ length: 3 }, (_, index) =>
        fixtureRow({ id: `best-instrument-${index}`, label: 'instrument' }),
      ),
    ];
    const fixture = writeFixture(rows);
    const run = runScript(['--fixture', fixture]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('constant read_code: 4/30');
    expect(run.lines).toContain('constant run_test: 20/30');
    expect(run.lines).toContain('constant reproduce: 3/30');
    expect(run.lines).toContain('constant instrument: 3/30');
    expect(run.lines).toContain('baseline: run_test 20/30');
  });

  it('baseline tie', () => {
    // A thirty-row fixture can only tie at fifteen each: the four labels
    // partition the rows, so two counts cannot both exceed half of them.
    const rows = [
      ...Array.from({ length: 15 }, (_, index) =>
        fixtureRow({ id: `tie-code-${index}`, label: 'read_code' }),
      ),
      ...Array.from({ length: 15 }, (_, index) =>
        fixtureRow({ id: `tie-reproduce-${index}`, label: 'reproduce' }),
      ),
    ];
    const fixture = writeFixture(rows);
    const run = runScript(['--fixture', fixture]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('baseline: read_code 15/30');
  });

  it('no headroom', () => {
    const rows = Array.from({ length: 30 }, (_, index) =>
      fixtureRow({ id: `headroom-${index}`, label: index < 28 ? 'read_code' : 'run_test' }),
    );
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('baseline: read_code 28/30');
    expect(run.lines).toContain('no headroom');
    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
    expect(existsSync(join(out, 'calls.jsonl'))).toBe(false);
  });

  it('withheld row', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `withheld-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      ...(index === 7 ? { jev_ok: false } : {}),
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);

    expect(run.code).toBe(0);
    const logFile = join(out, 'calls.jsonl');
    expect(existsSync(logFile)).toBe(true);
    const withheld = readCallsLog(logFile).filter((record) => record.rowId === 'withheld-7');
    expect(withheld).toHaveLength(3);
    expect(withheld.map((record) => record.order)).toEqual([0, 1, 2]);
    for (const record of withheld) {
      expect(record.status).toBe('unmeasured_withheld');
      // A withheld row produced no spawn: no wall time and no exit code.
      expect(record.wallMs).toBe(0);
      expect(record.exitCode).toBeNull();
    }
  });

  it('no accepted row', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `no-accept-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      jev_ok: false,
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('jev arm skipped: payload not accepted');
  });

  it('jev gate pass', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `gate-pass-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      jev_ok: index < 12,
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', fixture, '--jev', '--out', out],
      makeArmStubs(),
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => /^jev: path=.+\/jev provider=official$/.test(line))).toBe(true);
    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
  });

  it('jev gate skip', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `gate-skip-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      jev_ok: index < 12,
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', fixture, '--jev', '--out', out],
      makeArmStubs(),
      { STUB_AUTH_STATUS_EXIT: '3' },
    );

    expect(run.code).toBe(0);
    expect(run.lines).toContain('jev arm skipped: no credential');
    expect(run.lines).not.toContain('jev: auth test provider=official model=stub-model');
    expect(stubLines(run.stubDir, 'jev').filter((line) => line.startsWith('choice '))).toHaveLength(0);
  });

  it('jev wrong version', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `wrong-version-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      jev_ok: index < 12,
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', fixture, '--jev', '--out', out],
      makeArmStubs(),
      { STUB_JEV_VERSION: 'jev 0.6.1' },
    );

    expect(run.code).toBe(0);
    expect(run.lines).toContain('jev arm skipped: version');
    expect(run.lines.some((line) => line.startsWith('jev: found="jev 0.6.1" path='))).toBe(true);
    expect(run.lines).not.toContain('jev: auth test provider=official model=stub-model');
  });

  // K counts accepted rows, so this case pins the input boundary the eventual
  // verdict reads: exactly the accepted rows are called, once per option order,
  // and no withheld row is called.
  it('jev K', () => {
    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
      id: `k-${index}`,
      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
      jev_ok: index < 12,
    }));
    const fixture = writeFixture(rows);
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', fixture, '--jev', '--out', out],
      makeArmStubs(),
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    const records = readCallsLog(join(out, 'calls.jsonl'));
    const measured = records.filter((record) => record.status === 'measured' && typeof record.rowId === 'string');
    expect(measured).toHaveLength(36);
    expect([...new Set(measured.map((record) => record.rowId))].sort()).toEqual(
      Array.from({ length: 12 }, (_, index) => `k-${index}`).sort(),
    );
    for (let index = 0; index < 12; index += 1) {
      const picks = measured.filter((record) => record.rowId === `k-${index}`);
      expect(picks.map((record) => record.order)).toEqual([0, 1, 2]);
    }
    const withheld = records.filter((record) => record.status === 'unmeasured_withheld');
    expect(withheld).toHaveLength(54);
    for (const record of withheld) {
      expect(record.wallMs).toBe(0);
      expect(record.exitCode).toBeNull();
    }
    expect(stubLines(run.stubDir, 'jev').filter((line) => line.startsWith('choice '))).toHaveLength(36);
  });

  it('verdict coverage', () => {
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_ORDER0_EXIT: '1' },
    );

    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      'verdict jev: stop (coverage) K=30 M=0 A=0 B=0 W=0 L=0 F=0 p=1.000'
      + ' baseline=read_code jev_version=0.6.2 provider=official model=stub-model',
    );
  });

  it('verdict keep', () => {
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: keepSchedule() },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('verdict jev: keep K=30 M=30 A=20 B=12 W=8 L=0 F=0 p='))).toBe(true);
  });

  it('verdict kill', () => {
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: killSchedule() },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('verdict jev: kill K=30 M=30 A=0 B=12 W=0 L=12 F=0 p='))).toBe(true);
  });

  it('a changed Jev identity requalifies before the verdict', () => {
    const out = tempDir('debug-next-check-out-');
    writeFileSync(
      join(out, 'report.json'),
      `${JSON.stringify({ columns: { jev: { provider: 'openrouter', model: 'stub-model' } } })}\n`,
    );
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: keepSchedule() },
    );

    expect(run.code).toBe(0);
    const requalifyAt = run.lines.indexOf('requalify: model changed');
    const verdictAt = run.lines.findIndex((line) => line.startsWith('verdict jev:'));
    expect(requalifyAt).toBeGreaterThan(-1);
    expect(verdictAt).toBeGreaterThan(requalifyAt);
  });

  it('an unstable Jev row counts as a miss and adds its missing votes to flips', () => {
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: 'run_test', STUB_UNSTABLE_ROW: '0' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => /^column jev: rows=30 measured=30 unmeasured=0 unstable=1 withheld=0 latency_p50_ms=\d+ latency_p95_ms=\d+$/.test(line))).toBe(true);
    expect(run.lines.some((line) => /^verdict jev: .* F=2 /.test(line))).toBe(true);
  });

  it('report line', () => {
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: keepSchedule() },
    );

    expect(run.code).toBe(0);
    const report = JSON.parse(readFileSync(join(out, 'report.json'), 'utf8'));
    for (const backend of ['jev']) {
      const stdoutLine = run.lines.find((line) => line.startsWith(`verdict ${backend}:`));
      expect(stdoutLine).toBeDefined();
      expect(report.columns[backend].line).toBe(stdoutLine);
    }
  });

  it('no row text', () => {
    const rows = verdictRows().map((row, index) => (index === 0
      ? { ...row, symptom: 'CANARY-2f9d the upload stalls', evidence: 'CANARY-2f9d two socket resets' }
      : row));
    const out = tempDir('debug-next-check-out-');
    const run = runScript(
      ['--fixture', writeFixture(rows), '--jev', '--out', out],
      makePickStubs(),
      { STUB_PICKS: 'read_code' },
    );

    expect(run.code).toBe(0);
    expect(readFileSync(join(out, 'calls.jsonl'), 'utf8')).not.toContain('CANARY-');
    expect(readFileSync(join(out, 'report.json'), 'utf8')).not.toContain('CANARY-');
  });
});
