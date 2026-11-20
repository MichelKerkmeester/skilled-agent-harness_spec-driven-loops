// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Loop Artifact Staging
// ───────────────────────────────────────────────────────────────────

// The synthesis staging step runs the workflow's own `git add` against the
// repository's own ignore rules. Two things decide whether it records a run:
// an exclude pathspec that names an ignored path present on disk makes
// `git add` exit 1 and stage nothing, and an ignored status ledger never
// reaches the index. Each test runs the command as the workflow writes it in a
// throwaway repository that carries this repository's .gitignore.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = resolve(runtimeRoot, '..', '..', '..');
const REPO_ROOT = resolve(WORKSPACE_ROOT, '..');
const ASSETS = resolve(WORKSPACE_ROOT, 'commands', 'deep', 'assets');
const REPO_GITIGNORE = resolve(REPO_ROOT, '.gitignore');

const sharedRequire = createRequire(
  resolve(runtimeRoot, '..', '..', 'system-spec-kit', 'shared', 'package.json'),
);
const { load: loadYaml } = sharedRequire('js-yaml') as { load: (source: string) => unknown };

type Workflow = {
  workflow?: { phase_synthesis?: { steps?: Record<string, { command?: string }> } };
};

const WORKFLOWS = [
  { file: 'deep-research.yaml', mode: 'research', lock: '.deep-research.lock' },
  { file: 'deep-review.yaml', mode: 'review', lock: '.deep-review.lock' },
] as const;

const tempRoots: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function stageCommand(file: string): string {
  const doc = loadYaml(readFileSync(resolve(ASSETS, file), 'utf8')) as Workflow;
  const command = doc.workflow?.phase_synthesis?.steps?.['step_stage_artifact_dir']?.command;
  if (typeof command !== 'string') throw new Error(`step_stage_artifact_dir has no command in ${file}`);
  return command;
}

function git(cwd: string, args: string[]) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

// A packet as a finished run leaves it: an iteration file, the fan-out status
// ledger, the live lock, and the projection watermark directory.
function seedRepo(mode: string, lock: string): { repo: string; packet: string } {
  const repo = mkdtempSync(join(tmpdir(), 'dl-stage-'));
  tempRoots.push(repo);
  expect(git(repo, ['init', '-q']).status).toBe(0);
  copyFileSync(REPO_GITIGNORE, join(repo, '.gitignore'));
  const packet = join('specs', 'track', '001-topic', mode);
  const abs = join(repo, packet);
  mkdirSync(join(abs, 'iterations'), { recursive: true });
  mkdirSync(join(abs, '.legacy-projection-watermarks'), { recursive: true });
  writeFileSync(join(abs, 'iterations', 'iteration-001.md'), '# Iteration 1\n');
  writeFileSync(join(abs, 'orchestration-status.log'), '{"event":"spawned"}\n');
  writeFileSync(join(abs, lock), '{"pid":1}\n');
  writeFileSync(join(abs, '.legacy-projection-watermarks', 'state.json'), '{}\n');
  return { repo, packet };
}

function runStage(file: string, repo: string, packet: string) {
  const command = stageCommand(file).replace(/\{state_paths\.(packet_dir|artifact_dir)\}/g, packet);
  return spawnSync('sh', ['-c', command], { cwd: repo, encoding: 'utf8' });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe.each(WORKFLOWS)('$file artifact staging', ({ file, mode, lock }) => {
  it('stages the run trail and the status ledger while the lock is still held', () => {
    const { repo, packet } = seedRepo(mode, lock);
    const result = runStage(file, repo, packet);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);

    const staged = git(repo, ['diff', '--cached', '--name-only']).stdout.split('\n').filter(Boolean);
    expect(staged).toContain(`${packet}/iterations/iteration-001.md`);
    expect(staged).toContain(`${packet}/orchestration-status.log`);
  });

  it('leaves the lock and the projection watermarks out of the index', () => {
    const { repo, packet } = seedRepo(mode, lock);
    expect(runStage(file, repo, packet).status).toBe(0);

    const staged = git(repo, ['diff', '--cached', '--name-only']).stdout;
    expect(staged).not.toContain(lock);
    expect(staged).not.toContain('.legacy-projection-watermarks');
  });
});

describe('status ledger ignore rule', () => {
  it('keeps every other log ignored', () => {
    const { repo, packet } = seedRepo('research', '.deep-research.lock');
    writeFileSync(join(repo, packet, 'dispatch.log'), 'noise\n');
    const result = git(repo, ['check-ignore', '-q', `${packet}/dispatch.log`]);
    expect(result.status).toBe(0);
  });
});
