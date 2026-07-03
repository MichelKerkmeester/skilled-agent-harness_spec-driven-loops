---
title: "166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN)"
description: "This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results."
version: 3.6.0.14
---

# 166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN)

## 1. OVERVIEW

This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results.

---

## 2. SCENARIO CONTRACT


- Objective: Verify two-tier explainability attachment to search results.
- Real user request: `Please validate Result explain v1 (SPECKIT_RESULT_EXPLAIN) against SPECKIT_RESULT_EXPLAIN=true and tell me whether the expected signals are present: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF.`
- Prompt: `Validate result explain v1 behavior with SPECKIT_RESULT_EXPLAIN enabled and disabled.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if slim tier (summary + topSignals) present on all results when flag ON, debug tier includes channelContribution, and no why field when flag OFF; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug mode

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify why.summary + topSignals in results against SPECKIT_RESULT_EXPLAIN=true. Verify why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_RESULT_EXPLAIN=true`
2. `memory_search({ query: "test explainability" })`
3. Inspect each result for why.summary + why.topSignals
4. Re-run with debug.enabled=true
5. Verify channelContribution present in debug mode

### Expected

why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF

### Evidence

Commands executed:

```bash
SPECKIT_RESULT_EXPLAIN=true
SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 SPECKIT_RESULT_EXPLAIN=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test explainability","limit":3,"includeTrace":false}' --format json --timeout-ms 10000
```

Observed flag-on result excerpt:

```json
{
  "summary": "Found 3 memories",
  "data": {
    "count": 3,
    "results": [
      {
        "id": 5720,
        "score": 0.513474,
        "why": {
          "summary": "Ranked first because semantic similarity and high spec quality",
          "topSignals": [
            "semantic_match",
            "validation_quality"
          ]
        },
        "preCalibrationValue": 0.3499107,
        "confidence": {
          "label": "low",
          "value": 0.1,
          "drivers": [
            "anchor_density"
          ]
        }
      },
      {
        "id": 31597,
        "compact": true
      },
      {
        "id": 5718,
        "compact": true
      }
    ]
  },
  "meta": {
    "cacheHit": false,
    "tokenBudgetTruncated": true,
    "originalResultCount": 3,
    "returnedResultCount": 3
  }
}
```

Documented debug knob rejected by current schema:

```bash
SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 SPECKIT_RESULT_EXPLAIN=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test explainability","limit":1,"profile":"debug","includeTrace":true,"debug":{"enabled":true}}' --format json --timeout-ms 10000
```

```text
[schema-validation] memory_search: Invalid arguments for "memory_search". Unknown parameter(s): debug. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.
{
  "status": "error",
  "error": "Invalid arguments for \"memory_search\". Unknown parameter(s): debug. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.",
  "exitCode": 64
}
```

Accepted debug-facing run used `profile:"debug"` and `includeTrace:true`:

```bash
SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 SPECKIT_RESULT_EXPLAIN=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test explainability","limit":1,"profile":"debug","includeTrace":true}' --format json --timeout-ms 10000
```

Observed debug result excerpt: `why` and `why_ranked.channels` were present, but no `channelContribution` field was present.

```json
{
  "data": {
    "retrievalTrace": {
      "traceId": "tr_mr447kvs_swkt0f",
      "finalResultCount": 1
    },
    "results": [
      {
        "id": 5720,
        "scores": {
          "semantic": null,
          "lexical": null,
          "fusion": 0.513474,
          "intentAdjusted": 0.513474,
          "composite": 0.513474,
          "rerank": null,
          "attention": null
        },
        "why_ranked": {
          "document": {
            "path": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr/tasks.md",
            "anchor": null
          },
          "rank": 1,
          "effectiveScore": 0.513474,
          "scoreSource": "intentAdjusted",
          "channels": {
            "vector": null,
            "bm25": null,
            "fts": null,
            "graph": null,
            "trigger": null
          },
          "signals": {
            "fsrs": 1,
            "importance": 0.6,
            "recency": null
          },
          "source": "ranker_intermediates"
        },
        "why": {
          "summary": "Ranked first because semantic similarity and high spec quality",
          "topSignals": [
            "semantic_match",
            "validation_quality"
          ]
        }
      }
    ],
    "meta": {
      "responseProfile": "debug"
    }
  }
}
```

Flag-off/no-env run with cache bypass:

```bash
SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"test explainability","limit":1,"includeTrace":false,"bypassCache":true}' --format json --timeout-ms 10000
```

Observed flag-off/no-env result still included `why`:

```json
{
  "data": {
    "pipelineMetadata": {
      "confidenceTruncation": {
        "featureFlagEnabled": true
      }
    },
    "results": [
      {
        "id": 5720,
        "why": {
          "summary": "Ranked first because semantic similarity and high spec quality",
          "topSignals": [
            "semantic_match",
            "validation_quality"
          ]
        }
      }
    ]
  },
  "meta": {
    "cacheHit": false,
    "responseProfile": "research"
  }
}
```

### Pass / Fail

- **Pass**: slim tier present and debug tier includes channelContribution
- **Fail**: FAIL. Slim `why.summary` and `why.topSignals` appeared for the checked flag-on result, but the accepted debug-mode output did not include `channelContribution`, the documented `debug.enabled=true` parameter was rejected by schema validation, and flag-off/no-env output still included a `why` field.

### Failure Triage

Verify isResultExplainEnabled() → Inspect extractSignals() for PipelineRow → Check resolveEffectiveScore() → Verify channelAttribution detection → Check SignalLabel types

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/result-explainability.md](../../feature_catalog/18--ux-hooks/result-explainability.md)
- Feature flag reference: [19--feature-flag-reference/1-search-pipeline-features-speckit.md](../19--feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/result-explainability.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 166
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/result-explain-v1-speckit-result-explain-v1.md`
- audited_post_018: true
