## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts`

OLD:

~~~~text
  }

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
~~~~

NEW:

~~~~text
  }

  it('a walk capped at zero levels keeps a repository that sits under a directory named .skilled', () => {
    const ancestor = path.join(root, '.skilled', 'outer-zero');
    fs.mkdirSync(ancestor, { recursive: true });
    const { repoRoot } = buildTree(ancestor, FULL_TREE, TODAY, '.opencode');
    expect(findRepoRoot(repoRoot, { maxDepth: 0 })).toBe(repoRoot);
  });

  it('a sentinel under the legacy spec alias is tested as written, never under .skilled', () => {
    const aliasRoot = path.join(root, 'alias-sentinel');
    const start = path.join(aliasRoot, 'work', 'sub');
    fs.mkdirSync(path.join(aliasRoot, '.skilled', 'specs'), { recursive: true });
    fs.mkdirSync(start, { recursive: true });
    fs.writeFileSync(path.join(aliasRoot, '.skilled', 'specs', 'marker'), 'marker\n');
    expect(findRepoRoot(start, { sentinel: '.opencode/specs/marker' })).toBe(start);
  });

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
~~~~
