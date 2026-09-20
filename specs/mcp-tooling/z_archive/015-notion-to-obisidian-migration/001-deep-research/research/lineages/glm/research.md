---
title: "GLM Lineage Research: Flawless complex Notion→Obsidian migration via mcp-notion + mcp-obsidian + plugins"
description: "Synthesized findings from the GLM-5.2 (cli-devin) 10-iteration deep-research lineage on flawless complex Notion→Obsidian migration. Extends prior-findings.md with source-level evidence on the importer's rollup→formula/relation→wikilink conversion, Bases v1.9.7 cross-note lookups, the Notion Bases community plugin's native relations/rollups/views, the comments gap, the mcp-notion-reads/mcp-obsidian-writes division of labor, and a programmatic parity regime."
lineage: glm
sessionId: fanout-glm-1787344059442-oo7ndm
executor: cli-devin
model: glm-5-2
iterations: 10
stopReason: maxIterationsReached
synthesizedAt: 2026-08-21T23:45:00Z
trigger_phrases: []
---

# GLM Lineage Research: Flawless complex Notion→Obsidian migration

> **Lineage `glm`** (Track A, cli-devin / GLM-5.2 High). 10/10 iterations completed under `max-iterations` (convergence off). This synthesis extends — and in three places **supersedes** — the seeded `prior-findings.md`, citing source-level evidence. Sibling lineage `deepseek` (Track B) runs independently; the parent orchestrator merges both.

---

## 1. EXECUTIVE SUMMARY

A flawless complex Notion→Obsidian migration uses the **official Obsidian Importer's Notion API mode** for the bulk import (the only path that reconstructs databases as Bases, converts formulas and rollups to Bases formulas, resolves relations to wikilinks, and downloads attachments), then **agent-driven file-layer reconstruction** via `mcp-notion` reads + `mcp-obsidian` writes to close the importer's gaps: **comments, secondary views, two-way relations, gallery covers, and interactive rollup columns**. The required plugin stack is **Core Bases + the Notion Bases community plugin + Dataview**. The entire reconstruction + verification pipeline is **headless-capable** (notesmd-cli + file Read/Edit); the agent never drives the in-app Importer UI.

**Three refinements to the prior findings:**
1. The prior "relations & rollups need verification" flag is now **substantially resolved** — the importer auto-converts rollups→Bases formulas and relations→wikilinks (source-confirmed), though both need post-import verification.
2. The prior "Bases has no two-way relational schema and no rollups out of the box" is **partially superseded** — Bases v1.9.7 added cross-note lookups (`file()`/`asFile()`/`File.properties`), and the Notion Bases community plugin provides native two-way relations, lookup/rollup columns, and 7 view types.
3. The comments gap is **confirmed** — the importer has no comment conversion; recovery is MCP comment-list → appended `## Comments` section + `comment_count` frontmatter.

---

## 2. THE LOAD-BEARING DECISION: IMPORTER

The official Obsidian Importer's Notion API mode (merged; DeepWiki indexed 2026-01-25) is the **confirmed primary path** for a database-heavy workspace. It fetches via the official Notion API, converts blocks to Markdown, generates `.base` files, and resolves cross-references via a three-phase placeholder system (Import → Resolution up to 10 rounds → Cleanup). [SOURCE: iteration 1, deepwiki.com/.../3.2-notion-api]

| Dimension | Notion API import (primary) | HTML `.zip` (fallback) |
|---|---|---|
| Databases | → Bases (`.base` + frontmatter) | Lost (rows → notes + CSV) |
| Formulas | → Bases formulas (`hybrid` strategy) | Lost |
| Rollups | → Bases formulas (14 functions mapped) | Lost |
| Relations | → `[[wikilinks]]` (placeholder resolution) | Lost |
| Attachments | Downloaded + `![]()` embeds | Preserved |
| Hierarchy / links | Preserved | Preserved |
| Comments | **Not imported (gap)** | Not imported |
| Secondary views | **Not imported (gap — default table only)** | Lost |
| Prerequisites | `ntn_` token + internet | None |

**Verdict:** API import for a database-heavy workspace. HTML only when a token cannot be minted. Notion's own Markdown export is ruled out (officially discouraged; omits data).

