---
title: "Implementation Plan: Ideas-Backlog Threshold and Rejection Lifecycle"
description: "Documents the completed idea observation, promotion, and rejection lifecycle work for deep research."
trigger_phrases:
  - "ideas backlog lifecycle"
  - "idea_observed idea_promoted"
  - "minIdeaObservations threshold"
  - "idea promotion deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/007-ideas-backlog-lifecycle"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/agents/deep-research.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Ideas-Backlog Threshold and Rejection Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-research protocol docs, reducer JavaScript, YAML workflow, agent markdown |
| **Framework** | Event-sourced idea lifecycle in `deep-loop-workflows` research mode |
| **Storage** | JSONL idea events and reducer-ranked promoted ideas |
| **Testing** | Observation-threshold reducer checks and leaf-agent event constraints |

### Overview
This completed work added a threshold-gated lifecycle for ideas observed across deep-research iterations. Leaf agents emit observations only, the reducer owns promotion after `minIdeaObservations`, and durable rejection integrates with the rejected-pattern cache from leaf 006.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rejected-pattern cache from leaf 006 is available for suppression integration.
- [x] Idea promotion authority is assigned to the reducer, not leaf agents.
- [x] Expensive full LLM consolidation remains out of scope.

### Definition of Done
- [x] `idea_observed`, `idea_promoted`, and `idea_rejected` events are documented.
- [x] `minIdeaObservations` config defaults to 2 with bounded range.
- [x] Reducer promotes ideas only after threshold is met.
- [x] Leaf agents emit `idea_observed` only.
- [x] Rejected ideas stay suppressed from promoted lists and next-focus candidates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reducer-owned lifecycle: leaf agents produce observations, the event stream persists them, and the reducer promotes or suppresses ideas based on configured thresholds.

### Key Components
- **`loop_protocol.md`**: Documents idea lifecycle semantics and threshold behavior.
- **`state_jsonl.md`**: Defines idea event types.
- **`deep_research_auto.yaml`**: Adds idea-lifecycle tracking to workflow order.
- **`deep-research.md` agent**: Constrains leaves to observation-only events.
- **`reduce-state.cjs`**: Accumulates observations, promotes after threshold, and ranks promoted ideas.

### Data Flow
Leaf agents emit `idea_observed` records, the reducer counts observations per idea ID, and once count meets `minIdeaObservations`, the reducer emits or records `idea_promoted`. `idea_rejected` removes the idea from promoted lists and next-focus candidates through the leaf 006 suppression index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| JSONL protocol | Defines research events | Add idea lifecycle events | Event docs include observed/promoted/rejected |
| Reducer | Owns ranking and promotion | Promote after configured threshold | Two observations promote on next reduce |
| Leaf agent | Emits iteration findings | Limit to `idea_observed` | No direct `idea_promoted` emission |
| Workflow YAML | Orders lifecycle checks | Add lifecycle tracking step | YAML includes idea lifecycle step |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture idea lifecycle requirements.
- [x] Confirm leaf 006 rejected-cache integration point.
- [x] Identify protocol, JSONL, YAML, agent, and reducer surfaces.

### Phase 2: Core Implementation
- [x] Add idea lifecycle events to `state_jsonl.md`.
- [x] Document lifecycle and `minIdeaObservations` in `loop_protocol.md`.
- [x] Add `minIdeaObservations` config field with default 2.
- [x] Update reducer to count observations and own promotion ranking.
- [x] Update leaf agent instructions to emit observations only.
- [x] Add workflow tracking step to `deep_research_auto.yaml`.

### Phase 3: Verification
- [x] Verify two observations of the same idea trigger reducer-owned promotion.
- [x] Verify leaf agent output does not emit direct `idea_promoted`.
- [x] Verify `idea_rejected` suppresses promoted and next-focus candidates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reducer threshold | `count >= minIdeaObservations` promotion | Reducer fixture |
| Agent contract | Leaf emits observation only | Agent instruction/lint check |
| Rejection integration | Rejected idea stays suppressed | Reducer and candidate fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006-rejected-pattern-cache` | Internal predecessor | Complete | `idea_rejected` suppression should feed the rejected-pattern index |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reducer promotion ranks ideas incorrectly, leaf agents emit prohibited promotion events, or rejected ideas reappear.
- **Procedure**: Revert idea lifecycle event docs, reducer promotion changes, YAML step, and leaf-agent instruction updates, then retain rejected-pattern suppression as the only durable idea-control path.
<!-- /ANCHOR:rollback -->
