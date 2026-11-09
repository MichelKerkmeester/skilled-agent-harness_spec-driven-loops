// ───────────────────────────────────────────────────────────────────
// MODULE: Host Trigger Index Resolution Tests
// ───────────────────────────────────────────────────────────────────
// A host repository that vendors Skilled reaches the retrieval scripts through
// its own `.skilled` entry, so a bare invocation runs with the host's working
// directory while the scripts themselves live elsewhere. These tests build that
// layout in a temp git repository and assert the packaged artifact is neither
// read as the host's index nor written by a generation run there.

import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_DIAGNOSTICS_PATH,
  DEFAULT_INDEX_PATH,
  DEFAULT_MANIFEST_PATH,
  DEFAULT_REPO_ROOT,
  DEFAULT_VARIANTS_PATH,
} from '../retrieval/generate-trigger-index.mjs';
import { defaultIndexPath } from '../retrieval/lookup-trigger-index.mjs';
import {
  HOST_INDEX_RELATIVE,
  HOST_SETTINGS_FILE,
  hostIndexDir,
  callerRepoRoot,
  hostIndexPath,
  isHostRepository,
  owningHostRoot,
} from '../retrieval/lib/host-index.mjs';

const RETRIEVAL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'retrieval');
const GENERATOR_SCRIPT = path.join(RETRIEVAL_DIR, 'generate-trigger-index.mjs');
const LOOKUP_SCRIPT = path.join(RETRIEVAL_DIR, 'lookup-trigger-index.mjs');
const UPGRADE_SCRIPT = path.resolve(RETRIEVAL_DIR, '..', 'spec', 'upgrade-legacy.mjs');
const PACKAGED_FILES = [
  DEFAULT_INDEX_PATH,
  DEFAULT_MANIFEST_PATH,
  DEFAULT_DIAGNOSTICS_PATH,
  DEFAULT_VARIANTS_PATH,
];
const SIDECAR_NAMES = ['corpus-manifest.json', 'generation-diagnostics.json', 'phrase-variants.json'];
/** Carried by both packets of the linked fixture, so scope alone separates them. */
const SHARED_PHRASE = 'shared lookup phrase';

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  // The temp root is resolved first, because macOS spells it through a symlink
  // that git reports in its physical form and the comparison would never match.
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), prefix));
  tempRoots.add(dir);
  return dir;
}

function writeDoc(root: string, relativePath: string, content: string): string {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
  return absolute;
}

function frontmatter(phrases: string[]): string {
  return ['---', 'title: "Doc"', 'trigger_phrases:', ...phrases.map((p) => `  - "${p}"`), '---', '', '# Doc', '']
    .join('\n');
}

function sha256File(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function packagedHashes(): Record<string, string> {
  return Object.fromEntries(PACKAGED_FILES.map((file) => [path.basename(file), sha256File(file)]));
}

interface FakeHost {
  /** Temp git repository standing in for a host that vendors Skilled. */
  root: string;
  /** Stand-in source tree living outside the host root, as an install does. */
  standIn: string;
}

/**
 * Builds the layout a host gets from an install: a git repository holding its
 * own packets, and a `.skilled` entry pointing at a source tree outside itself.
 * The stand-in carries the spec-kit sentinel the corpus walker looks for, so the
 * generator selects a source root instead of refusing the tree.
 */
function makeHost(): FakeHost {
  const root = makeTempDir('speckit-host-');
  const standIn = makeTempDir('speckit-host-source-');
  writeDoc(standIn, 'skills/system-spec-kit/SKILL.md', frontmatter(['vendored framework skill']));
  fs.symlinkSync(standIn, path.join(root, '.skilled'), 'dir');
  writeDoc(root, 'specs/billing/001-invoices/spec.md', frontmatter(['host packet lookup', 'invoices and credits']));
  execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
  return { root, standIn };
}

function runScript(script: string, cwd: string, args: string[] = []) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
}

interface LinkedProject {
  /** Host repository holding the vendored tree, the corpus and the index. */
  host: string;
  /** Project repository that links into the host and keeps no index of its own. */
  project: string;
}

