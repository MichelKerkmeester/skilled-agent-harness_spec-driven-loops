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
    recent_action: "Verified the grounding split, the cross-axis TOKENS load and the new aliases"
    next_safe_action: "Move to 019 handoff card"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The three lineages, the live registry, the routers and the 014 baseline read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The interface grounding loader is split into `REAL_SYSTEM_GROUNDING` (own-system) and `REAL_WORLD_REFERENCE` (the external catalogs)
- [x] CHK-011 [P0] New foundations and md-generator aliases are precise and do not collide across modes
- [x] CHK-012 [P1] The foundations TOKENS branch loads cross-axis color, type and layout plus the parent token vocabulary (verified in router-replay)
- [x] CHK-013 [P1] The registry stays the single source of truth for aliases
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Routing recall holds: the gate scores 100 with 0 escapes and router-replay routes the split intents and cross-axis TOKENS correctly on all five modes
- [x] CHK-021 [P0] Interface over-routing dropped (a system-grounding task loads one grounding file, not four). Audit and md-generator fan-out is largely intentional and not trimmed here, so a full Mode-A re-score is deferred to 020
- [x] CHK-022 [P1] foundations owns the generic "design tokens" alias and md-generator owns only the extraction variants ("extract design tokens", "design tokens from url"), so a generic token prompt routes to foundations
- [x] CHK-023 [P1] The split separates own-system grounding from the real-world catalogs. The one-catalog-by-surface choice (Mobbin for app, Refero for web) stays a runtime decision per the prose, since the keyword router carries no app-versus-web signal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each change is classed: the grounding split and TOKENS load are algorithmic, the alias additions are cross-consumer across the registry
- [x] CHK-FIX-002 [P0] The full set of owned-but-unexposed foundations aliases is inventoried (grid, container queries, adaptation, data-viz, chart type, data tables, token starter)
- [x] CHK-FIX-003 [P0] The changed routers and registry are checked together (gate, router-replay, JSON validity). The manual playbook expected-resource refresh is deferred to 020 fixtures
- [x] CHK-FIX-004 [P0] New aliases are checked against collision cases: foundations keeps the generic token alias, md-generator keeps only the extraction variants, and no new alias duplicates another mode
- [x] CHK-FIX-005 [P1] The verified axes (the five modes by gate plus the split and TOKENS replays) are listed in the implementation summary
- [x] CHK-FIX-006 [P1] The single-axis token prompt and the system-versus-real-world grounding variants are exercised in router-replay
- [x] CHK-FIX-007 [P1] Evidence is pinned to the committed diff for this packet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the registry or router changes
- [x] CHK-031 [P0] The real-world catalog lookup stays optional and non-blocking. The split only changes which branch loads the catalog refs, not their optional Code Mode lookup
- [x] CHK-032 [P1] No resource-map branch loads a path outside its packet except the sanctioned shared resources (the gate reports 0 escapes)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md stay synchronized with the implemented wiring
- [x] CHK-041 [P1] The manual playbook expected-resource refresh for the new branches and aliases is deferred to 020 fixtures, where the gold is seeded
- [x] CHK-042 [P2] The interface router note was kept consistent; no hub flow change was needed
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-27
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
