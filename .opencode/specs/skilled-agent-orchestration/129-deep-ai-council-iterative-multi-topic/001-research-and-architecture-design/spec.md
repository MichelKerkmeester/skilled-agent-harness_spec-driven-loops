---
title: "Feature Specification: Deep AI Council Research + Architecture Design"
description: "Research-driven architecture design for deep-ai-council: schemas, convergence semantics, deep-loop-runtime reuse boundary, cost-guard defaults, migration path. Output: architecture ADRs guiding phases 002-006."
trigger_phrases:
  - "deep ai council architecture"
  - "council architecture research"
  - "deep-ai-council 001"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold 001 research-and-architecture-design phase child"
    next_safe_action: "Run /spec_kit:deep-research or sk-ai-council deliberation on this folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-ai-council/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/commands/spec_kit/deep-research.md"
      - ".opencode/commands/spec_kit/deep-review.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Extend deep-loop-runtime in place OR ship council-runtime peer skill that depends on it?"
      - "Findings registry schema — share with deep-review's directly or specialize?"
      - "Cost-guard defaults: max_rounds_per_topic, max_topics_per_session, saturation threshold."
    answered_questions: []
---

# Feature Specification: Deep AI Council Research + Architecture Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Design the deep-ai-council architecture via 10-iter deep-research + AI Council deliberation. Output: ADRs for runtime-reuse boundary, schema, convergence semantics, cost guards, migration path. Feeds phases 002-006 of packet 129.

**Key Decisions**: extract council-runtime peer vs extend deep-loop-runtime; share findings registry vs specialize; per-topic vs per-session convergence.

**Critical Dependencies**: packet 124 HYBRID verdict (re-deliberation trigger met); deep-loop-runtime primitives stable.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (129) |
| **Parent Packet** | 129-deep-ai-council-iterative-multi-topic |
| **Predecessor** | n/a (first phase) |
| **Successor** | 002-extract-or-extend-runtime-primitives |
| **Handoff Criteria** | ≥ 4 ADRs recorded; phase 002 entry criteria specified (which primitives extracted, which extended) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-ai-council architecture is undefined: do we extract a new `council-runtime` peer (analogous to `deep-loop-runtime`), or extend deep-loop-runtime in place? How does the findings registry schema relate to deep-review's? What does "convergence" mean for opinion-shaped artifacts (council reports) rather than evidence-shaped artifacts (review findings)? Cost-guard defaults are unset. Phases 002-006 cannot start without these decisions.

### Purpose
Run a deep-research audit + optional AI Council deliberation to produce architecture ADRs covering: runtime boundary, registry schema, convergence semantics, cost guards, migration path from single-round to deep mode. Each ADR has concrete file-path scope + parity-test contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research deep-loop-runtime + sk-ai-council current contracts; identify reuse vs extend boundary.
- Design schemas: `council-config.json`, `topic-config.json`, `round-state.jsonl`, `findings-registry.json`, `session-state.jsonl`.
- Convergence semantics: per-topic stability scoring (Round-N→N+1 verdict-delta), session-level saturation across topics.
- Cost-guard defaults: `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, `seat_dispatch_timeout`.
- Migration path: how operators on single-round sk-ai-council move to deep mode (mode suffix `:deep`, default still single-round).
- Output: 4-6 ADRs in `decision-record.md`.

### Out of Scope
- Implementing runtime primitives (phase 002).
- Writing orchestration code (phase 003).
- Writing command/skill wiring (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | deep-research iteration output |
| `decision-record.md` | Create | 4-6 architecture ADRs |
| `implementation-summary.md` | Create | completion record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime-boundary ADR | `decision-record.md` records "extract council-runtime" OR "extend deep-loop-runtime" with rationale + file-list of touched modules |
| REQ-002 | Schema ADRs | `decision-record.md` records ≥ 1 ADR with JSON schema sketches for session/topic/round/findings registry |
| REQ-003 | Convergence-semantics ADR | `decision-record.md` records per-topic + session-level convergence rules with threshold defaults |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cost-guard defaults ADR | `decision-record.md` records `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold` defaults |
| REQ-005 | Migration-path ADR | `decision-record.md` records single-round → deep-mode operator migration story |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ≥ 4 ADRs in `decision-record.md`, each citing file:line evidence from sk-ai-council or deep-loop-runtime.
- **SC-002**: Phase 002 entry criteria explicit: file list, primitives to consume, test contracts to satisfy.
- **SC-003**: Strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling packet 130 may produce conflicting recommendations | Med | Defer differentiation-shape ADR to phase 005 if 130 still mid-run; capture as open question here |
| Risk | Architecture over-engineered (4-6 schemas + 2 runtimes) | Med | "Smallest viable runtime extension" framing; mark anything ambitious as "follow-on packet" not in 129 scope |
| Risk | Convergence semantics under-specified for opinion-shaped artifacts | High | Borrow deep-review's "novelty rate" framing; adapt by treating verdict-deltas as the novel signal instead of new findings |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: deep-research iters complete in ≤ 25 min each (cli-devin SWE-1.6 typical).

### Reliability
- **NFR-R01**: ADRs cite file:line evidence; no hallucinated module names.

---

## 8. EDGE CASES

### Data Boundaries
- Single-topic session with 1 round → deep mode degrades to current single-round mode (no breakage).
- Topic 1 finds zero findings → still emits empty registry; doesn't block topic 2.

### Error Scenarios
- Adjudicator can't score Round-N stability (e.g. seats wildly diverge) → fall through to convergence by max-rounds.
- Seat dispatch timeout → adjudicator notes incomplete round in convergence calc.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multi-runtime, multi-schema |
| Risk | 15/25 | Architecture-level decisions inform 5 downstream phases |
| Research | 18/20 | deep-research target |
| Multi-Agent | 8/15 | Single-iter dispatch |
| Coordination | 8/15 | Parent agent + 1 dispatch executor |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Schema gold-plates | M | M | Keep schemas as JSON Schema sketches, not full TS types |
| R-002 | Picks wrong runtime boundary, requires re-work in phase 002 | H | M | Phase 002 begins with a checkpoint review; can re-open this ADR |

---

## 11. USER STORIES

### US-001: Phase 002 author has clear runtime contract (Priority: P0)

**As a** phase 002 implementer, **I want** a precise list of which primitives to import/extend and which to author fresh, **so that** I can write code without re-debating boundary.

**Acceptance Criteria**:
1. Given the ADRs, When phase 002 starts, Then it has a Files-to-Change table that maps directly to ADR decisions.

---

## 12. OPEN QUESTIONS

- Should council-runtime live under `.opencode/skills/council-runtime/` (new peer) OR `.opencode/skills/deep-loop-runtime/lib/council/` (extension)?
- Convergence: continuous stability score (e.g. 0.0-1.0) or discrete (verdict same/changed)?
- Findings registry: per-session OR per-spec-folder lifetime?

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Implementation Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
