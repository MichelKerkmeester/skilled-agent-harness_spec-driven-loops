---
title: "Tasks: Phase 4: playbook-scenarios"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "playbook scenarios tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: playbook-scenarios

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

`V` is `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package`. `MF` is `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook`. `FP` is `.skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook`.
<!-- /ANCHOR:notation -->

---
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record both validator baselines (`scratch/validator-baseline.txt`). Verify: `V $MF` shows 17 scenarios in 6 categories and `V $FP` shows `scenarios=12`. Evidence: `scratch/validator-baseline.txt`: 17 in 6, and 12.
- [x] T002 Compare the proposed token-or-scale scenario with `$FP/value-discipline/on-scale-values.md` (`SKD-010`) and decide add or drop (`scratch/skd-010-overlap.md`). Verify: the note names what the new scenario would test that SKD-010 does not, or records the drop. Evidence: `scratch/skd-010-overlap.md`: add.
- [x] T003 [P] Read the scenario contract in `sk-create-manual-testing-playbook` and the Barter copies for shape only. Verify: `scratch/scenario-shape.md` lists the required frontmatter keys and sections. Evidence: `scratch/scenario-shape.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the token drift scenario (`$MF/figma-to-code/token-drift.md`). Verify: `V $MF` reports no violation for the file. Evidence: no violation.
- [x] T005 Write the node to token markup scenario (`$MF/figma-to-code/node-to-token-markup.md`). Verify: `V $MF` reports no violation for the file. Evidence: no violation.
- [x] T006 Write the check-a-built-screen scenario with the `INCOMPLETE` outcome (`$MF/figma-to-code/check-built-screen.md`). Verify: `rg -n "INCOMPLETE" $MF/figma-to-code/check-built-screen.md` prints the expected outcome. Evidence: `INCOMPLETE` in the expected outcome.
- [x] T007 Write the unknown-project scenario, plus the token-or-scale scenario only if T002 decided to add it (`$FP/`). Verify: `V $FP` prints `PASS`. Evidence: PASS, 14 scenarios.
- [x] T008 Update both root indexes with the new category and census (`$MF/manual-testing-playbook.md`, `$FP/manual-testing-playbook.md`). Verify: the `HAND_TYPED_CENSUS` line reports equal hand-typed and derived counts. Evidence: census 20 and 7 on both sides.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun both validators from the final state (`scratch/validator-final.txt`). Verify: mcp-figma exits 0 at 20 scenarios in 7 categories, and fundamentals prints `PASS` with `violations=0`. Evidence: `scratch/validator-final.txt`.
- [x] T010 Grep the new scenarios for Barter values. Verify: `rg -n -i "barter" $MF/figma-to-code` and the new fundamentals files print nothing. Evidence: no output.
- [x] T011 Run the check-a-built-screen scenario once with one pass forced unavailable. Verify: the observed verdict is `INCOMPLETE`, saved to `scratch/check-run.txt`. Evidence: `scratch/check-run.txt`: overall `INCOMPLETE`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/validator-final.txt` shows the new counts for both packages
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

The phase does not start until phases 001 and 003 have closed; until then every task is `[B]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P1] The SKD-010 decision is recorded
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each scenario follows the playbook contract
- [x] CHK-011 [P1] Each expected outcome names one verdict or one loaded file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Both validators pass from the final state
- [x] CHK-022 [P1] The `INCOMPLETE` run is saved
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] The check scenario uses read-only Figma inputs only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P2] The mcp-figma and fundamentals changelogs record the new scenarios
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ keeps only the validator, overlap and run evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
