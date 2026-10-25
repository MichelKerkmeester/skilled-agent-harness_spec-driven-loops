// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Track Containment
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// A track names a folder under specs/. The value comes from whoever runs the
// scaffold, often a model filling in a command template, so a value that
// climbs out of specs/ must be refused before anything is written. The
// sandbox repository sits one level inside its temp folder, so an escape of
// two levels still lands inside the temp folder and the test can see it.
let sandbox: string;
let workspace: string;
let createScript: string;

beforeEach(() => {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-track-containment-')));
  workspace = path.join(sandbox, 'repo');
  fs.mkdirSync(workspace);
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
  createScript = path.join(fixtureCli, 'spec', 'create.sh');
});

afterEach(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

function create(track: string) {
  return spawnSync(
    'bash',
    [createScript, '--json', '--skip-branch', '--track', track, '--short-name', 'probe', 'Probe packet'],
    { cwd: workspace, encoding: 'utf8' },
  );
}

// Every path in the sandbox except git's own bookkeeping, so a refused run can
// be shown to have written nothing anywhere.
function listing(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === '.skilled') continue;
      const full = path.join(dir, entry.name);
      out.push(path.relative(sandbox, full));
      if (entry.isDirectory()) walk(full);
    }
  };
  walk(sandbox);
  return out.sort();
}

describe('create.sh refuses a --track that leaves specs/', () => {
  const refused: Array<[string, () => string]> = [
    ['..', () => '..'],
    ['../x', () => '../x'],
    ['../../escaped', () => '../../escaped'],
    ['a/../../x', () => 'a/../../x'],
    ['an absolute path', () => path.join(sandbox, 'absolute-track')],
    ['.', () => '.'],
  ];

  for (const [label, value] of refused) {
    it(`refuses ${label} before any folder is made`, () => {
      const before = listing();
      const result = create(value());
      expect(result.status, result.stdout).not.toBe(0);
      expect(result.stderr).toContain('--track');
      expect(listing()).toEqual(before);
    });
  }
});

describe('create.sh keeps every track that stays inside specs/', () => {
  it('creates specs/demo/001-probe for demo', () => {
    const result = create('demo');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(workspace, 'specs', 'demo', '001-probe', 'spec.md'))).toBe(true);
  });

  it('creates specs/demo/sub/001-probe for demo/sub', () => {
    const result = create('demo/sub');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(workspace, 'specs', 'demo', 'sub', '001-probe', 'spec.md'))).toBe(true);
  });

  it('treats an empty value as no track', () => {
    const result = create('');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(workspace, 'specs', '001-probe', 'spec.md'))).toBe(true);
  });

  it('honors a track that already exists as a symlink', () => {
    const linked = path.join(sandbox, 'linked-target');
    fs.mkdirSync(linked);
    fs.mkdirSync(path.join(workspace, 'specs'));
    fs.symlinkSync(linked, path.join(workspace, 'specs', 'linked'));
    const result = create('linked');
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(linked, '001-probe', 'spec.md'))).toBe(true);
  });
});
