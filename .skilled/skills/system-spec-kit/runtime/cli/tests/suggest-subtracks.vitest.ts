// ───────────────────────────────────────────────────────────────────
// MODULE: Sub-Track Suggestions
// ───────────────────────────────────────────────────────────────────
// The proposal tool only advises, so its printed map is the product: every
// packet in a flat track must land in a proposed sub-track, a thin track must
// be explained instead of mapped, an already grouped track must name the
// declared sub-track a description fits, and a missing track must be rejected.
// The tool also promises to write nothing, which is checked against the whole
// fixture tree. Each case builds its own throwaway tree under the system temp
// directory and runs the real script as a child process, because the argument
// handling and exit codes exist only at that boundary; nothing is written
// inside the repository.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SPEC_DIR = path.resolve(__dirname, '../spec');
const SUGGEST = path.join(SPEC_DIR, 'suggest-subtracks.mjs');

let root: string;
let specs: string;

// Helper functions first: each fixture builder writes only below `root`, so a
// later case cannot inherit state and cleanup has one place to act.
function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeTrack(name: string, children: string[]) {
  const trackDir = path.join(specs, name);
  fs.mkdirSync(trackDir, { recursive: true });
  writeJson(path.join(trackDir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: name,
    spec_folder: name,
    parent_id: null,
    children_ids: children.map((child) => `${name}/${child}`),
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [name], causal_summary: `Track folder for ${name}.` },
  });
  return trackDir;
}

function writePacket(trackDir: string, folder: string, keywords: string[]) {
  const packetDir = path.join(trackDir, folder);
  fs.mkdirSync(packetDir, { recursive: true });
  fs.writeFileSync(path.join(packetDir, 'spec.md'), `# ${folder}\n`);
  writeJson(path.join(packetDir, 'description.json'), { keywords });
}

// A flat track whose words split cleanly in two: the shared words inside each
// group are enough to cluster on, and no word crosses groups, so one merged
// destination would be a real clustering error rather than a naming quirk.
function buildFlatDemo() {
  const folders = [
    '001-alpha-one',
    '002-alpha-two',
    '003-alpha-three',
    '004-alpha-four',
    '005-alpha-five',
    '006-beta-one',
    '007-beta-two',
    '008-beta-three',
    '009-beta-four',
    '010-beta-five',
  ];
  const trackDir = writeTrack('demo', folders);
  folders.forEach((folder, index) => {
    writePacket(trackDir, folder, index < 5 ? ['render', 'window'] : ['cache', 'store']);
  });
  return trackDir;
}

// Six packets is under the default threshold but still enough to form two
// groups, so lowering the threshold must change the answer, not just the text.
function buildSmallDemo() {
  const folders = ['001-one', '002-two', '003-three', '004-four', '005-five', '006-six'];
  const trackDir = writeTrack('demo', folders);
  folders.forEach((folder, index) => {
    writePacket(trackDir, folder, index < 3 ? ['render', 'window'] : ['cache', 'store']);
  });
  return trackDir;
}

// A grouped track is declared by description data on its non-numbered child,
// which is the only thing that makes a folder a sub-track to the shared reader.
function buildGroupedDemo() {
  const subTracks = [
    { folder: 'rendering', keywords: ['render', 'window', 'canvas'] },
    { folder: 'caching', keywords: ['cache', 'store', 'eviction'] },
  ];
  const trackDir = writeTrack('demo', subTracks.map((subTrack) => subTrack.folder));
  for (const subTrack of subTracks) {
    writeJson(path.join(trackDir, subTrack.folder, 'description.json'), {
      level: 'sub-track',
      specFolder: `demo/${subTrack.folder}`,
      description: `Fixture sub-track ${subTrack.folder}.`,
      keywords: subTrack.keywords,
    });
  }
}

function run(...args: string[]) {
  return spawnSync(process.execPath, [SUGGEST, '--specs', specs, ...args], { cwd: root, encoding: 'utf8' });
}

type Mapping = { from: string, to: string };

function readMapping(stdout: string): Mapping[] {
  return JSON.parse(stdout) as Mapping[];
}

// Contents are recorded as well as names: a tool that rewrote a file with the
// same relative name would otherwise pass a listing-only comparison.
function snapshotTree(directory: string, baseDir: string = directory): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
  const snapshot: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    const relative = path.relative(baseDir, entryPath).split(path.sep).join('/');
    if (entry.isDirectory()) {
      snapshot.push(`${relative}/`);
      snapshot.push(...snapshotTree(entryPath, baseDir));
    } else {
      snapshot.push(`${relative}:${fs.readFileSync(entryPath, 'utf8')}`);
    }
  }
  return snapshot;
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'suggest-subtracks-')));
  specs = path.join(root, 'specs');
  fs.mkdirSync(specs);
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('suggest-subtracks', () => {
  it('maps every packet of a flat track to a proposed sub-track', () => {
    const trackDir = buildFlatDemo();
    const folders = fs.readdirSync(trackDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const result = run('--track', 'demo');
    expect(result.status, result.stderr).toBe(0);
    const mapping = readMapping(result.stdout);

    // The map is advice for a person, so it must be complete and parseable:
    // exactly one destination per packet, and each destination sits inside a
    // named sub-track rather than staying flat.
    expect(mapping).toHaveLength(folders.length);
    expect(mapping.map((entry) => entry.from)).toEqual(folders.map((folder) => `demo/${folder}`));
    for (const entry of mapping) {
      expect(entry.to).toMatch(/^demo\/[^/]+\/\d{3}-/);
    }
    const destinations = new Set(mapping.map((entry) => entry.to.split('/').slice(0, 2).join('/')));
    expect(destinations.size).toBe(2);
  });

  it('withholds a map below the threshold and prints one when the threshold drops', () => {
    buildSmallDemo();
    const held = run('--track', 'demo');
    expect(held.status, held.stderr).toBe(0);
    expect(held.stdout).toContain('below the threshold');
    expect(held.stdout).toContain('no map');
    expect(held.stdout).not.toContain('"from"');

    const lowered = run('--track', 'demo', '--threshold', '4');
    expect(lowered.status, lowered.stderr).toBe(0);
    expect(readMapping(lowered.stdout)).toHaveLength(6);
  });

  it('names the best-fitting declared sub-track and says when none fits', () => {
    buildGroupedDemo();
    const fit = run('--track', 'demo', '--describe', 'render window rules');
    expect(fit.status, fit.stderr).toBe(0);
    expect(fit.stdout.trim()).toBe('best fit: demo/rendering');

    // The words share no term with either sub-track, so a score alone must not
    // promote an arbitrary neighbor.
    const unrelated = run('--track', 'demo', '--describe', 'quantum flux');
    expect(unrelated.status, unrelated.stderr).toBe(0);
    expect(unrelated.stdout).toContain('none fits');
    expect(unrelated.stdout).not.toContain('best fit');
  });

  it('rejects a track that does not exist', () => {
    const result = run('--track', 'missing');
    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('track missing does not exist');
  });

  it('leaves every file in the tree unchanged after a proposal', () => {
    buildFlatDemo();
    const before = snapshotTree(root);
    const result = run('--track', 'demo');
    expect(result.status, result.stderr).toBe(0);
    expect(readMapping(result.stdout)).toHaveLength(10);

    // A proposal that also moved or rewrote anything would be a migration, and
    // the tool's stated contract is that a person does the migration later.
    expect(snapshotTree(root)).toEqual(before);
  });
});