---

## 3. WHAT THE IMPORTER PRESERVES vs DROPS

### Auto-preserved
Pages/blocks, nested hierarchy, internal links/mentions (→wikilinks), databases (→Bases), properties (→frontmatter), formulas (→Bases formulas, hybrid), rollups (→Bases formulas), single relations (→wikilinks), block attachments (downloaded + embeds), `files`-property attachments, page cover (→frontmatter `cover`), synced blocks (→separate files), incremental import.

### Dropped / needs reconstruction
**Comments** (no conversion surface), **secondary views** (only default table), **dual-relation back-references** (wikilinks but no two-way column), **gallery cover images**, **external attachments** (unless `downloadExternalAttachments=true`), **`style()`/`name()`/`email()` formulas** (no equivalent). **Form/Map/Dashboard views** and **Database buttons** have no Obsidian parity — document as lost.

[SOURCE: iterations 1, 6, 7]

---

## 4. THE mcp-notion READ SURFACE (inventory)

24 MCP tools (pages 7, blocks 5, data sources 6, comments 2, users 3, search 1) + 5 API gaps (file uploads, views, page property items, async tasks, daily notes). [SOURCE: iteration 2]

**Inventory procedure:**
1. `search` (title roots) → top-level pages/databases.
2. `retrieve-a-database` → data-source IDs; `retrieve-a-data-source` → full schema (properties, relation config, rollup config, formula expression, select options).
3. `query-data-source` (paginated) → rows; `GET /v1/pages/{id}/properties/{prop}` gap → non-truncated relations/people/text (past 25-ref limit).
4. `GET /v1/databases/{id}/views` gap → every saved view (the set the importer drops).
5. `GET /v1/file_uploads` gap → attachment ledger.
6. MCP comment-list → comments; MCP user-list → people.

**Read limits:** truncation at 25 refs (use property-item gap); title-only search (start from the tree, not content search); `data_source_id` not `database_id` (API 2.0); ~3 req/s rate limit; relation target must be shared.

---

## 5. THE mcp-obsidian WRITE SURFACE (reconstruction)

Three surfaces: headless `notesmd-cli` (filesystem, no app), app-backed cyanheads MCP (14 `obsidian_*` tools, needs Local REST API + running app), and the **plugin file-layer** (Read/Write/Edit on `.base`/`_database.md`/`data.json`/`community-plugins.json`). [SOURCE: iteration 3]

**Headless is the primary write surface for unattended migration.** The MCP is an optional accelerator (steps 6, 8) when a live app is available. There is **no CLI/MCP tool that authors `.base` files or Dataview query blocks** — both are pure file-layer operations. The Local REST API plugin also ships its own `vault_*` MCP (16 tools) — confirm with `list_tools()`.

---

## 6. RELATIONS & ROLLUPS RECOVERY

**The prior "no rollups out of the box" is superseded.** Three recovery tiers: [SOURCE: iteration 4]

| Notion feature | Importer | Best recovery |
|---|---|---|
| Single relation | wikilinks | verify |
| Dual (two-way) relation | wikilinks (no back-ref) | Notion Bases plugin two-way Relation (v1.3.0+) or Dataview back-ref query |
| Rollup (count family) | Bases formula | keep, or Notion Bases plugin `count`/`count_values` column, or Dataview |
| Rollup (sum/avg/min/max) | Bases formula (sum/avg) | Notion Bases plugin rollup column (native, auto-refresh) or Dataview |
| Rollup (show_original/lookup) | Bases formula | Notion Bases plugin Lookup column or Bases `asFile().properties` formula |
| Subtasks (self-relation) | wikilinks | Notion Bases plugin self-relation + hierarchical (3 levels) |

**Bases v1.9.7** added `file()`/`Link.asFile()`/`File.properties` cross-note lookups — but no native aggregation, no auto-refresh, performance impact. The Notion Bases community plugin (v1.5.0+) provides native relation/lookup/rollup columns (7 functions), two-way sync, subtasks, and 7 views. Dataview recovers rollups read-only (`SUM`/`COUNT`/`AVG` over linked pages). [SOURCE: forum cross-note-lookup thread, plugin release notes]

---

