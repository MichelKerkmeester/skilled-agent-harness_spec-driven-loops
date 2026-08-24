---
title: "Final: Flawless complex Notion→Obsidian migration via mcp-notion + mcp-obsidian + plugins"
description: "20-iteration two-track deep research (10× GLM-5.2 High + 10× DeepSeek V4 Flash xhigh) seeded by prior-findings.md. Decides the flawless migration method: importer, recovery paths, mcp-notion/mcp-obsidian division of labor, plugin stack, and parity verification — ready for phase 002+."
synthesizedFrom:
  - lineage: glm
    executor: cli-devin
    model: glm-5-2
    iterations: 10
    stopReason: maxIterationsReached
  - lineage: deepseek
    executor: cli-opencode
    model: cline-pass/cline-pass/deepseek-v4-flash
    iterations: 10
    stopReason: maxIterationsReached
  - seed: prior-findings.md
totalIterations: 20
mergedFindings: 34
resolvedQuestions: 20
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/001-deep-research"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Synthesized both lineages into research.md"
    next_safe_action: "Hand off to phase 002"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-001-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Final: Flawless complex Notion→Obsidian migration via mcp-notion + mcp-obsidian + plugins

> **Two-track deep research** (20 iterations, no early convergence). Track A: **GLM-5.2 High** via cli-devin (10 iterations). Track B: **DeepSeek V4 Flash xhigh** via cli-opencode (10 iterations). Both seeded by `prior-findings.md`. This synthesis merges both lineages' evidence and extends — rather than discarding — the prior findings. Ready for **phase 002+ implementation**.

---

## 1. THE LOAD-BEARING DECISION: IMPORTER

**Verdict from prior-findings.md §1 — confirmed and extended by both lineages.**

The **Obsidian Importer's Notion API mode** is the only viable path for a database-heavy Notion workspace. The HTML `.zip` and Markdown export paths lose all database structure. The API path fetches via the official Notion API, converts blocks to Markdown, generates `.base` files for databases, and resolves cross-references via a three-phase placeholder system (Import → Resolution up to 10 rounds → Cleanup).

| Dimension | Notion API import (primary) | HTML `.zip` (fallback) |
|---|---|---|
| Databases | → Bases (`.base` + frontmatter) | Lost (rows → notes + CSV) |
| Formulas | → Bases formulas (hybrid strategy) | Lost |
| Rollups | → Bases formulas (14 functions mapped) | Lost |
| Relations | → `[[wikilinks]]` (placeholder resolution) | Lost |
| Attachments | Downloaded + `![]()` embeds | Preserved |
| Hierarchy / links | Preserved | Preserved |
| Comments | **Not imported (confirmed gap)** | Not imported |
| Secondary views | **Not imported (default table only)** | Lost |
| Prerequisites | `ntn_` token + internet | None |

**Verdict:** API import for database-heavy workspaces. HTML only when no token can be minted. Notion Markdown export is ruled out (officially discouraged).

[SOURCES: prior-findings.md §1, glm/iteration-001, deepseek/iteration-001 §F1.1]

---

## 2. WHAT SURVIVES vs WHAT NEEDS RECONSTRUCTION

### Auto-preserved
Pages/blocks, nested hierarchy (pages→folders), internal links/mentions (→wikilinks), databases (→Bases), properties (→frontmatter), formulas (→Bases formulas, hybrid strategy), rollups (→Bases formulas), single relations (→wikilinks), block attachments (downloaded + embeds), `files`-property attachments, page cover (→frontmatter `cover`), synced blocks (→separate files), incremental import deduplication.

### Dropped / needs agent-driven reconstruction
- **Comments** (no conversion surface — confirmed gap)
- **Secondary views** (only default table view per database)
- **Dual-relation back-references** (wikilinks but no two-way column)
- **Gallery cover images** (not imported)
- **External attachments** (unless `downloadExternalAttachments=true`)
- **`style()` / `name()` / `email()` formulas** (no Obsidian equivalent)
- **Form/Map/Dashboard views** and **Database buttons** — document as lost (no Obsidian parity)
- **Nested page ordering** (alphabetical only after import)
- **Linked data sources** (cross-database rollup columns)

[SOURCES: glm/iterations 1, 6, 7; deepseek/iteration-004 §F4.1-F4.5]

---

## 3. THE mcp-notion READ SURFACE (inventory)

