---
title: "Meta Bind Troubleshooting"
description: "Failure modes and file-layer recovery for Meta Bind: button does nothing, timestamp expression not evaluated, frontmatter not updating, JS Engine not found, and the task-timer/Bases integration pitfalls."
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Meta Bind Troubleshooting

File-layer failure modes and recovery. Everything here is diagnosed and fixed by reading/editing widget text and frontmatter; the render is confirmed only after a reload in the live app.

## 1. OVERVIEW

Most Meta Bind failures are one of four things: a malformed `meta-bind-button` block, a bind target that names a property that does not exist, a JavaScript action written wrong (or JavaScript not enabled in Meta Bind's settings), or the JS Engine companion being missing. The Total-Time column is a Notion Bases formula, not a Meta Bind field, so an empty total is a Bases problem. The failure table (§2) maps each symptom to the file-layer fix; §3 covers escalation.

---

## 2. FAILURE MODES

| What you see | Why | Fix |
| --- | --- | --- |
| Button renders but clicking does nothing | The `meta-bind-button` block has no `action`/`actions`, an unknown action `type`, or a malformed YAML list | Re-read the block; confirm it uses `action:` (single) or `actions:` (list), each item has a valid `type` from the action catalog (`data-model.md` §5), and the YAML indentation is correct |
| Inline `BUTTON[id]` shows nothing | No `meta-bind-button` block with that `id` exists in the note (or it is not `hidden`-reusable) | Add a block with a matching `id`; set `hidden: true` on the definition block if only the inline button should render |
| Timestamp written literally instead of a real date | The action ran **without** `evaluate: true`, so `value` was stored as a raw string; or `value` used Meta Bind's non-existent `=now()`/`=` grammar | Set `evaluate: true` **and** use a plain JavaScript `value` — `"new Date().toISOString()"`. Meta Bind has no `now()` and no `=` prefix; with `evaluate: true` the `value` runs as JavaScript (`data-model.md` §5) |
| Frontmatter property not updating | The `bindTarget` names a property that does not exist / is misspelled, or points at the wrong note (`file#prop`) | Confirm the bind-target form (`data-model.md` §3); create the frontmatter key first; quote paths/keys containing spaces |
| Input widget shows but edits don't persist | The bind target resolves to a read-only view context, or a property-type mismatch | Confirm you used `INPUT[...]` (writable) not `VIEW[...]` (read-only), and that the frontmatter value type matches the input type |
| `js-engine` block / `js` action errors or renders nothing | JS Engine missing/disabled, **JavaScript not enabled in Meta Bind settings**, the file path is wrong, an `mb` API method was destructured (loses `this`), or `engine.setMetadata` was used instead of `engine.getPlugin('obsidian-meta-bind-plugin').api` | Enable `js-engine`; enable JavaScript in Settings → Meta Bind; check the `js` file path (vault-root-relative); reach metadata via `const mb = engine.getPlugin('obsidian-meta-bind-plugin').api` and call `mb.method()` without destructuring (`data-model.md` §6) |
| `js` action writes but frontmatter doesn't persist | The write wasn't `await`ed, or a non-core method was used | `await app.fileManager.processFrontMatter(file, fm => { … })` — it is async; or use the Meta Bind `mb.updateMetadata` API. JS Engine ships no frontmatter writer of its own (`data-model.md` §6) |
| Total-Time column empty in the Bases view | The total is a **Notion Bases** formula column, not a Meta Bind field — the formula, its key spelling, or the referenced `startTime`/`endTime` columns are wrong | Fix it in the task database's `_database.md` (see the notion-bases reference), not in the Meta Bind button; verify the formula function names against the installed Bases plugin |
| Timer works but the task doesn't appear in the database view | The task note is not inside the Bases database folder, or its frontmatter is missing a declared column | Move the note into the database folder; add every column the `_database.md` declares to the note's frontmatter |

---

## 3. ESCALATION

- Timestamp actions are plain JavaScript with `evaluate: true` (`data-model.md` §5); if a write still fails, drive it through the JS Engine path (`workflows.md` §2 Step 5) — `app.fileManager.processFrontMatter` or the Meta Bind `mb` API — and confirm JavaScript is enabled in Meta Bind's settings.
- Settings corruption: restore `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` from the backup taken before any settings edit.
- Rendering-only issues (styling, widget not appearing after a correct edit) require a live-app reload; that is the plugin-verification step, outside this reference set.
