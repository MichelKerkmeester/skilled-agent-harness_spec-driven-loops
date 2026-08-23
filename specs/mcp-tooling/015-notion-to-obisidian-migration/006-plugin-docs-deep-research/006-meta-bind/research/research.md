# Research: Optimizing the mcp-obsidian Meta Bind reference docs for AI operation

> **Synthesis Provenance:** The deep-research loop completed its investigation (2 iterations,
> convergence 0.9, 21 findings) but its automated `research.md` writeback was blocked by a
> deep-loop runtime bug — the shared append-event gateway (`append-mode-event.cjs`) is mid-migration
> and deterministically rejects the workflow's state records (FAIL around the iteration-3 reducer);
> that runtime is scope-locked to a concurrent session and no executor switch fixes it. This file is
> therefore a mechanical reduction of the loop's own completed iteration artifacts
> (`iterations/iteration-001.md`, `iterations/iteration-002.md`) and `findings-registry.json`. No
> claims were invented beyond what those artifacts and their cited sources establish.

## Scope and outcome

One deep-research investigation (2 substantive iterations, convergence 0.9) into what should be
added, updated, or created in `references/plugins/meta-bind/*` so an AI can drive the Meta Bind
plugin reliably at the file layer, with emphasis on the Notion-style start/stop task-timer buttons.

Primary source throughout is the plugin author's official documentation site
(`moritzjung.dev/obsidian-meta-bind-plugin-docs`) and the JS Engine docs
(`moritzjung.dev/obsidian-js-engine-plugin-docs`), cross-referenced against the current shipped
reference docs. Source coverage: 13 official-docs references, 2 GitHub, 6 supporting.

Both VERIFY-flagged unknowns are **RESOLVED**. A material correctness bug in the current reference
docs was found in the process: the documented `=now()` timestamp expression is wrong for Meta Bind.

---

## VERIFY resolution 1 — now()-style timestamp expression grammar: RESOLVED

**Answer:** Meta Bind has no `=now()` function and no `=`-prefixed expression language. A button
writes a timestamp into frontmatter using the `updateMetadata` action with `evaluate: true`, where
the `value` field is a **plain JavaScript expression**.

Official wording:

> "If `evaluate` is set to `true`, the value is treated as a JavaScript expression and evaluated.
> The current value of the property is available in the expression as `x`. Other properties can be
> referenced using `getMetadata(bindTarget)`."

Correct forms:

- `value: "new Date().toISOString()"` — stamp the current timestamp
- `value: "x + 1"` — increment the current value (`x` = current property value)
- `value: "getMetadata('otherProp')"` — read another property

Constraints:

- The `=now()` / `=now().format(...)` patterns in the current reference docs are **incorrect** —
  they are a Dataview convention mistakenly applied to Meta Bind. There is no `now()` in Meta Bind;
  plain JavaScript `Date` is used.
- `evaluate: true` requires JavaScript to be enabled in Meta Bind settings.
- For a specific display format (e.g. `YYYY-MM-DD HH:mm`), use JavaScript `Date` methods
  (`toISOString()`, `toLocaleString()`, or manual formatting) inside the expression — Meta Bind
  provides no formatting helper of its own.

Source: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/updatemetadata/

---

## VERIFY resolution 2 — the `js` inline-button action signature: RESOLVED

**Answer:** The `js` ("Run JavaScript File") button action has this exact interface:

```typescript
interface JSButtonAction {
    type: 'js';
    file: string;                  // path to the JS file, relative to VAULT ROOT
    args?: Record<string, unknown>; // optional arguments passed to the script
}
```

Script-side contract — the file executes as-is (not a module export), with a `context` object
available:

- `context.args` — the `args` object from the button config (e.g. `context.args.greeting`)
- `context.buttonConfig` — the full button configuration (read-only)
- `context.buttonContext` — a `ButtonContext` (see below)

Companion action — inline JavaScript (no separate file):

```typescript
interface InlineJSButtonAction {
    type: 'inlineJS';
    code: string;                  // the code to run; YAML multiline strings supported
}
```

Prerequisites for both `js` and `inlineJS`:

1. The **JS Engine** plugin (`mProjectsCode/obsidian-js-engine-plugin`) must be installed and enabled.
2. JavaScript must be explicitly enabled in Meta Bind settings (Settings → Meta Bind → Enable JavaScript).

`ButtonContext` shape available at `context.buttonContext`:

```typescript
interface ButtonContext {
    isInGroup: boolean;                 // part of a button group
    isInline: boolean;                  // inline BUTTON[id] vs a code block
    position: undefined | LinePosition; // { lineStart, lineEnd } location in the note
}
```

Sources:
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/runjavascript/
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/buttonactions/inlinejs/
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/interfaces/buttoncontext/

---

## How `js`/`inlineJS` couple to JS Engine (metadata read/write from a script): RESOLVED

