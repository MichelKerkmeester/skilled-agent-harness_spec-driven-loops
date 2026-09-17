## Edit 1

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
/**
 * Resolve the repository root for a runtime writer.
 *
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, falls back to hoisting above any source tree so the
 * caller can never be handed a root that would nest state inside one.
 *
~~~~

NEW:

~~~~text
/**
 * Find the parent of a source-root segment in `dir` that holds the sentinel.
 *
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * parent of one source-root segment in the start path. Testing those parents nearest
 * first, as the walk would, keeps a repository that sits under a directory named
 * `.skilled` or `.opencode` instead of hoisting past it.
 *
 * @param {string} dir - Start directory.
 * @param {string[]} sentinels - Sentinel spellings to test.
 * @returns {string|null} The nearest such parent, or null when none holds the sentinel.
 */
function sourceTreeParentWithSentinel(dir, sentinels) {
  const parts = resolve(dir).split(sep);
  for (let index = parts.length - 1; index >= 1; index -= 1) {
    if (!SOURCE_ROOT_NAMES.includes(parts[index])) continue;
    const parent = parts.slice(0, index).join(sep) || sep;
    if (sentinels.some((sentinel) => existsSync(resolve(parent, sentinel)))) return parent;
  }
  return null;
}

/**
 * Resolve the repository root for a runtime writer.
 *
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, the parent of a source-root segment that holds the
 * sentinel is the root. Failing that, it falls back to hoisting above any source tree
 * so the caller can never be handed a root that would nest state inside one.
 *
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  }
  return hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~

NEW:

~~~~text
  }
  return sourceTreeParentWithSentinel(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~
