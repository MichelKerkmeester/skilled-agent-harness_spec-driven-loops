// ───────────────────────────────────────────────────────────────────
// MODULE: score-severity-replay
//   Census core (runGit, repoRoot, listTrackedFiles, loadRegistries,
//   p0RowsOf, rowKey, censusFindings, countPhrases, censusLines)
//   Row state (buildRowState)
//   Labels and gate (buildLabelSheetLines, writeLabelSheet, parseLabels,
//   gateLine)
//   Keep rule and column (binomialTail, modalPick, decideVerdict, formatP,
//   summarizeColumn, orderLine, funnelLine, exactLine, nearestRank)
//   Arm helpers (which, spawnCall, createCallLog, readStoredReport)
//   Jev gate and arm (jevGate, isPublished, runJevArm)
//   Main and report (buildReport, main)
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const replay = require(path.join(TEST_DIR, '../../scripts/score-severity-replay.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function writeFileAt(root: string, file: string, text: string): void {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, 'utf8');
}

function writeRegistry(root: string, file: string, registry: Record<string, unknown>): void {
  writeFileAt(root, file, JSON.stringify(registry));
}

function finding(fields: Record<string, unknown>): Record<string, unknown> {
  return { severity: 'P1', title: 'Fixture finding', ...fields };
}

function censusLinesOf(root: string, files: string[]): string[] {
  const registries = replay.loadRegistries(root, files);
  const phrases = replay.countPhrases(root, files, replay.PHRASES);
  return replay.censusLines(replay.censusFindings(registries), phrases);
}

describe('score-severity-replay census', () => {
  it("census counts a fixture's P0 rows and transitions", () => {
    const root = tempDir('severity-replay-census-');
    const files = [
      'alpha/review/deep-review-findings-registry.json',
      'beta/review/deep-review-findings-registry.json',
    ];
    writeRegistry(root, files[0], {
      openFindings: [
        finding({
          findingId: 'A-001',
          severity: 'P0',
          title: 'Alpha',
          dimension: 'correctness',
          transitions: [{ iteration: 1, from: null, to: 'P0' }],
        }),
        finding({ findingId: 'A-002', severity: 'P1', title: 'Beta', dimension: 'security' }),
      ],
      resolvedFindings: [],
    });
    writeRegistry(root, files[1], {
      openFindings: [
        finding({ findingId: 'B-001', severity: 'P0', title: 'Gamma', dimension: 'maintainability' }),
        finding({
          findingId: 'B-002',
          severity: 'P2',
          title: 'Delta',
          dimension: 'traceability',
          transitions: [{ iteration: 2, from: 'P1', to: 'P2' }],
        }),
      ],
    });

    const lines = censusLinesOf(root, files);

    expect(lines).toContain('registries: 2');
    expect(lines).toContain('findings: 4 (P0 2, P1 1, P2 1, other 0)');
    const transitions = lines.filter((line) => line.startsWith('transitions: ')).sort();
    expect(transitions).toEqual(['transitions: P1 -> P2 1', 'transitions: none -> P0 1']);
    expect(lines).toContain('p0 rows: 2 in 2 registries (one 2, two or more 0)');
  });

  it('phrase counter finds a planted phrase', () => {
    const root = tempDir('severity-replay-phrases-');
    const files = [
      'one/review/iterations/iteration-001.md',
      'two/review/iterations/iteration-002.md',
    ];
    writeFileAt(root, files[0], 'The reviewer moved the finding from P0 to P1 after the self-check.\n');
    writeFileAt(root, files[1], 'No rejected-P0 phrase appears in this iteration.\n');

    const counts = replay.countPhrases(root, files, replay.PHRASES);
    const line = censusLinesOf(root, files).find((entry) => entry.startsWith('phrases: '));

    expect(counts.files).toBe(2);
    expect(counts.hits).toEqual([0, 1, 0, 0, 0]);
    expect(line).toBe('phrases: 2 review iteration files; "downgraded from P0" 0; "from P0 to P1" 1; "from P0 to P2" 0; "retracted from P0" 0; "P0 was retracted" 0');
  });

  it('an unreadable registry exits 2', () => {
    const root = tempDir('severity-replay-bad-');
    const file = 'review/deep-review-findings-registry.json';
    // The loader's refusal is the message the entrypoint maps to exit 2.
    writeFileAt(root, file, '{ not json');

    expect(() => replay.loadRegistries(root, [file])).toThrow(`cannot read registry ${file}`);
  });

  it('a duplicate P0 row dedupes by registry and finding id', () => {
    const root = tempDir('severity-replay-dupe-');
    const file = 'review/deep-review-findings-registry.json';
    writeRegistry(root, file, {
      openFindings: [
        finding({ findingId: 'D-001', severity: 'P0', title: 'Once' }),
        finding({ findingId: 'D-001', severity: 'P0', title: 'Twice' }),
      ],
    });

    const lines = censusLinesOf(root, [file]);

    expect(lines).toContain('p0 rows: 1 in 1 registries (one 1, two or more 0)');
  });

  it('the finding id never enters the row state', () => {
    const root = tempDir('severity-replay-state-');
    const file = 'review/deep-review-findings-registry.json';
    writeRegistry(root, file, {
      openFindings: [finding({ findingId: 'P2-001', severity: 'P0', title: 'T' })],
    });

    const rows = replay.p0RowsOf(replay.loadRegistries(root, [file]));
    const state = replay.buildRowState(rows[0]);

    expect(state).toContain('T');
    expect(state).not.toContain('P2-001');
  });
});

describe('score-severity-replay labels and gate', () => {
  it('the label sheet writes outside the repository', () => {
    const root = tempDir('severity-replay-sheet-root-');
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const rows = replay.p0RowsOf(new Map([[
      registry,
      { openFindings: [finding({ findingId: 'A-001', severity: 'P0', title: 'Alpha', dimension: 'correctness', evidenceRefs: ['specs/a.md'] })] },
    ]]));
    const target = path.join(tempDir('severity-replay-sheet-out-'), 'labels.jsonl');

    const lines = replay.buildLabelSheetLines(rows);
    const written = replay.writeLabelSheet(target, lines, root);

    expect(written).toBe(1);
    expect(lines).toHaveLength(1);
    const filled = fs.readFileSync(target, 'utf8').trim().split('\n');
    expect(filled).toHaveLength(1);
    const parsed = JSON.parse(filled[0]) as Record<string, unknown>;
    expect(Object.keys(parsed)).toEqual(['registry', 'finding_id', 'title', 'dimension', 'evidence_refs', 'label']);
    expect(parsed).toEqual({
      registry,
      finding_id: 'A-001',
      title: 'Alpha',
      dimension: 'correctness',
      evidence_refs: ['specs/a.md'],
      label: '',
    });
  });

  it('the label sheet refuses a path inside the repository', () => {
    const root = tempDir('severity-replay-sheet-refuse-');
    const target = path.join(root, 'specs', 'tmp-labels.jsonl');

    expect(() => replay.writeLabelSheet(target, [], root)).toThrow('refusing to write the label sheet inside the repository');
    expect(fs.existsSync(target)).toBe(false);
    expect(fs.existsSync(path.dirname(target))).toBe(false);
  });

  it('the label reader rejects an unknown label', () => {
    const row = JSON.stringify({
      registry: 'alpha/review/deep-review-findings-registry.json',
      finding_id: 'A-001',
      title: 'Alpha',
      dimension: 'correctness',
      evidence_refs: [],
      label: 'maybe',
    });

    expect(() => replay.parseLabels(row)).toThrow('labels row 1: label must be "", real, P1, P2 or not_a_finding, got "maybe"');
  });

  it('the label reader drops an empty label', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const rows = [
      JSON.stringify({ registry, finding_id: 'A-001', title: 'Alpha', dimension: 'correctness', evidence_refs: [], label: '' }),
      JSON.stringify({ registry, finding_id: 'A-002', title: 'Beta', dimension: 'correctness', evidence_refs: [], label: 'real' }),
    ];

    const labels = replay.parseLabels(`${rows.join('\n')}\n`);
    const labeled = [...labels.values()].filter((value: string) => value !== '');
    const counts = { real: 0, P1: 0, P2: 0, not_a_finding: 0 };
    for (const value of labeled) counts[value as keyof typeof counts] += 1;

    expect(labeled).toHaveLength(1);
    expect(counts).toEqual({ real: 1, P1: 0, P2: 0, not_a_finding: 0 });
    expect(labels.size - labeled.length).toBe(1);
  });

  it('the gate stops at 19 negatives', () => {
    const gate = replay.gateLine(20, 19, 1);

    expect(gate.state).toBe('label');
    expect(gate.line).toBe('stop: fewer than 20 labeled P0 negatives');
  });

  it('the gate passes at 20 negatives', () => {
    const gate = replay.gateLine(20, 20, 0);

    expect(gate.state).toBe('open');
    expect(gate.line).toBe('gate: open K=20 negatives=20');
  });

  it('no headroom prints above 90 percent', () => {
    const gate = replay.gateLine(201, 20, 181);

    expect(gate.state).toBe('headroom');
    expect(gate.line).toBe('no headroom');
  });
});

