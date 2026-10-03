// ───────────────────────────────────────────────────────────────────
// MODULE: score-verdict-fallback
//   Fixture census (resolveProfile, loadFixtureCases, censusFixtures)
//   Outputs parser (parseOutputs, censusOutputs)
//   Reports reader (censusReports)
//   Baselines (loosePick, chooseBaseline)
//   Keep rule (binomialTail, decideVerdict, formatP, modalPick, summarizeColumn)
//   Zero-call run (main)

// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const vf = require(path.join(TEST_DIR, '../lib/score-verdict-fallback.cjs')) as Record<string, any>;
const reviewerScorer = require(path.join(TEST_DIR, '../lib/reviewer-scorer.cjs')) as Record<string, any>;
const REVIEWER_PROFILE = path.resolve(TEST_DIR, '../../../assets/model-benchmark/benchmark-profiles/reviewer-regression.json');

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function writeFixtures(): { profile: string; fixtures: string } {
  const fixtures = tempDir('vf-fixtures-');
  fs.writeFileSync(
    path.join(fixtures, 'fx-a.json'),
    JSON.stringify({
      id: 'fx-a',
      tests: [
        { name: 'visible clean', reviewer_output: 'VERDICT: PASS\nlooks good' },
        { name: 'visible informal', reviewer_output: 'Looks fine to ship.' },
      ],
      hidden_tests: [{ name: 'hidden failure', reviewer_output: 'VERDICT: FAIL\nstale evidence' }],
    }),
    'utf8',
  );
  fs.writeFileSync(
    path.join(fixtures, 'fx-b.json'),
    JSON.stringify({
      id: 'fx-b',
      tests: [{ name: 'fx-b', reviewer_output: 'VERDICT: BLOCK\ncannot judge' }],
      hidden_tests: [{ name: 'hidden silent' }],
    }),
    'utf8',
  );
  const profile = path.join(tempDir('vf-profile-'), 'profile.json');
  fs.writeFileSync(
    profile,
    JSON.stringify({ profileId: 'vf-temp', fixtureDir: fixtures, fixtures: ['fx-a', 'fx-b'] }),
    'utf8',
  );
  return { profile, fixtures };
}

function writeOutputs(rows: Array<{ id: string; output: string; label: string }>): string {
  const file = path.join(tempDir('vf-outputs-'), 'outputs.jsonl');
  fs.writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
  return file;
}

function stubDir(bodies: Record<string, string>): string {
  const dir = tempDir('vf-stubs-');
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
  const code = await vf.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    env: { ...env, JEV_TRANSPORT: 'jev' },
    timeoutMs: 5000,
    backoffMs: 1,
  });
  return { code, lines, errs };
}

describe('score-verdict-fallback fixtures', () => {
  it('merges visible and hidden cases', () => {
    const { profile } = writeFixtures();

    const cases = vf.loadFixtureCases(profile);

    expect(cases).toEqual([
      { fixtureId: 'fx-a', name: 'visible clean', output: 'VERDICT: PASS\nlooks good' },
      { fixtureId: 'fx-a', name: 'visible informal', output: 'Looks fine to ship.' },
      { fixtureId: 'fx-a', name: 'hidden failure', output: 'VERDICT: FAIL\nstale evidence' },
      { fixtureId: 'fx-b', name: 'fx-b', output: 'VERDICT: BLOCK\ncannot judge' },
      { fixtureId: 'fx-b', name: 'hidden silent', output: null },
    ]);
    const census = vf.censusFixtures(cases);
    expect(census).toEqual({ total: 5, hits: 3, misses: 1, noOutput: 1 });
  });

  it('a case with no reviewer_output', () => {
    const { profile } = writeFixtures();
    const stubs = stubDir({ jev: 'exit 0' });

    const census = vf.censusFixtures(vf.loadFixtureCases(profile));

    expect(census.noOutput).toBe(1);
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });

  it('loads inline miss fixtures from reviewer-regression', () => {
    const cases = vf.loadFixtureCases(REVIEWER_PROFILE);
    const census = vf.censusFixtures(cases);

    expect(census).toEqual({ total: 10, hits: 8, misses: 2, noOutput: 0 });
    expect(cases.slice(-2).map((entry: any) => entry.fixtureId)).toEqual([
      'reviewer-miss-unsafe-evidence',
      'reviewer-miss-no-decision',
    ]);
  });
});

