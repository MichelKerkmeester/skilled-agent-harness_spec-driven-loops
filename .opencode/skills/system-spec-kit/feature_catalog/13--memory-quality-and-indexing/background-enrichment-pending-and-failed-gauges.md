---
title: "Background enrichment pending and failed gauges"
description: "Tracks the read-side pending and failed gauges added to getBackgroundEnrichmentStats so memory_health surfaces the post-insert enrichment backlog, not just active and queued counts."
trigger_phrases:
  - "background enrichment pending gauge"
  - "background enrichment failed gauge"
  - "getBackgroundEnrichmentStats pending failed"
  - "enrichment backlog health"
  - "post insert enrichment gauges"
version: 3.6.0.1
---

# Background enrichment pending and failed gauges

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the read-side `pending` and `failed` gauges added to `getBackgroundEnrichmentStats` so `memory_health` surfaces the post-insert enrichment backlog, not just active and queued counts.

Health output now shows how many memories are still waiting on background enrichment and how many failed it. Without these two numbers a backed-up or stuck enrichment scheduler was a silent outage.

---

## 2. HOW IT WORKS

`getBackgroundEnrichmentStats` gained `pending` and `failed` fields alongside its existing `active`, `queued`, and counter fields. They are read-side gauges with no new state: the health handler aggregates `memory_index` rows by `post_insert_enrichment_status` for every status other than `complete`, then passes that distribution in, so `pending` and `failed` reflect the live backlog.

The values surface under `memory_health` as `backgroundEnrichment.pending` and `backgroundEnrichment.failed`, with the full per-status distribution also exposed as `pendingByStatus`. When the distribution is absent both gauges return zero.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | `getBackgroundEnrichmentStats` `pending` and `failed` gauge fields |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Aggregates the per-status backlog and exposes `backgroundEnrichment.pending` / `failed` in `memory_health` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Automated test | Asserts pending and failed gauge values in the health response |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/background-enrichment-pending-and-failed-gauges.md`
Related references:
- [post-insert-enrichment-marker.md](post-insert-enrichment-marker.md) — Post-insert enrichment marker (post_insert_enrichment_status)
