---
title: "Verification Checklist: sk-design unified sk-code handoff schema"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design handoff schema checklist"
  - "design build manifest checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Level-2 checklist, all items pending"
    next_safe_action: "Mark items with evidence as the handoff schema lands"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design unified sk-code handoff schema

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] The four lineages and the four packet homes read before authoring the schema
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] One shared handoff schema exists and the four modes reference it, not four bespoke cards
- [ ] CHK-011 [P0] The audit backlog card routes findings without applying them, preserving the audit-never-fixes boundary
- [ ] CHK-012 [P1] Each per-mode artifact carries its required fields per the lineage shapes
- [ ] CHK-013 [P1] The schema and cards follow the existing sk-design shared and per-packet patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `package_skill.py --check` passes (exit 0) on every touched skill
- [ ] CHK-021 [P0] Each mode's handoff artifact resolves its reference to the shared schema
- [ ] CHK-022 [P1] An audit with zero accepted findings produces an empty-but-valid backlog handoff
- [ ] CHK-023 [P1] A CSS-only motion card records no animation library rather than defaulting to one
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The handoff need is classed `cross-consumer`: it spans four modes, so the shared schema is verified against all four
- [ ] CHK-FIX-002 [P0] The full set of modes that hand to sk-code is inventoried, confirming md-generator is correctly excluded
- [ ] CHK-FIX-003 [P0] Consumers of the shared schema (the four per-mode cards and their SKILL.md references) are updated together
- [ ] CHK-FIX-004 [P0] The audit card is checked against the no-op (zero findings) and boundary (no apply) cases
- [ ] CHK-FIX-005 [P1] The four per-mode field sets are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] The foundations no-data-viz and motion CSS-only variants are exercised
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced by the schema or the per-mode cards
- [ ] CHK-031 [P0] The handoff cards carry no credentials or environment-specific paths
- [ ] CHK-032 [P1] The audit backlog card does not grant any apply or write capability
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the implemented schema and cards
- [ ] CHK-041 [P1] Each mode's SKILL.md references the shared schema where the handoff artifact is loaded
- [ ] CHK-042 [P2] The shared-layer README or index updated to list the new handoff schema
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes confined to the shared layer and the interface, foundations, audit, and motion packets
- [ ] CHK-051 [P1] No stray temp files left in the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
