// ───────────────────────────────────────────────────────────────────
// MODULE: Sub-Track Predicate Parity
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { refreshGraphMetadataForSpecFolder } from '../../api';
// @ts-expect-error -- the reader is a plain ESM module without declaration files.
import { readWorkingTreeTracks } from '../lib/track-roots.mjs';
// @ts-expect-error -- the fixture builder is plain ESM without declaration files.
import { buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

interface MatrixEntry {
  name: string;
  packetName: string;
  packetFolder: string;
  containerFolder: string;
}

interface SubtrackTree {
  specs: string;
  entries: MatrixEntry[];
}

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_DIR = path.resolve(TEST_DIR, '..');
const SKILL_ROOT = path.resolve(CLI_DIR, '../..');
const REPO_ROOT = path.resolve(TEST_DIR, '../../../../../..');
const VALIDATE_SCRIPT = path.join(CLI_DIR, 'spec', 'validate.sh');
const MATRIX_NAMES = [
  'sub',
  '001-odd',
  '001_odd',
  '.hidden',
  'node_modules',
  'z_old',
  'linked-description',
  'linked-folder',
  'owns-spec',
] as const;

let root: string;
let specs: string;
let createScript: string;
let archiveScript: string;
let matrix: SubtrackTree;

function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeContainer(folder: string, id: string, children: string[]): void {
  writeJson(path.join(folder, 'description.json'), {
    level: 'sub-track',
    specFolder: id,
    description: `Fixture sub-track ${id}.`,
  });
  writeJson(path.join(folder, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.split('/').slice(0, -1).join('/') || null,
    children_ids: children,
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { trigger_phrases: [], key_topics: [id], causal_summary: `Container ${id}.` },
  });
}

function writePacket(folder: string, specFolder: string): void {
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'spec.md'), '# Matrix packet\n');
  fs.writeFileSync(path.join(folder, 'plan.md'), '# Plan\n');
  fs.writeFileSync(path.join(folder, 'tasks.md'), '# Tasks\n');
  writeJson(path.join(folder, 'description.json'), {
    level: 1,
    specFolder,
    title: 'Matrix packet',
  });
  writeJson(path.join(folder, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: specFolder,
    spec_folder: specFolder,
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: [specFolder],
      key_topics: [specFolder],
      importance_tier: 'normal',
      status: 'planned',
      key_files: [],
      entities: [],
      causal_summary: `Matrix packet ${specFolder}.`,
      created_at: new Date(0).toISOString(),
      last_save_at: new Date(0).toISOString(),
      save_lineage: 'graph_only',
      last_accessed_at: null,
      source_docs: ['spec.md'],
      last_active_child_id: null,
      last_active_at: null,
    },
  });
}

function buildMatrix(rootPath: string): SubtrackTree {
  const tree = buildSubtrackTree(rootPath) as { specs: string; entries: Record<string, string> };
  const entries: MatrixEntry[] = [];
  writePacket(tree.entries.flat, 'demo/001-flat-probe');
  writePacket(tree.entries.nested, 'demo/sub/001-nested-probe');

  for (const name of MATRIX_NAMES) {
    const id = `demo/${name}`;
    const packetName = name === 'sub' ? '001-nested-probe' : '001-matrix-probe';
    let containerFolder = path.join(tree.specs, 'demo', name);

    if (name === 'sub') {
      containerFolder = tree.entries.sub;
      writePacket(path.join(containerFolder, packetName), `${id}/${packetName}`);
    } else if (name === 'linked-folder') {
      const target = path.join(rootPath, 'linked-folder-target');
      writeContainer(target, id, [`${id}/${packetName}`]);
      writePacket(path.join(target, packetName), `${id}/${packetName}`);
      fs.symlinkSync(path.relative(path.dirname(containerFolder), target), containerFolder);
    } else {
      fs.mkdirSync(containerFolder, { recursive: true });
      if (name === 'linked-description') {
        writeContainer(containerFolder, id, [`${id}/${packetName}`]);
        fs.rmSync(path.join(containerFolder, 'description.json'));
        const target = path.join(rootPath, 'outside-description.json');
        writeJson(target, { level: 'sub-track', specFolder: id });
        fs.symlinkSync(target, path.join(containerFolder, 'description.json'));
      } else {
        writeContainer(containerFolder, id, [`${id}/${packetName}`]);
      }
      if (name === '001-odd' || name === 'owns-spec') {
        fs.writeFileSync(path.join(containerFolder, 'spec.md'), '# Packet-shaped folder\n');
        fs.writeFileSync(path.join(containerFolder, 'plan.md'), '# Plan\n');
        fs.writeFileSync(path.join(containerFolder, 'tasks.md'), '# Tasks\n');
      }
      writePacket(path.join(containerFolder, packetName), `${id}/${packetName}`);
    }

    entries.push({
      name,
      packetName,
      packetFolder: path.join(containerFolder, packetName),
      containerFolder,
    });
  }

  return { specs: tree.specs, entries };
}

