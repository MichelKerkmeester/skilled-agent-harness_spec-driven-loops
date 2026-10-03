// ───────────────────────────────────────────────────────────────────
// MODULE: score-d4-agreement
//   Output census (listOutputs)
//   Fixture census (loadFixtures)
//   Output-to-fixture matching (matchOutputs)
//   Labels parser (parseLabels, sha256Hex)
//   Deterministic baseline (buildState, deterministicCall, chooseBaseline)
//   Keep rule (binomialTail, decideVerdict, summarizeColumn)

//   Jev arm (runJevArm)
//   Jev gate (jevGate, trackedFiles)
//   Arm helpers and report (spawnCall, buildReport)
//   Zero-call run (main)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const d4 = require(path.join(TEST_DIR, '../scorer/score-d4-agreement.cjs')) as Record<string, any>;
const scoreVariant = require(path.join(TEST_DIR, '../scorer/score-model-variant.cjs')) as Record<string, any>;
const graderHarness = require(path.join(TEST_DIR, '../scorer/grader/harness.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function writeFixtures(): string {
  const dir = tempDir('d4-fixtures-');
  fs.writeFileSync(
    path.join(dir, 'fx-a.json'),
    JSON.stringify({
      id: 'fx-a',
      task: 'Write add(a, b).',
      visibleSpec: 'add(1, 2) is 3',
      allowlist: { cli_flags: ['--dry-run'], symbols: ['add'] },
    }),
    'utf8',
  );
  fs.writeFileSync(
    path.join(dir, 'fx-b.json'),
    JSON.stringify({ id: 'fx-b', task: 'Write sub(a, b).', visibleSpec: 'sub(3, 1) is 2' }),
    'utf8',
  );
  fs.writeFileSync(path.join(dir, 'fx-c-file.json'), JSON.stringify({ id: 'fx-c', title: 'no task' }), 'utf8');
  return dir;
}

function writeOutputs(names: string[]): string {
  const dir = tempDir('d4-outputs-');
  for (const name of names) fs.writeFileSync(path.join(dir, name), `output for ${name}\n`, 'utf8');
  return dir;
}

function stubDir(bodies: Record<string, string>): string {
  const dir = tempDir('d4-stubs-');
  for (const [name, body] of Object.entries(bodies)) {
    const file = path.join(dir, name);
    fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
    fs.chmodSync(file, 0o755);
  }
  return dir;
}

async function runMain(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await d4.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    env: { ...env, JEV_TRANSPORT: 'jev' },
    timeoutMs: 5000,
    backoffMs: 1,
  });
  return { code, lines, errs };
}

function labeledSet(yesFlag: number, yesPlain: number, no: number): { outputs: string; fixtures: string; labels: string } {
  const fixtures = writeFixtures();
  const outputs = tempDir('d4-outputs-');
  const rows: string[] = [];
  for (let i = 1; i <= yesFlag + yesPlain + no; i += 1) {
    const name = `fx-b.run${i}.md`;
    let body = 'A plain correct answer.\n';
    if (i <= yesFlag) body = 'Use tool --force\nHALLUCINATED\n';
    else if (i <= yesFlag + yesPlain) body = 'The tool has a hidden mode.\nHALLUCINATED\n';
    fs.writeFileSync(path.join(outputs, name), body, 'utf8');
    rows.push(JSON.stringify({ output: name, hallucinated: i <= yesFlag + yesPlain ? 'yes' : 'no' }));
  }
  const labels = path.join(tempDir('d4-labels-'), 'labels.jsonl');
  fs.writeFileSync(labels, `${rows.join('\n')}\n`, 'utf8');
  return { outputs, fixtures, labels };
}

describe('benchmark fixture allowlists', () => {
  it('gives all 21 fixtures a symbol and flag allowlist', () => {
    const fixtures = d4.loadFixtures(d4.DEFAULT_FIXTURES_DIR);

    expect(fixtures.total).toBe(21);
    expect(fixtures.withAllowlist).toBe(21);
    for (const fixture of fixtures.byId.values()) {
      expect(fixture.allowlist).toEqual({
        cli_flags: expect.any(Array),
        symbols: expect.any(Array),
      });
      if (typeof fixture.fn_name === 'string') {
        expect(fixture.allowlist.symbols).toContain(fixture.fn_name);
      }
    }
  });
});

