# Iteration 4: Relations & Rollups Recovery Path (single/dual, 14 rollup functions)

## Focus

Resolve the single most important planning question for a relational Notion workspace: how do Notion single/dual relations and the 14 rollup functions map to Obsidian? Refine the prior finding ("Bases has no two-way relational schema and no rollups out of the box") against 2026 evidence — the importer's rollup→formula conversion, Bases v1.9.7 cross-note lookups, and the Notion Bases community plugin's native relation/rollup/lookup columns.

## Findings

### F4.1 — What the importer auto-converts (relations and rollups)

The prior "verify" flag is now **substantially resolved at the import layer**:

- **Relations → wikilinks.** The importer stores relation properties as frontmatter lists and resolves them to `[[wikilinks]]` via a multi-phase placeholder system (up to 10 rounds) using `notion-id` → file-path mapping. A `base` frontmatter property links each page to its `.base` file. [SOURCE: deepwiki.com/.../3.2-notion-api], [SOURCE: github.com/.../database-helpers.ts] (`isRelation: true`)
- **Rollups → Bases formulas.** The importer converts each rollup to a Bases formula expression over the relation property. Confirmed conversions: [SOURCE: github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/database-helpers.ts]

| Notion rollup function | Importer → Bases formula | Status |
|---|---|---|
| `show_original` | `note["Rel"].map(value.asFile().properties["Target"])` | converted |
| `show_unique` | `note["Rel"].map(...).flat().unique()` | converted |
| `count` / `count_all` | `note["Rel"].length` | converted |
| `count_values` | `note["Rel"].map(...).flat().length` | converted |
| `count_unique_values` | `note["Rel"].map(...).flat().unique().length` | converted |
| `sum` / `average` (`mean`) | list-method aggregation | converted |
| `earliest_date` | `note["Rel"].map(...).sort()[0]` | converted |
| `latest_date` | `note["Rel"].map(...).sort()[-1]` | converted |
| `empty` / `not_empty` | filter expressions counting empty/non-empty | converted |
| `percent_empty` / `percent_not_empty` | percentage expressions | converted |
| `min` / `max` / `median` / `range` | (likely list-method; `median` may need client-side compute) | partial — VERIFY |

**Caveat (carried from iteration 1):** the conversion is mechanical and the importer is new — imported relational data stays suspect until independently verified. Bases cross-note formulas have performance and refresh caveats (F4.2).

### F4.2 — Bases v1.9.7 added cross-note lookups (refines prior "no rollups out of the box")

The prior finding that "Bases has no two-way relational schema and no rollups out of the box" is **now partially superseded**:

- **Bases v1.9.7** introduced `file()`, `Link.asFile()`, and `File.properties`, enabling cross-note property lookups inside Bases formulas. A formula like `account.asFile().properties.bank` pulls a linked note's property into a column — a lightweight relational lookup. [SOURCE: forum.obsidian.md/t/bases-formula-cross-note-lookup-rollup/101990]
- **But:** these functions have a **performance impact** on the table, and **the table is not automatically refreshed** when source notes change — a manual reload is required. There is currently **no built-in sum/average aggregation** over a list of linked properties (you get a list of values, not an aggregate). [SOURCE: forum.obsidian.md/t/bases-formula-cross-note-lookup-rollup/101990]
- **Bases Toolbox plugin** adds rollups (count, sum, avg, min, max) as real properties and a frontmatter-aware merge/duplicate-finder — a newer community option for native-style rollups without the Notion Bases plugin. [SOURCE: forum.obsidian.md/t/enhance-bases-usability-experience-with-bases-toolbox/115907]

So: native Bases can now do **lookups** (pull a related value) but not **aggregations** (sum/count across related) without formula gymnastics or a plugin.

### F4.3 — The Notion Bases community plugin provides native relation/rollup/lookup columns

