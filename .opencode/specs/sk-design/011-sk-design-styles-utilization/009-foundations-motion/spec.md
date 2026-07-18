---
title: "Feature Specification: foundations + motion styles-library wiring (Phase C)"
description: "Wire the two most semantically complex sk-design modes — design-foundations (relationship blueprint + compatibility graph) and design-motion (polarity-aware evidence behind a restraint gate) — to the 1,290-style library through the phase-007 shared seam. Planned scaffold only; no implementation."
trigger_phrases:
  - "foundations motion styles wiring"
  - "design-foundations compatibility graph"
  - "design-motion restraint gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations-motion L3 scaffold"
    next_safe_action: "Build the phase-007 seam wiring for foundations then motion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-found-motion-011-009"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How much of the pilot proof envelope from 008 transfers unchanged to relationship-heavy modes?"
    answered_questions:
      - "Foundations and motion are Phase C — they land after the seam (007) and the two pilots (008) stabilize."
---
# Feature Specification: foundations + motion styles-library wiring (Phase C)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Phase C wires the two most semantically complex sk-design modes to the styles library through the phase-007 shared seam: `design-foundations` gets a typed compatibility graph and relationship blueprint; `design-motion` gets polarity-aware evidence gated behind a restraint-first "should this move at all?" query. Both consume corpus evidence as reference only and never override target roles, values, accessibility, reduced-motion, or performance proof. This document is a planned scaffold; no mode runtime has been changed.

**Key Decisions**: Corpus stays reference-only under a fixed authority order; foundations rejects raw token averaging and top-level co-presence as compatibility; motion runs the restraint gate before any retrieval.

**Critical Dependencies**: Phase 004 (retrieval substrate) and Phase 007 (shared seam), plus the pilot proof patterns from Phase 008.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — implemented, reviewed, verified (43/43 tests) |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../008-interface-audit-pilots/` |
| **Successor** | `../010-open-design-transport/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 003 research settled that the styles library is a mode-owned evidence system and ranked `design-foundations` (rank 4) and `design-motion` (rank 5) as the highest-semantic-complexity consumers, but neither mode has a wired path to the library. Foundations has no way to express typed "these tokens work together / conflict" relationships, and motion has no restraint-aware eligibility that decides movement before retrieval. Without these, a naive hookup would leak corpus averages into token foundations and rank static similarity as motion intent.

### Purpose
Wire `design-foundations` and `design-motion` to the styles library via the phase-007 seam so each mode consumes corpus evidence through its own typed contract, with corpus reference kept strictly subordinate to target evidence and deterministic checks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `design-foundations`: a relationship blueprint plus a typed dependency/compatibility graph ("these tokens work together / conflict"), a transformation ledger, and downstream `not-assessed` checks, consumed through the phase-007 seam.
- `design-motion`: a restraint-first query gate ("should this move at all?") that runs BEFORE any retrieval, polarity-aware eligibility with hard negatives, purpose/state archetypes, and negative baselines.
- Reuse of the shared proof/provenance/fallback fixtures and the pilot patterns proven in Phase 008.

