---
title: "AI-002 A7 Sanitizer at Every Write Boundary"
description: "Manual validation that the A7 sanitizer in lib/derived/sanitizer.ts runs at every write boundary (SQLite, graph-metadata derived, envelope, diagnostics) and rejects unsafe labels."
trigger_phrases:
  - "ai-002"
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitization"
version: 0.8.0.14
---

# AI-002 A7 Sanitizer at Every Write Boundary

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/derived/sanitizer.ts` is invoked at every public write boundary: SQLite persistence, `graph-metadata.json.derived` writes, response envelopes emitted by `handlers/advisor-recommend.ts` and diagnostic records written by adapters.

---

## 2. SCENARIO CONTRACT

- Repo root working directory.
- MCP server built.
- Disposable copy if introducing a synthetic malformed skill label is needed.
- Privacy-review mindset. Prompt text must never appear in envelope or diagnostic fields.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Call `advisor_recommend` with a benign prompt that should match an active skill:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":2,"includeAttribution":true}})
```

2. Inspect `laneBreakdown`, `trustState`, `cache` and `warnings` for any non-slug skill labels.
3. In a disposable copy, inject a fixture skill whose name contains control characters or unsafe path segments, touch to reindex, then repeat step 1.
4. Call `advisor_status` and verify `skillCount` is either unchanged (rejected) or the label appears sanitized.
5. Read the `graph-metadata.json.derived` block for the injected fixture and confirm all string fields are sanitized.

### Expected Signals

- Every skill label surfaced through public boundaries conforms to the slug shape `[a-z0-9][a-z0-9-]*`.
- Control characters, path separators and prompt fragments never appear in envelope or diagnostic output.
- Malformed labels are either rejected (skill excluded) or normalized.
- Derived entries written to `graph-metadata.json` use the sanitized label only.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Control chars in envelope | `laneBreakdown` or `warnings` contains non-printable bytes | Block release. Treat as a privacy failure. |
| Unsanitized label in DB | SQLite row contains raw input | Audit `sanitizer.ts` invocation at persistence layer. |
| Sanitizer silently skips | Label passes through unchanged despite control chars | Add regression case and inspect sanitizer input path. |

### Evidence

`advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":2,"includeAttribution":true}})` via MCP returned:

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
      "checkedAt": "2026-07-03T02:18:34.818Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:18:34.818Z",
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

`advisor_status` via MCP returned:

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
      "checkedAt": "2026-07-03T02:18:14.606Z",
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

Step 2 could not inspect `laneBreakdown` because the `advisor_recommend` envelope did not include `laneBreakdown`; it returned `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "advisor_unavailable"`, and `warnings: ["advisor_unavailable"]`.

Step 3 could not be executed because it requires injecting a fixture skill with control characters or unsafe path segments in a disposable copy, but this run's allowed write paths permit editing only `.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/sanitizer-boundaries.md` and explicitly ban modifying, creating, or deleting any other file.

Step 5 could not be executed because no injected fixture could be created under the allowed write path constraint, so there was no injected fixture `graph-metadata.json.derived` block to read.

### Pass/Fail

BLOCKED - The advisor was unavailable (`freshness: "unavailable"`, `trustState.reason: "advisor_unavailable"`) and the malformed-fixture write required by step 3 was outside the allowed write paths for this run.

---

## 4. SOURCE FILES

- Scenario [AI-001](./derived-extraction.md), derived extraction correctness.
- Scenario [AI-005](./anti-stuffing.md), repetition-density and adversarial rejection.
- Feature [`02--auto-indexing/sanitizer.md`](../../feature_catalog/02--auto-indexing/sanitizer.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sanitizer.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/sanitizer-boundaries.md
