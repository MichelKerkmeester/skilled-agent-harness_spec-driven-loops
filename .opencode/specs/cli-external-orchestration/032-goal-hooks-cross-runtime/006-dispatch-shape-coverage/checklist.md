---
title: "Verification Checklist: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Verification Date: pending — phase not yet implemented"
trigger_phrases:
  - "dispatch shape coverage checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 2 checklist scaffold for dispatch-shape coverage"
    next_safe_action: "Mark items complete only after tasks.md Phase 3 tasks run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

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
- [ ] CHK-003 [P1] Dependencies identified and available (`dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, Codex adapter, 4 cli-* SKILL.md files) [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `evaluate()`'s real severity-mapping branch read and quoted verbatim before any edit. [evidence: pending — phase not yet implemented]
- [ ] CHK-011 [P0] Three new `DISPATCH_SHAPES` entries (devin, cursor, pi) added with word-boundary-anchored regexes matching the pattern of the existing `opencode run`/`claude -p` entries. [evidence: pending — phase not yet implemented]
- [ ] CHK-012 [P0] `CODEX_EXEC_SHAPE` folded into the shared registry with zero remaining local duplicate. [evidence: pending — phase not yet implemented]
- [ ] CHK-013 [P0] `severity: error` -> `block`/`warn` mapping implemented as an explicit branch, not an implicit fallthrough. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Matching/non-matching regression test pair added for the devin shape. [evidence: pending — phase not yet implemented]
- [ ] CHK-021 [P0] Matching/non-matching regression test pair added for the cursor shape. [evidence: pending — phase not yet implemented]
- [ ] CHK-022 [P0] Matching/non-matching regression test pair added for the pi shape. [evidence: pending — phase not yet implemented]
- [ ] CHK-023 [P0] Matching/non-matching regression test pair added confirming the codex shape resolves from the shared registry alone. [evidence: pending — phase not yet implemented]
- [ ] CHK-024 [P0] Test asserting the exact resulting `severity` field for an `error`-severity rule. [evidence: pending — phase not yet implemented]
- [ ] CHK-025 [P1] Full dispatch-family suite re-run (not only new tests); pre-existing `opencode run`/`claude -p` coverage unregressed. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: this is a `cross-consumer` change (the Codex adapter's local shape and the shared registry both need to reflect the same source of truth), not an instance-only change. [evidence: pending — phase not yet implemented]
- [ ] CHK-FIX-002 [P0] Consumer inventory covers every reader of `DISPATCH_SHAPES`/`DISPATCH_SKILLS`: the shared registry itself, the Codex adapter's local composition, and any other adapter reading `DISPATCH_SHAPES` directly (e.g. the Pi preflight-lint adapter, confirmed reading `audit.DISPATCH_SHAPES`). [evidence: pending — phase not yet implemented]
- [ ] CHK-FIX-003 [P1] Matrix axes: 4 CLIs (devin, cursor, pi, codex) x match/non-match regression case each. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced (regex/branch-logic changes only). [evidence: pending — phase not yet implemented]
- [ ] CHK-031 [P1] `scrubSecrets`/`SECRET_PATTERNS` in `dispatch-audit.mjs` left unmodified by this phase; no new unredacted field introduced by the new shape entries. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work once implemented. [evidence: pending — phase not yet implemented]
- [ ] CHK-041 [P1] `implementation-summary.md` discloses the CHECKS-function gap honestly (three missing check IDs named, not implied as activated). [evidence: pending — phase not yet implemented]
- [ ] CHK-042 [P2] `.opencode/hooks/dispatch/README.md` updated if the shared-registry description needs a devin/cursor/pi/codex mention. [evidence: pending — phase not yet implemented]
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
| P0 Items | 14 | 0/14 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending — phase not yet implemented
<!-- /ANCHOR:summary -->
