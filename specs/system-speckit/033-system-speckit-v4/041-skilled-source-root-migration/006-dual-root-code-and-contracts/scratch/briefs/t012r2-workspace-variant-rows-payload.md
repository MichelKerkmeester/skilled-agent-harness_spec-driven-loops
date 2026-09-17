## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
    expect(isSameWorkspacePath(path.join(repoRoot, '.skilled'), throughLink)).toBe(true);
    expect(toWorkspaceRelativePath(repoRoot, path.join(throughLink, 'SKILL.md')))
~~~~

NEW:

~~~~text
    expect(isSameWorkspacePath(path.join(repoRoot, '.skilled'), throughLink)).toBe(true);
    expect(getWorkspacePathVariants(repoRoot))
      .toEqual(expect.arrayContaining([`${realRepoRoot}/.skilled`, `${realRepoRoot}/.opencode`]));
    expect(toWorkspaceRelativePath(repoRoot, path.join(throughLink, 'SKILL.md')))
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
  });

  it('treats a stray tree written inside a source root as a leak, not as the workspace', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-leak-', 'skilled-only');
~~~~

NEW:

~~~~text
  });

  // A control for the anchor preference: the bare stray tree must not outrank the real
  // source root that holds it once the walk reaches that source root.
  it('keeps anchoring on the source root when a stray tree sits directly inside it', () => {
    const repoRoot = makeLayoutRepo('speckit-workspace-leak-', 'skilled-only');
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts`

OLD:

~~~~text
    const realRepoRoot = fs.realpathSync(repoRoot);

    expect(buildWorkspaceIdentity(path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit')).workspaceRoot)
      .toBe(realRepoRoot);
  });
~~~~

NEW:

~~~~text
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
~~~~
