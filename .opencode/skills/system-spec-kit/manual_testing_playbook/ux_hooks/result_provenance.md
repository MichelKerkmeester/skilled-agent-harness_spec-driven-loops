---
title: "217 -- Result provenance (graph evidence)"
description: "Validates the graphEvidence envelope on Stage 2 fusion output, including contributing edge IDs, community IDs, and boost factors per result."
audited_post_018: true
version: 3.6.0.5
---

# 217 -- Result provenance (graph evidence)

## 1. OVERVIEW

This scenario validates the per-result `graphEvidence` field that surfaces on Stage 2 fusion when graph signals contribute to ranking. It exercises the edge ID list, community ID list, boost factor breakdown, and the `SPECKIT_RESULT_PROVENANCE` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `graphEvidence` is attached to results that received graph-derived boosts and contains the contributing edge IDs, community IDs, and boost factors.
- Real user request: `Please validate graph evidence provenance on search results: prove graphEvidence is populated for graph-boosted results with edge IDs, communities, and boost factors, and that SPECKIT_RESULT_PROVENANCE=false strips the field.`
- Prompt: `Validate result provenance and confirm graphEvidence surfaces edge IDs, community IDs, and boost factors per result.`
- Expected execution process: Create a known causal edge, run a search that hits the boost, inspect the envelope, toggle the flag.
- Expected signals: graph-boosted results carry a `graphEvidence` object; the object includes contributing causal edge IDs with relation types, community IDs, and individual boost factors; results without graph contribution do not carry `graphEvidence`; `SPECKIT_RESULT_PROVENANCE=false` strips the field.
- Desired user-visible outcome: Pass/fail verdict with cited envelope evidence.
- Pass/fail: PASS when `graphEvidence` surfaces for graph-boosted results, contains documented fields, and the kill-switch strips the field. FAIL when the field is missing for boosted results, content is incomplete, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate result provenance and confirm graphEvidence surfaces edge IDs, community IDs, and boost factors per result.
```

### Commands

1. Pick two stable record IDs `<A>` and `<B>` already in `memory_index`. Pick a query `<Q>` where `<A>` is a strong match.
2. `memory_causal_link({ sourceId: "<A>", targetId: "<B>", relation: "supports", strength: 0.7 })` to create a known boost path.
3. `memory_search({ query: "<Q>", enableCausalBoost: true, includeTrace: true, limit: 10 })` and capture the response.
4. Locate `<B>` (or whichever boosted neighbor surfaces). Inspect its `graphEvidence` field.
5. Assert the field contains: a list of contributing edge IDs (including the one created in step 2) with their relation types; a list of community IDs the result belongs to (or empty if not in any community); a breakdown of boost factors that contributed to the final score.
6. Locate a result that did not receive a graph boost. Assert its envelope does not carry `graphEvidence` (or carries an empty/null value).
7. Set `SPECKIT_RESULT_PROVENANCE=false` in MCP env, restart, repeat step 3. Assert the `graphEvidence` field is absent on all results.
8. Cleanup: `memory_causal_unlink({ sourceId: "<A>", targetId: "<B>", relation: "supports" })`.
9. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/provenance-envelope.vitest.ts`.

### Expected

- Boosted result carries `graphEvidence` with edge IDs, communities, and boost factors.
- Unboosted result has no `graphEvidence`.
- Flag-off run strips the field on all results.
- Vitest exits 0.

### Evidence

