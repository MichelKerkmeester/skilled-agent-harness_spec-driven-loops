---
title: "Phase 010: Apply the deferred plugin-doc research recommendations and open follow-up items"
description: "Resolve the items phase 009 deferred on the shipped mcp-obsidian plugin docs — the two dataview evidence upgrades (file.day filename/Date derivation, inline-field single-line official-docs citation), the advanced-canvas interdimensional-edge caveat tightening, the claudian positive-MCP-path UNKNOWN resolution, and the two optional notion-bases items (advanced-config split decision, version bumps) — plus the 007 TEMPLATE_HEADERS fix, each authored from a primary-source-confirmed facts sheet."
trigger_phrases:
  - "015 plugin doc recs followup"
  - "dataview file.day folder fix"
  - "claudian positive mcp path unknown"
  - "advanced-canvas interdimensional caveat tighten"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/010-plugin-doc-recs-followup"
    last_updated_at: "2026-08-22T20:12:00Z"
    last_updated_by: "claude"
    recent_action: "Resolved deferred plugin-doc items and the 007 header fix"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files:
      - "../009-apply-plugin-doc-recs/spec.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-010-plugin-doc-recs-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 010: Apply the deferred plugin-doc research recommendations and open follow-up items

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | Follow-up to phase 009's applied recommendations |
| **Predecessor** | `009-apply-plugin-doc-recs` |
| **Successor** | None — closes the deferred plugin-doc items |
| **Handoff Criteria** | Every deferred item phase 009 carried is resolved on the shipped `mcp-obsidian` docs (dataview evidence upgrades, advanced-canvas caveat tightening, claudian positive-MCP-path UNKNOWN, notion-bases split decision and version bump), the 007 `TEMPLATE_HEADERS` error is cleared, every changed shipped doc passes `validate_document.py` with 0 issues, and both this folder and `007` pass `validate.sh --strict` with Errors:0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 009 applied the seven 006 synthesis edit tables to the shipped `mcp-obsidian` docs but deferred a small set of items: two dataview claims that rested on official Dataview documentation rather than an installed-bundle schema, the advanced-canvas interdimensional-edge endpoint caveat (flagged "inferred"), the claudian positive Claude-provider MCP path (left as a dangling `VERIFY`), and two optional notion-bases niceties (an advanced-config split and version-frontmatter bumps). It also flagged a pre-existing `TEMPLATE_HEADERS` validate error in the sibling `007` packet.

This phase closes those items. It authors **from a primary-source-confirmed facts sheet** the orchestrator prepared: each fact was verified against the official Dataview documentation or the installed plugin `main.js` before this phase ran, so this phase applies confirmed wording rather than re-deciding the underlying claims.

**Surfaces written**: the shipped `mcp-obsidian` docs for dataview, advanced-canvas, claudian and notion-bases; and the `007` packet's `tasks.md` plus its regenerated metadata. The vault stays read-only; no `.canvas` file is created; the deep-loop runtime and any concurrent-session lane are never touched.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 left five documentation items and one sibling-packet error unresolved. Two dataview claims still read as under-evidenced or partly wrong: the `file.day` derivation note hedged an unreal "folder" trigger, and the single-line inline-field rule carried no official-docs citation. The advanced-canvas cross-portal caveat still called its endpoint encoding "inferred" even though the plugin's serialization code confirms it. The claudian docs still carried a dangling `VERIFY` for the positive Claude-provider MCP path. Two optional notion-bases items (advanced-config split, version bumps) were deferred without an explicit decision. And `007`'s `tasks.md` used non-canonical phase headers that fail `validate.sh --strict`.

### Purpose
Resolve each deferred item with confirmed evidence: correct the `file.day` folder wording and cite the official docs, upgrade the inline-field claim to a confirmed official-docs citation, tighten the advanced-canvas caveat to "confirmed from the plugin's serialization code, not yet byte-verified", resolve the claudian positive path to a definitive negative plus an explicit UNKNOWN, make an explicit not-split decision for notion-bases with a version bump on the phase-008 calendar-recipe file, and rename `007`'s phase headers to canonical so its packet validates clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **dataview**: correct the `file.day` "folder" wording to the two confirmed triggers (a filename date `yyyy-mm-dd`/`yyyymmdd`, or a `Date` field/inline field) and cite the official Dataview "Metadata on Pages" docs; add the confirmed official Dataview "Adding Metadata" citation to the single-line inline-field rule.
- **advanced-canvas**: tighten the interdimensional-edge endpoint caveat across the four reference docs and the feature-catalog card — from "inferred" to "confirmed from the plugin's own serialization code, only not yet byte-verified against a captured `.canvas` file". The documented `portalId-nodeId` encoding is unchanged.
- **claudian**: resolve the dangling positive Claude-provider MCP-path `VERIFY` to a definitive negative (Claudian authors no on-disk MCP file for Claude Code; it removes the legacy `.claude/mcp.json` and passes an in-memory `mcpServers` array, empty by default) and an explicit UNKNOWN for the positive add-a-server surface, across the reference and catalog docs.
- **notion-bases**: record the P2-7 advanced-config split as an explicit not-split decision; bump the `version:` frontmatter on the phase-008 calendar-recipe file `references/plugins/notion-bases/workflows.md`.
- **007**: rename `tasks.md`'s `## Phase 1: Map` / `## Phase 2: Remove` to canonical `Setup` / `Implementation`, refresh 007's generated `description.json`/`graph-metadata.json`, and reconcile the continuity timestamp the refresh advances.
- This new phase folder's documentation.

