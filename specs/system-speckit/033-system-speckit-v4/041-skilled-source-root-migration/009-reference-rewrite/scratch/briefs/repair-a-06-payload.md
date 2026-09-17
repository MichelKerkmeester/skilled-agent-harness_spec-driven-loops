## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs`

OLD:

~~~~text
  const root = path.resolve(options.root ?? process.cwd());
  if (!fs.existsSync(path.join(root, '.opencode'))) {
    throw new Error(`root does not look like the repository root (no .opencode): ${root}`);
  }
~~~~

NEW:

~~~~text
  const root = path.resolve(options.root ?? process.cwd());
  if (!['.skilled', '.opencode'].some((name) => fs.existsSync(path.join(root, name)))) {
    throw new Error(`root does not look like the repository root (no .skilled or .opencode): ${root}`);
  }
~~~~
