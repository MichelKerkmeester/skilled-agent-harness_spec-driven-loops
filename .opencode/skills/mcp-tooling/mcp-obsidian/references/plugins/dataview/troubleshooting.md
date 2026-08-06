---
title: Dataview File-Layer Troubleshooting
description: "Cause, detection and recovery for Dataview failures: empty query results, raw code rendering, unrecognized inline fields, disabled JavaScript and lost settings."
trigger_phrases:
  - "dataview query empty"
  - "dataview block raw code"
  - "dataview inline field not recognized"
  - "dataviewjs not running"
  - "dataview settings lost"
  - "dataview query wrong result"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Dataview File-Layer Troubleshooting

Diagnose the note data, the query block and the settings file separately. A valid query can still fail when a field name, a setting or the render step is wrong.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Query returns nothing | FROM source empty, field name wrong, or WHERE too strict |
| Block shows raw code | Fence language not `dataview`, or the query is invalid |
| Inline fields not recognized | Wrong separator, key collision, or inline queries disabled |
| `dataviewjs` block shows as code | `enableDataviewJs` is `false` (the default) |
| `$=` inline JS does nothing | `enableInlineDataviewJs` is `false` (the default) |
| Wrong dates or times | Timezone or format assumptions, missing `file.day` |
| Settings ignored | `data.json` invalid JSON, or Obsidian not reloaded |
| Old results on screen | The note or pane needs a reload |

---

## 2. DIAGNOSIS SEQUENCE

1. Read the note and confirm the block exists with the exact fence language `dataview` or `dataviewjs`.
2. Read the settings file or confirm it is absent so defaults apply.
3. Resolve the FROM source: list the folder, tag matches, or link targets.
4. Read the source notes and check the referenced field names exist.
5. Apply WHERE, SORT, GROUP BY, FLATTEN and LIMIT by hand and compare with the expected rows.
6. For JavaScript, confirm the enabling setting is `true`.
7. Check the render step: the user must reload the note or pane after a file change.

---

## 3. QUERY RETURNS NOTHING

| Cause | Check | Fix |
| --- | --- | --- |
| Empty FROM source | List the folder or tag matches | Fix the source or the path |
| Typo in field name | Grep the notes for the field key | Use the exact key from the note |
| WHERE too strict | Evaluate the filter by hand | Loosen the comparison or value |
| Value type mismatch | Compare a number with a string | Wrap with `number(...)` or `string(...)` |
| `file.day` assumed | Check the note structure derives a day | Use a real frontmatter date instead |
| Source notes moved | Re-check the folder path | Update FROM to the current location |

### Example

Before (field does not exist):

````markdown
```dataview
TABLE due
FROM "Projects"
```
````

The notes store `Due:: 2026-06-30`. DQL matches fields case-insensitively in most setups, but when in doubt use the exact key from the note. VERIFY the note key first, then fix the query:

````markdown
```dataview
TABLE Due
FROM "Projects"
```
````

---

## 4. BLOCK RENDERS AS RAW CODE

| Cause | Check | Fix |
| --- | --- | --- |
| Wrong fence language | Confirm the fence says `dataview`, not `dataviewjs` or `dql` | Correct the fence language |
| Missing closing fence | Count the fences | Close the block |
| Invalid query text | Validate per workflows section 3 | Fix the grammar |
| Plugin disabled | Check `community-plugins.json` | Re-enable the plugin |

A raw-code render means Obsidian does not see a registered code block language. The language name must match the plugin's registered names exactly: `dataview` and `dataviewjs`.

---

## 5. INLINE FIELDS NOT RECOGNIZED

| Cause | Check | Fix |
| --- | --- | --- |
| Wrong separator | Confirm `Key:: Value` with two colons | Rewrite the line |
| Key collision | Same key in frontmatter and body | Keep one source per key |
| Inline queries disabled | Check `enableInlineDataview` | Set it to `true` |
| Field in a code block | Inline fields inside fenced blocks do not parse | Move the field into the note body |
| Malformed value | Multi-line value without indentation | Indent the continuation lines |

---

## 6. DATAVIEWJS DOES NOT RUN

The default is `enableDataviewJs: false`. A `dataviewjs` block renders as code until the setting flips.

1. Confirm the block language is exactly `dataviewjs`.
2. Read `data.json` or confirm absence (defaults apply).
3. Set `enableDataviewJs` to `true` and `enableInlineDataviewJs` to `true` for `$=` queries.
4. Back up the file before writing, then merge only these keys.
5. Ask the user to reload Obsidian so the setting takes effect.

Use only verified API methods (`dv.pages`, `dv.current`, `dv.list`, `dv.table`, `dv.taskList`). Anything else: VERIFY against the official documentation before promising output.

---

## 7. SETTINGS LOST OR IGNORED

| Cause | Check | Fix |
| --- | --- | --- |
| Invalid JSON | Parse `data.json` | Restore from `data.json.bak` or re-create the defaults |
| Partial write | Compare against the 25 documented keys | Merge the missing keys |
| No reload | Settings read at plugin load | Reload Obsidian |
| Wrong file path | Confirm the folder `dataview` under plugins | Use the correct path |

The canonical defaults are in `data-model.md` section 2. Re-create the file from those defaults only when no backup exists.

---

## 8. RECOVERY

| Problem | Fix |
| --- | --- |
| Query returns nothing | Run the diagnosis sequence, fix source or field names |
| Raw code render | Fix the fence language, then reload the note |
| Inline fields ignored | Fix the separator or the key collision |
| JS blocks inert | Enable the JS settings, then reload Obsidian |
| Broken `data.json` | Restore from backup or the documented defaults |
| Wrong dates | Use ISO dates, verify timezone assumptions |
| Stale results | Reload the note or pane |

---

## 9. VALIDATION CHECKPOINTS

Named checks for every fix attempt:

| Checkpoint | What it proves |
| --- | --- |
| `settings_file_valid` | `data.json` parses and contains only documented keys |
| `settings_file_backed_up` | A `.bak` copy exists before any settings write |
| `query_block_validated` | Fence, view type, clauses and field names pass |
| `from_source_resolved` | The FROM source lists real notes on disk |
| `field_names_resolved` | Every referenced field exists in the source notes |
| `where_filter_evaluated` | The filter was applied by hand and matches expectations |
| `js_enablement_confirmed` | JS settings are `true` before promising JS output |
| `reload_advised` | The user knows a note or pane reload is required |

---

## 10. LIMITS

- The AI verifies files and computes results. The plugin renders in-app, so a visual confirmation needs the user.
- `file.day` is conditional. Verify it before using it in a query.
- DataviewJS beyond the verified method list is out of scope until checked against the official documentation.
- Dataview reads notes at render time. Moving, renaming, or deleting notes changes results without any settings change.
- Never fabricate a query result. If the files do not support the answer, report the gap.
