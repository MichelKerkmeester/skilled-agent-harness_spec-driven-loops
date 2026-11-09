// ───────────────────────────────────────────────────────────────────
// MODULE: Template Staleness Discovery Tests
// ───────────────────────────────────────────────────────────────────

// Discovery once walked the whole repository root for spec.md, so every fixture
// packet under the skills tree and every archived packet counted as one of the
// repository's own folders, and a host that vendors the skill saw the vendored
// tree reported as its stale packets as well. Discovery is confined to the spec
// document root now, and these suites pin that boundary from both sides: a
// fixture, archived, scratch or vendored folder is not a packet, while a
// numbered packet whose directory name merely ends in "-fixtures" still is. The
// deep-run artifact trees are the other half of that boundary: a lineage's
// containment snapshot carries a whole framework checkout whose packets belong
// to the copy, never to the host.
//
// A host's spec root can also hold an untracked mirror of another checkout's
// packets, which git already knows to leave out of the host's own tree. The
// checker asks git the same question the retrieval corpus walker asks, and both
// sides of that are pinned here: an ignored folder is not a packet, while a root
// outside a checkout has nothing to ignore and counts every folder.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(TEST_DIR, '..', '..', '..');
const CHECKER = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'check-template-staleness.sh');
const MANIFEST = path.join(SKILL_ROOT, 'templates', 'spec-kit-docs.json');

interface Manifest {
  versions: Record<string, string>;
}

interface Report {
  current_version: string;
  total: number;
  current: number;
  stale: number;
  no_version: number;
  missing_spec: number;
  versions: Record<string, number>;
  stale_folders: string[];
}

const CURRENT_VERSION = (JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Manifest).versions['spec.md.tmpl'];

// The checker compares the two marker strings for equality and never orders
// them, so an older declaration is simply the not-current case.
const STALE_VERSION = 'v2.2';

const scratch: string[] = [];

function writeSpec(root: string, relativeDirectory: string, version: string): void {
  const directory = path.join(root, relativeDirectory);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'spec.md'),
    `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | ${version} -->\n\n# Spec\n`,
    'utf8',
  );
}

// The version lookup answers "unknown" when the manifest is absent, which would
// make every folder stale for a reason unrelated to its marker.
function installManifest(root: string): void {
  const target = path.join(root, '.skilled', 'skills', 'system-spec-kit', 'templates', 'spec-kit-docs.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(MANIFEST, target);
}

function createRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'template-staleness-'));
  scratch.push(root);
  installManifest(root);
  return root;
}

