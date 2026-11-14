// ───────────────────────────────────────────────────────────────────
// MODULE: Archive-Aware Numbering
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// A packet coming back out of the archive must never reuse a number a newer
// packet already holds, and a new packet must not skip ahead just because an
// old one is filed there. The allocator therefore reads both the live folders
// and the archive folder of the root it writes into. Every case builds that
// root in a throwaway repository, so no real packet is touched.
let workspace: string;
let createScript: string;

beforeEach(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'archive-numbering-')));
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
  fs.rmSync(workspace, { recursive: true, force: true });
});

function create(args: string[]): string {
  const result = spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], {
    cwd: workspace,
    encoding: 'utf8',
  });
  expect(result.status, result.stderr).toBe(0);
  const { SPEC_FILE } = JSON.parse(result.stdout) as { SPEC_FILE: string };
  return path.relative(workspace, path.dirname(SPEC_FILE)).split(path.sep).join('/');
}

function packet(root: string, folder: string): void {
  const folderPath = path.join(workspace, root, folder);
  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(path.join(folderPath, 'spec.md'), '# Packet\n');
}

function archive(root: string, folder: string): void {
  packet(root, path.join('z_archive', folder));
}

function declareSubTrack(track: string, sub: string): void {
  const trackPath = path.join(workspace, 'specs', track);
  const subPath = path.join(trackPath, sub);
  fs.mkdirSync(subPath, { recursive: true });
  fs.writeFileSync(
    path.join(trackPath, 'graph-metadata.json'),
    `${JSON.stringify({
      schema_version: 1,
      packet_id: track,
      spec_folder: track,
      parent_id: null,
      children_ids: [`${track}/${sub}`],
    }, null, 2)}\n`,
  );
  fs.writeFileSync(path.join(subPath, 'description.json'), `${JSON.stringify({ level: 'sub-track' })}\n`);
  fs.writeFileSync(
    path.join(subPath, 'graph-metadata.json'),
    `${JSON.stringify({
      schema_version: 1,
      packet_id: `${track}/${sub}`,
      spec_folder: `${track}/${sub}`,
      parent_id: track,
      children_ids: [],
    }, null, 2)}\n`,
  );
}

describe('create.sh numbers after archived packets', () => {
  it('counts the archive when numbering the specs root', () => {
    packet('specs', '001-a');
    archive('specs', '007-b');

    expect(create(['--short-name', 'after-archive', 'After archive']))
      .toBe('specs/008-after-archive');
  });

  it('numbers a named track from that track and its archive', () => {
    packet('specs/demo', '001-a');
    archive('specs/demo', '007-b');

    expect(create(['--track', 'demo', '--short-name', 'after-archive', 'After archive']))
      .toBe('specs/demo/008-after-archive');
  });

  it('numbers a declared sub-track from that sub-track and its archive', () => {
    declareSubTrack('demo', 'sub');
    packet('specs/demo/sub', '001-a');
    archive('specs/demo/sub', '007-b');

    expect(create(['--track', 'demo/sub', '--short-name', 'after-archive', 'After archive']))
      .toBe('specs/demo/sub/008-after-archive');
  });

  it('leaves the number unchanged when every archived packet is lower', () => {
    packet('specs', '005-a');
    archive('specs', '002-b');

    expect(create(['--short-name', 'after-archive', 'After archive']))
      .toBe('specs/006-after-archive');
  });
});

describe('create.sh numbers an appended phase after archived phases', () => {
  it('skips a number held by an archived phase and keeps a live predecessor', () => {
    packet('specs', '001-parent');
    packet('specs/001-parent', '001-alpha');
    archive('specs/001-parent', '002-gamma');

    expect(create([
      '--phase', '--parent', 'specs/001-parent',
      '--phase-names', 'delta', 'Appended delta',
    ])).toBe('specs/001-parent');

    const childSpec = path.join(workspace, 'specs/001-parent', '003-delta', 'spec.md');
    expect(fs.existsSync(childSpec)).toBe(true);
    expect(fs.readFileSync(childSpec, 'utf8'))
      .toMatch(/^\| \*\*Predecessor\*\* \| 001-alpha \|$/mu);
  });

  it('numbers after a live phase when the archive holds only a lower number', () => {
    packet('specs', '001-parent');
    packet('specs/001-parent', '002-beta');
    archive('specs/001-parent', '001-old');

    expect(create([
      '--phase', '--parent', 'specs/001-parent',
      '--phase-names', 'delta', 'Appended delta',
    ])).toBe('specs/001-parent');

    expect(fs.existsSync(path.join(workspace, 'specs/001-parent', '003-delta', 'spec.md'))).toBe(true);
  });
});
