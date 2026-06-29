---
title: "Verification Checklist: Recommended fix-shape column for the hardening matrix"
description: "Verification checklist for the additive recommend-only fix-shape + owner column across the audit hardening matrix."
trigger_phrases:
  - "harden fix shape column checklist"
  - "hardening matrix fix shape verification"
  - "audit fix shape recommend checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/009-harden-fix-shapes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all checklist items verified; recompute counts and set verification date"
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
      - "Matrix shape is grep-checkable (column per table, owner per row); remedy correctness stays sk-code plus human review"
      - "No checker shipped this phase; the spec target is the reference doc alone and names no validator"
---
# Verification Checklist: Recommended fix-shape column for the hardening matrix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Target file and its eight probe tables read and mapped
  - **Evidence**: read in full; nine probe tables mapped including the §8B Device and Constrained Context table; the three current columns Probe/Symptom/Finding confirmed
- [x] CHK-002 [P0] Owner vocabulary confirmed from the routing summary and audit findings schema
  - **Evidence**: routing summary point 3 confirms `foundations`/`interface`/`sk-code` plus the named a11y route `assets/a11y_quick_fixes.md` and evidence route `accessibility_performance.md`
- [x] CHK-003 [P1] Fix-shape grammar agreed: remedy pattern plus owner, no implementation code
  - **Evidence**: every cell is "remedy pattern. Owner: `x`."; no step-by-step code in any row

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fix-completeness: every probe row in all eight tables carries a non-empty fix-shape cell
  - **Evidence**: all 35 rows filled across the nine probe tables (5+8+4+4+3+2+3+1+5)
- [x] CHK-011 [P0] Every fix-shape cell names an owner drawn only from the allowed routing vocabulary
  - **Evidence**: 9 `foundations` + 9 `interface` + 17 `sk-code` = 35, one owner per row, no token outside the set
- [x] CHK-012 [P1] Fix shapes are remedy patterns, not implementation code or step-by-step instructions
  - **Evidence**: cells recommend a remedy direction and route an owner; no implementation code in any row
- [x] CHK-013 [P1] New copy is content-first and consistent with the file's existing voice
  - **Evidence**: the column reads in the file's recommend-and-route voice; intro line updated to name the fix shape as the fourth element

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance met: each edge-case row carries a recommended fix shape and owner (deterministic shape)
  - **Evidence**: 35/35 rows carry a non-empty fix-shape cell with an owner
- [x] CHK-021 [P0] Matrix check executed: structural column-presence and owner-vocabulary verified by read plus grep
  - **Evidence**: grep returns 9 `Fix shape to recommend` headers across the 9 probe tables and 35 owner tokens all in the allowed set
- [x] CHK-022 [P1] Overlays section prose fix-shape line normalized into the column with no content loss
  - **Evidence**: the `<dialog>`/popover, measured `position: fixed`, or portal remedy + `sk-code` owner now reads as a column cell; no content lost
- [x] CHK-023 [P1] Honest enforcement recorded: structural shape is checkable, no checker shipped this phase, fix correctness stays advisory
  - **Evidence**: routing summary point 4 names the column advisory; spec, plan, tasks, and impl-summary all record the shape-vs-remedy-correctness split

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: matrix/evidence — this phase adds a recommend-only column to an audit matrix and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: the change set is one additive edit of one file; an evergreen grep over the new column finds no IDs or `specs/` paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the column is read by an auditor recommending a remedy, not by code; no script, fixture, or sibling reference consumes it, so nothing downstream changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable — content only, no parser/path/redaction logic ships; the deterministic surface is the column-presence and owner-token grep
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 9 probe tables × the column, 35 probe rows total (5+8+4+4+3+2+3+1+5), each row one fix shape + owner
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code or test reads process-wide state this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Evidence**: evidence pins to the `Fix shape to recommend` column in `hardening_edge_cases.md`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Audit/implement boundary intact: no row instructs the audit to harden the surface itself
  - **Evidence**: cells recommend a remedy shape and route an owner; the routing summary keeps "the audit proves the gap and names the owner, it does not harden the surface"
- [x] CHK-031 [P0] Fix correctness explicitly remains `sk-code` work after user acceptance
  - **Evidence**: the file intro and routing summary point 4 keep implementation as `sk-code` work after the user accepts the fix
- [x] CHK-032 [P1] No implementation detail leaks that would let the recommend-only artifact be read as a build instruction
  - **Evidence**: fix shapes name remedy patterns, not code or step-by-step instructions; the column is scoped advisory

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen: no spec IDs, packet numbers or ephemeral paths in the new content
  - **Evidence**: an evergreen grep over the new column returns no `specs/` paths and no packet/phase IDs
- [x] CHK-041 [P1] Spec/plan/tasks synchronized with the shipped column
  - **Evidence**: spec, plan, tasks, checklist, and implementation-summary all name the column on nine tables, 35 rows, owners in the allowed set, recommend-only
- [x] CHK-042 [P2] Routing summary or intro reinforces that the new column is a recommendation
  - **Evidence**: routing summary point 4 states the fix-shape column is advisory, naming the shape to recommend, not a checker or proof the remedy is correct

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] No-regression: existing Probe / Symptom / Finding columns and surrounding prose preserved
  - **Evidence**: 35 rows reformatted to gain the column, 0 rows lost; symptoms and findings verbatim ("Overflow, clipped layout", "Collapsed container, broken baseline"); §8A to §8B to §9 ordering intact
- [x] CHK-051 [P1] Only the target file changed; no sibling reference edited
  - **Evidence**: only `hardening_edge_cases.md` modified; no sibling design-audit reference touched

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator — verified against the delivered `Fix shape to recommend` column (9 headers across 9 probe tables, 35 rows filled, 9 `foundations` + 9 `interface` + 17 `sk-code` owners, §8A to §8B to §9 ordering intact)

<!-- /ANCHOR:summary -->
