---
title: "Notion Bases Plugin File-Layer Troubleshooting"
description: "Cause, detection and file-layer recovery for Notion Bases plugin failures: schema mismatch, missing back-reference, unsupported view type and rollup/lookup drift."
trigger_phrases:
  - "notion bases schema mismatch"
  - "notion bases missing back reference"
  - "notion bases unsupported view"
  - "notion bases rollup wrong value"
  - "notion bases lookup ambiguous"
  - "notion bases subtask too deep"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Notion Bases Plugin File-Layer Troubleshooting

Diagnose the `_database.md` schema, the row notes and the relation graph separately. A schema that parses can still fail to reflect what the row notes actually contain.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Relation shows on one side only | `pairedColumnId` not declared on the target database, or the forward wikilink doesn't resolve |
| Column has no effect at all | The frontmatter uses a non-source key (e.g. a snake_case guess like `group_by`, `two_way`, `date_field`) — the plugin silently ignores unknown keys; use the confirmed keys in `data-model.md` §2–§6 |
| Rollup shows the wrong value | Wrong `rollupFunction`, wrong `rollupTargetColumnId` name, or a related row is missing the property |
| Lookup shows nothing or the wrong value | The relation resolves to zero or more than one related row |
| Subtask nesting looks broken | Chain exceeds 3 levels, or a `parent_task` wikilink doesn't resolve |
| A requested view never renders | The requested type is Form, Map or Dashboard — no Obsidian equivalent exists |
| Embedded view shows nothing | The `nb-database` block's `path` doesn't match a real database folder, or its optional `type` is invalid |
| Row file moved unexpectedly | `folderArrangement` is enabled — the plugin relocates rows into subfolders by column value (`computeArrangedPath`); read the row at its arranged path |
| A written rollup/lookup/system value is ignored | Those are derived (file stats, `resolveRollupsForRows`, `resolveLookupsForRows`), not stored — never hand-author them |
| Relation breaks after renaming the target note | It matches on `_title` (default `refColumnId`/`refMatchColumnId` = note basename); fix the forward wikilink to the renamed note |
| Schema edit has no effect | `_database.md` invalid YAML, or Obsidian not reloaded |
| Old values on screen | The note or pane needs a reload |

---

## 2. DIAGNOSIS SEQUENCE

1. Read `_database.md` for every database folder involved and confirm it parses as valid YAML frontmatter.
2. Read every row note the operation touches, before assuming a value is wrong.
3. For a relation, resolve the forward wikilink and confirm the target database's schema declares the matching `pairedColumnId`.
4. For a rollup or lookup, resolve the underlying relation first, then the target property, by hand.
5. For a view, confirm its `type` is one of the 7 supported values and every referenced column exists.
6. For an embedded view, confirm the `nb-database` block's `path` resolves to a real database folder and its optional `type` (if given) is one of the 7 supported values.
7. Check the render step last: the user must reload the note or pane after any file change.

---

## 3. SCHEMA MISMATCH

