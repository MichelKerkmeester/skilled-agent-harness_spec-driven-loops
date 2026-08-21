---
title: "DeepSeek Lineage Synthesis: Flawless Notion→Obsidian Migration — Extended Research Findings"
description: "10-iteration DeepSeek V4 Flash research extending prior-findings.md: decisive migration method, mcp-notion/mcp-obsidian division of labor, relation/rollup recovery, plugin requirements, parity verification, and AI-vs-human role."
---

# DeepSeek Lineage Synthesis: Flawless Notion→Obsidian Migration

> **Lineage**: Track B — DeepSeek V4 Flash via cli-opencode (this lineage)
> **Iterations**: 10 of 10 (max iterations stop policy; no early convergence)
> **Extends**: `prior-findings.md` (the original single-pass web-research note)
> **Seeds**: prior-findings.md + mcp-notion SKILL.md + mcp-obsidian SKILL.md + Notion API Reference + Notion Bases plugin README + Obsidian Help

---

## 1. THE LOAD-BEARING DECISION: WHICH IMPORTER

**Verdict from prior-findings.md §1 — confirmed and extended.**

The Obsidian Importer's **Notion API** mode is the only viable path for database-heavy workspaces. The HTML `.zip` and Markdown export paths lose all database structure. Our research extends the prior verdict with concrete loss details:

| What survives API import | What is lost or needs verification | Research source |
|---|---|---|
| Pages → Markdown notes | Relations — flagged "verify" by Obsidian | iteration-001, prior-findings §1 |
| Databases → Bases | Rollups — not imported as Obsidian-native | iteration-001, iteration-003 |
| Primary view (table) per database | Secondary views (board/calendar/gallery/etc.) | iteration-004 §F4.4 |
| Attachments, hierarchy, internal links | Comments (not imported at all) | iteration-004 §F4.3 |
| Formulas → partial equivalence | File property values (URL → local mapping) | iteration-004 §F4.1 |
| Page metadata/properties | Nested page ordering (alphabetical only) | iteration-006 §F6.2 |

**New finding**: The API importer's "relations/rollups need verification" warning is the single most important caveat. Our research confirms the only safe approach is **treat all relational data as suspect until independently verified**.

[SOURCE: iteration-001 §F1.1, iteration-005 §F5.2, prior-findings.md §1]

---

## 2. THE mcp-notion-READS / mcp-obsidian-WRITES DIVISION OF LABOR

### Inventory Phase (mcp-notion — fully automatable)

| Migration step | mcp-notion tool | API surface | Direct API gap? |
|---|---|---|---|
| List all pages by title | `search` | MCP | Title-only — no full-text |
| Retrieve page body (content) | `retrieve-page-markdown` | MCP | No — 24-tool surface |
| Retrieve page metadata/properties | `retrieve-a-page` | MCP | 25-item truncation on relations |
| List database containers → resolve data source IDs | `retrieve-a-database` | MCP | No |
| Get data source schema (properties, types, options) | `retrieve-a-data-source` | MCP | No |
| Query all rows with filters | `query-data-source` | MCP | Pagination needed for >100 rows |
| List all saved views | `GET /v1/databases/{id}/views` | Direct API | **Gap 2** — no MCP view tool |
| Get view config (filters, sorts) | `GET /v1/views/{view_id}` | Direct API | **Gap 2** |
| File upload metadata | `POST /v1/file_uploads` + `GET` | Direct API | **Gap 1** |
| List page comments | `list-comments` | MCP | No |
| List workspace users | `list-all-users` | MCP | No |
| Non-truncated relation/people fields | `GET /v1/pages/{id}/properties/{prop}` | Direct API | **Gap 3** |
| Async task polling (if needed) | `GET /v1/async_tasks/{id}` | Direct API | **Gap 4** |

### Import Phase (human — no AI alternative)

| Step | Who performs | Surface | Notes |
|---|---|---|---|
| Create Notion internal integration | Human | Notion UI | Agent provides step-by-step |
| Share target pages with integration | Human | Notion UI | One-time permission grant |
| Install Obsidian plugins (Notion Bases, Dataview, Tasks, Git) | Human | Obsidian UI | Agent writes schema files post-install |
| Run Obsidian Importer → "Notion (API)" → paste token | Human | Obsidian UI | Agent provides token and scope |
| Accept/reject folder structure | Human | Human decision | Agent presents 2-3 options |

[SOURCE: iteration-009 §F9.1, §F9.3]

### Reconstruction Phase (mcp-obsidian — fully automatable)

