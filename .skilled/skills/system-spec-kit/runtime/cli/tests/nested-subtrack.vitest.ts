// ───────────────────────────────────────────────────────────────────
// MODULE: Nested Sub-Tracks
// ───────────────────────────────────────────────────────────────────
// A track may hold two levels of declared sub-tracks and no more. Every tool
// that reads a sub-track is run against one tree that holds both levels and a
// declared folder one level too deep:
//
//   <specs>/mcp/                                track root
//   <specs>/mcp/browser/001-hub/                level-1 sub-track and its packet
//   <specs>/mcp/tooling/                        level-1 sub-track holding sub-tracks
//   <specs>/mcp/tooling/clickup/001-figma/      level-2 sub-track and its packet
//   <specs>/mcp/tooling/clickup/deeper/001-x/   declared folder past the limit

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { refreshGraphMetadataForSpecFolder } from '../../api';
// @ts-expect-error -- the reader is a plain ESM module without declaration files.
import { readCommitTracks, readWorkingTreeTracks } from '../lib/track-roots.mjs';

interface TrackEntry {
  name: string;
  children: string[];
  diagnostics?: string[];
}

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_DIR = path.resolve(TEST_DIR, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');
const REPO_ROOT = path.resolve(TEST_DIR, '../../../../../..');
const VALIDATE_SCRIPT = path.join(CLI_DIR, 'spec', 'validate.sh');
const SWEEP_SCRIPT = path.join(CLI_DIR, 'spec', 'sweep-track-roots.mjs');
const REFRESH_SCRIPT = path.join(CLI_DIR, 'spec', 'refresh-track-roots.mjs');
const TOO_DEEP = 'mcp/tooling/clickup/deeper: declared sub-track nested past two sub-track levels, not read';
const SUB_TRACK_MESSAGE = 'Sub-track directory, not a packet; no packet rules apply';

let root: string;
let specs: string;

/* ───────────────────────────────────────────────────────────────
   1. FIXTURE
──────────────────────────────────────────────────────────────── */

function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
}

function container(id: string, level: string, children: string[]): string {
  const dir = path.join(specs, ...id.split('/'));
  writeJson(path.join(dir, 'description.json'), { level, specFolder: id, description: `Fixture ${level} ${id}.` });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.includes('/') ? id.split('/').slice(0, -1).join('/') : null,
    children_ids: children,
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [id], causal_summary: `Container folder for ${id}.` },
  });
  if (level === 'sub-track') {
    fs.mkdirSync(path.join(dir, 'z_archive'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'z_archive', '.gitkeep'), '');
  }
  return dir;
}

function packet(id: string): string {
  const dir = path.join(specs, ...id.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), '# Fixture packet\n');
  fs.writeFileSync(path.join(dir, 'plan.md'), '# Plan\n');
  fs.writeFileSync(path.join(dir, 'tasks.md'), '# Tasks\n');
  writeJson(path.join(dir, 'description.json'), { level: 1, specFolder: id, title: 'Fixture packet' });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    // Left unset so a derived parent is what a test reads, never a stored one.
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: [id],
      key_topics: [id],
      importance_tier: 'normal',
      status: 'planned',
      key_files: [],
      entities: [],
      causal_summary: `Fixture packet ${id}.`,
      created_at: new Date(0).toISOString(),
      last_save_at: new Date(0).toISOString(),
      save_lineage: 'graph_only',
      last_accessed_at: null,
      source_docs: ['spec.md'],
      last_active_child_id: null,
      last_active_at: null,
    },
  });
  return dir;
}

function buildNestedTree(): void {
  container('mcp', 'track', ['mcp/browser', 'mcp/tooling']);
  container('mcp/browser', 'sub-track', ['mcp/browser/001-hub']);
  packet('mcp/browser/001-hub');
  container('mcp/tooling', 'sub-track', ['mcp/tooling/clickup']);
  container('mcp/tooling/clickup', 'sub-track', ['mcp/tooling/clickup/001-figma']);
  packet('mcp/tooling/clickup/001-figma');
  container('mcp/tooling/clickup/deeper', 'sub-track', ['mcp/tooling/clickup/deeper/001-x']);
  packet('mcp/tooling/clickup/deeper/001-x');
}

