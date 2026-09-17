## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`

OLD:

~~~~text
  }

  it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
~~~~

NEW:

~~~~text
  }

  it('a walk capped at zero levels keeps a workspace that sits under a directory named .skilled', () => {
    const repo = mkdirp(join(makeTmpRoot(), '.skilled', 'outer', 'repo'));
    const skillDir = mkdirp(join(repo, '.opencode', 'skills', 'system-spec-kit'));
    writeFileSync(join(skillDir, 'SKILL.md'), '# sentinel\n');
    expect(findAdvisorWorkspaceRoot(repo, { maxDepth: 0 })).toBe(resolve(repo));
  });

  it('tests a sentinel under the legacy spec alias as written, never under .skilled', () => {
    const repo = makeTmpRoot();
    mkdirp(join(repo, '.skilled', 'specs'));
    writeFileSync(join(repo, '.skilled', 'specs', 'marker'), 'marker\n');
    const start = mkdirp(join(repo, 'work', 'sub'));
    expect(findAdvisorWorkspaceRoot(start, { sentinel: '.opencode/specs/marker' })).toBe(resolve(start));
  });

  it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
~~~~
