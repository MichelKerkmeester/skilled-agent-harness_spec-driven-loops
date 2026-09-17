## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts`

OLD:

~~~~text
  });

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
~~~~

NEW:

~~~~text
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
~~~~
