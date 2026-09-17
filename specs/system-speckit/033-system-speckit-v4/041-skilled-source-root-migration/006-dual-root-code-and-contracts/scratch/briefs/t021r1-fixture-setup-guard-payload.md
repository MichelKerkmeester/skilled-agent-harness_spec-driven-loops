## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
  const canonicalRoot = path.join(workspaceDir, 'specs');
  // Resolvers know the legacy root by its one `.opencode/specs` spelling. Under a
  // `.skilled` tree the entry is written inside `.skilled`, so only an `.opencode` link
  // can expose it, and a `.skilled`-only workspace has no legacy root to report.
  const legacyRoot = path.join(workspaceDir, '.opencode', 'specs');
~~~~

NEW:

~~~~text
  const canonicalRoot = path.join(workspaceDir, 'specs');
  // Root enumeration knows the legacy root by its one `.opencode/specs` spelling. Under
  // a `.skilled` tree the entry is written inside `.skilled`, so only an `.opencode` link
  // exposes it as the legacy root, and a `.skilled`-only workspace lists none. Path
  // containment can still follow the entry into the canonical root.
  const legacyRoot = path.join(workspaceDir, '.opencode', 'specs');
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
  const physicalRoots: PhysicalRoot[] = [];

  fs.mkdirSync(workspaceDir, { recursive: true });
  // The legacy entry nests one level deeper than canonicalRoot, so pre-create its
  // parent: fixtures that write directly at the entry (a symlink or a plain file, not
  // addLegacyRoot()'s directory) never fail on a missing intermediate directory.
  fs.mkdirSync(sourceRootDir, { recursive: true });
  if (layout === 'whole-link') {
    fs.symlinkSync('.skilled', path.join(workspaceDir, '.opencode'), 'dir');
  }

  const addCanonicalRoot = (): void => {
~~~~

NEW:

~~~~text
  const physicalRoots: PhysicalRoot[] = [];

  const addCanonicalRoot = (): void => {
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
  };

  try {
    switch (fixture.id) {
~~~~

NEW:

~~~~text
  };

  // Setup that can fail, such as a denied symlink, runs inside the guard that removes
  // the temporary directory.
  try {
    fs.mkdirSync(workspaceDir, { recursive: true });
    // The legacy entry nests one level deeper than canonicalRoot, so pre-create its
    // parent: fixtures that write directly at the entry (a symlink or a plain file, not
    // addLegacyRoot()'s directory) never fail on a missing intermediate directory.
    fs.mkdirSync(sourceRootDir, { recursive: true });
    if (layout === 'whole-link') {
      fs.symlinkSync('.skilled', path.join(workspaceDir, '.opencode'), 'dir');
    }
    switch (fixture.id) {
~~~~
