---
title: "446 -- Retrieval Observability Trace and Health"
description: "Manual check that includeTrace exposes why_ranked, degraded-vector state appears in trace/health surfaces, and maintenance counters update after maintenance tools run."
version: 3.6.0.1
---

# 446 -- Retrieval Observability Trace and Health

## 1. OVERVIEW

This scenario validates additive retrieval observability. It must not alter ranking, scoring, schema, or write behavior. Diagnostics appear through existing opt-ins and health surfaces: `why_ranked` on traced searches, degraded-vector state in trace and status payloads, and last-run maintenance counters in health after maintenance tools execute.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm retrieval observability diagnostics are visible and read-only.
- Real user request: `Show me why this memory ranked where it did and whether vector or maintenance health is degraded, without changing ranking.`
- Prompt: `Validate retrieval observability with memory_search includeTrace, degraded-vector health, and maintenance counter checks.`
- Expected execution process: Run a baseline search without trace, run the same search with `includeTrace:true`, create or simulate a degraded-vector condition in a sandbox, run maintenance tools, and inspect `memory_health` for last-run counters.
- Expected signals: Non-trace search has no `why_ranked`; traced search includes `why_ranked` derived from actual ranker fields; degraded-vector state appears in traced search and health/status surfaces; maintenance counters update after index scan, embedding reconcile, or retention sweep; result ordering stays unchanged between baseline and trace runs.
- Desired user-visible outcome: The operator can cite why a result ranked, whether vector state is degraded, and what the latest maintenance counters report.
- Pass/fail: PASS only when diagnostics appear under opt-ins or health surfaces and do not change ranking or mutate search state.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate retrieval observability with memory_search includeTrace, degraded-vector health, and maintenance counter checks.
```

### Commands

1. Run `memory_search({ query: "manual playbook observability probe", limit: 5 })` and capture result IDs and rank order as `BASELINE`.
2. Run `memory_search({ query: "manual playbook observability probe", limit: 5, includeTrace: true })` and capture `TRACE`.
3. Verify each traced result includes `why_ranked` or the documented trace envelope with ranker-derived fields, and compare result order to `BASELINE`.
4. In a sandbox DB, mark or create a vector-degraded condition supported by the local test harness, then run `memory_search({ query: "manual playbook observability probe", limit: 5, includeTrace: true })` and `memory_health({ reportMode: "full" })`.
5. Run `memory_index_scan({ specFolder: "<sandbox-spec>", force: false })`, `memory_embedding_reconcile({ mode: "dry-run" })`, and `memory_retention_sweep({ dryRun: true })`.
6. Rerun `memory_health({ reportMode: "full" })` and capture last-run maintenance counter fields.

### Expected

- `BASELINE` does not include `why_ranked` diagnostics.
- `TRACE` includes ranker-derived `why_ranked` or equivalent trace fields without changing result order.
- Degraded-vector state is visible in traced search and health/status payloads.
- `memory_health` reports latest maintenance counters after maintenance tools run.
- No ranking, scoring, schema, or write behavior changes are introduced by trace-only calls.

### Evidence

BLOCKED before baseline capture because the Spec Memory transport was unavailable and rebuilding it would modify files outside this scenario's allowed write path.

Command: `node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"manual playbook observability probe","limit":5}' --format json --timeout-ms 3000`

Output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Native plugin status from `mk_spec_memory_status()`:

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
last_bridge_status=fail_open
last_error_code=EXIT_69
last_duration_ms=53
bridge_invocations=6
continuity_lookups=5
cache_entries=0
cache_hits=0
cache_misses=5
cache_hit_rate=0
warm_status=fail_open
warm_error=EXIT_69
warm_route=cli
warm_retryable=false
warm_exit_code=69
```

Command: `node .opencode/bin/spec-memory.cjs memory_health --json '{"reportMode":"full"}' --format json --timeout-ms 3000`

Output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

The scenario commands require `memory_search`, `memory_health`, `memory_index_scan`, `memory_embedding_reconcile`, and `memory_retention_sweep`, plus a sandbox DB where a vector-degraded condition can be marked or created. The current repo state is missing an available Spec Memory runtime (`runtime_ready=false`, `EXIT_69`) and the suggested remediation (`npm run build` under `.opencode/skills/system-spec-kit/mcp_server`) would modify files outside `.opencode/skills/system-spec-kit/manual_testing_playbook/retrieval-enhancements/retrieval-observability-trace-and-health.md`.

### Pass / Fail

- **BLOCKED**: Spec Memory commands cannot run because `@spec-kit/mcp-server dist is stale` and the native plugin reports `runtime_ready=false` / `EXIT_69`; rebuilding the MCP server and creating or marking the required sandbox degraded-vector DB would require writes outside the single allowed scenario file.

### Failure Triage

Inspect `lib/observability/retrieval-observability.ts`, `formatters/search-results.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-health.ts`, and `tests/openltm-retrieval-observability.vitest.ts`. Confirm process-local counters were checked before daemon restart.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `retrieval-enhancements/retrieval-observability-trace-and-health.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/observability/retrieval-observability.ts` | Shared observability helpers |
| `mcp_server/formatters/search-results.ts` | `why_ranked` formatted output |
| `mcp_server/handlers/memory-search.ts` | Search trace response wiring |
| `mcp_server/handlers/memory-crud-health.ts` | Health degraded-vector and maintenance counters |
| `mcp_server/tests/openltm-retrieval-observability.vitest.ts` | Observability regression coverage |

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 446
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval-enhancements/retrieval-observability-trace-and-health.md`
