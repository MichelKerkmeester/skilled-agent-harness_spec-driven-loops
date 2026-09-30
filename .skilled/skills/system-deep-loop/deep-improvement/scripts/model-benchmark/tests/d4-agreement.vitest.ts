// ───────────────────────────────────────────────────────────────────
// MODULE: score-d4-agreement
//   Output census (listOutputs)
//   Fixture census (loadFixtures)
//   Output-to-fixture matching (matchOutputs)
//   Labels parser (parseLabels, sha256Hex)
//   Deterministic baseline (buildState, deterministicCall, chooseBaseline)
//   Keep rule (binomialTail, decideVerdict, summarizeColumn)
//   Deem gate (deemGate)
//   Deem arm (runDeemArm)
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
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const d4 = require(path.join(TEST_DIR, '../scorer/score-d4-agreement.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
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
    env,
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
    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 0 });
    expect(verdict.outcome).toBe('keep');
    expect(verdict.reason).toBe(null);
    expect(d4.formatP(verdict.pWin)).toBe('0.0009766');
    expect(verdict.pLoss).toBe(1);
    expect(d4.binomialTail(5, 5).num).toBe(1n);
    expect(d4.binomialTail(5, 5).den).toBe(32n);
  });

  it('kills a column the baseline beats with a clean loss tail', () => {
    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 20, B: 28, W: 0, L: 8, F: 0 });
    expect(verdict.outcome).toBe('kill');
    expect(verdict.reason).toBe(null);
  });

  it('stops a column short of the margin', () => {
    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 24, B: 22, W: 5, L: 3, F: 0 });
    expect(verdict.outcome).toBe('stop');
    expect(verdict.reason).toBe('margin');
  });

  it('stops a column that measured too few rows', () => {
    const verdict = d4.decideVerdict({ backend: 'deem', K: 30, M: 26, A: 26, B: 10, W: 16, L: 0, F: 0 });
    expect(verdict.outcome).toBe('stop');
    expect(verdict.reason).toBe('coverage');
  });

  it('stops on flips only for the rerun-sampled backend', () => {
    const counts = { K: 30, M: 30, A: 30, B: 20, W: 10, L: 0, F: 10 };
    expect(d4.decideVerdict({ backend: 'jev', ...counts }).reason).toBe('flips');
    expect(d4.decideVerdict({ backend: 'deem', ...counts }).outcome).toBe('keep');
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

    const deem = d4.summarizeColumn(
      'deem',
      rows,
      new Map([
        ['a', [0.7]],
        ['b', [0.2]],
        ['c', [1.5]],
      ]),
      baselineCalls,
      'abc',
      '',
    );
    expect(deem.M).toBe(2);
    expect(deem.F).toBe(null);
    expect(deem.line).toContain(' F=n/a ');
    expect(deem.line.endsWith('labels_sha256=abc')).toBe(true);
  });
});

describe('score-d4-agreement zero-call run', () => {
  it('prints the zero-call report and runs no stub', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md']);
    const stubs = stubDir({ 'cli-deem': 'exit 0', jev: 'exit 0' });
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
    expect(open.lines[open.lines.length - 1]).toBe('planned calls: jev 91, deem 30');
  });

  it('refuses a model arm without --out, a missing --outputs and a bad label value', async () => {
    const outputs = writeOutputs(['fx-a.md']);

    const arm = await runMain(['--outputs', outputs, '--deem']);
    expect(arm.code).toBe(2);
    expect(arm.lines).toEqual([]);
    expect(arm.errs).toEqual(['--deem needs --out <dir> so every call is recorded']);

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

describe('score-d4-agreement deem gate', () => {
  const HEALTHY = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';

  it('passes a healthy server and prints the commit pair', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
    const stubs = stubDir({ 'cli-deem': HEALTHY });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const argv = ['--outputs', outputs, '--fixtures', fixtures];
    const base = await runMain(argv, env);

    const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);

    expect(code).toBe(0);
    expect(lines).toEqual([
      ...base.lines,
      'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1',
      'deem arm skipped: label gate',
    ]);
    expect(fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
  });

  it('skips a stub backend with the rest of the output byte-identical', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
    const stubs = stubDir({
      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
    });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const argv = ['--outputs', outputs, '--fixtures', fixtures];
    const base = await runMain(argv, env);

    const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);

    expect(code).toBe(0);
    expect(lines).toContain('deem arm skipped: stub backend');
    expect(lines.filter((line) => line !== 'deem arm skipped: stub backend')).toEqual(base.lines);
  });

  it('skips an unreachable server, a wrong model and a bad health body', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
    const argv = ['--outputs', outputs, '--fixtures', fixtures];
    const cases: Array<[string, string[]]> = [
      ['exit 4', ['deem arm skipped: not reachable']],
      [
        'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"other","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
        ['deem arm skipped: model', 'deem: found="other"'],
      ],
      ["echo 'not json'", ['deem arm skipped: bad health response', 'deem: found="not json"']],
    ];

    for (const [body, expected] of cases) {
      const stubs = stubDir({ 'cli-deem': body });
      const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
      const base = await runMain(argv, env);

      const { code, lines } = await runMain([...argv, '--deem', '--out', tempDir('d4-out-')], env);

      expect(code).toBe(0);
      expect(lines.slice(base.lines.length)).toEqual(expected);
    }
  });
});

