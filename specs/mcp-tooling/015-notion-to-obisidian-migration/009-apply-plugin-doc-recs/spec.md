---
title: "Phase 009: Apply plugin-docs deep-research recommendations to the shipped mcp-obsidian references"
description: "Apply the P0/P1/P2 recommendations from the seven 006 plugin-docs research syntheses to the shipped mcp-obsidian reference and feature-catalog docs — correctness first (advanced-canvas VERIFY-lift, notion-bases wrong keys, meta-bind =now() bug, claudian mcp.json/paths, dataview contradictions), each correctness-critical row confirmed against the installed plugin main.js before applying."
trigger_phrases:
  - "015 apply plugin doc recs"
  - "mcp-obsidian plugin docs remediation"
  - "notion bases wrong keys fix"
  - "meta-bind now() bug fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/009-apply-plugin-doc-recs"
    last_updated_at: "2026-08-23T03:52:43Z"
    last_updated_by: "claude"
    recent_action: "Applied deferred notion-bases dataview and claudian P1 and P2 content"
    next_safe_action: "None — optional advanced-config split and version bumps remain deferred"
    blockers: []
    key_files:
      - "../006-plugin-docs-deep-research/001-advanced-canvas/synthesis.md"
      - "../006-plugin-docs-deep-research/005-notion-bases/synthesis.md"
      - "../006-plugin-docs-deep-research/006-meta-bind/synthesis.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-009-apply-plugin-doc-recs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 009: Apply plugin-docs deep-research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | Apply-recs follow-up to phase 006 research |
| **Predecessor** | `006-plugin-docs-deep-research` |
| **Successor** | None for this phase's own scope (closes the plugin-docs research→apply loop) — the packet's next sequential phase is `010-plugin-doc-recs-followup` |
| **Handoff Criteria** | Every P0 correctness row from the seven 006 syntheses is applied to the shipped `mcp-obsidian` docs, each correctness-critical row confirmed against the installed plugin `main.js`, and every changed shipped doc passes `validate_document.py` with 0 issues. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 006 ran a seven-leg deep-research loop over the shipped `mcp-obsidian` plugin reference docs (advanced-canvas, claudian, project-manager, dataview, notion-bases, meta-bind, js-engine) and produced one `synthesis.md` per leg — each a prioritized, evidence-cited edit plan (P0 correctness → P1 missing content → P2 polish). This phase is the **implementation payload**: it applies those edit tables to the shipped docs.

**This phase writes only two surfaces**: the shipped docs under `.opencode/skills/mcp-tooling/mcp-obsidian/` (the `references/plugins/<plugin>/` trees and `feature-catalog/plugins/<plugin>.md` cards) and this new phase folder. It does not touch the 006 research trees, the deep-loop runtime, or any concurrent session's lanes.

**Mandatory main.js verification (done before applying flagged correctness rows):** the correctness-critical rows were confirmed against the installed plugin bundles in the operator's vault before being applied — meta-bind `updateMetadata`/`evaluate` and `js`-action file base (`obsidian-meta-bind-plugin` v1.5.1), js-engine execution context + `getPlugin` + `processFrontMatter`-absence (`js-engine` v0.3.6), notion-bases corrected column keys + `notion-bases: true` marker (`notion-bases` v1.12.0), and the claudian settings-path reversal (`realclaudian` v2.2.4). The vault was read-only throughout — only plugin `main.js`/`manifest.json` were read.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped `mcp-obsidian` plugin docs carried real correctness defects the 006 research surfaced: advanced-canvas told the AI to never author cross-portal edges (a now-resolved, operation-blocking `VERIFY`); every notion-bases `_database.md` column key was a wrong guess the plugin silently ignores, and the mandatory `notion-bases: true` marker was documented nowhere; meta-bind taught a `=now()` timestamp the plugin has no function for; claudian instructed operators to author `.claude/mcp.json`, a file Claudian deletes; dataview stated two facts (inline-field multiline, fixed DQL command order) the research contradicts. An AI following these docs produces broken artifacts.

