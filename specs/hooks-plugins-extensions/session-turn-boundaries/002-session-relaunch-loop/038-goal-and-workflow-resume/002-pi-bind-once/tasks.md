---
title: "Tasks: Phase 2: pi-bind-once"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "pi bind once tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: pi-bind-once

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `EXT` is `.skilled/hooks/goal/pi/goal-context.ts`. `TEST` is `.skilled/hooks/goal/pi/goal-pi.test.mjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the Pi goal suite before any edit and record the baseline (`TEST`). Verify: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
- [ ] T002 Confirm the guard is keyed by session id and no line clears the packet variable (`EXT`). Verify: `rg -n 'handOverAttempted|SESSION_RELAUNCH_GOAL_PACKET' .skilled/hooks/goal/pi/goal-context.ts` prints the set lines and no line that names the variable.
- [ ] T003 Confirm the must-fail case does not exist yet (`TEST`). Verify: `rg -n 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the failing case for a second `session_start` with a new id (`TEST`). Verify: `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 1 before the guard change.
- [ ] T005 Clear `SESSION_RELAUNCH_GOAL_PACKET` after the first attempt with a session id (`EXT`). Verify: `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] T006 Rewrite the guard comment to name the once-per-process rule without a spec path or finding id (`EXT`). Verify: `rg -n 'once per process' .skilled/hooks/goal/pi/goal-context.ts` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the five hand-over guard cases (`TEST`). Verify: `node --test --test-name-pattern 'hand-over|first input binds|session own|dispatched child|switch, an empty variable' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] T008 Run the full Pi goal suite (`TEST`). Verify: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
- [ ] T009 Run strict validation on the packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements are documented in `spec.md`. Verify: `rg -c '^\| REQ-' spec.md` prints 2.
- [ ] CHK-002 [P0] The technical approach is defined in `plan.md`. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' plan.md` prints one line.
- [ ] CHK-003 [P1] The Pi test file runs before the change. Verify: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The extension is imported and exercised by the suite. Verify: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
- [ ] CHK-011 [P0] The extension carries no template token. Verify: `rg -n 'YOUR_VALUE_HERE' .skilled/hooks/goal/pi/goal-context.ts` prints no line.
- [ ] CHK-012 [P1] The extension names the packet variable only in the clear line. Verify: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET' .skilled/hooks/goal/pi/goal-context.ts` prints one line.
- [ ] CHK-013 [P1] The input and session_start handlers still call the shared guard. Verify: `rg -n 'bindHandOverGoal\(core, options\)' .skilled/hooks/goal/pi/goal-context.ts` prints two lines.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria are met. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 2 at closure.
- [ ] CHK-021 [P0] The must-fail case passes. Verify: `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] CHK-022 [P1] The five hand-over guard cases pass. Verify: `node --test --test-name-pattern 'hand-over|first input binds|session own|dispatched child|switch, an empty variable' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] CHK-023 [P1] The full file passes. Verify: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`, because every runtime binder can bind a second session. Verify: `rg -n 'bindRelaunchGoal' .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.mjs'` lists more than one binder.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET' .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.mjs'` lists every reader and this phase changes only the Pi binder.
- [ ] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'bindHandOverGoal' .skilled/hooks/goal/pi` lists the function and its two callers.
- [ ] CHK-FIX-004 [P0] No parser, path or redaction is added. Verify: `git diff -U0 -- .skilled/hooks/goal/pi/goal-context.ts | rg -n '^\+.*(parseHandoff|handoffPathWithinRepo|redact)'` prints no line.
- [ ] CHK-FIX-005 [P1] The matrix axes and covered rows are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] The hostile process-wide state variant runs. Verify: `node --test --test-name-pattern 'a second session_start with a new id binds nothing|dispatched child' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit. Verify: `git rev-parse HEAD` prints the SHA named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `rg -n 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|api[_-]?key\s*=' .skilled/hooks/goal/pi/goal-context.ts` prints no line.
- [ ] CHK-031 [P0] Input validation stays in the core. Verify: `rg -n 'path\.|resolve\(|normalize\(' .skilled/hooks/goal/pi/goal-context.ts` prints no line.
- [ ] CHK-032 [P1] N/A: the change adds no auth path and no new data store.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same change. Verify: `rg -l 'SESSION_RELAUNCH_GOAL_PACKET' spec.md plan.md tasks.md` prints three paths.
- [ ] CHK-041 [P1] The changed code carries no spec path or finding id. Verify: `rg -n 'specs/|finding' .skilled/hooks/goal/pi/goal-context.ts` exits 1.
- [ ] CHK-042 [P2] The README stays for phase 007. Verify: `git diff --name-only | rg -n 'goal/README\.md'` prints no line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only. Verify: `find . -maxdepth 1 -name '*.tmp'` prints no line.
- [ ] CHK-051 [P1] `scratch/` holds only the finding. Verify: `ls scratch` prints `finding.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