describe('reviewer-scorer verdict parsing and grader', () => {
  it.each([
    ['**VERDICT: FAIL**', 'fail'],
    ['Verdict: **FAIL**', 'fail'],
    ['# VERDICT: FAIL', 'fail'],
    ['Final verdict: pass', 'pass'],
    ['Verdict: FAIL (stale evidence)', 'fail'],
  ])('reads the strict text form %s', (output, expected) => {
    expect(reviewerScorer.extractVerdict(output)).toEqual({ verdict: expected, method: 'pattern' });
  });

  it('rejects verdict mentions and examples away from the whole-line contract', () => {
    expect(reviewerScorer.extractVerdict('The reviewer wrote VERDICT: FAIL in an example.').verdict).toBe(null);
    expect(reviewerScorer.extractVerdict('Do not use this example:\n> VERDICT: FAIL').verdict).toBe(null);
    expect(reviewerScorer.extractVerdict('```text\nVERDICT: FAIL\n```').verdict).toBe(null);
    expect(reviewerScorer.extractVerdict('The verdict is not pass.').verdict).toBe(null);
  });

  it('asks the reviewer prompt for a typed JSON verdict', () => {
    const prompt = reviewerScorer.buildReviewerPrompt({ prompt_template: 'Review {{input}}', input: 'the change' });

    expect(prompt).toContain('top-level "verdict" field set to PASS, FAIL, BLOCK, or ABSTAIN');
    expect(prompt).toContain('findings in a "findings" array');
  });

  it('reads the typed verdict before conflicting text and fails closed on an invalid typed value', () => {
    const parsed = reviewerScorer.extractVerdict('{"verdict":"FAIL","note":"VERDICT: PASS"}');
    const invalid = reviewerScorer.extractVerdict('{"verdict":"uncertain","note":"VERDICT: PASS"}');

    expect(parsed).toEqual({ verdict: 'fail', method: 'typed' });
    expect(invalid).toEqual({ verdict: null, method: 'typed-invalid' });
  });

  it('the opted-in Jev grader can abstain on no-decision prose', () => {
    let calls = 0;
    const scored = reviewerScorer.scoreReviewerOutput(
      'The available material does not support a conclusion about this change.',
      { expectedVerdict: 'abstain' },
      { grader: 'jev', jevChoice: () => { calls += 1; return 'abstain'; } },
    );

    expect(calls).toBe(1);
    expect(scored).toMatchObject({ extractedVerdict: 'abstain', verdictMethod: 'jev-grader', verdictOk: true });
  });

  it('keeps unknown Jev grader answers unresolved', () => {
    const scored = reviewerScorer.scoreReviewerOutput(
      'The reviewer output has no decision.',
      { expectedVerdict: 'pass' },
      { grader: 'jev', jevChoice: () => 'maybe' },
    );

    expect(scored).toMatchObject({ extractedVerdict: null, verdictMethod: 'jev-grader', verdictOk: false });
  });

  it('runs opt-in Jev grading only on the two regression miss fixtures', () => {
    const fixtureOnly = reviewerScorer.runReviewerBenchmark({ profile: REVIEWER_PROFILE, grader: 'noop' });
    const graded: string[] = [];
    const jevRun = reviewerScorer.runReviewerBenchmark({
      profile: REVIEWER_PROFILE,
      grader: 'jev',
      jevChoice: (output: string) => {
        graded.push(output);
        return output.includes('stale') ? 'fail' : 'abstain';
      },
    });

    expect(fixtureOnly.totals.fixtures).toBe(4);
    expect(fixtureOnly.rows.map((row: any) => row.id)).not.toContain('reviewer-miss-no-decision');
    expect(graded).toHaveLength(2);
    expect(jevRun.rows.find((row: any) => row.id === 'reviewer-miss-no-decision').per_test[0].extractedVerdict).toBe('abstain');
  });

  it('a noop run scores the four profile fixtures at aggregate 100 with benchmark-pass', () => {
    const noopRun = reviewerScorer.runReviewerBenchmark({ profile: REVIEWER_PROFILE, grader: 'noop' });

    expect(noopRun.totals.fixtures).toBe(4);
    expect(noopRun.aggregateScore).toBe(100);
    expect(noopRun.recommendation).toBe('benchmark-pass');
  });
});

describe('score-verdict-fallback outputs', () => {
  it('parses one labeled row per line', () => {
    const rows: string[] = [];
    for (let i = 1; i <= 12; i += 1) {
      rows.push(
        JSON.stringify({
          id: `row-${i}`,
          output: i === 1 ? 'VERDICT: PASS\nlooks good' : `Reviewer note ${i}.`,
          label: i % 3 === 0 ? 'block' : i % 2 === 0 ? 'fail' : 'pass',
          expectedVerdict: 'fail',
        }),
      );
    }

    const parsed = vf.parseOutputs(`${rows.join('\n')}\n`);

    expect(parsed).toHaveLength(12);
    expect(parsed[0]).toEqual({ id: 'row-1', output: 'VERDICT: PASS\nlooks good', label: 'pass', expectedVerdict: 'fail' });
    expect(parsed[11]).toEqual({ id: 'row-12', output: 'Reviewer note 12.', label: 'block', expectedVerdict: 'fail' });
    expect(parsed.map((row: any) => row.expectedVerdict)).toEqual(Array(12).fill('fail'));
    expect(vf.censusOutputs(parsed)).toEqual({ total: 12, hits: 1, misses: 11, kept: parsed.slice(1) });
  });

  it('a bad label exits 2 naming the row', () => {
    const rows = [
      JSON.stringify({ id: 'row-1', output: 'Reviewer note 1.', label: 'pass' }),
      JSON.stringify({ id: 'row-2', output: 'Reviewer note 2.', label: 'maybe' }),
    ];

    expect(() => vf.parseOutputs(`${rows.join('\n')}\n`)).toThrow(
      'outputs row 2: label must be pass, fail or block, got "maybe"',
    );
  });
});

