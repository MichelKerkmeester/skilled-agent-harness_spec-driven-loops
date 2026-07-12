---
title: "067 -- Search pipeline safety"
description: "This scenario validates Search pipeline safety for `067`. It focuses on Confirm Sprint 8 pipeline safety fixes."
audited_post_018: true
version: 3.6.0.16
---

# 067 -- Search pipeline safety

## 1. OVERVIEW

This scenario validates Search pipeline safety for `067`. It focuses on Confirm Sprint 8 pipeline safety fixes.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm Sprint 8 pipeline safety fixes.
- Real user request: `Please validate Search pipeline safety against the documented validation surface and tell me whether the expected signals are present: Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions.`
- Prompt: `Validate search pipeline safety against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pipeline safely handles summary/lexical heavy queries with correct filtering and tokenization

---

## 3. TEST EXECUTION

### Prompt

```
Validate search pipeline safety against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. run summary/lexical heavy queries
2. inspect filters/tokenization
3. verify safety outcomes

### Expected

Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions

### Evidence

Targeted implementation validation command:

```bash
npx vitest run tests/sqlite-fts.vitest.ts tests/bm25-index.vitest.ts tests/channel-representation.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  3 passed (3)
      Tests  123 passed (123)
   Start at  15:25:56
   Duration  909ms (transform 472ms, setup 22ms, import 593ms, tests 90ms, environment 0ms)
```

Production heavy search query command:

```bash
node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"search pipeline safety FTS5 double-tokenization summary quality bypass quality floor RRF range mismatch heavy lexical query tokenization filters no unguarded exceptions NEAR/5 NOT crash OR tokenization heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term","limit":5,"minQualityScore":0.8}' --format json --timeout-ms 3000 --warm-only
```

Observed output:

```text
(node:97711) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "tools/call timed out",
  "exitCode": 75
}
```

Retry command:

```bash
node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"search pipeline safety FTS5 double-tokenization summary quality bypass quality floor RRF range mismatch heavy lexical query tokenization filters no unguarded exceptions NEAR/5 NOT crash OR tokenization heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term heavy-query-term","limit":5,"minQualityScore":0.8}' --format json --timeout-ms 10000 --warm-only
```

Observed output:

```text
(node:97953) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "backend unavailable: timeout",
  "exitCode": 75
}
```

Spec Memory status observed after the failed production query attempts:

```text
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
last_bridge_status=skipped
last_error_code=TIMEOUT
last_duration_ms=132
bridge_invocations=20
continuity_lookups=19
cache_entries=0
cache_hits=0
cache_misses=19
cache_hit_rate=0
warm_status=skipped
warm_error=TIMEOUT
warm_route=warm_probe
warm_retryable=true
warm_exit_code=75
```

Ad-hoc direct TypeScript probe attempts were not used as pass evidence because the runtime loader failed before executing the probe:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/
```

```text
ReferenceError: Database is not defined
    at <anonymous> (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/node_modules/@types/better-sqlite3/index.d.ts:159:10)
```

### Pass / Fail

- **BLOCKED**: Targeted implementation tests for FTS5/BM25 tokenization and channel representation passed, but the required production heavy search query could not be executed because the Spec Memory backend was unavailable (`runtime_ready=false`; CLI returned `exitCode: 75` with `tools/call timed out` and `backend unavailable: timeout`).

### Failure Triage

Inspect error handling in pipeline stages; verify filter boundary conditions; check tokenizer for malformed input handling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/search_pipeline_safety.md](../../feature_catalog/pipeline_architecture/search_pipeline_safety.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 067
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/search_pipeline_safety.md`
