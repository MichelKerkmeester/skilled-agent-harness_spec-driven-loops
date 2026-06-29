---
title: "Implementation Summary: Recommended Fix-Shape Column for the Hardening Matrix"
description: "A 'Fix shape to recommend' column now lands on all nine probe tables in hardening_edge_cases.md, giving each of the 35 probe rows one remediation direction and an owner while the audit/implement boundary stays advisory."
trigger_phrases:
  - "harden fix shape column summary"
  - "hardening matrix fix shape owner implementation"
  - "audit recommend fix shape sk-code implements"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/009-harden-fix-shapes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Add Fix-shape column to all 9 probe tables, one fix shape + owner per row"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships content only: the column shape is grep-checkable but no checker is bundled, because the spec target is the reference doc alone"
      - "Owners draw from the file's own routing set (foundations, interface, sk-code) plus the a11y and evidence routes the file already names"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-harden-fix-shapes |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hardening matrix already proved each edge case three ways: a probe to run, the symptom an unhardened surface shows, and the finding to file when the symptom appears. What it lacked was a systematic remedy direction. Only the Overlays section named a fix shape, and it did so in prose, so an auditor reading any other table got a confirmed gap with no consistent next move. That gap is now closed. Every probe table in `hardening_edge_cases.md` carries a fourth `Fix shape to recommend` column, and every row names one remediation shape plus the owner who carries it. The audit still only recommends and routes; whether the fix is correct stays `sk-code` work after the user accepts it.

### The Fix-shape column on all nine probe tables

The column lands on all nine probe tables: the eight original ones (Extreme Inputs, API and Network Errors, Permissions and Rate Limits, Concurrency, Internationalization and RTL, Text Expansion, CJK and Emoji, Overlays and Top Layer) plus the newly present §8B Device and Constrained Context table. Each of the 35 probe rows gets one recommended fix shape written as a remedy pattern, never implementation code, and one owner. Owners draw only from the file's own routing set, `foundations` for layout, spacing, logical-property and token fixes, `interface` for empty-state and error-state direction, and `sk-code` for implementation. Rows whose remedy has an accessibility or measurable-evidence half also carry the route the file already names, `assets/a11y_quick_fixes.md` for the disabled-control reason and `accessibility_performance.md` for load, layout-shift and motion evidence.

### Overlays prose folded into the column, no content loss

The Overlays and Top Layer section already carried its fix direction as a prose `Fix shape:` line. That content moved into the new column for its row with no loss: the native `<dialog>` / popover, measured `position: fixed`, or portal remedy and its `sk-code` owner now read the same way every other row does. The matrix is uniform, and the §8A to §8B to §9 ordering is intact with no section renumbered.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md` | Modified | Added a `Fix shape to recommend` column to all nine probe tables, one fix shape + owner per row across 35 rows; folded the Overlays prose fix line into the column; reinforced the recommend-only boundary in the routing summary. One additive edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) added the column additively to every probe table and wrote one recommended fix shape plus owner per row, folding the existing Overlays prose line into the column rather than dropping it. The orchestrator then verified acceptance independently against the live file. Every probe table now carries the column: a grep returns nine `Fix shape to recommend` headers across the nine probe tables. All 35 probe rows survive: the diff reformatted every row to gain the column with 35 removed and 35 added and zero rows lost, and the symptoms and findings are preserved verbatim, including "Overflow, clipped layout" and "Collapsed container, broken baseline". Owner counts confirm one owner per row, 9 `foundations`, 9 `interface`, and 17 `sk-code`, every token inside the file's named routing set. The §8A to §8B to §9 ordering is unchanged, the evergreen grep over the new content is clean, and the scope is clean: only `hardening_edge_cases.md` was touched and no checker was created. `validate.sh <folder> --strict` reports the spec-doc rules clean with only the expected generated-metadata fingerprint residual left for orchestrator regeneration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship a column, not a checker | The spec target is the reference doc alone and names no validator; the column makes the fix shape systematic by review and grep, and a deterministic matrix lint stays a flagged follow-up |
| Draw owners only from the file's own routing set | Reusing `foundations` / `interface` / `sk-code` plus the named a11y and evidence routes keeps the column consistent with the routing summary instead of inventing a parallel vocabulary |
| Fold the Overlays prose line into the column | The fix direction already existed for that row; moving it into the column made the matrix uniform without losing or rewording the remedy |
| Write fix shapes as remedy patterns, never code | A remedy shape recommends a direction and routes an owner; step-by-step code would cross the audit/implement boundary the file is built on |
| Reinforce the advisory boundary in the routing summary | The new column must read as a recommendation, so the summary now says the column names the remediation shape, not a checker or proof the remedy is correct |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Column present on every probe table | PASS, 9 `Fix shape to recommend` headers across the 9 probe tables |
| Every probe row carries a non-empty fix-shape cell | PASS, all 35 rows filled (5+8+4+4+3+2+3+1+5) |
| Owner drawn only from the allowed routing set | PASS, 9 `foundations` + 9 `interface` + 17 `sk-code` = 35, one owner per row |
| Rows preserved (acceptance, additive) | PASS, 35 removed + 35 added in the diff, 0 rows lost; symptoms and findings verbatim ("Overflow, clipped layout", "Collapsed container, broken baseline") |
| Overlays prose fix line folded into the column | PASS, the `<dialog>`/popover, measured `position: fixed`, or portal remedy + `sk-code` owner now reads as a column cell, no content lost |
| Section ordering intact | PASS, §8A to §8B to §9 unchanged, no section renumbered |
| Boundary reinforced | PASS, the routing summary states the fix-shape column is advisory, naming the shape to recommend, not a checker |
| Evergreen audit over the new content | PASS, no spec/packet/phase IDs and no `specs/` paths |
| Scope audit | PASS, only `hardening_edge_cases.md` touched, no checker created |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shape, not remedy correctness.** The matrix shape is grep-verifiable: the column is present on every table, every row is filled, and every owner is in the named set. Whether a recommended fix shape is the right remedy for a given surface stays `sk-code` plus human or rendered review, by design.
2. **Content only, no bundled checker.** The column shape is deterministically checkable but this phase ships no validator, because the spec target is the reference doc alone. A matrix lint that enforces column presence and owner vocabulary is the natural follow-up and is out of scope here.
3. **Recommendation, not instruction.** The column names a remediation direction and routes an owner; it does not instruct the audit to harden the surface, and the routing summary states this so the column is not read as a build instruction.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
