// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Mode Enablement CLI Tests
// ───────────────────────────────────────────────────────────────────
// The CLI's whole safety story is that a dry run changes nothing and a
// failed step leaves authority exactly as it found it. These tests put
// that promise to the proof: they assert against the filesystem — the
// absence of a state file, the absence of an authority record — rather
// than against what the CLI says it did. A test that only read the
// CLI's own JSON report would be trusting the thing under test.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'enable-modes.cjs');

type CliResult = {
  exitCode: number | null;
  json: Record<string, unknown>;
  rawStdout: string;
  stderr: string;
};

function runCli(args: string[], environmentOverlay: NodeJS.ProcessEnv = {}): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...environmentOverlay },
  });
  const stdout = (result.stdout ?? '').trim();
  const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(lastLine);
  } catch {
    json = { raw: lastLine };
  }
  return {
    exitCode: result.status,
    json,
    rawStdout: stdout,
    stderr: result.stderr ?? '',
  };
}

const temporaryDirectories: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fleet-enablement-'));
  temporaryDirectories.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temporaryDirectories) {
    rmSync(dir, { recursive: true, force: true });
  }
  temporaryDirectories.length = 0;
});

const PLANNED_MODES = [
  'deep-review',
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'deep-alignment',
];

const MODES_AFTER_DEEP_REVIEW = [
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'deep-alignment',
];

