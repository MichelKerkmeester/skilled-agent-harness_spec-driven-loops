---
title: "010 deep_loop_graph_upsert conditional"
description: "Verify deep-loop graph upsert runs only when graphEvents exist."
trigger_phrases:
  - "010"
  - "deep loop graph upsert conditional"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 010 deep_loop_graph_upsert conditional

## 1. OVERVIEW

Verify deep-loop graph upsert runs only when graphEvents exist.

---

## 2. SCENARIO CONTRACT

- Objective: Verify deep-loop graph upsert runs only when graphEvents exist.
- Real user request: `Inspect deep-loop graph upsert behavior and confirm it only fires when graphEvents are present.`
- Operator prompt: `Inspect the deep-loop graph upsert paths in research and review YAML. Show that upsert runs only when graphEvents exist, then return PASS/FAIL with anchors and fixture evidence.`
- Expected execution process: Read the research and review `step_graph_upsert` line ranges, then run or inspect fixtures with and without `graphEvents`.
- Expected signals: With graphEvents, upsert parameters are built and the MCP call is present. Without graphEvents, workflow proceeds without upsert.
- Desired user-visible outcome: A concise verdict explaining whether graph upsert is correctly conditional.
- Pass/fail: PASS if upsert fires only for graphEvents and skips cleanly without them. FAIL if upsert is unconditional, missing when graphEvents exist or blocks the workflow when no graphEvents exist.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:817-836`.
2. Read `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:841-863`.
3. Run or inspect a fixture with and without `graphEvents`.

### Expected Output / Verification

With graphEvents, upsert parameters are built and the MCP call is present. Without graphEvents, workflow proceeds without upsert.

### Cleanup

Remove disposable research/review fixture folders if created.

### Variant Scenarios

Run direct `deep_loop_graph_status` before and after an upsert fixture.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 010
- Canonical root source: `manual_testing_playbook.md`
