import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const MB_ROOT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/scripts/model-benchmark',
);
const FIXTURE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures',
);
const PROFILE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles',
);

// The runtime module is CommonJS; load it through a require bridge so the .cjs
// contract is exercised exactly as the production sweep consumes it.
const require = createRequire(import.meta.url);
const sweep = require(path.join(MB_ROOT, 'sweep-benchmark.cjs'));

function readJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const HARD_IDS = [
  'hard-merge-intervals',
  'hard-parse-csv-line',
  'hard-roman-to-int',
  'hard-eval-expr',
];

describe('sweep dispatch isolation: cwd is a throwaway temp dir, not the repo', () => {
  // A minimal real-path profile (mock:false) so the sweep takes the dispatch
  // branch — the one that materializes a temp dir and calls the dispatcher. The
  // _dispatch seam intercepts the call so NO real CLI runs, while capturing the
  // exact cwd the sweep passed and the prompt-file path it wrote.
  const profile = {
    mode: 'model-vs-model',
    fixtureDir: FIXTURE_DIR,
    fixtures: ['hard-merge-intervals'],
    fixtureSelection: { include: ['hard-merge-intervals'] },
    frameworks: ['costar'],
    models: [{ executor: 'cli-opencode', model: 'fake/model', variant: 'high' }],
    sampling: { samplesPerCell: 1 },
  };

  it('passes a temp-dir cwd (under os.tmpdir, not the repo root) to the dispatch', () => {
    // Capture, AT dispatch time, the live facts that the cwd is a real temp dir
    // (resolved BEFORE the sweep cleans it up — afterward the leaf is gone, which
    // is itself the cleanup proof exercised by the next test).
    const seen: Array<{
      cwd: string;
      promptFile: string;
      cwdExistedAtDispatch: boolean;
      promptInCwd: boolean;
      realCwdUnderTmp: boolean;
    }> = [];
    const realTmp = fs.realpathSync(os.tmpdir());
    sweep.runSweep(profile, {
      // NOT mock: exercise the real dispatch path (temp-dir materialization +
      // cleanup). The _dispatch seam stands in for the CLI so nothing is spawned.
      mock: false,
      _dispatch: (opts: any) => {
        const realCwd = fs.realpathSync(opts.cwd); // dir is still live here
        seen.push({
          cwd: opts.cwd,
          promptFile: opts.prompt_file,
          cwdExistedAtDispatch: fs.existsSync(opts.cwd),
          promptInCwd:
            path.dirname(path.resolve(opts.prompt_file)) === path.resolve(opts.cwd) &&
            fs.existsSync(opts.prompt_file),
          realCwdUnderTmp: realCwd.startsWith(realTmp),
        });
        // Return a benign envelope so scoring proceeds (extraction will miss; the
        // cwd facts are the point, not the score).
        return {
          ok: true,
          exit_code: 0,
          stdout: 'no function here',
          output: 'no function here',
          attempts: 1,
        };
      },
      writeResults: false,
      report: false,
      repoRoot: WORKSPACE_ROOT,
    });

    expect(seen.length).toBe(1);
    const s = seen[0];
    // The dispatch cwd existed at dispatch time and was under the OS temp dir...
    expect(s.cwdExistedAtDispatch).toBe(true);
    expect(s.realCwdUnderTmp).toBe(true);
    // ...the prompt file the sweep wrote lived inside that same temp cwd...
    expect(s.promptInCwd).toBe(true);
    // ...and the cwd is emphatically NOT the repo root (the pollution bug).
    expect(path.resolve(s.cwd)).not.toBe(path.resolve(WORKSPACE_ROOT));
  });

  it('cleans up the per-cell temp dir after the dispatch (no leak, repo stays clean)', () => {
    const seen: string[] = [];
    sweep.runSweep(profile, {
      mock: false,
      _dispatch: (opts: any) => {
        seen.push(opts.cwd);
        // Simulate an agentic model writing a stray file into the cwd: it must
        // be discarded with the temp dir, never surfacing in the repo.
        fs.writeFileSync(path.join(opts.cwd, 'model-wrote-this.txt'), 'junk');
        return { ok: true, exit_code: 0, stdout: 'x', output: 'x', attempts: 1 };
      },
      writeResults: false,
      report: false,
      repoRoot: WORKSPACE_ROOT,
    });

    expect(seen.length).toBe(1);
    // The temp dir (and the stray file the "model" wrote) is gone after the run.
    expect(fs.existsSync(seen[0])).toBe(false);
  });

  it('isolates EVERY cell of a multi-model x multi-fixture sweep in its own temp dir', () => {
    const multi = {
      mode: 'model-vs-model',
      fixtureDir: FIXTURE_DIR,
      fixtures: HARD_IDS,
      fixtureSelection: { include: HARD_IDS },
      frameworks: ['costar'],
      models: [
        { executor: 'cli-opencode', model: 'fake/a', variant: 'high' },
        { executor: 'cli-opencode', model: 'fake/b', variant: 'high' },
      ],
      sampling: { samplesPerCell: 1 },
    };
    const dirs: string[] = [];
    sweep.runSweep(multi, {
      mock: false,
      _dispatch: (opts: any) => {
        dirs.push(opts.cwd);
        return { ok: true, exit_code: 0, stdout: 'x', output: 'x', attempts: 1 };
      },
      writeResults: false,
      report: false,
      repoRoot: WORKSPACE_ROOT,
    });

    // 2 models x 1 framework x 4 fixtures x 1 sample = 8 dispatches.
    expect(dirs.length).toBe(8);
    // Every per-cell temp dir is cleaned up after its dispatch.
    for (const d of dirs) {
      expect(fs.existsSync(d)).toBe(false);
    }
    // Each dispatch got a DISTINCT temp dir, none equal to the repo root.
    const unique = new Set(dirs.map((d) => path.resolve(d)));
    expect(unique.size).toBe(8);
    for (const d of dirs) {
      expect(path.resolve(d)).not.toBe(path.resolve(WORKSPACE_ROOT));
      // The captured dirs were materialized under the OS temp root.
      expect(path.dirname(path.resolve(d))).toBe(path.resolve(os.tmpdir()));
    }
  });
});

