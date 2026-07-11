---
title: "038 -- Query expansion (R12)"
description: "This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup."
audited_post_018: true
version: 3.6.0.15
---

# 038 -- Query expansion (R12)

## 1. OVERVIEW

This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm parallel expansion + dedup.
- Real user request: `Please validate Query expansion (R12) against the documented validation surface and tell me whether the expected signals are present: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query expansion (R12) against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm parallel expansion + dedup against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Complex query expansion
2. Parallel baseline+expanded
3. dedup + simple-query skip

### Expected

Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion

### Evidence

User request used: `Please validate Query expansion (R12) against the documented validation surface and tell me whether the expected signals are present: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion.`

Orchestrator prompt used:

```text
As a query-intelligence validation operator, confirm parallel expansion + dedup against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.
```

Documented validation surface read:

```text
.opencode/skills/system-spec-kit/feature_catalog/query-intelligence/query-expansion.md
Implementation files: mcp_server/lib/search/embedding-expansion.ts; mcp_server/lib/search/query-expander.ts; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts; mcp_server/lib/search/query-classifier.ts; mcp_server/lib/search/search-flags.ts
Validation files: mcp_server/tests/embedding-expansion.vitest.ts; mcp_server/tests/query-expander.vitest.ts; mcp_server/tests/stage1-expansion.vitest.ts; mcp_server/tests/search-flags.vitest.ts
```

Command: `npx vitest run tests/embedding-expansion.vitest.ts tests/stage1-expansion.vitest.ts tests/search-flags.vitest.ts`

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed | 1 skipped (3)
      Tests  43 passed | 13 skipped (56)
   Start at  12:05:24
   Duration  749ms (transform 237ms, setup 44ms, import 335ms, tests 22ms, environment 0ms)
```

Command: `npx vitest run tests/query-expander.vitest.ts --reporter verbose`

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T1: original query is always the first variant 1ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T2: known domain terms produce synonym variants 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T3: never returns more than MAX_VARIANTS 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T4: query with no known terms returns only original 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T5: empty string returns array with empty string 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T6: single known word produces variant 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T7: synonym matching is case-insensitive 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T8: variants are unique (no duplicates) 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T9: multiple terms each get expanded in separate variants 1ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T10: domain vocabulary map has expected entries 0ms
 ✓ mcp_server/tests/query-expander.vitest.ts > C138-P3 Query Expander > T11: handles special characters without crashing 0ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  12:08:20
   Duration  120ms (transform 23ms, setup 18ms, import 14ms, tests 5ms, environment 0ms)
