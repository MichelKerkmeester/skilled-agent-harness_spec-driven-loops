## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
// every current packet, which costs the caller its repository root and makes
// every repo-relative key file fail to resolve and silently disappear.
function findSpecsRoot(specFolderPath: string): string | null {
~~~~

NEW:

~~~~text
// every current packet, which costs the caller its repository root and makes
// every repo-relative key file fail to resolve and silently disappear. The
// source tree beside them sits under `.skilled` or `.opencode`, and a checkout
// may link one name to the other, so either name marks the repository root.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];

function findSpecsRoot(specFolderPath: string): string | null {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
      const parent = path.dirname(current);
      if (path.basename(parent) === '.opencode' || fs.existsSync(path.join(parent, '.opencode'))) {
        return current;
~~~~

NEW:

~~~~text
      const parent = path.dirname(current);
      if (
        SOURCE_ROOT_NAMES.includes(path.basename(parent))
        || SOURCE_ROOT_NAMES.some((name) => fs.existsSync(path.join(parent, name)))
      ) {
        return current;
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
  const parent = path.dirname(specsRoot);
  return path.basename(parent) === '.opencode' ? path.dirname(parent) : parent;
}
~~~~

NEW:

~~~~text
  const parent = path.dirname(specsRoot);
  return SOURCE_ROOT_NAMES.includes(path.basename(parent)) ? path.dirname(parent) : parent;
}
~~~~
