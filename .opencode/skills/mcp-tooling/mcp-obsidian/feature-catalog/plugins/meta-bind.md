---
title: "Meta Bind file-layer fields, buttons and the task timer"
description: "Author Meta Bind INPUT/VIEW fields and meta-bind-button blocks at the file layer, plus the Notion-style start/stop task timer built over a Notion Bases task database with the JS Engine companion."
trigger_phrases:
  - "meta bind button"
  - "meta bind input field"
  - "meta-bind-button block"
  - "notion style task timer"
  - "start stop timer obsidian"
  - "frontmatter button"
version: "0.1.0.0"
---

# Meta Bind file-layer fields, buttons and the task timer (`meta-bind`)

## 1. OVERVIEW

Meta Bind (repo `mProjectsCode/obsidian-meta-bind-plugin`, installed v1.5.1, manifest id `obsidian-meta-bind-plugin`) adds inline widgets that read and write note frontmatter: `INPUT[type:bindTarget]` editable fields, `VIEW[bindTarget]` read-only/computed fields, and `meta-bind-button` blocks whose actions patch frontmatter. Its companion **JS Engine** (`js-engine`, v0.3.6) runs the JavaScript for anything an expression can't do. Every AI operation is file-layer: the widget text and the frontmatter it binds to.

This is the engine behind the vault's **Notion-style task timer** — Start/End buttons that stamp timestamps over a Notion Bases task database, with a Bases formula column totalling elapsed time.

---

## 2. HOW IT WORKS

The mode authors `INPUT`/`VIEW`/`BUTTON` text in note bodies and reads/writes the bound frontmatter. A `meta-bind-button` runs an ordered `actions` list; `updateMetadata` patches a frontmatter property (evaluating an expression when `evaluate: true`), and `inlineJS`/`js` delegate to JS Engine. The task timer composes two `updateMetadata` buttons (`startTime`, `endTime`) with a Notion Bases formula total, so the same note is both a clickable timer and a database row. Settings edits follow backup discipline; rendering and clicks are in-app — the file layer proves the write.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/meta-bind/meta-bind.md`
- Data contract: `references/plugins/meta-bind/data-model.md`
- Recipes: `references/plugins/meta-bind/workflows.md`
- Diagnostics: `references/plugins/meta-bind/troubleshooting.md`

### Related

- Database, formula total and Calendar view: `references/plugins/notion-bases/notion-bases.md`
- JS Engine companion surface: documented in this reference set (`data-model.md` §6), not a separate tree

---

## 4. GUARDRAILS

- Author the widget, never click it. Prove the write by reading widget text and frontmatter, not the render.
- Timestamps are plain JavaScript (`new Date().toISOString()` with `evaluate: true`), not a `now()`/`=` grammar; the `js` action runs a vault-root-relative file as-is (not an exported function), needs JavaScript enabled in Meta Bind's settings, and reaches metadata via `engine.getPlugin('obsidian-meta-bind-plugin').api` — all confirmed against the installed `main.js` (v1.5.1).
- The Total-Time column is a Notion Bases formula, not a Meta Bind field — fix totals in `_database.md`, not the button.
- Back up `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` before any settings write; preserve unrelated keys.
- Meta Bind is general-purpose (forms, buttons, embedded views); the timer is the headline recipe, not the whole plugin.