### MCP Tools (24 across 6 domains)
| Domain | Tools | Key tools |
|---|---|---|
| Pages (7) | retrieve, create, update, properties, etc. | `retrieve-a-page`, `retrieve-page-markdown` |
| Blocks (5) | children, append, etc. | `retrieve-block-children`, `append-block-children` |
| Data sources (6) | databases, query, schema | `retrieve-a-database`, `retrieve-a-data-source`, `query-data-source` |
| Comments (2) | list, create | `list-comments` |
| Users (3) | list, retrieve, bot | `list-all-users` |
| Search (1) | title-anchored search | `search` |

### 5 API Gaps (require direct Notion API calls)
1. **File uploads** — `GET /v1/file_uploads` (no MCP tool)
2. **Saved views** — `GET /v1/databases/{id}/views` (the importer drops these)
3. **Property-item non-truncation** — `GET /v1/pages/{id}/properties/{prop}` (bypasses 25-ref limit)
4. **Async task polling** — `GET /v1/async_tasks/{id}`
5. **Daily notes** — no daily-note-specific endpoint

### Read Limits
- 25-reference truncation on relation/people/rich_text (use API gap 3)
- Title-only search (start from workspace tree, not content search)
- `data_source_id` is the API 2.0 key (not `database_id` — common 400 error)
- ~3 requests/second rate limit per integration

### Inventory Procedure (7 steps)
1. `search` (title roots) → top-level pages/databases
2. `retrieve-a-database` → data-source IDs; `retrieve-a-data-source` → full schema
3. `query-data-source` (paginated) → all rows
4. `GET /v1/databases/{id}/views` (gap) → every saved view
5. `GET /v1/file_uploads` (gap) → attachment ledger
6. `list-comments` + `list-all-users` → full comment thread inventory
7. `GET /v1/pages/{id}/properties/{prop}` (gap) → non-truncated relation values

[SOURCES: glm/iteration-002, deepseek/iteration-005 §F5.1-F5.5]

---

## 4. THE mcp-obsidian WRITE SURFACE (reconstruction)

Three surfaces compose the write layer:

1. **notesmd-cli (headless, primary)** — filesystem operations without a running Obsidian app. Commands: `list`, `create`, `frontmatter`, `print`, `search-content`. The default for unattended migration.
2. **Cyanheads MCP (app-backed, optional)** — 14 `obsidian_*` tools requiring Local REST API + running Obsidian. Accelerator for: `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`, `obsidian_manage_tags`.
3. **Plugin file-layer** — direct Read/Write/Edit on `.base` files, `_database.md` plugin schemas, `data.json` plugin configs, `community-plugins.json`.

**Key finding: no CLI/MCP tool authors `.base` files or Dataview query blocks.** Both are pure file-layer operations — the agent writes them directly.

[SOURCES: glm/iteration-003, deepseek/iteration-002]

---

## 5. RELATIONS, ROLLUPS & FORMULAS — THREE-WAY RECOVERY

**The prior-findings.md verdict "Bases has no two-way relational schema and no rollups out of the box" is partially superseded.** Bases v1.9.7 added cross-note lookups (`file()`/`asFile()`/`File.properties`), and the Notion Bases community plugin provides native relation/lookup/rollup columns.

### Recovery Tiers

| Notion feature | Importer auto-convert | Best recovery for full parity |
|---|---|---|
| Single relation | → wikilinks | Verify wikilinks resolve |
| Dual (two-way) relation | → wikilinks (no back-ref) | Notion Bases plugin two-way Relation v1.3.0+, or Dataview back-ref DQL |
| Rollup (count family) | → Bases formula | Keep import formula, or Notion Bases plugin count/count_values, or Dataview |
| Rollup (sum/avg/min/max) | → Bases formula | Notion Bases plugin Rollup column (7 functions, auto-refresh), or Dataview |
| Rollup (show_original) | → Bases formula (asFile()) | Notion Bases plugin Lookup column, or Bases `asFile().properties` |
| Subtasks (self-relation) | → wikilinks | Notion Bases plugin self-relation, 3-level hierarchy |
| Formula (logical/text/math) | → Bases formula (hybrid) | Keep; hand-translate style()/name()/email() |
| Formula (dateBetween/dateRange) | VERIFY | Test post-import; fallback to DataviewJS |

### Three-Way Plugin Recovery Matrix