describe('score-verdict-fallback reports', () => {
  it('counts per_test verdictMethod', () => {
    const reports = tempDir('vf-reports-');
    const rows = [
      {
        per_test: [
          { name: 'pattern case', verdictMethod: 'pattern' },
          { name: 'grader case', verdictMethod: 'llm-grader' },
          { name: 'Jev grader case', verdictMethod: 'jev-grader' },
          { name: 'silent case', verdictMethod: 'none' },
        ],
      },
    ];
    fs.writeFileSync(
      path.join(reports, 'reviewer-report.json'),
      JSON.stringify({ rows, fixtures: rows }),
      'utf8',
    );

    const census = vf.censusReports([reports]);

    expect(census).toEqual([
      { path: path.join(reports, 'reviewer-report.json'), pattern: 1, llmGrader: 1, jevGrader: 1, none: 1 },
    ]);
  });
});

describe('score-verdict-fallback baselines', () => {
  it('takes the last whole word, case-insensitive', () => {
    expect(vf.loosePick('please fail this.')).toBe('fail');
    expect(vf.loosePick('BLOCK the release')).toBe('block');
    expect(vf.loosePick('Looks fine to ship.')).toBe(null);
    expect(vf.loosePick('I would pass the style, but the evidence is stale, so fail')).toBe('fail');
  });

  it('the better method wins, loose on a tie', () => {
    const rows = [
      { id: 'row-1', output: 'The evidence holds, pass', label: 'pass' },
      { id: 'row-2', output: 'please fail this.', label: 'fail' },
      { id: 'row-3', output: 'BLOCK the release', label: 'block' },
      { id: 'row-4', output: 'Looks fine to ship.', label: 'pass' },
      { id: 'row-5', output: 'The diff is clean; pass.', label: 'pass' },
      { id: 'row-6', output: 'Stale evidence: fail.', label: 'fail' },
      { id: 'row-7', output: 'Cannot judge.', label: 'block' },
      { id: 'row-8', output: 'Ready to pass.', label: 'pass' },
      { id: 'row-9', output: 'I would block this.', label: 'block' },
      { id: 'row-10', output: 'Needs work: fail.', label: 'fail' },
      { id: 'row-11', output: 'Ship it.', label: 'pass' },
      { id: 'row-12', output: 'One more pass and it is done.', label: 'pass' },
    ];

    const baseline = vf.chooseBaseline(rows);

    expect(baseline.majorityClass).toBe('pass');
    expect(baseline.majorityRight).toBe(6);
    expect(baseline.looseRight).toBe(9);
    expect(baseline.method).toBe('loose');
    expect(baseline.right).toBe(9);
    expect([...baseline.calls.values()]).toEqual([
      'pass', 'fail', 'block', null, 'pass', 'fail', null, 'pass', 'block', 'fail', null, 'pass',
    ]);

    const tie = vf.chooseBaseline([
      { id: 'tie-1', output: 'The reviewer says pass.', label: 'pass' },
      { id: 'tie-2', output: 'The reviewer says fail.', label: 'fail' },
      { id: 'tie-3', output: 'No verdict word here.', label: 'pass' },
      { id: 'tie-4', output: 'Still nothing.', label: 'fail' },
    ]);

    expect(tie.majorityClass).toBe('pass');
    expect(tie.majorityRight).toBe(2);
    expect(tie.looseRight).toBe(2);
    expect(tie.method).toBe('loose');
    expect(tie.right).toBe(2);
  });
});