describe('5-dimension D4 grader integration', () => {
  it('retries a failed grader once and records the result as unmeasured', async () => {
    const gradeD4 = vi.spyOn(graderHarness, 'gradeD4');
    gradeD4
      .mockResolvedValueOnce({ score: 0, confidence: 0, parse_status: 'failed', error: 'bad response' })
      .mockResolvedValueOnce({ score: 0, confidence: 0, parse_status: 'failed', error: 'bad response' });

    const result = await scoreVariant.score({
      candidateId: 'failed-grade',
      outputText: 'A candidate result.',
      criteria: {},
      cwd: tempDir('scorer-cwd-'),
      graderKind: 'mock',
    });

    expect(gradeD4).toHaveBeenCalledTimes(2);
    expect(gradeD4.mock.calls[1][0].rubric_version).not.toBe(gradeD4.mock.calls[0][0].rubric_version);
    expect(result.grader).toMatchObject({
      score: null,
      confidence: null,
      parse_status: 'unmeasured',
      measured: false,
      attempts: 2,
    });
    expect(result.dimensions.D4).toBeNull();
    expect(result.unmeasuredDimensions).toContain('D4');
    expect(result.weightedScoreCoverage).toBeLessThan(1);
  });

  it('keeps the successful result when the first grader call fails', async () => {
    const gradeD4 = vi.spyOn(graderHarness, 'gradeD4');
    gradeD4
      .mockResolvedValueOnce({ score: 0, confidence: 0, parse_status: 'failed' })
      .mockResolvedValueOnce({ score: 0.8, confidence: 0.9, parse_status: 'ok' });

    const result = await scoreVariant.score({
      candidateId: 'retry-grade',
      outputText: 'A candidate result.',
      criteria: {},
      cwd: tempDir('scorer-cwd-'),
      graderKind: 'mock',
    });

    expect(gradeD4).toHaveBeenCalledTimes(2);
    expect(result.grader).toMatchObject({ score: 0.8, retried: true, attempts: 2 });
    expect(result.dimensions.D4).toBe(0.8);
  });

  it('forwards task, spec and allowlist into the grader fixture', async () => {
    const gradeD4 = vi.spyOn(graderHarness, 'gradeD4').mockResolvedValue({
      score: 0.9,
      confidence: 0.9,
      parse_status: 'ok',
    });
    const allowlist = { cli_flags: ['--dry-run'], symbols: ['add'] };

    await scoreVariant.score({
      candidateId: 'context-grade',
      outputText: 'A candidate result.',
      criteria: { task: 'Write add(a, b).', spec: 'add(1, 2) returns 3.', allowlist },
      cwd: tempDir('scorer-cwd-'),
      graderKind: 'mock',
    });

    expect(gradeD4).toHaveBeenCalledTimes(1);
    expect(gradeD4.mock.calls[0][0].fixture).toMatchObject({
      task: 'Write add(a, b).',
      spec: 'add(1, 2) returns 3.',
      visibleSpec: 'add(1, 2) returns 3.',
      allowlist,
    });
  });

  it('forwards a fixture-built criteria so task, visible spec and allowlist reach the grader', async () => {
    const gradeD4 = vi.spyOn(graderHarness, 'gradeD4').mockResolvedValue({
      score: 0.9,
      confidence: 0.9,
      parse_status: 'ok',
    });
    const fixture = d4.loadFixtures(writeFixtures()).byId.get('fx-a');

    const criteria = {
      acceptance: fixture.acceptance || [],
      requiredHeadings: fixture.requiredHeadings || [],
      requiredPatterns: fixture.requiredPatterns || [],
      task: fixture.task,
      visibleSpec: fixture.visibleSpec,
      allowlist: fixture.allowlist || {},
    };

    await scoreVariant.score({
      candidateId: 'fixture-context-grade',
      outputText: 'A candidate result.',
      criteria,
      cwd: tempDir('scorer-cwd-'),
      graderKind: 'mock',
    });

    expect(gradeD4).toHaveBeenCalledTimes(1);
    expect(gradeD4.mock.calls[0][0].fixture).toMatchObject({
      task: 'Write add(a, b).',
      visibleSpec: 'add(1, 2) is 3',
      allowlist: { cli_flags: ['--dry-run'], symbols: ['add'] },
    });
  });

  it('escalates a low-confidence primary through the dispute grader', async () => {
    const gradeD4 = vi.spyOn(graderHarness, 'gradeD4');
    gradeD4
      .mockResolvedValueOnce({ score: 0.4, confidence: 0.6, parse_status: 'ok' })
      .mockResolvedValueOnce({ score: 0.9, confidence: 0.8, parse_status: 'ok' });

    const result = await scoreVariant.score({
      candidateId: 'dispute-grade',
      outputText: 'A candidate result.',
      criteria: {},
      cwd: tempDir('scorer-cwd-'),
      graderKind: 'mock',
    });

    expect(gradeD4).toHaveBeenCalledTimes(2);
    expect(gradeD4.mock.calls[1][0].system_prompt_path).toContain('system-skeptic.md');
    expect(result.grader).toMatchObject({ score: 0.65, escalated: true, dispute: true });
  });
});

