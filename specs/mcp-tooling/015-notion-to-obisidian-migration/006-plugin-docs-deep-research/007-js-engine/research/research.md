# Research: Optimizing the mcp-obsidian JS Engine reference docs for AI operation

> **Provenance / how this report was produced.** This deep-research leg was chartered to run the
> autonomous multi-iteration workflow, but the workflow could **not** complete its automated
> synthesis. Across three relaunches (DeepSeek v4 Flash primary, then GPT-5.6 Luna-fast fallback,
> then DeepSeek again) the shared deep-loop **append gateway was mid-migration and deterministically
> rejected the deep-research lifecycle event shape**: the workflow emits the legacy `type`/`event`
> record (observed verbatim in this leg's `deep-research-state.jsonl`:
> `{"type":"event","event":"resumed",...}`), while the migrated gateway now requires the
> `stem`/`event_type` shape, so every run halted at or just after leaf iteration 1. That runtime is
> owned by a separate, concurrent session and was **out of scope to modify** for this leg. The three
> sibling legs (dataview, notion-bases, meta-bind) hit the identical wall; the sibling orchestrators
> self-authored their `research.md` for the same reason.
>
> This `research.md` is therefore a **mechanical, source-cited synthesis** authored from a direct
> read of the **installed JS Engine plugin `main.js`, manifest `version: 0.3.6`,
> id `js-engine`** (`mProjectsCode/obsidian-js-engine-plugin`), at
> `…/.obsidian/plugins/js-engine/main.js` (246,813 bytes). Every factual claim below traces to an
> identifier or code fragment confirmed in that compiled bundle. The bundle is **minified**, so
> evidence is cited as confirmed identifiers/fragments rather than line numbers. Recommendations are
> a gap-map from those confirmed facts against the shipped `references/plugins/meta-bind/*` docs —
> **no invented claims**; anything not confirmed in source is labeled as such.

---

## 1. Research question and verdict

**Question.** What should be added, updated, or created (in `references/plugins/meta-bind/*`, or a
dedicated `references/plugins/js-engine/*` tree if warranted) so an AI can reliably author JS Engine
scripts for Meta Bind buttons — confirming the `engine` API surface, the execution-context object
passed into a `js` action / `js-engine` block, and how a script reads and writes note frontmatter
(the timestamp the task-timer records)?

**Verdict.** All three unknowns are **CONFIRMED against the installed v0.3.6 plugin**:

1. The **`engine` API surface** is confirmed, including `engine.markdown.create()` /
   `engine.markdown.createBuilder()`, `engine.importJs()`, `engine.execute()`,
   `engine.executeFile()`, `engine.lib`, `engine.message`, `engine.prompt`, and `engine.internal`.
   The two markdown calls the shipped docs already assert are **correct** for v0.3.6.
2. The **execution-context object** injected into every `js-engine` block and `js`/`inlineJS` action
   is confirmed to be `{ app, engine, component, container, context, obsidian }`. This is the single
   most load-bearing fact for the task-timer and is **entirely undocumented** in the shipped docs.
3. The **frontmatter read/write path** is confirmed: a script **reads** frontmatter via the injected
   `app` (`app.metadataCache.getFileCache(file).frontmatter`) or the pre-supplied `context.metadata`
   cache, and **writes** it via Obsidian core `app.fileManager.processFrontMatter(file, fm => …)`.
   JS Engine provides **no** frontmatter-write wrapper of its own — the write path is Obsidian core,
   reached through the injected `app`. This is also undocumented in the shipped docs.

