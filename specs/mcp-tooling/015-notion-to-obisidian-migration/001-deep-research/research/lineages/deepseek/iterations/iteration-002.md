# Iteration 2: mcp-obsidian Reconstruction Surface — Relations, Rollups, .base Files, and Dataview

## Focus
Deep-dive on how mcp-obsidian's tool surface and knowledge of plugins (Dataview, Notion Bases) enable post-import reconstruction of dropped relations, rollups, formulas, and secondary views.

## Findings

### F2.1 — The Reconstruction Toolkit

| Reconstruction task | Tool / method | Surface | How it works |
|---|---|---|---|
| Rewrite raw relation IDs → `[[wikilinks]]` | `notesmd-cli frontmatter` + search-content | notesmd CLI | 1. `search-content` find notes with raw Notion relation IDs in frontmatter 2. Convert UUID → `[[Note Name]]` using a cross-reference 3. `frontmatter` to rewrite |
| Create `.base` file for a database | `notesmd-cli create "database_name.base"` | notesmd CLI | Bases reads frontmatter schema from `.base` files; write the schema as YAML frontmatter |
| Author Dataview rollup query | `notesmd-cli frontmatter` to tag notes, then write DQL | notesmd CLI + file layer | 1. Ensure relation notes share a common tag 2. Write `dataview` code block `TABLE sum(...) FROM #tag` |
| Notion Bases plugin schema (`_database.md`) | Create `folder/_database.md` with `notesmd-cli create` | notesmd CLI | The plugin reads `_database.md` frontmatter for column types, view config, relation defs |
| Multi-view setup per database | Create `.base` files with view type + independent filters | notesmd CLI | Each `.base` = one saved view (table, board, gallery, list, calendar, timeline, chart) |
| Normalize frontmatter across 1000s of notes | `notesmd-cli search-content` + `frontmatter` in a loop | notesmd CLI | Batch by folder/pattern; read current frontmatter, transform, write back |
| Fix broken internal links | `notesmd-cli search-content` + regex, then `frontmatter` | notesmd CLI | Find UUID-formatted references and replace with resolved note names |
| Convert Notion callouts/toggles to Obsidian callouts | `notesmd-cli print` → transform → `notesmd-cli create` overwrite | notesmd CLI | Read body, replace Notion block types with `> [!note]` or `<details>`, write |

[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli command cheat sheet]
[SOURCE: prior-findings.md §5 — agent post-import reconstruction tasks]

### F2.2 — Notion Bases Plugin: The Primary Recovery Vehicle

The `bgarciamoura/obsidian-notion-bases-plugin` is the closest Obsidian has to Notion's full database experience:

- **18 column types** (vs. Bases core's 6): adds Relation, Lookup, Rollup, Formula, Image, Audio, Video
- **7 views** (vs. Bases core's 2-3): adds Board/Kanban, Gallery, Calendar, Timeline/Gantt, Chart
- **Rollup functions**: sum, count, avg, min, max, count_values, list — aggregate across related databases
- **Formula engine**: IF, SUM, AVG, CONCAT, LEFT, ROUND (spreadsheet-style, not JS-like Bases expressions)
- **Subtasks up to 3 levels**: via self-relation columns
- **Data model**: Every row is a `.md` file; every column is frontmatter; `_database.md` holds schema + view config
- **100% local Markdown**: No lock-in, survives export

Critical implication: For a complex Notion workspace, installing this plugin is **required**, not optional — because relations, rollups, formulas, and Calendar/Gantt/Board views do not exist in core Bases.

[SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin — README: highlights, column types, views table]

### F2.3 — Dataview Plugin: Lightweight Alternative for Simple Aggregations

Dataview complements Notion Bases when:
- Only simple rollups are needed (sum, count over linked pages)
- The workspace has no complex formulas or multi-view requirements
- The user prefers DQL queries over a plugin UI

| Feature | Notion Bases plugin | Dataview (DQL + DataviewJS) |
|---|---|---|
| Relation tracking | Native relation columns with link picker | Manual `[[wikilinks]]` in frontmatter |
| Rollup functions | 7 built-in (sum/count/avg/min/max/count_values/list) | Manual via SUM/COUNT in DQL TABLE |
| Formula engine | Spreadsheet-style (IF, CONCAT, ROUND) | DataviewJS for JS expressions |
| Views | 7 visual views (table/board/gallery/calendar/timeline/list/chart) | TABLE/LIST/TASK/CALENDAR in code blocks |
| Real-time updates | Yes, native plugin UI | On note open / Dataview refresh |
| AI-agent writable | Yes — write `_database.md` + `.md` files | Yes — write DQL code blocks into notes |

[SOURCE: mcp-obsidian references/plugins/dataview — Dataview DQL and DataviewJS capabilities]
[SOURCE: prior-findings.md §3 — Dataview as relations/rollups recovery path]

### F2.4 — Reconstruction Division of Labor

| Step | Who does it | Tool/invocation | Notes |
|---|---|---|---|
| 1. Map Notion relation columns to frontmatter `[[wikilinks]]` | AI agent | notesmd-cli `search-content` + `frontmatter` loop | Build a cross-reference: Notion UUID → note filename |
| 2. Create `_database.md` per database | AI agent | notesmd-cli `create` | Schema: property types, relation config, view config |
| 3. Create `.base` files for core Bases views | AI agent | notesmd-cli `create` | One per view type (table, board, etc.) |
| 4. Write DQL queries for Dataview rollups | AI agent | notesmd-cli `create`/`frontmatter` | Optional — skip if Notion Bases plugin covers need |
| 5. Convert Notion formulas to plugin formulas | AI agent | Manual translation | Notion formula syntax ≠ plugin formula syntax |
| 6. Set up Notion Bases plugin | Human | Install from Community Plugins | One-time; agent can guide via mcp-obsidian plugin knowledge |
| 7. Verify row counts match | AI agent | notesmd-cli `list` + count | Cross-reference with mcp-notion `query-data-source` count |

[SOURCE: mcp-obsidian SKILL.md §8 — plugin references and Dataview knowledge]
[SOURCE: mcp-notion SKILL.md §7 — operation-to-tool routing]

## Sources Consulted
- https://github.com/bgarciamoura/obsidian-notion-bases-plugin (README)
- mcp-obsidian SKILL.md §2, §7, §8
- mcp-obsidian references/plugins/dataview/ (index, data-model, workflows)
- mcp-notion SKILL.md §7
- prior-findings.md §2-3, §5
- https://obsidian.md/plugins?id=notion-bases

## Assessment
- newInfoRatio: 0.9
- noveltyJustification: "Plugin capability comparison and tool-per-reconstruction-task mapping is new — prior-findings named the plugins but not the exact tool invocations"
- Confidence: High — plugin README + skill references confirmed

## Reflection
- What worked: Reading the Notion Bases plugin README side-by-side with mcp-obsidian capabilities produced a concrete reconstruction playbook
- What failed: The plugin formula syntax translation (Notion → Notion Bases) needs per-function mapping not done here
- Ruled out: Pure Dataview-only approach for relation-heavy workspace — Notion Bases plugin is a hard requirement

## Recommended Next Focus
KQ-2 deep dive: Exact comparison of Notion Bases plugin vs hand-authored .base files vs Dataview for each data-modelling pattern (one-to-one, one-to-many, many-to-many relations; aggregate rollups; complex formulas)