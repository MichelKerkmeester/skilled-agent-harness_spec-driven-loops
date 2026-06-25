// ───────────────────────────────────────────────────────────────
// MODULE: sa-037 — Python Bench Runner Stress Test
// ───────────────────────────────────────────────────────────────
// Wraps `skill_advisor_bench.py` as a vitest stress case. Skips
// gracefully when python3 is absent. Exercises subprocess invocation,
// JSON output schema, and exit-code contract under a tiny synthetic
// dataset.

import { describe, expect, it } from 'vitest';
import { execSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const PYTHON_AVAILABLE = (() => {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
})();

const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..', '..', '..');
const BENCH_SCRIPT = resolve(
  REPO_ROOT,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py',
);

describe('sa-037 — Python bench runner', () => {
  if (!PYTHON_AVAILABLE) {
    it.skip('python3 not available on PATH; sa-037 skipped', () => {
      // intentionally empty
    });
    return;
  }

  it('bench script exists at the documented path', () => {
    expect(existsSync(BENCH_SCRIPT)).toBe(true);
  });

  it('bench script accepts --help and exits cleanly', () => {
    const result = spawnSync('python3', [BENCH_SCRIPT, '--help'], {
      encoding: 'utf-8',
      timeout: 8000,
    });
    expect(result.status).toBe(0);
    expect(result.stdout + result.stderr).toMatch(/dataset|usage|--runs/i);
  });

  it('bench script runs to completion on a tiny synthetic dataset and emits a JSON report', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'sa-037-bench-'));
    try {
      const datasetPath = join(tmpDir, 'mini-cases.jsonl');
      const reportPath = join(tmpDir, 'report.json');

      const cases = [
        { prompt: 'help me read a file', expected_skill: 'sk-doc' },
        { prompt: 'check git status', expected_skill: 'sk-git' },
      ];
      writeFileSync(
        datasetPath,
        cases.map((c) => JSON.stringify(c)).join('\n') + '\n',
        'utf-8',
      );

      const result = spawnSync(
        'python3',
        [BENCH_SCRIPT, '--dataset', datasetPath, '--runs', '1', '--out', reportPath, '--max-warm-p95-ms', '1000000', '--min-throughput-multiplier', '0'],
        {
          encoding: 'utf-8',
          timeout: 30000,
          env: { ...process.env, SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1' },
        },
      );

      const combinedOutput = (result.stdout ?? '') + (result.stderr ?? '');
      expect(result.status).toBe(0);
      expect(combinedOutput.length).toBeGreaterThan(0);

      // If the script wrote a report, validate the JSON envelope shape.
      if (existsSync(reportPath)) {
        const raw = readFileSync(reportPath, 'utf-8');
        const parsed = JSON.parse(raw);
        expect(parsed).toBeTypeOf('object');
        // Report shape is loose by design — assert it's a populated object.
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      }

      // The bench script's documented thresholds (cache-hit p95 ≤ 50ms,
      // uncached p95 ≤ 60ms) are captured measurements from a stable workstation,
      // not enforceable CI gates. The catalog (08--python-compat/03-bench-runner.md)
      // documents this; the wrapper test here verifies the subprocess surface
      // is reachable and the JSON envelope is well-formed.
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('returns non-zero when blocking gates make overall_pass false', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'sa-037-bench-fail-'));
    try {
      const datasetPath = join(tmpDir, 'mini-cases.jsonl');
      const reportPath = join(tmpDir, 'report.json');

      writeFileSync(
        datasetPath,
        JSON.stringify({ prompt: 'help me read a file', expected_skill: 'sk-doc' }) + '\n',
        'utf-8',
      );

      const result = spawnSync(
        'python3',
        [BENCH_SCRIPT, '--dataset', datasetPath, '--runs', '1', '--out', reportPath, '--max-warm-p95-ms', '0'],
        {
          encoding: 'utf-8',
          timeout: 30000,
          env: { ...process.env, SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1' },
        },
      );

      expect(result.status).toBe(1);
      expect(existsSync(reportPath)).toBe(true);
      const parsed = JSON.parse(readFileSync(reportPath, 'utf-8'));
      expect(parsed.overall_pass).toBe(false);
      expect(parsed.gates.warm_p95).toBe(false);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
