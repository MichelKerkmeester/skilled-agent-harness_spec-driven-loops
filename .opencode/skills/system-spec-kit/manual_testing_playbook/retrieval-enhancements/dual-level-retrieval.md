---
title: "149 -- Dual-level retrieval"
description: "Validates the retrievalLevel parameter (local | global | auto) on memory_search and the auto-mode fallback to community search on weak results."
audited_post_018: true
version: 3.6.0.5
---

# 149 -- Dual-level retrieval

## 1. OVERVIEW

This scenario validates the `retrievalLevel` parameter on `memory_search`. It exercises the three modes (`local`, `global`, `auto`), confirms auto mode falls back to community search on weak results, and validates the `SPECKIT_DUAL_RETRIEVAL` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the three retrieval levels behave as documented and that auto mode falls back to community search when local retrieval is weak.
- Real user request: `Please validate dual-level retrieval: prove local, global, and auto modes work, that auto mode falls back to community search on weak results, and that SPECKIT_DUAL_RETRIEVAL=false reverts to single-level behavior.`
- Prompt: `Validate dual-level retrieval modes and confirm auto-mode fallback fires on weak local results.`
- Expected execution process: Run the same query with each level, compare results, force weak local retrieval to trigger fallback, toggle the kill-switch.
- Expected signals: `retrievalLevel: "local"` runs only standard retrieval channels; `retrievalLevel: "global"` runs only community search; `retrievalLevel: "auto"` runs local first and falls back to community search when results are weak; `SPECKIT_DUAL_RETRIEVAL=false` rejects or ignores the parameter and reverts to single-level behavior.
- Desired user-visible outcome: Pass/fail verdict with cited trace evidence per mode.
- Pass/fail: PASS when each mode behaves as documented and the kill-switch reverts. FAIL when modes return identical output, auto fallback never fires, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate dual-level retrieval modes and confirm auto-mode fallback fires on weak local results.
```

### Commands

1. Pick a query `<Q-strong>` that has strong local hits and a query `<Q-weak>` that should produce weak local hits but shares words with a community summary.
2. `memory_search({ query: "<Q-strong>", retrievalLevel: "local", limit: 10, includeTrace: true })` and capture trace.
3. `memory_search({ query: "<Q-strong>", retrievalLevel: "global", limit: 10, includeTrace: true })` and capture trace.
4. `memory_search({ query: "<Q-strong>", retrievalLevel: "auto", limit: 10, includeTrace: true })` and capture trace.
5. Assert local-mode trace shows standard channels only, global-mode trace shows community search only, auto-mode trace matches local on strong query.
6. `memory_search({ query: "<Q-weak>", retrievalLevel: "auto", limit: 10, includeTrace: true })` and capture trace.
7. Assert auto-mode trace shows local channels first then fallback to community search.
8. Set `SPECKIT_DUAL_RETRIEVAL=false` in MCP env, restart, repeat step 4. Assert the level parameter is ignored or rejected and the handler reverts to single-level behavior.

### Expected

- Local mode runs standard channels only.
- Global mode runs community search only.
- Auto mode mirrors local on strong query, falls back to community on weak query.
- Flag-off run ignores the level parameter.

### Evidence

- BLOCKED before the five required trace envelopes could be captured. Query selected for `<Q-strong>`: `memory search retrievalLevel system spec kit`.
- MCP wrapper attempts using `memory_search` with `retrievalLevel: "local"`, `"global"`, and `"auto"` first returned schema errors before execution:
  ```
  cursor: Too small: expected string to have >=1 characters
  concepts: Too small: expected array to have >=2 items
  ```
- Retrying through the parity CLI with the playbook payload failed before executing the search:
  ```
  $ node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"memory search retrievalLevel system spec kit","retrievalLevel":"local","limit":10,"includeTrace":true}' --format json --timeout-ms 3000 --warm-only
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```
- Retrying MCP with schema-valid values reached the transport, but the transport closed:
  ```
  MCP error -32000: Connection closed
  ```
- Spec Memory runtime status after the failure:
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
  last_bridge_status=skipped
  last_error_code=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
  last_duration_ms=24
  bridge_invocations=11
  continuity_lookups=10
  cache_entries=0
  cache_hits=0
  cache_misses=10
  cache_hit_rate=0
  warm_status=skipped
  warm_error=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
  warm_route=warm_probe
  warm_retryable=true
  warm_exit_code=75
  ```
- No rank lists were available to compare because no `memory_search` trace envelope completed.

### Pass / Fail

- **BLOCKED**: required `memory_search` trace collection could not execute because the Spec Memory runtime is unavailable (`runtime_ready=false`, `CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK`) and the CLI fallback reports stale dist (`@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`).

### Failure Triage

Inspect `mcp_server/handlers/memory-search.ts` for the `retrievalLevel` dispatch. Confirm `mcp_server/lib/search/search-flags.ts` registers the parameter and the kill-switch. Check the auto-mode threshold logic against the empty-result recovery thresholds.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval-enhancements/dual-level-retrieval.md](../../feature_catalog/retrieval-enhancements/dual-level-retrieval.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 149
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval-enhancements/dual-level-retrieval.md`
