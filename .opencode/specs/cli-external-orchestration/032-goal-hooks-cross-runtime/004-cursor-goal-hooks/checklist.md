---
title: "Verification Checklist: Cursor goal hooks"
description: "Verification Date: pending — phase not yet implemented"
trigger_phrases:
  - "cursor goal hooks checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-28T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec, plan, tasks, checklist, implementation-summary"
    next_safe_action: "Wait for phase 002's capability matrix before starting Phase 1"
    blockers:
      - "Depends on phase 002's capability-probe matrix for the preToolUse refresh cadence decision."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cursor goal hooks

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
- [ ] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability matrix) [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Adapters import only phase 001's `lib/goal-core.cjs` and Node builtins. [evidence: pending — phase not yet implemented]
- [ ] CHK-011 [P0] Every adapter fails open on a simulated goal-core error. [evidence: pending — phase not yet implemented]
- [ ] CHK-012 [P1] Code follows the established `.opencode/hooks/<concern>/<runtime>/` adapter pattern. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `session-start.cjs` unit tests pass, including fail-open case. [evidence: pending — phase not yet implemented]
- [ ] CHK-021 [P0] `session-end.cjs` unit tests pass for met, unmet, and fail-open cases. [evidence: pending — phase not yet implemented]
- [ ] CHK-022 [P1] `pre-tool-use.cjs` unit tests pass, if built per phase 002's finding. [evidence: pending — phase not yet implemented]
- [ ] CHK-023 [P0] Live smoke proof: goal text reaching the model in a real `cursor-agent -p` or editor session. [evidence: pending — phase not yet implemented]
- [ ] CHK-024 [P0] `.cursor/hooks.json` hooks confirmed firing live, not just parsing. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P2] Finding class: N/A — this phase has not been built yet, so no fix-completeness findings exist. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced. [evidence: pending — phase not yet implemented]
- [ ] CHK-031 [P0] Fail-open behavior verified never blocks or degrades the shared editor session. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the actual completed work. [evidence: pending — phase not yet implemented]
- [ ] CHK-041 [P1] `implementation-summary.md` reflects real build state, including any `preToolUse` scope narrowing. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files left in the spec folder outside the scratchpad. [evidence: pending — phase not yet implemented]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending — phase not yet implemented
<!-- /ANCHOR:summary -->
