---
title: "Iteration 001: YAML Key Schema Verification & Reference Doc Gap Analysis"
trigger_phrases: []
---
# Iteration 001: YAML Key Schema Verification & Reference Doc Gap Analysis

## Focus

Investigate the actual plugin source code (`bgarciamoura/obsidian-notion-bases-plugin`, v1.12.0) to verify the exact per-column YAML key spelling in `_database.md` frontmatter — the single remaining VERIFY-flagged item in the reference docs. Also survey embed/view edge cases, rollup/lookup gotchas, and identify concrete additions or corrections needed in `references/plugins/notion-bases/`.

**Ambiguity resolution**: The reference docs are at `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/` (not `.opencode/skills/`). The research packet is at `specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases/`. The reference docs are read-only; this iteration produces findings and recommendations only.

## Findings

### 1. YAML Key Schema: Relation Columns — WRONG in Reference Docs

**The reference docs use guessed key names that do not match the plugin's actual schema.**

The plugin's `ColumnSchema` interface (`src/types.ts`) defines the actual YAML keys. For relation columns, the source code (`src/database-manager.ts` `readConfig`/`writeConfig`, `syncTwoWayRelation`) confirms:

| Reference Doc (WRONG) | Actual Source Key (CORRECT) | Purpose |
|---|---|---|
| `target: "Tasks"` | `refDatabasePath: "Tasks/_database.md"` | Path to the target database file |
| `two_way: true` | *(no equivalent field)* | Two-way is implicit when `pairedColumnId` is set |
| `back_reference: project` | `pairedColumnId: "project"` | Column ID in the target database holding the back-reference |
| *(missing)* | `refColumnId: "_title"` | Column in target database to match against (defaults to `_title` = note basename) |

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts]
[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts]

### 2. YAML Key Schema: Rollup Columns — WRONG in Reference Docs

| Reference Doc (WRONG) | Actual Source Key (CORRECT) | Purpose |
|---|---|---|
| `relation: tasks` | `rollupRelationColumnId: "tasks"` | The relation column ID to aggregate through |
| `property: estimate_hours` | `rollupTargetColumnId: "estimate_hours"` | The column ID in the target database to aggregate |
| `function: sum` | `rollupFunction: "sum"` | Aggregation function (one of 7) |

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts]
[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts lines 230-260]

### 3. YAML Key Schema: Lookup Columns — WRONG in Reference Docs

| Reference Doc (WRONG) | Actual Source Key (CORRECT) | Purpose |
|---|---|---|
| `relation: project` | `refDatabasePath: "Tasks/_database.md"` | Path to the target database file |
| `property: status` | `refColumnId: "status"` | Column ID in the target database to pull value from |
| *(missing)* | `refMatchColumnId: "_title"` | Column in target database to match against (defaults to `_title`) |

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts]
[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts `resolveLookupsForRows`]

### 4. YAML Key Schema: Self-Relation Subtasks — WRONG in Reference Docs

| Reference Doc (WRONG) | Actual Source Key (CORRECT) | Purpose |
|---|---|---|
| `self_relation: true` | `isHierarchical: true` | Marks a relation column as a hierarchy/parent column |
| *(missing)* | `refDatabasePath: "Tasks/_database.md"` | Same database path (self-relation) |

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts]

### 5. YAML Key Schema: View Config — WRONG in Reference Docs

| Reference Doc (WRONG) | Actual Source Key (CORRECT) | Purpose |
|---|---|---|
| `group_by: status` | `groupByColumnId: "status"` | Board view grouping column |
| `date_field: dueDate` | `calendarDateField: "dueDate"` | Calendar view date column |
| *(missing)* | `calendarViewMode: "month" \| "week"` | Calendar view mode |
| *(missing)* | `timelineStartField`, `timelineEndField` | Timeline/Gantt date range |
| *(missing)* | `timelineZoom: "days" \| "weeks" \| "months"` | Timeline zoom level |
| *(missing)* | `timelineGroupByField` | Timeline grouping |
| *(missing)* | `chartType: "bar" \| "pie" \| "line"` | Chart type |
| *(missing)* | `chartXAxis`, `chartYAxis` | Chart axis configuration |
| *(missing)* | `chartAggregation: "count" \| "sum" \| "avg" \| "min" \| "max"` | Chart aggregation |
| *(missing)* | `galleryCoverField`, `galleryCardSize` | Gallery view config |
| *(missing)* | `boardColumnOrder`, `boardColumnLimits`, `boardHideEmpty`, `boardHideNoValue` | Board view config |
| *(missing)* | `pinnedColumnId`, `columnOrder`, `rowHeight`, `wrapText` | Table view config |
| *(missing)* | `aggregations` (Record<string, AggregationType>) | Per-column aggregation footer |
| *(missing)* | `includeSubfolders: true \| false` | Include subfolder rows |
| *(missing)* | `conditionalFormats` | Conditional formatting rules |

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `ViewConfig` interface]

