import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const require = createRequire(import.meta.url);

const scorer = require(path.join(
  WORKSPACE_ROOT,
  '.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs',
)) as {
  score: (opts: Record<string, unknown>) => Promise<{
    fixtureId: string;
    weightedScore: number;
    hard_gate_failed: boolean;
    dimensions: Record<string, number>;
    deterministic: Record<string, { score: number }>;
    grader: { score: number; parse_status: string };
  }>;
  buildGraderFn: (kind: string, options?: Record<string, unknown>) => (
    f: unknown,
    o: string,
    opts: unknown,
  ) => Promise<{
    score: number | null;
    confidence: number | null;
    parse_status: string;
    measured?: boolean;
    evidence?: unknown[];
  }>;
  scoreAcceptanceDeterministic: (
    acceptance: Array<Record<string, unknown>>,
    cwdAbs: string,
  ) => {
    score: number;
    details: { total: number; passed: number; per_criterion: Array<{ id: string; passed: boolean; detail: string }> };
  };
  DEFAULT_RUBRIC: { dims: Array<{ id: string; weight: number }> };
};

const d4 = require(path.join(
  WORKSPACE_ROOT,
  '.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs',
)) as { QUESTION: string };

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
  it('throws for a grader kind outside noop, mock, llm and jev', () => {
    expect(() => scorer.buildGraderFn('bogus')).toThrow(/unknown grader kind 'bogus'/);
  });
});

describe('jev grader (cascade)', () => {
  const tempDirs: string[] = [];
  let stubs = '';
  let env: NodeJS.ProcessEnv = process.env;

  function writeJevScript(bodyLines: string[]): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-grader-'));
    tempDirs.push(dir);
    stubs = dir;
    env = {
      ...process.env,
      JEV_TRANSPORT: 'jev',
      HOOK_FLAGS_CONFIG: path.join(dir, 'missing-hook-flags.json'),
    };
    const file = path.join(dir, 'jev');
    fs.writeFileSync(
      file,
      [
        '#!/bin/sh',
        'D=$(dirname "$0")',
        'echo "$*" >> "$D/jev.log"',
        'N=$(cat "$D/count" 2>/dev/null || echo 0)',
        'echo $((N+1)) > "$D/count"',
        ...bodyLines,
        '',
      ].join('\n'),
      'utf8',
    );
    fs.chmodSync(file, 0o755);
    return file;
  }

  function writeStub(answers: string[]): string {
    const cases = answers
      .map((answer, index) => `  ${index}) echo '${answer.replace(/'/g, "'\\''")}';;`)
      .join('\n');
    return writeJevScript(['case "$N" in', cases, '  *) exit 1;;', 'esac', 'exit 0']);
  }

  function jevLog(): string[] {
    const log = path.join(stubs, 'jev.log');
    if (!fs.existsSync(log)) return [];
    const text = fs.readFileSync(log, 'utf8').trim();
    return text.length === 0 ? [] : text.split('\n');
  }

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  });

  it('clears a row the deterministic check scores 1 without calling jev', async () => {
    const stub = writeStub([]);
    const grader = scorer.buildGraderFn('jev', { jev: { path: stub, provider: 'official' }, env });
    const res = await grader({ id: 'fx', task: 'Write add.' }, 'output text', { hallucinationCheck: { score: 1, passed: true } });
    expect(res.score).toBe(1.0);
    expect(res.parse_status).toBe('cascade-clear');
    expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
  });

  it('flags a hallucinating row when two of three reruns say yes', async () => {
    const stub = writeStub([
      '{"answers":{"answer":{"noul":0.9}}}',
      '{"answers":{"answer":{"noul":0.8}}}',
      '{"answers":{"answer":{"noul":0.1}}}',
    ]);
    const grader = scorer.buildGraderFn('jev', { jev: { path: stub, provider: 'official' }, env });
    const res = await grader({ id: 'fx', task: 'Write add.' }, 'output text', { hallucinationCheck: { score: 0, passed: false } });
    expect(res.score).toBe(0.0);
    expect(res.parse_status).toBe('jev');
    expect(res.confidence).toBeCloseTo(2 / 3, 5);
    expect(res.evidence).toEqual([0.9, 0.8, 0.1]);
    const calls = jevLog();
    expect(calls).toHaveLength(3);
    for (const call of calls) expect(call).toContain(`noul --provider official -q ${d4.QUESTION}`);
  });

  it('stays unmeasured when a rerun returns no number', async () => {
    const stub = writeStub([
      '{"answers":{"answer":{"noul":0.9}}}',
      '{"answers":{"answer":{"noul":0.8}}}',
      'not json',
    ]);
    const grader = scorer.buildGraderFn('jev', { jev: { path: stub, provider: 'official' }, env });
    const res = await grader({ id: 'fx', task: 'Write add.' }, 'output text', { hallucinationCheck: { score: 0, passed: false } });
    expect(res.score).toBeNull();
    expect(res.parse_status).toBe('unmeasured');
    expect(res.measured).toBe(false);
  });

  it('retries a rerun that exits 4 once, then keeps the row measured', async () => {
    const stub = writeJevScript([
      'if [ "$N" = 0 ]; then exit 4; fi',
      'echo \'{"answers":{"answer":{"noul":0.1}}}\'',
      'exit 0',
    ]);
    const grader = scorer.buildGraderFn('jev', { jev: { path: stub, provider: 'official' }, env, backoffMs: 1 });

    const res = await grader({ id: 'fx', task: 'Write add.' }, 'output text', { hallucinationCheck: { score: 0, passed: false } });

    expect(res.parse_status).toBe('jev');
    expect(res.score).toBe(1.0);
    expect(res.evidence).toEqual([0.1, 0.1, 0.1]);
    expect(jevLog()).toHaveLength(4);
  });
});
