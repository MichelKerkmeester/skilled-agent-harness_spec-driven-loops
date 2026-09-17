## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
// TEST: Workspace Identity
// Covers canonical .opencode identity matching across repo-root variants
import fs from 'node:fs';
~~~~

NEW:

~~~~text
// TEST: Workspace Identity
// Covers canonical source-root identity matching across repo-root variants, under
// a real .opencode tree, a real .skilled tree and an .opencode link to .skilled
import fs from 'node:fs';
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
});

describe('workspace identity normalization', () => {
~~~~

NEW:

~~~~text
});

type Layout = 'today' | 'skilled-only' | 'whole-link';

// Today's checkout holds the real tree under .opencode beside a .skilled placeholder.
function makeLayoutRepo(prefix: string, layout: Layout): string {
  const repoRoot = makeTempRoot(prefix);
  const realSourceRoot = path.join(repoRoot, layout === 'today' ? '.opencode' : '.skilled');
  fs.mkdirSync(path.join(realSourceRoot, 'skills', 'system-spec-kit'), { recursive: true });
  if (layout === 'today') fs.mkdirSync(path.join(repoRoot, '.skilled', 'future-task-placeholder'), { recursive: true });
  if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(repoRoot, '.opencode'));
  return repoRoot;
}

describe('workspace identity normalization', () => {
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
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
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), placeholder)).toBe(true);
    expect(toWorkspaceRelativePath(repoRoot, path.join(nestedSkillDir, 'SKILL.md')))
      .toBe('.opencode/skills/system-spec-kit/SKILL.md');
  });

  it('rejects unrelated repositories whose anchors carry different names', () => {
    const opencodeRepo = makeLayoutRepo('speckit-workspace-names-a-', 'today');
    const skilledRepo = makeLayoutRepo('speckit-workspace-names-b-', 'skilled-only');

    expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), skilledRepo)).toBe(false);
    expect(isSameWorkspacePath(path.join(opencodeRepo, '.opencode'), path.join(skilledRepo, '.skilled'))).toBe(false);
    expect(isSameWorkspacePath(path.join(skilledRepo, '.skilled'), path.join(opencodeRepo, '.opencode', 'skills'))).toBe(false);
  });
});
~~~~