// The scorer is synthesized here, but the fixture-to-criteria forwarding under
// test lives in run-benchmark's 5-dim adapter. That module runs main() on load
// and exports nothing usable in-process, so the narrowest real entry point is a
// spawned run with a require-injected spy on the scorer's entry function. The
// spy records the criteria the adapter builds; a missing task/visibleSpec/
// allowlist in that record means the adapter dropped production context.
describe('run-benchmark 5-dim adapter forwards fixture context into the scorer', () => {
  it('passes the fixture task, visible spec and allowlist through to scorer.score', () => {
    const work = tempDir('d4-forward-');
    const fixtureDir = tempDir('d4-forward-fixtures-');
    fs.writeFileSync(
      path.join(fixtureDir, 'fx-forward.json'),
      JSON.stringify({
        id: 'fx-forward',
        task: 'Write mul(a, b).',
        visibleSpec: 'mul(2, 3) is 6',
        allowlist: { cli_flags: ['--dry-run'], symbols: ['mul'] },
        acceptance: [],
        requiredHeadings: [],
        requiredPatterns: [],
      }),
      'utf8',
    );
    const outputsDir = tempDir('d4-forward-outputs-');
    fs.writeFileSync(path.join(outputsDir, 'fx-forward.md'), 'a candidate output\n', 'utf8');

    const recordFile = path.join(work, 'criteria.json');
    const patchFile = path.join(work, 'spy-scorer.cjs');
    const scorerPath = path.join(TEST_DIR, '../scorer/score-model-variant.cjs');
    fs.writeFileSync(
      patchFile,
      [
        "'use strict';",
        "const fs = require('node:fs');",
        `const scorer = require(${JSON.stringify(scorerPath)});`,
        'scorer.score = async (opts) => {',
        "  fs.writeFileSync(process.env.SCORER_RECORD_FILE, JSON.stringify(opts.criteria));",
        '  return { weightedScore: 1, dimensions: { D1: 1, D2: 1, D3: 1, D4: 1, D5: 1 }, hard_gate_failed: false };',
        '};',
        '',
      ].join('\n'),
      'utf8',
    );
    const profilePath = path.join(work, 'profile.json');
    fs.writeFileSync(profilePath, JSON.stringify({ profileId: 'forward-profile', version: 1, fixtureDir }), 'utf8');

    const run = spawnSync(
      'node',
      [
        path.join(TEST_DIR, '../run-benchmark.cjs'),
        '--profile', profilePath,
        '--outputs-dir', outputsDir,
        '--output', path.join(work, 'report.json'),
        '--scorer=5dim',
        '--grader=noop',
      ],
      {
        encoding: 'utf8',
        env: { ...process.env, NODE_OPTIONS: `--require ${patchFile}`, SCORER_RECORD_FILE: recordFile },
      },
    );

    expect(run.status).toBe(0);
    const criteria = JSON.parse(fs.readFileSync(recordFile, 'utf8'));
    expect(criteria).toMatchObject({
      task: 'Write mul(a, b).',
      visibleSpec: 'mul(2, 3) is 6',
      allowlist: { cli_flags: ['--dry-run'], symbols: ['mul'] },
    });
  });
});

