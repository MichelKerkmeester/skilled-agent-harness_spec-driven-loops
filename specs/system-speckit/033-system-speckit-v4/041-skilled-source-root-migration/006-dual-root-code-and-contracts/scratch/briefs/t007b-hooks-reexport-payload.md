## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs`

OLD:

~~~~text

export { REPO_ROOT_SENTINEL, hoistAboveOpencodeTree, findRepoRoot } from '../../../../shared/workspace/repo-root.mjs';
~~~~

NEW:

~~~~text

export { REPO_ROOT_SENTINEL, SOURCE_ROOT_NAMES, hoistAboveOpencodeTree, findRepoRoot } from '../../../../shared/workspace/repo-root.mjs';
~~~~
