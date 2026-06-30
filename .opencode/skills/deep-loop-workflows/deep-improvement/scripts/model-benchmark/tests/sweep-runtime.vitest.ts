import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeAll } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const MB_ROOT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark',
);
const LIB = path.join(MB_ROOT, 'lib');
const FIXTURE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures',
);
const PROFILE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles',
);

// The runtime modules are CommonJS; load them through a require bridge so the
// .cjs contracts are exercised exactly as the production sweep consumes them.
const require = createRequire(import.meta.url);
const { scoreCodeTask } = require(path.join(LIB, 'code-task-scorer.cjs'));
const sweep = require(path.join(MB_ROOT, 'sweep-benchmark.cjs'));

function readJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Fixtures are keyed by internal `id`, which differs from the filename:
// t3-bugfix-in-context.json carries id "t3-lower-bound", and
// t3-strict-acceptance.json carries id "t3-compare-versions".
const FX_LOWER_BOUND = readJson(path.join(FIXTURE_DIR, 't3-bugfix-in-context.json'));
const FX_COMPARE_VERSIONS = readJson(path.join(FIXTURE_DIR, 't3-strict-acceptance.json'));

// A correct binary-search lowerBound: leftmost insertion index, half-open upper
// bound, collapses to the left on an equal element (so duplicate runs return the
// first occurrence).
const CORRECT_LOWER_BOUND =
  'function lowerBound(arr, target){let lo=0,hi=arr.length;' +
  'while(lo<hi){const mid=(lo+hi)>>1;if(arr[mid]<target)lo=mid+1;else hi=mid;}return lo;}';

// A SemVer-precedence compareVersions covering numeric release fields,
// release-outranks-prerelease, and numeric-vs-alphanumeric identifier ordering.
const CORRECT_COMPARE_VERSIONS =
  'function compareVersions(a,b){' +
  'const split=(v)=>{const parts=v.split("-");const rel=parts[0].split(".").map(Number);' +
  'const pre=parts.length>1?parts.slice(1).join("-").split("."):null;return {rel,pre};};' +
  'const A=split(a),B=split(b);' +
  'for(let i=0;i<Math.max(A.rel.length,B.rel.length);i++){const x=A.rel[i]||0,y=B.rel[i]||0;' +
  'if(x!==y)return x<y?-1:1;}' +
  'if(!A.pre&&!B.pre)return 0;if(!A.pre)return 1;if(!B.pre)return -1;' +
  'for(let i=0;i<Math.max(A.pre.length,B.pre.length);i++){const x=A.pre[i],y=B.pre[i];' +
  'if(x===undefined)return -1;if(y===undefined)return 1;' +
  'const xn=/^[0-9]+$/.test(x),yn=/^[0-9]+$/.test(y);' +
  'if(xn&&yn){const d=Number(x)-Number(y);if(d!==0)return d<0?-1:1;}' +
  'else if(xn){return -1;}else if(yn){return 1;}' +
  'else if(x!==y){return x<y?-1:1;}}return 0;}';

const CORRECT_BY_FN: Record<string, string> = {
  lowerBound: CORRECT_LOWER_BOUND,
  compareVersions: CORRECT_COMPARE_VERSIONS,
};

describe('code-task-scorer: dimension vector for one cell', () => {
  it('scores a correct function as pass_rate 1.0 and format-adherent', () => {
    const r = scoreCodeTask(CORRECT_LOWER_BOUND, FX_LOWER_BOUND);
    expect(r.correctness_pass_rate).toBe(1);
    expect(r.format_adherent).toBe(true);
    // Visible + hidden oracle cases all run and all pass.
    expect(r.assertions_total).toBe(
      FX_LOWER_BOUND.tests.length + FX_LOWER_BOUND.hidden_tests.length,
    );
    expect(r.assertions_passed).toBe(r.assertions_total);
    expect(r.output_words).toBeGreaterThan(0);
    expect(r.output_chars).toBeGreaterThan(0);
    expect(r.per_test.every((t: any) => t.ok)).toBe(true);
  });

  it('flags a prose preamble as NOT format-adherent (format lane is separate)', () => {
    const withPreamble =
      'Sure, here is the implementation you requested for the binary search:\n' +
      '```js\n' +
      CORRECT_LOWER_BOUND +
      '\n```';
    const r = scoreCodeTask(withPreamble, FX_LOWER_BOUND);
    // The code is still correct — correctness and format are independent lanes.
    expect(r.correctness_pass_rate).toBe(1);
    expect(r.format_adherent).toBe(false);
  });

  it('scores a wrong function below 1.0', () => {
    // Off-by-one: `<=` collapses past equal elements, breaking the leftmost-of-
    // duplicate-run and several boundary cases.
    const wrong =
      'function lowerBound(arr, target){let lo=0,hi=arr.length;' +
      'while(lo<hi){const mid=(lo+hi)>>1;if(arr[mid]<=target)lo=mid+1;else hi=mid;}return lo;}';
    const r = scoreCodeTask(wrong, FX_LOWER_BOUND);
    expect(r.correctness_pass_rate).toBeLessThan(1);
    expect(r.correctness_pass_rate).toBeGreaterThanOrEqual(0);
    expect(r.assertions_passed).toBeLessThan(r.assertions_total);
  });

  it('runs hidden_tests, not just the visible ones', () => {
    const r = scoreCodeTask(CORRECT_COMPARE_VERSIONS, FX_COMPARE_VERSIONS);
    const total = FX_COMPARE_VERSIONS.tests.length + FX_COMPARE_VERSIONS.hidden_tests.length;
    expect(r.assertions_total).toBe(total);
    expect(r.correctness_pass_rate).toBe(1);
  });

  it('does not crash on output with no extractable function', () => {
    const r = scoreCodeTask('I am not going to write that function.', FX_LOWER_BOUND);
    expect(r.extracted).toBe(false);
    expect(r.correctness_pass_rate).toBe(0);
    expect(r.assertions_total).toBeGreaterThan(0);
  });
});