describe('score-d4-agreement jev gate', () => {
  const PASSING_JEV = 'case "$1" in --version) echo \'jev 0.6.2\';; auth) exit 0;; esac';
  const HEALTHY_DEEM = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';

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

  it('refuses untracked labeled outputs without --accept-payload and still runs the Deem gate', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ jev: PASSING_JEV, 'cli-deem': HEALTHY_DEEM });
    const env = jevEnv(stubs);
    const argv = ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels];

    const { code, lines } = await runMain([...argv, '--jev', '--deem', '--out', tempDir('d4-out-')], env);

    expect(code).toBe(0);
    const payloadIndex = lines.indexOf('jev arm skipped: payload not accepted');
    const healthIndex = lines.indexOf('deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1');
    expect(payloadIndex).toBeGreaterThanOrEqual(0);
    expect(healthIndex).toBeGreaterThan(payloadIndex);
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

  it('records a skipped arm in report.json and writes no call log', async () => {
    const fixtures = writeFixtures();
    const outputs = writeOutputs(['fx-a.md', 'orphan.md']);
    const stubs = stubDir({
      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
    });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const out = tempDir('d4-out-');

    const { code } = await runMain(['--outputs', outputs, '--fixtures', fixtures, '--deem', '--out', out], env);

    expect(code).toBe(0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.skipped.deem).toBe('deem arm skipped: stub backend');
    expect(report.columns).toEqual({});
    expect(report.labelsSha256).toBe(null);
    expect(report.gate).toBe('stop: fewer than 30 labeled outputs');
    expect(report.census).toEqual({ outputs: 2, matched: 1, unmatched: 1, fixtures: 3, allowlist: 1 });
    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);
  });
});

