---
title: "Meta Bind Data Model"
description: "The Meta Bind file-layer data model: INPUT/VIEW/BUTTON syntax, bind-target forms, the meta-bind-button action catalog (updateMetadata, inlineJS, js, command, input, sleep and more), and the JS Engine companion surface — with the two VERIFY items an AI must confirm before writing a production timer."
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Meta Bind Data Model

Everything Meta Bind operates is either **widget text in a note body** or the **frontmatter it binds to**. This document is the shape of both. The general operating model is in [`../plugin-operation-logic.md`](../plugin-operation-logic.md).

## 1. OVERVIEW

Meta Bind adds three authorable things, all resolving against frontmatter: `INPUT[…]` editable fields, `VIEW[…]` read-only/computed fields, and `meta-bind-button` blocks whose `actions` patch frontmatter (and delegate to the JS Engine companion for real computation). The field/button forms and the button-action catalog below are confirmed from the plugin docs and the installed `main.js` (v1.5.1). Meta Bind has **no** `now()` function and no `=`-prefixed expression language: a timestamp is written by an `updateMetadata` action with `evaluate: true` and a plain-JavaScript `value` (§5). JavaScript actions (`js`, `inlineJS`) run through the JS Engine companion (§6) and require JavaScript to be enabled in Meta Bind's own settings.

---

## 2. INPUT FIELDS

**Syntax:** `INPUT[type:bindTarget]` — renders an editable widget bound two-way to a frontmatter property.

| Input `type` | Renders | Typical frontmatter value |
| --- | --- | --- |
| `text` | single-line text box | string |
| `number` | numeric input | number |
| `toggle` | on/off switch | boolean |
| `datePicker` | date picker | ISO date string |
| `timePicker` | time picker | time string |

Meta Bind ships many more input types: `date`, `dateTime`, `time`, `editor`, `select`, `multiSelect`, `inlineSelect`, `list`, `listSuggester`, `inlineList`, `inlineListSuggester`, `suggester`, `imageSuggester`, `imageListSuggester`, `slider`, `progressBar`, `textArea`. A type takes arguments in parentheses: `INPUT[type(arg1, arg2):bindTarget]` — e.g. `INPUT[inlineSelect(option(a), option(b)):choice]`.

**Example** — bind a toggle and a date to this note's frontmatter:

```markdown
Done: `INPUT[toggle:done]`
Due:  `INPUT[datePicker:dueDate]`
```

---

## 3. BIND TARGETS

A bind target names the property a widget reads/writes.

| Form | Meaning |
| --- | --- |
| `propName` | a property in **this note's** frontmatter |
| `scope['prop name']` | a property whose name contains spaces/special chars |
| `file#propName` | a property in **another note's** frontmatter (path before `#`) |
| `memory^propName` | an in-memory-only value — not persisted to frontmatter; good for transient state |

Quote note paths that contain spaces, exactly as everywhere else in this mode.

---

## 4. VIEW FIELDS

**Syntax:** `VIEW[bindTarget]` — renders a read-only value from frontmatter. Meta Bind also supports a computed form that evaluates a **mathjs** expression over bind targets written in `{curly}` braces: `VIEW[{a} * {b}]`, optionally saving to a target and choosing a renderer with `VIEW[{a}*{b}][math:c]` (renderer types `math` / `text` / `link` / `image`). mathjs has **no date functions** by default — for date math, extend it from a JS Engine startup script (`mb.mathJSImport({ … })`), not an in-note block. A view field recomputes only while the note is open, so a closed source note breaks cross-note compute.

---

## 5. BUTTONS

**Inline:** `BUTTON[buttonId]` — renders a button that runs the block with that `id`.

**Block:**

````markdown
```meta-bind-button
label: Start Timer
style: primary
id: start-timer
hidden: false
actions:
  - type: updateMetadata
    bindTarget: startTime
    evaluate: true
    value: "new Date().toISOString()"
```
````

| Block field | Meaning |
| --- | --- |
| `label` | button text |
| `style` | visual style (`default`, `primary`, `destructive`, `plain`, …) |
| `id` | id an inline `BUTTON[id]` can reference; also lets the block be hidden and reused |
| `hidden` | `true` renders nothing but keeps the `id` callable from an inline `BUTTON[id]` |
| `class` | CSS class(es) |
| `action` **or** `actions` | one action object, or an ordered list of them — **mutually exclusive**, using both in one button is an error |

### Button action catalog

| `type` | Key fields | What it does |
| --- | --- | --- |
| `updateMetadata` | `bindTarget`, `value`, `evaluate` | Writes `value` into the `bindTarget` frontmatter property. With `evaluate: true`, `value` is a **plain JavaScript expression** (the current value is available as `x`; other properties via `getMetadata(bindTarget)`) — there is no `=` prefix and no `now()` |
| `inlineJS` | `code` | Runs inline JavaScript (via JS Engine) |
| `js` / `runJavaScript` | `file`, `args?` | Runs a vault JS file **as-is** (not a module export) with a global `context`; `file` is relative to the vault root. Interface: `{ type: 'js', file, args? }` |
| `command` | `command` | Runs an Obsidian command by id |
| `input` | `str` | Inserts a string at the cursor |
| `sleep` | `ms` | Pauses between actions |
| `createNote` / `templaterCreateNote` | note options | Creates a note (optionally via Templater) |
| `open` | `link` | Opens a file or link |
| `insertIntoNote` / `replaceInNote` / `regexpReplaceInNote` | line/content fields | Edits the note body |

