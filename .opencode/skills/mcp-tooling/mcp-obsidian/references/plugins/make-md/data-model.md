---
title: "Make.md Plugin File-Layer Data Model"
description: "The .space/ on-disk format for the Make.md community plugin: automatic folder-to-Space registration, the def.json SpaceDefinition, the context.mdb / views.mdb / commands.mdb SQLite stores, the 13 field-type strings, how note frontmatter maps to Context columns, and why a fully configured table view is not reproducible from scratch."
trigger_phrases:
  - "make.md data model"
  - "make.md .space format"
  - "def.json space definition"
  - "context.mdb views.mdb"
  - "make.md field types"
  - "make.md frontmatter columns"
  - "m_schema m_fields tables"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Make.md Plugin File-Layer Data Model

Make.md persists a Space's configuration in a per-folder `.space/` store and keeps each note's column values in that note's YAML frontmatter. Nothing about a note's data leaves markdown. The `.space/` file layout, the 13 field-type strings, and the `m_schema` / `m_fields` bootstrap tables below are **source-cited** against the plugin's current-main TypeScript (`filesystemAdapter.ts`, `spaceInfo.ts`, `mdb.ts`, `db.ts`, `space.ts`) — they are not confirmed against an install in the operator's vault. The pieces the source does not expose — the table-view predicate JSON and the default context schema id — are marked **UNKNOWN** and must not be guessed (§7).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Space registration | Automatic — a vault folder *is* a Space; no registry file | N/A — nothing to author |
| Column values (row data) | Each note's YAML frontmatter, one key per column | Yes — read/write frontmatter directly |
| Space definition | `<folder>/.space/def.json` (plain JSON `SpaceDefinition`) | Read; clone from a golden sample |
| Context (database) schema + rows | `<folder>/.space/context.mdb` (SQLite via sql.js) | Read; clone from a golden sample |
| View definitions | `<folder>/.space/views.mdb` (SQLite via sql.js) | Read; clone from a golden sample |
| Commands / actions | `<folder>/.space/commands.mdb` (optional) | Read; often omitted (§3) |
| Vault-level caches | `.makemd/superstate.mdc`, `.makemd/fileCache.mdc`, `.obsidian/plugins/make-md/Spaces.mdb` | No — runtime indexes, never hand-authored (§6) |
| Rendering | The open Obsidian window | No — file-layer writes prove the value, not the pixels |

### Core contract

- Every Context row is a real note. Uninstalling Make.md never deletes data — the markdown and its frontmatter survive on their own.
- **Folder Spaces auto-register.** `allSpaces()` enumerates vault folders directly and `spaceInitiated()` returns `true` unconditionally, so there is no registry row, Space id, or hash to reproduce.
- The `.makemd/` caches and `Spaces.mdb` are **not** the registration mechanism — a missing `context.mdb` falls back to a default live context, and a missing `views.mdb` falls back to default frames.
- A **fully configured table view** (filters, sort, grouping, hidden/visible columns, footer summaries) is **not** reproducible from source facts — it needs a golden sample (§7).

### No marker required

Unlike the sibling Notion Bases plugin, Make.md needs **no** `notion-bases: true`-style marker and no schema file in the note tree. A folder becomes a Space by existing. The only Make.md-specific artifacts are inside `.space/`, and note frontmatter is read as-is.

---

## 2. AUTOMATIC FOLDER-TO-SPACE REGISTRATION

`FilesystemSpaceAdapter.allSpaces()` enumerates eligible folders (`allPaths(['folder'], hidden)`) and converts each into a `FilesystemSpaceInfo`; it does not query a vault-level registry, and `spaceInitiated()` returns `true` unconditionally. So:

```text
Finance/Reports/
```

automatically becomes a folder Space, subject only to Make.md's exclusion/hidden-folder settings. With the default `spaceSubFolder` setting the per-folder store is:

```text
Finance/Reports/.space/def.json
Finance/Reports/.space/context.mdb
Finance/Reports/.space/views.mdb
Finance/Reports/.space/commands.mdb
```

The subfolder name is setting-driven (`settings.spaceSubFolder`), so confirm it against the installed configuration before assuming `.space/`. There is no required `.obsidian/plugins/make-md/Spaces.mdb` row for a folder Space, and therefore no registration schema, id derivation, or hash to author.

---

## 3. THE `.space/` FILES

### `def.json` (JSON SpaceDefinition)