| Reconstruction task | mcp-obsidian surface | Command/tool | Requires running app? |
|---|---|---|---|
| Rewrite raw relation UUIDs → `[[wikilinks]]` | notesmd CLI (headless) | `search-content` + `frontmatter` loop | No |
| Create `_database.md` per Notion database (plugin schema) | notesmd CLI (headless) | `create` | No |
| Create `.base` files for core Bases views | notesmd CLI (headless) | `create` | No |
| Write Dataview DQL queries for rollups | notesmd CLI (headless) | `create` / `frontmatter` | No |
| Normalize frontmatter across 1000s of notes | notesmd CLI (headless) | `frontmatter` batch | No |
| Convert comments → Obsidian callout blocks | notesmd CLI (headless) | `print` → transform → `create` | No |
| Fix broken internal links | notesmd CLI (headless) | `search-content` + `frontmatter` | No |
| Convert Notion callouts/toggles → Obsidian callouts | notesmd CLI (headless) | `print` → transform → `create` | No |
| Structured note reads/writes (live vault) | MCP (app-backed) | `obsidian_get_note` / `obsidian_write_note` | Yes (requires app) |
| Tag management | MCP (app-backed) | `obsidian_manage_tags` | Yes |
| Global/semantic search | MCP (app-backed) | `obsidian_search_notes` | Yes |

### Verification Phase (AI script + human sample)

| Check | Tool | Automated? |
|---|---|---|
| Page existence | `notesmd-cli list` + cross-reference | Yes |
| Internal links resolve | grep for `[[wikilinks]]` | Yes |
| Attachment file presence | Count files vs expected | Yes |
| Database row count | `find "$db" -name "*.md" \! -name "_database.md"` | Yes |
| Frontmatter key presence | `notesmd-cli frontmatter` per note | Yes |
| Property type fidelity | Type-check frontmatter values | Partial |
| Formula output accuracy | Cross-reference with Notion source | Manual |
| View rendering | Open each `.base` in Obsidian | Manual |

[SOURCE: iteration-008 §F8.1-F8.4]

---

## 3. RELATIONS, ROLLUPS, AND FORMULAS — THREE-WAY RECOVERY

### Prior Finding §2-3 (confirmed)

Core Obsidian **Bases** (v1.9+) has **no two-way relational schema and no rollups**. The gap is real and the N of the migration.

### Notion Bases Plugin — P0 Required

The `bgarciamoura/obsidian-notion-bases-plugin` is the primary recovery vehicle:

| Pattern | Notion Bases | Core Bases | Dataview |
|---|---|---|---|
| One-to-one relation | Native relation column | `[[wikilink]]`, no enforcement | Manual DQL |
| One-to-many relation | Native + self-relation subtasks (3 levels) | Partial | DQL `GROUP BY` |
| Many-to-many | Multi-select relation column | Manual | DQL `FLATTEN` |
| Rollup (sum/count/avg/min/max/count_values/list) | **7 built-in functions** inline in table | None | Manual in DQL `TABLE` |
| Formula (IF/CONCAT/ROUND/LEFT/SUM/AVG) | Spreadsheet-style | Expression-based (JS-like) | DataviewJS |
| Views: table/board/gallery/list/calendar/timeline/chart | **7 views** | 2-3 views (table/board/list) | TABLE/LIST/CALENDAR |
| Schema in frontmatter | `_database.md` YAML | `.base` file YAML | Inline code blocks |

The plugin handles **over 90% of Notion's relational feature set**. Dataview supplements for custom aggregations. `.base` files alone are insufficient for any workspace with relations, rollups, or formulas.

[SOURCE: iteration-003 §F3.1-F3.5]

### Formula Coverage

| Notion function type | Plugin equivalent? | Translation complexity |
|---|---|---|
| Arithmetic (+, -, *, /) | Yes — spreadsheet-style | Low — direct replacement |
| Conditional (IF, AND, OR) | Yes — `IF(cond, then, else)` | Low |
| String (CONCAT, LEFT, ROUND) | Yes — same functions | Low |
| Date math | Yes | Medium |
| Lookup across databases | Yes — Lookup column type | Low |
| Nested (formula referencing formula) | Yes | Medium |
| **Notion `prop("name")`** | `{{ColumnName}}` or direct ref | Low |
| **Notion `name()` / `style()` / `unstyle()`** | **No equivalent** | **Cannot replicate** |
| **Notion `id()`** | `$id` in plugin | Low |
| **Notion `now()`** | `$now` in plugin | Low |

**Critical**: Notion text-styling functions (`name()`, `style()`, `unstyle()`) have no Obsidian equivalent. Any Notion formula relying on these must be flagged for manual review.

[SOURCE: iteration-003 §F3.3]

---

## 4. FILE UPLOADS, ATTACHMENTS, COMMENTS, AND MULTI-VIEW DATABASES

### Files and Attachments

