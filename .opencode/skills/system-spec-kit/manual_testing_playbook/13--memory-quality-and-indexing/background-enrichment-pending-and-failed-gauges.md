---
title: "452 -- Background Enrichment Pending and Failed Gauges"
description: "Manual check that memory_health surfaces pending and failed background-enrichment gauges off the post_insert_enrichment_status backlog, as read-side counters with no new state."
version: 3.6.0.1
---

# 452 -- Background Enrichment Pending and Failed Gauges

## 1. OVERVIEW

This scenario validates the read-side `pending` and `failed` background-enrichment gauges. `memory_health` must report `backgroundEnrichment.pending` and `backgroundEnrichment.failed` derived from the `post_insert_enrichment_status` backlog, alongside the existing active and queued counters. The gauges add no new state and return zero when the backlog distribution is absent.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm health exposes pending and failed enrichment gauges from the live backlog.
- Real user request: `Show me how many memories are waiting on enrichment and how many failed it, not just what's running.`
- Prompt: `Validate background enrichment pending and failed gauges through memory_health.`
- Expected execution process: Inspect `memory_health` on a clean sandbox, then create rows in non-complete enrichment states, rerun `memory_health`, and confirm the gauges reflect the backlog.
- Expected signals: With no incomplete rows, `backgroundEnrichment.pending` and `backgroundEnrichment.failed` are zero; with seeded pending and failed rows, the gauges match the per-status backlog; `pendingByStatus` exposes the full distribution; no new state or schema is introduced.
- Desired user-visible outcome: The operator can read the enrichment backlog and failure count directly from health output.
- Pass/fail: PASS only when the gauges match the seeded backlog and return zero when the distribution is absent.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate background enrichment pending and failed gauges through memory_health.
```

### Commands

1. On a clean sandbox, run `memory_health({ reportMode: "full" })` and confirm `backgroundEnrichment.pending` and `backgroundEnrichment.failed` are zero.
2. Seed sandbox `memory_index` rows with `post_insert_enrichment_status` values of `pending` and `failed` using the local test harness.
3. Rerun `memory_health({ reportMode: "full" })` and capture the `backgroundEnrichment` block.
4. Confirm `backgroundEnrichment.pending` and `backgroundEnrichment.failed` match the seeded counts and `pendingByStatus` exposes the per-status distribution.

### Expected

- With no incomplete rows, both gauges report zero.
- With seeded pending and failed rows, the gauges match the seeded counts.
- `pendingByStatus` exposes the full non-complete status distribution.
- No new persistent state or schema change is introduced. The gauges are read-side only.

### Evidence

Clean-sandbox health excerpt, seeded backlog summary, and the after-seed `backgroundEnrichment` block with `pending`, `failed`, and `pendingByStatus`.

### Pass / Fail

- **Pass**: the gauges return zero on a clean sandbox and match the seeded backlog after seeding, with `pendingByStatus` present.
- **Fail**: the gauges are missing, do not match the backlog, or require new state to compute.

### Failure Triage

Inspect `mcp_server/handlers/memory-save.ts` (`getBackgroundEnrichmentStats`) and `mcp_server/handlers/memory-crud-health.ts` (the `post_insert_enrichment_status` aggregation and `backgroundEnrichment` block). Confirm the gauges are read-side and default to zero when the distribution is empty.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `13--memory-quality-and-indexing/background-enrichment-pending-and-failed-gauges.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/handlers/memory-save.ts` | `getBackgroundEnrichmentStats` pending and failed gauge fields |
| `mcp_server/handlers/memory-crud-health.ts` | Per-status backlog aggregation and `backgroundEnrichment` health block |
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Asserts pending and failed gauge values |

---

## 5. SOURCE METADATA

- Group: Memory Quality And Indexing
- Playbook ID: 452
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/background-enrichment-pending-and-failed-gauges.md`
