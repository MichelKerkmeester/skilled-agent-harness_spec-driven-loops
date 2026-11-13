---
title: "Tasks: Phase 6: skilled-loop-command"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled loop command tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: skilled-loop-command

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

**Variables**: `S` is `.skilled/bin/skilled-loop-shell.sh`. `T` is `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the function block in `S` and confirm the six runtime functions (`S`). Verify: `rg -c '^function (claude|pi|opencode|codex|devin|cursor-agent) ' .skilled/bin/skilled-loop-shell.sh` prints 6.
- [x] T002 Capture the baseline of the shell suite (`T`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0.
- [x] T003 Confirm the two printed-command producers (`.skilled/bin/skilled-loop`). Verify: `rg -n 'build_manual_command_template|manualClaimCommand' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints both producers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing test to `T`. The test sources the shim in bash and zsh and asserts `command -v skilled-loop` prints `skilled-loop`. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 1 with the new case failing.
- [x] T005 Add the `skilled-loop` function to `S`. The function calls `bash` with the trusted wrapper path and forwards `"$@"`. Verify: `bash -n .skilled/bin/skilled-loop-shell.sh` exits 0 and `zsh -f -c 'source .skilled/bin/skilled-loop-shell.sh; command -v skilled-loop'` prints `skilled-loop`.
- [x] T006 Confirm the function forwards the wrapper (`T`). Verify: `node --test --test-name-pattern 'skilled-loop' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the shell suite (`T`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0.
- [x] T008 Run the printed-text suite (`.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0.
- [x] T009 Run the relaunch suite as the parent gate does (`.skilled/hooks/session-relaunch/tests/`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [x] T010 Validate the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Both shell suites exit 0 and the packet validator prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding brief**: See `scratch/finding.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Verify: `rg -c 'REQ-00[1-3]' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/spec.md` prints 3.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Verify: `rg -n '## 3. ARCHITECTURE' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies available. Verify: `command -v bash zsh node` prints three paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The shim parses under bash. Verify: `bash -n .skilled/bin/skilled-loop-shell.sh` exits 0.
- [x] CHK-011 [P0] The shim parses under zsh. Verify: `zsh -n .skilled/bin/skilled-loop-shell.sh` exits 0.
- [x] CHK-012 [P1] The function returns the wrapper status. Verify: `sed -n '/^function skilled-loop/,/^}/p' .skilled/bin/skilled-loop-shell.sh` prints one wrapper call as the last line of the body.
- [x] CHK-013 [P1] The new code carries no artifact label in a comment. Verify: `rg -n 'F12|REQ-|specs/' .skilled/bin/skilled-loop-shell.sh` prints no new line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The new case fails before the function is added. Verify: T004 exits 1.
- [x] CHK-021 [P0] The new case passes after the function is added. Verify: T006 exits 0.
- [x] CHK-022 [P0] The existing shell suite passes. Verify: T007 exits 0.
- [x] CHK-023 [P1] The printed-text suite passes. Verify: T008 exits 0.
- [x] CHK-024 [P1] The full relaunch suite passes. Verify: T009 exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is classified `instance-only`. Verify: `rg -c '^function ' .skilled/bin/skilled-loop-shell.sh` prints 7 after the change, one new entry point and six runtime functions.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: the same count is 7 and no other entry point exists.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: T003 prints the two printed-command producers.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction branches: N/A, the change adds none. Verify: `git diff -- .skilled/bin/skilled-loop-shell.sh | rg -c 'real_path|trusted|resolve'` prints 0.
- [x] CHK-FIX-005 [P1] Matrix axes listed: two shells by two states. Verify: `rg -n 'SHELLS|command -v skilled-loop' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints the shell loop and the new assertion.
- [x] CHK-FIX-006 [P1] Hostile environment: N/A, the function definition reads no `SKILLED_` variable. Verify: `sed -n '/^function skilled-loop/,/^}/p' .skilled/bin/skilled-loop-shell.sh` prints no such read.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit. Verify: `git rev-parse HEAD` matches the commit recorded in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: `git diff -- .skilled/bin/skilled-loop-shell.sh | rg -c 'token|secret|password'` prints 0.
- [x] CHK-031 [P0] Input validation: N/A, the wrapper owns argument validation. Verify: the function passes `"$@"` unchanged.
- [x] CHK-032 [P1] Auth: N/A, no auth surface. Verify: `git diff -- .skilled/bin/skilled-loop-shell.sh | rg -c 'auth|login'` prints 0.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same two files. Verify: `rg -c 'skilled-loop-shell' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/spec.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/plan.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/tasks.md` prints three non-zero counts.
- [x] CHK-041 [P1] Comments explain why, not which phase. Verify: `rg -n 'F12|REQ-|specs/' .skilled/bin/skilled-loop-shell.sh` prints no new line.
- [x] CHK-042 [P2] README: N/A, phase 007 owns the docs. Verify: `rg -n 'skilled-loop' .skilled/hooks/session-relaunch/README.md` stays unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary output outside `scratch/`. Verify: `find .skilled/bin .skilled/hooks/session-relaunch/tests -name '*.tmp' -o -name '*.bak'` prints nothing.
- [x] CHK-051 [P1] `scratch/` holds only the brief. Verify: `find specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command/scratch -type f` lists `finding.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
