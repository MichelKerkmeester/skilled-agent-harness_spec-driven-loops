// ───────────────────────────────────────────────────────────────────
// MODULE: Archive Track And Phase Packets
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

// The repair resolves the validator and the metadata writer from the working
// repository, so the round-trip cases link the real skill instead of copying
// three scripts; the writer only accepts a workspace anchored on a .opencode
// directory.
function linkRealTools() {
  fs.rmSync(path.join(repo, '.skilled'), { recursive: true, force: true });
  fs.mkdirSync(path.join(repo, '.skilled', 'skills'), { recursive: true });
  fs.symlinkSync(path.resolve(CLI_DIR, '..', '..'), path.join(repo, '.skilled', 'skills', 'system-spec-kit'), 'dir');
  fs.mkdirSync(path.join(repo, '.opencode'));
}

function validate(relative: string) {
  return spawnSync('bash', [path.join(repo, '.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh'), relative, '--strict'], { cwd: repo, encoding: 'utf8' });
}

function graphParentId(relative: string): string | null {
  return JSON.parse(readMetadata(relative)).parent_id;
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

  // A moved packet's recorded paths still name the folder it left, so both
  // directions hand the new location to the re-derive. The stub records its
  // arguments; the repair itself is covered by repair-derived's own suite.
  it('re-derives the recorded paths at the new location after an archive and a restore', () => {
    const calls = path.join(repo, 'repair-calls.txt');
    fs.writeFileSync(
      path.join(path.dirname(archiveScript), 'repair-derived.cjs'),
      `require('node:fs').appendFileSync(${JSON.stringify(calls)}, process.argv.slice(2).join(' ') + '\\n');\n`,
    );
    trackRoot('tools', ['tools/001-a', 'tools/002-b']);

    expect(archive(['--force', 'specs/tools/002-b']).status).toBe(0);
    expect(archive(['--restore', 'specs/tools/z_archive/002-b']).status).toBe(0);

    expect(fs.readFileSync(calls, 'utf8').trim().split('\n')).toEqual([
      `--roots ${path.join(specs, 'tools', 'z_archive', '002-b')} --apply`,
      `--roots ${path.join(specs, 'tools', '002-b')} --apply`,
    ]);
  });

  it('still archives, and names the repair command, when the re-derive script is missing', () => {
    trackRoot('tools', ['tools/001-a', 'tools/002-b']);
    // Force the removal so the case holds whatever the fixture repo ships.
    fs.rmSync(path.join(path.dirname(archiveScript), 'repair-derived.cjs'), { force: true });
    const result = archive(['--force', 'specs/tools/002-b']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'tools', 'z_archive', '002-b', 'spec.md'))).toBe(true);
    expect(result.stdout + result.stderr).toContain('were not re-derived');
    expect(result.stdout + result.stderr).toContain('repair-derived.cjs --roots');
    expect(result.stdout + result.stderr).not.toContain('may still name the old folder');
    expect(children('tools')).toEqual(['tools/001-a']);
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

describe('archive.sh round trip with the real tools', () => {
  it('archives, validates, restores and validates a fixture packet with the real tools', { timeout: 120_000 }, () => {
    linkRealTools();
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, '001-valid'), { recursive: true });

    const fresh = validate('specs/001-valid');
    expect(fresh.status, fresh.stdout + fresh.stderr).not.toBe(0);
    expect(fresh.stdout).not.toContain('RESULT: PASSED');

    const archived = archive(['--force', 'specs/001-valid']);
    expect(archived.status, archived.stdout + archived.stderr).toBe(0);
    expect(archived.stdout + archived.stderr).not.toContain('may still name the old folder');
    expect(archived.stdout + archived.stderr).not.toContain('were not re-derived');

    const inArchive = validate('specs/z_archive/001-valid');
    expect(inArchive.status, inArchive.stdout + inArchive.stderr).toBe(0);
    expect(inArchive.stdout).toContain('RESULT: PASSED');

    const restored = archive(['--restore', 'specs/z_archive/001-valid']);
    expect(restored.status, restored.stdout + restored.stderr).toBe(0);
    expect(restored.stdout + restored.stderr).not.toContain('may still name the old folder');
    expect(restored.stdout + restored.stderr).not.toContain('were not re-derived');

    const roundTripped = validate('specs/001-valid');
    expect(roundTripped.status, roundTripped.stdout + roundTripped.stderr).toBe(0);
    expect(roundTripped.stdout).toContain('RESULT: PASSED');
  });

  // A packet nested in the moved one carries the same stale paths as its parent,
  // and the re-derive reaches both by walking the moved tree.
  it('re-derives a packet nested in the moved one from its own path', { timeout: 120_000 }, () => {
    linkRealTools();
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, 'tools', '001-parent'), { recursive: true });
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, 'tools', '001-parent', '002-child'), { recursive: true });

    const fresh = validate('specs/tools/001-parent/002-child');
    expect(fresh.status, fresh.stdout + fresh.stderr).not.toBe(0);
    expect(fresh.stdout).not.toContain('RESULT: PASSED');

    const archived = archive(['--force', 'specs/tools/001-parent']);
    expect(archived.status, archived.stdout + archived.stderr).toBe(0);
    expect(archived.stdout + archived.stderr).not.toContain('may still name the old folder');
    expect(archived.stdout + archived.stderr).not.toContain('were not re-derived');

    const archivedParent = validate('specs/tools/z_archive/001-parent');
    expect(archivedParent.status, archivedParent.stdout + archivedParent.stderr).toBe(0);
    expect(archivedParent.stdout).toContain('RESULT: PASSED');
    const archivedChild = validate('specs/tools/z_archive/001-parent/002-child');
    expect(archivedChild.status, archivedChild.stdout + archivedChild.stderr).toBe(0);
    expect(archivedChild.stdout).toContain('RESULT: PASSED');
    expect(graphParentId('tools/z_archive/001-parent/002-child')).toBe('tools/z_archive/001-parent');

    const restored = archive(['--restore', 'specs/tools/z_archive/001-parent']);
    expect(restored.status, restored.stdout + restored.stderr).toBe(0);
    expect(restored.stdout + restored.stderr).not.toContain('may still name the old folder');
    expect(restored.stdout + restored.stderr).not.toContain('were not re-derived');

    const roundTrippedParent = validate('specs/tools/001-parent');
    expect(roundTrippedParent.status, roundTrippedParent.stdout + roundTrippedParent.stderr).toBe(0);
    expect(roundTrippedParent.stdout).toContain('RESULT: PASSED');
    const roundTrippedChild = validate('specs/tools/001-parent/002-child');
    expect(roundTrippedChild.status, roundTrippedChild.stdout + roundTrippedChild.stderr).toBe(0);
    expect(roundTrippedChild.stdout).toContain('RESULT: PASSED');
    expect(graphParentId('tools/001-parent/002-child')).toBe('tools/001-parent');
  });

  // An archived phase sits in z_archive, which is not a packet home, so it
  // derives no parent; restoring it puts the parent packet back in its path.
  it('re-derives an archived phase with no parent, then its parent packet again on restore', { timeout: 120_000 }, () => {
    linkRealTools();
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, 'tools', '001-a'), { recursive: true });
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, 'tools', '001-a', '002-p'), { recursive: true });

    const fresh = validate('specs/tools/001-a/002-p');
    expect(fresh.status, fresh.stdout + fresh.stderr).not.toBe(0);
    expect(fresh.stdout).not.toContain('RESULT: PASSED');

    const archived = archive(['--force', 'specs/tools/001-a/002-p']);
    expect(archived.status, archived.stdout + archived.stderr).toBe(0);
    expect(archived.stdout + archived.stderr).not.toContain('may still name the old folder');

    const inArchive = validate('specs/tools/001-a/z_archive/002-p');
    expect(inArchive.status, inArchive.stdout + inArchive.stderr).toBe(0);
    expect(inArchive.stdout).toContain('RESULT: PASSED');
    expect(graphParentId('tools/001-a/z_archive/002-p')).toBeNull();

    const restored = archive(['--restore', 'specs/tools/001-a/z_archive/002-p']);
    expect(restored.status, restored.stdout + restored.stderr).toBe(0);
    expect(restored.stdout + restored.stderr).not.toContain('may still name the old folder');

    const roundTripped = validate('specs/tools/001-a/002-p');
    expect(roundTripped.status, roundTripped.stdout + roundTripped.stderr).toBe(0);
    expect(roundTripped.stdout).toContain('RESULT: PASSED');
    expect(graphParentId('tools/001-a/002-p')).toBe('tools/001-a');
  });

  // The move never reads the packet's metadata, so a file the re-derive cannot
  // parse survives the move and fails the step after it. The completed move
  // stands: rerunning the repair, as the warning says, is the recovery.
  it('reports a re-derive it could not complete and keeps the move that already happened', { timeout: 120_000 }, () => {
    linkRealTools();
    fs.cpSync(path.join(CLI_DIR, 'test-fixtures', '002-valid-level1'), path.join(specs, '001-valid'), { recursive: true });
    const corrupt = '{\n';
    fs.writeFileSync(path.join(specs, '001-valid', 'graph-metadata.json'), corrupt);

    const archived = archive(['--force', 'specs/001-valid']);
    expect(archived.status, archived.stdout + archived.stderr).toBe(0);
    expect(archived.stdout + archived.stderr).toContain('may still name the old folder');
    expect(archived.stdout + archived.stderr).not.toContain('were not re-derived');
    expect(fs.existsSync(path.join(specs, 'z_archive', '001-valid', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, '001-valid'))).toBe(false);

    const retry = spawnSync('node', [path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'repair-derived.cjs'), '--roots', 'specs/z_archive/001-valid', '--apply'], { cwd: repo, encoding: 'utf8' });
    expect(retry.status, retry.stdout + retry.stderr).toBe(2);
    expect(retry.stdout).toContain('FAILED');
    expect(fs.readFileSync(path.join(specs, 'z_archive', '001-valid', 'graph-metadata.json'), 'utf8')).toBe(corrupt);
  });
});

