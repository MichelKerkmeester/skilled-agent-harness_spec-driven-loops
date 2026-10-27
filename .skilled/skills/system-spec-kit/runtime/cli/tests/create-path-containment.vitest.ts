// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Explicit Path Containment
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// An explicit --path is checked against the repository before anything is
// written. A name that already exists as a symlink must be judged by where it
// points, since mkdir and the template renderer write through the link. The
// sandbox repository sits inside a temp folder next to an "outside" folder,
// so a write through the link would land where the test can see it.
//
// create.sh always allows a target under /tmp for fixtures. Where the OS temp
// folder is /tmp itself, an outside folder there would be allowed on purpose,
// so the sandbox moves beside this test file instead and the escape case runs
// everywhere.
const realTmp = fs.realpathSync('/tmp');
const SANDBOX_BASE = (() => {
  const real = fs.realpathSync(os.tmpdir());
  return real === realTmp || real.startsWith(`${realTmp}/`) ? __dirname : os.tmpdir();
})();

let sandbox: string;
let workspace: string;
let outside: string;
let createScript: string;

beforeEach(() => {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(SANDBOX_BASE, '.create-path-containment-')));
  workspace = path.join(sandbox, 'repo');
  outside = path.join(sandbox, 'outside');
  fs.mkdirSync(workspace);
  fs.mkdirSync(outside);
  execFileSync('git', ['init', '--quiet'], { cwd: workspace });
  const fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const dir of ['spec', 'lib', 'templates']) {
    fs.mkdirSync(path.join(fixtureCli, dir), { recursive: true });
  }
  for (const script of ['create.sh', 'refresh-track-roots.mjs']) {
    fs.copyFileSync(path.join(CLI_DIR, 'spec', script), path.join(fixtureCli, 'spec', script));
  }
  for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh', 'track-roots.mjs']) {
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
  fs.mkdirSync(path.join(workspace, 'specs', 'demo'), { recursive: true });
  createScript = path.join(fixtureCli, 'spec', 'create.sh');
});

afterEach(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

function create(target: string) {
  return spawnSync(
    'bash',
    [createScript, '--json', '--skip-branch', '--path', target, 'Probe packet'],
    // TMPDIR points inside the repository so only /tmp stays allowed.
    { cwd: workspace, encoding: 'utf8', env: { ...process.env, TMPDIR: workspace } },
  );
}

describe('create.sh --path judges an existing symlink by its target', () => {
  it('refuses a repo-relative symlink that points outside the repository', () => {
    fs.symlinkSync(outside, path.join(workspace, 'specs', 'demo', '001-escape'));
    const result = create('specs/demo/001-escape');
    expect(result.status, result.stdout).not.toBe(0);
    expect(result.stderr).toContain('outside the repository');
    expect(fs.readdirSync(outside)).toEqual([]);
  });

  it('refuses a dangling symlink', () => {
    fs.symlinkSync(path.join(sandbox, 'missing'), path.join(workspace, 'specs', 'demo', '001-dangling'));
    const result = create('specs/demo/001-dangling');
    expect(result.status, result.stdout).not.toBe(0);
    expect(result.stderr).toContain('is not a directory, or is a broken symlink');
    expect(fs.existsSync(path.join(sandbox, 'missing'))).toBe(false);
  });

  it('refuses an existing regular file', () => {
    fs.writeFileSync(path.join(workspace, 'specs', 'demo', '001-file'), 'not a folder\n');
    const result = create('specs/demo/001-file');
    expect(result.status, result.stdout).not.toBe(0);
    expect(result.stderr).toContain('is not a directory, or is a broken symlink');
  });

  it('refuses the repository root', () => {
    const result = create('.');
    expect(result.status, result.stdout).not.toBe(0);
    expect(result.stderr).toContain('names the repository root');
    expect(fs.existsSync(path.join(workspace, 'spec.md'))).toBe(false);
  });

  it('keeps a symlink whose target stays inside the repository, under the name it was given', () => {
    const inside = path.join(workspace, 'specs', 'demo', 'real-target');
    fs.mkdirSync(inside);
    fs.symlinkSync(inside, path.join(workspace, 'specs', 'demo', '001-inside'));
    const result = create('specs/demo/001-inside');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(inside, 'spec.md'))).toBe(true);
    expect(result.stdout).toContain('001-inside');
    expect(result.stdout).not.toContain('real-target');
  });

  it('still creates a new folder that does not exist yet', () => {
    const result = create('specs/demo/001-fresh');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(workspace, 'specs', 'demo', '001-fresh', 'spec.md'))).toBe(true);
  });
});