| Pattern | Notion Bases plugin | Core Bases | Dataview |
|---|---|---|---|
| One-to-one relation | Native relation column | `[[wikilink]]` (no enforcement) | Manual DQL |
| One-to-many | Native + self-relation subtasks (3 levels) | Partial | DQL `GROUP BY` |
| Many-to-many | Multi-select relation column | Manual | DQL `FLATTEN` |
| Rollup (7 functions) | **7 built-in** inline in table | None | Manual DQL `TABLE` |
| Formula expression | Spreadsheet-style | Expression-based (JS-like) | DataviewJS |
| Views | 7 (table/board/gallery/list/calendar/timeline/chart) | 2-3 | TABLE/LIST/CALENDAR |

The plugin handles **over 90% of Notion's relational feature set**. Dataview supplements for custom aggregations. `.base` files alone are insufficient for any workspace with relations, rollups, or formulas.

[SOURCES: glm/iteration-4, deepseek/iteration-003 §F3.1-F3.5, prior-findings.md §2-3]

---

## 6. FILES, ATTACHMENTS & COMMENTS

### Attachments
Importer downloads image/video/PDF/file into the attachment folder with `![]()` embeds (`ATTACHMENT_CONFIGS`); `downloadExternalAttachments` (default false) must be opted in; `incrementalImport` deduplicates by size. `files`-property attachments are downloaded with frontmatter references (verify exact shape post-import). Page cover → frontmatter `cover`. **Gallery cover images: gap** (not imported). Large files (>20 MiB) may fail the import — human must copy manually.

If the AI needs to upload to Notion during inventory: `POST /v1/file_uploads` → `POST /send` (multipart) → MCP `append-block-children` with `file_upload` id reference. Three-step, fully automatable.

### Comments — confirmed gap
The importer has **no comment conversion** whatsoever. Reconstruction workflow:
1. **Inventory**: `list-comments` per page + `list-all-users` for author mapping
2. **Reconstruction**: Convert each comment thread to `> [!comment]` callout blocks appended to page body + `comment_count` frontmatter
3. **Verification**: Confirm all threads from inventory have corresponding callouts

[SOURCES: glm/iteration-6, deepseek/iteration-004 §F4.3]

---

## 7. MULTI-VIEW DATABASES & NESTED HIERARCHY

### Views — only default table view imports
Core Bases covers 4/10 Notion view types (table/board/list/calendar + card); the Notion Bases plugin covers 7/10 (adds gallery/timeline/gantt/chart); **form/map/dashboard have no Obsidian parity** (document as lost). View-level filters, sorts, and field visibility are not imported.

Reconstruction: inventory via the views API gap → translate each view config → write Notion Bases plugin schema into `_database.md`.

### Hierarchy — preserved
Pages with children → folder nesting; synced blocks → separate files; `notion-id` frontmatter enables re-association. **Lost:** manual drag-reorder (notes alphabetical), breadcrumb parent references. Reconstruction option: `parent:: [[Parent]]` and `order:: N` frontmatter fields for Dataview to sort by.

[SOURCES: glm/iteration-7, deepseek/iteration-004 §F4.4, deepseek/iteration-006 §F6.1-F6.2]

---

## 8. REQUIRED vs OPTIONAL PLUGINS

