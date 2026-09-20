---
title: "Feature Specification: Deep-Dive — The (T, R, P) Decomposition"
description: "Candidate 8th idea (from the GLM-5.2 parallel lineage): decompose routing policy into three orthogonal knobs — Threshold (how much evidence to commit), Recovery (what happens after an uncertain/wrong pick), Provenance (where the vocab-to-mode evidence comes from). defaultMode is one corner (T low, R none, P static) of this space; the field conflates T and R and cannot express low-threshold + high-recovery. A hub's policy becomes a (T,R,P) triple plus a vocabulary table. This packet is the dive-ready scaffold; the presentation is authored, the 5-iteration SOL xhigh-fast dive is NOT yet run."
trigger_phrases:
  - "t r p decomposition deep dive"
  - "threshold recovery provenance routing"
  - "defaultMode is one corner"
importance_tier: "important"
contextType: "research"
---
# Deep-Dive: The (T, R, P) Decomposition

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Dive-ready scaffold; five-iteration deep dive not yet run |
| **Created** | 2026-07-18 |
| **Branch** | `0069-skilled-router-refactor-impl` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The candidate hypothesis is that `defaultMode` conflates how much evidence is needed to commit with what happens after uncertainty or a wrong pick. Other policy fields may also mix threshold, recovery, and provenance, preventing a hub from expressing combinations such as low threshold with strong recovery.

### Purpose

Prepare a five-iteration investigation of whether routing policy can be represented as independent Threshold, Recovery, and Provenance axes plus a vocabulary table, while keeping the single-GLM origin and unvalidated status explicit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Formalize candidate values for Threshold, Recovery, and Provenance.
- Inventory how `defaultMode`, `ambiguityDelta`, `bundleRules`, `defaultResource`, and `tieBreak` map to or conflate those axes.
- Test a `(T, R, P) + vocabulary` schema against named-default, bundle, transport, and same-packet-mode hubs.
- Examine composition with calibrated thresholds, handoff recovery, offline learning, and typed route decisions.
- Evaluate advisor, deterministic benchmark, and document-only behavior in every future iteration.

### Out of Scope

- Claiming that the candidate has passed its five-iteration deep dive.
- Runtime implementation or changes to live routing configuration or the scorer.
- Automatic migration from `defaultMode` where the intended recovery policy is ambiguous.
- Re-deriving the shipped `defaultMode` answer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Conform the dive-ready specification to the Level 2 structure |
| `plan.md` | Create | Record the proposed research approach |
| `tasks.md` | Create | Track pending deep-dive and verification work |
| `checklist.md` | Create | Record pending verification without invented evidence |
| `implementation-summary.md` | Create | State that only the scaffold and presentation exist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the candidate's unvalidated provenance. | Every synthesis states that the idea comes from one GLM-5.2 lineage and has not completed the proposed five-iteration dive. |
| REQ-002 | Keep the three axes independently defined. | Threshold, Recovery, and Provenance each answer one distinct policy question with explicit candidate values. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Produce a per-hub conflation inventory. | Each relevant current policy field is mapped to one or more axes with collisions made explicit. |
| REQ-004 | Falsify the decomposition across dissimilar hub archetypes. | Named-default, bundle, transport, and same-packet-mode cases are tested and counterexamples recorded. |
| REQ-005 | Evaluate the three operating dimensions. | Advisor, deterministic benchmark, and document-only behavior are addressed separately in every iteration. |
| REQ-006 | Define composition with sibling ideas. | The relationship to calibrated threshold, handoff recovery, offline-learned provenance, and typed decisions is explicit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three axes have non-overlapping definitions and falsifiable value sets.
- **SC-002**: Every current routing-policy field can be mapped, split, retained, or rejected with a documented reason.
- **SC-003**: Cross-archetype falsification either preserves the decomposition or identifies the missing axis.
- **SC-004**: No implementation or adoption recommendation is made before the proposed dive is complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GLM cross-lineage notes and synthesis | The candidate loses its actual provenance and seed claims | Keep the source lineage explicit and do not re-label it as SOL evidence |
| Dependency | Per-hub policy inventory | The decomposition cannot be falsified against real archetypes | Build the inventory before drawing a final schema conclusion |
| Risk | Orthogonality is assumed rather than demonstrated | A fourth axis or coupled constraint may be missed | Force counterexamples and record any field that cannot map cleanly |
| Risk | Presentation prose is mistaken for completed research | An unvalidated candidate may be adopted prematurely | Repeat the not-yet-run status in metadata, plan, tasks, and current-state summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Any benchmark representation of the triple and vocabulary table must replay byte-identically under pinned inputs.

### Traceability
- **NFR-T01**: Every proposed enum, mapping, and conclusion must identify whether it comes from seed evidence or the future deep dive.

### Degradation
- **NFR-G01**: Without advisor or benchmark support, the document-only path must remain understandable without claiming measured routing quality.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Axis Mapping
- A field that controls both commitment and recovery must be split or explicitly recorded as a counterexample.
- `defaultMode: X` cannot be mechanically classified as no recovery or handoff recovery without additional evidence.

### Archetypes
- Ordered bundles may require recovery semantics that do not fit a single enum value.
- Same-packet public modes and transport hubs may expose provenance or authority constraints outside the proposed triple.

### Evidence State
- Existing presentation content is a candidate framing, not evidence that the five-iteration falsification passed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three policy axes, vocabulary, current-field mapping, and four archetypes |
| Risk | 11/25 | Premature adoption could oversimplify authority and bundle behavior |
| Research | 19/20 | The five-iteration dive and wider falsification remain outstanding |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are Threshold, Recovery, and Provenance genuinely orthogonal across all hub archetypes?
- Does authority require a fourth axis, or is it a separate constraint on every point in the space?
- Can bundle recovery be represented by one value without losing target roles and order?
- Which current fields survive the decomposition rather than moving into the vocabulary table?
<!-- /ANCHOR:questions -->
