import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const REDUCE_SCRIPT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs',
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
