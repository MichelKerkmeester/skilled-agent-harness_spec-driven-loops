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

`R` is `.skilled/skills/system-deep-loop/runtime`. `D` is `R/lib/deep-loop/divergent-pivot.ts`. Every test command runs as `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...` from the repository root. No agent definition changes, so no mirror sync is needed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's answer on the seat-cap scope and record it as ADR-001 `Accepted` (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: per pivot (OD-001), then 3 per council attempt with at most one retry per pivot (OD-002).
- [x] T002 Capture the baseline of the REQ-006 and contract suites (`R/tests/`). Verify: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4. Done 2026-11-17: 5 files, 50 passed on integration tip `c898b3ad9a3`; typecheck exit 0. Recorded in `goal.md` §4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Drop the unreachable `minRemainingIterations` comparison while keeping the field accepted in config and persisted limits (`D`). Verify: the REQ-004 case passes and `rg -n "remainingIterations < config" R/lib/deep-loop/divergent-pivot.ts` prints nothing. Done 2026-11-17 (Go dispatch, `scratch/dispatch/T003.*`): the comparison is gone (`rg` exit 1); the minRemainingIterations row became the case "keeps accepting a persisted minRemainingIterations limit without refusing on it"; 14 passed.
- [x] T004 Cap council seat outputs at 3 per council attempt: set the default to 3 (:286) and count only the current attempt in the seat-cap check (:736), and run that check only when an attempt is opened, not when `prepare` resumes an open attempt (:1244, :1284) (`D`). Verify: the REQ-005 cases pass in `tests/integration/divergent-pivot.vitest.ts`, including a resume of an attempt that holds 2 seat returns. Done 2026-11-17 (Go dispatch): default 3, check runs only when the attempt holds no durable seat; cases "allows a later pivot after an earlier pivot used six seat outputs" and "does not refuse a resumed attempt that already holds two seat returns" pass (16 passed, typecheck 0). Deviation: a resumed prepare reuses the persisted `usageAtStart` (and, from T006, `limits`), because a caller-reported count that changed since the pivot opened made the `pivot_started` replay and `persistConfig` throw a conflict.
- [ ] T005 Scope the seat count to the current pivot id and attempt in both pivot scripts (`.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:420`, `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:405`). Verify: the REQ-008 two-pivot case passes.
- [x] T006 Give the attempt an identity: attempt-2 seat event ids (`seatEventId`, :600-601), seat output paths (`buildPivotCouncilPaths`, :807-830), attempt-scoped event lookups in place of `eventByName` (:596-598), and an `attempt` field with `invariants.rounds` of 1 or 2 in the persisted config (:1130-1165). Attempt 1 keeps today's ids and paths; seat ids stay `seat-001` to `seat-003` (`D`). Verify: the REQ-007 case passes, including a pre-change pivot fixture that still loads. Done 2026-11-17 (Go dispatch): `seatEventId`/`deliberationEventId`/`buildPivotCouncilPaths` take an attempt; attempt 2 lives under `council/attempt-2/`; config carries `attempt` only for attempt 2 and `invariants.rounds` equals the attempt; cases "gives attempt 2 its own seat and deliberation paths and keeps attempt 1 paths" and "keeps attempt-1 seat event ids and loads a config written before attempts existed" pass (28 passed across the three suites, typecheck 0).
- [ ] T007 Mark a first-attempt quorum failure retryable in finalize, at most once per pivot, writing a distinct non-terminal per-attempt failure event instead of `pivot_failed` (:1295, :1441), with the matching `PivotEventName` (:146-153) and `PIVOT_LIFECYCLE_STATES` (:290-297) entries; reopen the same pivot as attempt 2 in prepare; record the real seat count (3 or 6) in usage (:1485-1486) (`D`). Verify: the REQ-002 and REQ-003 cases pass.
- [ ] T008 Carry the retry signal and the attempt number through the `prepare` and `finalize` subcommands (`R/scripts/divergent-pivot.cjs`). Verify: `npx vitest run tests/unit/divergent-pivot-cli.vitest.ts` passes with a case where `finalize` prints a retryable result and a second `prepare` returns attempt 2 with three missing seats.
- [ ] T009 Re-enter `step_prepare_divergent_pivot` once when finalize returns retryable, passing the attempt number to the seat dispatch and record steps (`.skilled/commands/deep/assets/deep-research.yaml`, pivot branch :1056-1112). Verify: `rg -n "retryable" .skilled/commands/deep/assets/deep-research.yaml` prints the new branch, and a second failure still reaches the fail-closed log line.
- [ ] T010 Add the same one-time re-entry to the review pivot branch (`.skilled/commands/deep/assets/deep-review.yaml`, :1158-1206). Verify: `rg -n "retryable" .skilled/commands/deep/assets/deep-review.yaml` prints the new branch.
- [ ] T011 Regenerate both compiled contracts, last of the implementation tasks (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown`). Verify: `node R/scripts/compile-command-contracts.cjs --command deep/research --write` and `node R/scripts/compile-command-contracts.cjs --command deep/review --write` each print their contract path, and `npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0. Regenerate again after each merge instead of resolving digest lines by hand.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Add the retry case: attempt 2 dispatches three seats under the same seat ids, and its event ids and seat files do not collide with attempt 1 (`R/tests/integration/divergent-pivot.vitest.ts`). Verify: the case passes. `tests/council/multi-seat-dispatch.vitest.ts` is not edited, because the workflow, not `dispatchCouncilSeats`, drives the pivot's seats.
- [ ] T013 Typecheck the runtime (`R/tsconfig.json`). Verify: `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck` exits 0.
- [ ] T014 Write the changelog entry stating that `maxCouncilSeatOutputs` now means 3 per council attempt, that a quorum failure gets one retry, and that the worst-case run cost is 18 (`.skilled/skills/system-deep-loop/changelog/`). Verify: `rg -l 'maxCouncilSeatOutputs' .skilled/skills/system-deep-loop/changelog` lists the new entry.
- [ ] T015 Write the manual testing playbook scenario for a divergent run whose first council attempt fails quorum and whose retry completes, through `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/runtime/manual-testing-playbook` (`.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/`). Verify: `rg -l 'retry' .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council` lists the new scenario.
- [ ] T016 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The T016 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001, Accepted, sets the seat cap and the retry)
<!-- /ANCHOR:cross-refs -->

---
