---
title: "Verification Checklist: Shared Evidence Envelopes"
description: "Verification checklist for the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section; all items pending, planned not implemented."
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/002-evidence-envelopes"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 2 verification checklist (planned)"
    next_safe_action: "Await Phase 1 (001-surgical-fixes) completion, then begin Phase 2 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/design-md-format.md"
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

# Verification Checklist: Shared Evidence Envelopes

<!-- ANCHOR:protocol -->
## Verification Protocol

All items below are unchecked pending Phase 2 implementation. Each item must be marked `[x]` with cited evidence (file:line, command output, or artifact) before this packet's status can move from Planned to Complete. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` before any completion claim.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Confirm Phase 1 (`001-surgical-fixes`) is complete. [EVIDENCE: pending — Phase 1 implementation-summary.md status]
- [ ] CHK-002 [P0] Verify the three cited wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) against current code. [EVIDENCE: pending — line-number confirmation in the touched files]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Owned-asset manifest schema is provider-neutral (no Hallmark-specific fields). [EVIDENCE: pending — manifest schema review]
- [ ] CHK-004 [P0] `motionCharacter` enum introduces no new duration-multiplier tokens and maps only onto existing timing/easing bands. [EVIDENCE: pending — diff review against existing token bands]
- [ ] CHK-005 [P1] Manifest documents Hallmark-precedent fields versus net-new fields (rights, crop/aspect, checksum). [EVIDENCE: pending — manifest field-provenance table]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] Conditional Motion section test confirms the section is emitted when `MotionSystem` evidence is present. [EVIDENCE: pending — test run output]
- [ ] CHK-007 [P0] Conditional Motion section test confirms the section is omitted when no `MotionSystem` evidence is present. [EVIDENCE: pending — test run output]
- [ ] CHK-008 [P1] Interruption/reversal/async proof rules verified against the `motionCharacter` handoff contract. [EVIDENCE: pending — contract review]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P0] All six REQ-NNN requirements in spec.md are satisfied by delivered artifacts. [EVIDENCE: pending — requirement-to-artifact mapping]
- [ ] CHK-010 [P1] All 12 tasks in tasks.md are marked complete with evidence. [EVIDENCE: pending — tasks.md final state]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P0] Manifest contract never hotlinks or bundles Hallmark (or other third-party) binaries. [EVIDENCE: pending — manifest and asset-source review]
- [ ] CHK-012 [P1] No new network or execution surface is introduced by the manifest's source/checksum fields. [EVIDENCE: pending — security review of manifest schema]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] `design-md-format.md` documents the conditional measured Motion section. [EVIDENCE: pending — doc diff]
- [ ] CHK-014 [P1] Licensing note applied: clean-room authorship confirmed, or Hallmark MIT notice added if text is substantially copied. [EVIDENCE: pending — licensing review against `external/hallmark/LICENSE`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] New shared contract docs are placed under an sk-design shared/reference location consistent with existing conventions. [EVIDENCE: pending — file-placement review]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-016 [P0] `validate.sh --strict` reports 0 errors for this spec folder. [EVIDENCE: pending — validate.sh run output]
<!-- /ANCHOR:summary -->
