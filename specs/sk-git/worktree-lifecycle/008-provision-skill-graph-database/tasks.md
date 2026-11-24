---
title: "Tasks: Build the advisor skill-graph database when provisioning a worktree"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "provision skill graph database tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Build the advisor skill-graph database when provisioning a worktree

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
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Measure a fresh worktree (`spec.md` Measured Behavior). Verify: `runtime/database/` holds only README.md and health is degraded.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add the skill-graph step to `provision_worktree` (`.skilled/skills/sk-git/scripts/worktree-naming.sh`). Verify: `bash -n` exits 0.
- [x] T005 (after T004) Add four stubbed-CLI cases (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Verify: the file prints `FAIL=0`.
- [x] T006 [P] Name the step in ALWAYS rule 8 (`.skilled/skills/sk-git/SKILL.md`). Verify: `rg skill_graph_scan .skilled/skills/sk-git/SKILL.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Rerun `provision` on worktree 538. Verify: the database exists, health is `ok` and no advisor process remains.
- [x] T008 Run `validate.sh --strict` on this packet. Verify: `RESULT: PASSED`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001..004.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: node and the built advisor CLI, both present after the build loop.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `bash -n` clean; shellcheck shows only the three findings that predate this change.
- [x] CHK-011 [P0] No console errors or warnings Evidence: provision printed no warning.
- [x] CHK-012 [P1] Error handling implemented Evidence: N/A: no new input or auth path.
- [x] CHK-013 [P1] Code follows project patterns Evidence: follows the FAILED and built counters the loop uses.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md all Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: real provision of worktree 538 from no database.
- [x] CHK-022 [P1] Edge cases tested Evidence: existing-database and no-CLI cases.
- [x] CHK-023 [P1] Error scenarios validated Evidence: failing-scan and empty-scan cases exit 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: class `instance-only`: one missing provisioning step.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg skill_graph_scan` over the sk-git scripts found no other producer.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: callers `create` and `provision` both run the step through `provision_worktree`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: N/A: no new input or auth path.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: axes: database present or missing, CLI present or missing, scan result; 5 cases.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the real run used the live environment with the daemon stopped.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: diff range: worktree 538 against origin/main.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secrets touched.
- [x] CHK-031 [P0] Input validation implemented Evidence: N/A: no new input or auth path.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: N/A: no new input or auth path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan and tasks agree.
- [x] CHK-041 [P1] Code comments adequate Evidence: block comment gives the reason.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: sk-git SKILL.md ALWAYS rule 8.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: no temp files in the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: scratch/ holds only .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---



