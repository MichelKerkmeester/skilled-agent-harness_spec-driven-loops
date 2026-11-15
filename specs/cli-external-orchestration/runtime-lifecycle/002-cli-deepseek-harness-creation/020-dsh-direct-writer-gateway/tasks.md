---
title: "Tasks: Phase 20: dsh-direct-writer-gateway"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh direct writer gateway tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: dsh-direct-writer-gateway

<!-- SPECKIT_LEVEL: 1 -->

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

`$DL` is `.skilled/skills/system-deep-loop/runtime`. `$A` is `.skilled/commands/deep/assets`. `$P` is this packet's `plan.md`. Edit ids E1 to E19 are the fenced edits in `plan.md` section 4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 019 is the base (`$DL/lib/deep-loop/executor-audit.ts`). Verify: `git show HEAD:$DL/lib/deep-loop/executor-audit.ts | rg -c 'function ledgerModeFor'` prints 1. Evidence: printed `1`.
- [x] T002 Count every search text with the plan's count script, saved outside the repository (`$P`). Verify: `node $TMPDIR/writer-edits.cjs $P .` prints `edits=43` and exits 0. Evidence: `edits=43`, exit 0, on origin/main `23f6583b89`.
- [x] T003 Record the baselines (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  78 passed (78)`. Evidence: `78 passed (78)` and `60 passed (60)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply E17a and E17b first and run the file (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` prints `6 failed | 4 passed (10)`. Evidence: with the source edits stashed, `6 failed | 4 passed (10)`.
- [x] T005 Apply E1 to E7b: the session id, the failure row helper, both failure writers, every runner failure call and the audit's ledger branch (`$DL/lib/deep-loop/executor-audit.ts`). Verify: `rg -c 'input\.sessionId' $DL/lib/deep-loop/executor-audit.ts` prints 13. Evidence: printed `13`.
- [x] T006 Apply E8, the review gateway's row filter (`$DL/scripts/append-mode-event.cjs`). Verify: `rg -c "rawEvent.event === 'dispatch_failure'" $DL/scripts/append-mode-event.cjs` prints 1. Evidence: printed `1`.
- [x] T007 Apply E9a to E13b, the two research stems (`$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` and the four files beside it in the plan). Verify: `cd $DL && npm run typecheck` exits 0. Evidence: typecheck exit 0.
- [x] T008 Apply E14a to E14d, the audit step's call in each workflow (`$A/deep-review-auto.yaml` and the three other workflows). Verify: `rg -c 'executor-audit.ts#appendExecutorAuditToLastRecord' $A/deep-review-auto.yaml $A/deep-review-confirm.yaml $A/deep-research-auto.yaml $A/deep-research-confirm.yaml` prints 1 for each file. Evidence: `1` for each of the four files.
- [x] T009 Run the E15 script, saved outside the repository, to pass the session id to every audited runner call (`$A/deep-review-auto.yaml` and the three other workflows). Verify: it prints the counts 7, 1, 7 and 1 and exits 0. Evidence: counts 7, 1, 7 and 1, exit 0.
- [x] T010 Apply E18a to E18c and E19, the research fixtures and the census count (`$DL/tests/unit/deep-research-ledger-schema.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/check-ledger-stem-producers.vitest.ts` prints `Tests  62 passed (62)`. Evidence: the two files print `62 passed (62)`.
- [x] T011 Regenerate the three compiled contracts with E16 (`$A/compiled/deep-review.contract.markdown`). Verify: `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`. Evidence: `[CONTRACT DRIFT] OK commands=3`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the two named files (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  85 passed (85)`. Evidence: `85 passed (85)`.
- [x] T013 Run the receipt, dispatch failure and reducer tests (`$DL/tests/executor-audit-receipts.test.ts`). Verify: `cd $DL && npx vitest run tests/executor-audit-receipts.test.ts tests/unit/dispatch-failure.vitest.ts tests/unit/deep-research-reducers.vitest.ts` prints `Tests  55 passed (55)`. Evidence: `55 passed (55)`.
- [x] T014 Run the stem census and the two append checks (`$DL/scripts/check-ledger-stem-producers.cjs`). Verify: it prints `"ok":true` with `"registered":88` and `"reserved":65`, and `check-projection-coverage.cjs` and `check-protocol-append-sites.cjs` each print `"ok":true`. Evidence: `"ok":true` with `"registered":88` and `"reserved":65`, and both checks print `"ok":true`.
- [x] T015 Run the full deep-loop suite (`$DL`). Verify: `cd $DL && npx vitest run` prints `Tests  2916 passed | 8 skipped (2924)`, nine more passed than the 2907 baseline in `plan.md` section 5. Evidence: `Test Files  176 passed (176)` and `Tests  2929 passed | 8 skipped (2937)`, the planned 2916 plus the 13 stdin and save tests.
- [x] T016 Stop the eager stdin reads and add `readStdinSync` (`$DL/scripts/lib/cli-guards.cjs`). Verify: `cd $DL && npx vitest run tests/integration/cli-stdin-forwarding.vitest.ts` prints `3 passed (3)`, and 2 fail on the old entrypoints. Evidence: `3 passed (3)`, then `2 failed | 1 passed (3)` with the five script files stashed.
- [x] T017 Save with `--full-auto` and the continuity fields in all six workflows (`$A/deep-review-auto.yaml`). Verify: `cd $DL && npx vitest run tests/unit/deep-loop-save-full-auto-yaml.vitest.ts` prints `10 passed (10)`, and 10 fail on the old workflows. Evidence: `10 passed (10)`, then `10 failed (10)` with the workflows stashed. A trial save with the old payload wrote no continuity, and one with the four fields wrote it.
- [x] T018 Release v1.6.28.0 (`.skilled/skills/system-deep-loop/changelog/v1.6.28.0.md`). Verify: `validate_document.py` prints `Total issues: 0` and the four version fields read `1.6.28.0`. Evidence: both hold.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh` on this packet with `--strict` prints `RESULT: PASSED`, and `implementation-summary.md` names every file that changed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 3 for the design per writer and section 4 for the edits
- **Predecessor**: `../019-dsh-single-executor-hardening/plan.md`, section `### C6, Option A`
<!-- /ANCHOR:cross-refs -->

---
