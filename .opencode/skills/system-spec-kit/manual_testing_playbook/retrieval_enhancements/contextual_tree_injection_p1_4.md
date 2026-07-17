---
title: "145 -- Contextual tree injection (P1-4)"
description: "This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled."
audited_post_018: true
version: 3.6.0.16
id: retrieval-enhancements-contextual-tree-injection-p1-4
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 145 -- Contextual tree injection (P1-4)

## 1. OVERVIEW

This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.

---

## 2. SCENARIO CONTRACT


- Objective: Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.
- Real user request: `` Please validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }) and tell me whether the expected signals are present: Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. ``
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }). Verify hierarchical spec-folder headers are injected into search results when SPECKIT_CONTEXT_HEADERS=true and suppressed when disabled. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }). Verify hierarchical spec-folder headers are injected into search results when SPECKIT_CONTEXT_HEADERS=true and suppressed when disabled. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default)
2. Verify results with spec-folder file paths have a `[parent > child — desc]` header prepended to content
3. Verify header is truncated at 100 characters
4. Restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat search
5. Verify no contextual headers are prepended

### Expected

Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged

### Evidence

Native MCP attempt with the scenario payload plus extra empty optional fields was rejected before execution:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "memory_search",
      "issues": [
        "cursor: Too small: expected string to have >=1 characters",
        "concepts: Too small: expected array to have >=2 items"
      ],
      "unknownParameters": [],
      "expectedParameters": [
        "cursor",
        "query",
        "concepts",
        "specFolder",
        "tenantId",
        "userId",
        "agentId",
        "limit",
        "sessionId",
        "enableDedup",
        "tier",
        "contextType",
        "useDecay",
        "includeContiguity",
        "includeConstitutional",
        "enableSessionBoost",
        "enableCausalBoost",
        "includeContent",
        "anchors",
        "min_quality_score",
        "minQualityScore",
        "bypassCache",
        "rerank",
        "applyLengthPenalty",
        "applyStateLimits",
        "minState",
        "intent",
        "autoDetectIntent",
        "trackAccess",
        "includeArchived",
        "mode",
        "retrievalLevel",
        "includeTrace",
        "profile"
      ]
    }
  }
}
```

Enabled/default run through the Spec Memory CLI front door:

```bash
node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"spec folder context headers","includeContent":true,"includeTrace":true,"limit":5}' --format json --timeout-ms 3000
```

Observed output excerpts:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "requestQuality": { "label": "weak" },
    "retrievalTrace": {
      "traceId": "tr_mr3koufx_tos1kt",
      "query": "spec folder context headers",
      "totalDurationMs": 1882,
      "finalResultCount": 5
    },
    "progressiveDisclosure": {
      "results": [
        { "snippet": "", "detailAvailable": false, "resultId": "7208" },
        { "snippet": "", "detailAvailable": false, "resultId": "6936" },
        { "snippet": "", "detailAvailable": false, "resultId": "4094" },
        { "snippet": "", "detailAvailable": false, "resultId": "3265" },
        {
          "snippet": "Packet: system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-resea...",
          "detailAvailable": true,
          "resultId": "13450"
        }
      ]
    },
    "results": [
      {
        "id": 7208,
        "specFolder": "system-spec-kit/z_archive/006-generate-context-subfolder",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/spec.md",
        "content": null,
        "contentError": "File not found"
      },
      {
        "id": 6936,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization/spec.md",
        "contentError": "File not found",
        "compact": true
      },
      {
        "id": 4094,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/spec.md",
        "contentError": "File not found",
        "compact": true
      },
      {
        "id": 3265,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion/spec.md",
        "contentError": "File not found",
        "compact": true
      },
      {
        "id": 13450,
        "specFolder": "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory/graph-metadata.json",
        "contentError": "File not found",
        "compact": true
      }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.59."
  },
  "hints": [
    "Some files could not be read - check file paths",
    "Token budget enforced: 4 of 5 results rendered compact to fit 3500 token budget"
  ],
  "meta": {
    "cacheHit": false,
    "tokenBudgetTruncated": true,
    "originalResultCount": 5,
    "returnedResultCount": 5
  }
}
```

