---
title: "Verification Checklist: Surgical Fixes to Existing sk-design Modes"
description: "Phase 1 verification checklist covering the five surgical Hallmark-adoption heuristic fixes before any completion claim."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes"
    last_updated_at: "2026-07-22T18:00:04Z"

    last_updated_by: "implementation-agent"
    recent_action: "Verified all acceptance items and the strict packet gate"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item below is checked (`- [x]`) with a concrete artifact, command result, or exemplar. The evidence must remain current for the item to stay complete.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Confirm the `012-sk-design-program/001-research/004-hallmark-design-skill-research` syntheses grounding each of the five workstreams are available and cited. [EVIDENCE: both `research/lineages/sol-codex/research.md` and `research/lineages/sol-opencode/research.md` were read from the related research packet]
- [x] CHK-002 [P1] Confirm the target reference file per workstream is identified and owned by the correct existing mode, with no new mode created. [EVIDENCE: three interface, four audit, and two foundations references in `spec.md` §3 were extended in place]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Confirm all five workstreams are expressed as clean-room ADAPT (independently worded), not verbatim Hallmark text. [EVIDENCE: implementation used only the two research syntheses and independently authored contracts/probes; no `external/hallmark/` path was read]
- [x] CHK-004 [P1] Confirm no probe table copies Hallmark's gate text substantially without an added MIT third-party notice. [EVIDENCE: the nine-row sweep in `design-audit/references/anti-patterns-production.md` was newly written from synthesized concepts with sk-design-native evidence, exception, rationale, severity, and owner language]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Confirm a Tier 0 (typography-only) hero passes the new deletion test on at least one existing exemplar. [EVIDENCE: `styles/library/bundles/ncda/DESIGN.md` identifies a pure-typography hero whose cropped wordmark, copy, spacing, and navigation carry the architectural identity without media]
- [x] CHK-006 [P1] Confirm the CLS-score verification requirement (REQ-005) is engineering-verifiable, not a visual approximation. [EVIDENCE: `typography-system.md` §CLS Proof and `audit-contract.md` §Manual CLS Evidence For Web Fonts require a browser-reported numeric score plus viewport and cache/network conditions]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P0] Confirm all six REQ-NNN rows (REQ-001 through REQ-006) in `spec.md` are satisfied by landed reference-file content. [EVIDENCE: task rows T003-T008 map each requirement to its landed headings across the nine target files]
- [x] CHK-008 [P1] Confirm the responsive proof matrix's orientation/zoom extension (REQ-006) is explicitly flagged as net-new, not attributed to the Hallmark adoption. [EVIDENCE: `layout-responsive.md` §Net-New Orientation And Zoom Extension]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P1] Confirm no new network surface, executable code, or mutation capability is introduced by this documentation-only change. [EVIDENCE: 9/9 implementation targets under `.opencode/skills/sk-design/` are Markdown guidance inside existing reference/procedure files]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P1] Confirm each amended reference file remains correctly cross-referenced from its owning mode's index or `SKILL.md`. [EVIDENCE: `design-interface/SKILL.md`, `design-audit/SKILL.md`, and `design-foundations/SKILL.md` already list the amended references/procedure in their resource maps and reference indexes]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-011 [P1] Confirm no implementation files were created or modified outside the "Files to Change" table in `spec.md` §3; required packet bookkeeping is limited to `tasks.md`, `checklist.md`, and `implementation-summary.md`. [EVIDENCE: nine existing references were updated in place; no new file, mode, command, script, registry row, or fixture was created]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Items | Status |
|---|---|---|
| Pre-Implementation | 2 | Complete |
| Code Quality | 2 | Complete |
| Testing | 2 | Complete |
| Fix Completeness | 2 | Complete |
| Security | 1 | Complete |
| Documentation | 1 | Complete |
| File Organization | 1 | Complete |
| **Total** | **11** | **11/11 complete** |
<!-- /ANCHOR:summary -->
