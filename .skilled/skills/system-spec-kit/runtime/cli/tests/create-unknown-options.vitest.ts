// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Unknown Options
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// An unrecognized option used to fall through to the title words, so a
// misspelled flag became part of the folder name and the run still exited 0.
// The script must now refuse it before anything is written.
let workspace: string;
let createScript: string;

beforeAll(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-unknown-options-')));
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

afterAll(() => {
  fs.rmSync(workspace, { recursive: true, force: true });
});

function run(args: string[]) {
  return spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], {
    cwd: workspace,
    encoding: 'utf8',
  });
}

function specsEntries(): string[] {
  const specsDir = path.join(workspace, 'specs');
  return fs.existsSync(specsDir) ? fs.readdirSync(specsDir).sort() : [];
}

describe('create.sh option parsing', () => {
  it('rejects an unknown option and writes nothing', () => {
    const before = specsEntries();
    const result = run(['--goal', 'Unknown flag title']);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain("Error: unknown option '--goal'");
    expect(result.stderr).toContain('--help');
    expect(specsEntries()).toEqual(before);
  });

  it('rejects a lone dash and writes nothing', () => {
    const before = specsEntries();
    const result = run(['-', 'Lone dash title']);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain("Error: unknown option '-'");
    expect(specsEntries()).toEqual(before);
  });

  it('still writes goal.md for --with-goal', () => {
    const result = run(['--level', '1', '--with-goal', 'Goal flag title']);
    expect(result.status, result.stderr).toBe(0);

    const payload = JSON.parse(result.stdout) as { SPEC_FILE: string };
    const folder = path.dirname(payload.SPEC_FILE);
    expect(path.basename(folder)).not.toContain('with-goal');
    expect(fs.existsSync(path.join(folder, 'goal.md'))).toBe(true);
  });
});
