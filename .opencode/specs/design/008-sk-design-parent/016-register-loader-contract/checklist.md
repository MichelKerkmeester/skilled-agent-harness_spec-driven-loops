---
title: "Verification Checklist: sk-design shared-register loader contract"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design register loader checklist"
  - "shared register preload checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/016-register-loader-contract"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all items against the implemented gate sanction and DEFAULT_RESOURCE register loading"
    next_safe_action: "Move to 017 real bugs"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-016-register-loader-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design shared-register loader contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The motion, audit and interface lineage evidence read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The mechanism is an explicit allowlist scoped to the sibling `shared/` dir, with no broad guard relaxation. An adversarial fixture confirms a non-shared escape still fails
- [x] CHK-011 [P0] No mode double-loads the register. It sits in `DEFAULT_RESOURCE` only, not also in `RESOURCE_MAP`, so it is routed once
- [x] CHK-012 [P1] Each touched router's `RESOURCE_BASES` and routing note agree that the shared register loads
- [x] CHK-013 [P1] The change uses the standard always-loaded `DEFAULT_RESOURCE` slot, consistent with the existing router pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The router replay confirms the register loads on every task for interface, foundations, motion and audit, with 0 missing
- [x] CHK-021 [P0] `package_skill.py --check` passes (exit 0) on every touched mode
- [x] CHK-022 [P1] The register is a routing preamble consulted before the route decision, so loading it on every task (including a route-away) is correct by design, not a forced preload. Representative intent routes were exercised per mode
- [x] CHK-023 [P1] The missing-register failure surfaces visibly. A sanctioned-but-missing file is reported as a dead resource path P0, not silently skipped (adversarial fixture)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The defect is cross-consumer and the fix is verified against all mandating modes, not one (interface, foundations, motion, audit)
- [x] CHK-FIX-002 [P0] All five modes were inventoried for the register mandate. Four mandate it and were fixed; md-generator does not and was left untouched
- [x] CHK-FIX-003 [P0] The loader-contract consumers (the four mode routers) are updated together. The manual playbook gold-credit for the register is a fixture-scoring concern reclassified to 020, and no gold scenario contradicts the contract today
- [x] CHK-FIX-004 [P0] The gate change carries adversarial checks: a genuine outside-root escape still fails, the sanctioned `shared/` path passes, and a missing sanctioned file still fails. The sanction is the sibling `shared/` dir (the family's cross-packet docs home), broader than the scaffold's register-only guess and intentionally so
- [x] CHK-FIX-005 [P1] The verified axes are the four mandating modes by their always-loaded slot, listed in the implementation summary
- [x] CHK-FIX-006 [P1] The missing-register and escape variants are exercised by the adversarial fixtures, not just the happy path
- [x] CHK-FIX-007 [P1] Evidence is pinned to the committed diff for this packet, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the routing change
- [x] CHK-031 [P0] The gate is a static router-hygiene check, not a runtime sandbox. It now sanctions the sibling `shared/` dir only; arbitrary parent reads (a non-shared `../` path) still fail, confirmed by an adversarial fixture
- [x] CHK-032 [P1] The sanction was reviewed against the live gate logic and the separator-bounded containment that stops a sibling dir sharing the root name prefix
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md stay synchronized with the chosen mechanism
- [x] CHK-041 [P1] The manual playbook gold-credit for the register is reclassified to 020 with rationale, since the register loads as a default and no scenario contradicts it
- [x] CHK-042 [P2] The interface routing note was corrected; no hub README flow change was needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes confined to the connectivity gate and the four mode packets, plus this packet's docs
- [x] CHK-051 [P1] No stray temp files left in the packet (the adversarial fixtures live in the session scratchpad, not the repo)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-27
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
