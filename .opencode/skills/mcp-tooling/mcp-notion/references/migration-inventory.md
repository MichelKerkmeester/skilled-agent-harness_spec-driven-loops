---
title: "Notion Migration Inventory Reference"
description: "The read-side inventory method for a Notion-to-Obsidian migration: the 7-step inventory procedure, the 5 API-gap reads it depends on, and the read-limit constraints that shape how the inventory is designed."
trigger_phrases:
  - "notion migration inventory"
  - "migration inventory"
  - "inventory a notion workspace"
  - "notion workspace inventory"
  - "pre-migration inventory"
  - "notion obsidian migration"
  - "migrate notion to obsidian"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Notion Migration Inventory Reference

The `mcp-notion` mode's read-side method for inventorying a Notion workspace before it migrates to Obsidian. This is the read half of the migration: it produces the ledger that the `mcp-obsidian` write-side method (`references/notion-migration.md` in the `mcp-obsidian` mode, sibling in this skill package) consumes at every step. Run this inventory before the Obsidian Importer, and re-run its verification-relevant steps after.

---

## 1. OVERVIEW

A migration inventory has to see more than the official MCP surface exposes. The 24-tool Notion MCP (`references/mcp-tools.md`) covers page, block, data-source, comment, user, and search CRUD, but truncates large relation/people/rich_text values at 25 references, only title-searches, and has no tool for file uploads, saved views, or non-truncated property reads. A complete inventory therefore interleaves MCP calls with the 5 direct-API gap reads in `references/api-gap-tools.md`, walking every data source, view, comment thread, and attachment before the importer ever runs.

---

## 2. THE 7-STEP INVENTORY PROCEDURE

| Step | Action | Tool / call | Produces |
|---|---|---|---|
| 1 | `search` on title roots | MCP `search` (title-only) | Top-level pages and databases to walk from |
| 2 | Resolve the data-source model | MCP `retrieve-a-database` → data-source ids; `retrieve-a-data-source` → full schema | Schema per data source (properties, types, relations) |
| 3 | Pull every row | MCP `query-data-source`, paginated | The complete row set per data source |
| 4 | List saved views | API gap — `GET /v1/databases/{id}/views` | Every secondary view the importer will drop |
| 5 | List file uploads | API gap — `GET /v1/file_uploads` | An attachment ledger to reconcile against the imported vault |
| 6 | Inventory comment threads | MCP `list-comments` + `list-all-users` | Full comment-thread inventory with author mapping, for reconstruction |
| 7 | Read non-truncated relations | API gap — `GET /v1/pages/{id}/properties/{prop}` | Complete relation/people/rich_text values past the 25-reference limit |

Run steps 2-3 per database before moving to the next; steps 4-7 can run in parallel once the data-source ids from step 2 are known, subject to the rate-limit budget in section 4.

---

## 3. THE 5 API-GAP READS USED FOR MIGRATION

All five gaps come from `references/api-gap-tools.md`; this table maps each to why the migration inventory needs it. Full endpoints, request/response shapes, and `Notion-Version` pinning live there — this is a routing summary, not a duplicate recipe set.

| Gap | Endpoint | Why the inventory needs it |
|---|---|---|
| File uploads | `GET /v1/file_uploads` | Builds the attachment ledger the post-import verification (step 8 of `notion-migration.md`) reconciles against the vault |
| Saved views | `GET /v1/databases/{id}/views` | The importer only converts the default table view; this is the only way to see what will be dropped and needs manual reconstruction |
| Property-item non-truncation | `GET /v1/pages/{id}/properties/{prop}` | `retrieve-a-page` truncates relation/people/rich_text at 25 references; a wide relation column needs this to inventory completely |
| Async-task polling | `GET /v1/async_tasks/{task_id}` | Needed only if the inventory itself triggers an async Notion operation (e.g. a duplication) on the local stdio backend |
| Daily notes | No endpoint — a knowledge-layer convention | Daily-note databases are inventoried like any other data source (steps 2-3); there is no separate gap call |

---

## 4. READ-LIMIT CONSTRAINTS

These four constraints shape how the inventory must be sequenced and paced — designing around them up front avoids silent data loss during the read pass, not just during the eventual import.

- **25-reference truncation.** `retrieve-a-page` and `retrieve-a-database` truncate `relation`, `people`, and `rich_text` values at 25 items. Any property that might exceed 25 references must be read through the property-item API gap (section 3), not the standard page/database tools.
- **Title-only search.** MCP `search` matches titles only — it cannot search page content. Start the inventory from the workspace tree (step 1), not from a content search; a database or page with no title match is otherwise invisible to the inventory.
- **`data_source_id`, not `database_id`.** API 2.0 replaced "databases" with "data sources"; queries, schema reads, and property reads all target a data-source id. Using a database id where a data-source id is required is the most common 400 during inventory.
- **~3 requests/second rate limit.** Per-integration throughput is roughly 3 req/s. A large workspace (50 databases, 200 data sources, 5000 pages) needs on the order of 11,500 calls for a full deep inventory — about 64 minutes at the rate limit — versus roughly 500 calls (~3 minutes) for a schema-only quick inventory. Run the quick inventory first to scope the migration, then deep-inventory only the databases that must preserve full parity.

---

## 5. WHEN TO USE THIS REFERENCE

Load this reference when a request involves:

- Building a migration ledger before a Notion-to-Obsidian import.
- Reading Notion data that the standard MCP tools truncate or omit (wide relations, saved views, file uploads).
- Scoping a large workspace migration under the ~3 req/s rate-limit budget.
- Verifying inventoried data (row counts, comment threads, relation values) against a migrated Obsidian vault.

---

## 6. RELATED RESOURCES

- `../../mcp-obsidian/references/notion-migration.md` — the write-side counterpart: the 8-step reconstruction method this inventory feeds, the recovery matrix, comment reconstruction, and the verification protocol.
- `references/api-gap-tools.md` — full request/response recipes for the 5 API-gap reads in section 3.
- `references/mcp-tools.md` — the 24-tool MCP catalog steps 1-3 and 6 of this procedure use.
- `references/database-model.md` — the data-source hierarchy and relation/rollup model that step 2's schema read depends on.
- `references/troubleshooting.md` — rate-limit backoff, `data_source_id` vs `database_id` recovery, and version-mismatch recipes.
