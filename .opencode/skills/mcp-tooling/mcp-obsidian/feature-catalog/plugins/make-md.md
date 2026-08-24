---
title: "Make.md plugin file-layer Spaces, Contexts and configured views"
description: "Operate the Make.md community-plugin data layer: auto-registering folder Spaces, Contexts over note frontmatter, the per-folder .space/ store (def.json + SQLite .mdb files), the 13 field types, and the golden-sample-then-clone workflow for configured table/board/calendar/chart views."
trigger_phrases:
  - "make.md plugin"
  - "make.md spaces"
  - "make.md contexts"
  - "make.md database"
  - "make.md .space format"
  - "make.md golden sample"
version: "0.1.0.0"
---

# Make.md plugin file-layer Spaces, Contexts and configured views (`make-md`)

## 1. OVERVIEW

The Make.md community plugin (repo `Make-md/makemd`, latest stable 1.3.5, minimum Obsidian 0.16.0, installed from the Community store — no BRAT) is the closest Obsidian match to Notion's full database experience. Its model is **Spaces** (folders, which auto-register — no vault registry, id or hash) and **Contexts** (databases over the notes in a Space). Configuration lives in a per-folder `.space/` store (`def.json` plus SQLite `context.mdb` / `views.mdb` / `commands.mdb` via sql.js), while every column value stays in the note's YAML frontmatter, so notes survive uninstall. Make.md carries a full Notion-grade formula library, the table / board / gallery / calendar / list view types, plus Frames and charts. It is a strong A/B candidate rather than a files-only contract: a configured table view is **not** reproducible from scratch, and mobile — permitted by `isDesktopOnly: false` — must be verified on-device. All facts here are source-cited against the plugin's current-main TypeScript, not confirmed against an operator install.

---

## 2. HOW IT WORKS

The mode edits the part of Make.md that is plain markdown — the **note frontmatter** a Context surfaces as columns — and, for view configuration, clones a golden-sample `.space/` store rather than authoring the undocumented predicate JSON. Folders auto-register as Spaces (`allSpaces()` enumerates directly; `spaceInitiated()` returns `true`), and columns are hidden until added through **Add existing**, so the AI's job is consistent, correctly-keyed frontmatter plus safe capture/clone of the `.space/` files. Rendering stays in-app: a frontmatter edit proves the value, and a pane reload shows the Context table, board, calendar or chart — on mobile, only after the on-device acceptance checklist passes.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/make-md/make-md.md`
- Data contract: `references/plugins/make-md/data-model.md`
- Recipes: `references/plugins/make-md/workflows.md`
- Diagnostics: `references/plugins/make-md/troubleshooting.md`

### Verification

- On-device mobile acceptance checklist: `references/plugins/make-md/troubleshooting.md` §3 — mobile is UNCONFIRMED until every check passes on the actual iPhone/iPad
- Golden-sample capture and SQLite-contract inspection: `references/plugins/make-md/workflows.md` §5

### Related

- Files-only relational alternative (documented YAML, AI-authorable from scratch): `references/plugins/notion-bases/notion-bases.md` — never edited by this plugin's references, only pointed to
- General file-layer operating model: `references/plugins/plugin-operation-logic.md`

---

## 4. GUARDRAILS

- Folder Spaces auto-register — never author a `Spaces.mdb` row, Space id, or hash; enumeration is automatic (`filesystemAdapter.ts`).
- A configured table view is not reproducible from scratch — the filter/sort/grouping/footer-summary predicate JSON and the default context schema id are UNKNOWN; create the Space once in the UI, then clone its `.space/` files.
- Frontmatter columns are hidden until added via **Add existing** — never assume every YAML key already shows as a column.
- Mobile is permitted by the manifest but UNCONFIRMED until the on-device checklist passes — never claim mobile parity from the desktop result or the manifest flag alone.
- Distinguish source-cited facts (field types, `.space/` layout, `m_schema`/`m_fields` tables) from UNKNOWNs (predicate/summary JSON, persisted row encoding, default schema id, cache contract) — never present an UNKNOWN as confirmed.
- Never claim a frontmatter or `.space/` edit rendered in the Context UI. File-layer verification proves the write, not the pixels.