## 7. FORMULAS 2.0 RECOVERY

The importer's `convertNotionFormulaToObsidian()` translates Notion formulas to Bases formulas, strategy `hybrid` (live) or `static` (computed-value fallback). [SOURCE: iteration 5]

| Family | Auto-convert? | Notes |
|---|---|---|
| Logical (`if`/`and`/`or`/`not`/`empty`) | Yes | expression-isomorphic |
| Text (`concat`/`join`/`slice`/`contains`/`replace`…) | Mostly | `style()` has no equivalent |
| Math (`round`/`floor`/`sqrt`/`abs`…) | Yes | — |
| Date (`now`/`dateAdd`/`dateBetween`…) | Mostly | `dateBetween`/`dateRange` VERIFY |
| Person (`name`/`email`) | No | store person as text field |
| List (`map`/`filter`/`unique`/`sort`…) | Yes | used in rollup→formula conversion |

Recovery: let the importer auto-convert (hybrid); hand-translate `style`/`name`/`email`; `static` fallback for no-equivalent; DataviewJS for complex read-only; Notion Bases plugin spreadsheet-style formulas for new interactive columns.

---

## 8. FILES, ATTACHMENTS & COMMENTS

**Attachments:** importer downloads image/video/PDF/file into the attachment folder with `![]()` embeds (`ATTACHMENT_CONFIGS`); `downloadExternalAttachments` (default false) opt-in; `incrementalImport` dedupes by size. `files`-property attachments downloaded (frontmatter ref — VERIFY shape). Page cover → frontmatter `cover`. **Gallery cover images: gap** (not imported). [SOURCE: iteration 6]

**Comments: confirmed gap.** The importer has no comment conversion. Recovery: MCP comment-list → appended `## Comments` section + `comment_count` frontmatter per note (greppable, diff-able, parity-checkable). Obsidian has no native comment concept.

---

## 9. MULTI-VIEW DATABASES & NESTED HIERARCHY

**Views:** only the default table view imports. Core Bases covers 4/10 Notion view types (table/board/list/calendar + card); the Notion Bases plugin covers 7/10 (adds gallery/timeline/gantt/chart); form/map/dashboard have no parity (document as lost). Reconstruct via the views API-gap inventory → file-layer `.base` view blocks / `_database.md` plugin views, mapping Notion filters → nested AND/OR/NOT. [SOURCE: iteration 7]

**Hierarchy:** preserved — pages with children → folders; synced blocks → separate files; `notion-id` frontmatter enables re-association. Verify deeply nested databases land in expected folders.

---

## 10. REQUIRED vs OPTIONAL PLUGINS

**Required:**
1. **Core Bases** (shipped v1.9+) — importer target; table/board/list/calendar/card views; formulas.
2. **Notion Bases community plugin** (`bgarciamoura/obsidian-notion-bases-plugin` v1.5.0+) — two-way relations, lookup/rollup columns (7 functions), subtasks, gallery/timeline/gantt/chart views. **Required for relational/view parity.**
3. **Dataview** (`blacksmithgu/obsidian-dataview`) — already in `mcp-obsidian` knowledge + enabled; read-only rollups, back-ref queries, verification.

**Optional:** Tasks, Kanban, Calendar/Full Calendar, Obsidian Charts, Bases Toolbox, Excalidraw, Obsidian Git, Outliner, BRAT (enabler for installing the Notion Bases plugin from GitHub).

**No parity:** Form/Map/Dashboard views, Database buttons — document as lost.

Install/config is file-layer: `community-plugins.json` to enable; `data.json` (backup-then-merge) for settings; BRAT for GitHub installs. [SOURCE: iteration 8]

---

## 11. RECOMMENDATIONS — THE mcp-notion-reads / mcp-obsidian-writes DIVISION OF LABOR

**The method (REQ-003):**

