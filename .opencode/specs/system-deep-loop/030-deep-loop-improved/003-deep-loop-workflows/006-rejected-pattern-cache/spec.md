---
title: "Rejected-Pattern Cache for Research State"
description: "The deep-research loop has no memory of rejected ideas across iterations; each iteration can re-surface patterns that were already explicitly rejected, wasting slots and polluting the convergence signal. A durable bounded ideaRejected event index with exact and fuzzy checks is needed."
trigger_phrases:
  - "rejected pattern cache"
  - "ideaRejected event deep research"
  - "pattern suppression bounded index"
  - "rejected ideas loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/006-rejected-pattern-cache"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 13)"
    next_safe_action: "Add ideaRejected event to state_jsonl.md and wire reducer-derived index"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md"
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
# Rejected-Pattern Cache for Research State

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
| **Phase** | 6 of 12 |
| **Predecessor** | 005-anchor-ownership-conflict-adr |
| **Successor** | 007-ideas-backlog-lifecycle |
| **Handoff Criteria** | `ideaRejected` event in JSONL; bounded rejected index (max 100) derived by reducer; exact + fuzzy/category-guarded check before next-focus candidates; reversible via remove/reset event |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the deep-loop-workflows recommendations.

**Scope Boundary**: Rejected-pattern cache for idea-level suppression. Ideas-backlog threshold and lifecycle belongs to 007.

**Dependencies**:
- No hard predecessors for this leaf; can run independently of 005

**Deliverables**:
- `ideaRejected`, `ideaRejectedRemoved`, `ideaRejectedReset` event types in `state_jsonl.md` and `loop_protocol.md`
- Reducer-derived bounded rejected index (max `MAX_REJECTED_PATTERNS=100`) in `reduce-state.cjs`
- Exact + fuzzy/category-guarded check before next-focus/recovery/ideas candidate generation
- Overflow policy: oldest entry evicted when limit exceeded (logged as warning)
- `deep_research_auto.yaml` step for rejected-cache check before candidate selection

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research loop has no memory of rejected ideas across iterations; a pattern that was explicitly surfaced and rejected can re-emerge in the very next iteration's next-focus candidates, wasting an iteration slot and polluting the convergence signal. There is no durable suppression mechanism, no bounded index, and no reversible remove/reset path.

### Purpose
Add a durable bounded `ideaRejected` event JSONL index checked (exact + fuzzy/category-guarded) before any next-focus/recovery/ideas candidate is selected; rejected patterns are reversible via explicit `ideaRejectedRemoved` or `ideaRejectedReset` events.

> **Reference evidence**: `external/kasper/src/types.ts:185` (rejected-cache type definition); `external/kasper/src/state.ts:502-510,994-997` (rejected-set derivation from events); `external/kasper/src/constants.ts:17` (`MAX_REJECTED_PATTERNS=100`). Research.md §5.2 + (iter 13).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `ideaRejected`, `ideaRejectedRemoved`, `ideaRejectedReset` event types added to `state_jsonl.md` protocol
- `loop_protocol.md` updated with rejected-cache lifecycle documentation and overflow policy
- `reduce-state.cjs`: reducer derives rejected index from events; bounded at `MAX_REJECTED_PATTERNS=100`; overflow evicts oldest with a logged warning
- Rejected-cache check (exact + fuzzy/category-guarded) before next-focus, recovery, and ideas candidate generation
- Reversible: `ideaRejectedRemoved` removes a single entry; `ideaRejectedReset` clears the full index
- `deep_research_auto.yaml` step for rejected-cache check before candidate selection

### Out of Scope
- Ideas-backlog threshold and lifecycle (`idea_observed`/`idea_promoted`) — belongs to 007
- Full LLM consolidation of similar ideas (too expensive; out of scope)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md` | Modify | Add `ideaRejected`, `ideaRejectedRemoved`, `ideaRejectedReset` event types |
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Modify | Document rejected-cache lifecycle and bounded index overflow policy |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Derive bounded rejected index; exact + fuzzy check before candidates |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add rejected-cache check step before next-focus/recovery/ideas candidate selection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `ideaRejected` event recorded in JSONL; reducer derives bounded rejected index (max 100); exact check runs before any next-focus/recovery/ideas candidate | A candidate matching a rejected pattern is absent from the next iteration's candidates; rejected index does not exceed 100 entries at any time |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fuzzy/category-guarded check runs before candidates with configurable similarity threshold; `ideaRejectedRemoved` event removes the entry from the active rejected index | A fuzzy-match above threshold is blocked from candidacy; after `ideaRejectedRemoved`, that pattern can reappear as a candidate in the next iteration |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A pattern marked with `ideaRejected` does not appear in next-focus candidates in subsequent iterations; rejected index does not exceed 100 entries (overflow evicts oldest with a logged warning)
- **SC-002**: An `ideaRejectedRemoved` event removes the entry from the active rejected index; on the next reduce step, that pattern is re-admitted as a candidate
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fuzzy category guard can false-positive on superficially similar but distinct patterns | Med | Make similarity threshold configurable (`rejectedPatternFuzzyThreshold`, default 0.85); category guard is required alongside score |
| Risk | Bounded overflow (evicting oldest) could silently un-suppress a still-relevant rejected pattern | Low | Log a warning on each overflow eviction; operator can re-reject the pattern if it re-surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the right default similarity threshold for the fuzzy match (0.8, 0.85, 0.9)? Should it be per-category or a single global config value?
- Should the rejected-cache check run before or after the observation-threshold guard from the convergence layer?
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
