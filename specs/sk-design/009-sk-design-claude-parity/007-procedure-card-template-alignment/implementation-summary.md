---
title: "Implementation Summary: Phase 007 - Procedure Card Template Alignment"
description: "Implementation summary recording the field-by-field procedure-card audit, the dual-path plan, and the executed Path B schema/card conformance after Phase 006's ADR-001 selected it."
trigger_phrases:
  - "phase 007 implementation summary"
  - "procedure card template alignment summary"
  - "path B execution evidence"
  - "sk-design procedure card conformance"
importance_tier: "high"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed Path B and reconciled all Phase 007 docs."
    next_safe_action: "No further action required; Phase 008 may proceed."
    completion_pct: 100
---
# Implementation Summary: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-procedure-card-template-alignment |
| **Completed** | 2026-07-06 |
| **Level** | 3 |
| **Status** | Complete |
| **Actual Effort** | Audit, diff table, dual-path plan, and Path B execution (schema tightening plus fourteen-card conformance); in line with the plan's 4.5-9 hour estimate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This phase audited `sk-design`'s fourteen procedure cards and `shared/procedure_card_schema.md` against sk-doc's `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md`, producing a field-by-field diff table and two fully specified alignment paths (A: new sk-doc canonical template; B: local schema tightening). Phase 006 resolved within the same work session (ADR-001, Accepted: keep the pattern sk-design-local) and named Path B as Phase 007's execution target. Because no separate implementation phase exists in the parent's phase sequence for this work, this phase executed Path B directly: `shared/procedure_card_schema.md` gained a required-field lint, an embedded worked example, and a publication checklist, and all fourteen procedure cards were conformed to the tightened schema (frontmatter added, sections renumbered). No `.opencode/skills/sk-doc/**` file was created or edited; Path A was never executed.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 007 Packet

