import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-improvement/scripts');
const require = createRequire(import.meta.url);

const DISPATCH_MODEL_PATH = path.join(SCRIPTS, 'model-benchmark/dispatch-model.cjs');
const dispatchModel = require(DISPATCH_MODEL_PATH) as {
  dispatchReal: (opts: Record<string, unknown>) => {
    ok: boolean;
    paused?: boolean;
    pause_reason?: string;
    sentinel_path?: string;
    error?: string;
  };
  buildSpawnSpec: (
    executor: string,
    promptText: string,
    resolved: Record<string, unknown>,
  ) => { bin: string; args: string[]; input: string | null };
  pauseSentinelPath: (opts?: Record<string, unknown>) => string;
  writePauseSentinel: (reason: string, opts?: Record<string, unknown>) => string;
  buildResumeHint: (sentinelPath: string) => string;
  KNOWN_EXECUTORS: Set<string>;
};
const scorer = require(path.join(SCRIPTS, 'model-benchmark/scorer/score-model-variant.cjs')) as {
  score: (opts: Record<string, unknown>) => Promise<{ dimensions: Record<string, number>; weightedScore: number }>;
};
const harness = require(path.join(SCRIPTS, 'model-benchmark/scorer/grader/harness.cjs')) as {
  clampScore01: (v: unknown) => number;
};

// ───── dispatcher cwd propagation to ALL executors ─────
describe('F-P1-1: dispatch-model cwd propagation', () => {
  let promptFile: string;
  beforeEach(() => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-cwd-'));
    promptFile = path.join(d, 'prompt.md');
    fs.writeFileSync(promptFile, 'review prompt');
  });

  for (const executor of ['cli-codex', 'cli-claude-code', 'cli-opencode']) {
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
      // Every executor honors the requested cwd, not just cli-opencode.
      expect(capturedCwd).toBe('/custom/work/dir');
    });
  }
});

// ───── cwd-check sibling-prefix path guard ─────
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
    const res = spawnSync('node', [path.join(SCRIPTS, 'model-benchmark/scorer/deterministic/cwd-check.cjs'), fpath, opath], { encoding: 'utf8' });
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

// ───── criteria-exec gate ─────
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

  it('skips the criterion by default unless criteria exec is explicitly enabled', async () => {
    delete process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
    const r = await scorer.score({ candidateId: 'c', outputText: 'out', criteria: crit, cwd, graderKind: 'noop' });
    expect(r.dimensions.D1).toBe(0); // skipped → not passed
  });

  it('runs the criterion when DEEP_AGENT_ALLOW_CRITERIA_EXEC=1', async () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '1';
    const r = await scorer.score({ candidateId: 'c', outputText: 'out', criteria: crit, cwd, graderKind: 'noop' });
    expect(r.dimensions.D1).toBe(1); // `true` exits 0 → criterion passes
  });

  it('skips the criterion when DEEP_AGENT_ALLOW_CRITERIA_EXEC=0', async () => {
    process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC = '0';
    const r = await scorer.score({ candidateId: 'c', outputText: 'out', criteria: crit, cwd, graderKind: 'noop' });
    expect(r.dimensions.D1).toBe(0); // skipped → not passed
  });
});

// ───── grader score clamp ─────
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

// ───── deterministic scoring behavior (not just shape) ─────
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

// ───── grader dispatch is READ-ONLY by default ─────
describe('F-P1-1: read-only-by-default executor dispatch', () => {
  const resolved = { model: 'm', agent: 'general', variant: null as string | null, dir: '/work', promptFile: '/tmp/p.md' };

  afterEach(() => { delete process.env.DEEP_AGENT_DISPATCH_WRITE; });

  it('cli-codex defaults to --sandbox read-only (not workspace-write)', () => {
    delete process.env.DEEP_AGENT_DISPATCH_WRITE;
    const spec = dispatchModel.buildSpawnSpec('cli-codex', 'prompt', resolved);
    const idx = spec.args.indexOf('--sandbox');
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(spec.args[idx + 1]).toBe('read-only');
    expect(spec.args).not.toContain('workspace-write');
  });

  it('cli-claude-code defaults to --permission-mode plan (not acceptEdits)', () => {
    delete process.env.DEEP_AGENT_DISPATCH_WRITE;
    const spec = dispatchModel.buildSpawnSpec('cli-claude-code', 'prompt', resolved);
    const idx = spec.args.indexOf('--permission-mode');
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(spec.args[idx + 1]).toBe('plan');
    expect(spec.args).not.toContain('acceptEdits');
  });

  it('DEEP_AGENT_DISPATCH_WRITE=1 escalates each executor to its write-capable mode', () => {
    process.env.DEEP_AGENT_DISPATCH_WRITE = '1';
    const codex = dispatchModel.buildSpawnSpec('cli-codex', 'prompt', resolved);
    expect(codex.args[codex.args.indexOf('--sandbox') + 1]).toBe('workspace-write');
    const claude = dispatchModel.buildSpawnSpec('cli-claude-code', 'prompt', resolved);
    expect(claude.args[claude.args.indexOf('--permission-mode') + 1]).toBe('acceptEdits');
  });

  it('routing is preserved for all active executors (bin resolves)', () => {
    for (const ex of ['cli-opencode', 'cli-claude-code', 'cli-codex']) {
      const spec = dispatchModel.buildSpawnSpec(ex, 'prompt', resolved);
      expect(typeof spec.bin).toBe('string');
      expect(spec.bin.length).toBeGreaterThan(0);
    }
  });
});

