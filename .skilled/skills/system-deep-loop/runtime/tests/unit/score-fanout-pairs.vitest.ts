// ───────────────────────────────────────────────────────────────────
// MODULE: score-fanout-pairs
//   Fixtures and stubs (tempDir, writeRun, stubDir, runMain, labeledFixture)
//   Census walk (listTrackedFiles, walkRuns, findingsOf)
//   Pair selection (classifyPair, pairKey)
//   Merge oracle (mergeDecision, readBaseline)
//   Pair sheet, labels and gate (writePairSheet, parseLabels, gateState)
//   Jev gate and arm (jevGate, runJevArm)
//   Keep rule and report (binomialTail, decideVerdict, main)
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pairs = require(path.join(TEST_DIR, '../../scripts/score-fanout-pairs.cjs')) as Record<string, any>;

const tempDirs: string[] = [];

/** A lineage fixture: a bare label, or an explicit registry name and findings. */
type LineageSpec = string | { label: string; registry?: string; findings?: Record<string, unknown>[] };

/** One lineage as the walker reports it: its label and its tracked registry path. */
type LineageRef = { label: string; registry: string };

/** One kept run, keyed `<loop>:<runDir>` as the script keys runs. */
type WalkedRun = { key: string; loop: string; runDir: string; lineages: LineageRef[] };

/** Create a temp directory that afterEach removes. */
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

/** One distinguishable finding for a label, carrying the loop's own id field. */
function defaultFinding(loop: string, label: string): Record<string, unknown> {
  const finding: Record<string, unknown> = { title: `Finding ${label}`, summary: `Body for ${label}` };
  if (loop === 'review') finding.findingId = `${label}-1`;
  else finding.id = `${label}-1`;
  return finding;
}

/**
 * Write one run's lineage registries under `root`.
 *
 * A lineage lands at `<runDir>/<loop>/lineages/<label>/<registry>`, the
 * tracked shape the walker groups by, and its registry carries the loop's
 * own findings field. Returns the registry paths relative to `root`, sorted,
 * so a test can stand in for `git ls-files` without a repository.
 */
function writeRun(root: string, loop: string, runDir: string, lineages: LineageSpec[]): string[] {
  const findingsField = loop === 'review' ? 'openFindings' : 'keyFindings';
  const defaultRegistry = loop === 'review' ? 'deep-review-findings-registry.json' : 'findings-registry.json';
  const written: string[] = [];
  for (const spec of lineages) {
    const label = typeof spec === 'string' ? spec : spec.label;
    const registry = typeof spec === 'string' ? defaultRegistry : spec.registry ?? defaultRegistry;
    const findings = typeof spec === 'string' ? [defaultFinding(loop, label)] : spec.findings ?? [defaultFinding(loop, label)];
    const absolute = path.join(root, runDir, loop, 'lineages', label, registry);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, JSON.stringify({ [findingsField]: findings }), 'utf8');
    written.push(`${runDir}/${loop}/lineages/${label}/${registry}`);
  }
  return written.sort();
}

/**
 * Write executable backend stubs that append their arguments to a log file
 * beside themselves, so a test can see whether and how an arm called them.
 * Returns the stub directory; a caller puts it first on PATH.
 */
function stubDir(bodies: Record<string, string>): string {
  const dir = tempDir('fanout-pairs-stubs-');
  for (const [name, body] of Object.entries(bodies)) {
    const file = path.join(dir, name);
    fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
    fs.chmodSync(file, 0o755);
  }
  return dir;
}

/**
 * Run the script's main with captured stdout/stderr and an injected
 * environment. The short call timeout and backoff keep a stub arm fast;
 * callers pass root, listTracked and git through `deps`.
 */
async function runMain(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
  deps: Record<string, unknown> = {},
): Promise<{ code: number; lines: string[]; errs: string[] }> {
  const lines: string[] = [];
  const errs: string[] = [];
  const code = await pairs.main(argv, {
    out: (line: string) => lines.push(line),
    err: (line: string) => errs.push(line),
    env,
    timeoutMs: 5000,
    backoffMs: 1,
    ...deps,
  });
  return { code, lines, errs };
}

