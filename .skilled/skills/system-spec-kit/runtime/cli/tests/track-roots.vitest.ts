// ───────────────────────────────────────────────────────────────────
// TEST: Track Root Sweep and Refresh
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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

  it('touches only the track named by --track', () => {
    run(REFRESH, ['--track', 'beta', '--apply']);
    expect(readChildren('alpha')).toEqual(['alpha/001-a', 'alpha/002-gone', 'old-name/004-c']);
  });

  it('leaves the sweep clean once every readable track is refreshed', () => {
    fs.rmSync(path.join(specs, 'delta'), { recursive: true });
    run(REFRESH, ['--apply']);
    const sweep = run(SWEEP, []);
    expect(sweep.status, sweep.stdout).toBe(0);
  });
});