### Required
| Plugin | Priority | Role | mcp-obsidian knows? |
|---|---|---|---|
| **Core Bases** (shipped v1.9+) | Mandatory | Importer target; table/board/list/calendar views; formulas | Yes |
| **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin` v1.5.0+) | **P0 — Required** | Two-way relations, 7 rollup functions, 7 views, subtasks, Lookup | No — agent uses plugin docs |
| **Dataview** (`blacksmithgu/obsidian-dataview`) | P1 — High rec. | Read-only rollup DQL, back-ref queries, custom aggregations, inline fields | Yes — full plugin knowledge |

### Optional (conditional)
| Plugin | Priority | When |
|---|---|---|
| Tasks | P2 — Conditional | If recurring-task databases exist |
| Obsidian Git | P2 — Recommended | Vault backup during migration window |
| Kanban / Calendar / Full Calendar | P3 — Optional | If Notion Bases views insufficient |
| BRAT (Obsidian42) | P3 — Optional | Install Notion Bases via GitHub instead of Community Plugins |
| Iconic | P4 — Cosmetic | File/folder icons replacing Notion page icons |
| Excalidraw | P4 — Optional | Replace Notion inline drawings |

### No parity (document as lost)
Form/Map/Dashboard views, Database buttons.

**Minimum viable install:** Notion Bases + Dataview. Agent writes all schema files; human clicks "Install."

[SOURCES: glm/iteration-8, deepseek/iteration-007 §F7.1-F7.4]

---

## 9. THE mcp-notion-READS / mcp-obsidian-WRITES DIVISION OF LABOR (REQ-003)

### Method (7-step)

| Step | What happens | mcp-notion READS | mcp-obsidian WRITES | Mode |
|---|---|---|---|---|
| 1. **Inventory** | Map every database, relation, rollup, formula, view, comment, file | 24 MCP tools + 5 API gaps → ledger | — | **AI** (headless reads) |
| 2. **Import** | Bulk import via Obsidian Importer | — | Importer writes notes/Bases/attachments/wikilinks | **Human** (in-app Importer) |
| 3. **Relations** | Verify wikilinks; rebuild two-way relations | `retrieve-a-data-source` + property-item gap | File-layer: verify + Notion Bases plugin Relation / back-ref DQL | **AI** (headless) |
| 4. **Rollups** | Verify auto-converted formula; add plugin rollup | `retrieve-a-data-source` | File-layer: verify Bases formula; Notion Bases Rollup column | **AI** (headless) |
| 5. **Formulas** | Verify hybrid formulas; hand-fix style/name/email | `retrieve-a-data-source` | File-layer: verify; hand-fix no-equivalent; static fallback | **AI** (headless) |
| 6. **Files/comments** | Verify embeds; reconstruct comments; fix gallery covers | File-upload gap + MCP `list-comments` | notesmd-cli: verify embeds; append `## Comments` + `comment_count` | **AI** (headless; MCP optional) |
| 7. **Views** | Reconstruct secondary views | Views API gap (`GET /v1/databases/{id}/views`) | File-layer: `.base` view blocks / `_database.md` plugin views | **AI** (headless) |
| 8. **Verification** | Run 11 parity checks | `query-data-source` + comment-list | notesmd-cli `list`/`search-content` + grep + Dataview | **AI** (headless) |

### Mode A vs Mode B
**Mode A** = human-driven Importer bulk (step 2 only). **Mode B** = agent gap-closing via mcp-notion reads + mcp-obsidian writes (all other steps). The agent never drives the in-app UI; it complements at the file layer.

### Human-Required (3 GUI interactions, ~12-17 min total)
1. Create Notion internal integration + grant content access
2. Install Notion Bases + Dataview plugins in Obsidian
3. Run Obsidian Importer — paste token + choose scope

### AI-Automatable (everything else)
Pre-flight: full workspace inventory, migration ledger, UUID→filename cross-reference. Post-import: verify integrity, rewrite relations, create plugin schemas, write Dataview queries, normalize frontmatter, reconstruct comments, fix broken links, convert callouts/toggles, run parity verification script, generate migration report.

**Total AI autonomous time:** ~30 min to 4+ hours (rate-limit dependent).

[SOURCES: glm/iteration-9, deepseek/iteration-009 §F9.1-F9.5]

---

## 10. VERIFICATION PROTOCOL

### Pass 1 — AI Automated (run immediately post-import)
1. **Page existence** — cross-reference expected pages against vault file list
2. **Link validation** — grep for orphaned `[[wikilinks]]`
3. **Attachment integrity** — count files in attachments folder vs Notion source
4. **Database row count** — per-folder `.md` count vs `query-data-source` count
5. **Property schema parity** — compare Notion schema vs frontmatter keys
6. **Formula output accuracy** — cross-reference sample against Notion source
7. **Comment count parity** — `list-comments` count vs `## Comments` sections
8. **View count parity** — inventory view count vs `.base`/`_database.md` view blocks
9. **Hierarchy parity** — page→folder nesting vs Notion parent tree
10. **Property-type mismatch** — type-check frontmatter values
11. **Relation resolution** — every UUID rewritten to a resolvable `[[wikilink]]`

### Pass 2 — Human Sample (run after AI report passes)
- Sample 5% of pages for content quality
- Verify 10 critical formulas against Notion source (especially `dateBetween`/`dateRange`)
- Check each required view renders correctly in Obsidian
- Sign off or flag issues for agent repair

**Keep Notion live until both passes clear.** This is not a "rip and replace" migration.

[SOURCES: glm/iteration-10, deepseek/iteration-008 §F8.1-F8.4]

---

## 11. SCALABILITY & RATE LIMITS

