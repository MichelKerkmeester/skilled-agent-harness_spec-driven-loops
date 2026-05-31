---
title: "SC-004 Lane Contribution Attribution"
description: "Manual validation that includeAttribution: true returns per-lane contribution metadata (lane, rawScore, weight, weightedScore, shadowOnly) without leaking prompt content."
trigger_phrases:
  - "sc-004"
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
---

# SC-004 Lane Contribution Attribution

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `includeAttribution: true` returns per-lane `lane`, `rawScore`, `weight`, `weightedScore` and `shadowOnly` metadata via `lib/scorer/attribution.ts` and that no prompt text or prompt-derived evidence snippets appear in the attribution output.

---

## 2. SCENARIO CONTRACT

- Repo root. MCP server built.
- Any prompt that routes to a known skill.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Call with attribution enabled:

```text
advisor_recommend({"prompt":"review this pull request","options":{"topK":1,"includeAttribution":true}})
```

2. Inspect `laneBreakdown[]` for the top recommendation.
3. Call again with `includeAttribution: false` and confirm attribution is absent.
4. Scan attribution JSON for any substring of the input prompt.

### Expected Signals

- With `includeAttribution: true`, each lane entry carries exactly the documented fields: `lane`, `rawScore`, `weight`, `weightedScore`, `shadowOnly`.
- `semantic_shadow` reports `shadowOnly: false` (it is a live lane at registry weight 0.05; fusion derives the flag from lane liveness).
- With `includeAttribution: false`, `laneBreakdown` is absent or empty.
- No raw prompt substring appears in attribution.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Extra fields in attribution | Evidence snippets or triggers present | Block release. Attribution is contribution-only. |
| Prompt substring in attribution | Grep hits | Block release as privacy failure. |
| shadowOnly missing from semantic | `semantic_shadow` lacks flag | Audit `attribution.ts` lane tagging. |

---

## 4. SOURCE FILES

- Scenario [SC-001](./001-five-lane-fusion.md), fusion weights sanity.
- Scenario [SC-005](./005-ablation.md), ablation protocol.
- Feature [`04--scorer-fusion/022-attribution.md`](../../feature_catalog/04--scorer-fusion/022-attribution.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 08--scorer-fusion/004-lane-attribution.md
