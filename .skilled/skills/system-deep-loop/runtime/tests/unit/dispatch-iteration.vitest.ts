// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The workflow branches hand every executor kind to one script, so the
// refusals that used to live in separate inline bodies must survive the
// move. These cases pin the dispatch-free exits that a wrong branch or a
// permissive parser would otherwise turn into a real dispatch.

import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const SCRIPT = resolve(here, '..', '..', 'scripts', 'dispatch-iteration.cjs');

const EXECUTOR_KINDS = [
  'native',
  'cli-codex',
  'cli-claude-code',
  'cli-opencode',
  'cli-cursor',
  'cli-devin',
  'cli-pi',
  'cli-deepseek-harness',
];

function runScript(args: string[]): { status: number | null; stderr: string; stdout: string } {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return {
    status: result.status,
    stderr: result.stderr ?? '',
    stdout: result.stdout ?? '',
  };
}

describe('dispatch-iteration CLI refusals', () => {
  it('exits 64 and names every supported executor kind for an unknown executor', () => {
    const result = runScript(['--executor', 'unknown']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("unknown executor kind 'unknown'");
    for (const kind of EXECUTOR_KINDS) {
      expect(result.stderr).toContain(kind);
    }
  });

  it('exits 2 with the fan-out-lineage refusal for cli-deepseek-harness', () => {
    const result = runScript(['--executor', 'cli-deepseek-harness']);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('runs only as a fan-out lineage');
  });

  it('refuses cli-deepseek-harness before it validates any other flag', () => {
    const result = runScript(['--executor', 'cli-deepseek-harness', '--bogus', 'x']);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('runs only as a fan-out lineage');
    expect(result.stderr).not.toContain("unknown flag '--bogus'");
  });

  it('exits 64 for native because native dispatch belongs to the orchestrator', () => {
    const result = runScript(['--executor', 'native']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('has no native path');
  });

  it('exits 64 when a real executor kind is missing its required flags', () => {
    const result = runScript(['--executor', 'cli-cursor', '--loop-type', 'research']);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('Usage: dispatch-iteration.cjs');
    expect(result.stderr).toContain("missing required flag '--repo-root'");
  });
});
