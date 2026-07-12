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

Command run from `.opencode/skills/system-spec-kit/mcp_server` using the built handler and in-memory vector index sandbox:

```bash
node --input-type=module -e 'import * as handler from "./dist/handlers/memory-crud.js"; import * as vectorIndex from "./dist/lib/search/vector-index.js"; function parse(result){ return JSON.parse(result.content[0].text); } vectorIndex.closeDb(); vectorIndex.initializeDb(":memory:"); try { const clean = parse(await handler.handleMemoryHealth({ reportMode: "full" })); console.log("CLEAN_BACKGROUND_ENRICHMENT=" + JSON.stringify(clean.data.backgroundEnrichment, null, 2)); const database = vectorIndex.getDb(); if (!database) throw new Error("Database not initialized"); const specFolder = "specs/manual-playbook-health-enrichment-452"; const now = "2026-06-19T12:00:00.000Z"; const oldestPending = "2026-06-19T11:55:00.000Z"; const recentPending = "2026-06-19T11:59:00.000Z"; const failed = "2026-06-19T11:58:00.000Z"; const insert = database.prepare(`INSERT INTO memory_index (spec_folder, file_path, title, created_at, updated_at, embedding_status, post_insert_enrichment_status) VALUES (?, ?, ?, ?, ?, ?, ?)`); insert.run(specFolder, "/tmp/manual-playbook-452-pending-1.md", "Pending enrichment 1", oldestPending, now, "pending", "pending"); insert.run(specFolder, "/tmp/manual-playbook-452-pending-2.md", "Pending enrichment 2", recentPending, now, "pending", "pending"); insert.run(specFolder, "/tmp/manual-playbook-452-failed.md", "Failed enrichment", failed, now, "pending", "failed"); const seeded = database.prepare(`SELECT post_insert_enrichment_status AS status, COUNT(*) AS count FROM memory_index WHERE spec_folder = ? GROUP BY post_insert_enrichment_status ORDER BY post_insert_enrichment_status`).all(specFolder); console.log("SEEDED_BACKLOG=" + JSON.stringify(seeded, null, 2)); const after = parse(await handler.handleMemoryHealth({ reportMode: "full" })); console.log("SEEDED_BACKGROUND_ENRICHMENT=" + JSON.stringify(after.data.backgroundEnrichment, null, 2)); database.prepare("DELETE FROM memory_index WHERE spec_folder = ?").run(specFolder); } finally { vectorIndex.closeDb(); }'
```

Observed output excerpt:

```text
CLEAN_BACKGROUND_ENRICHMENT={
  "active": 0,
  "queued": 0,
  "pending": 0,
  "failed": 0,
  "max": 4,
  "maxQueued": 2000,
  "droppedTotal": 0,
  "failureTotal": 0,
  "lastError": null,
  "lastErrorAt": null,
  "pendingByStatus": {},
  "oldestPendingAt": null,
  "oldestPendingAgeMs": 0
}
SEEDED_BACKLOG=[
  {
    "status": "failed",
    "count": 1
  },
  {
    "status": "pending",
    "count": 2
  }
]
SEEDED_BACKGROUND_ENRICHMENT={
  "active": 0,
  "queued": 0,
  "pending": 2,
  "failed": 1,
  "max": 4,
  "maxQueued": 2000,
  "droppedTotal": 0,
  "failureTotal": 0,
  "lastError": null,
  "lastErrorAt": null,
  "pendingByStatus": {
    "failed": 1,
    "pending": 2
  },
  "oldestPendingAt": "2026-06-19T11:55:00.000Z",
  "oldestPendingAgeMs": 1118362640
}
```

Schema/read-side check command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
node --input-type=module -e 'import * as handler from "./dist/handlers/memory-crud.js"; import * as vectorIndex from "./dist/lib/search/vector-index.js"; function parse(result){ return JSON.parse(result.content[0].text); } function schemaVersion(db){ return db.prepare("PRAGMA schema_version").get().schema_version; } vectorIndex.closeDb(); vectorIndex.initializeDb(":memory:"); try { const database = vectorIndex.getDb(); if (!database) throw new Error("Database not initialized"); const beforeHealthSchemaVersion = schemaVersion(database); await handler.handleMemoryHealth({ reportMode: "full" }); const afterCleanHealthSchemaVersion = schemaVersion(database); const specFolder = "specs/manual-playbook-health-enrichment-schema-452"; database.prepare(`INSERT INTO memory_index (spec_folder, file_path, title, created_at, updated_at, embedding_status, post_insert_enrichment_status) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`).run(specFolder, "/tmp/schema-pending-1.md", "Pending enrichment 1", "2026-06-19T11:55:00.000Z", "2026-06-19T12:00:00.000Z", "pending", "pending", specFolder, "/tmp/schema-pending-2.md", "Pending enrichment 2", "2026-06-19T11:59:00.000Z", "2026-06-19T12:00:00.000Z", "pending", "pending", specFolder, "/tmp/schema-failed.md", "Failed enrichment", "2026-06-19T11:58:00.000Z", "2026-06-19T12:00:00.000Z", "pending", "failed"); const afterSeedSchemaVersion = schemaVersion(database); await handler.handleMemoryHealth({ reportMode: "full" }); const afterSeedHealthSchemaVersion = schemaVersion(database); console.log("SCHEMA_VERSION_CHECK=" + JSON.stringify({ beforeHealthSchemaVersion, afterCleanHealthSchemaVersion, afterSeedSchemaVersion, afterSeedHealthSchemaVersion }, null, 2)); database.prepare("DELETE FROM memory_index WHERE spec_folder = ?").run(specFolder); } finally { vectorIndex.closeDb(); }'
```

Observed output excerpt:

```text
SCHEMA_VERSION_CHECK={
  "beforeHealthSchemaVersion": 152,
  "afterCleanHealthSchemaVersion": 155,
  "afterSeedSchemaVersion": 155,
  "afterSeedHealthSchemaVersion": 155
}
```

### Pass / Fail

- **PASS**: the gauges returned zero on the clean in-memory sandbox, matched the seeded backlog after seeding (`pending=2`, `failed=1`), exposed `pendingByStatus`, and the schema version stayed `155` from after seeding through after seeded `memory_health`.

### Failure Triage

Inspect `mcp_server/handlers/memory-save.ts` (`getBackgroundEnrichmentStats`) and `mcp_server/handlers/memory-crud-health.ts` (the `post_insert_enrichment_status` aggregation and `backgroundEnrichment` block). Confirm the gauges are read-side and default to zero when the distribution is empty.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `memory_quality_and_indexing/background_enrichment_pending_and_failed_gauges.md` | Scenario contract |

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
- Feature file path: `memory_quality_and_indexing/background_enrichment_pending_and_failed_gauges.md`