For a large workspace (50 databases, 200 data sources, 5000 pages):
- **Full deep inventory**: ~11,500 API calls → ~64 minutes at 3 req/s
- **Quick inventory (schema only)**: ~500 calls → ~3 minutes
- **Primary constraint**: Notion API rate limit (~3 req/s per integration)
- **Optimization**: Quick inventory first, then deep-inventory only "must-preserve" databases
- **Recommendation**: incremental per-database migration for very large workspaces

[SOURCE: deepseek/iteration-010 §F10.1-F10.2]

---

## 12. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Source |
|---|---|---|
| Notion Markdown export as a route | Officially discouraged; omits important data | prior-findings.md §1, glm/iter-1 |
| HTML `.zip` as primary path for database-heavy spaces | Loses databases, views, properties, formulas, relations, rollups | prior-findings.md §1, deepseek/iter-001 |
| Content-based inventory via `search` | `search` is title-only — cannot search page body | glm/iter-2, mcp-notion SKILL.md |
| MCP as default write path for unattended migration | Needs running app + Local REST API + API key | glm/iter-3, mcp-obsidian SKILL.md |
| Assuming a CLI/MCP tool authors `.base`/Dataview | Pure file-layer; no such tool exists | glm/iter-3 |
| "Relations/rollups are lost on import" | False — auto-converted to Bases formulas and wikilinks | glm/iter-4, importer source |
| "Bases cannot do any cross-note lookup" | False since v1.9.7 (`file()`/`asFile()`) — aggregation still limited | glm/iter-4, forum thread |
| "All formulas convert live" | Some need static fallback (style/name/email have no equivalent) | glm/iter-5 |
| "External attachments download by default" | `downloadExternalAttachments` defaults false | glm/iter-6 |
| "All Notion views import" | Only default table view — secondary views dropped | glm/iter-7, deepseek/iter-004 |
| Full autonomous AI migration without human GUI | Importer and plugin installation are GUI-only in 2026 | deepseek/iter-009 §F9.5 |
| 100% automated verification | Formula parity and visual layout require human sample-check | deepseek/iter-008 §F8.3 |

---

## 13. DIVERGENCE MAP

Both lineages converged on the same migration method despite different models and angles. No divergent pivots were required — evidence density was sufficient from both tracks to reach a decided method with no open design questions.

### Saturated directions (confirmed by both lineages)
- API importer path: fully resolved with concrete loss/gain per feature
- Relation/rollup/formula recovery: resolved with three-tier plugin matrix
- mcp-notion/mcp-obsidian division of labor: resolved with 7-step mapped method
- Comments gap: confirmed; reconstruction method decided
- Plugin requirements: resolved with P0-P4 ranking
- Verification regime: resolved with two-pass protocol

### Remaining frontier (phase 002+ verification, not design blockers)
- `median`/`range` rollup conversion details — confirm post-import
- `dateBetween`/`dateRange` Bases formula parity — confirm post-import
- `files`-property frontmatter serialization shape — confirm post-import
- Bases v1.9.7 aggregation limits — confirm against current docs
- Local REST API `vault_*` MCP vs cyanheads `obsidian_*` for live-app verification
- Real-world rate-limit budget for large workspace vs theoretical ~3 req/s

---

## 14. OPEN QUESTIONS

None blocking. The migration method is **decided** — these are phase-002+ verification concerns, not design blockers.

- **VERIFY:** `median`/`range` rollup conversion in the importer — confirm post-import
- **VERIFY:** `dateBetween`/`dateRange` Bases formula parity — confirm exact equivalent
- **VERIFY:** `files`-property frontmatter serialization shape — confirm post-import
- **VERIFY:** Bases v1.9.7 aggregation limits — confirm against current Bases docs
- **OPEN:** Whether Local REST API plugin's `vault_*` MCP offers better verification surface than cyanheads MCP
- **OPEN:** Real-world rate-limit budget for large workspace inventory

---

## 15. RECOMMENDATIONS

1. **Use the Notion API importer** — the only path that preserves databases as Bases
2. **Install Notion Bases plugin (P0) + Dataview (P1)** before reconstruction
3. **Adopt the hybrid flow**: 3 human GUI actions; AI automates everything else
4. **Treat all relational data as suspect** until independently verified via the two-pass protocol
5. **Run quick inventory first** to scope the migration before full deep inventory
6. **Use incremental per-database migration** for very large workspaces
7. **Keep Notion live** until two-pass verification clears — not a rip-and-replace migration
8. **Headless is sufficient**: entire reconstruction + verification pipeline runs via notesmd-cli + file Read/Edit

---

## 16. CONVERGENCE REPORT

