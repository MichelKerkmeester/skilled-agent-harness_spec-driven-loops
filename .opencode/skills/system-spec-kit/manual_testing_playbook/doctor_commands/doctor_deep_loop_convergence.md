---
title: "DOC-333 -- Doctor deep-loop convergence"
description: "Manual scenario validating /doctor deep-loop gold-battery convergence signals for work packets with three or more iterations."
version: 3.6.0.8
id: doctor-commands-doctor-deep-loop-convergence
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

- Target packet path: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph`.
- Direct iteration count command:

```text
$ find .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations -path '*/research/iterations/*.md' | sort | wc -l
      24
```

- Direct iteration file list command:

```text
$ find .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations -path '*/research/iterations/*.md' | sort
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-001.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-002.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-003.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-004.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-005.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-006.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-007.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-008.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-009.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-010.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-011.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-012.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-013.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-014.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-015.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-016.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-017.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-018.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-019.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-020.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-021.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-022.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-023.md
.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/iterations/iteration-024.md
```

- Session mapping from `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/research/findings-registry.json`:

```json
{
  "sessionId": "2026-06-16-028-002-code-graph",
  "parentSessionId": null,
  "lineageMode": "new",
  "generation": 1
}
```

- `/doctor deep-loop --scope=research` route/runtime mapping observed in `.opencode/commands/doctor/_routes.yaml`:

```text
target: deep-loop
yaml: doctor_deep-loop.yaml
setup_vars: [execution_mode, intent, scope]
allowed_flags: ["--scope=research|review|council|both|all"]
mutating: read-only
gate3_location: "n/a (read-only diagnostic; reads coverage + council graphs and iteration folders + ai-council artifacts, never upserts)"
mcp_tools: []
script_invocations:
  - 'node .opencode/skills/system-deep-loop/runtime/scripts/status.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}"'
  - 'node .opencode/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}" --query-type "{query_type}"'
  - 'node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "{loop_type}" --session-id "{session_id}"'
```

- Phase 4 / gold-battery asset check:

```text
$ grep -n "phase_4\|gold_battery\|minimum_iterations\|convergence_signal_required" .opencode/commands/doctor/assets/doctor_deep-loop.yaml
44:    convergence_signal_required: true  # CHK-304 gold-battery signal
45:    minimum_iterations: 3  # existing gold_battery.minimum_iterations
```

- Status script output:

```text
$ node .opencode/skills/system-deep-loop/runtime/scripts/status.cjs --spec-folder .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph --loop-type research --session-id 2026-06-16-028-002-code-graph
{"status":"ok","data":{"namespace":{"specFolder":".opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph","loopType":"research","sessionId":"2026-06-16-028-002-code-graph"},"scopeMode":"session","notes":["Status metrics were computed from the session-scoped subgraph only."],"totalNodes":0,"totalEdges":0,"nodesByKind":{},"edgesByRelation":{},"lastIteration":null,"schemaVersion":4,"dbFileSize":1880064,"signals":null,"momentum":null},"schemaVersion":4,"rowCount":0}
```

- Query script outputs:

```text
$ node .opencode/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph --loop-type research --session-id 2026-06-16-028-002-code-graph --query-type coverage_gaps --limit 50
{"status":"ok","data":{"queryType":"coverage_gaps","namespace":{"specFolder":".opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph","loopType":"research","sessionId":"2026-06-16-028-002-code-graph"},"scopeMode":"session","gaps":[],"totalGaps":0}}

$ node .opencode/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph --loop-type research --session-id 2026-06-16-028-002-code-graph --query-type uncovered_questions --limit 50
{"status":"ok","data":{"queryType":"uncovered_questions","namespace":{"specFolder":".opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph","loopType":"research","sessionId":"2026-06-16-028-002-code-graph"},"scopeMode":"session","gaps":[],"totalGaps":0}}

$ node .opencode/skills/system-deep-loop/runtime/scripts/query.cjs --spec-folder .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph --loop-type research --session-id 2026-06-16-028-002-code-graph --query-type unverified_claims --limit 50
{"status":"ok","data":{"queryType":"unverified_claims","namespace":{"specFolder":".opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph","loopType":"research","sessionId":"2026-06-16-028-002-code-graph"},"scopeMode":"session","claims":[],"totalUnverified":0}}
```

- `deep_loop_graph_convergence(...)` script-equivalent response:

```text
$ node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph --loop-type research --session-id 2026-06-16-028-002-code-graph --iteration 24 --persist-snapshot false
{"status":"ok","data":{"decision":"CONTINUE","reason":"Graph is empty; insufficient data for convergence assessment","scoreDelta":null,"scoreDeltaNote":"no prior snapshot","signals":null,"blockers":[],"trace":[],"namespace":{"specFolder":".opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph","loopType":"research","sessionId":"2026-06-16-028-002-code-graph"},"scopeMode":"session","nodeCount":0,"edgeCount":0},"graph_decision":"CONTINUE","graph_decision_json":"\"CONTINUE\"","graph_signals_json":{},"graph_blockers_json":[],"graph_blockers_csv":"","graph_stop_blocked":false,"graph_trace_json":[],"graph_convergence_score":0,"graph_score_delta":null,"graph_score_delta_json":"null"}
```

- State log: no `gold_battery_pass: true` state log was produced by the read-only script execution. The convergence response had `signals:null`, `graph_signals_json:{}`, `trace:[]`, `nodeCount:0`, and `edgeCount:0`.

### Pass / Fail

- **FAIL**: the target packet has 24 research iterations, but the session-scoped graph is empty (`totalNodes:0`, `totalEdges:0`) and convergence returned `signals:null`, `graph_signals_json:{}`, `trace:[]`, and `graph_convergence_score:0`.

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
- Feature file path: `doctor_commands/doctor_deep_loop_convergence.md`
