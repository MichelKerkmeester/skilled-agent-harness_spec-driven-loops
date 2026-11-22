---
title: "Research: Optimizing the mcp-obsidian Notion Bases reference docs for AI operation"
trigger_phrases: []
---
# Research: Optimizing the mcp-obsidian Notion Bases reference docs for AI operation

> **Provenance / how this report was produced.** This deep-research run completed one full,
> source-grounded investigation iteration (`iterations/iteration-001.md`, 18 findings, all cited
> to the real plugin repository `bgarciamoura/obsidian-notion-bases-plugin`). The workflow's
> automated multi-iteration synthesis phase could **not** run to write this file: the shared
> deep-loop append gateway was mid-migration and deterministically rejected the deep-research
> lifecycle event shape (it emits legacy `type/event`; the migrated gateway now requires
> `stem/event_type`), which halted every relaunch before or after the first leaf iteration. That
> runtime is owned by a separate session and was out of scope to modify. This `research.md`
> therefore consolidates the **confirmed** iteration-1 findings and carries them through to the
> concrete per-file recommendations the run was chartered to produce. Every factual claim below
> traces to a source-cited finding in `iteration-001.md`; the recommendations are a mechanical
> gap-map from those confirmed findings, not new unverified research.

---

## 1. Research question and verdict

**Question.** What should be added, updated, or created in the mcp-obsidian Notion Bases
file-layer reference docs (`references/plugins/notion-bases/*`) so an AI can operate the plugin
more reliably — resolving in particular the VERIFY-flagged per-column YAML key spelling in
`_database.md`?

**Verdict.** The single VERIFY flag is **resolved, and the answer is that the shipped reference
docs are wrong.** The reference docs use guessed, human-readable YAML key names
(`target`, `two_way`, `back_reference`, `self_relation`, `group_by`, `date_field`) that do **not**
match the plugin's actual schema. The plugin's real keys are camelCase identifiers defined in
`src/types.ts` (`ColumnSchema`, `ViewConfig`) and consumed in `src/database-manager.ts`
(`readConfig`/`writeConfig`). An AI authoring `_database.md` from the current docs would produce
frontmatter the plugin silently ignores. This is a correctness bug in the docs, not a cosmetic
gap, and it is the highest-priority fix. Beyond the key corrections, seven real plugin features are
entirely undocumented.

**Confidence: high.** Source of truth was the plugin's TypeScript source fetched directly from the
upstream repo (raw GitHub), which defines the schema authoritatively. The one caveat: verification
used the repo `main` source rather than the installed v1.12.0 `main.js`; the `manifest.json` on
`main` reports `version: 1.12.0`, so `main` and the installed build are the same release
(finding 18).

---

## 2. Confirmed findings

### 2.1 YAML key corrections — the docs are WRONG (highest priority)

The following keys in the reference docs must be replaced with the plugin's actual source keys.

**Relation columns** (finding 1):

| Reference doc (WRONG)     | Actual source key (CORRECT)      | Purpose |
|---------------------------|----------------------------------|---------|
| `target: "Tasks"`         | `refDatabasePath: "Tasks/_database.md"` | Path to the target database file |
| `two_way: true`           | *(no field)* — implicit when `pairedColumnId` is set | Two-way relation |
| `back_reference: project` | `pairedColumnId: "project"`      | Column ID in the target DB holding the back-reference |
| *(missing)*               | `refColumnId: "_title"`          | Column in target DB to match against (defaults to `_title` = note basename) |

**Rollup columns** (finding 2):

| Reference doc (WRONG)        | Actual source key (CORRECT)            | Purpose |
|------------------------------|----------------------------------------|---------|
| `relation: tasks`            | `rollupRelationColumnId: "tasks"`      | Relation column ID to aggregate through |
| `property: estimate_hours`   | `rollupTargetColumnId: "estimate_hours"` | Column ID in the target DB to aggregate |
| `function: sum`              | `rollupFunction: "sum"`                | Aggregation function |

**Lookup columns** (finding 3):

| Reference doc (WRONG)   | Actual source key (CORRECT)             | Purpose |
|-------------------------|-----------------------------------------|---------|
| `relation: project`     | `refDatabasePath: "Tasks/_database.md"` | Path to the target database file |
| `property: status`      | `refColumnId: "status"`                 | Column ID in the target DB to pull value from |
| *(missing)*             | `refMatchColumnId: "_title"`            | Column in target DB to match against (defaults to `_title`) |

**Self-relation / hierarchy (subtasks)** (finding 4):

