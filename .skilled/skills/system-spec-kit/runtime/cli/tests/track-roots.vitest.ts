// ───────────────────────────────────────────────────────────────────
// MODULE: Track Root Sweep and Refresh
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error -- source module is plain ESM without declaration files.
import { readCommitTracks, readWorkingTreeTracks } from '../lib/track-roots.mjs';
// @ts-expect-error -- fixture helper is plain ESM without declaration files.
import { buildFlatTree, buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

const SPEC_DIR = path.resolve(__dirname, '../spec');
const SWEEP = path.join(SPEC_DIR, 'sweep-track-roots.mjs');
const REFRESH = path.join(SPEC_DIR, 'refresh-track-roots.mjs');

// A track root is a directory directly under specs/ with no spec.md of its own.
// Its graph-metadata.json declares children_ids, and nothing but these two
// scripts compares that list with the numbered packets on disk.
let repo: string;
let specs: string;

// A global ignore file may list /specs, which would leave every fixture commit empty.
function git(...args: string[]) {
  return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'core.excludesFile=/dev/null', ...args], { cwd: repo, encoding: 'utf8' });
}

function track(name: string, children: string[], onDisk: string[]) {
  const trackPath = path.join(specs, name);
  fs.mkdirSync(trackPath, { recursive: true });
  const metadata = {
    schema_version: 1,
    packet_id: name,
    spec_folder: name,
    parent_id: null,
    children_ids: children,
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [name], causal_summary: `Track folder for ${name}.` },
  };
  fs.writeFileSync(path.join(trackPath, 'graph-metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  for (const child of onDisk) {
    fs.mkdirSync(path.join(trackPath, child), { recursive: true });
    fs.writeFileSync(path.join(trackPath, child, 'spec.md'), '# Packet\n');
  }
}

function readChildren(name: string): string[] {
  return JSON.parse(fs.readFileSync(path.join(specs, name, 'graph-metadata.json'), 'utf8')).children_ids;
}

function run(script: string, args: string[]) {
  return spawnSync(process.execPath, [script, '--specs', specs, ...args], { cwd: repo, encoding: 'utf8' });
}

function commitFixture() {
  git('add', '-A');
  git('commit', '--quiet', '-m', 'fixture');
}

function summarizeTracks(tracks: Array<{ name: string, children: string[] }>) {
  return tracks.map(({ name, children }) => ({ name, children }));
}

function diagnosticsFromTracks(tracks: unknown): string[] {
  return (tracks as { diagnostics: string[] }).diagnostics;
}

beforeEach(() => {
  repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'track-roots-')));
  specs = path.join(repo, 'specs');
  execFileSync('git', ['init', '--quiet'], { cwd: repo });
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  fs.mkdirSync(specs);
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

