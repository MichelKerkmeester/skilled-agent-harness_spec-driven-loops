---
title: "Tasks: Phase 009 — Apply plugin-docs research recommendations"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 apply plugin doc recs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/009-apply-plugin-doc-recs"
    last_updated_at: "2026-08-22T18:35:00Z"
    last_updated_by: "claude"
    recent_action: "Applied deferred notion-bases dataview and claudian P1 and P2 content"
    next_safe_action: "None — optional advanced-config split and version bumps remain deferred"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-009-apply-plugin-doc-recs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 009 — Apply plugin-docs research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all seven 006 `synthesis.md` edit tables [30m]
  - **Evidence**: advanced-canvas (P0×10/P1×7/P2×3), claudian (P0×6/P1×5/P2×2), project-manager (no-op), dataview (P0×2/P1×15/P2×3), notion-bases (P0×13/P1×8/P2×8), meta-bind (P0×10/P1×6/P2×8), js-engine (P0×2/P1×1/P2×3) all read.
- [x] T002 Confirm installed plugin manifests/versions in the vault [10m]
  - **Evidence**: `obsidian-meta-bind-plugin` v1.5.1, `js-engine` v0.3.6, `notion-bases` v1.12.0, `realclaudian` v2.2.4 — all match the syntheses.
- [x] T003 Verify the flagged correctness rows against each installed `main.js` [45m]
  - **Evidence**: meta-bind `updateMetadata` `evaluate:true` → `jsEngineExecuteCustom(t.value,{x,getMetadata})` (plain JS); `js` action `jsEngineRunFile`→`executeFile` (vault-root file). js-engine context object `{app,engine,component,container,context,obsidian}` verbatim; `getPlugin` present; `processFrontMatter` absent (0 occ). notion-bases corrected keys all present as schema props (wrong keys only i18n labels); marker `frontmatter?.["notion-bases"]!==!0`. claudian `m9e=".claudian"`, `f9e=".claude/claudian-settings.json"` (legacy). No `main.js` contradicted any synthesis claim.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 correctness

### advanced-canvas (synthesis 001)
- [x] T010 Lift the interdimensional-edge VERIFY flag and document `interdimensionalEdges[]` on the portal node across all 5 files, incl. the feature-catalog card [45m]
  - **Evidence**: rows 1-7 applied (data-model §1/§5/§7, advanced-canvas.md §1/§4, workflows §1/§5/checkpoint, troubleshooting §1/§4/§7/§9, feature-catalog §4); all VERIFY language replaced with the confirmed `interdimensionalEdges` statement; endpoint-encoding kept flagged inferred.
- [x] T011 Add the `collapsedData` runtime payload (data-model §3, advanced-canvas.md §2, troubleshooting §1) [15m]
  - **Evidence**: rows 8-10; new key row + collapsed-group sentence + "members missing from nodes[]" symptom.

### notion-bases (synthesis 005)
- [x] T020 Replace every wrong column key with the correct source key across data-model/workflows/troubleshooting/index/catalog [1h]
  - **Evidence**: P0-1..P0-13; `target`→`refDatabasePath`, `two_way`→(dropped), `back_reference`→`pairedColumnId`, `+refColumnId`; rollup `relation/property/function`→`rollupRelationColumnId/rollupTargetColumnId/rollupFunction`; lookup→`refDatabasePath/refColumnId/refMatchColumnId`; `self_relation`→`isHierarchical`; `group_by`→`groupByColumnId`; `date_field`→`calendarDateField`.
- [x] T021 Add the mandatory `notion-bases: true` database marker (data-model §1 + guardrails/index/catalog) [15m]
  - **Evidence**: P0-6; "Database marker (required)" note + strict `=== true` explanation, referenced from every guardrail.

### meta-bind + js-engine (syntheses 006 + 007, merged)
- [x] T030 Replace `=now()` with `new Date().toISOString()` and reframe `evaluate:true` as plain-JS at all 10 sites [30m]
  - **Evidence**: P0-1..P0-10; data-model §5 block + catalog row + resolved bullets + §1/§7 intro; workflows Step 2/3 + blockquote; troubleshooting symptom; meta-bind.md §1/§4; catalog §4.
- [x] T031 Merge the JS Engine execution-context + frontmatter read/write recipe into meta-bind §6 (one recipe, both write paths) [30m]
  - **Evidence**: 007 P0×2 + 006 P1-3; `{app,engine,component,container,context,obsidian}` table, `engine` API incl. `getPlugin`, and the Meta Bind `mb.updateMetadata` vs Obsidian-core `app.fileManager.processFrontMatter` paths with the don't-destructure gotcha and enable-JS prereq.

### claudian (synthesis 002)
- [x] T040 Reverse the `.claude/mcp.json` write instruction (Claudian deletes it) across data-model §5, workflows §5, index, catalog [30m]
  - **Evidence**: P0-1/P0-2/P0-3; the write recipe + code examples removed; positive Claude-provider MCP path kept unresolved per the synthesis caveat.
- [x] T041 Correct `.claude/`→`.claudian/` for claudian-settings.json and sessions [15m]
  - **Evidence**: P0-4/P0-5/P0-6 + P1-8; confirmed against `realclaudian/main.js` (`m9e=".claudian"`, legacy `.claude/claudian-settings.json`); sessions row split into `.claudian/sessions` (current) / `.claude/sessions` (legacy).

### dataview (synthesis 004)
- [x] T050 Correct the inline-field multiline claim (single-line; multiline via YAML `|`) in data-model §4 + troubleshooting §5 [10m]
  - **Evidence**: P0-1; `data-model.md` §4 and `troubleshooting.md` §5 corrected to single-line inline fields; `validate_document.py` = 0 issues on both.