describe('hard fixture pack: shape + adversarial oracle density', () => {
  it('all four hard fixtures parse and carry the required code-task keys', () => {
    for (const id of HARD_IDS) {
      const fx = readJson(path.join(FIXTURE_DIR, id + '.json'));
      expect(fx.id).toBe(id);
      expect(typeof fx.fn_name).toBe('string');
      expect(fx.fn_name.length).toBeGreaterThan(0);
      expect(typeof fx.signature).toBe('string');
      expect(typeof fx.task).toBe('string');
      expect(fx.tier).toBe('T4');
      expect(fx.saturation).toEqual({ status: 'active' });
      // The task must forbid file writes (isolation contract is also stated in-prompt).
      expect(fx.task).toMatch(/do not create or write any files/i);
    }
  });

  it('every hard fixture carries hidden_tests and a discriminating oracle count', () => {
    for (const id of HARD_IDS) {
      const fx = readJson(path.join(FIXTURE_DIR, id + '.json'));
      expect(Array.isArray(fx.tests)).toBe(true);
      expect(Array.isArray(fx.hidden_tests)).toBe(true);
      // The discrimination property: many hidden+adversarial cases so a model that
      // solves most-but-not-all lands on a fraction, not a binary pass.
      expect(fx.hidden_tests.length).toBeGreaterThanOrEqual(10);
      const total = fx.tests.length + fx.hidden_tests.length;
      expect(total).toBeGreaterThanOrEqual(15);
      // Each oracle case is a {name, args, expect} triple the deep-equal runner consumes.
      for (const t of fx.tests.concat(fx.hidden_tests)) {
        expect(typeof t.name).toBe('string');
        expect(Array.isArray(t.args)).toBe(true);
        expect('expect' in t).toBe(true);
      }
    }
  });
});

describe('capability profile: loads and selects the hard pack', () => {
  it('capability-m3-vs-mimo.json is a valid model-vs-model profile over the 4 hard fixtures', () => {
    const validator = require(
      path.join(MB_ROOT, 'lib', 'profile-validator.cjs'),
    );
    const profile = readJson(path.join(PROFILE_DIR, 'capability-m3-vs-mimo.json'));
    expect(validator.validateProfile(profile)).toEqual({ valid: true, errors: [] });
    expect(profile.mode).toBe('model-vs-model');
    expect(profile.models.length).toBe(2);
    expect(profile.fixtures.sort()).toEqual([...HARD_IDS].sort());
    expect(profile.sampling.samplesPerCell).toBe(3);
    expect(profile.reporting.groupBy).toBe('model');
  });
});
