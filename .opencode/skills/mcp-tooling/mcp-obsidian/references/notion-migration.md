---
title: "Notion to Obsidian Migration Method"
description: "The write-side reconstruction method for a flawless Notion-to-Obsidian migration: the 8-step method, the mcp-notion-reads/mcp-obsidian-writes division of labor, the relation/rollup/formula recovery matrix, comment reconstruction, and the two-pass verification protocol."
trigger_phrases:
  - "notion obsidian migration"
  - "notion migration playbook"
  - "migrate notion to obsidian"
  - "notion import"
  - "obsidian import"
  - "relation recovery"
  - "rollup recovery"
  - "comment reconstruction"
  - "parity verification"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Notion to Obsidian Migration Method (`notion-migration`)

The `mcp-obsidian` mode's write-side method for migrating a database-heavy Notion workspace into an Obsidian vault: what the Obsidian Importer already reconstructs automatically, and what an agent must verify or rebuild afterward at the file layer. This reference is the reconstruction half of the migration; `mcp-notion`'s `references/migration-inventory.md` is the read half that must run before and alongside it.

---

## 1. OVERVIEW

A flawless migration is not a single tool run. The **Obsidian Importer's Notion API mode** is the only import path that preserves database structure — it converts blocks to Markdown, generates `.base` files for databases, and resolves cross-page references through a three-phase placeholder system (Import → Resolution, up to 10 rounds → Cleanup). It runs once, in the Obsidian desktop app, driven by a human. Everything after that import — verifying what the importer converted, rebuilding what it dropped, and proving parity — is an agent task performed at the file layer against the vault the importer produced.

The importer auto-converts pages, nested hierarchy, internal links, databases (→ Bases), properties (→ frontmatter), formulas and rollups (→ Bases formulas, a hybrid strategy), single relations (→ wikilinks), block attachments, and page covers. It does **not** convert comments, secondary database views, two-way relation back-references, gallery cover images, external attachments (unless opted in), or the `style()`/`name()`/`email()` formula functions (no Obsidian equivalent). Treat every one of those as a reconstruction task, not a lost cause — sections 3-5 below cover the recovery path for each.

The write layer this method operates against has three surfaces: **notesmd-cli** (headless filesystem operations, the default for unattended migration work), the **cyanheads MCP** (app-backed, an accelerator when a live Obsidian session with Local REST API is available), and direct **file-layer edits** on `.base` files, plugin `_database.md` schemas, and `data.json` configs. No CLI or MCP tool authors a `.base` file or a Dataview query block — both are pure file-layer writes the agent performs directly with Read/Write/Edit.

---

## 2. THE 8-STEP MIGRATION METHOD

| Step | What happens | mcp-notion READS | mcp-obsidian WRITES | Mode |
|---|---|---|---|---|
| 1. Inventory | Map every database, relation, rollup, formula, view, comment, and file before anything is imported | 24 MCP tools + the 5 API-gap reads → a migration ledger (`references/migration-inventory.md`) | — | AI (headless reads) |
| 2. Import | Bulk-import the workspace via the Obsidian Importer's Notion API mode | — | Importer writes notes, `.base` files, attachments, and wikilinks | Human (in-app Importer) |
| 3. Relations | Verify auto-converted wikilinks resolve; rebuild two-way relations the importer cannot express | `retrieve-a-data-source` + the property-item API gap (non-truncated relation values) | File-layer: verify wikilinks; add a Notion Bases plugin Relation column or a Dataview back-reference query | AI (headless) |
| 4. Rollups | Verify the auto-converted Bases formula; add a native plugin rollup where full parity is needed | `retrieve-a-data-source` | File-layer: verify the Bases formula; add a Notion Bases plugin Rollup column (7 functions) or a Dataview query | AI (headless) |
| 5. Formulas | Verify hybrid-converted formulas; hand-fix the functions with no Obsidian equivalent | `retrieve-a-data-source` | File-layer: verify; hand-translate `style()`/`name()`/`email()` as a static fallback | AI (headless) |
| 6. Files & comments | Verify attachment embeds resolve; reconstruct comment threads; fix dropped gallery covers | The file-uploads API gap + MCP `list-comments`/`list-all-users` | notesmd-cli: verify embeds; append `[!comment]` callout blocks + `comment_count` frontmatter (section 5) | AI (headless; MCP optional) |
| 7. Views | Reconstruct secondary database views the importer dropped (only the default table view imports) | The views API gap (`GET /v1/databases/{id}/views`) | File-layer: write `.base` view blocks or Notion Bases plugin `_database.md` view schemas | AI (headless) |
| 8. Verification | Run the two-pass parity protocol before treating Notion as retirable | `query-data-source` + the comment list | notesmd-cli `list`/`search-content` + grep + Dataview queries | AI (headless), then human sample |

