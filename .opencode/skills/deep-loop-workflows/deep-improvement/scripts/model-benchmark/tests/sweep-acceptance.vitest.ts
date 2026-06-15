import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeAll } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const MB_ROOT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark',
);
const PROFILE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles',
);

// The runtime modules are CommonJS; load them through a require bridge so the
// .cjs contracts are exercised exactly as the production sweep consumes them.
const require = createRequire(import.meta.url);
const sweep = require(path.join(MB_ROOT, 'sweep-benchmark.cjs'));
const { report } = require(path.join(MB_ROOT, 'lib/sweep-reporter.cjs'));

function readJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Correct, terse implementations of each fixture's target function. These pass
// the full visible + hidden oracle, so a sweep driven by them produces a fully
// saturated correctness column — the exact input the gate must refuse to rank.
const CORRECT_LOWER_BOUND =
  'function lowerBound(arr, target){let lo=0,hi=arr.length;' +
  'while(lo<hi){const mid=(lo+hi)>>1;if(arr[mid]<target)lo=mid+1;else hi=mid;}return lo;}';

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

// A correct solution that ALSO carries a verbose prose preamble + extra prose
// after the fence. The code still passes every oracle (correctness stays 1.0),
// but the output is far longer and not format-adherent — so on a saturated
// correctness column the only separating signal is format/efficiency.
function verboseCorrect(fnName: string): string {
  const body = CORRECT_BY_FN[fnName];
  return (
    'Certainly! Here is a thorough, well-considered implementation of the ' +
    'requested function. I have carefully reasoned through every stated edge ' +
    'case, the boundary conditions, and the ordering rules before writing it ' +
    'out so that you can be confident it is correct and complete in all of the ' +
    'situations described in the specification you provided to me just now.\n\n' +
    '```js\n' +
    body +
    '\n```\n\n' +
    'As you can see above, the solution handles all of the corner cases, ' +
    'including the tricky ones, and it should work reliably for every input ' +
    'that satisfies the documented preconditions and assumptions of the task.'
  );
}

// A terse, format-adherent correct solution: bare function, no prose. Same
// correctness as the verbose form but a fraction of the word count.
function terseCorrect(fnName: string): string {
  return CORRECT_BY_FN[fnName];
}

const BAKEOFF = readJson(path.join(PROFILE_DIR, 'framework-bakeoff.json'));
const MVM = readJson(path.join(PROFILE_DIR, 'model-vs-model.json'));

