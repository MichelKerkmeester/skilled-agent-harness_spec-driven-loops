## Edit 1

File: `.skilled/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts`

OLD:

~~~~text
    const path = getSkillGraphGenerationPath(specDir);
    expect(path.startsWith(join(repo, '.opencode') + sep)).toBe(true);
    expect(path).not.toContain(join('specs', 'system-skill-advisor'));
~~~~

NEW:

~~~~text
    const path = getSkillGraphGenerationPath(specDir);
    expect(['.skilled', '.opencode'].some((root) => path.startsWith(join(repo, root) + sep))).toBe(true);
    expect(path).not.toContain(join('specs', 'system-skill-advisor'));
~~~~

## Edit 2

File: `.skilled/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts`

OLD:

~~~~text
    const dir = resolveSkillGraphDbDir(specDir);
    expect(dir.startsWith(join(repo, '.opencode') + sep)).toBe(true);
    expect(dir).not.toContain(join('specs', 'system-skill-advisor'));
~~~~

NEW:

~~~~text
    const dir = resolveSkillGraphDbDir(specDir);
    expect(['.skilled', '.opencode'].some((root) => dir.startsWith(join(repo, root) + sep))).toBe(true);
    expect(dir).not.toContain(join('specs', 'system-skill-advisor'));
~~~~
