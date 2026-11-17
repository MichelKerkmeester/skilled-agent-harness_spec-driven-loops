---
title: "DR-065 -- Completed-run extension with --extend"
description: "This scenario validates `--extend=N` on a completed deep-research run for `DR-065`. It focuses on same-session continuation, the `run_extended` ledger event and the synthesis snapshot taken before the first new dispatch."
version: 1.0.2.0
---

# DR-065 -- Completed-run extension with --extend

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-065`.

---

## 1. OVERVIEW

This scenario validates completed-run extension for `DR-065`. It focuses on `--extend=N` reopening a completed research run in the same session and generation, recording the extension as one `run_extended` event, and copying the prior synthesis to a versioned snapshot before the first new iteration starts.

### Why This Matters

An operator who hits the iteration cap on a finished run should be able to buy N more iterations without starting a new session, losing the original session identifier, or overwriting the synthesis the run already produced. If the extension resets the generation, skips the snapshot, or writes a second extension event, the lineage stops being auditable.

---

## 2. SCENARIO CONTRACT

Operators run this as a real orchestrator-led check against a completed fixture run rather than a synthetic matrix. The scenario is only complete when the operator can explain, in plain language, how many iterations the extension added and where the prior synthesis went.

- Objective: Verify that `--extend=3` on a completed research run adds exactly three iterations in the same session and generation, records one `run_extended` event, and snapshots the prior synthesis.
- Real user request: The research run finished at its iteration cap. Give it three more iterations without starting a new session.
- Prompt: `Extend the completed deep-research run in the fixture spec folder by three iterations with --extend=3, then confirm the original session identifier, the single run_extended event and the synthesis snapshot.`
- Expected execution process: Read the completed fixture config, run the research command with `--extend=3` against that spec folder, then read the state log, the config and the snapshot folder after the run finishes.
- Expected signals: Exactly one `run_extended` event appears, projected as one `extended` row in `research/deep-research-state.jsonl`. The config keeps the original `sessionId` and generation 1, `maxIterations` equals the prior iteration count plus 3, and the lineage mode is `completed-continue`. No `resumed` row is written for the extension. A file matching `synthesis-v*-r*.md` holds the prior synthesis, and exactly three new iteration files are written.
- Desired user-visible outcome: The user is told the run was extended by three iterations, that the same session continues, and where the prior synthesis was kept.
- Pass/fail: PASS if the event count, the session identifier, the iteration cap, the snapshot and the dispatch count all match the expected signals; FAIL if any one of them differs, including a second `run_extended` event or a missing snapshot.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Extend the completed deep-research run in the fixture spec folder by three iterations with --extend=3, then confirm the original session identifier, the single run_extended event and the synthesis snapshot.`

### Commands

1. `rg -n -- '--extend' .skilled/commands/deep/research.md .skilled/commands/deep/assets/deep-research.yaml`
2. `rg -n 'run_extended' .skilled/skills/system-deep-loop/runtime/lib`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run append-mode-event-legacy-seam.vitest workflow-restart-lifecycle.vitest`
4. `/deep:research "<fixture topic>" :auto --spec-folder=<completed-fixture-spec-folder> --extend=3`
5. `rg -c '"event":"extended"' <completed-fixture-spec-folder>/research/deep-research-state.jsonl` (the `run_extended` stem lives in the ledger, and the state log carries its projected `extended` row)
6. `jq '{maxIterations, sessionId: .lineage.sessionId, generation: .lineage.generation, lineageMode: .lineage.lineageMode, continuedFromRun: .lineage.continuedFromRun}' <completed-fixture-spec-folder>/research/deep-research-config.json` (research keeps the lineage fields under `.lineage`)
7. `find <completed-fixture-spec-folder> -name 'synthesis-v*-r*.md'`

### Expected

Command 1 prints the `--extend` binding and the extension step. Command 2 prints the `run_extended` stem and its payload type. Command 3 exits 0 with no failed test. After command 4 finishes, command 5 prints `1`, command 6 shows the original `sessionId`, generation 1, `maxIterations` at the prior count plus 3 and `lineageMode` `completed-continue`, and command 7 lists one snapshot file. The run adds exactly three iteration files.

### Evidence

Capture the command 1 and 2 matches, the command 3 summary line, the command 5 count, the command 6 JSON and the command 7 listing, together with the iteration file count before and after the run.

### Pass / Fail

- **Pass**: One `run_extended` event, the original `sessionId` and generation, `maxIterations` at the prior count plus 3, a `completed-continue` lineage, one synthesis snapshot, no `resumed` row, and exactly three new iterations.
- **Fail**: Any second `run_extended` event, a changed `sessionId` or generation, a different iteration cap, a missing snapshot, an overwritten snapshot, or a dispatch count other than three.

### Failure Triage

Check the state log first, then the config. A missing event with a correct config means the gateway append was skipped, so read the extension step in `deep-research.yaml` before the classifier override. A correct event with a wrong dispatch count points at the classifier, which should land on resume.

### Optional Supplemental Checks

- Refusal: run the same command with `--extend=0` and confirm it stops with a named usage error before any state write. The flag accepts positive integers only.
- Refusal: run it against a run that is still in progress and confirm it refuses because the run is not complete.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/loop-lifecycle/initialization.md` | Feature-catalog source describing the lineage modes the config accepts |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | Extension step, snapshot step and classifier override |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts` | Gateway case that appends `run_extended` and projects one `extended` row |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` | Workflow case that keeps the original `sessionId` and generation |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-065
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/extend-completed-research-run.md`
