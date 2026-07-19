---
title: "SC-002 Registry Projection Drift Guard and workflowMode Publication"
description: "Manual validation that scorer projection stays prompt-safe while generated deep-loop routing projection, hash freshness and workflowMode publication remain aligned."
trigger_phrases:
  - "sc-002"
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph projection"
version: 0.8.0.16
id: SC-002
category: scorer_fusion
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/scoring/advisor-scorer.md
---

# SC-002 Registry Projection Drift Guard and workflowMode Publication

Prompt: Manual validation that scorer projection stays prompt-safe while generated deep-loop routing projection, hash freshness and workflowMode publication remain aligned.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/scorer/projection.ts` projects `skill_nodes` and `skill_edges` into the scoring shape required by lanes such as `graph_causal`, and that generated deep-loop routing projection stays fresh enough for `advisor_recommend` to publish the resolved `workflowMode`.

---

## 2. SCENARIO CONTRACT

- Read-only inspection against the live repo or disposable copy.
- MCP server built. Daemon reachable.
- Access to runtime diagnostics where projection output can be observed (for example via `advisor_validate` slices or internal test harness).
- Deep-loop mode registry and generated projection constants are present.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred-decisions.md` §F34 for rationale.

1. Trigger a recommend call that exercises the graph_causal lane:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"includeAttribution":true}})
```

2. In the response, inspect the lane attribution: laneBreakdown entries expose exactly lane, rawScore, weightedScore, weight, and shadowOnly (the strict schema; projected node ids and edge types are not part of the shipped response).
3. Search the projected output for any fragment of the input prompt.
4. Run the routing drift guard:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- routing-registry-drift-guard.vitest.ts
```

5. Trigger a generated deep-loop alias and verify `workflowMode` appears:

```text
advisor_recommend({"prompt":"run a deep review loop","options":{"includeAttribution":true}})
```

6. Run `advisor_validate` and inspect the parity slice against Python fallback to confirm projection consistency.

### Expected Signals

- Lane attribution exposes only the documented laneBreakdown fields (lane, rawScore, weightedScore, weight, shadowOnly).
- No substring of the input prompt appears in projection metadata.
- The laneBreakdown is bounded and consistent across equivalent calls.
- Drift guard accepts the embedded TypeScript and Python projection hashes.
- Deep-loop alias recommendations include the resolved `workflowMode` when a generated mode applies.
- Parity slice in `advisor_validate` shows zero regressions on Python-correct prompts.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Prompt fragment in projection | Grep for prompt substring hits | Block release as privacy failure. |
| Unbounded projection | Graph_causal attribution grows with prompt length | Inspect traversal bounds in `mcp-server/lib/scorer/lanes/graph-causal.ts`; `projection.ts` only clamps stored edge weights. |
| Stale generated projection | Drift guard hash mismatch | Run `skill_advisor.py --emit-routing-projection` after confirming the mode registry is correct. |
| Missing workflowMode | Deep-loop alias response lacks field | Inspect `lib/scorer/aliases.ts`, `handlers/advisor-recommend.ts`, and `schemas/advisor-tool-schemas.ts`. |
| Parity regression | Python-correct cases now fail | Audit projection logic for divergence from Python expectation. |

---

## 4. SOURCE FILES

- Scenario [SC-001](../../manual-testing-playbook/scorer-fusion/five-lane-fusion.md), fusion weights.
- Scenario [NC-003](../../manual-testing-playbook/native-mcp-tools/native-validate-slices.md), validate slices.
- Feature [`scorer-fusion/projection.md`](../../feature-catalog/scorer-fusion/projection.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts`.
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts`.
- Source: `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts`.
- Test: `.opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: scorer-fusion/projection.md