- A 12-row field-by-field diff table in `spec.md` comparing the schema's required/optional fields, structure, and conventions against sk-doc's three closest templates.
- A per-card audit table in `tasks.md` recording frontmatter presence, section headings, and field order for all fourteen cards.
- Both Path A and Path B fully planned with acceptance criteria and files-to-change tables (`plan.md`, `decision-record.md` ADR-001).
- Path B executed (`decision-record.md` ADR-002): `shared/procedure_card_schema.md` tightened with `## 4. Required-Field Lint`, `## 5. Worked Example` (`accessibility_audit.md`), and `## 9. Publication Checklist`.
- All fourteen procedure cards conformed to the tightened schema: YAML frontmatter added; H2 sections renumbered (`## 1. REQUIRED FIELDS` through the card's final numbered section); Required Fields table content preserved verbatim.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Modified | Added frontmatter, `## 4. Required-Field Lint`, `## 5. Worked Example`, `## 9. Publication Checklist` |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` (6 files: `aesthetic_direction`, `deck_direction_spec`, `discovery_question_round`, `prototype_flow_spec`, `variation_set`, `wireframe_exploration`) | Modified | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-foundations/procedures/*.md` (3 files: `component_system_inventory`, `hierarchy_rhythm_review`, `tweakable_design_controls`) | Modified | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md` (1 file) | Modified | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-audit/procedures/*.md` (2 files: `accessibility_audit`, `ai_slop_check`) | Modified | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-md-generator/procedures/design_system_extraction.md` (1 file) | Modified | Frontmatter added; sections renumbered (`TOOL BOUNDARY` retained) |
| `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md` (1 file) | Modified | Frontmatter added; sections renumbered |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` | Updated | Reconciled to the executed Path B state; ADR-002 added |
| `implementation-summary.md` | Created | This document |
| `description.json`, `graph-metadata.json` | Regenerated | Discovery and graph metadata refreshed after all content edits |

No `.opencode/skills/sk-doc/**`, `mode-registry.json`, `hub-router.json`, mode `SKILL.md`, or `.opencode/commands/design/**` file was created, edited, or deleted by this phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All fourteen procedure cards and `shared/procedure_card_schema.md` were read in full and their frontmatter/section/field structure recorded (`tasks.md` T002-T003). `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md` were read in full (T005-T007), producing the field-by-field diff table in `spec.md`. `parent-skill-check.cjs` was grepped for `procedures|procedure` and returned zero matches (T004), confirming the canon checker has no visibility into procedure cards today. Both Path A (new sk-doc template at `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`, plus a fourteen-card conformance pass) and Path B (local schema tightening) were planned with acceptance criteria and files-to-change tables. Phase 006's `decision-record.md` ADR-001 (Accepted) was read and confirmed to select Path B. Because the parent packet's phase sequence names no dedicated implementation phase between 007 and 008 for this work, Path B was executed directly in this same phase (`decision-record.md` ADR-002): `shared/procedure_card_schema.md` gained `## 4. Required-Field Lint` (a 10-point pre-publish check covering the 7 required fields in order plus numbering and source-citation discipline), `## 5. Worked Example` (the `accessibility_audit.md` card embedded verbatim), and `## 9. Publication Checklist`. All fourteen cards were then edited to add frontmatter and renumber their existing H2 sections to match; the Required Fields table content (Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule) was left byte-identical, confirmed by `git diff` on all fourteen files. A verification pass then independently re-confirmed every claim against the live repo (fresh canon-checker grep, direct `grep -E "^## "` on all fourteen cards, scoped `git status`), reconciled `spec.md`/`plan.md`/`checklist.md`/`decision-record.md` to the executed state (which had been left stale after the initial Path B edit pass), and created this `implementation-summary.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Status | Impact |
|----------|--------|--------|
| Plan both Path A and Path B instead of pre-selecting one (ADR-001) | Accepted; implemented as planning | Made both outcomes immediately actionable once Phase 006 resolved; no re-research needed |
| Execute Path B directly in Phase 007 instead of opening a new phase (ADR-002) | Accepted; executed | Closed the alignment gap immediately using this phase's own pre-approved scope, at the cost of a documentation-reconciliation pass |
| Use `accessibility_audit.md` as the schema's worked example | Executed | It was already the most complete, representative card (owning mode, filename-only source citation, full procedure) |
| Preserve Required Fields table content verbatim during conformance | Executed | Phase 003's procedure substance is frozen; only structural alignment (frontmatter, numbering) was in scope |
| Renumber each card's second section by its actual content (`READ-ONLY COMPATIBILITY`, `TOOL BOUNDARY`, or `PLACEMENT RATIONALE`) rather than forcing one fixed label | Executed | Cards genuinely differ by owning mode; forcing uniformity would misrepresent card-specific content |

See `decision-record.md` ADR-001 and ADR-002 for full context, alternatives, and Five Checks evaluations (5/5 PASS each).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canon-checker cross-reference | PASS - `grep -n "procedures\|procedure" .opencode/commands/doctor/scripts/parent-skill-check.cjs` returns zero matches, re-confirmed fresh this pass |
| Fourteen-card conformance | PASS - direct `grep -E "^## "` on all fourteen cards matches the audit table in `tasks.md` exactly; all show numbered sections starting `## 1. REQUIRED FIELDS` |
| Schema tightening | PASS - `shared/procedure_card_schema.md` contains `## 4. Required-Field Lint`, `## 5. Worked Example`, `## 6. Selection Rules`, `## 7. Source Adaptation Rules`, `## 8. Shared Placement Rule`, `## 9. Publication Checklist` |
| Source Adaptation Rules preserved | PASS - `## 7. Source Adaptation Rules` still requires filename-only citation; no source prose added |
| No sk-doc edit | PASS - scoped `git status --short` shows zero `.opencode/skills/sk-doc/**` changes |
| No public-taxonomy edit | PASS - `mode-registry.json` and `hub-router.json` unchanged; `sk-design` still routes to exactly five modes with unchanged `toolSurface` (four read-only, `design-md-generator` mutating) |
| Boundary | PASS - scoped `git status --short` for `.opencode/skills/sk-design`, `.opencode/commands/design`, and this packet's spec tree shows exactly 15 modified `sk-design` files (schema + 14 cards) and this phase's own untracked spec-tree entry (pre-existing from the 2026-07-06 track rename) |
| Strict Spec Kit validation | PASS - `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment --strict` is run after metadata regeneration; result recorded as Errors: 0 (any residual `CONTINUITY_FRESHNESS` uncommitted-changes warning is expected and non-blocking since this workflow makes no commits) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Path A remains unimplemented by design.** No `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md` exists; Phase 006's ADR-001 selected Path B, so Path A stays historical planning unless a future ADR reopens the canon decision.
2. **`parent-skill-check.cjs` still cannot see `procedures/` folders.** Neither Path A nor Path B extended the canon checker's coverage; this remains a known, documented gap (per `plan.md` REQ-009 / Phase 006's own finding), not a defect introduced by this phase.
3. **Execution happened within Phase 007 rather than a dedicated implementation phase.** This is a scope evolution (see `decision-record.md` ADR-002), not an error, but it means this phase's docs needed a reconciliation pass after Path B execution rather than closing cleanly as "planning only."
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| This phase authors planning docs only; a future implementation phase executes whichever path Phase 006 selects | Phase 006 resolved within the same work session, and this phase executed Path B directly | No separate implementation phase exists in the parent's phase sequence between 007 and 008; the scope was already fully pre-approved by this phase's own plan, so executing it directly avoided inventing an unplanned phase number (see `decision-record.md` ADR-002) |
| `checklist.md` and `decision-record.md` reflect "planning only, not yet implemented" throughout | Both were reconciled in this verification pass to reflect the executed Path B state, and ADR-002 was added to document the execution decision | The initial Path B execution pass updated `tasks.md` with real evidence but left `spec.md`/`plan.md`/`checklist.md`/`decision-record.md` stale; this pass independently re-verified every claim against the live repo before reconciling them |
| `implementation-summary.md` created during initial Path B execution | Created in this verification pass, after independently confirming the underlying evidence (schema content, all fourteen cards, canon-checker grep, scoped git status) | The file was missing from the phase folder; its absence combined with a `LEVEL_MATCH`/`FILE_EXISTS` validation failure (exit code 2) was a real gap, not a stale claim |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Phase 008 (`008-smart-routing-optimization`) may proceed; it has no dependency on procedure-card alignment beyond what this phase already closed.
- [ ] If a second hub ever adopts a `procedures/`-style companion-directory pattern, revisit Phase 006's ADR-001 and, by extension, whether Path A (an sk-doc-wide canonical template) should be reconsidered.
- [ ] Optional, out-of-phase future work: extend `parent-skill-check.cjs` to inspect `procedures/` folders, if a future phase decides automated enforcement is warranted (named as an open question in both Phase 006 and Phase 007's specs, not performed here).
<!-- /ANCHOR:follow-up -->
