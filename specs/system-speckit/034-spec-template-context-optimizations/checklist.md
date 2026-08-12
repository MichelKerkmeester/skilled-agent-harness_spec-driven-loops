---
title: "Checklist: Spec-Kit Template & Context Optimizations"
description: "QA checklist for the four-phase implementation of the six 033 recommendations."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-12T12:51:40Z"
    last_updated_by: "claude-code"
    recent_action: "Authored QA checklist"
    next_safe_action: "Work the checklist during phase implementation"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-template-context-optimizations/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item is verified with observed command evidence (exit code / grep / diff) read before it is checked. Reproduce the target symptom first, then prove the fix with the same check. Capture a regression baseline before each phase; re-run the whole gate after.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Open Question 1 (Phase-1 consumer) resolved and the REQ-001 savings claim scoped accordingly.
- [ ] CHK-002 [P0] Open Question 3 (changed-files source for REQ-005) resolved.
- [ ] CHK-003 [P1] Regression baselines captured (renderer snapshots, mcp-server suite, `validate.sh --strict` fleet).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Template changes reuse the existing renderer contract; no new bespoke gating logic.
- [ ] CHK-005 [P1] New `check-scope-adherence.sh` follows the `check-files.sh` rule pattern (fail-closed on missing input).
- [ ] CHK-006 [P1] `memory_search` reuses the shared `enforceTokenBudget` helper, not a reimplementation.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Renderer snapshot tests pass for all levels after REQ-001 and REQ-002.
- [ ] CHK-008 [P0] REQ-002 rendered output byte-identical to baseline (diff-clean).
- [ ] CHK-009 [P0] AC_COVERAGE + scope-adherence fixtures pass/warn as designed.
- [ ] CHK-010 [P0] memory_search budget test: truncation + no-op + metadata; recall unchanged on fixture.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] All P0 requirements (REQ-001, -002, -004, -006) implemented with evidence.
- [ ] CHK-012 [P1] P1 requirements (REQ-003, -005) implemented or explicitly deferred with reason.
- [ ] CHK-013 [P0] No change touches a refuted surface (spec §3 Out of Scope).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P1] No new external calls, credential surfaces, or unbounded network/file access introduced.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P1] `template-guide.md` and `validation-rules.md` updated for the changed behavior.
- [ ] CHK-016 [P1] Rendered-view read path documented (REQ-003).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P1] Scoped diff contains only the files listed in spec §3 Files to Change; no task-created residue.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-018 [P0] Whole authoritative gate re-run per phase; baseline→delta reported.
- [ ] CHK-019 [P0] `validate.sh --strict` clean on this packet before any completion claim.
<!-- /ANCHOR:summary -->
