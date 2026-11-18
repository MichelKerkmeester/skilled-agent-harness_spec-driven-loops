---
title: "DRV-070 -- Completed-run extension with --extend"
description: "This scenario validates `--extend=N` on a completed deep-review run for `DRV-070`. It focuses on same-session continuation, the `run_extended` ledger event and the review report snapshot taken before re-synthesis."
version: 1.0.6.0
---

# DRV-070 -- Completed-run extension with --extend

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-070`.

---

## 1. OVERVIEW

This scenario validates completed-run extension for `DRV-070`. It focuses on `--extend=N` reopening a completed review run in the same session and generation, recording the extension as one `run_extended` event, and keeping the prior review report as a versioned snapshot before the run re-synthesizes.

### Why This Matters

A review that stopped at its iteration cap often has one more dimension worth checking. The operator should be able to add N iterations to that same review without a new session. If the extension resets the generation, drops the prior report, or appends a second extension event, the review history no longer shows what was checked and when.

---

## 2. SCENARIO CONTRACT

Operators run this as a real orchestrator-led check against a completed fixture review rather than a synthetic matrix. The scenario is only complete when the operator can explain, in plain language, how many iterations the extension added and where the prior report was kept.

- Objective: Verify that `--extend=3` on a completed review run adds exactly three iterations in the same session and generation, records one `run_extended` event, and snapshots the prior review report.
- Real user request: The review finished at its iteration cap, and one dimension still has open questions. Give the same review three more iterations.
- Prompt: `Extend the completed deep-review run in the fixture spec folder, a run created with --convergence-mode=off so the extension keeps that mode and cannot re-stop at once, by three iterations with --extend=3, then confirm the original session identifier, the single run_extended event and the review report snapshot.`
- Expected execution process: Read the completed fixture config under `{artifact_dir}`, run the review command with `--extend=3` against that spec folder, then read the state log, the config and the snapshot after the run finishes.
- Expected signals: Exactly one `run_extended` event appears, projected as one `extended` row in `deep-review-state.jsonl`. The config keeps the original `sessionId` and generation 1, `maxIterations` equals the prior iteration count plus 3, and the lineage mode is `completed-continue`. No `resumed` row is written for the extension. A file matching `review-report-v*-r*.md` holds the prior report, and exactly three new iteration files are written under `iterations/`.
- Desired user-visible outcome: The user is told the review was extended by three iterations, that the same session continues, and where the prior report was kept.
- Pass/fail: PASS if the event count, the session identifier, the iteration cap, the snapshot and the iteration count all match the expected signals; FAIL if any one of them differs, including a second `run_extended` event or a missing snapshot.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Extend the completed deep-review run in the fixture spec folder, a run created with --convergence-mode=off so the extension keeps that mode and cannot re-stop at once, by three iterations with --extend=3, then confirm the original session identifier, the single run_extended event and the review report snapshot.`

### Commands

1. `rg -n -- '--extend' .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-review.yaml`
2. `rg -n 'run_extended' .skilled/skills/system-deep-loop/runtime/lib`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run append-mode-event-legacy-seam.vitest workflow-restart-lifecycle.vitest`
4. `/deep:review "<fixture target>" :auto --spec-folder=<completed-fixture-spec-folder> --extend=3`
5. `rg -c '"event":"extended"' <artifact_dir>/deep-review-state.jsonl` (the `run_extended` stem lives in the ledger, and the state log carries its projected `extended` row)
6. `jq '{sessionId, generation, maxIterations, lineageMode}' <artifact_dir>/deep-review-config.json`
7. `find <artifact_dir> -name 'review-report-v*-r*.md'`
8. `ls <artifact_dir>/iterations | wc -l`
9. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run workflow-restart-lifecycle.vitest -t 'extend-minutes'` (the `--extend-minutes=M` cases)

`<artifact_dir>` is the review artifact folder under the fixture spec folder, the folder that holds `deep-review-config.json`.

### Expected

Command 1 prints the `--extend` binding and the extension step in both files. Command 2 prints the `run_extended` stem and its payload type. Command 3 exits 0 with no failed test. After command 4 finishes, command 5 prints `1`, command 6 shows the original `sessionId`, generation 1, `maxIterations` at the prior count plus 3 and `lineageMode` `completed-continue`, command 7 lists one snapshot file, and command 8 shows three more iteration files than before the run. Command 9 exits 0 with 4 tests passed and none failed. For review, that run checks only the `--extend-minutes` binding in `review.md`, the presentation file and the preflight step. The duration budget cases are research tests, so the live duration check under Optional Supplemental Checks covers the review budget.

### Evidence

Capture the command 1 and 2 matches, the command 3 summary line, the command 5 count, the command 6 JSON, the command 7 listing, the command 8 counts before and after the run and the command 9 summary line.

### Pass / Fail

- **Pass**: One `run_extended` event, the original `sessionId` and generation, `maxIterations` at the prior count plus 3, a `completed-continue` lineage, one review report snapshot, no `resumed` row, and exactly three new iteration files.
- **Fail**: Any second `run_extended` event, a changed `sessionId` or generation, a different iteration cap, a missing snapshot, an overwritten snapshot, or an iteration count other than three more.

### Failure Triage

Check the state log first, then the config. A missing event with a correct config means the gateway append was skipped, so read the extension step in `deep-review.yaml` before the classifier override. A correct event with a wrong iteration count points at the classifier, which should land on resume.

### Optional Supplemental Checks

- Refusal: run the same command with `--extend=0` and confirm it stops with a named usage error before any state write. The flag accepts positive integers only.
- Refusal: run it with `--extend=3` against a review that is still in progress and confirm it refuses because the run is not complete.
- Duration: on a fresh copy of the completed fixture, run command 4 with `--extend=3 --extend-minutes=30`. Then run `jq '{maxDurationMinutes, createdAt}' <artifact_dir>/deep-review-config.json`. `maxDurationMinutes` equals the larger of the prior budget and the minutes elapsed since `createdAt`, plus 30. `createdAt` keeps its original value. Without `--extend-minutes`, the added minutes default to the prior budget.
- Refusal: run the command with `--extend-minutes=30` and no `--extend`, and confirm it stops with a usage error that names the flag before any state write.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | `feature-catalog/loop-lifecycle/completed-run-extension.md` covers the `deep-review` completed-run extension; the implementation anchors below are the contract |
| `../../../deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | Research counterpart of this extension, for the same flag on the research loop |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | Extension step, review report snapshot step and classifier override |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts` | Gateway case that appends `run_extended` and projects one `extended` row |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` | Workflow case that keeps the original `sessionId` and generation, plus the `--extend-minutes` binding case |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-070
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/extend-completed-review-run.md`
