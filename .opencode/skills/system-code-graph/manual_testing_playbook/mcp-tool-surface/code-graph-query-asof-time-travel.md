---
title: "026 -- code_graph_query asOf time-travel relationship reads"
description: "Verify the asOf parameter on code_graph_query routes relationship reads through the bitemporal as-of readers when the flag is on and falls back to the live read when it is off."
trigger_phrases:
  - "026 asof scenario"
  - "code graph as-of time travel testing"
importance_tier: "important"
contextType: "verification"
version: 1.3.0.0
---

# 026 -- `code_graph_query` asOf time-travel relationship reads

## 1. OVERVIEW

This scenario validates the `asOf` parameter on `code_graph_query`. A non-negative integer `asOf` opts the relationship reads (`calls_from`, `calls_to`, `imports_from`, `imports_to`) into a time-travel read against a prior graph generation. The behavior is gated by `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`. When the flag is on, the read routes through the as-of readers and honors preserved `valid_at`/`invalid_at` edge history. When the flag is off, `asOf` is accepted but the read falls back to the live reader so callers never see a hard error.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `asOf` reaches the as-of relationship readers under the bitemporal-reads flag and degrades to a live read when the flag is off.
- Real user request: `Validate the as-of query parameter on code_graph_query: with the bitemporal-reads flag on, an asOf generation should return the historical edge set, and with the flag off the same call should fall back to the current graph without erroring.`
- Prompt: `Validate code_graph_query asOf time-travel against the bitemporal-reads flag and report cited pass/fail evidence.`
- Expected execution process: Run the documented command sequence, capture the responses, compare the observed edge sets against the expected signals and return the pass/fail verdict.
- Expected signals: a live read (no asOf) returns the current edges, an asOf read with the flag on returns the generation-scoped edge set and an asOf read with the flag off matches the live read.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the flag-on asOf read is generation-scoped and the flag-off asOf read falls back to live.

---

## 3. TEST EXECUTION

### Preconditions

- Code graph index is `fresh` (verify via `code_graph_status`).
- The graph has at least one preserved generation. With the bitemporal writer active a reindex closes prior edges rather than deleting them, so an earlier generation number is readable.

### Commands

1. **Live baseline (no asOf):**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "imports_from",
     subject: ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
   })
   ```
   Expected: returns the current import edges. `status` not `blocked`.

2. **As-of read with the flag on:** set `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=true`, then read a prior generation.
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "imports_from",
     subject: ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts",
     asOf: 1
   })
   ```
   Expected: returns the edge set as it stood at generation `1`, which can differ from the live baseline. The read routes through the as-of reader rather than the live reader.

3. **As-of read with the flag off:** unset `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`, then repeat the same `asOf` call. Expected: the response matches the live baseline from step 1. `asOf` is accepted, the read falls back to the live reader, and no error is raised.

4. **Non-relationship operation ignores asOf:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "outline",
     subject: ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts",
     asOf: 1
   })
   ```
   Expected: `outline` returns the current file symbols unchanged. `asOf` only applies to the four relationship operations.

### Expected

The flag-on asOf read is generation-scoped against preserved edge history, the flag-off asOf read falls back to the live edge set and a non-relationship operation ignores asOf.

### Evidence

Precondition check via MCP/plugin status:

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

Precondition check via daemon-backed CLI fallback:

```bash
node ".opencode/bin/code-index.cjs" code_graph_status --format json --timeout-ms 3000
```

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

The documented relationship and outline commands were not run because the required precondition, `Code graph index is fresh (verify via code_graph_status)`, could not be verified. The MCP/plugin bridge reported `runtime_ready=false`, and the same `code_graph_status` surface through the CLI fallback reported `backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock` with `exitCode: 75`.

### Pass / Fail

- **BLOCKED**: required `code_graph_status` precondition could not be satisfied; MCP/plugin bridge reported `runtime_ready=false` and CLI fallback reported `backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock` with `exitCode: 75`.

### Failure Triage

Inspect the asOf routing in `mcp_server/handlers/query.ts` (the `readInboundRelationshipEdges`/`readOutboundRelationshipEdges` helpers and the `asOf` coercion that admits only non-negative integers). Confirm the as-of readers `asOfEdgesFrom`/`asOfEdgesTo` and the live-reader `invalid_at` filter in `mcp_server/lib/code-graph-db.ts`. Confirm the `asOf` property on the tool input schema in `mcp_server/tool-schemas.ts`.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Handler: `mcp_server/handlers/query.ts`
- Schema: `mcp_server/tool-schemas.ts`
- Bitemporal readers and live-reader filter: `mcp_server/lib/code-graph-db.ts`

---

## 5. SOURCE METADATA

- Group: MCP Tool Surface
- Playbook ID: 026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-tool-surface/code-graph-query-asof-time-travel.md`
