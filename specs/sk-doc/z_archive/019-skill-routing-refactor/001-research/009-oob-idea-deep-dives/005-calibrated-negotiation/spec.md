---
title: "Feature Specification: Deep-Dive — Calibrated One-Turn Routing Negotiation"
description: "Five-iteration SOL xhigh-fast deep-research lineage on modeling the zero-signal branch as a calibrated one-turn negotiation: always expose rankScore and scoreMargin, expose estimatedError only when a versioned held-out corpus validates calibration, frame the whole thing as selective classification (auto-route under a validated risk budget, else one typed clarification, else defer/reject), and enforce a measurable friction budget (one turn, at most three candidates plus none_of_these, at most two attempts, a 256-token card) whose thresholds are promotable only from held-out risk/coverage evidence."
trigger_phrases:
  - "calibrated routing negotiation deep dive"
  - "selective classification routing"
  - "rank score vs estimated error"
importance_tier: "important"
contextType: "research"
---
# Deep-Dive: Calibrated One-Turn Routing Negotiation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research synthesized; implementation is out of scope |
| **Created** | 2026-07-18 |
| **Branch** | `0069-skilled-router-refactor-impl` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor's `confidence` is a bounded ranking heuristic, not a probability of correctness. Treating it as calibrated risk can justify unsafe automatic routing, while the zero-signal branch lacks one bounded contract for ranking, clarification, deferral, and rejection.

### Purpose

Define an honest selective-classification contract that always exposes `rankScore` and `scoreMargin`, permits `estimatedError` only with a matching held-out validation certificate, and bounds uncertainty handling to one typed clarification before defer or reject.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The calibrated ranking, risk, and decision contracts described in `presentation.md`.
- A selective controller with `auto_route`, `clarify`, `defer`, and `reject` terminal actions.
- A replayable clarification budget of one turn, at most three candidates plus `none_of_these`, at most two route attempts, and a 256-token card.
- Promotion metrics covering coverage, selective risk, option recall, clarification resolution, cancellation, added turns, and card size.
- Advisor, deterministic benchmark, and document-only behavior.

### Out of Scope

- Runtime implementation or live routing changes.
- Creating or labeling a held-out corpus.
- Selecting a fleet-wide risk threshold without measured evidence.
- Re-deriving the shipped `defaultMode` answer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Conform the research specification to the Level 2 structure |
| `plan.md` | Create | Record the research-document delivery approach |
| `tasks.md` | Create | Track synthesis and verification work |
| `checklist.md` | Create | Record pending verification without invented evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep ranking distinct from calibrated probability. | `rankScore` and `scoreMargin` remain available, while probability fields are absent unless a matching validation certificate exists. |
| REQ-002 | Keep authority and eligibility ahead of scoring. | Ineligible or unauthorized candidates cannot become routable because of rank or calibration evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define the selective controller and clarification budget. | The four terminal actions and all stated interaction caps are explicit and replayable. |
| REQ-004 | Separate advisor, benchmark, and document-only behavior. | Each operating tier states what it can claim and how it degrades when another plane is absent or stale. |
| REQ-005 | Gate threshold promotion on held-out evidence. | No risk threshold is presented as operational without coverage and selective-risk evidence from disjoint data splits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ranking, calibration, and decision authority are three distinct contracts.
- **SC-002**: Clarification is bounded by deterministic, testable limits and terminates in one of the typed actions.
- **SC-003**: Document-only routing remains useful for explicit routes and honest deferral without claiming measured correctness.
- **SC-004**: Any operational risk threshold remains blocked until held-out promotion evidence exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Versioned held-out corpus | Calibrated error estimates and thresholds cannot be promoted without it | Omit probability fields and remain rank-only until validation exists |
| Dependency | Pinned policy, candidate, and tokenizer snapshots | Scores and friction limits are not replayable across changing inputs | Bind decisions and cards to their exact snapshots |
| Risk | Ranking language is read as probability | Users may over-trust an uncalibrated route | Use distinct field names and forbid probability language when unvalidated |
| Risk | Clarification adds friction | A route may require an extra turn | Enforce the one-turn and card-size budgets, then measure acceptance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Policy behavior, clarification cards, and budget counters must be byte-replayable under pinned inputs.

### Honesty
- **NFR-H01**: Unvalidated routes must not expose or imply an observed probability of correctness.

### Degradation
- **NFR-G01**: Missing or stale advisor and benchmark planes must reduce claims and authority rather than force a route.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Calibration State
- A missing, stale, or mismatched certificate removes probability fields rather than setting them to zero or null.
- A certificate for another policy, candidate set, or evaluation window cannot authorize the current decision.

### Clarification State
- More than three eligible candidates must be reduced before a card is shown, or the controller must defer.
- An unanswered, declined, invalid, or still-ambiguous clarification ends in defer or reject after the single accepted-answer rescore.

### Authority State
- A named default or detected surface may affect evidence but cannot grant execution authority.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One research contract spanning ranking, calibration, control, and interaction |
| Risk | 13/25 | Incorrect probability claims or thresholds could authorize unsafe routing |
| Research | 18/20 | Five-iteration synthesis exists, but held-out calibration evidence does not |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which versioned corpus, calibration method, slices, and expiry policy would be sufficient to expose `estimatedError`?
- What measured coverage and selective-risk bounds would justify an operational threshold?
- Which tokenizer and canonical serialization should define the 256-token clarification budget?
<!-- /ANCHOR:questions -->
