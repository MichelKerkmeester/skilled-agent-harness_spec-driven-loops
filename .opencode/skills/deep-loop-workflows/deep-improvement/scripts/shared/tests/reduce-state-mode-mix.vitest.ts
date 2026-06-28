import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const REDUCE_SCRIPT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs',
);

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reduce-mode-mix-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('reduce-state lane (mode) mix display', () => {
  it('surfaces the agent-improvement vs model-benchmark mode mix in the registry and dashboard', () => {
    const runtimeRoot = path.join(tmpDir, 'improvement');
    fs.mkdirSync(runtimeRoot, { recursive: true });

    const records = [
      {
        type: 'candidate_iteration',
        profileId: 'dynamic',
        family: 'derived',
        mode: 'agent-improvement',
        score: 80,
        recommendation: 'candidate-acceptable',
        dimensions: [{ name: 'structural', score: 80 }],
      },
      {
        type: 'benchmark_run',
        profileId: 'dynamic',
        family: 'derived',
        mode: 'model-benchmark',
        aggregateScore: 90,
        recommendation: 'benchmark-pass',
      },
      {
        type: 'benchmark_run',
        profileId: 'dynamic',
        family: 'derived',
        mode: 'model-benchmark',
        aggregateScore: 70,
        recommendation: 'benchmark-pass',
      },
    ];

    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-state.jsonl'),
      `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
      'utf8',
    );

    execFileSync('node', [REDUCE_SCRIPT, runtimeRoot], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    const registry = JSON.parse(
      fs.readFileSync(path.join(runtimeRoot, 'experiment-registry.json'), 'utf8'),
    );
    expect(registry.modes).toEqual({
      'agent-improvement': 1,
      'model-benchmark': 2,
    });
    expect(registry.profiles.dynamic.modes).toEqual({
      'agent-improvement': 1,
      'model-benchmark': 2,
    });

    const dashboard = fs.readFileSync(
      path.join(runtimeRoot, 'agent-improvement-dashboard.md'),
      'utf8',
    );
    expect(dashboard).toContain(
      '| Lane (mode) mix | agent-improvement 1 / model-benchmark 2 |',
    );
    expect(dashboard).toContain(
      '- Lane (mode) mix: agent-improvement 1 / model-benchmark 2',
    );
  });
});

describe('reduce-state benchmark aggregate plateau stop (F-P1-5)', () => {
  it('stops when the trailing benchmark aggregate scores are identical across the plateau window', () => {
    const runtimeRoot = path.join(tmpDir, 'improvement');
    fs.mkdirSync(runtimeRoot, { recursive: true });

    const records = [
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 88, recommendation: 'benchmark-pass' },
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 88, recommendation: 'benchmark-pass' },
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 88, recommendation: 'benchmark-pass' },
    ];

    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-state.jsonl'),
      `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
      'utf8',
    );
    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-config.json'),
      JSON.stringify({ stopRules: { stopOnBenchmarkPlateau: true, plateauWindow: 3 } }),
      'utf8',
    );

    execFileSync('node', [REDUCE_SCRIPT, runtimeRoot], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    const registry = JSON.parse(
      fs.readFileSync(path.join(runtimeRoot, 'experiment-registry.json'), 'utf8'),
    );
    expect(registry.stopStatus.shouldStop).toBe(true);
    expect(registry.stopStatus.reasons.join('; ')).toContain('benchmark aggregate plateaued at 88');
    expect(registry.stopStatus.profileStates.dynamic.shouldStop).toBe(true);
  });

  it('does not stop on benchmark plateau when aggregate scores still differ', () => {
    const runtimeRoot = path.join(tmpDir, 'improvement');
    fs.mkdirSync(runtimeRoot, { recursive: true });

    const records = [
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 80, recommendation: 'benchmark-pass' },
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 85, recommendation: 'benchmark-pass' },
      { type: 'benchmark_run', profileId: 'dynamic', mode: 'model-benchmark', aggregateScore: 88, recommendation: 'benchmark-pass' },
    ];

    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-state.jsonl'),
      `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
      'utf8',
    );
    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-config.json'),
      JSON.stringify({ stopRules: { stopOnBenchmarkPlateau: true, plateauWindow: 3 } }),
      'utf8',
    );

    execFileSync('node', [REDUCE_SCRIPT, runtimeRoot], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    const registry = JSON.parse(
      fs.readFileSync(path.join(runtimeRoot, 'experiment-registry.json'), 'utf8'),
    );
    expect(registry.stopStatus.reasons.join('; ')).not.toContain('benchmark aggregate plateaued');
  });
});

describe('reduce-state benchmark score-delta summary', () => {
  it('summarizes outcome deltas and helped/hurt fixture counts in the registry and dashboard', () => {
    const runtimeRoot = path.join(tmpDir, 'improvement');
    fs.mkdirSync(runtimeRoot, { recursive: true });

    const records = [
      {
        type: 'benchmark_run',
        profileId: 'dynamic',
        family: 'derived',
        mode: 'model-benchmark',
        aggregateScore: 92,
        recommendation: 'benchmark-pass',
        outcomeScoreDelta: 12.5,
        fixtureDeltas: [
          { id: 'helped', beforeScore: 70, afterScore: 100, delta: 30, helped: true, hurt: false },
          { id: 'hurt', beforeScore: 70, afterScore: 65, delta: -5, helped: false, hurt: true },
        ],
      },
      {
        type: 'benchmark_run',
        profileId: 'dynamic',
        family: 'derived',
        mode: 'model-benchmark',
        aggregateScore: 88,
        recommendation: 'benchmark-pass',
        outcomeScoreDelta: null,
        fixtureDeltas: [
          { id: 'unchanged', beforeScore: 88, afterScore: 88, delta: 0, helped: false, hurt: false },
          { id: 'missing', beforeScore: null, afterScore: 90, delta: null, helped: false, hurt: false },
        ],
      },
    ];

    fs.writeFileSync(
      path.join(runtimeRoot, 'agent-improvement-state.jsonl'),
      `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
      'utf8',
    );

    execFileSync('node', [REDUCE_SCRIPT, runtimeRoot], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    const registry = JSON.parse(
      fs.readFileSync(path.join(runtimeRoot, 'experiment-registry.json'), 'utf8'),
    );
    expect(registry.benchmarkDeltaSummary).toEqual({
      runsWithOutcomeDelta: 1,
      missingOutcomeDeltaRuns: 1,
      outcomeScoreDeltaSum: 12.5,
      latestOutcomeScoreDelta: 12.5,
      bestOutcomeScoreDelta: 12.5,
      helpedFixtures: 1,
      hurtFixtures: 1,
      unchangedFixtures: 1,
      missingBaselineFixtures: 1,
      totalFixtures: 4,
    });
    expect(registry.profiles.dynamic.benchmarkDeltaSummary).toEqual(registry.benchmarkDeltaSummary);

    const dashboard = fs.readFileSync(
      path.join(runtimeRoot, 'agent-improvement-dashboard.md'),
      'utf8',
    );
    expect(dashboard).toContain('helped 1 / hurt 1 / unchanged 1 / missingBaseline 1');
  });
});
