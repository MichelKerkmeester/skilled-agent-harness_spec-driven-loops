// ───────────────────────────────────────────────────────────────────
// TEST: create.sh Without a Build
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// A checkout with no build and no install: create.sh, the libraries it sources,
// the renderer wrapper and the templates, but no runtime/cli/dist, no graph
// deriver and no node_modules. The scaffold still succeeds, so every generated
// file it cannot write has to be reported rather than left out quietly.
let workspace: string;
let createScript: string;

beforeAll(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-without-build-')));
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

function create(args: string[]) {
  const result = spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], {
    cwd: workspace,
    encoding: 'utf8',
  });
  expect(result.status, result.stderr).toBe(0);
  return {
    payload: JSON.parse(result.stdout) as { SPEC_FILE: string; CREATED_FILES: string[] },
    stderr: result.stderr,
  };
}

describe('create.sh without a build', () => {
  it('scaffolds a Level 2 packet and names the generated files it could not write', () => {
    const { payload, stderr } = create(['--level', '2', 'No build level two']);
    const folder = path.dirname(payload.SPEC_FILE);

    expect(fs.existsSync(path.join(folder, 'spec.md'))).toBe(true);
    expect(payload.CREATED_FILES).not.toContain('description.json');
    expect(fs.existsSync(path.join(folder, 'description.json'))).toBe(false);
    expect(stderr).toMatch(/description\.json skipped: \S*generate-description\.js is missing/u);
    expect(stderr).toMatch(/graph metadata derivation skipped: \S*tsx\/dist\/loader\.mjs is missing/u);
  });

  it('reports the skip for a phase parent and for its validation child', () => {
    const { payload, stderr } = create(['--level', 'phase-parent', 'No build parent']);

    expect(payload.CREATED_FILES).not.toContain('description.json');
    expect(stderr.match(/description\.json skipped/gu) ?? []).toHaveLength(2);
    expect(stderr).toMatch(/description\.json skipped for 001-validation-phase-\S+: /u);
  });

  it('reports the skip for a phase appended to an existing parent', () => {
    const parent = path.join(workspace, 'specs', '200-existing-parent');
    fs.mkdirSync(parent, { recursive: true });
    fs.writeFileSync(path.join(parent, 'spec.md'), '# Parent\n');

    const { stderr } = create(['--phase', '--parent', parent, '--phases', '1', '--phase-names', 'alpha', 'Append']);

    expect(fs.existsSync(path.join(parent, '001-alpha', 'spec.md'))).toBe(true);
    expect(stderr).toMatch(/description\.json skipped for phase 1: \S*generate-description\.js is missing/u);
  });
});
