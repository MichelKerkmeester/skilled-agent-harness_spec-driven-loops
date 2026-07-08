---
title: "LC-001 Derived-Lane-Only Age Haircut"
description: "Manual validation that age decay is applied only to the derived lane, not to author, lexical, graph_causal or semantic_shadow lanes."
trigger_phrases:
  - "lc-001"
  - "age haircut derived"
  - "age decay"
  - "lifecycle age"
version: 0.8.0.14
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

- Scenario [LC-002](./supersession.md), supersession redirects.
- Scenario [SC-001](../08--scorer-fusion/five-lane-fusion.md), 5-lane fusion basics.
- Feature [`03--lifecycle-routing/age-haircut.md`](../../feature_catalog/03--lifecycle-routing/age-haircut.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/age-haircut.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/age-haircut.md

---

## 6. EVIDENCE

### `stat` on `SKILL.md`

```text
2026-06-30T13:36:50+0200 .opencode/skills/sk-git/SKILL.md
2026-07-01T18:33:45+0200 .opencode/skills/cli-opencode/SKILL.md
2026-06-27T18:06:29+0200 .opencode/skills/sk-design/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/mcp-open-design/SKILL.md
2026-05-31T11:45:37+0200 .opencode/skills/mcp-click-up/SKILL.md
2026-06-30T11:10:00+0200 .opencode/skills/sk-doc/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/system-code-graph/SKILL.md
2026-06-15T20:16:53+0200 .opencode/skills/sk-code/SKILL.md
2026-07-01T18:28:00+0200 .opencode/skills/system-deep-loop/runtime/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/system-skill-advisor/SKILL.md
2026-06-28T11:41:18+0200 .opencode/skills/system-deep-loop/SKILL.md
2026-06-23T11:12:57+0200 .opencode/skills/mcp-code-mode/SKILL.md
2026-06-28T16:12:27+0200 .opencode/skills/sk-prompt-models/SKILL.md
2026-06-26T11:22:22+0200 .opencode/skills/mcp-figma/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/sk-code/code-review/SKILL.md
2026-07-01T15:35:15+0200 .opencode/skills/system-spec-kit/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/sk-prompt/SKILL.md
2026-06-30T13:36:50+0200 .opencode/skills/cli-claude-code/SKILL.md
2026-06-23T11:12:57+0200 .opencode/skills/mcp-chrome-devtools/SKILL.md
```

Selected older skill: `.opencode/skills/mcp-click-up/SKILL.md` (`2026-05-31T11:45:37+0200`).

Selected recent skill: `.opencode/skills/cli-opencode/SKILL.md` (`2026-07-01T18:33:45+0200`).

### `advisor_recommend` for older skill prompt

Prompt: `ClickUp daily ops get teams route official MCP docs goals bulk cupt CLI`

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0,
      "uncertaintyThreshold": 1,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:27:30.204Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:27:30.204Z",
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

### `advisor_recommend` for recent skill prompt

Prompt: `OpenCode CLI orchestrator external dispatch in-OpenCode parallel sessions cross-AI handback full runtime context`

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0,
      "uncertaintyThreshold": 1,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:27:30.368Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:27:30.368Z",
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

### `advisor_status`

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
      "checkedAt": "2026-07-03T02:27:39.245Z",
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

---

## 7. PASS/FAIL

BLOCKED: The scenario contract requires a reachable daemon, but `advisor_recommend` returned `freshness: "unavailable"` with `warnings: ["advisor_unavailable"]`, and `advisor_status` returned `trustState.reason: "SIGTERM"`; no recommendations or `laneBreakdown` values were available to compare against Expected Signals.
