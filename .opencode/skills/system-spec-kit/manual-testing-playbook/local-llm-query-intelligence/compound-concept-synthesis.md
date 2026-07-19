---
title: "408 — Compound concept synthesis"
description: "Fire a query whose answer is not stated in any single document — operator must synthesize from 2-3 sources. Verify top-3 returns the constituent docs that together compose the answer."
audited_post_018: true
version: 3.6.0.6
id: local-llm-query-intelligence-compound-concept-synthesis
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 408 — Compound concept synthesis

## 1. OVERVIEW

Not every answer lives in one file. A query like "how does the auto-migration from hf-local to ollama interact with the cascade fallback when ollama warmup fails?" requires synthesis across:
- `factory.ts:resolveProvider` (cascade order)
- `factory.ts` cascade fallback logic
- `context-server.ts` auto-migration trigger
- `018-ollama-auto-migration/implementation-summary.md` (operational narrative)

A good ranker brings these together in top-K so the operator can synthesize. A poor ranker hits one and stops.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm compound-question retrieval surfaces multiple constituent sources.
- Real user request: `Verify that a compound question whose answer is not in any single file returns the constituent sources in top-3, allowing me to synthesize.`
- RCAF Prompt: `As a query-intelligence validation operator, fire a compound question requiring multi-source synthesis, and verify top-3 returns ≥ 2 of the 3-4 expected constituent files. Return a pass/fail verdict with the source-set table.`
- Expected execution process: fire compound query, identify the expected constituent source set, check which constituents appear in top-3 / top-5 / top-10.
- Expected signals: after deduplicating mirrored runtime paths (`.opencode`, `.opencode`, `.claude`) to one constituent hit, at least 2 of the 4 expected constituents appear in top-3 and at least 3 in top-5.
- Desired user-visible outcome: `PASS — top-3 includes 3 of 4 expected constituents (the missing one was in rank 6, still close).`
- Pass/fail: PASS if >= 2/4 deduped constituents are in top-3 AND >= 3/4 are in top-5; PARTIAL if 2/4 are in top-3 but < 3/4 are in top-5; FAIL if < 2/4 are in top-3.

---

## 3. TEST EXECUTION

### Prompt

```
Fire a compound question about auto-migration + cascade fallback + warmup failure interaction, and verify the constituent sources appear in top-K.
```

### Commands

```
mcp__mk_code_index__code_graph_query({
  query: "what happens when ollama auto-migration starts but the provider warmup fails — does the cascade fall back to hf-local or does migration error out?",
  num_results: 10,
})
```

Expected constituent files (the 4 sources whose union answers the question):
1. `shared/embeddings/factory.ts` — cascade fallback logic (resumes cascade on warmup failure)
2. `mcp-server/context-server.ts` — auto-migration trigger and failure path
3. `shared/embeddings/providers/ollama.ts` — provider warmup implementation
4. `<spec-folder>` - operator narrative

For each, capture rank in the top-10 (or `>10` if absent).

### Expected

```
| Expected source                          | Rank in top-10 |
|------------------------------------------|---------------:|
| factory.ts (cascade fallback)            | 1              |
| context-server.ts (auto-migration entry) | 3              |
| ollama.ts (warmup impl)               | 2              |
| 018-ollama-auto-migration summary       | 7              |
```

Summary:
- In top-3: 3 of 4 constituents (factory, ollama, context-server)
- In top-5: 3 of 4 (017 summary still at rank 7)
- In top-10: all 4

→ PASS (3/4 in top-3 + 3/4 in top-5)

### Evidence

- Compound query verbatim:

  ```
  what happens when ollama auto-migration starts but the provider warmup fails — does the cascade fall back to hf-local or does migration error out?
  ```

- Requested MCP command from this scenario could not be run exactly because `mcp__mk_code_index__code_graph_query` was not registered in this runtime. Native code graph status output was:

  ```
  plugin_id=mk-code-graph
  cache_ttl_ms=5000
  spec_folder=auto
  resume_mode=minimal
  messages_transform_enabled=true
  messages_transform_mode=schema_aligned
  runtime_ready=false
  node_binary=node
  bridge_timeout_ms=15000
  bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs
  last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
  cache_entries=0
  cache=empty
  ```

- Daemon-backed CLI tool discovery confirmed `code_graph_query` exists:

  ```
  code_graph_scan
  code_graph_query
  code_graph_status
  code_graph_context
  code_graph_classify_query_intent
  code_graph_verify
  code_graph_apply
  detect_changes
  ```

- Attempted CLI equivalent of the scenario command:

  ```bash
  node ".opencode/bin/code-index.cjs" code_graph_query --json '{"query":"what happens when ollama auto-migration starts but the provider warmup fails — does the cascade fall back to hf-local or does migration error out?","num_results":10}' --format json --timeout-ms 120000
  ```

  Actual output:

  ```json
  {
    "status": "error",
    "error": "Missing required fields: operation, subject",
    "exitCode": 64
  }
  ```

- Full top-10 result paths: not available because the scenario command did not execute successfully and returned no retrieval results.

- Constituent-rank table:

  | Expected source                          | Rank in top-10 |
  |------------------------------------------|---------------:|
  | factory.ts (cascade fallback)            | >10            |
  | context-server.ts (auto-migration entry) | >10            |
  | ollama.ts (warmup impl)                  | >10            |
  | 018-ollama-auto-migration summary        | >10            |

- Operator synthesis narrative: no; an operator would not be able to assemble the answer from the top-3 because no top-3 retrieval set was produced.

- Missing or buried constituent note: all four constituents are absent from observed top-K because retrieval was blocked by tool/runtime mismatch, not because of corpus sparsity, embedding mismatch, or genuine irrelevance.

- Active provider from `memory_health`: not available. `mk_spec_memory_status` returned:

  ```
  plugin_id=mk-spec-memory
  enabled=true
  disabled_reason=none
  cache_ttl_ms=5000
  max_brief_chars=2400
  max_cache_entries=200
  runtime_ready=false
  node_binary=node
  bridge_timeout_ms=3000
  cli_timeout_ms=2500
  bridge_path=[spec-memory-bridge]
  last_bridge_status=fail_open
  last_error_code=EXIT_69
  last_duration_ms=57
  bridge_invocations=8
  continuity_lookups=7
  cache_entries=0
  cache_hits=0
  cache_misses=7
  cache_hit_rate=0
  warm_status=fail_open
  warm_error=EXIT_69
  warm_route=cli
  warm_retryable=false
  warm_exit_code=69
  ```

  `node ".opencode/bin/spec-memory.cjs" --help` and `node ".opencode/bin/spec-memory.cjs" list-tools --format text` both returned:

  ```
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
  ```

### Pass/Fail

BLOCKED — The required MCP query tool was not registered, the CLI equivalent rejected the scenario's `query`/`num_results` arguments with `Missing required fields: operation, subject`, and `memory_health` was unavailable because `@spec-kit/mcp-server dist is stale`.

## 4. NOTES

This scenario stresses **retrieval breadth**, not depth. A top-3 with 3 different constituent sources is BETTER than a top-3 with 3 paragraphs from the same file, even if that single file has the longest individual coverage.

If a single doc happens to comprehensively answer the question (rare, but possible), that's actually a corpus-quality win — note it explicitly and pass the test.