describe('score-verdict-fallback keep rule', () => {
  const LABELS_SHA = 'a1b2c3d4e5f60718';
  const ROWS = [
    { id: 'r1', label: 'pass' },
    { id: 'r2', label: 'pass' },
    { id: 'r3', label: 'pass' },
    { id: 'r4', label: 'pass' },
    { id: 'r5', label: 'pass' },
    { id: 'r6', label: 'fail' },
    { id: 'r7', label: 'fail' },
    { id: 'r8', label: 'fail' },
    { id: 'r9', label: 'fail' },
    { id: 'r10', label: 'block' },
    { id: 'r11', label: 'block' },
    { id: 'r12', label: 'block' },
  ];

  it('verdict: keep', () => {
    const answers = new Map<string, Array<string | null>>([
      ['r1', ['pass', 'pass', 'pass']],
      ['r2', ['pass', 'pass', 'pass']],
      ['r3', ['pass', 'pass', 'pass']],
      ['r4', ['pass', 'pass', 'pass']],
      ['r5', ['pass', 'pass', 'pass']],
      ['r6', ['fail', 'fail', 'fail']],
      ['r7', ['fail', 'fail', 'fail']],
      ['r8', ['fail', 'fail', 'fail']],
      ['r9', ['fail', 'fail', 'block']],
      ['r10', ['pass', 'pass', 'pass']],
      ['r11', ['fail', 'fail', 'fail']],
      ['r12', ['fail', 'fail', 'fail']],
    ]);
    const baselineCalls = new Map<string, string>([
      ['r1', 'fail'],
      ['r2', 'fail'],
      ['r3', 'fail'],
      ['r4', 'fail'],
      ['r5', 'fail'],
      ['r6', 'block'],
      ['r7', 'block'],
      ['r8', 'block'],
      ['r9', 'block'],
      ['r10', 'block'],
      ['r11', 'fail'],
      ['r12', 'fail'],
    ]);

    const column = vf.summarizeColumn(
      'jev',
      ROWS,
      answers,
      baselineCalls,
      LABELS_SHA,
      'jev_version=0.6.2 provider=official model=m',
    );

    expect(column.K).toBe(12);
    expect(column.M).toBe(12);
    expect(column.unmeasured).toBe(0);
    expect(column.A).toBe(9);
    expect(column.B).toBe(1);
    expect(column.W).toBe(9);
    expect(column.L).toBe(1);
    expect(column.F).toBe(1);
    expect(column.outcome).toBe('keep');
    expect(column.reason).toBe(null);
    expect(column.line).toBe(
      `verdict jev: keep K=12 M=12 A=9 B=1 W=9 L=1 F=1 p_win=0.01074 p_loss=0.9990 labels_sha256=${LABELS_SHA} jev_version=0.6.2 provider=official model=m`,
    );
    expect(vf.binomialTail(5, 5).num).toBe(1n);
    expect(vf.binomialTail(5, 5).den).toBe(32n);
    expect(vf.formatP(vf.binomialTail(5, 5).p)).toBe('0.03125');

    const bare = vf.summarizeColumn('jev', ROWS, answers, baselineCalls, LABELS_SHA, '');
    expect(bare.line.endsWith(`labels_sha256=${LABELS_SHA}`)).toBe(true);
  });


  it('verdict: kill', () => {
    const answers = new Map<string, Array<string | null>>([
      ['r1', ['fail', 'fail', 'fail']],
      ['r2', ['fail', 'fail', 'fail']],
      ['r3', ['fail', 'fail', 'fail']],
      ['r4', ['fail', 'fail', 'fail']],
      ['r5', ['fail', 'fail', 'fail']],
      ['r6', ['pass', 'pass', 'pass']],
      ['r7', ['pass', 'pass', 'pass']],
      ['r8', ['pass', 'pass', 'pass']],
      ['r9', ['pass', 'pass', 'pass']],
      ['r10', ['pass', 'pass', 'pass']],
      ['r11', ['pass', 'pass', 'pass']],
      ['r12', ['pass', 'pass', 'pass']],
    ]);
    const baselineCalls = new Map<string, string>([
      ['r1', 'pass'],
      ['r2', 'pass'],
      ['r3', 'pass'],
      ['r4', 'pass'],
      ['r5', 'pass'],
      ['r6', 'block'],
      ['r7', 'block'],
      ['r8', 'block'],
      ['r9', 'block'],
      ['r10', 'pass'],
      ['r11', 'pass'],
      ['r12', 'pass'],
    ]);

    const column = vf.summarizeColumn('jev', ROWS, answers, baselineCalls, LABELS_SHA, '');

    expect(column.A).toBe(0);
    expect(column.B).toBe(5);
    expect(column.W).toBe(0);
    expect(column.L).toBe(5);
    expect(column.outcome).toBe('kill');
    expect(column.reason).toBe(null);
    expect(column.line).toBe(
      `verdict jev: kill K=12 M=12 A=0 B=5 W=0 L=5 F=0 p_win=1.000 p_loss=0.03125 labels_sha256=${LABELS_SHA}`,
    );
  });

  it('verdict: stop (margin)', () => {
    const answers = new Map<string, Array<string | null>>(
      ROWS.map((row) => [row.id, ['pass', 'pass', 'pass']] as [string, Array<string | null>]),
    );
    const baselineCalls = new Map<string, string>([
      ['r1', 'pass'],
      ['r2', 'pass'],
      ['r3', 'pass'],
      ['r4', 'pass'],
      ['r5', 'fail'],
      ['r6', 'block'],
      ['r7', 'block'],
      ['r8', 'block'],
      ['r9', 'block'],
      ['r10', 'pass'],
      ['r11', 'pass'],
      ['r12', 'pass'],
    ]);

    const column = vf.summarizeColumn('jev', ROWS, answers, baselineCalls, LABELS_SHA, '');

    expect(column.A).toBe(5);
    expect(column.B).toBe(4);
    expect(column.W).toBe(1);
    expect(column.L).toBe(0);
    expect(column.outcome).toBe('stop');
    expect(column.reason).toBe('margin');
    expect(column.line).toBe(
      `verdict jev: stop (margin) K=12 M=12 A=5 B=4 W=1 L=0 F=0 p_win=0.5000 p_loss=1.000 labels_sha256=${LABELS_SHA}`,
    );
  });

  it('verdict: stop (coverage)', () => {
    const answers = new Map<string, Array<string | null>>(
      ROWS.map((row) => [row.id, ['pass', 'pass', 'pass']] as [string, Array<string | null>]),
    );
    answers.set('r11', ['pass', 'fail']);
    answers.delete('r12');
    const baselineCalls = new Map<string, string>([
      ['r1', 'fail'],
      ['r2', 'fail'],
      ['r3', 'fail'],
      ['r4', 'fail'],
      ['r5', 'fail'],
      ['r6', 'block'],
      ['r7', 'block'],
      ['r8', 'block'],
      ['r9', 'block'],
      ['r10', 'pass'],
      ['r11', 'fail'],
      ['r12', 'fail'],
    ]);

    const column = vf.summarizeColumn('jev', ROWS, answers, baselineCalls, LABELS_SHA, '');

    expect(column.K).toBe(12);
    expect(column.M).toBe(10);
    expect(column.unmeasured).toBe(2);
    expect(column.A).toBe(5);
    expect(column.W).toBe(5);
    expect(column.outcome).toBe('stop');
    expect(column.reason).toBe('coverage');
    expect(column.line).toBe(
      `verdict jev: stop (coverage) K=12 M=10 A=5 B=0 W=5 L=0 F=0 p_win=0.03125 p_loss=1.000 labels_sha256=${LABELS_SHA}`,
    );
  });

  it('verdict: stop (flips)', () => {
    const answers = new Map<string, Array<string | null>>([
      ['r1', ['pass', 'pass', 'fail']],
      ['r2', ['pass', 'pass', 'fail']],
      ['r3', ['pass', 'pass', 'fail']],
      ['r4', ['pass', 'pass', 'fail']],
      ['r5', ['pass', 'pass', 'fail']],
      ['r6', ['fail', 'fail', 'block']],
      ['r7', ['fail', 'fail', 'block']],
      ['r8', ['fail', 'fail', 'block']],
      ['r9', ['fail', 'fail', 'block']],
      ['r10', ['block', 'block', 'pass']],
      ['r11', ['block', 'block', 'pass']],
      ['r12', ['block', 'block', 'pass']],
    ]);
    const baselineCalls = new Map<string, string>([
      ['r1', 'fail'],
      ['r2', 'fail'],
      ['r3', 'fail'],
      ['r4', 'fail'],
      ['r5', 'fail'],
      ['r6', 'block'],
      ['r7', 'block'],
      ['r8', 'block'],
      ['r9', 'block'],
      ['r10', 'pass'],
      ['r11', 'pass'],
      ['r12', 'pass'],
    ]);

    expect(vf.modalPick(['pass', 'pass', 'fail'])).toEqual({ pick: 'pass', top: 2 });
    expect(vf.modalPick(['pass', 'fail', 'block'])).toEqual({ pick: null, top: 1 });
    expect(vf.modalPick(['block', 'block', 'block'])).toEqual({ pick: 'block', top: 3 });

    const jev = vf.summarizeColumn(
      'jev',
      ROWS,
      answers,
      baselineCalls,
      LABELS_SHA,
      'jev_version=0.6.2 provider=official model=stub-model',
    );
    expect(jev.line).toBe(
      `verdict jev: stop (flips) K=12 M=12 A=12 B=0 W=12 L=0 F=12 p_win=0.0002441 p_loss=1.000 labels_sha256=${LABELS_SHA} jev_version=0.6.2 provider=official model=stub-model`,
    );
  });
});