### 6. Database Marker Confirmed

The `_database.md` file uses `notion-bases: true` as the marker (not just `notion-bases`). The `DATABASE_MARKER` constant in `src/database-manager.ts` is `'notion-bases'`, and the frontmatter check is `cache?.frontmatter?.[DATABASE_MARKER] === true`.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts line 10]

### 7. Rollup Functions Confirmed (Already Correct in Reference Docs)

The 7 rollup function keywords are confirmed from source: `sum`, `count`, `avg`, `min`, `max`, `count_values`, `list`. The reference docs already use these exact keywords.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `RollupFunction` type]

### 8. View Types Confirmed (Already Correct in Reference Docs)

The 7 view type keywords are confirmed from source: `table`, `list`, `board`, `gallery`, `calendar`, `timeline`, `chart`. The reference docs already use these exact keywords.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `ViewConfig.type`]

### 9. Column Types Confirmed (Already Correct in Reference Docs)

The 18 column types are confirmed from source: `title`, `text`, `number`, `select`, `multiselect`, `checkbox`, `date`, `url`, `email`, `phone`, `status`, `formula`, `relation`, `lookup`, `image`, `rollup`, `audio`, `video`. The reference docs already list these correctly.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `ColumnType` type]

### 10. Embed Syntax Confirmed (Already Correct in Reference Docs)

The `nb-database` fenced code block syntax is confirmed from source (`src/database-embed.ts`). The embed block supports `path`, `type`, and `id` parameters. The reference docs already document this correctly.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-embed.ts]

### 11. Embed State Storage — New Discovery

The plugin stores embed view state in the **hosting note's frontmatter** under the key `notion-bases-embeds`. This is a map of embed ID to either a `ViewConfig` (forced-type embeds) or an `EmbedState` (multi-view embeds with `activeViewId` and `views[]`). This is undocumented in the reference docs.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-embed.ts `EMBED_FM_KEY`]

### 12. Folder Arrangement Config — New Discovery

The plugin supports auto-filing rows into subfolders based on column values. Configured in `_database.md` under `folderArrangement`:
```yaml
folderArrangement:
  enabled: true
  propertyIds: ["status", "priority"]
```
This moves row files to subfolders like `Done/High/row.md`. The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts `FolderArrangementConfig` and `computeArrangedPath`]

### 13. Template System — New Discovery

The plugin supports templates with `{{title}}`, `{{folder}}`, `{{date}}`, `{{time}}` placeholders. Configured in `_database.md`:
```yaml
templatePath: "templates/task.md"
templateFolder: "templates/"
askTemplateOnCreate: true
```
The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts `applyTemplate`]

### 14. System Columns — New Discovery

The plugin supports read-only system columns that display file-native timestamps:
```yaml
created:
  type: date
  systemField: ctime
modified:
  type: date
  systemField: mtime
```
These read from `file.stat.ctime`/`file.stat.mtime`, not frontmatter. The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `SystemField` type]

### 15. Number Format Config — New Discovery

Number columns support formatting:
```yaml
budget:
  type: number
  numberFormat:
    decimals: 2
    thousandsSeparator: true
    prefix: "$"
    suffix: " USD"
```
The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts `NumberFormat` interface]

### 16. Live Placeholders — New Discovery

The plugin supports `{{columnId}}` tokens in note bodies that render the current cell value in reading view. This is a separate feature from the embed system. The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/main.ts `createLivePlaceholderProcessor`]

### 17. Inline Field Support — New Discovery

The plugin can read Dataview-style inline fields (`Key:: Value`) when `readInlineFields` is enabled in plugin settings. This allows the plugin to read values from inline fields in addition to frontmatter. The reference docs have no mention of this feature.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts `getNoteData`]

### 18. Manifest ID Confirmed

The plugin's `manifest.json` confirms:
- `id`: `"notion-bases"`
- `version`: `"1.12.0"`
- `minAppVersion`: `"1.8.7"`
- Repository: `bgarciamoura/obsidian-notion-bases-plugin`

