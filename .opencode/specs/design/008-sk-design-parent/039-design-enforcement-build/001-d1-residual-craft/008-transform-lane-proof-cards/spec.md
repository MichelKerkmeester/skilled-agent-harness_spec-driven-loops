---
title: "Feature Specification: Transform-Lane Proof Cards"
description: "The distill/clarify/delight transforms had no fillable proof artifact, so applied changes were unaccountable. This adds an Applied-Transform Proof Cards subsection with one fillable keep/remove + before/after card per named lane, additive and routing-inert."
trigger_phrases:
  - "d1-r8 transform proof cards"
  - "transform lane proof cards design build"
  - "distill clarify delight applied transform card"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/008-transform-lane-proof-cards"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2; recorded card-shape-vs-aesthetic split and routing-inert rationale"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships markdown only: the spec names no validator, so the card shape is grep-checkable but no gate is bundled"
      - "Residual was the fillable card, not the guidance lane, which already existed for all three verbs"
---
# Feature Specification: Transform-Lane Proof Cards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `008-transform-lane-proof-cards` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The interface transform lane already named the proof fields (the Shared Application Contract) and gave per-verb guidance for bolder, quieter, distill, clarify, and delight, but nothing in `transform_application.md` was the fillable artifact an applied transform must hand back. A reviewer could read what a distill, clarify, or delight should keep or cut in general and still have no auditable record of what it actually kept or cut on a specific surface, and nothing stated the card-shape check.

### Purpose
Make the applied transform produce a concrete deliverable: append a fillable proof card for each of distill, clarify, and delight whose rows mirror the Shared Application Contract fields and whose citation points back to the matching guidance lane. The filled card is the auditable proof, distinct from the guidance, and the section states honestly that the card check confirms shape only while the aesthetic call stays advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One additive `### Applied-Transform Proof Cards` subsection appended to `transform_application.md` at the end of §3 Verb Lanes, after the Delight lane and before the §4 Gold Prompts divider.
- One fillable proof card per named lane (distill, clarify, delight), each with rows mirroring the Shared Application Contract field set: keep ledger, remove ledger, before, after, earned moment, reduced motion, opt-out.
- The card-check line (deterministic shape) and the advisory-boundary line in the subsection.

### Out of Scope
- A deterministic card-shape validator: the spec target is the reference doc alone and names no checker, so the card is grep-checkable but no gate ships this phase.
- Proof cards for bolder and quieter, which keep their guidance lane only.
- Any change to the §1 Routing Rule, the §4 Gold Prompts, the Shared Application Contract, the guidance lanes, the route fixtures, or any checker.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-interface/references/design-process/transform_application.md` | Modify | §3 gains the additive `### Applied-Transform Proof Cards` subsection with distill, clarify, and delight cards; no existing line removed and the routing regions stay byte-identical |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `transform_application.md` carries one fillable proof card per named lane (distill, clarify, delight), appended after the verb-lane guidance and before the Gold Prompts | The three cards render under `### Applied-Transform Proof Cards`, each a fill-in table |
| REQ-002 | Each card has a keep-ledger row, a remove-ledger row, a before line, and an after line (deterministic card shape) | A grep over each card confirms all four required rows; a card missing any one fails the check |
| REQ-003 | Additive and routing-inert: no existing line removed and the §1 Routing Rule and §4 Gold Prompts are byte-identical | A diff shows zero change in those regions; 0 existing non-blank lines removed; the hubRoute guard holds 0 regression |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each card mirrors the Shared Application Contract field set and cites its guidance lane and the contract by name without recopying guidance prose | Every contract field appears as a card row; each card carries the lane + contract citation and contains no duplicated lane text |
| REQ-005 | The subsection states the card check confirms shape only and that the aesthetic call stays an audit judgment; evergreen and scope clean | The advisory-boundary line is present; no spec/packet/phase IDs or `specs/` paths in the subsection; only the one file is in the change set |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `### Applied-Transform Proof Cards` subsection exists with distill, clarify, and delight cards, each carrying a keep-ledger row, a remove-ledger row, a before line, and an after line, plus earned-moment, reduced-motion, and opt-out rows.
- **SC-002**: The edit is purely additive (0 existing non-blank lines removed) and routing-inert: the §1 Routing Rule and §4 Gold Prompts are byte-identical and the hubRoute guard stays at 23 pass / 5 known-gap / 0 regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The card shape is deterministic and grep-checkable, but whether the kept/removed choices and the earned moment are the right call is not | Med | State the shape-vs-aesthetic split in the subsection: the card check confirms shape only, the aesthetic stays an audit judgment; assert no taste in the artifact |
| Risk | The cards could duplicate or relocate the guidance lanes or the Shared Application Contract | Med | Each card cites its lane and the contract by name and recopies no guidance prose; the contract and lanes stay unchanged |
| Risk | An edit near the routing regions could perturb the hub route | Med | Append inside §3 before the §4 divider so the §1 Routing Rule and §4 Gold Prompts stay byte-identical; the proof cards are routing-inert |
| Dependency | `transform_application.md` Shared Application Contract (field set the card rows mirror) | Internal | Mirror the contract fields exactly; invent or drop none |
| Dependency | `transform_application.md` distill/clarify/delight guidance lanes (cited, not restated) | Internal | Cite each lane by name; add no duplicate guidance prose |
| Dependency | hubRoute / route-gold guard (no-regression floor) | Internal | The craft reference is not a fixture source, so the guard headline holds; confirm 0 regression after the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The card is a blank skeleton an applier fills per surface, so the proof artifact stays current with each application without a doc rewrite.

### Reliability
- **NFR-R01**: The card shape is deterministic: a grep for the keep-ledger, remove-ledger, before, and after rows returns the same answer on every run.

### Integrity
- **NFR-I01**: The subsection asserts no aesthetic verdict; the shape check is honestly scoped so the doc carries no false trust signal.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A partly filled card (some `__________` cells still blank) still satisfies the shape check as long as the keep/remove and before/after rows are present; completeness of the content stays an audit judgment.
- A card whose rows differ from the Shared Application Contract field set is a reconciliation failure even if the four required rows are present.

### Error Scenarios
- A card missing any one of the keep, remove, before, or after rows fails the deterministic shape check.
- Any change to the §1 Routing Rule or §4 Gold Prompts bytes is a no-regression failure, not a card-shape failure.

### State Transitions
- The three layers stay distinct: the Shared Application Contract defines the fields, the guidance lane gives the generic advice, and the card is the per-application record that cites both.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One additive subsection in one reference doc, three cards from a shared skeleton |
| Risk | 5/25 | Additive only, routing regions byte-identical, reversible by deleting the subsection |
| Research | 5/20 | Re-reading the contract field set, the three guidance lanes, and the routing-critical regions |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a deterministic card-shape checker eventually ship for the proof cards? Today the card shape is grep-checkable but no gate is bundled, because the spec target is the reference doc alone and names no validator. A small checker mirroring the sibling-pattern convention is the natural enforcement upgrade and is recorded here so a later phase can pick it up deliberately rather than as silent scope drift.
- Should bolder and quieter gain proof cards too? This phase ships cards for the three named lanes (distill, clarify, delight) per the spec; extending the pattern to the remaining verbs is a clean follow-up, not a gap in this phase.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
</content>
