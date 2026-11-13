// ───────────────────────────────────────────────────────────────────
// MODULE: Relocate Packets
// ───────────────────────────────────────────────────────────────────
// The tool moves a packet folder and updates every store that records where
// the packet lives. Each case builds a throwaway repository and runs the real
// script there. The track-root writer is copied because the children list is
// one of the stores under test; the other follow-up writers are replaced with
// no-op stubs, because their own behavior has separate coverage and this suite
// is about the move and the references it leaves behind.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_DIR = path.resolve(__dirname, '..');
const SOURCE_SCRIPT = path.join(CLI_DIR, 'spec', 'relocate.mjs');

let repo: string;
let specs: string;
let relocateScript: string;

beforeEach(() => {
  repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'relocate-')));
  specs = path.join(repo, 'specs');
  fs.mkdirSync(specs, { recursive: true });
  installTools();
  execFileSync('git', ['init', '--quiet'], { cwd: repo });
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function stub(file: string, body: string, mode?: number): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  if (mode !== undefined) fs.chmodSync(file, mode);
}

// The script resolves its helpers from the repository it runs in, so every
// path it spawns must exist below the temporary root.
function installTools(): void {
  const skill = path.join(repo, '.skilled', 'skills', 'system-spec-kit');
  const cli = path.join(skill, 'runtime', 'cli');
  const spec = path.join(cli, 'spec');

  fs.mkdirSync(spec, { recursive: true });
  fs.mkdirSync(path.join(cli, 'lib'), { recursive: true });
  fs.copyFileSync(SOURCE_SCRIPT, path.join(spec, 'relocate.mjs'));
  fs.copyFileSync(path.join(CLI_DIR, 'spec', 'refresh-track-roots.mjs'), path.join(spec, 'refresh-track-roots.mjs'));
  fs.copyFileSync(path.join(CLI_DIR, 'lib', 'track-roots.mjs'), path.join(cli, 'lib', 'track-roots.mjs'));

  stub(path.join(spec, 'repair-derived.cjs'), 'process.exit(0);\n');
  stub(path.join(spec, 'sweep-track-roots.mjs'), 'process.exit(0);\n');
  stub(path.join(spec, 'validate.sh'), '#!/usr/bin/env bash\nprintf "RESULT: PASSED\\n"\nexit 0\n', 0o755);
  stub(path.join(cli, 'graph', 'migrate-generated-json.ts'), 'process.exit(0);\n');
  stub(path.join(cli, 'retrieval', 'generate-trigger-index.mjs'), 'process.exit(0);\n');
  stub(path.join(skill, 'node_modules', 'tsx', 'dist', 'loader.mjs'), 'export {};\n');
  stub(path.join(repo, '.skilled', 'skills', 'sk-doc', 'shared', 'scripts', 'cite-drift-scan.mjs'), 'process.exit(0);\n');

  relocateScript = path.join(spec, 'relocate.mjs');
}

