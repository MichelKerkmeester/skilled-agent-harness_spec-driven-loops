## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
~~~~

NEW:

~~~~text
}

const SOURCE_TREE_SENTINEL = path.join('skills', 'system-spec-kit', 'SKILL.md');

// Today's checkout holds the real tree under one name beside an empty directory
// under the other, so a child tree that carries the spec-kit skill wins, and a
// bare directory anchors only when no child tree carries it.
function nestedSourceRoot(current: string): string | null {
  let bare: string | null = null;
  for (const name of SOURCE_ROOT_NAMES) {
    const candidate = path.join(current, name);
    if (!safeStat(candidate)?.isDirectory()) continue;
    if (fs.existsSync(path.join(candidate, SOURCE_TREE_SENTINEL))) return candidate;
    bare ??= candidate;
  }
  return bare;
}

// A directory named like a source root may itself be a checkout, such as a clone
// kept in a folder named .skilled. It is the workspace only when the tree inside it
// carries the spec-kit skill, so a stray tree written inside a real source root
// stays a leak and the walk keeps anchoring on the source root itself.
function anchorAt(current: string): string | null {
  const nested = nestedSourceRoot(current);
  if (!isSourceRootName(path.posix.basename(current))) return nested;
  return nested !== null && fs.existsSync(path.join(nested, SOURCE_TREE_SENTINEL)) ? nested : current;
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  while (true) {
    if (isSourceRootName(path.posix.basename(current))) {
      return current;
    }

    for (const name of SOURCE_ROOT_NAMES) {
      const nestedSourceRoot = path.join(current, name);
      if (safeStat(nestedSourceRoot)?.isDirectory()) {
        return normalizeRequestedPath(nestedSourceRoot);
      }
    }
~~~~

NEW:

~~~~text
  while (true) {
    const anchor = anchorAt(current);
    if (anchor !== null) {
      return anchor === current ? current : normalizeRequestedPath(anchor);
    }
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  while (true) {
    if (isSourceRootName(path.posix.basename(current))) {
      return current;
    }

    for (const name of SOURCE_ROOT_NAMES) {
      const nestedSourceRoot = path.join(current, name);
      if (safeStat(nestedSourceRoot)?.isDirectory()) {
        return normalizeAbsolutePath(nestedSourceRoot);
      }
    }
~~~~

NEW:

~~~~text
  while (true) {
    const anchor = anchorAt(current);
    if (anchor !== null) {
      return anchor === current ? current : normalizeAbsolutePath(anchor);
    }
~~~~
