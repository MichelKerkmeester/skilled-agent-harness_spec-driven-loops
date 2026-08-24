---
title: "Make.md Plugin File-Layer Workflows"
description: "Safe recipes for the Make.md community plugin: install and enable, create a Space from a folder, configure a table (columns, types, order, filter, sort, footers) in the UI, capture and clone a golden-sample .space/ store, and add board, calendar and chart views."
trigger_phrases:
  - "install make.md plugin"
  - "create make.md space from folder"
  - "configure make.md table"
  - "make.md golden sample clone"
  - "make.md board view"
  - "make.md calendar view"
  - "make.md chart view"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Make.md Plugin File-Layer Workflows

These recipes split cleanly into two layers. **Frontmatter** edits are file-layer operations the AI performs directly. **View configuration** (columns shown, order, filters, sort, grouping, footer summaries) is a **UI** operation whose output lives in the undocumented `.space/` SQLite store — the AI captures it once as a golden sample and clones it, rather than authoring the predicate JSON. The `.space/` layout, field-type strings and SQLite bootstrap tables referenced below are source-cited (`data-model.md`); the predicate/summary encoding is UNKNOWN, which is why §5 exists.

---

## 1. OVERVIEW

### Operating sequence

1. Confirm which layer the change belongs to: a **frontmatter** value (file-layer, AI-editable) or a **view configuration** (UI, golden-sample territory).
2. For frontmatter, read the note before changing it; write consistently-keyed YAML that matches the Context's columns.
3. For view configuration, either drive the UI (a human/install step) or clone a golden-sample `.space/` store (§5) — never hand-author the predicate JSON.
4. Back up any `.space/` file before overwriting it; keep the original in the working transcript.
5. Verify at the file layer: re-read the frontmatter or the cloned `.space/` files.
6. Tell the user to reload the pane so the plugin re-indexes and re-renders — and, on mobile, to run the §3 on-device checks in `troubleshooting.md`.

### Layer discipline

- The AI **can** author and verify note frontmatter (the column values).
- The AI **cannot** faithfully author a configured table view from scratch (`data-model.md` §7). It clones one.
- Rendering is always in-app; a file edit proves the value, a reload proves the render.

---

## 2. INSTALL AND ENABLE

Goal: get Make.md into the vault from the Community store — no BRAT.

### Steps

1. Open **Settings → Community plugins → Browse**.
2. Search **make.md**, choose **Install**, then **Enable**.
3. Confirm the plugin folder exists at `.obsidian/plugins/make-md/` with `main.js`, `manifest.json` and `styles.css`.
4. Confirm the installed version (target: latest stable **1.3.5**) and that Obsidian is **0.16.0+**; below that floor the plugin will not load.

### Manual fallback (only if the store is unavailable)

1. Create `<vault>/.obsidian/plugins/make-md/`.
2. Download `main.js`, `manifest.json` and `styles.css` from the tagged 1.3.5 release and place all three in that folder.
3. Restart Obsidian and enable **make.md** under Community plugins.

### Checkpoint

`plugin_installed_and_enabled`: the `make-md` folder holds the three release files, the version is 1.3.5, and Obsidian is 0.16.0+. On iOS/iPadOS this is necessary but **not** sufficient — mobile viability is proven only by the on-device checklist (`troubleshooting.md` §3), not by a successful enable.

---

## 3. CREATE A SPACE FROM A FOLDER

Goal: turn an existing vault folder into a Make.md Space. This is automatic — the recipe is about *confirming* it, not registering anything.

### Steps

1. Confirm the target folder holds the notes you want as rows, with their column values already in frontmatter.
2. In the Make.md Navigator, right-click the folder and choose **Create Space from Folder** / **Convert path to Space** (the label varies by release). No registry file is written — enumeration is automatic (`data-model.md` §2).
3. Open the Space's **Context** view. A default live context appears even before any `.space/` files exist.
4. If you need a filtered subset (e.g. only `Reports/`), create the Space **directly from that subfolder** rather than filtering a larger Space.

### Checkpoint

`space_recognized`: the folder appears as a Space and its Context view opens. If `.space/` files now exist, they were created by the plugin, not by hand — read them, never invent them.

---

## 4. CONFIGURE A TABLE (columns, types, order, filter, sort, footers)

Goal: build the Notion-style table. This is a **UI** recipe — its output is the golden sample §5 captures. The AI's file-layer contribution is making sure the frontmatter these columns read is correct and consistent first.

### File-layer prerequisite (AI)

Before configuring, ensure every row note carries the intended keys with consistent names and value shapes:

```yaml
# Finance/Reports/2026-01.md
---
month: 2026-01      # → Date column
income: 4200        # → Number column
expenses: 3100      # → Number column
balance: 1100       # → Number column
category: "[[Operating]]"   # → Link (or Context) column
---
```

Inconsistent keys across rows are the most common cause of a column that looks empty for some notes — fix them at the file layer first.

### UI steps (human / install phase)

1. Open the Context and choose **Add existing** to surface each frontmatter key as a column — **columns are hidden until added** (`data-model.md` §5).
2. Assign each column's type: numeric → Number, month/date → Date, select → Options, `[[wikilink]]` → Link/Context.
3. Hide any properties you do not want, then **drag the columns into the required order** (the order is persisted as the serialized `cols` order in `views.mdb`).
4. Set **Layout → Table** and save the view (e.g. `Reports — Table`).
5. Add the **filter** (e.g. restrict to the reporting subset), the **sort** (e.g. by the month/date field), and any **footer summaries** (Sum / Average / Max / Min / Count).