function copyCliTools(workspace: string): void {
  const fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const directory of ['spec', 'lib', 'templates']) {
    fs.mkdirSync(path.join(fixtureCli, directory), { recursive: true });
  }
  for (const script of ['create.sh', 'archive.sh', 'refresh-track-roots.mjs']) {
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
  archiveScript = path.join(fixtureCli, 'spec', 'archive.sh');
}

function readerDeclares(name: string, specsRoot = specs): boolean {
  return (readWorkingTreeTracks(specsRoot) as Array<{ name: string }>).some((track) => track.name === `demo/${name}`);
}

function runValidate(folder: string, recursive = true): { status: number | null; stdout: string; stderr: string } {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ['SPECKIT_SKIP_VALIDATION', 'SPECKIT_VALIDATION', 'SPECKIT_JSON', 'SPECKIT_QUIET']) {
    delete env[key];
  }
  Object.assign(env, {
    HOOK_FLAGS_CONFIG: path.join(root, 'absent-hook-flags.env'),
    SPECKIT_RULES: 'FILE_EXISTS',
  });
  const args = [VALIDATE_SCRIPT, folder, ...(recursive ? ['--recursive'] : []), '--json'];
  const result = spawnSync('bash', args, {
    cwd: root,
    encoding: 'utf8',
    env,
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function runArchive(entry: MatrixEntry): { status: number | null; stdout: string; stderr: string } {
  const argument = path.relative(root, entry.packetFolder).split(path.sep).join('/');
  const result = spawnSync('bash', [archiveScript, '--force', argument], {
    cwd: root,
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'subtrack-predicate-parity-')));
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  copyCliTools(root);
  matrix = buildMatrix(root);
  specs = matrix.specs;
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('declared sub-track predicate parity', () => {
  it('accepts a declared sub-track when its parent has no metadata and skips refresh', () => {
    const subtrack = path.join(specs, 'metadata-less', 'sub');
    writeContainer(subtrack, 'metadata-less/sub', []);
    const subMetadata = path.join(subtrack, 'graph-metadata.json');
    const subMetadataBefore = fs.readFileSync(subMetadata, 'utf8');
    const readerEntries = readWorkingTreeTracks(specs) as Array<{ name: string }>;

    expect(readerEntries.some((track) => track.name === 'metadata-less/sub')).toBe(false);

    const result = spawnSync(
      'bash',
      [createScript, '--json', '--skip-branch', '--track', 'metadata-less/sub', '--short-name', 'metadata-less-probe', 'Metadata-less probe'],
      { cwd: root, encoding: 'utf8' },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(fs.existsSync(path.join(subtrack, '001-metadata-less-probe', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'metadata-less', 'graph-metadata.json'))).toBe(false);
    expect(fs.readFileSync(subMetadata, 'utf8')).toBe(subMetadataBefore);
    expect(result.stderr).not.toContain('was not refreshed');

    const validation = runValidate(subtrack, false);
    const first = JSON.parse(validation.stdout.split('\n')[0]) as {
      entries?: Array<{ rule: string; message: string }>;
    };
    const recognized = first.entries?.some((item) =>
      item.rule === 'TRACK_ROOT' && item.message === 'Sub-track directory, not a packet; no packet rules apply',
    ) ?? false;
    expect(recognized).toBe(true);
  });

  it("smokes create.sh handling for each container in the reader's case matrix", () => {
    for (const entry of matrix.entries) {
      const expected = readerDeclares(entry.name);
      const result = spawnSync(
        'bash',
        [createScript, '--json', '--skip-branch', '--track', `demo/${entry.name}`, '--short-name', 'matrix-probe', 'Matrix probe'],
        { cwd: root, encoding: 'utf8' },
      );
      expect(result.status === 0, `${entry.name}: ${result.stderr}`).toBe(expected);
    }
  });

  it('keeps validation sub-track classification aligned with the reader across the case matrix', () => {
    const mismatches: string[] = [];
    for (const entry of matrix.entries) {
      const result = runValidate(entry.containerFolder, false);
      const first = JSON.parse(result.stdout.split('\n')[0]) as {
        entries?: Array<{ rule: string; message: string }>;
      };
      const recognized = first.entries?.some((item) =>
        item.rule === 'TRACK_ROOT' && item.message === 'Sub-track directory, not a packet; no packet rules apply',
      ) ?? false;
      const expected = readerDeclares(entry.name);
      if (recognized !== expected) mismatches.push(`${entry.name}: expected ${expected}, received ${recognized}`);
    }
    expect(mismatches).toEqual([]);
  });

  it('does not recurse through a child under a numbered specs-root folder', () => {
    const numberedFolder = path.join(specs, '001_x');
    const declaredChild = path.join(numberedFolder, 'sub');
    writeContainer(declaredChild, '001_x/sub', []);

    const readerRecognizes = (readWorkingTreeTracks(specs) as Array<{ name: string }>)
      .some((track) => track.name === '001_x/sub');
    const result = runValidate(numberedFolder, false);

    expect(readerRecognizes).toBe(false);
    expect(result.stdout).not.toBe('');
    expect(result.stdout.includes(declaredChild)).toBe(readerRecognizes);
  });

  it('keeps archive parent handling aligned with the reader across the case matrix', () => {
    const mismatches: string[] = [];
    for (const entry of matrix.entries) {
      const declared = readerDeclares(entry.name);
      const numberedParent = /^\d{3}(?:[-_].+)?$/.test(entry.name);
      const before = JSON.parse(fs.readFileSync(path.join(entry.containerFolder, 'graph-metadata.json'), 'utf8')) as { children_ids: string[] };
      const result = runArchive(entry);

      const canArchive = declared || numberedParent;
      if ((result.status === 0) !== canArchive) {
        mismatches.push(`${entry.name}: archiveable expected ${canArchive}, received ${result.status === 0}`);
      }
      const after = JSON.parse(fs.readFileSync(path.join(entry.containerFolder, 'graph-metadata.json'), 'utf8')) as { children_ids: string[] };
      const childId = `demo/${entry.name}/${entry.packetName}`;
      const keepsArchivedChild = !declared && before.children_ids.includes(childId);
      if (after.children_ids.includes(childId) !== keepsArchivedChild) {
        mismatches.push(`${entry.name}: child metadata expected ${keepsArchivedChild}, received ${after.children_ids.includes(childId)}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('keeps graph parent derivation aligned with the reader across the case matrix', () => {
    const graphRoot = path.join(root, '.opencode');
    const graphTree = buildMatrix(graphRoot);
    const mismatches: string[] = [];

    for (const entry of graphTree.entries) {
      let parentId: string | null = null;
      try {
        parentId = refreshGraphMetadataForSpecFolder(entry.packetFolder).metadata.parent_id;
      } catch {
        parentId = null;
      }
      const numberedParent = /^\d{3}(?:[-_].+)?$/.test(entry.name);
      const expected = readerDeclares(entry.name, graphTree.specs) || numberedParent ? `demo/${entry.name}` : null;
      if (parentId !== expected) mismatches.push(`${entry.name}: expected ${expected}, received ${parentId}`);
    }
    expect(mismatches).toEqual([]);
  });

  it('keeps repair-derived parent repair aligned with the reader across the case matrix', () => {
    const repairRoot = path.join(root, 'repair-workspace');
    fs.mkdirSync(repairRoot, { recursive: true });
    fs.symlinkSync(path.join(REPO_ROOT, '.skilled'), path.join(repairRoot, '.skilled'), 'dir');
    const repairTree = buildMatrix(repairRoot);
    const repairScript = path.join(repairRoot, '.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs');
    const mismatches: string[] = [];

    for (const entry of repairTree.entries) {
      const id = `demo/${entry.name}/${entry.packetName}`;
      const relative = path.relative(repairRoot, entry.packetFolder).split(path.sep).join('/');
      const graphPath = path.join(entry.packetFolder, 'graph-metadata.json');
      const before = JSON.parse(fs.readFileSync(graphPath, 'utf8')) as { parent_id: string | null };
      before.parent_id = 'legacy-parent';
      writeJson(graphPath, before);
      const result = spawnSync(process.execPath, [repairScript, '--folder', relative], {
        cwd: repairRoot,
        encoding: 'utf8',
        env: { ...process.env, SPECKIT_RULES: 'METADATA_DISK_PATH_CONSISTENCY' },
      });
      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8')) as { parent_id: string | null; spec_folder: string };
      const expectedParent = `demo/${entry.name}`;
      const plannedParent = result.stdout.includes(`graph parent legacy-parent -> ${expectedParent}`);
      const shouldPlanParent = readerDeclares(entry.name, repairTree.specs);
      if (plannedParent !== shouldPlanParent) {
        mismatches.push(`${entry.name}: parent repair planned expected ${shouldPlanParent}, received ${plannedParent}; ${result.stdout}${result.stderr}`);
      }
      if (result.status === 2 && entry.name !== 'linked-folder') {
        mismatches.push(`${entry.name}: unexpected repair failure; ${result.stdout}${result.stderr}`);
      }
      if (graph.parent_id !== 'legacy-parent') mismatches.push(`${entry.name}: dry run changed graph parent to ${graph.parent_id}`);
      if (graph.spec_folder !== id) mismatches.push(`${entry.name}: spec_folder changed to ${graph.spec_folder}`);
    }
    expect(mismatches).toEqual([]);
  });

  it('creates a missing sub-track metadata file when archiving out of it', () => {
    const sub = matrix.entries.find((entry) => entry.name === 'sub');
    if (!sub) throw new Error('matrix has no sub entry');
    const metadataPath = path.join(sub.containerFolder, 'graph-metadata.json');
    fs.unlinkSync(metadataPath);

    const result = runArchive(sub);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout + result.stderr).not.toContain('was not refreshed');
    expect(fs.existsSync(metadataPath)).toBe(true);
    const children = (JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as { children_ids: string[] }).children_ids;
    expect(children).not.toContain(`demo/sub/${sub.packetName}`);
  });

  it('judges the track segment the way the reader does for every consumer', () => {
    const trackNames = ['001_x', 'owns-spec-track', 'z_track', '.hidden-track', 'node_modules'];
    const repairRoot = path.join(root, 'track-segment-repair');
    fs.mkdirSync(repairRoot, { recursive: true });
    fs.symlinkSync(path.join(REPO_ROOT, '.skilled'), path.join(repairRoot, '.skilled'), 'dir');
    const repairScript = path.join(repairRoot, '.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs');
    const mismatches: string[] = [];

    const plant = (specsRoot: string, trackName: string): string => {
      const trackFolder = path.join(specsRoot, trackName);
      writeJson(path.join(trackFolder, 'graph-metadata.json'), {
        schema_version: 1,
        packet_id: trackName,
        spec_folder: trackName,
        parent_id: null,
        children_ids: ['sub'],
        manual: { depends_on: [], supersedes: [], related_to: [] },
        derived: { trigger_phrases: [], key_topics: [trackName], causal_summary: `Track ${trackName}.` },
      });
      if (trackName === 'owns-spec-track') fs.writeFileSync(path.join(trackFolder, 'spec.md'), '# Packet-shaped track\n');
      writeContainer(path.join(trackFolder, 'sub'), `${trackName}/sub`, [`${trackName}/sub/001-probe`]);
      const packetFolder = path.join(trackFolder, 'sub', '001-probe');
      writePacket(packetFolder, `${trackName}/sub/001-probe`);
      return packetFolder;
    };

    for (const trackName of trackNames) {
      const id = `${trackName}/sub`;
      const packetFolder = plant(specs, trackName);
      const repairPacket = plant(path.join(repairRoot, 'specs'), trackName);
      const expected = (readWorkingTreeTracks(specs) as Array<{ name: string }>).some((track) => track.name === id);

      let parentId: string | null = null;
      try {
        parentId = refreshGraphMetadataForSpecFolder(packetFolder).metadata.parent_id;
      } catch {
        parentId = null;
      }
      if (parentId !== (expected ? id : null)) mismatches.push(`${trackName}: graph parent expected ${expected ? id : null}, received ${parentId}`);

      const graphPath = path.join(repairPacket, 'graph-metadata.json');
      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8')) as { parent_id: string | null };
      graph.parent_id = 'legacy-parent';
      writeJson(graphPath, graph);
      const relative = path.relative(repairRoot, repairPacket).split(path.sep).join('/');
      const repair = spawnSync(process.execPath, [repairScript, '--folder', relative], {
        cwd: repairRoot,
        encoding: 'utf8',
        env: { ...process.env, SPECKIT_RULES: 'METADATA_DISK_PATH_CONSISTENCY' },
      });
      const planned = repair.stdout.includes(`graph parent legacy-parent -> ${id}`);
      if (planned !== expected) mismatches.push(`${trackName}: repair planned expected ${expected}, received ${planned}`);

      const validation = runValidate(path.join(specs, trackName, 'sub'), false);
      const first = JSON.parse(validation.stdout.split('\n')[0] || '{}') as {
        entries?: Array<{ rule: string; message: string }>;
      };
      const recognized = first.entries?.some((item) =>
        item.rule === 'TRACK_ROOT' && item.message === 'Sub-track directory, not a packet; no packet rules apply',
      ) ?? false;
      if (recognized !== expected) mismatches.push(`${trackName}: validation expected ${expected}, received ${recognized}`);

      const archived = spawnSync('bash', [archiveScript, '--force', path.relative(root, packetFolder).split(path.sep).join('/')], {
        cwd: root,
        encoding: 'utf8',
      });
      if ((archived.status === 0) !== expected) mismatches.push(`${trackName}: archive expected ${expected}, received ${archived.status === 0}; ${archived.stderr}`);
    }
    expect(mismatches).toEqual([]);
  });
});
