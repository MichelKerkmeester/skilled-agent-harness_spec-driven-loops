---
title: "Deep Review Strategy: fan-out write containment hardening (lineage deepseek)"
description: "Externalized strategy for the deepseek fan-out lineage reviewing packet 045 and its change set."
---

# Deep Review Strategy

<!-- ANCHOR:topic -->
## Topic

Review of the fan-out write containment hardening change set (commits `5340e39233` through `63b633c62f`) against packet `specs/system-deep-loop/045-fanout-write-containment-hardening`. Target type: spec-folder. Dimensions: all four, plus the traceability protocols `spec_code` (hard) and `checklist_evidence` (hard); overlays `feature_catalog_code` and `playbook_capability`.

The change set under review is eight commits:

| Commit | Subject |
|--------|---------|
| `5340e39233` | never fail a lane for a neighbour's untracked file under preserve |
| `bcb1333560` | tolerate an iteration recorded twice and name the append gateway |
| `4581feb2bd` | name each lineage's executor in the attribution table and merged registry |
| `65ea476de3` | wait out a neighbour's index.lock and report an exhausted retry |
| `a766c23a8f` | trip the shared-checkout churn detector on slow cumulative churn |
| `cbb1e4ae53` | write the findings registry past a strategy file without anchors |
| `ca713e3478` | remove per-lineage worktree isolation from the fan-out runtime |
| `63b633c62f` | close the containment packet with all seven fix phases landed |

Diff scope (`git diff 5340e39233^ 63b633c62f`, `.opencode` only): 31 files, +1126/-5876.
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

- [x] correctness — D1, iteration 1
- [x] security — D2, iteration 2
- [x] traceability — D3, iteration 3
- [x] maintainability — D4, iteration 4
- [x] coverage/cross-cutting — D5, iteration 5
<!-- /ANCHOR:review-dimensions -->

---

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

| Iteration | Dimension | Verdict | Summary |
|-----------|-----------|---------|---------|
| 1 | correctness | PASS | 4 P2 detection/cost findings, no P0/P1 |
| 2 | security | CONDITIONAL | 1 P1 (baseline restore follows a symlink), 3 P2 |
| 3 | traceability | FAIL | 1 P0 (spec still mandates removed worktrees), 2 P1 (stale closure gate, broken cli-opencode guard), 7 P2 |
| 4 | maintainability | PASS | 5 P2 duplication/residue/document-hygiene findings |
| 5 | completeness | PASS | 1 P2 (empty-registry check misfires on review); remaining phases verified clean |
<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## Running Findings

| Severity | Count | Note |
|----------|-------|------|
| P0 | 1 | F-009: spec still mandates the removed worktree mechanism while reading Complete |
| P1 | 3 | F-005 (restore follows a symlink), F-010 (closure gate stale with deleted evidence), F-017 (cli-opencode guard now always throws) |
| P2 | 20 | F-001..F-004, F-006..F-008, F-011..F-016, F-018..F-024 |

Final verdict: **FAIL** — one active P0; per the verdict rule an active P0 can never be relabelled.
<!-- /ANCHOR:running-findings -->

---

<!-- ANCHOR:what-worked -->
## What Worked

- Reading the shipped modules first, then the packet docs, then the change-set diff: the code/doc contradictions (F-009, F-010, F-015) only became visible once both sides were in hand.
- Checking every cited test line number against the files' current length (`wc -l`) and path existence to prove stale evidence mechanically rather than by impression.
- Using the child phase `007-worktree-removal` as a control: its evidence (151 test files, the live-run summary) resolved against HEAD, which proved the parent's staleness is real and not an artifact of the review's own reading.
- Aggregating the five deltas into the registry programmatically, so the report's counts cannot drift from the state log.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## What Failed

- Executing any test command: the lineage write surface forbids commands that write outside the lineage directory, so the runtime Vitest suite could not be run. All findings in this lineage are static (code reading plus git history); none is a re-run of the suite.
- Reading a sibling lineage's artifacts: none was present while this lineage ran, so no cross-check was possible.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Running the append-mode-event gateway in this lineage: not attempted beyond inspection. Every write of this lineage was made directly inside the lineage directory per the dispatch contract, and the runner's own reader consumes the log directly.
- Executing `validate.sh`: explicitly out of scope for this lineage.
- Searching for a dormant worktree flag or module: none remains in the runtime; the only surviving residue is in the command YAML guard (F-017) and documentation (F-009..F-016).
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions

