---
title: "Implementation Plan: Phase 010 Adjacent-Span Coalescing"
description: "Implement a versioned model-facing grouping or alias layer that reduces marker burden and resolves locally to the unchanged canonical map before strict restoration."
trigger_phrases:
  - "adjacent-span-coalescing"
  - "implementation plan"
  - "protected marker inflation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/010-adjacent-span-coalescing"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned model-facing representation scaffold."
    next_safe_action: "Record the privacy decision and fixed-corpus baseline before selecting grouping or aliases."
    blockers:
      - "Alias category disclosure requires a privacy-policy decision."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a short wire alias schema disclose protected-value categories, and is that acceptable under the privacy policy?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 010 Adjacent-Span Coalescing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript fidelity and provider pipeline |
| **Framework** | Runtime-neutral projection core |
| **Storage** | Immutable canonical map plus versioned in-memory wire mapping |
| **Testing** | Fixed-corpus metrics, property checks, fidelity fixtures, and package gate |

### Overview

Add a versioned model-facing representation between protected output and the provider wire body. Resolve that representation locally to canonical markers before the unchanged strict restoration boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Baseline marker count, inflation, adjacency, and rejection rate are recorded.
- [ ] The alias-disclosure privacy decision is recorded.
- [ ] Canonical-map and strict-restoration invariants are frozen.

### Definition of Done

- [ ] All eight requirements and six scenarios have observed evidence.
- [ ] Marker burden improves while canonical restoration remains byte-identical.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Immutable canonical protection map with a transient, versioned provider-wire projection.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Canonical `ProtectedDocument` | Retains bytes, digests, ordinals, member order, categories, and canonical markers unchanged |
| Wire representation encoder | Coalesces bounded adjacency or assigns collision-resistant aliases |
| Local resolver | Converts valid wire groupings or aliases back to canonical markers before restoration |
| Measurement harness | Reports marker count, encoded/source inflation, adjacency, and rejection rate |

### Data Flow

Source -> canonical protection -> versioned wire representation -> provider -> local canonical-marker resolution -> existing strict restoration -> render decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Fidelity protection module | Produces canonical markers and map | Keep canonical outputs unchanged; add transient representation after protection | Byte and map parity tests |
| Provider request path | Sends encoded text | Send the reduced representation only | Provider-boundary fixtures |
| Pre-restoration path | Receives provider candidates | Resolve valid representation back to canonical markers | Rejection matrix and restoration tests |
| Measurement fixtures | Capture current burden | Add baseline/final metrics across independent corpus axes | Fixed-corpus report |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Record the fixed-corpus baseline and independent matrix axes.
- [ ] Resolve the alias-disclosure question and freeze invariants.

### Phase 2: Implementation

- [ ] Implement the smallest approved versioned representation.
- [ ] Implement local resolution to canonical markers before restoration.
- [ ] Preserve syntax-sensitive boundaries and strict invalid-sequence rejection.

### Phase 3: Verification

- [ ] Measure burden reduction and canonical byte parity.
- [ ] Run structural, privacy, collision, reorder, duplicate, and fallback negatives.
- [ ] Run the package gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Measurement | Token count, inflation, adjacency, rejection rate | Fixed-corpus harness |
| Fidelity | Canonical map, bytes, digests, ordinals, member order, rejection behavior | Existing fidelity suite plus property checks |
| Privacy and syntax | Raw/category disclosure, code, tables, structural blocks | Boundary fixtures and negative controls |
| Integration | Provider-wire encode/resolve/restoration path | Package integration tests and `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Alias-disclosure privacy decision | Governance | Open | Alias design cannot be selected; pure grouping remains the safe candidate |
| Existing canonical protection map | Internal | Available | Representation cannot prove local one-to-one restoration |
| Phase 009 | Related | Optional | Combined quality benefit is deferred, but this phase can complete independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Burden does not improve, any canonical byte differs, syntax changes, disclosure expands, or an invalid sequence is accepted.
- **Procedure**: Disable the model-facing representation, return to canonical markers on the wire, rerun the fixed corpus and fidelity suite, and confirm the original map and restoration behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Privacy decision + baseline -> Representation and resolver -> Fidelity/privacy verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Decision and baseline | Existing corpus and policy owner | Representation selection |
| Representation and resolver | Frozen invariants | Verification |
| Verification | Implemented representation | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Decision and baseline | Medium | 1-2 days |
| Representation and resolver | High | 3-5 days |
| Verification and handoff | High | 2-4 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Capture canonical map and restored-byte goldens.
- [ ] Record baseline burden metrics.
- [ ] Confirm the current one-token-per-range path remains selectable.

### Procedure

1. Disable the representation encoder and local resolver.
2. Send canonical markers through the existing provider path.
3. Replay the fixed corpus and strict rejection suite.
4. Confirm canonical and restored bytes match the baseline.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove only the transient representation path; canonical state was never rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Privacy decision ----+
                     +-> Representation choice -> Local resolver -> Verification
Baseline metrics ----+                              ^               |
Canonical invariants -------------------------------+---------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Representation choice | Privacy decision and baseline | Versioned grouping or alias contract | Encoder and resolver |
| Encoder and resolver | Representation choice and canonical invariants | Reduced wire body and canonical-marker sequence | Verification |
| Verification harness | Baseline and implementation | Burden, fidelity, privacy, and syntax evidence | Handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Resolve privacy and freeze invariants** - 1-2 days - critical.
2. **Implement representation and local resolver** - 3-5 days - critical.
3. **Pass fidelity, privacy, syntax, and burden gates** - 2-4 days - critical.

**Parallel opportunities**:

- Corpus measurement fixtures can be prepared while the privacy decision is pending.
- Syntax and invalid-sequence fixtures can be authored after invariants freeze.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Representation approved | Privacy decision, baseline, and invariants recorded | Stage 1 |
| M2 | Local round trip implemented | Reduced wire form resolves to canonical markers | Stage 2 |
| M3 | Handoff accepted | Burden improves and every fidelity/privacy gate passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: Add a transient, versioned model-facing representation while preserving the canonical map and strict restoration.

**Status**: Proposed. The choice between bounded grouping and aliases depends on the recorded privacy decision in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the privacy decision, fixed-corpus baseline, and canonical byte goldens before implementation.
- Re-read every target file and preserve the existing protection and restoration contracts.
- Define the complete invalid-sequence and syntax-boundary matrix before changing the representation path.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Do not select aliases before the privacy decision; do not implement resolution before invariants are frozen. |
| TASK-SCOPE | Change only the transient model-facing representation and its tests; canonical protection categories remain unchanged. |
| TASK-PROOF | Measure baseline/final burden and prove exact canonical restoration with negative controls. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=010 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If privacy approval is absent, a syntax boundary cannot be preserved, or any canonical byte differs, stop the affected task, retain the existing one-token-per-range path, and update the decision record before resuming.