### Purpose
Apply the seven syntheses' edit tables to the shipped docs — P0 first — so the reference set stops teaching broken patterns, with every correctness-critical claim verified against the installed plugin `main.js` and every changed doc passing the skill-document validator.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the P0 correctness rows from all seven 006 syntheses to the shipped `mcp-obsidian` docs (advanced-canvas, notion-bases, meta-bind+js-engine, claudian, dataview; project-manager is a documented no-op).
- Apply the advanced-canvas VERIFY-lift as a coherent five-file set (incl. the feature-catalog card), and the meta-bind/js-engine cross-leg reconciliation as one merged recipe.
- Apply the P1/P2 additive content in full for advanced-canvas, meta-bind, notion-bases (P1×8), dataview (P1×15/P2×3), and claudian (P1-7/9/10/11 + P2-12) per the operator's "apply ALL" decision — skipping only the 2 dataview VERIFY rows that rest on official Dataview docs and the optional notion-bases advanced-config split / version bumps.
- Confirm each correctness-critical row against the installed plugin `main.js` before applying it (extended to the claudian v2.2.4 P1/P2 tokens).
- Repoint 007's two `**Successor**` lineage-pointer fields from the never-built `008-notion-bases-consolidation` to this phase; refresh 007's generated metadata for that edit.
- This new phase folder's documentation.

### Out of Scope
- **Deep-loop runtime files** (`fanout-run.cjs`, `executor-config.ts`, `append-mode-event.cjs`, `mode-append-gateway`, cli-* references) — a concurrent session owns these.
- **The 006 research trees** (001-007 syntheses/research) — done and read-only here.
- **Any write to the iCloud-synced vault** — plugin `main.js`/`manifest.json` were read only; no vault file was written.
- **The 2 SKIP-by-instruction dataview VERIFY rows and the optional notion-bases advanced-config split / version bumps** (see §9 Open Questions) — the only content intentionally not applied.
- **007 prose scope-descriptions** naming `008-notion-bases-consolidation` for its deferred consolidation work — only the two `**Successor**` lineage fields were repointed; the prose was left for the operator since 009 does not perform that consolidation work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/{advanced-canvas,data-model,workflows,troubleshooting}.md` | Edit | VERIFY-lift, `interdimensionalEdges`, `collapsedData`, `zIndex`, `ratio`, id-dash constraint, z-order recipe |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/{notion-bases,data-model,workflows,troubleshooting}.md` | Edit | wrong→correct column keys throughout, mandatory `notion-bases: true` marker, VERIFY-removal, silent-ignore troubleshooting |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/meta-bind/{meta-bind,data-model,workflows,troubleshooting}.md` | Edit | `=now()`→`new Date().toISOString()`, `evaluate:true`=plain-JS, `js`-action-runs-file-as-is, merged JS Engine execution-context + frontmatter read/write recipe, enable-JS prereq |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/{claudian,data-model,workflows}.md` | Edit | `.claude/mcp.json` delete-not-write reversal, `.claude/`→`.claudian/` settings/sessions paths |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/{data-model,workflows,troubleshooting}.md` | Edit | inline-field single-line correction, DQL written-order execution correction |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/{advanced-canvas,notion-bases,meta-bind,claudian}.md` | Edit | mirror the reference-doc corrections in the catalog cards |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every P0 row from the seven 006 syntheses is applied to the shipped docs | advanced-canvas P0×10, notion-bases P0×13, meta-bind P0×10, js-engine P0×2, claudian P0×6, dataview P0×2 all landed |
| REQ-002 | Each correctness-critical row is confirmed against the installed plugin `main.js` before applying | meta-bind/js-engine/notion-bases/claudian verification recorded in `implementation-summary.md`; contradictions (none found) would trust main.js over the synthesis |
| REQ-003 | Every changed shipped doc passes the skill-document validator | `validate_document.py` = 0 issues on each edited reference/catalog file |
| REQ-004 | No file outside the authorized surfaces is written; the vault is read-only | `git status` scoped to `mcp-obsidian/`, this phase folder, and the operator-authorized 2 successor lines + refreshed metadata in `007`; no vault write |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | advanced-canvas and meta-bind P1/P2 applied in full | both trees carry the added keys/sections and validate clean |
| REQ-006 | The remaining P1/P2 content (notion-bases P1×8 features, dataview P1×15/P2×3 API+traps, full claudian schema/validation P1-7/9/10/11 + P2-12) is applied per the operator's "apply ALL" decision | all trees carry the added sections and validate 0 issues; only the 2 SKIP-by-instruction dataview VERIFY rows and optional notion-bases split/version bumps deferred (§9) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 correctness rows land and every changed shipped doc reports `Total issues: 0` under `validate_document.py`.
- **SC-002**: Every correctness-critical row traces to a confirmed `main.js` observation; no synthesis claim was contradicted by `main.js` (recorded in `implementation-summary.md`).
- **SC-003**: `validate.sh <this-folder> --strict` = Errors:0, and `git status` shows only `mcp-obsidian/` and this phase folder changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A synthesis key/claim is wrong and would ship a new defect | High | Confirm every correctness-critical row against the installed plugin `main.js` before applying; trust `main.js` on any conflict |
| Risk | Writing outside the allowed surface (deep-loop runtime, research trees) | High | Scope-locked to `mcp-obsidian/` shipped docs + this phase folder; concurrent-session lanes never touched |
| Risk | Editing the iCloud-synced personal vault | High | Read-only on the vault — only plugin `main.js`/`manifest.json` read; never `.env`/tokens; no vault write |
| Dependency | The seven 006 `synthesis.md` edit tables | Source of truth | Complete and read in full |
| Dependency | Installed plugin bundles in the vault | Verification source | All four verified plugins readable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: No correctness-critical row is applied without a confirming `main.js` observation; a `main.js` contradiction trusts `main.js` and is noted in `implementation-summary.md`.

