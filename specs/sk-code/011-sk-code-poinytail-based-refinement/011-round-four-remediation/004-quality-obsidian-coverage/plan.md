---
title: "Implementation Plan: Phase 4: quality-obsidian-coverage"
description: "Give the sk-code-quality mode real Obsidian coverage by mapping Obsidian plugin targets to the four sk-code-obsidian quality checklists, then name sk-code-obsidian in the eight surface lists, bump the skill to 1.2.0.0 and add a changelog file. Every edit is one exact text replacement."
trigger_phrases:
  - "quality obsidian coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: quality-obsidian-coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown edits to one skill package, checked with Python 3, Node.js and bash tools. No code is written |
| **Framework** | None. The contracts are `.skilled/skills/sk-doc/SKILL.md` (router), `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` (skill package), `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` (README) and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` (changelog) |
| **Storage** | None. The compiled sk-code manifest and the leaf manifest are only checked |
| **Testing** | Three script tests, `validate_document.py`, `hvr_scan.py`, `package_skill.py --check --strict`, `verify_router_sync.cjs`, `verify_doc_claims.cjs`, `compiled-route-manifest.cjs freshness`, `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs`, `check-markdown-links.cjs` |

### Overview
The quality mode's Target-Path Checklist Map (`SKILL.md` lines 116 to 124) routes OpenCode and Webflow targets only, so the six `SKILL.md` and two README surface lists could not honestly name `sk-code-obsidian`. This phase first gives the mode real Obsidian coverage: four map rows that send Obsidian plugin targets to the four checklists `sk-code-obsidian` lists under its own `CODE_QUALITY` intent, plus the matching detection branch, loading row, resource domain, workflow step, envelope value, success criterion and reference links. Then it adds `sk-code-obsidian` to every surface list. A minor bump to 1.2.0.0 and a compact changelog file record the release. All 24 edits and the changelog text are final and quoted below.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place documentation edit of one skill package: 24 single-text replacements, one new changelog file, then freshness checks of the derived routing artifacts

### Key Components
- **What counts as an Obsidian target.** `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2 resolves the OBSIDIAN surface from repo-root markers: `manifest.json` carrying `minAppVersion`, `esbuild.config.mjs`, `from "obsidian"` imports and `.db-*` classes in `styles.css`, at precedence OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN. The new rows key on paths inside that plugin tree (`src/`, `tools/`, `styles.css`, `tools/screenshots/scenarios/`), and the new resource-domain line cites section 2 for the surface test.
- **Which checklists exist.** `ls .skilled/skills/sk-code/sk-code-obsidian/assets/` lists seven: `comment-banner-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`, `folder-docs-checklist.md`, `modal-coverage-checklist.md`, `screenshot-coverage-checklist.md` and `verification-checklist.md`. The packet's own router (`sk-code-obsidian/SKILL.md` section 2b) files four under `CODE_QUALITY` (comment-banner, folder-docs, db-class-rename, fixture-authoring), two under `IMPLEMENTATION` (screenshot-coverage, modal-coverage) and one under `VERIFICATION` (verification-checklist).
- **How the hub reaches this mode for Obsidian work.** `hub-router.json` bundles a surface packet behind the chosen workflow mode (`surfaceBundle`), and `sk-code-obsidian/SKILL.md` section 1 names `[sk-code-quality, sk-code-obsidian]` as a typical resolution. So the routing already lands here. What was missing is the checklist this mode loads once it is here.
- **Surface packets are alike.** `mode-registry.json` gives `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian` the same `packetKind: surface`, `backendKind: evidence-base` and read-only tool set. A list that names the first two as the surface skill can name the third in the same words.
- **Guards that read these files.** `verify_doc_claims.cjs` checks that backticked and linked paths in hub docs resolve, and skips `changelog/` folders. `verify_router_sync.cjs` parses the Python router block in `SKILL.md` lines 144 to 162, which no edit touches. The compiled manifest hashes only the hub-root `SKILL.md`, `hub-router.json` and `mode-registry.json` (`.skilled/bin/lib/compiled-route-manifest.cjs:436-438`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:54-58`), and the leaf manifest lists only `assets/` and `references/` leaves, so neither should move.

### Decisions
- **D1, minor bump to 1.2.0.0.** `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` section 3 gives minor for "New features, new bundled resources", and `sk-create-changelog/SKILL.md` section 4 gives minor for a "significant new feature". Obsidian target routing is a new capability of the mode. The packet's own 1.1.0.0 was minor for listing one script. The README `version:` moves with it. The changelog uses the compact shape, because the release has three reader-visible changes and is neither major nor breaking.
- **D2, four map rows, one per `CODE_QUALITY` checklist.** The brief asks for "an Obsidian row". The four checklists gate different targets (any source file, a folder crossing the paired-docs threshold, a `.db-*` rename, a screenshot fixture), so one row per target keeps the map path-keyed like its OpenCode rows. `screenshot-coverage-checklist.md` and `modal-coverage-checklist.md` stay out because the Obsidian packet files them under implementation, and `verification-checklist.md` stays out because it belongs to the verification hand-off this mode makes. The resource-domain line says so.
- **D3, the eight lists name `sk-code-obsidian` with the same wording.** Six `SKILL.md` lists use `` `sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian` `` and the README's Quick Start uses `` `sk-code-webflow`, `sk-code-opencode` or `sk-code-obsidian` ``. Round three left them out (its plan.md decision D2 and Known Limitation 3) because "the quality target-path map has no Obsidian row, and adding it would claim coverage the mode does not define". This plan answers that reason directly: tasks T010 to T019 add the coverage, and only then do T020 to T025 and T033 to T034 name the surface. The units run in that order.
- **D4, the envelope accepts `obsidian`.** `resolved_surface: <webflow | opencode | unknown>` gains `obsidian`. A run on an Obsidian target could not report its own surface otherwise. `schema_version: code-quality/v1` stays, because the change only widens the allowed values and `rg -n resolved_surface` outside `specs/` finds no consumer besides `SKILL.md` line 217.
- **D5, no hub edit.** The target-path map is prose inside this packet, not data in a hub file, and the hub's surface bundle already pairs this mode with `sk-code-obsidian`. So there is no handoff to child 003.

### Handoffs
- **None to another child.** Every edit is inside `.skilled/skills/sk-code/sk-code-quality/`.
- **Orchestrator** runs `sync-skills-hermes.cjs` in write mode to regenerate `.hermes/skills/sk-code-quality/SKILL.md` (task T035).
- **Orchestrator** re-mints the compiled sk-code route only if T048 finds it stale with no sibling hub file changed (task T036). The tree says it hashes hub-root files only, so the expected result is no re-mint.

### Data Flow
The hub detects OBSIDIAN from the plugin markers and bundles `sk-code-obsidian` behind this mode. This mode then reads its own Target-Path Checklist Map, finds the row for the target's path and loads that checklist from `../sk-code-obsidian/assets/`. The README repeats the routing for a human reader. No script, manifest or router block reads the new rows.

### Exact Text of the Edits
Every block below is final and quoted from the file as it stood on 2026-10-10. The Find text occurs exactly once in its file, both in the original and at the moment its unit runs. Line numbers are the original positions. The same edits, in the same order, are in `scratch/dispatch-units.json`, which `scratch/build-units.cjs` generated from `scratch/edits.txt` and checked for uniqueness by replaying every unit on copies.

**E1 (T010), `SKILL.md` line 5, minor version bump.** Find:

````text
version: 1.1.1.0
````

Replace with:

````text
version: 1.2.0.0
````

**E2 (T011), `SKILL.md` after line 28, Obsidian activation trigger.** Find:

````text
- Applying Webflow/frontend quality standards after implementation and before runtime verification.
````

Replace with:

````text
- Applying Webflow/frontend quality standards after implementation and before runtime verification.
- Applying the Obsidian plugin quality checklists from `sk-code-obsidian` after implementation, when the surface resolves to OBSIDIAN.
````

**E3 (T012), `SKILL.md` after line 68, Obsidian branch in the detection tree.** Find:

````text
    +- OPENCODE target    -> ../sk-code-opencode/assets/checklists/<target-checklist>.md
````

Replace with:

````text
    +- OPENCODE target    -> ../sk-code-opencode/assets/checklists/<target-checklist>.md
    +- OBSIDIAN target    -> ../sk-code-obsidian/assets/<target-checklist>.md
````

**E4 (T013), `SKILL.md` after line 90, Obsidian resource domain.** Find:

````text
- `../sk-code-opencode/assets/checklists/` contains OpenCode authoring checklists for skills, agents, commands, MCP servers, language files, and config; the spec-folder checklist is owned by `system-spec-kit`.
````

Replace with:

````text
- `../sk-code-opencode/assets/checklists/` contains OpenCode authoring checklists for skills, agents, commands, MCP servers, language files, and config; the spec-folder checklist is owned by `system-spec-kit`.
- `../sk-code-obsidian/assets/` holds the Obsidian plugin checklists this gate loads when `../shared/references/stack-detection.md` section 2 resolves the surface to OBSIDIAN: comment banners, folder docs, `.db-*` class renames and screenshot fixtures. Its verification checklist belongs to the verification hand-off, not to this gate.
````

**E5 (T014), `SKILL.md` before line 110, Obsidian loading-level row.** Find:

````text
| CONDITIONAL | Generated distribution artifacts or mirrored outputs changed | `scripts/check-dist-staleness.sh` |
````

Replace with:

````text
| CONDITIONAL | Obsidian plugin target (surface OBSIDIAN) | `../sk-code-obsidian/assets/comment-banner-checklist.md`, `../sk-code-obsidian/assets/folder-docs-checklist.md`, `../sk-code-obsidian/assets/db-class-rename-checklist.md`, `../sk-code-obsidian/assets/fixture-authoring-checklist.md` as applicable |
| CONDITIONAL | Generated distribution artifacts or mirrored outputs changed | `scripts/check-dist-staleness.sh` |
````

**E6 (T015), `SKILL.md` after line 124, four Obsidian rows in the Target-Path Checklist Map.** Find:

````text
| Webflow/frontend files | `assets/code-quality-checklist/overview-header-and-comments.md` | Check frontend style, maintainability, headers, comments, and platform expectations. |
````

Replace with:

````text
| Webflow/frontend files | `assets/code-quality-checklist/overview-header-and-comments.md` | Check frontend style, maintainability, headers, comments, and platform expectations. |
| Obsidian plugin source under `src/` or `tools/` | `../sk-code-obsidian/assets/comment-banner-checklist.md` | Check that a `MODULE:` banner or numbered section rule follows the target grammar where a file adopts it, and that no comment carries a spec, requirement, task or checklist id. |
| Obsidian plugin folder under `src/` or `tools/` that gains or loses source files | `../sk-code-obsidian/assets/folder-docs-checklist.md` | Check the paired `README.md` and `CODE.md` threshold in both directions. |
| Obsidian plugin `.db-*` class rename in `styles.css` or `src/` | `../sk-code-obsidian/assets/db-class-rename-checklist.md` | Check the rename map, the static and dynamic class sites, fixture parity and the render proof. |
| Obsidian plugin screenshot fixture under `tools/screenshots/scenarios/` | `../sk-code-obsidian/assets/fixture-authoring-checklist.md` | Check that the fixture names only real `.db-*` classes and passes the fixture guard test. |
````

**E7 (T016), `SKILL.md` line 184, workflow step 3 loads the Obsidian checklist.** Find:

````text
3. Load `assets/code-quality-checklist/overview-header-and-comments.md` before any completion claim, then load the target-path checklist from `../sk-code-opencode/assets/checklists/` when the target is OpenCode-owned.
````

Replace with:

````text
3. Load `assets/code-quality-checklist/overview-header-and-comments.md` before any completion claim, then load the target-path checklist from `../sk-code-opencode/assets/checklists/` when the target is OpenCode-owned, or from `../sk-code-obsidian/assets/` when the surface is OBSIDIAN.
````

**E8 (T017), `SKILL.md` line 217, envelope surface values.** Find:

````text
resolved_surface: <webflow | opencode | unknown>
````

Replace with:

````text
resolved_surface: <webflow | opencode | obsidian | unknown>
````

**E9 (T018), `SKILL.md` after line 269, Obsidian success criterion.** Find:

````text
- The correct `../sk-code-opencode/assets/checklists/*` authoring checklist was loaded for OpenCode targets.
````

Replace with:

````text
- The correct `../sk-code-opencode/assets/checklists/*` authoring checklist was loaded for OpenCode targets.
- The matching `../sk-code-obsidian/assets/*` checklist was loaded for Obsidian plugin targets.
````

**E10 (T019), `SKILL.md` after line 313, Obsidian checklist links.** Find:

````text
- [`assets/checklists/config-checklist.md`](../sk-code-opencode/assets/checklists/config-checklist.md) - JSON and JSONC config checklist.
````

Replace with:

````text
- [`assets/checklists/config-checklist.md`](../sk-code-opencode/assets/checklists/config-checklist.md) - JSON and JSONC config checklist.
- [`comment-banner-checklist.md`](../sk-code-obsidian/assets/comment-banner-checklist.md) - Obsidian plugin MODULE banner and section-comment checklist.
- [`folder-docs-checklist.md`](../sk-code-obsidian/assets/folder-docs-checklist.md) - Obsidian plugin folder-docs pairing checklist.
- [`db-class-rename-checklist.md`](../sk-code-obsidian/assets/db-class-rename-checklist.md) - Obsidian plugin `.db-*` class-rename checklist.
- [`fixture-authoring-checklist.md`](../sk-code-obsidian/assets/fixture-authoring-checklist.md) - Obsidian plugin screenshot fixture authoring checklist.
````

**E11 (T020), `SKILL.md` line 15, surface list.** Find:

````text
`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the surface skill (`sk-code-webflow` / `sk-code-opencode`) implements changes and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `sk-code-review`.
````

Replace with:

````text
`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the surface skill (`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`) implements changes and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `sk-code-review`.
````

**E12 (T021), `SKILL.md` line 36, surface list.** Find:

````text
- The user needs code written, files scaffolded, or behavior implemented. Use the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode`) and its implementation workflow.
````

Replace with:

````text
- The user needs code written, files scaffolded, or behavior implemented. Use the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`) and its implementation workflow.
````

**E13 (T022), `SKILL.md` line 47, surface list.** Find:

````text
- The surface skill (`sk-code-webflow` / `sk-code-opencode`) immediately before this gate, because implementation writes the files this mode checks.
````

Replace with:

````text
- The surface skill (`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`) immediately before this gate, because implementation writes the files this mode checks.
````

**E14 (T023), `SKILL.md` line 182, surface list.** Find:

````text
1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode`) unless the user explicitly asked for a standalone quality audit.
````

Replace with:

````text
1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`) unless the user explicitly asked for a standalone quality audit.
````

**E15 (T024), `SKILL.md` line 188, surface list.** Find:

````text
7. If a gate failure requires new files, broader implementation, or behavior design, hand back to the surface skill (`sk-code-webflow` / `sk-code-opencode`).
````

Replace with:

````text
7. If a gate failure requires new files, broader implementation, or behavior design, hand back to the surface skill (`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`).
````

**E16 (T025), `SKILL.md` line 280, surface list.** Find:

````text
- `sk-code-webflow` / `sk-code-opencode` implements or changes files before this gate runs, owns root-cause debugging, and gathers verification evidence via the implement → debug → verify workflow doctrine.
````

Replace with:

````text
- `sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian` implements or changes files before this gate runs, owns root-cause debugging, and gathers verification evidence via the implement → debug → verify workflow doctrine.
````

**E17 (T027), `README.md` line 11, minor version bump.** Find:

````text
version: 1.1.1.0
````

Replace with:

````text
version: 1.2.0.0
````

**E18 (T028), `README.md` line 26, Works on row.** Find:

````text
| **Works on** | Webflow frontend files and OpenCode skills, agents, commands, specs, MCP servers, scripts, config and language files |
````

Replace with:

````text
| **Works on** | Webflow frontend files, Obsidian plugin source and screenshot fixtures, and OpenCode skills, agents, commands, specs, MCP servers, scripts, config and language files |
````

**E19 (T029), `README.md` after line 52, Obsidian row in the checklist router.** Find:

````text
| **Language files and config** | applies the language-specific and config checklists |
````

Replace with:

````text
| **Language files and config** | applies the language-specific and config checklists |
| **Obsidian plugin files** | routes to the comment-banner, folder-docs, `.db-*` class-rename and fixture-authoring checklists that `sk-code-obsidian` owns |
````

**E20 (T030), `README.md` line 60, Obsidian checklist in Quick Start.** Find:

````text
**Step 2: Load the right checklist.** The mode always loads [`assets/code-quality-checklist/overview-header-and-comments.md`](./assets/code-quality-checklist/overview-header-and-comments.md). For `.skilled/` targets it also loads the matching checklist under [`../sk-code-opencode/assets/checklists/`](../sk-code-opencode/assets/checklists/).
````

Replace with:

````text
**Step 2: Load the right checklist.** The mode always loads [`assets/code-quality-checklist/overview-header-and-comments.md`](./assets/code-quality-checklist/overview-header-and-comments.md). For `.skilled/` targets it also loads the matching checklist under [`../sk-code-opencode/assets/checklists/`](../sk-code-opencode/assets/checklists/). For Obsidian plugin targets it loads the matching checklist under [`../sk-code-obsidian/assets/`](../sk-code-obsidian/assets/).
````

**E21 (T031), `README.md` line 88, Target-Path Routing prose.** Find:

````text
OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-opencode`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. Webflow frontend work uses the code quality checklist and the shared universal standards.
````

Replace with:

````text
OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-opencode`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. Webflow frontend work uses the code quality checklist and the shared universal standards. Obsidian plugin targets route to the four quality checklists under `sk-code-obsidian`, for comment banners, folder docs, `.db-*` class renames and screenshot fixtures.
````

**E22 (T032), `README.md` after line 131, Obsidian checklists in Related Documents.** Find:

````text
| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |
````

Replace with:

````text
| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |
| [`../sk-code-obsidian/assets/`](../sk-code-obsidian/assets/) | Obsidian plugin quality checklists for comment banners, folder docs, `.db-*` class renames and screenshot fixtures |
````

**E23 (T033), `README.md` line 58, surface list.** Find:

````text
**Step 1: Route after implementation.** Use this mode after the surface skill (`sk-code-webflow` or `sk-code-opencode`) has changed files and before the surface verification workflow (`workflow-verify.md`) collects final evidence.
````

Replace with:

````text
**Step 1: Route after implementation.** Use this mode after the surface skill (`sk-code-webflow`, `sk-code-opencode` or `sk-code-obsidian`) has changed files and before the surface verification workflow (`workflow-verify.md`) collects final evidence.
````

**E24 (T034), `README.md` line 107, surface list.** Find:

````text
| `sk-code-webflow` / `sk-code-opencode` | Surface skills that implement and change files, own root-cause debugging and gather verification evidence through the implement → debug → verify workflow doctrine |
````

Replace with:

````text
| `sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian` | Surface skills that implement and change files, own root-cause debugging and gather verification evidence through the implement → debug → verify workflow doctrine |
````

**E-CL (T026), new file `changelog/v1.2.0.0.md`.** Compact format, `version:` on line 11 after the five contract keys, as in `v1.1.1.0.md`. The exact bytes are saved at `scratch/units/v1.2.0.0.md.txt`:

````markdown
---
title: "sk-code-quality v1.2.0.0, The Quality Gate Covers Obsidian Plugin Work"
description: "The quality mode now routes Obsidian plugin targets to the four sk-code-obsidian quality checklists and names sk-code-obsidian wherever it lists the surfaces it serves."
trigger_phrases:
  - "sk-code-quality v1.2.0.0"
  - "sk-code-quality 1.2.0.0"
  - "obsidian plugin quality checklists"
  - "quality gate obsidian coverage"
importance_tier: "normal"
contextType: "general"
version: 1.2.0.0
---

# v1.2.0.0, The Quality Gate Covers Obsidian Plugin Work

The hub detects three code surfaces, but the quality mode only mapped checklists for Webflow and OpenCode work. An Obsidian plugin change reached the gate with nothing to load. This release maps Obsidian plugin targets to the checklists `sk-code-obsidian` already ships, then names that surface wherever the mode lists the surfaces it serves.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage` (Level 1)

&nbsp;

## What's New at a Glance

- **Obsidian targets have checklists.** The target-path map sends plugin source to the comment-banner checklist, a folder that crosses the source-file threshold to the folder-docs checklist, a `.db-*` class rename to the class-rename checklist and a screenshot fixture to the fixture-authoring checklist.
- **The surface lists name all three surfaces.** `SKILL.md` and the README now list `sk-code-obsidian` beside `sk-code-webflow` and `sk-code-opencode`.
- **The evidence envelope can report Obsidian.** Its `resolved_surface` field now accepts `obsidian`.

&nbsp;

## Upgrade

No migration required.
````

### Expected Diffs
Against the saved copies, `diff` of `SKILL.md` prints exactly these hunk headers: `5c5`, `15c15`, `28a29`, `36c37`, `47c48`, `68a70`, `90a93`, `109a113`, `124a129,132`, `182c190`, `184c192`, `188c196`, `217c225`, `269a278`, `280c289`, `313a323,326`. The README diff prints exactly `11c11`, `26c26`, `52a53`, `58c59`, `60c61`, `88c89`, `107c108`, `131a133`. Both were produced by replaying the units in order on copies on 2026-10-10.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

All values below were observed on 2026-10-10 in this worktree before any edit. Sibling builds can move the routing, link and Hermes numbers.

- **Script tests**: `bash $Q/scripts/ceiling-report.test.sh` (8 `PASS` lines, `All ceiling report test cases passed`), `bash $Q/scripts/check-comment-hygiene.test.sh` (22 `PASS` lines, `All comment hygiene test cases passed`) and `bash $Q/scripts/hooks/claude-posttooluse.test.sh` (`Post-edit adapter parse regression fixture passed`), each exit 0.
- **Validators**: `validate_document.py` on `SKILL.md`, on `README.md --type readme` and on `changelog/v1.1.1.0.md` each printed `VALID` and `Total issues: 0`. `package_skill.py --check --strict` printed `Result: PASS`. `check-frontmatter-versions.sh --skill sk-code` printed `[gate] 340 files | ok=337  skip-no-frontmatter=3`. `hvr_scan.py` printed `hard blockers:          14` for `SKILL.md` (existing em dashes and semicolons that this phase does not touch), and `hard blockers:          0` for `README.md` and `changelog/v1.1.1.0.md`.
- **Replay of the final text**: with every unit applied to copies inside a copy of the hub, `validate_document.py` printed `VALID` and `Total issues: 0` for `SKILL.md`, `README.md --type readme` and the new changelog. `hvr_scan.py` printed 14, 0 and 0 hard blockers. `package_skill.py --check --strict` printed `Result: PASS`. `verify_doc_claims.cjs --root <copy>` printed `doc-claims: 4/4 checks passed`. The em-dash and semicolon counts of `SKILL.md` did not change.
- **Routing**: `compiled-route-manifest.cjs freshness --hub sk-code` printed `"fresh": true` and hash `d55cc15d57f7a1ac47e9614242c8b71ebc97d9bad4f194a106f1f49072c7e78d`. `compiled-route-guard.cjs` printed `sk-code                     fresh`. `ci-leaf-manifest-freshness.cjs` ended `checked=14 fresh=14 failed=0` with `OK    sk-code  59ea33fd766514d568f793234145be7aa5ae90d9482669cf383eb3c6f237b441`. `verify_router_sync.cjs --checks 1a,1b,2,3,4` ended `router-sync: 5/5 checks passed`. `ci-skill-root-metadata.cjs` ended `checked=14 passed=14 failed=0 fixed=0`. `verify_doc_claims.cjs` ended `doc-claims: 4/4 checks passed`. All exit 0.
- **Links and Hermes**: `check-markdown-links.cjs` printed `7931 files, 14069 links checked, 0 broken`, and `sync-skills-hermes.cjs --check` printed `PASS: 70 Hermes skill copies in sync`.
- **Reproduction**: `grep -n 'sk-code-webflow' $Q/SKILL.md $Q/README.md` printed eight lines, `SKILL.md` 15, 36, 47, 182, 188 and 280 and `README.md` 58 and 107, and `grep -c 'sk-code-obsidian'` printed 0 for both files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The worked example `../../010-round-three-remediation/003-quality-mode/` supplies the command set reused here (validators, routing checks, scope snapshot, Hermes check).
- Node.js and Python 3. Every Python tool runs as `python3 -I`.
- Six sibling children build in parallel. None owns a file under `sk-code-quality/`. Child 003 edits hub files and `shared/references/stack-detection.md`, and child 005 edits `verify_doc_claims.cjs`. Either can move a routing or claim-check result for a reason this phase did not cause. The tasks say how to tell the cases apart.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the two modified files with `git restore .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md`.
- Delete the new file `.skilled/skills/sk-code/sk-code-quality/changelog/v1.2.0.0.md`. Nothing else refers to it.
<!-- /ANCHOR:rollback -->

---