describe('acceptance: both modes are config-only and run the same report path', () => {
  // Both profiles dispatch through ONE runSweep + report path; the only thing
  // that differs is which axis carries more than one value. A trivial responder
  // (no extractable function) keeps these fast — the point is that BOTH modes
  // emit an aggregate with a verdict, not the verdict's value here.
  let bakeAgg: any;
  let mvmAgg: any;

  beforeAll(() => {
    const bake = sweep.runSweep(BAKEOFF, {
      mock: true,
      mockResponder: () => 'no function here',
      samplesPerCell: 1,
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    bakeAgg = bake.aggregate;
    const mvm = sweep.runSweep(MVM, {
      mock: true,
      mockResponder: () => 'no function here',
      samplesPerCell: 1,
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    mvmAgg = mvm.aggregate;
  });

  it('framework-bakeoff produces an aggregate with a verdict', () => {
    expect(bakeAgg).toBeDefined();
    expect(bakeAgg.groupBy).toBe('framework');
    expect(bakeAgg.verdict).toBeDefined();
    expect(['WINNER', 'TIE', 'INCONCLUSIVE']).toContain(bakeAgg.verdict.verdict);
  });

  it('model-vs-model produces an aggregate with a verdict', () => {
    expect(mvmAgg).toBeDefined();
    expect(mvmAgg.groupBy).toBe('model');
    expect(mvmAgg.verdict).toBeDefined();
    expect(['WINNER', 'TIE', 'INCONCLUSIVE']).toContain(mvmAgg.verdict.verdict);
  });

  it('both modes flow through the SAME report() entry (config-only switch)', () => {
    // Re-deriving each aggregate from the same report() call on raw rows proves
    // the report path is identical; the profile is the only difference.
    const bakeRows = sweep.runSweep(BAKEOFF, {
      mock: true,
      mockResponder: () => 'x',
      samplesPerCell: 1,
      writeResults: false,
      report: false,
      repoRoot: WORKSPACE_ROOT,
    });
    const mvmRows = sweep.runSweep(MVM, {
      mock: true,
      mockResponder: () => 'x',
      samplesPerCell: 1,
      writeResults: false,
      report: false,
      repoRoot: WORKSPACE_ROOT,
    });
    const a = report(bakeRows, { profile: BAKEOFF });
    const b = report(mvmRows, { profile: MVM });
    expect(a.aggregate.groupBy).toBe('framework');
    expect(b.aggregate.groupBy).toBe('model');
    expect(a.aggregate.verdict).toBeDefined();
    expect(b.aggregate.verdict).toBeDefined();
  });
});

describe('acceptance: SATURATION CANNOT WIN (the core property)', () => {
  // A responder that returns a fully-correct solution for EVERY framework, every
  // fixture. Correctness saturates at 1.0 across the whole column, so correctness
  // must be dropped as the ranking key and a single-sample run can never crown a
  // WINNER on it.
  const correctEverywhere = (cell: any) => CORRECT_BY_FN[cell.fixture.fn_name];

  let outDir: string;
  let agg: any;
  let synthesis: string;

  beforeAll(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-accept-sat-'));
    // Each correct-code cell runs the full visible+hidden oracle in isolated
    // subprocesses, so force a single sample to bound the subprocess fan-out;
    // saturation does not depend on sample count.
    const run = sweep.runSweep(BAKEOFF, {
      mock: true,
      mockResponder: correctEverywhere,
      samplesPerCell: 1,
      outDir,
      repoRoot: WORKSPACE_ROOT,
    });
    agg = run.aggregate;
    synthesis = fs.readFileSync(path.join(outDir, 'synthesis.md'), 'utf8');
  }, 60000);

  it('flags correctness as saturated', () => {
    // Every group's correctness mean is exactly 1.0.
    for (const g of agg.groups) {
      expect(g.correctness_mean).toBe(1);
    }
    expect(agg.correctness_saturated).toBe(true);
  });

  it('does NOT crown a correctness winner', () => {
    // The ranking key is never correctness once saturated, and the verdict is
    // not a correctness WINNER.
    expect(agg.ranking_key).not.toBe('correctness');
    expect(agg.verdict.ranking_key).not.toBe('correctness');
    const isCorrectnessWinner =
      agg.verdict.verdict === 'WINNER' && agg.verdict.ranking_key === 'correctness';
    expect(isCorrectnessWinner).toBe(false);
  });

  it('returns TIE or INCONCLUSIVE on a single sample (no trusted winner)', () => {
    expect(['TIE', 'INCONCLUSIVE']).toContain(agg.verdict.verdict);
  });

  it('writes the verdict string BEFORE any leaderboard/winner heading', () => {
    const verdictIdx = synthesis.indexOf('Verdict:');
    const lower = synthesis.toLowerCase();
    const leaderboardIdx = lower.indexOf('leaderboard');
    const winnerIdx = lower.indexOf('winner');
    expect(verdictIdx).toBeGreaterThanOrEqual(0);
    // The leaderboard heading exists and comes AFTER the verdict line.
    expect(leaderboardIdx).toBeGreaterThan(verdictIdx);
    // If the word "winner" appears at all, it is not before the verdict.
    if (winnerIdx >= 0) {
      expect(winnerIdx).toBeGreaterThan(verdictIdx);
    }
  });

  it('saturation status surfaces a fixture-level recommendation', () => {
    expect(agg.saturation.status).toBe('saturated');
    expect(agg.saturation.fixtures.length).toBeGreaterThan(0);
    // Every fixture saturated at 100% recommends promote-or-demote, not keep.
    for (const fx of agg.saturation.fixtures) {
      expect(fx.saturated).toBe(true);
      expect(fx.action).toBe('promote-or-demote-to-smoke');
    }
  });
});

describe('acceptance: a real WINNER emerges on the ranking key with samples + margin', () => {
  // One framework (rcaf) returns TERSE correct code; the others return
  // CORRECT-BUT-VERBOSE code. Correctness still saturates at 1.0 (so it stays
  // gated, never the winner), but the efficiency axis now separates the terse
  // framework from the verbose pack. With enough samples and a margin above the
  // (zero, since deterministic) noise floor, the verdict is a trusted WINNER on
  // efficiency — correctness is gated, not crowned.
  const terseVsVerbose = (cell: any) =>
    cell.framework === 'rcaf'
      ? terseCorrect(cell.fixture.fn_name)
      : verboseCorrect(cell.fixture.fn_name);

  let agg: any;

  beforeAll(() => {
    const run = sweep.runSweep(BAKEOFF, {
      mock: true,
      mockResponder: terseVsVerbose,
      samplesPerCell: 3,
      writeResults: false,
      repoRoot: WORKSPACE_ROOT,
    });
    agg = run.aggregate;
  }, 120000);

  it('keeps correctness gated (saturated), so the winner is not a correctness win', () => {
    expect(agg.correctness_saturated).toBe(true);
    expect(agg.ranking_key).not.toBe('correctness');
  });

  it('declares a trusted WINNER on format/efficiency', () => {
    expect(agg.verdict.verdict).toBe('WINNER');
    expect(['format', 'efficiency']).toContain(agg.verdict.ranking_key);
    expect(agg.verdict.reason).toBe('trusted_margin');
    // Enough repeated samples to clear the n-gate.
    expect(agg.verdict.n_samples).toBeGreaterThanOrEqual(3);
    // The top-pair margin strictly exceeds the noise floor.
    expect(agg.verdict.margin).toBeGreaterThan(agg.verdict.noise_floor);
  });

  it('ranks the terse framework first', () => {
    expect(agg.groups[0].group).toBe('rcaf');
    expect(agg.groups[0].rank).toBe(1);
    // The terse framework's median word count is below the verbose pack's.
    const verbose = agg.groups.find((g: any) => g.group !== 'rcaf');
    expect(agg.groups[0].output_words_median).toBeLessThan(
      verbose.output_words_median,
    );
  });
});
