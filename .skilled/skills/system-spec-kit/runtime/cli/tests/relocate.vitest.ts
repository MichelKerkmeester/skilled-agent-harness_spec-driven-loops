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

// A writer that fails its first call and passes after it. The run stops on the
// failure, and the rerun of the same map is what must invoke it and finish.
function stubFailsOnce(file: string, pass: string): void {
  const marker = `${file}.failed-once`;
  stub(
    file,
    `import fs from 'node:fs';\nconst marker = ${JSON.stringify(marker)};\nif (!fs.existsSync(marker)) {\n  fs.writeFileSync(marker, 'called');\n  process.exit(1);\n}\n${pass}`,
  );
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

// A phase scaffold writes each child's bare folder name in the parent's map,
// handoff table and goal bindings, and in each child's neighbour rows. These
// helpers write those places in the shape the scaffold uses.
function phaseParent(id: string, phases: string[]): void {
  packet(id);
  const parentDir = path.join(specs, id);
  writeJson(path.join(parentDir, 'graph-metadata.json'), {
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: id.split('/').slice(0, -1).join('/'),
    children_ids: phases.map((phase) => `${id}/${phase}`),
  });
  const mapRows = phases
    .map((phase) => `| ${Number(phase.slice(0, 3))} | ${phase}/ | Phase ${Number(phase.slice(0, 3))} scope | Pending |`)
    .join('\n');
  const handoffRows = phases
    .slice(1)
    .map((phase, index) => `| ${phases[index]} | ${phase} | criteria | verify |`)
    .join('\n');
  fs.writeFileSync(
    path.join(parentDir, 'spec.md'),
    `# Phase parent fixture\n\n<!-- ANCHOR:phase-map -->\n## PHASE DOCUMENTATION MAP\n\n| Phase | Folder | Focus | Status |\n|-------|--------|-------|--------|\n${mapRows}\n\n### Phase Handoff Criteria\n\n| From | To | Criteria | Verification |\n|------|-----|----------|--------------|\n${handoffRows}\n<!-- /ANCHOR:phase-map -->\n`,
  );
  const bindingRows = phases.map((phase) => `| ${phase} | \`${phase}/goal.md\` |`).join('\n');
  fs.writeFileSync(
    path.join(parentDir, 'goal.md'),
    `# Goal: fixture phase parent\n\n<!-- ANCHOR:binding -->\n## 2. BINDING\n\n| Phase | Goal document |\n|-------|---------------|\n${bindingRows}\n<!-- /ANCHOR:binding -->\n`,
  );
  phases.forEach((phase, index) => {
    const child = `${id}/${phase}`;
    packet(child);
    const predecessor = index === 0 ? 'None' : phases[index - 1];
    const successor = index === phases.length - 1 ? 'None' : phases[index + 1];
    fs.writeFileSync(
      path.join(specs, child, 'spec.md'),
      `# Phase fixture: ${phase}\n\n| Field | Value |\n|-------|-------|\n| **Parent Spec** | ../spec.md |\n| **Phase** | ${index + 1} of ${phases.length} |\n| **Predecessor** | ${predecessor} |\n| **Successor** | ${successor} |\n`,
    );
  });
}

// The summary records the packet's own folder in a row and uses the same name
// in a session id, which is not a location and must stay as written.
function implementationSummary(child: string, specFolder: string, sessionId: string): void {
  fs.writeFileSync(
    path.join(specs, child, 'implementation-summary.md'),
    `---\ntitle: "Implementation Summary"\n_memory:\n  continuity:\n    session_dedup:\n      session_id: "${sessionId}"\n---\n# Implementation Summary\n\n| Field | Value |\n|-------|-------|\n| **Spec Folder** | ${specFolder} |\n`,
  );
}

// The bare-name boundary the phase documents use: the name at a line start or
// after a character that cannot continue it.
function bareHits(files: string[]): string[] {
  const hits: string[] = [];
  for (const relative of files) {
    const file = path.join(specs, relative);
    if (!fs.existsSync(file)) continue;
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (/^003-gamma|[^A-Za-z0-9_-]003-gamma/.test(line)) hits.push(`${relative}:${index + 1}: ${line}`);
      });
  }
  return hits;
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

