---
name: sk-code-obsidian
description: "Read-only Obsidian-plugin design-system and source-convention evidence for the Note Database plugin."
allowed-tools: [Read, Bash, Grep, Glob]
version: 0.1.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: note-database, obsidian-note-database, obsidian-plugin, itemview, fileview, workspaceleaf, manifest.json, versions.json, esbuild.config.mjs, vitest, eslint-plugin-obsidianmd, chart.js, styles.css, db-class-grammar, single-stylesheet, screenshot-harness, playwright-core, module-banner, box-drawing-sections, folder-docs, kebab-case, database-view, view-renderer -->
<!-- Owns: Obsidian Note Database plugin / obsidian-note-database / note-database plugin id / src/views / src/data / tools/screenshots / styles.css .db-* grammar / plugin source-tree conventions / source-folder README and CODE guidance. Does NOT own: routing (parent sk-code hub), code implementation lifecycle (workflow modes), plugin behavior changes (frozen — evidence only). -->

# sk-code-obsidian Surface — Note Database Plugin Evidence

Read-only evidence for code work on the **Note Database** Obsidian plugin (plugin id `note-database`,
package `obsidian-note-database`). The shipped surface is a TypeScript plugin bundled with esbuild to
`main.js`, tested with vitest, and linted with eslint plus `eslint-plugin-obsidianmd`; it is not
desktop-only. When the hub bundles this surface, a code workflow gains the plugin's Obsidian API
boundary, its single-stylesheet `.db-*` class grammar, the hand-fixture screenshot harness, the real
verification-gate baseline, and the source-tree conventions this packet documents honestly — including
which ones are target-state and not yet adopted in the shipped tree.

---

## 1. WHEN THE HUB BUNDLES THIS

- The task's CWD or changed/target files sit under the Obsidian Plugin repository tree — markers are
  `manifest.json` carrying `minAppVersion`, `esbuild.config.mjs`, `from "obsidian"` imports, and
  `.db-*` classes in `styles.css`. The hub's surface detection resolves **OBSIDIAN**, at precedence
  `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`.
- The active workflow phase needs the plugin's design-system evidence: the single-stylesheet ownership
  model, the `.db-*` class grammar and its orphan/fixture split, or the browser-based (but
  fixture-driven, not live-renderer) verification gate.
- The active workflow needs the shipped or target Obsidian source grammar: the view-renderer family
  under `src/views/`, the `src/data/` pipeline, kebab-case naming, `MODULE:` banners, or paired
  source-folder documentation.
- This surface never owns edits, tests, or verification itself. The bundled workflow mode does the
  work (for example, `sk-code-quality` or `sk-code-review`) and this packet supplies the evidence it
  must honor. A typical resolution is `[sk-code-quality, sk-code-obsidian]` or
  `[sk-code-review, sk-code-obsidian]`.

This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only**. It never routes as a
primary and mutates nothing. It supplies evidence while the acting workflow applies it.

---

## 2. REFERENCE MAP

