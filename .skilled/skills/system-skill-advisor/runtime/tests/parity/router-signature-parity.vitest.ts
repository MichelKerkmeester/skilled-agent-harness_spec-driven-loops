// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Router Signature Parity Tests
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// TEST: Both Signatures Carry The Router Probe
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { computeAdvisorSourceSignature } from '../../lib/freshness.js';
import * as skillAdvisorPlugin from '../../../../../../.opencode/plugins/system-skill-advisor.js';

// The plugin copy is plain JavaScript, so the suite names the value it needs rather
// than relying on a declaration file for that module. The signature hangs off the
// plugin object because the loader guard keeps the module to its default export.
const pluginSourceSignature = (
  skillAdvisorPlugin.default as unknown as {
    advisorSourceSignature: (workspaceRoot: string) => string;
  }
).advisorSourceSignature;

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

// The plugin signature hashes the skills under the source root of the repository it
// is handed, and both roots are recognised by this authored sentinel, so the fixture
// carries it or the plugin refuses to produce a signature at all.
const REPO_ROOT_SENTINEL_RELATIVE_PATH = join('.skilled', 'skills', 'system-spec-kit', 'SKILL.md');
const ROUTER_TEXT = '## MACHINE ROUTER\nINTENT_SIGNALS = ["alpha"]\n';
// Same length as ROUTER_TEXT, written back with the same mtime, so only the content
// hash can report the edit and neither the size nor the mtime probe can.
const EDITED_ROUTER_TEXT = '## MACHINE ROUTER\nINTENT_SIGNALS = ["omega"]\n';
const PINNED_MTIME_MS = 1_000;

// ───────────────────────────────────────────────────────────────
// 2. FIXTURE
// ───────────────────────────────────────────────────────────────

function writeFile(filePath: string, content: string, mtimeMs: number): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  const mtime = new Date(mtimeMs);
  utimesSync(filePath, mtime, mtime);
}

function writeSkill(
  workspaceRoot: string,
  slug: string,
  routerText: string | null,
  mtimeMs: number,
): void {
  const skillDirectory = join(workspaceRoot, '.skilled', 'skills', slug);
  writeFile(join(skillDirectory, 'SKILL.md'), `# ${slug}\n`, mtimeMs);
  writeFile(join(skillDirectory, 'graph-metadata.json'), `{"skill_id":"${slug}"}\n`, mtimeMs);
  if (routerText !== null) {
    writeFile(join(skillDirectory, 'ROUTER.md'), routerText, mtimeMs);
  }
}

