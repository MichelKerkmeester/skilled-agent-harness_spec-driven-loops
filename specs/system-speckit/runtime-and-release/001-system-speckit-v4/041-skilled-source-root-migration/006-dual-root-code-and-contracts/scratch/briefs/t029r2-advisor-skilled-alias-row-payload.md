## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`

OLD:

~~~~text
  });

  it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
~~~~

NEW:

~~~~text
  });

  it('tests a sentinel spelled under .skilled/specs under the legacy .opencode/specs spelling too', () => {
    const repo = makeTmpRoot();
    mkdirp(join(repo, '.opencode', 'specs'));
    writeFileSync(join(repo, '.opencode', 'specs', 'marker'), 'marker\n');
    const start = mkdirp(join(repo, 'work', 'sub'));
    expect(findAdvisorWorkspaceRoot(start, { sentinel: '.skilled/specs/marker' })).toBe(resolve(repo));
  });

  it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
~~~~