// The host's global ignore list can hide a newly created packet tree, so the
// fixture is force-added and committed. A tracked, clean tree is also what the
// uncommitted-change refusal needs.
function commitFixture(): void {
  execFileSync('git', ['add', '-A', '-f'], { cwd: repo });
  execFileSync(
    'git',
    ['-c', 'commit.gpgsign=false', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.com', 'commit', '--quiet', '--no-verify', '-m', 'fixture'],
    { cwd: repo },
  );
}

function relocate(args: string[]) {
  return spawnSync('node', [relocateScript, ...args], { cwd: repo, encoding: 'utf8' });
}

// The fixture writers emit two metadata documents, and the cases read only a
// handful of fields from whichever one they load. Naming those fields keeps the
// parsed value typed without restating the whole generated document.
interface FixtureMetadata {
  specFolder: string;
  packet_id: string;
  spec_folder: string;
  children_ids: string[];
}

function readJson(relative: string): FixtureMetadata {
  return JSON.parse(fs.readFileSync(path.join(specs, relative), 'utf8')) as FixtureMetadata;
}

function children(relative: string): string[] {
  return readJson(path.join(relative, 'graph-metadata.json')).children_ids;
}

function snapshot(): Map<string, string> {
  const entries = new Map<string, string>();
  const walk = (current: string) => {
    for (const name of fs.readdirSync(current).sort()) {
      if (name === '.git') continue;
      const full = path.join(current, name);
      const relative = path.relative(repo, full);
      const stat = fs.lstatSync(full);
      if (stat.isDirectory()) {
        entries.set(`${relative}/`, 'directory');
        walk(full);
      } else if (stat.isSymbolicLink()) {
        entries.set(relative, `link:${fs.readlinkSync(full)}`);
      } else {
        entries.set(relative, fs.readFileSync(full).toString('base64'));
      }
    }
  };
  walk(repo);
  return entries;
}

function packet(id: string): void {
  const dir = path.join(specs, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'spec.md'), '# Fixture packet\n');
  writeJson(path.join(dir, 'description.json'), {
    level: 'task',
    specFolder: id,
    specId: path.basename(id).slice(0, 3),
    folderSlug: path.basename(id).slice(4),
    description: 'Fixture packet.',
  });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.split('/').slice(0, -1).join('/'),
    children_ids: [],
  });
}

function track(name: string, packets: string[], subtracks: string[] = []): void {
  const dir = path.join(specs, name);
  fs.mkdirSync(dir, { recursive: true });
  writeJson(path.join(dir, 'description.json'), { level: 'track', specFolder: name, description: 'Fixture track.' });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: name,
    spec_folder: name,
    parent_id: null,
    children_ids: [...packets, ...subtracks],
  });
  for (const id of packets) packet(id);
}

function declaredSubtrack(id: string, packets: string[] = []): void {
  const dir = path.join(specs, id);
  fs.mkdirSync(path.join(dir, 'z_archive'), { recursive: true });
  writeJson(path.join(dir, 'description.json'), { level: 'sub-track', specFolder: id, description: 'Fixture sub-track.' });
  writeJson(path.join(dir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.split('/')[0],
    children_ids: packets,
  });
  for (const child of packets) packet(child);
}

function writeMap(entries: Array<{ from: string; to: string }>): string {
  const file = path.join(repo, 'relocate-map.json');
  fs.writeFileSync(file, `${JSON.stringify(entries, null, 2)}\n`);
  return file;
}

describe('relocate move and renumber', () => {
  it('moves a packet into a sub-track and records the new path in both generated files', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();

    const result = relocate(['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'alpha', '001-a'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'alpha', 'sub', '001-a', 'spec.md'))).toBe(true);
    expect(readJson('alpha/sub/001-a/description.json').specFolder).toBe('alpha/sub/001-a');
    const graph = readJson('alpha/sub/001-a/graph-metadata.json');
    expect(graph.packet_id).toBe('alpha/sub/001-a');
    expect(graph.spec_folder).toBe('alpha/sub/001-a');
  });

  it('renumbers a packet into a free number and renames the folder', () => {
    track('beta', ['beta/001-a', 'beta/003-c']);
    commitFixture();

    const result = relocate(['--renumber', 'beta', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'beta', '003-c'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'beta', '002-c', 'spec.md'))).toBe(true);
    expect(readJson('beta/002-c/description.json').specFolder).toBe('beta/002-c');
    const graph = readJson('beta/002-c/graph-metadata.json');
    expect(graph.packet_id).toBe('beta/002-c');
    expect(graph.spec_folder).toBe('beta/002-c');
  });

  // An archived packet still owns its number. Closing the gap it leaves must
  // move the live packet that follows past it rather than onto its number.
  it('renumbers a live packet past a number the archive still holds', () => {
    track('beta', ['beta/001-a', 'beta/002-b', 'beta/005-e']);
    packet('beta/z_archive/003-old');
    commitFixture();

    const result = relocate(['--renumber', 'beta', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'beta', '005-e'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'beta', '003-e'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'beta', '004-e', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'beta', 'z_archive', '003-old', 'spec.md'))).toBe(true);
    expect(readJson('beta/004-e/description.json').specFolder).toBe('beta/004-e');
    const graph = readJson('beta/004-e/graph-metadata.json');
    expect(graph.packet_id).toBe('beta/004-e');
    expect(graph.spec_folder).toBe('beta/004-e');
  });
});