/**
 * Build `K` classed research pairs under `root` plus a label sheet naming
 * them.
 *
 * The first `crossBody` pairs carry different bodies and no title, so the
 * text-overlap rule admits them; the rest share a body and lightly
 * overlapping titles, so the body rule admits them. Near-line pairs are
 * labelled `same` and cross-body pairs `different`, matching the merge's own
 * decision with dedup on. Each finding carries `_lineage` so the script's own
 * `pairKey` can name the pair. Returns the label sheet path.
 */
function labeledFixture(root: string, K: number, crossBody: number): string {
  const keys: string[] = [];
  for (let index = 0; index < K; index += 1) {
    const runDir = `pair-${index + 1}`;
    const cross = index < crossBody;
    const a = cross
      ? { id: 'a', summary: 'shared problem alpha' }
      : { id: 'a', summary: 'shared body', title: 'alpha beta gamma' };
    const b = cross
      ? { id: 'b', summary: 'shared problem beta' }
      : { id: 'b', summary: 'shared body', title: 'alpha delta epsilon' };
    writeRun(root, 'research', runDir, [
      { label: 'la', findings: [a] },
      { label: 'lb', findings: [b] },
    ]);
    keys.push(pairs.pairKey('research', runDir, { ...a, _lineage: 'la' }, { ...b, _lineage: 'lb' }));
  }
  const sheetPath = path.join(tempDir('fanout-pairs-labels-'), 'labels.jsonl');
  const rows = keys.map((key, index) => JSON.stringify({ pair_key: key, label: index < crossBody ? 'different' : 'same' }));
  fs.writeFileSync(sheetPath, `${rows.join('\n')}\n`, 'utf8');
  return sheetPath;
}

describe('score-fanout-pairs walker', () => {
  it('walker skips a one-lineage run', () => {
    const root = tempDir('fanout-runs-');
    const tracked = [
      ...writeRun(root, 'research', 'run-two', ['alpha', 'beta']),
      ...writeRun(root, 'research', 'run-one', ['solo']),
    ].sort();
    const runs = pairs.walkRuns(root, { listTracked: () => tracked }) as WalkedRun[];
    expect(runs).toHaveLength(1);
    expect(runs[0].key).toBe('research:run-two');
    expect(runs[0].lineages).toHaveLength(2);
  });

  it('walker accepts both research registry names', () => {
    const root = tempDir('fanout-runs-');
    const tracked = [
      ...writeRun(root, 'research', 'run-mix', [{ label: 'alpha', registry: 'findings-registry.json' }]),
      ...writeRun(root, 'research', 'run-mix', [{ label: 'beta', registry: 'deep-research-findings-registry.json' }]),
    ].sort();
    const runs = pairs.walkRuns(root, { listTracked: () => tracked }) as WalkedRun[];
    expect(runs).toHaveLength(1);
    expect(runs[0].lineages.map((lineage) => lineage.label)).toEqual(['alpha', 'beta']);
    expect(runs[0].lineages.map((lineage) => lineage.registry).sort()).toEqual(tracked);
  });

  it('walker reads the review findings field', () => {
    const root = tempDir('fanout-runs-');
    const registry = 'run-review/review/lineages/alpha/deep-review-findings-registry.json';
    const absolute = path.join(root, 'run-review', 'review', 'lineages', 'alpha', 'deep-review-findings-registry.json');
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    // Both fields are present so a read of the wrong one returns the decoy
    fs.writeFileSync(
      absolute,
      JSON.stringify({
        openFindings: [{ findingId: 'R-1', title: 'From openFindings' }],
        keyFindings: [{ id: 'R-0', title: 'From keyFindings' }],
      }),
      'utf8',
    );
    const findings = pairs.findingsOf(root, 'review', registry) as Record<string, unknown>[];
    expect(findings.map((finding) => finding.findingId)).toEqual(['R-1']);
  });
});

/** Space-joined `w0` … `w<count-1>`, so a test can dial an exact title or text overlap. */
function tokensOf(count: number): string {
  return Array.from({ length: count }, (_, index) => `w${index}`).join(' ');
}

