---
title: "LC-001 Derived-Lane-Only Age Haircut"
description: "Manual validation that age decay is applied only to the derived lane, not to author, lexical, graph_causal or semantic_shadow lanes."
trigger_phrases:
  - "lc-001"
  - "age haircut derived"
  - "age decay"
  - "lifecycle age"
version: 0.8.1.0
id: LC-001
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-001 Derived-Lane-Only Age Haircut

Prompt: Manual validation that age decay is applied only to the derived lane, not to author, lexical, graph_causal or semantic_shadow lanes.


---

## 1. OVERVIEW

Validate that `lib/lifecycle/age-haircut.ts` applies age-based decay only to the derived lane and leaves author, lexical, graph_causal and semantic_shadow lanes unchanged.

---

## 2. SCENARIO CONTRACT

- Repo root with at least one older skill (modification timestamp >30 days) and one recently modified skill.
- Advisor runtime built. Daemon reachable.
- Option flags for `advisor_recommend` include `includeAttribution: true`.

---

## 3. TEST EXECUTION

### Commands

1. Identify one old skill and one recent skill by `stat` on `SKILL.md`.
2. Call `advisor_recommend` with prompts that match each:

```text
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "<prompt matching old skill>" --options '{"includeAttribution":true}' --format json
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "<prompt matching recent skill>" --options '{"includeAttribution":true}' --format json
```

3. For each recommendation, inspect `laneBreakdown` and record the contribution of every lane.
4. Compare derived-lane `weightedScore` versus `rawScore` and check for a visible haircut on the older skill.

### Expected Signals

- Derived lane `weightedScore` for the older skill is lower than `rawScore * weight` by a documented decay factor.
- Author, lexical, graph_causal and semantic_shadow lanes show `weightedScore = rawScore * weight` without additional multiplier.
- Recent-skill derived lane shows no significant decay.
- Overall ordering remains stable as long as non-derived lanes dominate.

### Evidence

- Capture the output and exit status from both advisor_recommend commands.
- Record the selected old and recent skill paths and modification timestamps.
- Capture laneBreakdown values for every lane, including rawScore, weight and weightedScore, the recommendation ordering and the derived-lane decay comparison.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Haircut affects other lanes | Lexical or author `weightedScore` < `rawScore * weight` | Block release. Audit `age-haircut.ts` lane filter. |
| No haircut applied | Old and recent skills show identical decay behavior | Verify mtime probe and decay constants. |
| Recommendation regression | Accuracy regresses on corpus due to over-aggressive haircut | Tune decay parameters and rerun validate. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [LC-002](./supersession.md), supersession redirects.
- Scenario [SC-001](../../manual-testing-playbook/scorer-fusion/five-lane-fusion.md), 5-lane fusion basics.
- Feature [`lifecycle-routing/age-haircut.md`](../../feature-catalog/lifecycle-routing/age-haircut.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-001
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/age-haircut.md
