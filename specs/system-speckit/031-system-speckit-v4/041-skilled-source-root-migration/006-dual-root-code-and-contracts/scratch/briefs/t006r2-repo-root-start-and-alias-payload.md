## Edit 1

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
 *
 * @param {string} sentinel - Relative sentinel path.
~~~~

NEW:

~~~~text
 *
 * The legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under
 * it is tested as written.
 *
 * @param {string} sentinel - Relative sentinel path.
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

NEW:

~~~~text
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || rest[0] === 'specs' || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

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
~~~~

NEW:

~~~~text
/**
 * Find the nearest directory in `dir`'s path that a capped walk may have skipped
 * and that holds the sentinel.
 *
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * start itself or the parent of one source-root segment in the start path. Testing the
 * start, then those parents nearest first, as the walk would, keeps a repository that
 * sits under a directory named `.skilled` or `.opencode` instead of hoisting past it.
 *
 * @param {string} dir - Start directory.
 * @param {string[]} sentinels - Sentinel spellings to test.
 * @returns {string|null} The nearest such directory, or null when none holds the sentinel.
 */
function nearestSentinelHolder(dir, sentinels) {
  const holdsSentinel = (candidate) => sentinels.some((sentinel) => existsSync(resolve(candidate, sentinel)));
  if (holdsSentinel(dir)) return resolve(dir);
  const parts = resolve(dir).split(sep);
~~~~

## Edit 4

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
    const parent = parts.slice(0, index).join(sep) || sep;
    if (sentinels.some((sentinel) => existsSync(resolve(parent, sentinel)))) return parent;
  }
~~~~

NEW:

~~~~text
    const parent = parts.slice(0, index).join(sep) || sep;
    if (holdsSentinel(parent)) return parent;
  }
~~~~

## Edit 5

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, the parent of a source-root segment that holds the
 * sentinel is the root. Failing that, it falls back to hoisting above any source tree
 * so the caller can never be handed a root that would nest state inside one.
~~~~

NEW:

~~~~text
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, the start or the parent of a source-root segment that
 * holds the sentinel is the root. Failing that, it falls back to hoisting above any source tree
 * so the caller can never be handed a root that would nest state inside one.
~~~~

## Edit 6

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  }
  return sourceTreeParentWithSentinel(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~

NEW:

~~~~text
  }
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~