- **Inline images, embedded files**: Preserved by the API importer — files are copied to the vault
- **`files` property values**: May partially break (Notion CDN URL ≠ local path) — agent rewrites post-import
- **Large files (>20 MiB)**: May fail the import with rate-limit impact — human must manually copy
- **Upload flow (if AI needs to upload to Notion during inventory)**: Direct API: `POST /v1/file_uploads` → `POST /send` (multipart) → MCP `append-block-children` with `file_upload` id reference. **Three-step, fully automatable.**

### Comments

**Not imported by the Importer at all.** Reconstruction workflow:
1. **Inventory**: mcp-notion `list-comments` per page + `list-all-users` for author mapping
2. **Reconstruction**: Convert each comment thread to an Obsidian callout block (`> [!comment]`) appended to the page body
3. **Verification**: Confirm all comment threads from inventory have corresponding callouts

For pages with high comment counts, this is significant AI value: the agent can retrieve, format, and insert every comment programmatically.

[SOURCE: iteration-004 §F4.3]

### Multi-View Databases

- **Primary view (table)**: Auto-converted to Bases by the importer — column order, visibility, width preserved
- **Secondary views (board, calendar, gallery, timeline, list, chart)**: **NOT imported.** Must reconstruct per view.
- **View-level filters, sorts, and field visibility**: NOT imported.
- **Linked data sources (cross-DB rollups)**: NOT imported.
- **Reconstruction workflow**: mcp-notion direct API list views → translate each view config → write Notion Bases plugin schema into `_database.md`. The Notion Bases plugin reads the schema and renders each view natively.

[SOURCE: iteration-004 §F4.4]

---

## 5. REQUIRED OBSIDIAN PLUGINS

| Plugin | Priority | Role | mcp-obsidian knows? |
|---|---|---|---|
| **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin`) | **P0 — Required** | Relations, rollups, formulas, 7 views, subtasks, Lookup | No — agent uses plugin's own docs |
| **Dataview** | P1 — High rec. | Custom rollup queries, cross-DB aggregations, inline fields | Yes — full plugin knowledge |
| **Tasks** | P2 — Conditional | Recurring tasks (only if recurring-task DBs exist) | Yes — in plugin references |
| **Obsidian Git** | P2 — Recommended | Vault backup during migration window | Yes — full plugin knowledge |
| **Kanban / Calendar / Full Calendar** | P3 — Optional | Dedicated specialized views (only if Notion Bases views insufficient) | Partial |
| **BRAT** (Obsidian42) | P3 — Optional | Install Notion Bases via BRAT instead of Community Plugins | Yes — full plugin knowledge |
| **Iconic** | P4 — Cosmetic | File/folder icons replacing Notion page icons | Yes — full plugin knowledge |
| **Excalidraw** | P4 — Optional | Replace Notion inline drawings | Yes — full plugin knowledge |

**Minimum viable install**: Notion Bases + Dataview. Agent writes all schema files; human just clicks "Install."

[SOURCE: iteration-007 §F7.1-F7.4]

---

## 6. AI-VS-HUMAN DIVISION OF LABOR

### Human-Required (3 GUI interactions)

```
1. Create Notion integration + grant content access (~5 min)
2. Install Notion Bases + Dataview plugins in Obsidian (~2 min)
3. Run Obsidian Importer — paste token + choose scope (~5 min)
Total human active time: ~12-17 minutes
```

### AI-Automatable (everything else)

```
Pre-flight:
  - Full Notion workspace inventory (DBs, schemas, views, relations, files, comments)
  - Create migration ledger (must-preserve / rebuild / retire)
  - Build UUID→filename cross-reference for relation rewrite

Post-import:
  - Verify import integrity (page count, link validation, file presence)
  - Rewrite relation UUIDs → [[wikilinks]] across all notes
  - Create _database.md schema files per Notion database
  - Write Dataview DQL queries for rollups
  - Normalize frontmatter across all notes
  - Convert comments to callout blocks
  - Fix broken internal links
  - Convert callouts/toggles
  - Run complete parity verification script
  - Generate migration report