/**
 * Builds the layout a project gets when it keeps no corpus of its own: a git
 * repository whose `.skilled` and `specs` entries both link into a host that
 * holds the tree and the index over it. The host's two packets deliberately
 * share one phrase, so only the scope separates what a lookup finds.
 */
function makeLinkedProject(): LinkedProject {
  const host = makeTempDir('speckit-linked-host-');
  writeDoc(host, '.skilled/skills/system-spec-kit/SKILL.md', frontmatter(['vendored framework skill']));
  fs.mkdirSync(path.join(host, 'vendor', '.skilled'), { recursive: true });
  writeDoc(host, 'specs/proj/001-x/spec.md', frontmatter(['linked project packet', SHARED_PHRASE]));
  writeDoc(host, 'specs/other/001-y/spec.md', frontmatter(['other track packet', SHARED_PHRASE]));
  execFileSync('git', ['init', '--quiet'], { cwd: host, stdio: 'ignore' });

  const generation = runScript(GENERATOR_SCRIPT, host, ['--repo-root', host, '--out', hostIndexPath(host)]);
  expect(generation.status, generation.stderr).toBe(0);

  const project = makeTempDir('speckit-linked-project-');
  fs.symlinkSync(path.join(host, 'vendor', '.skilled'), path.join(project, '.skilled'), 'dir');
  fs.symlinkSync(path.join(host, 'specs', 'proj'), path.join(project, 'specs'), 'dir');
  execFileSync('git', ['init', '--quiet'], { cwd: project, stdio: 'ignore' });
  return { host, project };
}

// ───────────────────────────────────────────────────────────────────
// Host detection
// ───────────────────────────────────────────────────────────────────

describe('isHostRepository', () => {
  it('treats a real .skilled directory in the root as the framework checkout', () => {
    const root = makeTempDir('speckit-host-local-');
    fs.mkdirSync(path.join(root, '.skilled'));

    expect(isHostRepository(root)).toBe(false);
  });

  it('returns false for this repository, which carries the source tree itself', () => {
    expect(isHostRepository(DEFAULT_REPO_ROOT)).toBe(false);
  });

  it('treats a .skilled entry resolving outside the root as a host', () => {
    const host = makeHost();

    expect(isHostRepository(host.root)).toBe(true);
  });

  it('treats a root carrying its own index directory as a host', () => {
    const root = makeTempDir('speckit-host-indexed-');
    fs.mkdirSync(path.join(root, '.speckit-index'));

    expect(isHostRepository(root)).toBe(true);
  });

  it('returns false for a root carrying no source tree at all', () => {
    const root = makeTempDir('speckit-host-bare-');

    expect(isHostRepository(root)).toBe(false);
  });
});

describe('callerRepoRoot', () => {
  it('resolves the checkout the caller works in', () => {
    const host = makeHost();

    expect(fs.realpathSync(callerRepoRoot(host.root) ?? '')).toBe(fs.realpathSync(host.root));
  });

  it('reports null outside any checkout rather than guessing a root', () => {
    const outside = makeTempDir('speckit-host-nogit-');

    expect(callerRepoRoot(outside)).toBeNull();
  });

  it('places the host index under the root', () => {
    const root = makeTempDir('speckit-host-path-');

    expect(HOST_INDEX_RELATIVE).toBe('.speckit-index/trigger-index.json');
    expect(hostIndexPath(root)).toBe(path.join(root, '.speckit-index', 'trigger-index.json'));
  });
});

// ───────────────────────────────────────────────────────────────────
// Lookup
// ───────────────────────────────────────────────────────────────────

describe('lookup index selection', () => {
  it('reads the host index when the caller is a host and no --index is given', () => {
    const host = makeHost();
    const index = hostIndexPath(host.root);
    const generation = runScript(GENERATOR_SCRIPT, host.root, ['--repo-root', host.root, '--out', index]);
    expect(generation.stderr).not.toContain('generate-trigger-index: indexing');
    expect(generation.status).toBe(0);

    expect(defaultIndexPath(host.root)).toBe(index);

    const lookup = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toContain('specs/billing/001-invoices/spec.md');
    expect(lookup.stdout).toMatch(/^source\s*: \.speckit-index\/trigger-index\.json$/mu);
  });

  it('keeps the packaged index when the caller carries no host index', () => {
    const root = makeTempDir('speckit-host-plain-');

    expect(defaultIndexPath(root)).toBe(DEFAULT_INDEX_PATH);
  });
});