| Reference doc (WRONG)   | Actual source key (CORRECT)             | Purpose |
|-------------------------|-----------------------------------------|---------|
| `self_relation: true`   | `isHierarchical: true`                  | Marks a relation column as a hierarchy/parent column |
| *(missing)*             | `refDatabasePath: "<same DB>/_database.md"` | Self-relation path |

**View config** (finding 5) — the docs cover only `group_by` and `date_field`, both wrong, and omit
the large real `ViewConfig` surface:

| Reference doc (WRONG) | Actual source key (CORRECT) |
|-----------------------|-----------------------------|
| `group_by: status`    | `groupByColumnId: "status"` |
| `date_field: dueDate` | `calendarDateField: "dueDate"` |

Additional real `ViewConfig` keys the docs omit entirely: `calendarViewMode` (`month`/`week`);
`timelineStartField`, `timelineEndField`, `timelineZoom` (`days`/`weeks`/`months`),
`timelineGroupByField`; `chartType` (`bar`/`pie`/`line`), `chartXAxis`, `chartYAxis`,
`chartAggregation` (`count`/`sum`/`avg`/`min`/`max`); `galleryCoverField`, `galleryCardSize`;
`boardColumnOrder`, `boardColumnLimits`, `boardHideEmpty`, `boardHideNoValue`; `pinnedColumnId`,
`columnOrder`, `rowHeight`, `wrapText`; `aggregations` (`Record<columnId, AggregationType>`);
`includeSubfolders`; `conditionalFormats`.

### 2.2 Confirmed CORRECT — leave unchanged (findings 6–10)

- **Database marker** (finding 6): `_database.md` is identified by frontmatter `notion-bases: true`.
  `DATABASE_MARKER = 'notion-bases'` and the check is `frontmatter['notion-bases'] === true`. The
  boolean `true` is required — the marker key alone is not sufficient. Docs should state the `=== true` requirement explicitly.
- **Rollup functions** (finding 7): `sum`, `count`, `avg`, `min`, `max`, `count_values`, `list` — docs already correct.
- **View types** (finding 8): `table`, `list`, `board`, `gallery`, `calendar`, `timeline`, `chart` — docs already correct.
- **Column types** (finding 9): the 18 types (`title`, `text`, `number`, `select`, `multiselect`,
  `checkbox`, `date`, `url`, `email`, `phone`, `status`, `formula`, `relation`, `lookup`, `image`,
  `rollup`, `audio`, `video`) — docs already correct.
- **Embed syntax** (finding 10): the `nb-database` fenced code block with `path`, `type`, `id`
  parameters — docs already correct.

### 2.3 Undocumented features — NEW doc sections needed (findings 11–17)

1. **Embed state storage** (finding 11): embed view state is persisted in the **hosting note's**
   frontmatter under `notion-bases-embeds` — a map of embed ID → either a `ViewConfig`
   (forced-type embeds) or an `EmbedState` (`activeViewId` + `views[]` for multi-view embeds).
   Source key `EMBED_FM_KEY`.
2. **Folder arrangement** (finding 12): auto-files row notes into subfolders by column value, via
   `folderArrangement: { enabled: true, propertyIds: [...] }` in `_database.md`. Moves files to paths
   like `Done/High/row.md` (`computeArrangedPath`). An AI editing rows must know files can relocate.
3. **Template system** (finding 13): `templatePath`, `templateFolder`, `askTemplateOnCreate` with
   `{{title}}`, `{{folder}}`, `{{date}}`, `{{time}}` placeholders (`applyTemplate`).
4. **System columns** (finding 14): read-only columns backed by file stats, e.g.
   `created: { type: date, systemField: ctime }` / `modified: { type: date, systemField: mtime }`.
   Values come from `file.stat.ctime`/`mtime`, **not** frontmatter — an AI must not try to write them.
5. **Number format** (finding 15): `numberFormat: { decimals, thousandsSeparator, prefix, suffix }`.
6. **Live placeholders** (finding 16): `{{columnId}}` tokens in note bodies render the current cell
   value in reading view (`createLivePlaceholderProcessor`) — distinct from the embed system.
7. **Inline field support** (finding 17): when `readInlineFields` is enabled in plugin settings, the
   plugin reads Dataview-style `Key:: Value` inline fields in addition to frontmatter (`getNoteData`).

### 2.4 Rollup / lookup operational gotchas

- Rollups and lookups are **resolved by the plugin** (`resolveRollupsForRows`,
  `resolveLookupsForRows`) by walking the relation column; the values are derived, not stored source
  data. An AI should not hand-author rollup/lookup result values into row frontmatter.
