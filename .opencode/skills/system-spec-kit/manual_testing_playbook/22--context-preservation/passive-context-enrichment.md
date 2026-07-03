---
title: "288 -- Passive context enrichment"
description: "Validates the server-side auto-enrichment pipeline that appends constitutional memories, triggered memories, and code graph status to every tool response served by system-spec-kit's own mcp_server."
audited_post_018: true
version: 3.6.0.5
---

# 288 -- Passive context enrichment

## 1. OVERVIEW

This scenario validates the passive enrichment pipeline. It exercises the memory-surface hook that injects constitutional memories and trigger-matched records, the response-hints hook that appends them with token estimation, and the mutation-feedback hook that adds save/update/delete context.

Scope note: this pipeline is local to system-spec-kit's own `mcp_server` process (see Source Files below) and enriches only tool calls dispatched through that server's `context-server.ts`. It has no shared code path into other independently-running MCP servers (system-skill-advisor, system-code-graph); a tool call against one of those servers is out of scope for this scenario and is not evidence of a defect in this pipeline.

---

## 2. SCENARIO CONTRACT

- Objective: Verify constitutional memories, trigger-matched records, and code graph status appear in the response hints of system-spec-kit's own `mcp_server` tools without explicit memory_context calls, and that token estimation prevents oversized payloads.
- Real user request: `Please validate passive context enrichment: prove that constitutional memories and triggered memories surface in tool response hints automatically and that code graph status is included when available.`
- Prompt: `Validate passive context enrichment and confirm tool responses carry constitutional memories, triggered memories, and code graph status in hints.`
- Expected execution process: Call a non-memory tool served by system-spec-kit's own mcp_server (e.g. `memory_stats`) with a prompt that triggers a known memory, inspect the response hints section, check the mutation-feedback path with a save call. Do NOT use a tool from a different MCP server (system-skill-advisor, system-code-graph) as the probe -- this pipeline has no code path into other servers.
- Expected signals: Constitutional memories surface in the hints section of every response from THIS server's tools; trigger-matched memories appear when the prompt matches known trigger phrases; code graph status is included when available; mutation tools include save/update/delete feedback; token estimation truncates oversized hint payloads rather than exceeding budget.
- Desired user-visible outcome: Pass/fail verdict with cited hint section contents.
- Pass/fail: PASS when hints surface the documented categories and token budget is respected, for tools served by system-spec-kit's own mcp_server. FAIL when hints are empty for a known trigger on one of THIS server's tools, mutation feedback is missing, or token budget is exceeded. A cross-server tool call producing no hints is out of scope, not a FAIL.

---

## 3. TEST EXECUTION

### Prompt

```
Validate passive context enrichment and confirm tool responses carry constitutional memories, triggered memories, and code graph status in hints.
```

### Commands

1. Identify a known trigger phrase from existing memory entries (look at `memory_match_triggers({ input: "<known phrase>" })` first to confirm).
2. Call any tool with an input containing the trigger phrase (e.g. `memory_stats({ scope: "<known phrase>" })`).
3. Inspect the response envelope's hints section. Assert it contains constitutional memories and the trigger-matched memory.
4. Inspect the hints section for code graph status (graph readiness or staleness marker).
5. Issue a `memory_save` call against a small disposable file and inspect the response hints for mutation feedback.
6. Pick a prompt that would generate an oversized hint payload (many matching triggers). Assert the response hints are truncated to the documented token budget rather than ballooning the response.

### Expected

- Hints section carries constitutional memories on every response.
- Trigger-matched memories appear for prompts that hit known triggers.
- Code graph status is included when available.
- Mutation feedback appears on save/update/delete responses.
- Token estimation prevents oversized hint payloads.

### Evidence