describe('sweep matrix expansion: pure config, one code path', () => {
  const bakeoff = readJson(path.join(PROFILE_DIR, 'framework-bakeoff.json'));
  const mvm = readJson(path.join(PROFILE_DIR, 'model-vs-model.json'));

  it('expands framework-bakeoff to 1 model x N frameworks x M fixtures cells', () => {
    const r = sweep.runSweep(bakeoff, {
      mock: true,
      mockResponder: () => 'x',
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    // 1 model x 1 variant x 5 frameworks x 2 fixtures = 10 cells.
    expect(r.meta.axes.models).toBe(1);
    expect(r.meta.axes.frameworks).toBe(5);
    expect(r.meta.axes.fixtures).toBe(2);
    expect(r.meta.cellCount).toBe(10);
    // x 3 samples per cell = 30 rows.
    expect(r.meta.axes.samples).toBe(3);
    expect(r.meta.sampleCount).toBe(30);
    expect(r.rows.length).toBe(30);
    // Every framework in the profile is represented in the rows.
    const fws = [...new Set(r.rows.map((x: any) => x.framework))].sort();
    expect(fws).toEqual(['cidi', 'costar', 'race', 'rcaf', 'tidd-ec']);
  });

  it('expands model-vs-model to K models x 1 framework x M fixtures cells', () => {
    const r = sweep.runSweep(mvm, {
      mock: true,
      mockResponder: () => 'x',
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    // 3 models x 1 variant x 1 framework x 2 fixtures = 6 cells.
    expect(r.meta.axes.models).toBe(3);
    expect(r.meta.axes.frameworks).toBe(1);
    expect(r.meta.axes.fixtures).toBe(2);
    expect(r.meta.cellCount).toBe(6);
    // x 3 samples per cell = 18 rows.
    expect(r.meta.sampleCount).toBe(18);
    expect(r.rows.length).toBe(18);
    // Distinct models, single framework.
    const models = [...new Set(r.rows.map((x: any) => x.model))];
    expect(models.length).toBe(3);
    const fws = [...new Set(r.rows.map((x: any) => x.framework))];
    expect(fws).toEqual(['rcaf']);
  });

  it('produces both modes through the SAME code path (no mode branch)', () => {
    // The expander is a pure function of the axis arrays. Cloning the bakeoff
    // profile but stripping `mode` must yield the identical cell count, proving
    // the cell math never reads `mode`.
    const noMode = JSON.parse(JSON.stringify(bakeoff));
    delete noMode.mode;
    const withMode = sweep.expandCells(bakeoff, [FX_LOWER_BOUND, FX_COMPARE_VERSIONS]);
    const without = sweep.expandCells(noMode, [FX_LOWER_BOUND, FX_COMPARE_VERSIONS]);
    expect(without.length).toBe(withMode.length);
    expect(without.length).toBe(10);

    // And a model-vs-model-shaped profile run through the SAME expandCells yields
    // its own count from the same function — the only difference is the data.
    const mvmCells = sweep.expandCells(mvm, [FX_LOWER_BOUND, FX_COMPARE_VERSIONS]);
    expect(mvmCells.length).toBe(6);
  });

  it('collapses an absent axis to a singleton', () => {
    // A profile with no frameworks[] and no variants[] still expands cleanly:
    // 2 models x 1 (variant singleton) x 1 (framework singleton) x 1 fixture.
    const minimal = {
      mode: 'model-vs-model',
      models: [{ executor: 'cli-opencode' }, { executor: 'cli-claude-code' }],
    };
    const cells = sweep.expandCells(minimal, [FX_LOWER_BOUND]);
    expect(cells.length).toBe(2);
    expect(cells.every((c: any) => c.framework === null)).toBe(true);
  });
});

describe('sweep mock end-to-end: saturation scenario', () => {
  const bakeoff = readJson(path.join(PROFILE_DIR, 'framework-bakeoff.json'));
  const correctResponder = (cell: any) => CORRECT_BY_FN[cell.fixture.fn_name];

  // The correct-code sweep runs each fixture's full visible+hidden oracle in an
  // isolated subprocess PER case, so a 30-row sweep spawns hundreds of node
  // children. The saturation shape (every cell 100%) does not depend on sample
  // count, so the shared correct-code sweep forces samplesPerCell=1 and a single
  // run is reused across assertions. An explicit timeout covers the subprocess
  // fan-out without loosening the default for the fast tests.
  let satRun: any;
  beforeAll(() => {
    satRun = sweep.runSweep(bakeoff, {
      mock: true,
      mockResponder: correctResponder,
      samplesPerCell: 1,
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
  }, 60000);

  it('returns scored rows with dimension + nullable-usage fields', () => {
    // 1 model x 5 frameworks x 2 fixtures x 1 sample = 10 rows.
    expect(satRun.rows.length).toBe(10);
    for (const row of satRun.rows) {
      expect(row.dispatch_ok).toBe(true);
      expect(row.exit_code).toBe(0);
      expect(typeof row.correctness_pass_rate).toBe('number');
      expect(typeof row.format_adherent).toBe('boolean');
      expect(row.output_words).toBeGreaterThan(0);
      // Nullable usage fields are present in the row shape from the start so the
      // schema does not churn when providers later expose token/cost.
      expect(row).toHaveProperty('tokens_in', null);
      expect(row).toHaveProperty('tokens_out', null);
      expect(row).toHaveProperty('cost_usd', null);
    }
  });

  it('every row scores correctness 1.0 when all frameworks get correct code', () => {
    // Correctness is useless as a ranking signal here because every cell is 100%.
    // The reducer in stage 3 must REFUSE to crown a winner on a saturated column;
    // this proves the sweep produces exactly that saturated input shape.
    const rates = [...new Set(satRun.rows.map((x: any) => x.correctness_pass_rate))];
    expect(rates).toEqual([1]);
    expect(satRun.rows.every((x: any) => x.correctness_pass_rate === 1)).toBe(true);
    // Every framework is represented in the saturated column.
    const fws = [...new Set(satRun.rows.map((x: any) => x.framework))].sort();
    expect(fws).toEqual(['cidi', 'costar', 'race', 'rcaf', 'tidd-ec']);
  });

  it('records a non-saturated spread when some frameworks get broken code', () => {
    // Inversely: broken code for two frameworks yields a mix of pass rates, so the
    // column is NOT saturated and a downstream verdict becomes possible. Forced to
    // one sample to bound the subprocess fan-out.
    const broken = 'function notTheTarget(){return 42;}';
    const responder = (cell: any) =>
      cell.framework === 'rcaf' || cell.framework === 'race'
        ? broken
        : CORRECT_BY_FN[cell.fixture.fn_name];
    const r = sweep.runSweep(bakeoff, {
      mock: true,
      mockResponder: responder,
      samplesPerCell: 1,
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    const rates = new Set(r.rows.map((x: any) => x.correctness_pass_rate));
    // At least a 0 (broken, no extractable target fn) and a 1 (correct) present.
    expect(rates.has(0)).toBe(true);
    expect(rates.has(1)).toBe(true);
  }, 60000);

  it('writes results.json to opts.outDir when requested', () => {
    const outDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'sweep-test-out-'));
    // The write path itself is what is under test; a cheap responder (extraction
    // misses, so no oracle subprocesses spawn) keeps it fast while still emitting
    // the full 30-row matrix and the results.json artifact.
    const r = sweep.runSweep(bakeoff, {
      mock: true,
      mockResponder: () => 'no function here',
      outDir,
      repoRoot: WORKSPACE_ROOT,
    });
    const resultsPath = path.join(outDir, 'results.json');
    expect(fs.existsSync(resultsPath)).toBe(true);
    const written = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    expect(written.rows.length).toBe(30);
    expect(written.meta.cellCount).toBe(10);
    expect(written.meta.sampleCount).toBe(30);
    expect(r.meta.resultsPath).toBe(resultsPath);
  });
});
