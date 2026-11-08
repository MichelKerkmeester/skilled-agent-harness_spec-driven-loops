// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Track Root Refresh
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// @ts-expect-error -- the reader is a plain ESM module without declaration files.
import { readWorkingTreeTracks } from '../lib/track-roots.mjs';
import { buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

const CLI_DIR = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');

// A track root lists its packets in children_ids, and the pre-push gate blocks a
// commit whose list disagrees with the packets it holds. create.sh --track
// declares the packet it scaffolds, so a new packet never starts out as drift.
let workspace: string;
let fixtureCli: string;
let createScript: string;

beforeEach(() => {
  workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'create-track-refresh-')));
  execFileSync('git', ['init', '--quiet'], { cwd: workspace });
  fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
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

function trackRoot(name: string, children: string[], onDisk: string[]): string {
  const trackPath = path.join(workspace, 'specs', name);
  fs.mkdirSync(trackPath, { recursive: true });
  const metadataPath = path.join(trackPath, 'graph-metadata.json');
  const metadata = { schema_version: 1, packet_id: name, spec_folder: name, parent_id: null, children_ids: children };
  fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  for (const child of onDisk) {
    fs.mkdirSync(path.join(trackPath, child), { recursive: true });
    fs.writeFileSync(path.join(trackPath, child, 'spec.md'), '# Packet\n');
  }
  return metadataPath;
}

function create(args: string[]) {
  return spawnSync('bash', [createScript, '--json', '--skip-branch', ...args], { cwd: workspace, encoding: 'utf8' });
}

function children(metadataPath: string): string[] {
  return JSON.parse(fs.readFileSync(metadataPath, 'utf8')).children_ids;
}

