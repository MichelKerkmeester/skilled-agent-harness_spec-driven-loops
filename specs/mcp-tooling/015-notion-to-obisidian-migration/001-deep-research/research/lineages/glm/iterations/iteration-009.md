---
title: "Iteration 9: mcp-notion-reads / mcp-obsidian-writes Division of Labor"
trigger_phrases: []
---
# Iteration 9: mcp-notion-reads / mcp-obsidian-writes Division of Labor

## Focus

Synthesize the complete step-by-step migration method, mapping each migration step to the exact `mcp-notion` read tools and `mcp-obsidian` write tools that perform it. This resolves the spec's REQ-003 (the division-of-labor verdict) and is the load-bearing output of the GLM lineage.

## Findings

### F9.1 — The seven migration steps and their tool mapping

| Step | mcp-notion READS (source) | mcp-obsidian WRITES (target) | What happens |
|---|---|---|---|
| **1. Inventory** | `search` (title roots) → `retrieve-a-database` (data-source IDs) → `retrieve-a-data-source` (full schema: properties, relation config, rollup config, formula expr, select options) → `query-data-source` (paginated rows) → `GET /v1/pages/{id}/properties/{prop}` gap (non-truncated relations/people/text) → `GET /v1/databases/{id}/views` gap (every saved view) → `GET /v1/file_uploads` gap (attachment ledger) → MCP comment-list (comments) → MCP user-list (people) | — (read-only) | Produce the must-preserve / rebuild / retire ledger with schema-level detail |
| **2. Import** | (human runs the in-app Importer with the `ntn_` token; OR the agent pulls via the Notion API and writes files directly — see F9.2) | Importer writes: notes + frontmatter + `.base` files + attachment downloads + `[[wikilinks]]` (placeholder resolution) | The API importer is the primary path; the agent does NOT drive the in-app UI |
| **3. Relation reconstruction** | `retrieve-a-data-source` (relation config: single/dual, target data-source id) → `GET /v1/pages/{id}/properties/{prop}` gap (full relation values past 25-ref truncation) | file-layer: verify `[[wikilinks]]` resolve; for dual relations, author Notion Bases plugin two-way Relation column in `_database.md` (or Dataview back-ref query block); for subtasks, Notion Bases plugin self-relation + hierarchical | Verify importer-resolved wikilinks; rebuild two-way back-references the importer does not create |
| **4. Rollup reconstruction** | `retrieve-a-data-source` (rollup config: relation + target property + function) | file-layer: verify importer-converted Bases formula renders; for interactive parity, author Notion Bases plugin Rollup column (sum/count/avg/min/max/count_values/list) in `_database.md`; for read-only, Dataview `SUM()`/`COUNT()`/`AVG()` query block | Importer auto-converts rollups→formulas; upgrade to native rollup columns where interactive parity is required |
| **5. Formula reconstruction** | `retrieve-a-data-source` (formula expression) | file-layer: verify importer-converted Bases formula (`hybrid` strategy); hand-translate `style()`/`name()`/`email()` (drop styling, store person as text); `static` fallback for no-equivalent → frontmatter value; DataviewJS for complex read-only | Verify auto-converted formulas; hand-fix the no-equivalent cases |
| **6. File/attachment/comment carry-over** | `GET /v1/file_uploads` gap (verify attachment ledger) → MCP comment-list (comments per page/block) | file-layer: verify `![]()` embeds resolve + attachments exist; for comments, `notesmd-cli create`/Edit or MCP `obsidian_write_note` → append `## Comments` section + `comment_count` frontmatter; for gallery covers (gap), write frontmatter `cover` + download image | Verify attachments; carry comments (the importer gap) |
| **7. View reconstruction** | `GET /v1/databases/{id}/views` gap (every view: type, filters, sorts, config) | file-layer: add view blocks to `.base` `views:` array (core Bases: table/board/list/calendar/card) OR author Notion Bases plugin views in `_database.md` (7 types); map Notion filters → Bases/plugin nested AND/OR/NOT; document form/map/dashboard as lost | Reconstruct the N−1 secondary views the importer drops |
| **8. Verification** | `query-data-source` (row counts, property values) → `GET /v1/pages/{id}/properties/{prop}` gap (full values) → MCP comment-list (comment counts) | `notesmd-cli list`/`search-content` (note inventory) → MCP `obsidian_search_notes` (if app live) → file-layer grep for orphaned links / missing attachments / property-type mismatches → Dataview query (row counts per `.base`) | Programmatic parity checks (see iteration 10) |

### F9.2 — The import step: human-driven Importer vs agent-driven API pull

The prior findings noted "a human runs the in-app Importer (or hands the agent a Notion token to pull via the API and write files directly)." This iteration resolves the two modes:

