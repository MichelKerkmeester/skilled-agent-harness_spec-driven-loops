## Edit 1

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
// Exit 0 = clean, 1 = at least one violation (each named on stderr), 2 = the scan
// found no file or could not read one. A file the scan never read proves nothing,
// and that outcome must not share the violation code: a caller that expects a
// violation from a fixture would otherwise accept a fixture that moved away.

const fs = require('fs');
~~~~

NEW:

~~~~text
// Exit 0 = clean, 1 = at least one violation (each named on stderr), 2 = the scan
// read no file or could not read one it found, which outranks a violation. A file
// the scan never read proves nothing, and that outcome must not share the violation
// code: a caller that expects a violation from a fixture would otherwise accept a
// fixture that moved away.

const fs = require('fs');
~~~~

## Edit 2

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
  for (const root of roots) walk(root, files);
  if (files.length === 0) {
    process.stderr.write(`FAIL: scanned no runtime file under ${roots.join(', ')}; an empty scan proves nothing\n`);
~~~~

NEW:

~~~~text
  for (const root of roots) walk(root, files);
  // An allowlisted file is never read, so only the other files can prove anything.
  const scanned = files.filter((file) => !ALLOWLIST_BASENAMES.has(path.basename(file)));
  if (scanned.length === 0) {
    process.stderr.write(`FAIL: scanned no runtime file under ${roots.join(', ')}; an empty scan proves nothing\n`);
~~~~

## Edit 3

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
  const unreadable = [];
  for (const file of files) violations.push(...scanFile(file, unreadable));

  if (violations.length > 0) {
~~~~

NEW:

~~~~text
  const unreadable = [];
  for (const file of scanned) violations.push(...scanFile(file, unreadable));

  if (violations.length > 0) {
~~~~

## Edit 4

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
    }
    process.exit(1);
  }
~~~~

NEW:

~~~~text
    }
  }
~~~~

## Edit 5

File: `.opencode/bin/check-no-spec-imports.cjs`

OLD:

~~~~text
  }
  process.stdout.write(`ok: no spec-tree imports in ${files.length} runtime file(s) across ${roots.length} dir(s)\n`);
}
~~~~

NEW:

~~~~text
  }
  if (violations.length > 0) process.exit(1);
  process.stdout.write(`ok: no spec-tree imports in ${scanned.length} runtime file(s) across ${roots.length} dir(s)\n`);
}
~~~~
