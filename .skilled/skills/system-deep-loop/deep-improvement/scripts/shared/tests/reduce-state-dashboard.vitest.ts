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
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs',
);

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reduce-dashboard-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('reduce-state dashboard unscored dimensions', () => {
  it('surfaces null-scored dimensions as unscored instead of averaging them away', () => {
    const runtimeRoot = path.join(tmpDir, 'improvement');
    fs.mkdirSync(runtimeRoot, { recursive: true });
    fs.writeFileSync(path.join(runtimeRoot, 'agent-improvement-state.jsonl'), `${JSON.stringify({
      type: 'candidate_iteration',
      profileId: 'dynamic',
      family: 'derived',
      score: null,
      recommendation: 'needs-improvement',
      dimensions: [
        { name: 'structural', score: 80 },
        { name: 'ruleCoherence', score: null },
        { name: 'integration', score: 90 },
      ],
      unscoredDimensions: ['ruleCoherence'],
    })}\n`, 'utf8');

    execFileSync('node', [REDUCE_SCRIPT, runtimeRoot], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    const dashboard = fs.readFileSync(path.join(runtimeRoot, 'agent-improvement-dashboard.md'), 'utf8');
    expect(dashboard).toContain('### Unscored Dimensions');
    expect(dashboard).toContain('| Rule Coherence | unscored | 1 |');
  });
});