// ───────────────────────────────────────────────────────────────────
// Generation
// ───────────────────────────────────────────────────────────────────

describe('bare generation inside a host', () => {
  it('writes the host index and its sidecars without touching the packaged artifact', () => {
    const host = makeHost();
    const before = packagedHashes();

    const generation = runScript(GENERATOR_SCRIPT, host.root);

    expect(generation.status).toBe(0);
    expect(generation.stderr).not.toContain('generate-trigger-index: indexing');
    expect(fs.existsSync(hostIndexPath(host.root))).toBe(true);
    for (const name of SIDECAR_NAMES) {
      expect(fs.existsSync(path.join(host.root, '.speckit-index', name)), name).toBe(true);
    }
    expect(packagedHashes()).toEqual(before);
  });

  it('checks the same host index a bare generation writes', () => {
    const host = makeHost();
    expect(runScript(GENERATOR_SCRIPT, host.root).status).toBe(0);

    const check = runScript(GENERATOR_SCRIPT, host.root, ['--check']);

    expect(check.status).toBe(0);
    expect(check.stdout).toContain(hostIndexPath(host.root));
    expect(check.stdout).toContain('trigger index matches the corpus');
  });
});

// ───────────────────────────────────────────────────────────────────
// Project linked into a host
// ───────────────────────────────────────────────────────────────────

describe('owning host resolution', () => {
  it('names the host holding the linked tree, whose index the project reads', () => {
    const { host, project } = makeLinkedProject();

    expect(fs.realpathSync(owningHostRoot(project) ?? '')).toBe(fs.realpathSync(host));
    expect(defaultIndexPath(project)).toBe(hostIndexPath(host));
  });

  it('names no owner for the host itself, which holds its own tree', () => {
    const { host } = makeLinkedProject();

    expect(owningHostRoot(host)).toBeNull();
  });

  it('falls back to the packaged index when the linked tree has no index of its own', () => {
    const host = makeTempDir('speckit-unindexed-host-');
    const vendored = path.join(host, 'vendor', '.skilled');
    fs.mkdirSync(vendored, { recursive: true });
    execFileSync('git', ['init', '--quiet'], { cwd: host, stdio: 'ignore' });

    const project = makeTempDir('speckit-unindexed-project-');
    fs.symlinkSync(vendored, path.join(project, '.skilled'), 'dir');
    execFileSync('git', ['init', '--quiet'], { cwd: project, stdio: 'ignore' });

    expect(owningHostRoot(project)).toBeNull();
    expect(defaultIndexPath(project)).toBe(DEFAULT_INDEX_PATH);

    const lookup = runScript(LOOKUP_SCRIPT, project, ['--scoring-only', '--', SHARED_PHRASE]);

    expect(lookup.stdout).not.toMatch(/^paths\s*:/mu);
  });
});

