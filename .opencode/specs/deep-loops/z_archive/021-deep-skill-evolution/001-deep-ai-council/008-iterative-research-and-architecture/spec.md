---
title: "Feature Specification: Deep AI Council Research + Architecture Design"
description: "Completed architecture research for deep-ai-council iterative multi-topic mode: runtime boundary, 3-level state hierarchy, verdict-delta convergence, cost guards, registry parity."
trigger_phrases:
  - "deep ai council architecture"
  - "council architecture research"
  - "deep-ai-council 001"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "129/001 architecture research complete, 5 ADRs authored, 002-006 scaffolded"
    next_safe_action: "dispatch F1 -- 129/002 runtime primitive extraction"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js"
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md"
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000002"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime boundary: extend deep-loop-runtime; no council-runtime peer."
      - "State hierarchy: session -> topic -> round."
      - "Convergence: adjudicator-verdict stability deltas."
      - "Cost guards: 3 rounds/topic, 5 topics/session, threshold 0.2."
---

# Feature Specification: Deep AI Council Research + Architecture Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 001 is complete. It researched the current `deep-ai-council` single-round surface, compared it with deep-review/deep-research runtime patterns, selected a hybrid runtime boundary, and produced ADR-001 through ADR-005 for phases 002-006.

**Key Decisions**: Extend `deep-loop-runtime`; use session -> topic -> round state; converge by adjudicator-verdict stability; default to 3 rounds/topic, 5 topics/session, 0.2 threshold; use `council-findings-registry.json`.

**Critical Dependencies**: phases 002-006 consume this phase's ADRs.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (129) |
| **Parent Packet** | 116-deep-skill-evolution/001-ai-council |
| **Predecessor** | n/a |
| **Successor** | `../002-runtime-primitive-extraction/` |
| **Handoff Criteria** | ADR-001..ADR-005 complete; phases 002-006 scaffolded; strict validation green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`deep-ai-council` had a current single-session, flat round artifact model. Packet 129 needs a researched architecture for iterative multi-topic council mode before implementation packets can safely modify runtime primitives, command YAML, skill docs, and runtime mirrors.

### Purpose

Record the architecture decisions for deep council mode: runtime reuse boundary, session/topic/round schema, adjudicator-verdict stability convergence, cost guard defaults, and findings registry parity with deep-review/deep-research.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research current `deep-ai-council`, `deep-loop-runtime`, `deep-review`, and `deep-research` contracts.
- Produce `research/iter-001.md` and `research/research.md`.
- Author ADR-001 through ADR-005.
- Scaffold phases 002-006.
- Update 001 continuity to complete.

### Out of Scope

- Runtime implementation in `deep-ai-council` or `deep-loop-runtime`.
- Command YAML creation.
- Runtime mirror edits.
- Packet 115 or 130 modifications.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/iter-001.md` | Create | Evidence-backed architecture findings. |
| `research/research.md` | Create | 10-section synthesis. |
| `decision-record.md` | Replace | ADR-001..ADR-005. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Update | Completed phase docs and continuity. |
| `../002-*` through `../006-*` | Create | Downstream phase scaffolds. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime-boundary ADR | ADR-001 recommends extend `deep-loop-runtime` and rejects peer `council-runtime`. |
| REQ-002 | Schema ADR | ADR-002 defines session -> topic -> round JSON and artifact hierarchy. |
| REQ-003 | Convergence ADR | ADR-003 defines verdict-delta formula and termination conditions. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cost-guard ADR | ADR-004 records defaults and tunability. |
| REQ-005 | Registry parity ADR | ADR-005 records fingerprint/content-hash contract. |
| REQ-006 | Downstream scaffolds | 002-006 contain required spec docs and metadata. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/iter-001.md` has at least 10 file:line-cited findings.
- **SC-002**: `research/research.md` has all 10 requested synthesis sections.
- **SC-003**: `decision-record.md` contains ADR-001..ADR-005.
- **SC-004**: Phase 002-006 scaffolds exist and strict-validate.
- **SC-005**: No stale pre-rename skill references remain in packet 129.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep-loop-runtime` accepts third consumer | Medium | ADR-001 narrows scope to infrastructure primitives. |
| Risk | Threshold semantics leak across siblings | High | ADR-003 and ADR-004 keep council defaults distinct. |
| Risk | Runtime mirrors still use `ai-council` agent identity | Medium | Phase 005 owns mirror/alias decision. |
| Risk | Registry naming overlap confuses operators | Medium | ADR-005 uses `council-findings-registry.json`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability

- **NFR-T01**: ADRs cite file:line evidence.
- **NFR-T02**: Downstream phase scopes reference ADR-001..ADR-005.

### Scope Control

- **NFR-S01**: No source code outside packet 129 is modified in this phase.
- **NFR-S02**: Packet 130 remains read-only context.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Single topic, single round should degrade to current council behavior.
- Topic with no findings still writes an empty registry and allows later topics.
- Max rounds reached with unresolved disagreement emits `convergence:false`.
- Four runtime mirrors may retain `ai-council` as an alias only if phase 005 documents the alias explicitly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None for phase 001. Phase 005 must decide agent mirror rename vs alias strategy.
<!-- /ANCHOR:questions -->

---

## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Multi-phase architecture packet |
| Risk | 14/25 | Runtime boundary and convergence semantics |
| Research | 18/20 | Evidence-backed ADRs |
| Multi-Agent | 6/15 | Council architecture only |
| Coordination | 8/15 | Feeds five downstream phases |
| **Total** | **62/100** | **Level 3** |

---

## 11. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime boundary bleeds council semantics into review/research | H | M | ADR-001 isolates council domain logic. |
| R-002 | Convergence thresholds confused across siblings | H | M | ADR-003/004 document distinct semantics. |
| R-003 | Mirror rename creates alias drift | M | M | Phase 005 owns four-runtime sync. |

---

## 12. USER STORIES

### US-001: Phase 002 Implementer Has Runtime Boundary

**As a** phase 002 implementer, **I want** ADR-001 to define what belongs in `deep-loop-runtime`, **so that** I can extend primitives without creating a duplicate runtime package.

**Acceptance Criteria**:
1. Given ADR-001, When 002 starts, Then it can enumerate shared primitives and rejected alternatives.

### US-002: Phase 006 Author Has Parity Contract

**As a** phase 006 implementer, **I want** ADR-005 and packet 130 invariants referenced, **so that** parity tests protect deep-skill boundaries.

**Acceptance Criteria**:
1. Given ADR-005 and packet 130 section 6, When tests are written, Then routing and registry parity have explicit fixtures.

---

## OPEN QUESTIONS

- Phase 005 must decide whether runtime agent files are renamed to `deep-ai-council` or retain `ai-council` as a documented alias.

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research Iteration**: `research/iter-001.md`
- **Research Synthesis**: `research/research.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
<!-- /ANCHOR:related-docs -->