| Direction | Why ruled out |
|-----------|---------------|
| Symlink-escape detection narrowing | The detector's canonicalization (`isContainedInArtifact`) was verified correct; the finding is on the restore *writer* (F-005), not the detector. |
| Quarantine size-bound enforcement | Bounds are present and enforced (`BASELINE_MAX_FILE_BYTES`, `BASELINE_MAX_LANE_BYTES`); no finding. |
| `spawnGit` retry correctness | Retry only on `index.lock` with bounded backoff; the failure mode is visibility (F-020), not retry logic. |
| Review-reducer anchor handling | The runtime reducer already carries the `MISSING_ANCHOR` path and surfaces `strategyWarning`; phase 6's scope was the research reducer only. |
| `mergedVerdict` strongest-restriction logic | Verified: any active P0 forces FAIL; the merge reads `openFindings` correctly. |
| Stress worktree fixture | Live harness infrastructure for isolated adapter runs, unrelated to the removed per-lineage mechanism. |
| Integration coverage of restore mode | The runner tests cover `--containment-mode restore` and the flag-over-config case; no finding. |
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## Next Focus

Loop complete. All five iterations ran; synthesis compiled `review-report.md` and the aggregated registry.
<!-- /ANCHOR:next-focus -->

---

<!-- ANCHOR:known-context -->
## Known Context

- `resource-map.md` not present. Coverage gate not applicable (`resource_map_present: false`), so the report omits that section by contract.
- Packet `spec.md` status: Complete; `implementation-summary.md` status: Complete; `acceptance-criteria.md` metadata status: In Progress.
- `checklist.md` does not exist in the packet (nor in any child phase), so `checklist_evidence` is not applicable; the packet's checklist lives inside `tasks.md` (91 checked boxes).
- The packet's `decision-record.md` carries ADR-001..ADR-007; ADR-007 supersedes the worktree mechanism, but ADR-003/ADR-005 were not marked superseded (F-021).
- No test execution was possible in this lineage (write-surface constraint); evidence is static.
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| spec_code | core (hard) | fail | `spec.md:133,141,142` vs the worktree deletion in `ca713e3478` | REQ-005/007/008 still normative; mechanism removed (F-009) |
| checklist_evidence | core (hard) | not_applicable | packet has no `checklist.md` | recorded in iteration 3's cross-reference table |
| feature_catalog_code | overlay | partial | hub catalog migrated by `ca713e3478`; runtime `fanout-run.md:3,42` stale | F-023 |
| playbook_capability | overlay | pass | `manual-testing-playbook/write-containment/shared-checkout-run.md` | scenario matches shipped preserve behavior |
<!-- /ANCHOR:cross-reference-status -->

---

<!-- ANCHOR:files-under-review -->
## Files Under Review

| File | Iteration | State |
|------|-----------|-------|
| `runtime/lib/deep-loop/write-containment.ts` | 1, 2, 4 | reviewed |
| `runtime/scripts/fanout-run.cjs` | 1, 2, 4, 5 | reviewed |
| `runtime/lib/deep-loop/executor-config.ts` | 2, 3 | reviewed |
| `runtime/scripts/fanout-pool.cjs` | 1, 5 | reviewed |
| `runtime/scripts/fanout-merge.cjs` | 5 | reviewed |
| `runtime/scripts/reduce-state.cjs`, `deep-research/scripts/reduce-state.cjs` | 5 | reviewed |
| `runtime/scripts/runtime-bootstrap.cjs` | 1 | reviewed |
| `runtime/tests/unit/write-containment.vitest.ts` | 1, 2, 5 | reviewed (static) |
| `runtime/tests/unit/fanout-run.vitest.ts` | 2, 5 | reviewed (static) |
| `.opencode/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml` | 3, 4 | reviewed |
| `specs/.../045-.../{spec,acceptance-criteria,implementation-summary,goal,handover,tasks,decision-record}.md` | 3, 4 | reviewed |
| deleted `runtime/lib/deep-loop/worktree-*.ts` and their vitest suites | 3 | reviewed via git history |
<!-- /ANCHOR:files-under-review -->

---

<!-- ANCHOR:review-boundaries -->
## Review Boundaries

- maxIterations: 5, stopPolicy: max-iterations, convergenceThreshold: 0.1 (convergence mode off).
- Writes confined to `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/deepseek`.
- No test execution, no repo tooling, no git writes.
- Review target is read-only.
<!-- /ANCHOR:review-boundaries -->
