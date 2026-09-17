## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
    }

    const systemSpecKitRoot = path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit');
    const workspaceRoots = [
      systemSpecKitRoot,
~~~~

NEW:

~~~~text
    }

    const systemSpecKitRoots = ['.skilled', '.opencode'].map((root) => path.join(repoRoot, root, 'skills', 'system-spec-kit'));
    const workspaceRoots = systemSpecKitRoots.flatMap((systemSpecKitRoot) => [
      systemSpecKitRoot,
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
      path.join(systemSpecKitRoot, 'scripts'),
    ];
    for (const root of workspaceRoots) {
~~~~

NEW:

~~~~text
      path.join(systemSpecKitRoot, 'scripts'),
    ]);
    for (const root of workspaceRoots) {
~~~~
