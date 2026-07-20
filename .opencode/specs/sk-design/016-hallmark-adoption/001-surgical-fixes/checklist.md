---
title: "Verification Checklist: Surgical Fixes to Existing sk-design Modes"
description: "Phase 1 verification checklist covering the five surgical Hallmark-adoption heuristic fixes before any completion claim."
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/001-surgical-fixes"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 1 verification checklist (planned)"
    next_safe_action: "Begin Phase 1 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/"
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

# Verification Checklist: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item below is unchecked (`- [ ]`) because this packet is Planned; nothing has been built yet. Each item carries an `[EVIDENCE: pending proof]` placeholder that must be replaced with a real artifact (file path, command output, or exemplar reference) before it may be checked `- [x]`, per the Completion Verification Rule.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Confirm the `014-hallmark-design-skill-research` syntheses grounding each of the five workstreams are available and cited. [EVIDENCE: pending proof]
- [ ] CHK-002 [P1] Confirm the target reference file per workstream is identified and owned by the correct existing mode, with no new mode created. [EVIDENCE: pending proof]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Confirm all five workstreams are expressed as clean-room ADAPT (independently worded), not verbatim Hallmark text. [EVIDENCE: pending proof]
- [ ] CHK-004 [P1] Confirm no probe table copies Hallmark's gate text substantially without an added MIT third-party notice. [EVIDENCE: pending proof]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Confirm a Tier 0 (typography-only) hero passes the new deletion test on at least one existing exemplar. [EVIDENCE: pending proof]
- [ ] CHK-006 [P1] Confirm the CLS-score verification requirement (REQ-005) is engineering-verifiable, not a visual approximation. [EVIDENCE: pending proof]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Confirm all six REQ-NNN rows (REQ-001 through REQ-006) in `spec.md` are satisfied by landed reference-file content. [EVIDENCE: pending proof]
- [ ] CHK-008 [P1] Confirm the responsive proof matrix's orientation/zoom extension (REQ-006) is explicitly flagged as net-new, not attributed to the Hallmark adoption. [EVIDENCE: pending proof]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P1] Confirm no new network surface, executable code, or mutation capability is introduced by this documentation-only change. [EVIDENCE: pending proof]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Confirm each amended reference file remains correctly cross-referenced from its owning mode's index or `SKILL.md`. [EVIDENCE: pending proof]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Confirm no files were created or modified outside the "Files to Change" table in `spec.md` §3. [EVIDENCE: pending proof]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Items | Status |
|---|---|---|
| Pre-Implementation | 2 | Pending |
| Code Quality | 2 | Pending |
| Testing | 2 | Pending |
| Fix Completeness | 2 | Pending |
| Security | 1 | Pending |
| Documentation | 1 | Pending |
| File Organization | 1 | Pending |
| **Total** | **11** | **0/11 complete (Planned)** |
<!-- /ANCHOR:summary -->