describe('score-fanout-pairs selection', () => {
  it('near-line admits its pair', () => {
    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(5) };
    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
    expect(pairs.classifyPair(a, b)).toBe('near-line');
  });

  it('near-line admits the upper edge', () => {
    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(29) };
    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
    expect(pairs.classifyPair(a, b)).toBe('near-line');
  });

  it('near-line rejects below the band', () => {
    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(4) };
    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
    expect(pairs.classifyPair(a, b)).toBeNull();
  });

  it('near-line rejects at the upper bound', () => {
    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(30) };
    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
    expect(pairs.classifyPair(a, b)).toBeNull();
  });

  it('cross-body admits its pair', () => {
    const a = { id: 'A-1', summary: 'alpha beta' };
    const b = { id: 'B-1', summary: 'alpha beta gamma delta', title: 'unused heading' };
    expect(pairs.classifyPair(a, b)).toBe('cross-body');
  });

  it('cross-body rejects below 0.5', () => {
    const a = { id: 'A-1', summary: tokensOf(49) };
    const b = { id: 'B-1', summary: tokensOf(100), title: 'unused heading' };
    expect(pairs.classifyPair(a, b)).toBeNull();
  });

  it('cross-body rejects an equal-body pair', () => {
    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(90) };
    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
    const kind = pairs.classifyPair(a, b);
    expect(kind === 'near-line' || kind === null).toBe(true);
  });
});

/** One pair record as `readBaseline` reads it: the pair's two sides plus the operator's label. */
type LabeledPair = {
  loop: string;
  la: string;
  a: Record<string, unknown>;
  lb: string;
  b: Record<string, unknown>;
  label: string;
};

/**
 * One labeled pair whose two merge decisions are known by construction.
 *
 * An `agree` pair carries different ids and different bodies, so both settings
 * keep it apart while the label agrees. An `on-only` pair shares a body with
 * lightly overlapping titles, so only the near-duplicate fold collapses it and
 * only the dedup-on decision matches the `same` label. A `neither` pair repeats
 * one record with matching ids, so both settings fold it while the label says
 * `different`.
 */
function labeledPair(index: number, kind: 'agree' | 'on-only' | 'neither'): LabeledPair {
  if (kind === 'agree') {
    return {
      loop: 'research',
      la: 'la',
      lb: 'lb',
      label: 'different',
      a: { id: `agree-a-${index}`, title: `left ${index}`, summary: `first body ${index}` },
      b: { id: `agree-b-${index}`, title: `right ${index + 1}`, summary: `second body ${index}` },
    };
  }
  if (kind === 'on-only') {
    return {
      loop: 'research',
      la: 'la',
      lb: 'lb',
      label: 'same',
      a: { id: `on-a-${index}`, title: 'alpha beta gamma', summary: 'shared problem statement' },
      b: { id: `on-b-${index}`, title: 'alpha delta epsilon', summary: 'shared problem statement' },
    };
  }
  const repeated = { id: `neither-${index}`, title: `same thing ${index}`, summary: `same body ${index}` };
  return { loop: 'research', la: 'la', lb: 'lb', label: 'different', a: repeated, b: { ...repeated } };
}

/** Build the 40-pair baseline fixture from `agree`, `on-only` and `neither` pairs. */
function baselineFixture(agree: number, onOnly: number, neither: number): LabeledPair[] {
  const labeled: LabeledPair[] = [];
  for (let index = 0; index < agree; index += 1) labeled.push(labeledPair(index, 'agree'));
  for (let index = 0; index < onOnly; index += 1) labeled.push(labeledPair(index, 'on-only'));
  for (let index = 0; index < neither; index += 1) labeled.push(labeledPair(index, 'neither'));
  return labeled;
}