`spaceDefForSpace()` reads `def.json` as plain JSON and only falls back to the folder note's frontmatter when `def.json` is absent. `saveSpace()` writes these definition keys (confirmed key names; the empty/default values below are a source-shaped example, **not** a prescribed universal schema):

```json
{
  "_joins": [],
  "_contexts": [],
  "_links": [],
  "_sort": [],
  "_template": "",
  "_templateName": "",
  "defaultSticker": "",
  "defaultColor": "",
  "readMode": false,
  "fullWidth": false
}
```

`def.json` does **not** define the table view's columns or footer summaries — those live in `views.mdb`. `_subfolders` exists as a source constant but `saveSpace()` does not write it in the definition fragment.

### `context.mdb` (the database)

`.mdb` files are raw SQLite databases handled through `sql.js`. The bootstrap tables are hard-coded in the MDB SQLite writer (`db.ts`):

```sql
CREATE TABLE m_schema (
  "id"        char,
  "name"      char,
  "type"      char,
  "def"       char,
  "predicate" char,
  "primary"   char
);

CREATE TABLE m_fields (
  "name"     char,
  "schemaId" char,
  "type"     char,
  "value"    char,
  "hidden"   char,
  "attrs"    char,
  "unique"   char,
  "primary"  char
);
```

Each declared column becomes an `m_fields` row, and the serializer creates one additional data table per schema id, one `char` SQLite column per field:

```sql
INSERT INTO m_fields
  ("name", "schemaId", "type", "value", "hidden", "attrs", "unique", "primary")
VALUES
  ('year',   '<context-schema-id>', 'text',   '{"alias":"Year"}',   '', '', '', ''),
  ('amount', '<context-schema-id>', 'number', '{"alias":"Amount"}', '', '', '', ''),
  ('status', '<context-schema-id>', 'option', '{"alias":"Status"}', '', '', '', '');

CREATE TABLE "<context-schema-id>" (
  'year'   char,
  'amount' char,
  'status' char
);
```

For a normal folder Context, note membership and frontmatter values are read **live** and merged with any persisted rows (`mergeContextRows(...)` in `readTable()`), so a static SQLite row per note is not required and `table.rows` can start empty. The exact persisted context-row / path encoding is **UNKNOWN** from source.

### `views.mdb` (the views)

`views.mdb` uses the same `m_schema` table. The confirmed built-in rows are structurally:

```sql
INSERT INTO m_schema
  ("id", "name", "type", "def", "predicate", "primary")
VALUES
  ('main', 'main', 'frame', '', '', 'true'),
  ('filesView', 'All', 'view',
   '{"db":"<defaultContextSchemaID>","icon":"ui//file-stack"}', '', '');
```

A custom view adds a further `m_schema` row (`type: view`) whose `predicate` carries the view options, plus a data table named after the view id. The **column order follows the serialized `cols` order**. The predicate JSON for filter / sort / grouping / hidden columns / footer summaries is **UNKNOWN** (§7).

### `commands.mdb` (optional)

`commands.mdb` is a separate action store. It can be **omitted** for a Space that contains only Contexts and views — it is not required for folder registration, context loading, or ordinary views.

---

## 4. THE 13 FIELD-TYPE STRINGS (source-cited)

The exact stored `type` strings come from `mdb.ts`:

| Meaning | Stored `type` |
| --- | --- |
| Text | `text` |
| Number | `number` |
| Boolean | `boolean` |
| Date | `date` |
| Single-select | `option` |
| Multi-select | `option-multi` |
| Link to note | `link` |
| Multi-link | `link-multi` |
| Relation to another Context | `context` |
| Multi-context relation | `context-multi` |
| File / path property | `file` |
| Formula / file-derived property | `fileprop` |
| Aggregate / rollup property | `aggregate` |

Details that matter when authoring or reading `m_fields`:

- `option` is declared with `multiType: "option-multi"`; `link` is declared with `multiType: "link-multi"`.
- There is **no** source-defined literal type named `"attachment"`. `file` is a restricted file/path property, not necessarily a binary attachment; Make.md's canonical path property maps to type `file`.
- `fileprop` resolves through `fieldTypeForField()` to the formula's result type when its value parses successfully.
- An `aggregate` property declares configuration keys including `['ref', 'space', 'schema', 'filters', 'field', 'fn', 'format']`. That is the aggregate-property (rollup) config — it is **not** proof of the table footer-summary format (§7).

Make.md also carries a full Notion-grade formula library and the view types table, board, gallery, calendar and list, plus **Frames** (custom layouts) and charts. Every one of those renders in-app; none is file-layer verifiable beyond the `.space/` config that declares it.