Total AI autonomous time: ~30 min to 4+ hours (rate-limit dependent)
```

[SOURCE: iteration-009 §F9.3-F9.4]

---

## 7. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| HTML .zip import for DB-heavy workspaces | Loses all database views, properties, formulas, relations, rollups | prior-findings.md §1 — only API preserves databases | seed |
| Notion Markdown export | "Omits important data" per official docs | Obsidian Help — Import from Notion | seed |
| .base files only (no Notion Bases plugin) | Supports only 6 column types; no relations, rollups, formulas | iteration-003 §F3.4 — .base column limit confirmed | 003 |
| Pure Dataview for multi-view databases | Dataview lacks Board/Gantt/Chart/Gallery views | iteration-003 §F3.2 — view coverage gap | 003 |
| Full autonomous AI migration without human GUI | Importer and plugin installation are GUI-only in 2026 | iteration-009 §F9.5 — no CLI API exists | 009 |
| 100% automated verification | Formula parity and visual layout require human sample-check | iteration-008 §F8.3 — manual gaps documented | 008 |

---

## 8. API 2.0 DATA-SOURCE MODEL

The Notion API 2.0 breaking change (2025-09-03) replaced `database_id` with `data_source_id`. The migration agent must:

1. Call `retrieve-a-database(database_id)` → returns `data_source_ids[]`
2. For each `data_source_id`: `retrieve-a-data-source` → schema + `query-data-source` → rows
3. Never use `database_id` where `data_source_id` is expected — that produces 400 `validation_error`

The MCP's `retrieve-a-page` truncates relation/people/rich_text at 25 references. For non-truncated values, use the direct API property-items endpoint (`GET /v1/pages/{id}/properties/{prop}`).

[SOURCE: iteration-005 §F5.1-F.5.4]

---

## 9. NESTED PAGE HIERARCHY

- **Preserved**: Nested sub-pages as folder hierarchy, database rows as `.md` files in DB folders
- **Lost**: Manual drag-reorder (notes alphabetical), breadcrumb parent references, visual ordering
- **Reconstruction possibility**: optional `parent:: [[Parent]]` and `order:: N` frontmatter fields for Dataview to sort by

[SOURCE: iteration-006 §F6.1-F6.2]

---

## 10. SCALABILITY AND RATE LIMITS

For a large workspace (50 databases, 200 data sources, 5000 pages):
- **Full deep inventory**: ~11,500 API calls → ~64 minutes at 3 req/s
- **Quick inventory (schema only)**: ~500 calls → ~3 minutes
- **Primary constraint**: Notion API rate limit (~3 req/s per integration)
- **Optimization**: Quick inventory first, then deep-inventory only "must-preserve" databases

[SOURCE: iteration-010 §F10.1-F10.2]

---

## 11. RECOMMENDATIONS

1. **Use the Notion API importer** — the only path that preserves databases as Bases
2. **Install Notion Bases plugin (P0) + Dataview (P1)** before reconstruction
3. **Adopt the hybrid flow**: human does 3 GUI actions; AI automates everything else
4. **Treat all relational data as suspect** until independently verified via the two-pass protocol
5. **Run quick inventory first** to scope the migration before committing to a full deep inventory
6. **Use incremental per-database migration** for very large workspaces
7. **Keep Notion live** until the two-pass verification passes — this is not a "rip and replace" migration

---

## 12. OPEN QUESTIONS REQUIRING HUMAN JUDGEMENT (for phase 002+)

1. Notion → Notion Bases formula function mapping — per-workspace, per-formula
2. Acceptable data loss threshold — what "flawless" means for this specific workspace
3. Plugin version compatibility at migration time
4. Folder structure preference — flat vs nested
5. Recurring task migration depth — every instance vs just the template
6. Large file handling (>20 MiB) — manual copy required

---

## 13. VERIFICATION PROTOCOL

### Pass 1 — AI Automated (run immediately post-import)
```
- Page existence: cross-reference expected pages against vault file list
- Link validation: grep for broken [[wikilinks]]
- Attachment integrity: count files in attachments folder vs expected
- Database row count: per-folder .md file count vs Notion query-data-source count
- Frontmatter completeness: per-note expected key presence
```

### Pass 2 — Human Sample (run after AI report passes)
```
- Sample 5% of pages for content quality
- Verify 10 critical formulas against Notion source
- Check each required view renders correctly in Obsidian
- Sign off or flag issues for agent repair
```

---

## 14. SOURCES

- prior-findings.md (seeded research, single-pass web research note)
- mcp-notion SKILL.md — 24-tool Notion MCP + 5 API gaps + API 2.0 data-source model
- mcp-obsidian SKILL.md — notesmd-cli, obsidian CLI, cyanheads MCP (14 tools), 11 plugin references
- mcp-notion references/mcp-tools.md — 24-tool catalog
- mcp-notion references/api-gap-tools.md — 5 API gap recipes (file uploads, views, property items, async tasks, daily notes)
- mcp-obsidian references/mcp-tools.md — 14-tool MCP catalog
- mcp-obsidian references/plugins/dataview/ — Dataview DQL, workflows, data model
- Notion API Reference: https://developers.notion.com/reference
- Notion Bases plugin: https://github.com/bgarciamoura/obsidian-notion-bases-plugin
- Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion
- Obsibrain — Notion→Obsidian migration checklist: https://www.obsibrain.com/blog/notion-to-obsidian-migration-a-complete-guide-and-checklist
- alphonsolabs — What survives what breaks: https://www.alphonsolabs.com/notion-obsidian-migration-checklist/
- Iteration artifacts (10 iterations, this lineage): `research/lineages/deepseek/iterations/iteration-001..010.md`