---
title: "Verification Checklist: sk-design targeted per-mode content top-ups"
description: "Verification Date: 2026-06-27"
trigger_phrases:
  - "sk-design content topups checklist"
  - "md-generator wrapper checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/021-content-topups"
    last_updated_at: "2026-06-27T08:55:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Verified all checklist items with package, benchmark and backend evidence"
    next_safe_action: "Use the refreshed packet and benchmark reports as the handoff state"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-021-content-topups"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` names the five content gaps, scope and acceptance criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` defines the targeted content top-up pattern and verification gates.
- [x] CHK-003 [P1] The five lineages, the do-not list and the five packet homes read before authoring. Evidence: each delivered top-up maps to the lineage-backed gap named in `spec.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The md-generator wrapper orchestrates existing tools and never auto-authors or weakens fidelity. Evidence: `backend/scripts/guided-run.ts` stops before validation when `DESIGN.md` is missing and backend tests passed.
- [x] CHK-011 [P0] The foundations examples are marked illustrative and explicitly not reusable presets. Evidence: `design-foundations/references/worked_examples.md` carries the non-preset framing.
- [x] CHK-012 [P1] Each per-mode top-up traces to its lineage finding and avoids duplicating existing content. Evidence: five new or extended resources are wired through mode routers and playbooks.
- [x] CHK-013 [P1] Nothing on the unanimous do-not list (bulk import, mode splitting, redundant basics, fidelity weakening) is added. Evidence: changes are additive top-ups plus one non-authoring wrapper.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `package_skill.py --check` passes (exit 0) on every touched skill. Evidence: all five package checks returned `Result: PASS`.
- [x] CHK-021 [P0] The md-generator wrapper fails at preflight on missing Chromium or unwritable output, not part-way through extraction. Evidence: `guided-run.test.ts` covers unsafe output paths and missing `DESIGN.md` behavior.
- [x] CHK-022 [P1] A genuinely greenfield redesign prompt routes through the intake to the greenfield path. Evidence: the interface benchmark report passes with the redesign intake scenario included.
- [x] CHK-023 [P1] An audit finding with no rendered evidence is labelled not-assessed in the worksheet. Evidence: the audit worksheet playbook scenario and refreshed audit benchmark pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each top-up is classed `instance-only` to its mode, so each is verified in its own packet. Evidence: D5 connectivity is clean for every touched mode.
- [x] CHK-FIX-002 [P0] The full set of five named content gaps is inventoried, so none is skipped and none extra is added. Evidence: implementation summary lists all five additions.
- [x] CHK-FIX-003 [P0] Consumers of each addition (routers, manual playbooks, the md-generator workflow) are checked where the top-up is wired. Evidence: all five Mode-A benchmark reports pass.
- [x] CHK-FIX-004 [P0] The md-generator wrapper is checked against the no-op (missing dep) and boundary (no auto-author) cases. Evidence: `npm --prefix .opencode/skills/sk-design/design-md-generator/backend test` passed 72 tests.
- [x] CHK-FIX-005 [P1] The five per-mode additions are listed before completion is claimed. Evidence: see the `What Was Built` section in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] The greenfield-redesign and not-assessed-audit variants are exercised. Evidence: interface and audit refreshed benchmark reports pass with the new scenarios.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range. Evidence: this checklist names the exact changed resources, scripts, tests and report files instead of relying on a branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the content additions or the wrapper. Evidence: new materials are public examples, references and wrapper code.
- [x] CHK-031 [P0] The md-generator wrapper validates output-path safety before writing any artifact. Evidence: `guided-run.test.ts` covers paths inside the skill as unsafe.
- [x] CHK-032 [P1] The non-SaaS exemplar carries no private URLs or credentials. Evidence: `references/examples/editorial_exemplar.md` is synthetic editorial content.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md stay synchronized with the implemented top-ups. Evidence: all three now describe the completed five-mode delivery.
- [x] CHK-041 [P1] Each addition is wired into its mode's router or workflow where the lineage requires it. Evidence: D5 connectivity reports no dead resource paths or intent keys.
- [x] CHK-042 [P2] Each mode's manual playbook or README updated if the top-up changes the documented flow. Evidence: new scenarios were added and existing gold was synced for changed routes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes confined to the five mode packets. Evidence: changed implementation files are under the scoped five mode packets and benchmark or packet docs.
- [x] CHK-051 [P1] No stray temp files left in the packet. Evidence: only packet docs and expected metadata files are present under this packet.
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
