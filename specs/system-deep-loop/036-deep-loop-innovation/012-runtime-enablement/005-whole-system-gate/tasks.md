---
title: "Tasks: Whole-System Gate"
description: "Task breakdown for freezing the SHAs, running the enumerated check set including a real fan-out, and writing the receipt."
trigger_phrases:
  - "whole system gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-24T08:22:20Z"
    last_updated_by: "claude"
    recent_action: "Re-measured the gate to a literal PASS at candidate 07c1bd5f22"
    next_safe_action: "None; gate passes and the epic is reconciled, pending the operator ff-merge gate"
    blockers: []
    key_files:
      - "specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate/scratch/run-gate.mjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-001** Resolve candidate and baseline SHAs from the environment. [EVIDENCE: resolved by executing `git rev-parse` inside the gate; candidate `07c1bd5f22`, baseline `8c9f0b6944`]
- [x] **T-002** Confirm the working tree is clean before measuring. [EVIDENCE: `tree-clean` passes with the gate's own output excluded and the exclusion named]
- [x] **T-003** Capture the baseline runtime suite result at the baseline SHA. [EVIDENCE: `19 failed / 4395 passed / 39 skipped (4453)` at the baseline SHA `8c9f0b6944`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-004** Run the runtime suite at the candidate. [EVIDENCE: `13 failed / 2698 passed / 7 skipped (2718)` at candidate `07c1bd5f22`; `candidate-frozen` proves the runtime tree is byte-identical to the one measured]
- [x] **T-005** [P] Run every mode's reader contract at the candidate. [EVIDENCE: the gate's real `reader-contracts` check reads all 8 modes cleanly — fold → materialize → real consumer → clean read — and is proven load-bearing by the `READER_CONTRACT_CORRUPT_INJECT` negative control turning it red then green; `reader-contracts: pass` in the latest receipt. The earlier spawn-only reachability probe is now the separate `consumer-reachability` check]
- [x] **T-006** [P] Read and record the authority state of all seven modes. [EVIDENCE: all 8 modes of the frozen order read; every one `new_authoritative_final` from a stored record, confirmed by `verify-authority.cjs` at the current HEAD and by `authority-state: pass` in the latest receipt]
- [x] **T-007** Run a real fan-out to completion. [DONE, and the earlier note was stale in the pessimistic direction. The receipt records `fanout-real-run` as `pass`, not `not-run`: run_id 1787198541887-w6k53d, total 1, succeeded 1, failed 0, orphaned 0, with a 4978-byte iteration artifact still on disk under `scratch/fanout-proof/`. The gate verdict is still determined by the authority check, which is a separate matter from whether this task ran]
- [x] **T-008** Write the receipt naming both SHAs, every check, and the verdict. [EVIDENCE: `scratch/receipt.json` and `scratch/receipt.md` — both SHAs, seven checks, suite delta, verdict PASS]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-009** Run the gate once against a deliberately broken condition; confirm it fails and still writes a receipt. [EVIDENCE: `--break tree-clean` and `--break candidate-frozen` each turned a passing check red, set `forcedBreak`, and still wrote a receipt at exit 1]
- [x] **T-010** Confirm every check ran at the frozen candidate SHA. [EVIDENCE: `candidate-frozen` returns an empty runtime diff between the candidate and the measured tree]
- [x] **T-011** Confirm the suite result is expressed as a delta against the baseline. [EVIDENCE: `failed 13 vs 19`, `passed 2698 vs 4395`, `skipped 7 vs 39`, `total 2718 vs 4453`; candidate `07c1bd5f22` vs baseline `8c9f0b6944`]
- [x] **T-012** Confirm the working tree is unchanged, via status and diff. [EVIDENCE: `git status --porcelain` filtered of the gate's own directory is empty; `.opencode/` 0 changes; authority root still holds only `README.md`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-013** The receipt is complete and retained. [EVIDENCE: receipt retained in `scratch/`, regenerated clean after the falsifiability runs with `forcedBreak: null`]
- [x] **T-014** `validate.sh` on this folder with `--strict`; Errors: 0. [EVIDENCE: `validate.sh --strict` run from the final state after regenerating `description.json` and `graph-metadata.json`; `Errors: 0`]
- [x] **T-015** `implementation-summary.md` records the verdict and the falsifiability run. [EVIDENCE: `implementation-summary.md` sections 5 and 6]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../004-legacy-writer-retirement/` |
| Successor | `../006-enablement-closeout/` |
<!-- /ANCHOR:cross-refs -->
