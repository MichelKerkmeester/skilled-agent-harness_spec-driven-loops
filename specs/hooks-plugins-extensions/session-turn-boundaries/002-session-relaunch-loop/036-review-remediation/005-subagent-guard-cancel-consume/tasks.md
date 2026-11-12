---
title: "Tasks: Phase 5: subagent-guard-cancel-consume"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "subagent guard cancel consume tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: subagent-guard-cancel-consume

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

No shell variables are used. Every task names a repository-relative path in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the guard constant and record the current subcommand list (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints the definition and its one use.
- [x] T002 Read the four existing denied cases (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `rg -n 'denies (claim|complete|keep|prepare) from a sub-agent' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` prints four lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the failing-first case `subagent-guard denies cancel from a sub-agent` (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 1 with the `expected a PreToolUse denial envelope` assertion before the pattern changes.
- [x] T004 Add the failing-first case `subagent-guard denies consume from a sub-agent` (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 1 with the `expected a PreToolUse denial envelope` assertion before the pattern changes.
- [x] T005 Add `cancel` and `consume` to the subcommand alternation (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `rg -n 'LIFECYCLE_COMMAND' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints the definition, and `rg -c 'prepare.cancel.consume.hand-over' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints 1.
- [x] T013 Add `hand-over` to the alternation with its failing-first case `subagent-guard denies hand-over from a sub-agent` (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `node --test --test-name-pattern 'denies hand-over' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the two new deny cases together (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `node --test --test-name-pattern 'denies (cancel|consume)' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with two passing cases.
- [x] T007 Run the full guard suite (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with no failing case.
- [x] T008 Confirm the seven silent cases still pass (`.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`). Verify: `node --test --test-name-pattern 'stays silent' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with no failing case.
- [x] T009 Confirm the denial text is unchanged (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `rg -n 'A sub-agent shares its parent' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints one line.
- [x] T010 Confirm the guard comment names every denied verb (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `rg -c 'cancel, consume or hand over that note' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints 1.
- [x] T011 Confirm no ephemeral identifiers entered the guard (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`). Verify: `rg -n 'ADR-|REQ-|CHK-|T[0-9]{3}' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints nothing.
- [x] T012 Run strict validation on the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The guard suite exits 0 with a denied `cancel` case and a denied `consume` case
- [x] The strict validator prints `RESULT: PASSED`
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

A blocked task stays `[B]` and blocks close. It is unblocked only when the blocker is recorded in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Verify: `rg -c 'REQ-00[1-5]' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/spec.md` prints 5.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies identified and available. Verify: `rg -n '^\| Dependency \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/spec.md` prints one row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The guard parses. Verify: `node --check .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` exits 0.
- [x] CHK-011 [P0] The guard suite parses. Verify: `node --check .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] CHK-012 [P1] No console output entered the guard. Verify: `rg -n 'console\.(log|warn|error)' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints nothing.
- [x] CHK-013 [P1] The guard comment names every denied verb. Verify: `rg -c 'cancel, consume or hand over that note' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are settled. Verify: `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/acceptance-criteria.md` prints no line after completion.
- [x] CHK-021 [P0] The handoff command passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] CHK-022 [P1] The `cancel` case passes. Verify: `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] CHK-023 [P1] The `consume` case passes. Verify: `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding 5 is recorded with its class. Verify: `rg -n 'instance-only' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/plan.md` prints one line.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'LIFECYCLE_COMMAND' .skilled` prints the definition and its one use in the guard and no other file.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'LIFECYCLE_COMMAND|deniesRelaunchCommand' .skilled/hooks/session-relaunch` prints four lines in the guard.
- [x] CHK-FIX-004 [P0] N/A: The change handles no delimiter, joined input, outside-root path or redaction case, because it widens one subcommand alternation.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Verify: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/plan.md` prints one line.
- [x] CHK-FIX-006 [P1] The disabled-concern variant passes. Verify: `node --test --test-name-pattern 'relaunch concern is disabled' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff. Verify: `git diff --stat -- .skilled/hooks/session-relaunch/claude/subagent-guard.mjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` prints the two changed files.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret entered the change. Verify: `rg -n '(api[_-]?key|password|secret)[[:space:]]*=' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` prints nothing.
- [x] CHK-031 [P0] N/A: The change reads the existing command string and adds no input surface.
- [x] CHK-032 [P1] The guard still ignores a caller with no agent id or a blank one. Verify: `node --test --test-name-pattern 'main session that carries no agent_id|whitespace-only agent_id' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks are synchronized. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] The denial text is unchanged. Verify: `rg -n 'A sub-agent shares its parent' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints one line.
- [x] CHK-042 [P2] N/A: Finding 5 names the guard and its test, so this phase has no README edit.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/scratch` prints the red and green run files and the review diff.
- [x] CHK-051 [P1] Scratch sits inside the untracked packet. Verify: `git status --porcelain -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/005-subagent-guard-cancel-consume/scratch` prints the folder as untracked and nothing else.
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
