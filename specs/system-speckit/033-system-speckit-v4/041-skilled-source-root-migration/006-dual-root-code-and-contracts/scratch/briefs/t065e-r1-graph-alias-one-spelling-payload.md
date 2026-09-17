## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
// source tree beside them sits under `.skilled` or `.opencode`, and a checkout
// may link one name to the other, so either name marks the repository root.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];
~~~~

NEW:

~~~~text
// source tree beside them sits under `.skilled` or `.opencode`, and a checkout
// may link one name to the other, so either name beside `specs` marks the
// repository root. The legacy alias nested inside the source tree keeps its one
// `.opencode/specs` spelling, so `.skilled/specs` is never a specs root.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
      if (
        SOURCE_ROOT_NAMES.includes(path.basename(parent))
        || SOURCE_ROOT_NAMES.some((name) => fs.existsSync(path.join(parent, name)))
~~~~

NEW:

~~~~text
      if (
        path.basename(parent) === '.opencode'
        || SOURCE_ROOT_NAMES.some((name) => fs.existsSync(path.join(parent, name)))
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`

OLD:

~~~~text
  const parent = path.dirname(specsRoot);
  return SOURCE_ROOT_NAMES.includes(path.basename(parent)) ? path.dirname(parent) : parent;
}
~~~~

NEW:

~~~~text
  const parent = path.dirname(specsRoot);
  return path.basename(parent) === '.opencode' ? path.dirname(parent) : parent;
}
~~~~
