---
title: "Implementation Summary: Phase 009 — Apply plugin-docs research recommendations"
description: "Applied the seven 006 synthesis edit tables to the shipped mcp-obsidian docs: all P0 correctness rows across five plugins plus the full P1/P2 additive content for advanced-canvas, meta-bind, notion-bases (P1x8), dataview (P1x15/P2x3), and claudian (P1-7/9/10/11 + P2-12), each correctness-critical row confirmed against the installed plugin main.js, every changed doc validating 0 issues. Only two SKIP-by-instruction dataview VERIFY rows and optional notion-bases splits/version bumps remain deferred."
trigger_phrases:
  - "015 apply plugin doc recs summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/009-apply-plugin-doc-recs"
    last_updated_at: "2026-08-23T03:54:00Z"
    last_updated_by: "claude"
    recent_action: "Applied deferred notion-bases dataview and claudian P1 and P2 content"
    next_safe_action: "None — optional advanced-config split and version bumps remain deferred"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-009-apply-plugin-doc-recs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-apply-plugin-doc-recs |
| **Completed** | P0 correctness complete for all five active plugins; P1/P2 additive content complete for advanced-canvas, meta-bind, notion-bases, dataview, and claudian; only 2 SKIP-by-instruction dataview VERIFY rows and optional notion-bases splits/version bumps deferred (see Known Limitations) |
| **Level** | 2 |
| **Actual Effort** | ~9 hours (main.js verification + full P0/P1/P2 application + 007 successor fix + validation + phase package) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase applied the seven `006-plugin-docs-deep-research` synthesis edit tables to the shipped `mcp-obsidian` reference and feature-catalog docs. Every correctness-critical row was confirmed against the installed plugin `main.js` in the operator's vault (read-only) before being applied; **no `main.js` contradicted any synthesis claim**, so every planned P0 landed as written.

### Applied per plugin

| Plugin | Applied | Notes |
|--------|---------|-------|
| **advanced-canvas** | P0×10 + P1×7 + P2×3 (full) | Lifted the 13-instance interdimensional-edge `VERIFY` flag across 5 files (incl. the feature-catalog card the research missed); documented `interdimensionalEdges[]` on the portal node, `collapsedData`, `zIndex`, the `ratio` string sentinel, the `-`-in-id constraint, the `fromEnd` default, the array-order-vs-zIndex gotcha, the interdimensional-edge recipe, a new §9 Z-Order section, and the `styleAttributes` null note. Endpoint-encoding kept flagged inferred. |
| **notion-bases** | P0×13 + P1×8 + P2-1..6 | P0: replaced every wrong column key with the confirmed source key across data-model/workflows/troubleshooting/index/catalog (`target`→`refDatabasePath`, drop `two_way`, `back_reference`→`pairedColumnId`, `+refColumnId`; rollup trio; lookup `refDatabasePath/refColumnId/refMatchColumnId`; `self_relation`→`isHierarchical`; `group_by`→`groupByColumnId`; `date_field`→`calendarDateField`) + mandatory `notion-bases: true` marker. P1×8: new data-model §7 ADVANCED SCHEMA KEYS (system columns via `systemField`, `numberFormat`, templates, `folderArrangement`/`computeArrangedPath`, full `ViewConfig`, embed state `notion-bases-embeds`/`EMBED_FM_KEY`, `{{columnId}}` live placeholders, `readInlineFields`). P2: silent-ignore + folderArrangement-relocate + derived-value + rename-break troubleshooting rows. Deferred by design: P2-7 optional split, P2-8 version bump. |
| **meta-bind + js-engine** | meta-bind P0×10/P1×6/P2×7 + js-engine P0×2/P1×1/P2×3 | Replaced `=now()` with `new Date().toISOString()` at all 10 sites and reframed `evaluate:true` as plain JS; corrected the `js`-action signature; **merged** the two legs into one `§6 JS Engine companion` recipe — the injected execution-context object, the `engine` API (incl. `getPlugin`), and both write paths (Meta Bind `mb.updateMetadata` vs Obsidian-core `app.fileManager.processFrontMatter`) with the don't-destructure gotcha and enable-JS prereq; plus input-type list, `memory^` bind target, mathjs VIEW, action/actions exclusivity, awaited-write troubleshooting. |
| **claudian** | P0×6 + P1-7/8/9/10/11 + P2-12 | P0: reversed the `.claude/mcp.json` write instruction (Claudian removes that legacy file; positive Claude-provider MCP path kept unresolved per the synthesis caveat); corrected `.claude/`→`.claudian/` for `claudian-settings.json` and sessions. P1: promoted §2 slash-command (`safeName` `[a-zA-Z0-9_/-]/g` + reversible `cmd-` ID + frontmatter keys, P1-9) and §3 skill contract (`name`==folder, name≤64, description≤1024, P1-10) from VERIFY to documented; new §4a full `ClaudianSettings` schema/defaults (P1-7), §4c `.claude/settings.json` narrow `$schema`/`permissions`/`enabledPlugins` write scope (P1-11). P2-12: §4b per-provider default bags. All confirmed against installed `realclaudian` v2.2.4 `main.js`. |
| **dataview** | P0×2 + P1×15 + P2×3 | P0: corrected the inline-field multiline claim (single-line; multiline via YAML `|`) and the fixed-DQL-order claim (written-order execution). P1/P2: data-model §3-§8 expansion (type mapping/link caveat, three inline syntaxes + inference/sanitization, `file.frontmatter`/`file.day`, 18 task/list fields, ~30+ DataviewJS methods + inline DQL/JS semantics, grammar, expressions), troubleshooting case-insensitivity alias + null-comparison over-match trap, workflows task-bracket + JS-disabled silent-render notes. SKIPPED per instruction: 2 VERIFY rows (`file.day` "folder" term, inline-multiline contradiction) resting on official Dataview docs. |
| **project-manager** | none | No-op per its synthesis (plugin deprecated/uninstalled, docs already removed). |

