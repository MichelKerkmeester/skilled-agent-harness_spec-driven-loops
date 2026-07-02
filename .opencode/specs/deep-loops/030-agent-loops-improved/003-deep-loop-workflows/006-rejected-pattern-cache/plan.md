---
title: "Implementation Plan: Rejected-Pattern Cache for Research State"
description: "Documents the completed rejected idea event cache and bounded suppression index work."
trigger_phrases:
  - "rejected pattern cache"
  - "ideaRejected event deep research"
  - "pattern suppression bounded index"
  - "rejected ideas loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/003-deep-loop-workflows/006-rejected-pattern-cache"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rejected-Pattern Cache for Research State

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-research JSONL protocol docs, reducer JavaScript, YAML workflow |
| **Framework** | `deep-loop-workflows` research event-sourced reducer |
| **Storage** | JSONL `ideaRejected`, `ideaRejectedRemoved`, and `ideaRejectedReset` events |
| **Testing** | Candidate suppression checks, bounded-index checks, remove/reset lifecycle checks |

### Overview
This completed work added a durable rejected-pattern cache to prevent previously rejected ideas from re-entering next-focus, recovery, or ideas candidates. The reducer derives a bounded active index from JSONL events and supports explicit remove and reset operations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rejected ideas were confirmed to lack durable suppression.
- [x] Scope is limited to idea-level suppression, with backlog promotion left to leaf 007.
- [x] Bounded index behavior and reversibility are specified.

### Definition of Done
- [x] JSONL protocol documents `ideaRejected`, `ideaRejectedRemoved`, and `ideaRejectedReset`.
- [x] Reducer derives a bounded rejected index with max 100 entries.
- [x] Exact and fuzzy/category-guarded checks run before candidate selection.
- [x] Overflow evicts the oldest entry and logs a warning.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Event-sourced suppression index: durable JSONL events are reduced into an active bounded cache that candidate generation consults before surfacing ideas.

### Key Components
- **`state_jsonl.md`**: Defines rejected-pattern event types.
- **`loop_protocol.md`**: Documents rejected-cache lifecycle and overflow behavior.
- **`reduce-state.cjs`**: Builds the active rejected index and applies exact/fuzzy checks.
- **`deep_research_auto.yaml`**: Adds the rejected-cache check before candidate selection.

### Data Flow
Rejected events enter JSONL, the reducer builds the active index up to `MAX_REJECTED_PATTERNS=100`, and candidate generation checks that index before proposing next-focus, recovery, or idea candidates. Remove and reset events update the active index without editing historical events.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| JSONL protocol | Defines durable events | Add rejected-cache lifecycle events | Event docs include add/remove/reset |
| Reducer | Derives active state from events | Build bounded rejected index | Index never exceeds 100 entries |
| Candidate generation | Selects next focus and ideas | Check exact and fuzzy rejected patterns | Rejected candidate is absent |
| Workflow YAML | Orders candidate checks | Run rejected-cache check before selection | YAML step precedes selection |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and isolate rejected-pattern scope from idea backlog work.
- [x] Identify JSONL protocol, loop protocol, reducer, and YAML workflow surfaces.
- [x] Capture bounded-index and reversibility requirements.

### Phase 2: Core Implementation
- [x] Add rejected-cache event types to `state_jsonl.md`.
- [x] Document lifecycle and overflow policy in `loop_protocol.md`.
- [x] Derive a bounded rejected index in `reduce-state.cjs`.
- [x] Add exact plus fuzzy/category-guarded candidate checks.
- [x] Add remove and reset event handling.
- [x] Add rejected-cache workflow step before candidate selection.

### Phase 3: Verification
- [x] Verify a rejected pattern is absent from later candidates.
- [x] Verify the active rejected index never exceeds 100 entries.
- [x] Verify `ideaRejectedRemoved` re-admits a pattern on the next reduce step.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Event reduction | Add/remove/reset rejected events | Reducer fixture |
| Candidate suppression | Exact and fuzzy rejected matches | Candidate-generation fixture |
| Bound enforcement | More than 100 rejected entries | Reducer overflow fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| No hard predecessor | Internal | Complete | Rejected-pattern cache can run independently |
| `007-ideas-backlog-lifecycle` | Successor | Complete | `idea_rejected` lifecycle should integrate with this index |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Candidate generation suppresses valid ideas, remove/reset fails, or index overflow removes active suppressions incorrectly.
- **Procedure**: Revert event docs, reducer cache derivation, and YAML check ordering, then disable rejected-pattern suppression while retaining historical JSONL records for diagnosis.
<!-- /ANCHOR:rollback -->