// The recent-packet listing reads each packet's recorded identity, so a test
// packet needs both files before create.sh can see it.
function packetIdentity(track: string, folder: string, daysAgo: number, description: string) {
  const packetPath = path.join(workspace, 'specs', track, folder);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  fs.writeFileSync(
    path.join(packetPath, 'graph-metadata.json'),
    `${JSON.stringify({ schema_version: 1, derived: { created_at: createdAt } }, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(packetPath, 'description.json'),
    `${JSON.stringify({ description }, null, 2)}\n`,
  );
}

describe('create.sh --track refreshes its track root', () => {
  it('declares the new packet and keeps --json stdout a single payload', () => {
    const metadataPath = trackRoot('tools', ['tools/001-first'], ['001-first']);
    const result = create(['--track', 'tools', '--short-name', 'second', 'Second packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
    expect(children(metadataPath)).toEqual(['tools/001-first', 'tools/002-second']);
    expect(result.stderr).toContain('tools: add 002-second (written)');
  });

  it('declares a new phase parent too', () => {
    // Phase mode stops unless the compiled description generator exists; a stub
    // that writes nothing is enough to reach the refresh.
    fs.mkdirSync(path.join(fixtureCli, 'dist', 'spec-folder'), { recursive: true });
    fs.writeFileSync(path.join(fixtureCli, 'dist', 'spec-folder', 'generate-description.js'), '');
    const metadataPath = trackRoot('tools', ['tools/001-first'], ['001-first']);
    const result = create(['--track', 'tools', '--phase', '--phases', '2', '--short-name', 'phased', 'Phased packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(children(metadataPath)).toEqual(['tools/001-first', 'tools/002-phased']);
  });

  it('leaves a track without graph-metadata.json alone', () => {
    const result = create(['--track', 'fresh', '--short-name', 'first', 'First packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(workspace, 'specs', 'fresh', 'graph-metadata.json'))).toBe(false);
    expect(result.stderr).not.toContain('track root refresh skipped');
    expect(result.stderr).not.toContain('was not refreshed');
  });

  it('warns and still scaffolds when the track metadata cannot be read', () => {
    const metadataPath = path.join(workspace, 'specs', 'tools', 'graph-metadata.json');
    fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
    fs.writeFileSync(metadataPath, '');
    const result = create(['--track', 'tools', '--short-name', 'first', 'First packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain('tools/graph-metadata.json was not refreshed');
    expect(fs.readFileSync(metadataPath, 'utf8')).toBe('');
  });

  it('names the writer when it is missing', () => {
    fs.rmSync(path.join(fixtureCli, 'spec', 'refresh-track-roots.mjs'));
    const metadataPath = trackRoot('tools', ['tools/001-first'], ['001-first']);
    const result = create(['--track', 'tools', '--short-name', 'second', 'Second packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain('track root refresh skipped');
    expect(result.stderr).toContain('refresh-track-roots.mjs is missing');
    expect(children(metadataPath)).toEqual(['tools/001-first']);
  });

  it('touches no track when --track is absent', () => {
    const metadataPath = trackRoot('tools', ['tools/001-first'], ['001-first', '002-undeclared']);
    const before = fs.readFileSync(metadataPath, 'utf8');
    const result = create(['--short-name', 'root-packet', 'Root packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(fs.readFileSync(metadataPath, 'utf8')).toBe(before);
  });
});

// A declared sub-track is a container like a track root, so a packet scaffolded
// into it is declared at two levels: the sub-track lists the new packet, and the
// track keeps listing only the sub-track itself.
describe('create.sh --track refreshes a declared sub-track and its track', () => {
  it('numbers inside the sub-track and declares the packet at both levels', () => {
    const { specs } = buildSubtrackTree(workspace);
    const result = create(['--track', 'demo/sub', '--short-name', 'second-probe', 'Second nested packet']);
    expect(result.status, result.stderr).toBe(0);
    expect(() => JSON.parse(result.stdout)).not.toThrow();

    const folders = fs.readdirSync(path.join(specs, 'demo', 'sub'))
      .filter((name) => /^\d{3}-/.test(name))
      .sort();
    expect(folders).toEqual(['001-nested-probe', '002-second-probe']);

    expect(children(path.join(specs, 'demo', 'sub', 'graph-metadata.json')))
      .toEqual(['demo/sub/001-nested-probe', 'demo/sub/002-second-probe']);

    const trackMetadata = path.join(specs, 'demo', 'graph-metadata.json');
    expect(children(trackMetadata)).toEqual(['demo/001-flat-probe', 'demo/sub']);
    expect(children(trackMetadata).filter((entry) => entry === 'demo/sub')).toHaveLength(1);
    expect(children(trackMetadata)).not.toContain('demo/sub/002-second-probe');
  });

  it('normalizes a trailing slash before refreshing both roots', () => {
    const { specs } = buildSubtrackTree(workspace);
    const result = create(['--track', 'demo/sub/', '--short-name', 'slash-probe', 'Slash probe']);
    expect(result.status, result.stderr).toBe(0);

    expect(children(path.join(specs, 'demo', 'sub', 'graph-metadata.json')))
      .toEqual(['demo/sub/001-nested-probe', 'demo/sub/002-slash-probe']);

    const trackMetadata = path.join(specs, 'demo', 'graph-metadata.json');
    expect(children(trackMetadata)).toEqual(['demo/001-flat-probe', 'demo/sub']);
    expect(children(trackMetadata).filter((entry) => entry === 'demo/sub')).toHaveLength(1);
    expect(result.stderr).not.toContain('was not refreshed');
  });

  it('seeds missing metadata while scaffolding in the declared sub-track and keeps the sweep clean', () => {
    const { specs } = buildSubtrackTree(workspace);
    const subMetadata = path.join(specs, 'demo', 'sub', 'graph-metadata.json');
    fs.rmSync(subMetadata);

    const result = create(['--track', 'demo/sub', '--short-name', 'no-metadata-probe', 'No metadata probe']);
    const sweep = spawnSync(
      process.execPath,
      [path.join(CLI_DIR, 'spec', 'sweep-track-roots.mjs'), '--specs', specs],
      { cwd: workspace, encoding: 'utf8' },
    );
    const hasSubMetadata = fs.existsSync(subMetadata);
    const subChildren = hasSubMetadata ? children(subMetadata) : null;

    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'demo', 'sub', '002-no-metadata-probe', 'spec.md'))).toBe(true);
    expect(result.stderr).not.toContain('was not refreshed');
    expect(hasSubMetadata).toBe(true);
    expect(subChildren).toEqual(['demo/sub/001-nested-probe', 'demo/sub/002-no-metadata-probe']);
    expect(sweep.status, sweep.stdout + sweep.stderr).toBe(0);
    expect(sweep.stdout).toContain('sweep-track-roots: all track roots match their declared children');
  });

  it('reports missing sub-track metadata as a pending dry-run change and names --apply as the creation path', () => {
    const { specs } = buildSubtrackTree(workspace);
    const subMetadata = path.join(specs, 'demo', 'sub', 'graph-metadata.json');
    fs.rmSync(subMetadata);
    const refreshScript = path.join(fixtureCli, 'spec', 'refresh-track-roots.mjs');

    const result = spawnSync(process.execPath, [refreshScript, '--specs', specs, '--track', 'demo/sub'], {
      cwd: workspace,
      encoding: 'utf8',
    });

    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout).toContain('demo/sub: graph-metadata.json is missing, not written; pass --apply to create it');
    expect(fs.existsSync(subMetadata)).toBe(false);
  });

  it('warns when the sub-track metadata cannot be refreshed and leaves it unchanged', () => {
    const { specs } = buildSubtrackTree(workspace);
    const subMetadata = path.join(specs, 'demo', 'sub', 'graph-metadata.json');
    fs.writeFileSync(subMetadata, '{ not json');

    const result = create(['--track', 'demo/sub', '--short-name', 'broken-metadata-probe', 'Broken metadata probe']);

    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'demo', 'sub', '002-broken-metadata-probe', 'spec.md'))).toBe(true);
    expect(result.stderr).toContain('demo/sub/graph-metadata.json was not refreshed');
    expect(fs.readFileSync(subMetadata, 'utf8')).toBe('{ not json');
  });

  it('refuses an undeclared sub-track before writing a packet', () => {
    const { specs } = buildSubtrackTree(workspace);
    const loose = path.join(specs, 'demo', 'loose');
    const trackMetadata = path.join(specs, 'demo', 'graph-metadata.json');
    const looseBefore = fs.readdirSync(loose).sort();
    const trackMetadataBefore = fs.readFileSync(trackMetadata, 'utf8');

    const result = create(['--track', 'demo/loose/', '--short-name', 'loose-probe', 'Loose packet']);

    expect(result.status, result.stderr).not.toBe(0);
    expect(result.stderr).toContain("--track 'demo/loose/' refused");
    expect(result.stderr).toContain('demo/loose: undeclared folder ignored');
    expect(fs.readdirSync(loose).sort()).toEqual(looseBefore);
    expect(fs.readFileSync(trackMetadata, 'utf8')).toBe(trackMetadataBefore);
  });

  it('refreshes a flat track when --track has a trailing slash', () => {
    const { specs } = buildSubtrackTree(workspace);
    const trackMetadata = path.join(specs, 'demo', 'graph-metadata.json');
    const result = create(['--track', 'demo/', '--short-name', 'flat-slash-probe', 'Flat slash probe']);

    expect(result.status, result.stderr).toBe(0);
    expect(children(trackMetadata)).toContain('demo/002-flat-slash-probe');
    expect(children(trackMetadata).filter((entry) => entry === 'demo/sub')).toHaveLength(1);
    expect(result.stderr).not.toContain('was not refreshed');
  });
});

describe('create.sh refuses sub-track values the reader skips', () => {
  it('reports the reader diagnostic when a declared sub-track owns spec.md', () => {
    const { specs } = buildSubtrackTree(workspace);
    const subtrack = path.join(specs, 'demo', 'sub');
    fs.writeFileSync(path.join(subtrack, 'spec.md'), '# Not a container\n');
    const diagnostics = (readWorkingTreeTracks(specs) as Array<{ name: string }> & { diagnostics: string[] })
      .diagnostics;
    const expectedDiagnostic = diagnostics.find((diagnostic) => diagnostic.startsWith('demo/sub:'));

    const result = create(['--track', 'demo/sub', '--short-name', 'owned-spec-probe', 'Owned spec probe']);

    expect(result.status, result.stderr).not.toBe(0);
    expect(expectedDiagnostic).toBe('demo/sub: declared folder has spec.md and cannot be a sub-track');
    expect(result.stderr).toContain(expectedDiagnostic);
    expect(fs.existsSync(path.join(subtrack, '002-owned-spec-probe', 'spec.md'))).toBe(false);
  });

  it('refuses a symlinked sub-track before writing through it', () => {
    const { entries } = buildSubtrackTree(workspace);
    const target = fs.realpathSync(entries.linked);
    const before = fs.readdirSync(target).sort();

    const result = create(['--track', 'demo/linked', '--short-name', 'linked-probe', 'Linked probe']);

    expect(result.status, result.stderr).not.toBe(0);
    expect(result.stderr).toContain('demo/linked: symlinked folder skipped, not followed');
    expect(fs.readdirSync(target).sort()).toEqual(before);
  });

  it('refuses a track with three path segments before creating specs/a', () => {
    const result = create(['--track', 'a/b/c', '--short-name', 'deep-probe', 'Deep probe']);

    expect(result.status, result.stderr).not.toBe(0);
    expect(result.stderr).toContain('has more than two path segments');
    expect(fs.existsSync(path.join(workspace, 'specs', 'a'))).toBe(false);
  });
});

// The track value can name two segments, but it still may not climb out of
// specs/ or carry an empty segment.
describe('create.sh still refuses an invalid --track', () => {
  const refused: Array<[string, () => string]> = [
    ['a parent segment', () => '..'],
    ['an absolute path', () => path.join(workspace, 'absolute-track')],
    ['an empty segment', () => 'demo//sub'],
  ];

  for (const [label, value] of refused) {
    it(`refuses ${label} before any folder is made`, () => {
      const result = create(['--track', value(), '--short-name', 'probe', 'Probe packet']);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--track');
      expect(fs.existsSync(path.join(workspace, 'specs'))).toBe(false);
    });
  }
});

// A new top-level packet is the moment to notice a recent sibling that already
// covers the same artifact, so create.sh names the recent packets in the root
// it is writing to. Phase children never pass through resolve_branch_name.
describe('create.sh lists recent sibling packets', () => {
  it('names a recent packet on stderr and keeps --json stdout parseable', () => {
    trackRoot('tools', ['tools/001-first'], ['001-first']);
    packetIdentity('tools', '001-first', 0, 'First recent packet');

    const result = create(['--track', 'tools', '--short-name', 'second', 'Second packet']);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain('[speckit] Recent packets in specs/tools, last 14 days:');
    expect(result.stderr).toMatch(/^  001-first  \d{4}-\d{2}-\d{2}  First recent packet$/mu);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it('names nothing when a phase child is appended to an existing parent', () => {
    trackRoot('tools', ['tools/001-first'], ['001-first']);
    packetIdentity('tools', '001-first', 0, 'First recent packet');

    const result = create([
      '--track', 'tools', '--phase', '--parent', 'specs/tools/001-first',
      '--phases', '1', '--phase-names', 'next-step', 'Next phase',
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).not.toContain('Recent packets');
  });

  it('leaves out a packet older than the 14-day window', () => {
    trackRoot('tools', ['tools/001-old'], ['001-old']);
    packetIdentity('tools', '001-old', 30, 'Old packet');

    const result = create(['--track', 'tools', '--short-name', 'second', 'Second packet']);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).not.toContain('Recent packets');
    expect(result.stderr).not.toContain('001-old');
  });

  it('strips terminal control characters from a recent packet description', () => {
    trackRoot('tools', ['tools/001-first'], ['001-first']);
    packetIdentity('tools', '001-first', 0, '\u001b[31mred\u001b[0m');

    const result = create(['--track', 'tools', '--short-name', 'second', 'Second packet']);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain('red');
    expect(result.stderr).not.toContain('\u001b');
  });

  it('lists nothing for a versioned sub-folder run in an existing packet', () => {
    trackRoot('tools', ['tools/001-first'], ['001-first']);
    packetIdentity('tools', '001-first', 0, 'First recent packet');

    const result = create([
      '--subfolder', 'specs/tools/001-first',
      '--topic', 'refactor', 'Refactor the first packet',
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).not.toContain('[speckit] Recent packets');
  });
});
