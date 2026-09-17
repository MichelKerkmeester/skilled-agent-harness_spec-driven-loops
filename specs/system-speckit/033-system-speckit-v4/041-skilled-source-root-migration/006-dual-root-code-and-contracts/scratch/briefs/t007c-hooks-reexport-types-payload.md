## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.d.mts`

OLD:

~~~~text
export const REPO_ROOT_SENTINEL: string;
export function hoistAboveOpencodeTree(dir: string): string | null;
~~~~

NEW:

~~~~text
export const REPO_ROOT_SENTINEL: string;
export const SOURCE_ROOT_NAMES: readonly string[];
export function hoistAboveOpencodeTree(dir: string): string | null;
~~~~