describe('relocate re-parent', () => {
  it('moves a flat track into a declared sub-track and lists the packets there', () => {
    track('gamma', ['gamma/001-a', 'gamma/002-b'], ['gamma/sub']);
    declaredSubtrack('gamma/sub');
    const map = writeMap([
      { from: 'gamma/001-a', to: 'gamma/sub/001-a' },
      { from: 'gamma/002-b', to: 'gamma/sub/002-b' },
    ]);
    commitFixture();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'gamma', '001-a'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'gamma', 'sub', '001-a', 'spec.md'))).toBe(true);
    expect(children('gamma/sub')).toEqual(['gamma/sub/001-a', 'gamma/sub/002-b']);
    expect(children('gamma')).toEqual(['gamma/sub']);
  });
});

describe('relocate refusals', () => {
  it('refuses a destination that already exists and changes nothing', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub', ['alpha/sub/001-a']);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('already exists');
    expect(snapshot()).toEqual(before);
  });

  it('refuses a map that would leave a track with packets and a sub-track', () => {
    track('delta', ['delta/001-a', 'delta/002-b'], ['delta/sub']);
    declaredSubtrack('delta/sub');
    const map = writeMap([{ from: 'delta/001-a', to: 'delta/sub/001-a' }]);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('would hold flat packets');
    expect(snapshot()).toEqual(before);
  });

  it('refuses a destination two sub-track levels deep and changes nothing', () => {
    track('epsilon', ['epsilon/001-a'], ['epsilon/sub']);
    declaredSubtrack('epsilon/sub');
    declaredSubtrack('epsilon/sub/deep');
    commitFixture();
    const before = snapshot();

    const result = relocate(['--from', 'epsilon/001-a', '--to', 'epsilon/sub/deep/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('relocate: refused:');
    expect(snapshot()).toEqual(before);
  });

  it('refuses a destination name that is not NNN-slug and changes nothing', () => {
    track('zeta', ['zeta/001-a'], ['zeta/sub']);
    declaredSubtrack('zeta/sub');
    commitFixture();
    const before = snapshot();

    const result = relocate(['--from', 'zeta/001-a', '--to', 'zeta/sub/not-a-packet', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('is not NNN-slug');
    expect(snapshot()).toEqual(before);
  });

  it('refuses when a path the run would move has uncommitted changes', () => {
    track('eta', ['eta/001-a'], ['eta/sub']);
    declaredSubtrack('eta/sub');
    commitFixture();
    fs.appendFileSync(path.join(specs, 'eta', '001-a', 'spec.md'), '\nuncommitted\n');
    const before = snapshot();

    const result = relocate(['--from', 'eta/001-a', '--to', 'eta/sub/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('uncommitted changes');
    expect(snapshot()).toEqual(before);
  });

  // Two destinations for one source leave no way to tell which move the map
  // meant, so the run stops rather than picking one.
  it('refuses a map that names the same source folder twice and changes nothing', () => {
    track('nu', ['nu/001-a'], ['nu/sub']);
    declaredSubtrack('nu/sub');
    const map = writeMap([
      { from: 'nu/001-a', to: 'nu/sub/001-a' },
      { from: 'nu/001-a', to: 'nu/sub/002-a' },
    ]);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).not.toBe(0);
    expect(result.stderr).toContain('from specs/nu/001-a: named by two entries');
    expect(fs.existsSync(path.join(specs, 'nu', '001-a'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'nu', 'sub', '001-a'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'nu', 'sub', '002-a'))).toBe(false);
    expect(snapshot()).toEqual(before);
  });
});

describe('relocate safety', () => {
  it('reports the plan and exits 1 without --apply, leaving the tree unchanged', () => {
    track('theta', ['theta/001-a'], ['theta/sub']);
    declaredSubtrack('theta/sub');
    commitFixture();
    const before = snapshot();

    const result = relocate(['--from', 'theta/001-a', '--to', 'theta/sub/001-a']);

    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout).toContain('dry run, nothing written');
    expect(snapshot()).toEqual(before);
  });

  it('applies a map once and a second apply exits 0 without changing anything', () => {
    track('iota', ['iota/001-a', 'iota/002-b'], ['iota/sub']);
    declaredSubtrack('iota/sub');
    const map = writeMap([
      { from: 'iota/001-a', to: 'iota/sub/001-a' },
      { from: 'iota/002-b', to: 'iota/sub/002-b' },
    ]);
    commitFixture();

    const first = relocate(['--map', map, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(0);
    const applied = snapshot();

    const second = relocate(['--map', map, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('nothing to do');
    expect(snapshot()).toEqual(applied);
  });

  // An empty map names no move at all. It is a valid plan with nothing left to
  // do, so the run must succeed and leave the checkout exactly as it found it.
  it('treats an empty map as nothing to do', () => {
    track('mu', ['mu/001-a']);
    const map = writeMap([]);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('nothing to do');
    expect(snapshot()).toEqual(before);
  });

  it('rewrites a moved id in another packet without touching a longer id that starts with it', () => {
    track('kappa', ['kappa/001-alpha', 'kappa/001-alpha-two', 'kappa/002-beta']);
    track('lambda', []);
    fs.writeFileSync(path.join(specs, 'kappa', '002-beta', 'notes.md'), 'old: specs/kappa/001-alpha\nlong: specs/kappa/001-alpha-two\n');
    commitFixture();

    const result = relocate(['--from', 'kappa/001-alpha', '--to', 'lambda/001-alpha', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const notes = fs.readFileSync(path.join(specs, 'kappa', '002-beta', 'notes.md'), 'utf8');
    expect(notes).toBe('old: specs/lambda/001-alpha\nlong: specs/kappa/001-alpha-two\n');
    expect(fs.existsSync(path.join(specs, 'kappa', '001-alpha'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'lambda', '001-alpha', 'spec.md'))).toBe(true);
  });
});

describe('relocate declare sub-track', () => {
  it('declares a sub-track on a track that holds no flat packets', () => {
    track('rho', []);
    commitFixture();

    const result = relocate(['--declare-subtrack', 'rho/sub', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const description = readJson('rho/sub/description.json') as FixtureMetadata & { level: string };
    expect(description.level).toBe('sub-track');
    expect(description.specFolder).toBe('rho/sub');
    const graph = readJson('rho/sub/graph-metadata.json');
    expect(graph.packet_id).toBe('rho/sub');
    expect(graph.spec_folder).toBe('rho/sub');
    expect(graph.children_ids).toEqual([]);
    expect(children('rho')).toEqual(['rho/sub']);
    expect(fs.existsSync(path.join(specs, 'rho', 'sub', 'z_archive', '.gitkeep'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'rho', 'sub', 'spec.md'))).toBe(false);
  });

  // A mixed track has no single place to look for a packet, so the declaration
  // is refused instead of splitting the track between two layouts.
  it('refuses to declare a sub-track on a track that holds flat packets', () => {
    track('sigma', ['sigma/001-a']);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--declare-subtrack', 'sigma/sub', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('holds flat packets');
    expect(fs.existsSync(path.join(specs, 'sigma', 'sub'))).toBe(false);
    expect(snapshot()).toEqual(before);
  });
});
