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
  callerRepoRoot,
  hostIndexPath,
  isHostRepository,
  owningHostRoot,
} from '../retrieval/lib/host-index.mjs';

const RETRIEVAL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'retrieval');
const GENERATOR_SCRIPT = path.join(RETRIEVAL_DIR, 'generate-trigger-index.mjs');
const LOOKUP_SCRIPT = path.join(RETRIEVAL_DIR, 'lookup-trigger-index.mjs');
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