| Step | mcp-notion READS | mcp-obsidian WRITES | Mode |
|---|---|---|---|
| 1 Inventory | 24 MCP + 5 API gaps → ledger | — | agent (headless reads) |
| 2 Import | — | Importer writes notes/Bases/attachments/wikilinks | **human-driven Importer (Mode A)** |
| 3 Relations | `retrieve-a-data-source` + property-item gap | file-layer: verify wikilinks; Notion Bases plugin two-way Relation / Dataview back-ref | agent (headless) |
| 4 Rollups | `retrieve-a-data-source` | file-layer: verify formula; Notion Bases plugin Rollup column / Dataview | agent (headless) |
| 5 Formulas | `retrieve-a-data-source` | file-layer: verify hybrid formula; hand-fix style/name/email; static fallback | agent (headless) |
| 6 Files/comments | `GET /v1/file_uploads` gap + MCP comment-list | notesmd-cli create/Edit: verify embeds; append `## Comments` + `comment_count`; gallery cover frontmatter | agent (headless; MCP optional) |
| 7 Views | `GET /v1/databases/{id}/views` gap | file-layer: `.base` view blocks / `_database.md` plugin views | agent (headless) |
| 8 Verification | `query-data-source` + property-item gap + comment-list | `notesmd-cli list`/`search-content` + grep + Dataview (MCP `obsidian_search_notes` optional) | agent (headless) |

**Mode A** = human-driven Importer bulk. **Mode B** = agent gap-closing via mcp-notion reads + mcp-obsidian writes. The agent never drives the in-app UI; it complements at the file layer. The entire reconstruction + verification pipeline is headless-capable. [SOURCE: iteration 9]

---

## 12. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Notion Markdown export as a route | Officially discouraged; omits important data | prior-findings §1 | 1 |
| HTML `.zip` as primary path for database-heavy spaces | Loses databases, views, properties, formulas, relations, rollups | prior-findings §1, iteration 1 | 1 |
| Content-based inventory via `search` | `search` is title-only | mcp-notion/SKILL.md NEVER #6 | 2 |
| Using `database_id` where `data_source_id` required | API 2.0 made data sources primary; most common 400 | database-model.md §3 | 2 |
| MCP as default write path for unattended migration | Needs running app + Local REST API + `OBSIDIAN_API_KEY` | mcp-obsidian/SKILL.md §2 | 3 |
| Assuming a CLI/MCP tool authors `.base`/Dataview | Pure file-layer; no such tool exists | dataview.md §3 | 3 |
| "Relations/rollups are lost on import" | False — auto-converted to formulas/wikilinks | importer database-helpers.ts | 4 |
| "Bases cannot do any cross-note lookup" | False since v1.9.7 (`file`/`asFile`); aggregation still limited | forum cross-note-lookup thread | 4 |
| "All formulas convert live" | Some need `static` fallback (style/name/email) | importer formulaStrategy | 5 |
| "Comments are imported" | Importer has no comment conversion surface | deepwiki Notion API page | 6 |
| "External attachments download by default" | `downloadExternalAttachments` defaults false | notion-api.ts settings | 6 |
| "All Notion views import" | Only default table view imports | deepwiki database-views + bounty issue | 7 |
| "Core Bases covers gallery/timeline/chart" | It does not — Notion Bases plugin needed | plugin release notes | 7 |
| "Notion Bases plugin optional for complex relational workspace" | Required for two-way relations + 6 non-table view types | iterations 4 + 7 | 8 |
| "Agent drives in-app Importer UI" | Cannot — human-driven bulk; agent complements at file layer | prior-findings §5 | 9 |
| "Full parity for form/map/dashboard views" | No Obsidian equivalent — document as lost | iteration 7 | 10 |

---

## 13. OPEN QUESTIONS

- **VERIFY:** `median`/`range` rollup conversion in the importer (source truncated) — confirm post-import. [iteration 4]
- **VERIFY:** `dateBetween`/`dateRange` Bases formula parity — confirm exact equivalent. [iteration 5]
- **VERIFY:** `files`-property frontmatter serialization shape — confirm post-import. [iteration 6]
- **VERIFY:** Bases v1.9.7 aggregation limits (no native sum/avg over linked-property lists) — single forum thread; confirm against current Bases docs. [iteration 4]
- **OPEN:** Whether the Local REST API plugin's `vault_*` MCP (16 tools, `vault_patch`/`search_query`) offers a better verification surface than cyanheads `obsidian_*` when a live app is available. [iteration 3, 10]
- **OPEN:** Real-world rate-limit budget for a large workspace inventory (the ~3 req/s ceiling is documented; actual pagination overhead is not measured here). [iteration 2]

