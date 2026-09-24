// ───────────────────────────────────────────────────────────────────
// TEST: archive.sh Inside a Track
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');

// A track keeps its archived packets in its own z_archive/, and its track root
// lists the packets it holds in children_ids. archive.sh sent a track packet to
// the root archive, restored it to the specs root and left the list stale, which
// the pre-push track-root gate then blocks. These run in a throwaway repository,
// because archive.sh takes its root from the working directory's repository.
let repo: string;
let specs: string;
let archiveScript: string;

beforeEach(() => {
  repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'archive-track-')));
  specs = path.join(repo, 'specs');
  execFileSync('git', ['init', '--quiet'], { cwd: repo });
  const fixtureCli = path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  fs.mkdirSync(path.join(fixtureCli, 'spec'), { recursive: true });
  fs.mkdirSync(path.join(fixtureCli, 'lib'), { recursive: true });
  for (const script of ['archive.sh', 'refresh-track-roots.mjs']) {
    fs.copyFileSync(path.join(CLI_DIR, 'spec', script), path.join(fixtureCli, 'spec', script));
  }
  fs.copyFileSync(path.join(CLI_DIR, 'lib', 'track-roots.mjs'), path.join(fixtureCli, 'lib', 'track-roots.mjs'));
  archiveScript = path.join(fixtureCli, 'spec', 'archive.sh');
  fs.mkdirSync(specs);
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

function packet(relative: string) {
  fs.mkdirSync(path.join(specs, relative), { recursive: true });
  fs.writeFileSync(path.join(specs, relative, 'spec.md'), '# Packet\n');
}

function trackRoot(name: string, children: string[]) {
  const metadata = { schema_version: 1, packet_id: name, spec_folder: name, parent_id: null, children_ids: children };
  fs.mkdirSync(path.join(specs, name), { recursive: true });
  fs.writeFileSync(path.join(specs, name, 'graph-metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  for (const child of children) packet(child);
}

function children(track: string): string[] {
  return JSON.parse(fs.readFileSync(path.join(specs, track, 'graph-metadata.json'), 'utf8')).children_ids;
}

function archive(args: string[]) {
  return spawnSync('bash', [archiveScript, ...args], { cwd: repo, encoding: 'utf8' });
}

describe('archive.sh with tracks', () => {
  it('archives a track packet into its own track and drops it from the list', () => {
    trackRoot('tools', ['tools/001-a', 'tools/002-b']);
    const result = archive(['--force', 'specs/tools/002-b']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', 'z_archive', '002-b', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'tools', '002-b'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
    expect(children('tools')).toEqual(['tools/001-a']);
  });

  it('restores a track packet to its track and lists it again', () => {
    trackRoot('tools', ['tools/001-a', 'tools/002-b']);
    expect(archive(['--force', 'specs/tools/002-b']).status).toBe(0);
    const result = archive(['--restore', 'specs/tools/z_archive/002-b']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', '002-b', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, '002-b'))).toBe(false);
    expect(children('tools')).toEqual(['tools/001-a', 'tools/002-b']);
  });

  it('keeps the root archive for a packet at the specs root', () => {
    packet('005-root');
    expect(archive(['--force', 'specs/005-root']).status).toBe(0);
    expect(fs.existsSync(path.join(specs, 'z_archive', '005-root', 'spec.md'))).toBe(true);
    expect(archive(['--restore', 'specs/z_archive/005-root']).status).toBe(0);
    expect(fs.existsSync(path.join(specs, '005-root', 'spec.md'))).toBe(true);
  });

  it('lists archived packets from every archive with the path that restores them', () => {
    trackRoot('tools', ['tools/001-a']);
    packet('005-root');
    archive(['--force', 'specs/tools/001-a']);
    archive(['--force', 'specs/005-root']);
    const result = archive(['--list']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('specs/tools/z_archive/001-a');
    expect(result.stdout).toContain('specs/z_archive/005-root');
  });

  it('leaves a symlinked track out of the list, since its packets cannot be moved from here', () => {
    const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-linked-'));
    try {
      fs.mkdirSync(path.join(elsewhere, 'z_archive', '003-far'), { recursive: true });
      fs.symlinkSync(elsewhere, path.join(specs, 'linked'));
      packet('005-root');
      archive(['--force', 'specs/005-root']);
      const result = archive(['--list']);
      expect(result.stdout).toContain('specs/z_archive/005-root');
      expect(result.stdout).not.toContain('003-far');
    } finally {
      fs.rmSync(elsewhere, { recursive: true, force: true });
    }
  });

  it('refuses to restore a folder that is in a track but not in its archive', () => {
    trackRoot('tools', ['tools/001-a']);
    packet('tools/001-a/002-p');
    const result = archive(['--restore', 'specs/tools/001-a/002-p']);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('not in archive directory');
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-p', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'tools', '002-p'))).toBe(false);
  });

  it('refuses a packet that is already in a track archive', () => {
    trackRoot('tools', ['tools/001-a']);
    archive(['--force', 'specs/tools/001-a']);
    const result = archive(['--force', 'specs/tools/z_archive/001-a']);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('already archived');
  });

  it('archives a packet whose track has no graph-metadata.json without a refresh warning', () => {
    packet('plain/001-a');
    const result = archive(['--force', 'specs/plain/001-a']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'plain', 'z_archive', '001-a'))).toBe(true);
    expect(result.stdout + result.stderr).not.toContain('was not refreshed');
  });

  it('still archives, and says so, when the writer is missing', () => {
    trackRoot('tools', ['tools/001-a', 'tools/002-b']);
    fs.rmSync(path.join(path.dirname(archiveScript), 'refresh-track-roots.mjs'));
    const result = archive(['--force', 'specs/tools/002-b']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', 'z_archive', '002-b'))).toBe(true);
    expect(result.stdout + result.stderr).toContain('tools/graph-metadata.json was not refreshed');
    expect(children('tools')).toEqual(['tools/001-a', 'tools/002-b']);
  });
});
