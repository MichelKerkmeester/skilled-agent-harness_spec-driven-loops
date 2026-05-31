---
title: "LC-001 Derived-Lane-Only Age Haircut"
description: "Manual validation that age decay is applied only to the derived lane, not to author, lexical, graph_causal or semantic_shadow lanes."
trigger_phrases:
  - "lc-001"
  - "age haircut derived"
  - "age decay"
  - "lifecycle age"
---

# LC-001 Derived-Lane-Only Age Haircut

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/lifecycle/age-haircut.ts` applies age-based decay only to the derived lane and leaves author, lexical, graph_causal and semantic_shadow lanes unchanged.

---

## 2. SCENARIO CONTRACT

- Repo root with at least one older skill (modification timestamp >30 days) and one recently modified skill.
- MCP server built. Daemon reachable.
- Option flags for `advisor_recommend` include `includeAttribution: true`.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Identify one old skill and one recent skill by `stat` on `SKILL.md`.
2. Call `advisor_recommend` with prompts that match each:

```text
advisor_recommend({"prompt":"<prompt matching old skill>","options":{"includeAttribution":true}})
advisor_recommend({"prompt":"<prompt matching recent skill>","options":{"includeAttribution":true}})
```

3. For each recommendation, inspect `laneBreakdown` and record the contribution of every lane.
4. Compare derived-lane `weightedScore` versus `rawScore` and check for a visible haircut on the older skill.

### Expected Signals

- Derived lane `weightedScore` for the older skill is lower than `rawScore * weight` by a documented decay factor.
- Author, lexical, graph_causal and semantic_shadow lanes show `weightedScore = rawScore * weight` without additional multiplier.
- Recent-skill derived lane shows no significant decay.
- Overall ordering remains stable as long as non-derived lanes dominate.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Haircut affects other lanes | Lexical or author `weightedScore` < `rawScore * weight` | Block release. Audit `age-haircut.ts` lane filter. |
| No haircut applied | Old and recent skills show identical decay behavior | Verify mtime probe and decay constants. |
| Recommendation regression | Accuracy regresses on corpus due to over-aggressive haircut | Tune decay parameters and rerun validate. |

---

## 4. SOURCE FILES

- Scenario [LC-002](./002-supersession.md), supersession redirects.
- Scenario [SC-001](../08--scorer-fusion/001-five-lane-fusion.md), 5-lane fusion basics.
- Feature [`03--lifecycle-routing/014-age-haircut.md`](../../feature_catalog/03--lifecycle-routing/014-age-haircut.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/age-haircut.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/001-age-haircut.md
