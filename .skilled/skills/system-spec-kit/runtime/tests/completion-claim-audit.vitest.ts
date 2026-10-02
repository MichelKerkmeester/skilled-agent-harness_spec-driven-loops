// ───────────────────────────────────────────────────────────────────
// MODULE: Completion Claim Audit Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures only; every script run has stub jev and cli-deem binaries first on PATH.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { QUESTION, detectTail } from '../scripts/completion-claim-audit/score-completion-claims.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/completion-claim-audit/score-completion-claims.mjs');
const FIXTURES = resolve(HERE, 'completion-claim-audit-fixtures');

function fixture(name: string): string {
  return join(FIXTURES, `${name}.jsonl`);
}

// Test double for the cli-deem and jev binaries: it logs one line per call and answers from the STUB_* variables.
function stubMain(): void {
  const fs = require('node:fs');
  const path = require('node:path');
  const { createHash } = require('node:crypto');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const scoring = args.includes('noul');
  const stdin = scoring ? fs.readFileSync(0, 'utf8') : '';
  const key = scoring ? `${createHash('sha256').update(stdin).digest('hex')}|${args[args.indexOf('-q') + 1]}` : '';
  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
  const prior = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
  const rerun = prior.filter((line) => scoring && line.split('\t')[0] === name && line.split('\t')[2] === key).length;
  fs.appendFileSync(logPath, `${name}\t${args.join(' ')}\t${key}\n`);
  if (name === 'cli-deem' && args[0] === 'health') {
    if (env.STUB_HEALTH === 'stub') {
      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
      process.exit(3);
    }
    process.stdout.write('{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"stubmodel","source_commit":"stubsource"}\n');
  } else if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (scoring) {
    const table = env.STUB_ANSWERS ? JSON.parse(fs.readFileSync(env.STUB_ANSWERS, 'utf8')) : {};
    const entry = table[key];
    const position = Array.isArray(entry) ? entry[rerun % entry.length] : (entry ?? 0);
    const payload =
      name === 'cli-deem' && env.STUB_DEEM_TOP_LEVEL === '1'
        ? { noul: position }
        : { answers: { answer: { noul: position } } };
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else {
    process.exit(2);
  }
}

const STUB_SOURCE = `#!/usr/bin/env node\n(${stubMain.toString()})();\n`;

const TEMP_DIRS: string[] = [];

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  TEMP_DIRS.push(dir);
  return dir;
}

function makeStubs(): string {
  const stubDir = tempDir('completion-claim-stub-');
  for (const name of ['cli-deem', 'jev']) {
    writeFileSync(join(stubDir, name), STUB_SOURCE, { mode: 0o755 });
  }
  return stubDir;
}

type Run = {
  code: number | null;
  stdout: string;
  stderr: string;
  lines: string[];
  stubCalls: (name: string) => string[];
};

function runScript(args: string[], extraEnv: Record<string, string> = {}): Run {
  const stubDir = makeStubs();
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
    stubCalls: (name: string) => {
      const logPath = join(stubDir, `${name}.log`);
      if (!existsSync(logPath)) return [];
      return readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
    },
  };
}

// JSONL rows come back as plain string records; the verdict cases build their answer tables
// from the same fixture text the stub hashes.
function readJsonl(path: string): Record<string, string>[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as Record<string, string>);
}

// The stub keys a scoring call by its stdin hash together with the question.
function stubKey(rawText: string): string {
  return `${createHash('sha256').update(detectTail(rawText), 'utf8').digest('hex')}|${QUESTION}`;
}

// One score per labeled row, from the operator's claim, with an override for rows a case turns wrong or unmeasured.
function writeAnswers(
  rowsPath: string,
  labelsPath: string,
  answer: (id: string, claim: string) => number,
): string {
  const rawTextById = new Map(readJsonl(rowsPath).map((row) => [row.id, row.raw_text]));
  const table: Record<string, number> = {};
  for (const label of readJsonl(labelsPath)) {
    const rawText = rawTextById.get(label.id);
    if (rawText === undefined) throw new Error(`no row for label ${label.id}`);
    table[stubKey(rawText)] = answer(label.id, label.claim);
  }
  const file = join(tempDir('completion-claim-answers-'), 'answers.json');
  writeFileSync(file, JSON.stringify(table));
  return file;
}

