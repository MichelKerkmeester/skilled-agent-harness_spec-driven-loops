---
title: "Verification Checklist: Phase 5 foldin-cli-claude-code"
description: "Level-2 verification checklist for the atomic cli-claude-code fold-in, identity dissolution, and hub-aware scorer rewrite, pending execution."
trigger_phrases:
  - "foldin cli-claude-code checklist"
  - "scorer rewrite verification"
  - "phase 005 verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the Level-2 fold-in verification checklist"
    next_safe_action: "Verify each item when the atomic bundle executes"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-cli-claude-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5 foldin-cli-claude-code

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

- [ ] CHK-001 [P0] Requirements documented in spec.md, including the atomic-bundle gating
- [ ] CHK-002 [P0] Technical approach and scorer contract defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified (phase 004 landed; hub mode-registry exists)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Rewritten scorer type-checks and the dist reflects the source
- [ ] CHK-011 [P0] No console errors or warnings introduced by the scorer rewrite
- [ ] CHK-012 [P1] The scorer falls through to no-match (not throw) on an unknown executor
- [ ] CHK-013 [P1] The rewrite follows the existing scorer patterns; no unrelated refactor
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (move, one identity, hub-aware scorer, fixtures green)
- [ ] CHK-021 [P0] `tests/scorer/executor-delegation.vitest.ts` is green
- [ ] CHK-022 [P0] Parity fixtures re-baselined to the real 11 cases: 6 `cli-opencode`, 2 `cli-claude-code`; the 2 `sk-code` + 1 `none` negatives stay green; no scenario resolves to `cli-external`
- [ ] CHK-023 [P1] A delegation prompt resolves the correct executor-kind string with no silent degradation
- [ ] CHK-024 [P1] A link-resolve check confirms cli-claude-code's rewritten relative paths resolve, and the card-sync CI gate is green
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The silent-degradation root cause is fixed at source: the scorer sources from the hub mode-registry (no hub-id noun), not the family filter
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in the scorer or fixtures
- [ ] CHK-031 [P0] The self-invocation guard survives unchanged, including its intentional asymmetry
- [ ] CHK-032 [P1] The fail-open hook resolves cli-claude-code from the hub path after the fold
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized on the atomic-bundle contract
- [ ] CHK-041 [P1] The scorer change carries a durable WHY comment, no ephemeral markers
- [ ] CHK-042 [P2] Packet-local docs that named the old flat identity are flagged for the phase 006 sweep
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Exactly one `graph-metadata.json` remains under `cli-external/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
