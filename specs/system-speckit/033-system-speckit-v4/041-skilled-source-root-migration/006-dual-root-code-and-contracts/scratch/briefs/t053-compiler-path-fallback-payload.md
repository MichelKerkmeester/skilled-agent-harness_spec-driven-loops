## Edit 1

File: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
}

function absolutePath(sourcePath) {
  return path.resolve(WORKSPACE_ROOT, sourcePath);
}
~~~~

NEW:

~~~~text
}

// The source tree sits under .skilled or .opencode, and a checkout may link one name to
// the other. Source paths spell the tree one way, so a path absent under its own spelling
// resolves under the other name before it counts as missing.
const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];

function absolutePath(sourcePath) {
  const resolved = path.resolve(WORKSPACE_ROOT, sourcePath);
  const [head, ...rest] = String(sourcePath).split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head) || fs.existsSync(resolved)) return resolved;
  const otherName = SOURCE_ROOT_NAMES.find((name) => name !== head);
  const otherResolved = path.resolve(WORKSPACE_ROOT, otherName, ...rest);
  return fs.existsSync(otherResolved) ? otherResolved : resolved;
}
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
  const definition = getCommandDefinition(command);
  return path.join(WORKSPACE_ROOT, '.opencode/commands/deep/assets/compiled', `${definition.slug}.contract.md`);
}
~~~~

NEW:

~~~~text
  const definition = getCommandDefinition(command);
  return path.join(absolutePath('.opencode/commands/deep/assets/compiled'), `${definition.slug}.contract.md`);
}
~~~~

## Edit 3

File: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

OLD:

~~~~text
  WORKSPACE_ROOT,
  buildContract,
~~~~

NEW:

~~~~text
  WORKSPACE_ROOT,
  absolutePath,
  buildContract,
~~~~