describe('score-fanout-pairs merge oracle', () => {
  it('oracle reads both decisions', () => {
    const a = { id: 'A-1', title: 'alpha beta gamma', summary: 'shared problem statement' };
    const b = { id: 'B-1', title: 'alpha delta epsilon', summary: 'shared problem statement' };
    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, true)).toBe('same');
    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, false)).toBe('different');
  });

  it("oracle reads today's default", () => {
    const finding = { id: 'X-1', title: 'cold cache miss', summary: 'the cache misses on a cold start' };
    expect(pairs.mergeDecision('research', 'la', finding, 'lb', { ...finding }, false)).toBe('same');
  });

  it('oracle marks an unreadable pair', () => {
    const a = {
      findingId: 'R-1',
      severity: 'P1',
      disposition: 'resolved',
      title: 'alpha beta gamma',
      summary: 'shared problem statement',
    };
    const b = {
      findingId: 'R-2',
      severity: 'P1',
      disposition: 'resolved',
      title: 'alpha delta epsilon',
      summary: 'shared problem statement',
    };
    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, true)).toBe('undecidable');
    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, false)).toBe('undecidable');
    const baseline = pairs.readBaseline([{ loop: 'review', la: 'la', a, lb: 'lb', b, label: 'same' }]);
    expect(baseline.onRight).toBe(0);
    expect(baseline.offRight).toBe(0);
  });

  it('oracle marks a one-side drop', () => {
    const a = {
      findingId: 'R-1',
      severity: 'P1',
      disposition: 'active',
      title: 'alpha beta gamma',
      summary: 'shared problem statement',
    };
    const b = { ...a, findingId: 'R-2', disposition: 'resolved', title: 'alpha delta epsilon' };
    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, true)).toBe('undecidable');
    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, false)).toBe('undecidable');
    const active = { ...b, disposition: 'active' };
    expect(pairs.mergeDecision('review', 'la', a, 'lb', active, true)).toBe('same');
    expect(pairs.mergeDecision('review', 'la', a, 'lb', active, false)).toBe('different');
  });

  it('baseline picks the better decision', () => {
    const baseline = pairs.readBaseline(baselineFixture(25, 5, 10));
    expect(baseline.method).toBe('dedup-on');
    expect(baseline.onRight).toBe(30);
    expect(baseline.offRight).toBe(25);
    expect(baseline.right).toBe(30);
  });

  it('baseline ties to dedup off', () => {
    const baseline = pairs.readBaseline(baselineFixture(30, 0, 10));
    expect(baseline.method).toBe('dedup-off');
    expect(baseline.onRight).toBe(30);
    expect(baseline.offRight).toBe(30);
    expect(baseline.right).toBe(30);
  });
});

describe('score-fanout-pairs parity', () => {
  it('parity: body key agrees with the merge', () => {
    // Equal and unequal body keys, each pair carrying the class the census gives it
    // beside the decision the merge must reach with near-duplicate folding on. With
    // distinct ids the merge folds a pair only when both sides agree on the body key,
    // so a fixture whose two answers stop matching is the drift this test catches.
    const fixtures: Array<{
      a: Record<string, unknown>;
      b: Record<string, unknown>;
      kind: string | null;
      decision: string;
    }> = [
      {
        // Same body, titles overlapping 0.20: inside the near-line band and over the merge's threshold.
        a: { id: 'A-1', summary: 'shared problem statement', title: tokensOf(20) },
        b: { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) },
        kind: 'near-line',
        decision: 'same',
      },
      {
        // Same body, titles sharing no token: the merge keeps the pair apart and the band rejects it.
        a: { id: 'A-2', summary: 'shared body text', title: 'alpha beta gamma' },
        b: { id: 'B-2', summary: 'shared body text', title: 'delta epsilon zeta' },
        kind: null,
        decision: 'different',
      },
      {
        // Different bodies, no titles: the body key is the first gate, and the text overlap falls short.
        a: { id: 'A-3', summary: 'cache eviction on cold start' },
        b: { id: 'B-3', summary: 'retry storm in the queue' },
        kind: null,
        decision: 'different',
      },
      {
        // Different bodies whose text still points at one problem: the class the merge cannot see.
        a: { id: 'A-4', summary: 'alpha beta' },
        b: { id: 'B-4', summary: 'alpha beta gamma delta', title: 'unused heading' },
        kind: 'cross-body',
        decision: 'different',
      },
    ];

    for (const fixture of fixtures) {
      const kind = pairs.classifyPair(fixture.a, fixture.b);
      const decision = pairs.mergeDecision('research', 'la', fixture.a, 'lb', fixture.b, true);
      expect(kind).toBe(fixture.kind);
      expect(decision).toBe(fixture.decision);
      // Near-line names exactly the same-body pairs the merge folds on these fixtures.
      expect(kind === 'near-line').toBe(decision === 'same');
    }
  });

  it('parity: a title-only pair stays out of near-line', () => {
    // One body, two titles sharing no token: the titles are the only signal left, and
    // they disagree, so the merge splits the pair while the band rejects it below its floor.
    const a = { id: 'A-1', summary: 'shared problem statement', title: 'cache miss on cold start' };
    const b = { id: 'B-1', summary: 'shared problem statement', title: 'retry storm in the queue' };
    expect(pairs.bodyKey(a)).toBe(pairs.bodyKey(b));
    expect(pairs.overlap(pairs.titleTokens(a), pairs.titleTokens(b))).toBe(0);
    expect(pairs.classifyPair(a, b)).toBeNull();
    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, true)).toBe('different');
  });
});

