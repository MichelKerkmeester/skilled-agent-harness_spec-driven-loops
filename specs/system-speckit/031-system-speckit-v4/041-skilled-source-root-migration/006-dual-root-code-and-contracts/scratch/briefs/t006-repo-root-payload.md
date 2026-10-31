## Edit 1

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
//
//   2. The fallback hoists above the OUTERMOST `.opencode` segment rather than
//      rejecting an enumerated list of known-bad subtrees. `.opencode/` is by
//      definition a child of the root, so any candidate containing that segment
~~~~

NEW:

~~~~text
//
//   2. The fallback hoists above the OUTERMOST source-root segment rather than
//      rejecting an enumerated list of known-bad subtrees. The source tree is by
//      definition a child of the root, so any candidate containing that segment
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
//      guard for `specs/` was in place and believed to be working.

~~~~

NEW:

~~~~text
//      guard for `specs/` was in place and believed to be working.
//
// The source tree sits under `.skilled` or `.opencode`, and a checkout may link one
// name to the other. Both names mark the same tree, so a sentinel spelled under one
// is tested under each and the fallback hoists above either. Node reports a script's
// real path through such a link, so a caller may reach the tree by either name.

~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text

const DEFAULT_MAX_DEPTH = 14;

/**
 * Hoist above the outermost `.opencode` segment in `dir`.
 *
 * @param {string} dir - Candidate directory.
 * @returns {string|null} The directory containing the outermost `.opencode`, or
 *   null when `dir` is not inside an `.opencode` tree.
 */
~~~~

NEW:

~~~~text

/** Directory names the source tree may sit under, in the order a walk tests them. */
export const SOURCE_ROOT_NAMES = Object.freeze(['.skilled', '.opencode']);

const DEFAULT_MAX_DEPTH = 14;

/**
 * Spell a sentinel under every source-root name when its first segment is one.
 *
 * @param {string} sentinel - Relative sentinel path.
 * @returns {string[]} One spelling per source-root name, or the sentinel alone.
 */
function sentinelSpellings(sentinel) {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
}

/**
 * Hoist above the outermost source-root segment in `dir`.
 *
 * @param {string} dir - Candidate directory.
 * @returns {string|null} The directory containing the outermost `.skilled` or
 *   `.opencode` segment, or null when `dir` is not inside a source tree.
 */
~~~~

## Edit 4

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index] === '.opencode') {
      return parts.slice(0, index).join(sep) || sep;
~~~~

NEW:

~~~~text
  for (let index = 1; index < parts.length; index += 1) {
    if (SOURCE_ROOT_NAMES.includes(parts[index])) {
      return parts.slice(0, index).join(sep) || sep;
~~~~

## Edit 5

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
 *
 * Walks up from `start` looking for the authored sentinel. When the walk
 * exhausts, falls back to hoisting above any `.opencode` tree so the caller can
 * never be handed a root that would nest state inside one.
 *
~~~~

NEW:

~~~~text
 *
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, falls back to hoisting above any source tree so the
 * caller can never be handed a root that would nest state inside one.
 *
~~~~

## Edit 6

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinel = opts.sentinel ?? REPO_ROOT_SENTINEL;
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
~~~~

NEW:

~~~~text
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinels = sentinelSpellings(opts.sentinel ?? REPO_ROOT_SENTINEL);
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (sentinels.some((sentinel) => existsSync(resolve(current, sentinel)))) return current;
    const parent = resolve(current, '..');
~~~~
