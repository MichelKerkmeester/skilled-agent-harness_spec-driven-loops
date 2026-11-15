---
title: "Implementation Plan: Phase 1: sender-dialog-after-prepare"
description: "Confirm from four saved runs that a question dialog followed prepare, then make the Claude PreToolUse guard deny AskUserQuestion while this session's hand-over is pending, test first."
trigger_phrases:
  - "sender dialog after prepare plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: sender-dialog-after-prepare

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, ESM in the Claude adapter and CommonJS in the tests and the core |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record JSON in the relaunch state directory, read only |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
The saved evidence of four failed runs is read first to confirm that a question dialog followed `prepare`. Then `claude/subagent-guard.mjs` denies `AskUserQuestion` while this session's record is pending, and a second PreToolUse binding sends that tool to the guard. The proof is one test that fails before the edit, five pass-through tests, the whole relaunch suite and the registration check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `rg -c 'killer-signal| relaunch ' scratch/failed-runs/*/relaunch-log.txt` prints nothing, so no failed run armed or hopped

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints `PASS`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single hook branch.

### Key Components
- **`pendingHandOver` in `claude/subagent-guard.mjs`**: returns the record when the tool is `AskUserQuestion`, `SKILLED_LOOP_ID` is set and `armableRecord` reports `pending` for this session and runtime `claude`. Without it the dialog opens and the turn never reaches Stop.
- **The `AskUserQuestion` binding in `hook-registry.json`**: sends that tool's PreToolUse to the guard. Without it the guard only ever sees `Bash`.

### Data Flow
Claude sends the PreToolUse payload on stdin. `main` checks the concern switch, parses the payload and runs the existing sub-agent lifecycle check first. For any other call it reads the loop's record with `readRelaunchFile` and asks `armableRecord` for a verdict. Reason `pending` prints a deny envelope that names the note and the cancel command. Every other verdict, a missing loop id or a failed read exits 0 with no output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/subagent-guard.mjs` | Denies relaunch lifecycle commands from a sub-agent | update | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` |
| `hook-registry.json` PreToolUse bindings | Sends `Bash` to the guard | update | `sync-hook-registrations.cjs --check` prints `PASS` |
| `.claude/settings.json` | Generated hook wiring | update by the sync script | `rg -n 'AskUserQuestion' .claude/settings.json` prints the new matcher |
| `readRelaunchFile` and `armableRecord` in `lib/relaunch-core.cjs` | Read and judge the record | unchanged | `git diff --name-only -- .skilled/hooks/session-relaunch/lib` prints nothing |
| `claude/stop-arm.mjs` | Arms the pending record at Stop | not a consumer | No line in it changes |
| `decision-capture/claude/ask-capture-posttooluse.mjs` | Reads `AskUserQuestion` at PostToolUse | not a consumer | A denied call never reaches PostToolUse |

Required inventories:
- Same-class producers: only Stop arms a Claude record. `rg -n 'arm\(' .skilled/hooks/session-relaunch/claude` prints one line, in `stop-arm.mjs`.
- Consumers of changed symbols: `rg -c 'session-relaunch/claude/subagent-guard' .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json .claude/settings.json` prints 2 for each file, the `Bash` binding and the new one.
- Matrix axes: record (none, pending for this session, pending for another session, armed), `SKILLED_LOOP_ID` (set, unset), concern (on, off). Six rows are tested.
- Algorithm invariant: the guard denies only on verdict `pending` and exits 0 on every path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the four failed runs under `scratch/failed-runs/` and records the suite baseline of 1524. Implementation adds six tests to `subagent-guard.test.cjs`, extends `subagent-guard.mjs` until they pass and adds the registry binding. Verification runs the whole suite, both sync checks and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The guard, spawned with a sandboxed state directory and a prepared record | `node:test` |
| Integration | The registry renders the new binding into `.claude/settings.json` | `sync-hook-registrations.cjs --check` |
| Manual | None in this phase. A live sender that runs `prepare` and then asks is not run | Not run |

The denial test runs first as `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` and must show 1 fail, saved to `scratch/red.txt`. After the edit the same command must show 20 of 20, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `readRelaunchFile` and `armableRecord` in `lib/relaunch-core.cjs` | Internal | Green | The guard would need its own record read, which D3 forbids |
| `sync-hook-registrations.cjs` | Internal | Green | `.claude/settings.json` would not carry the binding |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a question dialog is refused when no hand-over is pending, or any relaunch test fails after the edit.
- **Procedure**: revert the commit that touches the guard, its tests, the registry and `.claude/settings.json`, then run `sync-hook-registrations.cjs --check`. No record format changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The four failed runs saved by child 016 of packet 038 | Implementation |
| Implementation | The opening check confirmed | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