describe('lookup from a project linked into a host', () => {
  it('reads the index the project keeps itself before its host is asked', () => {
    const { host, project } = makeLinkedProject();
    const own = path.join(project, '.speckit-index', 'trigger-index.json');
    fs.mkdirSync(path.dirname(own), { recursive: true });
    fs.copyFileSync(path.join(host, '.speckit-index', 'trigger-index.json'), own);

    expect(defaultIndexPath(project)).toBe(own);

    const lookup = runScript(LOOKUP_SCRIPT, project, ['--scoring-only', '--', SHARED_PHRASE]);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toMatch(/^source\s*: \.speckit-index\/trigger-index\.json$/mu);
  });

  it('reads the host index and scopes itself to the folder the project links to', () => {
    const { host, project } = makeLinkedProject();

    const lookup = runScript(LOOKUP_SCRIPT, project, ['--scoring-only', '--', SHARED_PHRASE]);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toMatch(/^source\s*: .*\.speckit-index\/trigger-index\.json$/mu);
    expect(lookup.stdout).toContain(path.relative(project, hostIndexPath(host)));
    expect(lookup.stdout).toMatch(/^paths\s+: relative to /mu);
    expect(lookup.stdout).toContain(`relative to ${path.relative(project, host)}`);
    expect(lookup.stdout).toMatch(/^scope\s+: specs\/proj$/mu);
    expect(lookup.stdout).toContain('specs/proj/001-x/spec.md');
    expect(lookup.stdout).not.toContain('specs/other/001-y/spec.md');
  });

  it('drops the default scope when --spec-folder is given an empty value', () => {
    const { project } = makeLinkedProject();

    const lookup = runScript(LOOKUP_SCRIPT, project, ['--scoring-only', '--spec-folder', '', '--', SHARED_PHRASE]);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toMatch(/^scope\s+: \(unscoped\)$/mu);
    expect(lookup.stdout).toContain('specs/proj/001-x/spec.md');
    expect(lookup.stdout).toContain('specs/other/001-y/spec.md');
  });
});

describe('bare generation inside a project linked into a host', () => {
  it('refuses to index the project and names the host that holds the corpus', () => {
    const { host, project } = makeLinkedProject();
    const before = packagedHashes();

    const generation = runScript(GENERATOR_SCRIPT, project);

    expect(generation.status).toBe(2);
    expect(generation.stdout).toBe('');
    expect(generation.stderr).toContain(`links its tree from ${fs.realpathSync(host)}`);
    expect(generation.stderr).toContain(`run this from ${fs.realpathSync(host)}`);
    expect(generation.stderr).toContain('--repo-root and --out');
    expect(fs.existsSync(path.join(project, '.speckit-index'))).toBe(false);
    expect(packagedHashes()).toEqual(before);
  });

  it('refuses a bare --check for the same reason', () => {
    const { host, project } = makeLinkedProject();
    const before = packagedHashes();

    const check = runScript(GENERATOR_SCRIPT, project, ['--check']);

    expect(check.status).toBe(2);
    expect(check.stderr).toContain(`links its tree from ${fs.realpathSync(host)}`);
    expect(fs.existsSync(path.join(project, '.speckit-index'))).toBe(false);
    expect(packagedHashes()).toEqual(before);
  });

  it('does not refuse a project that keeps its own index directory', () => {
    const { project } = makeLinkedProject();
    fs.mkdirSync(path.join(project, '.speckit-index'), { recursive: true });

    const generation = runScript(GENERATOR_SCRIPT, project);

    // The linked tree here carries no source sentinel, so the run stops later on
    // the corpus it cannot walk. The refusal is what this case is about, and it
    // is the only outcome that exits 2 and names the host.
    expect(generation.stderr).not.toContain('links its tree from');
    expect(generation.status).not.toBe(2);
  });
});

// ───────────────────────────────────────────────────────────────────
// Host-named index directory
// ───────────────────────────────────────────────────────────────────

function nameIndexDir(root: string, indexDir: unknown): void {
  fs.writeFileSync(path.join(root, HOST_SETTINGS_FILE), JSON.stringify({ indexDir }), 'utf8');
}

