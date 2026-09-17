## Edit 1

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
'use strict';

// Durable guard: no runtime code may require or import from `.opencode/specs`.
//
~~~~

NEW:

~~~~text
'use strict';

// Durable guard: no runtime code may require or import from the spec tree.
//
~~~~

## Edit 2

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
// it fails if any scanned runtime file requires/imports a target that resolves
// under `.opencode/specs`, or embeds the compiled-routing spec-tree path in a
// require/import-adjacent literal, so the coupling cannot silently return.
~~~~

NEW:

~~~~text
// it fails if any scanned runtime file requires/imports a target that resolves
// under the spec tree, or embeds the compiled-routing spec-tree path in a
// require/import-adjacent literal, so the coupling cannot silently return.
~~~~

## Edit 3

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
// Exit 0 = clean, 1 = at least one violation (each named on stderr), 2 = the scan
// read no file. A scan that reads nothing proves nothing, and it must not share the
// violation code: a caller that expects a violation from a fixture would otherwise
// accept a fixture that moved away.

const fs = require('fs');
~~~~

NEW:

~~~~text
// Exit 0 = clean, 1 = at least one violation (each named on stderr), 2 = the scan
// found no file or could not read one. A file the scan never read proves nothing,
// and that outcome must not share the violation code: a caller that expects a
// violation from a fixture would otherwise accept a fixture that moved away.

const fs = require('fs');
~~~~

## Edit 4

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
}

function scanFile(file) {
  const violations = [];
  if (ALLOWLIST_BASENAMES.has(path.basename(file))) return violations;
  let source;
  try { source = fs.readFileSync(file, 'utf8'); } catch { return violations; }
  const lines = source.split('\n');
~~~~

NEW:

~~~~text
}

// A file that cannot be read is collected apart from violations: its imports are
// unknown, so the scan fails with the no-proof code instead of passing it.
function scanFile(file, unreadable = []) {
  const violations = [];
  if (ALLOWLIST_BASENAMES.has(path.basename(file))) return violations;
  let source;
  try { source = fs.readFileSync(file, 'utf8'); } catch { unreadable.push(file); return violations; }
  const lines = source.split('\n');
~~~~

## Edit 5

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
        if (targetResolvesUnderSpecs(fileDir, target)) {
          violations.push({ file, line: index + 1, target, reason: 'import/require resolves under .opencode/specs' });
        }
~~~~

NEW:

~~~~text
        if (targetResolvesUnderSpecs(fileDir, target)) {
          violations.push({ file, line: index + 1, target, reason: 'import/require resolves under the spec tree' });
        }
~~~~

## Edit 6

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
  const violations = [];
  for (const file of files) violations.push(...scanFile(file));

  if (violations.length > 0) {
    process.stderr.write('FAIL: runtime code imports from .opencode/specs:\n');
    for (const v of violations) {
~~~~

NEW:

~~~~text
  const violations = [];
  const unreadable = [];
  for (const file of files) violations.push(...scanFile(file, unreadable));

  if (violations.length > 0) {
    process.stderr.write('FAIL: runtime code imports from the spec tree:\n');
    for (const v of violations) {
~~~~

## Edit 7

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
    process.exit(1);
  }
~~~~

NEW:

~~~~text
    process.exit(1);
  }
  if (unreadable.length > 0) {
    process.stderr.write(`FAIL: could not read ${unreadable.length} runtime file(s); an unread file proves nothing:\n`);
    for (const file of unreadable) process.stderr.write(`  ${path.relative(REPO_ROOT, file)}\n`);
    process.exit(2);
  }
~~~~
