---
title: "Verification Checklist: Phase 6 advisor-and-integration"
description: "Level-2 verification checklist for the class-aware referrer sweep and advisor-graph regeneration, pending execution."
trigger_phrases:
  - "advisor integration checklist"
  - "referrer sweep verification"
  - "phase 006 verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the Level-2 sweep verification checklist"
    next_safe_action: "Verify each item when the sweep executes"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 6 advisor-and-integration

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

- [ ] CHK-001 [P0] Requirements documented in spec.md, including the logical-name do-not-touch class
- [ ] CHK-002 [P0] Technical approach and the class-aware sweep defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified (phase 005 landed; advisor rebuild command available)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The `skill_advisor.py` edits pass the repo's Python lint/format
- [ ] CHK-011 [P0] No console errors from the advisor after the alias-map repoint
- [ ] CHK-012 [P1] The sweep edits are surgical, line-by-line, not file-wide replaces
- [ ] CHK-013 [P1] The repoint follows existing path-template conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (functional + constitutional repointed, graph regenerated)
- [ ] CHK-021 [P0] The CI card-sync gate passes against the new layout
- [ ] CHK-022 [P1] The stale-path grep sweep is clean outside `cli-external/` and historical text
- [ ] CHK-023 [P1] The logical-name no-op grep confirms executor-kind strings are unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every functional and constitutional path referrer is repointed; no old flat path resolves at runtime
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced by the sweep edits
- [ ] CHK-031 [P0] The constitutional cli-dispatch preload rule still enforces reading the SKILL.md before dispatch
- [ ] CHK-032 [P1] No auth/authz surface touched by the sweep
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized on the class-aware sweep
- [ ] CHK-041 [P1] Historical spec/changelog prose left intact; only live references repointed
- [ ] CHK-042 [P2] READMEs and install guides reflect the nested packet paths
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `skill-graph.json` regenerated from metadata, not hand-edited
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