describe('score-d4-agreement deem arm', () => {
  const DEEM = `if [ "$1" = health ]; then n=$(cat "$D/n" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/n"; mc=m1; if [ -f "$D/newpair" ] && [ $n -gt 1 ]; then mc=m2; fi; echo "{\\"ok\\":true,\\"backend\\":\\"torch\\",\\"model\\":\\"deem-0.8-v1\\",\\"model_commit\\":\\"$mc\\",\\"source_commit\\":\\"s1\\"}"; exit 0; fi
p=$(cat); case "$p" in *EXIT4*) exit 4;; *EXIT3*) exit 3;; *BADJSON*) echo 'not json'; exit 0;; *HALLUCINATED*) v=0.9;; *) v=0.1;; esac
echo "{\\"model\\":\\"deem-0.8-v1\\",\\"answers\\":{\\"answer\\":{\\"noul\\":$v}}}"`;

  function readCalls(out: string): any[] {
    return fs
      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
  }

  it('asks one noul per labeled output and prints keep', async () => {
    const set = labeledSet(0, 10, 20);
    const stubs = stubDir({ 'cli-deem': DEEM });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const out = tempDir('d4-out-');
    const sha = d4.sha256Hex(fs.readFileSync(set.labels));

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--deem', '--out', out],
      env,
    );

    expect(code).toBe(0);
    expect(lines).toContain(
      'deem: nothing leaves the machine; planned calls: 30; estimated wall time: 1.8 s at 60.5 ms per call, the noul p50 from deem-local.md',
    );
    expect(lines).toContain('flips: n/a (commit pair)');
    expect(lines).toContain(
      `verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=n/a p_win=0.0009766 p_loss=1.000 labels_sha256=${sha} model=deem-0.8-v1 model_commit=m1 source_commit=s1`,
    );

    const log = fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n');
    expect(log).toHaveLength(31);
    expect(log[0]).toBe('health');

    const calls = readCalls(out);
    expect(calls).toHaveLength(30);
    for (const call of calls) {
      expect(call.status).toBe('measured');
      expect(call.exitCode).toBe(0);
      expect(typeof call.wallMs).toBe('number');
      expect(call.modelId).toBe('deem-0.8-v1');
      expect(call.modelCommit).toBe('m1');
      expect(call.sourceCommit).toBe('s1');
    }
    expect(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).columns.deem.verdict).toBe('keep');
  });

  it('stops with partial rows and no verdict on a changed commit pair or a refused backend', async () => {
    const changed = labeledSet(0, 10, 20);
    const changedStubs = stubDir({ 'cli-deem': DEEM });
    fs.appendFileSync(path.join(changed.outputs, 'fx-b.run1.md'), 'EXIT4\n');
    fs.writeFileSync(path.join(changedStubs, 'newpair'), '', 'utf8');
    const changedOut = tempDir('d4-out-');

    const changedRun = await runMain(
      ['--outputs', changed.outputs, '--fixtures', changed.fixtures, '--labels', changed.labels, '--deem', '--out', changedOut],
      { ...process.env, PATH: `${changedStubs}${path.delimiter}${process.env.PATH}` },
    );

    expect(changedRun.code).toBe(0);
    expect(changedRun.lines).toContain('deem arm stopped: model commit changed mid-run');
    expect(changedRun.lines).toContain('deem: partial rows=0');
    expect(changedRun.lines.some((line) => line.startsWith('verdict deem:'))).toBe(false);
    const changedReport = JSON.parse(fs.readFileSync(path.join(changedOut, 'report.json'), 'utf8'));
    expect(changedReport.stopped.deem.partialRows).toBe(0);

    const refused = labeledSet(0, 10, 20);
    const refusedStubs = stubDir({ 'cli-deem': DEEM });
    fs.appendFileSync(path.join(refused.outputs, 'fx-b.run1.md'), 'EXIT3\n');
    const refusedOut = tempDir('d4-out-');

    const refusedRun = await runMain(
      ['--outputs', refused.outputs, '--fixtures', refused.fixtures, '--labels', refused.labels, '--deem', '--out', refusedOut],
      { ...process.env, PATH: `${refusedStubs}${path.delimiter}${process.env.PATH}` },
    );

    expect(refusedRun.code).toBe(0);
    expect(refusedRun.lines).toContain('deem arm stopped: backend refused');
    expect(refusedRun.lines).toContain('deem: partial rows=0');
  });

  it('marks an unparseable answer failed, stops on coverage and requalifies a changed pair', async () => {
    const set = labeledSet(0, 10, 20);
    for (let i = 1; i <= 4; i += 1) fs.appendFileSync(path.join(set.outputs, `fx-b.run${i}.md`), 'BADJSON\n');
    const stubs = stubDir({ 'cli-deem': DEEM });
    const env = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    const out = tempDir('d4-out-');
    fs.writeFileSync(
      path.join(out, 'report.json'),
      JSON.stringify({ columns: { deem: { modelCommit: 'old', sourceCommit: 's1' } } }),
      'utf8',
    );

    const { code, lines } = await runMain(
      ['--outputs', set.outputs, '--fixtures', set.fixtures, '--labels', set.labels, '--deem', '--out', out],
      env,
    );

    expect(code).toBe(0);
    const calls = readCalls(out);
    expect(calls).toHaveLength(30);
    expect(calls.filter((call) => call.status === 'failed')).toHaveLength(4);
    const requalifyIndex = lines.indexOf('requalify: model commit changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(lines[requalifyIndex + 1].startsWith('verdict deem: stop (coverage) K=30 M=26 ')).toBe(true);
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
