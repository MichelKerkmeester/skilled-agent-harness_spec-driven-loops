## Edit 1

File: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
// the other. Source paths spell the tree one way, so a path absent under its own spelling
// resolves under the other name before it counts as missing.
const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];

function absolutePath(sourcePath) {
~~~~

NEW:

~~~~text
// the other. Source paths spell the tree one way, so a path absent under its own spelling
// resolves under the other name before it counts as missing. A path absent under both,
// such as an output directory a first write creates, resolves under the tree this script
// runs from, so a write never plants a second source tree.
const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];
const OWN_SOURCE_ROOT_NAME = path.relative(WORKSPACE_ROOT, __dirname).split(path.sep)[0];

function absolutePath(sourcePath) {
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
  const otherResolved = path.resolve(WORKSPACE_ROOT, otherName, ...rest);
  return fs.existsSync(otherResolved) ? otherResolved : resolved;
}
~~~~

NEW:

~~~~text
  const otherResolved = path.resolve(WORKSPACE_ROOT, otherName, ...rest);
  if (fs.existsSync(otherResolved)) return otherResolved;
  if (!SOURCE_ROOT_NAMES.includes(OWN_SOURCE_ROOT_NAME)) return resolved;
  return path.resolve(WORKSPACE_ROOT, OWN_SOURCE_ROOT_NAME, ...rest);
}
~~~~