| Cause | Check | Fix |
| --- | --- | --- |
| Column type typo (`realtion`, `rolup`) | Grep the schema for the exact type keyword | Correct the type keyword; VERIFY the exact spelling against the installed plugin, not memory |
| Column referenced by a rollup/lookup doesn't exist | Compare the rollup's `rollupRelationColumnId`/`rollupTargetColumnId` (or the lookup's `refColumnId`) against the schema's `columns` map | Add the missing column, or fix the reference to an existing one |
| `_database.md` replaced wholesale instead of merged | Diff against the last known-good backup | Restore from `.bak`, re-apply only the intended column/view edit |
| Row frontmatter uses a different key than the schema declares | Compare a sample row's frontmatter keys against `columns` | Rename the row key to match the schema, or update the schema to match established rows — pick one source of truth and apply it everywhere |

### Example

Before (schema says `estimate_hours`, row says `hours_estimate`):

```yaml
# Projects/_database.md
columns:
  estimate_hours_total: { type: rollup, rollupRelationColumnId: tasks, rollupTargetColumnId: estimate_hours, rollupFunction: sum }
```

```yaml
# Tasks/Design homepage.md
---
hours_estimate: 8
---
```

After (row key corrected to match the schema):

```yaml
# Tasks/Design homepage.md
---
estimate_hours: 8
---
```

---

## 4. MISSING BACK-REFERENCE

| Cause | Check | Fix |
| --- | --- | --- |
| Only one database's `_database.md` declares the relation | Read both `_database.md` files, compare `pairedColumnId` names | Add the matching relation declaration to the other database |
| `pairedColumnId` names don't match on both sides | Compare the exact string on each side | Rename one side to match the other exactly |
| Forward wikilink doesn't resolve to a real note | Confirm the target file exists at the wikilinked path | Fix the wikilink or create the missing target note |
| Two-way sync expected before v1.3.0 | Check the installed plugin version | Upgrade to v1.3.0+ before promising a two-way relation |

Two-way population is an in-app compute step — before the plugin runs, only the forward wikilink and the schema's declared `pairedColumnId` are file-layer verifiable. Do not claim the reverse list is populated until a reload has been confirmed.

---

## 5. UNSUPPORTED VIEW TYPE

| Cause | Check | Fix |
| --- | --- | --- |
| Requested view type is Form, Map or Dashboard | Compare the request against the 7 supported types in `data-model.md` §6 | Document the request as lost — no Obsidian equivalent exists through this plugin or any other. For Dashboard, offer a note that embeds multiple Bases/Dataview blocks as an approximation, and say plainly that it is an approximation |
| View type spelled incorrectly (`gant` for `timeline`) | Grep the schema for the exact `type` value | Correct to the exact supported value |
| View references a column that doesn't exist | Compare `groupByColumnId` or `calendarDateField` against the schema's `columns` map | Add the missing column, or fix the view to reference an existing one |
| `nb-database` embed block's `path` doesn't match a real database folder | Compare the block's `path` against the vault's actual folder names | Correct the `path` value, or create the missing database folder |

---

## 6. ROLLUP OR LOOKUP DRIFT

| Cause | Check | Fix |
| --- | --- | --- |
| Wrong `rollupFunction` for the intent (e.g. `count` instead of `sum`) | Compare the declared function against the 7 in `data-model.md` §3 | Correct the `rollupFunction` value |
| A related row is missing the aggregated property | Read every row the relation reaches | Add the missing property, or exclude that row explicitly and say so |
| Lookup relation resolves to more than one row | Confirm the relation's cardinality | A one-to-many relation cannot feed a Lookup unambiguously — redesign as a Rollup with `list`, or pick a single-valued relation |
| Value looks stale | Confirm whether a related row changed since the last read | Re-read every related row before reporting a rollup or lookup value again |

---

## 7. RECOVERY

| Problem | Fix |
| --- | --- |
| Relation one-sided | Add the missing back-reference declaration on the target database |
| Rollup wrong value | Re-resolve by hand from the related rows; fix the function or property name |
| Lookup ambiguous | Fix the relation's cardinality or switch to a `list` rollup |
| Subtask chain too deep | Flatten to within 3 levels; the plugin's documented limit is 3 |
| Unsupported view requested | Document as lost (Form/Map) or offer an embedded-blocks approximation (Dashboard) |
| `nb-database` embed shows nothing | Fix the block's `path` to a real database folder, or its `type` to a supported value |
| Broken `_database.md` | Restore from `.bak` and re-apply only the intended edit |
| Stale results | Reload the note or pane |

---

## 8. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `schema_file_valid` | `_database.md` parses and every column/view reference resolves within the schema |
| `schema_file_backed_up` | A `.bak` copy exists before any schema-shape write |
| `relation_schema_reciprocal` | Both databases declare matching `pairedColumnId` names and the forward wikilink resolves |
| `rollup_hand_resolved` | The declared function was applied by hand to real related rows |
| `lookup_single_row_resolved` | The lookup's relation resolves to exactly one related row |
| `subtask_chain_within_limit` | The self-relation chain resolves and terminates within 3 levels |
| `view_type_supported` | The view's `type` is one of the 7 supported values, never Form/Map/Dashboard |
| `nb_database_embed_valid` | The `nb-database` embed block's `path` resolves to a real database folder and its optional `type` is one of the 7 supported values |
| `reload_advised` | The user knows a note or pane reload is required to see the render |

---

## 9. LIMITS

- The AI verifies files and computes aggregates by hand. The plugin renders in-app, so visual confirmation of a table/board/gallery/chart needs the user.
- The database definition, the 18 column types, the 7 view types, the 7 rollup functions, the per-column `_database.md` keys and the `nb-database` embed syntax are confirmed against the plugin's `src/types.ts` and the installed `main.js` (v1.12.0). Every `_database.md` must carry the required `notion-bases: true` marker (`data-model.md` §1).
- Form, Map and Dashboard views have no Obsidian equivalent through this plugin or any other — never present a workaround as parity.
- Two-way relation population and rollup/lookup rendering both happen in-app; file-layer checks prove the schema and the underlying data, not the computed render.
- Never fabricate a rollup, lookup or relation result. If the related rows on disk do not support the answer, report the gap.
