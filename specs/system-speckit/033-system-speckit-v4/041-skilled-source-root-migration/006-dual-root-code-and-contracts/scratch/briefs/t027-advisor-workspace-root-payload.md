## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
const DEFAULT_MAX_DEPTH = 14;
// Strict sentinel: anchors on the canonical SKILL.md inside system-spec-kit so
~~~~

NEW:

~~~~text
const DEFAULT_MAX_DEPTH = 14;
// The source tree sits under `.skilled` or `.opencode`, and a checkout may link one
// name to the other, so both names mark the same tree. A sentinel that starts with
// either name is tested under each, and the fallback hoists above either.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];
// Strict sentinel: anchors on the canonical SKILL.md inside system-spec-kit so
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/**
 * When the sentinel walk-up fails, the resolver must never hand back a
 * directory that sits *inside* an `.opencode/` tree. The advisor writes runtime
 * state under whatever root this returns, so a root inside `.opencode/` would
~~~~

NEW:

~~~~text
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/** Spell a sentinel under every source-root name when its first segment is one. */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
}

/**
 * When the sentinel walk-up fails, the resolver must never hand back a
 * directory that sits *inside* a source tree. The advisor writes runtime
 * state under whatever root this returns, so a root inside `.opencode/` would
~~~~

## Edit 3

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
 *
 * The rule is structural rather than an enumeration of known-bad subtrees: an
 * `.opencode/` directory is by definition a child of the workspace root, so any
 * candidate containing an `.opencode` path segment is provably not the root.
 * Hoisting above the OUTERMOST such segment yields the real root.
~~~~

NEW:

~~~~text
 *
 * The rule is structural rather than an enumeration of known-bad subtrees: a
 * `.skilled/` or `.opencode/` directory is by definition a child of the workspace
 * root, so any candidate containing either path segment is provably not the root.
 * Hoisting above the OUTERMOST such segment yields the real root.
~~~~

## Edit 4

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
 *
 * Returns null when `dir` is not inside an `.opencode` tree.
 */
~~~~

NEW:

~~~~text
 *
 * Returns null when `dir` is not inside a `.skilled` or `.opencode` tree.
 */
~~~~

## Edit 5

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
  // Outermost wins: a leak can nest several levels deep, and hoisting to the
  // innermost `.opencode` would land inside the real one.
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index] === '.opencode') {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
~~~~

NEW:

~~~~text
  // Outermost wins: a leak can nest several levels deep, and hoisting to the
  // innermost source-root segment would land inside the real tree.
  for (let index = 1; index < parts.length; index += 1) {
    if (SOURCE_ROOT_NAMES.includes(parts[index])) {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
  return null;
}

/**
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * parent of one source-root segment in the start path. Testing those parents nearest
 * first, as the walk would, keeps a workspace that sits under a directory named
 * `.skilled` or `.opencode` instead of hoisting past it. Returns null when no such
 * parent holds the sentinel.
 */
function sourceTreeParentWithSentinel(dir: string, sentinels: readonly string[]): string | null {
  const parts = resolve(dir).split(sep);
  for (let index = parts.length - 1; index >= 1; index -= 1) {
    if (!SOURCE_ROOT_NAMES.includes(parts[index])) continue;
    const parent = parts.slice(0, index).join(sep) || sep;
    if (sentinels.some((sentinel) => existsSync(resolve(parent, sentinel)))) return parent;
  }
~~~~

## Edit 6

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinel = opts.sentinel ?? DEFAULT_SENTINEL;
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
~~~~

NEW:

~~~~text
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinels = sentinelSpellings(opts.sentinel ?? DEFAULT_SENTINEL);
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (sentinels.some((sentinel) => existsSync(resolve(current, sentinel)))) return current;
    const parent = resolve(current, '..');
~~~~

## Edit 7

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
  }
  // Sentinel not found within maxDepth. Never fall back to a path inside an
  // .opencode/ tree — that is provably not a workspace root, and writing state
  // there creates a nested tree that re-anchors every future walk-up.
  return hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~

NEW:

~~~~text
  }
  // Sentinel not found within maxDepth. Never fall back to a path inside a
  // source tree — that is provably not a workspace root, and writing state
  // there creates a nested tree that re-anchors every future walk-up.
  return sourceTreeParentWithSentinel(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
~~~~
