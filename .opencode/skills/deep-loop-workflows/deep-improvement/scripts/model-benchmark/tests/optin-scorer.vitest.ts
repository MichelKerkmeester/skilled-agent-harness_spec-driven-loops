import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/deep-improvement/scripts');
const PROFILE = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json');

let work: string;

function materialize(outDir: string) {
  return spawnSync('node', [path.join(SCRIPTS, 'shared/materialize-benchmark-fixtures.cjs'), '--profile', PROFILE, '--outputs-dir', outDir], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
}
function runBenchmark(outDir: string, reportPath: string, extraArgs: string[]) {
  return spawnSync('node', [path.join(SCRIPTS, 'model-benchmark/run-benchmark.cjs'), '--profile', PROFILE, '--outputs-dir', outDir, '--output', reportPath, ...extraArgs], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
}

beforeEach(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'optin-scorer-')); });
afterEach(() => { fs.rmSync(work, { recursive: true, force: true }); });

describe('121/005 opt-in 5-dim scorer wiring', () => {
  it('default scorer is pattern (backward-compat) and produces a complete report', () => {
    const fx = path.join(work, 'fx');
    const report = path.join(work, 'r.json');
    materialize(fx);
    const r = runBenchmark(fx, report, []);
    expect(r.status).toBe(0);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('benchmark-complete');
    expect(data.scoringMethod).toBe('pattern');
    // pattern path keeps the heading/pattern result shape — no per-dimension scores
    expect(data.rows[0].dimensions).toBeUndefined();
  });

  it('--scorer=5dim routes through the 5-dim scorer and records per-dimension scores', () => {
    const fx = path.join(work, 'fx');
    const report = path.join(work, 'r.json');
    materialize(fx);
    const r = runBenchmark(fx, report, ['--scorer=5dim', '--grader=noop']);
    expect(r.status).toBe(0);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.status).toBe('benchmark-complete');
    expect(data.scoringMethod).toBe('5dim');
    const dims = data.rows[0].dimensions;
    expect(dims).toBeDefined();
    for (const d of ['D1', 'D2', 'D3', 'D4', 'D5']) {
      expect(typeof dims[d]).toBe('number');
    }
    expect(data.rows[0].scoringMethod).toBe('5dim');
  });

  it('an unknown --scorer warns and falls back to pattern', () => {
    const fx = path.join(work, 'fx');
    const report = path.join(work, 'r.json');
    materialize(fx);
    const r = runBenchmark(fx, report, ['--scorer=bogus']);
    expect(r.status).toBe(0);
    expect(r.stderr).toMatch(/unknown --scorer 'bogus', defaulting to 'pattern'/);
    const data = JSON.parse(fs.readFileSync(report, 'utf8'));
    expect(data.scoringMethod).toBe('pattern');
  });
});
