---
title: "Tasks: Phase 8: hub-gap-report"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub gap report tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: hub-gap-report

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

`DOC` is `.skilled/commands/doctor`. `CK` is `node .skilled/commands/doctor/scripts/sk-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the phase 2 check script exists (`DOC/scripts/sk-skill-check.cjs`). Verify: `CK check --help` exits 0.
- [ ] T002 Pick a shipped hub and mode whose `parent-skill-check.cjs` run is clean (`scratch/hub-choice.md`). Verify: `node DOC/scripts/parent-skill-check.cjs .skilled/skills/<hub>` exits 0.
- [ ] T003 [P] Build an invented fixture hub with one mode lacking `routerSignals` (`DOC/scripts/tests/fixtures/`). Verify: `node DOC/scripts/parent-skill-check.cjs <fixture>` reports the missing signal.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the hub probes for rows 4 to 8 and 10 (`DOC/scripts/lib/sk-skill-surface.cjs`). Verify: unit cases for each probe pass.
- [ ] T005 Add `--into-hub <hub>` with text and JSON output (`DOC/scripts/sk-skill-check.cjs`). Verify: `CK check <mode> --into-hub <hub> --json` prints 11 rows.
- [ ] T006 Print n/a for row 5 without `FULL_INVENTORY` and row 10 for a `metadata` mode; print UNKNOWN for row 10 on advisor exit 75. Verify: the three cases pass in `sk-skill-check.test.cjs`.
- [ ] T007 Add the flag through the sk-create-command mode to `_routes.yaml` `allowed_flags`, `DOC/assets/doctor-sk-skill-check.yaml`, `DOC/sk-skill.md` and `DOC/assets/doctor-sk-skill-presentation.txt`. Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T008 Add the tests (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test DOC/scripts/tests/sk-skill-check.test.cjs` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run against the chosen shipped hub. Verify: every applicable row prints present and the exit code is 0.
- [ ] T010 Run against the fixture hub. Verify: row 2 prints missing and the exit code is 1.
- [ ] T011 Prove the run writes nothing. Verify: `git status --porcelain` before and after a run is identical.
- [ ] T012 Run the doctor suite. Verify: `bash DOC/scripts/tests/run-all.sh` prints every suite PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: one `/doctor:sk-skill check --into-hub` run in an agent runtime renders the table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 1 and 5 (phase 8)
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

A blocked task is marked `[B]` with the blocking phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 2 closed and the shipped hub chosen
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on both changed scripts
- [ ] CHK-011 [P0] No row is reported present without a probe that ran
- [ ] CHK-012 [P1] A checker that cannot run gives UNKNOWN and exit 2
- [ ] CHK-013 [P1] Code follows the existing doctor script patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Shipped-hub and fixture-hub runs give the expected rows
- [ ] CHK-022 [P1] n/a and UNKNOWN cases tested
- [ ] CHK-023 [P1] `run-all.sh` passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: new report; it fixes no reported finding.

- [ ] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The option writes nothing
- [ ] CHK-031 [P0] Hub and skill arguments are validated; a `local-` prefix is refused
- [ ] CHK-032 [P1] Fixtures use invented names only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The presentation footer lists which rows have no CI gate
- [ ] CHK-042 [P2] README lines for the option added if phase 7 already closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working notes live in `scratch/` only; fixtures live under `DOC/scripts/tests/fixtures/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