---

## 5. HOW NOTE FRONTMATTER MAPS TO COLUMNS

A Context reads the YAML frontmatter of the notes in its Space as candidate columns, but **it does not auto-show them all**. Each frontmatter key is exposed as a column only after it is added through **Add existing** in the Context UI. So a note like:

```yaml
# Finance/Reports/2026-01.md
---
month: 2026-01
income: 4200
expenses: 3100
category: "[[Operating]]"
---
```

contributes candidate columns `month`, `income`, `expenses`, `category`, but the table shows them only once each is added. Type coercion is a UI step: numeric YAML → `number`, dates → `date`, select values → `option`, `[[wikilinks]]` → `link` (or `context` when the target is another Context). Coercion of link/relation properties has known rough edges — validate the actual mapping against sample notes rather than assuming it. The AI's file-layer job is to author correct, consistently-keyed frontmatter; **which** keys appear as columns, and in what order, is decided by the saved view config in `views.mdb`, not by the frontmatter itself.

---

## 6. VAULT-LEVEL CACHES (never hand-author)

`.makemd/superstate.mdc`, `.makemd/fileCache.mdc` and `.obsidian/plugins/make-md/Spaces.mdb` are **runtime indexes** maintained by Superstate and the Markdown adapter. Folder enumeration is independent of them; a missing `context.mdb` falls back to a default live context, and a missing `views.mdb` falls back to default frames. Their exact serialization/version contract is **UNKNOWN** from source. Do not hand-invent cache records — on a fresh vault, let Make.md create and populate these on first startup. They are not a hidden registration mechanism.

---

## 7. WHY FULL FROM-SCRATCH GENERATION IS NOT POSSIBLE

A basic file-only Space *is* achievable — folder registration is automatic, and the SQLite bootstrap tables (`m_schema`, `m_fields`) plus `def.json` have a confirmed shape a standard SQLite writer can reproduce. What is **not** reproducible from the source facts is a fully configured, guaranteed-working table view, because these pieces remain undefined:

1. the literal default context schema id and its default field rows (`defaultContextDBSchema` / `defaultContextSchemaID` were not verifiable from source — do **not** assume the id is `"context"`);
2. the exact table-view predicate JSON;
3. the exact filter-expression encoding;
4. the exact sort encoding;
5. the exact footer-summary / aggregation encoding (the source confirms an `fn` key for aggregate *properties*, but not whether table footers use `"sum"`, `"Sum"`, a separate `summaries` object, or another structure);
6. the exact persisted context-row override format.

**The correct answer for a from-scratch generator is: no, not faithfully, without a golden sample.** Create one working Space in the UI (all desired columns, each field type, explicit column order, an explicit filter, an explicit sort, and at least one footer each for Sum/Average/Max/Min/Count), then read the exact generated contract:

```sh
sqlite3 context.mdb 'SELECT type, name, sql FROM sqlite_master ORDER BY type, name;'
sqlite3 context.mdb 'SELECT * FROM m_schema;'
sqlite3 context.mdb 'SELECT * FROM m_fields;'
sqlite3 views.mdb   'SELECT * FROM m_schema;'
sqlite3 views.mdb   'PRAGMA user_version;'
```

Once the golden sample exposes the predicate and summary JSON, the remaining generator can be built with standard SQLite — there is no registry hash or hidden Space id blocking it, only the undocumented predicate shape. The `workflows.md` §5 clone recipe is the safe path until then.

---

## 8. WHAT THE AI MUST NOT DO

- Never author a Space "registry" — folders auto-register; there is no `Spaces.mdb` row, Space id, or hash to create.
- Never guess the table-view predicate JSON, the filter/sort/grouping/footer encoding, or the default context schema id. They are UNKNOWN — clone them from a golden sample (§7) instead.
- Never assume every frontmatter key already appears as a column; columns are hidden until added through **Add existing** (§5).
- Never present a source-cited fact and an UNKNOWN as the same confidence. The field types, the `.space/` layout and the `m_schema`/`m_fields` tables are source-cited; the predicate/summary JSON and the persisted row encoding are UNKNOWN.
- Never hand-author the `.makemd/` caches or `Spaces.mdb` — they are runtime indexes with an UNKNOWN contract (§6).
- Never claim a frontmatter or `.space/` edit rendered in the Context UI. File-layer writes prove the value; a reload proves the render, and that belongs to the plugin-install phase — on mobile, only after the on-device acceptance checklist passes (`troubleshooting.md` §3).