describe('track-root discovery', () => {
  // A commit stores a linked description.json as its link text, which never
  // parses, so the working tree must refuse the link too or the two views split
  // and the pre-push gate blocks a tree the refresh just wrote.
  it('treats a linked sub-track description the same in both views', () => {
    const { entries } = buildSubtrackTree(repo);
    const real = path.join(repo, 'outside-description.json');
    fs.renameSync(path.join(entries.sub, 'description.json'), real);
    fs.symlinkSync(real, path.join(entries.sub, 'description.json'));
    const working = readWorkingTreeTracks(specs);
    commitFixture();
    const committed = readCommitTracks(specs, 'HEAD');

    expect(summarizeTracks(working)).toEqual(summarizeTracks(committed.tracks));
    expect(summarizeTracks(working).map((track) => track.name)).not.toContain('demo/sub');
  });

  // The declaration is one exact word everywhere, so a differently cased level
  // is not a sub-track in any tool.
  it('does not accept a differently cased level as a declaration', () => {
    const { entries } = buildSubtrackTree(repo);
    const file = path.join(entries.sub, 'description.json');
    fs.writeFileSync(file, `${JSON.stringify({ ...JSON.parse(fs.readFileSync(file, 'utf8')), level: 'Sub-Track' }, null, 2)}\n`);
    expect(summarizeTracks(readWorkingTreeTracks(specs)).map((track) => track.name)).not.toContain('demo/sub');
  });

  it('distinguishes a declared folder that also holds its own spec in both views', () => {
    const { entries } = buildSubtrackTree(repo);
    fs.writeFileSync(path.join(entries.sub, 'spec.md'), '# Packet-shaped folder\n');
    const working = readWorkingTreeTracks(specs);
    commitFixture();
    const committed = readCommitTracks(specs, 'HEAD');
    const expected = 'demo/sub: declared folder has spec.md and cannot be a sub-track';

    expect(diagnosticsFromTracks(working)).toContain(expected);
    expect(committed.diagnostics).toContain(expected);
    expect(diagnosticsFromTracks(working)).not.toContain('demo/sub: undeclared folder ignored');
    expect(committed.diagnostics).not.toContain('demo/sub: undeclared folder ignored');
  });

  it('returns the same declared sub-tracks from the working tree and commit', () => {
    buildSubtrackTree(repo);
    const working = readWorkingTreeTracks(specs);
    commitFixture();
    const committed = readCommitTracks(specs, 'HEAD');

    const expected = [
      { name: 'demo', children: ['001-flat-probe', 'sub'] },
      { name: 'demo/sub', children: ['001-nested-probe'] },
    ];
    expect(Array.isArray(working)).toBe(true);
    expect(summarizeTracks(working)).toEqual(expected);
    expect(summarizeTracks(committed.tracks)).toEqual(expected);
    expect(diagnosticsFromTracks(working)).toEqual([
      'demo/linked: symlinked folder skipped, not followed',
      'demo/loose: undeclared folder ignored',
    ]);
    expect(committed.diagnostics).toEqual(diagnosticsFromTracks(working));
    expect(committed.skipped).toEqual([]);
  });
});

