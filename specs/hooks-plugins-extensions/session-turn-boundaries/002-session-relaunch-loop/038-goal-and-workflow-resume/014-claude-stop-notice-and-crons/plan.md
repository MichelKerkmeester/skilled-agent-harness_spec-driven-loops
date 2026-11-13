---
title: "Implementation Plan: Phase 14: claude-stop-notice-and-crons"
description: "Confirm live that crons end on a hop and that a Stop systemMessage reaches the operator, then add a deferral notice and a cron count log to the Claude Stop adapter, test first."
trigger_phrases:
  - "claude stop notice and crons plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: claude-stop-notice-and-crons

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, ESM in the Claude adapter and CommonJS in the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record JSON and `relaunch.log` in the relaunch state directory |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
Two live checks come first: a cron made in a sender must be gone in its receiver, and a Stop hook's `systemMessage` must reach the operator. Then the deferral branch of `armPendingRecord` in `claude/stop-arm.mjs` prints one `systemMessage` line, and the adapter logs the cron count once a record is armable. The proof is two tests that fail before the edit, the whole relaunch suite and one strict validation run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 011 is merged, so `rg -n 'armed = arm\(' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints the line 011 left
- [ ] `scratch/live-crons.txt` records both live checks

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single hook branch.

### Key Components
- **`armPendingRecord` in `claude/stop-arm.mjs`**: today it defers silently at `:119-135`. It gains the notice write in that branch and the cron log after the armable check at `:106`. The write goes through a `dependencies.write` seam that defaults to `process.stdout.write`, so `adapter-conformance.test.cjs:205-216`, which imports the function, needs no change.

### Data Flow
Claude sends the Stop payload on stdin. `main` parses it (`stop-arm.mjs:176`) and calls `armPendingRecord`. After the record is found armable (`:106`), a non-empty `session_crons` array appends `session-crons` with its length through `logEvent` (`:44-48`). In the deferral branch the adapter keeps its log line and `markDeferred` call, then writes `{"systemMessage": <text>}` and a newline to stdout before it returns null. Claude shows the message, and the hook still exits 0 through `done` (`:39-41`).

D2 decision on the cron list: the adapter logs the count only and leaves the list to phase 009's `Scheduled:` note line. Stop runs after `prepare` has validated the note, so a Stop write would change a validated note at every turn end, and the entry shape is unconfirmed until REQ-001 records it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/stop-arm.mjs` deferral branch | Defers the hop and logs, with no output | update | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `claude/stop-arm.mjs` armable path | Ignores `session_crons` | update | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `markDeferred` in `lib/relaunch-core.cjs:1147-1155` | Stamps a pending record only | unchanged | `stop-arm defers an armed record with a dead killer while background tasks run` passes |
| `context-nudge` withdrawal on a prompt | Withdraws a deferred or armed record (`README.md:126`) | not a consumer | The notice text states it, and no code reads the notice |
| `codex/stop-arm.mjs` | Codex Stop adapter | unchanged | `rg -n 'systemMessage|session_crons' .skilled/hooks/session-relaunch/codex` prints nothing |

Required inventories:
- Finding classes: the silent deferral and the unread cron field are `instance-only`, proven by the Measured Behavior search.
- Same-class producers: `rg -n 'session_crons|systemMessage' .skilled/hooks/session-relaunch` before the edit prints the fixture line only.
- Consumers of changed symbols: `rg -n 'armPendingRecord' .skilled/hooks/session-relaunch` lists the adapter, its tests and the conformance test.
- Matrix axes: record state (pending, armed with a dead killer), `background_tasks` (empty, one, many), `session_crons` (missing, empty, two, not an array).
- Algorithm invariant: the hook exits 0 on every path and never prints a `decision` field.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the two runtime claims live and records the baseline of the relaunch suite. Implementation writes the two failing tests in `claude-adapters.test.cjs`, then edits `claude/stop-arm.mjs` until they pass. Verification runs the whole relaunch suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The deferral notice and the cron log, through the spawned adapter | `node:test` |
| Integration | The Claude row of the adapter conformance test | `node:test` |
| Manual | A live hop with one `/loop` task and one deferred Stop | `skilled-loop` in a throwaway checkout |

Each must-fail test runs first as `env -u AI_SESSION_CHILD node --test --test-name-pattern '<title>' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` and must exit 1 with its assertion failure, saved to `scratch/red.txt`. After the edit the same command must exit 0 with `fail 0`, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 `011-permission-mode-carry`, which edits the same file | Internal | Yellow | Building first would conflict at the `arm` call |
| Phase 009 `009-nudge-note-lines`, which owns the `Scheduled:` line | Internal | Yellow | The cron list would reach no note, and only the count is logged |
| Claude Code with a login, in a throwaway checkout | External | Yellow | REQ-001 and REQ-002 cannot be observed live |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Claude session continues its turn after a deferred Stop, or any relaunch test fails after the edit.
- **Procedure**: revert the one commit that touches `claude/stop-arm.mjs` and `claude-adapters.test.cjs`. No record format or data changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 011 ──► Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 011 merged | Implementation |
| Implementation | Both live checks recorded and confirmed | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