/** One classed pair as the census reports it, for the sheet and gate fixtures. */
function sheetPair(kind: string, index: number): Record<string, any> {
  const key = `research:run-${index}#la@a-${index}|lb@b-${index}`;
  return {
    key,
    loop: 'research',
    runDir: `run-${index}`,
    kind,
    la: 'la',
    a: { id: `a-${index}`, summary: `body a ${index}` },
    lb: 'lb',
    b: { id: `b-${index}`, summary: `body b ${index}` },
    textA: `body a ${index}`,
    textB: `body b ${index}`,
  };
}

/** A pair index keyed as the label reader joins it; the first `crossBody` pairs are cross-body. */
function sheetIndex(total: number, crossBody: number): Map<string, Record<string, any>> {
  const index = new Map<string, Record<string, any>>();
  for (let position = 0; position < total; position += 1) {
    const pair = sheetPair(position < crossBody ? 'cross-body' : 'near-line', position);
    index.set(pair.key, pair);
  }
  return index;
}

/** The operator's filled sheet for a whole pair index, one label per row. */
function sheetLines(pairIndex: Map<string, Record<string, any>>): string {
  const rows = [...pairIndex.values()].map((pair) => JSON.stringify({
    pair_key: pair.key,
    label: pair.kind === 'cross-body' ? 'different' : 'same',
  }));
  return `${rows.join('\n')}\n`;
}

/** The baseline shape the gate reads: right on `right` of the labeled pairs, dedup off on a tie. */
function sheetBaseline(right: number): Record<string, any> {
  return { method: 'dedup-off', onRight: right, offRight: right, right };
}