### Out of Scope
- The shared contract seam itself - owned by Phase 007 (consumed here, not built).
- The retrieval substrate - owned by Phase 004.
- The interface and audit pilots - owned by Phase 008.
- The Open Design transport - owned by the successor Phase 010.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-foundations/**` | Create (proposed) | Relationship blueprint, typed compatibility graph, transformation ledger, `not-assessed` checks. |
| `.opencode/skills/sk-design/design-motion/**` | Create (proposed) | Restraint gate, polarity-aware eligibility, purpose/state archetypes, negative baselines. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Foundations expresses typed relationships, not scalar averages | The compatibility graph carries typed dependency edges ("work together / conflict"); raw token averaging/interpolation and top-level token-axis co-presence are rejected as compatibility signals. |
| REQ-002 | Motion gates on restraint before retrieval | The restraint-first "should this move at all?" query runs before any corpus retrieval; only the restraint gate plus target evidence can decide no-motion, never static similarity or absent prose. |
| REQ-003 | Corpus stays reference-only | Neither mode overrides target roles/values, accessibility checks, extraction truth (foundations), or reduced-motion/performance proof and the target mechanism (motion). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Foundations bounds axis ownership and records transformations | Output holds 1 coherent style plus at most 3 axis owners; a transformation ledger records source → relationship → transformation → lock; downstream `not-assessed` checks are surfaced, not hidden. |
| REQ-005 | Motion enforces hard negatives and archetypes | Polarity-aware eligibility ranks explicit negations as true negatives (hard negatives never surface as false positives); purpose/state archetypes and negative baselines are present. |
| REQ-006 | Reuses Phase 008 patterns | Both modes consume the shared proof/provenance/fallback fixtures proven by the interface and audit pilots rather than inventing parallel envelopes. |
| REQ-007 | Negative results surface as valid outcomes | `no-fit`, hard-negative rejection, and `not-assessed` are surfaced as first-class outcomes, not swallowed as errors, in both modes. |
| REQ-008 | Proposed additions stay isolated | Changes land only under `design-foundations/` and `design-motion/`; the phase-007 seam and phase-004 retrieval surfaces are not modified. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-foundations` produces a relationship blueprint with a typed compatibility graph and transformation ledger, and never emits averaged/interpolated tokens as compatibility.
- **SC-002**: `design-motion` runs the restraint gate before retrieval and blocks false-positive motion on hard negatives.
- **SC-003**: Both modes leave target roles/values, accessibility, extraction truth, reduced-motion, and performance proof authoritative and un-overridden.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 shared seam | High if unfinished | Consume the seam contract; do not rebuild envelope fields locally. |
| Dependency | Phase 004 retrieval substrate | Medium | Reuse the settled retriever; add no second retrieval path. |
| Dependency | Phase 008 pilot patterns | Medium | Inherit proof/provenance/fallback fixtures once the pilots stabilize them. |
| Risk | Corpus averaging leaks into token foundations | High | Reject raw averaging/interpolation and top-level co-presence; require typed edges. |
| Risk | Static similarity mistaken for motion intent | High | Restraint gate runs first; only the gate plus target evidence decide no-motion. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The motion restraint gate short-circuits before retrieval so a no-motion verdict never pays corpus-retrieval cost.

### Security
- **NFR-S01**: Corpus evidence is read-only reference; it may not authorize exact reuse or accept transport output.

### Reliability
- **NFR-R01**: Negative results (`no-fit`, hard-negative rejection, `not-assessed`) are valid surfaced outcomes, not errors.

---

## 8. EDGE CASES

### Data Boundaries
- Empty corpus match: foundations emits `no-fit` with the blueprint intact; motion falls back to the restraint verdict alone.
- Maximum axis owners: foundations caps at 3 axis owners around 1 coherent style; excess is dropped, not averaged.

### Error Scenarios
- Hard-negative collision: an explicit negation must rank as a true negative; a false positive is a failure, not a warning.
- Reduced-motion / performance proof present: motion never overrides it, even with strong corpus similarity.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: two mode dirs, Systems: foundations + motion + seam |
| Risk | 22/25 | Averaging leak, false-positive motion, authority-order violations |
| Research | 15/20 | Semantics settled by 003; contract shapes still to prove |
| Multi-Agent | 8/15 | Two parallel mode workstreams |
| Coordination | 12/15 | Depends on 004 + 007 + 008 |
| **Total** | **77/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Token averaging leaks into foundations compatibility | H | M | Typed edges only; reject averaging/interpolation/co-presence |
| R-002 | Motion ranks static similarity as intent | H | M | Restraint gate before retrieval; gate + target decide no-motion |
| R-003 | Corpus overrides accessibility / reduced-motion proof | H | L | Fixed authority order keeps corpus reference-only |
| R-004 | Phase 007 seam shifts under this work | M | M | Consume the seam contract; flag drift to the parent phase |

---

## 11. USER STORIES

### US-001: Relationship-aware token foundations (Priority: P0)

**As a** design-foundations consumer, **I want** typed compatibility edges over the token corpus, **so that** I see which tokens genuinely work together or conflict rather than an averaged blend.

**Acceptance Criteria**:
1. Given a token set, When foundations builds compatibility, Then it emits typed edges and a transformation ledger and never averaged tokens.

---

### US-002: Restraint-first motion eligibility (Priority: P1)

**As a** design-motion consumer, **I want** a "should this move at all?" gate before retrieval, **so that** static similarity never fabricates motion where restraint is correct.

**Acceptance Criteria**:
1. Given a target, When motion runs, Then the restraint gate resolves first and hard negatives never surface as false-positive motion.

---

## 12. OPEN QUESTIONS

- How much of the Phase 008 proof envelope transfers unchanged to relationship-heavy modes versus needing mode-specific fields?
- Does the foundations transformation ledger need its own schema, or can it extend the shared provenance fields from the seam?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research source**: `../003-global-modes-utilization/research/lineages/sol/research.md` (Phase C)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
