---
title: "009 runtime/ convergence yaml fire"
description: "Verify deep-loop command YAML contains live convergence calls before stop voting."
trigger_phrases:
  - "009"
  - "deep loop graph convergence yaml fire"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.8
---
# 009 runtime/ convergence yaml fire

## 1. OVERVIEW

Verify deep-loop command YAML contains live convergence calls before stop voting.

---

## 2. SCENARIO CONTRACT

- Objective: Verify deep-loop command YAML contains live convergence calls before stop voting.
- Real user request: `Review the deep-research and deep-review auto YAML to confirm graph convergence is called before stop voting.`
- Operator prompt: `Inspect the deep-research and deep-review auto YAML convergence paths. Show that graph convergence runs before stop voting, then return PASS/FAIL with file anchors and evidence excerpts.`
- Expected execution process: Inspect `step_graph_convergence` in the deep-research and deep-review YAML files, then optionally run a minimal deep-loop fixture and capture a graph convergence JSONL event.
- Expected signals: YAML calls `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic and appends a graph convergence event.
- Desired user-visible outcome: A concise verdict explaining whether deep-loop stop voting is guarded by live graph convergence checks.
- Pass/fail: PASS if both YAML paths call graph convergence before stop logic and event evidence is present when run. FAIL if the call is missing, occurs after stop voting or no convergence event can be observed in the fixture.

---

## 3. TEST EXECUTION

### Commands

1. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` `step_graph_convergence`.
2. Inspect `.opencode/commands/deep/assets/deep_review_auto.yaml` `step_graph_convergence`.
3. Optionally run a minimal deep-loop fixture and capture graph_convergence JSONL event.

### Expected Output / Verification

YAML calls `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic and appends a graph convergence event.

### Cleanup

None.

### Variant Scenarios

Check confirm-mode YAML paths for parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 009
- Canonical root source: `manual_testing_playbook.md`

---

## 6. EVIDENCE

Command 1: Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` `step_graph_convergence`.

```text
`step_graph_convergence` invokes `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` before the research stop vote.
```

Command 2: Inspect `.opencode/commands/deep/assets/deep_review_auto.yaml` `step_graph_convergence`.

```text
`step_graph_convergence` invokes `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` before the review stop vote.
```

Command 3: Optionally run a minimal deep-loop fixture and capture graph_convergence JSONL event.

```text
Not run. The fixture step is optional in this scenario, and the session write constraint allows modifying only .opencode/skills/system-code-graph/manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md.
```

---

## 7. PASS/FAIL

PASS

An earlier capture cited YAML line ranges that have since drifted. The stable `step_graph_convergence` anchors in both deep auto YAML workflows call `node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic, so the convergence guard is present as intended.
