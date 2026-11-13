---
title: "Feature Specification: Start the skill advisor on the Node its native database module was built for"
description: "The advisor wrapper starts its CLI, launcher and daemon on whichever Node the session runs. The native database module is built for one Node ABI, so a first call from a session on another Node major ends with a dead launcher and exit 75. The install records the Node it ran on, and the wrapper starts the CLI on that Node when the session's ABI differs."
trigger_phrases:
  - "advisor native node resolution"
  - "start the skill advisor on the node"
  - "daemon launcher exited with code 1"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Start the skill advisor on the Node its native database module was built for

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/367-advisor-route-growth-and-node-plans` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/bin/skill-advisor.cjs` spawns the advisor CLI with `process.execPath`, and the CLI and the launcher pass that Node on to the daemon. The runtime's `better-sqlite3` module is built for the one Node ABI that ran the install. A session on another Node major therefore cannot start a daemon: the launcher exits, and the first advisor call returns exit 75. A project whose Node pin differs from the install's Node hits this on every cold start.

### Purpose
The first advisor call succeeds from a session on any Node major the package allows, as long as the Node that ran the install is still on disk.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
The runtime was installed under Node v26.13.0, ABI 147. Run from .skilled/skills/system-skill-advisor/runtime:
$ ~/.nvm/versions/node/v22.23.4/bin/node -e "require('better-sqlite3')(':memory:')"
ERR_DLOPEN_FAILED ... was compiled against a different Node.js version using NODE_MODULE_VERSION 147. This version of Node.js requires NODE_MODULE_VERSION 127
The same command under v24.22.2, ABI 137, fails the same way. Under v26.13.0 it loads.

With no daemon on a private socket directory, from the repository root:
$ SPECKIT_IPC_SOCKET_DIR=/tmp/adv.JHiKOf ~/.nvm/versions/node/v22.23.4/bin/node .skilled/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<repository root>"}'
{
  "status": "error",
  "error": "backend unavailable: daemon launcher exited with code 1",
  "exitCode": 75
}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the Node that ran the install in `node_modules/.advisor-node` of the advisor runtime, through a `postinstall` script in its `package.json`.
- Start the CLI on the recorded Node in `.skilled/bin/skill-advisor.cjs` when the session's ABI differs from the recorded one and the recorded binary exists.
- Print one line naming both ABIs when the recorded binary is gone, and keep the session's Node.
- Add one test file for the Node choice. The choice has no test today, and it cannot be exercised through the real record without reinstalling the runtime under another Node.

### Out of Scope
- Reusing `.skilled/bin/lib/node-engine-resolver.cjs` - it picks a Node that satisfies the package's engines range, and that range admits three majors while the built module matches one.
- A launcher that restarts itself on another Node - every caller reaches the daemon through the wrapper, so the wrapper is the one place that needs the choice. A second process per launcher would also change what the orphan sweeper and the lease see.
- Rebuilding the native module for the session's Node - it would rebuild under every Node switch and break the daemon another session is using.
- Barter's tree - Barter drops its own overlay on its next re-pin. The record has the path and shape Barter's overlay reads.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/package.json` | Modify | Add the `postinstall` script that writes the record |
| `.skilled/bin/skill-advisor.cjs` | Modify | Add `advisorNode`, spawn the CLI on its result and export it for the test |
| `.skilled/bin/tests/skill-advisor-node.test.cjs` | Create | Four cases for the Node choice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An install writes the record | After `npm ci --no-audit --no-fund` in `.skilled/skills/system-skill-advisor/runtime`, `cat node_modules/.advisor-node` prints one JSON object whose `execPath` is the installing Node and whose `modules` is that Node's `process.versions.modules` |
| REQ-002 | A cold first call works from another Node major | With an empty private `SPECKIT_IPC_SOCKET_DIR`, `~/.nvm/versions/node/v22.23.4/bin/node .skilled/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<repository root>"}'` exits 0. It exits 75 before the change |
| REQ-003 | The Node choice is tested | `node --test .skilled/bin/tests/skill-advisor-node.test.cjs` reports `pass 4` and `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A missing recorded binary is named | With a record whose `execPath` does not exist and whose `modules` differs from the session's, `advisorNode` returns the session's Node and a warning that contains both ABI numbers |
| REQ-005 | A session on the recorded ABI keeps its own Node | With a record whose `modules` equals the session's, `advisorNode` returns `process.execPath` and no warning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Node 22 cold-start command from the measured block exits 0 instead of 75.
- **SC-002**: `node --test .skilled/bin/tests/` reports `fail 0`, and the advisor runtime suite fails no test that passed in the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm runs the package's own `postinstall` script after `npm ci` | No record is written and the wrapper keeps today's behavior | T007 runs `npm ci` and reads the record. An install without a record behaves exactly as before |
| Risk | The record describes the Node of the last install. Rebuilding the native module by hand under another Node leaves the record wrong | Med | The limitation is stated in the implementation summary. A reinstall writes a correct record |
| Risk | Editing `package.json` makes the dist freshness check report the build stale | Low | T008 rebuilds the runtime before the end-to-end check |
| Risk | The end-to-end check starts a daemon on a private socket | Low | T011 stops the launcher it started and confirms none is left |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any caller start the launcher without going through the wrapper? Decision: no. The CLI's `spawnLauncher` is the only spawn of `system-skill-advisor-launcher.cjs`, and the OpenCode plugin names `skill-advisor.cjs` as its only advisor entry point.
- Does `npm rebuild better-sqlite3` rerun the package's own `postinstall`? Decision: UNKNOWN. It is treated as not rerun, which is the risk in section 6.
<!-- /ANCHOR:questions -->

---
