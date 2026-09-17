---
title: View Renderer Architecture
description: The src/views/*Renderer.ts family that renders the plugin's seven database views, how DatabaseView dispatches to them, and the src/data pipeline (DataSource, RowPipeline) each renderer reads from.
trigger_phrases:
  - "view renderer architecture"
  - "add a new renderer"
  - "table board gallery list calendar timeline chart renderer"
  - "databaseview dispatch"
  - "row pipeline data source"
  - "src views modals unphotographed"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# View Renderer Architecture

`src/views/` (91 `.ts` files, measured) holds one `*Renderer.ts` per database view type plus the
shared chrome around them. This reference is that family, how `DatabaseView` reaches it, and the
`src/data/` pipeline every renderer reads from.

---

## 1. OVERVIEW

### Core Principle

`DatabaseView` (`src/views/database-view.ts`, `extends FileView`) is the one render surface for
every one of the seven views; it does not subclass per view type. It holds the `DataSource` and
`RowPipeline`, resolves which view type the active `ViewConfig` names, and dispatches into the
matching `*Renderer.ts` module. A renderer is a function/class that draws into a container
`DatabaseView` owns — it does not manage its own `WorkspaceLeaf` or lifecycle.

### When to Use

- Adding a new view type or a new column/field type inside an existing view
- Tracing how a `ViewConfig` becomes rendered rows on screen
- Deciding whether a change belongs in a renderer (`src/views/`) or the data pipeline
  (`src/data/`)
- Touching `src/views/modals/` — all 17 files there are unphotographed (see §4)

### Key Sources

- `src/views/database-view.ts` — the dispatch point, `extends FileView`
- `src/views/database-file-view.ts` — `DatabaseFileDashboardView extends DatabaseView`
- `src/data/data-source.ts` (`DataSource` class), `src/data/row-pipeline.ts` (`RowPipeline` class)
- `src/main.ts` — the single `Plugin` entry registering both view types

---

## 2. THE RENDERER FAMILY

Measured under `src/views/`: 91 `.ts` files total, 17 of which live in `src/views/modals/`. The
`*Renderer.ts` family covers every one of the seven documented views:

| View | Renderer |
| --- | --- |
| Table | `TableRenderer.ts` |
| Board | `BoardRenderer.ts` |
| Gallery | `GalleryRenderer.ts` |
| List | `ListRenderer.ts` |
| Calendar | `CalendarRenderer.ts`, `CalendarTimelineRenderer.ts`, `CalendarKeyboardNavigation.ts`,
  `CalendarMiniCalendarRenderer.ts`, `CalendarToolbarRenderer.ts`, `CalendarTimelineToolbarRenderer.ts` |
| Timeline | shares the `CalendarTimelineRenderer.ts` family above |
| Chart | `ChartRenderer.ts`, `ChartToolbarRenderer.ts` (backed by `chart.js`, the plugin's one
  runtime dependency) |

Shared chrome sits alongside them, not inside any one renderer: `ActiveViewControlsRenderer.ts`,
`ColumnHeaderController.ts`, `ColumnManagerRenderer.ts`, `CellRenderer.ts`,
`EmbeddedDatabaseRenderer.ts` (the read-only in-note embed), `DomGuards.ts` (type-narrowing DOM
helpers used across renderers), `DragDropFeedback.ts`, `EdgeAutoScroller.ts`, and
`CardFieldRenderer.ts` (the per-view card-field primitive board/gallery/list share — see its
`labelClass`/`valueClass`/`fieldClass` parameter contract in `screenshot-harness.md` §4, "the
card-field classes are parameters, not classes").

---

## 3. THE `src/data/` PIPELINE

`src/data/` (128 `.ts` files, measured) holds models, query, and formula evaluation — the
renderers read from it but do not own it:

- **`DataSource`** (`src/data/data-source.ts`, `export class DataSource`) — the vault-backed
  read/write layer. Constructed with `Vault`, `MetadataCache`, and `App`; parses and writes
  frontmatter (`parseYaml`/`stringifyYaml`), tracks `NoteRecord { file: TFile; frontmatter:
  Record<string, unknown> }`, and emits `DataChangeBatch` events (`kind: "changed" | "created" |
  "deleted" | "renamed"`) that `DatabaseView` subscribes to for live re-render.
- **`RowPipeline`** (`src/data/row-pipeline.ts`, `export class RowPipeline`) — turns
  `NoteRecord[]` plus a `ViewConfig` into the `RowData[]` a renderer actually draws.
  `buildWithDiagnostics(...)` runs search, filter, and limit in that order and returns
  `RowPipelineDiagnostics` (`sourceCount`, `postSearchCount`, `postFilterCount`,
  `postLimitCount`, `visibleCount`) alongside the rows — the empty-state renderers read these
  diagnostics to distinguish "no records match the source" from "filters excluded everything."
- **`QueryEngine`** (`src/data/query-engine.ts`) — the search/filter matcher `RowPipeline`
  delegates to.
- **`ColumnTypes.ts`, `ColumnConfig.ts`, `ColumnDisplay.ts`** — the column-definition and
  per-column display-format model every renderer's `CellRenderer.ts` reads.
- **`ComputedEvaluator.ts`, `ComputedField.ts`** — formula evaluation, consumed by both
  `DataSource` (write-time) and `RowPipeline` (read-time derived values).
- **`Aggregate.ts`** — the summary/rollup math behind group summaries and chart aggregation.

See `data-layer.md` for the full pipeline shape and `db-class-naming.md` for how a renderer's
output classes map to `styles.css` rules.

---

## 4. THE MODALS FOLDER — A COVERAGE GAP, NOT A DIFFERENT ARCHITECTURE

`src/views/modals/` (17 files: `AddDatabaseModal.ts`, `FormulaModal.ts`,
`CreatePropertyModal.ts`, `DeleteDatabaseModal.ts`, `StatusOptionsModal.ts`, and twelve more)
follows the same Obsidian `Modal` pattern as every other view file — it is architecturally
ordinary. What makes it worth flagging is coverage: the screenshot-harness inventory that seeded
`tools/screenshots/scenarios.mjs` used a non-recursing `ls src/views/*.ts`, which never reached
this subfolder, so **all 17 modal files are unphotographed today**. A change that touches one
without adding a scenario in the same change widens a gap this packet documents rather than
closes — see `screenshot-harness.md` §5 and `SKILL.md` §5 "ESCALATE IF."

---

## 5. RELATED REFERENCES

- `obsidian-plugin-api.md` — the `FileView`/`Plugin` boundary `DatabaseView` and `main.ts` sit on.
- `data-layer.md` — the full `src/data/` pipeline shape.
- `db-class-naming.md` — the class grammar a renderer's output must satisfy.
- `screenshot-harness.md` — why a renderer change and a fixture scenario change together.
