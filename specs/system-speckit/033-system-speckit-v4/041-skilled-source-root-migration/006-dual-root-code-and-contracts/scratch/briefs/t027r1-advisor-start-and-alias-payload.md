## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/** Spell a sentinel under every source-root name when its first segment is one. */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

NEW:

~~~~text
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/**
 * Spell a sentinel under every source-root name when its first segment is one. The
 * legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under it
 * is tested as written.
 */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || rest[0] === 'specs' || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * parent of one source-root segment in the start path. Testing those parents nearest
 * first, as the walk would, keeps a workspace that sits under a directory named
 * `.skilled` or `.opencode` instead of hoisting past it. Returns null when no such
 * parent holds the sentinel.
 */
function sourceTreeParentWithSentinel(dir: string, sentinels: readonly string[]): string | null {
  const parts = resolve(dir).split(sep);
~~~~

NEW:

~~~~text
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * start itself or the parent of one source-root segment in the start path. Testing the
 * start, then those parents nearest first, as the walk would, keeps a workspace that
 * sits under a directory named `.skilled` or `.opencode` instead of hoisting past it.
 * Returns null when none of them holds the sentinel.
 */
function nearestSentinelHolder(dir: string, sentinels: readonly string[]): string | null {
  const holdsSentinel = (candidate: string): boolean => sentinels.some((sentinel) => existsSync(resolve(candidate, sentinel)));
  if (holdsSentinel(dir)) return resolve(dir);
  const parts = resolve(dir).split(sep);
~~~~

## Edit 3

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

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

## Edit 4

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
 * contains `sentinel`. If no candidate is found within `maxDepth` iterations,
 * returns the canonicalized form of `start` as the safest fallback (matching
 * the prior in-line behavior of `handlers/advisor-recommend.ts`).
 *
~~~~

NEW:

~~~~text
 * contains `sentinel`. If no candidate is found within `maxDepth` iterations,
 * the start or the nearest source-root parent in its path that holds the
 * sentinel is the root. Failing that, the result is the directory above the
 * outermost source-root segment in `start`, and a `start` outside any source
 * tree comes back canonicalized.
 *
~~~~

## Edit 5

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
  // there creates a nested tree that re-anchors every future walk-up.
  return sourceTreeParentWithSentinel(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~

NEW:

~~~~text
  // there creates a nested tree that re-anchors every future walk-up.
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~