describe('score-fanout-pairs sheet, labels and gate', () => {
  it('pair sheet writes outside the repository', () => {
    const root = tempDir('fanout-pairs-sheet-root-');
    const nearLine = Array.from({ length: 61 }, (_, index) => sheetPair('near-line', index));
    const crossBody = Array.from({ length: 61 }, (_, index) => sheetPair('cross-body', index + 100));
    const sheetPath = path.join(tempDir('fanout-pairs-sheet-out-'), 'pair-sheet.jsonl');
    const byHash = (left: string, right: string) => (pairs.sha256Hex(left) < pairs.sha256Hex(right) ? -1 : 1);

    const written = pairs.writePairSheet({ 'near-line': nearLine, 'cross-body': crossBody }, sheetPath, root) as number;

    const rows = fs.readFileSync(sheetPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line) as Record<string, any>);
    const nearWritten = rows.filter((row) => row.class === 'near-line');
    const crossWritten = rows.filter((row) => row.class === 'cross-body');
    expect(written).toBe(120);
    expect(nearWritten).toHaveLength(60);
    expect(crossWritten).toHaveLength(60);
    expect(nearWritten.map((row) => row.pair_key)).toEqual(nearLine.map((pair) => pair.key).sort(byHash).slice(0, 60));
    expect(crossWritten.map((row) => row.pair_key)).toEqual(crossBody.map((pair) => pair.key).sort(byHash).slice(0, 60));
    expect(rows.every((row) => row.label === '')).toBe(true);
    expect(Object.keys(nearWritten[0])).toEqual(['pair_key', 'class', 'loop', 'run_dir', 'lineages', 'text_a', 'text_b', 'label']);
  });

  it('pair sheet refuses an inside path', () => {
    const root = tempDir('fanout-pairs-sheet-refuse-');
    const target = path.join(root, 'sheet.jsonl');

    expect(() => pairs.writePairSheet({ 'near-line': [sheetPair('near-line', 0)], 'cross-body': [] }, target, root))
      .toThrow('refusing to write the pair sheet inside the repository');
    expect(fs.existsSync(target)).toBe(false);
  });

  it('label reader stops under 40 pairs', () => {
    const pairIndex = sheetIndex(39, 10);
    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;

    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(39)) as { kind: string; line: string };

    expect(gate.kind).toBe('label');
    expect(gate.line).toBe('stop: fewer than 40 labeled pairs');
  });

  it('label reader stops under 10 cross-body', () => {
    const pairIndex = sheetIndex(40, 9);
    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;

    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(40)) as { kind: string; line: string };

    expect(gate.kind).toBe('cross-body');
    expect(gate.line).toBe('stop: fewer than 10 labeled cross-body pairs');
  });

  it('label reader names a bad value by row', () => {
    const pairIndex = sheetIndex(3, 0);
    const rows = [...pairIndex.values()].map((pair, index) => JSON.stringify({
      pair_key: pair.key,
      label: index === 2 ? 'maybe' : 'same',
    }));

    expect(() => pairs.parseLabels(`${rows.join('\n')}\n`, pairIndex)).toThrow('labels row 3:');
  });

  it('label reader drops an unknown key', () => {
    const pairIndex = sheetIndex(40, 10);
    const ghost = 'research:ghost#la@a|lb@b';
    const text = `${sheetLines(pairIndex)}${JSON.stringify({ pair_key: ghost, label: 'same' })}\n`;

    const labels = pairs.parseLabels(text, pairIndex) as Map<string, string>;

    expect(labels.size).toBe(40);
    expect(labels.has(ghost)).toBe(false);
  });

  it('no headroom above 90 percent', () => {
    const pairIndex = sheetIndex(40, 10);
    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;

    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(37)) as { kind: string; line: string };

    expect(gate.kind).toBe('headroom');
    expect(gate.line).toBe('no headroom');
  });
});

/** One labeled pair as the Jev arm reads it: its pair key, gold label, texts and registries. */
function armPair(index: number): Record<string, any> {
  return {
    key: `research:run-${index}#la@a-${index}|lb@b-${index}`,
    label: 'same',
    textA: `finding text a ${index}`,
    textB: `finding text b ${index}`,
    registries: [`run-${index}/research/lineages/la/findings-registry.json`],
  };
}

/** A jev stub for the gate and arm: pinned version, passing auth, one same answer per call. */
const JEV_STUB = `case "$1" in
  --version) echo 'jev 0.6.2'; exit 0;;
  auth)
    if [ "$2" = test ]; then echo '{"model":"stub-model"}'; exit 0; fi
    exit 0;;
  noul) echo '{"answers":{"answer":{"noul":0.9}}}'; exit 0;;
esac
exit 0`;

/** The stub directory first on PATH, so the gate finds the stub and never a live client. */
function stubEnv(stub: string): NodeJS.ProcessEnv {
  return { ...process.env, PATH: `${stub}${path.delimiter}${process.env.PATH ?? ''}` };
}