The community store slug is `notion-bases`, and the on-disk manifest `id` is also `notion-bases` — they match, resolving the VERIFY note in `notion-bases.md` §1.

[SOURCE: https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/manifest.json]

## Ruled Out

- **Plugin source not available locally**: The plugin is installed in the operator's vault but the vault path was not accessible from this workspace. All source verification was done via GitHub raw content fetches.
- **No local `main.js` inspection**: The compiled `main.js` was not available for analysis. Source TypeScript files were used instead, which is sufficient for schema verification.

## Dead Ends

- **Searching for plugin in workspace paths**: The plugin is not checked into this repository. It lives in the Obsidian vault's `.obsidian/plugins/notion-bases/` directory which is outside the workspace scope.
- **Attempting to find plugin via `find`**: The home directory search timed out. GitHub raw source was the reliable alternative.

## Edge Cases

- **Ambiguous input**: None. The dispatch context clearly specified the focus on YAML key spelling verification.
- **Contradictory evidence**: The reference docs use guessed YAML key names (`target`, `two_way`, `back_reference`, `self_relation`, `group_by`, `date_field`) that directly contradict the plugin's actual source code keys (`refDatabasePath`, `pairedColumnId`, `isHierarchical`, `groupByColumnId`, `calendarDateField`). The source code is authoritative.
- **Missing dependencies**: The plugin's installed `main.js` was not accessible. Source TypeScript from GitHub was used as the authoritative alternative.
- **Partial success**: All research actions succeeded. Source code was fetched and analyzed comprehensively.

## Sources Consulted

- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/types.ts — ColumnSchema, ViewConfig, RollupFunction, ColumnType type definitions
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-manager.ts — readConfig, writeConfig, syncTwoWayRelation, resolveLookupsForRows, resolveRollupsForRows, createDatabase
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/main.ts — Plugin entry point, live placeholder registration
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/database-embed.ts — nb-database embed block parsing and state management
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/src/settings.ts — DEFAULT_SETTINGS, databaseFileName
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/manifest.json — Plugin identity and version
- https://raw.githubusercontent.com/bgarciamoura/obsidian-notion-bases-plugin/main/README.md — Plugin README (feature overview)
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/notion-bases.md` — Existing reference index
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/data-model.md` — Existing data model reference
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` — Existing workflows reference
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/troubleshooting.md` — Existing troubleshooting reference
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md` — Plugin roster

## Assessment

- **New information ratio**: 0.95
- **Questions addressed**: 3 of 5
  - [x] What is the exact per-column YAML key spelling in _database.md for Notion Bases v1.12.0? (VERIFY flagged) — **RESOLVED**: Source code confirms actual keys differ from reference docs
  - [x] What embed and view edge cases exist when operating Notion Bases at the file layer? — **PARTIALLY**: Embed state storage in hosting note frontmatter discovered; full view config schema documented
  - [x] What rollup and lookup configuration gotchas should the reference docs cover? — **PARTIALLY**: Actual YAML keys documented; lookup ambiguity and rollup hand-resolution confirmed
  - [ ] What new reference documents (if any) should be created under references/plugins/notion-bases/? — **DEFERRED** to next iteration
  - [ ] What existing reference docs need updating or correction? — **DEFERRED** to next iteration
- **Questions answered**: 1 (YAML key spelling VERIFY resolved)

## Reflection

- **What worked and why**: Fetching the plugin's TypeScript source from GitHub was the decisive approach. The `types.ts` file contains the exact `ColumnSchema` and `ViewConfig` interfaces that define the YAML schema, and `database-manager.ts` shows how they're read/written. This is more reliable than inspecting a compiled `main.js` or guessing from the README.
- **What did not work and why**: Searching for the plugin in local workspace paths failed because the plugin lives in the Obsidian vault, not in this repository. The `find` command timed out on the home directory.
- **What I would do differently**: Start with GitHub source fetches immediately rather than searching local paths first. The source code is the authoritative reference for schema verification.

## Recommended Next Focus

**Analyze the gap between reference docs and source truth, and produce concrete recommendations for each of the 4 reference files.** Specifically:

1. Map every incorrect YAML key in `data-model.md` to its correct source-code key
2. Identify sections in `workflows.md` that need updated YAML examples
3. Identify new sections needed (folder arrangement, template system, system columns, number formatting, live placeholders, inline field support)
4. Assess whether `troubleshooting.md` needs new entries for the newly discovered features
5. Determine if new reference documents are needed (e.g., a dedicated `formulas.md` or `advanced-config.md`)