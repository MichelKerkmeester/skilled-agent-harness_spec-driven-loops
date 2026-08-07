---
title: "Verification Checklist: Deep-command @general + setup hard-blocker gates"
description: "Verification Date: 2026-06-07"
trigger_phrases:
  - "deep command gate checklist"
  - "phase 0 gate checklist"
  - "unskippable setup checklist"
  - "deep command hard blocker verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/007-deep-command-gate-hardening"
    last_updated_at: "2026-06-07T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked verification items with grep evidence"
    next_safe_action: "Reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-007-deep-command-gate-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep-command @general + setup hard-blocker gates

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..006 + Given/When/Then
- [x] CHK-002 [P0] Technical approach defined in plan.md — uniform two-gate preamble
- [x] CHK-003 [P1] Dependencies identified — canonical Phase 0 block, existing setup phases
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — markdown intact; fenced Phase 0 blocks well-formed
- [x] CHK-011 [P0] No console errors or warnings — N/A; static command docs
- [x] CHK-012 [P1] Error handling implemented — Gate 1 hard-block path + Gate 2 fail-fast (:auto) documented
- [x] CHK-013 [P1] Code follows project patterns — copies the established model-benchmark Phase 0 pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — 7/7 Phase 0; 2 BLOCKED markers each; restart lines correct
- [x] CHK-021 [P0] Manual testing complete — read each command top; gates precede setup precede execution
- [x] CHK-022 [P1] Edge cases tested — skill-benchmark thin structure handled; agent-improvement left conformant
- [x] CHK-023 [P1] Error scenarios validated — fail-fast (:auto) + STOP/wait (:confirm) language present
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `cross-consumer` (gate missing/weak across multiple deep commands)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — surveyed all 7 deep commands; 5 missing Phase 0, box broken in 1
- [x] CHK-FIX-003 [P0] Consumer inventory — all 7 command entrypoints covered; agent-improvement already conformant
- [x] CHK-FIX-004 [P0] Security/path/parser cases — N/A; prompt-doc change only
- [x] CHK-FIX-005 [P1] Matrix axes — axis: command {7}; gate {Phase 0, setup}; all present
- [x] CHK-FIX-006 [P1] Hostile env/global-state — N/A
- [x] CHK-FIX-007 [P1] Evidence pinned — grep against working-tree command files
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none introduced
- [x] CHK-031 [P0] Input validation implemented — Gate 2 blocks execution on unresolved inputs
- [x] CHK-032 [P1] Auth/authz working correctly — Gate 1 asserts orchestrator (@general) context before dispatch
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the 7-command gate set
- [x] CHK-041 [P1] Code comments adequate — gates are self-documenting STATUS:☐ BLOCKED blocks
- [x] CHK-042 [P2] README updated — N/A; command-level change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no stray temp files
- [x] CHK-051 [P1] scratch/ cleaned before completion — scratch/ holds only .gitkeep
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-07
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