**Mode A vs Mode B.** Mode A is the human-driven Importer bulk run (step 2 only). Mode B is everything else — the agent closing gaps via `mcp-notion` reads and `mcp-obsidian` writes at the file layer. The agent never drives the in-app import UI; it complements the import at the file layer before and after it runs.

---

## 3. DIVISION OF LABOR

Three interactions require a human at the Obsidian/Notion GUI; every other step is AI-automatable headless work.

### Human-required (GUI, roughly 12-17 minutes total)

1. Create a Notion internal integration and grant it content access to the target workspace.
2. Install the Notion Bases plugin and the Dataview plugin in Obsidian (Community Plugins).
3. Run the Obsidian Importer itself — paste the integration token and choose the import scope.

### AI-automatable (everything else)

**Pre-flight:** full workspace inventory, the migration ledger, and a UUID-to-filename cross-reference (drives step 1).

**Post-import:** verify vault integrity against the ledger, rewrite and complete relations, write the Notion Bases plugin schema files, author Dataview queries for supplemental aggregation, normalize frontmatter, reconstruct comment threads, fix broken links, convert callouts and toggles, run the two-pass verification protocol, and generate a migration report.

Total AI autonomous time runs from roughly 30 minutes to several hours, driven by the Notion API's ~3 requests/second rate limit and workspace size rather than by any manual step.

---

## 4. RELATIONS, ROLLUPS, FORMULAS, VIEWS & INTERACTIVE ELEMENTS — RECOVERY

Bases alone is not sufficient for a workspace with relations, rollups, or formulas — the **Notion Bases community plugin** (`bgarciamoura/obsidian-notion-bases-plugin`) recovers over 90% of Notion's relational feature set on top of Core Bases, and Dataview supplements custom aggregations neither plugin covers natively. The same plugin also rebuilds the secondary database views the importer drops (view recovery, below), and the **Meta Bind** plugin plus its **JS Engine** companion rebuild the interactive elements — buttons, date pickers, live timers — the importer has no surface for at all (interactive-element recovery, below). Both are reconstruction tasks, exactly like comments (section 5).

### Recovery by feature

| Notion feature | Importer auto-convert | Best recovery for full parity |
|---|---|---|
| Single relation | → wikilinks | Verify the wikilinks resolve |
| Dual (two-way) relation | → wikilinks, no back-reference | Notion Bases plugin two-way Relation column, or a Dataview back-reference DQL query |
| Rollup — count family | → Bases formula | Keep the import formula, or the Notion Bases plugin count/count_values column, or Dataview |
| Rollup — sum/avg/min/max | → Bases formula | Notion Bases plugin Rollup column (7 built-in functions, auto-refreshing), or Dataview |
| Rollup — show_original | → Bases formula (`asFile()`) | Notion Bases plugin Lookup column, or Bases `asFile().properties` |
| Subtasks (self-relation) | → wikilinks | Notion Bases plugin self-relation, 3-level hierarchy |
| Formula — logical/text/math | → Bases formula (hybrid) | Keep as converted; hand-translate the functions below |
| Formula — `style()` / `name()` / `email()` | Not converted | **No Obsidian equivalent.** Hand-translate to a static fallback value |
| Formula — `dateBetween()` / `dateRange()` | Converted, unverified | **VERIFY against the Notion source post-import**; fall back to DataviewJS if the conversion is wrong |

### Three-way plugin matrix

| Pattern | Notion Bases plugin | Core Bases | Dataview |
|---|---|---|---|
| One-to-one relation | Native relation column | `[[wikilink]]`, no enforcement | Manual DQL |
| One-to-many | Native, plus self-relation subtasks (3 levels) | Partial | DQL `GROUP BY` |
| Many-to-many | Multi-select relation column | Manual | DQL `FLATTEN` |
| Rollup (7 functions) | 7 built-in, inline in table | None | Manual DQL `TABLE` |
| Formula expression | Spreadsheet-style | Expression-based (JS-like) | DataviewJS |
| Views | 7 types (table/board/gallery/list/calendar/timeline/chart) | 2-3 types | `TABLE`/`LIST`/`CALENDAR` |