describe('enable-modes CLI', () => {

  it('stops cleanly at a mode whose authority record cannot be read', async () => {
    const os = await import('node:os');
    const path = await import('node:path');
    const fs = await import('node:fs');

    const authorityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'enable-modes-'));
    const statePath = path.join(authorityRoot, 'state.json');
    try {
      fs.writeFileSync(
        path.join(authorityRoot, 'authority-deep-review.json'),
        '{',
        'utf8',
      );

      const result = runCli([
        '--state',
        statePath,
        '--authority-root',
        authorityRoot,
      ]);

      expect(result.exitCode).toBe(2);
      expect(result.json.code).toBe('MODE_STEP_FAILED');
      const failure = result.json.failure as Record<string, unknown>;
      expect(failure.mode).toBe('deep-review');
      expect(failure.check).toBe('flip');

      const persisted = JSON.parse(fs.readFileSync(statePath, 'utf8')) as Record<
        string,
        unknown
      >;
      const persistedFailure = persisted.failure as Record<string, unknown>;
      expect(persistedFailure.mode).toBe('deep-review');
      // A mode whose record cannot be read is a failure of that mode, not of the
      // run; aborting here would skip every remaining mode and lose where the
      // run actually stopped.
    } finally {
      fs.rmSync(authorityRoot, { recursive: true, force: true });
    }
  });
  it('plans every fleet mode without touching anything', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', '--state', statePath]);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.dryRun).toBe(true);
    expect(json.plannedModes).toEqual(PLANNED_MODES);
    expect(json.skippedModes).toEqual([]);
    expect(Array.isArray(json.plan)).toBe(true);
    expect((json.plan as unknown[]).length).toBe(7);
  });

  it('writes no state file during a dry run', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    runCli(['--dry-run', '--state', statePath]);

    expect(existsSync(statePath)).toBe(false);
  });

  it('never creates the authority root during a dry run', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    runCli(['--dry-run', '--authority-root', authority, '--state', statePath]);

    expect(existsSync(authority)).toBe(false);
  });

  it('reports a mode whose projectable surface set is empty', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { json } = runCli(['--dry-run', '--state', statePath]);

    const plan = json.plan as Record<string, unknown>[];
    const skillBenchmark = plan.find((entry) => entry.mode === 'skill-benchmark') as Record<string, unknown>;
    const deepReview = plan.find((entry) => entry.mode === 'deep-review') as Record<string, unknown>;

    expect(skillBenchmark.hasProjectableSurface).toBe(false);
    expect(skillBenchmark.projectableSurfaceIds).toEqual([]);
    expect(deepReview.hasProjectableSurface).toBe(true);
  });

  it('reports the two modes that share a surface prefix', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { json } = runCli(['--dry-run', '--state', statePath]);

    const plan = json.plan as Record<string, unknown>[];
    const deepImprovementCommon = plan.find((entry) => entry.mode === 'deep-improvement-common') as Record<string, unknown>;
    const agentImprovement = plan.find((entry) => entry.mode === 'agent-improvement') as Record<string, unknown>;

    expect(deepImprovementCommon.sharedWith).toEqual(['agent-improvement']);
    expect(agentImprovement.sharedWith).toEqual(['deep-improvement-common']);
  });

  it('stops at the first mode that cannot be flipped', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(['--state', statePath, '--authority-root', authority]);

    expect(exitCode).toBe(2);
    expect(json.ok).toBe(false);
    expect(json.phase).toBe('enablement');
    expect(json.code).toBe('MODE_STEP_FAILED');
    expect(json.statePath).toBe(statePath);

    const failure = json.failure as Record<string, unknown>;
    expect(failure.mode).toBe('deep-review');
    expect(failure.check).toBe('flip');
    expect(typeof failure.reason).toBe('string');
    expect(failure.reason as string).toContain('legacy_authoritative');
    expect(failure.reason as string).toContain('cutover_ready');
  });

  it('leaves every later mode untouched when it stops', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const { json } = runCli(['--state', statePath, '--authority-root', authority]);

    expect(json.completedModes).toEqual([]);
    expect(json.untouchedModes).toEqual(MODES_AFTER_DEEP_REVIEW);
  });

  it('writes no authority record when a step fails', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    runCli(['--state', statePath, '--authority-root', authority]);

    const entries = readdirSync(authority);
    const authorityRecords = entries.filter((entry) => /^authority-.*\.json$/.test(entry));
    expect(authorityRecords).toEqual([]);
  });

  it('persists the failure so a later run can see it', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    runCli(['--state', statePath, '--authority-root', authority]);

    const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
    expect(parsed.version).toBe(1);
    expect(parsed.completedModes).toEqual([]);
    expect(parsed.failure.mode).toBe('deep-review');
  });

  it('refuses to continue a stopped run unless resuming is asked for', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    runCli(['--state', statePath, '--authority-root', authority]);

    const { exitCode, json } = runCli(['--state', statePath]);
    expect(exitCode).toBe(1);
    expect(json.code).toBe('RESUME_NOT_REQUESTED');
  });

  it('refuses to resume a run that never happened', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');

    const { exitCode, json } = runCli(['--resume', '--state', statePath]);
    expect(exitCode).toBe(1);
    expect(json.phase).toBe('resume');
    expect(json.code).toBe('NOTHING_TO_RESUME');
  });

  it('rejects an unrecognised flag', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--bogus', '--state', statePath]);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('UNKNOWN_ARGUMENT');
    expect(json.argument).toBe('bogus');
  });

  it('requires a state path', () => {
    const { exitCode, json } = runCli(['--dry-run']);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('STATE_PATH_REQUIRED');
  });

  it('rejects a state flag with no value', () => {
    // Without this check the missing value parsed as the boolean true and
    // was then used as a filesystem path, and the run reported success.
    const { exitCode, json } = runCli(['--state', '--dry-run']);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('ARG_VALUE_REQUIRED');
    expect(json.argument).toBe('state');
  });

  it('rejects a dry-run flag that swallowed a value', () => {
    // Without this check the flag parsed as a string, compared unequal to
    // true, and a request that said "change nothing" executed a real run
    // that persisted state.
    const tmp = makeTempDir();
    const swallowedPath = join(tmp, 'swallowed.json');
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', swallowedPath, '--state', statePath]);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('ARG_TAKES_NO_VALUE');
    expect(json.argument).toBe('dryRun');
    expect(existsSync(statePath)).toBe(false);
  });
});