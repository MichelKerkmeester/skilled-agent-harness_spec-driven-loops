---
title: "DR-078 -- Live extension of a finished expansive research run"
description: "This scenario validates `--extend=1` on the live expansive run from `DR-077` for `DR-078`. It focuses on reusing the finished run, the single extended ledger row and the synthesis snapshot without a fresh session."
version: 1.0.0.0
---

# DR-078 -- Live extension of a finished expansive research run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-078`.

---

## 1. OVERVIEW

This scenario validates one-iteration extension of the finished run from `DR-077` for `DR-078`. It focuses on reusing that packet instead of paying for a new run, keeping the session and generation, recording one `run_extended` event and snapshotting the prior synthesis.

### Why This Matters

A second live expansive run costs another three iterations and another frontier seed to learn one more thing. Extending the finished run costs one iteration, keeps the frontier the operator already inspected, and leaves an auditable record of what changed. A reset session or a second extension event would make the added work impossible to separate from the original run.

---

## 2. SCENARIO CONTRACT

Operators run this against the completed `DR-077` fixture spec folder, not a fresh one. The scenario is complete when the operator can say which session continued, how many iterations were added and where the prior synthesis went.

- Objective: Verify that `--extend=1` on the completed expansive research run adds exactly one iteration in the same session and generation, writes one `extended` row, snapshots the prior synthesis and leaves both frontier nodes in place.
- Real user request: The small expansive run at three iterations already answered most of the question. Give that same run one more iteration without starting over.
- Prompt: `Extend the completed expansive deep-research run from DR-077 in its fixture spec folder by one iteration with --extend=1, then confirm the same session and generation, the single extended event, the synthesis snapshot, the two frontier nodes and one more iteration file.`
- Expected execution process: Read the iteration count, the config and the node store first, run the research command with `--extend=1` and no other loop flag against that spec folder, then reread the same files after synthesis.
- Expected signals: Exactly one `extended` row appears in `research/deep-research-state.jsonl` and no `resumed` row is added; the config keeps the original `sessionId` and generation 1 with `maxIterations` 4 and `lineageMode` `completed-continue`; one `research/synthesis-v1-r3.md` snapshot exists; `research/iterations/` gains exactly one file; the node store still holds the same two depth-1 ids.
- Desired user-visible outcome: The operator is told the same run gained one iteration, the prior synthesis is kept as a snapshot, and the frontier is unchanged.
- Pass/fail: PASS if the event count, session, generation, cap, snapshot, iteration delta and node ids all match; FAIL if any one differs, including a second `extended` row or a reseeded frontier.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Extend the completed expansive deep-research run from DR-077 in its fixture spec folder by one iteration with --extend=1, then confirm the same session and generation, the single extended event, the synthesis snapshot, the two frontier nodes and one more iteration file.`

### Commands

1. `jq '{maxIterations, sessionId: .lineage.sessionId, generation: .lineage.generation, lineageMode: .lineage.lineageMode}' <fixture>/research/deep-research-config.json`
2. `find <fixture>/research/iterations -name 'iteration-*.md' | wc -l`
3. `jq -s '[.[] | select(.depth == 1) | .nodeId] | unique | sort' <fixture>/research/frontier-nodes.jsonl`
4. `/deep:research "Which events does the deep-research reducer project from the ledger?" :auto --spec-folder=<fixture> --extend=1`
5. `rg -c '"event":"extended"' <fixture>/research/deep-research-state.jsonl`
6. `jq '{maxIterations, sessionId: .lineage.sessionId, generation: .lineage.generation, lineageMode: .lineage.lineageMode, continuedFromRun: .lineage.continuedFromRun}' <fixture>/research/deep-research-config.json`
7. `find <fixture> -name 'synthesis-v*-r*.md'`
8. `find <fixture>/research/iterations -name 'iteration-*.md' | wc -l`
9. `jq -s '[.[] | select(.depth == 1) | .nodeId] | unique | sort' <fixture>/research/frontier-nodes.jsonl`
10. `rg -c '"event":"resumed"' <fixture>/research/deep-research-state.jsonl || true`

The executor note: the completion is one native iteration, so no `--executor` flag is needed. An operator who adds a CLI executor would hit the cli-opencode self-invocation guard when driving from OpenCode; use the default native executor with the session model set to `opencode-go/deepseek-v4.1-flash#max`.

### Expected

Before the run, command 1 shows `maxIterations` 3 and generation 1, command 2 prints `3` and command 3 prints the two node ids. Command 4 adds one iteration; because `DR-077` was created with `--convergence-mode=off`, the extension inherits that mode and cannot stop before the new cap. After it finishes, command 5 prints `1`, command 6 shows the same `sessionId`, generation 1, `maxIterations` 4, `lineageMode` `completed-continue` and `continuedFromRun` 3, command 7 lists `synthesis-v1-r3.md`, command 8 prints `4`, command 9 prints the same two ids, and command 10 prints nothing and exits 1 because no `resumed` row exists.

### Evidence

Capture the command 1 to 3 outputs before the run, the command 4 start and finish lines, and the command 5 to 10 outputs after it.

### Pass / Fail

- **Pass**: One `extended` row, no `resumed` row, the same session and generation, `maxIterations` 4, `completed-continue`, one synthesis snapshot, four iteration files and the same two node ids.
- **Fail**: A second `extended` row, a new session or generation, a different cap, no snapshot, an iteration count other than four, or a changed frontier.

### Failure Triage

Check the state log first. A missing `extended` row with a correct config means the extension step did not run, while a correct row with the wrong iteration count points at the classifier landing on resume instead of completed-continue. A changed node store means the run reseeded instead of continuing.

### Optional Supplemental Checks

- Run the same command on a run that is still in progress and confirm it refuses because the run is not complete.
- Run it with `--extend=0` and confirm the usage error names the flag before any state write.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `live-expansive-research-two-node-frontier.md` | The finished run this scenario extends (`DR-077`) |
| `extend-completed-research-run.md` | The default-mode extension contract for the same flag |
| `../../feature-catalog/loop-lifecycle/completed-run-extension.md` | Feature-catalog entry for completed-run extension |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | Extension step, synthesis snapshot and classifier override |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` | Session, generation and cap cases for extension |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts` | `run_extended` row projection |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-078
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/live-extend-expansive-research-run.md`