`bgarciamoura/obsidian-notion-bases-plugin` (v1.5.0+) is the full-featured recovery path for relational parity. It complements core Bases: [SOURCE: github.com/bgarciamoura/obsidian-notion-bases-plugin], [SOURCE: community.obsidian.md/plugins/notion-bases]

| Feature | Notion Bases plugin | Core Bases |
|---|---|---|
| Relation columns | **Yes** (two-way sync v1.3.0+, multi-value, self-relations) | No (wikilinks only) |
| Lookup columns | **Yes** | No (formula workaround only) |
| Rollup columns | **Yes** — 7 functions (sum, count, avg, min, max, count_values, list) | No |
| Two-way relations | **Yes** (auto-creates paired column in target) | No |
| Subtasks / sub-rows | **Yes** (up to 3 levels via self-relations) | No |
| Views | 7 (Table, Board, Gallery, List, Calendar, Timeline/Gantt, Chart) | Table/Board/List/Card |
| Column types | 18 (incl. Relation, Lookup, Rollup, Formula, Image, Audio, Video) | 6-7 |
| Formula engine | Spreadsheet-style (`IF`, `SUM`, `AVG`, `CONCAT`, `ROUND`…) | Expression-based (JS-like) |
| Storage | Every row a `.md` file + `_database.md` schema | `.base` files + frontmatter |

**Mapping the 14 Notion rollup functions to recovery paths:**

| Notion rollup function | Auto-converted by importer? | Best recovery if not/for parity |
|---|---|---|
| `count_all`, `count_values`, `count_not_empty`, `count_empty`, `count_unique_values` | Yes (formula) | Notion Bases plugin `count`/`count_values` column, or Dataview `length()` |
| `percent_empty`, `percent_not_empty` | Yes (formula) | Bases formula or Dataview |
| `sum`, `average`, `median`, `min`, `max`, `range` | Yes (sum/avg; median partial) | Notion Bases plugin `sum`/`avg`/`min`/`max` column (native, auto-refresh); Dataview `sum()`/`avg()` |
| `show_original` | Yes (formula) | Notion Bases plugin `Lookup` column (native), or Bases `asFile().properties` formula |

### F4.4 — Dataview as the no-new-plugin rollup path

Dataview recovers relations/rollups without installing a new plugin (it is already in `mcp-obsidian` plugin knowledge): query frontmatter across `[[linked]]` notes; rollups become `SUM`/`COUNT`/`AVG` over linked pages via DQL `FROM` + `WHERE` + `GROUP BY`. [SOURCE: prior-findings.md §3], [SOURCE: mcp-obsidian/references/plugins/dataview/dataview.md §4]

**Trade-off vs Notion Bases plugin:** Dataview renders **read-only** output in code blocks (no inline edit, no write-back); Notion Bases plugin gives interactive, editable, auto-refreshing columns. Dataview is the right choice when the workspace already uses it and the rollup is read-only; the Notion Bases plugin is the right choice when Notion-style interactive relations/rollups are required. [SOURCE: danholloran.me/posts/obsidian-bases-native-database-views-without-dataview] (Bases views are live/editable; Dataview is static read-only)

### F4.5 — Dual (two-way) relations recovery

Notion dual relations auto-create a back-reference column in the target. The importer resolves relation values to wikilinks but **does not auto-create a two-way back-reference column** in Obsidian (Bases has no native two-way schema). Recovery options:

1. **Notion Bases plugin two-way relation** (v1.3.0+) — enable "Two-way relation" checkbox; auto-creates paired column in target; edits sync both sides. **Best parity.** [SOURCE: github.com/bgarciamoura/.../releases/tag/1.3.0]
2. **Dataview back-reference query** — a DQL query in the target note/database that filters on `contains(file.outlinks, this.file.link)` — a read-only back-reference. [SOURCE: dataview.md §4-5]
3. **Hand-authored frontmatter + Bases formula** — maintain the back-reference as a frontmatter list and surface it via a Bases formula; manual sync.

### F4.6 — Verified recovery path per relation/rollup type (decision matrix)