### Files Changed (shipped docs)

| Surface | Files |
|---------|-------|
| `references/plugins/advanced-canvas/` | `advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md` |
| `references/plugins/notion-bases/` | `notion-bases.md`, `data-model.md`, `workflows.md`, `troubleshooting.md` |
| `references/plugins/meta-bind/` | `meta-bind.md`, `data-model.md`, `workflows.md`, `troubleshooting.md` |
| `references/plugins/claudian/` | `claudian.md`, `data-model.md`, `workflows.md` |
| `references/plugins/dataview/` | `data-model.md`, `workflows.md`, `troubleshooting.md` |
| `feature-catalog/plugins/` | `advanced-canvas.md`, `notion-bases.md`, `meta-bind.md`, `claudian.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each synthesis edit table was read, its correctness-critical rows verified against the installed plugin `main.js`, then applied in priority order. Repeated defects were fixed as coherent sets so no instance survives: the advanced-canvas VERIFY-lift across five files, the notion-bases wrong→correct keys across five files, and the meta-bind `=now()` fix across four files. The 006 (meta-bind) and 007 (js-engine) legs — which both target the meta-bind tree — were reconciled into a single `§6` recipe rather than two dueling metadata-write recipes. Every changed doc was validated with `validate_document.py` immediately after each plugin's edits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Single Level-2 phase, not a nested phase-parent | 015 is already a phase parent; a nested parent is 3-level nesting the phase-qualification guard discourages, and one coherent workstream fits one folder. tasks.md enumerates rec applications per-plugin. |
| main.js verification before every correctness row | The syntheses were mostly official-docs/TS-source grounded; confirming against the installed bundle closed the "owed" caveat. All confirmed; nothing contradicted. |
| notion-bases wrong keys confirmed as i18n-only | The "wrong" keys (`two_way`/`group_by`/`date_field`) appear in `main.js` ONLY as UI translation strings; the corrected camelCase keys are the real schema props — so the wrong→correct mapping is solid. |
| Keep inferred caveats intact | The advanced-canvas endpoint-id encoding and claudian's positive MCP path stay flagged inferred/unresolved rather than replaced with a confident new claim, per the syntheses. |
| Land all P0 first, then the additive P1/P2 | P0 correctness landed and validated in the first pass; the additive notion-bases P1 feature docs, the dataview DataviewJS-API expansion, and the full claudian schema/validation content were then applied in a second pass per the operator's "apply ALL" decision. Only the 2 dataview VERIFY rows (SKIP-by-instruction) and optional notion-bases splits/version bumps remain. |
| Repoint only the 007 lineage-pointer successor fields | `007`'s `**Successor**` fields named the never-built `008-notion-bases-consolidation`; repointed both to `009-apply-plugin-doc-recs`. The prose scope-descriptions in 007 that name `008` for specific deferred consolidation work (Project Manager deprecation, Meta Bind reference, roster sync, calendar recipe) were NOT repointed — 009 does not perform that work, so a repoint would assert false coverage; left as-is and flagged. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `main.js` confirmation — meta-bind | `updateMetadata` `evaluate:true` → `jsEngineExecuteCustom(t.value,{x,getMetadata})` (plain JS); `js` action `jsEngineRunFile`→`executeFile` (vault-root file) — CONFIRMED |
| `main.js` confirmation — js-engine | context `{app,engine,component,container,context,obsidian}` verbatim; `getPlugin` present; `processFrontMatter` absent (0 occ) — CONFIRMED |
| `main.js` confirmation — notion-bases | corrected keys are real schema props; wrong keys only i18n labels; marker `frontmatter?.["notion-bases"]!==!0` — CONFIRMED |
| `main.js` confirmation — claudian (path) | `m9e=".claudian"`, `f9e=".claude/claudian-settings.json"` (legacy) — settings-path reversal CONFIRMED |
| `main.js` confirmation — claudian (P1/P2, v2.2.4) | `safeName` regex `[a-zA-Z0-9_/-]/g`; `permissionMode:"yolo"`, `"haiku"`, `"opus"`; `"Skill name must be 64 characters"`; `"description is required")…length>1024`; `$schema`/`permissions`/`enabledPlugins`; `acceptEdits`/`workspace-write`/`OPENCODE_ENABLE_EXA`/`toolMode` — all CONFIRMED present in installed bundle |
| `validate_document.py` — 18 reference docs | `Total issues: 0` on each (full sweep) |
| `validate_document.py` — 4 catalog cards | `Total issues: 0` on each |
| `validate.sh 009-apply-plugin-doc-recs --strict` | `RESULT: PASSED`, `Errors: 0` |
| Scope containment | `git status` shows the `mcp-obsidian/` shipped docs, this phase folder, and the coordinator-authorized 2 successor lines + refreshed metadata in `007`; the parent `015/spec.md` was not modified; no deep-loop-runtime/research/vault path was deliberately written (the pre-existing `observability-events.jsonl` mtime belongs to the concurrent session / mandated `validate.sh` telemetry, not an authored change) |
| Vault safety | read-only — only plugin `main.js`/`manifest.json` read; no vault write, no `.env`/token read |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two dataview VERIFY rows are intentionally skipped.** Per the operator instruction, the `file.day` "folder"-term row and the inline-multiline contradiction row were NOT edited: they rest on official Dataview documentation rather than an installed-bundle schema, and Dataview was not on the mandatory `main.js` verification list. Both are noted against Dataview's Known-Limitations in `troubleshooting.md`.
2. **Two optional notion-bases items are deferred by design.** P2-7 (splitting the large `ViewConfig`/advanced-config surface into a dedicated `advanced-config.md`) is a structural nicety the synthesis marked optional, and P2-8 (version-frontmatter bumps on the edited docs) is cosmetic; neither is a correctness or content gap.
3. **Two claims remain intentionally inferred/unresolved.** The advanced-canvas interdimensional-edge endpoint encoding (`portalId-nestedNodeId`) is inferred from the plugin's runtime rewrite, not byte-verified against a captured `.canvas`; claudian's positive Claude-provider on-disk MCP path is not established. Both are flagged in the docs rather than replaced with a confident claim.
4. **dataview P0/P1/P2 content rests on research + documented Dataview semantics, not an installed-bundle schema.** DQL grammar, execution order, and the API surface are not schema keys in an installed `main.js` the way notion-bases keys are, and dataview was not on the mandatory verification list; the dataview corrections and additions rest on the research findings plus documented Dataview behavior. Uncommon DataviewJS methods carry a "confirm against official docs" caveat in the docs themselves.
5. **007 prose still names the never-built `008` for its deferred scope.** Only 007's two `**Successor**` lineage-pointer fields were repointed to `009`. The 007 spec.md prose that describes the deferred consolidation work (Project Manager deprecation, Meta Bind reference authoring, roster sync, calendar recipe) still names `008-notion-bases-consolidation`; 009 does not perform that work, so those lines were left for the operator to resolve rather than falsely repointed. 007 additionally carries a pre-existing `TEMPLATE_HEADERS` validate error (its tasks.md uses `## Phase 1: Map` / `## Phase 2: Remove` instead of the canonical `Setup`/`Implementation`) that is outside this packet's authorized scope.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY (~100 lines)
- Core + Level 2 addendum
- Honest framing: P0 complete + validated, lower-priority P1/P2 deferred
-->