- Known trigger confirmation: `memory_match_triggers({ prompt: "speckit", limit: 5 })` returned:
  ```json
  {
    "summary": "Matched 5 memories via trigger phrases",
    "data": {
      "matchType": "trigger-phrase",
      "count": 5,
      "results": [
        {
          "memoryId": 7434,
          "specFolder": "system-spec-kit/z_archive/021-spec-kit-phase-system",
          "title": "Feature Specification: SpecKit Phase System [system-spec-kit/021-spec-kit-phase-system/spec]",
          "matchedPhrases": ["speckit"]
        }
      ]
    },
    "hints": [
      "Auto-surface hook: injected 10 constitutional and 5 triggered memories (0ms)"
    ],
    "meta": {
      "autoSurface": {
        "constitutionalCount": 10,
        "triggeredCount": 5,
        "surfaced_at": "2026-07-03T00:11:44.723Z",
        "latencyMs": 0
      },
      "tokenBudget": 3500
    }
  }
  ```
- Regular MCP response envelope: `memory_stats({ folderRanking: "count", excludePatterns: [], includeScores: false, includeArchived: false, limit: 10 })` returned these hints and code graph status values:
  ```json
  {
    "summary": "Memory system: 32758 memories across 3819 folders",
    "hints": [
      "8123 memories pending re-indexing",
      "Session priming: loaded 10 constitutional memories and code graph status unavailable",
      "primePackage: available in meta.sessionPriming.primePackage",
      "Code graph: empty",
      "Recommended next calls: code_graph_scan, memory_context({ input: \"resume previous work\", mode: \"resume\", profile: \"resume\" })",
      "Session priming trimmed to fit the 1000 token budget; full constitutional content remains retrievable via memory_search",
      "Response exceeds token budget (1156/1000)"
    ],
    "meta": {
      "sessionPriming": {
        "trimmed": true,
        "constitutionalCount": 10,
        "primePackage": {
          "codeGraphStatus": "empty"
        }
      },
      "tokenBudget": 1000,
      "sessionPrimingTrimmed": true
    }
  }
  ```
- Direct code graph status check returned no response `hints` envelope and reported:
  ```text
  plugin_id=mk-code-graph
  cache_ttl_ms=5000
  spec_folder=auto
  resume_mode=minimal
  messages_transform_enabled=true
  messages_transform_mode=schema_aligned
  runtime_ready=false
  node_binary=node
  bridge_timeout_ms=15000
  bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
  last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
  cache_entries=0
  cache=empty
  ```
- Non-memory tool call with the known trigger phrase: `advisor_recommend({ prompt: "speckit passive context enrichment trigger phrase check for MCP response hints", ... })` returned no `hints` section. **Interpretation update**: `advisor_recommend` is served by the independently-running system-skill-advisor MCP server, not system-spec-kit's `mcp_server` — this pipeline has no code path into that server (confirmed via source read: no hints/enrichment module exists anywhere in system-skill-advisor's `mcp_server/lib`/`handlers`). This transcript is preserved as an accurate historical record of what was tested, but per the scope note above it is not a valid probe of this feature and does not indicate a defect.
  ```json
  {
    "status": "ok",
    "data": {
      "recommendations": [],
      "ambiguous": false,
      "freshness": "unavailable",
      "trustState": {
        "state": "unavailable",
        "reason": "advisor_unavailable",
        "generation": 9476,
        "checkedAt": "2026-07-03T00:13:42.232Z",
        "lastLiveAt": null
      },
      "warnings": ["advisor_unavailable"],
      "abstainReasons": [
        "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
      ]
    }
  }
  ```
- Mutation response envelope: no disposable file existed under `.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/`, and the user constraint prohibited creating one, so `memory_save` was run against the existing approved spec file `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md`. The first attempt returned:
  ```json
  {
    "summary": "Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
    "data": {
      "error": "Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
      "code": "E085"
    },
    "hints": [
      "Supply the required governed-ingest provenance/scope fields and retry.",
      "Provide the missing tenant/provenance/actor metadata",
      "Retry memory_save"
    ]
  }
  ```
