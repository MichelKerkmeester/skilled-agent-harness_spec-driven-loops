---
title: "403 — Code-intent matching (implementation vs docs)"
description: "Question-form queries ('how does X work?') should rank the implementation file higher than its README. Probes whether the embedding distinguishes between explanatory and definitional content."
audited_post_018: true
version: 3.6.0.4
---

# 403 — Code-intent matching (implementation vs docs)

## 1. OVERVIEW

When an operator types a question-form query like "how does provider auto-cascade resolution work?", they want the IMPLEMENTATION (factory.ts:resolveProvider) — not the README that describes the implementation in prose. Code Graph semantic search must rank the implementation file higher than the doc, because the operator is looking for code to read/debug, not narrative to read.

The behavior is user-observable: developers asking implementation questions want source files; documentation queries can be a tiebreaker but should not dominate.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm implementation-over-docs ranking for code-intent queries.
- Real user request: `Verify that when I ask "how does X work?" through Code Graph, the implementation file outranks its README.`
- RCAF Prompt: `As a query_intelligence validation operator, fire 4 question-form code queries through Code Graph and report whether the implementation file ranks above its README in each top-5. Return a pass/fail verdict and a table of rank pairs.`
- Expected execution process: run 4 code-intent queries, identify implementation-file rank and README rank in each top-5, compare.
- Expected signals: implementation rank < README rank in ≥ 3 of 4 queries; both files are present in top-10.
- Desired user-visible outcome: `PASS — 3/4 queries rank implementation above README; the 1 inversion was a tied-content tiebreaker.`
- Pass/fail: PASS if implementation outranks README in ≥ 3 of 4; PARTIAL if 2; FAIL if ≤ 1.

---

## 3. TEST EXECUTION

### Prompt

```
For each of 4 code-intent queries, check whether the implementation file ranks above its README in Code Graph top-5.
```

### Commands

**Query A — provider cascade:**
```
mcp__mk_code_index__code_graph_context({
  input: "how does embedding provider auto-cascade resolution work when no API keys are set",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/factory.ts` (impl) ranks above `shared/embeddings/README.md` (docs).

**Query B — ollama availability probe:**
```
mcp__mk_code_index__code_graph_context({
  input: "how does the system detect whether ollama runtime is installed",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/ollama-availability.ts` (impl) ranks above `shared/embeddings/providers/README.md` (docs).

**Query C — sqlite-vec virtual table creation:**
```
mcp__mk_code_index__code_graph_context({
  input: "how is the sqlite-vec virtual table created and queried for embeddings",
  queryMode: "neighborhood",
})
```
Expected: `mcp_server/lib/search/vector-index-store.ts` or `vector-index-impl.ts` (impl) ranks above `references/memory/embedding_resilience.md` (docs).

**Query D — profile-keyed DB filename:**
```
mcp__mk_code_index__code_graph_context({
  input: "how is the active profile sqlite filename derived from provider model dim and dtype",
  queryMode: "neighborhood",
})
```
Expected: `shared/embeddings/profile.ts:resolveActiveProfileDbPath` (impl) ranks above `mcp_server/INSTALL_GUIDE.md` (docs).

For each query, capture:
- The rank of the implementation file.
- The rank of the doc/README file that explains the same concept.
- A boolean: implementation ranked above doc?

### Expected

A table like:
```
| Query | Impl file               | Impl rank | Doc file                          | Doc rank | Impl > Doc? |
|-------|-------------------------|----------:|-----------------------------------|---------:|------------|
| A     | factory.ts              | 1         | shared/embeddings/README.md       | 4        | YES         |
| B     | ollama-availability.ts| 2         | providers/README.md               | 6        | YES         |
| C     | vector-index-store.ts   | 1         | embedding_resilience.md           | 5        | YES         |
| D     | profile.ts              | 3         | INSTALL_GUIDE.md                  | 2        | NO          |
```

### Evidence

- The exact `mcp__mk_code_index__code_graph_context` payload for each query.
- The top-10 result paths for each query.
- The rank-pair table above.
- An honest assessment: if implementation ranks below docs, IS the doc actually a better answer for this query? (Sometimes the inversion is correct — INSTALL_GUIDE may be more authoritative for setup-related questions.)
- Active provider (memory_health) at time of test.

Observed 2026-07-03 in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

Direct Code Graph MCP status available in this session:

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

The exact payloads required by this scenario were run through the daemon-backed `code_graph_context` CLI surface because the direct `mcp__mk_code_index__code_graph_context` tool was not exposed in this session.

Query A payload:

```json
{"input":"how does embedding provider auto-cascade resolution work when no API keys are set","queryMode":"neighborhood"}
```

Query A output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Query B payload:

```json
{"input":"how does the system detect whether ollama runtime is installed","queryMode":"neighborhood"}
```

Query B output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Query C payload:

```json
{"input":"how is the sqlite-vec virtual table created and queried for embeddings","queryMode":"neighborhood"}
```

Query C output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Query D payload:

```json
{"input":"how is the active profile sqlite filename derived from provider model dim and dtype","queryMode":"neighborhood"}
```

Query D output:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Retried `code_graph_status` through the same CLI surface:

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Active provider via `memory_health` could not be observed. Direct MCP retries returned:

```text
MCP error -32001: backend recycled; retry
```

Daemon-backed `memory_health` returned:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Top-10 result paths: unavailable for all four queries because `code_graph_context` did not execute successfully.

Rank-pair table:

```markdown
| Query | Impl file | Impl rank | Doc file | Doc rank | Impl > Doc? |
|-------|-----------|----------:|----------|---------:|------------|
| A | shared/embeddings/factory.ts | unavailable | shared/embeddings/README.md | unavailable | BLOCKED |
| B | shared/embeddings/ollama-availability.ts | unavailable | shared/embeddings/providers/README.md | unavailable | BLOCKED |
| C | mcp_server/lib/search/vector-index-store.ts or vector-index-impl.ts | unavailable | references/memory/embedding_resilience.md | unavailable | BLOCKED |
| D | shared/embeddings/profile.ts:resolveActiveProfileDbPath | unavailable | mcp_server/INSTALL_GUIDE.md | unavailable | BLOCKED |
```

Honest assessment: no implementation-vs-doc ranking assessment is possible because Code Graph returned no ranked results. The missing precondition is a reachable Code Graph backend at `/tmp/mk-code-index/daemon-ipc.sock`; active provider evidence is also blocked by stale Spec Memory MCP dist output.

### Pass/Fail

BLOCKED — Code Graph `code_graph_context` could not execute because the backend socket `/tmp/mk-code-index/daemon-ipc.sock` was absent (`exitCode: 75`), and `memory_health` active-provider evidence was unavailable because the Spec Memory MCP backend reported stale dist.
