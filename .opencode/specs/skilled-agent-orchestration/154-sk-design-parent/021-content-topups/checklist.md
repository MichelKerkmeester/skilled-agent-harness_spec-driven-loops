---
title: "Verification Checklist: sk-design targeted per-mode content top-ups"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design content topups checklist"
  - "md-generator wrapper checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/021-content-topups"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Level-2 checklist, all items pending"
    next_safe_action: "Mark items with evidence as the per-mode top-ups land"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-021-content-topups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design targeted per-mode content top-ups

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
- [ ] CHK-003 [P1] The five lineages, the do-not list, and the five packet homes read before authoring
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The md-generator wrapper orchestrates existing tools and never auto-authors or weakens fidelity
- [ ] CHK-011 [P0] The foundations examples are marked illustrative and explicitly not reusable presets
- [ ] CHK-012 [P1] Each per-mode top-up traces to its lineage finding and avoids duplicating existing content
- [ ] CHK-013 [P1] Nothing on the unanimous do-not list (bulk import, mode splitting, redundant basics, fidelity weakening) is added
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `package_skill.py --check` passes (exit 0) on every touched skill
- [ ] CHK-021 [P0] The md-generator wrapper fails at preflight on missing Chromium or unwritable output, not part-way through extraction
- [ ] CHK-022 [P1] A genuinely greenfield redesign prompt routes through the intake to the greenfield path
- [ ] CHK-023 [P1] An audit finding with no rendered evidence is labelled not-assessed in the worksheet
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each top-up is classed `instance-only` to its mode, so each is verified in its own packet
- [ ] CHK-FIX-002 [P0] The full set of five named content gaps is inventoried, so none is skipped and none extra is added
- [ ] CHK-FIX-003 [P0] Consumers of each addition (routers, manual playbooks, the md-generator workflow) are checked where the top-up is wired
- [ ] CHK-FIX-004 [P0] The md-generator wrapper is checked against the no-op (missing dep) and boundary (no auto-author) cases
- [ ] CHK-FIX-005 [P1] The five per-mode additions are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] The greenfield-redesign and not-assessed-audit variants are exercised
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced by the content additions or the wrapper
- [ ] CHK-031 [P0] The md-generator wrapper validates output-path safety before writing any artifact
- [ ] CHK-032 [P1] The non-SaaS exemplar carries no private URLs or credentials
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the implemented top-ups
- [ ] CHK-041 [P1] Each addition is wired into its mode's router or workflow where the lineage requires it
- [ ] CHK-042 [P2] Each mode's manual playbook or README updated if the top-up changes the documented flow
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes confined to the five mode packets
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