### Consistency
- **NFR-C02**: Counts and cross-references stay internally consistent — the VERIFY-lift and wrong-key fixes are applied as coherent sets across every file that repeats them, including the feature-catalog cards.

### Safety
- **NFR-S01**: Comment hygiene — no spec paths, rec-ids, or ADR/REQ/CHK ids appear inside any authored code fence; only durable WHY.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **project-manager is a no-op**: its synthesis is a deliberate skip (plugin deprecated/uninstalled, docs already removed) — nothing applied, per its verdict.
- **Cross-leg overlap (006 meta-bind + 007 js-engine)**: both edit the meta-bind tree — merged into one metadata-write recipe (JS Engine execution context + `app.fileManager.processFrontMatter`; Meta Bind `engine.getPlugin(...).api`), not two dueling recipes.

### Verification Boundaries
- **Inferred-not-byte-verified caveats preserved**: advanced-canvas interdimensional-edge endpoint encoding, and claudian's positive Claude-provider MCP path, stay flagged as inferred/unresolved rather than replaced with a confident new claim.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Applied (this packet):** notion-bases P1×8 undocumented-feature docs (folderArrangement, templates, system columns, numberFormat, full ViewConfig, embed-state, live placeholders, inline fields) + P2-4/5/6 troubleshooting; dataview P1×15 / P2×3 (DataviewJS API expansion, type-inference tables, DQL grammar, null-comparison trap, silent-render note); full claudian `ClaudianSettings` schema (P1-7), slash-command/skill validation (P1-9/P1-10), `.claude/settings.json` write-scope (P1-11), per-provider defaults (P2-12).
- **Skipped by operator instruction:** the 2 dataview VERIFY rows (`file.day` "folder" term, inline-multiline contradiction) that rest on official Dataview docs.
- **Deferred by design (optional):** notion-bases P2-7 (split the advanced-config surface into a dedicated `advanced-config.md`) and P2-8 (version-frontmatter bumps) — structural/cosmetic niceties, not content gaps.
- **Left for the operator:** 007's prose scope-descriptions still name the never-built `008-notion-bases-consolidation` for its deferred consolidation work (only the two `**Successor**` lineage fields were repointed to 009, since 009 does not perform that work), plus 007's pre-existing `TEMPLATE_HEADERS` validate error — both outside this packet's authorized write scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research syntheses**: `../006-plugin-docs-deep-research/00{1..7}-*/synthesis.md`
<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