function commitAll(cwd: string): void {
  execFileSync('git', ['add', '-A', '-f'], { cwd });
  execFileSync(
    'git',
    ['-c', 'commit.gpgsign=false', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.com', 'commit', '--quiet', '--no-verify', '-m', 'fixture'],
    { cwd },
  );
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv = process.env): RunResult {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

// create.sh and archive.sh resolve their libraries and templates from where they
// sit, so they run from a copy inside the temporary repository.
function installCliTools(): { create: string; archive: string } {
  const fixtureCli = path.join(root, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const directory of ['spec', 'lib', 'templates']) fs.mkdirSync(path.join(fixtureCli, directory), { recursive: true });
  for (const script of ['create.sh', 'archive.sh', 'refresh-track-roots.mjs']) {
    fs.copyFileSync(path.join(CLI_DIR, 'spec', script), path.join(fixtureCli, 'spec', script));
  }
  for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh', 'track-roots.mjs']) {
    fs.copyFileSync(path.join(CLI_DIR, 'lib', library), path.join(fixtureCli, 'lib', library));
  }
  fs.copyFileSync(path.join(CLI_DIR, 'templates', 'inline-gate-renderer.sh'), path.join(fixtureCli, 'templates', 'inline-gate-renderer.sh'));
  fs.cpSync(path.join(SKILL_ROOT, 'templates'), path.join(root, '.skilled', 'skills', 'system-spec-kit', 'templates'), { recursive: true });
  return { create: path.join(fixtureCli, 'spec', 'create.sh'), archive: path.join(fixtureCli, 'spec', 'archive.sh') };
}

function validate(folder: string, recursive: boolean): RunResult {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ['SPECKIT_SKIP_VALIDATION', 'SPECKIT_VALIDATION', 'SPECKIT_JSON', 'SPECKIT_QUIET']) delete env[key];
  Object.assign(env, { HOOK_FLAGS_CONFIG: path.join(root, 'absent-hook-flags.env'), SPECKIT_RULES: 'FILE_EXISTS' });
  return run('bash', [VALIDATE_SCRIPT, folder, ...(recursive ? ['--recursive'] : ['--no-recursive']), '--json'], env);
}

function recognisedAsSubTrack(folder: string): boolean {
  const first = JSON.parse(validate(folder, false).stdout.split('\n')[0] || '{}') as {
    entries?: Array<{ rule: string; message: string }>;
  };
  return first.entries?.some((item) => item.rule === 'TRACK_ROOT' && item.message === SUB_TRACK_MESSAGE) ?? false;
}

function children(id: string): string[] {
  return readJson(path.join(specs, ...id.split('/'), 'graph-metadata.json')).children_ids as string[];
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'nested-subtrack-')));
  specs = path.join(root, 'specs');
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  buildNestedTree();
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

/* ───────────────────────────────────────────────────────────────
   2. READER AND SWEEP
──────────────────────────────────────────────────────────────── */