describe('score-fanout-pairs jev gate and arm', () => {
  it('jev gate passes a stub', () => {
    const stub = stubDir({ jev: JEV_STUB });
    const out: string[] = [];
    const gate = pairs.jevGate({ out: (line: string) => out.push(line), env: stubEnv(stub), timeoutMs: 5000 }) as Record<string, any>;

    expect(gate.passed).toBe(true);
    expect(gate.provider).toBe('official');
    expect(out[0]).toBe(`jev: path=${path.join(stub, 'jev')} provider=official`);
    const logged = fs.readFileSync(path.join(stub, 'jev.log'), 'utf8').trim().split('\n');
    expect(logged).toEqual(['--version', 'auth status --provider official']);
  });

  it('jev gate skips on exit 3', () => {
    const stub = stubDir({ jev: 'case "$1" in\n  --version) echo "jev 0.6.2"; exit 0;;\n  auth) exit 3;;\nesac' });
    const out: string[] = [];
    const gate = pairs.jevGate({ out: (line: string) => out.push(line), env: stubEnv(stub), timeoutMs: 5000 }) as Record<string, any>;

    expect(gate.passed).toBe(false);
    expect(out).toEqual([
      `jev: path=${path.join(stub, 'jev')} provider=official`,
      'jev arm skipped: no credential',
    ]);
  });

  it('jev arm withholds an unpublished pair', async () => {
    const stub = stubDir({ jev: JEV_STUB });
    const row = armPair(0);
    const calls: Record<string, any>[] = [];

    await pairs.runJevArm(
      { rows: [row], baselineCalls: new Map() },
      { path: path.join(stub, 'jev'), provider: 'official' },
      {
        out: () => {},
        env: stubEnv(stub),
        timeoutMs: 5000,
        backoffMs: 1,
        callLog: { append: (record: Record<string, any>) => calls.push(record) },
        stored: null,
        publishedAt: () => false,
      },
    );

    const withheld = calls.filter((record) => record.status === 'unmeasured_unpublished');
    expect(withheld.map((record) => record.pair_key)).toEqual([row.key]);
    const logFile = path.join(stub, 'jev.log');
    const logged = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').split('\n') : [];
    expect(logged.filter((line) => line.startsWith('noul'))).toEqual([]);
  });

  it('jev arm prints keep', async () => {
    const stub = stubDir({ jev: JEV_STUB });
    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
    const out: string[] = [];

    await pairs.runJevArm(
      { rows, baselineCalls },
      { path: path.join(stub, 'jev'), provider: 'official' },
      {
        out: (line: string) => out.push(line),
        env: stubEnv(stub),
        timeoutMs: 5000,
        backoffMs: 1,
        callLog: { append: () => {} },
        stored: null,
        publishedAt: () => true,
      },
    );

    const verdict = out.find((line) => line.startsWith('verdict jev: ')) as string;
    expect(verdict).toBeDefined();
    expect(verdict.startsWith('verdict jev: keep')).toBe(true);
    expect(verdict).toContain('reader=none named');
    expect(verdict).toContain('jev_version=0.6.2 provider=official model=stub-model');
    const logged = fs.readFileSync(path.join(stub, 'jev.log'), 'utf8').trim().split('\n');
    expect(logged.filter((line) => line.startsWith('noul'))).toHaveLength(15);
  });

  it('jev arm requalifies only when the stored model differs', async () => {
    const stub = stubDir({ jev: JEV_STUB });
    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
    const run = async (stored: Record<string, any>) => {
      const out: string[] = [];
      await pairs.runJevArm(
        { rows, baselineCalls },
        { path: path.join(stub, 'jev'), provider: 'official' },
        {
          out: (line: string) => out.push(line),
          env: stubEnv(stub),
          timeoutMs: 5000,
          backoffMs: 1,
          callLog: { append: () => {} },
          stored,
          publishedAt: () => true,
        },
      );
      return out;
    };

    const changed = await run({ columns: { jev: { provider: 'official', model: 'old-model' } } });
    const index = changed.indexOf('requalify: model changed');
    expect(index).toBeGreaterThanOrEqual(0);
    expect(changed[index + 1].startsWith('verdict jev: ')).toBe(true);
    const same = await run({ columns: { jev: { provider: 'official', model: 'stub-model' } } });
    expect(same).not.toContain('requalify: model changed');
  });
});

