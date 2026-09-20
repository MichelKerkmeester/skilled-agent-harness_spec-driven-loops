---
title: "Iteration 5: Formulas 2.0 Recovery (~50 functions → Bases / Dataview / plugin)"
trigger_phrases: []
---
# Iteration 5: Formulas 2.0 Recovery (~50 functions → Bases / Dataview / plugin)

## Focus

Map Notion Formulas 2.0 (~50 functions across logical/text/math/date/person/list families) to Obsidian recovery targets. Determine what the importer's `convertNotionFormulaToObsidian()` converts automatically, what needs hand-translation, and what has no equivalent — across three formula engines: core Bases (expression-based, JS-like), Dataview (DQL + DataviewJS), and the Notion Bases community plugin (spreadsheet-style).

## Findings

### F5.1 — Three formula engines in Obsidian, with different syntaxes

| Engine | Syntax style | Where it lives | Write-back? | [SOURCE] |
|---|---|---|---|---|
| **Core Bases** | Expression-based, JS-like (`prop("X")`, ternary, dot notation `prop("Date").dateStart()`) | `.base` file `formulas:` block | Yes (Bases views are live/editable) | mcp-notion/references/database-model.md §7, danholloran.me |
| **Dataview (DQL)** | SQL-ish query language (`TABLE`, `FROM`, `WHERE`, `GROUP BY`, `SUM()`, `length()`) | ```` ```dataview ```` blocks in notes | No (read-only render) | dataview.md §5 |
| **DataviewJS** | JavaScript (arbitrary compute) | ```` ```dataviewjs ```` blocks (disabled by default) | No | dataview.md §5 |
| **Notion Bases plugin** | Spreadsheet-style (`IF`, `SUM`, `AVG`, `CONCAT`, `LEFT`, `ROUND`…) | `_database.md` schema | Yes (interactive columns) | github.com/bgarciamoura/... |

Notion Formulas 2.0 is itself a JS-like expression language (`prop("X")`, ternary, dot notation), so **core Bases is the closest syntactic match** — which is why the importer targets it.

### F5.2 — What the importer converts automatically

The importer's `convertNotionFormulaToObsidian()` translates Notion formula expressions to Obsidian Bases formula expressions, governed by `formulaStrategy` (`static` or `hybrid`, default `hybrid`). [SOURCE: deepwiki.com/.../3.2-notion-api], [SOURCE: github.com/.../api-helpers.ts] (`shouldAddFormulaToYAML`)

- **`hybrid` (default):** converts the formula expression and adds it to the `.base` file's `formulas:` block where an Obsidian equivalent exists; the column is computed live in Bases.
- **`static`:** evaluates the formula at import time and writes the result as a static frontmatter value (no live computation) — the fallback when no Obsidian equivalent exists.

The conversion preserves Notion's property-reference-by-ID behavior (renaming a property does not break the formula) because both engines reference properties by name/id. [SOURCE: mcp-notion/references/database-model.md §7]

### F5.3 — Function-family conversion map (Notion → core Bases)

| Notion family | Functions | Core Bases equivalent | Auto-convert? | [SOURCE] |
|---|---|---|---|---|
| **Logical** | `if`, `ifs`, `and`, `or`, `not`, `empty` | ternary `? :`, `&&`/`||`/`!`, `empty()`-like | Yes (expression isomorphic) | database-model.md §7 |
| **Text** | `concat`, `join`, `slice`, `length`, `format`, `contains`, `replace`, `replaceAll`, `style` | Bases string ops + `format()`; **`style()` has no equivalent** (Notion-specific styled text) | Mostly yes; `style()` → no | database-model.md §7, prior-findings §1 |
| **Math** | `toNumber`, `sqrt`, `abs`, `round`, `floor`, `ceil`, `min`, `max`, `mod`, `pow` | Bases math ops | Yes | database-model.md §7 |
| **Date** | `now`, `today`, `timestamp`, `fromTimestamp`, `dateAdd`, `dateSubtract`, `dateBetween`, `formatDate`, `dateStart`, `dateEnd`, `dateRange`, `minute`, `hour`, `day`, `date`, `month`, `year` | Bases date ops (`file.mtime > now() - "1 week"` idiom) | Mostly yes; verify `dateBetween`/`dateRange` parity | database-model.md §7, danholloran.me |
| **Person** | `name`, `email` | **No direct equivalent** (no People type in Bases); prior findings flag `name()`/`email()` as not converting | No — GAP | prior-findings §1, database-model.md §7 |
| **List** | `map`, `filter`, `sort`, `unique`, `concat`, `slice`, `length`, `contains`, `join` | Bases list methods (used in rollup→formula conversion: `.map()`, `.flat()`, `.unique()`, `.filter()`, `.length()`) | Yes (the importer already uses these for rollups) | database-helpers.ts, database-model.md §7 |

