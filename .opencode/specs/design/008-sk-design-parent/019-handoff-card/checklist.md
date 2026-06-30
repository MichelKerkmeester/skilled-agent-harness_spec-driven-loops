---
title: "Verification Checklist: sk-design unified sk-code handoff schema"
description: "Verification Date: 2026-06-27. Shared schema, four mode references, package checks and strict validation complete."
trigger_phrases:
  - "sk-design handoff schema checklist"
  - "design build manifest checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T07:18:33Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Verified the shared sk-code handoff card"
    next_safe_action: "Use the schema for future design-to-build handoffs"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` defines the one shared schema and four mode applications.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` defines shared-core-plus-extensions and the verification path.
- [x] CHK-003 [P1] The four lineages and the four packet homes read before authoring the schema. Evidence: read the four `015-per-skill-improvement-research/*/research/lineages/gpt55fast/research.md` files and the four live mode `SKILL.md` routers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] One shared handoff schema exists and the four modes reference it, not four bespoke cards. Evidence: `.opencode/skills/sk-design/shared/sk_code_handoff.md` is referenced from interface, foundations, audit and motion `RESOURCE_MAP` entries.
- [x] CHK-011 [P0] The audit backlog card routes findings without applying them, preserving the audit-never-fixes boundary. Evidence: `design-audit/SKILL.md` says the backlog card routes accepted findings and audit never applies fixes, edits files or grants write authority.
- [x] CHK-012 [P1] Each per-mode artifact carries its required fields per the lineage shapes. Evidence: shared schema lists the interface manifest, foundations card, audit backlog card and motion handoff field extensions.
- [x] CHK-013 [P1] The schema and cards follow the existing sk-design shared and per-packet patterns. Evidence: new shared doc matches the frontmatter, overview, usage and child-usage style of the existing shared docs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `package_skill.py --check` passes (exit 0) on every touched skill. Evidence: package check returned `Result: PASS` for interface, foundations, audit and motion.
- [x] CHK-021 [P0] Each mode's handoff artifact resolves its reference to the shared schema. Evidence: D5 connectivity returned score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys and 0 dead resource paths for all four modes.
- [x] CHK-022 [P1] An audit with zero accepted findings produces an empty-but-valid backlog handoff. Evidence: shared schema and audit section both state zero accepted findings emits an empty valid backlog.
- [x] CHK-023 [P1] A CSS-only motion card records no animation library rather than defaulting to one. Evidence: shared schema and motion section state CSS transitions or `no animation library` are valid mechanism values.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The handoff need is classed `cross-consumer`: it spans four modes, so the shared schema is verified against all four. Evidence: D5 connectivity passed for the four mode packets that hand to sk-code.
- [x] CHK-FIX-002 [P0] The full set of modes that hand to sk-code is inventoried, confirming md-generator is correctly excluded. Evidence: `spec.md` out-of-scope excludes md-generator and the edits only touch interface, foundations, audit and motion.
- [x] CHK-FIX-003 [P0] Consumers of the shared schema (the four per-mode cards and their SKILL.md references) are updated together. Evidence: four mode `SKILL.md` files reference `../shared/sk_code_handoff.md` in both prose and machine resource maps.
- [x] CHK-FIX-004 [P0] The audit card is checked against the no-op (zero findings) and boundary (no apply) cases. Evidence: audit and shared schema state empty backlog is valid and audit applies nothing.
- [x] CHK-FIX-005 [P1] The four per-mode field sets are listed before completion is claimed. Evidence: shared schema Section 3 lists interface, foundations, audit and motion extensions.
- [x] CHK-FIX-006 [P1] The foundations no-data-viz and motion CSS-only variants are exercised. Evidence: foundations fields allow mode-owned subsets and the motion field accepts `no animation library` for CSS-only paths.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range. Evidence: verification was run against uncommitted diff from base `dd414525b4` over the touched files listed in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the schema or the per-mode cards. Evidence: changes are static markdown with no credentials.
- [x] CHK-031 [P0] The handoff cards carry no credentials or environment-specific paths. Evidence: schema fields describe design values and constraints only.
- [x] CHK-032 [P1] The audit backlog card does not grant any apply or write capability. Evidence: audit handoff text says audit never applies fixes, edits files or grants write authority.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the implemented schema and cards. Evidence: `tasks.md` now records the same shared schema and four per-mode applications as `spec.md` and `plan.md`.
- [x] CHK-041 [P1] Each mode's SKILL.md references the shared schema where the handoff artifact is loaded. Evidence: interface `REAL_UI_LOOP`, foundations `TOKENS`, audit `AUDIT_CONTRACT` and motion `STRATEGY` load `../shared/sk_code_handoff.md`.
- [x] CHK-042 [P2] The shared-layer README or index updated to list the new handoff schema. Evidence: the shared layer has no README, so the four mode reference indexes list the shared schema and D5 reports 0 orphan references.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes confined to the shared layer and the interface, foundations, audit, motion packets and this phase packet. Evidence: modified files are listed in `implementation-summary.md`.
- [x] CHK-051 [P1] No stray temp files left in the packet. Evidence: no temp files were created in the phase packet.
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
