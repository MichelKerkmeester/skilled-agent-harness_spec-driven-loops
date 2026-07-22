---
title: "Verification Checklist: Shared Evidence Envelopes"
description: "Verified checklist for the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes"
    last_updated_at: "2026-07-22T18:24:07Z"

    last_updated_by: "implementation-agent"
    recent_action: "Completed all evidence-envelope verification gates"
    next_safe_action: "None; packet verification is complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md"
      - ".opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md"
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

# Verification Checklist: Shared Evidence Envelopes

<!-- ANCHOR:protocol -->
## Verification Protocol

Each completed item cites a concrete artifact or command result. The strict packet gate passed after the evidence was reconciled.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Confirm Phase 1 (`001-surgical-fixes`) is complete. [EVIDENCE: predecessor implementation summary reports Complete; predecessor checklist is 11/11]
- [x] CHK-002 [P0] Verify the three cited wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) against current code. [EVIDENCE: live inspection found capability declaration at `schema-v3.ts:146`, durationScale gate at line 490, `MotionSystem` at `types.ts:260`, and zero pre-existing Motion content in the format reference]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Owned-asset manifest schema is provider-neutral (no Hallmark-specific fields). [EVIDENCE: `owned-asset-manifest.md:23` uses only generic asset/source/rights/placement/digest fields]
- [x] CHK-004 [P0] `motionCharacter` enum introduces no new duration-multiplier tokens and maps only onto existing timing/easing bands. [EVIDENCE: motion handoff §1 maps four semantic values to the existing 100-150/200-300/300-500ms bands and existing easing/material rules]
- [x] CHK-005 [P1] Manifest documents Hallmark-precedent fields versus net-new fields (rights, crop/aspect, checksum). [EVIDENCE: `owned-asset-manifest.md:99` distinguishes direct precedent, globally expressed rights promoted to per-asset evidence, and net-new crop/aspect plus checksum]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Conditional Motion section test confirms the section is emitted when `MotionSystem` evidence is present. [EVIDENCE: `schema-v3.test.ts`, `formatters-v3.test.ts`, and `build-write-prompt.test.ts`; full Vitest run passed 171/171]
- [x] CHK-007 [P0] Conditional Motion section test confirms the section is omitted when no `MotionSystem` evidence is present. [EVIDENCE: phrase-only fixture in `schema-v3.test.ts` remains omitted and unexpected output is rejected in `validate.test.ts`; full Vitest run passed 171/171]
- [x] CHK-008 [P1] Interruption/reversal/async proof rules verified against the `motionCharacter` handoff contract. [EVIDENCE: motion handoff §§3-4 cover rapid reversal, retriggering, hover/focus delays, state-machine guards, rollback, retry, cancellation, and reduced motion]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P0] All six REQ-NNN requirements in spec.md are satisfied by delivered artifacts. [EVIDENCE: `owned-asset-manifest.md:21`, `motion-character-handoff.md:17`, `schema-v3.test.ts:162`, and `validate.test.ts:298` map the six requirements to verified artifacts]
- [x] CHK-010 [P1] All 12 tasks in tasks.md are marked complete with evidence. [EVIDENCE: `tasks.md` contains 12 checked task rows with artifact or command evidence]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-011 [P0] Manifest contract never hotlinks or bundles Hallmark (or other third-party) binaries. [EVIDENCE: `owned-asset-manifest.md:21` explicitly prohibits hotlinking, copying, bundling, caching, or redistributing Hallmark and unverified third-party binaries]
- [x] CHK-012 [P1] No new network or execution surface is introduced by the manifest's source/checksum fields. [EVIDENCE: `owned-asset-manifest.md:97` prohibits auto-fetch and execution]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-013 [P1] `design-md-format.md` documents the conditional measured Motion section. [EVIDENCE: format reference §12 defines the detector gate, exact measured fields, omission rules, locked pre-rendering, and validator behavior]
- [x] CHK-014 [P1] Licensing note applied: clean-room authorship confirmed, or Hallmark MIT notice added if text is substantially copied. [EVIDENCE: `owned-asset-manifest.md:101` and `motion-character-handoff.md:78` record independent authorship and the no-copy boundary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-015 [P1] New shared contract docs are placed under an sk-design shared/reference location consistent with existing conventions. [EVIDENCE: approved pair created under `.opencode/skills/sk-design/shared/evidence-envelopes/`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-016 [P0] `validate.sh --strict` reports 0 errors for this spec folder. [EVIDENCE: strict validation exited 0 with `Summary: Errors: 0 Warnings: 0` and `RESULT: PASSED`]
<!-- /ANCHOR:summary -->
