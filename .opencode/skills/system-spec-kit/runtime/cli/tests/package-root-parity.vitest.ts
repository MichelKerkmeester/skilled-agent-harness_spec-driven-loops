// ───────────────────────────────────────────────────────────────────
// TEST: Root resolvers agree on the same trees
// ───────────────────────────────────────────────────────────────────
// Three root resolvers survive in the package, one per runtime boundary: the
// shipped-as-source repository resolver, the compiled package resolver, and the
// shell resolver. Fed the same trees they must name the same places, and the
// package root must sit where the repository resolver says the skill lives.
//
// Every tree is built in each source-root layout a checkout can hold: a real
// `.opencode/` tree, a real `.skilled/` tree, and a real `.skilled/` tree with
// `.opencode` linked to it, which a caller reaches through either name.

import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';
import { findPackageRoot, resolvePackageRoot, PACKAGE_ROOT_MARKERS } from '@spec-kit/shared/workspace/package-root';
// @ts-expect-error shipped as source with a sibling declaration file
import { findRepoRoot, hoistAboveOpencodeTree, REPO_ROOT_SENTINEL } from '@spec-kit/shared/workspace/repo-root.mjs';

const SHELL_COMMON = path.resolve(__dirname, '..', 'lib', 'shell-common.sh');
const SKILL_SUBPATH = path.join('skills', 'system-spec-kit');

interface Tree {
  readonly name: string;
  readonly markers: readonly string[];
  readonly expectsPackageRoot: boolean;
}

interface Layout {
  readonly name: string;
  readonly realRoot: string;
  readonly linked: boolean;
  readonly entries: readonly string[];
}

const FULL_TREE: Tree = { name: 'full tree', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true };

const TREES: readonly Tree[] = [
  FULL_TREE,
  { name: 'missing runtime/cli', markers: ['shared', 'runtime'], expectsPackageRoot: false },
  { name: 'missing runtime and runtime/cli', markers: ['shared'], expectsPackageRoot: false },
];

const TODAY: Layout = { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] };
const SKILLED_ONLY: Layout = { name: 'skilled-only', realRoot: '.skilled', linked: false, entries: ['.skilled'] };
const WHOLE_LINK: Layout = { name: 'whole-link', realRoot: '.skilled', linked: true, entries: ['.opencode', '.skilled'] };
const LAYOUTS: readonly Layout[] = [TODAY, SKILLED_ONLY, WHOLE_LINK];

function buildTree(root: string, tree: Tree, layout: Layout, entry: string): { repoRoot: string; skillRoot: string; start: string } {
  const repoRoot = path.join(root, `${layout.name} via ${entry} ${tree.name}`.replace(/[^a-z]+/gu, '-'));
  const realSkillRoot = path.join(repoRoot, layout.realRoot, SKILL_SUBPATH);
  for (const marker of tree.markers) fs.mkdirSync(path.join(realSkillRoot, marker), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, '.git'), { recursive: true });
  fs.writeFileSync(path.join(realSkillRoot, 'SKILL.md'), '# sentinel\n');
  if (layout.linked) fs.symlinkSync('.skilled', path.join(repoRoot, '.opencode'));
  const skillRoot = path.join(repoRoot, entry, SKILL_SUBPATH);
  const start = path.join(skillRoot, 'shared', 'embeddings');
  fs.mkdirSync(start, { recursive: true });
  return { repoRoot, skillRoot, start };
}

function shellRepoRoot(start: string): string | null {
  const result = spawnSync('bash', ['-c', `source "${SHELL_COMMON}" && find_repo_root "${start}"`], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

describe('root resolvers agree on the same fixture trees', () => {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'spec-kit-root-parity-'));
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  for (const layout of LAYOUTS) {
    for (const entry of layout.entries) {
      for (const tree of TREES) {
        it(`${layout.name} through ${entry}, ${tree.name}: package, repository and shell resolvers name consistent roots`, () => {
          const { repoRoot, skillRoot, start } = buildTree(root, tree, layout, entry);

          const repoFromNode = findRepoRoot(start) as string;
          const repoFromShell = shellRepoRoot(start);
          expect(repoFromNode).toBe(repoRoot);
          expect(repoFromShell).toBe(repoRoot);

          const packageRoot = findPackageRoot(start);
          if (tree.expectsPackageRoot) {
            expect(packageRoot).toBe(skillRoot);
            expect(resolvePackageRoot(start)).toBe(skillRoot);
            expect(packageRoot).toBe(path.join(repoFromNode, entry, SKILL_SUBPATH));
          } else {
            expect(packageRoot).toBeNull();
            expect(() => resolvePackageRoot(start)).toThrow(/Unable to resolve package root/u);
          }
        });
      }
    }
  }

  it('a depth cap stops the walk short of a root that lies above it', () => {
    const { skillRoot, start } = buildTree(root, { name: 'capped walk', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true }, TODAY, '.opencode');
    expect(findPackageRoot(start, { maxDepth: 0 })).toBeNull();
    expect(findPackageRoot(start, { maxDepth: 2 })).toBe(skillRoot);
  });
});