describe('score-severity-replay keep rule', () => {
  it('the verdict prints keep', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const rows = [
      ...Array.from({ length: 20 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' })),
      ...Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' })),
    ];
    const answers = new Map(rows.map((row) => [
      replay.rowKey(row.registry, row.findingId),
      Array.from({ length: 3 }, () => ({ pick: row.label === 'real' ? 'P0' : 'P1' })),
    ]));

    const column = replay.summarizeColumn(
      'jev',
      rows,
      answers,
      (row: any) => row.label === 'real',
      'jev_version=0.6.2 provider=official model=stub-model',
    );

    expect(column.K).toBe(30);
    expect(column.M).toBe(30);
    expect(column.A).toBe(30);
    expect(column.B).toBe(20);
    expect(column.W).toBe(10);
    expect(column.L).toBe(0);
    expect(column.F).toBe(0);
    expect(column.outcome).toBe('keep');
    expect(column.reason).toBe(null);
    expect(column.pLoss).toBe(1);
    expect(column.line).toBe('verdict jev: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0009766 jev_version=0.6.2 provider=official model=stub-model');
    expect(replay.binomialTail(5, 5).num).toBe(1n);
    expect(replay.binomialTail(5, 5).den).toBe(32n);
  });

  it('the verdict prints kill', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const realRight = Array.from({ length: 12 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' }));
    const realWrong = Array.from({ length: 8 }, (_, index) => ({ registry, findingId: `X-${index}`, label: 'real' }));
    const negatives = Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
    const rows = [...realRight, ...realWrong, ...negatives];
    const answers = new Map<string, Array<{ pick: string }>>();
    for (const row of realRight) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));
    for (const row of realWrong) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
    for (const row of negatives) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));

    const column = replay.summarizeColumn('jev', rows, answers, (row: any) => row.label === 'real', '');

    expect(column.A).toBe(12);
    expect(column.B).toBe(20);
    expect(column.W).toBe(0);
    expect(column.L).toBe(8);
    expect(column.outcome).toBe('kill');
    expect(column.reason).toBe(null);
    expect(column.line).toBe('verdict jev: kill K=30 M=30 A=12 B=20 W=0 L=8 F=0 p=1.000');
  });

  it('the verdict prints stop (coverage)', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const real = Array.from({ length: 20 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' }));
    const negatives = Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
    const rows = [...real, ...negatives];
    const answers = new Map<string, Array<{ pick: string | null }>>();
    for (const row of real) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));
    for (const row of negatives.slice(0, 6)) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
    for (const row of negatives.slice(6)) answers.set(replay.rowKey(row.registry, row.findingId), [{ pick: null }, { pick: null }, { pick: null }]);

    const column = replay.summarizeColumn('jev', rows, answers, (row: any) => row.label === 'real', '');

    expect(column.K).toBe(30);
    expect(column.M).toBe(26);
    expect(column.outcome).toBe('stop');
    expect(column.reason).toBe('coverage');
    expect(column.line.startsWith('verdict jev: stop (coverage) K=30 M=26 ')).toBe(true);
  });

  it('three different keys make a row unstable and count as wrong', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const rows = Array.from({ length: 6 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
    const answers = new Map<string, Array<{ pick: string }>>();
    for (const row of rows.slice(0, 5)) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
    const unstable = rows[5];
    answers.set(replay.rowKey(unstable.registry, unstable.findingId), [{ pick: 'P0' }, { pick: 'P1' }, { pick: 'P2' }]);

    expect(replay.modalPick([{ pick: 'P0' }, { pick: 'P1' }, { pick: 'P2' }])).toEqual({ pick: null, top: 0 });

    const column = replay.summarizeColumn('jev', rows, answers, () => false, '');

    expect(column.M).toBe(6);
    expect(column.A).toBe(5);
    expect(column.F).toBe(3);
    expect(column.outcome).toBe('stop');
    expect(column.reason).toBe('flips');
    expect(column.line.startsWith('verdict jev: stop (flips) K=6 M=6 A=5 B=0 W=5 L=0 F=3 ')).toBe(true);
  });

  it('stops on the sign test when the win tail is not below 0.05', () => {
    const verdict = replay.decideVerdict({ backend: 'jev', K: 30, M: 30, A: 23, B: 20, W: 3, L: 0, F: 0 });

    expect(verdict.outcome).toBe('stop');
    expect(verdict.reason).toBe('sign test');
    expect(replay.formatP(verdict.p)).toBe('0.1250');
  });

  it('the reread order line prints without moving the verdict', () => {
    const registry = 'alpha/review/deep-review-findings-registry.json';
    const rows = [
      { registry, findingId: 'A-001', label: 'P1' },
      { registry, findingId: 'A-002', label: 'real' },
      { registry, findingId: 'A-003', label: 'P2' },
    ];
    const answers = new Map<string, Array<{ pick: string; p0Probability: number }>>([
      [replay.rowKey(registry, 'A-001'), Array.from({ length: 3 }, () => ({ pick: 'P1', p0Probability: 0.1 }))],
      [replay.rowKey(registry, 'A-002'), Array.from({ length: 3 }, () => ({ pick: 'P0', p0Probability: 0.9 }))],
      [replay.rowKey(registry, 'A-003'), Array.from({ length: 3 }, () => ({ pick: 'P2', p0Probability: 0.2 }))],
    ]);

    const before = replay.summarizeColumn('jev', rows, answers, (row: any) => row.label === 'real', '');
    const line = replay.orderLine('jev', rows, answers);
    const after = replay.summarizeColumn('jev', rows, answers, (row: any) => row.label === 'real', '');

    expect(line).toBe('order jev: registries=1 first_real_rank=1.0 recorded=2.0');
    expect(after.line).toBe(before.line);
  });
});

