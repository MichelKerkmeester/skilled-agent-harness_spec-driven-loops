// ───────────────────────────────────────────────────────────────────
// TEST: create.sh Root Numbering
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// Inside a git repository and without --track, create.sh numbered a packet by
// counting only the folders and branches that share its short name, so every
// differently named packet in one specs root started at 001. These run in a
// throwaway repository, which is what puts create.sh on that path.
let workspace: string;
let createScript: string;

beforeEach(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-root-numbering-')));
  execFileSync('git', ['init', '--quiet'], { cwd: workspace });
  const fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const dir of ['spec', 'lib', 'templates']) {
    fs.mkdirSync(path.join(fixtureCli, dir), { recursive: true });
  }
  fs.copyFileSync(path.join(CLI_DIR, 'spec', 'create.sh'), path.join(fixtureCli, 'spec', 'create.sh'));
  for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh']) {
    fs.copyFileSync(path.join(CLI_DIR, 'lib', library), path.join(fixtureCli, 'lib', library));
  }
  fs.copyFileSync(
    path.join(CLI_DIR, 'templates', 'inline-gate-renderer.sh'),
    path.join(fixtureCli, 'templates', 'inline-gate-renderer.sh'),
  );
  fs.cpSync(
    path.join(SKILL_ROOT, 'templates'),
    path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'templates'),
    { recursive: true },
  );
  createScript = path.join(fixtureCli, 'spec', 'create.sh');
});

afterEach(() => {
  fs.rmSync(workspace, { recursive: true, force: true });
});

function create(args: string[]): string {
  const result = spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], {
    cwd: workspace,
    encoding: 'utf8',
  });
  expect(result.status, result.stderr).toBe(0);
  return path.basename(path.dirname((JSON.parse(result.stdout) as { SPEC_FILE: string }).SPEC_FILE));
}

describe('create.sh numbering at the specs root', () => {
  it('gives a second, differently named packet the next number', () => {
    expect(create(['--short-name', 'first-packet', 'First'])).toBe('001-first-packet');
    expect(create(['--short-name', 'second-packet', 'Second'])).toBe('002-second-packet');
  });

  it('numbers after the highest folder already in the root', () => {
    fs.mkdirSync(path.join(workspace, 'specs', '007-existing-packet'), { recursive: true });
    expect(create(['--short-name', 'next-packet', 'Next'])).toBe('008-next-packet');
  });

  it('numbers after the highest numbered branch', () => {
    commit();
    execFileSync('git', ['branch', '012-other-work'], { cwd: workspace });
    expect(create(['--short-name', 'after-branch', 'After'])).toBe('013-after-branch');
  });

  // A packet branch is three digits and a hyphen. A date-shaped name also starts
  // with digits and a hyphen, and must not push the root's numbering to 2027.
  it('ignores a branch that only starts with digits, such as a date', () => {
    commit();
    execFileSync('git', ['branch', '2026-09-24-hotfix'], { cwd: workspace });
    expect(create(['--short-name', 'after-date', 'After date'])).toBe('001-after-date');
  });

  // Numbering reads the refs git already has and fetches nothing, so a scaffold
  // needs no network and never prunes a remote-tracking ref the remote dropped.
  it('counts a remote-tracking ref it already has and leaves it in place', () => {
    const remote = path.join(workspace, 'remote.git');
    execFileSync('git', ['init', '--quiet', '--bare', remote]);
    execFileSync('git', ['remote', 'add', 'origin', remote], { cwd: workspace });
    commit();
    execFileSync('git', ['update-ref', 'refs/remotes/origin/020-remote-work', 'HEAD'], { cwd: workspace });

    expect(create(['--short-name', 'after-remote', 'After remote'])).toBe('021-after-remote');
    const kept = spawnSync('git', ['show-ref', '--verify', '--quiet', 'refs/remotes/origin/020-remote-work'], { cwd: workspace });
    expect(kept.status).toBe(0);
  });
});

// The fixture commit runs no hooks: a global core.hooksPath would otherwise
// apply the host repository's commit gates to this throwaway one.
function commit() {
  execFileSync(
    'git',
    [
      '-c', 'core.hooksPath=/dev/null',
      '-c', 'user.email=test@example.com',
      '-c', 'user.name=test',
      'commit', '--quiet', '--allow-empty', '-m', 'root',
    ],
    { cwd: workspace },
  );
}
