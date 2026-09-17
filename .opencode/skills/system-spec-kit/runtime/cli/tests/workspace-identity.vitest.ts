// TEST: Workspace Identity
// Covers canonical source-root identity matching across repo-root variants, under
// a real .opencode tree, a real .skilled tree and an .opencode link to .skilled
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildWorkspaceIdentity,
  getWorkspacePathVariants,
  isSameWorkspacePath,
  toWorkspaceRelativePath,
} from '../utils';

const tempRoots: string[] = [];

function makeTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

type Layout = 'today' | 'skilled-only' | 'whole-link';

// Today's checkout holds the real tree under .opencode beside a .skilled placeholder,
// and the real tree carries the spec-kit skill.
function makeLayoutRepo(prefix: string, layout: Layout): string {
  const repoRoot = makeTempRoot(prefix);
  const realSourceRoot = path.join(repoRoot, layout === 'today' ? '.opencode' : '.skilled');
  fs.mkdirSync(path.join(realSourceRoot, 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(realSourceRoot, 'skills', 'system-spec-kit', 'SKILL.md'), '# sentinel\n');
  if (layout === 'today') fs.mkdirSync(path.join(repoRoot, '.skilled', 'future-task-placeholder'), { recursive: true });
  if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(repoRoot, '.opencode'));
  return repoRoot;
}

describe('workspace identity normalization', () => {
  it('treats the repo-local .opencode directory as the canonical workspace anchor', () => {
    const repoRoot = makeTempRoot('speckit-workspace-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    fs.mkdirSync(opencodeRoot, { recursive: true });

    const identity = buildWorkspaceIdentity(opencodeRoot);

    expect(identity.canonicalOpencodePath).toMatch(/\/\.opencode$/);
    expect(identity.workspaceRoot).toMatch(/speckit-workspace-/);
    expect(identity.matchPaths).toEqual(expect.arrayContaining([repoRoot, opencodeRoot]));
    expect(isSameWorkspacePath(opencodeRoot, opencodeRoot)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, repoRoot)).toBe(true);
  });

  it('accepts repo-root and nested paths that resolve to the same .opencode workspace', () => {
    const repoRoot = makeTempRoot('speckit-workspace-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    // drift: 026 release
    const nestedSkillDir = path.join(opencodeRoot, 'skills', 'system-spec-kit');
    fs.mkdirSync(nestedSkillDir, { recursive: true });

    expect(isSameWorkspacePath(opencodeRoot, repoRoot)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, nestedSkillDir)).toBe(true);
    expect(toWorkspaceRelativePath(opencodeRoot, path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit', 'runtime', 'cli', 'core', 'workflow.ts')))
      .toBe('.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts');
    expect(toWorkspaceRelativePath(opencodeRoot, path.join(repoRoot, 'README.md'))).toBe('README.md');
  });

  it('rejects unrelated repos even when their basenames are similar', () => {
    const repoRoot = makeTempRoot('speckit-workspace-a-');
    const otherRepoRoot = makeTempRoot('speckit-workspace-b-');
    fs.mkdirSync(path.join(repoRoot, '.opencode'), { recursive: true });
    fs.mkdirSync(path.join(otherRepoRoot, '.opencode'), { recursive: true });

    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), otherRepoRoot)).toBe(false);
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), path.join(otherRepoRoot, '.opencode'))).toBe(false);
  });

  it('keeps symlinked and trailing-slash variants equivalent', () => {
    const repoRoot = makeTempRoot('speckit-workspace-link-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    fs.mkdirSync(opencodeRoot, { recursive: true });

    const symlinkRoot = path.join(os.tmpdir(), `speckit-workspace-link-alias-${Date.now()}`);
    fs.symlinkSync(repoRoot, symlinkRoot, 'dir');
    tempRoots.push(symlinkRoot);

    expect(isSameWorkspacePath(`${opencodeRoot}/`, `${symlinkRoot}/`)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, path.join(symlinkRoot, '.opencode'))).toBe(true);
  });
});

