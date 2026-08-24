---
title: "Checklist: Whole-System Gate"
description: "Blocking verification contract for the whole-system gate: frozen candidate, enumerated checks, a receipt on pass or fail, and a proven-falsifiable verdict."
trigger_phrases:
  - "whole system gate checklist"
importance_tier: "critical"
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
# Checklist: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

A pass counts only if the gate has been shown capable of failing. The falsifiability run is therefore a blocking item,
not an optional extra, and it comes before the verdict is trusted.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Predecessor `004-legacy-writer-retirement` complete [EVIDENCE: `004`'s retirement mechanism (append-gateway + `009` projections + direct-append guard) is in place, and the finalize dropped the legacy shadow writer so the selector routes each mode to `dark` only; the gate's `reader-contracts` check reads all 8 modes' projected legacy files cleanly, discharging the per-mode retirement verification]
- [x] CHK-002 [P0] Candidate and baseline SHAs resolved from the environment, not supplied (REQ-001) [EVIDENCE: both resolved by executing `git rev-parse` inside the gate; candidate `07c1bd5f22`, baseline `8c9f0b6944`. A typed literal is never the source of truth — a receipt naming a commit nobody verified describes nothing]
- [x] CHK-003 [P0] Working tree clean before measurement begins (SC-006) [EVIDENCE: `tree-clean` passes with the gate's own output directory excluded and that exclusion named in the detail; verified independently — `git status --porcelain` filtered of the gate's own path returns empty]
- [x] CHK-004 [P1] Baseline runtime suite result captured at the baseline SHA (REQ-004) [EVIDENCE: `19 failed / 4395 passed / 39 skipped (4453)` captured at the baseline SHA `8c9f0b6944` before any enablement edit; read from `scratch/baseline-raw.txt`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The check set is enumerated rather than discovered at runtime (REQ-002) [EVIDENCE: seven checks are declared as data in `run-gate.mjs` and every one appears in `receipt.json` with a status; nothing is discovered at runtime]
- [x] CHK-006 [P0] No advisory tier exists that lets a failing check produce a passing verdict (REQ-006) [EVIDENCE: `computeVerdict` returns FAIL if any check failed, INCOMPLETE if any did not run, and PASS only when neither holds — PASS is unreachable while a check is unrun; read at `run-gate.mjs:320`]
- [x] CHK-007 [P1] The receipt is written on failure as well as success (REQ-003) [EVIDENCE: the run wrote `receipt.json` and `receipt.md` with verdict FAIL and exit 1; both falsifiability runs also wrote receipts]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] The gate was run against a deliberately broken condition and reported failure (REQ-006) [EVIDENCE: `--break tree-clean` and `--break candidate-frozen` each turned a PASSING check red, set `forcedBreak`, kept exit 1, and still wrote the receipt. Breaking a check that already failed would prove nothing, so both controls target checks that were green]
- [x] CHK-009 [P0] The runtime suite ran at the candidate and is reported as a delta (REQ-004, SC-003) [EVIDENCE: re-measured at the final candidate `07c1bd5f22` — `failed 13 vs 19`, `passed 2698 vs 4395`, `total 2718 vs 4453`, `files 161 vs 199`. The large positive passed/total/files deltas are NOT improvements: the baseline `8c9f0b6944` predates the `011` deletion wave, which removed ~38 test files, so the candidate legitimately runs fewer tests. The claim that carries weight is by name — all 13 candidate failures match the documented pre-existing/environmental set (render-command-contract, check-contract-drift, dependency-seams, authorized-ledger + model-benchmark timeouts, stress cli-devin/fanout), none reference a deleted module, and nothing that passed now fails; the direct-append guard forward-fix added one passing test. Evidence: `scratch/candidate-raw.txt`, `scratch/receipt.json`]
- [x] CHK-010 [P0] A real fan-out run completed within the gate (REQ-007, SC-004) [EVIDENCE, and my earlier deferral was wrong. It argued the verdict was already determined, which is true and is not what the requirement asks: every other check reads a captured artifact, so the fan-out is the only one that exercises the runtime end to end. Ran one lineage, one iteration, cli-opencode with DeepSeek V4 Flash xhigh: status ok, fulfilled, 281s, exit 0, twelve non-empty artifacts including a 4,978-byte `iteration-001.md`. The gate's not-run stub is now a check requiring the summary counts to be consistent AND the iteration artifact to be non-empty — a summary is written by the thing being measured, so a self-declared success is refused. Both conditions proven red: hiding the summary fails it, and emptying the iteration while the summary still claims success fails it. Evidence: `scratch/fanout-real-run.md`]
- [x] CHK-011 [P0] Every mode's reader contract ran at the candidate (REQ-002) [EVIDENCE: the real per-mode `reader-contracts` check reads all 8 modes cleanly in the latest PASS receipt — fold → materialize → real consumer → clean read — and is proven load-bearing by the `READER_CONTRACT_CORRUPT_INJECT` negative control turning it red then green. Its predecessor green (a spawn-status check) was renamed `consumer-reachability`, which is all it ever proved]
- [x] CHK-012 [P0] Every check is confirmed to have run at the same frozen candidate SHA (REQ-002, SC-002) [EVIDENCE: `candidate-frozen` diffs the runtime tree between the candidate and the commit the suite was measured against and returns empty, so the suite result and the live checks describe one tree]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-013 [P0] The receipt names both SHAs, every check, and the verdict (REQ-003, SC-001) [EVIDENCE: `receipt.json` carries both SHAs, all seven checks with status and detail, the suite delta, `forcedBreak`, and the verdict; `receipt.md` renders the same for a reader who did not run it]
- [x] CHK-014 [P0] All seven modes' authority states are recorded in the receipt (REQ-008, SC-005) [EVIDENCE: all 8 modes of the frozen order are read and recorded, each `new_authoritative_final`, each from a stored record (confirmed by `verify-authority.cjs` at the current HEAD; `authority-state: pass` in the latest receipt). The spec says seven; the frozen order contains eight, and the gate records the count it actually read rather than the count it expected. CORRECTION: this item was previously marked complete on a manual read. The gate's own check had never executed — it died resolving a TS-ESM `.js` specifier and its exception was written into the receipt as a measured `fail`. Fixed, negative-controlled, and re-run; the receipt now carries per-mode records and their provenance. Evidence: `scratch/authority-check-never-ran.md`]
- [x] CHK-015 [P1] No finding is repaired inside this phase; failures open a forward-fix phase instead [EVIDENCE: nothing was repaired here. The one defect fixed was in `run-gate.mjs` itself — its `tree-clean` check counted its own artifacts as tree dirt — and correcting the instrument is not repairing a finding]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P0] The gate changed no runtime code, protocol document, or authority record (REQ-005) [EVIDENCE: `git status --porcelain` filtered of the gate's own directory returns empty; `.opencode/` shows 0 changes; the authority root still holds only its `README.md`, so no record was written]
- [x] CHK-017 [P0] The working tree is unchanged after the run, proven by status and diff (SC-006) [EVIDENCE: `git status --porcelain` filtered of the gate's own directory returns empty; unchanged apart from `receipt.json`, `receipt.md` and `run-gate.mjs`, which the phase requires it to produce]
- [x] CHK-018 [P1] The broken condition used for the falsifiability run was fully reverted [EVIDENCE: `--break` is a runtime flag, so nothing was edited to force the failure and nothing needed reverting; a clean re-run afterwards reports `forcedBreak: null`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-019 [P1] `implementation-summary.md` records the verdict and the falsifiability run [EVIDENCE: `implementation-summary.md` sections 5 and 6 record the FAIL verdict, both falsifiability runs, and what was not measured]
- [x] CHK-020 [P2] The receipt is legible to someone who did not run the gate [EVIDENCE: `receipt.md` names both SHAs, tables every check with its status, states the suite delta, and ends with the verdict in plain words]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-021 [P2] The receipt and gate output live in this folder's `scratch/` [EVIDENCE: `scratch/run-gate.mjs`, `scratch/receipt.json`, `scratch/receipt.md`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: `validate.sh --strict` run from the final state after `generate-description.js` and `backfill-graph-metadata.js`; `Errors: 0`]
- [x] CHK-023 [P0] Every item above is `[x]` with evidence [EVIDENCE: every item is `[x]`; `validate.sh 005-whole-system-gate --strict` reports Errors: 0]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Gate run complete, receipt written |
| Verifier | Confirmed the gate can fail before accepting that it passed |
<!-- /ANCHOR:sign-off -->
