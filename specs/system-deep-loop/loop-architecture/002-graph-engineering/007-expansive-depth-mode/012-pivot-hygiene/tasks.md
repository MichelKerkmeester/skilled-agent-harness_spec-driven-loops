---
title: "Tasks: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "pivot hygiene tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

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

`R` is `.skilled/skills/system-deep-loop/runtime`. Run every `npm test` from `R`. `D` is `R/lib/deep-loop/divergent-pivot.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's answer on per-pivot or lifetime seat cap and record it as ADR-001 `Accepted` with one Operator Decisions row (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: per pivot (OD-001), then 3 per council attempt with at most one retry per pivot (OD-002).
- [ ] T002 Capture the baseline of the REQ-006 suites (`R/tests/`). Verify: `npm test -- tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Cap council seat outputs at 3 per council attempt: set the default to 3, count only the current attempt in the seat-cap check and reset usage per pivot (`D`). Verify: the REQ-005 per-pivot case passes in `tests/integration/divergent-pivot.vitest.ts`.
- [ ] T004 Mark a first-attempt quorum failure retryable in finalize, at most once per pivot, reopen the same pivot with its own 3 fresh seat ids in prepare, and record the real seat count (3 or 6) in usage (`D`). Verify: the REQ-002 and REQ-003 cases pass.
- [ ] T005 Carry the retry signal through the `prepare` and `finalize` subcommands (`R/scripts/divergent-pivot.cjs`). Verify: `npm test -- tests/unit/divergent-pivot-cli.vitest.ts` passes with a case where `finalize` prints a retryable result and a second `prepare` returns three missing seats.
- [ ] T006 Re-enter `step_prepare_divergent_pivot` once when finalize returns retryable (`.skilled/commands/deep/assets/deep-research.yaml`). Verify: `rg -n "retryable" .skilled/commands/deep/assets/deep-research.yaml` prints the new branch, and a second failure still reaches the fail-closed log line.
- [ ] T007 Add the same one-time re-entry to the review pivot branch (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: `rg -n "retryable" .skilled/commands/deep/assets/deep-review.yaml` prints the new branch.
- [ ] T008 [P] Drop the unreachable `minRemainingIterations` comparison while keeping the field accepted in config and persisted limits (`D`). Verify: the REQ-004 case passes and `rg -n "remainingIterations < config" R/lib/deep-loop/divergent-pivot.ts` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add a case that a retried round dispatches three fresh seats with new ids (`R/tests/council/multi-seat-dispatch.vitest.ts`). Verify: the case passes.
- [ ] T010 Typecheck the runtime (`R/tsconfig.json`). Verify: `npm run typecheck` exits 0.
- [ ] T011 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The T011 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 gates T003 through T007)
<!-- /ANCHOR:cross-refs -->

---
