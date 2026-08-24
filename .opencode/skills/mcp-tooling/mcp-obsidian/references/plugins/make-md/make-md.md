---
title: "Make.md Plugin File-Layer Index"
description: "Lean entry point for operating the Make.md community plugin (Make-md/makemd) at the file layer: Spaces (folders), Contexts (databases), the per-folder .space/ store (def.json + SQLite .mdb files), YAML-property columns, and the golden-sample-then-clone workflow for configured table/board/calendar/chart views."
trigger_phrases:
  - "make.md plugin"
  - "make-md plugin"
  - "makemd plugin"
  - "make.md spaces"
  - "make.md contexts"
  - "make.md database"
  - "make.md .space format"
  - "def.json space definition"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Make.md Plugin File-Layer Index (`make-md`)

The `mcp-obsidian` mode operates the Make.md community plugin by **editing note YAML frontmatter and, where safe, the per-folder `.space/` store**. It never drives the plugin's Context, table, board, calendar or chart UI. Make.md is the closest Notion-style match in Obsidian, but its view configuration is stored in undocumented SQLite structures — so this reference set treats it as an A/B candidate that carries a golden-sample-then-clone caveat, not a from-scratch generator.

**Verification status:** the facts below are source-cited against the plugin's current-main TypeScript (`filesystemAdapter.ts`, `spaceInfo.ts`, `mdb.ts`, `db.ts`, `space.ts`), **not** confirmed against an install in the operator's vault. Anything the source does not pin down is marked UNKNOWN here and in the sibling files — never guess past it.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`Make-md/makemd`](https://github.com/Make-md/makemd) | Source of behavior facts |
| Display name | **make.md** (Make.md) | Name shown in Community Plugins → Browse |
| Community store slug / manifest id | `make-md` | Installed from the Community store — **no BRAT required**. The plugin folder is `.obsidian/plugins/make-md/` |
| Version | **latest stable 1.3.5**, minimum Obsidian **0.16.0** | Below 0.16 the plugin will not load |
| Bundled "Basics" | Make.md Basics ships **with** Make.md — no separate dependency for Spaces, Contexts, databases, views, relations, formulas or charts | One install covers the whole feature set |
| Mobile capability | Manifest `isDesktopOnly: false` (Desktop + Mobile listed) | Mobile is *possible*, but see the caveat below — it is not a safe unverified mobile dependency |
| Storage model | **Spaces** (folders) + **Contexts** (databases). Configuration lives in a per-folder `.space/` store; note data stays in Markdown frontmatter | Notes survive uninstall; only the view/config layer is Make.md-specific |
| Reproducibility | **Partial.** Folder registration is automatic and file-only; a fully configured table view is not reproducible from scratch and needs a golden sample (§4, `data-model.md` §7) | This is why the migration research ranks Make.md an A/B candidate, not a files-only contract |

**Mobile caveat (do not omit):** `isDesktopOnly: false` means the plugin *runs* on iOS/iPadOS, but a large `main.js` (~5.7 MB), reported 30-second-plus Space operations on large vaults, `.makemd` cache staleness, and iCloud sync churn all mean mobile behavior **must be verified on the actual device** before relying on it. See `troubleshooting.md` §3.

---

## 2. HOW IT WORKS

A plain vault folder **auto-registers as a Space**: the plugin enumerates folders directly, with no vault-level registry row, Space id, or hash to author (`filesystemAdapter.ts` `allSpaces()`; `spaceInitiated()` returns `true` unconditionally). A **Context** is Make.md's database layer over the notes in that Space. Its configuration — property definitions, view schemas, filters, sorting, summaries — is persisted in the folder's `.space/` store (`def.json` plus SQLite `.mdb` files), while each note's column values stay in that note's YAML frontmatter.

At the file layer the AI operates the part that is plain markdown: it reads and writes the **frontmatter properties** a Context surfaces as columns, and it can read (and, from a golden sample, clone) the `.space/` store. What it cannot safely author from scratch is the table view's saved configuration — the exact filter/sort/grouping/footer-summary predicate JSON and the default context schema id are not exposed by the source, so a configured view is created once in the UI and its `.space/` files are then copied (§4).

Rendering stays in-app: a note frontmatter edit proves the underlying value; seeing it land in the Context table, board, calendar or chart needs the plugin running and the pane reloaded. Make.md carries a full Notion-grade formula library and the table / board / gallery / calendar / list view types plus Frames (custom layouts) and charts — but every one of those renders in-app, not at the file layer.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The `.space/` on-disk format (`def.json` keys, the `context.mdb` / `views.mdb` / `commands.mdb` SQLite stores), the 13 field-type strings, how note frontmatter maps to columns, the `m_schema` / `m_fields` bootstrap tables, and why full from-scratch view generation is not possible |
| [`workflows.md`](workflows.md) | Numbered recipes: install → enable → create a Space from a folder → configure a table (columns, types, order, filter, sort, footers) → the golden-sample-then-clone approach, plus board / calendar / chart views |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and recovery: mobile performance, stale `.makemd` cache, iCloud sync churn and conflict copies, columns not showing (Add existing), vault-wide UI takeover, and clean disable/uninstall |

The general file-layer operating model (locate data, edit data, never drive the UI) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md). For a files-only relational database that the AI *can* author from scratch, the sibling [`../notion-bases/notion-bases.md`](../notion-bases/notion-bases.md) reference set is the documented-YAML alternative — this reference set never edits those files, it only points to them.

---

## 4. GUARDRAILS

- **Folders auto-register — do not author a registry.** There is no `Spaces.mdb` row, Space id, or hash to create; enumeration is automatic (`filesystemAdapter.ts`). This is the opposite of the Notion Bases marker requirement — never invent a "register this Space" file.
- **A configured table view is not reproducible from scratch.** The filter/sort/grouping/footer-summary predicate JSON and the default context schema id are UNKNOWN from source. Create the Space once in the UI, then clone its `.space/` files — never guess the predicate shape (`data-model.md` §7, `workflows.md` §5).
- **Frontmatter columns are hidden until added.** Make.md reads note YAML as candidate columns, but a Context does not auto-show them all — each is exposed through **Add existing** in the UI. Do not assume every frontmatter key already appears as a column.
- **Mobile is unverified until tested on-device.** `isDesktopOnly: false` permits mobile, but performance, cache-staleness and iCloud-sync behavior are real risks — treat mobile as UNCONFIRMED until the on-device acceptance checklist in `troubleshooting.md` §3 passes.
- **Distinguish source-cited from UNKNOWN.** The field-type strings, the `.space/` file layout and the `m_schema` / `m_fields` bootstrap tables are source-cited; the predicate/summary JSON, the persisted context-row encoding and the default schema id are UNKNOWN. Never present an UNKNOWN as confirmed.
- **File-layer verification proves the write, not the render.** A note's frontmatter value is file-verifiable; the Context table, board, calendar or chart output needs a running Obsidian and a reload — that check belongs to the plugin-install phase, not this reference set.
- **No plugin install or live vault work happens from this reference set.** It documents the file shapes an already-installed plugin reads; installing Make.md and confirming its render (especially on mobile) is a separate, later step.