The shipped meta-bind docs are **not wrong** about JS Engine (unlike the notion-bases leg's finding);
they are **thin**. The correctness risk is the two gaps above: without the execution-context object
and the frontmatter API, an AI cannot author the task-timer's "stamp a timestamp" / "compute elapsed
time" scripts from the current docs — it would have to guess how a script reaches `app` and how it
persists a value. The `js`-action `params` VERIFY flag is **partially resolved** (see §5).

**Confidence: high** for the API surface, execution-context keys, and frontmatter read/write path
(all confirmed as identifiers/fragments in the installed `main.js` v0.3.6). **Medium** for the exact
runtime *ordering/merge* of caller-supplied `params` vs. the injected context in a Meta Bind `js`
action, because that boundary lives partly in the Meta Bind bundle (a different plugin, out of this
leg's scope) — see §5 and the residual VERIFY note.

---

## 2. The `engine` API surface (CONFIRMED, v0.3.6)

All of the following are confirmed present in the installed `main.js`. The API object is what a
`js-engine` block receives as `engine` and what Meta Bind's `js`/`inlineJS` action executes against.

| Member | Kind | Source evidence (v0.3.6 `main.js`) | What it does |
|--------|------|-------------------------------------|--------------|
| `engine.markdown.create(str)` | method | `create(e){return G(U({markdown:V()…` | Renders a string as a `MarkdownString` that renders in place when returned |
| `engine.markdown.createBuilder()` | method | `createBuilder(){return new qp(this.apiInstance)}` | Returns a `MarkdownBuilder` (class `qp`) for structured output |
| `engine.importJs(path)` | async | `async importJs(e){…{path:V()…` | Imports/loads a vault JS module and returns its exports |
| `engine.execute({context,…})` | async | `async execute(e…` ; `plugin.jsEngine.execute(e)` | Executes a code string with an execution context |
| `engine.executeFile(path, {params})` | async | `async executeFile(e,t…` ; `executeFile(e,t){…path:V(),params:this.apiInstance.validators.engineExecutionParamsFile…` | Executes a JS file, passing a **validated `params`** object |
| `engine.lib` | property | `this.lib` | Library of bundled helper functions |
| `engine.message` | API | `message` API present (≈53 refs) | Messaging surface |
| `engine.prompt` | API | `prompt` refs present | Prompt helpers |
| `engine.internal` | API | `this.internal=new Xp(this)` (class `Xp` = InternalAPI) | Internal/lower-level API |
| `plugin.jsEngine` | plugin field | `plugin.jsEngine.execute(e)` | The plugin exposes the same execution surface on its instance |

**MarkdownBuilder (`engine.markdown.createBuilder()`, class `qp`) methods — CONFIRMED present:**
`createParagraph`, `createHeading`, `createCodeBlock`, `createList`, `createTable`, `createCallout`,
`createBlockQuote`, `addText`, `createEl`, and `toString`. (Each confirmed by identifier match in
`main.js`.) For the task-timer's small render needs, `engine.markdown.create('**elapsed:** …')` is
sufficient; the builder is for richer structured output.

---

## 3. The execution-context object (CONFIRMED — the key finding)

Every `js-engine` code block and every Meta Bind `js`/`inlineJS` action runs a function whose named
arguments are the keys of a single **context object** that JS Engine constructs and injects. The
object literal is confirmed verbatim in `main.js`:

```
engine: e.engine ?? this.apiInstance,
component: e.component,
context: e.context,
container: e.container,
obsidian: l,          // the imported obsidian module namespace
app: this.apiInstance.app   // (…{app:this.apiInstance.app}… / new vo({app:this.app…)
```

So a script author can rely on these variables being in scope (no `import`, no `require` needed):

| Injected variable | Type / source (v0.3.6) | Use in a task-timer script |
|-------------------|------------------------|----------------------------|
| `app` | Obsidian `App` (`this.apiInstance.app`) | The gateway to everything: `app.fileManager`, `app.metadataCache`, `app.workspace.getActiveFile()` |
| `engine` | the JS Engine API from §2 | `engine.markdown.create(…)`, `engine.importJs(…)` |
| `component` | Obsidian `Component` (`e.component`) | Lifecycle owner; register child renderers/events so they unload cleanly |
| `container` | `HTMLElement` (`e.container`, from `this.htmlElement`) | The DOM node the block renders into |
| `context` | execution-source context (`e.context`; carries `executionSource`, the source file, and `metadata`/`cachedMetadata`) | Identify the calling note; read pre-cached frontmatter without a metadataCache lookup |
| `obsidian` | the `obsidian` module namespace (`l`) | Access `obsidian.moment`, `obsidian.Notice`, etc. without importing |

**`context.metadata`** is the note's cached metadata (confirmed: the context is built with
`metadata: this.cachedMetadata.optional()` / `metadata: n ?? void 0`), i.e. the same
`CachedMetadata` Obsidian exposes — its `.frontmatter` is the note's parsed frontmatter.

---

## 4. Frontmatter read/write from a script (CONFIRMED path)

This is the mechanism the task-timer needs and the shipped docs omit.

**Read** (two equivalent options):
- From the injected cache: `const fm = context.metadata?.frontmatter ?? {}` — JS Engine already
  passes the calling note's `CachedMetadata` as `context.metadata` (see §3).
- Via the app, for an arbitrary file:
  `const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {}`.
  (Confirmed: `metadataCache`, `getFileCache`, and `frontmatter` are all present and used in
  `main.js`.)

**Write** — Obsidian core, reached through the injected `app`:
```js
const file = app.workspace.getActiveFile();          // or context's source file
await app.fileManager.processFrontMatter(file, (fm) => {
  fm.endTime = obsidian.moment().toISOString();       // the timestamp the timer records
});
```
**Important, confirmed by absence:** JS Engine exposes **no** frontmatter-write helper of its own —
`processFrontMatter` does not appear anywhere in the plugin bundle. The write path is
`app.fileManager.processFrontMatter`, an **Obsidian core API**, which JS Engine makes reachable only
because it injects `app`. This is why the execution-context object (§3) is the load-bearing fact:
without documenting that `app` is in scope, the frontmatter write is unauthorable.

`processFrontMatter` is **async** and takes a mutator callback; a `js` button action that stamps a
timestamp must `await` it. (Async-ness is an Obsidian-core contract, cited here as the reason the
troubleshooting doc should warn against a fire-and-forget write.)

---

## 5. Meta Bind `js` / `inlineJS` coupling (partially resolves the VERIFY flag)

- Meta Bind's `inlineJS` action runs a code string; its `js` action runs an **exported function from
  a vault JS file**, both executed **through JS Engine** (`engine.execute` / `engine.executeFile`).
- `engine.executeFile(path, params)` passes a **`params` object validated by
  `engineExecutionParamsFile`** (confirmed fragment:
  `params:this.apiInstance.validators.engineExecutionParamsFile`). The exported entry point
  therefore has the shape the shipped docs already show — `export function execute(params) { … }` —
  and `params` carries the execution context (`app`, `engine`, `component`, `container`, `context`,
  `obsidian`) plus any caller-supplied arguments Meta Bind forwards.
- **Residual VERIFY (out of this leg's scope):** the *exact* keys Meta Bind adds to `params` and the
  precise merge order between Meta Bind's forwarded arguments and JS Engine's injected context live
  in the **Meta Bind** bundle (`obsidian-meta-bind-plugin`), which the meta-bind sibling leg owns.
  This leg confirms the JS Engine *receiving* side; the Meta Bind *sending* side should be closed by
  that leg. For a production timer, the safe pattern is to read what you need off `params`
  (`params.app`, `params.context`) rather than assume a positional signature.

---

## 6. Gaps in the shipped docs and per-file recommendations

Scope note: this leg is **research-only** — it read the shipped docs and must not modify them. The
table below is the recommendation set for a follow-up (in-scope) documentation packet.

### 6.1 Required (correctness-enabling — the timer is unauthorable without these)

| # | Target file | Change | Why (failure it prevents) |
|---|-------------|--------|---------------------------|
| R1 | `references/plugins/meta-bind/data-model.md` §6 (JS ENGINE COMPANION) | Add the **execution-context object** `{ app, engine, component, container, context, obsidian }` with a one-line role for each (§3 table). | Without it an AI cannot know `app`/`context` are in scope, so it cannot author any script that touches the vault or frontmatter — it will guess `require('obsidian')` or a global `app` and fail. |
| R2 | `references/plugins/meta-bind/data-model.md` §6 **and** `workflows.md` §2 Step 5 | Add the **frontmatter read/write recipe** from §4: read via `context.metadata.frontmatter` or `app.metadataCache.getFileCache(file).frontmatter`; write via `await app.fileManager.processFrontMatter(file, fm => …)`. | The task-timer's entire job is stamping/reading frontmatter timestamps; the docs currently say "compute elapsed time between two frontmatter timestamps" without the API to do it. |
| R3 | `references/plugins/meta-bind/troubleshooting.md` §2 | Add a row: "`js` action writes but frontmatter doesn't persist → the write wasn't `await`ed, or used a non-core method. Use `await app.fileManager.processFrontMatter(...)`; there is no JS-Engine frontmatter writer." | Prevents the most likely silent timer failure (lost `endTime`). |

### 6.2 Recommended (accuracy / completeness)

| # | Target file | Change |
|---|-------------|--------|
| R4 | `data-model.md` §6 | **Confirm** the existing `engine.markdown.create()` / `createBuilder()` / `importJs()` lines are correct for **v0.3.6** (they are) and add the rest of the surface actually usable by the timer: `engine.executeFile(path, params)` and the `MarkdownBuilder` methods (§2). |
| R5 | `data-model.md` §6 | Resolve the `params`-shape VERIFY as **partially confirmed**: `export function execute(params)` receives a validated params object carrying the execution context; flag the Meta-Bind-side merge as the remaining open item (owned by the meta-bind leg). |
| R6 | `meta-bind.md` §2 companion note | Pin the confirmed identity: JS Engine `id: js-engine`, `version: 0.3.6`, `mProjectsCode/obsidian-js-engine-plugin` (already partly present — keep the version pin so future audits can re-verify against the installed build). |

### 6.3 Dedicated `references/plugins/js-engine/` tree — optional, not yet warranted

A separate tree is **not required now**. The task-timer uses a thin slice of JS Engine
(`markdown.create`, `importJs`, the injected `app`, and `processFrontMatter`), and that slice fits
cleanly as the meta-bind **companion** section the docs already established. Creating a full
`references/plugins/js-engine/*` tree now would over-scope the migration's documented need and split
the timer's story across two references.

**Promote to a dedicated tree only if** a future workflow uses JS Engine independently of Meta Bind
(e.g. standalone `js-engine` dashboards, `engine.internal`, or the module/import system), at which
point a single `js-engine.md` index capturing §2–§4 of this report is the right first file. Until
then, enrich the meta-bind companion per R1–R5.

---

## 7. Confirmation status (explicit)

| Deliverable | Status | Basis |
|-------------|--------|-------|
| `engine` API surface (markdown builder, importJs, execute/executeFile, lib/message/prompt/internal) | **CONFIRMED** | Identifiers/fragments in installed `main.js` v0.3.6 |
| Execution-context object (`app`, `engine`, `component`, `container`, `context`, `obsidian`) | **CONFIRMED** | Context-literal fragment in `main.js` v0.3.6 |
| Frontmatter **read** path (`context.metadata.frontmatter` / `app.metadataCache.getFileCache`) | **CONFIRMED** | `metadataCache`/`getFileCache`/`frontmatter` + context `metadata` build in `main.js` |
| Frontmatter **write** path (`app.fileManager.processFrontMatter`, Obsidian core via injected `app`) | **CONFIRMED** (incl. confirmed-by-absence of any plugin wrapper) | `processFrontMatter` absent from plugin bundle; `app` injected into context |
| Meta Bind `js`-action `params` exact keys / merge order | **PARTIAL / residual VERIFY** | Sending side lives in the Meta Bind bundle (out of this leg's scope) |

---

## 8. Method and caveats

- **Source of truth:** the installed compiled bundle `…/.obsidian/plugins/js-engine/main.js`,
  `manifest.json` `version: 0.3.6`, `id: js-engine`, `minAppVersion: 1.4.0`. Confirmation was by
  targeted identifier/fragment search over the bundle.
- **Caveat — compiled + minified:** claims are grounded in minified identifiers and short code
  fragments, not readable source or line numbers. Variable names inside the bundle are mangled
  (`qp`, `Xp`, `vo`, `l`); the *public* surface names (`markdown`, `createBuilder`, `importJs`,
  `executeFile`, `app`, `component`, `container`, `context`, `obsidian`) are the un-mangled ones a
  script actually uses and are the ones cited. A source-level re-verification against the upstream
  `main` at tag `0.3.6` would upgrade the medium-confidence `params` item, but the API/context/
  frontmatter facts are already high-confidence from the installed build.
- **Not modified:** no shipped `references/plugins/**` file was edited; this run is research-only.