### Aggregate-footer caveat

Whether one column can show **Sum + Average + Max simultaneously** is **UNKNOWN** — the public docs do not confirm multi-aggregate footers, and the source confirms only an `fn` key on aggregate *properties*, not the table footer encoding (`data-model.md` §4, §7). Treat a multi-aggregate footer as a UI acceptance gate: it counts only if the UI visibly exposes it. If only one aggregate per column is available, say so plainly rather than asserting parity.

### Checkpoint

`table_configured_in_ui`: the table shows exactly the intended columns, in order, with the filter, sort and footer behavior the requirement names — verified by looking at the running UI, because none of that config is file-layer authorable from scratch.

---

## 5. THE GOLDEN-SAMPLE-THEN-CLONE APPROACH

Goal: reproduce a configured table across folders **without** guessing the predicate JSON. This is the sanctioned substitute for from-scratch generation (`data-model.md` §7).

### Steps

1. Build one fully-configured Space in the UI per §4 — all desired columns, each field type, explicit order, an explicit filter, an explicit sort, and at least one footer each for Sum/Average/Max/Min/Count.
2. Capture that Space's `.space/` store as the golden sample:

   ```text
   Reports/
   ├── Reports.md          # only if folder notes are enabled
   └── .space/
       ├── def.json
       ├── context.mdb
       └── views.mdb        # commands.mdb usually omittable
   ```

3. Inspect the exact generated SQLite contract before trusting it, so the clone is understood, not magic:

   ```sh
   sqlite3 views.mdb 'SELECT type, name, sql FROM sqlite_master ORDER BY type, name;'
   sqlite3 views.mdb 'SELECT * FROM m_schema;'
   sqlite3 context.mdb 'SELECT * FROM m_fields;'
   ```

4. To reproduce the layout on a **structurally identical** folder (same column keys and types), copy the golden `.space/` files into the target folder, then adjust only the values that must differ (the context schema id / db reference and any folder-specific `def.json` fields). Back up any existing `.space/` first.
5. Reload the pane and confirm the cloned view renders. If the target's frontmatter keys differ from the sample's, the clone will not match — align the frontmatter (§4 prerequisite) or capture a fresh sample.

### Checkpoint

`golden_sample_cloned`: the reproduced Space came from a real UI-generated `.space/` store, its SQLite contract was inspected, the target folder's frontmatter keys match the sample's columns, and no predicate JSON was hand-invented.

---

## 6. BOARD, CALENDAR AND CHART VIEWS

Goal: add Make.md's non-table Notion-style views. All are UI/golden-sample operations; the AI's job stays at the frontmatter layer that feeds them.

### Board (Kanban)

1. Ensure every row note carries a select-type frontmatter key to group by (e.g. `category` or `type`).
2. In the Context, set **Layout → Card View** and configure **Grouping by** that existing property.
3. Save the board view (e.g. `Expenses — Board`). Capture/clone via §5 to reproduce it elsewhere.

### Calendar

1. Ensure every row note carries a date-type frontmatter key (e.g. `month` or `dueDate`) as an ISO date string — this is what the grid keys on.
2. Set **Layout → Calendar** keyed on that date property, and save the view.
3. The calendar is built entirely from the Space's own notes — no external Google/iCloud calendar is involved. A row sits on the single day named by its date field; multi-day event spans are **UNCONFIRMED**, so model a spanned event as a single dated note rather than asserting a span the plugin may not render.

### Chart

1. Confirm the numeric series exist as frontmatter Number properties across the rows.
2. Create a chart/visualization Frame, **group by** the date/select field, and aggregate the numeric series with **Sum** or **Mean**.
3. Availability of **Max** for charts, and inline placement of a chart inside a table footer, are **UNKNOWN** — do not assume a chart is embedded in a table footer; keep it a separate Frame.

### Checkpoint

`nontable_view_wired`: the board's grouping property, the calendar's date property, or the chart's numeric series all exist as real frontmatter on the row notes, the view was saved in the UI (or cloned per §5), and any UNKNOWN behavior (multi-day spans, chart Max, footer-embedded charts) is flagged rather than asserted.

---

## 7. VERIFYING

Run these named checkpoints after any Make.md operation:

| Checkpoint | What it proves |
| --- | --- |
| `plugin_installed_and_enabled` | The `make-md` folder holds the three 1.3.5 release files and Obsidian is 0.16.0+ |
| `space_recognized` | The folder auto-registered as a Space and its Context opened; any `.space/` files were plugin-created, not hand-authored |
| `frontmatter_consistent` | Every row note carries the intended column keys with consistent names and value shapes |
| `table_configured_in_ui` | The table shows the intended columns, order, filter, sort and footers — confirmed in the running UI |
| `golden_sample_cloned` | A configured layout was reproduced from a real UI-generated `.space/` store with its SQLite contract inspected, not from guessed predicate JSON |
| `nontable_view_wired` | A board/calendar/chart view's grouping/date/numeric source exists as real frontmatter, and UNKNOWN behaviors are flagged |
| `mobile_verified_on_device` | On iOS/iPadOS, the `troubleshooting.md` §3 on-device checklist passed before the Space was relied on |

The file layer proves the frontmatter and the cloned `.space/` files. The render proves itself in-app after the user reloads the pane — and on mobile, only after the on-device acceptance checks pass.