- Relation matching keys off `refColumnId` / `refMatchColumnId`, defaulting to `_title` (the note
  basename). Cross-database links therefore break if the target note is renamed and the relation
  matches on `_title`. Docs should call this out.

---

## 3. Concrete recommendations for `references/plugins/notion-bases/`

Priority order. These are read-only recommendations; **no shipped doc was modified by this run.**

**P0 — Correct the wrong YAML keys in `data-model.md` (correctness bug).**
- Replace the relation keys `target` / `two_way` / `back_reference` with `refDatabasePath` /
  `pairedColumnId` (+ note that two-way is implicit) / add `refColumnId`.
- Replace the rollup keys `relation` / `property` / `function` with `rollupRelationColumnId` /
  `rollupTargetColumnId` / `rollupFunction`.
- Replace the lookup keys `relation` / `property` with `refDatabasePath` / `refColumnId` and add
  `refMatchColumnId`.
- Replace `self_relation: true` with `isHierarchical: true` (+ `refDatabasePath`).
- Replace view keys `group_by` / `date_field` with `groupByColumnId` / `calendarDateField`, and add
  the full `ViewConfig` surface (§2.1). Remove the **VERIFY** flag once these land.
- State the database marker requirement precisely: `notion-bases: true` (boolean `true` required).

**P1 — Add new sections for the seven undocumented features (§2.3).** Best placed in
`data-model.md` (schema-level: system columns, number format, folder arrangement, templates) and in
`workflows.md` (behavioral: embed state storage, live placeholders, inline field support). Each needs
a minimal correct YAML/example so an AI can author it without guessing.

**P2 — Update `workflows.md` YAML examples** to the corrected keys so end-to-end walkthroughs are
consistent with `data-model.md`.

**P3 — Add `troubleshooting.md` entries** for the highest-surprise behaviors: (a) frontmatter keys
silently ignored because a guessed key name was used; (b) row files relocating unexpectedly under
`folderArrangement`; (c) attempts to write system-column or rollup/lookup values having no effect
(they are derived/read-only); (d) relations breaking when a `_title`-matched target note is renamed.

**New document?** A dedicated `advanced-config.md` is worth considering to hold the larger
`ViewConfig` surface, `numberFormat`, `folderArrangement`, and template config, keeping
`data-model.md` focused on the core column schema. This is optional; the P0/P1 edits can also live in
the existing four files. (This was the deferred question 4/5 in iteration 1; the recommendation here
is derived from the confirmed feature inventory, and would benefit from a confirmation pass against
the actual current content of each shipped doc before editing.)

**Index/VERIFY housekeeping.** `notion-bases.md` §1 carried a VERIFY note on whether the community
slug matches the on-disk manifest `id`; finding 18 confirms both are `notion-bases` — the note can be
removed.

---

## 4. Open / unresolved items

- **Doc-diff not performed against live file contents.** The recommendations map confirmed source
  keys to doc changes, but a line-level diff against the *current* text of `data-model.md`,
  `workflows.md`, and `troubleshooting.md` was the deferred iteration-2 work and should be done before
  editing, to catch any doc sections already partially correct.
- **`main.js` not inspected.** Schema verification used repo `main` TypeScript (= v1.12.0 per
  manifest). A byte-level check against the installed `main.js` was not possible from this workspace
  (plugin lives in the vault, outside the repo). Low risk, but noted.
- **Formula column semantics** were not deep-dived (a candidate `formulas.md` was floated but not
  investigated).

---

## 5. Sources

All findings are cited in `iterations/iteration-001.md`. Primary sources (upstream repo
`bgarciamoura/obsidian-notion-bases-plugin`, raw `main`):

- `src/types.ts` — `ColumnSchema`, `ViewConfig`, `RollupFunction`, `ColumnType`, `SystemField`, `NumberFormat`
- `src/database-manager.ts` — `readConfig`/`writeConfig`, `syncTwoWayRelation`, `resolveLookupsForRows`, `resolveRollupsForRows`, `computeArrangedPath`, `applyTemplate`, `getNoteData`, `DATABASE_MARKER`
- `src/database-embed.ts` — `nb-database` block parsing, `EMBED_FM_KEY`
- `src/main.ts` — `createLivePlaceholderProcessor`
- `src/settings.ts` — `DEFAULT_SETTINGS`, `readInlineFields`
- `manifest.json` — `id: notion-bases`, `version: 1.12.0`, `minAppVersion: 1.8.7`
- Existing shipped refs (read-only): `references/plugins/notion-bases/{notion-bases,data-model,workflows,troubleshooting}.md`, `references/plugins/installed-plugins.md`
