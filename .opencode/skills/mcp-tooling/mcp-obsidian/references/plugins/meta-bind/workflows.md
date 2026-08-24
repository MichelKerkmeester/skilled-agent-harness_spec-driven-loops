---
title: "Meta Bind Workflows"
description: "Numbered file-layer recipes for Meta Bind: the Notion-style start/stop task-timer build over a Notion Bases task database, a frontmatter-bound input form, and a computed VIEW field — every step authored in note text and frontmatter, never by driving the widget."
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Meta Bind Workflows

Each recipe authors widget text and frontmatter. None clicks a rendered widget — that is in-app. The timestamp expression and the `js`-action signature are confirmed against the installed `main.js` (v1.5.1) — see [`data-model.md`](data-model.md) §5–§6. JavaScript actions additionally require JavaScript to be enabled in Meta Bind's own settings.

## 1. OVERVIEW

The headline recipe is the **Notion-style task timer** (§2): Start/End buttons that stamp frontmatter timestamps over a Notion Bases task database, with a Bases formula column totalling elapsed time. Meta Bind supplies the buttons; Notion Bases supplies the database, the views, and the total column (see [`../notion-bases/notion-bases.md`](../notion-bases/notion-bases.md)). §3 and §4 cover the simpler bound-form and computed-value building blocks the timer is made of.

---

## 2. THE NOTION-STYLE TASK TIMER

**Goal:** reproduce Notion's Tasks database with **Start Timer / End Timer** buttons and a **Total Time** column, entirely at the file layer.

### Step 1 — the task note (a Bases row)

Each task is a `.md` file in the task database folder; its frontmatter carries the timer fields plus whatever columns the `_database.md` declares:

```yaml
---
title: Draft the report
status: in-progress
startTime:
endTime:
---
```

### Step 2 — the Start button

In the note body, stamp `startTime` when clicked:

````markdown
```meta-bind-button
label: Start Timer
style: primary
id: start-timer
actions:
  - type: updateMetadata
    bindTarget: startTime
    evaluate: true
    value: "new Date().toISOString()"
```
````

### Step 3 — the End button

Same shape, targeting `endTime`:

````markdown
```meta-bind-button
label: End Timer
style: destructive
id: end-timer
actions:
  - type: updateMetadata
    bindTarget: endTime
    evaluate: true
    value: "new Date().toISOString()"
```
````

> `evaluate: true` makes Meta Bind run `value` as a plain JavaScript expression, so `value: "new Date().toISOString()"` stamps the current time as an ISO string. Meta Bind has no `now()` function and no `=`-prefixed grammar. For a display format use JS `Date` methods (e.g. `new Date().toLocaleString()`) — there is no built-in formatter.

### Step 4 — the Total Time column (Notion Bases formula)

In the task database's `_database.md`, declare a **formula column** that subtracts `startTime` from `endTime` and formats the duration. Notion Bases owns formula columns and their function set — author this in the Bases schema, not in Meta Bind, and verify the exact formula key/function names against the installed Bases plugin (see the notion-bases `data-model.md`). The Table and Board views then show elapsed time per task; the **Calendar view** (keyed on `startTime` or `dueDate`, see `../notion-bases/workflows.md` §6a) shows tasks on a month grid.

### Step 5 — robust fallback (JS Engine)

For elapsed time, render it in the note with a `VIEW` backed by a `js-engine` block that reads `startTime`/`endTime` from the injected `context.metadata?.frontmatter` (or `app.metadataCache.getFileCache(file)?.frontmatter`) and prints the difference. If a button needs to write frontmatter from JavaScript, reach the Meta Bind API through JS Engine — `const mb = engine.getPlugin('obsidian-meta-bind-plugin').api; mb.updateMetadata(mb.parseBindTarget('endTime'), () => new Date().toISOString())` — which keeps Meta Bind's widgets in sync; a plain `js-engine` block with no Meta Bind routing can instead `await app.fileManager.processFrontMatter(file, fm => { … })`. Do not destructure the `mb` methods (they lose their `this` binding), and enable JavaScript in Meta Bind's settings first (`data-model.md` §6).

**Result:** the task note is simultaneously a clickable timer *and* a Notion Bases row — one file, two surfaces. Start/End write frontmatter; the Bases formula totals it; the Bases views (Table / Board / Calendar) present the whole task set the way Notion does.

---

## 3. A FRONTMATTER-BOUND INPUT FORM

Put editable fields in a note that read and write its frontmatter directly:

```markdown
Status:   `INPUT[text:status]`
Priority: `INPUT[number:priority]`
Done:     `INPUT[toggle:done]`
Due:      `INPUT[datePicker:dueDate]`
```

Editing any widget writes the matching frontmatter key; editing frontmatter re-renders the widget. This is the file-layer way to give a Bases row a Notion-like edit panel inside the note itself.

---

## 4. A COMPUTED VIEW FIELD

Render a read-only value derived from frontmatter:

```markdown
Elapsed: `VIEW[startTime]`
```

The plain form renders the bound value; the computed form evaluates a **mathjs** expression over bind targets in `{curly}` braces (e.g. `VIEW[{endTime} - {startTime}]`, with an optional `[math:target]` renderer). mathjs has no date functions by default, so for elapsed-time math either extend mathjs from a JS Engine startup script (`mb.mathJSImport({ … })`) or use the §2 Step 5 `js-engine` block (`data-model.md` §4).

---

## 5. VERIFICATION

- Read the note's frontmatter after a documented click sequence would run — the `startTime`/`endTime`/formula values are the proof, not the rendered button.
- Confirm the task note sits in the Bases database folder and its frontmatter carries every column the `_database.md` declares.
- A reload inside a running Obsidian is required to see the buttons and the Bases views render — that check belongs to the plugin-verification step, not this reference set.
