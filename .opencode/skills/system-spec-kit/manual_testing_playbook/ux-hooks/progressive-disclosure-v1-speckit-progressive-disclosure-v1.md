---
title: "168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE)"
description: "This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response."
version: 3.6.0.15
---

# 168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE)

## 1. OVERVIEW

This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response.

---

## 2. SCENARIO CONTRACT


- Objective: Verify full results are preserved while additive disclosure metadata and cursor pagination are exposed.
- Real user request: `` Please validate Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE) against memory_search({ query: "broad query", limit: 20 }) and tell me whether the expected signals are present: `data.results` remains present; `data.progressiveDisclosure.summaryLayer` with count and digest; `data.progressiveDisclosure.results` as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5). ``
- Prompt: `Validate progressive disclosure v1 metadata and cursor pagination for broad memory_search results.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `data.results` remains present; `data.progressiveDisclosure.summaryLayer` with count and digest; `data.progressiveDisclosure.results` as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if response preserves full results, adds disclosure metadata, and next-page retrieval works via cursor; FAIL if hard truncation replaces results or disclosure metadata is missing

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify additive disclosure payload and cursor pagination against memory_search({ query: "broad query", limit: 20 }). Verify full data.results; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query: "broad query", limit: 20 })`
2. Verify full `data.results` remains present
3. Verify `data.progressiveDisclosure` shape
4. Extract continuation cursor
5. Re-request with `memory_search({ cursor })` for next page
6. `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts`

### Expected

full `data.results`; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min

### Evidence

`memory_search({ query: "broad query", limit: 20 })` response excerpt observed via MCP:

```json
{
  "summary": "Found 5 memories (2 constitutional)",
  "data": {
    "searchType": "multi-concept",
    "count": 5,
    "constitutionalCount": 2,
    "progressiveDisclosure": {
      "summaryLayer": {
        "count": 5,
        "digest": "5 weak"
      },
      "results": [
        {
          "snippet": "",
          "detailAvailable": false,
          "resultId": "37943"
        },
        {
          "snippet": "",
          "detailAvailable": false,
          "resultId": "26780"
        },
        {
          "snippet": "",
          "detailAvailable": false,
          "resultId": "23272"
        },
        {
          "snippet": "---\ntitle: \"TOOL ROUTING - Search & Retrieval Decision Tree\"\nimportanceTier: constitutional\ncontextT...",
          "detailAvailable": true,
          "resultId": "16264"
        },
        {
          "snippet": "---\ntitle: \"TOOL ROUTING - Search & Retrieval Decision Tree\"\nimportanceTier: constitutional\ncontextT...",
          "detailAvailable": true,
          "resultId": "9372"
        }
      ],
      "continuation": null
    },
    "results": [
      {
        "id": 37943,
        "specFolder": "system-speckit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness/spec.md",
        "title": "Feature Specification: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)",
        "score": 0.5474123200000001
      },
      {
        "id": 26780,
        "specFolder": "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness/spec.md",
        "title": "Feature Specification: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)",
        "score": 0.5474123200000001
      },
      {
        "id": 23272,
        "specFolder": "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing/plan.md",
        "title": "Implementation Plan: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)",
        "score": 0.53432964
      },
      {
        "id": 16264,
        "specFolder": "system-spec-kit",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
        "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
        "score": 0.5139589460869564
      },
      {
        "id": 9372,
        "specFolder": "system-spec-kit",
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
        "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
        "score": 0.5139589460869564
      }
    ]
  }
}
```

Cursor pagination observation:

```text
data.progressiveDisclosure.continuation: null
```

No continuation cursor was available to extract, so `memory_search({ cursor })` could not be re-requested.

Daemon-backed CLI attempt for the documented payload:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Test transcript for `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts`:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:23533) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  57 passed (57)
   Start at  01:08:38
   Duration  687ms (transform 364ms, setup 15ms, import 515ms, tests 45ms, environment 0ms)
```

### Pass / Fail

- **FAIL**: full `data.results` remained present and `data.progressiveDisclosure.summaryLayer` plus five snippet records were present, but `data.progressiveDisclosure.continuation` was `null`, so the expected continuation cursor, remainingCount, cursor expiry, and next-page retrieval could not be verified.

### Failure Triage

Verify SPECKIT_PROGRESSIVE_DISCLOSURE env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux-hooks/progressive-disclosure.md](../../feature_catalog/ux-hooks/progressive-disclosure.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/progressive-disclosure.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 168
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux-hooks/progressive-disclosure-v1-speckit-progressive-disclosure-v1.md`
- audited_post_018: true