The JS Engine `engine` global does **not** expose `setMetadata`/`getMetadata` directly. The coupling
runs through `engine.getPlugin()`:

```javascript
// Inside a JS Engine code block, startup script, or a js/inlineJS action:
const mb = engine.getPlugin('obsidian-meta-bind-plugin')?.api;
if (!mb) { /* Meta Bind or JS Engine not loaded — bail */ }

const target = mb.parseBindTarget('property', context.file.path);
mb.setMetadata(target, 'some value');
const current = mb.getMetadata(target);
```

`engine.getPlugin(pluginId).api` returns Meta Bind's `ObsAPI` class, which exposes the metadata
surface:

- `setMetadata(bindTarget, value)` — write a property into Meta Bind's metadata cache
- `getMetadata(bindTarget)` — read a property (falls back to Obsidian's metadata cache)
- `updateMetadata(bindTarget, updateFn)` — update via `(current) => next`
- `subscribeToMetadata(bindTarget, lifecycleHook, callback)` — watch changes (needs lifecycle mgmt)
- `parseBindTarget(declaration, filePath, scope?)` — parse `"property"` into a `BindTargetDeclaration`
- `createBindTarget(storageType, storagePath, property, listenToChildren)` — build a target programmatically

Relevant `engine` (JS Engine `Engine` class) methods: `getPlugin(id)`, `execute(params)`,
`openExecutionStatsModal(exec)`, `activeExecutions`, plus `engine.markdown` / `engine.importJs()`.

**Critical gotcha:** `ObsAPI` methods must not be destructured into standalone functions — they lose
their `this` binding and throw. Always call as `mb.methodName()`.

Sources:
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/api/
- https://moritzjung.dev/obsidian-meta-bind-plugin-docs/api/classes/obsapi/
- https://moritzjung.dev/obsidian-js-engine-plugin-docs/api/classes/engine/

---

## Confirmed input-field, button-block, and view-field syntax

**Input fields** — `INPUT[type:bindTarget]` inline, or a ` ```meta-bind ` code block.
- Arguments: `INPUT[type(arg1, arg2):bindTarget]`, e.g. `INPUT[inlineSelect(option(a), option(b)):rating]`.
- Types beyond the basic set already in the ref docs (`toggle/text/number/datePicker/timePicker`):
  `date`, `dateTime`, `editor`, `imageListSuggester`, `imageSuggester`, `inlineList`,
  `inlineListSuggester`, `inlineSelect`, `list`, `listSuggester`, `multiSelect`, `progressBar`,
  `select`, `slider`, `suggester`, `textArea`, `time`.
- Bind-target forms: `propName` (this note), `scope['prop name']` (spaces), `file#propName`
  (another note), `memory^propName` (in-memory only, not persisted).
  Source: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/inputfields/

**Button blocks** — ` ```meta-bind-button ` with YAML; inline as `BUTTON[id]` or `BUTTON[id1, id2]`.
- `action` (single) and `actions` (array) are **mutually exclusive** — using both is an error.
- Fields: `label` (req), `style` (req: `default|primary|destructive|plain`), and optional `icon`
  (lucide), `class`, `cssStyle`, `backgroundImage`, `tooltip`, `id`, `hidden`.
  Source: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/

**View fields** — computation uses **mathjs**, not JavaScript.
- `VIEW[bindTarget]`, `VIEW[content][viewFieldType]` (default type `math`),
  `VIEW[{bindTarget} * 2]` (bind targets in `{curly}` brackets),
  `VIEW[{a} * {b}][math:c]` (compute and save into target `c`). Types: `math`, `text`, `link`, `image`.
- JS View Fields ( ` ```meta-bind-js-view ` ) require JS Engine and are **disabled by default**.
  Source: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/viewfields/

---

## Missing workflows and gotchas (gaps vs current reference docs)

| Gap | Current ref docs | Reality (official docs) |
|-----|------------------|--------------------------|
| Timestamp expression | `value: "=now()"` (`=` prefix) | `value: "new Date().toISOString()"` with `evaluate: true` — plain JS, no `=` |
| `action` vs `actions` | Shown without a note | **Mutually exclusive**; only one allowed |
| JS prerequisite | Mentions JS Engine only | JavaScript must be explicitly enabled in Meta Bind settings |
| View-field liveness | Not mentioned | View fields only update while the note is open; a closed source note breaks cross-note computation |
| Circular dependencies | Not mentioned | Meta Bind detects and prevents circular view-field dependencies |
| JS View Fields | Not mentioned | Disabled by default (security); must be enabled in settings |
| `memory^` storage | Not mentioned | `memory^propName` is in-memory only, not persisted — good for transient values |
| Lifecycle management | Not mentioned | Programmatic API objects need `mount()`/`unmount()` or `wrapInMDRC()` to avoid leaks |
| API method binding | Not mentioned | `ObsAPI` methods must not be destructured; call as `mb.method()` |
| `ButtonContext` fields | Not mentioned | `isInGroup`, `isInline`, `position` are available to `js`/`inlineJS` |
| MathJS date functions | Implied usable | MathJS has no date functions by default; extend via a JS Engine **startup script** + `mb.mathJSImport({...})` |

