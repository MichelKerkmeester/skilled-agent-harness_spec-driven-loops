# Synthesis: JS Engine doc-improvement plan (fresh-reviewer pass)

> **Scope.** Fresh-eyes reranking of the `007-js-engine` research into an actionable, evidence-cited
> edit plan against the **shipped meta-bind reference tree**
> (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/*`). This document is the
> only write; no shipped doc is edited here. Every row names a target file and cites its evidence.

---

## 1. Verdict

The headline gap is real and correctly ranked: **JS Engine injects a fixed execution-context object
`{ app, engine, component, container, context, obsidian }` into every `js-engine` block and every
Meta Bind `js`/`inlineJS` action, and this is entirely undocumented in the shipped docs.** Without it
an AI cannot know that `app`, `context`, and `obsidian` are already in scope, so it cannot author any
script that reads or writes the task note's frontmatter — the task-timer's entire job. The shipped
docs are *thin, not wrong*: their two `engine.markdown` lines are correct for v0.3.6; they simply stop
short of the two facts that make a timer authorable (the context object, and the frontmatter
read/write path). A dedicated `references/plugins/js-engine/` tree is **not warranted now** — the
timer uses a thin slice that fits the existing meta-bind companion section.

**One cross-leg reconciliation is required before the application pass edits anything** (§5): the
meta-bind sibling research recommends a *different* metadata-write path (`mb.setMetadata` via
`engine.getPlugin(...).api`) into the *same* target sections. Both are valid and non-contradictory,
but the two legs must land **one** coherent recipe, not two dueling ones.

---

## 2. Prioritized edit table

Rank order: **P0** (timer is unauthorable without it) > **P1** (required fix, prevents the most likely
silent failure) > **P2** (accuracy / completeness). "Coord" flags overlap with the meta-bind sibling
leg — see §5.

| Pri | Target file · section | Change | Evidence (research + `main.js` v0.3.6) | Coord |
|-----|-----------------------|--------|----------------------------------------|-------|
| **P0** | `meta-bind/data-model.md` §6 (JS ENGINE COMPANION) | Add the **execution-context object** `{ app, engine, component, container, context, obsidian }` with a one-line role for each: `app`=Obsidian `App` gateway; `engine`=the API in §6; `component`=lifecycle owner; `container`=render `HTMLElement`; `context`=execution source (carries `context.metadata` cached frontmatter, `context.file`); `obsidian`=the `obsidian` module namespace. State that these are in scope with **no `import`/`require`**. | research §3 + §7 CONFIRMED. Context object-literal confirmed verbatim in `main.js` v0.3.6: `engine: e.engine ?? this.apiInstance, component: e.component, context: e.context, container: e.container, obsidian: l, app: this.apiInstance.app`. | — |
| **P0** | `meta-bind/data-model.md` §6 **and** `meta-bind/workflows.md` §2 Step 5 | Add the **frontmatter read/write recipe**. Read: `context.metadata?.frontmatter ?? {}` (pre-injected cache) or `app.metadataCache.getFileCache(file)?.frontmatter ?? {}`. Write (Obsidian-core, via the injected `app`): `await app.fileManager.processFrontMatter(file, fm => { fm.endTime = obsidian.moment().toISOString(); })`. State JS Engine ships **no** frontmatter-write wrapper of its own. | research §4 + §7 CONFIRMED. `metadataCache`/`getFileCache`/`frontmatter` present in `main.js`; `processFrontMatter` **absent** from the plugin bundle (confirmed-by-absence) → write path is Obsidian core reached only because JS Engine injects `app`. | **Coord — must reconcile with sibling `mb.setMetadata` path (§5.A). Do NOT ship two independent write recipes.** |
| **P1** | `meta-bind/troubleshooting.md` §2 (failure table) | Add a row: **"`js` action writes but frontmatter doesn't persist"** → the write wasn't `await`ed, or a non-core method was used. Fix: `await app.fileManager.processFrontMatter(...)`; there is no JS-Engine frontmatter writer. | research §4 (`processFrontMatter` is async, needs `await`) + R3. Prevents the most likely silent timer failure (lost `endTime`). | Coord — align wording with the sibling's chosen write path (§5.A). |
| **P2** | `meta-bind/data-model.md` §6 | **Confirm** the existing `engine.markdown.create()` / `createBuilder()` / `importJs()` lines are correct for **v0.3.6**, and add the timer-usable rest of the surface: `engine.execute()`, `engine.executeFile(path, {params})`, and the `MarkdownBuilder` methods (`createParagraph/Heading/CodeBlock/List/Table/Callout/BlockQuote`, `addText`, `createEl`, `toString`). | research §2 + §7 CONFIRMED. Identifiers confirmed in `main.js` v0.3.6 (`createBuilder(){return new qp(...)}`, `async executeFile(e,t)`, builder method names by identifier match). | Coord — sibling adds `engine.getPlugin(id)` to the same surface (§5.B); merge, don't duplicate the engine table. |
| **P2** | `meta-bind/data-model.md` §6 (and the §5 `VERIFY` note) | Downgrade the `params`-shape `VERIFY` to **partially confirmed**: `export function execute(params)` receives a validated params object carrying the execution context; flag the Meta-Bind-side merge order as the remaining open item owned by the meta-bind leg. | research §5 + §7 PARTIAL. `params:this.apiInstance.validators.engineExecutionParamsFile` confirmed in `main.js`; the exact Meta Bind-forwarded keys/merge order live in the Meta Bind bundle (out of this leg's scope). | **Coord — the sibling leg closes the sending side. Let it own the final `params` wording.** |
| **P2** | `meta-bind/meta-bind.md` §1/§2 companion note | Keep the JS Engine identity pin explicit: `id: js-engine`, `version: 0.3.6`, `mProjectsCode/obsidian-js-engine-plugin` (already partly present at `meta-bind.md:32`). Preserve the version pin so future audits re-verify against the installed build. | research §6.2 R6. Version/id confirmed from installed `manifest.json` (`version: 0.3.6`, `id: js-engine`, `minAppVersion: 1.4.0`). | — |

**Counts: P0 = 2, P1 = 1, P2 = 3** (6 edits across 4 shipped files: `data-model.md`, `workflows.md`,
`troubleshooting.md`, `meta-bind.md`).

---

## 3. VERIFY-flag resolution

| Item | Status | Basis |
|------|--------|-------|
| `engine` API surface (markdown `create`/`createBuilder` + builder methods, `importJs`, `execute`, `executeFile`, `lib`/`message`/`prompt`/`internal`) | **CONFIRMED** | Identifiers/fragments in installed `main.js` **v0.3.6** (research §2, §7). |
| Execution-context object `{ app, engine, component, container, context, obsidian }` | **CONFIRMED** | Context object-literal fragment verbatim in `main.js` **v0.3.6** (research §3, §7). |
| Frontmatter **read** path (`context.metadata.frontmatter` / `app.metadataCache.getFileCache`) | **CONFIRMED** | `metadataCache`/`getFileCache`/`frontmatter` + context `metadata` build in `main.js` v0.3.6 (research §4, §7). |
| Frontmatter **write** path (`app.fileManager.processFrontMatter`, Obsidian core via injected `app`; no JS-Engine wrapper) | **CONFIRMED** (incl. confirmed-by-absence) | `processFrontMatter` absent from the plugin bundle; `app` injected into context (research §4, §7). |
| Meta Bind `js`-action `params` **exact keys / merge order** | **PARTIAL** (residual VERIFY) | Sending side lives in the **Meta Bind** bundle (`obsidian-meta-bind-plugin`) — the meta-bind sibling leg's scope, not this leg's. Read needed keys off `params` (`params.app`, `params.context`) rather than assume a positional signature (research §5). |

---

## 4. Dedicated `js-engine` tree — recommendation

**Not warranted now.** Verified: no `references/plugins/js-engine/` directory exists today, and the
task-timer uses only a thin JS Engine slice (`markdown.create`, `importJs`, the injected `app`, and
`processFrontMatter`) that fits cleanly as the meta-bind **companion** section already established at
`data-model.md` §6 and `meta-bind.md` §2. Creating a full tree now would over-scope the migration's
documented need and split the timer's story across two references.

**Promote-later trigger:** create a dedicated tree only when a future workflow uses JS Engine
**independently of Meta Bind** — standalone `js-engine` dashboards, `engine.internal`, or the
module/import system. The right first file at that point is a single `js-engine.md` index capturing
research §2–§4. Until then, enrich the meta-bind companion per the P0–P2 edits above.

---

## 5. Cross-leg coordination (meta-bind sibling)

The meta-bind sibling (`006-meta-bind`) has an authored `research.md` but **no `synthesis.md` yet**.
Its research targets the *same* three sections this leg does, so the application pass must merge, not
double-edit. Two genuine overlaps and one contradiction to reconcile:

**A. Frontmatter/metadata write path — two mechanisms, not a conflict (RECONCILE).**
This leg (CONFIRMED, `main.js` v0.3.6): write via Obsidian core `app.fileManager.processFrontMatter`
through the injected `app`; *JS Engine* has no frontmatter writer of its own. The sibling (from
official `moritzjung.dev` docs, `006-meta-bind/research.md:110-139`): write via the *Meta Bind* API —
`const mb = engine.getPlugin('obsidian-meta-bind-plugin').api; mb.setMetadata(target, value)` /
`mb.updateMetadata(target, fn)` / `mb.getMetadata(target)`, with `mb.parseBindTarget(...)`. These are
**not contradictory**: `mb.*` is *Meta Bind's* API (reached via `engine.getPlugin`), so this leg's
statement "JS Engine exposes no frontmatter-write wrapper of its own" stays true. Recommended
reconciliation for the application pass: present **both** with a when-to-use — prefer `mb.setMetadata`
/ `mb.updateMetadata` for a Meta-Bind timer (keeps Meta Bind widgets/view-fields live and in sync,
Meta-Bind-native); use `app.fileManager.processFrontMatter` as the Obsidian-core direct write (works
without routing through Meta Bind's API, e.g. a plain `js-engine` block). Land **one** recipe block in
`data-model.md` §6 / `workflows.md` §2 Step 5 and **one** troubleshooting row, not two.

**B. `engine.getPlugin(id)` (CONFIRM before merging).**
The sibling relies on `engine.getPlugin('obsidian-meta-bind-plugin')` as an engine method. This leg's
CONFIRMED §2 surface (from `main.js`) did **not** enumerate `getPlugin` — it is **INFERRED** from the
sibling's official-docs read, not yet confirmed against the installed v0.3.6 bundle. The application
pass should confirm `getPlugin` exists in `main.js` v0.3.6 before documenting it as the primary
coupling; it is almost certainly present (it is the documented public API) but is unverified here.

**C. Timestamp expression (sibling owns; flag only).**
The sibling contradicts the shipped `"=now()"` pattern: official docs give
`value: "new Date().toISOString()"` with `evaluate: true` (plain JS, no `=` prefix)
(`006-meta-bind/research.md:179`). That is the **sending-side / expression-grammar** territory owned
by the meta-bind leg — this leg does not resolve it. Named here so the application pass does not treat
the two legs' Step-2/Step-3 button edits as independent.

---

## 6. CONFIRMED vs INFERRED (explicit separation)

**CONFIRMED (installed `main.js` v0.3.6, id `js-engine`, minified-identifier evidence):**
- The execution-context object `{ app, engine, component, container, context, obsidian }` and its
  object-literal shape.
- The `engine` API surface: `markdown.create`/`createBuilder` (+ builder methods), `importJs`,
  `execute`, `executeFile(path, {params})`, `lib`, `message`, `prompt`, `internal`.
- Frontmatter **read** via `context.metadata.frontmatter` / `app.metadataCache.getFileCache`.
- Frontmatter **write** via `app.fileManager.processFrontMatter` (Obsidian core), and the
  confirmed-by-absence that no `processFrontMatter` wrapper lives in the plugin bundle.
- `engine.executeFile` validates its `params` via `engineExecutionParamsFile`.
- Plugin identity: `id: js-engine`, `version: 0.3.6`, `minAppVersion: 1.4.0`.

**INFERRED / not confirmed against this leg's `main.js` read:**
- `engine.getPlugin(id)` as the Meta Bind coupling entry point — sourced from the sibling's official
  docs, unverified in v0.3.6 here (§5.B).
- The Meta Bind `ObsAPI` metadata surface (`setMetadata`/`getMetadata`/`updateMetadata`/
  `parseBindTarget`) — a *Meta Bind* API, sibling-scope, not read by this leg.
- The exact Meta Bind-forwarded `params` keys and merge order — PARTIAL, Meta Bind bundle scope (§3).
- `context.file`/`context.file.path` — plausible from the sibling's usage; this leg confirmed only
  `context.metadata`/`cachedMetadata`, not `context.file`, in `main.js`.

---

## 7. Method note

Fresh read of: this leg's `research/research.md` (231 lines, self-authored under the deep-loop append-
gateway blocker but API facts confirmed against installed `main.js` v0.3.6); the four shipped
`meta-bind/*` docs; the sibling `006-meta-bind/research/research.md`. No shipped doc was modified.
`references/plugins/js-engine/` verified absent. No `006-meta-bind/synthesis.md` exists yet, so the
overlaps in §5 are flagged against the sibling *research*, to be re-checked once its synthesis lands.
