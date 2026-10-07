// ───────────────────────────────────────────────────────────────────
// MODULE: Create.sh Track Root Refresh
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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
