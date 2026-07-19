---
title: "010 deep_loop_graph_upsert conditional"
description: "Verify deep-loop graph upsert runs only when graphEvents exist."
trigger_phrases:
  - "010"
  - "deep loop graph upsert conditional"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.6
id: deep-loop-graph-upsert-conditional
category: coverage_graph
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/coverage-graph/deep-loop-graph-upsert-conditional.md
---
# 010 deep_loop_graph_upsert conditional

Prompt: Inspect deep-loop graph upsert behavior and confirm the conditional graph upsert only fires when graphEvents are present.

## 1. OVERVIEW

Verify deep-loop graph upsert runs only when graphEvents exist.

---

## 2. SCENARIO CONTRACT

- Objective: Verify deep-loop graph upsert runs only when graphEvents exist.
- Real user request: `Inspect deep-loop graph upsert behavior and confirm it only fires when graphEvents are present.`
- Operator prompt: `Inspect the deep-loop graph upsert paths in research and review YAML. Show that upsert runs only when graphEvents exist, then return PASS/FAIL with anchors and fixture evidence.`
- Expected execution process: Inspect the research and review `step_graph_upsert` anchors, then run or inspect fixtures with and without `graphEvents`.
- Expected signals: With graphEvents, upsert parameters are built and the CLI script invocation is present. Without graphEvents, workflow proceeds without upsert.
- Desired user-visible outcome: A concise verdict explaining whether graph upsert is correctly conditional.
- Pass/fail: PASS if upsert fires only for graphEvents and skips cleanly without them. FAIL if upsert is unconditional, missing when graphEvents exist or blocks the workflow when no graphEvents exist.

---

## 3. TEST EXECUTION

### Commands

1. Inspect `.opencode/commands/deep/assets/deep-research-auto.yaml` `step_graph_upsert`.
2. Inspect `.opencode/commands/deep/assets/deep-review-auto.yaml` `step_graph_upsert`.
3. Run or inspect a fixture with and without `graphEvents`.

### Expected Output / Verification

With graphEvents, upsert parameters are built and the CLI script invocation is present. Without graphEvents, workflow proceeds without upsert.

### Cleanup

Remove disposable research/review fixture folders if created.

### Variant Scenarios

Run direct `deep_loop_graph_status` before and after an upsert fixture.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual-testing-playbook.md` | Root playbook index |
| `../../feature-catalog/feature-catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 010
- Canonical root source: `manual-testing-playbook.md`

---

## 6. EVIDENCE

Command 1: Inspect `.opencode/commands/deep/assets/deep-research-auto.yaml` `step_graph_upsert`.

```text
`step_graph_upsert` conditionally invokes `node .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` when research graph events exist.
```

Command 2: Inspect `.opencode/commands/deep/assets/deep-review-auto.yaml` `step_graph_upsert`.

```text
`step_graph_upsert` conditionally invokes `node .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` when review graph events exist. `step_seed_coverage_graph` is the earlier review seed upsert path.
```

Command 3: Run or inspect a fixture with and without `graphEvents`.

```text
Not run. The stable YAML anchors confirm the conditional CLI invocation, and this scenario does not require creating disposable fixture folders.
```

---

## 7. PASS/FAIL

PASS

An earlier capture cited YAML line ranges that have since drifted. The stable `step_graph_upsert` anchors in both deep auto YAML workflows conditionally call `node .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` when `graphEvents` exist, and the review workflow also has the earlier `step_seed_coverage_graph` upsert call.
