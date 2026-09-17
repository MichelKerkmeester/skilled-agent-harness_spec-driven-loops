## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
  buildWorkspaceIdentity,
  isSameWorkspacePath,
~~~~

NEW:

~~~~text
  buildWorkspaceIdentity,
  getWorkspacePathVariants,
  isSameWorkspacePath,
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
type Layout = 'today' | 'skilled-only' | 'whole-link';

// Today's checkout holds the real tree under .opencode beside a .skilled placeholder.
function makeLayoutRepo(prefix: string, layout: Layout): string {
~~~~

NEW:

~~~~text
type Layout = 'today' | 'skilled-only' | 'whole-link';

// Today's checkout holds the real tree under .opencode beside a .skilled placeholder,
// and the real tree carries the spec-kit skill.
function makeLayoutRepo(prefix: string, layout: Layout): string {
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
  fs.mkdirSync(path.join(realSourceRoot, 'skills', 'system-spec-kit'), { recursive: true });
  if (layout === 'today') fs.mkdirSync(path.join(repoRoot, '.skilled', 'future-task-placeholder'), { recursive: true });
~~~~

NEW:

~~~~text
  fs.mkdirSync(path.join(realSourceRoot, 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(realSourceRoot, 'skills', 'system-spec-kit', 'SKILL.md'), '# sentinel\n');
  if (layout === 'today') fs.mkdirSync(path.join(repoRoot, '.skilled', 'future-task-placeholder'), { recursive: true });
~~~~

## Edit 4

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
    }
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), placeholder)).toBe(true);
    expect(toWorkspaceRelativePath(repoRoot, path.join(nestedSkillDir, 'SKILL.md')))
      .toBe('.opencode/skills/system-spec-kit/SKILL.md');
  });
~~~~

NEW:

~~~~text
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

  it('treats a stray tree written inside a source root as a leak, not as the workspace', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-leak-', 'skilled-only');
    fs.mkdirSync(path.join(repoRoot, '.skilled', '.opencode', 'skills', '.state'), { recursive: true });
    const realRepoRoot = fs.realpathSync(repoRoot);

    expect(buildWorkspaceIdentity(path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit')).workspaceRoot)
      .toBe(realRepoRoot);
  });
~~~~
