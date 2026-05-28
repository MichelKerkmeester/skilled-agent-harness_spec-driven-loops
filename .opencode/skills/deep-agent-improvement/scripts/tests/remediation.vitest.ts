import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-agent-improvement/scripts');
const require = createRequire(import.meta.url);

const dispatchModel = require(path.join(SCRIPTS, 'dispatch-model.cjs')) as {
  dispatchReal: (opts: Record<string, unknown>) => { ok: boolean };
  KNOWN_EXECUTORS: Set<string>;
};
const scorer = require(path.join(SCRIPTS, 'scorer/score-model-variant.cjs')) as {
  score: (opts: Record<string, unknown>) => Promise<{ dimensions: Record<string, number>; weightedScore: number }>;
};
const harness = require(path.join(SCRIPTS, 'scorer/grader/harness.cjs')) as {
  clampScore01: (v: unknown) => number;
};

// ───── F-P1-1: dispatcher cwd propagation to ALL executors ─────
describe('F-P1-1: dispatch-model cwd propagation', () => {
  let promptFile: string;
  beforeEach(() => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-cwd-'));
    promptFile = path.join(d, 'prompt.md');
    fs.writeFileSync(promptFile, 'review prompt');
  });

  for (const executor of ['cli-codex', 'cli-claude-code', 'cli-gemini', 'cli-devin', 'cli-opencode']) {
    it(`passes cwd to the spawn layer for ${executor}`, () => {
      let capturedCwd: string | undefined;
      const fakeSpawn = (_bin: string, _args: string[], opts: { cwd?: string }) => {
        capturedCwd = opts.cwd;
        return { status: 0, stdout: 'ok', stderr: '' };
      };
      const r = dispatchModel.dispatchReal({
        executor,
        prompt_file: promptFile,
        cwd: '/custom/work/dir',
        model: 'm',
        agent: 'general',
        _spawn: fakeSpawn,
      });
      expect(r.ok).toBe(true);
      // The whole point of F-P1-1: every executor honors the requested cwd,
      // not just cli-opencode (which previously was the only one via --dir).
      expect(capturedCwd).toBe('/custom/work/dir');
    });
  }
});

// ───── F-P1-2: cwd-check sibling-prefix path guard ─────
describe('F-P1-2: cwd-check prefix boundary', () => {
  let dir: string;
  beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cwdck-')); });
  afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); });

  function classifyVia(outputText: string, cwdAbs: string) {
    const fixture = { id: 't', scope: { cwd: cwdAbs }, allowlist: {} };
    const fpath = path.join(dir, 'f.json');
    const opath = path.join(dir, 'o.md');
    fs.writeFileSync(fpath, JSON.stringify(fixture));
    fs.writeFileSync(opath, outputText);
    const res = spawnSync('node', [path.join(SCRIPTS, 'scorer/deterministic/cwd-check.cjs'), fpath, opath], { encoding: 'utf8' });
    return JSON.parse(res.stdout.trim());
  }

  it('classifies a sibling-prefix path as outside, not in-cwd', () => {
    const proj = path.join(dir, 'proj');
    fs.mkdirSync(proj);
    const out = classifyVia(`see ${proj}-evil/secret.ts for details`, proj);
    const tally = out.details?.tally || out.tally || {};
    // Before the fix `/repo/proj-evil` startsWith `/repo/proj` → mislabeled in-cwd.
    expect(tally.absolute_in_fixture_cwd || 0).toBe(0);
    expect(tally.absolute_outside || 0).toBeGreaterThanOrEqual(1);
  });

  it('still classifies a genuine in-cwd path as in-cwd', () => {
    const proj = path.join(dir, 'proj');
    fs.mkdirSync(proj);
    const out = classifyVia(`edit ${proj}/src/index.ts now`, proj);
    const tally = out.details?.tally || out.tally || {};
    expect(tally.absolute_in_fixture_cwd || 0).toBeGreaterThanOrEqual(1);
  });
});

// ───── F-P1-3: criteria-exec gate ─────
describe('F-P1-3: criteria deterministic-exec gate', () => {
  let cwd: string;
  beforeEach(() => {
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'crit-'));
    fs.writeFileSync(path.join(cwd, 'f.ts'), 'export const x = 1;\n');
  });
  afterEach(() => {
    fs.rmSync(cwd, { recursive: true, force: true });
    delete process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
  });

  const crit = { acceptance: [{ id: 'd1', type: 'deterministic', command: 'true', expected_exit: 0 }] };

  it('runs the criterion by default (backward-compat)', async () => {
    delete process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
    const r = await scorer.score({ candidateId: 'c', outputText: 'out', criteria: crit, cwd, graderKind: 'noop' });
    expect(r.dimensions.D1).toBe(1); // `true` exits 0 → criterion passes
  });

  it('skips the criterion when DEEP_AGENT_ALLOW_CRITERIA_EXEC=0', async () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '0';
    const r = await scorer.score({ candidateId: 'c', outputText: 'out', criteria: crit, cwd, graderKind: 'noop' });
    expect(r.dimensions.D1).toBe(0); // skipped → not passed
  });
});

// ───── F-P1-4: grader score clamp ─────
describe('F-P1-4: grader clampScore01', () => {
  it('clamps to [0,1] and coerces non-finite to 0', () => {
    expect(harness.clampScore01(1.5)).toBe(1);
    expect(harness.clampScore01(-0.2)).toBe(0);
    expect(harness.clampScore01(0.73)).toBe(0.73);
    expect(harness.clampScore01('not-a-number')).toBe(0);
    expect(harness.clampScore01(Infinity)).toBe(0);
    expect(harness.clampScore01(null)).toBe(0);
  });
});

// ───── F-P2-8: deterministic scoring behavior (not just shape) ─────
describe('F-P2-8: deterministic scoring values', () => {
  let cwd: string;
  beforeEach(() => {
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'detscore-'));
    fs.writeFileSync(path.join(cwd, 'f.ts'), 'export function go(){return 1;}\n');
  });
  afterEach(() => { fs.rmSync(cwd, { recursive: true, force: true }); });

  it('a passing grep acceptance yields D1=1 and a custom single-dim rubric yields an exact weighted score', async () => {
    const r = await scorer.score({
      candidateId: 'c',
      outputText: 'out',
      criteria: { acceptance: [{ id: 'a', type: 'grep', file: 'f.ts', pattern: 'function go' }] },
      cwd,
      graderKind: 'noop',
      rubric: { dims: [{ id: 'D1', weight: 1.0 }] },
    });
    expect(r.dimensions.D1).toBe(1);
    expect(r.weightedScore).toBe(1); // D1=1 × weight 1.0
  });

  it('a failing grep acceptance drops D1 to 0 under the same rubric', async () => {
    const r = await scorer.score({
      candidateId: 'c',
      outputText: 'out',
      criteria: { acceptance: [{ id: 'a', type: 'grep', file: 'f.ts', pattern: 'NONEXISTENT_SYMBOL' }] },
      cwd,
      graderKind: 'noop',
      rubric: { dims: [{ id: 'D1', weight: 1.0 }] },
    });
    expect(r.dimensions.D1).toBe(0);
    expect(r.weightedScore).toBe(0);
  });
});