describe('workspace identity under either source-root name', () => {
  it('resolves a nested start in a .skilled-only checkout to the repository root', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-skilled-', 'skilled-only');
    const realRepoRoot = fs.realpathSync(repoRoot);
    const nestedSkillDir = path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit');

    expect(buildWorkspaceIdentity(repoRoot).workspaceRoot).toBe(realRepoRoot);
    expect(buildWorkspaceIdentity(nestedSkillDir).workspaceRoot).toBe(realRepoRoot);
    expect(isSameWorkspacePath(repoRoot, nestedSkillDir)).toBe(true);
    expect(toWorkspaceRelativePath(nestedSkillDir, path.join(nestedSkillDir, 'SKILL.md')))
      .toBe('.skilled/skills/system-spec-kit/SKILL.md');
  });

  it('gives the repository root, never .skilled, when .opencode links to .skilled', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-link-root-', 'whole-link');
    const realRepoRoot = fs.realpathSync(repoRoot);
    const throughLink = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
    const throughReal = path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit');

    for (const start of [repoRoot, throughLink, throughReal]) {
      expect(buildWorkspaceIdentity(start).workspaceRoot).toBe(realRepoRoot);
    }
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), throughReal)).toBe(true);
    expect(isSameWorkspacePath(path.join(repoRoot, '.skilled'), throughLink)).toBe(true);
    expect(getWorkspacePathVariants(repoRoot))
      .toEqual(expect.arrayContaining([`${realRepoRoot}/.skilled`, `${realRepoRoot}/.opencode`]));
    expect(toWorkspaceRelativePath(repoRoot, path.join(throughLink, 'SKILL.md')))
      .toBe('.skilled/skills/system-spec-kit/SKILL.md');
  });

  it('keeps one workspace root for a real .opencode tree beside the .skilled placeholder', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-placeholder-', 'today');
    const realRepoRoot = fs.realpathSync(repoRoot);
    const nestedSkillDir = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
    const placeholder = path.join(repoRoot, '.skilled', 'future-task-placeholder');

    for (const start of [repoRoot, nestedSkillDir, placeholder]) {
      expect(buildWorkspaceIdentity(start).workspaceRoot).toBe(realRepoRoot);
    }
    expect(getWorkspacePathVariants(repoRoot)).toContain(`${realRepoRoot}/.opencode`);
    expect(getWorkspacePathVariants(repoRoot)).not.toContain(`${realRepoRoot}/.skilled`);
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), placeholder)).toBe(true);
    expect(toWorkspaceRelativePath(repoRoot, path.join(nestedSkillDir, 'SKILL.md')))
      .toBe('.opencode/skills/system-spec-kit/SKILL.md');
  });

  it('keeps a checkout whose own directory is named .skilled as the workspace root', () => {
    const repoRoot = path.join(makeTempRoot('speckit-workspace-dot-named-'), '.skilled');
    const skillDir = path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# sentinel\n');
    const realRepoRoot = fs.realpathSync(repoRoot);

    expect(buildWorkspaceIdentity(repoRoot).workspaceRoot).toBe(realRepoRoot);
    expect(toWorkspaceRelativePath(repoRoot, path.join(skillDir, 'SKILL.md')))
      .toBe('.opencode/skills/system-spec-kit/SKILL.md');
  });

  // A control for the anchor preference: the bare stray tree must not outrank the real
  // source root that holds it once the walk reaches that source root.
  it('keeps anchoring on the source root when a stray tree sits directly inside it', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-leak-', 'skilled-only');
    fs.mkdirSync(path.join(repoRoot, '.skilled', '.opencode', 'skills', '.state'), { recursive: true });
    const realRepoRoot = fs.realpathSync(repoRoot);

    for (const start of [path.join(repoRoot, '.skilled'), path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit')]) {
      expect(buildWorkspaceIdentity(start).workspaceRoot).toBe(realRepoRoot);
    }
  });

  // With no spec-kit skill on either side only names can decide, and a directory named
  // .skilled is a source root by name, so its parent is the workspace root.
  it('treats a bare directory named .skilled as a source root when no spec-kit skill decides', () => {
    const parent = makeTempRoot('speckit-workspace-bare-dot-named-');
    const bareRoot = path.join(parent, '.skilled');
    fs.mkdirSync(path.join(bareRoot, '.opencode'), { recursive: true });

    expect(buildWorkspaceIdentity(bareRoot).workspaceRoot).toBe(fs.realpathSync(parent));
  });

  it('rejects unrelated repositories whose anchors carry different names', () => {
    const opencodeRepo = makeLayoutRepo('speckit-workspace-names-a-', 'today');
    const skilledRepo = makeLayoutRepo('speckit-workspace-names-b-', 'skilled-only');

    expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), skilledRepo)).toBe(false);
    expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), path.join(skilledRepo, '.skilled'))).toBe(false);
    expect(isSameWorkspacePath(path.join(skilledRepo, '.skilled'), path.join(opencodeRepo, '.opencode', 'skills'))).toBe(false);
  });
});
