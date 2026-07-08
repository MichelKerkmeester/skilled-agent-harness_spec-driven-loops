---
title: "Depth detection parallel vs sequential"
description: "Verify Depth 0 versus Depth 1 dispatch detection and confirm sequential_thinking inline mode is selected for an explicit Depth: 1 marker."
trigger_phrases:
  - "depth detection parallel vs sequential"
  - "sequential_thinking inline mode"
  - "detect nested council depth"
  - "NDP compliance dispatch"
  - "depth 0 vs depth 1 council"
version: 2.3.0.9
---

# Depth detection parallel vs sequential

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify Depth 0 versus Depth 1 dispatch detection and confirm sequential_thinking inline mode is selected for an explicit Depth: 1 marker.

Council dispatch must preserve NDP compliance. A council called from another agent should deliberate inline rather than recursively dispatching more agents.

Operators use this feature when the real request is: Check whether a nested council call chooses sequential mode.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-014.

Current behavior is grounded in `.opencode/agents/ai-council.md`, which the scenario identifies as authoritative depth 0 and depth 1 source. Validation is anchored by `manual_testing_playbook/06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify Depth 0 versus Depth 1 dispatch detection and confirm sequential_thinking inline mode is selected for an explicit Depth: 1 marker. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative Depth 0 and Depth 1 source |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md` | Reference | Reference mirror for operator use |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Depth And Failure Handling
- Feature ID: DAC-014
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md`
- Playbook scenario: `manual_testing_playbook/06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md`
Related references:
- [resume-after-interrupted-state.md](resume-after-interrupted-state.md) — Resume after interrupted state
