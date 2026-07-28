---
title: "Verification Checklist: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Verification Date: pending — phase not yet implemented"
trigger_phrases:
  - "pi goal extension checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-28T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist for the Pi goal extension"
    next_safe_action: "Await phase 001 and phase 002 completion before verifying any item"
    blockers:
      - "Blocked on phase 001 (goal core) and phase 002 (capability matrix)."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi goal extension (input-transform injection, session_start restore, turn-end verify)

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
- [ ] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability matrix, `cli-pi`) [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `goal-context.ts` imports only phase 001's goal core; no duplicated state/render/hardening logic. [evidence: pending — phase not yet implemented]
- [ ] CHK-011 [P0] `.pi/extensions/goal-context.ts` is a relative symlink resolving to the real file at `.opencode/hooks/goal/pi/goal-context.ts`. [evidence: pending — phase not yet implemented]
- [ ] CHK-012 [P0] All in-file imports resolve correctly against the symlink's directory (not its realpath), per the proven precedent. [evidence: pending — phase not yet implemented]
- [ ] CHK-013 [P1] Git history preserved on the real file (no delete+add masquerading as a move). [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Co-located `node --test` suite passes for `goal-context.ts`'s state/render/import logic. [evidence: pending — phase not yet implemented]
- [ ] CHK-021 [P0] Live smoke proof (`pi --offline -p` or `pi -p`) shows the `[active_goal]` brief visibly present in the chat transcript. [evidence: pending — phase not yet implemented]
- [ ] CHK-022 [P1] Live `session_start` restore verified with pre-existing active-goal state. [evidence: pending — phase not yet implemented]
- [ ] CHK-023 [P1] Turn-end verify tested if phase 002 confirmed a usable event; otherwise its absence is confirmed documented, not silently claimed. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Finding class: this phase is a `net-new adapter`, not a fix to an existing consumer. [evidence: pending — phase not yet implemented]
- [ ] CHK-FIX-002 [P1] Consumer inventory: the only consumer of the symlink target is Pi's own fixed auto-discovery directory (`.pi/extensions/`); no other runtime or config references this file. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials introduced by the extension or its symlink. [evidence: pending — phase not yet implemented]
- [ ] CHK-031 [P0] Shared active-goal state file read/write hygiene (0600, atomic temp+rename) preserved via phase 001's core, not re-implemented insecurely here. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work once implemented. [evidence: pending — phase not yet implemented]
- [ ] CHK-041 [P1] `implementation-summary.md` honestly states whether turn-end verify shipped or was omitted per phase 002's verdict. [evidence: pending — phase not yet implemented]
- [ ] CHK-042 [P1] All touched/new documentation in this folder reports 0 issues via `validate_document.py`. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files left in the repo outside the scratchpad. [evidence: pending — phase not yet implemented]
- [ ] CHK-051 [P1] Only `.opencode/hooks/goal/pi/goal-context.ts` (+ tests) and the single `.pi/extensions/goal-context.ts` symlink are added by this phase — no unrelated extension touched. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending — phase not yet implemented
<!-- /ANCHOR:summary -->
