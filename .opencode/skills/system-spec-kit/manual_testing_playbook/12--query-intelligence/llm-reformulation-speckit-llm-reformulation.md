---
title: "161 -- LLM reformulation (SPECKIT_LLM_REFORMULATION)"
description: "This scenario validates LLM reformulation (SPECKIT_LLM_REFORMULATION) for `161`. It focuses on deep mode behavior and verifying the reformulation pipeline runs."
audited_post_018: true
version: 3.6.0.14
---

# 161 -- LLM reformulation (SPECKIT_LLM_REFORMULATION)

## 1. OVERVIEW

This scenario validates LLM reformulation (SPECKIT_LLM_REFORMULATION) for `161`. It focuses on deep mode behavior and verifying the reformulation pipeline runs.

---

## 2. SCENARIO CONTRACT


- Objective: Verify reformulation pipeline runs in deep mode with corpus-grounded seeds.
- Real user request: `Please validate LLM reformulation (SPECKIT_LLM_REFORMULATION) against memory_search({ query: "complex multi-faceted query", mode: "deep" }) and tell me whether the expected signals are present: cheapSeedRetrieve() returns up to 3 seed results from FTS5; ReformulationResult contains abstract (>= 5 chars) and variants array (max 2 entries); LLM cache hit on repeated query; pipeline is no-op when mode != deep.`
- RCAF Prompt: `As a query-intelligence validation operator, validate LLM reformulation (SPECKIT_LLM_REFORMULATION) against memory_search({ query: "complex multi-faceted query", mode: "deep" }). Verify reformulation pipeline runs in deep mode with corpus-grounded seeds. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: cheapSeedRetrieve() returns up to 3 seed results from FTS5; ReformulationResult contains abstract (>= 5 chars) and variants array (max 2 entries); LLM cache hit on repeated query; pipeline is no-op when mode != deep
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if reformulation produces valid abstract and variants in deep mode, and is skipped in non-deep mode; FAIL if abstract empty, variants exceed MAX_VARIANTS (2), or pipeline runs outside deep mode

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify reformulation pipeline runs in deep mode against memory_search({ query: "complex multi-faceted query", mode: "deep" }). Verify cheapSeedRetrieve() returns FTS5/BM25 seeds; abstract >= 5 chars; variants array max 2; LLM cache hit on repeat; no-op in non-deep mode. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query: "complex multi-faceted query", mode: "deep" })`
2. Inspect reformulation output for abstract + variants
3. Verify cache populated
4. Re-run same query, verify cache hit

### Expected

cheapSeedRetrieve() returns FTS5/BM25 seeds; abstract >= 5 chars; variants array max 2; LLM cache hit on repeat; no-op in non-deep mode

### Evidence

Test transcript and observed output:

```bash
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"complex multi-faceted query","mode":"deep"}' --format json --timeout-ms 10000
(node:15412) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "featureFlags": {
      "trmEnabled": true,
      "multiQueryEnabled": true,
      "stateLimitsApplied": false
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 3,
        "activeChannels": 2,
        "candidateCount": 26,
        "constitutionalInjected": 5,
        "durationMs": 611
      },
      "timing": {
        "stage1": 611,
        "stage2": 1108,
        "stage3": 0,
        "stage4": 1,
        "total": 1720
      }
    },
    "lexicalPath": "fts5",
    "searchDecisionEnvelope": {
      "requestId": "memory_search-1782986320334",
      "queryPlan": {
        "selectedChannels": [
          "vector",
          "fts"
        ],
        "skippedChannels": [
          {
            "channel": "bm25",
            "reason": "Skipped by simple complexity route"
          },
          {
            "channel": "graph",
            "reason": "Skipped by simple complexity route"
          },
          {
            "channel": "degree",
            "reason": "Skipped by simple complexity route"
          }
        ]
      }
    }
  },
  "meta": {
    "tool": "memory_search",
    "latencyMs": 1762,
    "cacheHit": false,
    "responseProfile": "research",
    "tokenBudgetTruncated": true,
    "originalResultCount": 5,
    "returnedResultCount": 5
  }
}
```

```bash
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"complex multi-faceted query","mode":"deep"}' --format json --timeout-ms 10000
(node:15609) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "featureFlags": {
      "trmEnabled": true,
      "multiQueryEnabled": true,
      "stateLimitsApplied": false
    },
    "pipelineMetadata": {
      "stage1": {
        "searchType": "hybrid",
        "channelCount": 3,
        "activeChannels": 2,
        "candidateCount": 26,
        "constitutionalInjected": 5,
        "durationMs": 611
      },
      "timing": {
        "stage1": 611,
        "stage2": 1108,
        "stage3": 0,
        "stage4": 1,
        "total": 1720
      }
    },
    "lexicalPath": "fts5",
    "searchDecisionEnvelope": {
      "requestId": "memory_search-1782986320334"
    }
  },
  "meta": {
    "tool": "memory_search",
    "latencyMs": 1,
    "cacheHit": true,
    "responseProfile": "research",
    "tokenBudgetTruncated": true,
    "originalResultCount": 5,
    "returnedResultCount": 5
  }
}
```

```bash
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"complex multi-faceted query","mode":"deep","includeTrace":true,"profile":"debug"}' --format json --timeout-ms 10000
(node:16615) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "tools/call timed out",
  "exitCode": 75
}
```

```bash
$ node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"complex multi-faceted query","mode":"deep","includeTrace":true,"profile":"debug"}' --format json --timeout-ms 30000
(node:16884) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "backend unavailable: connect ECONNREFUSED /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}
```

```bash
$ printenv LLM_REFORMULATION_ENDPOINT

$ printenv SPECKIT_LLM_REFORMULATION

```

Read-only implementation evidence:

```ts
// .opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts
const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
if (!endpoint) {
  // No LLM provider configured — caller falls back to non-LLM path.
  return null;
}
```

```ts
const fallback: ReformulationResult = { abstract: q, variants: [] };

if (!isLlmReformulationEnabled()) {
  return fallback;
}
```

```md
| `LLM_REFORMULATION_ENDPOINT` | (unset) | string | OpenAI-compatible base URL used for query reformulation; unset disables the provider call and falls back locally. | `lib/search/llm-reformulation.ts` |
```

Observed result: the repeated `memory_search({ query: "complex multi-faceted query", mode: "deep" })` call returned a top-level `meta.cacheHit: true`, but no `ReformulationResult`, `abstract`, `variants`, or LLM-specific cache hit log was exposed in the returned payload. `LLM_REFORMULATION_ENDPOINT` is unset in the current shell, and the implementation returns `null` from the provider call when the endpoint is missing, so the required LLM reformulation output cannot be verified in this repo state.

### Pass / Fail

- **BLOCKED**: `LLM_REFORMULATION_ENDPOINT` is unset; the provider call is disabled and falls back locally, so the scenario cannot verify a real LLM-produced `ReformulationResult`, LLM cache population, or the expected LLM-specific cache hit behavior.

### Failure Triage

Verify isLlmReformulationEnabled() → Check LLM_REFORMULATION_ENDPOINT configured → Inspect cheapSeedRetrieve() for FTS5 results → Verify normalizeQuery() cache key → Check REFORMULATION_TIMEOUT_MS (8000)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/llm-query-reformulation.md](../../feature_catalog/12--query-intelligence/llm-query-reformulation.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/llm-reformulation.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 161
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/llm-reformulation-speckit-llm-reformulation.md`
