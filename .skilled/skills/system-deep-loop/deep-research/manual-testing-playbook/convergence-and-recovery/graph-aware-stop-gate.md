---
title: "DR-033 -- Research graph-aware stop gate surfaces convergence verdict and workflow hooks"
description: "Verify that graph_convergence reducer fields render in registry and dashboard, and that the research workflow runs the convergence script that persists the graph snapshot and computes the whole stop decision."
version: 1.14.1.0
---

# DR-033 -- Research graph-aware stop gate surfaces convergence verdict and workflow hooks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-033`.

---

## 1. OVERVIEW

This scenario validates graph-aware stop-gate surfacing for `DR-033`. The objective is to verify that `graph_convergence` events become reducer-owned `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders those graph signals, and that the live workflow runs convergence.cjs, which persists the graph snapshot and computes the whole stop decision.

### WHY THIS MATTERS

Graph-aware stop logic only protects the loop if two things stay true at the same time: the reducer must surface the graph decision into operator-facing artifacts, and the live workflow must actually run the convergence script that consumes the graph before it decides to stop. If either side drifts, operators can no longer trust the graph-aware stop gate.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Research graph-aware stop gate surfaces convergence verdict and workflow hooks.
- Given: A research packet with one or more `graph_convergence` events in its JSONL state.
- When: The operator runs the reducer and inspects the live workflow definition.
- Then: `findings-registry.json` exposes `graphConvergenceScore`, `graphDecision`, and `graphBlockers`; `deep-research-dashboard.md` renders a `GRAPH CONVERGENCE` section; and `.skilled/commands/deep/assets/deep-research.yaml` runs `step_graph_convergence`, which calls convergence.cjs with `--persist-snapshot` and `--stop-decision`, then branches on the returned stop decision.
- Real user request: How do I know the research reducer is surfacing graph convergence output and that the autonomous workflow actually consults the graph before it decides to stop?
- Prompt: `Validate graph-aware stop gates use reducer graph convergence output before the stop decision.`
- Expected execution process: Run the reducer first to refresh generated artifacts, inspect the reducer-owned registry and dashboard second, then inspect the workflow YAML to verify the convergence step that persists the graph snapshot and computes the stop decision.
- Desired user-visible outcome: The user gets a plain-language explanation that graph signals are visible in reducer outputs and that the workflow consults graph convergence before allowing STOP.
- Expected signals: `graphConvergenceScore`, `graphDecision`, and `graphBlockers` appear in the registry; `GRAPH CONVERGENCE` appears in the dashboard; the YAML runs `step_graph_convergence` with convergence.cjs before the loop reads the stop decision.
- Pass/fail posture: PASS if graph signals appear in the registry and dashboard and the YAML shows convergence.cjs persisting the graph snapshot in the stop path; FAIL if graph data is missing from any reducer surface or the workflow no longer runs the graph-aware convergence step before the stop decision.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Run the reducer first so generated artifacts are fresh before validating graph surfacing.
3. Inspect registry, dashboard, and workflow YAML in that order so reducer outputs are verified before orchestration wiring.
4. Return a short user-facing explanation, not just raw implementation notes.

### Prompt
Validate graph-aware stop gates use reducer graph convergence output before the stop decision.

### Commands
1. `bash: node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs {spec_folder}`
2. `bash: cat {spec_folder}/research/findings-registry.json | jq '.graphConvergenceScore, .graphDecision, .graphBlockers'`
3. `bash: grep -A 3 "GRAPH CONVERGENCE" {spec_folder}/research/deep-research-dashboard.md`
4. `bash: grep -n "step_graph_convergence\|convergence.cjs\|persist-snapshot\|stop-decision" .skilled/commands/deep/assets/deep-research.yaml`

### Expected
Registry surfaces `graphConvergenceScore`, `graphDecision`, and `graphBlockers`; dashboard renders `GRAPH CONVERGENCE`; the workflow runs convergence.cjs with the graph snapshot and stop decision inputs before the loop acts on the result.

### Evidence
Capture the registry graph fields, the dashboard `GRAPH CONVERGENCE` excerpt, and the workflow lines that show `step_graph_convergence` running convergence.cjs with `--persist-snapshot` and `--stop-decision`.

### Pass/Fail
PASS if graph signals appear in the registry and dashboard and the workflow still runs the graph-aware convergence step in the stop path; FAIL if graph data is missing from any reducer surface or the YAML no longer runs convergence.cjs before the stop decision.

### Failure Triage
Privilege reducer-owned registry output for surfaced state and the workflow YAML for live orchestration order. If reducer fields exist but the YAML lacks the convergence step, treat that as graph-aware stop-gate wiring drift rather than a reducer regression.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; surfaces `graphConvergenceScore`, `graphDecision`, `graphBlockers`, and dashboard `GRAPH CONVERGENCE` |
| `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | Research state contract; defines reducer-owned graph convergence fields and dashboard rendering expectations |
| `.skilled/commands/deep/assets/deep-research.yaml` | Live research workflow; runs `step_graph_convergence`, which calls convergence.cjs with `--persist-snapshot` and `--stop-decision` before the loop branches on the result |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-033
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/graph-aware-stop-gate.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
