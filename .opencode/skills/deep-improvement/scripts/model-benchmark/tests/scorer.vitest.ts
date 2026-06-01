import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const require = createRequire(import.meta.url);

const scorer = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs',
)) as {
  score: (opts: Record<string, unknown>) => Promise<{
    fixtureId: string;
    weightedScore: number;
    hard_gate_failed: boolean;
    dimensions: Record<string, number>;
    deterministic: Record<string, { score: number }>;
    grader: { score: number; parse_status: string };
  }>;
  buildGraderFn: (kind: string) => (f: unknown, o: string, opts: unknown) => Promise<{ score: number; parse_status: string }>;
  scoreAcceptanceDeterministic: (
    acceptance: Array<Record<string, unknown>>,
    cwdAbs: string,
  ) => {
    score: number;
    details: { total: number; passed: number; per_criterion: Array<{ id: string; passed: boolean; detail: string }> };
  };
  DEFAULT_RUBRIC: { dims: Array<{ id: string; weight: number }> };
};

let cwd: string;
const OUTPUT = [
  '<pre-plan>',
  '1. Add formatBytes(n)',
  '   - Acceptance: handles n=0',
  '   - Verification: npx vitest run',
  '2. Pick unit',
  '</pre-plan>',
  '',
  '```ts',
  'export function formatBytes(n: number): string { return n + " B"; }',
  '```',
].join('\n');

beforeEach(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'scorer-cwd-'));
  fs.writeFileSync(path.join(cwd, 'format.ts'), 'export function formatBytes(n: number): string { return n + " B"; }\n');
});
afterEach(() => {
  fs.rmSync(cwd, { recursive: true, force: true });
});

describe('score-model-variant (decoupled 5-dim scorer)', () => {
  it('requires an absolute cwd (decoupling invariant)', async () => {
    await expect(scorer.score({ candidateId: 'c', outputText: OUTPUT, cwd: 'relative/dir', graderKind: 'noop' })).rejects.toThrow(/absolute/i);
  });

  it('scores a candidate across all 5 dimensions with the noop grader', async () => {
    const r = await scorer.score({ candidateId: 'cand-1', outputText: OUTPUT, criteria: {}, cwd, graderKind: 'noop' });
    expect(r.fixtureId).toBe('cand-1');
    expect(typeof r.weightedScore).toBe('number');
    expect(r.weightedScore).toBeGreaterThanOrEqual(0);
    expect(r.weightedScore).toBeLessThanOrEqual(1);
    for (const d of ['D1', 'D2', 'D3', 'D4', 'D5']) {
      expect(typeof r.dimensions[d]).toBe('number');
    }
    expect(r.dimensions.D4).toBe(1); // noop grader
    expect(r.hard_gate_failed).toBe(false);
  });

  it('D1 reflects a passing grep acceptance criterion (reads from absolute cwd)', async () => {
    const r = await scorer.score({
      candidateId: 'cand-acc',
      outputText: OUTPUT,
      criteria: { acceptance: [{ id: 'a1', type: 'grep', file: 'format.ts', pattern: 'formatBytes' }] },
      cwd,
      graderKind: 'noop',
    });
    expect(r.dimensions.D1).toBe(1);
  });

  it('D1 drops when a grep acceptance criterion fails', async () => {
    const r = await scorer.score({
      candidateId: 'cand-fail',
      outputText: OUTPUT,
      criteria: { acceptance: [{ id: 'a1', type: 'grep', file: 'format.ts', pattern: 'doesNotExistSymbol' }] },
      cwd,
      graderKind: 'noop',
    });
    expect(r.dimensions.D1).toBe(0);
  });

  it('honors a custom rubric weighting', async () => {
    const r = await scorer.score({
      candidateId: 'cand-w',
      outputText: OUTPUT,
      criteria: {},
      cwd,
      graderKind: 'noop',
      rubric: { dims: [{ id: 'D4', weight: 1.0 }] },
    });
    expect(r.weightedScore).toBe(1); // D4 noop = 1.0, weight 1.0
  });
});

describe('criteria file-read containment (F017-P2-03)', () => {
  it('rejects a traversal grep that escapes the fixture cwd instead of reading it', () => {
    // Plant a sensitive file in the PARENT of the cwd; a `../` grep must not reach it.
    const parentSecret = path.join(cwd, '..', `secret-${path.basename(cwd)}.txt`);
    fs.writeFileSync(parentSecret, 'TOPSECRET formatBytes\n');
    try {
      const r = scorer.scoreAcceptanceDeterministic(
        [{ id: 'oob', type: 'grep', file: `../${path.basename(parentSecret)}`, pattern: 'TOPSECRET' }],
        cwd,
      );
      const crit = r.details.per_criterion[0];
      expect(crit.passed).toBe(false);
      expect(crit.detail).toMatch(/outside fixture cwd/);
    } finally {
      fs.rmSync(parentSecret, { force: true });
    }
  });

  it('does not grant grep_absent a pass for an out-of-bounds path', () => {
    const r = scorer.scoreAcceptanceDeterministic(
      [{ id: 'oob-abs', type: 'grep_absent', file: '../../../../etc/hosts', pattern: 'anything' }],
      cwd,
    );
    const crit = r.details.per_criterion[0];
    expect(crit.passed).toBe(false);
    expect(crit.detail).toMatch(/outside fixture cwd/);
  });

  it('still reads an in-cwd grep file normally', () => {
    const r = scorer.scoreAcceptanceDeterministic(
      [{ id: 'in', type: 'grep', file: 'format.ts', pattern: 'formatBytes' }],
      cwd,
    );
    expect(r.details.per_criterion[0].passed).toBe(true);
  });
});

describe('buildGraderFn factory', () => {
  it('noop grader returns a constant D4', async () => {
    const g = scorer.buildGraderFn('noop');
    const res = await g({ id: 'x' }, 'out', {});
    expect(res.score).toBe(1.0);
    expect(res.parse_status).toBe('noop');
  });
  it('mock grader returns a parseable deterministic score (no LLM)', async () => {
    const g = scorer.buildGraderFn('mock');
    const res = await g({ id: 'x' }, 'out', { candidateHash: 'h', mockMode: 'high-confidence' });
    expect(typeof res.score).toBe('number');
    expect(res.score).toBeGreaterThan(0);
  });
});
