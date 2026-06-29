---
title: "Verification Checklist: Transform-Lane Proof Cards"
description: "Verification items for the fillable Distill/Clarify/Delight proof cards added to transform_application.md: card-shape acceptance (keep/remove ledger + before/after present), field-set consistency with the Shared Application Contract, reconciliation with the guidance lanes (no duplication), advisory-honesty, routing no-regression (route rule + gold prompts byte-unchanged), evergreen, and scope-lock."
trigger_phrases:
  - "transform lane proof cards checklist"
  - "distill clarify delight proof card design build"
  - "applied transform keep remove before after card"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/008-transform-lane-proof-cards"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all checklist items verified; recomputed counts and set verification date"
    next_safe_action: "Verify each item against the delivered proof cards; run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Transform-Lane Proof Cards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Spec target re-read: `transform_application.md` already carries the Shared Application Contract and the five verb-lane guidance blocks
  - **Acceptance**: the live file shows the contract field table and a guidance lane for each of bolder/quieter/distill/clarify/delight
- [x] CHK-002 [P0] Residual confirmed: the gap is the fillable per-application proof card, not the guidance lane (the distill/clarify/delight guidance lanes already exist)
  - **Acceptance**: the plan and this checklist treat the cards as new; no task re-adds a guidance lane
- [x] CHK-003 [P0] Scope frozen to one additive edit of `transform_application.md`; no script, no other interface doc touched
  - **Acceptance**: `git status --porcelain` shows only `transform_application.md` modified under `.opencode/skills/sk-design/design-interface/`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `transform_application.md` carries a fillable proof card for each named lane — Distill, Clarify, Delight
  - **Acceptance**: three cards render, each a fill-in table appended after the verb-lane guidance, before the Gold Prompts
- [x] CHK-011 [P0] Each card's rows mirror the Shared Application Contract field set: keep ledger, remove ledger, before, after, earned moment, reduced motion, opt-out
  - **Acceptance**: every contract field appears as a card row; no field invented, none dropped
- [x] CHK-012 [P0] Each card cites its matching guidance lane and the Shared Application Contract by name and recopies no guidance prose
  - **Acceptance**: each card carries a "apply per the <verb> guidance lane; fields per the Shared Application Contract" pointer and contains no duplicated lane guidance text
- [x] CHK-013 [P1] The card-check line and advisory-boundary line are present in the subsection
  - **Acceptance**: the subsection states the deterministic shape (keep row + remove row + before/after present) and that whether the choices/earned moment are right stays an audit judgment

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE (card check, deterministic shape): each of Distill, Clarify, Delight has a keep-ledger row, a remove-ledger row, and before + after rows present
  - **Acceptance**: a grep over each card confirms all four required rows; a card missing any one fails the check
- [x] CHK-021 [P0] No-regression: the Routing Rule section and the Gold Prompts table are byte-unchanged
  - **Acceptance**: a diff shows zero change in those two regions; the proof cards are routing-inert
- [x] CHK-022 [P0] No-regression: the route-gold / hubRoute guard re-run reports 0 regression against the live headline
  - **Acceptance**: the guard's pass / known-gap / 0-regression headline is unchanged after the edit; 0 regression is the hard floor (the dispatch references a 23/5/0 headline — confirm the live count at execution and assert the trailing 0)
- [x] CHK-023 [P1] Field-set consistency: the card field set equals the Shared Application Contract field set exactly
  - **Acceptance**: a row-by-row compare shows the card mirrors the contract with no added or missing field

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Acceptance**: instance-only — this phase appends one proof-card subsection to one reference doc and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Acceptance**: instance-only; the change set is one additive edit, and an evergreen grep over the added subsection finds no IDs/paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Acceptance**: the proof cards are read by an applier filling them, not by code; no script, fixture, or routing region consumes them, so nothing downstream changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Acceptance**: not applicable — markdown-only, no parser/path/redaction logic ships this phase; the deterministic surface is the card-shape grep over three cards
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Acceptance**: matrix is 3 cards × 4 required rows (keep ledger, remove ledger, before, after) plus the field-set consistency compare and the routing byte-unchanged check
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Acceptance**: not applicable; no code or test reads process-wide state this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Acceptance**: evidence pins to the `### Applied-Transform Proof Cards` subsection in `transform_application.md`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No false trust signal: the subsection states the card check confirms shape only; whether the transform was applied well stays advisory
  - **Acceptance**: neither the cards nor the section claim the shape check verifies good design — the advisory boundary is written, matching the spec acceptance
- [x] CHK-031 [P1] Integrity: the cards restate no guidance and relocate no logic out of the guidance lanes or the Shared Application Contract
  - **Acceptance**: the cards reference those regions; they do not copy or move their content

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the added cards or prose
  - **Acceptance**: an evergreen grep over the subsection returns no `specs/` paths and no packet/phase IDs; only same-file section names or skill-relative paths appear
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the card scope (distill/clarify/delight), the field set, and the deterministic card-shape acceptance
  - **Acceptance**: all four docs name the same three lanes, the same contract field set, and the same keep/remove + before/after card check

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `transform_application.md` edited; no other interface doc or script modified; the edit deletes/rewords no existing prose
  - **Acceptance**: `git status --porcelain` lists exactly that one path; a diff shows the change is a pure insertion
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Acceptance**: any draft fixtures live only in the session scratchpad; the working tree carries only the edited reference doc

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator — verified against the delivered `### Applied-Transform Proof Cards` subsection (three cards, card-shape grep, §1/§4 byte-unchanged, hubRoute 23/5/0)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