- **Mode A — Human-driven Importer (recommended for the import bulk):** the human creates the internal integration, grants content access, runs Importer → "Notion (API)" → pastes token → selects scope → runs. The agent's role is **pre-flight inventory** (step 1, mcp-notion reads) and **post-import reconstruction** (steps 3-7, mcp-obsidian writes). The agent does NOT drive the in-app UI. [SOURCE: prior-findings.md §5]
- **Mode B — Agent-driven API pull (for gaps the importer misses):** using `mcp-notion` reads + `mcp-obsidian` writes, the agent pulls the specific artifacts the importer drops (comments, secondary views, gallery covers) and writes them into the already-imported vault. This is the **gap-closing mode** that runs after Mode A.

**The division of labor is therefore:** mcp-notion reads drive inventory (step 1) and gap-closing reads (step 6 comments, step 7 views); the human-driven Importer drives the bulk import (step 2); mcp-obsidian writes drive reconstruction (steps 3-7) and verification (step 8). The agent never competes with the Importer for the bulk — it complements it at the file layer.

### F9.3 — Headless vs app-backed per step

| Step | Headless (notesmd-cli + file-layer)? | App-backed (MCP) needed? |
|---|---|---|
| 1 Inventory | n/a (mcp-notion reads) | n/a |
| 2 Import | n/a (human/Importer) | n/a |
| 3-5 Relation/rollup/formula reconstruction | **Yes** (file-layer `.base`/`_database.md`/Dataview) | No |
| 6 File/comment carry-over | **Yes** (notesmd-cli create/Edit + file-layer) | Optional (MCP `obsidian_write_note` if app live) |
| 7 View reconstruction | **Yes** (file-layer `.base`/`_database.md`) | No |
| 8 Verification | **Yes** (notesmd-cli list/search-content + grep + Dataview) | Optional (MCP `obsidian_search_notes` for structured search) |

**The entire reconstruction + verification pipeline is headless-capable.** The MCP is only an optional accelerator for steps 6 and 8 when a live app + Local REST API is available. This confirms iteration 3's finding: an unattended fan-out migration runs on notesmd-cli + file Read/Edit.

### F9.4 — The mcp-notion read → mcp-obsidian write contract (per artifact)

| Notion artifact (read by mcp-notion) | Obsidian artifact (written by mcp-obsidian) | Read tool → Write tool |
|---|---|---|
| Database schema | `.base` file (importer) + `_database.md` (plugin) | `retrieve-a-data-source` → file-layer Write |
| Data-source rows | Notes with frontmatter (importer) | `query-data-source` → (importer writes); verify via `notesmd-cli list` |
| Relation (single) | `[[wikilink]]` frontmatter (importer) | `GET .../properties/{prop}` gap → verify wikilink |
| Relation (dual) | Notion Bases plugin two-way Relation column | `GET .../properties/{prop}` gap → file-layer `_database.md` |
| Rollup | Bases formula (importer) / plugin Rollup column | `retrieve-a-data-source` → file-layer `.base`/`_database.md` |
| Formula | Bases formula (importer) / hand-translated | `retrieve-a-data-source` → file-layer `.base` |
| Attachment | `![]()` embed + file (importer) | `GET /v1/file_uploads` gap → verify embed |
| Comment | `## Comments` section + `comment_count` | MCP comment-list → notesmd-cli create/Edit |
| View (secondary) | `.base` view block / plugin view | `GET /v1/databases/{id}/views` gap → file-layer `.base`/`_database.md` |
| Cover | frontmatter `cover` (importer) / gallery cover gap | (API) → file-layer frontmatter |

## Sources Consulted

- [SOURCE: iterations 1-8 findings] — importer behavior, read/write surfaces, relation/rollup/formula/file/comment/view recovery
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/SKILL.md, database-model.md, api-gap-tools.md] — read tools
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md, mcp-tools.md, dataview.md] — write tools
- [SOURCE: prior-findings.md §5] — human-driven Importer vs agent file-layer role

## Assessment

- **newInfoRatio: 0.62** — This iteration synthesizes iterations 1-8 into the single division-of-labor table the spec's REQ-003 demands. The novelty is the integration, not new evidence — but it resolves the load-bearing question.
- **Novelty justification:** First complete step→tool mapping distinguishing Mode A (human Importer bulk) from Mode B (agent gap-closing), and first confirmation that the entire reconstruction+verification pipeline is headless-capable.
- **Confidence:** High — built on the high-confidence findings of iterations 1-8.

## Reflection

- **What worked:** Synthesizing the prior iterations' tool maps into the step→read→write table.
- **What failed:** Nothing.
- **Ruled out:** The agent driving the in-app Importer UI (it cannot — human-driven bulk); the agent competing with the Importer for bulk import (it complements at the file layer).

## Recommended Next Focus

**Iteration 10:** Q10 — Parity & verification + final method decision. Define the programmatic pass/fail checks that confirm a migrated workspace matches the source with no silent loss (orphaned links, missing attachments, property-type mismatches, row-count parity, comment-count parity, view-count parity), and state the final flawless-migration method decision ready to hand to phase 002+.