describe('track reader with two sub-track levels', () => {
  it('lists a level-2 sub-track under its level-1 parent and refuses the third level', () => {
    const tracks = readWorkingTreeTracks(specs) as TrackEntry[] & { diagnostics: string[] };
    const byName = new Map(tracks.map((track) => [track.name, track.children]));

    expect([...byName.keys()]).toEqual(['mcp', 'mcp/browser', 'mcp/tooling', 'mcp/tooling/clickup']);
    expect(byName.get('mcp')).toEqual(['browser', 'tooling']);
    expect(byName.get('mcp/tooling')).toEqual(['clickup']);
    expect(byName.get('mcp/tooling/clickup')).toEqual(['001-figma']);
    expect(tracks.diagnostics).toEqual([TOO_DEEP]);
  });

  it('reads the same tracks and diagnostics from a commit', () => {
    commitAll(root);
    const working = readWorkingTreeTracks(specs) as TrackEntry[] & { diagnostics: string[] };
    const commit = readCommitTracks(specs, 'HEAD') as { tracks: TrackEntry[]; diagnostics: string[] };

    expect(commit.tracks.map((track) => [track.name, track.children])).toEqual(working.map((track) => [track.name, track.children]));
    expect(commit.diagnostics).toEqual(working.diagnostics);
  });

  it('sweeps the two-level tree clean and reports a mixed level-1 sub-track', () => {
    const clean = run('node', [SWEEP_SCRIPT, '--specs', specs]);
    expect(clean.status, clean.stdout).toBe(0);
    expect(clean.stdout).toContain('mcp/tooling/clickup: declared=1 actual=1');
    expect(clean.stdout).toContain(TOO_DEEP);

    packet('mcp/tooling/001-flat');
    const mixed = run('node', [SWEEP_SCRIPT, '--specs', specs]);
    expect(mixed.status).toBe(1);
    expect(mixed.stdout).toContain('flat packets beside sub-tracks: 001-flat');
  });

  it('seeds a level-2 sub-track record whose parent is its level-1 sub-track', () => {
    const metadata = path.join(specs, 'mcp', 'tooling', 'clickup', 'graph-metadata.json');
    fs.rmSync(metadata);

    const result = run('node', [REFRESH_SCRIPT, '--specs', specs, '--track', 'mcp/tooling/clickup', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const seeded = readJson(metadata);
    expect(seeded.parent_id).toBe('mcp/tooling');
    expect(seeded.children_ids).toEqual(['mcp/tooling/clickup/001-figma']);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. CREATE, VALIDATE, PARENT DERIVATION AND ARCHIVE
──────────────────────────────────────────────────────────────── */

describe('packet tools with two sub-track levels', () => {
  it('creates a packet in a level-2 sub-track and refreshes both sub-track records', () => {
    const { create } = installCliTools();

    const result = run('bash', [create, '--json', '--skip-branch', '--track', 'mcp/tooling/clickup', '--short-name', 'linear-probe', 'Linear probe']);

    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'mcp', 'tooling', 'clickup', '002-linear-probe', 'spec.md'))).toBe(true);
    expect(children('mcp/tooling/clickup')).toEqual(['mcp/tooling/clickup/001-figma', 'mcp/tooling/clickup/002-linear-probe']);
    expect(children('mcp/tooling')).toEqual(['mcp/tooling/clickup']);
  });

  it('refuses a third sub-track level and an undeclared second level before writing', () => {
    const { create } = installCliTools();

    const deep = run('bash', [create, '--skip-branch', '--track', 'mcp/tooling/clickup/deeper', '--short-name', 'deep-probe', 'Deep probe']);
    expect(deep.status).toBe(1);
    expect(deep.stderr).toContain('has more than three path segments');
    expect(fs.readdirSync(path.join(specs, 'mcp', 'tooling', 'clickup', 'deeper')).sort()).toEqual(['001-x', 'description.json', 'graph-metadata.json', 'z_archive']);

    const undeclared = run('bash', [create, '--skip-branch', '--track', 'mcp/tooling/missing', '--short-name', 'missing-probe', 'Missing probe']);
    expect(undeclared.status).toBe(1);
    expect(undeclared.stderr).toContain('mcp/tooling/missing: no such folder');
    expect(fs.existsSync(path.join(specs, 'mcp', 'tooling', 'missing'))).toBe(false);
  });

  it('classifies a level-2 sub-track as a sub-track, never the third level, and recurses into it', () => {
    expect(recognisedAsSubTrack(path.join(specs, 'mcp', 'tooling'))).toBe(true);
    expect(recognisedAsSubTrack(path.join(specs, 'mcp', 'tooling', 'clickup'))).toBe(true);
    expect(recognisedAsSubTrack(path.join(specs, 'mcp', 'tooling', 'clickup', 'deeper'))).toBe(false);

    const recursive = validate(path.join(specs, 'mcp'), true);
    expect(recursive.stdout).toContain(path.join(specs, 'mcp', 'tooling', 'clickup', '001-figma'));
    expect(recursive.stdout).not.toContain(path.join(specs, 'mcp', 'tooling', 'clickup', 'deeper', '001-x'));
  });

  it('derives the level-2 sub-track as the parent of its packet in the graph and in repair', () => {
    // The graph writer writes only under a configured specs root, and the
    // .opencode/specs spelling is one, so the graph copy of the tree sits there.
    const repairSpecs = specs;
    specs = path.join(root, '.opencode', 'specs');
    buildNestedTree();
    expect(refreshGraphMetadataForSpecFolder(path.join(specs, 'mcp', 'tooling', 'clickup', '001-figma')).metadata.parent_id)
      .toBe('mcp/tooling/clickup');
    expect(refreshGraphMetadataForSpecFolder(path.join(specs, 'mcp', 'tooling', 'clickup', 'deeper', '001-x')).metadata.parent_id)
      .toBeNull();
    specs = repairSpecs;

    fs.symlinkSync(path.join(REPO_ROOT, '.skilled'), path.join(root, '.skilled'), 'dir');
    const graphPath = path.join(specs, 'mcp', 'tooling', 'clickup', '001-figma', 'graph-metadata.json');
    writeJson(graphPath, { ...readJson(graphPath), parent_id: 'legacy-parent' });
    const repair = run(process.execPath, [
      path.join(root, '.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs'),
      '--folder',
      'specs/mcp/tooling/clickup/001-figma',
    ], { ...process.env, SPECKIT_RULES: 'METADATA_DISK_PATH_CONSISTENCY' });
    expect(repair.stdout).toContain('graph parent legacy-parent -> mcp/tooling/clickup');
  });

  it('archives a packet into the level-2 sub-track archive and drops it from that list', () => {
    const { archive } = installCliTools();

    const result = run('bash', [archive, '--force', 'specs/mcp/tooling/clickup/001-figma']);

    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'mcp', 'tooling', 'clickup', 'z_archive', '001-figma', 'spec.md'))).toBe(true);
    expect(children('mcp/tooling/clickup')).toEqual([]);
    expect(children('mcp/tooling')).toEqual(['mcp/tooling/clickup']);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. RELOCATION
──────────────────────────────────────────────────────────────── */

describe('relocation with two sub-track levels', () => {
  // Only the track-root writer is real here: it owns the children lists under
  // test. The other follow-up writers have their own coverage, so they are stubs.
  function installRelocate(): string {
    const skill = path.join(root, '.skilled', 'skills', 'system-spec-kit');
    const cli = path.join(skill, 'runtime', 'cli');
    const stub = (file: string, body: string, mode?: number) => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, body);
      if (mode !== undefined) fs.chmodSync(file, mode);
    };
    fs.mkdirSync(path.join(cli, 'spec'), { recursive: true });
    fs.mkdirSync(path.join(cli, 'lib'), { recursive: true });
    fs.copyFileSync(path.join(CLI_DIR, 'spec', 'relocate.mjs'), path.join(cli, 'spec', 'relocate.mjs'));
    fs.copyFileSync(REFRESH_SCRIPT, path.join(cli, 'spec', 'refresh-track-roots.mjs'));
    fs.copyFileSync(path.join(CLI_DIR, 'lib', 'track-roots.mjs'), path.join(cli, 'lib', 'track-roots.mjs'));
    stub(path.join(cli, 'spec', 'repair-derived.cjs'), 'process.exit(0);\n');
    stub(path.join(cli, 'spec', 'sweep-track-roots.mjs'), 'process.exit(0);\n');
    stub(path.join(cli, 'spec', 'validate.sh'), '#!/usr/bin/env bash\nprintf "RESULT: PASSED\\n"\nexit 0\n', 0o755);
    stub(path.join(cli, 'graph', 'migrate-generated-json.ts'), 'process.exit(0);\n');
    stub(path.join(cli, 'retrieval', 'generate-trigger-index.mjs'), 'process.exit(0);\n');
    stub(path.join(skill, 'node_modules', 'tsx', 'dist', 'loader.mjs'), 'export {};\n');
    stub(path.join(root, '.skilled', 'skills', 'sk-doc', 'shared', 'scripts', 'cite-drift-scan.mjs'), 'process.exit(0);\n');
    return path.join(cli, 'spec', 'relocate.mjs');
  }

  it('moves a packet into an existing level-2 sub-track and updates both lists', () => {
    const relocate = installRelocate();
    packet('mcp/browser/002-move-me');
    container('mcp/browser', 'sub-track', ['mcp/browser/001-hub', 'mcp/browser/002-move-me']);
    commitAll(root);

    const result = run('node', [relocate, '--from', 'mcp/browser/002-move-me', '--to', 'mcp/tooling/clickup/002-move-me', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'mcp', 'tooling', 'clickup', '002-move-me', 'spec.md'))).toBe(true);
    expect(children('mcp/browser')).toEqual(['mcp/browser/001-hub']);
    expect(children('mcp/tooling/clickup')).toEqual(['mcp/tooling/clickup/001-figma', 'mcp/tooling/clickup/002-move-me']);
  });

  it('refuses a destination three sub-track levels deep and a declaration past the limit', () => {
    const relocate = installRelocate();
    commitAll(root);

    const move = run('node', [relocate, '--from', 'mcp/browser/001-hub', '--to', 'mcp/tooling/clickup/deeper/002-hub']);
    expect(move.status).toBe(2);
    expect(move.stderr).toContain('deeper than two sub-track levels');

    const declare = run('node', [relocate, '--declare-subtrack', 'mcp/tooling/clickup/more']);
    expect(declare.status).toBe(2);
    expect(declare.stderr).toContain('deeper than two sub-track levels');
  });

  it('declares a level-2 sub-track inside a declared level-1 one', () => {
    const relocate = installRelocate();
    commitAll(root);

    const result = run('node', [relocate, '--declare-subtrack', 'mcp/tooling/figma', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const description = readJson(path.join(specs, 'mcp', 'tooling', 'figma', 'description.json'));
    expect(description.level).toBe('sub-track');
    expect(description.specFolder).toBe('mcp/tooling/figma');
    expect(description.parentChain).toEqual(['mcp', 'tooling']);
    expect(readJson(path.join(specs, 'mcp', 'tooling', 'figma', 'graph-metadata.json')).parent_id).toBe('mcp/tooling');
    expect(children('mcp/tooling')).toEqual(['mcp/tooling/clickup', 'mcp/tooling/figma']);
  });
});
