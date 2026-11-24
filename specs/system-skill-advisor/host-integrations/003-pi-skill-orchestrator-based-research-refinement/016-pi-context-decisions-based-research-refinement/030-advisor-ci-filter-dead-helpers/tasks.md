---
title: "Tasks: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor ci filter dead helpers tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

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

- [x] T001 Measure the callers and the CI filter (`spec.md` Measured Behavior). Verify: the symbol `rg` lists only definitions and in-module uses.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 [P] Add the two hooks globs to both filters (`.github/workflows/skill-advisor-stress.yml`). Verify: each filter lists `system-skill-advisor/hooks/**` for `.skilled` and `.opencode`.
- [x] T005 [P] Delete `.skilled/skills/system-skill-advisor/runtime/lib/compat/redirect-metadata.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/compat/redirect-metadata.vitest.ts`. Verify: neither path exists.
- [x] T006 Delete `sanitizeEnvelopeSkillLabel` from `.skilled/skills/system-skill-advisor/runtime/lib/derived/sanitizer.ts` and its assertions in two tests. Verify: `rg sanitizeEnvelopeSkillLabel` prints nothing.
- [x] T007 (after T006) Delete `filterDefaultRoutable` from `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/archive-handling.ts` and its assertions in three tests, keeping sa-016's live ones. Verify: `rg filterDefaultRoutable` prints nothing.
- [x] T011 (after T007) Delete `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts` and the `rollbackDerivedBlock` test case. Verify: `rg rollbackDerivedBlock` prints nothing.
- [x] T012 [P] Remove the doc rows naming the deleted code (compat, lifecycle, runtime and config READMEs, NC-005). Verify: the doc `rg` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Run typecheck, build, `npm test` and the stress suite. Verify: each exits 0.
- [x] T009 Run the catalog, playbook, link and leaf validators. Verify: each passes.
- [x] T010 Run `validate.sh --strict` on this packet. Verify: `RESULT: PASSED`.
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
- [x] CHK-003 [P1] Dependencies identified and available Evidence: cli-pi DeepSeek ran all six briefs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: advisor typecheck and build exit 0.
- [x] CHK-011 [P0] No console errors or warnings Evidence: gate run printed no warnings; playbook warnings=0.
- [x] CHK-012 [P1] Error handling implemented Evidence: N/A: deletion only, no new input or error path.
- [x] CHK-013 [P1] Code follows project patterns Evidence: deletions only, no new pattern.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md all Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: hooks glob checked against `git ls-files`.
- [x] CHK-022 [P1] Edge cases tested Evidence: sa-016 live assertions kept and passing.
- [x] CHK-023 [P1] Error scenarios validated Evidence: N/A: deletion only, no new input or error path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: class `instance-only`: dead exports with no production caller.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: caller rg in spec.md Measured Behavior.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: repo-wide symbol rg empty; tests and READMEs updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: N/A: deletion only, no new input or error path.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: one axis (path filter event: pull_request, push), 2 rows, both checked.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A: deletion only, no new input or error path.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: diff range: worktree 537 against origin/main de24a843ab7.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secrets touched.
- [x] CHK-031 [P0] Input validation implemented Evidence: N/A: deletion only, no new input or error path.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: N/A: deletion only, no new input or error path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan and tasks agree.
- [x] CHK-041 [P1] Code comments adequate Evidence: one stale header comment fixed in route-exclusions test.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: compat, lifecycle, runtime and config READMEs updated.
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



