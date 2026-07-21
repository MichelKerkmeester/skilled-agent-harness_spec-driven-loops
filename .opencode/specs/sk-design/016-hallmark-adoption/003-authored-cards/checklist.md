---
title: "Verification Checklist: Authored Structural-Fingerprint Cards"
description: "Planned verification checklist for the Phase 3 structural-fingerprint card set; all items pending, nothing executed yet."
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/003-authored-cards"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 3 verification checklist (planned)"
    next_safe_action: "Await Phase 2 (002-evidence-envelopes) completion, then begin Phase 3 implementation per"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Authored Structural-Fingerprint Cards

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist targets the Phase 3 implementation described in `plan.md` and `tasks.md`. Status is Planned, so every item below is unchecked (`- [ ]`). Each item will require file-path, grep-output, or `validate.sh` evidence at completion time -- no item may be checked from intent alone.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 2 (`002-evidence-envelopes`) stamp/evidence mechanism confirmed available, or an interim stamp shape explicitly documented as a stand-in. [EVIDENCE: pending -- link to 002 `implementation-summary.md` or an interim decision note]
- [ ] CHK-002 [P0] Responsive-collapse decision (single shared gate, not baked per card) confirmed recorded in `spec.md` REQ-003 with rationale before card authoring begins. [EVIDENCE: pending -- `spec.md` Scope / REQ-003 review]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Each of the 6-8 cards is self-contained (readable without loading any other card) and independently authored, with no verbatim Hallmark prose. [EVIDENCE: pending -- manual diff review against Hallmark source files]
- [ ] CHK-004 [P0] The index references cards only by id plus a one-line applicability hint; it does not embed full card content. [EVIDENCE: pending -- `index.md` content review]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Targeted grep for the 21 macrostructure titles, the N1-N13/Ft1-Ft8 codes, and the 20-name theme catalog across all new files returns zero hits. [EVIDENCE: pending -- grep command output]
- [ ] CHK-006 [P1] Manual per-card review confirms all seven required fields are present on every card. [EVIDENCE: pending -- reviewer checklist per card]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Exactly 6-8 cards authored (not fewer, not an unbounded catalog), with unique, non-duplicate applicability guards. [EVIDENCE: pending -- card count and applicability-guard diff]
- [ ] CHK-008 [P1] Stamp-based diversification check demonstrably excludes previously-used cards on a second selection pass (dry-run walkthrough). [EVIDENCE: pending -- dry-run walkthrough notes]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P1] No executable code, network calls, or new write paths are introduced by the reference content. [EVIDENCE: pending -- file-type and content review]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P0] `sk-design/SKILL.md` updated to point at the new load-on-demand index. [EVIDENCE: pending -- diff of `SKILL.md`]
- [ ] CHK-011 [P1] Licensing note present in `spec.md` Scope/Risks and `implementation-summary.md` Key Decisions, confirming architecture-only adoption and no MIT notice obligation. [EVIDENCE: pending -- `spec.md` §6 and `implementation-summary.md` Key Decisions review]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] All new files live under `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/`; no files are created outside the `spec.md` §3 Files to Change table. [EVIDENCE: pending -- file listing diff against `spec.md` §3]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending -- 0 of 12 items verified. Verification begins only after Phase 3 implementation starts, which is itself blocked on Phase 2 (`002-evidence-envelopes`) completion.
<!-- /ANCHOR:summary -->
