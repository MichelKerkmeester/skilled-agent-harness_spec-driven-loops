---
title: "Verification Checklist: Headless / subagent enforce scoping [template:level_2/checklist.md]"
description: "Verification checklist for the spec-gate headless/subagent enforce-scoping fix (WS4)"
trigger_phrases:
  - "headless enforce checklist"
  - "spec gate verification checklist"
  - "child session deny verification"
  - "who can deny checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/004-headless-enforce-scoping"
    last_updated_at: "2026-07-11T11:05:57.825Z"
    last_updated_by: "spec-author"
    recent_action: "Created Level 2 verification checklist for WS4"
    next_safe_action: "Hand off to implementation; verify items with evidence during the fix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".claude/settings.json"
      - ".opencode/bin/worktree-session.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-headless-enforce-scoping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 4 — Headless / subagent enforce scoping

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-006 with Given/When/Then acceptance)
- [ ] CHK-002 [P0] Technical approach and child-detection design choice defined in plan.md
- [ ] CHK-003 [P1] `AI_SESSION_CHILD` convention and both adapter env-forwarding paths confirmed by grep
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Child detection lives inside the single core deny predicate; the plugin is not edited to override the decision
- [ ] CHK-011 [P0] OpenCode plugin stays default-export-only and writes no stdout/stderr
- [ ] CHK-012 [P1] `isChildSession` matches exact `'1'` (parity with `worktree-session.sh:71`); non-`1` values are not children
- [ ] CHK-013 [P1] Code follows project patterns; no artifact ids / spec paths in code comments (comment hygiene)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] SC-001 verified: child/dispatched session (or `AI_SESSION_CHILD=1`) → advise, never deny, with enforce on
- [ ] CHK-021 [P0] SC-002 verified: interactive session (no child signal) → deny with enforce on and gate open
- [ ] CHK-022 [P1] `AI_SESSION_CHILD` value variants ({`''`,`0`,`true`,`yes`,`2`}) tested as interactive (not child)
- [ ] CHK-023 [P1] Adapter test: `tool.execute.before` with `AI_SESSION_CHILD=1` + enforce + open gate → no throw
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (only `evaluateMutation` produces `deny`).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed predicate: both adapters forward env and inherit suppression; no other consumer widens deny.
- [ ] CHK-FIX-004 [P0] Env-precedence variant tests include disabled-outranks-all, child-suppresses-deny, non-`1` child value, and fail-open-on-throw cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (DISABLED x ENFORCE x AI_SESSION_CHILD x status x tool).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed - tests set env explicitly per call and do not leak `process.env` state across cases.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Deny predicate never widened: `DENY_CAPABLE_TOOLS` stays `{write, edit}`; child detection only narrows
- [ ] CHK-032 [P1] Kill-switch precedence preserved: `MK_SPEC_GATE_DISABLED=1` returns `allow` before child/enforce logic; fail-open holds on any throw
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Who-can-deny scoping documented in plugin + bin READMEs (single deny surface = interactive, enforce on, no child signal)
- [ ] CHK-042 [P2] cli-external dispatch patterns/templates updated to export `MK_SPEC_GATE_ENFORCE=0`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No `mcp_server/` dist rebuilt; classifier dist consumed as-is
- [ ] CHK-051 [P1] Temp files in scratch/ only; scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: TBD (planning stage - not yet implemented)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