**Do not overstate parity.** The `style()`, `name()`, and `email()` formula functions have no Obsidian equivalent at all — document them as a hand-translated static fallback, never as "converted." `dateBetween()`/`dateRange()` conversions must be spot-checked against the Notion source before being trusted.

### View recovery (secondary Notion views → Notion Bases view configs)

The importer converts only the default **table** view; every other saved view is dropped. `migration-inventory.md` step 4 inventories those dropped views, and step 7 of the method above reconstructs them. Rebuild each one as a Notion Bases view block in the target database's `_database.md`, using the plugin's confirmed per-view config keys.

| Notion view | Notion Bases view + confirmed config keys | Parity |
|---|---|---|
| Table / List | `table` / `list` | Faithful |
| Board (Kanban) | `board` — `groupByColumnId`, plus `boardColumnOrder` / `boardColumnLimits` | Faithful |
| Calendar | `calendar` — `calendarDateField` (a `type: date` column) + `calendarViewMode` (`month`/`week`) | Faithful — use the calendar recipe below |
| Timeline / Gantt | `timeline` — `timelineStartField` / `timelineEndField` / `timelineGroupByField` | Faithful |
| Gallery | `gallery` — `galleryCoverField` / `galleryCardSize` | Faithful |
| Chart | `chart` — `chartType` / `chartXAxis` / `chartYAxis` | Faithful |
| Form / Map / Dashboard | No Obsidian equivalent through any plugin | **None — document as lost** |

The **calendar recipe** — a Notion-style month/week grid built from the database's own dated notes, with a Meta Bind date picker for click-to-pick entry and an optional read-only Dataview agenda beside it — lives in `references/plugins/notion-bases/workflows.md`. Point to it rather than re-deriving the calendar view block here.

**Core-Bases / Dataview fallback.** When the Notion Bases plugin is not installed, Core Bases covers only `table` / `board` / `list` / `calendar` (no gallery, timeline, or chart), and Dataview supplies read-only `TABLE` / `LIST` / `CALENDAR` blocks as a last resort. A Dataview block is a fallback, not a faithful conversion — it cannot reproduce a board, gallery, timeline, or chart.

**Do not overstate view parity.** Notion Bases gives faithful parity for 7 of Notion's 10 view types (table, board, list, calendar, gallery, timeline, chart). **Form, Map and Dashboard have no Obsidian equivalent** — record them as lost, never as a pending recipe.

### Interactive-element recovery (Notion buttons and date widgets → Meta Bind + JS Engine)

The importer has no surface for Notion's interactive database controls — buttons, date-entry widgets, and in-row action controls are dropped entirely. Rebuild them with the **Meta Bind** plugin (the widgets) and its **JS Engine** companion (frontmatter writes and computed values). Like comments and secondary views, this is reconstruction, not conversion.

| Notion element | Obsidian reconstruction |
|---|---|
| Button that runs an action | A Meta Bind `meta-bind-button` block, or the button's `js` action running a vault file as-is |
| Date-entry widget / date picker | A Meta Bind `INPUT[datePicker:<frontmatter-key>]` bound to the row's date field |
| Timestamp / "now" control, live timer | A Meta Bind button `updateMetadata` action with `evaluate: true` and `value: "new Date().toISOString()"`, or a JS Engine block writing `new Date().toISOString()` to frontmatter |
| Inline edit panel (interactive fields) | Meta Bind `INPUT[…]` fields (text / number / toggle / datePicker) bound to the note's frontmatter |

**Do not overstate interactive parity.** Meta Bind rebuilds the interaction at the file layer: the AI authors the widget text and the frontmatter it binds to, never the click, and a reload in a running Obsidian is what renders it. Meta Bind has no `now()` function — a timestamp is a plain-JavaScript `updateMetadata` value — and its `js` / `inlineJS` actions need JS Engine installed plus JavaScript enabled in Meta Bind's own settings. Frame every rebuilt control as an equivalent, never as a faithful conversion of the Notion button.

---

## 5. COMMENT RECONSTRUCTION

Comments are a **confirmed importer gap** — the Obsidian Importer has no comment-conversion surface whatsoever, in either its API or HTML import path. Reconstruction is a three-step agent workflow:

