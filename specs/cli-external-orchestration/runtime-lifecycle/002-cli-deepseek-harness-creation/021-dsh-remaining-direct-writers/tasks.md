---
title: "Tasks: Phase 21: dsh-remaining-direct-writers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh remaining direct writers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: dsh-remaining-direct-writers

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

`$DL` is `.skilled/skills/system-deep-loop/runtime`. `$A` is `.skilled/commands/deep/assets`. The nine source files are the three writers, the gateway and the five research schema, projection and reducer files named in `spec.md` section 3.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the loss with the probe, saved outside the repository (`$DL/lib/deep-loop/post-dispatch-validate.ts`). Verify: it prints `after refresh=0` for each of the three rows in both modes and `validate with executorKind=executor_missing`. Evidence: the block in `spec.md` section 2, at `73a8a2d9c1`.
- [x] T002 Record the full-suite baseline (`$DL`). Verify: `cd $DL && npx vitest run` prints about `2929 passed | 8 skipped`. Evidence: `Tests  1 failed | 2928 passed | 8 skipped (2937)`. The one failure is `reports one externally killed lineage without erasing surviving artifacts` in `tests/stress/cli-adapter/fanout.vitest.ts`, a 2 second shim timeout. That file alone printed `20 passed | 1 skipped (21)` at `HEAD`.
- [x] T003 Record the touched-file baselines (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: the twelve touched and neighbouring test files print `Tests  344 passed (344)` and the typecheck exits 0. Evidence: `344 passed (344)`. Per file: projection 10, validate 30, containment 90, call sites 2, research schema 54, census 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Export `ledgerModeFor` and `appendFailureRow` (`$DL/lib/deep-loop/executor-audit.ts`). Verify: `rg -c '^export function (ledgerModeFor|appendFailureRow)' $DL/lib/deep-loop/executor-audit.ts` prints 2. Evidence: printed `2`.
- [x] T005 Route the degraded row through `appendFailureRow`, add `sessionId` to the input and read the opening row in the executor check (`$DL/lib/deep-loop/post-dispatch-validate.ts`). Verify: `rg -c 'appendFailureRow|openingRowNamesExecutor' $DL/lib/deep-loop/post-dispatch-validate.ts` prints 4. Evidence: printed `4`.
- [x] T006 Route both containment rows through `appendFailureRow` on a ledger-backed log and add `sessionId` to the input (`$DL/lib/deep-loop/write-containment.ts`). Verify: `rg -c 'input\.sessionId' $DL/lib/deep-loop/write-containment.ts` prints 2. Evidence: printed `2`.
- [x] T007 Accept the three rows in the review gateway (`$DL/scripts/append-mode-event.cjs`). Verify: `rg -c "'containment_contested'" $DL/scripts/append-mode-event.cjs` prints 1. Evidence: printed `1`.
- [x] T008 Register the three research stems (`$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` and the four files beside it in `spec.md` section 3). Verify: `cd $DL && npm run typecheck` exits 0 and `node scripts/check-ledger-stem-producers.cjs` prints `"registered":91`. Evidence: exit 0 and `"registered":91`.
- [x] T009 Pass the session id to the twelve containment calls and the four validate steps (`$A/deep-review-auto.yaml` and the three other review and research workflows). Verify: `rg -c 'sessionId: '` on `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml` and `deep-research-confirm.yaml` prints 6, 2, 6 and 2 more than at `HEAD`. Evidence: 20, 7, 18 and 6 against 14, 5, 12 and 4.
- [x] T010 Reword the executor sentence (`.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`). Verify: `rg -c 'patches the first canonical' <that file>` prints 0 and `rg -c 'opening .*iteration_start.* row' <that file>` prints 1. Evidence: 0 and 1.
- [x] T010b Reword the same sentence in the review protocol (`.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`). Verify: `rg -c 'opening `iteration_start` row' <that file>` prints 1 and `validate_document.py` prints `Total issues: 0`. Evidence: both hold.
- [x] T011 Regenerate the compiled contracts (`$A/compiled/deep-research.contract.markdown`). Verify: `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`. Evidence: printed it. The AI Council contract came out byte-identical.
- [x] T012 Add the survival, fallback and executor tests (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  18 passed (18)`. Evidence: `18 passed (18)`.
- [x] T013 Add the three research fixtures and round-trip cases and move the census pin (`$DL/tests/unit/deep-research-ledger-schema.vitest.ts` and `check-ledger-stem-producers.vitest.ts`). Verify: the two files print `Tests  65 passed (65)`. Evidence: `65 passed (65)`.
- [x] T014 Add the session id guard to the call-site test (`$DL/tests/unit/write-containment-yaml-call-sites.vitest.ts`). Verify: the file prints `Tests  3 passed (3)`. Evidence: `3 passed (3)`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Fail first on the old sources (`$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`). Verify: with the nine source files back at `HEAD`, the file prints `7 failed | 11 passed (18)`, and `18 passed (18)` once they are restored. Evidence: both printed.
- [x] T016 Fail first for the schema and census (`$DL/tests/unit/deep-research-ledger-schema.vitest.ts`). Verify: on the old sources the two files print `4 failed | 61 passed (65)`. Evidence: printed, the census case and the three round-trips.
- [x] T017 Fail first for the call-site guard (`$DL/tests/unit/write-containment-yaml-call-sites.vitest.ts`). Verify: with the four workflows at `HEAD` it prints `1 failed | 2 passed (3)`. Evidence: printed.
- [x] T018 Run the typecheck and the four check scripts (`$DL/scripts/check-ledger-stem-producers.cjs`). Verify: typecheck exit 0, the census `"ok":true` with `"registered":91` and `"reserved":68`, `check-projection-coverage.cjs` and `check-protocol-append-sites.cjs` each `"ok":true` and the drift check `[CONTRACT DRIFT] OK commands=3`. Evidence: all five held.
- [x] T019 Confirm plain Node still loads the guard (`$DL/lib/deep-loop/write-containment.ts`). Verify: `cd $DL && node -e "import('./lib/deep-loop/write-containment.ts').then((m) => console.log(typeof m.enforceWriteContainment))"` prints `function`. Evidence: printed `function`. With a static import it failed with `ERR_MODULE_NOT_FOUND` for `executor-audit.js`.
- [x] T020 Run the full deep-loop suite (`$DL`). Verify: no failure in a changed file or one that loads a changed module, and any other failure passes alone. Evidence: `Tests  1 failed | 2940 passed | 8 skipped (2949)`. The one failure is a timing test in `tests/unit/fanout-pool.vitest.ts`, which loads only `fanout-pool.cjs` and `cli-guards.cjs`, and that file alone printed `42 passed (42)` three times.
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
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
