# Iteration 7: Notion Knowledge Layer — Relations, Rollups, and Formulas in Depth

## Focus
Document the advanced Notion knowledge layer: relation types (single vs dual), rollup aggregation functions, and the formula language (Formulas 2.0). These three computed/relational property types are the most complex parts of the Notion data model and the core of what the mode must encode to help agents design and query databases effectively.

## Findings

### F7.1 — Relations: single_property vs dual_property

Relations connect data sources by referencing pages in another data source. Two types:

**`single_property` (one-way)**: Only the source data source has the relation property. The target data source has no back-reference. Use when you need to link items one-directionally (e.g., Tasks → Projects, where Projects don't need to know their tasks).

**`dual_property` (bidirectional)**: Both data sources have a relation property. The target's back-reference is automatically created with `synced_property_id` and `synced_property_name`. Use when both sides need to see the relationship (e.g., Tasks ↔ Projects, where Projects show their tasks and Tasks show their project).

**Schema configuration**:
```json
{
  "Projects": {
    "type": "relation",
    "relation": {
      "database_id": "668d797c-...",
      "type": "single_property"
    }
  }
}
```

**Property object** (as of API 2025-09-03, uses `data_source_id`):
```json
{
  "Projects": {
    "type": "relation",
    "relation": {
      "data_source_id": "6c4240a9-...",
      "dual_property": {
        "synced_property_name": "Tasks",
        "synced_property_id": "JU]K"
      }
    }
  }
}
```

**Page property value** (setting a relation on a page):
```json
{
  "Projects": {
    "relation": [
      {"id": "dd456007-6c66-4bba-957e-ea501dcda3a6"},
      {"id": "0c1f7cb2-8090-4f18-924e-d92965055e32"}
    ]
  }
}
```

**Critical constraint**: The related database/data source must be shared with the connection. If it isn't, retrieval and updates of relation properties will fail.

[SOURCE: https://developers.notion.com/reference/property-schema-object] [SOURCE: https://developers.notion.com/reference/property-object]

### F7.2 — Rollups: 14 aggregation functions

Rollups aggregate data from a related data source via a relation property. Configuration requires:
- `relation_property_name` or `relation_property_id` — the relation property in the same data source
- `rollup_property_name` or `rollup_property_id` — the property in the related data source to aggregate
- `function` — the aggregation function

**14 rollup functions**:

| Function | Description | Output type |
|---|---|---|
| `count_all` | Count all items in the relation | Number |
| `count_values` | Count non-empty values | Number |
| `count_unique_values` | Count unique non-empty values | Number |
| `count_empty` | Count empty values | Number |
| `count_not_empty` | Count non-empty values | Number |
| `percent_empty` | Percentage of empty values | Number |
| `percent_not_empty` | Percentage of non-empty values | Number |
| `sum` | Sum of numeric values | Number |
| `average` | Average of numeric values | Number |
| `median` | Median of numeric values | Number |
| `min` | Minimum value | Number/Date |
| `max` | Maximum value | Number/Date |
| `range` | Max - Min | Number |
| `show_original` | Show the original values (no aggregation) | List |

**API behavior for retrieval**:
- For `show_original` rollups: the retrieve-page-property endpoint returns a flattened list of all property items
- For aggregation rollups: the endpoint returns a rollup property value + list of relations
- **Three aggregations are NOT computed by the endpoint**: `show_unique` (show unique values), `unique` (count unique values), `median` (median) — instead, the endpoint returns a list of `property_item` objects for client-side computation

[SOURCE: https://developers.notion.com/reference/property-schema-object] [SOURCE: https://developers.notion.com/reference/retrieve-a-page-property]

### F7.3 — Formula language (Formulas 2.0): JavaScript-like syntax

Notion's formula language (Formulas 2.0) is a JavaScript-like expression language for computed properties. Key characteristics:

**Property references**: `prop("PropertyName")` — references a property by name. Internally stored by ID, so renaming the property doesn't break the formula. Outside the formula editor, `prop()` syntax is used; inside, property tokens are shown.

**Ternary operator**: `condition ? valueIfTrue : valueIfFalse` — shorthand for `if(condition, valueIfTrue, valueIfFalse)`

**Dot notation** (Formulas 2.0): `prop("Date").dateStart()` instead of `dateStart(prop("Date"))`

**Data types**: String, Number, Boolean, Date, List, Person, Page

**Property type → formula data type mapping**:

| Property type | Formula data type | Notes |
|---|---|---|
| Title | String | |
| Rich text | String | |
| Number | Number | |
| Select | String | |
| Multi-select | List | Comma-separated string of values |
| Status | String | |
| Date | Date | Use `dateStart`/`dateEnd` for date ranges |
| People | List | List of Person types |
| Files | List | List of string URLs |
| Checkbox | Boolean | |
| URL / Email / Phone | String | |
| Formula | Any type | Can return any data type |
| Relation | List | List of Page types |
| Rollup | String/Number/Date | Depends on target property + function |
| Created time / Last edited time | Date | |
| Created by / Last edited by | Person | Single Person type |

**Key function categories**:

| Category | Functions |
|---|---|
| **Logical** | `if`, `ifs`, `and`, `or`, `not`, `empty` |
| **Text** | `concat`, `join`, `slice`, `length`, `format`, `contains`, `replace`, `replaceAll`, `style` |
| **Math** | `toNumber`, `sqrt`, `abs`, `round`, `floor`, `ceil`, `min`, `max`, `mod`, `pow` |
| **Date** | `now`, `today`, `timestamp`, `fromTimestamp`, `dateAdd`, `dateSubtract`, `dateBetween`, `formatDate`, `dateStart`, `dateEnd`, `dateRange`, `minute`, `hour`, `day`, `date`, `month`, `year` |
| **Person** | `name`, `email` |
| **List** | `concat`, `slice`, `length`, `contains`, `join`, `map`, `filter`, `sort`, `unique` |

**`style()` function**: adds text formatting — `style("text", "red", "b")` → bold red text. Styles: `b` (bold), `u` (underline), `i` (italics), `c` (code), `s` (strikethrough). Colors: gray, brown, orange, yellow, green, blue, purple, pink, red. Add `_background` for background colors.

**Example formulas**:
```
prop("Price") * 1.1                                    → Number: 11
if(prop("In stock"), "yes", "no")                      → String: "yes"
format(prop("ID"))                                     → String: "TASK-1"
dateBetween(prop("Due"), now(), "days")                → Number: 6
if(and(now() > prop("Due Date"), prop("Status") != "Done"),
    style("Overdue", "red", "b"), "")                  → String: bold red "Overdue"
```

[SOURCE: https://www.notion.com/help/formula-syntax] [SOURCE: https://thomasjfrank.com/formulas/notion-formula-syntax/] [SOURCE: https://thomasjfrank.com/formulas/reference-properties-in-formulas/]

### F7.4 — Knowledge layer encoding: what the mode must encode for relations/rollups/formulas

The mode's `references/database-model.md` must encode:

1. **Relation design patterns**: when to use single vs dual, how to set up back-references, the "related database must be shared" constraint
2. **Rollup function selection**: which function for which use case (count vs sum vs average vs show_original), the three functions not computed by the API (show_unique, unique, median)
3. **Formula syntax**: `prop()` references, ternary operator, dot notation, data type mapping, function catalog
4. **Formula validation rules**: expressions validated on save, `prop()` stored by ID, internal reference syntax fallback
5. **Cross-property dependencies**: formulas can reference rollups, relations, and other formulas; rollups depend on relations; changing a relation type can break dependent rollups
6. **Read-only constraints**: formula, rollup, created_time, created_by, last_edited_time, last_edited_by cannot be set on page creation
7. **Pagination for large properties**: title, rich_text, relation, people properties are paginated when retrieved via the page-property-item endpoint (not via MCP)

### F7.5 — MCP coverage of relations/rollups/formulas

| Operation | MCP tool | Coverage |
|---|---|---|
| Create data source with relation/rollup/formula properties | `create-a-data-source` | ✅ Accepts full schema |
| Update data source properties (add/modify relation/rollup/formula) | `update-a-data-source` | ✅ Can modify schema |
| Query data source filtering by relation/rollup | `query-data-source` | ✅ Supports relation/rollup filters |
| Retrieve page with relation/rollup/formula values | `retrieve-a-page` | ⚠️ May truncate for large properties (>25 mentions) |
| Retrieve individual property item (non-truncated) | ❌ Not in MCP | **Tooling gap** — requires direct API call to `GET /v1/pages/{id}/properties/{prop_id}` |

The MCP covers schema management and querying but not individual property item retrieval (which avoids truncation for large relation/people/text properties). This is one of the 5 tooling gaps identified in iteration 4.

### F7.6 — Parity with mcp-obsidian's Dataview plugin

The closest mcp-obsidian analogue to Notion's relations/rollups/formulas is the **Dataview plugin** (DQL queries, DataviewJS, inline fields). The parity mapping:

| Obsidian Dataview | Notion equivalent | Parity |
|---|---|---|
| DQL queries (filtered/sorted retrieval) | `query-data-source` with filters/sorts | ✅ Covered |
| Inline fields (frontmatter key-value) | Page properties | ✅ Covered (different model) |
| DataviewJS (arbitrary JavaScript) | Formula expressions | ⚠️ Partial — formulas are limited expressions, not arbitrary JS |
| Cross-note relations via links | Relation properties | ✅ Covered (structured vs unstructured) |
| Aggregation across notes (GROUP BY, COUNT) | Rollup functions | ✅ Covered (14 functions) |
| Computed fields | Formula properties | ✅ Covered |

The key difference: DataviewJS allows arbitrary JavaScript execution, while Notion formulas are a constrained expression language. This is a structural limitation, not a tooling gap — the mode must document the formula language's capabilities and constraints.

## Sources Consulted
- https://developers.notion.com/reference/property-schema-object (relation/rollup schema configuration)
- https://developers.notion.com/reference/property-object (relation property object with data_source_id)
- https://developers.notion.com/reference/retrieve-a-page-property (rollup retrieval behavior, non-computed aggregations)
- https://www.notion.com/help/formula-syntax (formula syntax and function reference)
- https://thomasjfrank.com/formulas/notion-formula-syntax/ (formula syntax deep dive)
- https://thomasjfrank.com/formulas/reference-properties-in-formulas/ (property type → formula data type mapping)
- https://thomasjfrank.com/formulas/functions/ (function catalog)
- https://developers.notion.com/changelog/releasing-notion-version-2022-06-28 (single_property/dual_property introduction)

## Assessment
- **newInfoRatio: 0.60** — Builds on iteration 6's property type catalog with deep detail on the three computed/relational types. The formula function catalog, rollup API behavior, and relation design patterns are net-new.
- **Novelty justification**: Formula language syntax and function catalog, rollup non-computed aggregations, relation dual_property back-reference mechanism, and Dataview parity analysis are all net-new.
- **Confidence**: High — sourced from official Notion docs + authoritative third-party formula reference (Thomas Frank's Notion formula docs, widely cited).

## Reflection
- **What worked**: Official docs for schema/API behavior; Thomas Frank's formula docs for syntax and function catalog.
- **What failed**: Nothing significant.
- **Ruled out**: Nothing new. The DataviewJS → formula gap is structural (constrained expression language vs arbitrary JS), not a tooling gap.

## Recommended Next Focus
Iteration 8: Auth + runtime — the token model (NOTION_TOKEN, ntn_ prefix, OAuth for remote MCP), rate limits (3 r/s with Retry-After), and headless/Code Mode constraints. How the mode must handle auth setup, rate limiting, and the local-stdio → remote-OAuth migration path.