Disabled-flag run attempted with `SPECKIT_CONTEXT_HEADERS=false`:

```bash
SPECKIT_CONTEXT_HEADERS=false node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"spec folder context headers","includeContent":true,"includeTrace":true,"limit":5}' --format json --timeout-ms 3000
```

Observed output was a cache hit with the same enabled/default `traceId`, so it did not constitute an independent disabled-mode run:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "retrievalTrace": {
      "traceId": "tr_mr3koufx_tos1kt",
      "query": "spec folder context headers",
      "totalDurationMs": 1882,
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 7208,
        "content": null,
        "contentError": "File not found"
      },
      { "id": 6936, "contentError": "File not found", "compact": true },
      { "id": 4094, "contentError": "File not found", "compact": true },
      { "id": 3265, "contentError": "File not found", "compact": true },
      { "id": 13450, "contentError": "File not found", "compact": true }
    ]
  },
  "meta": {
    "cacheHit": true,
    "tokenBudgetTruncated": true,
    "originalResultCount": 5,
    "returnedResultCount": 5
  }
}
```

Disabled-flag retry with cache bypass:

```bash
SPECKIT_CONTEXT_HEADERS=false node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"spec folder context headers","includeContent":true,"includeTrace":true,"limit":5,"bypassCache":true}' --format json --timeout-ms 3000
```

Observed output excerpts:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "hybrid",
    "count": 5,
    "requestQuality": { "label": "weak" },
    "retrievalTrace": {
      "traceId": "tr_mr3kpu8s_jdg5np",
      "query": "spec folder context headers",
      "totalDurationMs": 1430,
      "finalResultCount": 5
    },
    "progressiveDisclosure": {
      "results": [
        { "snippet": "", "detailAvailable": false, "resultId": "7208" },
        { "snippet": "", "detailAvailable": false, "resultId": "6936" },
        { "snippet": "", "detailAvailable": false, "resultId": "4094" },
        { "snippet": "", "detailAvailable": false, "resultId": "3265" },
        {
          "snippet": "Packet: system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-resea...",
          "detailAvailable": true,
          "resultId": "13450"
        }
      ]
    },
    "results": [
      {
        "id": 7208,
        "specFolder": "system-spec-kit/z_archive/006-generate-context-subfolder",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/spec.md",
        "content": null,
        "contentError": "File not found"
      },
      { "id": 6936, "contentError": "File not found", "compact": true },
      { "id": 4094, "contentError": "File not found", "compact": true },
      { "id": 3265, "contentError": "File not found", "compact": true },
      { "id": 13450, "contentError": "File not found", "compact": true }
    ],
    "evidenceDigest": "5 results retrieved; avg score 0.59."
  },
  "hints": [
    "Some files could not be read - check file paths",
    "Token budget enforced: 4 of 5 results rendered compact to fit 3500 token budget"
  ],
  "meta": {
    "cacheHit": false,
    "tokenBudgetTruncated": true,
    "originalResultCount": 5,
    "returnedResultCount": 5
  }
}
```

Comparison against Expected: enabled/default mode did not return any result content with a prepended `[parent > child — description]` header; the only non-empty snippet observed was `Packet: system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-resea...`, not the expected bracketed header. Because returned result content was `null` or omitted with `contentError: "File not found"`, the 100-character header truncation condition could not be verified from content. Disabled mode also returned no content headers, but the required enabled-mode injection condition was not met.

### Pass / Fail

- **Fail**: Enabled/default mode returned spec-folder results with `content: null` or `contentError: "File not found"` instead of content prepended with `[parent > child — description]`; the observed non-empty snippet began with `Packet: ...`, so the expected enabled header injection and 100-character truncation signals were not verified.

### Failure Triage

Inspect `lib/search/hybrid-search.ts` `injectContextualTree`, `lib/search/search-flags.ts` `isContextHeadersEnabled`, and description cache population

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval_enhancements/contextual_tree_injection.md](../../feature_catalog/retrieval_enhancements/contextual_tree_injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 145
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval_enhancements/contextual_tree_injection_p1_4.md`
