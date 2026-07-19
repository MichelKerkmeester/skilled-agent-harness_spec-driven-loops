---
title: "162 -- HyDE (SPECKIT_HYDE)"
description: "This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated."
audited_post_018: true
version: 3.6.0.14
id: query-intelligence-hyde-speckit-hyde
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 162 -- HyDE (SPECKIT_HYDE)

## 1. OVERVIEW

This scenario validates HyDE (SPECKIT_HYDE) for `162`. It focuses on enabling the flag in deep mode and verifying a HyDE pseudo-document is generated.

---

## 2. SCENARIO CONTRACT


- Objective: Verify HyDE pseudo-document generation for low-confidence deep queries.
- Real user request: `Please validate HyDE (SPECKIT_HYDE) against SPECKIT_HYDE=true and tell me whether the expected signals are present: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; active mode (default): results merged into candidates; shadow mode (SPECKIT_HYDE_ACTIVE=false): results logged but not merged.`
- RCAF Prompt: `As a query-intelligence validation operator, validate HyDE (SPECKIT_HYDE) against SPECKIT_HYDE=true. Verify hyDE pseudo-document generation for low-confidence deep queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence threshold (top score < 0.45) triggers generation; LLM cache shared with reformulation; active mode (default): results merged into candidates; shadow mode (SPECKIT_HYDE_ACTIVE=false): results logged but not merged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pseudo-document generated for low-confidence query and results are merged by default (active mode), and stay shadow-only when SPECKIT_HYDE_ACTIVE=false; FAIL if no pseudo-document generated or merge behavior does not match flag state

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify HyDE pseudo-document generated against SPECKIT_HYDE=true. Verify hyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_HYDE=true`
2. `memory_search({ query: "obscure topic with few matches", mode: "deep" })`
3. Inspect HyDEResult for pseudoDocument + embedding
4. Verify active merge (default, SPECKIT_HYDE_ACTIVE is ON)
5. Set `SPECKIT_HYDE_ACTIVE=false`, verify shadow-only (logged, not merged)
6. Check LLM cache populated

### Expected

HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared

### Evidence

Command 1 (`SPECKIT_HYDE=true`) was applied to the CLI invocation environment for the active-mode run:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "requestQuality": {
      "label": "gap"
    },
    "recovery": {
      "status": "partial",
      "reason": "knowledge_gap",
      "suggestedQueries": [
        "obscure topic with"
      ],
      "recommendedAction": "broaden_or_ask"
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 3,
        "activeChannels": 2,
        "candidateCount": 33,
        "constitutionalInjected": 5,
        "durationMs": 446
      }
    },
    "retrievalTrace": {
      "traceId": "tr_mr3bspsa_3i9h4d",
      "query": "obscure topic with few matches",
      "stages": [
        {
          "stage": "candidate",
          "metadata": {
            "channel": "d2-llm-reformulation",
            "abstract": "obscure topic with few matches",
            "variantCount": 0,
            "fanoutCount": 1
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "channel": "r8-summary-embeddings",
            "summaryHits": 10,
            "preFilterCount": 10
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "channel": "d2-query-surrogates",
            "surrogatesLoaded": 1,
            "boostedCount": 1
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "searchType": "hybrid",
            "mode": "deep",
            "channelCount": 3,
            "deepExpansion": true,
            "r12EmbeddingExpansion": true
          }
        }
      ],
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 5822,
        "score": 0.34080799999999994,
        "scores": {
          "fusion": 0.34080799999999994,
          "intentAdjusted": 0.34080799999999994,
          "composite": 0.34080799999999994
        },
        "confidence": {
          "label": "low",
          "value": 0.087,
          "drivers": [
            "anchor_density"
          ]
        }
      }
    ]
  }
}
```

Observed active-mode command:

```bash
SPECKIT_HYDE=true node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"obscure topic with few matches","mode":"deep","includeTrace":true,"profile":"debug","limit":10,"bypassCache":true}' --format json --timeout-ms 3000
```

Observed shadow-mode command, first attempt:

```json
{
  "status": "error",
  "error": "tools/call timed out",
  "exitCode": 75
}
```

Observed shadow-mode command, retry with longer CLI timeout:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "requestQuality": {
      "label": "gap"
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 3,
        "activeChannels": 2,
        "candidateCount": 33,
        "constitutionalInjected": 5,
        "durationMs": 345
      }
    },
    "retrievalTrace": {
      "traceId": "tr_mr3btaqq_55748v",
      "query": "obscure topic with few matches",
      "stages": [
        {
          "stage": "candidate",
          "metadata": {
            "channel": "d2-llm-reformulation",
            "abstract": "obscure topic with few matches",
            "variantCount": 0,
            "fanoutCount": 1
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "channel": "r8-summary-embeddings",
            "summaryHits": 10,
            "preFilterCount": 10
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "channel": "d2-query-surrogates",
            "surrogatesLoaded": 1,
            "boostedCount": 1
          }
        },
        {
          "stage": "candidate",
          "metadata": {
            "searchType": "hybrid",
            "mode": "deep",
            "channelCount": 3,
            "deepExpansion": true,
            "r12EmbeddingExpansion": true
          }
        }
      ],
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 5822,
        "score": 0.34080799999999994,
        "confidence": {
          "label": "low",
          "value": 0.087,
          "drivers": [
            "anchor_density"
          ]
        }
      }
    ]
  }
}
```

Observed environment prerequisite check:

```json
{"LLM_REFORMULATION_ENDPOINT_present":false,"LLM_REFORMULATION_API_KEY_present":false,"SPECKIT_HYDE":null,"SPECKIT_HYDE_ACTIVE":null}
```

Observed source contract for the missing prerequisite:

```text
mcp-server/lib/search/hyde.ts:226-228
const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
if (!endpoint) {
  return null;
}
```

Observed source contract for expected low-confidence threshold and cache behavior:

```text
mcp-server/lib/search/hyde.ts:88
const LOW_CONFIDENCE_THRESHOLD = 0.45;

mcp-server/lib/search/hyde.ts:311-315
const cache = getLlmCache();
const cacheKey: LlmCacheKey = {
  query: normalizeQuery(query),
  mode: 'hyde',
};

mcp-server/lib/search/llm-cache.ts:6-9
// CONSUMERS: llm-reformulation.ts, hyde.ts
//
// Cache key: { query (normalised), mode } → serialised string key.
// TTL-based expiry (default 1 hour).  In-process Map — no DB, no disk.
```

Observed result: no `HyDEResult`, no `pseudoDocument`, no `Float32Array` embedding, no `d2-hyde` trace stage, no shadow log line, and no cache population could be observed. The run is blocked because `LLM_REFORMULATION_ENDPOINT_present` is `false`, and `generateHyDE()` returns `null` before pseudo-document generation when that endpoint is absent.

### Pass / Fail

- **BLOCKED**: `LLM_REFORMULATION_ENDPOINT_present` is `false`; HyDE generation cannot produce `HyDEResult.pseudoDocument` or `HyDEResult.embedding`, so active merge, shadow-only logging, and cache population cannot be verified in this repo state.

### Failure Triage

Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify isHyDEActive() gate

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [query-intelligence/hyde-hypothetical-document-embeddings.md](../../feature-catalog/query-intelligence/hyde-hypothetical-document-embeddings.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../feature-catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/hyde.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 162
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `query-intelligence/hyde-speckit-hyde.md`
