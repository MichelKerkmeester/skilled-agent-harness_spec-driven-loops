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

import { QUESTION, detectTail } from '../scripts/completion-claim-audit/score-completion-claims.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/completion-claim-audit/score-completion-claims.mjs');
const FIXTURES = resolve(HERE, 'completion-claim-audit-fixtures');

function fixture(name: string): string {
  return join(FIXTURES, `${name}.jsonl`);
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
    process.stdout.write(`${JSON.stringify({ answers: { answer: { noul: position } } })}\n`);
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
    expect(run.lines.at(-1)).toBe('planned calls: jev=91');
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
    expect(baseline.lines.at(-1)).toBe('planned calls: jev=91');
    expect(run.lines.slice(0, baseline.lines.length)).toEqual(baseline.lines);
    expect(run.lines.some((line) => /^jev: path=.*\/jev provider=official$/.test(line))).toBe(true);
    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
    expect(run.lines.some((line) => line.startsWith('column jev: rows=30 measured=30 unmeasured=0 '))).toBe(true);
    expect(run.stdout).not.toContain('jev arm skipped:');
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
});
