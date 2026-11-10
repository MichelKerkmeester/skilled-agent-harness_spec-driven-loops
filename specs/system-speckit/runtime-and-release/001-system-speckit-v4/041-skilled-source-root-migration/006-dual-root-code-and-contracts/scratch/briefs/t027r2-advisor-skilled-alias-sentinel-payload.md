## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`

OLD:

~~~~text
 * legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under it
 * is tested as written.
 */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || rest[0] === 'specs' || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

NEW:

~~~~text
 * legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under it
 * is tested as written. A sentinel spelled under `.skilled/specs` still tests that
 * legacy spelling, because it is the only one the alias has.
 */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head) || (head === '.opencode' && rest[0] === 'specs')) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~