// One fixture workspace shape for every case: a hub skill that carries a router file
// unless the case needs a tree whose skills carry none at all, a skill that carries
// none, and the sentinel that makes the tree a source root.
function createFixtureWorkspace(options: { withRouterSkill?: boolean } = {}): string {
  const workspaceRoot = join(
    tmpdir(),
    `advisor-router-parity-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  writeFile(join(workspaceRoot, REPO_ROOT_SENTINEL_RELATIVE_PATH), '# system-spec-kit\n', PINNED_MTIME_MS);
  if (options.withRouterSkill ?? true) {
    writeSkill(workspaceRoot, 'hub-alpha', ROUTER_TEXT, PINNED_MTIME_MS);
  }
  writeSkill(workspaceRoot, 'plain-beta', null, PINNED_MTIME_MS);
  return workspaceRoot;
}

function bothSignatures(workspaceRoot: string): { freshness: string; plugin: string } {
  return {
    freshness: computeAdvisorSourceSignature(workspaceRoot),
    plugin: pluginSourceSignature(workspaceRoot),
  };
}

function routerPath(workspaceRoot: string, slug: string): string {
  return join(workspaceRoot, '.skilled', 'skills', slug, 'ROUTER.md');
}

// ───────────────────────────────────────────────────────────────
// 3. REFERENCE SIGNATURES
// ───────────────────────────────────────────────────────────────

// Each side is rebuilt here from the two per-skill probes it hashed before it looked
// for a router file, in the field order and separators that side uses. Two runs of the
// current code cannot show a skill without the file keeps that value, because both
// runs would carry the same extra part.

const FRESHNESS_SKILL_ROOT_RELATIVE_PATH = join('.skilled', 'skills');
const FRESHNESS_ADVISOR_SCRIPT_ROOT_RELATIVE_PATH = join(
  FRESHNESS_SKILL_ROOT_RELATIVE_PATH,
  'system-skill-advisor',
  'runtime',
  'scripts',
);
const FRESHNESS_REQUIRED_SCRIPT_RELATIVE_PATHS = [
  join(FRESHNESS_ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor.py'),
  join(FRESHNESS_ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor_runtime.py'),
  join(FRESHNESS_ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_graph_compiler.py'),
];
const FRESHNESS_SQLITE_ARTIFACT_RELATIVE_PATH = join(
  FRESHNESS_SKILL_ROOT_RELATIVE_PATH,
  'system-skill-advisor',
  'runtime',
  'database',
  'skill-graph.sqlite',
);
const FRESHNESS_JSON_ARTIFACT_RELATIVE_PATH = join(
  FRESHNESS_ADVISOR_SCRIPT_ROOT_RELATIVE_PATH,
  'skill-graph.json',
);

// The plugin finds the source root from the sentinel the fixture carries and hashes
// the skills beneath it, so the fixture root stands in for the repository root.
const PLUGIN_SOURCE_ROOT_RELATIVE_PATH = '.skilled';
const PLUGIN_SKILL_ROOT_RELATIVE_PATH = 'skills';
const PLUGIN_ADVISOR_ROOT_RELATIVE_PATH = join(
  PLUGIN_SKILL_ROOT_RELATIVE_PATH,
  'system-skill-advisor',
  'runtime',
);
const PLUGIN_SCRIPT_RELATIVE_PATHS = [
  join(PLUGIN_ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_advisor.py'),
  join(PLUGIN_ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_advisor_runtime.py'),
  join(PLUGIN_ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_graph_compiler.py'),
];
const PLUGIN_JSON_RELATIVE_PATH = join(PLUGIN_ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill-graph.json');

function repositoryRoot(): string {
  let directory = dirname(fileURLToPath(new URL('.', import.meta.url)));
  while (!existsSync(join(directory, REPO_ROOT_SENTINEL_RELATIVE_PATH))) {
    const parent = dirname(directory);
    if (parent === directory) {
      throw new Error('no repository root above the parity suite');
    }
    directory = parent;
  }
  return directory;
}

// The plugin spells its own implementation files from its module URL, which sits in
// the `.opencode` tree, and the digest carries those path strings, so this side spells
// them the same way and reaches the same files through the committed links.
const PLUGIN_OPENCODE_DIRECTORY = join(repositoryRoot(), '.opencode');
const PLUGIN_IMPLEMENTATION_PATHS = [
  join(PLUGIN_OPENCODE_DIRECTORY, 'bin', 'skill-advisor.cjs'),
  join(PLUGIN_OPENCODE_DIRECTORY, 'bin', 'system-skill-advisor-launcher.cjs'),
  join(PLUGIN_OPENCODE_DIRECTORY, 'skills', 'system-skill-advisor', 'runtime', 'advisor-server.ts'),
  join(
    PLUGIN_OPENCODE_DIRECTORY,
    'skills',
    'system-skill-advisor',
    'runtime',
    'dist',
    'runtime',
    'advisor-server.js',
  ),
];

interface SignaturePart {
  readonly label: string;
  readonly text: string;
}

interface FileProbeSummary {
  readonly mtimeMs: number;
  readonly size: number;
  readonly contentHash: string;
}

function probeOf(filePath: string): FileProbeSummary | null {
  if (!existsSync(filePath)) {
    return null;
  }
  const stats = statSync(filePath);
  return {
    mtimeMs: stats.mtimeMs,
    size: stats.size,
    contentHash: createHash('sha256').update(readFileSync(filePath)).digest('hex'),
  };
}

function freshnessPart(label: string, filePath: string): SignaturePart {
  const probe = probeOf(filePath);
  return {
    label,
    text: probe
      ? `${label}:${filePath}:${probe.mtimeMs}:${probe.size}:${probe.contentHash}\n`
      : `${label}:missing\n`,
  };
}

function pluginPart(label: string, filePath: string): SignaturePart {
  const probe = probeOf(filePath);
  return {
    label,
    text: probe
      ? `${label}\u001f${filePath}\u001f${probe.mtimeMs}\u001f${probe.size}\u001f${probe.contentHash}\u001e`
      : `${label}\u001fmissing\u001e`,
  };
}

function digestOf(parts: readonly SignaturePart[]): string {
  const hash = createHash('sha256');
  for (const part of parts) {
    hash.update(part.text);
  }
  return hash.digest('hex');
}

// The fixture carries plain directories only, so the branch that admits a private
// skill link on the freshness side has nothing to list here.
function sortedSkillSlugs(skillRoot: string): string[] {
  return readdirSync(skillRoot, { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.') && entry.isDirectory())
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function referenceFreshnessParts(workspaceRoot: string): SignaturePart[] {
  const root = resolve(workspaceRoot);
  const skillRoot = join(root, FRESHNESS_SKILL_ROOT_RELATIVE_PATH);
  const parts: SignaturePart[] = [];
  for (const skillSlug of sortedSkillSlugs(skillRoot)) {
    const skillDirectory = join(skillRoot, skillSlug);
    if (!existsSync(join(skillDirectory, 'SKILL.md'))) {
      continue;
    }
    parts.push(freshnessPart(`skill:${skillSlug}:SKILL.md`, join(skillDirectory, 'SKILL.md')));
    parts.push(freshnessPart(
      `skill:${skillSlug}:graph-metadata.json`,
      join(skillDirectory, 'graph-metadata.json'),
    ));
  }
  for (const relativePath of FRESHNESS_REQUIRED_SCRIPT_RELATIVE_PATHS) {
    parts.push(freshnessPart(relativePath, join(root, relativePath)));
  }
  parts.push(freshnessPart(
    FRESHNESS_SQLITE_ARTIFACT_RELATIVE_PATH,
    join(root, FRESHNESS_SQLITE_ARTIFACT_RELATIVE_PATH),
  ));
  parts.push(freshnessPart(
    FRESHNESS_JSON_ARTIFACT_RELATIVE_PATH,
    join(root, FRESHNESS_JSON_ARTIFACT_RELATIVE_PATH),
  ));
  return parts;
}

function referencePluginParts(workspaceRoot: string): SignaturePart[] {
  const sourceRoot = resolve(workspaceRoot, PLUGIN_SOURCE_ROOT_RELATIVE_PATH);
  const parts: SignaturePart[] = PLUGIN_IMPLEMENTATION_PATHS
    .map(sourcePath => pluginPart(`implementation:${sourcePath}`, sourcePath));
  const skillRoot = join(sourceRoot, PLUGIN_SKILL_ROOT_RELATIVE_PATH);
  for (const skillSlug of sortedSkillSlugs(skillRoot)) {
    const skillDirectory = join(skillRoot, skillSlug);
    parts.push(pluginPart(`skill:${skillSlug}:SKILL.md`, join(skillDirectory, 'SKILL.md')));
    parts.push(pluginPart(
      `skill:${skillSlug}:graph-metadata.json`,
      join(skillDirectory, 'graph-metadata.json'),
    ));
  }
  for (const relativePath of PLUGIN_SCRIPT_RELATIVE_PATHS) {
    parts.push(pluginPart(relativePath, join(sourceRoot, relativePath)));
  }
  const databaseDirectory = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR
    ?? join(sourceRoot, PLUGIN_ADVISOR_ROOT_RELATIVE_PATH, 'database');
  parts.push(pluginPart('skill-graph.sqlite', join(databaseDirectory, 'skill-graph.sqlite')));
  parts.push(pluginPart(PLUGIN_JSON_RELATIVE_PATH, join(sourceRoot, PLUGIN_JSON_RELATIVE_PATH)));
  return parts;
}

let workspaces: string[] = [];

afterEach(() => {
  for (const workspace of workspaces) {
    rmSync(workspace, { recursive: true, force: true });
  }
  workspaces = [];
});

describe('router signature parity', () => {
  it('changes both signatures when only ROUTER.md is edited', () => {
    const workspaceRoot = createFixtureWorkspace();
    workspaces.push(workspaceRoot);
    const before = bothSignatures(workspaceRoot);

    writeFile(routerPath(workspaceRoot, 'hub-alpha'), EDITED_ROUTER_TEXT, PINNED_MTIME_MS);
    const after = bothSignatures(workspaceRoot);

    expect(after.freshness).not.toBe(before.freshness);
    expect(after.plugin).not.toBe(before.plugin);
  });

  it('restores both signatures byte for byte when a skill carries no ROUTER.md', () => {
    const workspaceRoot = createFixtureWorkspace();
    workspaces.push(workspaceRoot);
    const withoutRouter = bothSignatures(workspaceRoot);

    // The file is optional, so its presence has to be the only thing that moves the
    // signature: dropping it must land on the exact value computed before it appeared.
    const plainRouterPath = routerPath(workspaceRoot, 'plain-beta');
    writeFile(plainRouterPath, ROUTER_TEXT, PINNED_MTIME_MS);
    const withRouter = bothSignatures(workspaceRoot);
    rmSync(plainRouterPath);
    const restored = bothSignatures(workspaceRoot);

    expect(withRouter.freshness).not.toBe(withoutRouter.freshness);
    expect(withRouter.plugin).not.toBe(withoutRouter.plugin);
    expect(restored).toEqual(withoutRouter);

    // Both runs above are this code, so they agree even when it writes a part for a
    // file that is not there. A tree whose skills carry no router file at all is
    // pinned to the streams each side hashed before it probed for one. Equality with
    // that digest leaves no part unaccounted for, and the labels name the parts the
    // value is built from.
    const routerFreeRoot = createFixtureWorkspace({ withRouterSkill: false });
    workspaces.push(routerFreeRoot);
    const freshnessParts = referenceFreshnessParts(routerFreeRoot);
    const pluginParts = referencePluginParts(routerFreeRoot);

    expect(freshnessParts.filter(part => part.label.includes('ROUTER.md'))).toEqual([]);
    expect(pluginParts.filter(part => part.label.includes('ROUTER.md'))).toEqual([]);
    expect(computeAdvisorSourceSignature(routerFreeRoot)).toBe(digestOf(freshnessParts));
    expect(pluginSourceSignature(routerFreeRoot)).toBe(digestOf(pluginParts));
  });
});
