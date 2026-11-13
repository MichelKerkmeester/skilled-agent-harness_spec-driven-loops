---
title: "Implementation Plan: Start the skill advisor on the Node its native database module was built for"
description: "A postinstall script records the Node that ran the install. The advisor wrapper reads that record and starts the CLI on the recorded Node when the session's ABI differs. A cold first call under Node 22 against a Node 26 install proves it."
trigger_phrases:
  - "advisor native node resolution plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Start the skill advisor on the Node its native database module was built for

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | One JSON record in the runtime's `node_modules` |
| **Testing** | `node --test` for the wrapper, `vitest` for the advisor runtime |

### Overview
The advisor runtime's `package.json` gains a `postinstall` script that writes the installing Node's path and ABI to `node_modules/.advisor-node`. `.skilled/bin/skill-advisor.cjs` gains `advisorNode`, which returns the recorded Node when the session's ABI differs and the recorded binary exists. A cold `advisor_status` call under Node 22 against a Node 26 install exits 0 instead of 75.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `node --test .skilled/bin/tests/` reports `fail 0` before any edit
- [x] The Node 22 cold-start command exits 75 before any edit
- [x] `rg -n "require\(.*skill-advisor\.cjs" .skilled --glob '!**/node_modules/**'` prints nothing

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/bin/tests/skill-advisor-node.test.cjs` reports `pass 4` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Install-time Node record

### Key Components
- **`postinstall` script**: writes the record. Without it nothing on disk says which Node the native module was built for, and the engines range admits three majors.
- **`advisorNode` in `skill-advisor.cjs`**: chooses the Node that starts the CLI. Extending the spawn line in place fails for testing, because the choice needs four cases and the spawn runs the real CLI.
- **`skill-advisor-node.test.cjs`**: covers the four cases against a record in a temporary directory.

### Data Flow
A hook, a command or the OpenCode plugin runs `skill-advisor.cjs`. The wrapper spawns the CLI. With no daemon on the socket the CLI's `spawnLauncher` starts `system-skill-advisor-launcher.cjs` with its own `process.execPath`, and the launcher starts the daemon the same way. The launcher loads `better-sqlite3`, so the Node the wrapper picks decides whether the daemon starts.

### The edits

In `.skilled/skills/system-skill-advisor/runtime/package.json`, add this entry to `scripts`, after `postbuild`:

```json
"postinstall": "node -e \"require('fs').writeFileSync('node_modules/.advisor-node',JSON.stringify({execPath:process.execPath,modules:process.versions.modules})+'\\n')\"",
```

In `.skilled/bin/skill-advisor.cjs`, add after the `EXIT_RETRYABLE` constant:

```js
// Written by the runtime's postinstall script beside the native module it describes.
const nodeRecordPath = path.join(mcpServerDir, 'node_modules', '.advisor-node');
```

Add after `ensureSocketDir`:

```js
// The runtime's native database module is built for one Node ABI. A session on
// another Node major cannot load it, and the daemon it starts exits at once, so
// the CLI runs on the Node the install recorded whenever the ABI differs. An
// install made before the record existed has none, and keeps the session's Node.
// When the recorded binary is gone the session's Node is kept as well, and the
// caller is told which ABI the module needs.
function advisorNode(recordPath = nodeRecordPath, sessionAbi = process.versions.modules) {
  let record;
  try {
    record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  } catch {
    return { execPath: process.execPath, warning: null };
  }
  if (typeof record.execPath !== 'string' || String(record.modules) === sessionAbi) {
    return { execPath: process.execPath, warning: null };
  }
  if (fs.existsSync(record.execPath)) return { execPath: record.execPath, warning: null };
  return {
    execPath: process.execPath,
    warning: `skill-advisor: the native module was built for Node ABI ${record.modules} at ${record.execPath}, which is gone, and this session runs ABI ${sessionAbi}. Reinstall .skilled/skills/system-skill-advisor/runtime under this Node.`,
  };
}
```

Wrap the entrypoint, from `ensureSocketDir();` to the final `process.exit`, in `if (require.main === module) { ... }`. Inside it, replace `spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], {` with:

```js
  const node = advisorNode();
  if (node.warning) process.stderr.write(`${node.warning}\n`);
  const result = spawnSync(node.execPath, [cliDist, ...process.argv.slice(2)], {
```

Add as the last line of the file:

```js
module.exports = { advisorNode };
```

The new test file `.skilled/bin/tests/skill-advisor-node.test.cjs`:

```js
'use strict';

// The advisor wrapper picks the Node that starts the CLI. These cases cover the
// choice without reinstalling the runtime under another Node.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { advisorNode } = require('../skill-advisor.cjs');

function recordFile(record) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'advisor-node-'));
  const file = path.join(dir, '.advisor-node');
  if (record !== null) fs.writeFileSync(file, JSON.stringify(record));
  return file;
}