describe('score-verdict-fallback zero-call run', () => {
  it('gate: 11 labeled misses prints the stop line', async () => {
    const rows: Array<{ id: string; output: string; label: string }> = [];
    for (let i = 1; i <= 11; i += 1) {
      rows.push({
        id: `row-${i}`,
        output: `Reviewer note ${i}.`,
        label: i % 3 === 0 ? 'block' : i % 2 === 0 ? 'fail' : 'pass',
      });
    }

    const { code, lines } = await runMain(['--outputs', writeOutputs(rows)]);

    expect(code).toBe(0);
    expect(lines[lines.length - 1]).toBe('stop: fewer than 12 labeled regex-miss outputs');
  });

  it('gate: a missing block label prints its stop line', async () => {
    const rows: Array<{ id: string; output: string; label: string }> = [];
    for (let i = 1; i <= 12; i += 1) {
      rows.push({
        id: `row-${i}`,
        output: `Reviewer note ${i}.`,
        label: i % 2 === 0 ? 'fail' : 'pass',
      });
    }

    const { code, lines } = await runMain(['--outputs', writeOutputs(rows)]);

    expect(code).toBe(0);
    expect(lines[lines.length - 1]).toBe('stop: no labeled block output');
  });

  it('headroom: a saturated baseline', async () => {
    const texts: Record<string, string> = {
      pass: 'The evidence holds, pass',
      fail: 'please fail this.',
      block: 'BLOCK the release',
    };
    const rows: Array<{ id: string; output: string; label: string }> = [];
    for (let i = 1; i <= 12; i += 1) {
      const label = i % 3 === 0 ? 'block' : i % 2 === 0 ? 'fail' : 'pass';
      rows.push({ id: `row-${i}`, output: texts[label], label });
    }
    const stubs = stubDir({ jev: 'exit 0' });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };

    const { code, lines } = await runMain(['--outputs', writeOutputs(rows)], env);

    expect(code).toBe(0);
    expect(lines[lines.length - 1]).toBe('no headroom');
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });

  it('default run: calls no stub and writes no file', async () => {
    const stubs = stubDir({ jev: 'exit 0' });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const before = fs.readdirSync(process.cwd()).sort();

    const { code, lines } = await runMain([], env);

    expect(code).toBe(0);
    expect(lines[0]).toMatch(/^fixture cases: \d+ hits: \d+ misses: \d+$/);
    expect(lines).toContain('labeled: 0 (pass 0, fail 0, block 0)');
    expect(lines[lines.length - 1]).toBe('stop: fewer than 12 labeled regex-miss outputs');
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
    expect(fs.readdirSync(process.cwd()).sort()).toEqual(before);
  });
});



