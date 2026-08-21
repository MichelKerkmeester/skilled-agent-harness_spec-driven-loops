# Iteration 7: Multi-View Databases & Nested Hierarchy

## Focus

Resolve what happens to Notion's 10 view types, multi-view databases, and nested page/sub-page hierarchy on import. What survives automatically, what needs reconstruction, and via which Obsidian surfaces/plugins.

## Findings

### F7.1 — Notion view types (10) and their import fate

Notion's Views API exposes 10 view types: table, board, list, calendar, timeline, gallery, form, chart, map, dashboard. [SOURCE: mcp-notion/references/api-gap-tools.md §4]

The importer generates **only a default table view** per `.base` file (with column order). The bounty issue explicitly lists determining "what can't be imported, and what fallbacks might be appropriate, for example calendar views, kanban" as open work. [SOURCE: deepwiki.com/.../database-views-and-base-files], [SOURCE: github.com/obsidianmd/obsidian-importer/issues/421]

| Notion view type | Importer carries? | Reconstruction target | Tool |
|---|---|---|---|
| Table | Yes (default `.base` view) | — (verify column order) | file-layer verify |
| Board (Kanban) | No | Bases **board** view (group by status), or Kanban plugin, or Notion Bases plugin Board view | `.base` file-layer / plugin |
| List | No (table is default) | Bases **list** view, or Notion Bases plugin List view | `.base` / plugin |
| Calendar | No | Bases **calendar** view, or Calendar/Full Calendar plugin, or Notion Bases plugin Calendar view | `.base` / plugin |
| Timeline (Gantt) | No | Notion Bases plugin **Timeline/Gantt** view (only plugin with Gantt) | plugin |
| Gallery | No | Notion Bases plugin **Gallery** view (core Bases has no gallery) | plugin |
| Form | No | **No Obsidian equivalent** — document as lost; rebuild as a templated note + Dataview form替代 is not real parity | document gap |
| Chart | No | Notion Bases plugin **Chart** view (bar/line/pie), or Obsidian Charts plugin | plugin |
| Map | No | **No direct equivalent** — document as lost; Map View plugin is geo, not database-map | document gap |
| Dashboard | No | **No direct equivalent** — document as lost; approximate via a dashboard note embedding multiple Bases/Dataview blocks | document gap |

### F7.2 — Multi-view databases: inventory then reconstruct

A Notion database with N views imports as one `.base` file with one table view. To reconstruct the other N−1 views:

1. **Inventory (mcp-notion):** `GET /v1/databases/{database_id}/views` (API gap) → every saved view with its type, filters, sorts, and config. [SOURCE: mcp-notion/references/api-gap-tools.md §4]
2. **Reconstruct (mcp-obsidian file-layer):** for each inventoried view, add a view block to the `.base` file (core Bases supports multiple views per base: table/board/list/calendar/card) OR author a Notion Bases plugin view in the `_database.md` schema (7 view types). [SOURCE: github.com/bgarciamoura/obsidian-notion-bases-plugin] ("Multiple views per database: ✓")
3. **Map filters/sorts:** Notion view filters → Bases/Notion Bases plugin filter syntax (AND/OR/NOT groups — both support nested filters). [SOURCE: xda-developers.com Bases test] (Bases two filter layers, nested AND/OR/NOT)

### F7.3 — Nested page/sub-page hierarchy: preserved

The importer preserves nested hierarchy — child pages become nested notes in folders, and internal links/mentions resolve to `[[wikilinks]]` via the placeholder resolution system. [SOURCE: deepwiki.com/.../3.2-notion-api]

- A page with children becomes a **folder** containing the page's note + child notes (the importer's `currentFileFolderPath` logic places attachments relative to the file). [SOURCE: github.com/.../notion-api.ts]
- Synced blocks become separate markdown files in the same folder. [SOURCE: github.com/.../block-converter.ts] (`createSyncedBlockFile`)
- The `notion-id` frontmatter property (kept during resolution, removed in cleanup unless incremental) enables re-association. [SOURCE: deepwiki.com/.../3.2-notion-api]

**Caveat:** Notion's hierarchy is a tree of pages (a page can contain sub-pages and databases freely). Obsidian's is a filesystem folder tree. The importer maps page→folder when it has children, page→file when it does not. This is a faithful mapping but verify that deeply nested databases land in the expected folder.

### F7.4 — Core Bases vs Notion Bases plugin view coverage

| View | Core Bases | Notion Bases plugin | Other plugin |
|---|---|---|---|
| Table | ✓ | ✓ | — |
| Board (Kanban) | ✓ | ✓ | Kanban plugin |
| List | ✓ | ✓ | — |
| Calendar | ✓ | ✓ | Calendar / Full Calendar |
| Card | ✓ | — | — |
| Gallery | — | ✓ | — |
| Timeline/Gantt | — | ✓ | — |
| Chart | — | ✓ (bar/line/pie) | Obsidian Charts |
| Form | — | — | none (gap) |
| Map | — | — | Map View (geo, not parity) |
| Dashboard | — | — | none (approximate via embedded blocks) |

**Implication:** core Bases covers 4 of 10 Notion view types (table/board/list/calendar + card). The Notion Bases plugin covers 7 of 10 (adds gallery/timeline/chart). Form/map/dashboard have no parity target and must be documented as lost or approximated. This directly drives the required-plugin decision in iteration 8.

### F7.5 — Reconstruction write path for views

Views are reconstructed entirely at the **file layer** (no CLI/MCP tool authors `.base` views or plugin schemas — confirmed in iteration 3):

- Core Bases views: edit the `.base` file's `views:` array (YAML).
- Notion Bases plugin views: edit the `_database.md` schema's view definitions.
- Calendar/Kanban/Charts plugins: install + configure via their own data files (file-layer).

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md §4] — 10 Notion view types, views CRUD endpoints
- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/2.6-database-views-and-base-files] — default table view only
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/issues/421] — bounty: calendar/kanban fallbacks open
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin] — 7 views, multiple views per database
- [SOURCE: https://www.xda-developers.com/tested-obsidian-bases-against-notion-with-real-project-one-fell-apart/] — Bases two filter layers, nested AND/OR/NOT
- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api] — nested hierarchy + placeholder resolution
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/block-converter.ts] — synced blocks → separate files
- [SOURCE: prior-findings.md §3] — Kanban/Calendar plugin alternatives

## Assessment

- **newInfoRatio: 0.66** — The prior findings listed view alternatives but did not map all 10 Notion view types to import fate + reconstruction target. This iteration produces the 10-view fate table and the core-vs-plugin coverage matrix (4/10 core, 7/10 plugin, 3/10 gap).
- **Novelty justification:** First complete 10-view-type fate matrix and first coverage split showing the Notion Bases plugin is what lifts view coverage from 4/10 to 7/10.
- **Confidence:** High on view types (API gap doc) and importer default-table-only (source). High on plugin view coverage (release notes). Medium on form/map/dashboard having no parity (inference from no matching Obsidian concept — high confidence but not source-cited).

## Reflection

- **What worked:** The views API-gap endpoint + plugin release notes gave the full view picture.
- **What failed:** Nothing.
- **Ruled out:** Assuming all Notion views import (only table does); assuming core Bases covers gallery/timeline/chart (it does not — plugin needed).

## Recommended Next Focus

**Iteration 8:** Q8 — Required vs optional Obsidian plugins, ranked against `mcp-obsidian`'s existing plugin knowledge. Using the view-coverage and relation/rollup findings, produce the definitive required-vs-optional plugin list with install/config notes.
