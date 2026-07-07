---
title: "Verification Checklist: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/016-sk-code-rituals"
    last_updated_at: "2026-06-15T14:06:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-sk-code/z_archive/016-sk-code-rituals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements (REQ-001..REQ-005) documented in spec.md and traced to recs B4/B5/#11
- [ ] CHK-002 [P0] Technical approach (additive, verification-section-confined) defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified - confirmed None (point-of-use ritual)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `check-comment-hygiene.sh` finds zero violations in any added code snippet (no spec paths / artifact ids in comments; durable WHY only)
- [ ] CHK-011 [P0] `git diff` shows edits confined to the verification section; §2 smart-router text byte-untouched
- [ ] CHK-012 [P1] Verification-section net growth stays within budget (~40 lines) so the skill stays scannable
- [ ] CHK-013 [P1] Ritual wording follows the skill's existing two-register, instructional voice (no AI filler)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Mutation-check present: grep of `sk-code/SKILL.md` finds the break-it-to-prove-the-test-bites instruction AND the true-RED vs compile-RED distinction (REQ-001)
- [ ] CHK-021 [P0] Ladder present: grep finds all four rungs (unit / in-memory / on-server / live) with a named blind spot for each (REQ-002)
- [ ] CHK-022 [P0] Doctrine present: grep finds the decision-economy named-seam / never-a-dead-control language and the fail-closed-by-construction statement (REQ-004)
- [ ] CHK-023 [P0] No-regression: smart-router surface detection, intent classification, and Verification Commands table behave identically after the edit (REQ-003)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: this phase is `instance-only` advisory-text augmentation of one read surface, not a code bug fix (no class-of-bug / cross-consumer / algorithmic surface applies).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: producer grep confirms no pre-existing mutation-check / ladder / fail-closed text to reconcile in `sk-code/SKILL.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory done: confirmed no doc hard-codes the verification-section line numbers (`rg 'sk-code/SKILL.md' .opencode --glob '*.md'`); no code symbol changes.
- [ ] CHK-FIX-004 [P0] Adversarial cases addressed in spec edge-cases: UNKNOWN-stack (no test runner), pure-config (no code to break), tautological assertion, compile-RED-as-true-RED, dead-control-passing.
- [ ] CHK-FIX-005 [P1] Matrix axes listed (surface WEBFLOW/OPENCODE/UNKNOWN x rung applicability) before completion (OQ-2 mapping noted).
- [ ] CHK-FIX-006 [P1] No process-wide state read by this change; hostile-env variant not applicable (documentation-only).
- [ ] CHK-FIX-007 [P1] Evidence pinned to the implementing diff/SHA of `sk-code/SKILL.md`, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, credentials, or tokens in any added snippet (NFR-S01)
- [ ] CHK-031 [P1] Input validation not applicable - no executable input path is added (documentation-only)
- [ ] CHK-032 [P1] Auth/authz not applicable - no access-control surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md synchronized; `validate.sh --strict` PASSES
- [ ] CHK-041 [P1] Ritual text is concrete and instructional (no `[TODO]`/`TBD`/placeholder; durable WHY in any snippet)
- [ ] CHK-042 [P2] `constitutional/README.md` index updated only if OQ-1 promotes a standalone rule (else marked N/A)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Any working notes / drafts kept in this phase's `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion is claimed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-15 (PLANNED - this phase is not yet implemented; checks verified at implementation time)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

