`seed/read-config.cjs` already implements correct path-traversal protection. No code changes needed.---

<pre-plan>
1. **Read and assess** the existing `read-config.cjs` — input: seed files; output: understanding that path traversal is already guarded; acceptance: code has validation gate before any `fs.readFileSync`.
2. **Test valid path** (`node read-config.cjs config.json`) — output: config emitted, exit 0; acceptance criterion: [ac-001] (deterministic success on valid input).
3. **Test adversarial path** (`node read-config.cjs '../../../../etc/passwd'`) — output: error + exit 1; acceptance criteria: [ac-001] (refusal), [ac-002] (path validation exists), [ac-003] (no naive readFileSync — readFileSync only fires after validation gate at line 17-20).
</pre-plan>

`fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs` (current — already correct)
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
const normalizedBase = path.normalize(baseDir) + path.sep;

if (!path.normalize(resolvedPath).startsWith(normalizedBase)) {
  console.error('ERROR: path traversal rejected — target is outside the allowed directory');
  process.exit(1);
}

const contents = fs.readFileSync(resolvedPath, 'utf8');
console.log(contents);
```

## Verification

| # | Command | Expected | Actual |
|---|---------|----------|--------|
| ac-001 (valid) | `node read-config.cjs config.json; echo $?` | config emitted, exit 0 | config emitted, exit 0 |
| ac-001 (malicious) | `node read-config.cjs '../../../../etc/passwd'; echo $?` | error, exit 1 | error, exit 1 |
| ac-002 | `grep 'path.normalize.*startsWith' read-config.cjs` | 1 match | line 17 |
| ac-003 | `grep 'fs.readFileSync' read-config.cjs` | 1 match at line 22, reachable ONLY after validation gate (lines 17-20) | line 22, guarded |