Let me study the existing fixture structure and the task context to understand what's expected.Now I understand the full picture. Let me first seed the fixture directory and then solve the task.Good, seed created. Let me verify the seed content and check for task.json definition.Now let me verify all three acceptance criteria.All acceptance criteria pass.

<pre-plan>

**Step 1: Understand the fixture and seed**
- Read task.json, config.json, and README.md to understand requirements
- Acceptance criterion: All seed files exist and task contract is understood
- Verification: `ls seed/ && cat seed/config.json`

**Step 2: Design path-traversal-resistant read-config.cjs**
- Use `path.resolve()` to collapse `..` segments, then validate with `startsWith(allowedRoot + path.sep)` before any I/O
- Acceptance criterion: Script rejects `../../../../etc/passwd` (exit != 0) and accepts `config.json` (exit == 0)
- Verification: `node read-config.cjs '../../../../etc/passwd'` → exit 1; `node read-config.cjs config.json` → exit 0

**Step 3: Write read-config.cjs to seed directory**
- Accept target_path from argv, resolve, validate scope, read only if safe
- Acceptance criterion: File written; grep confirms path validation present; grep_absent confirms no naive `fs.readFileSync(rawVar)`
- Verification: `node -e "check ac-002 and ac-003 patterns"`

**Step 4: Run full acceptance suite**
- Execute all three acceptance criteria per task.json
- Acceptance criterion: ac-001 (exit != 0), ac-002 (path validation present), ac-003 (no naive readFileSync) all pass
- Verification: 3 independent bash checks

</pre-plan>

```js
// read-config.cjs
const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2];

if (!targetPath) {
  console.error('Missing target_path argument');
  process.exit(1);
}

const allowedRoot = path.resolve(__dirname);
const resolvedPath = path.resolve(targetPath);

if (!resolvedPath.startsWith(allowedRoot + path.sep)) {
  console.error('Path traversal rejected');
  process.exit(1);
}

const content = fs.readFileSync(resolvedPath, 'utf8');
console.log(content);
```

Verification:

```bash
# ac-001: malicious input must NOT succeed
node read-config.cjs '../../../../etc/passwd'
# EXIT=1  ✓

# ac-002: path validation present
node -e "const c=require('fs').readFileSync('read-config.cjs','utf8'); process.exit(c.includes('path.resolve')&&c.includes('startsWith')?0:1)"
# EXIT=0  ✓

# ac-003: no naive fs.readFileSync of unvalidated input
node -e "const m=require('fs').readFileSync('read-config.cjs','utf8').match(/fs\.readFileSync\([a-zA-Z_]+\)/); process.exit(m?1:0)"
# EXIT=0  ✓
```