---
title: "Verification Checklist: sk-design routing and resource-loading wiring"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design routing wiring checklist"
  - "foundations aliases checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Level-2 checklist, all items pending"
    next_safe_action: "Mark items with evidence as the wiring changes land"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design routing and resource-loading wiring

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
- [ ] CHK-003 [P1] The three lineages, the live registry, the routers, and the 014 baseline read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The interface grounding loader is split into own-system grounding and one surface-chosen reference catalog
- [ ] CHK-011 [P0] New foundations and md-generator aliases are precise and do not collide across modes
- [ ] CHK-012 [P1] The foundations TOKENS branch loads cross-axis context plus the parent token vocabulary
- [ ] CHK-013 [P1] The registry stays the single source of truth for aliases
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The routing benchmark rerun confirms resource recall holds for the affected modes
- [ ] CHK-021 [P0] Wasted-load counts drop for audit and md-generator versus the 014 baseline
- [ ] CHK-022 [P1] A generic design-token prompt still routes to foundations, not md-generator
- [ ] CHK-023 [P1] An app-surface grounding prompt loads Mobbin and a web prompt loads Refero, not both
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each wiring change is classed: the grounding split and TOKENS load are `algorithmic`, the alias additions are `cross-consumer` across the registry and routers
- [ ] CHK-FIX-002 [P0] The full set of owned-but-unexposed foundations aliases is inventoried, so none is left out
- [ ] CHK-FIX-003 [P0] Consumers of the changed resource maps and aliases (routers, benchmark, manual playbooks) are checked together
- [ ] CHK-FIX-004 [P0] New aliases are tested against collision cases (generic design-token, design system) so they route only to the owning mode
- [ ] CHK-FIX-005 [P1] The benchmark axes (affected modes by intent) are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] The single-axis token prompt and the surface-split grounding variants are exercised
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced by the registry or router changes
- [ ] CHK-031 [P0] Paid real-world reference lookup stays optional and non-blocking after the grounding split
- [ ] CHK-032 [P1] No resource-map branch loads a path outside its packet except the already-allowed shared resources
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the implemented wiring
- [ ] CHK-041 [P1] Each affected mode's manual playbook expected resources updated to match the new branches and aliases
- [ ] CHK-042 [P2] The hub routing notes updated if the grounding split changes the documented flow
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes confined to the registry and the interface, foundations, and md-generator packets
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
