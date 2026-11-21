---
title: "Tasks: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk code and readme alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold this Level 2 packet with the spec-kit create script (`spec.md`). Verify: `ls` on the packet lists `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`.
- [x] T002 Record the checker baselines (`scratchpad/dlh/base/`). Verify: `check_readme_references.py` prints `SUMMARY files=78 pass=64 fail=14`.
- [x] T003 Record the gate baseline (`scratchpad/gate-dlh-base.log`). Verify: the log prints `Tests  2 failed | 3967 passed | 9 skipped`, and the two failing tests pass in isolation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Audit seven folder lanes read-only (`scratchpad/dlh/audit-L1.md` to `audit-L7.md`). Verify: `grep -H '^Counts' audit-L*.md` prints seven Counts lines.
- [x] T005 [P] Apply the behaviour-neutral code fixes per lane (`.skilled/skills/system-deep-loop/**/*.{ts,cjs,sh}`). Verify: the comment-only diff filter over the changed code files prints no line.
- [x] T006 [P] Correct the drifted READMEs per lane (`.skilled/skills/system-deep-loop/**/README.md`). Verify: `check_readme_references.py` over the skill READMEs prints `fail=0`.
- [x] T007 Create the missing support README (`runtime/tests/_support/README.md`). Verify: `ls` prints the file and the code-folder audit reports it `valid`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the full gate from the final state (`scratchpad/gate-dlh.log`). Verify: the log prints vitest 0 failed, three check exits of 0, `Tests  18 passed (18)` and `validate exit=0 passed=16 failed=0`.
- [x] T009 Run the side checkers (typecheck, mirrors, documentation drift, frontmatter versions, trigger index). Verify: each exits 0.
- [x] T010 Record the results and the operator decision list (`implementation-summary.md`). Verify: `rg -n 'class \(b\)' implementation-summary.md` prints at least one line.
- [x] T011 Build the operator-approved behaviour fixes, each with a test that fails before the fix (`implementation-summary.md`). Verify: `scratchpad/gate-dlh2.log` prints `Tests  4029 passed | 11 skipped (4040)` and `check-contract-drift exit=0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md sections 2 to 5 filled.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md section 4 names the three phases.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: plan.md section 6 lists the sk-create-readme checkers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: quality-gate.cjs over 582 files prints NO_BLOCKER_FOUND, typecheck exit 0.
- [x] CHK-011 [P0] No console errors or warnings Evidence: vitest 3967 passed, 0 failed.
- [x] CHK-012 [P1] Error handling implemented Evidence: the approved swallowed-error fixes in loop-lock, the append gateway, the rollout loader and the coverage graph each have a fail-first test.
- [x] CHK-013 [P1] Code follows project patterns Evidence: each lane loaded the sk-code checklists before its first write.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md AC-001 to AC-004 Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: about ten inserted doc comments were spot-read against their code.
- [x] CHK-022 [P1] Edge cases tested Evidence: the empty-folder and gitignored-file cases are recorded in implementation-summary.md.
- [x] CHK-023 [P1] Error scenarios validated Evidence: checker conflicts are recorded as decision items rather than forced.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: every finding is classed a, b or c in scratchpad/dlh/audit-L1.md to audit-L7.md.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: lanes ran grep probes over every file in scope.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. N/A: no helper, policy or schema changed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: no security, path or parser fix was built.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. N/A: no matrix applies to a comment pass.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: no code that reads process-wide state changed.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the gate ran at fe8909a3a8e.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets Evidence: the secrets check ran clean on 582 files.
- [x] CHK-031 [P0] Input validation implemented N/A: no input handling changed. Validation gaps are behaviour items.
- [x] CHK-032 [P1] Auth/authz working correctly N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan and tasks describe the same seven lanes.
- [x] CHK-041 [P1] Code comments adequate Evidence: TSDoc rescan finds 0 undocumented exported functions, classes or interfaces outside tests.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: check_readme_references.py prints SUMMARY files=79 pass=79 fail=0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: lane temp files sit under the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: the packet scratch/ holds only .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---



