---
title: "SC-004 Lane Contribution Attribution"
description: "Manual validation that includeAttribution: true returns per-lane contribution metadata and a prompt-safe why_recommended string without leaking prompt content."
trigger_phrases:
  - "sc-004"
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
  - "why_recommended"
version: 0.8.0.16
id: SC-004
category: scorer_fusion
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/scoring/advisor-scorer.md
---

# SC-004 Lane Contribution Attribution

Prompt: Manual validation that includeAttribution: true returns per-lane contribution metadata and a prompt-safe why_recommended string without leaking prompt content.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `includeAttribution: true` returns per-lane `lane`, `rawScore`, `weight`, `weightedScore` and `shadowOnly` metadata plus a prompt-safe `why_recommended` string, and that no prompt text or prompt-derived evidence snippets appear in the attribution output.

---

## 2. SCENARIO CONTRACT

- Repo root. MCP server built.
- Any prompt that routes to a known skill.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred-decisions.md` §F34 for rationale.

1. Call with attribution enabled:

```text
advisor_recommend({"prompt":"review this pull request","options":{"topK":1,"includeAttribution":true}})
```

2. Inspect `laneBreakdown[]` and `why_recommended` for the top recommendation.
3. Call again with `includeAttribution: false` and confirm attribution is absent.
4. Scan attribution JSON for any substring of the input prompt.

### Expected Signals

- With `includeAttribution: true`, each lane entry carries exactly the documented fields: `lane`, `rawScore`, `weight`, `weightedScore`, `shadowOnly`.
- With `includeAttribution: true`, the recommendation includes `why_recommended` as a short prompt-safe explanation that names contribution categories, not raw prompt phrases or tokens.
- `semantic_shadow` reports `shadowOnly: false` (it is a live lane at registry weight 0.05; fusion derives the flag from lane liveness).
- With `includeAttribution: false`, `laneBreakdown` and `why_recommended` are absent or empty.
- No raw prompt substring appears in attribution.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Extra fields in attribution | Evidence snippets or triggers present | Block release. Attribution is contribution-only. |
| Prompt substring in attribution | Grep hits | Block release as privacy failure. |
| `why_recommended` echoes the prompt | User words appear verbatim | Block release as prompt-safety failure. |
| shadowOnly missing from semantic | `semantic_shadow` lacks flag | Audit `attribution.ts` lane tagging. |

### Evidence

Repo root precondition check:

```text
$ pwd
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
```

Advisor status precondition check:

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:35:47.275Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

Call with attribution enabled:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:36:01.495Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:36:01.495Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "advisor_unavailable"
    ],
    "abstainReasons": [
      "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
    ]
  }
}
```

Call with attribution disabled:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:36:10.770Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:36:10.770Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "advisor_unavailable"
    ],
    "abstainReasons": [
      "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
    ]
  }
}
```

Attribution inspection result:

```text
recommendations: []
laneBreakdown: not present because no top recommendation was returned
why_recommended: not present because no top recommendation was returned
raw prompt substring scan target: "review this pull request"
raw prompt substring in attribution: no attribution JSON was returned to scan
```

### Pass/Fail

BLOCKED - The required precondition "Any prompt that routes to a known skill" is missing in the current repo/runtime state because the advisor reports `freshness: "unavailable"`, `reason: "advisor_unavailable"`, and both scenario calls returned `recommendations: []`.

---

## 4. SOURCE FILES

- Scenario [SC-001](../../manual-testing-playbook/scorer-fusion/five-lane-fusion.md), fusion weights sanity.
- Scenario [SC-005](./ablation.md), ablation protocol.
- Feature [`scorer-fusion/attribution.md`](../../feature-catalog/scorer-fusion/attribution.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/attribution.ts`.
- Source: `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: scorer-fusion/lane-attribution.md