// A checkout needs no commit for its ignore rules to apply: git answers from the
// working tree and the committed .gitignore files alone.
function gitInit(root: string): void {
  const result = spawnSync('git', ['init', '-q'], { cwd: root, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
}

function writeGitignore(root: string, rules: string): void {
  fs.writeFileSync(path.join(root, '.gitignore'), rules, 'utf8');
}

function runChecker(root: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('bash', [CHECKER, '--json', '--root', root], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function readReport(root: string): { payload: Report; stdout: string; status: number | null } {
  const run = runChecker(root);
  return { payload: JSON.parse(run.stdout) as Report, stdout: run.stdout, status: run.status };
}

afterAll(() => {
  for (const root of scratch) fs.rmSync(root, { recursive: true, force: true });
});

describe('template staleness discovery', () => {
  it('counts only live packets under the spec root and never an archived, scratch, fixture or vendored one', () => {
    const root = createRoot();
    writeSpec(root, 'specs/a/001-real', CURRENT_VERSION);
    writeSpec(root, 'specs/a/002-old', STALE_VERSION);
    writeSpec(root, 'specs/a/z_archive/003-arch', STALE_VERSION);
    writeSpec(root, 'specs/a/001-real/scratch/x', STALE_VERSION);
    writeSpec(root, 'skilled/specs/b/001-vendored', STALE_VERSION);
    writeSpec(root, '.skilled/skills/foo/tests/fixtures/f1', STALE_VERSION);

    const { payload, stdout, status } = readReport(root);

    expect(payload.current_version).toBe(CURRENT_VERSION);
    expect(payload.total).toBe(2);
    expect(payload.current).toBe(1);
    // Exit 1 is the checker's stale-found status, not a crash.
    expect(status).toBe(1);
    expect(payload.stale_folders).toEqual([`specs/a/002-old (${STALE_VERSION})`]);
    expect(stdout).not.toMatch(/fixtures|z_archive|scratch|skilled\//);
  });

  it('reports no folders and exits clean for a root carrying no spec document root', () => {
    const root = createRoot();

    const { payload, status, stdout } = readReport(root);

    expect(payload.total).toBe(0);
    expect(payload.current_version).toBe(CURRENT_VERSION);
    expect(payload.stale_folders).toEqual([]);
    expect(stdout.trim()).not.toBe('');
    expect(status).toBe(0);
  });

  it('keeps a numbered packet whose name ends in "-fixtures" while pruning an actual fixture directory', () => {
    const root = createRoot();
    writeSpec(root, 'specs/a/005-advisor-stress-fixtures', STALE_VERSION);
    writeSpec(root, 'specs/a/006-plain/fixtures/inner', STALE_VERSION);
    writeSpec(root, 'specs/a/demo-fixtures', STALE_VERSION);

    const { payload } = readReport(root);

    expect(payload.total).toBe(1);
    expect(payload.stale_folders).toEqual([`specs/a/005-advisor-stress-fixtures (${STALE_VERSION})`]);
  });

  it('follows a spec root that is a symlink, as a host sharing one packet tree does', () => {
    const root = createRoot();
    writeSpec(root, 'shared-packets/a/001-real', CURRENT_VERSION);
    writeSpec(root, 'shared-packets/a/002-old', STALE_VERSION);
    fs.symlinkSync(path.join(root, 'shared-packets'), path.join(root, 'specs'), 'dir');

    const { payload } = readReport(root);

    expect(payload.total).toBe(2);
    expect(payload.stale_folders).toEqual([`specs/a/002-old (${STALE_VERSION})`]);
  });

  it('never reports a packet from a deep-run artifact tree or from a vendored Skilled copy', () => {
    const root = createRoot();
    writeSpec(root, 'specs/a/001-real', CURRENT_VERSION);

    // A lineage containment snapshot vendors the whole framework, including the
    // peer packets it copied and the skill fixtures that copy carries.
    const vendored = 'specs/a/002-r/research/lineages/x/containment/baseline/skilled';
    fs.mkdirSync(path.join(root, vendored, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
    writeSpec(root, `${vendored}/specs/b/001-copied`, STALE_VERSION);
    writeSpec(
      root,
      `${vendored}/.skilled/skills/sk-doc/scripts/rule-experiment-fixture/specs/fixture/001-m`,
      STALE_VERSION,
    );

    // A vendored copy outside a lineage tree is a copy as well: the sentinel
    // decides, not the path.
    writeSpec(root, 'specs/a/003-v', STALE_VERSION);
    fs.mkdirSync(path.join(root, 'specs/a/003-v/vendor/.skilled/skills/system-spec-kit'), { recursive: true });
    writeSpec(root, 'specs/a/003-v/vendor/specs/c/001-x', STALE_VERSION);

    writeSpec(root, 'specs/a/004-r/research_archive/old', STALE_VERSION);

    const { payload, stdout } = readReport(root);

    expect(payload.total).toBe(2);
    expect(payload.current).toBe(1);
    expect(payload.stale_folders).toEqual([`specs/a/003-v (${STALE_VERSION})`]);
    expect(stdout).not.toMatch(/fixture|lineages|containment|research_archive|vendor\//);
  });

  it('skips a git-ignored mirror under the spec root', () => {
    const root = createRoot();
    writeGitignore(root, '/specs/mirror/\n');
    gitInit(root);
    writeSpec(root, 'specs/a/001-real', CURRENT_VERSION);
    writeSpec(root, 'specs/mirror/b/001-copied', STALE_VERSION);

    const { payload, stdout } = readReport(root);

    expect(payload.total).toBe(1);
    expect(payload.current).toBe(1);
    expect(payload.stale_folders).toEqual([]);
    expect(stdout).not.toMatch(/mirror/);
  });

  it('skips a packet whose own spec.md is git-ignored', () => {
    const root = createRoot();
    writeGitignore(root, '/specs/a/002-old/spec.md\n');
    gitInit(root);
    writeSpec(root, 'specs/a/001-real', CURRENT_VERSION);
    writeSpec(root, 'specs/a/002-old', STALE_VERSION);

    const { payload, stdout } = readReport(root);

    expect(payload.total).toBe(1);
    expect(payload.stale_folders).toEqual([]);
    expect(stdout).not.toMatch(/002-old/);
  });

  it('counts every folder when the root is not a git checkout, since there is nothing to ignore', () => {
    const root = createRoot();
    writeGitignore(root, '/specs/mirror/\n');
    writeSpec(root, 'specs/a/001-real', CURRENT_VERSION);
    writeSpec(root, 'specs/mirror/b/001-copied', STALE_VERSION);

    const { payload } = readReport(root);

    expect(payload.total).toBe(2);
    expect(payload.stale_folders).toEqual([`specs/mirror/b/001-copied (${STALE_VERSION})`]);
  });
});
