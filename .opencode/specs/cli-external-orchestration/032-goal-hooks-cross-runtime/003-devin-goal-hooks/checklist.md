---
title: "Verification Checklist: Devin goal hooks"
description: "Verification Date: pending — phase not yet implemented"
trigger_phrases:
  - "devin goal hooks checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase checklist for Devin goal hook adapters"
    next_safe_action: "Implement after phase 002 fixes the Stop-hook parity tier"
    blockers:
      - "Phase 002 capability-probe matrix must land before adapter code starts."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook can block/continue per the phase 002 probe (undetermined)."
    answered_questions: []
---
# Verification Checklist: Devin goal hooks

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

- [ ] CHK-001 [P0] Requirements documented in spec.md [evidence: pending — phase not yet implemented]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [evidence: pending — phase not yet implemented]
- [ ] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability-probe matrix) [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All three Devin adapters import only the phase 001 goal core, not `mk-goal.js` internals. [evidence: pending — phase not yet implemented]
- [ ] CHK-011 [P0] `Stop` adapter's parity tier matches phase 002's actual probe result, not an assumption. [evidence: pending — phase not yet implemented]
- [ ] CHK-012 [P1] `.devin/hooks.v1.json` registration is additive-only (no existing entries modified). [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Co-located `node --test` adapter suite passes. [evidence: pending — phase not yet implemented]
- [ ] CHK-021 [P0] Live `devin -p` smoke session confirms `UserPromptSubmit` injection. [evidence: pending — phase not yet implemented]
- [ ] CHK-022 [P0] Live `devin -p` smoke session confirms `SessionStart` restore. [evidence: pending — phase not yet implemented]
- [ ] CHK-023 [P1] `Stop` verify (and continue, if applicable) tested against a real turn. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Finding class identified: this is new-adapter-authoring, not a fix to an existing consumer set. [evidence: pending — phase not yet implemented]
- [ ] CHK-FIX-002 [P1] Consumer inventory (every place a `.devin/hooks.v1.json` registration or `goal-core.cjs` import must land) is complete before implementation starts. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials introduced in adapter code or `.devin/hooks.v1.json`. [evidence: pending — phase not yet implemented]
- [ ] CHK-031 [P0] Adapter failures fail open (never block a Devin turn or session start). [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work. [evidence: pending — phase not yet implemented]
- [ ] CHK-041 [P1] implementation-summary.md states the shipped `Stop` hook parity tier honestly (verify-only vs verify-and-continue). [evidence: pending — phase not yet implemented]
- [ ] CHK-042 [P1] All touched/new documentation passes `validate_document.py`. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files left in the repo outside the scratchpad. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending — phase not yet implemented
<!-- /ANCHOR:summary -->
