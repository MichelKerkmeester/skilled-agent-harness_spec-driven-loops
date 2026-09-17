## Edit 1

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
//   check-no-spec-imports.cjs <dir...>   scan explicit dirs (used by fixtures)
// Exit 0 = clean, 1 = at least one violation (each named on stderr).

const fs = require('fs');
~~~~

NEW:

~~~~text
//   check-no-spec-imports.cjs <dir...>   scan explicit dirs (used by fixtures)
// Exit 0 = clean, 1 = at least one violation (each named on stderr), 2 = the scan
// read no file. A scan that reads nothing proves nothing, and it must not share the
// violation code: a caller that expects a violation from a fixture would otherwise
// accept a fixture that moved away.

const fs = require('fs');
~~~~

## Edit 2

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
// specs/ is the canonical physical tree; .opencode/specs is a compat symlink
// alias to it. path.resolve() is lexical and never follows symlinks, so an
// import written against either form must be checked against its own root —
// checking only one root lets an import through the other spelling.
const SPECS_ROOTS = [
  path.join(REPO_ROOT, 'specs'),
  path.join(REPO_ROOT, '.opencode', 'specs'),
];

// Runtime directories that must never import from the spec tree.
const DEFAULT_ROOTS = [path.join(REPO_ROOT, '.opencode', 'bin')];

// The promoted closure is generated (byte copies of the authored source) and is
~~~~

NEW:

~~~~text
// specs/ is the canonical physical tree; .opencode/specs is a compat symlink
// alias to it, and the source tree may sit under .skilled instead, which spells
// the alias .skilled/specs. path.resolve() is lexical and never follows symlinks,
// so an import written against any form must be checked against its own root —
// checking only one root lets an import through another spelling.
const SPECS_ROOTS = [
  path.join(REPO_ROOT, 'specs'),
  path.join(REPO_ROOT, '.opencode', 'specs'),
  path.join(REPO_ROOT, '.skilled', 'specs'),
];

// Runtime directories that must never import from the spec tree. This guard lives
// in that directory, and Node reports its real path through an .opencode link, so
// its own directory is the runtime directory under whichever name the tree has.
const DEFAULT_ROOTS = [__dirname];

// The promoted closure is generated (byte copies of the authored source) and is
~~~~

## Edit 3

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
function targetResolvesUnderSpecs(fileDir, target) {
  if (target.includes('.opencode/specs') || target.includes('/specs/')) return true;
  if (!target.startsWith('.')) return false; // bare module id, not a path import
~~~~

NEW:

~~~~text
function targetResolvesUnderSpecs(fileDir, target) {
  if (target.includes('.opencode/specs') || target.includes('.skilled/specs') || target.includes('/specs/')) return true;
  if (!target.startsWith('.')) return false; // bare module id, not a path import
~~~~

## Edit 4

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
    // fed to a dynamic require via a variable (the original coupling's shape).
    if (line.includes(COMPILED_ROUTING_SPEC_FRAGMENT) || line.includes('.opencode/specs')) {
      if (/\b(require|import)\b/.test(line) || /['"][^'"]*specs\/sk-doc\/019-skill-routing-refactor/.test(line)) {
~~~~

NEW:

~~~~text
    // fed to a dynamic require via a variable (the original coupling's shape).
    if (line.includes(COMPILED_ROUTING_SPEC_FRAGMENT) || line.includes('.opencode/specs') || line.includes('.skilled/specs')) {
      if (/\b(require|import)\b/.test(line) || /['"][^'"]*specs\/sk-doc\/019-skill-routing-refactor/.test(line)) {
~~~~

## Edit 5

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
  for (const root of roots) walk(root, files);

  const violations = [];
~~~~

NEW:

~~~~text
  for (const root of roots) walk(root, files);
  if (files.length === 0) {
    process.stderr.write(`FAIL: scanned no runtime file under ${roots.join(', ')}; an empty scan proves nothing\n`);
    process.exit(2);
  }

  const violations = [];
~~~~
