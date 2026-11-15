---
title: "Tasks: Phase 17: terminal-record-gaps"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "terminal record gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: terminal-record-gaps

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

**Variables**: `R` is `.skilled/skills/system-deep-loop/runtime`. `Y` is `.skilled/commands/deep/assets`. `L` is `R/lib/deep-review-ledger-schema`. Commands run from the worktree root unless they `cd` into `R`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the runtime suite, the typecheck, the stem census and the drift check before any edit (`scratch/baseline.txt`). Verify: the file holds the `Tests` line and exit status of `(cd R && npm test)` and `npm run typecheck`, the census counts and the drift line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `maxDurationReached` to `TerminalGatesRecordedData.stopReason` and to the schema's `enumRule`, and add an accept case beside the `manualStop` one (`L/deep-review-ledger-types.ts`, `L/deep-review-ledger-schema.ts`, `R/tests/unit/deep-review-ledger-schema.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/deep-review-ledger-schema.vitest.ts)` prints a `Tests` line with no failure, and `npm run typecheck` exits 0.
- [x] T003 In `step_check_max_duration.if_reached`, run `record_terminal_gates` before the jump to `phase_synthesis`; add `maxDurationReached` to the stop-reason rule; name the duration stop in the record's `when:` text (`Y/deep-review.yaml`). Verify: `rg -n 'maxDurationReached' Y/deep-review.yaml` shows the rule and the duration branch's `run_first`.
- [x] T004 Send the four manual-stop exits to `phase_synthesis` instead of `gate_pre_synthesis`, keeping each `set` and `run_first` (`Y/deep-review.yaml`). Verify: `rg -n 'skip_to: gate_pre_synthesis|proceed_to: gate_pre_synthesis' Y/deep-review.yaml` exits 1.
- [x] T005 Recompile the review contract (`Y/compiled/deep-review.contract.markdown`). Verify: `node R/scripts/check-contract-drift.cjs` prints `OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the suite, typecheck, census, drift check and mirror check (`scratch/after.txt`). Verify: no failure `scratch/baseline.txt` lacks.
- [x] T007 Run strict validation on the parent and its children (`spec.md`). Verify: `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder.
- [x] T008 Apply the @review round-1 fixes: move `step_check_max_duration` after `step_read_state`, so the record has its iteration and findings on a resume and the check runs on every pass (the loop returns to `step_read_state`); tell the pre-synthesis `on_B` to raise `maxDurationMinutes` after a duration stop; have hydrate read a manual stop's reason from the latest `terminal_gates` row (`Y/deep-review.yaml`). Verify: suite 3019 passed, `workflow-max-duration.vitest.ts` 4/4, drift `OK` (`scratch/after.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows the suite, census, drift and mirror checks with no new failure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Origin**: findings 2 and 4 of the 016 merge-port review, recorded as 016 known limitations, and the operator's answers of 2026-11-15
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

A task that cannot pass is marked `[B]` with its failing output in `scratch/after.txt`, and the packet stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] `scratch/baseline.txt` holds the T001 output
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `(cd R && npm run typecheck)` shows no error the baseline lacks
- [x] CHK-011 [P0] `(cd R && npm test)` shows no failure the baseline lacks
- [x] CHK-012 [P1] The gateway accepts a terminal record with stop reason `maxDurationReached`
- [x] CHK-013 [P1] `check-ledger-stem-producers.cjs` and `check-agent-mirror-sync.cjs` exit 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every jump into synthesis writes the terminal record first
- [x] CHK-022 [P1] No manual stop jumps past `step_derive_verdict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The gap is class `cross-consumer`: several stop paths reach one verdict rule.
- [x] CHK-FIX-002 [P0] The same-class producer inventory in `plan.md` lists every entry into synthesis, and each writes the record and runs the verdict step.
- [x] CHK-FIX-003 [P0] The `stopReason` consumer inventory names only readers that pass the value through.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction surface changes.
- [x] CHK-FIX-005 [P1] The enum widening has a test case.
- [x] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] `scratch/after.txt` names the commit it was taken at.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret is read or written by any changed file
- [x] CHK-031 [P0] N/A: no new ledger field; the terminal record keeps its four data keys
- [x] CHK-032 [P1] N/A: no auth surface changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same five stop reasons and the same stop paths
- [x] CHK-041 [P1] No code comment carries a packet, phase or task id
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline and after output live in `scratch/` only
- [x] CHK-051 [P1] `scratch/` holds no file the build did not need
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