describe('archive.sh keeps every write under the specs root', () => {
  // A z_archive that is a symlink is refused outright. The link can point
  // anywhere, and archiving copies, renames and deletes through its path, so an
  // archive that followed it could move the packet out of specs/ or into another
  // packet's archive.
  function snapshot(dir: string): Map<string, string> {
    const entries = new Map<string, string>();
    const walk = (current: string) => {
      for (const name of fs.readdirSync(current).sort()) {
        const full = path.join(current, name);
        const relative = path.relative(dir, full);
        if (fs.lstatSync(full).isDirectory()) {
          entries.set(`${relative}/`, '');
          walk(full);
        } else {
          entries.set(relative, fs.readFileSync(full).toString('base64'));
        }
      }
    };
    walk(dir);
    return entries;
  }

  function outsideDir(): string {
    return fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'archive-escape-')));
  }

  it('refuses a root packet whose z_archive links outside specs, and changes neither side', () => {
    const outside = outsideDir();
    try {
      packet('005-root');
      fs.writeFileSync(path.join(specs, '005-root', 'notes.txt'), 'keep\n');
      const before = snapshot(path.join(specs, '005-root'));
      fs.symlinkSync(outside, path.join(specs, 'z_archive'), 'dir');

      const result = archive(['--force', 'specs/005-root']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('symbolic link, not followed');
      expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
      expect(fs.readdirSync(outside)).toEqual([]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  // The archive argument is resolved to its physical folder before the containment
  // check, so a link under specs that points outside it is refused and the folder
  // it points at is left whole.
  it('refuses to archive a folder reached through a link that points outside specs, and changes neither side', () => {
    const outside = outsideDir();
    try {
      fs.mkdirSync(path.join(outside, '007-outside-packet'));
      fs.writeFileSync(path.join(outside, '007-outside-packet', 'spec.md'), '# Packet\n');
      const before = snapshot(outside);
      fs.symlinkSync(path.join(outside, '007-outside-packet'), path.join(specs, '007-linked'), 'dir');

      const result = archive(['--force', 'specs/007-linked']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('Refusing to archive outside specs root');
      expect(snapshot(outside)).toEqual(before);
      expect(fs.lstatSync(path.join(specs, '007-linked')).isSymbolicLink()).toBe(true);
      expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('refuses a z_archive that links into the packet being archived, and leaves the packet whole', () => {
    packet('005-root');
    fs.mkdirSync(path.join(specs, '005-root', 'sub'));
    fs.writeFileSync(path.join(specs, '005-root', 'sub', 'notes.txt'), 'keep\n');
    const before = snapshot(path.join(specs, '005-root'));
    fs.symlinkSync(path.join(specs, '005-root', 'sub'), path.join(specs, 'z_archive'), 'dir');

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
  });

  it('refuses a z_archive that links to a folder that is not a packet home, and leaves the packet whole', () => {
    trackRoot('tools', ['tools/001-a']);
    const notHome = path.join(specs, 'tools', '001-a', 'research', 'z_archive');
    fs.mkdirSync(notHome, { recursive: true });
    packet('005-root');
    const before = snapshot(path.join(specs, '005-root'));
    fs.symlinkSync(notHome, path.join(specs, 'z_archive'), 'dir');

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
    expect(fs.readdirSync(notHome)).toEqual([]);
  });

  it('refuses a z_archive that links into another packet home, and leaves the packet whole', () => {
    trackRoot('tools', ['tools/001-a']);
    const otherHome = path.join(specs, 'tools', '001-a', 'z_archive');
    fs.mkdirSync(otherHome, { recursive: true });
    packet('005-root');
    const before = snapshot(path.join(specs, '005-root'));
    fs.symlinkSync(otherHome, path.join(specs, 'z_archive'), 'dir');

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
    expect(fs.readdirSync(otherHome)).toEqual([]);
  });

  it('refuses a track packet whose track z_archive links outside specs, and leaves the track list alone', () => {
    const outside = outsideDir();
    try {
      trackRoot('tools', ['tools/001-a', 'tools/002-b']);
      const before = snapshot(path.join(specs, 'tools', '002-b'));
      const trackBefore = readMetadata('tools');
      fs.symlinkSync(outside, path.join(specs, 'tools', 'z_archive'), 'dir');

      const result = archive(['--force', 'specs/tools/002-b']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('symbolic link, not followed');
      expect(snapshot(path.join(specs, 'tools', '002-b'))).toEqual(before);
      expect(readMetadata('tools')).toBe(trackBefore);
      expect(fs.readdirSync(outside)).toEqual([]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('refuses a phase whose parent z_archive links outside specs', () => {
    const outside = outsideDir();
    try {
      trackRoot('tools', ['tools/001-a']);
      phaseParent('tools/001-a', ['002-p', '003-q']);
      const before = snapshot(path.join(specs, 'tools', '001-a', '002-p'));
      fs.symlinkSync(outside, path.join(specs, 'tools', '001-a', 'z_archive'), 'dir');

      const result = archive(['--force', 'specs/tools/001-a/002-p']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('symbolic link, not followed');
      expect(snapshot(path.join(specs, 'tools', '001-a', '002-p'))).toEqual(before);
      expect(fs.readdirSync(outside)).toEqual([]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  // A link named as the archive folder is refused before restore resolves the
  // folder, since resolving would follow the link. This case pins that behavior.
  it('refuses to restore a folder that is reachable only through a link outside specs', () => {
    const outside = outsideDir();
    try {
      const outsideArchive = path.join(outside, 'z_archive');
      fs.mkdirSync(path.join(outsideArchive, '001-a'), { recursive: true });
      fs.writeFileSync(path.join(outsideArchive, '001-a', 'spec.md'), '# Outside\n');
      fs.symlinkSync(outsideArchive, path.join(specs, 'z_archive'), 'dir');

      const result = archive(['--restore', 'specs/z_archive/001-a']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('symbolic link, not followed');
      expect(fs.existsSync(path.join(outside, 'z_archive', '001-a', 'spec.md'))).toBe(true);
      expect(fs.existsSync(path.join(outside, '001-a'))).toBe(false);
      expect(fs.existsSync(path.join(specs, '001-a'))).toBe(false);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('refuses to restore through a z_archive that links to a folder that is not a packet home', () => {
    trackRoot('tools', ['tools/001-a']);
    const notHome = path.join(specs, 'tools', '001-a', 'research', 'z_archive');
    fs.mkdirSync(path.join(notHome, '002-x'), { recursive: true });
    fs.writeFileSync(path.join(notHome, '002-x', 'spec.md'), '# Stranded\n');
    fs.symlinkSync(notHome, path.join(specs, 'z_archive'), 'dir');
    const before = snapshot(path.join(notHome, '002-x'));

    const result = archive(['--restore', 'specs/z_archive/002-x']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(notHome, '002-x'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, '002-x'))).toBe(false);
  });

  it('refuses to restore through a z_archive that links into another packet home', () => {
    trackRoot('tools', ['tools/001-a']);
    const otherHome = path.join(specs, 'tools', '001-a', 'z_archive');
    fs.mkdirSync(path.join(otherHome, '002-x'), { recursive: true });
    fs.writeFileSync(path.join(otherHome, '002-x', 'spec.md'), '# Archived\n');
    fs.symlinkSync(otherHome, path.join(specs, 'z_archive'), 'dir');
    const before = snapshot(path.join(otherHome, '002-x'));

    const result = archive(['--restore', 'specs/z_archive/002-x']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(otherHome, '002-x'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-x'))).toBe(false);
  });

  it('refuses to restore onto a link at the target, and moves nothing', () => {
    const outside = outsideDir();
    try {
      packet('005-root');
      expect(archive(['--force', 'specs/005-root']).status).toBe(0);
      const archived = snapshot(path.join(specs, 'z_archive', '005-root'));
      fs.symlinkSync(path.join(outside, 'missing'), path.join(specs, '005-root'));

      const result = archive(['--restore', 'specs/z_archive/005-root']);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('already exists');
      expect(snapshot(path.join(specs, 'z_archive', '005-root'))).toEqual(archived);
      expect(fs.readdirSync(outside)).toEqual([]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  // A "." or ".." segment can carry a path through a linked z_archive without
  // the literal parent looking like one, so such arguments are refused before
  // anything is resolved.
  it('refuses a restore path with a . segment that reaches a folder through a linked z_archive', () => {
    trackRoot('tools', ['tools/001-a']);
    const otherHome = path.join(specs, 'tools', '001-a', 'z_archive');
    fs.mkdirSync(path.join(otherHome, '002-x'), { recursive: true });
    fs.writeFileSync(path.join(otherHome, '002-x', 'spec.md'), '# Archived\n');
    fs.symlinkSync(otherHome, path.join(specs, 'z_archive'), 'dir');
    const before = snapshot(path.join(otherHome, '002-x'));

    const result = archive(['--restore', 'specs/z_archive/002-x/.']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('must not contain . or .. segments');
    expect(snapshot(path.join(otherHome, '002-x'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-x'))).toBe(false);
  });

  it('refuses a restore path with a .. segment, and moves nothing', () => {
    trackRoot('tools', ['tools/001-a']);
    const otherHome = path.join(specs, 'tools', '001-a', 'z_archive');
    fs.mkdirSync(path.join(otherHome, '002-x'), { recursive: true });
    fs.writeFileSync(path.join(otherHome, '002-x', 'spec.md'), '# Archived\n');
    fs.symlinkSync(otherHome, path.join(specs, 'z_archive'), 'dir');
    const before = snapshot(path.join(otherHome, '002-x'));

    const result = archive(['--restore', 'specs/z_archive/002-x/..']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('must not contain . or .. segments');
    expect(snapshot(path.join(otherHome, '002-x'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'tools', '001-a', '002-x'))).toBe(false);
  });

  it('refuses an archive path with a . segment, and moves nothing', () => {
    packet('005-root');
    const before = snapshot(path.join(specs, '005-root'));

    const result = archive(['--force', 'specs/005-root/.']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('must not contain . or .. segments');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'z_archive', '005-root'))).toBe(false);
  });

  it('refuses an archive path with a .. segment, and moves nothing', () => {
    packet('005-root');
    const before = snapshot(path.join(specs, '005-root'));

    const result = archive(['--force', 'specs/005-root/..']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('must not contain . or .. segments');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
  });

  // A z_archive that links to a path that does not exist has nothing to resolve,
  // so the link itself must be refused before anything is created through it. Each
  // row is an archive root the script writes through: the specs root, a track and
  // a phase parent.
  it.each([
    {
      label: 'the specs root',
      link: 'specs/z_archive',
      folder: 'specs/005-root',
      setup: () => packet('005-root'),
    },
    {
      label: 'a track',
      link: 'specs/tools/z_archive',
      folder: 'specs/tools/002-b',
      setup: () => trackRoot('tools', ['tools/001-a', 'tools/002-b']),
    },
    {
      label: 'a phase parent',
      link: 'specs/tools/001-a/z_archive',
      folder: 'specs/tools/001-a/002-p',
      setup: () => {
        trackRoot('tools', ['tools/001-a']);
        phaseParent('tools/001-a', ['002-p', '003-q']);
      },
    },
  ])('refuses a dangling z_archive under $label, moves nothing and creates no link target', ({ link, folder, setup }) => {
    setup();
    const missing = path.join(repo, 'elsewhere', 'missing-archive');
    fs.symlinkSync(missing, path.join(repo, link), 'dir');
    const before = snapshot(path.join(repo, folder));

    const result = archive(['--force', folder]);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(snapshot(path.join(repo, folder))).toEqual(before);
    expect(fs.existsSync(missing)).toBe(false);
  });

  it('refuses a restore through a dangling z_archive, follows nothing and creates no link target', () => {
    const missing = path.join(repo, 'elsewhere', 'missing-archive');
    fs.symlinkSync(missing, path.join(specs, 'z_archive'), 'dir');

    const result = archive(['--restore', 'specs/z_archive/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('symbolic link, not followed');
    expect(fs.existsSync(missing)).toBe(false);
    expect(fs.existsSync(path.join(specs, '005-root'))).toBe(false);
  });

  // A same-named folder already in the archive is a state the archive must leave
  // alone: the copy would otherwise be moved into it and the source removed.
  it('refuses an archive whose target already holds a folder of that name, and changes neither side', () => {
    packet('005-root');
    packet('z_archive/005-root');
    const live = snapshot(path.join(specs, '005-root'));
    const archived = snapshot(path.join(specs, 'z_archive', '005-root'));

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('Archive target already exists');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(live);
    expect(snapshot(path.join(specs, 'z_archive', '005-root'))).toEqual(archived);
  });

  // A dangling link is a name taken all the same: the move would replace the link,
  // so the target check counts a link as present even when nothing sits behind it.
  it('refuses an archive whose target is a dangling link, and changes neither side', () => {
    packet('005-root');
    fs.mkdirSync(path.join(specs, 'z_archive'));
    fs.symlinkSync(path.join(repo, 'elsewhere', 'missing'), path.join(specs, 'z_archive', '005-root'));
    const live = snapshot(path.join(specs, '005-root'));

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('Archive target already exists');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(live);
    expect(fs.lstatSync(path.join(specs, 'z_archive', '005-root')).isSymbolicLink()).toBe(true);
    expect(fs.existsSync(path.join(repo, 'elsewhere'))).toBe(false);
  });

  it('refuses a restore whose destination already holds a folder, and changes neither side', () => {
    packet('005-root');
    expect(archive(['--force', 'specs/005-root']).status).toBe(0);
    packet('005-root');
    fs.writeFileSync(path.join(specs, '005-root', 'spec.md'), '# Live packet\n');
    const archived = snapshot(path.join(specs, 'z_archive', '005-root'));
    const live = snapshot(path.join(specs, '005-root'));

    const result = archive(['--restore', 'specs/z_archive/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('Restore target already exists');
    expect(snapshot(path.join(specs, 'z_archive', '005-root'))).toEqual(archived);
    expect(snapshot(path.join(specs, '005-root'))).toEqual(live);
  });

  // Below the completeness minimum the script asks before it archives. A decline
  // is a documented clean cancel: exit 0, a message, and nothing moved.
  it('a declined archive prompt exits 0, says it was cancelled and moves nothing', () => {
    packet('005-root');
    fs.writeFileSync(
      path.join(path.dirname(archiveScript), 'calculate-completeness.sh'),
      '#!/usr/bin/env bash\necho \'{"overall_completion": 40}\'\n',
      { mode: 0o755 },
    );
    const before = snapshot(path.join(specs, '005-root'));

    const result = spawnSync('bash', [archiveScript, 'specs/005-root'], { cwd: repo, encoding: 'utf8', input: 'n\n' });
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout + result.stderr).toContain('Archive cancelled.');
    expect(snapshot(path.join(specs, '005-root'))).toEqual(before);
    expect(fs.existsSync(path.join(specs, 'z_archive'))).toBe(false);
  });

  // When the specs root cannot be resolved the script refuses before it resolves
  // the folder or creates anything, so a dangling specs link is not written through.
  it('refuses when the specs root is a dangling link, and creates nothing through it', () => {
    fs.rmSync(specs, { recursive: true, force: true });
    const missing = path.join(repo, 'elsewhere', 'missing-specs');
    fs.symlinkSync(missing, specs, 'dir');

    const result = archive(['--force', 'specs/005-root']);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stderr).toContain('Specs directory not found');
    expect(fs.existsSync(missing)).toBe(false);
  });

  // Outside a repository the root is derived from the script's own location. A
  // copy with no specs folder there is refused, and nothing is created in that root.
  it('refuses in a copy outside any repository whose derived root has no specs folder', () => {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'archive-fallback-')));
    try {
      const copiedSpec = path.join(root, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec');
      fs.mkdirSync(copiedSpec, { recursive: true });
      fs.copyFileSync(path.join(CLI_DIR, 'spec', 'archive.sh'), path.join(copiedSpec, 'archive.sh'));

      const result = spawnSync('bash', [path.join(copiedSpec, 'archive.sh'), '--force', 'specs/005-root'], { cwd: root, encoding: 'utf8' });
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(result.stderr).toContain('Specs directory not found');
      expect(fs.readdirSync(root)).toEqual(['.skilled']);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
