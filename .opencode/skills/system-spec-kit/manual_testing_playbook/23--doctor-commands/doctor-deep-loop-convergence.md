---
title: "DOC-333 -- Doctor deep-loop convergence"
description: "Manual scenario validating /doctor deep-loop gold-battery convergence signals for work packets with three or more iterations."
version: 3.6.0.8
---

# DOC-333 -- Doctor deep-loop convergence

## 1. OVERVIEW

This scenario validates the `/doctor deep-loop` post-rebuild gold battery. Any rebuilt work packet with at least three research or review iterations must produce a non-empty `deep_loop_graph_convergence` signal.

The test uses a known three-iteration work packet as the target. It proves the rebuilt coverage graph is not merely populated; it is rich enough to answer convergence questions with scores, answered questions, and supported claims.

---

## 2. SCENARIO CONTRACT

- Objective: Verify post-rebuild convergence signal for a work packet with three or more iterations.
- Playbook ID: DOC-333.
- Real user request: `Verify deep-loop convergence signal works on a work packet with 3 iterations.`
- Prompt: `Verify deep-loop convergence signal works on a work packet with 3 iterations.`
- Preconditions: `deep-loop-graph.sqlite` is populated or rebuildable, and `<spec-folder>` has at least three deep-loop iteration markdown files.
- Expected execution process: Confirm the target has at least three iterations, run `/doctor deep-loop --scope=research`, then call `deep_loop_graph_convergence` for the target and latest iteration.
- Expected signals: Phase 4 gold battery runs; convergence response includes `convergence_score` or equivalent non-empty score plus signal artifacts such as answered questions, supported claims, blockers, or trace payload.
- Desired user-visible outcome: A concise pass/fail verdict citing the convergence score and the non-empty signal fields.
- Pass/fail: PASS if the convergence response is non-empty for the target packet after rebuild.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Verify deep-loop convergence signal works on a work packet with 3 iterations.
```

### Commands

1. In a disposable workspace, confirm the target work packet exists.
2. Count source iterations for the target:
   - `find <spec-folder> -path '*/research/iterations/*.md' | sort`
3. Confirm at least three iteration files are present.
4. Run `/doctor deep-loop --scope=research` through the real runtime.
5. Capture the Phase 4 gold-battery summary from `.opencode/commands/doctor/assets/doctor_deep-loop.yaml`.
6. Call `deep_loop_graph_convergence({specFolder: "<spec-folder>", loopType: "research", iteration: <latest_iteration>, persistSnapshot: false})`.
7. Capture the full convergence response and final state-log path.

### Expected

The apply workflow rebuilds or verifies the graph, then Phase 4 runs the gold battery for packets with at least three iterations. The target packet's convergence call returns a non-empty response containing a score and signal evidence.

Acceptable signal evidence includes answered questions, supported claims, verification coverage, blockers, or typed trace artifacts. An empty object, null score, or empty signal array for the three-iteration packet fails the scenario.

### Evidence

- Target packet path and iteration file count.
- `/doctor deep-loop --scope=research` transcript.
- Phase 4 gold-battery output showing the target packet was included or explaining the packet/session mapping used.
- `deep_loop_graph_convergence(...)` response with `convergence_score` or equivalent score.
- Non-empty signal artifacts such as questions answered, claims supported, verification coverage, blockers, or trace data.
- State log showing `gold_battery_pass: true`.

### Pass / Fail

- **PASS**: the target packet has at least three iterations, mutation flow completes, and convergence returns a non-empty score plus signal artifacts.
- **FAIL**: the gold battery omits a qualifying packet, convergence returns empty for the target, or mutation flow reports success despite an empty convergence signal.
- **SKIP**: the target packet is absent or has fewer than three iterations in the sandbox.
- **UNAUTOMATABLE**: the runtime cannot execute `/doctor deep-loop` or expose `deep_loop_graph_convergence`.

### Failure Triage

If the convergence call is empty, inspect the state log's inferred `sessionId` and latest iteration mapping. If the packet was not included in the gold battery, inspect `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` Phase 1 candidate selection and Phase 4 `minimum_iterations` handling. If graph rows exist but claims are unsupported, query the packet with `deep_loop_graph_query` and compare nodes against the source iteration markdown.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_deep-loop.yaml](../../../../commands/doctor/assets/doctor_deep-loop.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-333
- Feature name: Doctor deep-loop convergence
- Command mode: `/doctor deep-loop --scope=research`
- YAML asset: `doctor_deep-loop.yaml`
- Gold battery: non-empty convergence signal for work packets with at least three iterations.
- Target: work packet with at least three research iterations
- Feature file path: `23--doctor-commands/doctor-deep-loop-convergence.md`