describe('score-d4-agreement census', () => {
  it('lists markdown files sorted by name, folding a run suffix into the id', () => {
    const dir = writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md', 'report.json']);
    fs.mkdirSync(path.join(dir, 'dir.md'));
    expect(d4.listOutputs(dir)).toEqual([
      { file: 'fx-a.md', id: 'fx-a' },
      { file: 'fx-b.run2.md', id: 'fx-b' },
      { file: 'fx-c.md', id: 'fx-c' },
      { file: 'orphan.md', id: 'orphan' },
    ]);
  });

  it('keys fixtures by their id field and matches outputs against them', () => {
    const fixtures = d4.loadFixtures(writeFixtures());
    expect(fixtures.total).toBe(3);
    expect(fixtures.withAllowlist).toBe(1);
    expect(fixtures.byId.has('fx-c')).toBe(true);
    expect(fixtures.byId.has('fx-c-file')).toBe(false);

    const outputs = d4.listOutputs(writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']));
    const { matched, unmatched } = d4.matchOutputs(outputs, fixtures);
    expect(matched.map((entry: { file: string }) => entry.file)).toEqual(['fx-a.md', 'fx-b.run2.md', 'fx-c.md']);
    expect(unmatched).toEqual([{ file: 'orphan.md', id: 'orphan' }]);
  });

  it('rejects a duplicate fixture id', () => {
    const dir = writeFixtures();
    fs.writeFileSync(path.join(dir, 'dup.json'), JSON.stringify({ id: 'fx-a' }), 'utf8');
    expect(() => d4.loadFixtures(dir)).toThrow('duplicate fixture id: fx-a');
  });
});

describe('score-d4-agreement labels', () => {
  it('parses one yes or no label per output and skips blank lines', () => {
    const labels = d4.parseLabels('{"output":"fx-a.md","hallucinated":"yes"}\n\n{"output":"fx-b.run2.md","hallucinated":"no"}\n');
    expect([...labels.entries()]).toEqual([['fx-a.md', 'yes'], ['fx-b.run2.md', 'no']]);
    expect(d4.sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('rejects a bad label value, a non-JSON row and a duplicate output, naming the row', () => {
    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"y.md","hallucinated":"maybe"}\n')).toThrow('labels row 2: hallucinated must be yes or no, got "maybe"');
    expect(() => d4.parseLabels('not json\n')).toThrow('labels row 1: not JSON');
    expect(() => d4.parseLabels('{"output":"x.md","hallucinated":"no"}\n{"output":"x.md","hallucinated":"yes"}\n')).toThrow('labels row 2: duplicate output x.md');
  });
});

describe('score-d4-agreement baseline', () => {
  it('reads an unlisted flag as yes and an allowlisted flag as no', () => {
    const fixtures = d4.loadFixtures(writeFixtures());
    const dir = writeOutputs([]);
    const file = path.join(dir, 'fx-a.md');
    fs.writeFileSync(file, 'Run: tool --dry-run\n');
    expect(d4.deterministicCall(fixtures.byId.get('fx-a'), file)).toBe('no');
    expect(d4.deterministicCall(fixtures.byId.get('fx-b'), file)).toBe('yes');
  });

  it('keeps the check on a tie and takes the majority class when the check does worse', () => {
    const tie = d4.chooseBaseline([
      { file: 'a', label: 'yes', check: 'no' },
      { file: 'b', label: 'no', check: 'no' },
    ]);
    expect(tie.method).toBe('check');
    expect(tie.right).toBe(1);
    expect(tie.majorityClass).toBe('no');

    const worse = d4.chooseBaseline([
      { file: 'a', label: 'yes', check: 'yes' },
      { file: 'b', label: 'no', check: 'yes' },
      { file: 'c', label: 'no', check: 'no' },
      { file: 'd', label: 'no', check: 'yes' },
    ]);
    expect(worse.method).toBe('majority');
    expect(worse.checkRight).toBe(2);
    expect(worse.majorityRight).toBe(3);
    expect(worse.right).toBe(3);
    expect([...worse.calls.values()]).toEqual(['no', 'no', 'no', 'no']);
  });

  it('builds the state from the task, the visible spec, the allowlist and the output', () => {
    const fixtures = d4.loadFixtures(writeFixtures());
    expect(d4.buildState(fixtures.byId.get('fx-a'), 'X')).toBe(
      'Task:\nWrite add(a, b).\n\nVisible spec:\nadd(1, 2) is 3\n\nAllowlist:\n{"cli_flags":["--dry-run"],"symbols":["add"]}\n\nOutput:\nX',
    );
    expect(d4.buildState(fixtures.byId.get('fx-c'), 'X')).toBe('Output:\nX');
  });
});

describe('score-d4-agreement keep rule', () => {
  it('keeps a column whose win tail is below 0.05 and whose loss tail is clean', () => {
    const verdict = d4.decideVerdict({ K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 });
    expect(verdict.outcome).toBe('keep');
    expect(verdict.reason).toBe(null);
    expect(d4.formatP(verdict.pWin)).toBe('0.0009766');
    expect(verdict.pLoss).toBe(1);
    expect(d4.binomialTail(5, 5).num).toBe(1n);
    expect(d4.binomialTail(5, 5).den).toBe(32n);
  });

  it('kills a column the baseline beats with a clean loss tail', () => {
    const verdict = d4.decideVerdict({ K: 30, M: 30, A: 20, B: 28, W: 0, L: 8, F: 0 });
    expect(verdict.outcome).toBe('kill');
    expect(verdict.reason).toBe(null);
  });

  it('stops a column short of the margin', () => {
    const verdict = d4.decideVerdict({ K: 30, M: 30, A: 24, B: 22, W: 5, L: 3, F: 0 });
    expect(verdict.outcome).toBe('stop');
    expect(verdict.reason).toBe('margin');
  });

  it('stops a column that measured too few rows', () => {
    const verdict = d4.decideVerdict({ K: 30, M: 26, A: 26, B: 10, W: 16, L: 0, F: 0 });
    expect(verdict.outcome).toBe('stop');
    expect(verdict.reason).toBe('coverage');
  });

  it('stops a rerun-sampled column whose reruns disagree', () => {
    const counts = { K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 };
    expect(d4.decideVerdict({ backend: 'jev', ...counts }).reason).toBe('flips');
  });

  it('summarizes a column from answers, baseline calls and labels', () => {
    const rows = [
      { file: 'a', label: 'yes' },
      { file: 'b', label: 'no' },
      { file: 'c', label: 'no' },
    ];
    const baselineCalls = new Map([
      ['a', 'no'],
      ['b', 'no'],
      ['c', 'no'],
    ]);
    const jev = d4.summarizeColumn(
      'jev',
      rows,
      new Map([
        ['a', [0.9, 0.8, 0.2]],
        ['b', [0.1, 0.1, 0.1]],
        ['c', [0.9, null, 0.9]],
      ]),
      baselineCalls,
      'abc',
      'jev_version=0.6.2 provider=official model=m',
    );
    expect(jev.K).toBe(3);
    expect(jev.M).toBe(2);
    expect(jev.A).toBe(2);
    expect(jev.B).toBe(1);
    expect(jev.W).toBe(1);
    expect(jev.L).toBe(0);
    expect(jev.F).toBe(1);
    expect(jev.line).toBe(
      'verdict jev: stop (coverage) K=3 M=2 A=2 B=1 W=1 L=0 F=1 p_win=0.5000 p_loss=1.000 labels_sha256=abc jev_version=0.6.2 provider=official model=m',
    );
  });
});

describe('score-d4-agreement zero-call run', () => {
  it('prints the zero-call report and runs no stub', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']);
    const stubs = stubDir({ jev: 'exit 0' });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };

    const { code, lines } = await runMain(['--outputs', outputs, '--fixtures', fixtures], env);

    expect(code).toBe(0);
    expect(lines).toEqual([
      'outputs: 4',
      'matched: 3',
      'unmatched: 1',
      'allowlist: 1 of 3',
      'labels: none',
      'labeled: 0 (yes 0, no 0)',
      'labels dropped: 0',
      'baseline check: right 0 of 0',
      'baseline majority: no right 0 of 0',
      'baseline method: check right 0 of 0',
      `question: ${d4.QUESTION}`,
      d4.MARGIN_LINE,
      d4.KEEP_RULE_LINE,
      d4.POWER_LINE,
      'stop: fewer than 30 labeled outputs',
    ]);
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
    expect(fs.readdirSync(outputs).sort()).toEqual(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']);
  });

  it('stops at the class gate when too few yes labels exist', async () => {
    const set = labeledSet(4, 0, 26);

    const { code, lines } = await runMain(['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels]);

    expect(code).toBe(0);
    expect(lines).toContain('labeled: 30 (yes 4, no 26)');
    expect(lines[lines.length - 1]).toBe('stop: fewer than 5 labeled yes outputs');
  });

  it('reports no headroom on a perfect check and the open gate otherwise', async () => {
    const perfect = labeledSet(10, 0, 20);
    const capped = await runMain(['--outputs', perfect.outputs, '--fixtures', perfect.fixtures, '--labels', perfect.labels]);
    expect(capped.code).toBe(0);
    expect(capped.lines[capped.lines.length - 1]).toBe('no headroom');

    const plain = labeledSet(0, 10, 20);
    const open = await runMain(['--outputs', plain.outputs, '--fixtures', plain.fixtures, '--labels', plain.labels]);
    expect(open.code).toBe(0);
    expect(open.lines).toContain('baseline method: check right 20 of 30');
    expect(open.lines[open.lines.length - 1]).toBe('planned calls: jev 91');
  });

  it('rejects an unknown flag, and refuses a missing --outputs and a bad label value', async () => {
    const outputs = writeOutputs(['fx-a.md']);

    const rejected = await runMain(['--outputs', outputs, '--bogus']);
    expect(rejected.code).toBe(2);
    expect(rejected.lines).toEqual([]);
    expect(rejected.errs).toEqual(["Unknown option '--bogus'"]);

    const arm = await runMain(['--outputs', outputs, '--jev']);
    expect(arm.code).toBe(2);
    expect(arm.lines).toEqual([]);
    expect(arm.errs).toEqual(['--jev needs --out <dir> so every call is recorded']);

    const bare = await runMain([]);
    expect(bare.code).toBe(2);
    expect(bare.errs).toEqual([d4.USAGE]);

    const labels = path.join(tempDir('d4-labels-'), 'labels.jsonl');
    fs.writeFileSync(labels, '{"output":"fx-a.md","hallucinated":"maybe"}\n', 'utf8');
    const bad = await runMain(['--outputs', outputs, '--fixtures', writeFixtures(), '--labels', labels]);
    expect(bad.code).toBe(2);
    expect(bad.errs).toEqual(['labels row 1: hallucinated must be yes or no, got "maybe"']);
  });
});



describe('score-d4-agreement jev gate', () => {
  const PASSING_JEV = 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 0;; esac';


  function jevEnv(stubs: string): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    return env;
  }

  it('prints the identity line and passes when auth status exits 0', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
    const stubs = stubDir({ jev: PASSING_JEV });
    const env = jevEnv(stubs);
    const argv = ['--outputs', outputs, '--fixtures', fixtures];
    const base = await runMain(argv, env);

    const { code, lines } = await runMain([...argv, '--jev', '--out', tempDir('d4-out-')], env);

    expect(code).toBe(0);
    expect(lines).toEqual([
      ...base.lines,
      `jev: path=${path.join(stubs, 'jev')} provider=official`,
      'jev arm skipped: label gate',
    ]);
    expect(fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n')).toEqual(['--version', 'auth status --provider official']);
  });

  it('skips with no credential or a wrong version, the rest byte-identical', async () => {
    const cases: Array<{ body: string; tail: (stubs: string) => string[] }> = [
      {
        body: 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 3;; esac',
        tail: () => ['jev arm skipped: no credential'],
      },
      {
        body: 'case "$1" in --version) echo \'0.2.3\';; esac',
        tail: (stubs) => ['jev arm skipped: version', `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`],
      },
    ];

    for (const { body, tail } of cases) {
      const fixtures = writeFixtures();
      const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
      const stubs = stubDir({ jev: body });
      const env = jevEnv(stubs);
      const argv = ['--outputs', outputs, '--fixtures', fixtures];
      const base = await runMain(argv, env);

      const { code, lines } = await runMain([...argv, '--jev', '--out', tempDir('d4-out-')], env);

      expect(code).toBe(0);
      expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
      expect(lines.slice(base.lines.length)).toEqual([
        `jev: path=${path.join(stubs, 'jev')} provider=official`,
        ...tail(stubs),
      ]);
    }
  });

  it('refuses untracked labeled outputs without --accept-payload', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: PASSING_JEV });
    const env = jevEnv(stubs);
    const argv = ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels];

    const { code, lines } = await runMain([...argv, '--jev', '--out', tempDir('d4-out-')], env);

    expect(code).toBe(0);
    expect(lines).toContain('jev arm skipped: payload not accepted');
    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log.some((line) => line.startsWith('noul') || line.startsWith('auth test'))).toBe(false);
  });
});