```

Command: `node --import ../scripts/node_modules/tsx/dist/loader.mjs -e "const { expandQuery } = await import('./lib/search/query-expander.ts'); const { classifyQueryComplexity } = await import('./lib/search/query-classifier.ts'); const complex='fix login error bug crash'; const variants=expandQuery(complex); const simple='login'; console.log(JSON.stringify({complexQuery:complex,variants,variantCount:variants.length,uniqueVariantCount:new Set(variants).size,simpleQuery:simple,simpleClassification:classifyQueryComplexity(simple),complexClassification:classifyQueryComplexity('how does the embedding based query expansion pipeline handle recall precision tradeoffs across multiple retrieval stages and deduplicate baseline expanded results')}, null, 2));"`

```json
{
  "complexQuery": "fix login error bug crash",
  "variants": [
    "fix login error bug crash",
    "patch login error bug crash",
    "fix authentication error bug crash"
  ],
  "variantCount": 3,
  "uniqueVariantCount": 3,
  "simpleQuery": "login",
  "simpleClassification": {
    "tier": "simple",
    "features": {
      "termCount": 1,
      "charCount": 5,
      "hasTriggerMatch": false,
      "stopWordRatio": 0
    },
    "confidence": "high",
    "queryPlan": {
      "intent": "unknown",
      "complexity": "simple",
      "artifactClass": "unknown",
      "authorityNeed": "unknown",
      "selectedChannels": [],
      "skippedChannels": [],
      "routingReasons": [
        "complexity:simple",
        "confidence:high",
        "terms:1"
      ],
      "fallbackPolicy": {
        "mode": "none",
        "reason": "No fallback applied"
      }
    }
  },
  "complexClassification": {
    "tier": "complex",
    "features": {
      "termCount": 21,
      "charCount": 162,
      "hasTriggerMatch": false,
      "stopWordRatio": 0.143
    },
    "confidence": "high",
    "queryPlan": {
      "intent": "unknown",
      "complexity": "complex",
      "artifactClass": "unknown",
      "authorityNeed": "unknown",
      "selectedChannels": [],
      "skippedChannels": [],
      "routingReasons": [
        "complexity:complex",
        "confidence:high",
        "terms:21"
      ],
      "fallbackPolicy": {
        "mode": "none",
        "reason": "No fallback applied"
      }
    }
  }
}
```

Command: `npx vitest run tests/embedding-expansion.vitest.ts --reporter verbose`

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T8: returns identity result for empty embedding (zero-length Float32Array)
[embedding-expansion] Received empty embedding — skipping expansion

stderr | mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T13: returns identity result when vectorSearch throws
[embedding-expansion] Expansion failed, using original query: DB connection failed

 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T1: returns identity result when SPECKIT_EMBEDDING_EXPANSION is explicitly off 1ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T1b: returns identity result when flag is explicitly "false" 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T2: suppresses expansion for "simple" queries when R15 classifier is active 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T2b: suppresses expansion for 1-word query (always simple) 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T3: runs expansion for a complex query when flag is on 5ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T4: R15 mutual exclusion — "simple" tier always suppresses, regardless of content 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T4b: moderate query is NOT suppressed by R15 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T5: isExpansionActive() returns false when flag is explicitly off 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T5b: isExpansionActive() returns false when flag is "false" 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T6: isExpansionActive() returns false for simple query when R15 is active 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T7: isExpansionActive() returns true for complex query when flag is on 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T7b: isExpansionActive() returns true for complex query even with R15 explicitly disabled 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T8: returns identity result for empty embedding (zero-length Float32Array) 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T9: result always has original, expanded, and combinedQuery fields 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T9b: expanded is always an array (never null/undefined) 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T10: simple query returns within 5 ms (no I/O, flag on) 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T10b: flag-off path returns within 1 ms (no classification overhead) 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T11: combinedQuery === original when vector search returns no content 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T11b: combinedQuery === original when all content tokens already appear in query 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T12: combinedQuery appends expanded terms space-separated 0ms
 ✓ mcp_server/tests/embedding-expansion.vitest.ts > R12: Embedding-Based Query Expansion > T13: returns identity result when vectorSearch throws 0ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  12:08:50
   Duration  125ms (transform 44ms, setup 15ms, import 44ms, tests 10ms, environment 0ms)
```

Command: `npx vitest run tests/stage1-expansion.vitest.ts --reporter verbose`

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T1: calls expansion when R12 flag is enabled and query is not simple
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T2: deduplication preserves baseline-first ordering
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T3: expansion suppressed for simple queries (R15 mutual exclusion)
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T4: expansion disabled when flag is OFF → single channel
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T5: merges summary-channel candidates with baseline candidates
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T6: deduplicates summary candidates by memory id and preserves baseline result
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T7: applies minQualityScore threshold to summary candidates before merge
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T8: summary-channel hits are filtered by governance scope before merge
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T9: constitutional injection re-applies governance scope after vector fetch
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T10: leaves candidates untouched when no governance scope is provided
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T11: deep-mode LLM reformulation results are scope-filtered before merge
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T12: deep-mode HyDE results are scope-filtered before merge
 ↓ mcp_server/tests/stage1-expansion.vitest.ts > Stage-1: Expansion & Dedup > T13: deep-mode multi-query merges duplicate ids and keeps later branch evidence

 Test Files  1 skipped (1)
      Tests  13 skipped (13)
   Start at  12:09:00
   Duration  190ms (transform 87ms, setup 14ms, import 114ms, tests 0ms, environment 0ms)
```

MCP attempts to exercise live `memory_search` with trace were blocked by parameter validation before search execution:

```text
code: E030
issues: [
  "cursor: Too small: expected string to have >=1 characters",
  "concepts: Too small: expected array to have >=2 items"
]

code: E_VALIDATION
error: Cursor is invalid, expired, or out of scope
details.parameter: cursor
```

Observed comparison against Expected: complex rule-based query expansion produced 3 unique variants; embedding expansion tests confirm complex-query activation and simple-query suppression. The required baseline+expanded result dedup signal is blocked because the documented Stage-1 expansion/dedup validation file is entirely skipped (`Test Files 1 skipped`, `Tests 13 skipped`), including `T2: deduplication preserves baseline-first ordering`.

### Pass / Fail

- **BLOCKED**: Baseline+expanded dedup could not be truthfully verified because `mcp_server/tests/stage1-expansion.vitest.ts` is currently skipped (`describe.skip`), producing `Test Files 1 skipped` and `Tests 13 skipped`; complex expansion and simple-query skip were observed, but the scenario's required dedup signal was not executable.

### Failure Triage

Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [query-intelligence/query-expansion.md](../../feature_catalog/query-intelligence/query-expansion.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 038
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `query-intelligence/query-expansion-r12.md`