The catalog is confirmed against the installed `main.js` (v1.5.1). Two former `VERIFY` items are now resolved:

- **The timestamp expression is plain JavaScript.** Meta Bind has no `now()` and no `=`-prefixed language. An `updateMetadata` action with `evaluate: true` runs its `value` as a JavaScript expression (confirmed in `main.js`: the value is handed to the JS Engine with the current value bound to `x` and `getMetadata` available). Write a timestamp as `value: "new Date().toISOString()"`; for a display format, use JS `Date` methods — Meta Bind ships no formatting helper.
- **The `js` action runs a file as-is, not an exported function.** `{ type: 'js', file, args? }` where `file` is resolved relative to the vault root and executes with a global `context` (§6). It does **not** call an exported function.

---

## 6. JS ENGINE COMPANION

JS Engine (`js-engine`, v0.3.6) runs code in a fenced ` ```js-engine ` block; the block's **return value renders in place**. It is also what executes Meta Bind's `js` / `inlineJS` button actions.

### Execution context (injected into every block and js/inlineJS action)

JS Engine injects a fixed context object — no `import`/`require` needed:

| Name | What it is |
| --- | --- |
| `app` | the Obsidian `App` (gateway to `vault`, `metadataCache`, `fileManager`, workspace) |
| `engine` | the JS Engine API below |
| `component` | the lifecycle owner (for `mount`/`unmount`) |
| `container` | the render `HTMLElement` |
| `context` | the execution source — carries `context.metadata` (cached frontmatter) and `context.file` |
| `obsidian` | the `obsidian` module namespace |

### The `engine` API

- `engine.markdown.create(str)` — render a string as markdown
- `engine.markdown.createBuilder()` — a `MarkdownBuilder` (`createParagraph`/`createHeading`/`createCodeBlock`/`createList`/`createTable`/`createCallout`/`createBlockQuote`, `addText`, `createEl`, `toString`)
- `await engine.importJs('file.js')` — load a vault JS file as a module (its `export`s)
- `engine.execute(...)` / `await engine.executeFile(path, { params })` — run inline code / a vault file
- `engine.getPlugin(id)` — reach another plugin's API (used for the Meta Bind coupling below)

**Minimal block:**

````markdown
```js-engine
return engine.markdown.create('**Hello**');
```
````

### Reading and writing frontmatter (one recipe)

**Read** the note's frontmatter from the injected cache, or from the metadata cache for an arbitrary file:

```javascript
const fm = context.metadata?.frontmatter ?? {};
const fm2 = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
```

**Write** it one of two complementary ways — pick by context, never mix two writers in one action:

- **Meta Bind API (preferred inside a Meta Bind timer)** — keeps Meta Bind's own widgets and view fields live and in sync:

  ```javascript
  const mb = engine.getPlugin('obsidian-meta-bind-plugin').api;
  const target = mb.parseBindTarget('endTime');
  mb.updateMetadata(target, () => new Date().toISOString());
  // mb.setMetadata(target, value) and mb.getMetadata(target) are the read/write pair
  ```

  Do **not** destructure the API methods (`const { setMetadata } = mb`) — they lose their `this` binding and throw. Always call them as `mb.method()`, and never `engine.setMetadata` (there is no such method).

- **Obsidian core (for a plain `js-engine` block, no Meta Bind routing)** — reach the injected `app`; JS Engine ships no frontmatter writer of its own:

  ```javascript
  await app.fileManager.processFrontMatter(file, fm => {
    fm.endTime = new Date().toISOString();
  });
  ```

  `processFrontMatter` is async — always `await` it, or the write is lost.

### Prerequisites for `js` / `inlineJS`

1. JS Engine installed and enabled.
2. **JavaScript enabled in Meta Bind's own settings** (Settings → Meta Bind → Enable JavaScript) — a separate toggle from JS Engine.

A `js` action runs its `file` (vault-root-relative) as-is with the `context` above; its `args` arrive on `context.args`. A `js-engine` block that `importJs`es a module file instead uses that module's `export`s — the two are different execution modes; do not conflate them. For the timer, JS Engine's job is small: compute elapsed time between two frontmatter timestamps for a `VIEW`, or stamp a precise timestamp a plain `updateMetadata` expression can't.

---

## 7. SETTINGS FILE

`.obsidian/plugins/obsidian-meta-bind-plugin/data.json` holds plugin settings. Edit it only with backup-before-write, preserving unrelated keys; rendering behavior is in-app.