describe('sweep-track-roots', () => {
  it('passes when every track declares exactly its packets on disk', () => {
    track('beta', ['beta/001-x'], ['001-x']);
    const result = run(SWEEP, []);
    expect(result.status, result.stdout).toBe(0);
  });

  // Equal counts are not equal sets: one packet renamed on disk while the list
  // kept the old name leaves both at one, and the track has still drifted.
  it('reports a track whose names differ even when the counts agree', () => {
    track('gamma', ['gamma/001-p'], ['002-q']);
    const result = run(SWEEP, []);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('gamma');
    expect(result.stdout).toContain('on disk, not declared: 002-q');
    expect(result.stdout).toContain('declared, not on disk: 001-p');
  });

  it('reads a commit rather than the working tree with --rev', () => {
    track('beta', ['beta/001-x'], ['001-x']);
    git('add', '-A');
    git('commit', '--quiet', '-m', 'clean');
    // An uncommitted packet is another session's work in progress, not the commit's.
    fs.mkdirSync(path.join(specs, 'beta', '002-uncommitted'));
    fs.writeFileSync(path.join(specs, 'beta', '002-uncommitted', 'spec.md'), '# Draft\n');

    expect(run(SWEEP, []).status).toBe(1);
    const atCommit = run(SWEEP, ['--rev', 'HEAD']);
    expect(atCommit.status, atCommit.stdout).toBe(0);

    git('add', '-A');
    git('commit', '--quiet', '-m', 'packet without its track entry');
    const drifted = run(SWEEP, ['--rev', 'HEAD']);
    expect(drifted.status).toBe(1);
    expect(drifted.stdout).toContain('on disk, not declared: 002-uncommitted');
  });

  // A symlinked track belongs to another repository, and a commit here holds only
  // the link, so --rev leaves it out rather than calling it drifted.
  it('skips a symlinked track under --rev', () => {
    const outside = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'track-roots-outside-')));
    try {
      fs.writeFileSync(path.join(outside, 'graph-metadata.json'), '{"packet_id":"linked","children_ids":["linked/009-gone"]}\n');
      fs.symlinkSync(outside, path.join(specs, 'linked'));
      track('beta', ['beta/001-x'], ['001-x']);
      git('add', '-A');
      git('commit', '--quiet', '-m', 'with a linked track');
      const result = run(SWEEP, ['--rev', 'HEAD']);
      expect(result.status, result.stdout).toBe(0);
      expect(result.stdout).not.toContain('linked: declared');
      expect(result.stdout).toContain('symlinked tracks skipped at HEAD: linked');
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe('refresh-track-roots', () => {
  beforeEach(() => {
    track('alpha', ['alpha/001-a', 'alpha/002-gone', 'old-name/004-c'], ['001-a', '003-b']);
    fs.mkdirSync(path.join(specs, 'alpha', 'z_archive', '005-archived'), { recursive: true });
    fs.writeFileSync(path.join(specs, 'alpha', 'notes.md'), 'not a packet\n');
    // Named like a packet, but a file: only directories are packets.
    fs.writeFileSync(path.join(specs, 'alpha', '006-draft.md'), 'not a packet either\n');
    track('beta', ['beta/001-x'], ['001-x']);
    fs.mkdirSync(path.join(specs, 'delta'));
    fs.writeFileSync(path.join(specs, 'delta', 'graph-metadata.json'), '');
    fs.mkdirSync(path.join(specs, '007-root-packet'));
    fs.writeFileSync(path.join(specs, '007-root-packet', 'spec.md'), '# Packet\n');
  });

  it('reports what it would change and writes nothing without --apply', () => {
    const before = fs.readFileSync(path.join(specs, 'alpha', 'graph-metadata.json'), 'utf8');
    const result = run(REFRESH, ['--track', 'alpha']);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('alpha: add 003-b; remove 002-gone, old-name/004-c');
    expect(fs.readFileSync(path.join(specs, 'alpha', 'graph-metadata.json'), 'utf8')).toBe(before);
  });

  it('sets children_ids to the numbered packets on disk and changes nothing else', () => {
    const before = JSON.parse(fs.readFileSync(path.join(specs, 'alpha', 'graph-metadata.json'), 'utf8'));
    const result = run(REFRESH, ['--track', 'alpha', '--apply']);
    expect(result.status, result.stdout + result.stderr).toBe(0);

    const raw = fs.readFileSync(path.join(specs, 'alpha', 'graph-metadata.json'), 'utf8');
    const after = JSON.parse(raw);
    expect(after.children_ids).toEqual(['alpha/001-a', 'alpha/003-b']);
    expect({ ...after, children_ids: before.children_ids }).toEqual(before);
    expect(Object.keys(after)).toEqual(Object.keys(before));
    expect(raw).toBe(`${JSON.stringify(after, null, 2)}\n`);
  });

  it('does not count a numbered folder with no spec.md as a packet', () => {
    // A cloned reference project kept beside the packets, named like one.
    fs.mkdirSync(path.join(specs, 'beta', '008-reference-clone', 'context'), { recursive: true });
    fs.writeFileSync(path.join(specs, 'beta', '008-reference-clone', 'context', 'README.md'), '# clone\n');
    const result = run(REFRESH, ['--track', 'beta', '--apply']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(readChildren('beta')).toEqual(['beta/001-x']);
    commitFixture();
    const fromTree = readWorkingTreeTracks(specs).find((entry: { name: string }) => entry.name === 'beta');
    const fromCommit = readCommitTracks(specs, 'HEAD').tracks.find((entry: { name: string }) => entry.name === 'beta');
    expect(fromTree?.children).toEqual(['001-x']);
    expect(fromCommit?.children).toEqual(['001-x']);
  });

  it('leaves a track that already matches byte for byte', () => {
    const before = fs.readFileSync(path.join(specs, 'beta', 'graph-metadata.json'), 'utf8');
    const result = run(REFRESH, ['--track', 'beta', '--apply']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('beta: up to date');
    expect(fs.readFileSync(path.join(specs, 'beta', 'graph-metadata.json'), 'utf8')).toBe(before);
  });

  it('reports unreadable metadata, writes nothing to it and fails', () => {
    const result = run(REFRESH, ['--apply']);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain('delta: graph-metadata.json is unreadable, not written');
    expect(fs.readFileSync(path.join(specs, 'delta', 'graph-metadata.json'), 'utf8')).toBe('');
    expect(readChildren('alpha')).toEqual(['alpha/001-a', 'alpha/003-b']);
  });

  it('refuses a symlinked sub-track metadata file and preserves its target', () => {
    const { entries } = buildSubtrackTree(repo);
    const metadataPath = path.join(entries.sub, 'graph-metadata.json');
    const outsidePath = path.join(repo, 'outside-sub-metadata.json');
    const outsideMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    outsideMetadata.children_ids = [];
    fs.writeFileSync(outsidePath, `${JSON.stringify(outsideMetadata, null, 2)}\n`);
    fs.unlinkSync(metadataPath);
    fs.symlinkSync(outsidePath, metadataPath);
    const before = fs.readFileSync(outsidePath, 'utf8');

    const result = run(REFRESH, ['--track', 'demo/sub', '--apply']);

    expect({
      status: result.status,
      stdout: result.stdout,
      targetBytes: fs.readFileSync(outsidePath, 'utf8'),
    }).toEqual({
      status: 2,
      stdout: 'demo/sub: graph-metadata.json is a symlink, not written\n',
      targetBytes: before,
    });
  });

  it('refuses a symlinked top-level metadata file and preserves its target', () => {
    buildSubtrackTree(repo);
    const metadataPath = path.join(specs, 'demo', 'graph-metadata.json');
    const outsidePath = path.join(repo, 'outside-track-metadata.json');
    const outsideMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    outsideMetadata.children_ids = [];
    fs.writeFileSync(outsidePath, `${JSON.stringify(outsideMetadata, null, 2)}\n`);
    fs.unlinkSync(metadataPath);
    fs.symlinkSync(outsidePath, metadataPath);
    const before = fs.readFileSync(outsidePath, 'utf8');

    const result = run(REFRESH, ['--track', 'demo', '--apply']);

    expect({
      status: result.status,
      stdout: result.stdout,
      targetBytes: fs.readFileSync(outsidePath, 'utf8'),
    }).toEqual({
      status: 2,
      stdout: 'demo: graph-metadata.json is a symlink, not written\n',
      targetBytes: before,
    });
  });

  it('touches only the track named by --track', () => {
    run(REFRESH, ['--track', 'beta', '--apply']);
    expect(readChildren('alpha')).toEqual(['alpha/001-a', 'alpha/002-gone', 'old-name/004-c']);
  });

  it('refreshes the immediate numbered children of a sub-track', () => {
    buildSubtrackTree(repo, { declared: false });
    const result = run(REFRESH, ['--track', 'demo/sub', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(JSON.parse(fs.readFileSync(path.join(specs, 'demo', 'sub', 'graph-metadata.json'), 'utf8')).children_ids)
      .toEqual(['demo/sub/001-nested-probe']);
    expect(JSON.parse(fs.readFileSync(path.join(specs, 'demo', 'graph-metadata.json'), 'utf8')).children_ids)
      .toEqual([]);
  });

  it('calls missing sub-track metadata missing, not unreadable', () => {
    for (const name of ['alpha', 'beta', 'delta']) {
      fs.rmSync(path.join(specs, name), { recursive: true, force: true });
    }
    const { entries } = buildSubtrackTree(repo);
    fs.unlinkSync(path.join(entries.sub, 'graph-metadata.json'));

    const sweep = run(SWEEP, []);

    expect(sweep.stdout).toContain('demo/sub: declared=? actual=? (graph-metadata.json is missing)');
    expect(sweep.status).not.toBe(0);
  });

  it('seeds missing sub-track metadata so the sweep passes', () => {
    for (const name of ['alpha', 'beta', 'delta']) {
      fs.rmSync(path.join(specs, name), { recursive: true, force: true });
    }
    const { entries } = buildSubtrackTree(repo);
    const metadataPath = path.join(entries.sub, 'graph-metadata.json');
    fs.unlinkSync(metadataPath);

    const refresh = run(REFRESH, ['--track', 'demo/sub', '--apply']);
    const sweep = run(SWEEP, []);
    const metadata = fs.existsSync(metadataPath)
      ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      : null;

    expect({
      refreshStatus: refresh.status,
      refreshStdout: refresh.stdout,
      sweepStatus: sweep.status,
      sweepStdout: sweep.stdout,
      metadata,
    }).toEqual({
      refreshStatus: 0,
      refreshStdout: 'demo/sub: add 001-nested-probe (written)\n',
      sweepStatus: 0,
      sweepStdout: 'demo/linked: symlinked folder skipped, not followed\ndemo/loose: undeclared folder ignored\ndemo: declared=2 actual=2\ndemo/sub: declared=1 actual=1\n\nsweep-track-roots: all track roots match their declared children\n',
      metadata: {
        schema_version: 1,
        packet_id: 'demo/sub',
        spec_folder: 'demo/sub',
        parent_id: 'demo',
        children_ids: ['demo/sub/001-nested-probe'],
        manual: { depends_on: [], supersedes: [], related_to: [] },
        derived: {
          trigger_phrases: [],
          key_topics: ['demo/sub'],
          causal_summary: 'Container folder for demo/sub.',
        },
      },
    });
  });

  it('leaves invalid sub-track metadata unchanged', () => {
    const { entries } = buildSubtrackTree(repo);
    const metadataPath = path.join(entries.sub, 'graph-metadata.json');
    const corrupt = '{"packet_id":"demo/sub","children_ids":[not-json]}\n';
    fs.writeFileSync(metadataPath, corrupt);

    const result = run(REFRESH, ['--track', 'demo/sub', '--apply']);

    expect({
      status: result.status,
      stdout: result.stdout,
      metadataBytes: fs.readFileSync(metadataPath, 'utf8'),
    }).toEqual({
      status: 2,
      stdout: 'demo/sub: graph-metadata.json is unreadable, not written\n',
      metadataBytes: corrupt,
    });
  });

  it('reports a missing sub-track path and exits with usage status', () => {
    buildSubtrackTree(repo);
    const result = run(REFRESH, ['--track', 'demo/missing', '--apply']);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('demo/missing');
  });

  it('leaves the sweep clean once every readable track is refreshed', () => {
    fs.rmSync(path.join(specs, 'delta'), { recursive: true });
    run(REFRESH, ['--apply']);
    const sweep = run(SWEEP, []);
    expect(sweep.status, sweep.stdout).toBe(0);
  });

});

describe('flat-tree refresh compatibility', () => {
  it('keeps flat-tree metadata byte-identical after refresh', () => {
    buildFlatTree(repo);
    const before = ['alpha', 'beta'].map((name) => fs.readFileSync(path.join(specs, name, 'graph-metadata.json'), 'utf8'));
    const result = run(REFRESH, ['--apply']);
    const after = ['alpha', 'beta'].map((name) => fs.readFileSync(path.join(specs, name, 'graph-metadata.json'), 'utf8'));

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(after).toEqual(before);
  });
});

describe('sweep-track-roots with sub-tracks', () => {
  it('reports the undeclared folder and symlink once without changing either view result', () => {
    buildSubtrackTree(repo);
    commitFixture();

    const working = run(SWEEP, []);
    const committed = run(SWEEP, ['--rev', 'HEAD']);
    for (const result of [working, committed]) {
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(result.stdout.match(/demo\/linked: symlinked folder skipped, not followed/g)).toHaveLength(1);
      expect(result.stdout.match(/demo\/loose: undeclared folder ignored/g)).toHaveLength(1);
      expect(result.stdout).toContain('demo/sub: declared=1 actual=1');
    }
    expect(committed.stdout).toBe(working.stdout);
  });

  it('detects drift in a declared sub-track', () => {
    buildSubtrackTree(repo, { declared: false });
    const result = run(SWEEP, []);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('demo: declared=0 actual=2');
    expect(result.stdout).toContain('demo/sub: declared=0 actual=1');
    expect(result.stdout.match(/demo\/linked: symlinked folder skipped, not followed/g)).toHaveLength(1);
    expect(result.stdout.match(/demo\/loose: undeclared folder ignored/g)).toHaveLength(1);
  });
});