### Out of Scope
- **Re-deciding the confirmed facts** — the orchestrator verified each against official docs / the installed `main.js`; this phase authors from them.
- **Re-applying 009's already-landed fixes** — the claudian `.claude/`→`.claudian/` path fix and the `.claude/mcp.json` write-instruction reversal stay as 009 left them.
- **Any write to the iCloud-synced vault** — only plugin `main.js`/`manifest.json` are read; no vault file is written; no `.canvas` file is created.
- **The deep-loop runtime, `system-deep-loop`, and `compiled-routing`** — a concurrent session owns these; their `observability-events.jsonl` and directories are left exactly as-is.
- **The parent packet's `spec.md`/`graph-metadata.json`** — the parent phase-map refresh is the orchestrator's step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md` | Edit | `file.day` two-trigger correction + "Metadata on Pages" citation; inline-field "Adding Metadata" citation |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/{advanced-canvas,data-model,workflows,troubleshooting}.md` | Edit | interdimensional-edge caveat tightened to serialization-code-confirmed / byte-unverified |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/advanced-canvas.md` | Edit | mirror the caveat tightening |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/{data-model,workflows}.md` | Edit | positive Claude-provider MCP path resolved to definitive negative + explicit UNKNOWN |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/claudian.md` | Edit | mirror the positive-MCP-path resolution |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` | Edit | `version:` frontmatter bump (phase-008 calendar recipe) |
| `../007-excalidraw-deprecation/tasks.md` + generated metadata + `implementation-summary.md` continuity | Edit | canonical phase headers; metadata refresh; continuity-timestamp reconcile |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every deferred plugin-doc item is resolved with confirmed evidence | dataview `file.day` + inline-field, advanced-canvas caveat, claudian positive-path, notion-bases decision + version bump all applied per the facts sheet |
| REQ-002 | The 007 `TEMPLATE_HEADERS` error is cleared | `007/tasks.md` uses canonical `Setup`/`Implementation`; `validate.sh 007 --strict` = Errors:0 |
| REQ-003 | Every changed shipped doc passes the skill-document validator | `validate_document.py` = 0 issues on each edited reference/catalog file |
| REQ-004 | No file outside the authorized surfaces is written; the vault is read-only | writes limited to the named `mcp-obsidian/` docs, this phase folder, and `007`'s tasks/metadata/continuity; no vault write; no `.canvas` created |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The notion-bases P2-7 split deferral is resolved explicitly | documented as an intentional not-split decision with a one-line rationale (§9) |
| REQ-006 | This phase folder passes strict validation | `validate.sh <this-folder> --strict` = Errors:0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All deferred items land and every changed shipped doc reports `Total issues: 0` under `validate_document.py`.
- **SC-002**: `validate.sh 007-excalidraw-deprecation --strict` = Errors:0 (RESULT: PASSED) — the pre-existing header error is cleared.
- **SC-003**: `validate.sh <this-folder> --strict` = Errors:0, and no write lands outside the authorized surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-claiming a confirmed fact (e.g. asserting a byte-verified canvas encoding) | High | Author only the facts-sheet wording; the endpoint caveat stays "serialization-code-confirmed, not byte-verified" |
| Risk | Inventing a claudian positive MCP path | High | State the positive surface as an explicit UNKNOWN; name no file path |
| Risk | Refreshing 007 metadata advances `last_save_at` and staled continuity | Medium | Reconcile 007's continuity `last_updated_at` so `CONTINUITY_FRESHNESS` passes |
| Risk | Writing outside the allowed surface (deep-loop runtime, concurrent lanes) | High | Scope-locked; `observability-events.jsonl` and compiled-routing left as-is |
| Dependency | The primary-source-confirmed facts sheet | Source of truth | Read in full before authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: No claim is upgraded beyond its confirmed evidence — dataview citations name the official Dataview pages; the advanced-canvas endpoint encoding stays byte-unverified; the claudian positive path stays UNKNOWN.

### Consistency
- **NFR-C02**: Repeated caveats are tightened as coherent sets — the advanced-canvas caveat across five files, the claudian positive-path resolution across reference and catalog — so no stale "inferred"/dangling-`VERIFY` instance survives.

### Safety
- **NFR-S01**: Comment hygiene — no spec paths, rec-ids, or ADR/REQ/CHK ids appear inside any authored code fence; only durable WHY.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **Per-CLI schema `VERIFY` tags preserved**: only the positive Claude-provider MCP path is resolved; the Codex/OpenCode/Grok/Pi MCP-config `VERIFY` tags stay, since each CLI's exact path/shape still needs a live-install check.
- **Encoding unchanged**: the advanced-canvas caveat is tightened, but the documented `portalId-nodeId` endpoint form is left exactly as 009 wrote it.

### Verification Boundaries
- **UNKNOWN stated, not invented**: claudian's positive add-a-server surface for Claude Code is not determinable from the minified build, so it is documented as UNKNOWN rather than guessed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Resolved — notion-bases P2-7 (advanced-config split):** intentionally NOT split. `data-model.md` stays cohesive so the `ViewConfig`/advanced-schema surface reads next to the core column schema it extends; splitting would fragment that context and add a new `advanced-config.md` leaf to the mcp-tooling hub leaf inventory for marginal navigability gain. The surface remains where 009 placed it.
- **Resolved — notion-bases P2-8 (version bumps):** scoped to the notion-bases doc actually changed without a bump — the phase-008 calendar-recipe file `workflows.md` (`0.1.0.0` → `0.1.1.0`). No unrelated files swept.
- **Resolved — claudian positive MCP path:** definitive negative documented (runtime `mcpServers` array, empty by default; legacy `.claude/mcp.json` removed at init); the positive add-a-server surface stated as UNKNOWN, no file path invented.
- **Left to the orchestrator:** the parent packet phase-map refresh after 008 and 010 land.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: `../009-apply-plugin-doc-recs/`
<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
