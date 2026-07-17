---
title: "281 -- Embedder list registry inventory"
description: "Validates embedder_list reports supported embedders, dimensions, provider tags, and active status."
audited_post_017: true
version: 3.6.0.1
id: tooling-and-scripts-embedder-list-registry-inventory
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 281 -- Embedder list registry inventory

## 1. OVERVIEW

This scenario covers the new embedder inventory MCP surface from packet 016/003.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_list happy path and registry shape.
- Real user request: `List the available mk-spec-memory embedders and tell me which one is active.`
- RCAF Prompt: `Run embedder_list and verify each embedder entry includes name, dimensions, provider, and active/install status.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - At least one embedder is listed. - One active embedder is identifiable. - Dimension/provider metadata is present for every entry.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_list and verify each embedder entry includes name, dimensions, provider, and active/install status.
```

### Commands

1. `embedder_list({})`
2. Verify every returned entry includes `name`, `dimensions`, `provider`, and `status`/`active` fields.
3. Confirm exactly one active embedder is reported.

### Expected Output / Verification

- At least one embedder is listed.
- One active embedder is identifiable.
- Dimension/provider metadata is present for every entry.

### Evidence

Command run: `embedder_list({})`

Actual output:

```json
{
  "summary": "Listed 1 embedders",
  "data": [
    {
      "name": "nomic-embed-text-v1.5",
      "dim": 768,
      "backend": "ollama",
      "active": true,
      "ready": true,
      "notes": "Drop-in 768-dim swap candidate. Retrieval-specialist trained on 235M pairs with hard negatives. Requires prefix tokens. Local-first cascade default per ADR-014."
    }
  ],
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call.",
    "Session priming: loaded 10 constitutional memories and code graph status unavailable",
    "primePackage: available in meta.sessionPriming.primePackage",
    "Code graph: empty",
    "Recommended next calls: code_graph_scan, memory_context({ input: \"resume previous work\", mode: \"resume\", profile: \"resume\" })",
    "Session priming trimmed to fit the 1000 token budget; full constitutional content remains retrievable via memory_search"
  ],
  "meta": {
    "tool": "embedder_list",
    "tokenCount": 678,
    "latencyMs": 4,
    "cacheHit": false,
    "sessionPriming": {
      "trimmed": true,
      "constitutionalCount": 10,
      "primePackage": {
        "specFolder": null,
        "currentTask": null,
        "codeGraphStatus": "empty",
        "recommendedCalls": [
          "code_graph_scan",
          "memory_context({ input: \"resume previous work\", mode: \"resume\", profile: \"resume\" })"
        ],
        "structuralContext": {
          "status": "missing",
          "summary": "No structural context available — code graph is empty or unavailable",
          "recommendedAction": "Call session_bootstrap first. Then run code_graph_scan if structural context is needed.",
          "sourceSurface": "auto-prime",
          "provenance": {
            "producer": "session_snapshot",
            "sourceSurface": "auto-prime",
            "trustState": "absent",
            "generatedAt": "2026-07-02T21:00:24.354Z",
            "lastUpdated": null,
            "sourceRefs": [
              "code-graph-db",
              "session-snapshot"
            ]
          }
        },
        "routingRules": {
          "graphRetrieval": "For broad topic questions, use memory_search with retrievalLevel: \"global\" for community-level results. For specific memories, use \"local\" (default). Use \"auto\" for automatic fallback.",
          "communitySearch": "When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.",
          "toolRouting": "SEARCH ROUTING: exact text/regex → Grep"
        }
      }
    },
    "tokenBudget": 1000,
    "sessionPrimingTrimmed": true
  }
}
```

Verification observations:

- At least one embedder is listed: `data` contains 1 entry.
- One active embedder is identifiable: `nomic-embed-text-v1.5` has `active: true`.
- Dimension/provider metadata is not present using the required field names for every entry: the entry includes `dim: 768` and `backend: "ollama"`, but does not include `dimensions` or `provider` fields.

### Pass/Fail

FAIL — `embedder_list({})` returned one active embedder, but the entry omitted the required `dimensions` and `provider` fields.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 281
- Tool: `embedder_list`
