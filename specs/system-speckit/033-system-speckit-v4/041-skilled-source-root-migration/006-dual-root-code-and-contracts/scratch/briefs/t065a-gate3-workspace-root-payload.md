## Edit 1

File: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`

OLD:

~~~~text
}

function findWorkspaceRoot(startPath: string): string {
~~~~

NEW:

~~~~text
}

// The source tree sits under .skilled or .opencode, and a checkout may link one name
// to the other, so either name marks the directory that holds the tree.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];

function findWorkspaceRoot(startPath: string): string {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`

OLD:

~~~~text
      || directoryExists(path.join(current, 'specs'));
    if (
      hasSpecRoot
      && (
        directoryExists(path.join(current, '.opencode', 'skills'))
        || (fileExists(path.join(current, 'AGENTS.md')) && directoryExists(path.join(current, '.opencode')))
      )
    ) {
      discoveredRoot = current;
~~~~

NEW:

~~~~text
      || directoryExists(path.join(current, 'specs'));
    const holdsSourceTree = SOURCE_ROOT_NAMES.some((name) => directoryExists(path.join(current, name, 'skills')))
      || (
        fileExists(path.join(current, 'AGENTS.md'))
        && SOURCE_ROOT_NAMES.some((name) => directoryExists(path.join(current, name)))
      );
    if (hasSpecRoot && holdsSourceTree) {
      discoveredRoot = current;
~~~~