describe('score-verdict-fallback jev gate', () => {
  const PASSING_JEV = `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0 ;;
  auth) if [ "$2" = test ]; then echo '{"model":"stub-model"}'; fi; exit 0 ;;
esac
echo '{"answers":{"answer":{"choice":"pass"}}}'`;
  const LABELS = ['pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'fail', 'fail', 'fail', 'block', 'block', 'block'];

  function missRows(): Array<{ id: string; output: string; label: string }> {
    return LABELS.map((label, index) => ({ id: `row-${index + 1}`, output: `Reviewer note ${index + 1}.`, label }));
  }

  function jevEnv(stubs: string): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    return env;
  }

  it('exit 0 passes', async () => {
    const stubs = stubDir({ jev: PASSING_JEV });
    const env = jevEnv(stubs);

    const { code, lines } = await runMain(
      ['--outputs', writeOutputs(missRows()), '--jev', '--accept-payload', '--out', tempDir('vf-out-')],
      env,
    );

    expect(code).toBe(0);
    expect(lines).toContain(`jev: path=${path.join(stubs, 'jev')} provider=official`);
    expect(lines.some((line) => /^jev: payload: untracked reviewer outputs; planned calls: 13; estimated input tokens: \d+$/.test(line))).toBe(true);
    expect(lines).toContain('jev: auth test provider=official model=stub-model');
    expect(lines.some((line) => /^column jev: K=12 measured=12 unmeasured=0 latency_p50_ms=\d+ latency_p95_ms=\d+$/.test(line))).toBe(true);
    expect(lines.some((line) => line.startsWith('verdict jev: '))).toBe(true);

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log.slice(0, 3)).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
    expect(log).toHaveLength(15);
  });

  it('exit 3 prints no credential', async () => {
    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) if [ "$2" = status ]; then exit 3; fi; exit 0;; esac' });
    const env = jevEnv(stubs);

    const { code, lines } = await runMain(
      ['--outputs', writeOutputs(missRows()), '--jev', '--out', tempDir('vf-out-')],
      env,
    );

    expect(code).toBe(0);
    expect(lines).toContain(`jev: path=${path.join(stubs, 'jev')} provider=official`);
    expect(lines).toContain('jev arm skipped: no credential');

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log).toEqual(['--version', 'auth status --provider official']);
  });

  it('an untracked outputs file without --accept-payload', async () => {
    const stubs = stubDir({ jev: PASSING_JEV });
    const env = jevEnv(stubs);

    const { code, lines } = await runMain(
      ['--outputs', writeOutputs(missRows()), '--jev', '--out', tempDir('vf-out-')],
      env,
    );

    expect(code).toBe(0);
    expect(lines).toContain('jev arm skipped: payload not accepted');

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log).toEqual(['--version', 'auth status --provider official']);
  });
});

describe('score-verdict-fallback arms', () => {
  it('rejects an unknown flag without spawning a stub', async () => {
    const stubs = stubDir({ jev: 'exit 0' });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };

    const { code, errs } = await runMain(['--bogus'], env);

    expect(code).toBe(2);
    expect(errs).toEqual(["Unknown option '--bogus'"]);
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });

  it('a jev arm without --out exits 2 before any call', async () => {
    const stubs = stubDir({ jev: 'exit 0' });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };

    const { code, errs } = await runMain(['--jev'], env);

    expect(code).toBe(2);
    expect(errs).toEqual(['--jev needs --out <dir> so every call is recorded']);
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });

  it('a skipped jev arm is recorded, no calls.jsonl', async () => {
    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\';; auth) [ "$2" = status ] && exit 3; exit 0;; esac' });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('vf-out-');

    const { code, lines } = await runMain(['--jev', '--out', out], env);

    expect(code).toBe(0);
    expect(lines).toContain('jev arm skipped: no credential');
    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.skipped.jev).toBe('jev arm skipped: no credential');
  });
});