/** The working tree's porcelain status, as the operator would read it. */
function gitStatus(): string {
  return execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' });
}

// Two spellings name one folder only where the volume folds case, so the pair
// of duplicate cases probes the throwaway specs root and skips when it does not.
function volumeFoldsCase(dir: string): boolean {
  const probe = path.join(dir, 'case-probe');
  fs.writeFileSync(probe, '');
  try {
    return fs.existsSync(path.join(dir, 'CASE-PROBE'));
  } finally {
    fs.rmSync(probe, { force: true });
  }
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

describe('relocate phase renumber names', () => {
  it('rewrites a renumbered phase bare name in its parent documents and siblings', () => {
    track('omega', [], ['omega/core']);
    declaredSubtrack('omega/core');
    phaseParent('omega/core/003-phased-thing', ['001-alpha', '003-gamma']);
    implementationSummary('omega/core/003-phased-thing/003-gamma', '003-gamma', 'scaffold-003-gamma');
    commitFixture();

    const result = relocate(['--renumber', 'omega/core/003-phased-thing', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toMatch(/move\s+specs\/omega\/core\/003-phased-thing\/003-gamma -> specs\/omega\/core\/003-phased-thing\/002-gamma/);
    const parentSpec = fs.readFileSync(path.join(specs, 'omega/core/003-phased-thing/spec.md'), 'utf8');
    expect(parentSpec).not.toContain('003-gamma');
    expect((parentSpec.match(/002-gamma/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(bareHits([
      'omega/core/003-phased-thing/spec.md',
      'omega/core/003-phased-thing/goal.md',
      'omega/core/003-phased-thing/001-alpha/spec.md',
      'omega/core/003-phased-thing/002-gamma/spec.md',
      'omega/core/003-phased-thing/002-gamma/implementation-summary.md',
    ])).toEqual([]);
    const summary = fs.readFileSync(path.join(specs, 'omega/core/003-phased-thing/002-gamma/implementation-summary.md'), 'utf8');
    expect(summary).toContain('| **Spec Folder** | 002-gamma |');
    expect((summary.match(/scaffold-003-gamma/g) ?? []).length).toBe(1);
  });

  it('leaves a second phase parent that holds the same child name untouched', () => {
    track('omega', [], ['omega/core']);
    declaredSubtrack('omega/core');
    phaseParent('omega/core/003-phased-thing', ['001-alpha', '003-gamma']);
    implementationSummary('omega/core/003-phased-thing/003-gamma', '003-gamma', 'scaffold-003-gamma');
    phaseParent('omega/core/004-other', ['001-delta', '003-gamma']);
    implementationSummary('omega/core/004-other/003-gamma', '003-gamma', 'scaffold-003-gamma');
    commitFixture();
    const otherFiles = () => new Map([...snapshot()].filter(([file]) => file.startsWith('specs/omega/core/004-other/')));
    const before = otherFiles();

    const result = relocate(['--renumber', 'omega/core/003-phased-thing', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'omega/core/003-phased-thing/002-gamma/spec.md'))).toBe(true);
    expect(otherFiles()).toEqual(before);
    expect(fs.readFileSync(path.join(specs, 'omega/core/004-other/spec.md'), 'utf8')).toContain('003-gamma');
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

  it('removes a re-parented phase from its old parent and adds it to the new one', () => {
    track('omega', [], ['omega/core']);
    declaredSubtrack('omega/core');
    phaseParent('omega/core/003-phased-thing', ['001-alpha', '003-gamma', '005-delta']);
    phaseParent('omega/core/004-other', ['001-delta', '003-gamma']);
    commitFixture();

    const result = relocate([
      '--from', 'omega/core/003-phased-thing/003-gamma',
      '--to', 'omega/core/004-other/002-gamma',
      '--apply',
    ]);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const oldParent = path.join(specs, 'omega/core/003-phased-thing');
    const oldSpec = fs.readFileSync(path.join(oldParent, 'spec.md'), 'utf8');
    const oldGoal = fs.readFileSync(path.join(oldParent, 'goal.md'), 'utf8');
    expect(oldSpec).not.toContain('gamma');
    expect(oldGoal).not.toContain('gamma');
    for (const child of fs.readdirSync(oldParent).filter((name) => /^\d{3}-/.test(name))) {
      expect(fs.readFileSync(path.join(oldParent, child, 'spec.md'), 'utf8')).not.toContain('gamma');
    }

    const newSpec = fs.readFileSync(path.join(specs, 'omega/core/004-other/spec.md'), 'utf8');
    const newGoal = fs.readFileSync(path.join(specs, 'omega/core/004-other/goal.md'), 'utf8');
    expect((newSpec.match(/002-gamma\//g) ?? []).length).toBe(1);
    expect(newGoal.split('\n').filter((line) => line.includes('002-gamma'))).toHaveLength(1);
    expect(result.stdout).toMatch(/remove map row 003-gamma/);
    expect(result.stdout).toMatch(/remove handoff row 003-gamma/);
    expect(result.stdout).toMatch(/remove binding row 003-gamma/);
    expect(result.stdout).toMatch(/set Successor 003-gamma -> 005-delta/);
    expect(result.stdout).toMatch(/set Predecessor 003-gamma -> 001-alpha/);
    expect(result.stdout).toMatch(/add map row 002-gamma/);
    expect(result.stdout).toMatch(/add binding row 002-gamma/);
    expect(result.stdout).toMatch(/no handoff row added/);
  });

  it('reports that a new parent with no phase map takes no map row', () => {
    track('omega', [], ['omega/core']);
    declaredSubtrack('omega/core');
    phaseParent('omega/core/003-phased-thing', ['001-alpha', '003-gamma']);
    phaseParent('omega/core/004-other', ['001-delta']);
    fs.writeFileSync(path.join(specs, 'omega/core/004-other', 'spec.md'), '# Phase parent fixture\n');
    commitFixture();

    const result = relocate([
      '--from', 'omega/core/003-phased-thing/003-gamma',
      '--to', 'omega/core/004-other/002-gamma',
      '--apply',
    ]);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const newSpec = fs.readFileSync(path.join(specs, 'omega/core/004-other/spec.md'), 'utf8');
    const newGoal = fs.readFileSync(path.join(specs, 'omega/core/004-other/goal.md'), 'utf8');
    expect(newSpec).not.toContain('002-gamma');
    expect(newGoal.split('\n').filter((line) => line.includes('002-gamma'))).toHaveLength(1);
    expect(result.stdout).toMatch(/no map row added/);
    expect(result.stdout).toMatch(/add binding row 002-gamma/);
    expect(result.stdout).toMatch(/no handoff row added/);
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

  // Both spellings reach one existing folder. If the plan compares the text of
  // the names, the first move consumes the folder and the second one has no
  // source left to move.
  it('refuses two spellings of one source folder when the volume folds case', (ctx) => {
    if (!volumeFoldsCase(specs)) ctx.skip('the temp filesystem is case-sensitive, so the source spellings name distinct folders');
    track('nu', ['nu/001-a'], ['nu/sub']);
    declaredSubtrack('nu/sub');
    const map = writeMap([
      { from: 'nu/001-a', to: 'nu/sub/001-a' },
      { from: 'nu/001-A', to: 'nu/sub/002-b' },
    ]);
    commitFixture();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    const refused = result.stderr
      .split('\n')
      .find((line) => line.includes('relocate: refused:') && line.includes('specs/nu/001-a') && line.includes('specs/nu/001-A'));
    expect(refused, result.stderr).toBeDefined();
    expect(gitStatus()).toBe('');
  });

  // Neither sub-track exists yet, so the two spellings only collide after the
  // first move creates the folder the second move would then land inside.
  it('refuses two spellings of one target folder when the volume folds case', (ctx) => {
    if (!volumeFoldsCase(specs)) ctx.skip('the temp filesystem is case-sensitive, so the target spellings name distinct folders');
    track('nu', ['nu/001-a', 'nu/002-b']);
    const map = writeMap([
      { from: 'nu/001-a', to: 'nu/sub/001-a' },
      { from: 'nu/002-b', to: 'nu/SUB/001-a' },
    ]);
    commitFixture();

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    const refused = result.stderr
      .split('\n')
      .find((line) => line.includes('relocate: refused:') && line.includes('specs/nu/sub/001-a') && line.includes('specs/nu/SUB/001-a'));
    expect(refused, result.stderr).toBeDefined();
    expect(gitStatus()).toBe('');
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

describe('relocate resume', () => {
  // The reference stores are written outside the packet tree, so a failure in
  // one of them leaves the moved folders already in place. The rerun has to
  // know the step never landed and run it again.
  it('reruns the redirect table and the trigger index after the redirect table failed once', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();
    stubFailsOnce(
      path.join(repo, '.skilled', 'skills', 'sk-doc', 'shared', 'scripts', 'cite-drift-scan.mjs'),
      'process.exit(0);\n',
    );
    const args = ['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a'];

    const first = relocate([...args, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(2);
    expect(first.stdout).toContain('step redirect table (cite-drift-scan --rebuild-redirects): FAILED');

    const dry = relocate(args);
    expect(dry.status, dry.stdout + dry.stderr).toBe(1);

    const second = relocate([...args, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('step redirect table (cite-drift-scan --rebuild-redirects): ok');
    expect(second.stdout).toContain('step trigger index (generate-trigger-index): ok');

    const third = relocate([...args, '--apply']);
    expect(third.status, third.stdout + third.stderr).toBe(0);
    expect(third.stdout).toContain('relocate: nothing to do');
  });

  // The move rewrites the stored folder path, but the migration writer owns the
  // description's parent chain. After that writer fails once, only a check of
  // the chain can tell that its work never landed.
  it('reruns the identity step when a sub-track move left the description parent chain stale', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    const descriptionFile = path.join(specs, 'alpha', '001-a', 'description.json');
    const description = JSON.parse(fs.readFileSync(descriptionFile, 'utf8')) as Record<string, unknown>;
    description.parentChain = ['alpha'];
    fs.writeFileSync(descriptionFile, `${JSON.stringify(description, null, 2)}\n`);
    commitFixture();
    stubFailsOnce(
      path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'graph', 'migrate-generated-json.ts'),
      `const folder = process.argv[process.argv.indexOf('--only') + 1];\nconst file = folder + '/description.json';\nconst desc = JSON.parse(fs.readFileSync(file, 'utf8'));\ndesc.parentChain = ['alpha', 'sub'];\nfs.writeFileSync(file, JSON.stringify(desc, null, 2) + '\\n');\n`,
    );
    const args = ['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a'];

    const first = relocate([...args, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(2);
    expect(first.stdout).toContain('step description identity (migrate-generated-json --only): FAILED');

    const second = relocate([...args, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('step description identity (migrate-generated-json --only): ok');
    const migrated = JSON.parse(fs.readFileSync(path.join(specs, 'alpha', 'sub', '001-a', 'description.json'), 'utf8')) as Record<string, unknown>;
    expect(migrated.parentChain).toEqual(['alpha', 'sub']);

    const third = relocate([...args, '--apply']);
    expect(third.status, third.stdout + third.stderr).toBe(0);
    expect(third.stdout).toContain('relocate: nothing to do');
  });

  it('reruns the close after its sweep failed once', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();
    stubFailsOnce(
      path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'sweep-track-roots.mjs'),
      'process.exit(0);\n',
    );
    const args = ['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a'];

    const first = relocate([...args, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(2);
    expect(first.stdout).toContain('close sweep-track-roots: FAILED');

    const second = relocate([...args, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('close sweep-track-roots: ok');
    expect(second.stdout).toContain('close validate specs/alpha/sub/001-a: RESULT: PASSED');

    const third = relocate([...args, '--apply']);
    expect(third.status, third.stdout + third.stderr).toBe(0);
    expect(third.stdout).toContain('relocate: nothing to do');
  });

  // A moved packet can fail its own validation for reasons this tool does not
  // own. Reporting that verdict must not make the finished map look unfinished.
  it('does not keep the map open when the moved packet validation fails', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();
    stub(
      path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'validate.sh'),
      '#!/usr/bin/env bash\nprintf "RESULT: FAILED\\n"\nexit 1\n',
      0o755,
    );
    const args = ['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a'];

    const first = relocate([...args, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(3);
    expect(first.stdout).toContain('close validate specs/alpha/sub/001-a: RESULT: FAILED');

    const second = relocate([...args, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('relocate: nothing to do');
  });

  // A finished map is complete even when more than one moved packet fails its
  // own validation. The verdict is reported, and a rerun finds no work left.
  it('returns 3 when a finished map leaves only the moved packet validation failing', () => {
    track('alpha', ['alpha/001-a', 'alpha/002-b'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    const map = writeMap([
      { from: 'alpha/001-a', to: 'alpha/sub/001-a' },
      { from: 'alpha/002-b', to: 'alpha/sub/002-b' },
    ]);
    commitFixture();
    stub(
      path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'validate.sh'),
      '#!/usr/bin/env bash\nprintf "RESULT: FAILED\\n"\nexit 1\n',
      0o755,
    );

    const first = relocate(['--map', map, '--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(3);
    expect(first.stdout).toContain('close validate specs/alpha/sub/001-a: RESULT: FAILED');
    expect(first.stdout).toContain('close validate specs/alpha/sub/002-b: RESULT: FAILED');

    const second = relocate(['--map', map, '--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout).toContain('relocate: nothing to do');
  });

  // A failed step is an unfinished run even when a moved packet's own
  // validation would also have failed.
  it('returns 2 when a step fails beside the moved packet validation', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();
    const spec = path.join(repo, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec');
    stub(path.join(spec, 'validate.sh'), '#!/usr/bin/env bash\nprintf "RESULT: FAILED\\n"\nexit 1\n', 0o755);
    stub(path.join(spec, 'repair-derived.cjs'), 'process.exit(1);\n');
    const args = ['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a'];

    const result = relocate([...args, '--apply']);
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stdout).toContain('step graph identity and pointers specs/alpha/sub/001-a (repair-derived): FAILED');
  });

  // A stopped move step leaves the folders it already moved staged. Every file
  // under a moved destination then looks uncommitted, so the rerun must not
  // hold itself on dirt that its own earlier move put there.
  it('finishes a move step when one folder of the map already moved uncommitted', () => {
    track('eps', ['eps/001-a', 'eps/002-b'], ['eps/sub']);
    declaredSubtrack('eps/sub');
    const map = writeMap([
      { from: 'eps/001-a', to: 'eps/sub/001-a' },
      { from: 'eps/002-b', to: 'eps/sub/002-b' },
    ]);
    commitFixture();
    execFileSync('git', ['mv', 'specs/eps/001-a', 'specs/eps/sub/001-a'], { cwd: repo });

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'eps', '001-a'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'eps', '002-b'))).toBe(false);
    expect(fs.existsSync(path.join(specs, 'eps', 'sub', '001-a', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specs, 'eps', 'sub', '002-b', 'spec.md'))).toBe(true);
  });

  // A folder missing at the source is only a finished move when something
  // records that this map moved it. An unrelated live packet at the destination
  // is not that record.
  it('refuses a source that never existed even when the destination is a live packet', () => {
    track('zeta', ['zeta/001-a']);
    commitFixture();
    const before = snapshot();

    const result = relocate(['--from', 'zeta/999-typo', '--to', 'zeta/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('relocate: refused:');
    expect(result.stderr).toContain('specs/zeta/999-typo');
    expect(result.stdout).not.toContain('already at its destination');
    expect(result.stdout).not.toMatch(/^\s+ledger\s/m);
    expect(snapshot()).toEqual(before);
  });

  // A staged git move is a record of the move even though the run that would
  // have written the relocation batch stopped early.
  it('accepts a tracked move git records before the relocation step', () => {
    track('alpha', ['alpha/001-a'], ['alpha/sub']);
    declaredSubtrack('alpha/sub');
    commitFixture();
    execFileSync('git', ['mv', 'specs/alpha/001-a', 'specs/alpha/sub/001-a'], { cwd: repo });

    const result = relocate(['--from', 'alpha/001-a', '--to', 'alpha/sub/001-a', '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('moved    specs/alpha/001-a -> specs/alpha/sub/001-a (already at its destination)');
  });

  // An untracked folder moved by rename leaves no record anywhere. The refusal
  // must name the move back, and that move back must let the same map finish.
  it('refuses an untracked rename and finishes after moving the folder back', () => {
    track('eta', [], ['eta/sub']);
    declaredSubtrack('eta/sub');
    commitFixture();
    packet('eta/001-a');
    fs.renameSync(path.join(specs, 'eta', '001-a'), path.join(specs, 'eta', 'sub', '001-a'));
    const args = ['--from', 'eta/001-a', '--to', 'eta/sub/001-a'];
    const before = snapshot();

    const refused = relocate([...args, '--apply']);

    expect(refused.status, refused.stdout + refused.stderr).toBe(2);
    expect(refused.stderr).toContain('relocate: refused:');
    expect(refused.stderr).toContain('specs/eta/001-a');
    expect(refused.stderr).toContain('specs/eta/sub/001-a');
    expect(refused.stderr).toContain('move specs/eta/sub/001-a back to specs/eta/001-a');
    expect(snapshot()).toEqual(before);

    fs.renameSync(path.join(specs, 'eta', 'sub', '001-a'), path.join(specs, 'eta', '001-a'));
    const applied = relocate([...args, '--apply']);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(fs.existsSync(path.join(specs, 'eta', 'sub', '001-a', 'spec.md'))).toBe(true);
  });

  // The exemption is only for the map's own moved folders. An operator edit on
  // any other file the run would rewrite is still refused before the first write.
  it('refuses an uncommitted edit outside the map when one folder already moved', () => {
    track('eps', ['eps/001-a', 'eps/002-b'], ['eps/sub']);
    declaredSubtrack('eps/sub');
    track('zeta', ['zeta/001-c']);
    fs.writeFileSync(path.join(specs, 'zeta', '001-c', 'notes.md'), 'old: specs/eps/001-a\n');
    const map = writeMap([
      { from: 'eps/001-a', to: 'eps/sub/001-a' },
      { from: 'eps/002-b', to: 'eps/sub/002-b' },
    ]);
    commitFixture();
    execFileSync('git', ['mv', 'specs/eps/001-a', 'specs/eps/sub/001-a'], { cwd: repo });
    fs.appendFileSync(path.join(specs, 'zeta', '001-c', 'notes.md'), 'uncommitted\n');

    const result = relocate(['--map', map, '--apply']);

    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr).toContain('specs/zeta/001-c/notes.md: has uncommitted changes and would be rewritten');
    expect(fs.readFileSync(path.join(specs, 'zeta', '001-c', 'notes.md'), 'utf8')).toBe('old: specs/eps/001-a\nuncommitted\n');
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
