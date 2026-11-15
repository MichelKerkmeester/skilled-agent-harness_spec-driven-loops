---
title: "Tasks: Phase 23: dsh-lineage-executor-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh lineage executor check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: dsh-lineage-executor-check

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

`$DL` is `.skilled/skills/system-deep-loop/runtime`. `$A` is `.skilled/commands/deep/assets`. The real copies are scratch copies, outside the repository, of the `dsh-1` review lineage under `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/`, of that copy with its `invocation-metadata.json` removed and of the `deepseek-1` research lineage under `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the gap on the real copies with the script at `HEAD` (`$DL/scripts/verify-iteration.cjs`). Verify: every run prints `OK`, the copy with no metadata file included. Evidence: the block in `spec.md` section 2, at `e263e5481e7`.
- [x] T002 Record the full-suite baseline with every source file at `HEAD` (`$DL`). Verify: `cd $DL && npx vitest run` prints about `3010 passed | 9 skipped`. Evidence: `Test Files  177 passed (177)` and `Tests  3010 passed | 9 skipped (3019)`, exit 0.
- [x] T003 Record the touched-file and drift baselines (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: the two touched test files print `69 passed (69)` and the drift check prints `[CONTRACT DRIFT] OK commands=2`. Evidence: both printed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Check a lineage against its invocation metadata (`$DL/scripts/verify-iteration.cjs`). Verify: `rg -c 'lineageInvocationKind' $DL/scripts/verify-iteration.cjs` prints 2. Evidence: printed `2`.
- [x] T005 Count the opening row on a log with no ledger (`$DL/lib/deep-loop/post-dispatch-validate.ts`). Verify: `rg -c 'ledgerModeFor' $DL/lib/deep-loop/post-dispatch-validate.ts` prints nothing. Evidence: no match.
- [x] T006 Replace the lineage exemption case with three lineage cases (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: the file prints `Tests  41 passed (41)`. Evidence: `41 passed (41)`, up from 39.
- [x] T007 Add the no-ledger opening-row case (`$DL/tests/unit/post-dispatch-validate.vitest.ts`). Verify: the file prints `Tests  31 passed (31)`. Evidence: `31 passed (31)`, up from 30.
- [x] T008 Reword the `executor_missing` sentence (`$A/deep-review.yaml` and `$A/deep-research.yaml`). Verify: `rg -c "In a fan-out lineage it means the lineage's invocation-metadata.json" $A/deep-review.yaml $A/deep-research.yaml` prints 1 for each. Evidence: 1 and 1.
- [x] T009 Regenerate the compiled contracts (`$A/compiled/deep-review.contract.markdown`). Verify: `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`. Evidence: two `STALE_SOURCE_DIGEST` lines and exit 2 before, `OK commands=2` and exit 0 after. Each contract changed only its digest line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Fail first on the old code (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: with both source files at `HEAD` the two test files print `4 failed | 68 passed (72)`, and `72 passed` once restored. Evidence: both printed. Each failure is an assertion: three `expected null to be 'executor_missing'` and one `expected { ok: false, …(2) } to deeply equal { ok: true }`.
- [x] T011 Run the new script on the real copies (`$DL/scripts/verify-iteration.cjs`). Verify: all five `dsh-1` iterations and all five `deepseek-1` iterations exit 0, and the copy with no metadata file exits 1 with `executor_missing`. Evidence: all held.
- [x] T012 Run the typecheck (`$DL/package.json`). Verify: `npm run typecheck` exits 0. Evidence: exit 0.
- [x] T013 Run the full deep-loop suite (`$DL`). Verify: no failure, and the count rises by three. Evidence: `Test Files  177 passed (177)` and `Tests  3013 passed | 9 skipped (3022)`, exit 0.
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