| Reference | What it carries |
| --- | --- |
| [`references/obsidian-plugin-api.md`](references/obsidian-plugin-api.md) | The Obsidian API surface `main.ts` consumes (`Plugin`, `FileView`, `WorkspaceLeaf`, `TFile`, `MarkdownRenderer`, and peers), `manifest.json`'s `minAppVersion`/`isDesktopOnly` contract, and the `onload`/`onunload` boundary. |
| [`references/stylesheet-ownership.md`](references/stylesheet-ownership.md) | `styles.css` is the one stylesheet — 18,931 lines, measured — with no component-scoped styles anywhere in the tree. Where a rule belongs, and that splitting the file is an operator decision this packet documents but does not make. |
| [`references/db-class-naming.md`](references/db-class-naming.md) | The `.db-*` grammar: 1,196 distinct classes measured, 769 orphaned (referenced by no fixture), 427 referenced by fixtures. What an edit or rename must not silently orphan. |
| [`references/screenshot-harness.md`](references/screenshot-harness.md) | `scenarios.mjs`'s registration contract, `verify.mjs`'s source-hash freshness gate (180 entries measured), the hand-fixture-vs-real-renderer distinction, and `theme.css`/`runtime-vars.css` standing in for what Obsidian supplies at runtime. |
| [`references/verification.md`](references/verification.md) | The gate command set and measured baseline: `tsc --noEmit` (clean), `build` (clean, no tracked diff), `vitest run` (386 passing across 49 files), `screenshots:verify` (180 entries), and `lint` (115 known problems — recorded baseline, not a target). |
| [`references/comment-grammar.md`](references/comment-grammar.md) | The target `MODULE:` banner and numbered box-drawing convention — 0 of 249 files carry one today — distinguished from the pre-existing Chinese-language CSS property cheat sheet in `styles.css`, plus the repository rule against spec/requirement/task/checklist ids in comments. |
| [`references/folder-docs.md`](references/folder-docs.md) | The `README.md`/`CODE.md` pairing threshold (three or more direct source files, or any child folder that itself contains source), mirrored from `sk-code-mobile-cli`, and the folders that owe docs today. |
| [`references/view-renderer-architecture.md`](references/view-renderer-architecture.md) | The `src/views/*Renderer.ts` family (Table, Board, Gallery, List, Calendar, Timeline, Chart), the `src/data/` pipeline (`DataSource`, `RowPipeline`), and `main.ts` as the single `Plugin` entry registering both `DatabaseView` and `DatabaseFileDashboardView`. |
| [`references/skill-reference-integrity.md`](references/skill-reference-integrity.md) | The cross-repo drift guard that resolves every plugin path this surface names (expects `broken : 0`), and why a clean run is only meaningful because the guard also rejects a counter-example. |
| [`references/workflow-implement.md`](references/workflow-implement.md) · [`workflow-debug.md`](references/workflow-debug.md) · [`workflow-verify.md`](references/workflow-verify.md) | The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`). |

Checklists (`assets/`) and the source-gates runner (`scripts/run-source-gates.sh`) are pulled on demand
by the active workflow phase — not part of the initial evidence slice. See §4.

---

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of `sk-code-obsidian`'s own intent → reference/asset
routing, consumed by the skill-benchmark router-replay. Keep it in sync with the parent hub union.

```python
# code-obsidian owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-obsidian/) and the sibling surface maps plus the
# parent-owned universal/shared tier. A drift guard enforces that equality.
DEFAULT_RESOURCE = [
    "references/obsidian-plugin-api.md",
    "references/comment-grammar.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":  {"weight": 1, "keywords": ["view renderer", "add renderer", "table renderer", "database view", "implement", "build", "new column type", "row pipeline", "screenshot scenario", "modal"]},
    "CODE_QUALITY":    {"weight": 1, "keywords": ["module banner", "section banner", "folder docs", "folder-doc", "code.md", "naming", "rename", "fixture", "quality gate", "lint", "kebab-case", "comment grammar"]},
    "DEBUGGING":       {"weight": 1, "keywords": ["debug", "broken", "regression", "wrong render", "empty state bug", "pipeline diagnostics"]},
    "VERIFICATION":    {"weight": 1, "keywords": ["verify", "tsc --noEmit", "vitest", "screenshots:verify", "completion claim", "gate baseline"]},
    "STACK_STANDARDS": {"weight": 1, "keywords": ["obsidian api", "itemview", "fileview", "workspaceleaf", "manifest.json", "esbuild", ".db-", "styles.css", "single stylesheet", "isdesktoponly"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/view-renderer-architecture.md",
        "references/data-layer.md",
        "references/db-class-naming.md",
        "references/stylesheet-ownership.md",
        "references/screenshot-harness.md",
        "assets/fixture-authoring-checklist.md",
        "assets/screenshot-coverage-checklist.md",
        "assets/modal-coverage-checklist.md",
    ],
    "CODE_QUALITY": [
        "references/comment-grammar.md",
        "references/folder-docs.md",
        "references/db-class-naming.md",
        "references/stylesheet-ownership.md",
        "references/standards/code-standards.md",
        "assets/comment-banner-checklist.md",
        "assets/folder-docs-checklist.md",
        "assets/db-class-rename-checklist.md",
        "assets/fixture-authoring-checklist.md",
    ],
    "DEBUGGING": [
        "references/view-renderer-architecture.md",
        "references/mobile-and-touch.md",
        "references/verification.md",
    ],
    "VERIFICATION": [
        "references/verification.md",
        "references/screenshot-harness.md",
        "references/release/release-verification.md",
        "assets/verification-checklist.md",
    ],
    "STACK_STANDARDS": [
        "references/obsidian-plugin-api.md",
        "references/stylesheet-ownership.md",
        "references/db-class-naming.md",
        "references/screenshot-harness.md",
        "references/standards/platform-support.md",
    ],
}
```

---

## 3. SURFACE STANDARDS (the non-negotiables)

These are measured facts about how this plugin proves correctness. A workflow bundling this surface
MUST honor them:

- **Never invent a `.db-*` class.** `src/views/screenshot-fixtures.test.ts` walks every class named by a
  fixture and fails any that appears in neither `styles.css` nor `src/`. A capture of an invented class
  photographs unstyled markup while looking like a successful screenshot.
- **A capture succeeding is not proof.** `npm run screenshots:verify` only checks that a capture's
  sources have not changed since it was taken; it does not check what the PNG shows. A capture can
  succeed and still photograph an empty box. Look at the changed PNG.
- **Captures are fixture markup, not the real renderers.** `tools/screenshots/` renders hand-written
  fixture markup against the shipped `styles.css` in headless Chrome via `playwright-core`; the real
  renderers need a live Obsidian `App`, vault, and metadata cache that the harness does not construct.
  Markup drift shows up as a stale screenshot, not a capture error. `theme.css` and `runtime-vars.css`
  stand in for what Obsidian supplies at runtime — a surface that looks wrong in a capture may be a gap
  in those stand-ins rather than a plugin defect.
- **Phone captures need the `is-phone` body class.** Obsidian marks phone layouts with it, and a large
  part of the responsive CSS keys off it; without the class a narrow viewport is only a cramped desktop.
- **The verification gate is real and partly red.** `npx tsc --noEmit`, `npm run build`, and
  `npx vitest run` (386 passing across 49 files) must stay clean, and `npm run screenshots:verify` must
  stay at its current entry count (180) or grow with new scenarios. `npm run lint` carries a **known
  baseline of 115 problems** (100 errors, 15 warnings) — record it, never imply it is clean, and never
  claim a change reduced it without rerunning the count.
- **`styles.css` is the one stylesheet.** There are no component-scoped styles anywhere in this plugin;
  every `.db-*` rule lives in that single file, 18,931 lines, 1,196 distinct classes measured, of which
  769 are referenced by no fixture.
- **Six recorded P0/P1 items and roughly 145 unphotographed surfaces are evidence, not a backlog this
  surface clears.** They are named in `specs/public/HANDOVER.md` in the plugin repository; a bundled
  workflow honors them as known state, never silently "fixes" them as a side effect of an unrelated
  change.
- **Never put a spec path, requirement id, task id, or checklist id in a code comment.** Record the
  durable reason a thing is the way it is instead (`AGENTS.md`, plugin repository root).

---

## 3b. SOURCE TREE CONVENTIONS (the shipped grammar)

This section states the plugin's real, measured tree first, then the target conventions a later phase
adopts — each labeled honestly, because most of them are not shipped yet.

### The real, shipped tree (current state)

- **`src/data/`** (128 `.ts` files) holds models, query, formulas, and filters — for example
  `DataSource.ts`, `RowPipeline.ts`, `ColumnTypes.ts`, `ComputedEvaluator.ts`, `Aggregate.ts`.
- **`src/views/`** (91 `.ts` files) holds renderers — the `*Renderer.ts` family covers every view type:
  `TableRenderer.ts`, `BoardRenderer.ts`, `GalleryRenderer.ts`, `ListRenderer.ts`, `CalendarRenderer.ts`,
  `CalendarTimelineRenderer.ts`, and `ChartRenderer.ts`.
- **`src/views/modals/`** (17 `.ts` files) holds every modal dialog — `AddDatabaseModal.ts`,
  `FormulaModal.ts`, `CreatePropertyModal.ts`, `DeleteDatabaseModal.ts`, `StatusOptionsModal.ts`, and
  twelve more. All 17 are unphotographed today; the surface inventory that fed the screenshot harness
  used a non-recursing `ls src/views/*.ts`, which never reached this folder.
- **`main.ts`** is the single `Plugin` entry point. `NoteDatabasePlugin extends Plugin`, registers
  `DatabaseView` (`extends FileView`) and `DatabaseFileDashboardView` (`extends DatabaseView`) against
  their `WorkspaceLeaf` view types, and reads `manifest.json`'s `minAppVersion`/`isDesktopOnly` contract
  (`isDesktopOnly: false` — nothing here may assume a desktop-only API).
- **Tests are co-located** as `*.test.ts` (49 files, 386 passing assertions across them), not held in a
  separate mirror tree, except for `src/__tests__/` and `src/data/__tests__/`.
- **Naming today is PascalCase-dominant**: 232 PascalCase filenames against 16 kebab-case, with a
  `textLinkScheme` camelCase outlier and one `_shared` underscore folder. No scanner enforces either
  form yet.
- **No folder carries a `README.md` or `CODE.md`.** Zero exist across the tree today.
- **No file opens with a `MODULE:` banner or a numbered box-drawing section.** Zero of 249 source files
  carry one; four contain some box-drawing rule for other reasons. `styles.css` itself opens with a
  Chinese-language CSS-property cheat sheet (312 CJK comment lines measured) and 65 `===` banners — a
  pre-existing convention, not the target grammar below.

### The target conventions (not yet adopted — say so plainly)

- **Kebab-case filenames** across `src/` and `tools/`, replacing the PascalCase-dominant tree above. A
  manifest-driven rename executes this in a later phase; this packet documents the target, not a
  completed migration.
- **A `MODULE:` banner plus numbered, upper-case box-drawing sections** at the top of every source file,
  in the same style `sk-code-mobile-cli` documents for its own stack — applied here once a later phase
  lands it, not present in the shipped tree today.
- **Paired `README.md`/`CODE.md` folder documents** at the three-or-more-direct-source-files (or any
  child source folder) threshold, mirrored from `sk-code-mobile-cli`'s own folder-doc rule. Measured
  against the current tree, these folders owe both documents: `src`, `src/data`, `src/views`,
  `src/views/modals`, `tools`, `tools/screenshots`, `tools/screenshots/scenarios`. These owe a
  `README.md` only, under the smaller-folder rule: `src/__tests__`, `src/data/__tests__`.
- **Numbered box-drawing section grammar in `styles.css`**, replacing or supplementing the existing
  CJK cheat-sheet preamble, over all 18,931 lines — an operator decision on whether the file stays one
  section-annotated file or is split, since a split changes the load order the tests and the capture
  harness depend on.

---

## 4. ASSETS (on-demand)

- Renderer-implementation pre-flight checklist — `assets/renderer-implementation-checklist.md`
- Comment-grammar adoption checklist — `assets/comment-grammar-checklist.md`
- Folder-docs pairing checklist — `assets/folder-docs-checklist.md`
- Debugging checklist for view/pipeline regressions — `assets/debug-checklist.md`
- Verification-gate checklist — `assets/verification-checklist.md`
- Source-gates runner — `scripts/run-source-gates.sh` in this packet's `scripts/` directory wraps the
  plugin repository's naming, comment, and folder-doc scanners as one PASS/FAIL gate; run it from the
  plugin repo root once those scanners exist.

Assets are pulled on demand by the active workflow phase. They are not part of the initial evidence
slice.

---

## 5. RULES

### ✅ ALWAYS

- Follow the parent hub's selected workflow mode and apply this surface's standards as read-only
  evidence.
- Stay within the declared read-only tool surface: `Read`, `Bash`, `Grep`, and `Glob`.
- Check `styles.css` and `src/` before citing or proposing any `.db-*` class name.
- Prove a completion claim with the real gate commands — `tsc --noEmit`, `build`, `vitest run`,
  `screenshots:verify` — and open a changed screenshot PNG rather than trusting its byte count.
- State plainly which source convention in §3b is shipped and which is target-state before applying it.

### ❌ NEVER

- Never act as a separate advisor identity or route as a primary.
- Never invent a `.db-*` class not already present in `styles.css` or `src/`.
- Never load resources outside this packet directory.
- Never carry a packet-level `graph-metadata.json` or `description.json` — either is a `NESTED_IDENTITY`
  violation at this hub.
- Never claim the plugin's target source conventions are adopted when the measured tree still shows the
  pre-adoption baseline.
- Never treat the six recorded P0/P1 items or the unphotographed surfaces named in
  `specs/public/HANDOVER.md` as fixed by this surface.

### ⚠️ ESCALATE IF

- A requested edit would require inventing a class absent from `styles.css` and `src/`.
- A change touches `src/views/modals/` (17 files, all unphotographed) with no scenario added to
  `tools/screenshots/scenarios.mjs` in the same change.
- A capture command exits clean but the rendered PNG looks empty or wrong before checking whether
  `theme.css` or `runtime-vars.css` is missing a stand-in.
- A rename or refactor would invalidate the 180-entry screenshot manifest without a follow-up
  `npm run screenshots` regeneration in the same change.
- `npm run lint`'s problem count moves and the change did not intend to touch lint state.

---

## 6. INTEGRATION POINTS

- **Input:** requests routed to `sk-code` whose surface detects as OBSIDIAN — CWD or changed/target
  files resolving under the Obsidian Plugin repository tree, using a resolved-realpath gate rather than
  a literal path match, since that repository symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and
  `.devin` back to this hub. The hub bundles this surface behind the chosen workflow mode.
- **Output:** the Obsidian API boundary, the single-stylesheet `.db-*` grammar, the screenshot-fixture
  harness contract, and the measured verification gate the workflow applies to `src/`, `tools/`, and
  `styles.css`.
- **Reference integrity:** from the plugin repo root, run
  `node tools/naming/scan-skill-references.mjs`. It resolves every plugin path this surface names and
  rejects a counter-example that must never resolve. The expected result is `broken : 0` with
  `counter-example rejected : yes`; either failing exits 1.
- **Source gates:** `bash scripts/run-source-gates.sh` from the plugin repo root runs the naming,
  comment-grammar, folder-doc and reference-integrity guards as one PASS/FAIL gate.
- **Related:** `../sk-code-webflow`, `../sk-code-opencode`, and `../sk-code-mobile-cli` (sibling
  surfaces), `../../shared/` (the shared implement → debug → verify doctrine), `system-spec-kit` (spec
  folders), and `sk-git` (worktrees and commits).