MathJS extension pattern (for date/custom functions in view fields):

```javascript
// A JS Engine STARTUP script (not an in-note js-engine block — that risks timing problems):
const mb = engine.getPlugin('obsidian-meta-bind-plugin').api;
mb.mathJSImport({ clamp: (v,min,max) => Math.min(Math.max(min,v),max), foo: 42 });
// then in a note: VIEW[clamp({num}, 0, 10)]   VIEW[foo + 10]
```
Source: https://moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/custommathjs/

---

## Corrected task-timer recipe (Notion-style start/stop)

Start button — stamp the start time:

```meta-bind-button
label: Start
style: primary
action:
  type: updateMetadata
  bindTarget: startedAt
  evaluate: true
  value: "new Date().toISOString()"
```

Stop button — stamp the stop time (a second `updateMetadata` for elapsed can be added as an
`actions:` array, or computed in a `js` action that reads both via `mb.getMetadata`):

```meta-bind-button
label: Stop
style: destructive
action:
  type: updateMetadata
  bindTarget: stoppedAt
  evaluate: true
  value: "new Date().toISOString()"
```

For elapsed-time computation, prefer a `js`/`inlineJS` action using
`engine.getPlugin('obsidian-meta-bind-plugin').api` to read `startedAt`/`stoppedAt` and write the
difference — this is more reliable than a mathjs view field, which has no date support and only
updates while the note is open.

---

## Recommended concrete changes to `references/plugins/meta-bind/*`

Required (correctness):

1. **Replace every `=now()` / `=now().format(...)` example** with `updateMetadata` +
   `evaluate: true` + `value: "new Date().toISOString()"` (plain JavaScript). Remove any claim that
   Meta Bind has a `now()` function or `=`-prefixed expression language. (`data-model.md`, `workflows.md`)
2. **Document the `js`/`inlineJS` action interfaces** precisely: `{type:'js', file, args?}` (file is
   relative to vault root), `{type:'inlineJS', code}`, the `context` object (`args`, `buttonConfig`,
   `buttonContext`), and the two prerequisites (JS Engine installed + JavaScript enabled in settings).
3. **Document the JS Engine coupling**: metadata read/write from a script goes through
   `engine.getPlugin('obsidian-meta-bind-plugin').api`, not `engine.setMetadata`. List the `ObsAPI`
   methods and the "don't destructure methods" gotcha.

Recommended (completeness / reliability):

4. Add the corrected task-timer recipe above as the canonical worked example.
5. Note `action` vs `actions` mutual exclusivity in the button reference.
6. Add the gotchas table: view-field liveness (open-note-only), circular-dependency protection,
   JS View Fields disabled by default, `memory^` in-memory storage, lifecycle `mount/unmount`.
7. Complete the input-field type list and the `INPUT[type(args):target]` argument syntax; document
   the four bind-target forms (`propName`, `scope['prop name']`, `file#propName`, `memory^propName`).
8. Add the MathJS limitation and the startup-script `mb.mathJSImport({...})` extension pattern for
   any date/custom-function needs in view fields.

---

## Confidence, limits, and provenance

- Confidence: high. Both VERIFY unknowns resolved from the plugin author's own reference/API pages,
  with consistent cross-referencing and no contradictory evidence in iteration 2.
- Not directly inspected: the installed compiled `main.js`. The official docs (maintained by the
  plugin author, `mProjectsCode`) were used as the canonical source; the compiled bundle was not
  parsed. A quick confirmation against the installed `main.js` for the exact `updateMetadata`
  `evaluate` handling and the `js` action `file`-resolution base would fully close the loop before
  editing the shipped docs.
- The GitHub `docs/` folder path 404s; docs live only at the external site above. The example vault
  exists but its file paths differ from naive guesses.

## Provenance note (how this file was produced)

The deep-research loop completed its investigation (iterations `iterations/iteration-001.md` and
`iterations/iteration-002.md`; 21 findings in `findings-registry.json`; convergence 0.9) but a
deep-loop runtime bug in the append-event gateway (`append-mode-event.cjs` rejecting the workflow's
state-append events) blocked the workflow's own automated `research.md` writeback across three run
attempts and two executors (DeepSeek v4 Flash and Luna-fast). This `research.md` was therefore
consolidated by the orchestrator directly from the loop's own completed iteration artifacts and
findings registry — no new claims were introduced beyond what those artifacts and their cited
sources establish.
