---
title: "Feature Specification: native invocability planning"
description: "Initial planning phase for parent-skill native invocability. Captures the original research-first framing, candidate mechanisms, and gated task structure before the mechanism decision moved into phase 002."
trigger_phrases:
  - "parent skill invocability plan"
  - "skill discovery extensibility probe"
  - "parent mode mechanism research"
  - "native invocation phased plan"
  - "runtime skill resolution research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/001-native-invocability-planning"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Initial planning docs live in the first child phase."
    next_safe_action: "Use 002 for the accepted mechanism and 003 for deep-loop alignment."
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "restructure-155-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Initial planning is preserved as phase 001."
      - "The accepted mechanism lives in phase 002."
      - "Deep-loop alignment lives in phase 003."
---
# Feature Specification: native invocability planning

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

This phase preserves the initial planning and option-framing record for parent-skill native invocability. The accepted mechanism is not owned here: phase 002 records the Option E invokable-hub decision, and phase 003 records deep-loop alignment against that decision.

**Key Decisions**: Keep the original planning packet as phase 001; use phase 002 for the accepted mechanism; use phase 003 for deep-loop alignment.

**Critical Dependencies**: Parent phase map, phase 002 mechanism decision, and phase 003 deep-loop closure record.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Predecessor** | N/A |
| **Successor** | `../002-invocability-mechanism/spec.md` |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete planning record |
| **Created** | 2026-06-30 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Parent skills can route operator requests to nested mode packets, but the nested packets are not independently invocable by the runtime `Skill` tool. This phase preserves the original planning and option-framing record for that gap.

### Purpose
Keep the initial planning artifacts available as the first child phase while the parent root stays lean and later phases own the mechanism and alignment state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Original research-first planning for parent-skill native invocability.
- Candidate mechanism framing and gated task structure.
- Historical support artifacts under `research/` and `review/`.

### Out of Scope
- Final mechanism acceptance; see `../002-invocability-mechanism/decision-record.md`.
- Deep-loop family alignment; see `../003-deep-loop-alignment/spec.md`.
- Parent-level phase coordination; see `../spec.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-native-invocability-planning/` | Move/retain | Working docs and historical support artifacts for the initial planning phase |
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md` | Update | Lean parent phase map and root purpose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the original planning packet as a child phase | Planning docs and support artifacts live under `001-native-invocability-planning/` |
| REQ-002 | Keep the parent root lean | Parent root carries only `spec.md`, `description.json`, and `graph-metadata.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Preserve continuity to later phases | This phase links forward to phases 002 and 003 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The initial planning docs are accessible from the first child phase.
- **SC-002**: The phase can be validated independently as a Level 3 child packet.
- **SC-003**: Later phases remain the authoritative source for accepted mechanism and implementation-alignment state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 mechanism decision | Without it, phase 001 is only an initial plan | Link directly to phase 002 as successor |
| Dependency | Phase 003 deep-loop alignment | Without it, downstream closure evidence is missing | Link directly to phase 003 from scope and related docs |
| Risk | Historical planning docs can read stale against later decisions | Medium | Keep this phase clearly scoped as the initial planning record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance requirement; this phase is documentation structure only.

### Security
- **NFR-S01**: No permission-contract decision is made in this phase; phase 003 owns the deep-loop allowed-tools conclusion.

### Reliability
- **NFR-R01**: The phase must remain reachable through the parent map and graph metadata.

---

## 8. EDGE CASES

### Data Boundaries
- Historical research and review artifacts may include old paths; they are preserved as evidence, not rewritten as current-state docs.

### Error Scenarios
- If validation treats historical support artifacts as current docs, validate the child packet scope and keep canonical state in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Documentation relocation and phase linkage |
| Risk | 8/25 | Main risk is stale historical wording |
| Research | 6/20 | No new research; existing artifacts preserved |
| Multi-Agent | 0/15 | No multi-agent execution required |
| Coordination | 10/15 | Must align with parent and phases 002/003 |
| **Total** | **34/100** | **Level 3 retained for packet consistency** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A reader treats phase 001 as the current mechanism source | M | M | State that phase 002 owns the accepted mechanism |
| R-002 | Parent root accumulates working docs again | M | L | Keep root success criteria limited to lean parent files |

---

## 11. USER STORIES

### US-001: Maintainer finds the initial plan (Priority: P1)

**As a** maintainer, **I want** the initial invocability planning docs in phase 001, **so that** the parent root stays lean without losing historical context.

**Acceptance Criteria**:
1. Given the phase parent, When I open `001-native-invocability-planning/`, Then I can find the initial plan, tasks, decision record, checklist, summary, and support artifacts.

---

### US-002: Maintainer follows current state forward (Priority: P1)

**As a** maintainer, **I want** phase 001 to link to phases 002 and 003, **so that** I do not mistake planning history for the accepted mechanism or alignment closeout.

**Acceptance Criteria**:
1. Given phase 001, When I need current mechanism state, Then the spec points me to `../002-invocability-mechanism/decision-record.md`.
2. Given phase 001, When I need deep-loop alignment state, Then the spec points me to `../003-deep-loop-alignment/spec.md`.

---

## 12. OPEN QUESTIONS

- No blocking open questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Phase Map**: See `../spec.md`
- **Mechanism Decision**: See `../002-invocability-mechanism/decision-record.md`
- **Deep-loop Alignment**: See `../003-deep-loop-alignment/spec.md`