describe('score-severity-replay jev gate and arm', () => {
  type JevRow = {
    registry: string;
    findingId: string;
    label: string;
    title: string;
    dimension: string;
    evidenceRefs: string[];
    recommendation: string;
  };

  const REGISTRY = 'alpha/review/deep-review-findings-registry.json';
  const SECOND_REGISTRY = 'beta/review/deep-review-findings-registry.json';
  const JEV_CHOICE_AND_FUNNEL = [
    'case "$1" in',
    '  --version) echo \'jev 0.6.2\'; exit 0;;',
    '  auth)',
    '    if [ "$2" = test ]; then echo \'{"model":"stub-model"}\'; fi',
    '    exit 0;;',
    'esac',
    'if [ "$1" = noul ]; then cat > /dev/null; echo \'{"answers":{"answer":{"noul":0.9}}}\'; exit 0; fi',
    'cat > /dev/null',
    'echo \'{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}\'',
  ].join('\n');

  function stubDir(bodies: Record<string, string>): string {
    const dir = tempDir('severity-replay-jev-stubs-');
    for (const [name, body] of Object.entries(bodies)) {
      const file = path.join(dir, name);
      fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
      fs.chmodSync(file, 0o755);
    }
    return dir;
  }

  function armEnv(stubs: string): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
    delete env.JEV_PROVIDER;
    return env;
  }

  function readCalls(out: string): any[] {
    return fs
      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
  }

  function planOf(rows: Array<{ findingId: string; label: string; registry?: string }>): { rows: JevRow[]; baselineRight: (row: JevRow) => boolean } {
    return {
      rows: rows.map((row) => ({
        registry: row.registry ?? REGISTRY,
        findingId: row.findingId,
        label: row.label,
        title: 'Fixture finding',
        dimension: 'correctness',
        evidenceRefs: ['specs/x.md'],
        recommendation: 'Fix it.',
      })),
      baselineRight: (row) => row.label === 'real',
    };
  }

  function fakeGit(unpublished: string): { git: (args: string[]) => { status: number; stdout: string; stderr: string }; calls: string[][] } {
    const calls: string[][] = [];
    const git = (args: string[]) => {
      calls.push(args);
      const present = unpublished === '' || !args.includes(`origin/main:${unpublished}`);
      return { status: present ? 0 : 1, stdout: '', stderr: '' };
    };
    return { git, calls };
  }

  it('the Jev gate passes a stub', async () => {
    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
    const env = armEnv(stubs);
    const lines: string[] = [];
    const out = tempDir('severity-replay-jev-pass-');
    const plan = planOf(Array.from({ length: 20 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
    const fake = fakeGit('');

    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });

    expect(gate.passed).toBe(true);
    expect(gate.provider).toBe('official');
    expect(lines).toEqual([`jev: path=${path.join(stubs, 'jev')} provider=official`]);

    const result = await replay.runJevArm(plan, gate, {
      out: (line: string) => lines.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 2000,
      callLog: replay.createCallLog(out),
      stored: null,
      git: fake.git,
      root: '/repo',
    });

    expect(result.stopped).toBeUndefined();
    expect(lines.some((line) => line.startsWith('jev: payload: published review registry text; planned calls: 81; estimated input tokens: '))).toBe(true);
    expect(lines).toContain('jev: auth test provider=official model=stub-model');
    expect(lines.some((line) => line.startsWith('column jev: K=20 measured=20 unmeasured=0 p_loss=1.000 latency_p50_ms='))).toBe(true);
    expect(lines).toContain('funnel jev: asked=20 measured=20 yes=20 no=0');
    expect(lines).toContain('verdict jev: keep K=20 M=20 A=20 B=0 W=20 L=0 F=0 p=9.537e-7 jev_version=0.6.2 provider=official model=stub-model');
    expect(fake.calls).toHaveLength(1);

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log.slice(0, 3)).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
    expect(log.filter((line) => line.startsWith('choice '))).toHaveLength(60);
    expect(log.filter((line) => line.startsWith('noul '))).toHaveLength(20);

    const logged = readCalls(out);
    expect(logged).toHaveLength(81);
    expect(logged.filter((call: any) => call.call === 'auth_test')).toHaveLength(1);
    expect(logged.filter((call: any) => call.call === 'severity')).toHaveLength(60);
    expect(logged.filter((call: any) => call.call === 'funnel')).toHaveLength(20);
    for (const call of logged) {
      expect(call.provider).toBe('official');
      expect(call.model).toBe('stub-model');
      expect(call.jevVersion).toBe('0.6.2');
      expect(call.status).toBe('measured');
    }
  });

  it('the Jev gate skips on no credential, a missing binary and a wrong version', () => {
    const cases: Array<{ body: string | null; pathLine: (stubs: string) => string; tail: (stubs: string) => string[] }> = [
      {
        body: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) exit 3;; esac',
        pathLine: (stubs) => `jev: path=${path.join(stubs, 'jev')} provider=official`,
        tail: (stubs) => ['jev arm skipped: no credential'],
      },
      {
        body: 'case "$1" in --version) echo \'0.2.3\'; exit 0;; esac',
        pathLine: (stubs) => `jev: path=${path.join(stubs, 'jev')} provider=official`,
        tail: (stubs) => ['jev arm skipped: version', `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`],
      },
      {
        body: null,
        pathLine: () => 'jev: path=none provider=official',
        tail: (stubs) => ['jev arm skipped: jev not on PATH'],
      },
    ];

    for (const entry of cases) {
      const stubs = entry.body === null ? tempDir('severity-replay-jev-missing-') : stubDir({ jev: entry.body });
      const env = armEnv(stubs);
      if (entry.body === null) env.PATH = stubs;
      const lines: string[] = [];

      const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });

      expect(gate.passed).toBe(false);
      expect(lines).toEqual([entry.pathLine(stubs), ...entry.tail(stubs)]);
      if (entry.body === null) {
        expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
      } else {
        const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
        expect(log).toEqual(entry.tail(stubs)[0] === 'jev arm skipped: no credential'
          ? ['--version', 'auth status --provider official']
          : ['--version']);
      }
    }
  });

  it('a Jev report requalifies a changed model before the verdict', async () => {
    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
    const env = armEnv(stubs);
    const lines: string[] = [];
    const out = tempDir('severity-replay-jev-requalify-');
    const plan = planOf(Array.from({ length: 6 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
    const fake = fakeGit('');
    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });

    const result = await replay.runJevArm(plan, gate, {
      out: (line: string) => lines.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 1,
      callLog: replay.createCallLog(out),
      stored: { columns: { jev: { provider: 'openrouter', model: 'stub-model' } } },
      git: fake.git,
      root: '/repo',
    });

    expect(result.requalify).toBe('requalify: model changed');
    const requalifyIndex = lines.indexOf('requalify: model changed');
    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
    expect(lines[requalifyIndex + 1]).toMatch(/^verdict jev: keep /);
  });

  it('a Jev calls log the row digest without the finding id', async () => {
    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
    const env = armEnv(stubs);
    const lines: string[] = [];
    const out = tempDir('severity-replay-jev-digest-');
    const plan = planOf([{ findingId: 'P2-001', label: 'P1' }]);
    const fake = fakeGit('');
    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });

    await replay.runJevArm(plan, gate, {
      out: (line: string) => lines.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 1,
      callLog: replay.createCallLog(out),
      stored: null,
      git: fake.git,
      root: '/repo',
    });

    const expected = createHash('sha256').update(`${plan.rows[0].registry}#P2-001`).digest('hex').slice(0, 16);
    const calls = readCalls(out).filter((call: any) => call.call !== 'auth_test');
    expect(calls).toHaveLength(4);
    for (const call of calls) expect(call.row).toBe(expected);
    expect(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')).not.toContain('P2-001');
  });

  it('an unpublished row is withheld from Jev', async () => {
    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
    const env = armEnv(stubs);
    const lines: string[] = [];
    const out = tempDir('severity-replay-jev-unpublished-');
    const plan = planOf([
      { findingId: 'A-1', label: 'P1' },
      { findingId: 'B-1', label: 'P1', registry: SECOND_REGISTRY },
    ]);
    const fake = fakeGit(SECOND_REGISTRY);

    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
    const result = await replay.runJevArm(plan, gate, {
      out: (line: string) => lines.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 2000,
      callLog: replay.createCallLog(out),
      stored: null,
      git: fake.git,
      root: '/repo',
    });

    expect(result.stopped).toBeUndefined();
    expect(fake.calls).toHaveLength(2);
    expect(fake.calls[0][4]).toBe(`origin/main:${REGISTRY}`);
    expect(fake.calls[1][4]).toBe(`origin/main:${SECOND_REGISTRY}`);

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log.filter((line) => line.startsWith('choice '))).toHaveLength(3);
    expect(log.filter((line) => line.startsWith('noul '))).toHaveLength(1);

    const logged = readCalls(out);
    const withheld = logged.filter((call: any) => call.status === 'unmeasured_unpublished');
    expect(withheld).toHaveLength(3);
    expect(withheld.every((call: any) => call.call === 'severity' && call.order !== null && call.exitCode === null)).toBe(true);
    expect(new Set(withheld.map((call: any) => call.row)).size).toBe(1);
    expect(logged.filter((call: any) => call.call !== 'auth_test' && call.status === 'measured')).toHaveLength(4);
    expect(logged.filter((call: any) => call.call === 'funnel')).toHaveLength(1);
  });

  it('the Jev arm stops on a rejected key', async () => {
    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) [ "$2" = test ] && exit 3; exit 0;; esac' });
    const env = armEnv(stubs);
    const lines: string[] = [];
    const out = tempDir('severity-replay-jev-key-');
    const plan = planOf(Array.from({ length: 3 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
    const fake = fakeGit('');

    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
    const result = await replay.runJevArm(plan, gate, {
      out: (line: string) => lines.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 2000,
      callLog: replay.createCallLog(out),
      stored: null,
      git: fake.git,
      root: '/repo',
    });

    expect(gate.passed).toBe(true);
    expect(result.stopped).toBe('jev arm stopped: key rejected');
    expect(result.partialRows).toBe(0);
    expect(lines).toContain('jev arm stopped: key rejected');
    expect(lines).toContain('jev: partial rows=0');
    expect(lines.some((line) => line.startsWith('verdict jev:'))).toBe(false);

    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
    expect(log).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);

    const logged = readCalls(out);
    expect(logged).toHaveLength(1);
    expect(logged[0].call).toBe('auth_test');
    expect(logged[0].order).toBe(null);
    expect(logged[0].exitCode).toBe(3);
    expect(logged[0].status).toBe('unmeasured');
  });
});

