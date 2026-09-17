## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts`

OLD:

~~~~text
  });

  it('look-alike segments never count as a source root', () => {
    const start = path.join(root, '055-skilled-source-root-migration', 'skilled', '.skilled-backup', 'work');
    fs.mkdirSync(start, { recursive: true });
    expect(hoistAboveOpencodeTree(start)).toBeNull();
    expect(findRepoRoot(start)).toBe(start);
  });
~~~~

NEW:

~~~~text
  });

  it('look-alike segments never count as a source root, and an exact segment below them does', () => {
    const lookAlikes = path.join(root, '055-skilled-source-root-migration', 'skilled', '.skilled-backup');
    const start = path.join(lookAlikes, '.skilled', 'work');
    fs.mkdirSync(start, { recursive: true });
    expect(hoistAboveOpencodeTree(lookAlikes)).toBeNull();
    expect(hoistAboveOpencodeTree(start)).toBe(lookAlikes);
    expect(findRepoRoot(start)).toBe(lookAlikes);
  });
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts`

OLD:

~~~~text
  });

  it('a repository inside an ancestor named .skilled resolves to its own root', () => {
    const ancestor = path.join(root, '.skilled', 'outer');
    fs.mkdirSync(ancestor, { recursive: true });
    const { repoRoot, start } = buildTree(ancestor, FULL_TREE, TODAY, '.opencode');
    expect(findRepoRoot(start)).toBe(repoRoot);
  });

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
~~~~

NEW:

~~~~text
  });

  for (const layout of [TODAY, SKILLED_ONLY]) {
    it(`${layout.name}: a repository inside an ancestor named .skilled keeps its own root on full and capped walks`, () => {
      const ancestor = path.join(root, '.skilled', `outer-${layout.name}`);
      fs.mkdirSync(ancestor, { recursive: true });
      const { repoRoot, start } = buildTree(ancestor, FULL_TREE, layout, layout.realRoot);
      expect(findRepoRoot(start)).toBe(repoRoot);
      expect(findRepoRoot(start, { maxDepth: 2 })).toBe(repoRoot);
    });
  }

  it('a real .opencode tree beside the .skilled placeholder resolves from either tree', () => {
~~~~
