---
title: "Verification Checklist: sk-vision 007 Pi input.images auto-inspect"
description: "Verification Date: 2026-08-16"
trigger_phrases:
  - "sk-vision 007 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 007 checklist skeleton."
    next_safe_action: "Fill with evidence at closeout."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 007 Pi input.images auto-inspect

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
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Evidence: bounded preload pattern in `plan.md` Architecture.
- [ ] CHK-003 [P1] Dependencies identified and available. Evidence: pi `on("input")` + `event.images` confirmed in installed docs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks. Evidence: `bun run build` in vision-runtime regression.
- [ ] CHK-011 [P0] No console errors or warnings. Evidence: `pi --offline --approve` session output.
- [ ] CHK-012 [P1] Error handling implemented. Evidence: handler try/catch → `continue`; never raises.
- [ ] CHK-013 [P1] Code follows project patterns. Evidence: mirrors `AttachmentInjector` in `src/opencode/attachments.ts`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met. Evidence: REQ-001..006 mapped in `implementation-summary.md`.
- [ ] CHK-021 [P0] Manual testing complete. Evidence: `pi --offline --approve` exit 0; optional live attach-image smoke recorded.
- [ ] CHK-022 [P1] Edge cases tested. Evidence: extension-source and steer-stream passthrough guards read.
- [ ] CHK-023 [P1] Error scenarios validated. Evidence: timeout path returns `continue` by design; forced-error smoke if feasible.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: `feature-completion`. Evidence: closes the recorded P1 gap in `.pi/extensions/README.md`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory. Evidence: OpenCode `AttachmentInjector` is the analog producer.
- [ ] CHK-FIX-003 [P0] Consumer inventory. Evidence: Pi interactive and RPC input paths consume the hook.
- [ ] CHK-FIX-004 [P0] Adversarial table. Evidence: unbounded-await and raise-on-input rows listed in `spec.md` risks.
- [ ] CHK-FIX-005 [P1] Matrix axes listed. Evidence: source (interactive/rpc/extension) × streaming (steer/followUp/undefined) matrix in copy pack.
- [ ] CHK-FIX-006 [P1] Hostile env variant. Evidence: cold model cache → timeout → silent continue.
- [ ] CHK-FIX-007 [P1] Evidence pinned. Evidence: `rg` proofs + session output in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Evidence: no credentials added; images handled via existing helpers.
- [ ] CHK-031 [P0] Input validation implemented. Evidence: image source validated via `makeImageSource`; bbox/params unchanged.
- [ ] CHK-032 [P1] Auth/authz working correctly. Evidence: local-first runtime; no new trust boundary.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: REQ/task numbering matches across docs.
- [ ] CHK-041 [P1] Code comments adequate. Evidence: handler comments explain the 2s race and never-raise rule.
- [ ] CHK-042 [P2] README updated (if applicable). Evidence: `.pi/extensions/README.md` gap note replaced.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files outside this child's `scratch/`.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Evidence: sweep at closeout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] All checklist items marked `[x]` or explicitly deferred with reasons.
- [ ] This child `validate.sh --strict` exits 0.
<!-- /ANCHOR:summary -->
