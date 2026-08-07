<pre-plan>

## Pre-Plan: fix-002-wrong-cwd-paths transform.js

### Step 1: Verify seed directory state
- **Acceptance criterion**: `config/settings.json` exists and is readable; `output/` directory exists
- **Verification**: `ls seed/config/settings.json seed/output/`

### Step 2: Write `transform.js` with bare-relative paths
- **Acceptance criterion**: Script uses only bare-relative paths (`'./config/settings.json'`, `'./output/result.json'`), no `/Users/`, no `~/`, no `process.cwd()`
- **Verification**: `grep -c '/Users/\|~/\|process.cwd()' seed/transform.js` returns 0

### Step 3: Execute `node transform.js` from seed CWD
- **Acceptance criterion**: Exits 0, produces `output/result.json` with valid JSON
- **Verification**: `node transform.js && echo "EXIT=$?" && node -e "JSON.parse(require('fs').readFileSync('./output/result.json','utf8')); console.log('VALID_JSON')`

### Step 4: Run formal acceptance checks (ac-001, ac-002, ac-003)
- **Verification**: Grep-based checks + deterministic run from fixture CWD

</pre-plan>

Now executing the plan.All three acceptance criteria pass.

**Summary:**

| Criterion | Check | Result |
|-----------|-------|--------|
| ac-001 | No `/Users/` in `transform.js` | PASS |
| ac-002 | No `~/` in `transform.js` | PASS |
| ac-003 | `node transform.js` exits 0, deterministic | PASS |

**Files created:**
- `seed/transform.js` — uses bare-relative paths (`'./config/settings.json'`, `'./output/result.json'`), no `process.cwd()`, no absolute/home-relative paths
- `seed/output/result.json` — valid JSON with transformed settings payload