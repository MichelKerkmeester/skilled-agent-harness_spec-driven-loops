---
title: Dataview Plugin Index (`dataview`)
description: "Lean entry point for operating the Dataview plugin (blacksmithgu/obsidian-dataview) at the file layer: note metadata, query blocks and the settings file."
trigger_phrases:
  - "dataview plugin"
  - "dataview query"
  - "dataview dql"
  - "dataview inline fields"
  - "dataview settings"
  - "dataview data json"
  - "dataview frontmatter fields"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Dataview Plugin Index (`dataview`)

The `mcp-obsidian` mode operates Dataview by **editing note metadata, placing query blocks and editing its `data.json` settings**. It never drives the query UI.

---

## 1. OVERVIEW
| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `dataview` | Plugin directory name + enablement entry |
| Display name | **Dataview** | Current manifest name |
| Plugin repository | [`blacksmithgu/obsidian-dataview`](https://github.com/blacksmithgu/obsidian-dataview) | Source of behavior facts |
| Author | Michael Brenan (blacksmithgu) | Manifest author |
| Version installed | 0.5.68 | Verified on-disk from `manifest.json` |
| Minimum app version | 0.13.11 | Manifest `minAppVersion` |
| Official documentation | https://blacksmithgu.github.io/obsidian-dataview/ | Manifest `helpUrl` |
| Settings file | `<vault>/.obsidian/plugins/dataview/data.json` | All plugin settings live here |

The vault has **no `data.json` yet**, so every documented default applies until the plugin writes its settings.

---

## 2. WHAT IT DOES

Dataview turns **plain note content into queryable data**. It reads three metadata sources from every markdown note and renders them on demand:

- YAML frontmatter fields at the top of a note.
- Inline fields written as `Key:: Value` inside note bodies.
- Implicit `file.*` fields that Obsidian and Dataview derive from each note.

Query blocks in notes render those fields as tables, lists, task lists, or calendars. JavaScript blocks render arbitrary computed views when enabled.

Dataview never writes note content. Its only persisted artifact is its settings file.

---

## 3. FILE-LAYER SURFACE (what the AI edits)

| Layer | Path / artifact | Operable by AI |
| --- | --- | --- |
| Note metadata | Any `.md` file in the vault | **Yes**. Add or edit frontmatter and inline fields |
| Query blocks | Fenced code blocks in `.md` files | **Yes**. Author, validate and edit DQL and DataviewJS blocks |
| Settings | `.obsidian/plugins/dataview/data.json` | **Yes**. Edit with backup discipline. Defaults apply while absent |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this mode runs) |
| Live rendering | The open Obsidian window | **No**. In-app compute. The AI verifies files, not pixels |
| Query evaluation | The plugin index | **No**. The AI computes query results by reading the notes directly |

### Capability boundary

- The AI **can** evaluate most DQL queries by reading the source notes and applying the grammar in this reference set.
- The AI **cannot** run DataviewJS code or force the plugin to refresh an open pane.
- The AI **can** write and validate the query text. Obsidian renders it on the next note open or reload.

---

## 4. METADATA LAYERS

Dataview merges note data from three layers into one field space:

| Layer | Syntax | Example |
| --- | --- | --- |
| Frontmatter | YAML between `---` fences | `status: active` |
| Inline fields | `Key:: Value` in the note body | `Due:: 2026-06-30` |
| Implicit fields | `file.*` names | `file.mtime`, `file.folder` |

Frontmatter and inline fields are queried by their plain name. Implicit fields carry the `file.` prefix. Full schemas live in `data-model.md` sections 3, 4 and 5.

### Example note

```markdown
---
title: "Quarterly report"
status: active
---

# Quarterly report

Revenue summary goes here.

Owner:: ada
Due:: 2026-06-30
```

- `status` comes from frontmatter.
- `Owner` and `Due` come from inline fields.
- `file.name`, `file.path` and `file.mtime` come from the implicit layer.

A query such as `TABLE status, Due FROM "Reports"` reads all three layers from this one note.

---

## 5. QUERY BLOCK FORMATS

| Format | Fence | Content | Enabled by default |
| --- | --- | --- | --- |
| DQL query | ```` ```dataview ```` | Multi-line DQL with view type and clauses | Yes |
| Inline expression | Single line, `=` prefix | One DQL expression | Yes |
| Inline JavaScript | Single line, `$=` prefix | One DataviewJS expression | No |
| DataviewJS | ```` ```dataviewjs ```` | Full JavaScript view code | No |

The `dataviewjs` and `$=` formats require `enableDataviewJs` and `enableInlineDataviewJs` in settings. Both default to `false`.

---

## 6. SETTINGS LOCATION

- **File**: `<vault>/.obsidian/plugins/dataview/data.json`.
- **State**: absent in this vault, so defaults apply.
- **Contract**: 25 keys with exact defaults, documented in `data-model.md` section 2.
- **Discipline**: read first, back up before any write, merge not replace, re-read after the user changes settings in-app.

Notable defaults: `enableDataviewJs: false`, `enableInlineDataview: true`, `renderNullAs: "\-"`, `taskCompletionTracking: false`.

---

## 7. WHEN TO USE THIS REFERENCE SET

Load this reference set when a request involves:

- Writing or fixing a Dataview query, a DQL table, or a task list.
- Adding queryable metadata to notes (frontmatter or inline fields).
- Explaining why a query returns nothing or renders as raw code.
- Changing Dataview behavior through settings (task completion, refresh, null rendering).
- Computing an answer from vault notes that Dataview would show.

### Sibling references

| File | Use it for |
| --- | --- |
| `data-model.md` | Exact settings schema, metadata layers, query block formats and verified DQL grammar |
| `workflows.md` | Numbered file-layer operations with before and after patterns |
| `troubleshooting.md` | Failure modes, named validation checkpoints and recovery steps |

The general file-layer operating model lives in `references/plugins/plugin-operation-logic.md`.

---

## 8. GOTCHAS

- **Read notes before promising results.** The user may have changed frontmatter, moved notes or edited queries since the last read.
- **Back up before settings writes.** Take a `data.json.bak` copy and merge key by key. Never replace the whole file with an unrelated object.
- **The vault has no settings file.** Defaults apply, including `enableDataviewJs: false`. JS blocks stay inert until a setting enables them.
- **Rendering is in-app.** File-layer verification proves the write, not the pixels. Tell the user to reload the note or pane.
- **`file.day` is conditional.** It exists only when the note structure yields a day. Use a real frontmatter date when in doubt.
- **Inline fields need the exact separator.** `Key:: Value` with two colons parses. A single colon does not.
- **Field name typos render empty tables.** A query with a wrong field name returns rows with blank cells, not an error.
- **Never fabricate query output.** If the notes on disk do not support the answer, report the gap and mark the missing evidence.

---

## 9. RELATION TO THE MODE

These references load on demand from the `mcp-obsidian` SKILL.md router when a request mentions queries, metadata, tasks, frontmatter or Dataview settings. The plugin data map in `plugin-operation-logic.md` section 3 covers the general file-layer model this reference set follows.
