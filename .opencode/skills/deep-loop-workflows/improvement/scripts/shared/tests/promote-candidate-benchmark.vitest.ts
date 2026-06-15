// ───────────────────────────────────────────────────────────────────
// MODULE: promote-candidate benchmark-mode promotion
//   Lane B (model-benchmark) produces report.json with status=benchmark-complete
//   and never a scored agent file. promote-candidate.cjs must promote on benchmark
//   evidence alone when --score is omitted, and refuse a non-passing report.
//   Lane A (agent) byte-behavior must stay unchanged.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/improvement/scripts');
const PROMOTE = path.join(SCRIPTS, 'shared/promote-candidate.cjs');

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

// A target that is NOT an agent-definition file (not under .opencode/agents/),
// so the 4-runtime mirror-sync gate is skipped and the test stays focused on the
// Lane B promotion gates.
function buildBenchmarkPacket(opts: { recommendation: string; aggregateScore: number }) {
  const candidate = path.join(work, 'candidate.txt');
  const target = path.join(work, 'canonical-target.txt');
  const benchmarkReport = path.join(work, 'benchmark-outputs/report.json');
  const repeatability = path.join(work, 'benchmark-outputs/repeatability.json');
  const config = path.join(work, 'model-benchmark-config.json');
  const manifest = path.join(work, 'target_manifest.jsonc');
  const archiveDir = path.join(work, 'archive');

  fs.mkdirSync(work, { recursive: true });
  fs.writeFileSync(candidate, 'CANDIDATE BODY\n', 'utf8');
  fs.writeFileSync(target, 'ORIGINAL TARGET BODY\n', 'utf8');

  writeJson(benchmarkReport, {
    status: 'benchmark-complete',
    scoringMethod: 'pattern',
    grader: 'noop',
    profileId: 'demo-profile',
    family: 'test',
    target,
    aggregateScore: opts.aggregateScore,
    maxScore: 100,
    totals: { score: opts.aggregateScore, delta: 0.05, pass_rate: 1, fixtures: 2, passed: 2 },
    recommendation: opts.recommendation,
  });

  writeJson(repeatability, { profileId: 'demo-profile', passed: true });

  writeJson(config, {
    target,
    targetProfile: 'demo-profile',
    proposalOnly: false,
    promotionEnabled: true,
    scoring: { thresholdDelta: 1 },
  });

  // .jsonc manifest with a single canonical target equal to the requested target.
  fs.writeFileSync(
    manifest,
    `// benchmark target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
    'utf8',
  );

  return { candidate, target, benchmarkReport, repeatability, config, manifest, archiveDir };
}

function runPromote(p: ReturnType<typeof buildBenchmarkPacket>, extraArgs: string[] = []) {
  return spawnSync(
    'node',
    [
      PROMOTE,
      `--candidate=${p.candidate}`,
      `--target=${p.target}`,
      `--benchmark-report=${p.benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${p.archiveDir}`,
      '--approve',
      ...extraArgs,
    ],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

beforeEach(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'promote-bench-')); });
afterEach(() => { fs.rmSync(work, { recursive: true, force: true }); });

describe('F017-P1-04 promote-candidate benchmark mode', () => {
  it('promotes from a benchmark-complete + benchmark-pass report with NO --score (Lane B)', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const result = runPromote(p);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('promoted');
    expect(out.mode).toBe('benchmark');
    expect(out.aggregateScore).toBe(92);
    expect(out.recommendation).toBe('benchmark-pass');
    // Candidate content actually landed on the canonical target.
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CANDIDATE BODY\n');
    // A backup of the original target was written to the archive dir.
    const backups = fs.readdirSync(p.archiveDir).filter((f) => f.endsWith('.bak'));
    expect(backups.length).toBe(1);
  });

  it('refuses a non-passing benchmark report (recommendation=benchmark-fail) and leaves target untouched', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-fail', aggregateScore: 92 });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/benchmark recommendation is benchmark-fail/);
    // Target unchanged.
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses when the aggregate score is below the benchmark aggregate gate', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 50 });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/benchmark aggregate 50 below gate/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });
});