describe('host-named index directory', () => {
  it('keeps the default directory when the host names none', () => {
    const host = makeHost();

    expect(hostIndexDir(host.root)).toBe('.speckit-index');
    expect(runScript(GENERATOR_SCRIPT, host.root).status).toBe(0);
    expect(fs.existsSync(path.join(host.root, '.speckit-index', 'trigger-index.json'))).toBe(true);
  });

  it('generates into the named directory and the lookup reads it', () => {
    const host = makeHost();
    nameIndexDir(host.root, '.index');

    const generation = runScript(GENERATOR_SCRIPT, host.root);

    expect(generation.status, generation.stderr).toBe(0);
    expect(hostIndexPath(host.root)).toBe(path.join(host.root, '.index', 'trigger-index.json'));
    for (const name of ['trigger-index.json', ...SIDECAR_NAMES]) {
      expect(fs.existsSync(path.join(host.root, '.index', name)), name).toBe(true);
    }
    expect(fs.existsSync(path.join(host.root, '.speckit-index'))).toBe(false);

    const lookup = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toMatch(/^source\s*: \.index\/trigger-index\.json$/mu);
    expect(lookup.stdout).toContain('specs/billing/001-invoices/spec.md');
  });

  it('counts the named directory, not the default, as the host signal', () => {
    const named = makeTempDir('speckit-host-named-');
    nameIndexDir(named, '.index');
    fs.mkdirSync(path.join(named, '.index'));
    const stale = makeTempDir('speckit-host-stale-');
    nameIndexDir(stale, '.index');
    fs.mkdirSync(path.join(stale, '.speckit-index'));

    expect(isHostRepository(named)).toBe(true);
    expect(isHostRepository(stale)).toBe(false);
  });

  it('lets a linked project read the directory its owning host names', () => {
    const host = makeTempDir('speckit-named-host-');
    nameIndexDir(host, '.index');
    writeDoc(host, '.skilled/skills/system-spec-kit/SKILL.md', frontmatter(['vendored framework skill']));
    fs.mkdirSync(path.join(host, 'vendor', '.skilled'), { recursive: true });
    writeDoc(host, 'specs/proj/001-x/spec.md', frontmatter(['linked project packet', SHARED_PHRASE]));
    execFileSync('git', ['init', '--quiet'], { cwd: host, stdio: 'ignore' });
    const generation = runScript(GENERATOR_SCRIPT, host, ['--repo-root', host, '--out', hostIndexPath(host)]);
    expect(generation.status, generation.stderr).toBe(0);

    const project = makeTempDir('speckit-named-project-');
    fs.symlinkSync(path.join(host, 'vendor', '.skilled'), path.join(project, '.skilled'), 'dir');
    fs.symlinkSync(path.join(host, 'specs', 'proj'), path.join(project, 'specs'), 'dir');
    execFileSync('git', ['init', '--quiet'], { cwd: project, stdio: 'ignore' });

    expect(fs.existsSync(path.join(project, HOST_SETTINGS_FILE))).toBe(false);
    expect(defaultIndexPath(project)).toBe(path.join(host, '.index', 'trigger-index.json'));

    const lookup = runScript(LOOKUP_SCRIPT, project, ['--scoring-only', '--', SHARED_PHRASE]);

    expect(lookup.status).toBe(0);
    expect(lookup.stdout).toMatch(/^source\s*: .*\.index\/trigger-index\.json$/mu);
    expect(lookup.stdout).toContain('specs/proj/001-x/spec.md');
  });

  it.each([
    ['../outside', 'inside the repository root'],
    ['/abs/index', 'inside the repository root'],
    ['.', 'inside the repository root'],
    ['.skilled/index', 'must not lie inside .skilled/'],
    ['specs/index', 'must not lie inside specs/'],
    ['.SKILLED/index', 'must not lie inside .skilled/'],
    ['Specs/index', 'must not lie inside specs/'],
    ['.git/idx', 'must not lie inside .git/'],
    ['node_modules/x', 'must not lie inside node_modules/'],
    ['', 'non-empty string'],
    [42, 'non-empty string'],
  ])('rejects indexDir %j rather than falling back', (indexDir, message) => {
    const root = makeTempDir('speckit-host-bad-');
    nameIndexDir(root, indexDir);

    expect(() => hostIndexDir(root)).toThrow(message);
  });

  it('ignores blank space around the directory name', () => {
    const root = makeTempDir('speckit-host-padded-');
    nameIndexDir(root, ' .index ');

    expect(hostIndexDir(root)).toBe('.index');
  });

  it('rejects a directory that is a link to somewhere outside the host', () => {
    const root = makeTempDir('speckit-host-linked-out-');
    const outside = makeTempDir('speckit-host-elsewhere-');
    fs.symlinkSync(outside, path.join(root, '.index'), 'dir');
    nameIndexDir(root, '.index');

    expect(() => hostIndexDir(root)).toThrow('inside the repository root');

    // The directory need not exist yet for a link above it to carry the write out.
    nameIndexDir(root, '.index/nested');
    expect(() => hostIndexDir(root)).toThrow('inside the repository root');
  });

  it('rejects a directory that is a link into the corpus', () => {
    const root = makeTempDir('speckit-host-linked-in-');
    fs.mkdirSync(path.join(root, 'specs', 'track'), { recursive: true });
    fs.symlinkSync(path.join(root, 'specs', 'track'), path.join(root, '.index'), 'dir');
    nameIndexDir(root, '.index');

    expect(() => hostIndexDir(root)).toThrow('must not lie inside specs/');
  });

  it('rejects a name that is already a regular file', () => {
    const root = makeTempDir('speckit-host-file-');
    fs.writeFileSync(path.join(root, '.index'), '', 'utf8');
    nameIndexDir(root, '.index');

    expect(() => hostIndexDir(root)).toThrow('not a directory');
  });

  it('exits 2 from the legacy upgrade on a setting it cannot honor', () => {
    const host = makeHost();
    nameIndexDir(host.root, '../outside');

    const upgrade = runScript(UPGRADE_SCRIPT, host.root, ['--refresh-markers']);

    expect(upgrade.status, upgrade.stderr).toBe(2);
    expect(upgrade.stderr).toContain(HOST_SETTINGS_FILE);
    expect(upgrade.stderr).not.toContain('    at ');
  });

  it('exits 2 from both scripts on a setting it cannot honor', () => {
    const host = makeHost();
    nameIndexDir(host.root, '../outside');

    const lookup = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);
    const generation = runScript(GENERATOR_SCRIPT, host.root);

    expect(lookup.status).toBe(2);
    expect(lookup.stderr).toContain(HOST_SETTINGS_FILE);
    expect(generation.status).toBe(2);
    expect(generation.stderr).toContain(HOST_SETTINGS_FILE);
    expect(fs.existsSync(path.join(host.root, '.speckit-index'))).toBe(false);
  });

  it.each([['[".index"]'], ['".index"'], ['null']])('rejects settings %s that are JSON but not an object', (raw) => {
    const root = makeTempDir('speckit-host-notobject-');
    fs.writeFileSync(path.join(root, HOST_SETTINGS_FILE), raw, 'utf8');

    expect(() => hostIndexDir(root)).toThrow('expected a JSON object');
  });

  it('gives a linked project the packaged index when its host names a folder holding no index', () => {
    const { host, project } = makeLinkedProject();
    // The host still carries an index in the default folder, which the setting
    // now disowns, so reading it would serve an index the host no longer names.
    expect(fs.existsSync(path.join(host, '.speckit-index', 'trigger-index.json'))).toBe(true);
    nameIndexDir(host, '.index');

    expect(owningHostRoot(project)).toBeNull();
    expect(defaultIndexPath(project)).toBe(DEFAULT_INDEX_PATH);
  });

  it('says on stderr that a named folder holds no index while the default one still does', () => {
    const host = makeHost();
    expect(runScript(GENERATOR_SCRIPT, host.root).status).toBe(0);
    const before = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);
    expect(before.stderr).toBe('');

    nameIndexDir(host.root, '.index');
    const lookup = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);

    expect(lookup.status).not.toBe(2);
    expect(lookup.stderr).toContain('.speckit-index/trigger-index.json is not read');
    expect(lookup.stderr).toContain('.index/');
    expect(lookup.stdout).not.toContain('specs/billing/001-invoices/spec.md');

    // Once the named folder holds an index the leftover is no longer worth a line.
    expect(runScript(GENERATOR_SCRIPT, host.root).status).toBe(0);
    const after = runScript(LOOKUP_SCRIPT, host.root, ['--scoring-only', '--', 'host packet lookup']);
    expect(after.stderr).toBe('');
    expect(after.stdout).toContain('specs/billing/001-invoices/spec.md');
  });

  it('rejects a settings file that is not JSON', () => {
    const root = makeTempDir('speckit-host-badjson-');
    fs.writeFileSync(path.join(root, HOST_SETTINGS_FILE), '{ indexDir: ', 'utf8');

    expect(() => hostIndexDir(root)).toThrow('not valid JSON');
  });
});
