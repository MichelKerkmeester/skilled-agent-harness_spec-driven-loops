## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`

OLD:

~~~~text
    expect(compiler.outputPathFor(command)).toBe(
      join(compiler.WORKSPACE_ROOT, '.opencode/commands/deep/assets/compiled', fileName),
    );
~~~~

NEW:

~~~~text
    expect(compiler.outputPathFor(command)).toBe(
      join(compiler.WORKSPACE_ROOT, '.skilled/commands/deep/assets/compiled', fileName),
    );
~~~~

## Edit 2

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`

OLD:

~~~~text
  });

  // A checkout that holds its tree only under .skilled has no .opencode path, so an output
  // directory missing under both names must resolve under the compiler's own tree.
  it('resolves a missing compiled directory under the tree the compiler runs from', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'compile-contracts-skilled-only-')));
    try {
      const scripts = join(root, '.skilled', 'skills', 'system-deep-loop', 'runtime', 'scripts');
      mkdirSync(scripts, { recursive: true });
~~~~

NEW:

~~~~text
  });

  // A checkout that holds its tree only under .opencode has no .skilled path, so an output
  // directory missing under both names must resolve under the compiler's own tree.
  it('resolves a missing compiled directory under the tree the compiler runs from', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'compile-contracts-opencode-only-')));
    try {
      const scripts = join(root, '.opencode', 'skills', 'system-deep-loop', 'runtime', 'scripts');
      mkdirSync(scripts, { recursive: true });
~~~~

## Edit 3

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`

OLD:

~~~~text
      expect(copied.outputPathFor('deep/review')).toBe(
        join(root, '.skilled', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.md'),
      );
~~~~

NEW:

~~~~text
      expect(copied.outputPathFor('deep/review')).toBe(
        join(root, '.opencode', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.md'),
      );
~~~~
