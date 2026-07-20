---
title: "Verification Checklist: Brand-First Authoring Lane"
description: "Verification checklist for the brand-first authoring lane, covering the hard boundary, overwrite policy, and reviewed-conversion gate before any completion claim (planned; not implemented)."
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/004-brand-first-lane"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 4 verification checklist (planned)"
    next_safe_action: "Await Phase 3 (003-authored-cards) completion, then begin Phase 4 implementation per tasks.md"
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

# Verification Checklist: Brand-First Authoring Lane

<!-- ANCHOR:protocol -->
## Verification Protocol

This packet is Planned; no implementation exists yet. Every item below is unchecked and carries a `[EVIDENCE: pending — ...]` note describing the proof that will be required once Phase 4 is built. Do not check any item, and do not claim completion, until the described evidence exists and `validate.sh --strict` passes.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 3 (`003-authored-cards`) is complete and its authored-vs-measured precedent is confirmed reusable. [EVIDENCE: pending — `../003-authored-cards/implementation-summary.md` Status = Complete]
- [ ] CHK-002 [P0] spec.md REQ-001..REQ-006 and the HARD BOUNDARY invariant are approved before implementation begins. [EVIDENCE: pending — spec.md sign-off]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The distinct authored artifact template and provenance schema follow existing `sk-design` asset conventions. [EVIDENCE: pending — code review of the new template/schema files]
- [ ] CHK-004 [P1] Overwrite-policy and reviewed-conversion-gate logic contain no path that writes an authored value directly into a measured file. [EVIDENCE: pending — code review plus a static check for measured-file write paths]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Adversarial tests proving no code path writes an authored/invented value into DESIGN.md, tokens.json, or the styles corpus outside the reviewed-conversion gate all pass. [EVIDENCE: pending — test run output]
- [ ] CHK-006 [P0] Overwrite-policy tests confirming re-runs never mutate measured artifacts and only refresh the authored artifact's exports section all pass. [EVIDENCE: pending — test run output]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Tasks T001-T008 in `tasks.md` are all complete and checked, with the distinct artifact, provenance schema, overwrite policy, and reviewed-conversion gate all implemented. [EVIDENCE: pending — tasks.md final state]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-008 [P0] The reviewed-conversion gate requires an explicit human review action; no automated `verified=true` or silent promotion path exists. [EVIDENCE: pending — gate implementation review plus an adversarial test]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-009 [P1] A licensing note is present: Hallmark MIT clean-room adoption; the MIT notice is added only if the artifact schema substantially copies Hallmark's design.md/provenance format; external assets remain out of scope. [EVIDENCE: pending — spec.md / implementation-summary.md licensing note]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-010 [P1] New files live under the planned `.opencode/skills/sk-design/` locations named in `spec.md` Files to Change, with no stray or duplicate artifacts. [EVIDENCE: pending — file listing checked against spec.md Files to Change table]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Items | Status |
|---|---|---|
| Pre-Implementation | 2 | Pending |
| Code Quality | 2 | Pending |
| Testing | 2 | Pending |
| Fix Completeness | 1 | Pending |
| Security | 1 | Pending |
| Documentation | 1 | Pending |
| File Organization | 1 | Pending |
| **Total** | **10** | **0/10 complete (Planned)** |
<!-- /ANCHOR:summary -->
