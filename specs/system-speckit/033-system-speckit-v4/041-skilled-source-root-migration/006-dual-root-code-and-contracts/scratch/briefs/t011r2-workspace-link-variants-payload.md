## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
// kept in a folder named .skilled. It is the workspace only when the tree inside it
// carries the spec-kit skill, so a stray tree written inside a real source root
// stays a leak and the walk keeps anchoring on the source root itself.
function anchorAt(current: string): string | null {
~~~~

NEW:

~~~~text
// kept in a folder named .skilled. It is the workspace only when the tree inside it
// carries the spec-kit skill. Otherwise its own name makes it the source root, so a
// stray tree written directly inside a real source root stays a leak once the walk
// reaches that source root.
function anchorAt(current: string): string | null {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
}

/** Resolve a workspace path to its canonical source-root anchor plus every path variant that should match it. */
~~~~

NEW:

~~~~text
}

// A linked checkout reaches one tree under both names, so every name whose tree carries
// the spec-kit skill is a variant, not only the name the walk anchored on.
function sourceTreeSpellings(root: string): string[] {
  return SOURCE_ROOT_NAMES
    .map((name) => path.join(root, name))
    .filter((candidate) => fs.existsSync(path.join(candidate, SOURCE_TREE_SENTINEL)));
}

/** Resolve a workspace path to its canonical source-root anchor plus every path variant that should match it. */
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
      requestedPath,
    ]),
~~~~

NEW:

~~~~text
      requestedPath,
      ...sourceTreeSpellings(workspaceRoot),
      ...sourceTreeSpellings(rawWorkspaceRoot),
    ]),
~~~~
