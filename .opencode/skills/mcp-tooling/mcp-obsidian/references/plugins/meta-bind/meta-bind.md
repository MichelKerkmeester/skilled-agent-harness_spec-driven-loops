---
title: "Meta Bind Plugin File-Layer Index"
description: "Lean entry point for operating the Meta Bind community plugin (mProjectsCode/obsidian-meta-bind-plugin) at the file layer: inline INPUT/VIEW fields bound to frontmatter and meta-bind-button blocks whose actions patch frontmatter, plus the JS Engine companion — the basis of the Notion-style start/stop task timer."
trigger_phrases:
  - "meta bind plugin"
  - "meta-bind plugin"
  - "obsidian-meta-bind-plugin"
  - "meta bind button"
  - "inline input field"
  - "frontmatter button"
  - "task timer button"
  - "js engine block"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Meta Bind Plugin File-Layer Index (`meta-bind`)

The `mcp-obsidian` mode operates Meta Bind by **authoring its inline field and button syntax inside note bodies and reading/writing the frontmatter those widgets bind to**. It never drives the rendered widget — a button click, a toggle, a date picker — because that is in-app. What the AI authors is the `INPUT[…]` / `VIEW[…]` field, the ` ```meta-bind-button ` block, and the frontmatter keys they read and write.

This is the plugin behind the vault's **Notion-style task timer**: Start/End buttons that stamp timestamps into a task note's frontmatter, over a Notion Bases task database, with a formula column totalling elapsed time. Its scripting companion is **JS Engine** (`js-engine`), documented here as a companion rather than in its own tree.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`mProjectsCode/obsidian-meta-bind-plugin`](https://github.com/mProjectsCode/obsidian-meta-bind-plugin) | Source of behavior facts |
| Display name | **Meta Bind** | Name shown in Community Plugins → Browse |
| Community store slug | `meta-bind` | On-disk manifest `id` is **`obsidian-meta-bind-plugin`** (confirmed from the installed vault manifest) — the store slug and the manifest id differ here, so address the plugin folder as `.obsidian/plugins/obsidian-meta-bind-plugin/` |
| Installed version (operator vault) | **v1.5.1** (minAppVersion 1.13.1) | Confirmed installed and enabled |
| Companion plugin | **JS Engine** — manifest id `js-engine`, v0.3.6 (`mProjectsCode/obsidian-js-engine-plugin`) | Meta Bind delegates non-trivial computation to it; the timer uses it to compute elapsed time / render values. Documented in this reference set, not a separate one |
| Storage model | Widgets are plain text **inside note bodies**; the data they read/write is ordinary **frontmatter** (and, via bind targets, other notes' frontmatter). Plugin settings live in `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` | Everything the AI needs is at the file layer: the widget text and the frontmatter values. No separate database file |

The three field/button forms and the button-action list below are confirmed against the installed `main.js` (v1.5.1). Meta Bind has no `now()` and no `=`-prefixed grammar: a timestamp is an `updateMetadata` action with `evaluate: true` and a plain-JavaScript `value` (`data-model.md` §5). The `js` action runs a vault-root-relative file as-is (not an exported function) through the JS Engine companion, which also requires JavaScript to be enabled in Meta Bind's settings.

---

## 2. HOW IT WORKS

Meta Bind adds three things an AI authors in note text, all resolving against frontmatter:

- **Input fields** — `INPUT[type:bindTarget]` renders an editable widget (text, number, toggle, datePicker, timePicker, …) bound to a frontmatter property. Editing the widget writes the property; editing the property re-renders the widget.
- **View fields** — `VIEW[bindTarget]` renders a read-only / computed value from frontmatter (optionally through an expression), the display half of the same binding.
- **Buttons** — an inline `BUTTON[id]` or a ` ```meta-bind-button ` block runs an ordered list of **actions** when clicked. The action that matters most here is `updateMetadata`, which patches a frontmatter property (optionally evaluating an expression first); `inlineJS` / `js` run JavaScript (through JS Engine) for anything richer.

The **task timer** composes these: a *Start* button stamps `startTime` into the task note's frontmatter, an *End* button stamps `endTime`, and a `VIEW[…]` field or a Notion Bases formula column subtracts them into a total. Because both timestamps and the total live in frontmatter, the same task note is a row in a Notion Bases task database — the Bases Table/Board/Calendar views and the Meta Bind buttons operate the *same* file. The full recipe is `workflows.md` §1.

JS Engine runs code in a ` ```js-engine ` block (its return value renders in place) and injects a fixed context (`app`, `engine`, `component`, `container`, `context`, `obsidian`). Meta Bind's `js` action runs a vault file as-is with that context; metadata is read/written via the injected `app` (`app.fileManager.processFrontMatter`) or the Meta Bind API (`engine.getPlugin('obsidian-meta-bind-plugin').api`). See `data-model.md` §6.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The field syntax (`INPUT`/`VIEW`/`BUTTON`), bind-target forms, the button-action catalog with `updateMetadata`/`inlineJS`/`js` fields, and the JS Engine companion surface (execution context + the frontmatter read/write recipe) |
| [`workflows.md`](workflows.md) | Numbered file-layer recipes: the Notion-style task-timer build (Bases task DB + Start/End buttons + total), a bound input-field form, and a computed `VIEW` |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and recovery: button does nothing, expression not evaluated, frontmatter not updating, JS Engine not found |

The general file-layer operating model (locate data, edit data, never drive the UI) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md). The task-timer's database and calendar live in [`../notion-bases/notion-bases.md`](../notion-bases/notion-bases.md) — this reference set authors the buttons; Notion Bases owns the database schema, the formula column, and the Calendar view.

---

## 4. GUARDRAILS

- **Author the widget, never click it.** The AI writes `INPUT`/`VIEW`/`BUTTON` text and the frontmatter they bind to. The rendered interaction (a click that runs actions) happens in the live app; prove the write by reading the widget text and the resulting frontmatter, not the render.
- **Timestamps are plain JavaScript, and `js` runs a file as-is.** An evaluated `updateMetadata` `value` is a JavaScript expression (`new Date().toISOString()`), not a `now()`/`=` expression; a `js` action runs a vault-root-relative file as-is (not an exported function) and needs JavaScript enabled in Meta Bind's settings (`data-model.md` §5–§6). Don't invent a `=`-grammar or an export signature.
- **Quote note titles and bind targets that contain spaces.** Bind targets referencing another note (`file#prop`) follow the same quoting discipline as every other vault path.
- **Settings edits use backup-before-write.** `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` is edited only with a backup first, preserving unrelated keys; rendering behavior is in-app.
- **The timer is one feature, not the whole plugin.** Meta Bind is general-purpose (forms, inline buttons, embedded views). The Notion timer is the headline recipe, but do not describe Meta Bind as timer-only.
- **No plugin install or live-vault interaction happens from this reference set.** It documents the file shapes an already-installed plugin reads.
