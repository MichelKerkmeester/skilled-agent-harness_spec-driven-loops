---
title: "Ideas-Backlog Threshold and Rejection Lifecycle"
description: "The deep-research loop has no structured lifecycle for ideas that emerge across iterations; ideas surface, get ignored, and re-emerge with no promotion or durable suppression mechanism. A three-part lifecycle (idea_observed, idea_promoted, idea_rejected) with reducer-owned ranking is needed."
trigger_phrases:
  - "ideas backlog lifecycle"
  - "idea_observed idea_promoted"
  - "minIdeaObservations threshold"
  - "idea promotion deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/007-ideas-backlog-lifecycle"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 31)"
    next_safe_action: "Add idea_observed/idea_promoted/idea_rejected events and minIdeaObservations config field"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Ideas-Backlog Threshold and Rejection Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 12 |
| **Predecessor** | 006-rejected-pattern-cache |
| **Successor** | 008-code-graph-coverage-bridge |
| **Handoff Criteria** | `idea_observed`/`idea_promoted`/`idea_rejected` events in JSONL; `minIdeaObservations` config field; reducer owns ranking of promoted ideas; leaf agents emit observations only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the deep-loop-workflows recommendations.

**Scope Boundary**: Structured lifecycle for ideas at the observation/promotion/rejection level. The rejected-pattern cache (index of suppressed patterns) belongs to 006; the reducer-rollup variant is a future deep-rewrite.

**Dependencies**:
- 006-rejected-pattern-cache should be complete first so `idea_rejected` events integrate with the existing rejected-pattern index without conflicts

**Deliverables**:
- `idea_observed`, `idea_promoted`, `idea_rejected` event types in `state_jsonl.md` and `loop_protocol.md`
- `minIdeaObservations` config field (default 2) in `deep_research_config.json`
- Reducer rollup: promotes when `count >= minIdeaObservations`; reducer owns ranking; leaf agents emit observations only
- `deep_research_auto.yaml` step for idea lifecycle tracking
- `deep-research.md` agent: updated to emit `idea_observed` only (no direct `idea_promoted`)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research loop has no threshold-gated idea promotion; ideas surface in one iteration and disappear in the next without any canonical lifecycle record. There is no `minIdeaObservations` config field, no reducer-owned promotion ranking, and no durable lifecycle separating "seen once" from "consistently observed". Leaf agents can promote their own ideas directly, bypassing the reducer's ranking authority.

### Purpose
Implement a three-part idea lifecycle where leaf agents emit `idea_observed` events, the reducer promotes to `idea_promoted` after `count >= minIdeaObservations`, and durable `idea_rejected` events supply suppression; the reducer owns ranking of promoted ideas, and leaf agents are prohibited from emitting `idea_promoted` directly.

> **Reference evidence**: `external/kasper/src/handlers.ts:419-429` (idea-observation threshold gate); `external/kasper/src/evaluate.ts:1659-1682` (promote-after-N-observations model); `external/kasper/src/utils.ts:94-105` (observation count utilities). Research.md §5.2 + (iter 31).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `idea_observed`, `idea_promoted`, `idea_rejected` event types in `state_jsonl.md` and `loop_protocol.md`
- `minIdeaObservations` config field (default 2, range 1–10) in `deep_research_config.json`
- `reduce-state.cjs`: accumulates `idea_observed` events per idea ID; emits `idea_promoted` when `count >= minIdeaObservations`; reducer owns ranking
- Leaf agents (`deep-research.md`) updated to emit only `idea_observed` (not `idea_promoted`)
- `deep_research_auto.yaml` updated with an idea-lifecycle step

### Out of Scope
- Full LLM consolidation of similar ideas — too expensive; out of scope
- Reducer-rollup variant (the more complex streaming reducer) — rated as deep-rewrite; separate follow-up

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Modify | Document three-part idea lifecycle and `minIdeaObservations` semantics |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md` | Modify | Add `idea_observed`, `idea_promoted`, `idea_rejected` event types |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add idea-lifecycle tracking step |
| `.opencode/agents/deep-research.md` | Modify | Constrain leaf to `idea_observed` only; remove any `idea_promoted` emission |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Accumulate observations per idea ID; promote after `minIdeaObservations`; own ranking |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `idea_observed` emitted by leaf agents; `idea_promoted` emitted by reducer when `count >= minIdeaObservations` (default 2); reducer owns ranking; leaf agents do not emit `idea_promoted` directly | An idea observed twice across iterations appears in the promoted ideas list in the reducer's output on the third reduce step; leaf agent does not emit `idea_promoted` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `idea_rejected` is a durable suppression event; it integrates with the rejected-pattern cache index from 006 so that a rejected idea is also absent from next-focus candidates | After `idea_rejected`, the idea does not reappear in either the promoted ideas list or the next-focus candidates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An idea observed twice across iterations (two `idea_observed` events with the same ID) causes the reducer to emit `idea_promoted` on the next reduce step and include it in the ranked promoted ideas list
- **SC-002**: An `idea_rejected` event durably suppresses the idea from the promoted ideas list and from next-focus candidates in all subsequent reduce steps until an explicit reset
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reducer rollup could be expensive if many observations accumulate; bounded by `MAX_REJECTED_PATTERNS` policy from 006 | Med | Reducer operates on event deltas, not full scans; bounded idea-observation window (configurable) |
| Risk | Leaf agents generating `idea_promoted` directly would bypass the reducer's ranking authority | Med | Validate in `deep_research_auto.yaml` step; lint `deep-research.md` agent for prohibited event types |
| Dependency | 006-rejected-pattern-cache should be complete so `idea_rejected` events integrate with the existing index | Low | Can run in parallel; integration is additive (006's index checks for `idea_rejected` events by event type) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `minIdeaObservations` be global or per-idea-category (e.g., a lower threshold for high-signal categories)?
- Should promoted ideas be surfaced in the dashboard in a dedicated `## IDEAS` section alongside the `## TREND` sparkline?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