- **Stop reason:** `maxIterationsReached` (20/20) — configured stop policy; convergence was telemetry only
- **Total iterations completed:** 20 (10 GLM + 10 DeepSeek)
- **Questions answered:** 20/20 key questions resolved with cited evidence
- **Key findings:** 34 across both lineages (19 GLM, 15 DeepSeek)
- **Synthesized sources:** prior-findings.md + 20 iteration files + mcp-notion/mcp-obsidian skill references + Notion API docs + plugin release notes + Obsidian forum threads + blogs
- **Source diversity:** >25 distinct sources across 3 skill references, 4 GitHub repos, 3 blog posts, 2 forum threads, 1 official help page, prior-findings.md, and 20 iterations of focused investigation
- **Divergent pivots:** 0 (both lineages converged on the same method independently)
- **Stuck count:** 0 — every iteration in both tracks produced cited findings

---

## 17. SYNTHESIS METHOD

This document merges independent outputs from two 10-iteration deep-research lineages (GLM-5.2 High via cli-devin; DeepSeek V4 Flash xhigh via cli-opencode). Both lineages were seeded by `prior-findings.md`. The merged registry (`research/findings-registry.json`) records 20 resolved questions and 34 key findings, attributed to their source lineage. Where lineages agree on a finding (most cases), the synthesis preserves both citations. Where one lineage provides more depth on a sub-topic (e.g., GLM on mcp-notion read surface mapping, DeepSeek on AI-vs-human labor division), that detail is incorporated and attributed.

### Sources
- **prior-findings.md** — the seeded single-pass web-research note (preserved, not replaced)
- **GLM lineage** (glm/research.md + 10 iteration files) — mcp-notion read surface, mcp-obsidian write surface, formula recovery, comments gap, eliminated alternatives
- **DeepSeek lineage** (deepseek/research.md + 10 iteration files) — AI-vs-human division, API 2.0 data-source model, three-way plugin recovery matrix, scalability, verification protocol
- **Skill references:** mcp-notion SKILL.md + references, mcp-obsidian SKILL.md + references
- **External:** Notion API Reference, Obsidian Importer GitHub source, Obsidian Help, plugin repos

---

## 18. REFERENCES

### Skill references
- mcp-notion SKILL.md + references (database-model.md, api-gap-tools.md, mcp-tools.md, property-types.md)
- mcp-obsidian SKILL.md + references (mcp-tools.md, plugins/dataview/)

### Obsidian Importer
- GitHub: https://github.com/obsidianmd/obsidian-importer (src/formats/notion-api/*)
- DeepWiki — Notion API importer: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api
- DeepWiki — Database Views and Base Files: https://deepwiki.com/obsidianmd/obsidian-importer/2.6-database-views-and-base-files
- Importer bounty (views): https://github.com/obsidianmd/obsidian-importer/issues/421
- Importer PR #444: https://github.com/obsidianmd/obsidian-importer/pull/444

### Plugins
- Notion Bases plugin: https://github.com/bgarciamoura/obsidian-notion-bases-plugin
- Notion Bases plugin v1.3.0 (two-way relations): https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.3.0
- Notion Bases plugin v1.5.0 (rollups/subtasks/charts): https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.5.0
- Community store: https://community.obsidian.md/plugins/notion-bases
- Obsidian Forum — Bases cross-note lookup/rollup: https://forum.obsidian.md/t/bases-formula-cross-note-lookup-rollup/101990
- Obsidian Forum — Bases Toolbox: https://forum.obsidian.md/t/enhance-bases-usability-experience-with-bases-toolbox/115907

### External references
- Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion
- Notion API Reference: https://developers.notion.com/reference
- XDA — Bases vs Notion: https://www.xda-developers.com/tested-obsidian-bases-against-notion-with-real-project-one-fell-apart/
- Obsibrain — Migration checklist: https://www.obsibrain.com/blog/notion-to-obsidian-migration-a-complete-guide-and-checklist
- alphonsolabs — What survives: https://www.alphonsolabs.com/notion-obsidian-migration-checklist/
- Dan Holloran — Bases native views: https://danholloran.me/posts/obsidian-bases-native-database-views-without-dataview

### Research lineage artifacts
- GLM lineage: `research/lineages/glm/iterations/iteration-001..010.md`
- DeepSeek lineage: `research/lineages/deepseek/iterations/iteration-001..010.md`
- Merged findings registry: `research/findings-registry.json`
- Fan-out attribution: `research/fanout-attribution.md`