These are phase-002+ verification concerns, not design blockers — the method is decided.

---

## 14. PARITY & VERIFICATION REGIME

11 programmatic pass/fail checks (mcp-notion source vs mcp-obsidian/grep target): page/note count, row count per database, property schema parity, relation resolution (no orphaned wikilinks), rollup/formula render, attachment presence, comment count parity, view count parity, hierarchy parity, internal link parity, property-type mismatch. Keep Notion live until all pass. [SOURCE: iteration 10]

---

## 15. CONFIDENCE & EVIDENCE DENSITY

- **Source-confirmed (high confidence):** importer behavior (GitHub source + DeepWiki), mcp-notion/mcp-obsidian surfaces (skill references), Notion Bases plugin features (release notes), Bases v1.9.7 lookups (forum).
- **Inferred (medium confidence):** `median`/`range` rollup conversion, `dateBetween`/`dateRange` parity, `files`-property frontmatter shape, Bases aggregation limits.
- **Source diversity:** importer GitHub source (3 files), DeepWiki (2 pages), Obsidian forum (2 threads), plugin GitHub/releases (3), XDA/Obsibrain/Dan Holloran blogs (3), skill references (6), prior-findings (1). 20 distinct sources across 10 iterations.

---

## 16. CONVERGENCE REPORT

- **Stop reason:** `maxIterationsReached` (10/10) — the configured stop policy. Convergence was off; signals were telemetry only.
- **Total iterations completed:** 10
- **Questions answered ratio:** 10/10 key questions answered with cited evidence.
- **newInfoRatio trend:** 0.82 → 0.68 → 0.64 → 0.78 → 0.55 → 0.71 → 0.66 → 0.58 → 0.62 → 0.45. Average ≈ 0.65. The trend is non-monotonic by design (broadening angles per the stop policy): high-novelty iterations (1, 4, 6) alternate with integration iterations (5, 8, 10). No early synthesis was performed.
- **Stuck count:** 0 (no stuck iterations; every iteration produced cited findings).

---

## 17. REFERENCES

- Obsidian Importer (Notion API): https://github.com/obsidianmd/obsidian-importer (src/formats/notion-api/*)
- DeepWiki — Notion API importer: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api
- DeepWiki — Database Views and Base Files: https://deepwiki.com/obsidianmd/obsidian-importer/2.6-database-views-and-base-files
- Importer bounty issue: https://github.com/obsidianmd/obsidian-importer/issues/421
- Importer PR #444: https://github.com/obsidianmd/obsidian-importer/pull/444
- Obsidian Forum — Bases cross-note lookup/rollup: https://forum.obsidian.md/t/bases-formula-cross-note-lookup-rollup/101990
- Obsidian Forum — Bases Toolbox: https://forum.obsidian.md/t/enhance-bases-usability-experience-with-bases-toolbox/115907
- Notion Bases community plugin: https://github.com/bgarciamoura/obsidian-notion-bases-plugin
- Notion Bases plugin v1.3.0 (two-way relations): https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.3.0
- Notion Bases plugin v1.5.0 (rollups/subtasks/charts): https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.5.0
- Notion Bases plugin on community store: https://community.obsidian.md/plugins/notion-bases
- XDA — Bases vs Notion test: https://www.xda-developers.com/tested-obsidian-bases-against-notion-with-real-project-one-fell-apart/
- Dan Holloran — Bases native views: https://danholloran.me/posts/obsidian-bases-native-database-views-without-dataview
- Obsibrain — Bases guide: https://www.obsibrain.com/blog/obsidian-bases-guide
- mcp-notion SKILL.md + references (database-model.md, api-gap-tools.md, mcp-tools.md, property-types.md)
- mcp-obsidian SKILL.md + references (mcp-tools.md, plugins/dataview/dataview.md)
- prior-findings.md (seeded prior research note)
- Obsidian Help — Import from Notion: https://obsidian.md/help/import/notion

---

<!-- GENERATED FINDINGS FENCE — GLM lineage synthesis. The parent orchestrator merges this with the deepseek lineage into the canonical research/research.md. -->