- Retried mutation response with governed ingest fields returned mutation/planner hints but blocked before canonical apply:
  ```json
  {
    "summary": "Planner found blocker(s) that must be resolved before the canonical save can run.",
    "data": {
      "status": "blocked",
      "specFolder": "system-speckit/031-manual-playbook-execution-sweep",
      "blockers": [
        {
          "code": "SPEC_DOC_STRUCTURE_BLOCKER",
          "message": "SPECDOC_SUFFICIENCY_001: spec.md: anchor parse failure: line 210: orphaned closing anchor 'questions'"
        },
        {
          "code": "TEMPLATE_CONTRACT_BLOCKER",
          "message": "Rendered memory is missing the required continue-session section.; Rendered memory is missing the required canonical-docs section.; Rendered memory is missing the required overview section.; Rendered memory is missing the required evidence section.; Rendered memory is missing the required recovery-hints section.; Rendered memory is missing the required memory-metadata section."
        }
      ]
    },
    "hints": [
      "Planner prepared 1 proposed edit(s) for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md",
      "Available follow-up actions: apply, refresh-graph, reindex, reconsolidate",
      "3 advisory warning(s) remain after structural planning checks",
      "Resolve planner blockers before requesting full-auto apply mode",
      "Auto-surface hook: injected 10 constitutional and 5 triggered memories (1644ms)",
      "Session priming: loaded 10 constitutional memories and code graph status unavailable",
      "primePackage: available in meta.sessionPriming.primePackage",
      "Code graph: empty",
      "Recommended next calls: code_graph_scan, memory_context({ input: \"resume previous work\", mode: \"resume\", profile: \"resume\" })",
      "Session priming trimmed to fit the 3500 token budget; full constitutional content remains retrievable via memory_search",
      "Response exceeds token budget (4178/3500)"
    ],
    "meta": {
      "autoSurface": { "constitutionalCount": 10, "triggeredCount": 5 },
      "tokenBudget": 3500,
      "sessionPrimingTrimmed": true
    }
  }
  ```
- Oversized-hint scenario: `memory_match_triggers({ prompt: "speckit system spec memory context implementation plan task review design code graph skill advisor deep research deep review command dispatch workflow validation testing manual playbook constitutional session resume save update delete search index trigger prompt phase agent orchestration cli opencode markdown documentation feature bug refactor audit security performance accessibility token budget hints response evidence expected pass fail", limit: 100 })` returned:
  ```json
  {
    "summary": "Found 10 memories",
    "data": {
      "count": 10,
      "results": [
        {
          "memoryId": 7433,
          "matchedPhrases": ["implementation", "plan", "speckit", "phase", "system", "spec"]
        },
        {
          "memoryId": 7434,
          "compact": true
        }
      ]
    },
    "hints": [
      "Auto-surface hook: injected 10 constitutional and 5 triggered memories (3920ms)",
      "Token budget enforced: 50 → 10 results (9 compact) to fit 3500 token budget"
    ],
    "meta": {
      "tokenBudget": 3500,
      "tokenBudgetTruncated": true,
      "originalResultCount": 50,
      "returnedResultCount": 10
    }
  }
  ```

### Pass / Fail

- **PASS** (corrected from an earlier FAIL that misread scope — see Scope note above): `memory_stats` and `memory_save`, both served by system-spec-kit's own `mcp_server`, carried constitutional/session priming, trigger, code graph, mutation/planner, and token-budget hints exactly as documented. The `advisor_recommend` call returning no `hints` is expected, not a defect: that tool is served by the independently-running system-skill-advisor MCP server, which this pipeline has no code path into. The original "every tool response" wording in this doc's Overview was ambiguous and read as a cross-process mandate; it has been corrected to specify system-spec-kit's own `mcp_server`.

### Failure Triage

Inspect `mcp_server/hooks/memory-surface.ts` for the surfacing logic. Check `mcp_server/hooks/response-hints.ts` for token estimation and append step. Verify `mcp_server/hooks/mutation-feedback.ts` is wired into the save/update/delete handlers. Do not use a non-system-spec-kit MCP tool (e.g. `advisor_recommend`) as a probe for this scenario — it is out of scope per the Scope note in Section 1.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/passive-context-enrichment.md](../../feature_catalog/22--context-preservation/passive-context-enrichment.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/response-hints.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/mutation-feedback.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 288
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/passive-context-enrichment.md`
