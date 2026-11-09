---
title: "Tasks: Phase 20: operator-approved-closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "operator approved closeout tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: operator-approved-closeout

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

`DT` is `.skilled/commands/doctor/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: every suite named in `plan.md` has a before count there.
- [x] T002 Reproduce the findings (`spec.md` Measured Behavior). Verify: the probes print the defect.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 AGENTS.md cut (`AGENTS.md`). Verify: canary OK, Blast-Radius 15,800; readers' tests pass.
- [x] T004 Manifest write (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `--check` exit 0; doctor tests 184/0; CI step exit 0.
- [x] T005 Over-budget fixture padding (`DT/fixtures/agents-md/over-budget/fixture.json`). Verify: doctor tests 184/0.
- [x] T006 sk-design `none` removal and refresh (`hub-router.json`, served and authored manifests). Verify: freshness fresh; guard, sync, package pass.
- [x] T007 Trigger index rebuild (`runtime/data/trigger-index.json` and sidecars). Verify: `--check` exit 0; parity tests pass.
- [x] T008 Phase 013 closure (`../013-agents-md-delivery-budget/`). Verify: strict validation passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every baseline suite. Verify: no baseline-passing test fails; counts in `implementation-summary.md`.
- [x] T010 Cross-family review of the phase diff. Verify: verdict and adjudication in `decision-record.md`.
- [x] T011 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: Line-by-line review of the AGENTS.md diff and a 16,384-byte truncation check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: `../research/research.md`, rows 013 V-AGENTS manifest and Devin budget; 016 f-iter008-002
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

A blocked task after three fix attempts marks the phase Blocked with evidence in `decision-record.md` (goal G7).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `git diff --check` clean; JSON parses
- [x] CHK-011 [P0] No new failure in any baseline suite
- [x] CHK-012 [P1] No spec path or finding id in any changed code comment
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Measured Behavior probes rerun by hand
- [x] CHK-022 [P1] One test per changed behaviour fails on the old code
- [x] CHK-023 [P1] Edge cases in `spec.md` exercised
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: Instance fixes applied under operator approval.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done (see `plan.md` inventories).
- [x] CHK-FIX-003 [P0] Consumer inventory done for every changed helper, field and doc.
- [x] CHK-FIX-004 [P0] Adversarial cases tested: A cut that narrows a gate; a test tied to AGENTS.md length; a stale index after a late doc edit.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile variant: Devin's truncation keeps the whole Blast-Radius clause.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Nothing outside the repository is written
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Changed code comments state the rule the code applies
- [x] CHK-042 [P2] Phase 013 records the approval
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe scripts and logs live in the session scratchpad, not the worktree
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