1. **Inventory.** For every page, call MCP `list-comments` to pull the full thread, and `list-all-users` to map author ids to names.
2. **Reconstruct.** Convert each comment thread into `> [!comment]` callout blocks appended to the page body, and record a `comment_count` frontmatter field on the note.
3. **Verify.** Confirm every thread found during inventory has a corresponding callout block in the migrated note — a missing callout means a dropped comment, not an empty thread.

---

## 6. VERIFICATION PROTOCOL

**Keep Notion live until both passes clear.** This is a verified handoff, not a rip-and-replace migration — do not decommission the source workspace before the human sample pass signs off.

### Pass 1 — AI automated (run immediately post-import)

1. Page existence — cross-reference every expected page against the vault's file list.
2. Link validation — grep for orphaned `[[wikilinks]]`.
3. Attachment integrity — count files in the attachments folder against the Notion source.
4. Database row count — per-folder `.md` count against the `query-data-source` row count.
5. Property schema parity — compare the Notion schema against the migrated frontmatter keys.
6. Formula output accuracy — cross-reference a sample of formula outputs against the Notion source.
7. Comment count parity — `list-comments` count against the number of `## Comments`/`[!comment]` sections.
8. View count parity — the inventoried view count against the written `.base`/`_database.md` view blocks.
9. Hierarchy parity — page-to-folder nesting against the Notion parent tree.
10. Property-type mismatch — type-check every migrated frontmatter value against its Notion property type.
11. Relation resolution — confirm every relation UUID was rewritten to a resolvable `[[wikilink]]`.

### Pass 2 — human sample (run after Pass 1 clears)

- Sample roughly 5% of pages for content quality.
- Verify 10 critical formulas against the Notion source, with particular attention to `dateBetween()`/`dateRange()`.
- Confirm each reconstructed view renders correctly in Obsidian.
- Sign off, or flag issues back to the agent for repair.

---

## 7. WHEN TO USE THIS REFERENCE

Load this reference when a request involves:

- Planning or running a Notion-to-Obsidian migration, or asking what the Obsidian Importer preserves versus drops.
- Rebuilding two-way relations, rollups, or formulas after an import.
- Reconstructing comment threads that the importer dropped.
- Running the post-import parity verification protocol, or deciding whether Notion can be retired.

### Sibling references

| File | Use it for |
|---|---|
| `references/plugins/notion-bases/notion-bases.md` | The primary DB-replacement plugin tree: two-way relations, the 7 rollup functions, lookups, subtasks, the 7 view types (section 4's view recovery), and the calendar recipe (in its `workflows.md`) |
| `references/plugins/meta-bind/meta-bind.md` | Reconstructing dropped interactive elements — buttons, date pickers, and live timers via Meta Bind + JS Engine (section 4's interactive-element recovery) |
| `references/plugins/dataview/dataview.md` | Authoring the Dataview queries this method uses for back-reference lookups and custom aggregations |
| `references/plugins/plugin-operation-logic.md` | The general file-layer model for writing `.base` files and plugin schemas |
| `../../mcp-notion/references/migration-inventory.md` | The read-side counterpart: the 7-step inventory procedure that must run before and during this method |

---

## 8. RELATED RESOURCES

- `../../mcp-notion/references/migration-inventory.md` — `mcp-notion`'s read-side inventory method (7-step procedure, API-gap reads, and read-limit constraints) that feeds step 1 of this method.
- `references/plugins/notion-bases/notion-bases.md` — the Notion Bases plugin tree (data model, workflows including the calendar recipe, troubleshooting): the P0 DB-replacement behind section 4's relation, rollup, lookup, and view recovery.
- `references/plugins/meta-bind/meta-bind.md` — the Meta Bind + JS Engine tree: the interactive-element reconstruction (buttons, date pickers, live timers) in section 4.
- `references/plugins/dataview/dataview.md` — Dataview plugin index, used for back-reference queries and rollup supplementation (section 4).
- `references/plugins/plugin-operation-logic.md` — the general file-layer model this method's `.base`/plugin-schema writes follow.
- `references/mcp-tools.md` — the cyanheads MCP catalog, an optional accelerator for step 6/8 when a live Obsidian session is available.
- Notion Bases community plugin: https://github.com/bgarciamoura/obsidian-notion-bases-plugin — the P0 plugin behind sections 3-4's recovery matrix.
- Obsidian Importer: https://github.com/obsidianmd/obsidian-importer — the source of the auto-conversion behavior this method verifies and extends.
