## Edit 1

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
 * The legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under
 * it is tested as written.
 *
~~~~

NEW:

~~~~text
 * The legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under
 * it is tested as written. A sentinel spelled under `.skilled/specs` still tests that
 * legacy spelling, because it is the only one the alias has.
 *
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs`

OLD:

~~~~text
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || rest[0] === 'specs' || !SOURCE_ROOT_NAMES.includes(head)) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~

NEW:

~~~~text
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head) || (head === '.opencode' && rest[0] === 'specs')) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
~~~~
