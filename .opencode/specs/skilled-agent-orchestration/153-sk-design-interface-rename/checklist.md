---
title: "Verification Checklist: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-21"
trigger_phrases:
  - "rename verification"
  - "design-interface checklist"
  - "skill-graph verify"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/153-sk-design-interface-rename"
    last_updated_at: "2026-06-21T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified rename against live graph"
    next_safe_action: "Verify packet 153 closure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-rename"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-010 [P0] `skill_id` equals new folder basename (graph scan did not throw; node `sk-design-interface` present)
- [x] CHK-011 [P0] No dangling symlink; `readlink` → `../skills/sk-design-interface/changelog` resolves
- [x] CHK-012 [P1] All `graph-metadata.json` key_files/entities paths point at new dir (0 old-name in skill dir)
- [x] CHK-013 [P1] Edits follow existing metadata/prose patterns (name-only replace; git detected renames)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..007)
- [x] CHK-021 [P0] `skill_graph_validate`: isValid true, 0 errors; `skill_graph_scan` succeeded
- [x] CHK-022 [P1] sqlite shows new node + 6 reciprocal edges; old node absent
- [x] CHK-023 [P1] `advisor_recommend` routed design prompt to `sk-design-interface` (confidence 0.95)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (skill id referenced by sibling edges, prose, registry, history).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (all cross-skill edges + prose found via rg).
- [x] CHK-FIX-003 [P0] Consumer inventory completed (sqlite edges + graph-metadata + prose + descriptions.json + AGENTS.md).
- [x] CHK-FIX-004 [P0] Path-handling cases covered: filesystem move, name-string, symlink target, graph edge.
- [x] CHK-FIX-005 [P1] Matrix axes covered: live-vs-historical × name-vs-path × edge-vs-prose.
- [x] CHK-FIX-006 [P1] Reciprocal-edge symmetry checked in rebuilt graph (no UNKNOWN-TARGET drop; pre-existing mcp-open-design asymmetry preserved, not introduced).
- [x] CHK-FIX-007 [P1] Evidence pinned to sqlite/rg output + commit SHAs (8ba686c04a, 2aaec599fb, cffa3e056f).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets touched
- [x] CHK-031 [P0] Graph mutation ran trusted (`skill_graph_scan` in-session); no untrusted scan path
- [x] CHK-032 [P1] No broad cross-session commit (scoped checkpoint commits; foreign-path checks clean)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/impl-summary synchronized
- [x] CHK-041 [P1] Cross-skill co-load mandates corrected (mcp-open-design GATE, mcp-figma handoff, AGENTS.md)
- [x] CHK-042 [P2] Root + index READMEs updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ or /tmp only
- [x] CHK-051 [P1] scratch/ clean (only .gitkeep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-21
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
