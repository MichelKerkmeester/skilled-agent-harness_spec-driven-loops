---
title: "Verification Checklist: sk-vision 009 manual testing playbook"
description: "Verification Date: 2026-08-16"
trigger_phrases:
  - "sk-vision 009 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 009 checklist skeleton."
    next_safe_action: "Fill with evidence at closeout."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-009-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 009 manual testing playbook

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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001..REQ-006 in `spec.md` section 4.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Evidence: corpus-first flow in `plan.md`.
- [ ] CHK-003 [P1] Dependencies identified and available. Evidence: 008 catalog entries + sk-doc templates on disk.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks. Evidence: docs-only child; gate is `validate.sh --strict` + shared validators.
- [ ] CHK-011 [P0] No console errors or warnings. Evidence: validator outputs exit 0.
- [ ] CHK-012 [P1] Error handling implemented. Evidence: failure triage present in every scenario contract.
- [ ] CHK-013 [P1] Code follows project patterns. Evidence: packages match other skills' playbook shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met. Evidence: REQ-001..006 mapped in `implementation-summary.md`.
- [ ] CHK-021 [P0] Manual testing complete. Evidence: prompt-sync and ID-parity checks pass.
- [ ] CHK-022 [P1] Edge cases tested. Evidence: error-path scenarios (bad bbox, missing file) included.
- [ ] CHK-023 [P1] Error scenarios validated. Evidence: SKIP-with-blocker convention documented and used when applicable.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: `documentation-gap`. Evidence: skill had no operator validation corpus before this child.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory. Evidence: 16 scenarios enumerated from the catalog.
- [ ] CHK-FIX-003 [P0] Consumer inventory. Evidence: operators and release reviews consume the corpus.
- [ ] CHK-FIX-004 [P0] Adversarial table. Evidence: prompt-drift rows listed in `spec.md` risks.
- [ ] CHK-FIX-005 [P1] Matrix axes listed. Evidence: category × scenario-ID matrix in copy pack.
- [ ] CHK-FIX-006 [P1] Hostile env variant. Evidence: no-GPU/no-cache environment → SKIP with named blocker.
- [ ] CHK-FIX-007 [P1] Evidence pinned. Evidence: validator outputs in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Evidence: no secrets in scenario prompts or commands.
- [ ] CHK-031 [P0] Input validation implemented. Evidence: scenarios use only local images and documented commands.
- [ ] CHK-032 [P1] Auth/authz working correctly. Evidence: destructive scenarios isolated with recovery guidance.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: REQ/task numbering matches across docs.
- [ ] CHK-041 [P1] Code comments adequate. Evidence: N/A — no code authored.
- [ ] CHK-042 [P2] README updated (if applicable). Evidence: benchmark/README authored as part of the scaffold.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Evidence: fixture images land in this child's `scratch/`.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Evidence: sweep at closeout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] All checklist items marked `[x]` or explicitly deferred with reasons.
- [ ] This child `validate.sh --strict` exits 0.
<!-- /ANCHOR:summary -->