describe('score-verdict-fallback jev arm', () => {
  const JEV = `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0 ;;
  auth) if [ "$2" = test ]; then echo '{"model":"stub-model"}'; fi; exit 0 ;;
esac
p=$(cat)
plan=$(printf '%s' "$p" | sed -n 's/.*ORDER:\\([0-9][0-9][0-9]\\).*/\\1/p')
case "$7" in
  pass=*) idx=1 ;;
  fail=*) idx=2 ;;
  block=*) idx=3 ;;
  *) idx=1 ;;
esac
digit=$(printf '%s' "$plan" | cut -c"$idx")
case "$digit" in
  1) pick=pass ;;
  2) pick=fail ;;
  3) pick=block ;;
  *) pick=unknown ;;
esac
echo '{"answers":{"answer":{"choice":"'$pick'"}},"usage":{"input_tokens":10,"output_tokens":2}}'`;
  const LABELS = ['pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'fail', 'fail', 'fail', 'block', 'block', 'block'];

  function armRows(digits: string[]): Array<{ id: string; output: string; label: string }> {
    return digits.map((digit, index) => ({
      id: `row-${index + 1}`,
      output: `Reviewer note ${index + 1}. ORDER:${digit}`,
      label: LABELS[index],
    }));
  }

  function readCalls(out: string): any[] {
    return fs
      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
  }

  async function runArm(digits: string[]): Promise<{ code: number; lines: string[]; out: string; stubs: string; sha: string }> {
    const outputs = writeOutputs(armRows(digits));
    const stubs = stubDir({ jev: JEV });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('vf-out-');
    const sha = vf.sha256Hex(fs.readFileSync(outputs));

    const { code, lines } = await runMain(['--outputs', outputs, '--jev', '--audit-orders', '--accept-payload', '--out', out], env);

    return { code, lines, out, stubs, sha };
  }

  it('verdict: keep', async () => {
    const run = await runArm(['111', '111', '111', '111', '111', '222', '222', '222', '222', '333', '333', '333']);

    expect(run.code).toBe(0);
    expect(run.lines.some((line) => /^jev: payload: untracked reviewer outputs; planned calls: 37; estimated input tokens: \d+$/.test(line))).toBe(true);
    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
    expect(run.lines.some((line) => /^column jev: K=12 measured=12 unmeasured=0 latency_p50_ms=\d+ latency_p95_ms=\d+$/.test(line))).toBe(true);
    expect(run.lines).toContain(
      `verdict jev: keep K=12 M=12 A=12 B=5 W=7 L=0 F=0 p_win=0.007813 p_loss=1.000 labels_sha256=${run.sha} jev_version=0.6.2 provider=official model=stub-model`,
    );

    const calls = readCalls(run.out);
    expect(calls).toHaveLength(37);
    expect(calls[0]).toEqual({
      backend: 'jev',
      output: null,
      order: null,
      attempt: 1,
      wallMs: expect.any(Number),
      exitCode: 0,
      pick: null,
      pickProb: null,
      status: 'measured',
      jevVersion: '0.6.2',
      provider: 'official',
      model: 'stub-model',
      usageTokens: null,
    });
    expect(calls.slice(1, 4)).toEqual([
      { backend: 'jev', output: 'row-1', order: 1, attempt: 1, wallMs: expect.any(Number), exitCode: 0, transport: 'jev', pick: 'pass', pickProb: null, status: 'measured', jevVersion: '0.6.2', provider: 'official', model: 'stub-model', usageTokens: { input: 10, output: 2, total: 12 } },
      { backend: 'jev', output: 'row-1', order: 2, attempt: 1, wallMs: expect.any(Number), exitCode: 0, transport: 'jev', pick: 'pass', pickProb: null, status: 'measured', jevVersion: '0.6.2', provider: 'official', model: 'stub-model', usageTokens: { input: 10, output: 2, total: 12 } },
      { backend: 'jev', output: 'row-1', order: 3, attempt: 1, wallMs: expect.any(Number), exitCode: 0, transport: 'jev', pick: 'pass', pickProb: null, status: 'measured', jevVersion: '0.6.2', provider: 'official', model: 'stub-model', usageTokens: { input: 10, output: 2, total: 12 } },
    ]);
    expect(calls[1].usageTokens).toEqual({ input: 10, output: 2, total: 12 });

    const report = JSON.parse(fs.readFileSync(path.join(run.out, 'report.json'), 'utf8'));
    expect(report.commit).toMatch(/^[a-f0-9]{40}$/);
    expect(report.scorerVersion).toBe(vf.SCORER_VERSION);
    expect(report.columns.jev.usageTokens).toEqual({ input: 360, output: 72, total: 432, callsWithUsage: 36, callsWithoutUsage: 0 });
    expect(report.columns.jev.intervals.method).toBe('wilson-95');
    expect(report.columns.jev.intervals.accuracy).toMatchObject({ n: 12, successes: 12 });
    expect(report.columns.jev.intervals.perClass).toMatchObject({ pass: { n: 5, successes: 5 }, fail: { n: 4, successes: 4 }, block: { n: 3, successes: 3 } });
    expect(report.columns.jev.confusion).toEqual({
      pass: { pass: 5, fail: 0, block: 0, abstain: 0, unknown: 0 },
      fail: { pass: 0, fail: 4, block: 0, abstain: 0, unknown: 0 },
      block: { pass: 0, fail: 0, block: 3, abstain: 0, unknown: 0 },
    });
  });

  it('records the selected transport on judgment calls', async () => {
    const run = await runArm(['111', '111', '111', '111', '111', '222', '222', '222', '222', '333', '333', '333']);
    const judgmentCalls = readCalls(run.out).filter((call) => call.output !== null);

    expect(run.code).toBe(0);
    expect(judgmentCalls.length).toBeGreaterThan(0);
    expect(judgmentCalls.every((call) => call.transport === 'jev')).toBe(true);
  });

  it('report requalifies a changed Jev identity before its verdict', async () => {
    const outputs = writeOutputs(armRows(['111', '111', '111', '111', '111', '222', '222', '222', '222', '333', '333', '333']));
    const stubs = stubDir({ jev: JEV });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('vf-out-');
    fs.writeFileSync(
      path.join(out, 'report.json'),
      JSON.stringify({ columns: { jev: { provider: 'openrouter', model: 'stub-model' } } }),
      'utf8',
    );

    const { code, lines } = await runMain(['--outputs', outputs, '--jev', '--accept-payload', '--out', out], env);

    expect(code).toBe(0);
    const requalifyIndex = lines.indexOf('requalify: model changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(lines[requalifyIndex + 1]).toMatch(/^verdict jev: keep /);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.requalify.jev).toBe('requalify: model changed');
  });

  it('verdict: stop (flips)', async () => {
    const run = await runArm(['112', '112', '112', '112', '112', '221', '221', '221', '221', '331', '331', '331']);

    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      `verdict jev: stop (flips) K=12 M=12 A=12 B=5 W=7 L=0 F=12 p_win=0.007813 p_loss=1.000 labels_sha256=${run.sha} jev_version=0.6.2 provider=official model=stub-model`,
    );
  });

  it('records an explicit abstain for no-decision text', async () => {
    const rows = armRows(Array(12).fill('111')).map((row) => ({ ...row, output: 'NO_DECISION: the available material is inconclusive.' }));
    const outputs = writeOutputs(rows);
    const stubs = stubDir({ jev: `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0 ;;
  auth) if [ "$2" = test ]; then echo '{"model":"stub-model"}'; fi; exit 0 ;;
esac
p=$(cat)
case "$p" in *NO_DECISION*) pick=abstain;; *) pick=pass;; esac
echo '{"answers":{"answer":{"choice":"'$pick'"}}}'` });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('vf-out-');

    const { code } = await runMain(['--outputs', outputs, '--jev', '--accept-payload', '--out', out], env);
    const calls = readCalls(out).slice(1);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));

    expect(code).toBe(0);
    expect(calls).toHaveLength(12);
    expect(calls.every((call) => call.pick === 'abstain' && call.status === 'measured')).toBe(true);
    expect(report.columns.jev.confusion.pass.abstain).toBe(5);
    expect(report.columns.jev.confusion.fail.abstain).toBe(4);
    expect(report.columns.jev.confusion.block.abstain).toBe(3);
  });

  it('leaves an unknown answer unmeasured and stops on coverage', async () => {
    const rows = armRows(Array(12).fill('111')).map((row) => ({ ...row, output: 'UNKNOWN: no usable verdict.' }));
    const outputs = writeOutputs(rows);
    const stubs = stubDir({ jev: `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0 ;;
  auth) if [ "$2" = test ]; then echo '{"model":"stub-model"}'; fi; exit 0 ;;
esac
echo '{"answers":{"answer":{"choice":"maybe"}}}'` });
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    const out = tempDir('vf-out-');

    const { code, lines } = await runMain(['--outputs', outputs, '--jev', '--accept-payload', '--out', out], env);
    const calls = readCalls(out).slice(1);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));

    expect(code).toBe(0);
    expect(lines.some((line) => line.startsWith('verdict jev: stop (coverage)'))).toBe(true);
    expect(calls).toHaveLength(12);
    expect(calls.every((call) => call.pick === null && call.status === 'unmeasured')).toBe(true);
    expect(report.columns.jev.M).toBe(0);
    expect(report.columns.jev.unmeasured).toBe(12);
    expect(report.columns.jev.confusion.pass.unknown).toBe(5);
  });
});