### F5.4 — What needs hand-translation or has no equivalent

| Notion function | Issue | Recovery |
|---|---|---|
| `style("text", "red", "b")` | Notion-specific styled-text output; Bases has no styled-string type | Drop styling; keep plain text, or render via DataviewJS if styling is essential |
| `name()`, `email()` (Person) | Bases has no People property type | Store person name/email as a frontmatter text field during inventory; reference it in formulas |
| `dateBetween(a, b, "days")` | Verify Bases has an exact equivalent | Hand-translate to Bases date arithmetic; VERIFY parity |
| `dateRange` | Verify | Hand-translate; VERIFY |
| Formulas referencing `rollup`/`relation` values | Inherit rollup fragility (iteration 4); the importer converts rollups to formulas, so a formula referencing a rollup becomes a formula referencing another formula | Verify the chained formula renders correctly post-import |
| `ifs` (multi-branch) | Verify Bases ternary nesting handles it | Hand-translate to nested ternary if needed |

### F5.5 — Notion Bases plugin formula engine as an alternative

When a Notion formula uses spreadsheet-style functions (`IF`, `SUM`, `AVG`, `CONCAT`, `ROUND`) that a user finds more readable than Bases expression syntax, the Notion Bases plugin's formula engine is an alternative — but it is a **different syntax**, so the importer's Bases-targeted conversion would need re-translation. The plugin is better suited to **new** formulas authored during reconstruction, not auto-converted ones. [SOURCE: github.com/bgarciamoura/obsidian-notion-bases-plugin]

### F5.6 — Dataview as the formula escape hatch

For formulas that have no Bases equivalent (e.g., styled text, complex person/list logic, or anything needing arbitrary compute), DataviewJS (once `enableDataviewJs` is enabled) can compute arbitrary per-row values and render them — at the cost of being read-only and requiring JS. DQL handles the common `SUM`/`COUNT`/`AVG`/`WHERE` cases read-only. [SOURCE: dataview.md §5, §6]

### F5.7 — Formula recovery decision

1. **Let the importer auto-convert** (hybrid strategy) for logical/text/math/date/list families — verify each renders in Bases post-import.
2. **Hand-translate** the `style()`, `name()`/`email()`, and `dateBetween`/`dateRange` cases — drop styling, store person fields as text, verify date parity.
3. **Static fallback** (importer `static` strategy) for formulas with no live equivalent — capture the computed value as frontmatter and document the loss of liveness.
4. **Dataview/DataviewJS** for read-only computed views that Bases cannot express.
5. **Notion Bases plugin formulas** for new interactive spreadsheet-style columns authored during reconstruction.

## Sources Consulted

- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api] — `convertNotionFormulaToObsidian()`, `formulaStrategy` static/hybrid
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/api-helpers.ts] — `shouldAddFormulaToYAML`
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/database-model.md §7] — Formulas 2.0 syntax, function families, type mapping
- [SOURCE: https://danholloran.me/posts/obsidian-bases-native-database-views-without-dataview] — Bases expression syntax, date math idiom
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md §5-6] — DQL/DataviewJS formats, `enableDataviewJs` default false
- [SOURCE: https://github.com/bgarciamoura/obsidian-notion-bases-plugin] — spreadsheet-style formula engine
- [SOURCE: prior-findings.md §1] — `name()`/`email()`/`style()`/`unstyle()` do not convert

## Assessment

- **newInfoRatio: 0.55** — Formula recovery was not in the prior findings beyond "formulas converted where an Obsidian equivalent exists." This iteration produces the function-family conversion map, the hybrid/static strategy distinction, and the no-equivalent list (`style`, `name`/`email`, date parity VERIFY).
- **Novelty justification:** First family-by-family conversion map and first documentation of the `static` fallback strategy for no-equivalent formulas.
- **Confidence:** High on the function families (database-model.md). Medium on exact `dateBetween`/`dateRange` Bases parity (not confirmed in source — VERIFY). Medium on `hybrid` vs `static` behavior (source confirms the strategies exist; exact per-function routing not fully visible).

## Reflection

- **What worked:** The database-model function-family table plus the importer's `formulaStrategy` setting gave a concrete conversion map.
- **What failed:** Could not see the full `convertNotionFormulaToObsidian()` body to confirm per-function routing — inferred from family shapes + strategy names.
- **Ruled out:** Assuming all formulas convert live (some need `static` fallback); assuming `style()`/`name()`/`email()` convert (they do not).

## Recommended Next Focus

**Iteration 6:** Q6 — Files, attachments & comments carry-over. Verify the attachment download path (importer `ATTACHMENT_CONFIGS`, `downloadExternalAttachments`, incremental), confirm the comments gap (importer drops discussion comments), and define the mcp-notion-reads / mcp-obsidian-writes path to carry comments as frontmatter or appended blocks.
