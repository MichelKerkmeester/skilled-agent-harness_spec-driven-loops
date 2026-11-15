---
title: "Tasks: Phase 15: review-verdict-gate-rule"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review verdict gate rule tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: review-verdict-gate-rule

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

- [x] T001 Baseline the runtime suite and the typecheck before any edit (`scratch/baseline.txt`). Verify: the file holds the `Tests` summary line and exit status of `(cd R && npm test)` and of `(cd R && npm run typecheck)`.
- [x] T002 Baseline the stem census (`scratch/baseline.txt`). Verify: `node R/scripts/check-ledger-stem-producers.cjs` output in the file shows 88 registered, 23 spoken and 65 reserved stems, as `check-ledger-stem-producers.vitest.ts` pins at the baseline commit (the plan's 86/23/63 predated origin/main).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Register `deep_review.terminal_gates_recorded` in the stem list, a `TerminalGatesRecordedData` type, the payload and scope maps, the wire map as `deep-review.ledger.terminal-gates-recorded`, and the producer table as spoken by both review YAMLs (`L/deep-review-ledger-types.ts`). Verify: `rg -c 'terminal_gates_recorded' L/deep-review-ledger-types.ts` prints 5 or more.
- [x] T004 Add field rules (`stopReason` enum `converged`/`maxIterationsReached`, `gateResults` as `gate-results`, `failedRequiredGateIds` as `identifier-array`, `appendPosition` as `uint32`), scope fields `runId`, `sessionId`, `generation`, `iterationId`, and an `isData` branch: the gate ids are exactly `evidence`, `scope`, `coverage`, and `failedRequiredGateIds` equals the ids whose status is `fail` (`L/deep-review-ledger-schema.ts`). Verify: `(cd R && npm run typecheck)` shows no error the baseline lacks.
- [x] T005 Route the stem to `reviewLoop` and `status`, and add an arm to each of the three `assertNeverStem` switches; a record with failed ids sets `outcome` `blocked` (`R/lib/deep-review-reducers/deep-review-reducer.ts`). Verify: `(cd R && npm run typecheck)` shows no error the baseline lacks.
- [x] T006 Project the event to a row `{type:'event', event:'terminal_gates', run, stopReason, failedRequiredGateIds, gateResults}` (`R/lib/legacy-projections/deep-review-state-contract.ts`). Verify: `rg -n "event: 'terminal_gates'" R/lib/legacy-projections/deep-review-state-contract.ts` prints one line.
- [x] T007 Read the latest `terminal_gates` row into `registry.terminalGates`, return FAIL when its `failedRequiredGateIds` is non-empty, keep a missing row as no failed gate, and name the failed gates in the dashboard verdict note (`R/scripts/reduce-state.cjs`). Verify: `rg -n 'terminalGates' R/scripts/reduce-state.cjs` prints the registry field and the verdict line.
- [x] T008 Union `terminalGates.failedRequiredGateIds` across lineage registries into the merged registry, and return FAIL from `mergedVerdict` and the attribution verdict when a lineage's list is non-empty (`R/scripts/fanout-merge.cjs`). Verify: `rg -c 'failedRequiredGateIds' R/scripts/fanout-merge.cjs` prints 2 or more.
- [x] T009 In `step_handle_convergence` `if_stop`, evaluate `evidence` (evidenceDensityGate), `coverage` (dimensionCoverageGate) and `scope` (every active finding's file inside the review target), append the event, then set FAIL in `step_derive_verdict` on `p0_count > 0` or a non-empty `failed_required_gate_ids` (`Y/deep-review-auto.yaml`). Verify: `rg -c 'deep_review.terminal_gates_recorded|failed_required_gate_ids' Y/deep-review-auto.yaml` prints 3 or more.
- [x] T010 Make the same two changes in the confirm workflow (`Y/deep-review-confirm.yaml`). Verify: the T009 search on `Y/deep-review-confirm.yaml` prints 3 or more.
- [x] T011 [P] Restate the contract rule: FAIL on an active P0 or a required quality gate still failing at the stop (`README.md`, `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md`, `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`). Verify: `rg -n 'required quality gate' README.md` and the same search on both reference files each print one line or more.
- [x] T012 Recompile the deep-review contract (`Y/compiled/deep-review.contract.markdown`). Verify: `node R/scripts/compile-command-contracts.cjs --command deep/review --write` exits 0 and `node R/scripts/check-contract-drift.cjs --command deep/review` prints `OK`.
- [x] T013 [P] Add accept and refuse cases for the stem: a clean stop with an empty failed list, a stop with `coverage` failing, and a refused record whose failed ids name a passing gate (`R/tests/unit/deep-review-ledger-schema.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/deep-review-ledger-schema.vitest.ts)` prints a `Tests` line with no failure.
- [x] T014 [P] Add a projection case asserting the `terminal_gates` row and `registry.terminalGates` (`R/tests/unit/deep-review-state-contract.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/deep-review-state-contract.vitest.ts)` prints a `Tests` line with no failure.
- [x] T015 [P] Add reducer verdict cases: max-iterations stop with `coverage` failing and no P0 gives FAIL, a blocked stop later converged with no failed gate gives PASS, and a log with no terminal row keeps the P0-only verdict (`R/tests/unit/deep-review-state-contract.vitest.ts`, written in the same dispatch as T014 because both edit one file). Verify: the T014 command prints a `Tests` line with no failure.
- [x] T016 [P] Add a merge case where one of two lineages names a failed gate and the merged and attribution verdicts are FAIL (`R/tests/unit/fanout-merge.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/fanout-merge.vitest.ts)` prints a `Tests` line with no failure.
- [x] T017 Update the census pin and the stem list for the new stem (`R/tests/unit/check-ledger-stem-producers.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/check-ledger-stem-producers.vitest.ts)` prints a `Tests` line with no failure and the pinned counts read 89, 24 and 65.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Rerun the whole runtime suite and the typecheck (`scratch/after.txt`). Verify: `(cd R && npm test)` and `(cd R && npm run typecheck)` show no failure the T001 baseline lacks.
- [x] T019 Run the stem census (`R/scripts/check-ledger-stem-producers.cjs`). Verify: `node R/scripts/check-ledger-stem-producers.cjs` exits 0.
- [x] T020 Run the contract parity suites and the drift check (`scratch/after.txt`). Verify: `(cd .skilled/skills/system-spec-kit/runtime/cli && npx --no-install vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-research-contract-parity.vitest.ts)` prints `Tests  19 passed (19)`, and the drift check prints `OK` for deep/review.
- [x] T021 Rerun the consumer inventory (`plan.md` FIX ADDENDUM). Verify: `rg -n 'terminal_gates|terminalGates|failedRequiredGateIds' .skilled --glob '*.{ts,cjs,yaml,md}' --glob '!**/node_modules/**'` names only files in the Affected Surfaces table.
- [x] T022 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows the reducer and merge fixtures giving FAIL with a failed gate and PASS after a cleared blocked stop
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Origin**: `../010-deep-loop-leaf-state-and-status/spec.md` section 7, the operator's answer of 2026-11-15
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
- [x] CHK-003 [P1] `scratch/baseline.txt` holds the T001 and T002 output
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `(cd R && npm run typecheck)` shows no error the baseline lacks
- [x] CHK-011 [P0] `(cd R && npm test)` shows no failure the baseline lacks
- [x] CHK-012 [P1] The gateway refuses a terminal record whose failed ids disagree with its gate results
- [x] CHK-013 [P1] The new stem appears in every table the feature explorer listed, and `check-ledger-stem-producers.cjs` exits 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The reducer fixture with `coverage` failing at a max-iterations stop prints FAIL
- [x] CHK-022 [P1] A blocked stop that later converged prints PASS, and a log with no terminal row keeps the P0-only verdict
- [x] CHK-023 [P1] A merge with one failing lineage prints FAIL in the merged and attribution verdicts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is class `cross-consumer`: one rule re-derived at several verdict sites.
- [x] CHK-FIX-002 [P0] The same-class producer inventory in `plan.md` lists every P0-only deriver, and each is updated or recorded as out of scope.
- [x] CHK-FIX-003 [P0] The consumer inventory in T021 names only files in the Affected Surfaces table.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction surface changes.
- [x] CHK-FIX-005 [P1] The five matrix axes in `plan.md` each have a fixture row in T013 to T016.
- [x] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] `scratch/after.txt` names the commit it was taken at.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret is read or written by any changed file
- [x] CHK-031 [P0] The new stem's data passes the gateway's forbidden-key check: no `body`, `code`, `content`, `text` or `transcript` key
- [x] CHK-032 [P1] N/A: no auth surface changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same stem, row and registry field
- [x] CHK-041 [P1] No code comment carries a packet, phase or task id
- [x] CHK-042 [P2] `README.md` and both reference docs state the contract rule
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
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
