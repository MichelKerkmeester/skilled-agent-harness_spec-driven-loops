---
title: The src/data/ Pipeline
description: The 128-file src/data/ pipeline in full — DataSource's vault-backed read/write model, RowPipeline's search/filter/limit stages, ComputedEvaluator, and the frontmatter-as-storage model every database rests on.
trigger_phrases:
  - "src data pipeline obsidian plugin"
  - "datasource vault read write"
  - "rowpipeline search filter limit"
  - "computedevaluator formula fields"
  - "db_view frontmatter storage model"
  - "database file order migration"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# The `src/data/` Pipeline

128 `.ts` files (measured) implement the plugin's model, query, and formula layer. This reference
is the pipeline shape: how a vault Markdown file becomes rows a renderer draws, and where a
change belongs inside this layer versus `src/views/`.

---

## 1. OVERVIEW

### Core Principle

A database is a Markdown file with `db_view: true` in its frontmatter; a record is a Markdown
file with properties in its frontmatter. `src/data/` owns reading that frontmatter into typed
records, evaluating formulas and rollups over it, and turning a `ViewConfig` (search + filters +
sort + group) into the exact `RowData[]` a renderer draws. `src/views/` never talks to the vault
directly — it reads through `DataSource` and `RowPipeline`.

### When to Use

- Adding a new column type, computed field kind, or aggregate function
- Tracing how a frontmatter edit becomes a re-rendered row
- Deciding whether new logic belongs in `src/data/` (model/query) or `src/views/` (presentation)
- Investigating the file-order or database-migration model

### Key Sources

- `src/data/data-source.ts` — `export class DataSource`
- `src/data/row-pipeline.ts` — `export class RowPipeline`
- `src/data/types.ts` — the shared type vocabulary (`ViewConfig`, `ColumnDef`, `RowData`,
  `DatabaseConfig`, `FilterRule`, `SourceRule`, and peers)

---

## 2. `DataSource` — THE VAULT-BACKED LAYER

Constructed with `Vault`, `MetadataCache`, and `App` (`src/data/data-source.ts`), `DataSource`:

- Parses and writes frontmatter via `parseYaml`/`stringifyYaml`, exposing `NoteRecord { file:
  TFile; frontmatter: Record<string, unknown> }` as the unit every downstream stage consumes.
- Tracks changes as `DataChange { kind: "changed" | "created" | "deleted" | "renamed"; path;
  oldPath?; origin: "plugin" | "external"; sourceInstanceId? }`, batched into `DataChangeBatch`
  and emitted for `DatabaseView` to subscribe to — this is how an external edit (another device,
  another app) reaches the open view live.
- Guards against a race between a write the plugin just made and the vault-change event that
  write triggers, via `OwnedWriteCredit { expiresAt; sourceInstanceId? }` and `DataWriteContext`
  — without this, the plugin's own write would look like an external change and could
  double-process or flicker.
- Delegates a large surface of concerns to sibling modules it imports rather than implementing
  them inline: `QueryEngine` (search/filter matching), `PropertyService` (property read/write),
  `ComputedFieldEngine` / `ComputedEvaluator` (formula evaluation), `SourceRules` (which notes a
  database's source rule includes), `ColumnConfig` (schema linking), `FileFields` (the built-in
  `file.*` pseudo-properties), `ReportsInspector` / `ReportsComputedConfig` (a specialized report
  detection and computed-config path).

---

## 3. `RowPipeline` — SEARCH → FILTER → LIMIT

```ts
class RowPipeline {
  build(records, config, state, app?, derivedValues?): RowData[]
  buildWithDiagnostics(records, config, state, app?, derivedValues?): RowPipelineOutput
}
```

`buildWithDiagnostics(...)` is the real entry point; `build(...)` is a thin wrapper that discards
the diagnostics. The pipeline runs in a fixed order — search, then filter, then limit — and
returns both the resulting rows and a `RowPipelineDiagnostics` snapshot:

```ts
interface RowPipelineDiagnostics {
  sourceCount, postSearchCount, postFilterCount, postLimitCount, visibleCount,
  hasActiveSearch, hasActiveFilters, hasActiveLimit,
}
```

These diagnostics are not incidental — the empty-state renderers (`EmptyStateRenderer.ts`,
`getEmptyStateReason`) read them to distinguish "the source rule matched zero notes" from
"filters excluded every matched note" from "a result limit truncated to zero," each of which
needs different empty-state copy and a different suggested fix.

---

## 4. THE SUPPORTING CAST

- **`QueryEngine`** (`QueryEngine.ts`) — the search/filter predicate matcher both `DataSource`
  (for source-rule matching) and `RowPipeline` (for the visible-rows search stage) delegate to.
- **`ColumnTypes.ts` / `ColumnConfig.ts` / `ColumnDisplay.ts`** — column type definitions, per-
  database column schema, and per-column display formatting (number style, date format) —
  `CellRenderer.ts` in `src/views/` reads these to know how to draw a cell.
- **`ComputedField.ts` / `ComputedEvaluator.ts` / `ComputedSync.ts` / `ComputedCleanup.ts` /
  `ComputedDiagnostic.ts`** — formula fields: definition, evaluation, sync-mode handling (when a
  computed value is written back to frontmatter versus computed on read), and diagnostics for a
  formula that fails to evaluate.
- **`Aggregate.ts`** — summary/rollup math (count, sum, average, and peers) behind group
  summaries and `ChartAggregation.ts`.
- **`RelationRollup.ts` / `RelationInverse.ts`** — Relation and Rollup properties, which connect
  notes via Obsidian wikilinks and derive values across the connection.
- **`SourceRules.ts`** — parses and evaluates the tree of rules (folder, tag, property, link,
  expression) that decides which notes a database includes.
- **`FileFields.ts`** — the built-in `file.*` pseudo-properties (filename, path, ctime, mtime)
  that read from `TFile` rather than frontmatter, exposed alongside real properties.

---

## 5. MIGRATION MODEL

`src/main.ts`'s `onload()` loads settings via `this.loadData()` and applies defensive migrations
inline (`main.ts:92-135`) — for example, absorbing a legacy `typeFilter` into the newer source-
rule tree via `absorbTypeFilterIntoRules(...)`, matching the same shape a `db_view`-file migration
uses. `migrateDatabasesToFiles()` (`main.ts:2684`) is a separate, async, best-effort migration
that converts older in-settings database definitions into standalone `db_view: true` Markdown
files, logging (not throwing) per-database failures. There is no formal migration-version counter
— migrations are idempotent, defensive transforms applied on every load, not a numbered sequence.

---

## 6. RELATED REFERENCES

- `view-renderer-architecture.md` — how `src/views/` consumes this pipeline's output.
- `obsidian-plugin-api.md` — the `Vault`/`MetadataCache`/`App` boundary `DataSource` is built on.
- `verification.md` — most of the 386 measured `vitest` assertions concentrate in `src/data/`'s
  co-located `*.test.ts` files.
