---
title: "173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)"
description: "This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries."
audited_post_018: true
version: 3.6.0.14
id: query-intelligence-query-decomposition-speckit-query-decomposition
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)

## 1. OVERVIEW

This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.

---

## 2. SCENARIO CONTRACT


- Objective: Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.
- Real user request: `Please validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION and tell me whether the expected signals are present: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION. Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if multi-faceted query decomposes into <= 3 sub-queries in deep mode with rule-based splitting; FAIL if decomposition exceeds 3 sub-queries, runs outside deep mode, uses LLM, or crashes instead of falling back

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries against SPECKIT_QUERY_DECOMPOSITION. Verify isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true`
2. `memory_search({ query: "What is the spec-doc record save workflow and how does query expansion work?", mode: "deep" })`
3. Inspect decomposition output for sub-queries
4. Verify sub-query count <= 3
5. Run same query in non-deep mode, verify no decomposition

### Expected

isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error

### Evidence

Test transcript excerpts from 2026-07-02:

1. Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true`:

```text
$ printenv SPECKIT_QUERY_DECOMPOSITION
(no output)
```

2. Deep mode command:

```text
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"What is the spec-doc record save workflow and how does query expansion work?","mode":"deep","includeTrace":true}' --format json --timeout-ms 10000
(node:23459) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "requestQuality": {
      "label": "good"
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 4,
        "activeChannels": 2,
        "candidateCount": 44,
        "constitutionalInjected": 5,
        "durationMs": 911
      }
    },
    "retrievalTrace": {
      "traceId": "tr_mr3c9udu_kedscw",
      "query": "What is the spec-doc record save workflow and how does query expansion work?",
      "intent": "understand",
      "stages": [
        {
          "stage": "candidate",
          "timestamp": 1782986747231,
          "inputCount": 3,
          "outputCount": 29,
          "durationMs": 0,
          "metadata": {
            "channel": "d2-query-decomposition",
            "originalQuery": "What is the spec-doc record save workflow and how does query expansion work?",
            "facets": [
              "What is the spec-doc record save workflow",
              "how does query expansion work"
            ],
            "facetCount": 2
          }
        },
        {
          "stage": "candidate",
          "timestamp": 1782986747290,
          "inputCount": 0,
          "outputCount": 0,
          "durationMs": 0,
          "metadata": {
            "channel": "d2-llm-reformulation",
            "abstract": "What is the spec-doc record save workflow and how does query expansion work?",
            "variantCount": 0,
            "fanoutCount": 1
          }
        },
        {
          "stage": "candidate",
          "timestamp": 1782986747297,
          "inputCount": 4,
          "outputCount": 44,
          "durationMs": 911,
          "metadata": {
            "searchType": "hybrid",
            "mode": "deep",
            "channelCount": 4,
            "deepExpansion": true,
            "r12EmbeddingExpansion": true
          }
        }
      ],
      "totalDurationMs": 1995,
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 4400,
        "title": "Feature Specification: 034 Query Expansion Context Size",
        "score": 0.632178432,
        "trace": {
          "channelsUsed": [
            "d2-concept-expansion",
            "d2-concept-routing",
            "d2-query-decomposition",
            "d2-llm-reformulation",
            "r8-summary-embeddings",
            "d2-query-surrogates",
            "vector",
            "degree"
          ]
        }
      },
      {
        "id": 4851,
        "title": "Spec: 016/004/016 Query Expansion — Identifier Bridging (camelCase / snake_case / synonyms)",
        "score": 0.5678588341378905
      },
      {
        "id": 4396,
        "title": "Implementation Summary: 034 Query Expansion Context Size",
        "score": 0.5308463999999999
      },
      {
        "id": 4852,
        "title": "Tasks: 016 Query Expansion Identifier Bridging",
        "score": 0.5115402517273423
      },
      {
        "id": 4843,
        "title": "Verification Checklist: 016 Query Expansion Identifier Bridging",
        "score": 0.47513440000000007
      }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.78."
  }
}
```

3. Non-deep mode command. `mode: "normal"` is not accepted by the live tool schema, so the accepted non-deep mode is `mode: "auto"`:

```text
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"What is the spec-doc record save workflow and how does query expansion work?","mode":"normal"}' --format json --timeout-ms 3000
[schema-validation] memory_search: Invalid arguments for "memory_search". Parameter "mode" is invalid: Invalid option: expected one of "auto"|"deep" Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.
{
  "status": "error",
  "error": "Invalid arguments for \"memory_search\". Parameter \"mode\" is invalid: Invalid option: expected one of \"auto\"|\"deep\" Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, retrievalLevel, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.",
  "exitCode": 64
}
```

```text
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"What is the spec-doc record save workflow and how does query expansion work?","mode":"auto","includeTrace":true}' --format json --timeout-ms 10000
(node:23655) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
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
        "candidateCount": 31,
        "constitutionalInjected": 5,
        "durationMs": 962
      }
    },
    "retrievalTrace": {
      "traceId": "tr_mr3ca2wq_pilppu",
      "query": "What is the spec-doc record save workflow and how does query expansion work?",
      "intent": "understand",
      "stages": [
        {
          "stage": "candidate",
          "timestamp": 1782986758389,
          "inputCount": 2,
          "outputCount": 16,
          "durationMs": 0,
          "metadata": {
            "channel": "r12-embedding-expansion",
            "expandedTerms": [
              "spec",
              "anchor",
              "indexing",
              "description",
              "scope",
              "document",
              "folder",
              "docs"
            ],
            "combinedQuery": "What is the spec-doc record save workflow and how does query expansion work? spec anchor indexing description scope document folder docs"
          }
        },
        {
          "stage": "candidate",
          "timestamp": 1782986758396,
          "inputCount": 3,
          "outputCount": 31,
          "durationMs": 962,
          "metadata": {
            "searchType": "hybrid",
            "mode": "auto",
            "channelCount": 3,
            "deepExpansion": false,
            "r12EmbeddingExpansion": true
          }
        }
      ],
      "totalDurationMs": 1980,
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 3268,
        "title": "Decision Record: 052 Stress Test Expansion and Alignment",
        "score": 0.4178616,
        "trace": {
          "channelsUsed": [
            "d2-concept-expansion",
            "d2-concept-routing",
            "r12-embedding-expansion",
            "r8-summary-embeddings"
          ]
        }
      }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.41."
  }
}
```

4. Source inspection for rule-based splitting, cap, default-on flag, and fallback:

```text
mcp-server/lib/search/query-decomposer.ts:21: export const MAX_FACETS = 3;
mcp-server/lib/search/query-decomposer.ts:30: const CONJUNCTION_PATTERN_SOURCE = '\\b(?:and|or|also|plus|as well as|along with)\\b';
mcp-server/lib/search/query-decomposer.ts:47: const QUESTION_WORD_PATTERN_SOURCE = '\\b(?:what|where|when|why|how|who|which)\\b';
mcp-server/lib/search/query-decomposer.ts:177:     return unique.slice(0, MAX_FACETS);
mcp-server/lib/search/query-decomposer.ts:184:     return unique.slice(0, MAX_FACETS);
mcp-server/lib/search/search-flags.ts:406:  * Default: TRUE (graduated). Set SPECKIT_QUERY_DECOMPOSITION=false to disable.
mcp-server/lib/search/search-flags.ts:408: export function isQueryDecompositionEnabled(): boolean {
mcp-server/lib/search/search-flags.ts:409:   return isFeatureEnabled('SPECKIT_QUERY_DECOMPOSITION');
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:898:     if (mode === 'deep' && isMultiQueryEnabled()) {
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:932:           facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:979:             // Skip the standard deep-mode expansion path below
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:987:           // Fall through to standard deep expansion path below (candidates is empty)
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:508:       `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:510:     return [query];
```

### Pass / Fail

- **PASS**: Deep mode produced `d2-query-decomposition` with `facetCount: 2` and facets `["What is the spec-doc record save workflow", "how does query expansion work"]`; non-deep `auto` mode produced no `d2-query-decomposition` stage and reported `deepExpansion: false`; implementation evidence shows default-on flag, rule-based conjunction/wh-question detection, `MAX_FACETS = 3`, skip of standard deep expansion after decomposition, and fallback to the original query on variant-build failure.

### Failure Triage

Verify isQueryDecompositionEnabled() → Confirm flag is not forced off → Check MAX_FACETS=3 constant → Inspect conjunction splitting regex → Verify deep-mode gate in stage1-candidate-gen → Check graceful fallback path

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [query-intelligence/query-decomposition.md](../../feature-catalog/query-intelligence/query-decomposition.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../feature-catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/query-decomposer.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 173
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `query-intelligence/query-decomposition-speckit-query-decomposition.md`