- [x] T051 Correct the fixed DQL command-order claim to written-order execution in workflows §2 + troubleshooting §2 [10m]
  - **Evidence**: P0-2; `workflows.md` §2 and `troubleshooting.md` §2 corrected to written-order execution; `validate_document.py` = 0 issues on both.
### P1/P2 refinements (where in budget)

- [x] T060 advanced-canvas P1/P2 — `zIndex`, `ratio` sentinel, id-dash constraint, `fromEnd` default, array-order gotcha, interdimensional-edge recipe, §9 z-order section, `styleAttributes` null note [30m]
  - **Evidence**: rows 11-20 all applied; `validate_document.py` 0 issues on all 5 files.
- [x] T061 meta-bind P1/P2 — js-action signature, ObsAPI coupling + don't-destructure, enable-JS prereq, full input-type list + arg syntax, `memory^` bind target, mathjs VIEW, action/actions mutual exclusivity, awaited-write troubleshooting [30m]
  - **Evidence**: P1-1..P1-6 + P2-1..P2-7 applied; 0 issues on all 5 files.
- [x] T062 notion-bases key P2s — VERIFY-flag removal (P2-1), slug=id (P2-2), silent-ignore symptom (P2-3) [15m]
  - **Evidence**: P2-1/P2-2/P2-3 applied to `notion-bases.md`, `data-model.md`, `troubleshooting.md`; `validate_document.py` = 0 issues on all three.
- [x] T063 notion-bases P1×8 + remaining P2s — undocumented-feature schema and troubleshooting entries [45m]
  - **Evidence**: P1-1..P1-8 landed in `data-model.md` new §7 ADVANCED SCHEMA KEYS (system columns `created`/`modified` via `systemField` ctime/mtime, `numberFormat`, templates `templatePath`/placeholders, `folderArrangement`/`computeArrangedPath`, full `ViewConfig` incl. `calendarViewMode`, embed state `notion-bases-embeds`/`EMBED_FM_KEY`, live `{{columnId}}` placeholders, `readInlineFields`); P2-4/P2-5/P2-6 added to `troubleshooting.md` §1; index §3 description expanded; `validate_document.py` = 0 issues on all four. Deferred by design: P2-7 optional `advanced-config.md` split, P2-8 version bump.
- [x] T064 dataview P1×15 + P2×3 — DataviewJS-API expansion, type-inference tables, DQL grammar, traps [1h]
  - **Evidence**: applied across `data-model.md` (§3 type-mapping/link caveat, §4 three inline syntaxes + inference/sanitization/escape/duplicate keys, §5 `file.frontmatter`/`file.day` Date trigger + 18 task/list fields + emoji shorthands, §6 ~30+ DataviewJS methods + inline DQL/JS semantics, §7 grammar, §8 expressions/literals), `troubleshooting.md` (§3 case-insensitivity alias P2-3, null-comparison over-match trap P1-14), `workflows.md` (§4 task-bracket note P1-15, §8 JS-disabled silent-render note P2-1); `validate_document.py` = 0 issues on all three. SKIPPED per instruction: 2 VERIFY-flagged rows (`file.day` "folder" term, inline-multiline contradiction) that rest on official Dataview docs — carried as Known-Limitations #2.
- [x] T065 claudian P1-7/9/10/11 + P2-12 — full schema, command/skill validation, write-scope, provider defaults [45m]
  - **Evidence**: `data-model.md` §2 promoted slash-command filename→`safeName` (`[a-zA-Z0-9_/-]/g`) + reversible `cmd-` ID + frontmatter keys from VERIFY to documented (P1-9); §3 promoted skill `name`==folder + name≤64 + description≤1024 contract (P1-10); new §4a full `ClaudianSettings` schema/defaults (P1-7), §4b per-provider default bags (P2-12), §4c `.claude/settings.json` narrow `$schema`/`permissions`/`enabledPlugins` write scope (P1-11); all confirmed against installed `realclaudian` v2.2.4 `main.js`; `validate_document.py` = 0 issues.
- [x] T066 Fix the 007 successor references from the never-built `008-notion-bases-consolidation` to `009-apply-plugin-doc-recs` [10m]
  - **Evidence**: `007-excalidraw-deprecation/spec.md` `**Successor**` field and `tasks.md` `**Successor**` cross-ref repointed to `009-apply-plugin-doc-recs` (009 not renumbered); 007 generated metadata refreshed to clear the fingerprint the edit staled. Prose scope-descriptions (007 spec.md §Scope, §Non-Goals) still name `008` for the deferred consolidation work 009 does not perform — left as-is and flagged, not falsely repointed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T070 `validate_document.py` on every changed shipped doc — 0 issues [20m]
  - **Evidence**: all 20 changed reference docs (`--type reference`) and 4 catalog cards (`--type feature_catalog`) report `Total issues: 0`.
- [x] T071 Author this phase package (spec/plan/tasks/checklist/implementation-summary) to the actual result [30m]
  - **Evidence**: this folder authored; `generate-description.js` + `backfill-graph-metadata.js` run.
- [x] T072 `validate.sh <this-folder> --strict` = Errors:0 [5m]
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] T073 Confirm `git status` scoped to `mcp-obsidian/` + this phase folder only [5m]
  - **Evidence**: recorded in `implementation-summary.md`; no deep-loop/runtime/research/vault path touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 correctness rows applied across the five active plugins (project-manager no-op)
- [x] Each correctness-critical row confirmed against `main.js`; no contradiction found
- [x] Every changed shipped doc passes `validate_document.py` (0 issues)
- [x] All P1/P2 content applied except the 2 SKIP-by-instruction dataview VERIFY rows and the optional notion-bases advanced-config split / version bumps (T063-T065)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../006-plugin-docs-deep-research/`
- **Next phase**: None — closes the research→apply loop
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
