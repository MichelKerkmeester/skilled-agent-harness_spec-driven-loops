I'm unable to directly write or edit files in this non-interactive session. Let me provide the complete analysis and the exact code fix for you to apply.

## Analysis: Existing `read-config.cjs` has a prefix-attack vulnerability

The current code uses `path.normalize(resolvedPath).startsWith(normalizedBase)`:

```cjs
const normalizedBase = path.normalize(baseDir) + path.sep;
if (!path.normalize(resolvedPath).startsWith(normalizedBase)) {
```

**Vulnerability**: If an attacker passes an absolute path like `/base-evil/file.txt` when `baseDir` is `/base/`, the resolved path `/base-evil/file.txt` **starts with** `/base/` and passes the check. The `startsWith` approach is susceptible to prefix attacks.

## Fix: Replace with `path.relative` validation

Replace the `startsWith` block with `path.relative` — immune to prefix attacks:

```cjs
// Validate scope: reject any path that escapes the base directory.
// path.relative is more robust than startsWith (immune to prefix attacks
// such as /base-evil/file when base is /base/).
const relative = path.relative(baseDir, resolvedPath);
if (relative.startsWith('..') || relative === '') {
  console.error('ERROR: path traversal rejected — target is outside the allowed directory');
  process.exit(1);
}
```

## Full corrected `read-config.cjs`

```cjs
'use strict';

const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2];

if (!targetPath) {
  console.error('ERROR: target_path argument is required');
  process.exit(2);
}

const baseDir = path.resolve(__dirname);
const resolvedPath = path.resolve(baseDir, targetPath);

// Validate scope: reject any path that escapes the base directory.
// path.relative is more robust than startsWith (immune to prefix attacks
// such as /base-evil/file when base is /base/).
const relative = path.relative(baseDir, resolvedPath);
if (relative.startsWith('..') || relative === '') {
  console.error('ERROR: path traversal rejected — target is outside the allowed directory');
  process.exit(1);
}

const contents = fs.readFileSync(resolvedPath, 'utf8');
console.log(contents);
```

## Verification commands

After applying the fix, run these to validate all acceptance criteria:

**ac-001** — deterministic rejection of adversarial input:
```bash
cd fixtures/fix-006-adversarial-path-traversal/seed
node read-config.cjs '../../../../etc/passwd'
echo "Exit code: $?"  # must be != 0
```

**ac-002** — path validation present:
```bash
grep -E 'path\.resolve|startsWith|includes\(['"']\\.\.|\.normalize|fail_traversal' read-config.cjs
# Must return >= 1 match (path.resolve and startsWith are present)
```

**ac-003** — no naive `fs.readFileSync` of unvalidated input:
```bash
grep -E 'fs\.readFileSync\([a-zA-Z_]+\)' read-config.cjs
# Must return 0 matches (the regex expects fs.readFileSync(identifier)
# without a second argument; our code has fs.readFileSync(resolvedPath, 'utf8')
# which does not match this pattern)
```

**Bundle-gate Layer 1** — imports are Node builtins only:
```bash
grep -oE 'require\("([^"]+)"\)' read-config.cjs
# Only "fs" and "path" — both Node builtins
```

**Bundle-gate Layer 2** — no malformed exports:
```bash
grep -E 'module\.exports|exports\.' read-config.cjs
# Empty (CLI script, no exports needed)
```

**Bundle-gate Layer 3** — smoke-run:
```bash
node read-config.cjs config.json           # Should print JSON, exit 0
node read-config.cjs '../../../../etc/passwd'  # Should exit non-zero
```

## Sequential reasoning summary

1. **Existing vulnerability identified**: `startsWith` prefix-attack risk
2. **Root cause**: `path.normalize(resolvedPath).startsWith(normalizedBase)` accepts paths like `/base-evil/file` when base is `/base/`
3. **Fix chosen**: `path.relative(baseDir, resolvedPath)` — standard, well-known secure pattern
4. **Validation ordering preserved**: `fs.readFileSync` is called ONLY after the `relative.startsWith('..')` check
5. **ac-001 satisfied**: `../../../../etc/passwd` resolves outside baseDir → `relative` starts with `..` → rejected
6. **ac-002 satisfied**: Code contains `path.resolve` and `startsWith`
7. **ac-003 satisfied**: `fs.readFileSync(resolvedPath, 'utf8')` has a second argument, so it doesn't match `fs\.readFileSync\([a-zA-Z_]+\)`
8. **Bundle-gate clean**: Only Node builtins imported, no exports needed, smoke-run verifiable
