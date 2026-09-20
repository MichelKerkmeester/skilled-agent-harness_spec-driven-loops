---
title: "Feature Specification: sk-code Typed-Pair Routing and Leaf Recall Research"
description: "Deep-research packet on sk-code router inputs, benchmark scoring, universal-preamble identity, live leaf-read evidence, leaf-recall optimizations, and anti-gaming validation. Distinguishes hub/surface routing from leaf-resource routing and evaluates typed-pair recall honestly. Findings only; implementation is out of scope."
trigger_phrases:
  - "sk-code leaf recall research"
  - "sk-code typed-pair routing findings"
  - "universal preamble ownership research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/001-research/011-sk-code-routing-research"
    last_updated_at: "2026-07-24T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Extracted the sk-code routing research into its own research phase under 001-research"
    next_safe_action: "Apply the recall/typed-pair findings in the sk-code implementation phase (014)"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: hub/surface routing separated from leaf-resource routing"
      - "Q2: typed-pair recall evaluated against benchmark scoring"
      - "Q3: universal-preamble identity ownership characterized"
---
# Feature Specification: sk-code Typed-Pair Routing and Leaf Recall Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (research) |
| **Created** | 2026-07-24 |
| **Branch** | `001-research/011-sk-code-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/001-research` |
| **Type** | Research packet (eight-iteration deep-research loop) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code routing could not be measured honestly on the canonical typed-pair surface. Its router inputs
mix hub/surface selection with leaf-resource selection, its index-table authoring shape emits leaf
paths the benchmark replay cannot always recover as typed pairs, and a universal preamble contributes
to hub identity in ways that were not separated from leaf recall. Without that separation, a benchmark
score could not distinguish a genuine routing miss from a scoring artifact.

### Purpose
Record the evidence needed to distinguish sk-code hub/surface routing from leaf-resource routing and to
evaluate typed-pair recall honestly — covering deterministic replay, typed identity conversion,
benchmark scoring, universal-preamble ownership, live leaf-read evidence, and anti-gaming validation.
This phase produces findings; implementation candidates are out of scope and hand off to the sk-code
implementation phase.

### Outcome
Surface selection is not the primary fault. Monolithic leaf selection expands the candidate set, and the
untyped `DEFAULT_RESOURCE` preamble creates a separate typed-identity defect. The research recommends
freezing same-revision baselines, separating minimum from exhaustive gold, instrumenting ordered
successful reads and route-decision provenance, then testing two-tier resource selection before
specificity weighting. The dependency-ordered candidates and their evidence live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: separating sk-code hub/surface routing from leaf-resource routing on the typed-pair surface
- Q2: how the skill-benchmark scorer reads sk-code router inputs, gold, and typed-pair recall
- Q3: the universal-preamble contribution to hub identity vs leaf recall
- Q4: what the available live leaf-read evidence can and cannot support
- Q5: leaf-recall optimization candidates and anti-gaming validation of any proposed change

### Out of Scope
- Applying the findings. The deliverable here is evidence; the build/measurement goes to `../014-sk-code-router-alignment/`
- Routing research for other skills, covered by the sibling research phases under `001-research`
- Redesigning the shared benchmark scorer, fixtures, or runtime behavior

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`,
`deep-research-dashboard.md`, `deep-research-strategy.md`, and the iteration state.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-001 | Separate sk-code hub/surface routing from leaf-resource routing | Evidence tying each router input to the correct routing question | Answered; surface selection ruled out as the primary fault |
| REQ-002 | Explain how the benchmark scorer reads sk-code typed-pair recall | Per-input attribution of what the scorer counts vs the index-table shape | Answered; monolithic leaf selection expands the candidate set |
| REQ-003 | Characterize the universal-preamble contribution to hub identity | Preamble identity separated from leaf recall | Answered; the untyped `DEFAULT_RESOURCE` preamble is a separate typed-identity defect |
| REQ-004 | State what the available live leaf-read evidence supports | Explicit limits on the live-read evidence recorded | Answered; ordered-successful-read + route-provenance instrumentation recommended |
| REQ-005 | Deliver leaf-recall optimization candidates with anti-gaming validation | Each candidate is implementable and cannot be gamed to inflate the score | Delivered; two-tier resource selection tested before specificity weighting |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The research questions are answered with evidence in `research/research.md`.
- **SC-002**: An implementable set of leaf-recall candidates exists, each validated against gaming.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Resolution |
|------|------|--------|------|
| Risk | Scorer internals change during research | Findings could target stale behavior | Claims are pinned to the current scorer/replay chain with evidence |
| Risk | Index-table shape yields no typed pairs in replay | A benchmark miss could be a scoring artifact, not a routing defect | Documented as a known, lossy characteristic rather than a defect |
| Dependency | The sk-code implementation/measurement phase (`014-sk-code-router-alignment`) | The findings have no effect until applied | The candidates are dependency-ordered so the smallest safe change lands first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking research. Any threshold/policy calls are deferred to the sk-code implementation phase.

### Research Status
Complete: eight iterations, questions answered within scope. `research/research.md` is the canonical
synthesis; implementation is out of scope for this packet.
<!-- /ANCHOR:questions -->


## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `010-unified-refactor-research` |
| **Successor** | `None` |
