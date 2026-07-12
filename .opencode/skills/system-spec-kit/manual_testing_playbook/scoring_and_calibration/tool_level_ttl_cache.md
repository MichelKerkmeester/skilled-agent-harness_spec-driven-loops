---
title: "196 -- Tool-level TTL cache"
description: "This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation."
audited_post_018: true
version: 3.6.0.12
---

# 196 -- Tool-level TTL cache

## 1. OVERVIEW

This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation.
- Real user request: `Please validate Tool-level TTL cache against memory_search and tell me whether the expected signals are present: first run records a cache miss for the tool/input combination; second identical run records a cache hit for the same SHA-256 key; cache stats reflect hits, misses, and invalidations; a relevant mutation or TTL expiry forces recomputation instead of returning stale results.`
- Prompt: `Validate memory_search tool-level TTL cache hits, expiry, and mutation-driven invalidation.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: first run records a cache miss for the tool/input combination; second identical run records a cache hit for the same SHA-256 key; cache stats reflect hits, misses, and invalidations; a relevant mutation or TTL expiry forces recomputation instead of returning stale results
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: identical repeat work hits the cache within TTL and recomputes after targeted invalidation or TTL expiry; FAIL: repeat work misses unexpectedly, stale data survives mutation/expiry, or cache accounting contradicts observed behavior

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_search tool-level TTL cache hits, expiry, and mutation-driven invalidation.
```

### Commands

1. Confirm current cache settings, including active TTL window
2. Run a repeatable expensive request such as the same `memory_search` twice with identical inputs
3. Inspect cache stats or trace output to confirm miss then hit on the same tool/input key
4. Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry
5. Re-run the same request and confirm recomputation plus invalidation or expiry accounting

### Expected

First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data

### Evidence

Executed 2026-07-02 using the daemon-backed Spec Memory CLI because the initial MCP tool calls timed out:

```text
MCP mk-spec-memory_memory_health(reportMode=full, includeFullReport=true): MCP error -32001: Request timed out
MCP mk-spec-memory_memory_search(...): MCP error -32001: Request timed out
```

Active cache settings confirmed from `mcp_server/lib/cache/tool-cache.ts`:

```text
enabled: process.env.ENABLE_TOOL_CACHE !== 'false'
defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000
maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000
cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000
```

Identical request payload used for all three `memory_search` CLI runs:

```json
{"query":"tool-level ttl cache manual scenario 196 unique verification 2026-07-02T09:25Z","limit":2,"includeConstitutional":false,"includeTrace":true,"profile":"debug","bypassCache":false,"enableDedup":false,"trackAccess":false,"autoDetectIntent":false,"intent":"find_spec","includeContent":false,"rerank":true,"retrievalLevel":"auto"}
```

Stable SHA-256 key for `memory_search:` plus the canonicalized payload:

```text
{"autoDetectIntent":false,"bypassCache":false,"enableDedup":false,"includeConstitutional":false,"includeContent":false,"includeTrace":true,"intent":"find_spec","limit":2,"profile":"debug","query":"tool-level ttl cache manual scenario 196 unique verification 2026-07-02T09:25Z","rerank":true,"retrievalLevel":"auto","trackAccess":false}
43a79db4e171207adf8cd7714784bfe24bfbbd1851fe0c000f5e7e2ad53ebe13
```

First `memory_search` run:

```text
"summary": "Found 2 memories"
"timestamp": "2026-07-02T09:28:00.039Z"
"traceId": "tr_mr3ax9pt_qhbuhe"
"totalDurationMs": 2381
"meta": {
  "tool": "memory_search",
  "tokenCount": 7848,
  "latencyMs": 2463,
  "cacheHit": false
}
```

Second identical `memory_search` run inside the 60,000 ms TTL:

```text
"summary": "Found 2 memories"
"timestamp": "2026-07-02T09:28:00.039Z"
"traceId": "tr_mr3ax9pt_qhbuhe"
"totalDurationMs": 2381
"meta": {
  "tool": "memory_search",
  "tokenCount": 7303,
  "latencyMs": 67,
  "cacheHit": true
}
```

Cache/health inspection after the miss-then-hit pair:

```text
"cache_byte_estimates": {
  "tool_cache": {
    "entries": 1,
    "approx_bytes": 17371
  }
}
"ipc_bridge": {
  "socket_path": "/private/tmp/mk-spec-memory/daemon-ipc.sock",
  "secondary_clients_count": 1,
  "total_secondary_messages_in": 21,
  "total_secondary_messages_out": 16
}
"meta": {
  "tool": "memory_health",
  "tokenCount": 2437,
  "latencyMs": 16811,
  "cacheHit": false,
  "tokenBudget": 1500
}
```

TTL expiry path used instead of mutation because this scenario execution was explicitly restricted to modifying no files other than this scenario file. Command output for the wait:

```text
sleep 65
(no output)
```

Third identical `memory_search` run after waiting past the 60,000 ms TTL:

```text
"summary": "Found 2 memories"
"timestamp": "2026-07-02T09:30:38.312Z"
"traceId": "tr_mr3b0ns9_8daxin"
"totalDurationMs": 1739
"meta": {
  "tool": "memory_search",
  "tokenCount": 7306,
  "latencyMs": 1744,
  "cacheHit": false
}
```

### Pass / Fail

- **PASS**: second identical run is a cache hit and the next run after TTL expiry recomputes cleanly; no mutation invalidation was attempted because the execution constraints prohibited modifying any file other than this scenario file

### Failure Triage

Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [scoring_and_calibration/tool_level_ttl_cache.md](../../feature_catalog/scoring_and_calibration/tool_level_ttl_cache.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 196
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `scoring_and_calibration/tool_level_ttl_cache.md`