- Scenario file read in full from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/ux_hooks/result_provenance.md`.
- Stable record IDs selected from `memory_list({ limit: 10, offset: 0, specFolder: "", sortBy: "importance_weight", includeChunks: false })`:
  ```json
  {
    "summary": "Found 10 memories",
    "data": {
      "total": 32758,
      "offset": 0,
      "limit": 10,
      "sortBy": "importance_weight",
      "includeChunks": false,
      "count": 10,
      "results": [
        {
          "id": 8,
          "specFolder": "system-spec-kit",
          "title": "TOOL ROUTING - Search & Retrieval Decision Tree",
          "createdAt": "2026-06-04T07:01:03.136Z",
          "updatedAt": "2026-06-05 15:26:09",
          "importanceWeight": 1,
          "triggerCount": 19,
          "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md",
          "compact": true
        },
        {
          "id": 13,
          "specFolder": "system-spec-kit",
          "title": "Spec-Folder Naming & Rename Convention",
          "createdAt": "2026-06-04T07:01:03.259Z",
          "updatedAt": "2026-06-11 09:32:52",
          "importanceWeight": 1,
          "triggerCount": 8,
          "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/constitutional/spec-folder-naming.md",
          "compact": true
        }
      ]
    }
  }
  ```
- Known causal edge creation with `memory_causal_link({ sourceId: "8", targetId: "13", relation: "supports", strength: 0.7, evidence: "Manual playbook result provenance scenario: create known boost path from strong query match A=8 to neighbor B=13.", tenantId: "", userId: "", agentId: "" })`:
  ```json
  {
    "summary": "Created causal link: 8 --[supports]--> 13",
    "data": {
      "success": true,
      "edge": 46937
    }
  }
  ```
- Native `memory_search` attempt for the default-on response could not produce an initial search response. Empty cursor was rejected:
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
        ]
      }
    }
  }
  ```
- Native `memory_search` retry with a non-empty placeholder cursor was rejected as a continuation cursor:
  ```json
  {
    "summary": "Error: Cursor is invalid, expired, or out of scope",
    "data": {
      "error": "Cursor is invalid, expired, or out of scope",
      "code": "E_VALIDATION",
      "details": {
        "parameter": "cursor"
      }
    },
    "hints": [
      "Retry the original search to generate a fresh continuation cursor"
    ]
  }
  ```
- Daemon CLI front door attempt for the same `memory_search` tool surface:
  ```bash
  node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"TOOL ROUTING - Search & Retrieval Decision Tree","specFolder":"system-spec-kit","enableCausalBoost":true,"includeTrace":true,"includeConstitutional":false,"limit":10,"bypassCache":true,"profile":"debug"}' --format json --timeout-ms 10000
  ```
  Output:
  ```text
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```
- Because no default-on `memory_search` response was available, no boosted result could be located and no `graphEvidence` content could be extracted. The flag-off run was not performed because the scenario was already blocked at the required default-on response, and MCP env restart was not available from this running tool session.
- Cleanup used the available causal-edge delete API, `memory_causal_unlink({ edgeId: 46937 })`:
  ```json
  {
    "summary": "Deleted causal edge 46937",
    "data": {
      "deleted": true
    }
  }
  ```
- Targeted Vitest command:
  ```bash
  npm exec -- vitest run tests/provenance-envelope.vitest.ts
  ```
  Output:
  ```text
   RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


   Test Files  1 passed (1)
        Tests  5 passed (5)
     Start at  01:15:35
     Duration  403ms (transform 246ms, setup 13ms, import 323ms, tests 6ms, environment 0ms)
  ```

### Pass / Fail

- **BLOCKED**: The scenario could not obtain the required default-on `memory_search` response because the native MCP tool rejected initial-search cursor parameters and the daemon CLI reported `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`; without that response, the boosted result, unboosted result, and flag-off provenance assertions could not be evaluated. The temporary causal edge was cleaned up and the targeted Vitest exited 0.

### Failure Triage

Inspect `mcp_server/lib/search/pipeline/stage2-fusion.ts` for the `graphEvidence` population step. Verify `mcp_server/formatters/search-results.ts` preserves the field in serialization. Check `mcp_server/lib/search/pipeline/types.ts` for the `graphEvidence` type definition. Confirm `SPECKIT_RESULT_PROVENANCE` is read at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux_hooks/result_provenance.md](../../feature_catalog/ux_hooks/result_provenance.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`, `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Ux hooks
- Playbook ID: 217
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/result_provenance.md`