describe('score-completion-claims', () => {
  afterEach(() => {
    for (const dir of TEMP_DIRS.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('census happy: rows, fires and per-word counts match the fixture', () => {
    const run = runScript(['--rows', fixture('census-happy')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 12 fires: 10');
    expect(run.lines[1]).toBe(
      'words: completed=1 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1',
    );
  });

  it('census edge: a claim word 500 characters before the end does not fire', () => {
    const run = runScript(['--rows', fixture('census-edge')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 1 fires: 0');
    expect(run.lines[1]).toBe(
      'words: completed=0 resolved=0 fixed=0 finished=0 shipped=0 released=0 deployed=0 implemented=0 occurred=0 happened=0',
    );
  });

  it('per-word split happy: one fired row per word counts each word once', () => {
    const run = runScript(['--rows', fixture('per-word-split-happy')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 10 fires: 10');
    expect(run.lines[1]).toBe(
      'words: completed=1 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1',
    );
  });

  it('per-word split edge: a tail holding fixed then completed counts under fixed only', () => {
    const run = runScript(['--rows', fixture('per-word-split-edge')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 1 fires: 1');
    expect(run.lines[1]).toBe(
      'words: completed=0 resolved=0 fixed=1 finished=0 shipped=0 released=0 deployed=0 implemented=0 occurred=0 happened=0',
    );
  });

  it('default run: no switch calls no stub and prints no fixture row text', () => {
    const rowsPath = fixture('census-happy');
    const run = runScript(['--rows', rowsPath]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 12 fires: 10');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);

    const texts = readFileSync(rowsPath, 'utf8')
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => (JSON.parse(line) as { raw_text: string }).raw_text);
    for (const text of texts) {
      for (let start = 0; start + 40 <= text.length; start += 1) {
        expect(run.stdout).not.toContain(text.slice(start, start + 40));
      }
    }
  });

  it('labels happy: 30 labels yield the sha line, the class counts and the planned gate', () => {
    const labelsPath = fixture('labels-happy');
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', labelsPath]);

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines).toContain(`labels: rows=30 sha256=${sha}`);
    expect(run.lines).toContain('labeled: 30 (yes 15, no 15)');
    expect(run.lines).toContain('regex accuracy: 27 of 30 = 0.9000');
    expect(run.lines).toContain('regex false fires: 2 (by word: resolved=1 fixed=1)');
    expect(run.lines).toContain('regex missed claims: 1 (by word: none)');
    expect(run.lines).toContain('margin: 0.10');
    expect(run.lines.at(-1)).toBe('planned calls: deem=30 jev=91');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('labels edge (unknown id): a label for an id absent from the rows file refuses the run', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-unknown-id')]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('labels row 1: unknown id not-in-rows');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('labels edge (bad value): a claim other than yes or no refuses the run', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-bad-value')]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('labels row 1: claim must be yes or no, got "maybe"');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('class gate edge: 30 labels with 4 no stop at the class floor without a call', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-class-gate')]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('labeled: 30 (yes 26, no 4)');
    expect(run.lines.at(-1)).toBe('stop: fewer than 5 labeled no rows');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('headroom edge: a regex right on 28 of 30 rows leaves no headroom for an arm', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-headroom')]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('regex accuracy: 28 of 30 = 0.9333');
    expect(run.lines.at(-1)).toBe('no headroom');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('out missing: --deem without --out refuses before any call', () => {
    const run = runScript(['--rows', fixture('census-happy'), '--deem']);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('--deem needs --out <dir> so every call is recorded');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('out inside repo: a report directory under the repository is refused', () => {
    const outDir = join(FIXTURES, 'tmp-out');
    const run = runScript(['--rows', fixture('census-happy'), '--deem', '--out', outDir]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('refused: report directory inside the repository');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('deem gate happy: a healthy backend and the planned gate open the arm path', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch' },
    );

    expect(run.code).toBe(0);
    expect(baseline.lines.at(-1)).toBe('planned calls: deem=30 jev=91');
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines).toContain(
      'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
    );
    expect(run.stdout).not.toContain('deem arm skipped:');
    expect(run.stubCalls('cli-deem')[0]).toContain('health');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('deem gate edge: a stub backend skips the arm and leaves the census byte-identical', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--deem', '--out', outDir],
      { STUB_HEALTH: 'stub' },
    );

    expect(run.code).toBe(0);
    expect(baseline.lines.at(-1)).toBe('planned calls: deem=30 jev=91');
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines).toContain('deem arm skipped: stub backend');
    expect(run.stdout).not.toContain('deem: health');
    expect(run.stubCalls('cli-deem')).toHaveLength(1);
    expect(run.stubCalls('cli-deem')[0]).toContain('health');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('verdict keep: 30 matching calls against 25 regex hits keep the column', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const answersPath = writeAnswers(fixture('labels-happy-rows'), labelsPath, (_id, claim) => (claim === 'yes' ? 1 : 0));
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath },
    );

    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      'deem: nothing leaves the machine; planned calls: 30; estimated wall time: 1.8 s at 60.5 ms per call, the noul p50 from deem-local.md',
    );
    expect(run.lines.some((line) => line.startsWith('column deem: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.lines).toContain('flips: n/a (commit pair)');

    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines.at(-1)).toBe(
      `verdict deem: keep K=30 M=30 A=30 B=25 W=5 L=0 F=n/a p_win=0.03125 p_loss=1.000 labels_sha256=${sha} model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource`,
    );

    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line !== '');
    expect(calls).toHaveLength(30);
    for (const line of calls) {
      const record = JSON.parse(line) as Record<string, unknown>;
      expect(record.backend).toBe('deem');
      expect(record.pass).toBe(0);
      expect(record.status).toBe('measured');
      expect(typeof record.wallMs).toBe('number');
      expect(typeof record.exitCode).toBe('number');
      expect(record.modelId).toBe('deem-0.8-v1');
      expect(record.modelCommit).toBe('stubmodel');
      expect(record.sourceCommit).toBe('stubsource');
    }
  });

  it('verdict kill: five losses with no win kill the column', () => {
    const labelsPath = fixture('verdict-kill-labels');
    const wrong = new Set([
      'h-completed',
      'h-resolved',
      'h-fixed',
      'h-finished',
      'h-shipped',
      'h-shipped-2',
      'h-false-fixed',
      'h-quiet-1',
      'h-quiet-2',
    ]);
    const answersPath = writeAnswers(fixture('verdict-kill-rows'), labelsPath, (id, claim) => {
      const yes = claim === 'yes';
      return wrong.has(id) ? (yes ? 0 : 1) : yes ? 1 : 0;
    });
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('verdict-kill-rows'), '--labels', labelsPath, '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath },
    );

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines.at(-1)).toBe(
      `verdict deem: kill K=34 M=34 A=25 B=30 W=0 L=5 F=n/a p_win=1.000 p_loss=0.03125 labels_sha256=${sha} model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource`,
    );
  });

  it('verdict stop (margin): two net correct calls sit under the ten-point margin', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const wrong = new Set(['h-completed', 'h-resolved', 'h-quiet-3']);
    const answersPath = writeAnswers(fixture('labels-happy-rows'), labelsPath, (id, claim) => {
      const yes = claim === 'yes';
      return wrong.has(id) ? (yes ? 0 : 1) : yes ? 1 : 0;
    });
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath },
    );

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines.at(-1)).toBe(
      `verdict deem: stop (margin) K=30 M=30 A=27 B=25 W=5 L=3 F=n/a p_win=0.3633 p_loss=0.8555 labels_sha256=${sha} model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource`,
    );
  });

  it('verdict stop (coverage): 26 measured rows stop the arm at the coverage floor', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const unmeasured = new Set(['h-quiet-4', 'h-quiet-5', 'h-quiet-6', 'h-quiet-7']);
    const answersPath = writeAnswers(fixture('labels-happy-rows'), labelsPath, (id, claim) => {
      if (unmeasured.has(id)) return 2;
      return claim === 'yes' ? 1 : 0;
    });
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath },
    );

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines.at(-1)).toBe(
      `verdict deem: stop (coverage) K=30 M=26 A=26 B=21 W=5 L=0 F=n/a p_win=0.03125 p_loss=1.000 labels_sha256=${sha} model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource`,
    );
  });

  it('deem edge (old answer shape): a top-level noul counts every row unmeasured', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const answersPath = writeAnswers(fixture('labels-happy-rows'), labelsPath, (_id, claim) => (claim === 'yes' ? 1 : 0));
    const outDir = tempDir('completion-claim-deem-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath, STUB_DEEM_TOP_LEVEL: '1' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('column deem: rows=30 measured=0 unmeasured=30 '))).toBe(true);
    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line !== '');
    expect(calls).toHaveLength(30);
    for (const line of calls) {
      expect((JSON.parse(line) as Record<string, unknown>).status).toBe('unmeasured');
    }
  });

  it('jev gate happy: the pinned version and a credential open the arm path', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--accept-payload', '--out', outDir],
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    expect(baseline.lines.at(-1)).toBe('planned calls: deem=30 jev=91');
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines.some((line) => /^jev: path=.*\/jev provider=official$/.test(line))).toBe(true);
    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
    expect(run.lines.some((line) => line.startsWith('column jev: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.stdout).not.toContain('jev arm skipped:');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev').filter((line) => line.includes('noul'))).toHaveLength(90);
  });

  it('jev gate edge: a rejected credential skips the arm and leaves the census byte-identical', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--accept-payload', '--out', outDir],
      { STUB_AUTH_STATUS_EXIT: '3' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines).toContain('jev arm skipped: no credential');
    expect(run.stdout).not.toContain('jev: auth test');
    expect(run.stubCalls('cli-deem')).toEqual([]);
    expect(run.stubCalls('jev')).toHaveLength(2);
  });

  it('payload gate edge: without --accept-payload the jev arm is skipped and deem still runs', () => {
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--deem', '--out', outDir],
      { STUB_HEALTH: 'torch' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('jev: path='))).toBe(true);
    expect(run.lines).toContain('jev arm skipped: payload not accepted');
    expect(run.stdout).not.toContain('jev: auth test');
    expect(run.lines).toContain(
      'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
    );
    expect(run.lines.some((line) => line.startsWith('column deem: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.stubCalls('jev')).toHaveLength(2);
    expect(run.stubCalls('cli-deem').filter((line) => line.includes('noul'))).toHaveLength(30);
  });

  it('verdict Jev stop (flips): three reruns that flip 2-1 on every row stop the jev arm', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const rawTextById = new Map(readJsonl(fixture('labels-happy-rows')).map((row) => [row.id, row.raw_text]));
    const table: Record<string, number[]> = {};
    for (const label of readJsonl(labelsPath)) {
      const rawText = rawTextById.get(label.id);
      if (rawText === undefined) throw new Error(`no row for label ${label.id}`);
      table[stubKey(rawText)] = label.claim === 'yes' ? [1, 1, 0] : [0, 0, 1];
    }
    const answersPath = join(tempDir('completion-claim-answers-'), 'answers.json');
    writeFileSync(answersPath, JSON.stringify(table));
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--jev', '--accept-payload', '--out', outDir],
      { STUB_ANSWERS: answersPath },
    );

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines.some((line) => line.startsWith('column jev: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.lines).toContain('flips: 30');
    expect(run.lines.at(-1)).toBe(
      `verdict jev: stop (flips) K=30 M=30 A=30 B=25 W=5 L=0 F=30 p_win=0.03125 p_loss=1.000 labels_sha256=${sha} jev_version=0.6.2 provider=official model=stub-model`,
    );

    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line !== '');
    expect(calls).toHaveLength(91);
    for (const line of calls) {
      const record = JSON.parse(line) as Record<string, unknown>;
      expect(record.backend).toBe('jev');
      expect(record.jevVersion).toBe('0.6.2');
      expect(record.provider).toBe('official');
      expect(record.model).toBe('stub-model');
    }
  });

  it('stored-report requalify: a report from another commit pair prints the requalify line', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const answersPath = writeAnswers(fixture('labels-happy-rows'), labelsPath, (_id, claim) => (claim === 'yes' ? 1 : 0));
    const outDir = tempDir('completion-claim-deem-out-');
    const args = ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--deem', '--out', outDir];

    const first = runScript(args, { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath });
    expect(first.code).toBe(0);
    expect(first.stdout).not.toContain('requalify:');

    const reportPath = join(outDir, 'report.json');
    const report = JSON.parse(readFileSync(reportPath, 'utf8')) as {
      K: number;
      gate: string;
      census: { rows: number; fires: number };
      regex: { B: number };
      columns: { deem: { modelCommit: string; sourceCommit: string } };
    };
    expect(report.K).toBe(30);
    expect(report.gate).toBe('planned');
    expect(report.census.rows).toBe(30);
    expect(report.census.fires).toBe(16);
    expect(report.regex.B).toBe(25);
    expect(report.columns.deem.modelCommit).toBe('stubmodel');
    expect(report.columns.deem.sourceCommit).toBe('stubsource');

    report.columns.deem.modelCommit = 'other-model-commit';
    report.columns.deem.sourceCommit = 'other-source-commit';
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

    const second = runScript(args, { STUB_HEALTH: 'torch', STUB_ANSWERS: answersPath });
    expect(second.code).toBe(0);
    expect(second.lines.at(-2)).toBe('requalify: model commit changed');
    expect(second.lines.at(-1)).toContain('verdict deem: keep');
    expect(second.lines.at(-1)).toContain('model_commit=stubmodel source_commit=stubsource');
  });
});
