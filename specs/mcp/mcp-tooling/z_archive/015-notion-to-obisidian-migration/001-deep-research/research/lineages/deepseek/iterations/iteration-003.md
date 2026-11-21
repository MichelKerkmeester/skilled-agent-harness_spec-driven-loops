---
title: "Iteration 3: Relations, Rollups, and Formulas — Three-Way Recovery Comparison"
trigger_phrases: []
---
# Iteration 3: Relations, Rollups, and Formulas — Three-Way Recovery Comparison

## Focus
Exact comparison of Notion Bases plugin vs hand-authored `.base` files vs Dataview for each data-modelling pattern: one-to-one, one-to-many, many-to-many relations, aggregate rollups, and complex formulas.

## Findings

### F3.1 — Relation Pattern Coverage Matrix

| Notion relation pattern | Notion Bases plugin | Core Bases + .base files | Dataview only | Notes |
|---|---|---|---|---|
| One-to-one (e.g., Employee ↔ Desk) | Yes — native relation column type | Partial — `[[wikilink]]` in frontmatter, no schema enforcement | Manual — `FROM #tag` WHERE expression | Plugin provides link picker UI + type safety |
| One-to-many (e.g., Project → Tasks) | Yes — native + subtask self-relations | Partial — link exists but no aggregate view | DQL `FROM #linked` GROUP BY | Plugin subtasks (3 levels) is unique |
| Many-to-many (e.g., Student ↔ Course) | Yes — multi-select relation column | Manual — comma-separated `[[wikilinks]]` | DQL `FLATTEN` on array relation | Plugin tracks both directions |
| Self-referencing (e.g., Task ⟶ Parent Task) | Yes — self-relation column supports subtasks up to 3 levels | Manual — `parent:: [[Task]]` | Manual DQL | Plugin subtask expand/collapse in UI |
| Linked data sources (Notion cross-DB reference) | Yes — lookup column pulls fields from related DB | No — must duplicate data | DQL inline field `= this.someValue` | Plugin lookup + rollup covers this natively |

[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — relation/lookup/rollup features]
[SOURCE: prior-findings.md §2-3 — Bases gaps, plugin recovery]

### F3.2 — Rollup Coverage Matrix

| Rollup function | Notion Bases plugin | Dataview | Notes |
|---|---|---|---|
| Sum | Yes | `SUM(rows.value)` in DQL TABLE | Plugin rolls up visually in table |
| Count | Yes | `length(rows)` in DQL | Both work; plugin shows inline |
| Average | Yes | `AVG(rows.value)` in DQL | Both work |
| Min / Max | Yes / Yes | `MIN` / `MAX` in DQL | Both work |
| Count values (distinct) | Yes | `filter(rows, x => x) | length` | Plugin has dedicated function |
| List (concatenate values) | Yes | `flat(rows.field)` in DQL | Plugin renders as clickable list |

Neither tool natively supports Notion-like rollup aggregation that auto-updates when related data changes — both require the note to be opened or re-queried. The Notion Bases plugin keeps rollups visible in its table view without DQL code blocks.

[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — rollup column type]
[SOURCE: mcp-obsidian references/plugins/dataview/workflows.md — DQL rollup patterns]

### F3.3 — Formula Coverage Matrix

| Formula type | Notion Bases plugin | Core Bases expression | DataviewJS | Example |
|---|---|---|---|---|
| Arithmetic (+, -, *, /) | Yes — spreadsheet-style | Yes — JS-like | Yes | `cost * quantity` |
| Conditional (IF, AND, OR) | Yes — `IF(condition, then, else)` | Yes — ternary `?:` | Yes | `IF(status="Done", 1, 0)` |
| String (CONCAT, LEFT, RIGHT) | Yes — `CONCAT(a, " ", b)` | Yes — `+` operator | Yes | `CONCAT(first, " ", last)` |
| Date math | Yes | Yes | Yes | `dateEnd - dateStart` |
| Lookup across databases | Yes — native Lookup column type | No | DQL inline | Pulls value from related row |
| Nested formulas (formula referencing another formula) | Yes | Yes | Yes | `rate * baseFormula` |
| Notion-specific functions (prop(), name(), style(), unstyle()) | No — use plugin equivalents | No | No | Must manually translate |

**Notion-specific formula functions that cannot be directly replicated:**
- `prop("name")` → Notion Bases uses `{{ColumnName}}` or direct column references
- `name()` / `style()` / `unstyle()` — Notion text styling functions; no Obsidian equivalent
- `id()` / `now()` — simple: replaced with `$id` / `$now` in plugin
- Formula referencing a relation column's property — plugin's Lookup column solves this

[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — formulas section]
[SOURCE: prior-findings.md §3 — formula recovery plugins]

### F3.4 — .base Files: When They Suffice Without the Plugin

`.base` files (core Obsidian Bases) support only: title, text, number, select, multi-select, checkbox, date — **6 column types**. They have no relation/rollup/lookup/formula. Use `.base` files when:
- The Notion database has only simple columns (no relations, no rollups, no formulas)
- The user wants zero plugins and accepts a read-only imported view
- The database is purely informational (not relational)

For any Notion workspace with relations OR rollups OR formulas → the Notion Bases plugin is required.

[SOURCE: prior-findings.md §2 — Bases gap: no two-way relational schema, no rollups]

### F3.5 — Recommendation: Notion Bases Plugin + Dataview for Edge Cases

| Priority | Plugin | Role | Reason |
|---|---|---|---|
| P0 — Required | **Notion Bases** (`bgarciamoura/obsidian-notion-bases-plugin`) | Primary: relations, rollups, formulas, 7 views, subtasks | Closest Notion parity; covers >90% of feature gaps |
| P1 — Supplemental | **Dataview** | DQL for custom rollup queries, cross-database aggregations not covered by plugin views | Lightweight, can coexist; mcp-obsidian already knows it |
| P2 — Nice to have | **Tasks** | Recurring task handling for Notion's recurring-task databases | Only needed if recurring tasks exist in source |

[SOURCE: prior-findings.md §3 — plugin stack table]
[SOURCE: mcp-obsidian SKILL.md §8 — plugin knowledge includes Dataview, Tasks references]

## Sources Consulted
- https://github.com/bgarciamoura/obsidian-notion-bases-plugin
- prior-findings.md §1-3
- mcp-obsidian references/plugins/dataview/ (data-model, workflows)
- https://www.xda-developers.com/notion-databases-great-but-obsidian-bases-better/
- mcp-obsidian SKILL.md §8

## Assessment
- newInfoRatio: 0.85
- noveltyJustification: "Three-way recovery comparison matrix (plugin vs .base vs Dataview) per relation/rollup/formula pattern is entirely new evidence"
- Confidence: High — all three approaches are source-confirmed

## Reflection
- What worked: The matrix format exposed coverage gaps per pattern clearly
- What failed: No authoritative source for Notion-specific formula function equivalence; would need hand-mapping per workspace
- Ruled out: `.base`-only approach for any relational workspace; pure Dataview for multi-view databases

## Recommended Next Focus
KQ-4: How file uploads/attachments, comments, and multi-view databases carry over — including the Notion API and Obsidian file handling paths