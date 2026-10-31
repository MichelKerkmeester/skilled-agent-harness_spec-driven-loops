---
title: "Tasks: Phase 6: goal-conformance-check"
description: "Unchecked execution tasks tagged by priority, with fixture and corpus verification."
trigger_phrases:
  - "goal conformance tasks"
  - "binding coverage fixture"
  - "goal placeholder check"
  - "read-only goal corpus scan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: goal-conformance-check

<!-- SPECKIT_LEVEL: 2 -->

These tasks turn phase 006's planned checks into a verifiable handoff. Setup resolves the owner choice, incoming fixture evidence and mode packet before implementation because those inputs determine the route and paths (specs/sk-doc/060-create-goal-mode/spec.md:122,146,157). Implementation keeps one positive fixture and six isolated negative controls. Verification runs the selected route's fixtures, reports read-only counts for active specs goals and records strict phase validation. Each task below records its evidence.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| [P0], [P1], [P2] | Task priority |
| `[B]` | Blocked |

**Task Format**: T### with a P0, P1 or P2 priority tag, followed by the description and file path.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 [P0] Confirm phase 001's checker-owner decision and record whether the local-checker or validator-amendment route applies (specs/sk-doc/060-create-goal-mode/spec.md:157). Evidence: phase 001 chose both, a local checker plus a recorded validator amendment request (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/mode-boundary.md:57`); both routes ran.
- [x] T002 [P1] Confirm phase 005's budget-cut fixture and chat-slice evidence meets the incoming handoff (specs/sk-doc/060-create-goal-mode/spec.md:146). Evidence: phase 005 recorded the cut fixture before and after, `packet_budget=over` then `ok` with five criteria kept (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/scratch/budget-fixture-evidence.md:25`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 [P0] On the local route, create .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs and reuse goal-slice.cjs for parent budget measurement; on the amendment route, record the exact requested validator change in implementation-summary.md without editing the validator (.skilled/hooks/goal/lib/goal-slice.cjs:431-446; specs/sk-doc/060-create-goal-mode/spec.md:94-99,157). Evidence: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:18` imports `goal-slice.cjs`; the four checks start at `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:230`, `:258`, `:296` and `:308`. The amendment request is recorded in `implementation-summary.md`.
- [x] T004 [P0] Add one positive and six isolated negative controls under .skilled/skills/sk-doc/sk-create-goal/scripts/tests/fixtures/; include a row-removal case whose phase name remains elsewhere (specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104). Evidence: the fixture builder writes one positive packet, a regression positive and six negatives into a temp directory; the row-removal case keeps `001-contract` in a criterion (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:38`).
- [x] T005 [P1] On the local route, add the read-only active-corpus report with scanned-goal and per-check counts; on the amendment route, run the owner-provided read-only report if the amended validator is available or record the blocker in implementation-summary.md and leave the report Unmet. Evidence: the no-argument run prints `goals_scanned=300`, `phase_parents_scanned=30` and four counts (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:1`); `git status` showed no corpus goal changed.
- [x] T010 [P1] Add the `scripts/check-goal.cjs <packet>` run to the `SKILL.md` verification step and list the checker in `references/README.md` (operator-approved amendment). Evidence: `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:110` runs the checker before handoff and `.skilled/skills/sk-doc/sk-create-goal/references/README.md:34` lists it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T006 [P0] Run node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs on the local route; on the amendment route use the validator owner's documented fixture entry point if supplied and record any missing command as UNKNOWN. Evidence: `node --test` exit 0, 8 tests, 8 pass, 0 fail, on 2026-09-26 (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:66`).
- [x] T007 [P0] Run node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs with no arguments on the local route; on the amendment route use the owner's documented read-only scan if supplied. Record scan and finding counts or the unresolved blocker without fixing files. Evidence: counts are missing-binding-row 203, placeholder 83, criteria-count 35 and parent-budget 4; one unreadable test fixture is reported as ERROR and the run exits 2 (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:332`). No file was repaired.
- [x] T008 [P0] Run bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/006-goal-conformance-check --strict and record its summary and rule IDs. Evidence: strict validation `RESULT: PASSED` on 2026-09-26, recorded in `implementation-summary.md`.
- [x] T009 [P1] Give phase 007 the fixture outcomes and selected owner route; satisfy the parent handoff (specs/sk-doc/060-create-goal-mode/spec.md:147). Evidence: the handoff to phase 007 names each negative, its failing check and the positive results in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] [P0] The selected check reports all four named defect classes.
- [x] [P0] One positive fixture passes and six negative controls fail for their named reasons.
- [x] [P1] The live-corpus report records counts and makes no repairs.
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
- [x] CHK-001 [P0] Spec requirements name all four checks and their sources. (`spec.md:109-112`)
- [x] CHK-002 [P0] Plan names target files, exact commands and observable outcomes. (`plan.md:94`)
- [x] CHK-003 [P1] Phase 001 ownership decision and phase 005 incoming evidence are available. (`mode-boundary.md:57`; phase 005 evidence file)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Each check reports its own named result. (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:38`)
- [x] CHK-011 [P0] The binding check matches rows inside the binding table only. (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:230`)
- [x] CHK-012 [P0] Parent budget measurement imports goal-slice.cjs. (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:18`)
- [x] CHK-013 [P1] The live scan reads files and does not write them. (`git status` unchanged after the scan)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
- [x] CHK-020 [P0] Every required conformance check has one isolated negative control. (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:38`)
- [x] CHK-021 [P0] The positive fixture passes the same selected check. (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:66`)
- [x] CHK-022 [P0] The row-removal test keeps the phase name elsewhere and still fails. (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:38`)
- [x] CHK-023 [P1] The live-corpus output reports scanned and finding counts. (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:1`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] The four check classes map to binding row, placeholder, criterion-count and parent-budget defects. (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:38`)
- [x] CHK-FIX-002 [P0] The phase 009 row-level matching failure is covered by a removal control (specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104). (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:38`)
- [x] CHK-FIX-003 [P1] Existing corpus defects are reported without edits. (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:1`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] The live scan stays under active specs paths in the workspace. (scan root is `specs/`, `z_archive` excluded, `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:28`)
- [x] CHK-031 [P0] The checker does not write goal documents or use network services. (no write or network call in the checker)
- [x] CHK-032 [P1] A file read or parse failure appears in the report and fails the run. (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:332`, exit 2)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same four checks. (`spec.md:109-112`)
- [x] CHK-041 [P1] Every repository behavior claim in the phase docs carries a path and line or command. (each claim carries a path and line)
- [x] CHK-042 [P2] The phase 007 handoff records fixture results and live counts. (`implementation-summary.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Keep the checker and tests under the sk-create-goal scripts path. (`.skilled/skills/sk-doc/sk-create-goal/scripts/`)
- [x] CHK-051 [P1] Keep fixtures under scripts/tests/fixtures/ and leave active corpus goals untouched. (`scripts/tests/fixtures/goal-fixtures.cjs`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|----------|-------|----------|
| P0 execution tasks | 6 | 6/6 |
| P1 execution tasks | 4 | 4/4 |
| P2 execution tasks | 0 | 0/0 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->

---