describe('the repository resolver treats .skilled and .opencode as one source tree', () => {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'spec-kit-source-root-'));
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  for (const layout of LAYOUTS) {
    for (const entry of layout.entries) {
      it(`${layout.name} through ${entry}: a capped walk hoists to the root instead of returning its start`, () => {
        const { repoRoot, start } = buildTree(root, { name: 'capped', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true }, layout, entry);
        expect(findRepoRoot(start, { maxDepth: 2 })).toBe(repoRoot);
      });
    }
  }

  it('a caller-supplied sentinel is tested under both names', () => {
    const skilled = buildTree(root, FULL_TREE, SKILLED_ONLY, '.skilled');
    expect(findRepoRoot(skilled.start, { sentinel: REPO_ROOT_SENTINEL })).toBe(skilled.repoRoot);
    const today = buildTree(root, FULL_TREE, TODAY, '.opencode');
    expect(findRepoRoot(today.start, { sentinel: '.skilled/skills/system-spec-kit/SKILL.md' })).toBe(today.repoRoot);
  });

  it('a nested leak hoists above the outermost source-root segment', () => {
    const leakRoot = path.join(root, 'leak');
    const start = path.join(leakRoot, '.skilled', 'skills', 'x', '.opencode', 'skills');
    fs.mkdirSync(start, { recursive: true });
    expect(hoistAboveOpencodeTree(start)).toBe(leakRoot);
    expect(findRepoRoot(start)).toBe(leakRoot);
  });

  it('look-alike segments never count as a source root, and an exact segment below them does', () => {
    const lookAlikes = path.join(root, '055-skilled-source-root-migration', 'skilled', '.skilled-backup');
    const start = path.join(lookAlikes, '.skilled', 'work');
    fs.mkdirSync(start, { recursive: true });
    expect(hoistAboveOpencodeTree(lookAlikes)).toBeNull();
    expect(hoistAboveOpencodeTree(start)).toBe(lookAlikes);
    expect(findRepoRoot(start)).toBe(lookAlikes);
  });

  it('a dangling .opencode link falls back to the hoist, never to the start', () => {
    const danglingRoot = path.join(root, 'dangling');
    fs.mkdirSync(danglingRoot, { recursive: true });
    fs.symlinkSync('.skilled', path.join(danglingRoot, '.opencode'));
    for (const entry of ['.opencode', '.skilled']) {
      expect(findRepoRoot(path.join(danglingRoot, entry, SKILL_SUBPATH, 'shared'))).toBe(danglingRoot);
    }
  });

  for (const layout of [TODAY, SKILLED_ONLY]) {
    it(`${layout.name}: a repository inside an ancestor named .skilled keeps its own root on full and capped walks`, () => {
      const ancestor = path.join(root, '.skilled', `outer-${layout.name}`);
      fs.mkdirSync(ancestor, { recursive: true });
      const { repoRoot, start } = buildTree(ancestor, FULL_TREE, layout, layout.realRoot);
      expect(findRepoRoot(start)).toBe(repoRoot);
      expect(findRepoRoot(start, { maxDepth: 2 })).toBe(repoRoot);
    });
  }

  it('a walk capped at zero levels keeps a repository that sits under a directory named .skilled', () => {
    const ancestor = path.join(root, '.skilled', 'outer-zero');
    fs.mkdirSync(ancestor, { recursive: true });
    const { repoRoot } = buildTree(ancestor, FULL_TREE, TODAY, '.opencode');
    expect(findRepoRoot(repoRoot, { maxDepth: 0 })).toBe(repoRoot);
  });

  it('a sentinel under the legacy spec alias is tested as written, never under .skilled', () => {
    const aliasRoot = path.join(root, 'alias-sentinel');
    const start = path.join(aliasRoot, 'work', 'sub');
    fs.mkdirSync(path.join(aliasRoot, '.skilled', 'specs'), { recursive: true });
    fs.mkdirSync(start, { recursive: true });
    fs.writeFileSync(path.join(aliasRoot, '.skilled', 'specs', 'marker'), 'marker\n');
    expect(findRepoRoot(start, { sentinel: '.opencode/specs/marker' })).toBe(start);
  });

  it('a sentinel spelled under .skilled/specs also tests the legacy .opencode/specs spelling', () => {
    const aliasRoot = path.join(root, 'skilled-spelled-alias-sentinel');
    const start = path.join(aliasRoot, 'work', 'sub');
    fs.mkdirSync(path.join(aliasRoot, '.opencode', 'specs'), { recursive: true });
    fs.mkdirSync(start, { recursive: true });
    fs.writeFileSync(path.join(aliasRoot, '.opencode', 'specs', 'marker'), 'marker\n');
    expect(findRepoRoot(start, { sentinel: '.skilled/specs/marker' })).toBe(aliasRoot);
  });

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
    const { repoRoot, start } = buildTree(root, { name: 'placeholder', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true }, TODAY, '.opencode');
    const placeholder = path.join(repoRoot, '.skilled', 'future-task-placeholder');
    fs.mkdirSync(placeholder, { recursive: true });
    expect(findRepoRoot(start)).toBe(repoRoot);
    expect(findRepoRoot(placeholder)).toBe(repoRoot);
    expect(findRepoRoot(placeholder, { maxDepth: 1 })).toBe(repoRoot);
  });

  it('a start with no sentinel above it and no source-root segment is returned unchanged', () => {
    const start = path.join(root, 'plain', 'nested');
    fs.mkdirSync(start, { recursive: true });
    expect(findRepoRoot(start)).toBe(start);
  });
});
