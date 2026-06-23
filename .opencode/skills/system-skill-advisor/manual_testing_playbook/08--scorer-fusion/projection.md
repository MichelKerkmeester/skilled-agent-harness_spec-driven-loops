---
title: "SC-002 Projection of Skill Nodes and Edges"
description: "Manual validation that lib/scorer/projection.ts projects skill_nodes and skill_edges into scoring shape without leaking raw graph text or prompt content."
trigger_phrases:
  - "sc-002"
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph projection"
version: 0.8.0.16
---

# SC-002 Projection of Skill Nodes and Edges

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/scorer/projection.ts` projects `skill_nodes` and `skill_edges` into the scoring shape required by lanes such as `graph_causal` and that the projection path never leaks prompt text into node or edge metadata.

---

## 2. SCENARIO CONTRACT

- Read-only inspection against the live repo or disposable copy.
- MCP server built. Daemon reachable.
- Access to runtime diagnostics where projection output can be observed (for example via `advisor_validate` slices or internal test harness).

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Trigger a recommend call that exercises the graph_causal lane:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"includeAttribution":true}})
```

2. In the response, inspect the lane attribution: laneBreakdown entries expose exactly lane, rawScore, weightedScore, weight, and shadowOnly (the strict schema; projected node ids and edge types are not part of the shipped response).
3. Search the projected output for any fragment of the input prompt.
4. Run `advisor_validate` and inspect the parity slice against Python fallback to confirm projection consistency.

### Expected Signals

- Lane attribution exposes only the documented laneBreakdown fields (lane, rawScore, weightedScore, weight, shadowOnly).
- No substring of the input prompt appears in projection metadata.
- The laneBreakdown is bounded and consistent across equivalent calls.
- Parity slice in `advisor_validate` shows zero regressions on Python-correct prompts.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Prompt fragment in projection | Grep for prompt substring hits | Block release as privacy failure. |
| Unbounded projection | Graph_causal attribution grows with prompt length | Inspect traversal bounds in `mcp_server/lib/scorer/lanes/graph-causal.ts`; `projection.ts` only clamps stored edge weights. |
| Parity regression | Python-correct cases now fail | Audit projection logic for divergence from Python expectation. |

---

## 4. SOURCE FILES

- Scenario [SC-001](./five-lane-fusion.md), fusion weights.
- Scenario [NC-003](../01--native-mcp-tools/native-validate-slices.md), validate slices.
- Feature [`04--scorer-fusion/projection.md`](../../feature_catalog/04--scorer-fusion/projection.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 08--scorer-fusion/projection.md
