---
title: "446 -- Retrieval Observability Trace and Health"
description: "Manual check that includeTrace exposes why_ranked, degraded-vector state appears in trace/health surfaces, and maintenance counters update after maintenance tools run."
version: 3.6.0.1
id: retrieval-enhancements-retrieval-observability-trace-and-health
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Diagnostics appear under opt-ins or health surfaces and do not change ranking or mutate search state.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `lib/observability/retrieval-observability.ts`, `formatters/search-results.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-health.ts`, and `tests/openltm-retrieval-observability.vitest.ts`. Confirm process-local counters were checked before daemon restart.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `retrieval-enhancements/retrieval-observability-trace-and-health.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp-server/lib/observability/retrieval-observability.ts` | Shared observability helpers |
| `mcp-server/formatters/search-results.ts` | `why_ranked` formatted output |
| `mcp-server/handlers/memory-search.ts` | Search trace response wiring |
| `mcp-server/handlers/memory-crud-health.ts` | Health degraded-vector and maintenance counters |
| `mcp-server/tests/openltm-retrieval-observability.vitest.ts` | Observability regression coverage |

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 446
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval-enhancements/retrieval-observability-trace-and-health.md`
