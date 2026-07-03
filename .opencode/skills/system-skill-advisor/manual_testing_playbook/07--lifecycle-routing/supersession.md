---
title: "LC-002 Asymmetric Supersession Redirects"
description: "Manual validation that supersession metadata in lib/lifecycle/supersession.ts applies asymmetric routing with redirect_from and redirect_to and that superseded skills forward correctly."
trigger_phrases:
  - "lc-002"
  - "supersession"
  - "redirect_from redirect_to"
  - "asymmetric routing"
version: 0.8.0.14
---

# LC-002 Asymmetric Supersession Redirects

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/lifecycle/supersession.ts` implements asymmetric routing: a superseded skill redirects queries forward via `redirect_to` and the successor exposes `redirect_from` metadata without overriding the successor's own recommendations.

---

## 2. SCENARIO CONTRACT

- A workspace containing a known superseded-successor pair in skill metadata (or a disposable copy with a synthetic pair).
- MCP server built. Daemon reachable.
- `includeAttribution: true` and `topK >= 2` on recommendation calls.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Identify the superseded-successor pair from `graph-metadata.json` supersession fields.
2. Call `advisor_recommend` with a prompt that historically mapped to the superseded skill:

```text
advisor_recommend({"prompt":"<prompt mapping to superseded skill>","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect the response for redirect metadata.
4. Call `advisor_recommend` with a prompt matching the successor and inspect metadata.

### Expected Signals

- Superseded skill is no longer the top recommendation. Successor wins routing.
- Response contains `lifecycle.redirect_to` pointing at the successor for the first call.
- Successor's response carries `lifecycle.redirect_from` (or equivalent) referencing the superseded skill.
- Redirect is asymmetric: the successor does not redirect back to the superseded skill.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Superseded skill still wins | Top-1 matches superseded slug | Inspect `supersession.ts` demotion logic. |
| Missing redirect_to | Response omits redirect metadata | Audit `lib/compat/redirect-metadata.ts`. |
| Bidirectional redirect | Successor redirects back | Block release. Asymmetry is contract. |

---

## 4. SOURCE FILES

- Scenario [NC-005](../01--native-mcp-tools/lifecycle-redirect-metadata.md), native MCP redirect metadata.
- Scenario [LC-005](./rollback-lifecycle.md), lifecycle-level rollback.
- Feature [`03--lifecycle-routing/supersession.md`](../../feature_catalog/03--lifecycle-routing/supersession.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/supersession.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/supersession.md

---

## 6. EVIDENCE

Precondition check for a superseded-successor pair in skill `graph-metadata.json` files:

```text
grep pattern: "supersession|redirect_to|redirect_from|superseded|successor"
path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills
include: graph-metadata.json

No files found
```

More specific metadata-field check:

```text
grep pattern: "\"lifecycle_status\"|\"redirect_to\"|\"redirect_from\"|\"skill_id\""
path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills
include: *graph-metadata.json

Found 20 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-chrome-devtools/graph-metadata.json:
  Line 3:   "skill_id": "mcp-chrome-devtools",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/graph-metadata.json:
  Line 3:   "skill_id": "sk-git",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/graph-metadata.json:
  Line 3:   "skill_id": "cli-opencode",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/z_archive/cli-codex-retired/graph-metadata.json:
  Line 3:   "skill_id": "cli-codex",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/graph-metadata.json:
  Line 3:   "skill_id": "mcp-open-design",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-code-mode/graph-metadata.json:
  Line 3:   "skill_id": "mcp-code-mode",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/graph-metadata.json:
  Line 3:   "skill_id": "system-spec-kit",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-claude-code/graph-metadata.json:
  Line 3:   "skill_id": "cli-claude-code",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-click-up/graph-metadata.json:
  Line 3:   "skill_id": "mcp-click-up",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/graph-metadata.json:
  Line 3:   "skill_id": "sk-doc",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/graph-metadata.json:
  Line 3:   "skill_id": "sk-prompt",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-figma/graph-metadata.json:
  Line 3:   "skill_id": "mcp-figma",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/graph-metadata.json:
  Line 4:   "skill_id": "deep-loop-runtime",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/graph-metadata.json:
  Line 3:   "skill_id": "system-code-graph",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/graph-metadata.json:
  Line 3:   "skill_id": "sk-code-review",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt-models/graph-metadata.json:
  Line 3:   "skill_id": "sk-prompt-models",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/graph-metadata.json:
  Line 3:   "skill_id": "sk-design",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/graph-metadata.json:
  Line 3:   "skill_id": "sk-code",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json:
  Line 3:   "skill_id": "system-skill-advisor",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/graph-metadata.json:
  Line 4:   "skill_id": "deep-loop-workflows",
```

MCP advisor recommendation call made during routing/precondition validation:

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
      "checkedAt": "2026-07-03T02:31:01.835Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:31:01.835Z",
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

Direct MCP advisor status:

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
      "checkedAt": "2026-07-03T02:32:16.354Z",
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

Blocked before scenario recommendation calls because step 1 could not identify a superseded-successor pair from `graph-metadata.json` supersession fields, and the daemon precondition was not met (`freshness: "unavailable"`, `trustState.reason: "SIGTERM"`).

---

## 7. PASS/FAIL

BLOCKED - Missing preconditions: no `graph-metadata.json` supersession fields identifying a superseded-successor pair were present, and the advisor daemon was not reachable/fresh (`advisor_unavailable`, `SIGTERM`).