// ───── cli-opencode omits top-level --agent for the default `general` ─────
// Current opencode treats `general` as a subagent and rejects it at the top
// level (warns + falls back); token-plan providers (MiniMax, Xiaomi MiMo) reject
// it outright. The default agent is correct, so --agent is omitted unless an
// explicit non-general primary agent is requested.
describe('cli-opencode --agent handling', () => {
  const base = { model: 'm', variant: null as string | null, dir: '/work', promptFile: '/tmp/p.md' };

  it('omits --agent when the agent is the default `general`', () => {
    const spec = dispatchModel.buildSpawnSpec('cli-opencode', 'prompt', { ...base, agent: 'general' });
    expect(spec.args).not.toContain('--agent');
    expect(spec.args).toContain('--model');
  });

  it('omits --agent when the agent is unset', () => {
    const spec = dispatchModel.buildSpawnSpec('cli-opencode', 'prompt', { ...base, agent: undefined });
    expect(spec.args).not.toContain('--agent');
  });

  it('passes --agent for an explicit non-general primary agent', () => {
    const spec = dispatchModel.buildSpawnSpec('cli-opencode', 'prompt', { ...base, agent: 'orchestrate' });
    const idx = spec.args.indexOf('--agent');
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(spec.args[idx + 1]).toBe('orchestrate');
  });
});

// ───── pause sentinel is run-local ─────
describe('F-P1-14: packet-local pause sentinel', () => {
  let runDir: string;
  beforeEach(() => { runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-state-')); });
  afterEach(() => { fs.rmSync(runDir, { recursive: true, force: true }); });

  it('writes the sentinel under opts.state_dir, not the shared skill state dir', () => {
    const written = dispatchModel.writePauseSentinel('rate_limit_exhausted_3_strikes', { state_dir: runDir });
    expect(written.startsWith(runDir)).toBe(true);
    expect(fs.existsSync(written)).toBe(true);
    const body = JSON.parse(fs.readFileSync(written, 'utf8'));
    expect(body.sentinel_path).toBe(written);
  });

  it('two distinct run dirs do not collide on one global sentinel', () => {
    const dirA = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-A-'));
    const dirB = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-B-'));
    try {
      const a = dispatchModel.pauseSentinelPath({ state_dir: dirA });
      const b = dispatchModel.pauseSentinelPath({ state_dir: dirB });
      expect(a).not.toBe(b);
      expect(a.startsWith(dirA)).toBe(true);
      expect(b.startsWith(dirB)).toBe(true);
    } finally {
      fs.rmSync(dirA, { recursive: true, force: true });
      fs.rmSync(dirB, { recursive: true, force: true });
    }
  });

  it('dispatchReal writes the pause sentinel into the run-scoped dir on rate-limit exhaustion', () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-rl-'));
    const promptFile = path.join(d, 'p.md');
    fs.writeFileSync(promptFile, 'prompt');
    const rateLimited = () => ({ status: 1, stdout: '', stderr: 'rate limit exceeded (429)' });
    const r = dispatchModel.dispatchReal({
      executor: 'cli-codex',
      prompt_file: promptFile,
      cwd: d,
      model: 'm',
      agent: 'general',
      state_dir: runDir,
      _spawn: rateLimited,
      _backoff: [], // exhaust immediately — no real 60-240s rate-limit sleeps
    });
    expect(r.paused).toBe(true);
    expect(r.pause_reason).toBe('rate_limit');
    expect(r.sentinel_path && r.sentinel_path.startsWith(runDir)).toBe(true);
    fs.rmSync(d, { recursive: true, force: true });
  });
});

// ───── resume hint points at the real resume path ─────
describe('P2: pause resume hint targets the shipped loop-host', () => {
  it('resume hint removes the actual sentinel and runs scripts/shared/loop-host.cjs', () => {
    const sentinel = path.join(os.tmpdir(), 'whatever', '.benchmark-pause');
    const hint = dispatchModel.buildResumeHint(sentinel);
    expect(hint).toContain('.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs');
    expect(hint).toContain('--mode=model-benchmark');
    // Must NOT reference the stale `state/.benchmark-pause && re-run loop-host.cjs` form.
    expect(hint).not.toMatch(/re-run loop-host\.cjs/);
  });
});

// ───── CLI surfaces failure diagnostics ─────
describe('P2: dispatcher CLI surfaces stderr + error diagnostics', () => {
  let promptFile: string;
  beforeEach(() => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-cli-'));
    promptFile = path.join(d, 'p.md');
    fs.writeFileSync(promptFile, 'prompt');
  });

  it('emits a STDERR section and a non-null error on dispatch failure', () => {
    const env = { ...process.env };
    delete env.DEEP_AGENT_DISPATCH_WRITE;
    // Fresh --state-dir => no stray legacy sentinel can short-circuit the run.
    const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-clistate-'));
    // Unknown executor => dispatchReal returns ok:false with an error, exit 1.
    const res = spawnSync('node', [DISPATCH_MODEL_PATH, '--executor=cli-bogus', `--state-dir=${stateDir}`, promptFile], {
      encoding: 'utf8',
      env,
    });
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('--- STDERR ---');
    const jsonBlock = res.stdout.slice(0, res.stdout.indexOf('--- STDOUT ---'));
    const parsed = JSON.parse(jsonBlock);
    expect(parsed.ok).toBe(false);
    expect(parsed.error).toBeTruthy();
    expect(parsed.error).toContain('unknown executor');
  });
});
