---
title: "Verification Checklist: Phase 009 — Apply plugin-docs research recommendations"
description: "Verification checklist for the plugin-docs application pass: every P0 correctness row applied and validated, each correctness-critical row confirmed against the installed plugin main.js, scope contained to mcp-obsidian docs + this phase folder."
trigger_phrases:
  - "015 apply plugin doc recs checklist"
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
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-009-apply-plugin-doc-recs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 009 — Apply plugin-docs research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` authored with 9 sections incl. NFRs and Edge Cases; scope-locked to two surfaces.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes the verify-then-apply architecture, coherent-set application, cross-leg reconciliation, phases, rollback.
- [x] CHK-003 [P0] All seven 006 syntheses read before editing
  - **Evidence**: all 7 `synthesis.md` edit tables read in full; project-manager confirmed no-op; the resulting changed docs pass `validate_document.py` = 0 issues.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed shipped doc passes `validate_document.py` (0 issues)
  - **Evidence**: all 20 changed reference docs (`--type reference`) + 4 catalog cards (`--type feature_catalog`) report `Total issues: 0`.
- [x] CHK-011 [P0] Comment hygiene — no spec path / rec-id / ADR-REQ-CHK id inside any authored code fence
  - **Evidence**: `grep` of the changed docs' code fences shows only durable WHY comments (e.g. `# the related database's _database.md`); no spec paths or rec-ids; `validate_document.py` = 0 issues.
- [x] CHK-012 [P1] The vault was read-only — only plugin `main.js`/`manifest.json` read, no vault write
  - **Evidence**: verification greps read `main.js`/`manifest.json` under `.obsidian/plugins/`; no write to any vault path; no `.env`/token read.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001..REQ-006 acceptance criteria met
  - **Evidence**: REQ-001 (all P0 rows applied) — met; REQ-002 (main.js confirmation) — met, no contradiction, incl. claudian v2.2.4 for the P1/P2 pass; REQ-003 (validator 0 issues) — met; REQ-004 (scope + read-only vault) — met; REQ-005 (advanced-canvas + meta-bind P1/P2) — met; REQ-006 (remaining P1/P2 applied) — met, only the 2 SKIP-by-instruction dataview VERIFY rows and the optional notion-bases advanced-config split / version bumps stay deferred (`spec.md` §9).
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] CHK-022 [P0] Each correctness-critical row confirmed against the installed `main.js`
  - **Evidence**: T003 — meta-bind evaluate/js-base, js-engine context/getPlugin/processFrontMatter-absence, notion-bases keys+marker, claudian settings path all confirmed; no synthesis claim contradicted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned
  - **Evidence**: each changed doc maps to a specific synthesis P0/P1/P2 row per the prioritized tables; `validate_document.py` = 0 issues on all changed docs.
- [x] CHK-FIX-002 [P0] Same-class producer inventory
  - **Evidence**: repeated wrong patterns applied as coherent sets — advanced-canvas VERIFY-lift across 5 files, notion-bases wrong keys across 5 files, meta-bind `=now()` across 4 files — so no instance of the same defect is left behind.
- [x] CHK-FIX-003 [P0] Consumer inventory for changed docs
  - **Evidence**: the feature-catalog cards that repeat each reference-doc claim were updated in the same set; cross-references (`data-model.md §5/§6`) kept consistent.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets read or written; no vault mutation
  - **Evidence**: only plugin `main.js`/`manifest.json` read; no `.env`, token, or vault-content file touched.
- [x] CHK-031 [P1] No write outside the allowed surfaces
  - **Evidence**: `git status --short` scoped to `.opencode/skills/mcp-tooling/mcp-obsidian/` + this phase folder + the coordinator-authorized 2 successor lines in `007-excalidraw-deprecation/` (spec.md/tasks.md) and 007's refreshed generated metadata; deep-loop runtime / research trees / concurrent lanes untouched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: all four docs plus `implementation-summary.md` reflect the applied state — P0 complete for all five plugins; advanced-canvas, meta-bind, notion-bases (P1×8), dataview (P1×15/P2×3), and claudian (P1-7/9/10/11 + P2-12) applied; only the 2 SKIP-by-instruction dataview VERIFY rows and optional notion-bases splits/version bumps deferred.
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames what is applied vs deferred
  - **Evidence**: the summary lists per-plugin applied counts, the main.js confirmations (incl. claudian v2.2.4), and the narrowly-scoped remaining deferrals in Known Limitations.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: verification used inline `python3`/grep against the read-only vault; nothing written outside the two allowed surfaces.
- [x] CHK-051 [P1] Changes confined to this phase folder and `mcp-obsidian/`
  - **Evidence**: `git status --short` shows only `009-apply-plugin-doc-recs/` (new), `.opencode/skills/mcp-tooling/mcp-obsidian/` edits, and the coordinator-authorized 2 successor lines + refreshed metadata in `007-excalidraw-deprecation/`; the parent `015/spec.md` was not modified — the new phase is discoverable via its own `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 (only SKIP-by-instruction rows + optional splits deferred) |

**Verification Date**: 2026-08-22
**Verified By**: AI Assistant (Claude) — plugin-docs application pass
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
