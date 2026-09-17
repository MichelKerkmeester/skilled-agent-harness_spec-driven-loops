## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts`

OLD:

~~~~text
});

describe('Gate 3 classifier — JSON snapshot', () => {
~~~~

NEW:

~~~~text
});

describe('Gate 3 classifier — workspace root under either source-root name', () => {
  const originalCwd = process.cwd();

  afterEach(() => {
    process.chdir(originalCwd);
  });

  for (const layout of ['skilled-only', 'whole-link'] as const) {
    it(`${layout}: validates a binding from a start inside the source tree against the repository root`, () => {
      const workspaceRoot = createTempWorkspace();
      const nestedStart = path.join(workspaceRoot, '.skilled', 'skills', 'system-spec-kit');
      fs.mkdirSync(nestedStart, { recursive: true });
      if (layout === 'whole-link') fs.symlinkSync('.skilled', path.join(workspaceRoot, '.opencode'));
      writeSpecFolder(workspaceRoot, 'specs/system-speckit/301-source-root-probe');
      process.chdir(nestedStart);

      const validation = validateSpecFolderBinding(
        { path: 'specs/system-speckit/301-source-root-probe', source: 'flags', validated: true },
      );

      expect(validation.valid).toBe(true);
    });
  }
});

describe('Gate 3 classifier — JSON snapshot', () => {
~~~~
