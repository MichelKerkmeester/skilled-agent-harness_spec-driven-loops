---
title: "Tasks: Phase 1: shim-wrapper-trust"
description: "Work items and verification for the shim wrapper trust check."
trigger_phrases:
  - "shim wrapper trust tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: shim-wrapper-trust

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

**Variables.** `S` is `.skilled/bin/skilled-loop-shell.sh`. `T` is `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`. Commands run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the resolver and the launch call (`S`). Verify: `rg -n 'skilled_loop_find_wrapper|bash "\$wrapper"' S` prints the resolver call, its definition and the launch line.
- [x] T002 Confirm the current suite passes before any change (`T`). Verify: `node --test T` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the failing case where a wrapper planted outside the sourced checkout is not resolved or run (`T`). Verify: `node --test T` exits non-zero and names the outside-wrapper case as failing.
- [x] T004 Guard `skilled_loop_find_wrapper` with the sourced checkout's real path (`S`). Verify: `node --test T` exits 0 and the outside-wrapper case passes.
- [x] T012 Add the failing cases for a registered linked worktree, a directory that only claims to be one, and `SKILLED_LOOP_TRUSTED_CHECKOUTS` set and unset (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits non-zero and names those cases as failing.
- [x] T013 Extend the guard to trust registered linked worktrees and the checkouts in `SKILLED_LOOP_TRUSTED_CHECKOUTS` (`.skilled/bin/skilled-loop-shell.sh`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and those cases pass.
- [x] T014 Add the failing cases `the shim sourced through a symlinked file trusts its real checkout` and `a shell copy without the stored checkout trusts nothing` (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits non-zero and names the zsh symlinked-file case and both lost-checkout cases as failing.
- [x] T015 Make an unresolved or misplaced shim path leave the stored checkout empty, skip git for an empty checkout and stop naming a variable `path` (`.skilled/bin/skilled-loop-shell.sh`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with `fail 0`.
- [x] T016 Add the failing case `an inherited GIT_DIR cannot vouch for a planted repository`, make the outside directory a real git repository and expect the real path in the symlinked `.skilled` cases (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits non-zero and names the inherited-GIT_DIR case as failing.
- [x] T017 Remove the git environment from the worktree query and print the wrapper's real path (`.skilled/bin/skilled-loop-shell.sh`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with `fail 0`.
- [x] T005 Document the trust rule in the shell shim row (`.skilled/bin/README.md`). Verify: `rg -n 'sourced checkout' .skilled/bin/README.md` prints one line.
- [x] T006 Document the trust rule in the shim paragraph (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'sourced checkout' .skilled/hooks/session-relaunch/README.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the full suite under both shells (`T`). Verify: `node --test T` exits 0 with `fail 0`.
- [x] T008 Parse the shim under bash and zsh (`S`). Verify: `/bin/bash -n S && /bin/zsh -n S` exits 0.
- [x] T009 Confirm the shell shim README names the rule (`.skilled/bin/README.md`). Verify: `rg -n 'sourced checkout' .skilled/bin/README.md` prints one line.
- [x] T010 Confirm the session relaunch README names the rule (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'sourced checkout' .skilled/hooks/session-relaunch/README.md` prints one line.
- [x] T011 Validate the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The outside-wrapper suite output is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Commands below run from the repository root, as the task notation states.

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

- [x] CHK-001 [P0] The finding is recorded in `spec.md`. Verify: `rg -n 'skilled_loop_find_wrapper' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/spec.md` prints at least one line.
- [x] CHK-002 [P0] The affected surfaces are recorded in `plan.md`. Verify: `rg -c 'skilled-loop-shell.sh' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/plan.md` prints at least `1`.
- [x] CHK-003 [P1] The test runner answers. Verify: `node --version` prints a version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The shim parses under bash. Verify: `/bin/bash -n S` exits 0.
- [x] CHK-011 [P0] The shim parses under zsh. Verify: `/bin/zsh -n S` exits 0.
- [x] CHK-012 [P0] Sourcing the shim sets no shell option. Verify: `rg -n 'setopt|set -[a-z]' S` prints only the line inside the `skilled_loop_resolve` subshell.
- [x] CHK-013 [P1] The trust check compares real paths. Verify: `rg -n 'realpath|pwd -P' S` prints the resolution line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/acceptance-criteria.md` prints the criteria row count.
- [x] CHK-021 [P0] The outside-wrapper case failed before the fix. Verify: `rg -n 'outside-wrapper run failed' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/implementation-summary.md` prints the recorded failing run.
- [x] CHK-022 [P0] The full suite passes after the fix. Verify: `node --test T` exits 0.
- [x] CHK-023 [P1] The symlinked `.skilled` case still passes. Verify: `node --test T` reports the symlinked `.skilled` case as passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is classed `class-of-bug`, because one resolver serves all six runtime functions. Verify: `rg -c 'class-of-bug' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/tasks.md` prints `1`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'skilled_loop_find_wrapper' S` prints the definition and its one caller.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'skilled_loop_resolve' S T` prints the resolver definition, its caller and the test calls.
- [x] CHK-FIX-004 [P0] Adversarial path cases are covered. Verify: `rg -n 'outside the sourced checkout|symlinked .skilled' T` prints both cases.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed. Verify: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/plan.md` prints the line naming 2 shells and 4 wrapper locations.
- [x] CHK-FIX-006 [P1] The hostile environment variant is covered. Verify: `rg -n 'SKILLED_LOOP_ID' T` prints the case that runs with an inherited loop id.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a fix SHA or diff range. Verify: `rg -n 'fix SHA|diff range' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/implementation-summary.md` prints the pin.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' S` prints one line, the `claude:setup-token` subcommand name that was there before.
- [x] CHK-031 [P0] A wrapper outside the sourced checkout never runs. Verify: `node --test T` exits 0 with the outside-wrapper case passing.
- [x] CHK-032 [P1] One resolver serves all six runtime functions. Verify: `rg -c '^function (claude|pi|opencode|codex|devin|cursor-agent)' S` prints `6`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the trust rule. Verify: `rg -l 'sourced checkout' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/spec.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/plan.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/tasks.md` prints three paths.
- [x] CHK-041 [P1] Both READMEs name the rule. Verify: `rg -l 'sourced checkout' .skilled/bin/README.md .skilled/hooks/session-relaunch/README.md` prints both paths.
- [x] CHK-042 [P2] No new README file is added. Verify: `git status --porcelain -- '*.md'` lists the two READMEs, the parent's `goal.md` and `spec.md`, and the documents of this phase parent.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch output stays under `scratch/`. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/scratch` exits 0.
- [x] CHK-051 [P1] Scratch holds evidence only. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust/scratch` prints the red and green run files and the review diff.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
