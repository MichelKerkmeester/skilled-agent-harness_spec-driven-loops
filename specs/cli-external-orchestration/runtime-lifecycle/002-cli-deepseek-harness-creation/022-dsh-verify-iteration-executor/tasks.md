---
title: "Tasks: Phase 22: dsh-verify-iteration-executor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh verify iteration executor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: dsh-verify-iteration-executor

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

`$DL` is `.skilled/skills/system-deep-loop/runtime`. `$A` is `.skilled/commands/deep/assets`. The real copies are scratch copies, outside the repository, of the phase 019 review folder, of that copy with the executor removed from its `iteration_start` row and of the phase 006 review folder under `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the gap on the real copies with the script at `HEAD` (`$DL/scripts/verify-iteration.cjs`). Verify: every run prints `OK`, the stripped copy included. Evidence: the block in `spec.md` section 2, at `e70f6d44267`.
- [x] T002 Record the full-suite baseline with every changed file at `HEAD` (`$DL`). Verify: `cd $DL && npx vitest run` prints about `2990 passed | 9 skipped`. Evidence: `Test Files  177 passed (177)` and `Tests  2990 passed | 9 skipped (2999)`, exit 0.
- [x] T003 Record the touched-file and gate baselines (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: the file prints `31 passed (31)`, the typecheck exits 0 and the drift check prints `[CONTRACT DRIFT] OK commands=3`. Evidence: all three printed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `executor_missing` reason, the config read, the lineage exemption and the check after the route proof (`$DL/scripts/verify-iteration.cjs`). Verify: `rg -c 'EXECUTOR_MISSING|checkExecutorProvenance' $DL/scripts/verify-iteration.cjs` prints 4. Evidence: printed `4`.
- [x] T005 Add the eight executor provenance cases (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: `cd $DL && npx vitest run tests/unit/verify-iteration.vitest.ts` prints `Tests  39 passed (39)`. Evidence: `39 passed (39)`.
- [x] T006 Name `executor_missing` in each `command_note` reason list (`$A/deep-review-auto.yaml` and the three other review and research workflows). Verify: `rg -c 'outside a fan-out lineage and neither' $A/*.yaml` prints 1 for each of the four. Evidence: 1, 1, 1 and 1.
- [x] T007 Regenerate the compiled contracts (`$A/compiled/deep-review.contract.markdown`). Verify: `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`. Evidence: it printed four `STALE_SOURCE_DIGEST` lines and exit 2 before the regeneration, and `OK commands=3` after. The AI Council contract came out byte-identical.
- [x] T007b Carry the change across origin/main's workflow consolidation (`$A/deep-review.yaml`). Verify: after the merge `rg -c 'outside a fan-out lineage and neither' $A/deep-review.yaml $A/deep-research.yaml` prints 1 for each, `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2` and the hub reads `2.0.1.0`. Evidence: 1 and 1, `OK commands=2` and four version fields at `2.0.1.0`. The release moved from v1.6.30.0 to v2.0.1.0 because origin released v2.0.0.0, which merged the auto and confirm workflows into one file per command and moved AI Council out.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fail first on the old script (`$DL/tests/unit/verify-iteration.vitest.ts`). Verify: with `verify-iteration.cjs` at `HEAD` the file prints `8 failed | 31 passed (39)`, and `39 passed (39)` once it is restored. Evidence: both printed. The eight failures are assertions, seven `expected null to be 'executor_missing'` and one `expected true to be false`.
- [x] T009 Run the new script on the real copies (`$DL/scripts/verify-iteration.cjs`). Verify: the 019 copy exits 0, and the stripped copy and the five 006 iterations exit 1 with `executor_missing`. Evidence: all held. The run left the 019 copy byte-identical to the packet folder.
- [x] T010 Run the typecheck and the drift check (`$DL/scripts/check-contract-drift.cjs`). Verify: typecheck exit 0 and `[CONTRACT DRIFT] OK commands=3`. Evidence: both held.
- [x] T011 Run the full deep-loop suite (`$DL`). Verify: no failure, and the count rises by the eight new cases. Evidence: `Test Files  177 passed (177)` and `Tests  2998 passed | 9 skipped (3007)`, exit 0.
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
