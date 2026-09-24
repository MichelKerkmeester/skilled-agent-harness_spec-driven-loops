// ───────────────────────────────────────────────────────────────────
// TEST: archive.sh in Tracks and Phases
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
// the pre-push track-root gate then blocks. A phase belongs in its parent's own
// z_archive/ the same way. These run in a throwaway repository, because
// archive.sh takes its root from the working directory's repository.
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

function phaseParent(relative: string, phases: string[]) {
  const metadata = { schema_version: 1, packet_id: relative, spec_folder: relative, children_ids: phases.map((phase) => `${relative}/${phase}`) };
  packet(relative);
  fs.writeFileSync(path.join(specs, relative, 'graph-metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  for (const phase of phases) packet(`${relative}/${phase}`);
}

function readMetadata(relative: string): string {
  return fs.readFileSync(path.join(specs, relative, 'graph-metadata.json'), 'utf8');
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
    expect(result.stdout + result.stderr).not.toContain('reviewed prune');
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
    fs.writeFileSync(path.join(specs, 'graph-metadata.json'), '{}\n');
    const archived = archive(['--force', 'specs/005-root']);
    expect(archived.status).toBe(0);
    expect(archived.stdout + archived.stderr).not.toContain('reviewed prune');
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
      packet('tools/001-a');
      fs.symlinkSync(elsewhere, path.join(specs, 'tools', '002-linked'));
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

  it('refuses to restore from a z_archive outside the specs root', () => {
    const elsewhere = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'archive-outside-')));
    try {
      fs.mkdirSync(path.join(elsewhere, 'z_archive', '001-a'), { recursive: true });
      const result = archive(['--restore', path.join(elsewhere, 'z_archive', '001-a')]);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('not in archive directory');
      expect(fs.existsSync(path.join(elsewhere, 'z_archive', '001-a'))).toBe(true);
      expect(fs.existsSync(path.join(elsewhere, '001-a'))).toBe(false);
    } finally {
      fs.rmSync(elsewhere, { recursive: true, force: true });
    }
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

describe('archive.sh with phases', () => {
  it('archives a phase into its parent\'s own z_archive, restores it there and leaves both lists alone', () => {
    trackRoot('tools', ['tools/001-a']);
    phaseParent('tools/001-a', ['002-p', '003-q']);
    const parentBefore = readMetadata('tools/001-a');

    const archived = archive(['--force', 'specs/tools/001-a/002-p']);
    expect(archived.status, archived.stdout + archived.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', 'z_archive', '002-p', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-p'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'tools', 'z_archive'))).toBe(false);
    expect(readMetadata('tools/001-a')).toBe(parentBefore);
    expect(children('tools')).toEqual(['tools/001-a']);
    expect(archived.stdout + archived.stderr).toContain('reviewed prune');

    const restored = archive(['--restore', 'specs/tools/001-a/z_archive/002-p']);
    expect(restored.status, restored.stdout + restored.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-p', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, '002-p'))).toBe(false);
    expect(readMetadata('tools/001-a')).toBe(parentBefore);
  });

  it('archives a phase of a packet at the specs root into that packet\'s archive, without a note when it has no metadata', () => {
    packet('005-root/001-x');
    const result = archive(['--force', 'specs/005-root/001-x']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, '005-root', 'z_archive', '001-x', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
    expect(result.stdout + result.stderr).not.toContain('reviewed prune');
  });

  it('lists phase archives, and leaves out an archive inside an archive or inside a research copy', () => {
    packet('tools/001-a/002-p');
    archive(['--force', 'specs/tools/001-a/002-p']);
    packet('z_archive/007-old/z_archive/001-y');
    packet('tools/001-a/research/copy/specs/sk/z_archive/009-junk');
    const result = archive(['--list']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('specs/tools/001-a/z_archive/002-p');
    expect(result.stdout).toContain('specs/z_archive/007-old');
    expect(result.stdout).not.toContain('001-y');
    expect(result.stdout).not.toContain('009-junk');
  });

  it('refuses to restore from an archive inside an archived packet or a research copy', () => {
    packet('z_archive/007-old/z_archive/001-y');
    packet('tools/001-a/research/copy/specs/sk/z_archive/009-junk');
    for (const folder of ['specs/z_archive/007-old/z_archive/001-y', 'specs/tools/001-a/research/copy/specs/sk/z_archive/009-junk']) {
      const result = archive(['--restore', folder]);
      expect(result.status, folder).not.toBe(0);
      expect(result.stderr).toContain('not in archive directory');
      expect(fs.existsSync(path.join(repo, folder, 'spec.md'))).toBe(true);
    }
  });

  it('refuses to archive a numbered folder that is not a packet, track packet or phase', () => {
    packet('tools/001-a/research/002-z');
    const result = archive(['--force', 'specs/tools/001-a/research/002-z']);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Not a packet, track packet or phase');
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', 'research', '002-z', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', 'research', 'z_archive'))).toBe(false);
  });

  it('refuses to restore a folder nested below an archived packet', () => {
    packet('z_archive/007-old/001-y');
    const result = archive(['--restore', 'specs/z_archive/007-old/001-y']);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('not in archive directory');
    expect(fs.existsSync(path.join(specs, 'z_archive', '007-old', '001-y', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, '001-y'))).toBe(false);
  });
});
