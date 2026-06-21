---
title: "Verification Checklist: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-21"
trigger_phrases:
  - "rename verification"
  - "sk-design-interface checklist"
  - "skill-graph verify"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/153-sk-design-interface-rename"
    last_updated_at: "2026-06-21T08:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 verification checklist"
    next_safe_action: "Mark items with evidence after execution"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-rename"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Rename sk-interface-design skill to sk-design-interface across the framework

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified (advisor daemon, skill-graph.sqlite, shared git index)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `skill_id` equals new folder basename (folder-name guard does not throw)
- [ ] CHK-011 [P0] No dangling symlink; `readlink` resolves to existing target
- [ ] CHK-012 [P1] All `graph-metadata.json` key_files/entities paths point at new dir
- [ ] CHK-013 [P1] Edits follow existing metadata/prose patterns (no structural drift)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..007)
- [ ] CHK-021 [P0] `skill_graph_scan` rebuild succeeds; `skill_graph_validate` + `advisor_validate` pass
- [ ] CHK-022 [P1] sqlite shows new node + 6 reciprocal edges; old node absent
- [ ] CHK-023 [P1] `advisor_recommend` routes design prompt to `sk-design-interface`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (all cross-skill edges + prose found via rg).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the renamed id (sqlite edges + graph-metadata + prose + descriptions.json).
- [ ] CHK-FIX-004 [P0] Path-handling cases covered: filesystem move vs name-string vs symlink target vs graph edge.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: live-vs-historical × name-vs-path × edge-vs-prose.
- [ ] CHK-FIX-006 [P1] Reciprocal-edge symmetry checked in the rebuilt graph (no UNKNOWN-TARGET).
- [ ] CHK-FIX-007 [P1] Evidence pinned to concrete grep/sqlite output, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets touched
- [ ] CHK-031 [P0] Graph mutation runs trusted (`requireTrustedCaller`); no untrusted scan path
- [ ] CHK-032 [P1] No broad cross-session commit (scoped staging only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/impl-summary synchronized
- [ ] CHK-041 [P1] Cross-skill co-load mandates corrected (mcp-open-design GATE, mcp-figma handoff)
- [ ] CHK-042 [P2] Root + index READMEs updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 2/11 |
| P1 Items | 12 | 1/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-21
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