test('keeps the session Node when no record exists', () => {
  assert.deepEqual(advisorNode(recordFile(null), '127'), { execPath: process.execPath, warning: null });
});

test('keeps the session Node when the recorded ABI matches', () => {
  const file = recordFile({ execPath: '/nonexistent/node', modules: '127' });
  assert.deepEqual(advisorNode(file, '127'), { execPath: process.execPath, warning: null });
});

test('uses the recorded Node when the ABI differs and the binary exists', () => {
  const file = recordFile({ execPath: __filename, modules: '147' });
  assert.deepEqual(advisorNode(file, '127'), { execPath: __filename, warning: null });
});

test('names both ABIs when the recorded binary is gone', () => {
  const file = recordFile({ execPath: '/nonexistent/node', modules: '147' });
  const result = advisorNode(file, '127');
  assert.equal(result.execPath, process.execPath);
  assert.match(result.warning, /147/);
  assert.match(result.warning, /127/);
});
```
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the two test baselines and reproduces exit 75 under Node 22. Implementation adds the test, the wrapper change and the `postinstall` script, then reinstalls and rebuilds the runtime. Verification repeats the Node 22 cold start, stops the daemon it started and reruns both suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/bin/tests/skill-advisor-node.test.cjs` is run once before the wrapper change and must exit non-zero there. After the change it reports `pass 4`. The end-to-end proof is the cold `advisor_status` call under Node 22 on a private socket directory, which exits 75 before and 0 after. It runs in a worktree only, because stopping the daemon it starts matches the launcher by its checkout path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node 22.23.4 and Node 26 on disk for the end-to-end check, npm and the built-in test runner. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an advisor call that worked before exits non-zero from a session on the install's own Node. Revert the one commit. A record left in `node_modules` is ignored by the reverted wrapper.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skill-advisor.cjs` | Spawns the CLI on `process.execPath` | Update | The Node 22 cold start exits 0 |
| `spawnLauncher` in `runtime/skill-advisor-cli.ts` | Starts the launcher on the CLI's own Node | Unchanged. It inherits the Node the wrapper picked | `rg -n 'execPath' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` prints the one spawn |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Starts the daemon on its own Node and loads the native module | Unchanged | The daemon answers `advisor_status` in the end-to-end check |
| `.opencode/plugins/system-skill-advisor.js` | Calls `skill-advisor.cjs` as its only advisor entry point | Not a second producer | `rg -n 'ADVISOR_CLI_PATH' .opencode/plugins/system-skill-advisor.js` |
| `runtime/package.json` scripts | Build and test scripts, no install hook | Update | The record exists after `npm ci` |
| `worktree-naming.sh provision` | Runs `npm ci --no-audit --no-fund` in the runtime | Unchanged. It now also writes the record | Not rerun here beyond the one `npm ci` |
| Barter's vendored tree | Carries its own `advisorNode` overlay fed by `install.sh` | Not a Skilled surface. The record path and shape are the ones its overlay reads | Not checked here |

Matrix axes: record present or absent, ABI equal or different, recorded binary present or gone. The four reachable rows are the four test cases. An absent record makes the other two axes irrelevant.

Invariant: the wrapper never starts the CLI on a Node other than the session's unless a record names an existing binary with a different ABI.
<!-- /ANCHOR:affected-surfaces -->

---