| Notion feature | Auto (importer) | Recommended recovery | Tools |
|---|---|---|---|
| Single relation (one-way) | wikilinks in frontmatter | None needed (verify links resolve); optionally Notion Bases plugin Relation column for UI | mcp-obsidian file-layer (verify), plugin |
| Dual relation (two-way) | wikilinks (no back-ref) | Notion Bases plugin two-way Relation, or Dataview back-ref query | plugin file-layer / Dataview block |
| Rollup (count family) | Bases formula | Keep formula, OR Notion Bases plugin `count`/`count_values` column, OR Dataview | file-layer `.base` / plugin / Dataview |
| Rollup (sum/avg/min/max) | Bases formula (sum/avg) | Notion Bases plugin rollup column (native, auto-refresh) for interactive; Dataview for read-only | plugin / Dataview |
| Rollup (show_original/lookup) | Bases formula | Notion Bases plugin Lookup column, or Bases `asFile().properties` formula | plugin / `.base` file-layer |
| Subtasks (self-relation) | wikilinks | Notion Bases plugin self-relation + hierarchical subtasks (3 levels) | plugin |

## Sources Consulted

- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/database-helpers.ts] — rollup→formula conversion source
- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api] — relation placeholder resolution
- [SOURCE: https://forum.obsidian.md/t/bases-formula-cross-note-lookup-rollup/101990] — Bases v1.9.7 `file()`/`asFile()`/`File.properties`, performance/refresh caveats, no native aggregation
- [SOURCE: https://forum.obsidian.md/t/enhance-bases-usability-experience-with-bases-toolbox/115907] — Bases Toolbox rollups + XLOOKUP recipe
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin] — 7 views, 18 column types, relations/lookups/rollups, two-way, subtasks
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.3.0] — two-way relations, multi-value, self-relations
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin/releases/tag/1.5.0] — rollup columns (7 functions), subtasks, charts
- [SOURCE: https://community.obsidian.md/plugins/notion-bases] — plugin feature list
- [SOURCE: https://danholloran.me/posts/obsidian-bases-native-database-views-without-dataview] — Bases live/editable vs Dataview static read-only
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md] — Dataview file-layer, metadata layers
- [SOURCE: prior-findings.md §2, §3] — prior "no rollups out of the box" (now refined), plugin stack

## Assessment

- **newInfoRatio: 0.78** — This is the highest-value refinement of the seed: the prior "no two-way relational schema and no rollups out of the box" is now superseded by (a) importer rollup→formula conversion, (b) Bases v1.9.7 cross-note lookups, (c) Notion Bases plugin native relation/rollup/lookup columns with two-way sync, and (d) a per-type decision matrix.
- **Novelty justification:** First complete mapping of the 14 Notion rollup functions to verified Obsidian recovery paths, and first documentation that two-way relations are recoverable via the Notion Bases plugin (not just "lost").
- **Confidence:** High on importer conversion (source) and plugin features (release notes). Medium on `median`/`range` rollup conversion (partial source evidence — flagged VERIFY). Medium on Bases v1.9.7 aggregation limits (forum-sourced, single thread).

## Reflection

- **What worked:** Combining importer source, forum threads, and plugin release notes triangulated the relation/rollup recovery space the prior single-pass note could not.
- **What failed:** Could not confirm `median`/`range` rollup conversion in the importer source snippet (truncated) — flagged VERIFY.
- **Ruled out:** "Relations/rollups are lost on import" (false — auto-converted to formulas/wikilinks); "Bases cannot do any cross-note lookup" (false since v1.9.7, but aggregation is still limited).

## Recommended Next Focus

**Iteration 5:** Q5 — Formulas 2.0 recovery. Map Notion's ~50 formula functions (logical/text/math/date/person/list families) to Obsidian Bases formulas / Dataview expressions / Notion Bases plugin spreadsheet-style formulas. What converts automatically via `convertNotionFormulaToObsidian()`, what needs hand-translation, what has no equivalent.