describe('score-d4-agreement report', () => {
  it('spawnCall feeds stdin, returns the exit code and kills a slow child', async () => {
    const ok = await d4.spawnCall('/bin/sh', ['-c', 'cat; exit 3'], 'hi', process.env, 5000);
    expect(ok.code).toBe(3);
    expect(ok.stdout).toBe('hi');
    expect(ok.timedOut).toBe(false);

    const slow = await d4.spawnCall('/bin/sh', ['-c', 'sleep 5'], '', process.env, 100);
    expect(slow.timedOut).toBe(true);
    expect(slow.code).toBe(null);
  });

  it('records a skipped jev arm in report.json and writes no call log', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\';; auth) [ "$2" = status ] && exit 3; exit 0;; esac' });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('d4-out-');

    const { code } = await runMain(['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--out', out], env);

    expect(code).toBe(0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.skipped.jev).toBe('jev arm skipped: no credential');
    expect(report.columns).toEqual({});
    expect(report.gate).toBe('planned calls: jev 91');
    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);
  });
});

describe('score-d4-agreement jev arm', () => {
  const JEV = `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) if [ "$2" = test ]; then echo '{"ok":true,"valid":true,"model":"stub-model"}'; fi; exit 0;; esac
p=$(cat); n=$(cat "$D/calls" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/calls"
case "$p" in *FLIP*) if [ $((n % 3)) -eq 0 ]; then v=0.1; else v=0.9; fi;; *HALLUCINATED*) v=0.9;; *) v=0.1;; esac
echo "{\\"answers\\":{\\"answer\\":{\\"noul\\":$v}}}"`;

  function readCalls(out: string): any[] {
    return fs
      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
  }

  function jevEnv(stubs: string): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    return env;
  }

  it('runs one auth test and three reruns per output under one provider and prints keep', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: JEV });
    const env = jevEnv(stubs);
    const out = tempDir('d4-out-');
    const sha = d4.sha256Hex(fs.readFileSync(set.labels));

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(0);
    expect(
      lines.some((line) =>
        line.startsWith(
          'jev: payload: untracked benchmark outputs and fixture task text; planned calls: 91; estimated input tokens: ',
        ),
      ),
    ).toBe(true);
    expect(lines).toContain('jev: auth test provider=official model=stub-model');
    expect(lines).toContain(
      `verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p_win=0.0009766 p_loss=1.000 labels_sha256=${sha} jev_version=0.6.2 provider=official model=stub-model`,
    );
    expect(lines).toContain('class jev yes: 10/10 (1.000) 95% CI [0.692, 1.000]');
    expect(lines).toContain('class jev no: 20/20 (1.000) 95% CI [0.832, 1.000]');

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.columns.jev.perClass.method).toBe('clopper-pearson');
    expect(report.columns.jev.perClass.yes.correct).toBe(10);
    expect(report.columns.jev.perClass.yes.total).toBe(10);
    expect(report.columns.jev.perClass.yes.interval.lower).toBeCloseTo(0.692, 3);
    expect(report.columns.jev.perClass.no.interval.lower).toBeCloseTo(0.832, 3);

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log).toHaveLength(93);
    expect(log.slice(0, 3)).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
    expect(log.slice(3)).toEqual(Array.from({ length: 90 }, () => `noul --provider official -q ${d4.QUESTION}`));

    const calls = readCalls(out);
    expect(calls).toHaveLength(91);
    for (const call of calls) {
      expect(call.provider).toBe('official');
      expect(call.model).toBe('stub-model');
      expect(call.jevVersion).toBe('0.6.2');
    }
  });

  it('records the selected transport on judgment calls', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: JEV });
    const env = jevEnv(stubs);
    const out = tempDir('d4-transport-out-');

    const { code } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(0);
    const judgmentCalls = readCalls(out).filter((call) => call.output !== null);
    expect(judgmentCalls).toHaveLength(90);
    expect(judgmentCalls.every((call) => call.transport === 'jev')).toBe(true);
  });

  it('reports the check-routed cascade arm and repeats its verdict without requalification', async () => {
    const set = labeledSet(10, 0, 20);
    const fixturePath = path.join(set.fixtures, 'fx-b.json');
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    fixture.allowlist = { cli_flags: [], symbols: [] };
    fs.writeFileSync(fixturePath, JSON.stringify(fixture, null, 2), 'utf8');
    for (let i = 1; i <= 10; i += 1) {
      fs.writeFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'inventedFunction()\nHALLUCINATED\n', 'utf8');
    }
    for (let i = 11; i <= 14; i += 1) {
      fs.writeFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'inventedFunction()\nA plain answer.\n', 'utf8');
    }

    const stubs = stubDir({ jev: JEV });
    const env = jevEnv(stubs);
    const out = tempDir('d4-cascade-out-');
    const args = [
      '--outputs', set.outputs,
      '--fixtures', set.fixtures,
      '--labels', set.labels,
      '--cascade',
      '--accept-payload',
      '--out', out,
    ];
    const first = await runMain(args, env);

    expect(first.code).toBe(0);
    expect(first.lines).toContain('cascade: routed 14 of 30 check-flagged outputs; model calls=42');
    expect(first.lines).toContain('class cascade yes: 10/10 (1.000) 95% CI [0.692, 1.000]');
    expect(first.lines).toContain('class cascade no: 20/20 (1.000) 95% CI [0.832, 1.000]');
    const calls = readCalls(out);
    expect(calls).toHaveLength(43);
    expect(calls.filter((call) => call.backend === 'cascade' && call.output !== null)).toHaveLength(42);

    const firstVerdict = first.lines.find((line) => line.startsWith('verdict cascade:'));
    const firstReport = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(firstReport.columns.cascade.routedRows).toBe(14);
    expect(firstReport.columns.cascade.modelCalls).toBe(42);
    expect(firstReport.columns.cascade.M).toBe(30);

    const second = await runMain(args, env);
    const secondVerdict = second.lines.find((line) => line.startsWith('verdict cascade:'));
    const secondReport = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(second.code).toBe(0);
    expect(secondVerdict).toBe(firstVerdict);
    expect(second.lines.some((line) => line.startsWith('requalify:'))).toBe(false);
    expect(secondReport.requalify.cascade).toBeNull();
  }, 20000);

  it('malformed Jev answers are failed calls and stop on coverage after requalification', async () => {
    const set = labeledSet(0, 10, 20);
    for (let i = 1; i <= 4; i += 1) fs.appendFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'MALFORMED\n');
    const malformedJev = JEV.replace(
      'case "$p" in *FLIP*)',
      `case "$p" in *MALFORMED*) echo '{'; exit 0;; *FLIP*)`,
    );
    const stubs = stubDir({ jev: malformedJev });
    const env = jevEnv(stubs);
    const out = tempDir('d4-out-');
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({
      labelsSha256: d4.sha256Hex(fs.readFileSync(set.labels)),
      columns: { jev: { provider: 'previous-provider', model: 'stub-model' } },
    }), 'utf8');

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(0);
    const calls = readCalls(out);
    expect(calls).toHaveLength(91);
    expect(calls.filter((call) => call.status === 'failed')).toHaveLength(12);
    expect(lines.some((line) => line.startsWith('column jev: K=30 measured=26 unmeasured=4 '))).toBe(true);
    const requalifyIndex = lines.indexOf('requalify: model changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.requalify.jev).toBe('requalify: model changed');
    expect(lines[requalifyIndex + 1]).toMatch(/^verdict jev: stop \(coverage\) K=30 M=26 /);
  });

  it('refuses requalification when the stored label SHA changes', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: JEV });
    const env = jevEnv(stubs);
    const out = tempDir('d4-out-');
    const previousReport = JSON.stringify({
      labelsSha256: 'previous-label-set',
      columns: { jev: { provider: 'official', model: 'stub-model' } },
    });
    fs.writeFileSync(path.join(out, 'report.json'), previousReport, 'utf8');

    const { code, errs } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(2);
    expect(errs).toContain('requalify refused: labels SHA changed for jev');
    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);
    expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
    expect(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).toBe(previousReport);
  });

  it('stops on flips when the reruns disagree', async () => {
    const set = labeledSet(0, 10, 20);
    for (let i = 1; i <= 10; i += 1) fs.appendFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'FLIP\n');
    const stubs = stubDir({ jev: JEV });
    const env = jevEnv(stubs);
    const out = tempDir('d4-out-');

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(0);
    expect(lines.some((line) => line.startsWith('verdict jev: stop (flips) K=30 M=30 A=30 B=20 W=10 L=0 F=10 '))).toBe(true);
  });

  it('stops with key rejected when the auth test exits 3', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) [ "$2" = test ] && exit 3; exit 0;; esac' });
    const env = jevEnv(stubs);
    const out = tempDir('d4-out-');

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--jev', '--accept-payload', '--out', out],
      env,
    );

    expect(code).toBe(0);
    expect(lines).toContain('jev arm stopped: key rejected');
    expect(lines).toContain('jev: partial rows=0');
    expect(lines.some((line) => line.startsWith('verdict jev:'))).toBe(false);
    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log.some((line) => line.startsWith('noul'))).toBe(false);
  });
});