describe('score-severity-replay main', () => {
  const REGISTRY = 'alpha/review/deep-review-findings-registry.json';

  type MainGit = (args: string[]) => { status: number; stdout: string; stderr: string };

  function fixtureRoot(count: number): string {
    const root = tempDir('severity-replay-main-root-');
    writeRegistry(root, REGISTRY, {
      openFindings: Array.from({ length: count }, (_, index) => finding({
        findingId: `A-${String(index).padStart(3, '0')}`,
        severity: 'P0',
        title: `Finding ${index}`,
        dimension: 'correctness',
        evidenceRefs: ['specs/x.md'],
        recommendation: 'Fix it.',
      })),
    });
    return root;
  }

  function fakeGit(root: string, files: string[]): MainGit {
    return (args: string[]) => {
      if (args[0] === 'rev-parse') return { status: 0, stdout: `${root}\n`, stderr: '' };
      if (args.includes('ls-files')) {
        return { status: 0, stdout: files.map((file) => `${file}\0`).join(''), stderr: '' };
      }
      return { status: 0, stdout: '', stderr: '' };
    };
  }

  function stubDir(bodies: Record<string, string>): string {
    const dir = tempDir('severity-replay-main-stubs-');
    for (const [name, body] of Object.entries(bodies)) {
      const file = path.join(dir, name);
      fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
      fs.chmodSync(file, 0o755);
    }
    return dir;
  }

  function stubEnv(stubs: string): NodeJS.ProcessEnv {
    return { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
  }

  function labelSheet(rows: Array<{ findingId: string; label: string }>): string {
    const file = path.join(tempDir('severity-replay-main-labels-'), 'labels.jsonl');
    const lines = rows.map((row) => JSON.stringify({
      registry: REGISTRY,
      finding_id: row.findingId,
      title: `Finding ${row.findingId}`,
      dimension: 'correctness',
      evidence_refs: [],
      label: row.label,
    }));
    fs.writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
    return file;
  }

  async function runMain(
    argv: string[],
    env: NodeJS.ProcessEnv,
    git: MainGit,
  ): Promise<{ code: number; lines: string[]; errs: string[] }> {
    const lines: string[] = [];
    const errs: string[] = [];
    const code = await replay.main(argv, {
      out: (line: string) => lines.push(line),
      err: (line: string) => errs.push(line),
      env,
      timeoutMs: 5000,
      backoffMs: 1,
      git,
    });
    return { code, lines, errs };
  }

  it('the default run makes zero model calls', async () => {
    const root = fixtureRoot(20);
    const stubs = stubDir({ jev: 'exit 0' });

    const { code, lines, errs } = await runMain([], stubEnv(stubs), fakeGit(root, [REGISTRY]));

    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('registries: 1');
    expect(lines).toContain('findings: 20 (P0 20, P1 0, P2 0, other 0)');
    expect(lines).toContain('p0 rows: 20 in 1 registries (one 0, two or more 1)');
    expect(lines).toContain('labels: none');
    expect(lines).toContain('labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)');
    expect(lines).toContain('labels dropped: 0');
    expect(lines).toContain('baseline: right 0 of 0');
    expect(lines).toContain(`question: ${replay.QUESTION_SEVERITY}`);
    expect(lines).toContain('margin: 0.10');
    expect(lines).toContain(replay.KEEP_RULE_LINE);
    expect(lines).toContain(replay.POWER_LINE);
    expect(lines[lines.length - 1]).toBe('stop: fewer than 20 labeled P0 negatives');
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });

  it('a Jev report records the gate and its finished column', async () => {
    const root = fixtureRoot(20);
    const out = tempDir('severity-replay-main-jev-report-');
    const labels = labelSheet(Array.from({ length: 20 }, (_, index) => ({ findingId: `A-${String(index).padStart(3, '0')}`, label: 'P1' })));
    const stubs = stubDir({ jev: `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0;;
  auth) if [ "$2" = status ]; then exit 0; fi; if [ "$2" = test ]; then echo '{"model":"stub-model"}'; exit 0; fi;;
  choice) echo '{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}'; exit 0;;
  noul) echo '{"answers":{"answer":{"noul":0.1}}}'; exit 0;;
esac
exit 0` });

    const { code, lines, errs } = await runMain(
      ['--jev', '--out', out, '--labels', labels],
      stubEnv(stubs),
      fakeGit(root, [REGISTRY]),
    );

    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('gate: open K=20 negatives=20');
    expect(lines).toContain('verdict jev: keep K=20 M=20 A=20 B=0 W=20 L=0 F=0 p=9.537e-7 jev_version=0.6.2 provider=official model=stub-model');
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.gate).toBe('gate: open K=20 negatives=20');
    expect(report.labels.K).toBe(20);
    expect(report.columns.jev.verdict).toBe('keep');
    expect(report.columns.jev.K).toBe(20);
    expect(report.columns.jev.M).toBe(20);
  });

  it('19 negatives spawn no backend', async () => {
    const root = fixtureRoot(20);
    const stubs = stubDir({ jev: 'exit 0' });
    const out = tempDir('severity-replay-main-stop-out-');
    const labels = labelSheet([
      { findingId: 'A-000', label: 'real' },
      ...Array.from({ length: 19 }, (_, index) => ({ findingId: `A-${String(index + 1).padStart(3, '0')}`, label: 'P1' })),
    ]);

    const { code, lines, errs } = await runMain(
      ['--jev', '--out', out, '--labels', labels],
      stubEnv(stubs),
      fakeGit(root, [REGISTRY]),
    );

    expect(code).toBe(0);
    expect(errs).toEqual([]);
    expect(lines).toContain('stop: fewer than 20 labeled P0 negatives');
    expect(lines).toContain('jev arm skipped: label gate');
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    expect(report.gate).toBe('stop: fewer than 20 labeled P0 negatives');
    expect(report.skipped).toEqual({ jev: 'jev arm skipped: label gate' });
  });

  it('`--jev` without `--out` exits 2 before any call', async () => {
    const root = fixtureRoot(20);
    const stubs = stubDir({ jev: 'exit 0' });

    const { code, lines, errs } = await runMain(['--jev'], stubEnv(stubs), fakeGit(root, [REGISTRY]));

    expect(code).toBe(2);
    expect(lines).toEqual([]);
    expect(errs).toEqual(['--jev needs --out <dir> so every call is recorded']);
    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
  });
});
