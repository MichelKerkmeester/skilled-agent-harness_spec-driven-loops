---
title: "Tasks: Phase 4: claude-start-claim"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude start claim tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: claude-start-claim

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

`PKT` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim`. `TEST` is `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase brief and confirm the work package names two files (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/scratch/finding.md`). Verify: `rg -n 'Must fail first' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/scratch/finding.md` prints one line.
- [x] T002 Record the baseline of the `compact-pointer` tests (`claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` prints the three start-claim tests as failing.
- [x] T003 Confirm the shared resolver names the deciding switch (`hook-flags.cjs`). Verify: `rg -n 'reason: "runtime"|reason: "kill"|reason: "master"' .skilled/hooks/shared/hook-flags.cjs` prints three lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the concern-off start-claim test (`claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits non-zero on empty stdout before the source change.
- [x] T005 Move the startup claim decision ahead of the Claude enable switch (`compact-pointer.mjs`). Verify: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] T006 Keep the master switch and the concern kill switch ahead of the claim (`compact-pointer.mjs`). Verify: `node --test --test-name-pattern 'compact-pointer adds no start claim for a dispatched child' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the new concern-off test (`claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] T008 Run every `compact-pointer` test (`claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] T009 Validate the packet (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The `compact-pointer` suite exits 0 and strict validation prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] The phase brief names the two work package files. Verify: `rg -n 'Must fail first' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/scratch/finding.md` prints one line.
- [x] CHK-002 [P0] The new test fails before the source change. Verify: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits non-zero.
- [x] CHK-003 [P1] Phase 003 passed its handoff. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The adapter parses as ESM. Verify: `node --check .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` exits 0.
- [x] CHK-011 [P0] The disabled hook still writes empty stdout. Verify: `node --test --test-name-pattern 'compact-pointer adds no start claim for a dispatched child' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] CHK-012 [P1] The adapter keeps its `done()` and `emit()` pattern. Verify: `rg -n 'function done|function emit' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints two lines.
- [x] CHK-013 [P1] The change uses the shared flag resolver. Verify: `rg -n 'hookFlagDecision' .skilled/hooks/shared/hook-flags.cjs` prints three lines.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The new concern-off test passes. Verify: `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] CHK-021 [P0] The `compact-pointer` suite passes. Verify: `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] CHK-022 [P1] The existing start-claim test passes. Verify: `node --test --test-name-pattern 'compact-pointer delivers the claim at the start of a goal-command receiver' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] CHK-023 [P1] The three claim guard tests pass. Verify: `node --test --test-name-pattern 'compact-pointer adds no start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is recorded as `instance-only`, one branch in one adapter. Verify: `rg -n 'instance-only' plan.md spec.md` prints one line.
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n 'isHookEnabled\(CONCERN' .skilled/hooks/session-relaunch/claude` lists the adapters.
- [x] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'SKILLED_LOOP_CLAIM_SEED' .skilled --glob '*.mjs' --glob '*.cjs' --glob '*.md'` lists the wrapper, the adapter and the tests.
- [x] CHK-FIX-004 [P0] The diff adds no path, parser, redaction or resolver logic. Verify: `git diff --stat -- .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints one file changed.
- [x] CHK-FIX-005 [P1] The matrix axes and rows are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [x] CHK-FIX-006 [P1] The hostile env variant ran. Verify: `node --test --test-name-pattern 'compact-pointer adds no start claim for a dispatched child' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0, covering `AI_SESSION_CHILD=1` and `SYSTEM_SESSION_RELAUNCH_DISABLED=1`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the implementation commit. Verify: `git log -1 --format=%H -- .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints one SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential is added. Verify: `rg -n 'api[_-]?key|password|secret' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints no line.
- [x] CHK-031 [P0] Session and seed validation stays. Verify: `rg -n 'validSessionId|seedInstructions' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints three lines.
- [x] CHK-032 [P1] N/A: the hook has no auth or authorization path. Verify: `rg -n 'auth|role|permission' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints no line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same two files. Verify: `rg -n 'compact-pointer.mjs|claude-adapters.test.cjs' spec.md plan.md tasks.md acceptance-criteria.md` prints matches in all four.
- [x] CHK-041 [P1] Code comments carry the durable why and no spec path or finding id. Verify: `rg -n 'specs/|F5|WP4' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs` prints no line.
- [x] CHK-042 [P2] README line 179 is left for phase 007. Verify: `rg -n 'phase 007' spec.md plan.md goal.md` prints the deferral.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No untracked path lands outside the packet. Verify: `git status --short --untracked-files=all` lists no `??` line outside the packet.
- [x] CHK-051 [P1] scratch holds only the finding and its keep file. Verify: `ls scratch` lists `finding.md` and `.gitkeep`.
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
