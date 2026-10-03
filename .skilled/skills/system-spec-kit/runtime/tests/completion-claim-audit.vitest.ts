// ───────────────────────────────────────────────────────────────────
// MODULE: Completion Claim Audit Tests
// ───────────────────────────────────────────────────────────────────
// Synthetic fixtures only; every script run has a stub jev binary first on PATH.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  KEEP_RULE_LINE,
  QUESTION,
  THRESHOLD_LINE,
  YES_THRESHOLD,
  classCounts,
  decideVerdict,
  detectTail,
  holdoutLabels,
  measureDetectorArms,
  regexErrors,
  summarizeColumn,
} from '../scripts/completion-claim-audit/score-completion-claims.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/completion-claim-audit/score-completion-claims.mjs');
const FIXTURES = resolve(HERE, 'completion-claim-audit-fixtures');
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..');

function fixture(name: string): string {
  return join(FIXTURES, `${name}.jsonl`);
}

function tempJsonl(prefix: string, rows: Record<string, string>[]): string {
  const path = join(tempDir(`${prefix}-`), 'input.jsonl');
  writeFileSync(path, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
  return path;
}

// Test double for the jev binary: it logs one line per call and answers from the STUB_* variables.
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
  if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (scoring) {
    const table = env.STUB_ANSWERS ? JSON.parse(fs.readFileSync(env.STUB_ANSWERS, 'utf8')) : {};
    const entry = table[key];
    const position = Array.isArray(entry) ? entry[rerun % entry.length] : (entry ?? 0);
    const response = env.STUB_TOP_LEVEL_NOUL === '1'
      ? { noul: position }
      : { answers: { answer: { noul: position } } };
    process.stdout.write(`${JSON.stringify(response)}\n`);
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
  for (const name of ['jev']) {
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
      JEV_TRANSPORT: 'jev',
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
      'words: completed=1 complete=0 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1',
    );
  });

  it('census edge: a claim word 500 characters before the end does not fire', () => {
    const run = runScript(['--rows', fixture('census-edge')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 1 fires: 0');
    expect(run.lines[1]).toBe(
      'words: completed=0 complete=0 resolved=0 fixed=0 finished=0 shipped=0 released=0 deployed=0 implemented=0 occurred=0 happened=0',
    );
  });

  it('per-word split happy: one fired row per word counts each word once', () => {
    const run = runScript(['--rows', fixture('per-word-split-happy')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 10 fires: 10');
    expect(run.lines[1]).toBe(
      'words: completed=1 complete=0 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1',
    );
  });

  it('per-word split edge: a tail holding fixed then completed counts under fixed only', () => {
    const run = runScript(['--rows', fixture('per-word-split-edge')]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 1 fires: 1');
    expect(run.lines[1]).toBe(
      'words: completed=0 complete=0 resolved=0 fixed=1 finished=0 shipped=0 released=0 deployed=0 implemented=0 occurred=0 happened=0',
    );
  });

  it('records the baseline, each detector fix, and the shipped detector as aggregate counts', () => {
    const rows = new Map([
      ['complete', { id: 'complete', raw_text: 'The patch is complete.' }],
      ['checklist', { id: 'checklist', raw_text: '- [x] The patch is completed.' }],
      ['code', { id: 'code', raw_text: '```js\nThe patch is fixed.\n```' }],
      ['long', { id: 'long', raw_text: `The patch was fixed.${'x'.repeat(180)}` }],
      ['question', { id: 'question', raw_text: 'Was the release fixed?' }],
      ['table', { id: 'table', raw_text: '| Result | completed |' }],
      ['assignment', { id: 'assignment', raw_text: "status = 'fixed';" }],
    ]);
    const labels = new Map<string, 'yes' | 'no'>([
      ['complete', 'yes'], ['checklist', 'yes'], ['code', 'yes'], ['long', 'yes'],
      ['question', 'no'], ['table', 'no'], ['assignment', 'no'],
    ]);

    expect(measureDetectorArms(labels, rows)).toEqual({
      today: { claimsCaught: 3, falseFires: 3 },
      complete: { claimsCaught: 4, falseFires: 3 },
      anchor: { claimsCaught: 2, falseFires: 3 },
      both: { claimsCaught: 3, falseFires: 3 },
      shipped: { claimsCaught: 1, falseFires: 1 },
    });
  });

  it('labels event-word positives with an explicit completed repair', () => {
    const rows = readJsonl(fixture('labels-happy-rows'));
    const occurred = rows.find((row) => row.id === 'h-occurred')?.raw_text;
    const happened = rows.find((row) => row.id === 'h-happened')?.raw_text;

    expect(occurred).toMatch(/fix was implemented/i);
    expect(happened).toMatch(/repair was released/i);
  });

  it('attributes a missed claim only to a whole claim word', () => {
    const labels = new Map<string, 'yes' | 'no'>([['x', 'yes']]);
    const rows = new Map([['x', { id: 'x', raw_text: 'The string is unfixed.' }]]);

    expect(regexErrors(labels, rows).byWord.missedClaims).toEqual({});
  });

  it('splits a stable, class-balanced holdout independently of input order', () => {
    const labels = new Map<string, 'yes' | 'no'>([
      ...Array.from({ length: 15 }, (_, index) => [`yes-${index}`, 'yes'] as const),
      ...Array.from({ length: 15 }, (_, index) => [`no-${index}`, 'no'] as const),
    ]);
    const reordered = new Map([...labels].reverse());
    const holdout = holdoutLabels(labels);
    const reorderedHoldout = holdoutLabels(reordered);

    expect(classCounts(holdout)).toEqual({ yes: 8, no: 8 });
    expect([...holdout.keys()].sort()).toEqual([...reorderedHoldout.keys()].sort());
  });

  it('uses the pre-registered threshold at 0.70 for one-call judgments', () => {
    const labeled = new Map([['x', { claim: 'yes' as const, fired: false }]]);
    const below = summarizeColumn({
      backend: 'jev-one-call', K: 1, labeled, answers: new Map([['x', 0.69]]),
    });
    const at = summarizeColumn({
      backend: 'jev-one-call', K: 1, labeled, answers: new Map([['x', 0.70]]),
    });

    expect(YES_THRESHOLD).toBe(0.70);
    expect(THRESHOLD_LINE).toBe('judge threshold: 0.70 (pre-registered)');
    expect(KEEP_RULE_LINE).toContain('one-call arm <= K judgments');
    expect(KEEP_RULE_LINE).toContain('reference arm = 3*K judgments');
    expect(below.A).toBe(0);
    expect(at.A).toBe(1);
  });

  it('default run: no switch calls no stub and prints no fixture row text', () => {
    const rowsPath = fixture('census-happy');
    const run = runScript(['--rows', rowsPath]);

    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe('rows: 12 fires: 10');
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

  it('a Jev output directory inside the repository is refused before any call', () => {
    const outDir = join(REPO_ROOT, `.completion-claim-guard-${process.pid}-${Date.now()}`);
    try {
      const run = runScript(['--rows', fixture('census-happy'), '--jev', '--out', outDir]);

      expect(run.code).toBe(2);
      expect(run.stdout).toBe('');
      expect(run.stderr).toContain('refused: report directory inside the repository');
      expect(run.stubCalls('jev')).toEqual([]);
      expect(existsSync(outDir)).toBe(false);
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('a Jev run without --out is refused before any call', () => {
    const run = runScript(['--rows', fixture('census-happy'), '--jev']);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('--jev needs --out <dir> so every call is recorded');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('labels happy: 30 labels yield the sha line, the class counts and the planned gate', () => {
    const labelsPath = fixture('labels-happy');
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', labelsPath]);

    expect(run.code).toBe(0);
    const sha = createHash('sha256').update(readFileSync(labelsPath, 'utf8'), 'utf8').digest('hex');
    expect(run.lines).toContain(`labels: rows=30 sha256=${sha}`);
    expect(run.lines).toContain('labeled: 30 (yes 15, no 15)');
    expect(run.lines).toContain(THRESHOLD_LINE);
    expect(run.lines).toContain('regex accuracy: 27 of 30 = 0.9000');
    expect(run.lines).toContain('regex false fires: 2 (by word: resolved=1 fixed=1)');
    expect(run.lines).toContain('regex missed claims: 1 (by word: none)');
    expect(run.lines).toContain('detector arm today: claims_caught=14 false_fires=2');
    expect(run.lines).toContain('detector arm complete: claims_caught=14 false_fires=2');
    expect(run.lines).toContain('detector arm anchor: claims_caught=14 false_fires=2');
    expect(run.lines).toContain('detector arm both: claims_caught=14 false_fires=2');
    expect(run.lines).toContain('detector arm shipped: claims_caught=14 false_fires=2');
    expect(run.lines).toContain('margin: 0.10');
    expect(run.lines.at(-1)).toBe('planned calls: jev=91 one-call=31');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('rejects duplicate row IDs before printing the census', () => {
    const rowsPath = tempJsonl('completion-claim-duplicate-rows', [
      { id: 'duplicate', raw_text: 'The patch is complete.' },
      { id: 'duplicate', raw_text: 'The release is shipped.' },
    ]);
    const run = runScript(['--rows', rowsPath]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('rows row 2: duplicate id duplicate');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('rejects duplicate label IDs before printing the census', () => {
    const rowsPath = tempJsonl('completion-claim-label-rows', [
      { id: 'same', raw_text: 'The patch is complete.' },
    ]);
    const labelsPath = tempJsonl('completion-claim-duplicate-labels', [
      { id: 'same', claim: 'yes' },
      { id: 'same', claim: 'no' },
    ]);
    const run = runScript(['--rows', rowsPath, '--labels', labelsPath]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('labels row 2: duplicate id same');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('holdout CLI flag prints a repeatable, class-balanced half sample', () => {
    const args = ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--holdout'];
    const first = runScript(args);
    const second = runScript(args);

    expect(first.code).toBe(0);
    expect(first.lines).toEqual(second.lines);
    expect(first.lines).toContain('labels: rows=16 split=holdout sha256=' + createHash('sha256').update(readFileSync(fixture('labels-happy'), 'utf8'), 'utf8').digest('hex'));
    expect(first.lines).toContain('labeled: 16 (yes 8, no 8)');
    expect(first.lines).toContain(THRESHOLD_LINE);
    expect(first.stubCalls('jev')).toEqual([]);
  });

  it('holdout flag requires a label file', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--holdout']);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('--holdout needs --labels <file>');
  });

  it('one-call flag requires the Jev gate', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--one-call']);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('--one-call needs --jev');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('labels edge (unknown id): a label for an id absent from the rows file refuses the run', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-unknown-id')]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('labels row 1: unknown id not-in-rows');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('labels edge (bad value): a claim other than yes or no refuses the run', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-bad-value')]);

    expect(run.code).toBe(2);
    expect(run.stdout).toBe('');
    expect(run.stderr).toContain('labels row 1: claim must be yes or no, got "maybe"');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('class gate edge: 30 labels with 4 no stop at the class floor without a call', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-class-gate')]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('labeled: 30 (yes 26, no 4)');
    expect(run.lines.at(-1)).toBe('stop: fewer than 5 labeled no rows');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('headroom edge: a regex right on 28 of 30 rows leaves no headroom for an arm', () => {
    const run = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-headroom')]);

    expect(run.code).toBe(0);
    expect(run.lines).toContain('regex accuracy: 28 of 30 = 0.9333');
    expect(run.lines.at(-1)).toBe('no headroom');
    expect(run.stubCalls('jev')).toEqual([]);
  });

  it('jev gate happy: the pinned version and a credential open the arm path', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--accept-payload', '--out', outDir],
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    expect(baseline.lines.at(-1)).toBe('planned calls: jev=91 one-call=31');
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines.some((line) => /^jev: path=.*\/jev provider=official$/.test(line))).toBe(true);
    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
    expect(run.lines.some((line) => line.startsWith('column jev: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.stdout).not.toContain('jev arm skipped:');
    expect(run.stubCalls('jev').filter((line) => line.includes('noul'))).toHaveLength(90);
  });

  it('one-call arm records one judgment per label and reports its lower cost', () => {
    const baseline = runScript(['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy')]);
    const outDir = tempDir('completion-claim-one-call-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--one-call', '--accept-payload', '--out', outDir],
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines.some((line) => line.startsWith('one-call: payload: the operator\'s session text, secrets stripped by the operator; planned calls: 31; estimated input tokens:'))).toBe(true);
    expect(run.lines.some((line) => line.startsWith('column jev-one-call: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.lines.some((line) => line.startsWith('verdict jev-one-call: '))).toBe(true);

    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8')
      .split('\n').filter((line) => line !== '').map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(calls).toHaveLength(31);
    expect(calls.every((call) => call.backend === 'jev-one-call')).toBe(true);
    expect(calls.filter((call) => typeof call.rowId === 'string')).toHaveLength(30);
    const report = JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8'));
    expect(report.columns['jev-one-call'].K).toBe(30);
    expect(report.judgeThreshold).toBe(0.70);
    expect(report.detectorArms.shipped).toEqual({ claimsCaught: 14, falseFires: 2 });
  });

  it('records the selected transport on judgment calls', () => {
    const outDir = tempDir('completion-claim-transport-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--one-call', '--accept-payload', '--out', outDir],
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8')
      .split('\n').filter((line) => line !== '').map((line) => JSON.parse(line) as Record<string, unknown>);
    const judgmentCalls = calls.filter((call) => typeof call.rowId === 'string');
    expect(judgmentCalls).toHaveLength(30);
    expect(judgmentCalls.every((call) => call.transport === 'jev')).toBe(true);
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
    expect(run.stubCalls('jev')).toHaveLength(2);
  });

  it('payload gate edge: without --accept-payload the jev arm is skipped', () => {
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--out', outDir],
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('jev: path='))).toBe(true);
    expect(run.lines).toContain('jev arm skipped: payload not accepted');
    expect(run.stdout).not.toContain('jev: auth test');
    expect(run.stubCalls('jev')).toHaveLength(2);
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

  it('verdict keep: a Jev column that clears the win rule keeps', () => {
    expect(decideVerdict({ backend: 'jev', K: 30, M: 30, A: 30, B: 25, W: 5, L: 0, F: 0 }).verdict).toBe('keep');
  });

  it('verdict kill: five Jev losses with no win kill the column', () => {
    expect(decideVerdict({ backend: 'jev', K: 34, M: 34, A: 25, B: 30, W: 0, L: 5, F: 0 }).verdict).toBe('kill');
  });

  it('verdict stop (margin): two net Jev wins sit under the margin', () => {
    expect(decideVerdict({ backend: 'jev', K: 30, M: 30, A: 27, B: 25, W: 5, L: 3, F: 0 }).verdict).toBe('stop (margin)');
  });

  it('verdict stop (coverage): 26 measured Jev rows stop at the coverage floor', () => {
    expect(decideVerdict({ backend: 'jev', K: 30, M: 26, A: 26, B: 21, W: 5, L: 0, F: 0 }).verdict).toBe('stop (coverage)');
  });

  it('a top-level Jev answer stays unmeasured', () => {
    const labelsPath = fixture('verdict-keep-labels');
    const outDir = tempDir('completion-claim-jev-out-');
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', labelsPath, '--jev', '--accept-payload', '--out', outDir],
      { STUB_TOP_LEVEL_NOUL: '1' },
    );

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => line.startsWith('column jev: rows=30 measured=0 unmeasured=30 '))).toBe(true);
    const calls = readFileSync(join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line !== '').map((line) => JSON.parse(line) as Record<string, unknown>);
    const rowCalls = calls.filter((call) => typeof call.rowId === 'string');
    expect(rowCalls).toHaveLength(90);
    expect(rowCalls.every((call) => call.status === 'unmeasured' && call.noul === null)).toBe(true);
    expect(run.lines.at(-1)).toMatch(/^verdict jev: stop \(coverage\) K=30 M=0 /);
  });

  it('a stored Jev identity requalifies before the verdict', () => {
    const outDir = tempDir('completion-claim-jev-out-');
    writeFileSync(
      join(outDir, 'report.json'),
      JSON.stringify({ columns: { jev: { provider: 'openrouter', model: 'stub-model' } } }),
    );
    const run = runScript(
      ['--rows', fixture('labels-happy-rows'), '--labels', fixture('labels-happy'), '--jev', '--accept-payload', '--out', outDir],
      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
    );

    expect(run.code).toBe(0);
    const requalifyIndex = run.lines.indexOf('requalify: model changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(run.lines[requalifyIndex + 1]).toMatch(/^verdict jev: /);
    const report = JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8'));
    expect(report.requalify.jev).toBe('requalify: model changed');
  });
});
