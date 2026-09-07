// ───────────────────────────────────────────────────────────────────
// TEST: Root resolvers agree on the same trees
// ───────────────────────────────────────────────────────────────────
// Three root resolvers survive in the package, one per runtime boundary: the
// shipped-as-source repository resolver, the compiled package resolver, and the
// shell resolver. Fed the same trees they must name the same places, and the
// package root must sit where the repository resolver says the skill lives.

import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';
import { findPackageRoot, resolvePackageRoot, PACKAGE_ROOT_MARKERS } from '@spec-kit/shared/workspace/package-root';
// @ts-expect-error shipped as source with a sibling declaration file
import { findRepoRoot, REPO_ROOT_SENTINEL } from '@spec-kit/shared/workspace/repo-root.mjs';

const SHELL_COMMON = path.resolve(__dirname, '..', 'lib', 'shell-common.sh');
const SKILL_REL = path.join('.opencode', 'skills', 'system-spec-kit');

interface Tree {
  readonly name: string;
  readonly markers: readonly string[];
  readonly expectsPackageRoot: boolean;
}

const TREES: readonly Tree[] = [
  { name: 'full tree', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true },
  { name: 'missing runtime/cli', markers: ['shared', 'runtime'], expectsPackageRoot: false },
  { name: 'missing runtime and runtime/cli', markers: ['shared'], expectsPackageRoot: false },
];

function buildTree(root: string, tree: Tree): { repoRoot: string; skillRoot: string; start: string } {
  const repoRoot = path.join(root, tree.name.replace(/[^a-z]+/gu, '-'));
  const skillRoot = path.join(repoRoot, SKILL_REL);
  for (const marker of tree.markers) fs.mkdirSync(path.join(skillRoot, marker), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, '.git'), { recursive: true });
  fs.mkdirSync(path.dirname(path.join(repoRoot, REPO_ROOT_SENTINEL)), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, REPO_ROOT_SENTINEL), '# sentinel\n');
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

  for (const tree of TREES) {
    it(`${tree.name}: package, repository and shell resolvers name consistent roots`, () => {
      const { repoRoot, skillRoot, start } = buildTree(root, tree);

      const repoFromNode = findRepoRoot(start) as string;
      const repoFromShell = shellRepoRoot(start);
      expect(repoFromNode).toBe(repoRoot);
      expect(repoFromShell).toBe(repoRoot);

      const packageRoot = findPackageRoot(start);
      if (tree.expectsPackageRoot) {
        expect(packageRoot).toBe(skillRoot);
        expect(resolvePackageRoot(start)).toBe(skillRoot);
        expect(packageRoot).toBe(path.join(repoFromNode, SKILL_REL));
      } else {
        expect(packageRoot).toBeNull();
        expect(() => resolvePackageRoot(start)).toThrow(/Unable to resolve package root/u);
      }
    });
  }

  it('a depth cap stops the walk short of a root that lies above it', () => {
    const { skillRoot, start } = buildTree(root, { name: 'capped walk', markers: PACKAGE_ROOT_MARKERS, expectsPackageRoot: true });
    expect(findPackageRoot(start, { maxDepth: 0 })).toBeNull();
    expect(findPackageRoot(start, { maxDepth: 2 })).toBe(skillRoot);
  });
});