describe('score-fanout-pairs keep rule and report', () => {
  it('verdict prints keep', () => {
    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
    const answers = new Map(rows.map((row) => [row.key, [0.9, 0.9, 0.9]]));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));

    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;

    expect(column.line.startsWith('verdict jev: keep')).toBe(true);
    expect(column.line).toContain('reader=none named');
  });

  it('verdict prints kill', () => {
    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
    const answers = new Map(rows.map((row) => [row.key, [0.1, 0.1, 0.1]]));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'same']));

    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;

    expect(column.line.startsWith('verdict jev: kill')).toBe(true);
  });

  it('verdict prints stop (coverage)', () => {
    const rows = Array.from({ length: 10 }, (_, index) => armPair(index));
    const answers = new Map(rows.slice(0, 8).map((row) => [row.key, [0.9, 0.9, 0.9]]));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));

    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;

    expect(column.line.startsWith('verdict jev: stop (coverage)')).toBe(true);
  });

  it('verdict stops on flips', () => {
    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
    const answers = new Map(rows.map((row, index) => [row.key, index < 3 ? [0.9, 0.9, 0.1] : [0.9, 0.9, 0.9]]));
    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));

    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;

    expect(column.line.startsWith('verdict jev: stop (flips)')).toBe(true);
  });

  it('default run makes no call', async () => {
    const stub = stubDir({ jev: JEV_STUB });
    const root = tempDir('fanout-pairs-default-');
    const tracked = writeRun(root, 'research', 'run-default', ['alpha', 'beta']);

    const { code, lines } = await runMain([], stubEnv(stub), { root, listTracked: () => tracked });

    expect(code).toBe(0);
    for (const prefix of ['runs: ', 'pairs: ', 'class near-line: ', 'class cross-body: ', 'merge decisions: ']) {
      expect(lines.some((line) => line.startsWith(prefix))).toBe(true);
    }
    expect(fs.existsSync(path.join(stub, 'jev.log'))).toBe(false);
  });

  it('refuses a model arm without --out', async () => {
    const stub = stubDir({ jev: JEV_STUB });

    const { code, lines, errs } = await runMain(['--jev'], stubEnv(stub));

    expect(code).toBe(2);
    expect(errs.join('\n')).toContain('--out');
    expect(lines).toEqual([]);
    expect(fs.existsSync(path.join(stub, 'jev.log'))).toBe(false);
  });

  it('writes one Jev report and one call record per arm request', async () => {
    const stub = stubDir({ jev: JEV_STUB });
    const root = tempDir('fanout-pairs-jev-report-');
    const outDir = path.join(tempDir('fanout-pairs-jev-out-'), 'run');
    const sheetPath = labeledFixture(root, 40, 10);
    const labelRows = fs.readFileSync(sheetPath, 'utf8').trim().split('\n').map((line, index) => ({
      ...JSON.parse(line) as Record<string, any>,
      label: index < 9 || index >= 25 ? 'different' : 'same',
    }));
    fs.writeFileSync(sheetPath, `${labelRows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
    const tracked = Array.from({ length: 40 }, (_, index) => [
      `pair-${index + 1}/research/lineages/la/findings-registry.json`,
      `pair-${index + 1}/research/lineages/lb/findings-registry.json`,
    ]).flat();

    const { code } = await runMain(
      ['--jev', '--out', outDir, '--labels', sheetPath],
      stubEnv(stub),
      { root, listTracked: () => tracked, git: () => ({ status: 0, error: null }) },
    );

    expect(code).toBe(0);
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8')) as Record<string, any>;
    expect(report.columns.jev.line.startsWith('verdict jev: ')).toBe(true);
    expect(report.columns.jev.line).toContain('reader=none named');
    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n')
      .map((line) => JSON.parse(line) as Record<string, any>);
    expect(calls).toHaveLength(121);
    expect(calls.filter((call) => call.pair_key === null)).toHaveLength(1);
    expect(calls.filter((call) => call.pair_key !== null)).toHaveLength(120);
  }, 30000);
});
