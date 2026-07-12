---
title: "SC-001 Five-Lane Analytical Fusion"
description: "Manual validation that the 5-lane fusion produces weighted scores using the canonical weights: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05."
trigger_phrases:
  - "sc-001"
  - "five lane fusion"
  - "lane weights canonical"
  - "advisor fusion"
version: 0.8.0.16
---

# SC-001 Five-Lane Analytical Fusion

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/scorer/fusion.ts` combines the five lanes with the canonical weights `explicit_author: 0.42`, `lexical: 0.28`, `graph_causal: 0.13`, `derived_generated: 0.12`, `semantic_shadow: 0.05` and that the weight configuration is discoverable via `advisor_status.laneWeights`.

---

## 2. SCENARIO CONTRACT

- Repo root working directory.
- MCP server built. Daemon reachable.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Call status and capture `laneWeights`:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Call `advisor_recommend` with a prompt that hits multiple lanes and `includeAttribution: true`:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":3,"includeAttribution":true}})
```

3. For the top recommendation, record each lane's `rawScore`, `weight` and `weightedScore`.
4. Verify `weightedScore == rawScore * weight` within floating-point tolerance for each lane.
5. Sum all `weightedScore` values and compare to the reported aggregate score.

### Expected Signals

- `advisor_status.laneWeights` equals the canonical configuration above.
- `semantic_shadow.weight == 0.05` in envelopes that expose current lane weights.
- For every lane, `weightedScore` matches `rawScore * weight` within `1e-9` tolerance.
- Aggregate score equals the sum of lane `weightedScore` values (or matches the documented fusion formula).

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Lane weights off-canonical | `laneWeights` does not match the canonical set | Inspect `lib/scorer/weights-config.ts`. |
| Semantic shadow has non-zero weight | Response shows `semantic_shadow.weight > 0` | Block release. Semantic lock violated (see PG-005). |
| Fusion arithmetic mismatch | `weightedScore != rawScore * weight` | Audit `lib/scorer/fusion.ts`. |

---

## 4. SOURCE FILES

- Scenario [SC-004](../scorer_fusion/lane_attribution.md), lane attribution metadata.
- Feature [`scorer-fusion/five-lane-fusion.md`](../../feature_catalog/scorer_fusion/five_lane_fusion.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` and `lib/scorer/weights-config.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: scorer-fusion/five-lane-fusion.md
